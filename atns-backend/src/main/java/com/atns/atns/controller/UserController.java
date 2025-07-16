package com.atns.atns.controller;

import com.atns.atns.dto.UserRequestDto;
import com.atns.atns.dto.UserResponseDto;
import com.atns.atns.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> create(@RequestBody @Valid UserRequestDto userRequestDto) {
        log.info("Creating user: {}", userRequestDto);
        UserResponseDto saved = userService.save(userRequestDto);
        log.info("Saved user: {}", saved);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getById(@PathVariable Integer id) {
        log.info("Fetching user by id: {}", id);
        return ResponseEntity.ok(userService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAll() {
        log.info("Fetching all users");
        return ResponseEntity.ok(userService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponseDto> update(@PathVariable Integer id, @RequestBody @Valid UserRequestDto userRequestDto) {
        log.info("Updating user with Id: {}", id);
        UserResponseDto updated = userService.update(userRequestDto, id);
        log.info("Updated user: {}", updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        log.info("Deleting user with Id: {}", id);
        userService.delete(id);
        log.info("Deleted user: {}", id);
        return ResponseEntity.noContent().build();
    }
}
