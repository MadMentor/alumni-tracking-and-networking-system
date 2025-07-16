package com.atns.atns.service;

import com.atns.atns.dto.UserRequestDto;
import com.atns.atns.dto.UserResponseDto;

import java.util.List;

public interface UserService {
    UserResponseDto save(UserRequestDto userRequestDto);
    UserResponseDto findById(Integer id);
    List<UserResponseDto> findAll();
    void delete(Integer id);
    UserResponseDto update(UserRequestDto userRequestDto, Integer id);
}
