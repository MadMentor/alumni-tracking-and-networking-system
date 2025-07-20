package com.atns.atns.service;

import com.atns.atns.entity.Event;
import com.sun.jdi.request.EventRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EventService {
    Event createEvent(EventRequest eventRequest, Integer organizerProfileId);
    Event updateEvent(EventUpdateRequest eventUpdateRequest, Integer eventId);
    Void cancelEvent(Integer eventId);
    void reactivateEvent(Integer eventId);
    Page<Event> getAllEvents(Pageable pageable);
}
