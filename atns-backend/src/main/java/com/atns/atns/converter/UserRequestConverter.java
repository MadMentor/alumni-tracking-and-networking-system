package com.atns.atns.converter;

import com.atns.atns.dto.UserRequestDto;
import com.atns.atns.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class UserRequestConverter extends AbstractConverter<UserRequestDto, User>{
    @Override
    public UserRequestDto toDto(User user) {
        return null;
    }

    @Override
    public User toEntity(UserRequestDto userRequestDto) {
        User entity = new User();

        entity.setUsername(userRequestDto.getUserName());
        entity.setPassword(userRequestDto.getPassword());
        entity.setEmail(userRequestDto.getEmail());
        entity.setRoles(userRequestDto.getRoles());

        return entity;
    }
}
