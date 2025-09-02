package com.atns.atns.recommendation.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RecommendedEventDto {
    private Integer eventId;
    private String eventName;
    private String category;
    private String location;
    private LocalDateTime startTime;
    private double score;
}
