package com.atns.atns.service.impl;

import com.atns.atns.converter.ProfileConverter;
import com.atns.atns.converter.SkillConverter;
import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.Profile;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {

    private final ProfileConverter profileConverter;
    private final ProfileRepo profileRepo;
    private final SkillConverter skillConverter;
    private final UserRepo userRepo;

    @Override
    public ProfileDto save(ProfileDto profileDto) {
        Profile profile = profileConverter.toEntity(profileDto);
        Profile saved = profileRepo.save(profile);
        log.info("Saved profile: {}", saved);
        return profileConverter.toDto(saved);
    }

    @Override
    public ProfileDto update(ProfileDto profileDto) {
        if (profileDto.getId() == null) {
            log.error("Profile id is required for update!");
            throw new IllegalArgumentException("Profile id is required for update!");
        }
        Profile existingProfile = profileRepo.findById(profileDto.getId())
                .orElseThrow(() -> {
                    log.error("Profile not found!");
                    return new RuntimeException("Profile not found!");
                });

        existingProfile.setFirstName(profileDto.getFirstName());
        existingProfile.setMiddleName(profileDto.getMiddleName());
        existingProfile.setLastName(profileDto.getLastName());
        existingProfile.setBio(profileDto.getBio());
        existingProfile.setPhoneNumber(profileDto.getPhoneNumber());
        existingProfile.setAddress(profileDto.getAddress());
        existingProfile.setDateOfBirth(profileDto.getDateOfBirth());
        existingProfile.setProfileImageUrl(profileDto.getProfileImageUrl());
        existingProfile.setSkills(profileDto.getSkills().stream()
                .map(skillConverter::toEntity)
                .collect(Collectors.toSet()));
        existingProfile.setUser(userRepo.findById(profileDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found!")));

        Profile updated = profileRepo.save(existingProfile);
        log.info("Updated profile: {}", updated);
        return profileConverter.toDto(updated);
    }

    @Override
    public ProfileDto findById(Integer id) {
        return profileRepo.findById(id)
                .map(profileConverter::toDto)
                .orElseThrow(() -> {
                    log.error("Profile with id {} not found!", id);
                    return new RuntimeException("Profile not found!");
                });
    }

    @Override
    public List<ProfileDto> findAll() {
        return profileRepo.findAll().stream()
                .map(profileConverter::toDto)
                .toList();
    }

    @Override
    public void delete(Integer id) {
        if (!profileRepo.existsById(id)) {
            log.error("Attempted to delete non-existing profile with id {}", id);
            throw new RuntimeException("Profile not found!");
        }
        profileRepo.deleteById(id);
        log.info("Deleted profile with Id: {}", id);
    }
}
