package com.atns.atns.converter;

import com.atns.atns.dto.event.EventResponseDto;
import com.atns.atns.entity.Event;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventResponseConverter extends AbstractConverter<EventResponseDto, Event> {

    @Override
    public EventResponseDto toDto(Event event) {
        if (event == null) return null;

        return EventResponseDto.builder()
                .eventId(event.getId())
                .eventName(event.getEventName())
                .eventDescription(event.getEventDescription())
                .category(event.getCategory())
                .startTime(event.getStartTime())
                .endTime(event.getEndTime())
                .organizerProfileId(event.getOrganizer().getId())
                .active(event.isActive())
                .build();
    }

    @Override
    public Event toEntity(EventResponseDto eventResponseDto) {
        return null;
    }
}
