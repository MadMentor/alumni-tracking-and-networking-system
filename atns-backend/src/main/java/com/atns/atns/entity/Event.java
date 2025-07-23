package com.atns.atns.entity;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "events", indexes = {@Index(columnList = "profile_id"), @Index(columnList = "active")})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Event name is required")
    @Size(max = 200, message = "Event name must be less than 200 characters")
    @Column(nullable = false)
    private String eventName;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String eventDescription;

    @FutureOrPresent(message = "Start time must be in present or future")
    @Column(nullable = false)
    private LocalDateTime startTime;

    @FutureOrPresent(message = "End time must be in the present or future")
    private LocalDateTime endTime;

    @Valid
    @Embedded
    private EventLocation location;

    @Size(max = 50, message = "Category must be less than 50 characters")
    private String category;

    @NotNull(message = "Organizer is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    private Profile organizer;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @Builder.Default
    @Column(nullable = false, columnDefinition = "BOOLEAN DEFAULT TRUE")
    private boolean active = true;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "organizer_profile_id")
    private Profile profile;

    @AssertTrue(message = "End time must be after start time")
    private boolean isTimeRangeValid() {
        return endTime == null || endTime.isAfter(startTime);
    }
}
