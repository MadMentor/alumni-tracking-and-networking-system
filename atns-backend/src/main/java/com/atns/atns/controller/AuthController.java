package com.atns.atns.controller;

import com.atns.atns.dto.login.LoginRequestDto;
import com.atns.atns.dto.login.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.exception.EmailAlreadyExistsException;
import com.atns.atns.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

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
}
