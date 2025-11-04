package com.atns.atns.controller;

import com.atns.atns.recommendation.RecommendationService;
import com.atns.atns.recommendation.dto.RecommendedEventDto;
import com.atns.atns.recommendation.dto.RecommendedUserDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/v1/recommendations")
@RequiredArgsConstructor
public class RecommendationController {

    private final RecommendationService recommendationService;

    @GetMapping("/events/{profileId}")
    public ResponseEntity<List<RecommendedEventDto>> getRecommendedEvents(@PathVariable Integer profileId,
                                                                          @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching recommended events for profile id {}, limit={}", profileId, limit);
        List<RecommendedEventDto> recommendations = recommendationService.recommendEvents(profileId, limit);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore()) // optional, no caching
                .body(recommendations);
    }

    @GetMapping("/users/{profileId}")
    public ResponseEntity<List<RecommendedUserDto>> getRecommendedUsers(
            @PathVariable Integer profileId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching recommended users for profileId={}, limit={}", profileId, limit);
        List<RecommendedUserDto> recommendations = recommendationService.recommendUsers(profileId, limit);
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .body(recommendations);
    }
}
