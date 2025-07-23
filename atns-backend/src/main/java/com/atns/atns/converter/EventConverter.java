package com.atns.atns.converter;

import com.atns.atns.dto.event.EventRequestDto;
import com.atns.atns.entity.Event;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import javax.swing.text.html.parser.Entity;

@Component
@RequiredArgsConstructor
public class EventConverter extends AbstractConverter<EventRequestDto, Event> {
    private final EventLocationConverter eventLocationConverter;
    private final ProfileRepo profileRepo;

    @Override
    public EventRequestDto toDto(Event event) {
        if (event == null) return null;

        return EventRequestDto.builder()
                .eventName(event.getEventName())
                .eventDescription(event.getEventDescription())
                .category(event.getCategory())
                .eventLocation(eventLocationConverter.toDto(event.getLocation()))
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .organizerProfileId(event.getOrganizer().getId())
                .active(event.isActive())
                .build();
    }

    @Override
    public Event toEntity(EventRequestDto eventRequestDto) {
        if (eventRequestDto == null) return null;

        return Event.builder()
                .eventName(eventRequestDto.getEventName())
                .eventDescription(eventRequestDto.getEventDescription())
                .category(eventRequestDto.getCategory())
                .location(eventLocationConverter.toEntity(eventRequestDto.getEventLocation()))
                .startTime(eventRequestDto.getStartTime())
                .endTime(eventRequestDto.getEndTime())
                .organizer(profileRepo.findById(eventRequestDto.getOrganizerProfileId())
                        .orElseThrow(() -> new ResourceNotFoundException("Organizer profile not found" + eventRequestDto.getOrganizerProfileId())))
                .active(eventRequestDto.getActive())
                .build();

    }
}
