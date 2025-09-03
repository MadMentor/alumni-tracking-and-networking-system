package com.atns.atns.controller;

import com.atns.atns.annotation.AuditLog;
import com.atns.atns.converter.EventResponseConverter;
import com.atns.atns.dto.PageResponse;
import com.atns.atns.dto.ProfileDto;
import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.dto.event.EventUpdateRequestDto;
import com.atns.atns.entity.Event;
import com.atns.atns.enums.Role;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.exception.UnauthorizedOperationException;
import com.atns.atns.repo.EventRepo;
import com.atns.atns.service.EventService;
import com.atns.atns.service.ProfileService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.Set;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/events")
public class EventController {

    private final EventResponseConverter eventResponseConverter;
    private final EventService eventService;
    private final EventRepo eventRepo;
    private final ProfileService profileService;

    @PostMapping
    @Transactional
    @AuditLog(action = "CREATE_EVENT")
    public ResponseEntity<EventResponseDto> createEvent(@Valid @RequestBody EventRequestDto eventRequestDto,
                                                        @RequestHeader(value = "X-Organizer-Id") @Min(1) Integer organizerId) {
        log.info("Creating event: {} for organizer {}", eventRequestDto.getEventName(), eventRequestDto.getEventName());

        try {
            Set<Role> roles = profileService.getUserRole(organizerId);
            if (!roles.contains(Role.ADMIN)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ADMIN roles are allowed");
            }

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
                                                        @RequestHeader(value = "X-Organizer-Id") Integer organizerId,
                                                        @PathVariable @Min(1) Integer eventId) {
        final String eventName = eventUpdateRequestDto.getEventName();
        log.info("Updating event: {}", eventUpdateRequestDto.getEventName());

       try {
           Set<Role> roles = profileService.getUserRole(organizerId);
           if (!(roles.contains(Role.ADMIN) || roles.contains(Role.MODERATOR) || eventUpdateRequestDto.getOrganizerProfileId() == organizerId)) {
               throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ADMIN or MODERATOR roles are allowed");
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

    @DeleteMapping("/{eventId}")
    @Transactional
    @AuditLog(action = "DELETE_EVENT")
    public ResponseEntity<Void> deleteEvent(@PathVariable @Min(1) Integer eventId,
                                            @RequestHeader(value = "X-Organizer-Id") @Min(1) Integer organizerId) {
        log.info("Organizer {} requesting deletion of event {}", organizerId, eventId);

        try {
            Set<Role> roles = profileService.getUserRole(organizerId);
            if (!(roles.contains(Role.ADMIN) || roles.contains(Role.MODERATOR))) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only ADMIN or MODERATOR roles are allowed");
            }

            eventService.deleteEvent(eventId, organizerId);
            log.info("Event {} deleted by organizer {}", eventId, organizerId);

            return ResponseEntity.noContent().build();
        } catch (ResourceNotFoundException ex) {
            log.error("Event/Organizer {} not found for event {}", organizerId, eventId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid delete request for organizer {}: {}", organizerId, ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (UnauthorizedOperationException ex) {
            log.warn("Unauthorized delete attempt by organizer {}: {}", organizerId, ex.getMessage());
            throw new ResponseStatusException(ex.getStatus(), ex.getMessage());
        }
    }

    @PatchMapping("/{eventId}/status")
    @Transactional
    @AuditLog(action = "TOGGLE_EVENT_STATUS")
    public ResponseEntity<EventResponseDto> toggleEventStatus(@PathVariable @Min(1) Integer eventId,
                                                              @RequestHeader(value = "X-Organizer-Id") @Min(1) Integer organizerId) {
        log.info("Organizer {} toggling status of event {}", organizerId, eventId);

        try {
            Event existingEvent = eventRepo.findById(eventId)
                    .orElseThrow(() -> new ResourceNotFoundException("Event", eventId));

            if (!existingEvent.getOrganizer().getId().equals(organizerId)) {
                throw UnauthorizedOperationException.forResource("event");
            }

            boolean newStatus = !existingEvent.isActive();
            EventResponseDto updatedEvent = eventService.changeEventStatus(eventId, newStatus);

            log.info("Event {} status changed to {} by organizer {}", eventId, newStatus ? "ACTIVE" : "INACTIVE", organizerId);
            return ResponseEntity.ok().body(updatedEvent);
        } catch (ResourceNotFoundException ex) {
            log.error("Event/Organizer {} not found for event {}", organizerId, eventId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid change request for organizer {}: {}", organizerId, ex.getMessage());
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        } catch (UnauthorizedOperationException ex) {
            log.warn("Unauthorized change attempt by organizer {}: {}", organizerId, ex.getMessage());
            throw new ResponseStatusException(ex.getStatus(), ex.getMessage());
        }
    }

    @GetMapping("/{eventId}")
    @Transactional(readOnly = true)
    public ResponseEntity<EventResponseDto> getById(@PathVariable @Min(1) Integer eventId,
                                                    @RequestHeader(value = "X-Profile-Id") @Min(1) Integer profileId) {
        log.info("Request received for event id {} by profile id {}", eventId, profileId);

        try {
            EventResponseDto event = eventService.getEventById(eventId);

            return ResponseEntity.ok(event);
        } catch (ResourceNotFoundException ex) {
            log.error("Event {} not found for", eventId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid event id {}", eventId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }


    @GetMapping
    @Transactional(readOnly = true)
    public ResponseEntity<PageResponse<EventResponseDto>> getAllEvents(@PageableDefault(size = 20, sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable,
                                                                       @RequestHeader(value = "X-Profile-Id") @Min(1) Integer profileId) {
        log.info("Fetching events for profile id {}", profileId);

        try {
            Page<EventResponseDto> events = eventService.getAllEvents(pageable)
                    .map(eventResponseConverter::toDto);

            PageResponse<EventResponseDto> response = new PageResponse<>(
                    events.getContent(),
                    events.getNumber(),
                    events.getSize(),
                    events.getTotalElements(),
                    events.getTotalPages(),
                    events.isLast());
            log.debug("Found {} events", events.getNumberOfElements());
            return ResponseEntity.ok(response);
        } catch (ResourceNotFoundException ex) {
            log.error("Profile id {} not found", profileId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        }
    }

    @GetMapping("/myevents")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<EventResponseDto>> getMyEvents(
            @RequestHeader(value = "X-Organizer-Id") @Min(1) Integer organizerId,
            @PageableDefault(size = 20, sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Organizer {} requesting their events", organizerId);
        return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId, pageable));
    }

    @GetMapping("/organizers/{organizerId}")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<EventResponseDto>> getEventsByOrganizer(@PageableDefault(size = 20, sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable,
                                                                       @PathVariable @Min(1) Integer organizerId,
                                                                       @RequestHeader(value = "X-Profile-Id") @Min(1) Integer profileId) {
        log.info("Profile {} requesting events for organizer {}", profileId, organizerId);

        try {
            return ResponseEntity.ok(eventService.getEventsByOrganizer(organizerId, pageable));
        } catch (ResourceNotFoundException ex) {
            log.error("Organizer not found for organizer Id {}", organizerId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid organizer id {}", organizerId);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }

    @GetMapping("/upcoming")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<EventResponseDto>> getUpcomingEvent(@RequestHeader(value = "X-Profile-Id") @Min(1) Integer profileId,
                                                                   @PageableDefault(size = 20, sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Profile {} requesting for upcoming events", profileId);

        try {
            return ResponseEntity.ok(eventService.getUpcomingEvent(pageable));
        } catch (ResourceNotFoundException ex) {
            log.error("Profile {} not found ", profileId);
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, ex.getMessage());
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid pagination parameters");
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid pagination request");
        }
    }

    @GetMapping("/search")
    @Transactional(readOnly = true)
    public ResponseEntity<Page<EventResponseDto>> searchEvents(@RequestParam String query,
                                                               @PageableDefault(sort = "startTime", direction = Sort.Direction.ASC) Pageable pageable) {
        log.info("Searching for events for query {}", query);

        try {
            return ResponseEntity.ok(eventService.searchEvents(query, pageable));
        } catch (IllegalArgumentException ex) {
            log.warn("Invalid query {}", query);
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, ex.getMessage());
        }
    }
}
