package com.atns.atns.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ChangePasswordRequest {
    @NotBlank(message = "Old Password is mandatory")
    private String oldPassword;

    @NotBlank(message = "New Password is mandatory")
    private String newPassword;
}
