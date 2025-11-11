package com.atns.atns.dto.job;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Builder
public class JobResponseDto {
    private Integer id;
    private String title;
    private String description;
    private String companyName;
    private String location;

    @Builder.Default
    private Set<String> skills = new HashSet<>();

    private LocalDateTime postedAt;
    private LocalDateTime expiresAt;

    private Integer postedById;
    private String postedByName;

    private boolean active;
    private String timeSincePosted;

    public boolean isActive() {
        return expiresAt == null || LocalDateTime.now().isBefore(expiresAt);
    }
}

