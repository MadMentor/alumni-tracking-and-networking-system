package com.atns.atns.converter;

import com.atns.atns.dto.event.EventLocationDto;
import com.atns.atns.entity.EventLocation;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EventLocationConverter extends AbstractConverter<EventLocationDto, EventLocation {
    @Override
    public EventLocationDto toDto(EventLocation eventLocation) {
        return EventLocationDto.builder()
                .address(eventLocation.getAddress())
                .onlineLink(eventLocation.getOnlineLink())
                .roomNumber(eventLocation.getRoomNumber())
                .build();
    }

    @Override
    public EventLocation toEntity(EventLocationDto eventLocationDto) {
        if (eventLocationDto == null) return null;

        return EventLocation.builder()
                .address(eventLocationDto.getAddress())
                .onlineLink(eventLocationDto.getOnlineLink())
                .roomNumber(eventLocationDto.getRoomNumber())
                .build();
    }
}
