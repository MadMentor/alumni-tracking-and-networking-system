package com.atns.atns.controller;

import com.atns.atns.annotation.AuditLog;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.exception.UnauthorizedOperationException;
import com.atns.atns.service.FollowService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

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

        try {
            followService.followProfile(profileId, targetId);
            log.info("Successfully followed target id: {}", targetId);

            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            log.error("Follow failed - profile not found: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalStateException ex) {
            log.warn("Follow validation failed: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (UnauthorizedOperationException ex) {
            log.error("Follow failed - unauthorized operation: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, ex.getMessage());
        }
    }

    @DeleteMapping("/{targetId}")
    @Transactional
    @AuditLog(action = "UNFOLLOW_PROFILE")
    public ResponseEntity<Void> unfollowProfile(@PathVariable @Min(1) Integer profileId,
                                                @PathVariable @Min(1) Integer targetId) {
        log.info("Profile {} attempting to unfollow profile {}", profileId, targetId);

        try {
            followService.unfollowProfile(profileId, targetId);
            log.info("Successfully unfollowed target id: {}", targetId);

            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            log.error("Unfollow failed - profile not found: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalStateException ex) {
            log.warn("Unfollow validation failed: {}", ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (UnauthorizedOperationException ex) {
            log.warn("Unauthorized {} attempt: {}", action, ex.getMessage());
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, ex.getMessage());
        }
    }
}
