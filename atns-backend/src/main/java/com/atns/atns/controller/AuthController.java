package com.atns.atns.controller;

import com.atns.atns.dto.LoginRequestDto;
import com.atns.atns.dto.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public LoginResponseDto login(@RequestBody @Valid LoginRequestDto loginRequestDto) {
        log.info("Login request: {}", loginRequestDto);
        return authService.login(loginRequestDto);
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponseDto> registerUser(@RequestBody @Valid RegisterRequestDto registerRequestDto) {
        log.info("Register request: {}", registerRequestDto);
        return ResponseEntity.ok(authService.register(registerRequestDto));
    }
}