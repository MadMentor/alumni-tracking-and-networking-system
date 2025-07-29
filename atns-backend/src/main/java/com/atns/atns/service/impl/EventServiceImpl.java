package com.atns.atns.service.impl;

import com.atns.atns.constants.EventConstants;
import com.atns.atns.converter.EventConverter;
import com.atns.atns.converter.EventLocationConverter;
import com.atns.atns.converter.EventResponseConverter;
import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.dto.event.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import com.atns.atns.entity.Profile;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.exception.UnauthorizedOperationException;
import com.atns.atns.repo.EventRepo;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.service.EventService;
import com.atns.atns.utils.ValidationUtils;
import io.micrometer.common.util.StringUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

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
        log.info("Creating new event for organizer profile ID: {}", organizerProfileId);

        // Validate Event Times
        validateEventTimes(eventRequestDto.getStartTime(), eventRequestDto.getEndTime());

        // Fetch Profile by organizerProfileId
        Profile organizer = profileRepo.findById(organizerProfileId)
                .orElseThrow(() -> {
                    log.error("Organizer not found with ID: {}", organizerProfileId);
                    return new ResourceNotFoundException("Organizer", organizerProfileId);
                });

        // Convert DTo to entity and set organizer
        Event event = eventConverter.toEntity(eventRequestDto);
        event.setOrganizer(organizer);
        event.setActive(true);

        log.debug("Saving new event: {}", event);
        Event savedEvent = eventRepo.save(event);
        log.info("Successfully created event with ID: {}", savedEvent.getId());

        return savedEvent;
    }

    @Override
    @Transactional
    public EventResponseDto updateEvent(EventUpdateRequestDto eventUpdateRequestDto, Integer eventId) {
        log.info("Updating event with ID: {}", eventId);

        // Fetch existing event
        Event existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

        // Handle field updates
        updateIfPresent(eventUpdateRequestDto, existingEvent);

        // Validate and update times
        handleTimeUpdates(eventUpdateRequestDto, existingEvent);

        // Update organizer if provided
        Optional.ofNullable(eventUpdateRequestDto.getOrganizerProfileId())
                .ifPresent(profileId -> {
                    Profile profile = profileRepo.findById(profileId)
                            .orElseThrow(() -> new ResourceNotFoundException("Profile", profileId));
                    existingEvent.setOrganizer(profile);
                });

        Event updatedEvent = eventRepo.save(existingEvent);
        log.info("Successfully updated event with ID: {}", updatedEvent.getId());

        return eventResponseConverter.toDto(updatedEvent);
    }

    private void updateIfPresent(EventUpdateRequestDto eventUpdateRequestDto, Event event) {
        log.debug("Updating event fields if present in request");

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
    @Transactional
    public EventResponseDto changeEventStatus(Integer eventId, boolean isActive) {
        log.info("Changing status of event ID; {} to {}", eventId, isActive ? "active" : "inactive");

        Event existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> {
                    eventNotFoundLog(eventId);
                    return new ResourceNotFoundException("Event", eventId);
                });

        existingEvent.setActive(isActive);

        Event updatedEvent = eventRepo.save(existingEvent);
        log.info("Successfully updated status for event ID: {}", updatedEvent.getId());

        return eventResponseConverter.toDto(updatedEvent);
    }

    @Override
    @Transactional
    public void deleteEvent(Integer eventId, Integer organizerId) {
        log.info("Attempting to delete event with ID: {}", eventId);

        // Verify Existence
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> {
                    eventNotFoundLog(eventId);
                    return new ResourceNotFoundException("Event", eventId);
                });

        // Verify the organizer id
        if (!event.getOrganizer().getId().equals(organizerId)) {
            throw new UnauthorizedOperationException("Not authorized to delete this event");
        }

        // Verify is the event has already started or not
        if (event.getStartTime().isBefore(LocalDateTime.now())) {
            log.error("Attempt to delete already started event with ID: {}", event.getId());
            throw new IllegalStateException("Cannot delete already started events");
        }

        // Perform deletion
        eventRepo.delete(event);
        log.info("Successfully deleted event with Id: {}, Deleted by: {}", eventId, event.getOrganizer());
    }

    @Override
    public EventResponseDto getEventById(Integer eventId) {
        log.debug("Fetching event with ID: {}", eventId);

        // Verify Existence
        Event event = eventRepo.findById(eventId)
                .orElseThrow(() -> {
                    eventNotFoundLog(eventId);
                    return new ResourceNotFoundException("Event", eventId);
                });

        // Return the event
        log.debug("Successfully fetched event with ID: {}", eventId);
        return eventResponseConverter.toDto(event);
    }

    @Override
    public Page<Event> getAllEvents(Pageable pageable) {
        log.debug("Fetching all events with pagination: {}", pageable);

        ValidationUtils.validatePageable(pageable, EventConstants.ALLOWED_SORT_FIELDS);

        Page<Event> events = eventRepo.findAll(pageable);

        // Returning all events
        log.debug("Retrieved {} all events", events.getTotalElements());
        return events;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventResponseDto> getEventsByOrganizer(Integer organizerProfileId, Pageable pageable) {
        log.debug("Fetching events for organizer ID: {}", organizerProfileId);

        // Validate input
        if (organizerProfileId == null) {
            log.warn("Null organizer profile ID");
            return Page.empty();
        }

        ValidationUtils.validatePageable(pageable, EventConstants.ALLOWED_SORT_FIELDS);

        // Verify organizers existence
        if (profileRepo.existsById(organizerProfileId)) {
            log.error("Organizer profile not found with ID: {}", organizerProfileId);
            throw new ResourceNotFoundException("Organizer", organizerProfileId);
        }

        // Fetch and return paginated events
        Page<EventResponseDto> events = eventRepo.findEventsByOrganizerProfileId(organizerProfileId, pageable)
                .map(eventResponseConverter::toDto);
        log.debug("Retrieved {} events for organizer ID: {}", events.getNumberOfElements(), organizerProfileId);
        return events;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<EventResponseDto> getUpcomingEvent(Pageable pageable) {
        log.debug("Fetching upcoming events");

        ValidationUtils.validatePageable(pageable, EventConstants.ALLOWED_SORT_FIELDS);

        Page<EventResponseDto> events =  eventRepo.findUpcomingEvent(LocalDateTime.now(ZoneId.of("UTC")), pageable)
                .map(eventResponseConverter::toDto);
        log.debug("Retrieved {} upcoming events", events.getNumberOfElements());
        return events;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EventResponseDto> searchEvents(String keyword) {
        log.debug("Searching events with keyword: {}", keyword);

        // Validate input
        if (StringUtils.isBlank(keyword)) {
            log.debug("Empty search keyword provided, returning empty list");
            return Collections.emptyList();
        }
        String searchTerm = "%" + keyword.toLowerCase() + "%";

        // Search across multiple fields
        List<Event> events = eventRepo.findBySearchTerm(searchTerm);
        log.debug("Found {} events matching search term: {}", events.size(), searchTerm);

        // Convert to DTOs and return
        return events.stream()
                .map(eventResponseConverter::toDto)
                .collect(Collectors.toList());
    }

    /**
     * Validates event timing constraints
     * @param startTime the event start time
     * @param endTime the event end time
     * @throws IllegalArgumentException if timing constraints are violated
     */
    public void validateEventTimes(LocalDateTime startTime, LocalDateTime endTime) {
        if (startTime == null || endTime == null) {
            log.error("Event times cannot be null");
            throw new IllegalArgumentException("Event times cannot be null");
        }

        // Validate Event is in future
        if (startTime.isBefore(LocalDateTime.now())) {
            log.error("Event start time {} is in the past", startTime);
            throw new IllegalArgumentException("Event must be in future");
        }

        // Validate Start Date is before End Date
        if (endTime.isBefore(startTime)) {
            log.error("Event end time {} is before start time {}", endTime, startTime);
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }

    private void eventNotFoundLog(int eventId) {
        log.error("Event not found with ID: {}", eventId);
    }

}
