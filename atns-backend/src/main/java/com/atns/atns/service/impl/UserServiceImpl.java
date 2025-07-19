package com.atns.atns.service.impl;

import com.atns.atns.converter.RegisterRequestConverter;
import com.atns.atns.converter.UserResponseConverter;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.dto.UserResponseDto;
import com.atns.atns.dto.UserUpdateDto;
import com.atns.atns.entity.User;
import com.atns.atns.enums.Role;
import com.atns.atns.exception.UserNotFoundException;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final RegisterRequestConverter registerRequestConverter;
    private final UserResponseConverter userResponseConverter;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserResponseDto save(RegisterRequestDto registerRequestDto) {
        User user = registerRequestConverter.toEntity(registerRequestDto);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        User saved = userRepo.save(user);
        log.info("Saved user with ID: {}", saved.getId());
        return userResponseConverter.toDto(saved);
    }

    @Override
    public UserResponseDto findById(Integer id) {
        return userRepo.findById(id).map(userResponseConverter::toDto).orElseThrow(() -> {
            log.error("User with id {} not found", id);
            return new RuntimeException("User not found");
        });
    }

    @Override
    public List<UserResponseDto> findAll() {
        return userRepo.findAll().stream().map(userResponseConverter::toDto).collect(Collectors.toList());
    }

    @Override
    public void delete(Integer id) {
        if (!userRepo.existsById(id)) {
            log.warn("Attempted to delete non-existing user with id {}", id);
            throw new RuntimeException("User not found!");
        }
        userRepo.deleteById(id);
        log.info("Deleted user with id {}", id);
    }

    @Override
    public UserResponseDto update(UserUpdateDto userUpdateDto, Integer id) {
        User existingUser = userRepo.findById(id).orElseThrow(() -> {
            log.error("User with id {} not found", id);
            return new UserNotFoundException("User not found");
        });

        if (userUpdateDto.getUsername() != null) {
            existingUser.setUsername(userUpdateDto.getUsername());
        }

        if (userUpdateDto.getEmail() != null) {
            existingUser.setEmail(userUpdateDto.getEmail());
        }

        if (userUpdateDto.getPassword() != null && !userUpdateDto.getPassword().isBlank()) {
            existingUser.setPassword(bCryptPasswordEncoder.encode(userUpdateDto.getPassword()));
        }

        User saved = userRepo.save(existingUser);
        return userResponseConverter.toDto(saved);
    }
    @Override
    public UserResponseDto updateRoles(Integer id, Set<Role> newRoles) {
        User user = userRepo.findById(id)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        user.setRoles(newRoles);
        User updatedUser = userRepo.save(user);
        log.info("Role changed for user with id {} to roles {}", updatedUser.getId(), updatedUser.getRoles());

        return userResponseConverter.toDto(updatedUser);
    }
}
