package com.atns.atns.service.impl;

import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.dto.event.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import com.atns.atns.entity.Profile;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.service.EventService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final ProfileRepo profileRepo;

    @Override
    public Event createEvent(EventRequestDto eventRequestDto, Integer organizerProfileId) {
        // Validate Event is in future
        if (eventRequestDto.getStartTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Event must be in future");
        }

        // Validate Start Date is before End Date
        if (eventRequestDto.getEndTime() != null && eventRequestDto.getEndTime().isBefore(eventRequestDto.getStartTime())) {
            throw new IllegalArgumentException("Start time must be before end time");
        }

        // Fetch Profile by organizerProfileId
        Profile organizer = profileRepo.findById(organizerProfileId)
                .orElseThrow(() -> new ResourceNotFoundException("Organizer not found"));


    }

    @Override
    public EventResponseDto updateEvent(EventUpdateRequestDto eventUpdateRequestDto, Integer eventId) {
        return null;
    }

    @Override
    public EventResponseDto changeEventStatus(Integer eventId, boolean isActive) {
        return null;
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
}
