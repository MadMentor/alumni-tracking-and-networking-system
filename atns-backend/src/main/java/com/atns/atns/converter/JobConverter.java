package com.atns.atns.converter;

import com.atns.atns.dto.job.JobRequestDto;
import com.atns.atns.dto.job.JobResponseDto;
import com.atns.atns.dto.job.JobUpdateDto;
import com.atns.atns.entity.Job;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.Skill;
import com.atns.atns.recommendation.dto.RecommendedJobDto;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
public class JobConverter {

    // Convert Request DTO to Entity
    public Job toEntity(JobRequestDto dto, Profile postedBy) {
        if (dto == null) {
            return null;
        }

        return Job.builder()
                .title(dto.getTitle())
                .description(dto.getDescription())
                .companyName(dto.getCompanyName())
                .location(dto.getLocation())
                .expiresAt(dto.getExpiresAt())
                .postedBy(postedBy)
                .build();
    }

    // Convert Entity to Response DTO
    public JobResponseDto toResponseDto(Job job) {
        if (job == null) {
            return null;
        }

        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .skills(extractSkillNames(job.getRequiredSkills()))
                .postedAt(job.getPostedAt())
                .expiresAt(job.getExpiresAt())
                .build();
    }

    // Convert Entity to RecommendedJob DTO
    public RecommendedJobDto toRecommendedJobDto(Job job, double similarityScore) {
        if (job == null) {
            return null;
        }

        return RecommendedJobDto.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .requiredSkills(extractSkillNames(job.getRequiredSkills()))
                .similarityScore(similarityScore)
                .build();
    }

    // Update existing Entity from Update DTO
    public void updateEntityFromDto(JobUpdateDto updateDto, Job job) {
        if (updateDto == null || job == null) {
            return;
        }

        if (updateDto.getTitle() != null && !updateDto.getTitle().isBlank()) {
            job.setTitle(updateDto.getTitle());
        }
        if (updateDto.getDescription() != null) {
            job.setDescription(updateDto.getDescription());
        }
        if (updateDto.getCompanyName() != null && !updateDto.getCompanyName().isBlank()) {
            job.setCompanyName(updateDto.getCompanyName());
        }
        if (updateDto.getLocation() != null) {
            job.setLocation(updateDto.getLocation());
        }
        if (updateDto.getExpiresAt() != null) {
            job.setExpiresAt(updateDto.getExpiresAt());
        }
    }

    // Convert to simplified response (for lists)
    public JobResponseDto toSimpleResponseDto(Job job) {
        if (job == null) {
            return null;
        }

        return JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .postedAt(job.getPostedAt())
                .build();
    }

    // Convert with detailed poster information including full name
    public JobResponseDto toDetailedResponseDto(Job job) {
        if (job == null) {
            return null;
        }

        JobResponseDto.JobResponseDtoBuilder builder = JobResponseDto.builder()
                .id(job.getId())
                .title(job.getTitle())
                .description(job.getDescription())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .skills(extractSkillNames(job.getRequiredSkills()))
                .postedAt(job.getPostedAt())
                .expiresAt(job.getExpiresAt());

        // Add poster information with full name
        if (job.getPostedBy() != null) {
            builder.postedById(job.getPostedBy().getId());
            builder.postedByName(formatFullName(job.getPostedBy()));
        }

        return builder.build();
    }

    // Format full name from firstName, middleName, lastName
    private String formatFullName(Profile profile) {
        if (profile == null) {
            return "Unknown";
        }

        StringBuilder fullName = new StringBuilder();

        if (profile.getFirstName() != null && !profile.getFirstName().isBlank()) {
            fullName.append(profile.getFirstName());
        }

        if (profile.getMiddleName() != null && !profile.getMiddleName().isBlank()) {
            if (!fullName.isEmpty()) {
                fullName.append(" ");
            }
            fullName.append(profile.getMiddleName());
        }

        if (profile.getLastName() != null && !profile.getLastName().isBlank()) {
            if (!fullName.isEmpty()) {
                fullName.append(" ");
            }
            fullName.append(profile.getLastName());
        }

        return !fullName.isEmpty() ? fullName.toString() : "Unknown";
    }

    // Helper method to extract skill names
    private Set<String> extractSkillNames(Set<Skill> skills) {
        if (skills == null) {
            return Set.of();
        }

        return skills.stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());
    }

    // Validation and sanitization
    public JobRequestDto sanitizeJobRequest(JobRequestDto dto) {
        if (dto == null) {
            return null;
        }

        return JobRequestDto.builder()
                .title(sanitizeString(dto.getTitle()))
                .description(sanitizeString(dto.getDescription()))
                .companyName(sanitizeString(dto.getCompanyName()))
                .location(sanitizeString(dto.getLocation()))
                .skills(sanitizeSkills(dto.getSkills()))
                .expiresAt(dto.getExpiresAt())
                .build();
    }

    private String sanitizeString(String input) {
        if (input == null) {
            return null;
        }
        return input.trim();
    }

    private Set<String> sanitizeSkills(Set<String> skills) {
        if (skills == null) {
            return Set.of();
        }
        return skills.stream()
                .map(this::sanitizeString)
                .filter(skill -> skill != null && !skill.isBlank())
                .collect(Collectors.toSet());
    }
}