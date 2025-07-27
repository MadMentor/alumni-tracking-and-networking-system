package com.atns.atns.exception;

import org.springframework.http.HttpStatus;

public class JwtAuthenticationException extends ApiException{
    // Standard constructor
    public JwtAuthenticationException(String message){
        super(message, HttpStatus.UNAUTHORIZED);
    }

    // Constructor with cause
    public JwtAuthenticationException(String message, Throwable cause) {
        super(message, HttpStatus.UNAUTHORIZED, cause);
    }

    // Predefined common cases
    public static JwtAuthenticationException malformedToken() {
        return new JwtAuthenticationException("Malformed JWT token");
    }

    public static JwtAuthenticationException expiredToken() {
        return new JwtAuthenticationException("Expired JWT token");
    }

    public static JwtAuthenticationException invalidSignature() {
        return new JwtAuthenticationException("Invalid JWT signature");
    }

    public static JwtAuthenticationException unsupportedToken() {
        return new JwtAuthenticationException("Unsupported JWT token");
    }

    public static JwtAuthenticationException emptyClaims() {
        return new JwtAuthenticationException("Empty claims");
    }

    public static JwtAuthenticationException genericError(String message) {
        return new JwtAuthenticationException(message);
    }
}
