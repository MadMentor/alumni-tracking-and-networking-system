package com.atns.atns.controller;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
@RequestMapping("/api/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;

    @PostMapping
    public ResponseEntity<ProfileDto> create(@RequestBody @Valid ProfileDto profileDto) {
        log.info("Creating profile: {}", profileDto);
        ProfileDto savedProfile = profileService.save(profileDto);
        log.info("Saved profile: {}", savedProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProfileDto> get(@PathVariable int id) {
        log.info("Getting profile by id: {}", id);
        return ResponseEntity.ok(profileService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<ProfileDto>> getAll() {
        log.info("Getting all profiles");
        return ResponseEntity.ok(profileService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileDto> update(@PathVariable int id, @RequestBody @Valid ProfileDto profileDto) {
        if (!Objects.equals(id, profileDto.getId())) {
            throw new IllegalArgumentException("Id in URl and body must match!");
        }
        log.info("Updating profile with id: {}", id);
        ProfileDto updated = profileService.update(profileDto);
        log.info("Updated profile: {}", updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        log.info("Deleting profile with id: {}", id);
        profileService.delete(id);
        log.info("Deleted profile: {}", id);
        return ResponseEntity.noContent().build();
    }
}
