package com.atns.atns.security;

import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.UserService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    private final UserRepo userRepo;

    public SecurityUtils(UserRepo userRepo) {
        this.userRepo = userRepo;
    }

    public static String getCurrentUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            throw new SecurityException("No authenticated user found");
        }

        return authentication.getName();
    }

    // Non-static method that uses the injected UserRepo
    public Integer getCurrentUserId() {
        String username = getCurrentUsername();
        return userRepo.findByEmail(username)
                .orElseThrow(() -> new SecurityException("User not found with email: " + username))
                .getId();
    }
}
