package com.atns.atns.service.impl;

import com.atns.atns.converter.ProfileConverter;
import com.atns.atns.converter.SkillConverter;
import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.User;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.ProfileService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileConverter profileConverter;
    private final ProfileRepo profileRepo;
    private final SkillConverter skillConverter;
    private final UserRepo userRepo;

    public ProfileDto save(ProfileDto profileDto, User user) {
        Profile profile = profileConverter.toEntity(profileDto);
        profile.setUser(user);
        Profile saved = profileRepo.save(profile);
        log.info("Saved profile: {}", saved.getId());
        return profileConverter.toDto(saved);
    }

    public ProfileDto update(ProfileDto profileDto) {
        if (profileDto.getId() == null) {
            log.error("Profile id is required for update!");
            throw new IllegalArgumentException("Profile id is required for update!");
        }
        log.info("Updating profile with id: {}", profileDto.getId());
        Profile existingProfile = profileRepo.findById(profileDto.getId())
                .orElseThrow(() -> {
                    log.error("Profile not found!");
                    return new ResourceNotFoundException("Profile", profileDto.getId());
                });

        existingProfile.setFirstName(profileDto.getFirstName());
        existingProfile.setMiddleName(profileDto.getMiddleName());
        existingProfile.setLastName(profileDto.getLastName());
        existingProfile.setBio(profileDto.getBio());
        existingProfile.setPhoneNumber(profileDto.getPhoneNumber());
        existingProfile.setAddress(profileDto.getAddress());
        existingProfile.setDateOfBirth(profileDto.getDateOfBirth());
        existingProfile.setProfileImageUrl(profileDto.getProfileImageUrl());
        existingProfile.setSkills(Optional.ofNullable(profileDto.getSkills())
                .orElse(Collections.emptySet())
                .stream()
                .map(skillConverter::toEntity)
                .collect(Collectors.toSet()));
        log.info("Updating profile, findById id = {}", profileDto.getId());
        existingProfile.setUser(existingProfile.getUser());

        Profile updated = profileRepo.save(existingProfile);
        log.info("Updated profile: {}", updated);
        return profileConverter.toDto(updated);
    }

    public ProfileDto findById(Integer id) {
        return profileRepo.findById(id)
                .map(profileConverter::toDto)
                .orElseThrow(() -> {
                    log.error("Profile with id {} not found!", id);
                    return new RuntimeException("Profile not found!");
                });
    }


    public List<ProfileDto> findAll() {
        return profileRepo.findAll().stream()
                .map(profileConverter::toDto)
                .toList();
    }

    public void delete(Integer id) {
        if (!profileRepo.existsById(id)) {
            log.error("Attempted to delete non-existing profile with id {}", id);
            throw new RuntimeException("Profile not found!");
        }
        profileRepo.deleteById(id);
        log.info("Deleted profile with Id: {}", id);
    }

    public ProfileDto findByEmail(String email) {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
        Profile profile = user.getProfile();
        if (profile == null) {
            throw new EntityNotFoundException("Profile not found for user: " + email);
        }
        return profileConverter.toDto(profile);
    }
}
