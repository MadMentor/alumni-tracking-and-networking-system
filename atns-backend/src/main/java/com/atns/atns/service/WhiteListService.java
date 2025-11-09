package com.atns.atns.service;

import com.atns.atns.entity.WhiteListEntry;

import java.util.List;
import java.util.Optional;

public interface WhiteListService {
    boolean isEmailWhiteListed(String email);
    Optional<WhiteListEntry> getWhiteListEntry(String email);
    void markAsUsed(String email);
    List<WhiteListEntry> getAllActiveEntries();
    WhiteListEntry addToWhiteList(String email, String role);
    void removeFromWhiteList(String email);
    void replaceEmail(String currentEmail, String newEmail);
}
