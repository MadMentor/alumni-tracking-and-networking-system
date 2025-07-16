package com.atns.atns.service.impl;

import com.atns.atns.converter.UserRequestConverter;
import com.atns.atns.converter.UserResponseConverter;
import com.atns.atns.dto.UserRequestDto;
import com.atns.atns.dto.UserResponseDto;
import com.atns.atns.entity.User;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepo userRepo;
    private final UserRequestConverter userRequestConverter;
    private final UserResponseConverter userResponseConverter;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public UserResponseDto save(UserRequestDto userRequestDto) {
        User user = userRequestConverter.toEntity(userRequestDto);
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        User saved = userRepo.save(user);
        log.info("Saved user: {}", saved);
        return userResponseConverter.toDto(saved);
    }

    @Override
    public UserResponseDto findById(Integer id) {
        return userRepo.findById(id)
                .map(userResponseConverter::toDto)
                .orElseThrow(() ->{
                    log.error("User with id {} not found", id);
                    return new RuntimeException("User not found");
                });
    }

    @Override
    public List<UserResponseDto> findAll() {
        return userRepo.findAll().stream()
                .map(userResponseConverter::toDto)
                .collect(Collectors.toList());
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
    public UserResponseDto update(UserRequestDto userRequestDto, Integer id) {
        User existingUser = userRepo.findById(id)
                .orElseThrow(() -> {
                    log.error("User with id {} not found", id);
                    return new RuntimeException("User not found");
                });

        existingUser.setUsername(userRequestDto.getUserName());
        existingUser.setEmail(userRequestDto.getEmail());
        existingUser.setRoles(userRequestDto.getRoles());

        User saved = userRepo.save(existingUser);
        return userResponseConverter.toDto(saved);
    }
}
