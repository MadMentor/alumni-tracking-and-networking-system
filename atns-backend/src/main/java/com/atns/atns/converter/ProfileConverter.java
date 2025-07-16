package com.atns.atns.converter;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.Skill;
import com.atns.atns.repo.SkillRepo;
import com.atns.atns.repo.UserRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Component
public class ProfileConverter extends AbstractConverter<ProfileDto, Profile> {
    private final SkillRepo skillRepo;
    private final SkillConverter skillConverter;
    private final UserRepo userRepo;

    @Override
    public ProfileDto toDto(Profile profile) {
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
                .skills(
                        profile.getSkills().stream()
                                .map(skillConverter::toDto)
                                .collect(Collectors.toSet())
                )
                .build();
    }

    @Override
    public Profile toEntity(ProfileDto profileDto) {
        Profile entity = new Profile();

        entity.setId(profileDto.getId());
        entity.setFirstName(profileDto.getFirstName());
        entity.setMiddleName(profileDto.getMiddleName());
        entity.setLastName(profileDto.getLastName());
        entity.setBio(profileDto.getBio());
        entity.setPhoneNumber(profileDto.getPhoneNumber());
        entity.setAddress(profileDto.getAddress());
        entity.setDateOfBirth(profileDto.getDateOfBirth());
        entity.setProfileImageUrl(profileDto.getProfileImageUrl());
        entity.setUser(userRepo.findById(profileDto.getUserId())
                .orElseThrow(() -> new RuntimeException("User Not Found")));

        Set<Skill> skillEntities = profileDto.getSkills().stream()
                .map(skillDto -> {
                    if (skillDto.getId() != null) {
                        return skillRepo.findById(skillDto.getId())
                                .orElseThrow(() -> new RuntimeException("Skill not found"));
                    } else {
                        return skillRepo.findByName(skillDto.getName().trim().toLowerCase())
                                .orElseGet(() -> skillRepo.save(skillConverter.toEntity(skillDto)));
                    }
       })
                .collect(Collectors.toSet());

        entity.setSkills(skillEntities);

        return entity;
    }
}
