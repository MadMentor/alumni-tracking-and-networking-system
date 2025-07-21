package com.atns.atns.dto;

import com.atns.atns.entity.EventLocation;
import com.atns.atns.entity.Profile;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EventRequestDto {
    @NotBlank(message = "Event title is required")
    private String eventName;

    private String eventDescription;

    private EventLocationDto eventLocation;

    @FutureOrPresent(message = "Start time must be in future")
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    private String category;

    @NotBlank(message = "Organization Profile Id is mandatory")
    private Integer organizerProfileId;
}
