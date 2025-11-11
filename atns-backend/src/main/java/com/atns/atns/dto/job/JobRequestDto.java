package com.atns.atns.dto.job;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class JobRequestDto {

    @NotBlank(message = "Job title is required")
    @Size(max = 200, message = "Job title cannot exceed 200 characters")
    private String title;

    private String description;

    @NotBlank(message = "Company name is required")
    @Size(max = 200, message = "Company name cannot exceed 200 characters")
    private String companyName;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    @NotEmpty(message = "At least one skill is required")
    private Set<@NotBlank(message = "Skill name cannot be blank") String> skills = new HashSet<>();

    @Future(message = "Expiration date must be in the future")
    private LocalDateTime expiresAt;
}