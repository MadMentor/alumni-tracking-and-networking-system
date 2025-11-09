package com.atns.atns.service.impl;

import com.atns.atns.entity.WhiteListEntry;
import com.atns.atns.repo.WhiteListRepo;
import com.atns.atns.service.WhiteListService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class WhiteListServiceImpl implements WhiteListService {

    private final WhiteListRepo whiteListRepo;
    @Override
    public boolean isEmailWhiteListed(String email) {
        return whiteListRepo.existsByEmailAndUsedFalse(email);
    }

    @Override
    public Optional<WhiteListEntry> getWhiteListEntry(String email) {
        return whiteListRepo.findByEmailAndUsedFalse(email);
    }

    @Override
    public void markAsUsed(String email) {
        whiteListRepo.findByEmailAndUsedFalse(email).ifPresent(entry -> {
            entry.setUsed(true);
            whiteListRepo.save(entry);
            log.info("Marked whitelist entry as used for email: {}", email);
        });
    }

    @Override
    public List<WhiteListEntry> getAllActiveEntries() {
        return whiteListRepo.findByUsedFalse();
    }

    @Override
    public WhiteListEntry addToWhiteList(String email, String role) {
        if (whiteListRepo.existsByEmailAndUsedFalse(email)) {
            throw new RuntimeException("Email already exists in whitelist: " + email);
        }

        WhiteListEntry entry = WhiteListEntry.builder()
                .email(email)
                .role(role.toUpperCase())
                .used(false)
                .build();

        return whiteListRepo.save(entry);
    }

    @Override
    public void removeFromWhiteList(String email) {
        whiteListRepo.deleteByEmail(email);
    }

    @Override
    public void replaceEmail(String currentEmail, String newEmail) {
        WhiteListEntry entry = whiteListRepo.findByEmail(currentEmail);
        entry.setEmail(newEmail);
        whiteListRepo.save(entry);
    }
}
