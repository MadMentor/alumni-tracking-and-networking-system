package com.atns.atns.dto.register;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterCompleteRequest {
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Username is required")
    private String username;

    @NotBlank(message = "Password is required")
    private String password;
}
