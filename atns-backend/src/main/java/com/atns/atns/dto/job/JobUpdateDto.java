package com.atns.atns.dto.job;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.Set;

@Data
public class JobUpdateDto {

    @Size(max = 200, message = "Job title cannot exceed 200 characters")
    private String title;

    private String description;

    @Size(max = 200, message = "Company name cannot exceed 200 characters")
    private String companyName;

    @Size(max = 100, message = "Location cannot exceed 100 characters")
    private String location;

    private Set<@Size(max = 50, message = "Skill name cannot exceed 50 characters") String> skills;

    @Future(message = "Expiration date must be in the future")
    private LocalDateTime expiresAt;
}