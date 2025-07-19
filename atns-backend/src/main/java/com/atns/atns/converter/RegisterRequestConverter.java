package com.atns.atns.converter;

import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RegisterRequestConverter extends AbstractConverter<RegisterRequestDto, User> {
    @Override
    public RegisterRequestDto toDto(User user) {
        return new RegisterRequestDto().builder()
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRoles())
                .password(user.getPassword())
                .build();
    }

    @Override
    public User toEntity(RegisterRequestDto registerRequestDto) {
        if (registerRequestDto == null) {
            return null;
        }
        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setEmail(registerRequestDto.getEmail());
        user.setRoles(registerRequestDto.getRole());
        user.setPassword(registerRequestDto.getPassword());
        return user;
    }
}
