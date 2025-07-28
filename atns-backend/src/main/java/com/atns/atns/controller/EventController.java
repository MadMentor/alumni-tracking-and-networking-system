package com.atns.atns.controller;

import com.atns.atns.annotation.AuditLog;
import com.atns.atns.converter.EventResponseConverter;
import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.dto.event.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.exception.UnauthorizedOperationException;
import com.atns.atns.service.EventService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventResponseConverter eventResponseConverter;
    private final EventService eventService;

    @PostMapping
    @Transactional
    @AuditLog(action = "CREATE_EVENT")
    public ResponseEntity<EventResponseDto> createEvent(@Valid @RequestBody EventRequestDto eventRequestDto,
                                                        @RequestHeader("X-Organizer-Id") @Min(1) Integer organizerId) {
        log.info("Creating event: {} for organizer {}", eventRequestDto.getEventName(), eventRequestDto.getEventName());

        try {
            Event savedEvent = eventService.createEvent(eventRequestDto, organizerId);

            log.info("Created event with ID: {}", savedEvent.getId());

            // Response building
            URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(savedEvent.getId()).toUri();
            return ResponseEntity.created(location).body(eventResponseConverter.toDto(savedEvent));
        } catch (ResourceNotFoundException e) {
            log.error("Organizer {} not found for event '{}'", organizerId, eventRequestDto.getEventName());
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid request for organizer {}: {}", organizerId, ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @PutMapping("/{eventId}")
    @Transactional
    @AuditLog(action = "UPDATE_EVENT")
    public ResponseEntity<EventResponseDto> updateEvent(@Valid @RequestBody EventUpdateRequestDto eventUpdateRequestDto,
                                                        @RequestHeader("X-Organizer-Id") Integer organizerId,
                                                        @PathVariable @Min(1) Integer eventId) {
        final String eventName = eventUpdateRequestDto.getEventName();
        log.info("Updating event: {}", eventUpdateRequestDto.getEventName());

       try {
           if (eventUpdateRequestDto.getEventId() != null && !eventUpdateRequestDto.getEventId().equals(eventId)) {
               throw new IllegalArgumentException("Path ID and body ID must match");
           }

           EventResponseDto updatedEvent = eventService.updateEvent(eventUpdateRequestDto, eventId);

           log.info("Updated event: {} ('{}')", updatedEvent.getEventId(), eventName);

           URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(updatedEvent.getEventId()).toUri();
           return ResponseEntity.ok().location(location).body(updatedEvent);
       } catch (ResourceNotFoundException ex) {
           log.error("Event/Organizer {} not found for event '{}'", organizerId, eventId);
           throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
       } catch (IllegalArgumentException ex) {
           log.warn("Invalid update request: {}", ex.getMessage());
           throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
       } catch (UnauthorizedOperationException ex) {
           log.warn("Unauthorized update attempt by organizer {}: {}", organizerId, ex.getMessage());
           throw new ResponseStatusException(ex.getStatus(), ex.getMessage());
       }
    }

}
