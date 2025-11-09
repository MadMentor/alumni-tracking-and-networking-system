package com.atns.atns.service.impl;

import com.atns.atns.entity.Otp;
import com.atns.atns.enums.OtpType;
import com.atns.atns.repo.OtpRepo;
import com.atns.atns.service.OtpService;
import com.atns.atns.service.EmailService;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.TimeUnit;


@Slf4j
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OtpService {
    private final OtpRepo otpRepo;
    private final EmailService emailService;

    private final Cache<String, Boolean> verifiedEmailCache =
            Caffeine.newBuilder()
                    .expireAfterWrite(15, TimeUnit.MINUTES)
                    .maximumSize(1000)
                    .build();

    @Value("${OTP_EXPIRY_MINUTES}")
    private int otpExpiryMinutes;

    @Override
    @Transactional
    public String generateOtp(String email, OtpType type) {
        try {
            log.info("Generating OTP for: {} - Type: {}", email, type);

            String code = String.format("%06d", new Random().nextInt(999999));
            log.info("Generated OTP code: {}", code);

            // Alternative approach: Find and update individual records
            List<Otp> previousOtps = otpRepo.findByEmailAndTypeAndUsedFalse(email, type);
            log.info("Found {} previous unused OTPS to invalidate", previousOtps.size());

            if (!previousOtps.isEmpty()) {
                for (Otp previousOtp : previousOtps) {
                    previousOtp.setUsed(true);
                    otpRepo.save(previousOtp);
                }
                log.info("Successfully invalidated {} previous OTPS", previousOtps.size());
            }

            // Create new OTP
            Otp otp = Otp.builder()
                    .email(email)
                    .code(code)
                    .type(type)
                    .expiresAt(LocalDateTime.now().plusMinutes(otpExpiryMinutes))
                    .used(false)
                    .build();

            log.info("Saving new OTP to database");
            Otp savedOtp = otpRepo.save(otp);
            log.info("OTP saved successfully with ID: {}", savedOtp.getId());

            log.info("Generated OTP for {} ({}): {}", email, type, code);
            return code;

        } catch (Exception e) {
            log.error("Failed to generate OTP for {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to generate OTP: " + e.getMessage(), e);
        }
    }

    @Override
    public Boolean verifyOtp(String email, String code, OtpType type) {
        Optional<Otp> findOtp = otpRepo.findValidOtp(email, code, type, LocalDateTime.now());

        if (findOtp.isPresent()) {
            Otp otp = findOtp.get();
            otp.setUsed(true);
            otpRepo.save(otp);
            log.info("OTP verified successfully for {} ({})", email, type);
            return true;
        }

        log.warn("Invalid OTP attempt for {} ({}): {}", email, type, code);
        return false;
    }

    @Override
    public void sendOtp(String email, OtpType type) {
        try {
            log.info("Starting OTP generation for: {} - Type: {}", email, type);

            String code = generateOtp(email, type);
            log.info("OTP generated for {}: {}", email, code);

            log.info("Sending OTP email to: {}", email);
            emailService.sendOtpEmail(email, code, type);

            log.info("OTP sent successfully to: {}", email);

        } catch (Exception e) {
            log.error("Failed to send OTP to {}: {}", email, e.getMessage(), e);
            throw new RuntimeException("Failed to send verification code: " + e.getMessage());
        }
    }

    @Override
    public boolean isOtpValid(String email, OtpType type) {
        // Check if there's any valid OTP for this email and type
        return otpRepo.existsByEmailAndCodeAndTypeAndUsedFalseAndExpiresAtAfter(email, "", type, LocalDateTime.now());
    }

    @Override
    public void markEmailAsVerified(String email) {
        verifiedEmailCache.put(email, true);
        log.info("Email marked as verified: {}", email);
    }

    @Override
    public boolean isEmailVerified(String email) {
        Boolean isVerified = verifiedEmailCache.getIfPresent(email);
        boolean verified = isVerified != null && isVerified;

        if (verified) {
            log.debug("Email verified status: {} - VERIFIED", email);
        } else {
            log.debug("Email verified status: {} - NOT VERIFIED", email);
        }

        return verified;
    }

    @Override
    public void cleanupEmailVerification(String email) {
        verifiedEmailCache.invalidate(email);
        log.debug("Email verification cleaned up for: {}", email);
    }
}
