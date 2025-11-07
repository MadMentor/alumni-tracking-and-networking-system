package com.atns.atns.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendedUserDto {
    private Integer profileId;
    private String firstName;
    private String lastName;
    private String faculty;
    private Set<String> skills;
    private Double score;
    private String profileImageUrl;
    private String currentPosition;
}
