package com.atns.atns.service;

import com.atns.atns.dto.EventRequestDto;
import com.atns.atns.dto.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {
    Event createEvent(EventRequestDto eventRequestDto, Integer organizerProfileId);
    Event updateEvent(EventUpdateRequestDto eventUpdateRequestDto, Integer eventId);
    Void cancelEvent(Integer eventId);
    void reactivateEvent(Integer eventId);
    Page<Event> getAllEvents(Pageable pageable);
}
