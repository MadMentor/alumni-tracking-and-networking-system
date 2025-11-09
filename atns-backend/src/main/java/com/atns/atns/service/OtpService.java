package com.atns.atns.service;

import com.atns.atns.enums.OtpType;

public interface OtpService {
    String generateOtp(String email, OtpType type);
    Boolean verifyOtp(String email, String code, OtpType type);
    void sendOtp(String email, OtpType type);
    boolean isOtpValid(String email, OtpType type);

    void markEmailAsVerified(String email);
    boolean isEmailVerified(String email);
    void cleanupEmailVerification(String email);
}
