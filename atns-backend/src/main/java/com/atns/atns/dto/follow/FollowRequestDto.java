package com.atns.atns.dto.follow;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

@Builder
public record FollowRequestDto(
        @NotNull(message = "Target profile Id cannot be null")
        @Min(value = 1, message = "Target profile Id must be positive") Integer targetProfileId) {

}
