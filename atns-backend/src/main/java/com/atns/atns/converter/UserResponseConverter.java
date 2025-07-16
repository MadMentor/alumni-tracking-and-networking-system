package com.atns.atns.converter;

import com.atns.atns.dto.UserResponseDto;
import com.atns.atns.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserResponseConverter extends AbstractConverter<UserResponseDto, User>{
    @Override
    public UserResponseDto toDto(User user) {
        return UserResponseDto.builder()
                .id(user.getId())
                .userName(user.getUsername())
                .email(user.getEmail())
                .roles(user.getRoles())
                .build();
    }

    @Override
    public User toEntity(UserResponseDto userResponseDto) {
        return null;
    }
}
