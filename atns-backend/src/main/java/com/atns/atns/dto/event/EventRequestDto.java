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
public class EventRequestDto {
    @NotBlank(message = "Event title is required")
    @Size(max = 200)
    private String eventName;

    @Size(max = 5000)
    private String eventDescription;

    @Valid
    private EventLocationDto eventLocation;

    @FutureOrPresent(message = "Start time must be in future")
    private LocalDateTime startTime;

    private LocalDateTime endTime;

    @Size(max = 50)
    private String category;

    @NotBlank(message = "Organization Profile Id is mandatory")
    private Integer organizerProfileId;

    @NotNull
    private Boolean active;

    @AssertTrue(message = "Must provide address or online link")
    public boolean isLocationValid() {
        return eventLocation != null &&
                (eventLocation.getAddress() != null || eventLocation.getOnlineLink() != null);
    }
}
