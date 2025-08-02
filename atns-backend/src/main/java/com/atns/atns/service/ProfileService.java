package com.atns.atns.service;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.User;

import java.util.List;

public interface ProfileService {
    ProfileDto save(ProfileDto profileDto, User user);
    ProfileDto update(ProfileDto profileDto);
    ProfileDto findById(Integer id);
    List<ProfileDto> findAll();
    void delete(Integer id);
}
