package com.atns.atns.service;

import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.dto.event.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EventService {
    // Create Operations
    Event createEvent(EventRequestDto eventRequestDto, Integer organizerProfileId);

    // Update Operations
    EventResponseDto updateEvent(EventUpdateRequestDto eventUpdateRequestDto, Integer eventId);
    EventResponseDto changeEventStatus(Integer eventId, boolean isActive);

    // Delete Operations
    void deleteEvent(Integer eventId, Integer organizerId);

    // Read Operations
    EventResponseDto getEventById(Integer eventId);
    Page<Event> getAllEvents(Pageable pageable);
    Page<EventResponseDto> getEventsByOrganizer(Integer organizerProfileId, Pageable pageable);
    Page<EventResponseDto> getUpcomingEvent(Pageable pageable);
    List<EventResponseDto> searchEvents(String keyword);
}
