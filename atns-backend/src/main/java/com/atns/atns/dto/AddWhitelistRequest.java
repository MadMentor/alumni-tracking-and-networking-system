package com.atns.atns.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// DTO for adding to whitelist
@Data
public class AddWhitelistRequest {
    @NotBlank(message = "Email is required")
    @Email(message = "Invalid email format")
    private String email;

    @NotBlank(message = "Role is required")
    private String role; // ROLE_STUDENT, ROLE_ALUMNI, etc.
}
