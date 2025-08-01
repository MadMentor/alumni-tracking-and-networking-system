package com.atns.atns.controller;

import com.atns.atns.annotation.AuditLog;
import com.atns.atns.dto.ProfileDto;
import com.atns.atns.service.FollowService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/profiles/{profileId}/follows")
public class FollowController {
    private final FollowService followService;

    @PostMapping("/{targetId}")
    @Transactional
    @AuditLog(action = "FOLLOW_PROFILE")
    public ResponseEntity<Void> followProfile(@PathVariable @Min(1) Integer profileId,
                                              @PathVariable @Min(1) Integer targetId) {
        log.info("Profile {} attempting to follow profile {}", profileId, targetId);

        followService.followProfile(profileId, targetId);
        log.info("Successfully followed target id: {}", targetId);

        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{targetId}")
    @Transactional
    @AuditLog(action = "UNFOLLOW_PROFILE")
    public ResponseEntity<Void> unfollowProfile(@PathVariable @Min(1) Integer profileId,
                                                @PathVariable @Min(1) Integer targetId) {
        log.info("Profile {} attempting to unfollow profile {}", profileId, targetId);

        followService.unfollowProfile(profileId, targetId);
        log.info("Successfully unfollowed target id: {}", targetId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/followers")
    @Transactional(readOnly = true)
    @AuditLog(action = "FETCH_FOLLOWERS")
    public ResponseEntity<Page<ProfileDto>> getFollowers(@PathVariable @Min(1) Integer profileId,
                                                         @PageableDefault(sort = "createdAt", direction =
                                                                 Sort.Direction.ASC) Pageable pageable) {
        log.info("Retrieve request of followers by profile Id {}", profileId);

        Page<ProfileDto> followers = followService.getFollowers(profileId, pageable);
        log.info("Successfully retrieved {} followers", followers.getNumberOfElements());

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(followers.getTotalElements()))
                .body(followers);
    }

    @GetMapping("/following")
    @Transactional(readOnly = true)
    @AuditLog(action = "FETCH_FOLLOWING")
    public ResponseEntity<Page<ProfileDto>> getFollowing(@PathVariable @Min(1) Integer profileId,
                                                         @PageableDefault(sort = "createdAt", direction = Sort.Direction.ASC) Pageable pageable) {
        log.debug("Fetching following list for profile ID: {}", profileId);

        Page<ProfileDto> following = followService.getFollowing(profileId, pageable);
        log.info("Successfully retrieved {} following", following.getNumberOfElements());

        return ResponseEntity.ok()
                .header("X-Total-Count", String.valueOf(following.getTotalElements()))
                .body(following);
    }

    @GetMapping("/followers/count")
    @Transactional(readOnly = true)
    @AuditLog(action = "COUNT_FOLLOWERS")
    public ResponseEntity<Long> getFollowerCount(@PathVariable @Min(1) Integer profileId) {
        log.debug("Fetching follower count for profile ID: {}", profileId);

        return ResponseEntity.ok(followService.getFollowersCount(profileId));
    }
}
