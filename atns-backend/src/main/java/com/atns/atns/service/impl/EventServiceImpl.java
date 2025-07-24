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
        validateEvent(eventRequestDto.getStartTime(), eventRequestDto.getEndTime());

        // Fetch Profile by organizerProfileId
        Profile organizer = profileRepo.findById(organizerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found" + organizerProfileId));

        Event event = eventConverter.toEntity(eventRequestDto);
        event.setOrganizer(organizer);
        event.setActive(true);

        return eventRepo.save(event);
    }

    @Override
    public EventResponseDto updateEvent(EventUpdateRequestDto eventUpdateRequestDto, Integer eventId) {
        Event existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found" + eventId));

        //validateEvent(eventUpdateRequestDto.getStartTime(), eventUpdateRequestDto.getEndTime());

        if (eventUpdateRequestDto.getEventName() != null) {
            existingEvent.setEventName(eventUpdateRequestDto.getEventName());
        }

        if (eventUpdateRequestDto.getEventDescription() != null) {
            existingEvent.setEventDescription(eventUpdateRequestDto.getEventDescription());
        }

        if (eventUpdateRequestDto.getCategory() != null) {
            existingEvent.setCategory(eventUpdateRequestDto.getCategory());
        }

        if (eventUpdateRequestDto.getLocation() != null) {
            existingEvent.setLocation(eventLocationConverter.toEntity(eventUpdateRequestDto.getLocation()));
        }

        if (eventUpdateRequestDto.getStartTime() != null) {
            if (eventUpdateRequestDto.getEndTime() == null) {
                isStartBeforeEndTime(eventUpdateRequestDto.getStartTime(), existingEvent.getEndTime());
                existingEvent.setStartTime(eventUpdateRequestDto.getStartTime());
            } else {
                isStartBeforeEndTime(eventUpdateRequestDto.getStartTime(), eventUpdateRequestDto.getEndTime());
                existingEvent.setEndTime(eventUpdateRequestDto.getEndTime());
            }
        }

        if (eventUpdateRequestDto.getEndTime() != null) {
            isStartBeforeEndTime(existingEvent.getStartTime(), eventUpdateRequestDto.getEndTime());
            existingEvent.setEndTime(eventUpdateRequestDto.getEndTime());
        }

        if (eventUpdateRequestDto.getOrganizerProfileId() != null) {
            existingEvent.setOrganizer(profileRepo.findById(eventUpdateRequestDto.getOrganizerProfileId())
                    .orElseThrow(() -> new ResourceNotFoundException("Organizer with profile id {} not found" + eventUpdateRequestDto.getOrganizerProfileId())));
        }

        if (eventUpdateRequestDto.getActive() != null) {
            existingEvent.setActive(eventUpdateRequestDto.getActive());
        }

        return eventResponseConverter.toDto(eventRepo.save(existingEvent));
    }

    private void updateIfPresent(EventUpdateRequestDto eventUpdateRequestDto, Event event) {
        Optional.ofNullable(eventUpdateRequestDto.getEventName()).ifPresent(event::setEventName);
    }

    @Override
    public EventResponseDto changeEventStatus(Integer eventId, boolean isActive) {
        Event existingEvent = eventRepo.findById(eventId)
                .orElseThrow(() -> new ResourceNotFoundException("Event not found" + eventId));

        existingEvent.setActive(isActive);
        return eventResponseConverter.toDto(eventRepo.save(existingEvent));
    }

    @Override
    public void deleteEvent(Integer eventId) {

    }

    @Override
    public EventResponseDto getEventById(Integer eventId) {
        return null;
    }

    @Override
    public Page<Event> getAllEvents(Pageable pageable) {
        return null;
    }

    @Override
    public List<EventResponseDto> getEventsByOrganizer(Integer organizerProfileId) {
        return List.of();
    }

    @Override
    public List<EventResponseDto> getUpcomingEvent() {
        return List.of();
    }

    @Override
    public List<EventResponseDto> searchEvents(String keyword) {
        return List.of();
    }

    private void validateEvent(LocalDateTime startTime, LocalDateTime endTime) {
        // Validate Event is in future
        if (startTime.isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Event must be in future");
        }
    }

    // Validate Start Date is before End Date
    private void isStartBeforeEndTime(LocalDateTime startTime, LocalDateTime endTime) {
        if (endTime != null && endTime.isBefore(startTime)) {
            throw new IllegalArgumentException("Start time must be before end time");
        }
    }
}
