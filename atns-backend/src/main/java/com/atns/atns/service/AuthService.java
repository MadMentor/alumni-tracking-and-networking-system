package com.atns.atns.service;

import com.atns.atns.dto.login.LoginRequestDto;
import com.atns.atns.dto.login.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.dto.register.RegisterCompleteRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public interface AuthService {
    LoginResponseDto login(LoginRequestDto loginRequestDto);
    LoginResponseDto register(RegisterRequestDto registerRequestDto);
    LoginResponseDto registerComplete(RegisterCompleteRequest request);
}
