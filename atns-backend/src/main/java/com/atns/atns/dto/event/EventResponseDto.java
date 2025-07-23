package com.atns.atns.dto.event;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonInclude;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class EventResponseDto {
    @NotNull
    private Integer eventId;

    @NotBlank(message = "Event name is required")
    @Size(max = 200)
    private String eventName;

    @Size(max = 5000)
    private String eventDescription;

    @Valid
    private EventLocationDto eventLocation;

    @Size(max = 50)
    private String category;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    @NotNull
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime endTime;

    @NotNull
    private Integer organizerProfileId;

    @NotNull
    private Boolean active;

    public boolean isOngoing() {
        LocalDateTime now = LocalDateTime.now();
        return active && now.isAfter(startTime) && (endTime == null || now.isBefore(endTime));
    }
}
