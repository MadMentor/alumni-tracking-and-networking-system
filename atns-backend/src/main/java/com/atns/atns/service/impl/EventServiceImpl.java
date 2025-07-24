package com.atns.atns.service.impl;

import com.atns.atns.converter.EventConverter;
import com.atns.atns.converter.EventLocationConverter;
import com.atns.atns.converter.EventResponseConverter;
import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.dto.event.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import com.atns.atns.entity.Profile;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.EventRepo;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final ProfileRepo profileRepo;
    private final EventConverter eventConverter;
    private final EventResponseConverter eventResponseConverter;
    private final EventRepo eventRepo;
    private final EventLocationConverter eventLocationConverter;

    @Transactional
    @Override
    public Event createEvent(EventRequestDto eventRequestDto, Integer organizerProfileId) {
        // Time Validate
        validateEventTimes(eventRequestDto.getStartTime(), eventRequestDto.getEndTime());

        // Fetch Profile by organizerProfileId
        Profile organizer = profileRepo.findById(organizerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found" + organizerProfileId));

        Event event = eventConverter.toEntity(eventRequestDto);
        event.setOrganizer(organizer);
        event.setActive(true);

        return eventRepo.save(event);
    }

    @Override
    @Transactional
    public EventResponseDto updateEvent(EventUpdateRequestDto eventUpdateRequestDto, Integer eventId) {
        Event existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found" + eventId));

        // Handle field updates
        updateIfPresent(eventUpdateRequestDto, existingEvent);

        // Validate and update times
        handleTimeUpdates(eventUpdateRequestDto, existingEvent);

        Optional.ofNullable(eventUpdateRequestDto.getOrganizerProfileId())
                .ifPresent(profileId -> {
                    Profile profile = profileRepo.findById(profileId)
                            .orElseThrow(() -> new ResourceNotFoundException("Profile not found" + profileId));
                    existingEvent.setOrganizer(profile);
                });

        return eventResponseConverter.toDto(eventRepo.save(existingEvent));
    }

    private void updateIfPresent(EventUpdateRequestDto eventUpdateRequestDto, Event event) {
        Optional.ofNullable(eventUpdateRequestDto.getEventName()).ifPresent(event::setEventName);
        Optional.ofNullable(eventUpdateRequestDto.getEventDescription()).ifPresent(event::setEventDescription);
        Optional.ofNullable(eventUpdateRequestDto.getCategory()).ifPresent(event::setCategory);
        Optional.ofNullable(eventUpdateRequestDto.getLocation())
                .map(eventLocationConverter::toEntity)
                .ifPresent(event::setLocation);
        Optional.ofNullable(eventUpdateRequestDto.getActive()).ifPresent(event::setActive);
    }

    private void handleTimeUpdates(EventUpdateRequestDto eventUpdateRequestDto, Event event) {
        if (eventUpdateRequestDto.getStartTime() != null || eventUpdateRequestDto.getEndTime() != null) {
            LocalDateTime newStartTime = Optional.ofNullable(eventUpdateRequestDto.getStartTime())
                    .orElse(event.getStartTime());
            LocalDateTime newEndTime = Optional.ofNullable(eventUpdateRequestDto.getEndTime())
                    .orElse(event.getEndTime());

            validateEventTimes(newStartTime, newEndTime);
            event.setStartTime(newStartTime);
            event.setEndTime(newEndTime);
        }
    }

    @Override
    public EventResponseDto changeEventStatus(Integer eventId, boolean isActive) {
        Event existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found" + eventId));

        existingEvent.setActive(isActive);
        return eventResponseConverter.toDto(eventRepo.save(existingEvent));
    }

    @Override
    @Transactional
    public void deleteEvent(Integer eventId) {
        // Verify Existence
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // Verify is the event has already started or not
        if (event.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Cannot delete already started events");
        }

        // Perform deletion
        log.info("Deleted event Id: {}, Deleted by: {}", eventId);
        eventRepo.delete(event);
    }

    @Override
    public EventResponseDto getEventById(Integer eventId) {
        // Verify Existence
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found with id: " + eventId));

        // Return the event
        return eventResponseConverter.toDto(event);
    }

    @Override
    public Page<Event> getAllEvents(Pageable pageable) {
        // Returning all events
        return eventRepo.findAll(pageable);
    }

    @Override
    public Page<EventResponseDto> getEventsByOrganizer(Integer organizerProfileId, Pageable pageable) {
        // Validate input
        if (organizerProfileId == null) return null;

        // Verify organizers existence
        if (!profileRepo.findById(organizerProfileId).isPresent()) {
            throw new ResourceNotFoundException("Organizer not found with Id " + organizerProfileId);
        }

        // Fetch and return paginated events
        return eventRepo.findEventsByOrganizerProfileId(organizerProfileId, pageable)
                .map(eventResponseConverter::toDto);
    }

    @Override
    public List<EventResponseDto> getUpcomingEvent() {
        return List.of();
    }

    @Override
    public List<EventResponseDto> searchEvents(String keyword) {
        return List.of();
    }

    private void validateEventTimes(LocalDateTime startTime, LocalDateTime endTime) {
        // Validate Event is in future
        if (startTime != null && startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Event must be in future");
        }

        // Validate Start Date is before End Date
        if (endTime != null && endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

}
