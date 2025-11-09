package com.atns.atns.controller;

import com.atns.atns.dto.AddWhitelistRequest;
import com.atns.atns.entity.WhiteListEntry;
import com.atns.atns.service.WhiteListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api/v1/admin/whitelist")
@RequiredArgsConstructor
public class WhiteListController {

    private final WhiteListService whiteListService;

    // Get all active whitelist entries
    @GetMapping
    public ResponseEntity<?> getAllActiveEntries() {
        try {
            List<WhiteListEntry> entries = whiteListService.getAllActiveEntries();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "entries", entries,
                    "count", entries.size()
            ));

        } catch (Exception e) {
            log.error("Failed to get whitelist entries: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Failed to get whitelist entries"
            ));
        }
    }

    // Get all entries (including used ones)
    @GetMapping("/all")
    public ResponseEntity<?> getAllEntries() {
        try {
            List<WhiteListEntry> entries = whiteListService.getAllActiveEntries();

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "entries", entries,
                    "count", entries.size()
            ));

        } catch (Exception e) {
            log.error("Failed to get all whitelist entries: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Failed to get whitelist entries"
            ));
        }
    }

    // Add single email to whitelist
    @PostMapping
    public ResponseEntity<?> addToWhitelist(@RequestBody @Valid AddWhitelistRequest request) {
        try {
            WhiteListEntry entry = whiteListService.addToWhiteList(request.getEmail(), request.getRole());

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Email added to whitelist successfully",
                    "entry", entry
            ));

        } catch (Exception e) {
            log.error("Failed to add to whitelist: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", e.getMessage()
            ));
        }
    }

    // Remove from whitelist (hard delete)
    @DeleteMapping("/")
    public ResponseEntity<?> removeFromWhitelist(@RequestParam String email ) {
        try {
            whiteListService.removeFromWhiteList(email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Entry removed from whitelist"
            ));

        } catch (Exception e) {
            log.error("Failed to remove from whitelist: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Failed to remove from whitelist"
            ));
        }
    }

    // Mark entry as used (soft delete)
    @PatchMapping("/mark-used")
    public ResponseEntity<?> markAsUsed(@RequestParam String email ) {
        try {
            whiteListService.markAsUsed(email);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Entry marked as used"
            ));

        } catch (Exception e) {
            log.error("Failed to mark entry as used: {}", e.getMessage());
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "error", "Failed to mark entry as used"
            ));
        }
    }


}