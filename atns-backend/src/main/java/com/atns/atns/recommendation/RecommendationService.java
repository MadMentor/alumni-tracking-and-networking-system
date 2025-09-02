package com.atns.atns.recommendation;

import com.atns.atns.recommendation.dto.RecommendedEventDto;
import com.atns.atns.recommendation.dto.RecommendedUserDto;

import java.util.List;

public interface RecommendationService {
    List<RecommendedEventDto> recommendEvents(Integer profileId, int limit);
    List<RecommendedUserDto> recommendUsers(Integer profileId, int limit);
}
