package com.atns.atns.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ForgotPasswordVerifyRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Verification code is required")
    private String code;

    @NotBlank(message = "New password is required")
    private String newPassword;
}
