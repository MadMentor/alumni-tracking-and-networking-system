package com.atns.atns.service;

import com.atns.atns.dto.LoginRequestDto;
import com.atns.atns.dto.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;

public interface AuthService {
    LoginResponseDto login(LoginRequestDto loginRequestDto);
    LoginResponseDto register(RegisterRequestDto registerRequestDto);
}
