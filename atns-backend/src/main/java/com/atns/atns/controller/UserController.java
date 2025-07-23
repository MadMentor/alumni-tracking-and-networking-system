package com.atns.atns.controller;

import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.dto.user.UserResponseDto;
import com.atns.atns.dto.user.UserUpdateDto;
import com.atns.atns.enums.Role;
import com.atns.atns.service.UserService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

import static com.atns.atns.security.SecurityUtils.getCurrentUserId;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping
    public ResponseEntity<UserResponseDto> create(@RequestBody @Valid RegisterRequestDto registerRequestDto) {
        log.info("Creating user with email: {}", registerRequestDto.getEmail());
        UserResponseDto saved = userService.save(registerRequestDto);
        log.info("Saved user with id: {}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Integer id) {
        log.info("Fetching user by id: {}", id);
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAll(@RequestParam(defaultValue = "0") int page,
                                                        @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching all users");
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(@PathVariable Integer id, @RequestBody @Valid UserUpdateDto userUpdateDto) {
        log.info("Updating user ID: {}", id);
        UserResponseDto updated = userService.update(userUpdateDto, id);
        log.info("Updated user ID: {}", updated.getId());
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteSelf() {
        log.info("User deleted: {}", getCurrentUserId());
        userService.delete(getCurrentUserId());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        log.info("Deleting user ID: {}", id);
        userService.delete(id);
        log.info("Deleted user ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{id}/roles")
    public ResponseEntity<UserResponseDto> updateUserRoles(@PathVariable Integer id, @RequestBody @NotEmpty Set<@Valid Role> newRoles) {
        log.info("Updating roles for user ID: {}", id);
        return ResponseEntity.ok(userService.updateRoles(id, newRoles));
    }
}
