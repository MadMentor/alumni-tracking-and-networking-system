package com.atns.atns.utils;

import org.springframework.stereotype.Component;

import java.util.regex.Pattern;

@Component
public class InputSanitizer {
    
    private static final Pattern HTML_PATTERN = Pattern.compile("<[^>]*>");
    private static final Pattern SQL_INJECTION_PATTERN = Pattern.compile("(?i)(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)");
    private static final Pattern XSS_PATTERN = Pattern.compile("(?i)(javascript:|vbscript:|onload=|onerror=|onclick=)");
    
    public static String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        
        // Remove HTML tags
        input = HTML_PATTERN.matcher(input).replaceAll("");
        
        // Remove potential SQL injection
        input = SQL_INJECTION_PATTERN.matcher(input).replaceAll("");
        
        // Remove potential XSS
        input = XSS_PATTERN.matcher(input).replaceAll("");
        
        // Trim whitespace
        return input.trim();
    }
    
    public static boolean isValidEmail(String email) {
        if (email == null) {
            return false;
        }
        return email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$");
    }
    
    public static boolean isValidPhoneNumber(String phone) {
        if (phone == null) {
            return false;
        }
        return phone.matches("^\\+?[0-9\\s-]{10,}$");
    }
} 