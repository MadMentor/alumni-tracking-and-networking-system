package com.atns.atns.converter;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.dto.SkillDto;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.Skill;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.SkillRepo;
import com.atns.atns.repo.UserRepo;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
@Transactional(readOnly = true)
public class ProfileConverter extends AbstractConverter<ProfileDto, Profile> {
    private final SkillRepo skillRepo;
    private final SkillConverter skillConverter;
    private final UserRepo userRepo;

    @Transactional(readOnly = true)
    @Override
    public ProfileDto toDto(Profile profile) {
        if (profile == null) return null;

        return ProfileDto.builder()
                .id(profile.getId())
                .firstName(profile.getFirstName())
                .middleName(profile.getMiddleName())
                .lastName(profile.getLastName())
                .bio(profile.getBio())
                .phoneNumber(profile.getPhoneNumber())
                .address(profile.getAddress())
                .dateOfBirth(profile.getDateOfBirth())
                .profileImageUrl(profile.getProfileImageUrl())
                .userId(profile.getUser().getId())
                .skills(Optional.ofNullable(profile.getSkills())
                        .orElse(Collections.emptySet())
                        .stream()
                        .map(skillConverter::toDto)
                        .collect(Collectors.toSet()))
                .build();
    }

    @Transactional
    @Override
    public Profile toEntity(ProfileDto profileDto) {
        if (profileDto == null) return null;

        return Profile.builder()
                .id(profileDto.getId())
                .firstName(profileDto.getFirstName())
                .middleName(profileDto.getMiddleName())
                .lastName(profileDto.getLastName())
                .bio(profileDto.getBio())
                .phoneNumber(profileDto.getPhoneNumber())
                .address(profileDto.getAddress())
                .dateOfBirth(profileDto.getDateOfBirth())
                .profileImageUrl(profileDto.getProfileImageUrl())
                .user(userRepo.findById(profileDto.getUserId())
                        .orElseThrow(() -> new ResourceNotFoundException("User not found")))
                .skills(profileDto.getSkills().stream()
                        .map(this::resolveSkill)
                        .collect(Collectors.toSet())
                )
                .build();
    }

    private Skill resolveSkill(SkillDto dto) {
        return Optional.ofNullable(dto.getId())
                .flatMap(skillRepo::findById)
                .or(() -> Optional.ofNullable(dto.getName())
                        .flatMap(name -> skillRepo.findByName(name.trim().toLowerCase())))
                .orElseGet(() -> skillRepo.save(skillConverter.toEntity(dto)));
    }
}
