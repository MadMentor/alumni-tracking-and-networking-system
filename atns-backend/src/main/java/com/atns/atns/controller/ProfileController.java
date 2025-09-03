package com.atns.atns.controller;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.dto.SkillDto;
import com.atns.atns.entity.User;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.ProfileService;
import com.atns.atns.service.impl.ProfileServiceImpl;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/profiles")
@RequiredArgsConstructor
@Slf4j
public class ProfileController {

    private final ProfileService profileService;
    private final ProfileServiceImpl profileServiceImpl;
    private final UserRepo userRepo;
    private final Cloudinary cloudinary;

    @PostMapping
    public ResponseEntity<ProfileDto> create(@RequestPart("profile") @Valid ProfileDto profileDto,
                                             @RequestPart(value = "image", required = false) MultipartFile image,
                                             Authentication authentication) {
        String email = authentication.getName();
        log.info("Creating profile for user: {}", email);
        
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", email));
        log.info("Found user: {}", user.getId());

        // Upload image to Cloudinary if provided
        if (image != null && !image.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = (String) uploadResult.get("secure_url");
                profileDto.setProfileImageUrl(imageUrl);
                log.info("Uploaded profile image to Cloudinary: {}", imageUrl);
            } catch (IOException e) {
                log.error("Failed to upload image to Cloudinary", e);
                throw new RuntimeException("Image upload failed");
            }
        }

        ProfileDto savedProfile = profileService.save(profileDto, user);
        log.info("Saved profile: {}", savedProfile);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedProfile);
    }

    @Transactional(readOnly = true)
    @GetMapping("/me")
    public ResponseEntity<ProfileDto> getMyProfile(Authentication authentication) {
        log.info("Getting profile for user: {}", authentication.getName());
        String email = authentication.getName(); // or get username/id from auth token
        ProfileDto profileDto = profileServiceImpl.findByEmail(email);
        return ResponseEntity.ok(profileDto);
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

    @GetMapping("/me/skills")
    public ResponseEntity<List<SkillDto>> getMySkills(Authentication authentication) {
        log.info("Getting skills for user: {}", authentication.getName());
        String email = authentication.getName();
        List<SkillDto> skills = profileService.findSkillsByProfileId(profileServiceImpl.findByEmail(email).getId());
        return ResponseEntity.ok(skills);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProfileDto> update(@PathVariable int id,
                                             @RequestPart("profile") @Valid ProfileDto profileDto,
                                             @RequestPart(value = "image", required = false) MultipartFile image) {
//        if (!Objects.equals(id, profileDto.getId())) {
//            throw new IllegalArgumentException("ID in URl and body must match!");
//        }
        log.info("Updating profile with id: {}", id);
        profileDto.setId(id);
        log.info("ProfileDto after setting ID: {}", profileDto);

        if (image != null && !image.isEmpty()) {
            try {
                Map uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = (String) uploadResult.get("secure_url");
                profileDto.setProfileImageUrl(imageUrl);
                log.info("Uploaded profile image to Cloudinary: {}", imageUrl);
            } catch (IOException e) {
                log.error("Failed to upload image to Cloudinary", e);
                throw new RuntimeException("Image upload failed");
            }
        }

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
