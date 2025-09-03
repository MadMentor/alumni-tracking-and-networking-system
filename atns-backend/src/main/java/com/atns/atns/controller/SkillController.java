package com.atns.atns.controller;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.dto.SkillDto;
import com.atns.atns.entity.Profile;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.ProfileService;
import com.atns.atns.service.SkillService;
import com.atns.atns.service.UserService;
import com.atns.atns.service.impl.ProfileServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequestMapping("/api/v1/skills")
@RestController
@Slf4j
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;
    private final ProfileService profileService;
    private final ProfileServiceImpl profileServiceImpl;

    @Transactional
    @PostMapping
    public ResponseEntity<ProfileDto> create(@RequestBody @Valid SkillDto skillDto, Authentication authentication) {
        log.info("Creating skill: {}", skillDto.getName());
        ProfileDto updatedProfileDto = profileService.addSkillToProfile(authentication.getName(), skillDto);
        log.info("Skill added to profile: {}", updatedProfileDto.getFirstName());
        return ResponseEntity.status(HttpStatus.CREATED).body(updatedProfileDto);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SkillDto> getById(@PathVariable Integer id) {
        log.info("Fetching skill by id: {}", id);
        return ResponseEntity.ok(skillService.findById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<SkillDto>> getAll() {
        log.info("Fetching all skills");
        return ResponseEntity.ok(skillService.findAll());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SkillDto> update(@PathVariable Integer id, @RequestBody @Valid SkillDto skillDto) {
        if (!Objects.equals(skillDto.getId(), id)) {
            throw new IllegalArgumentException("Id in the URl does not match the Id in the request body");
        }
        log.info("Updating skill with Id; {}", id);
        SkillDto updated = skillService.update(skillDto);
        log.info("Updated skill: {}", updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id, Authentication authentication) {
        String email = authentication.getName();
        log.info("Deleting skill with id: {} for user {}", id, email);

        ProfileDto profileDto = profileServiceImpl.findByEmail(email);

        boolean hasSkill = profileDto.getSkills().stream()
                .anyMatch(skill -> skill.getId().equals(id));
        if (!hasSkill) {
            log.warn("Skill {} not found for user {}", id, email);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        profileService.removeSkillFromProfile(email, id);

        log.info("Skill {} removed from profile of user {}", id, email);
        return ResponseEntity.noContent().build();
    }
}
