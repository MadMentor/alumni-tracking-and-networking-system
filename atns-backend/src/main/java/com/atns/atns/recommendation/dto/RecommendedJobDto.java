package com.atns.atns.recommendation.dto;

import lombok.Builder;
import lombok.Data;
import java.util.Set;
import java.util.HashSet;

@Data
@Builder
public class RecommendedJobDto {
    private Integer jobId;
    private String title;
    private String companyName;
    private String location;

    @Builder.Default
    private Set<String> requiredSkills = new HashSet<>();

    private double similarityScore;
}