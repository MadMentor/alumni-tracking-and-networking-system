package com.atns.atns.service;

import com.atns.atns.dto.UserRequestDto;
import com.atns.atns.dto.UserResponseDto;
import com.atns.atns.dto.UserUpdateDto;
import com.atns.atns.enums.Role;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Set;

public interface UserService {
    UserResponseDto save(UserRequestDto userRequestDto);
    UserResponseDto findById(Integer id);
    List<UserResponseDto> findAll();
    void delete(Integer id);
    UserResponseDto update(UserUpdateDto userUpdateDto, Integer id);
    UserResponseDto updateRoles(Integer id, @Valid Set<Role> newRoles);
}
