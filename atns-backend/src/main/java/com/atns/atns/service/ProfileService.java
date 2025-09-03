package com.atns.atns.service;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.dto.SkillDto;
import com.atns.atns.entity.User;
import com.atns.atns.enums.Role;

import java.util.List;
import java.util.Set;

public interface ProfileService {
    ProfileDto save(ProfileDto profileDto, User user);
    ProfileDto addSkillToProfile(String email, SkillDto skillDto);
    ProfileDto update(ProfileDto profileDto);
    ProfileDto findByEmail(String email);
    ProfileDto findById(Integer id);
    void removeSkillFromProfile(String email, Integer id);
    List<ProfileDto> findAll();
    List<SkillDto> findSkillsByProfileId(Integer id);
    void delete(Integer id);
    Set<Role> getUserRole(Integer organizerId);
}
