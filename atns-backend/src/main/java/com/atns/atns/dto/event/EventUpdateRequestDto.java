package com.atns.atns.dto.event;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventUpdateRequestDto {
    @NotNull(message = "Event ID is required")
    private Integer eventId;

    @Size(max = 200, message = "Event name must be less than 200 characters")
    private String eventName;

    @Size(max = 5000, message = "Description must be less than 5000 characters")
    private String eventDescription;

    @Future(message = "Start time must be in future")
    private LocalDateTime startTime;

    @Future(message = "End time must be in future")
    private LocalDateTime endTime;

    @Valid
    private EventLocationDto location;

    @Size(max = 50, message = "Category must be less than 50 characters")
    private String category;

    private Integer organizerProfileId;

    @Builder.Default
    private Boolean active = true;

    @AssertTrue(message = "End time must be after start time")
    private boolean isTimeRangeValid() {
        return endTime == null || endTime.isAfter(startTime);
    }
}
