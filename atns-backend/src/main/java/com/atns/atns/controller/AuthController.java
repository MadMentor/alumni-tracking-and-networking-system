package com.atns.atns.controller;

import com.atns.atns.dto.ChangeEmailVerifyRequest;
import com.atns.atns.dto.ChangePasswordRequest;
import com.atns.atns.dto.ForgotPasswordVerifyRequest;
import com.atns.atns.dto.login.LoginRequestDto;
import com.atns.atns.dto.login.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.dto.register.RegisterCompleteRequest;
import com.atns.atns.dto.register.EmailRequestDto;
import com.atns.atns.dto.register.VerifyEmailRequest;
import com.atns.atns.entity.User;
import com.atns.atns.entity.WhiteListEntry;
import com.atns.atns.enums.OtpType;
import com.atns.atns.exception.EmailAlreadyExistsException;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.repo.WhiteListRepo;
import com.atns.atns.service.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final UserService userService;
    private final UserRepo userRepo;
    private final OtpService otpService;
    private final EmailService emailService;
    private final WhiteListService whiteListService;
    private final WhiteListRepo whiteListRepo;

    @PostMapping("/login")
    @Transactional(readOnly = true)
    public LoginResponseDto login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        log.info("Login request: {}", loginRequestDto);
        return authService.login(loginRequestDto);
    }

    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody @Valid RegisterRequestDto registerRequestDto) {
        log.info("Register request: {}", registerRequestDto);
        try {
            LoginResponseDto response = authService.register(registerRequestDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (EmailAlreadyExistsException e) {
            log.warn("Registration failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.CONFLICT).cacheControl(CacheControl.noStore()).body(new ErrorResponseDto(e.getMessage()));
        }
    }

    public record ErrorResponseDto(String message, String errorCode) {
        public ErrorResponseDto(String message) {
            this(message, "EMAIL_ALREADY_EXISTS");
        }
    }

    @PostMapping("/register/init")
    public ResponseEntity<?> initRegistration(@RequestBody @Valid EmailRequestDto request) {
        try {
            log.info("Registration initiation request for email: {}", request.getEmail());

            if (!whiteListService.isEmailWhiteListed(request.getEmail())) {
                log.warn("Registration attempt with non-whitelisted email: {}", request.getEmail());
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Email is not whitelisted"));
            }
            if (userRepo.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Email already registered"));
            }

            otpService.sendOtp(request.getEmail(), OtpType.REGISTRATION);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message",
                    "Verification " + "code sent to your email", "email", request.getEmail()));
        } catch (Exception e) {
            log.error("Registration initiation failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                    "Failed to send verification " + "code"));
        }
    }

    @PostMapping("/register/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestBody @Valid VerifyEmailRequest request) {
        try {
            log.info("Email verification request for email: {}", request.getEmail());

            // Verify OTP first
            boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getCode(), OtpType.REGISTRATION);

            if (!isOtpValid) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                        "Invalid or expired " + "verification code"));
            }

            // Check again if email exists (in case of race condition)
            if (userRepo.existsByEmail(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Email already registered"));
            }

            otpService.markEmailAsVerified(request.getEmail());

            return ResponseEntity.ok(Map.of("success", true, "message", "Email verified successfully. Please complete" +
                            " your profile.", "email", request.getEmail(), "nextStep", "complete-profile" // Tells
                    // frontend
                    // to show profile form
            ));

        } catch (Exception e) {
            log.error("Email verification failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                    "Email verification failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register/complete")
    @Transactional
    public ResponseEntity<?> completeRegistration(@RequestBody @Valid RegisterCompleteRequest request) {
        try {
            log.info("Registration completion request for email: {}", request.getEmail());
            // Check if email was verified
            if (!otpService.isEmailVerified(request.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                        "Email verification required. Please verify your email first."));
            }

            // ... rest of your registration logic
            LoginResponseDto response = authService.registerComplete(request);
//            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            // Clean up after successful registration
            otpService.cleanupEmailVerification(request.getEmail());

            log.info("Changing the whitelist");
            WhiteListEntry whiteListEntry = whiteListRepo.findByEmailAndUsedFalse(request.getEmail()).orElseThrow(() -> new RuntimeException("No whitelist entry found for email: " + request.getEmail()));
            whiteListEntry.setUsed(true);
            whiteListRepo.save(whiteListEntry);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of("success", true, "message",
                    "Registration " + "successful!", "user", response));

        } catch (Exception e) {
            log.error("Registration completion failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                    "Registration failed: " + e.getMessage()));
        }
    }

    @PostMapping("/register/resend-otp")
    public ResponseEntity<?> resendOtp(@RequestBody @Valid EmailRequestDto request) {
        try {
            String email = request.getEmail().toLowerCase();

            // Check if email is still whitelisted and not registered
            if (!whiteListService.isEmailWhiteListed(email) || userService.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(Map.of(
                        "success", false,
                        "error", "Cannot resend verification code"
                ));
            }

            // Resend OTP
            otpService.sendOtp(email, OtpType.REGISTRATION);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Verification code sent to your email",
                    "email", email
            ));

        } catch (Exception e) {
            log.error("Resend OTP failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Failed to resend verification code"
            ));
        }
    }

    @PostMapping("/forgot-password/init")
    public ResponseEntity<?> initiatePasswordReset(@RequestBody @Valid EmailRequestDto request) {
        try {
            log.info("Password reset initiation request for email: {}", request.getEmail());

            // Check if email exists
            if (!userService.existsByEmail(request.getEmail())) {
                // Don't reveal that email doesn't exist for security reasons
                return ResponseEntity.ok(Map.of("success", true, "message",
                        "If the email exists, a verification code" + " has been sent"));
            }

            otpService.sendOtp(request.getEmail(), OtpType.PASSWORD_RESET);

            return ResponseEntity.ok(Map.of("success", true, "message", "If the email exists, a verification code has" +
                    " been sent", "email", request.getEmail()));
        } catch (Exception e) {
            log.error("Password reset initiation failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Failed to send verification " +
                    "code"));
        }
    }

    @PostMapping("/forgot-password/verify")
    @Transactional
    public ResponseEntity<?> verifyAndResetPassword(@RequestBody @Valid ForgotPasswordVerifyRequest request) {
        try {
            log.info("Password reset verification request for email: {}", request.getEmail());

            // Verify OTP
            boolean isOtpValid = otpService.verifyOtp(request.getEmail(), request.getCode(), OtpType.PASSWORD_RESET);

            if (!isOtpValid) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid or expired " +
                        "verification code"));
            }

            // Reset password
            userService.resetPassword(request.getEmail(), request.getNewPassword());

            return ResponseEntity.ok(Map.of("success", true, "message", "Password reset successfully"));

        } catch (Exception e) {
            log.error("Password reset verification failed for {}: {}", request.getEmail(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                    "Password reset failed: " + e.getMessage()));
        }
    }

    @PostMapping("/change-password")
    @Transactional
    public ResponseEntity<?> changePassword(@RequestBody @Valid ChangePasswordRequest request, Principal principal) {
        try {
            String email = principal.getName(); // Get current user from security context

            // Verify old password
            if (!userService.verifyCurrentPassword(email, request.getOldPassword())) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Current password is " +
                        "incorrect"));
            }

            // Change to new password
            userService.resetPassword(email, request.getNewPassword());

            User user = userRepo.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
            // Send notification email (optional)
            emailService.sendPasswordResetSuccess(email, user.getUsername());

            return ResponseEntity.ok(Map.of("success", true, "message", "Password changed successfully"));

        } catch (Exception e) {
            log.error("Password change failed for {}: {}", principal.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Password change failed"));
        }
    }

    @PostMapping("/change-email/init")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> initiateEmailChange(@RequestBody @Valid EmailRequestDto requestDto, Principal principal) {
        try {
            String currentEmail = principal.getName();
            String newEmail = requestDto.getEmail().toLowerCase();

            if (currentEmail.equals(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "New email cannot be the " +
                        "same as current email"));
            }

            if (!userService.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Email already in use"));
            }

            otpService.sendOtp(newEmail, OtpType.EMAIL_UPDATE);

            return ResponseEntity.ok(Map.of("success", true, "message", "Verification code sent to your new email " +
                    "address", "newEmail", newEmail));
        } catch (Exception e) {
            log.error("Email change initiation failed for user {}: {}", principal.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Failed to send verification " +
                    "code"));
        }
    }

    @PostMapping("/change-email/verify")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<?> verifyAndChangeEmail(@RequestBody @Valid ChangeEmailVerifyRequest request,
                                                  Principal principal) {
        try {
            String currentEmail = principal.getName();
            String newEmail = request.getNewEmail().toLowerCase();

            // Verify OTP sent to the NEW email
            boolean isOtpValid = otpService.verifyOtp(newEmail, request.getCode(), OtpType.EMAIL_UPDATE);

            if (!isOtpValid) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "Invalid or expired " +
                        "verification code"));
            }

            // Double-check if new email is still available
            if (userService.existsByEmail(newEmail)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "This email is already " +
                        "registered"));
            }

            // Update email in database
            User updatedUser = userService.updateEmail(currentEmail, newEmail);

            // Send confirmation emails
            emailService.sendEmailUpdateSuccess(newEmail, updatedUser.getUsername());
//            emailService.sendEmailUpdateSuccess(currentEmail, updatedUser.getUsername(), newEmail);

            // Generate new login response with updated email
            LoginRequestDto loginRequestDto = LoginRequestDto.builder()
                    .email(updatedUser.getEmail())
                    .password(updatedUser.getPassword())
                    .build();
            LoginResponseDto loginResponse = authService.login(loginRequestDto);

            return ResponseEntity.ok(Map.of("success", true, "message", "Email updated successfully", "user",
                    loginResponse));

        } catch (Exception e) {
            log.error("Email change verification failed for user {}: {}", principal.getName(), e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("success", false, "error",
                    "Email update failed: " + e.getMessage()));
        }
    }
}

