package com.atns.atns.dto.follow;

import com.atns.atns.dto.ProfileDto;
import lombok.Builder;

import java.time.Instant;

@Builder
public record FollowResponseDto(
        Integer followId,
        Instant createdAt,
        ProfileDto targetProfile
) {
}
