package com.atns.atns.exception;

import org.springframework.http.HttpStatus;

public class ConnectionDiscoveryException extends ApiException{
    // Basic constructor with default conflict status
    public ConnectionDiscoveryException(String operation) {
        super(String.format("Connection discovery failed for operation: %s", operation),
                HttpStatus.CONFLICT);
    }

    // Constructor with custom message and conflict status
    public ConnectionDiscoveryException(String message, String details) {
        super(String.format("%s - %s", message, details),
                HttpStatus.CONFLICT);
    }

    // Constructor with cause and default conflict status
    public ConnectionDiscoveryException(String operation, Throwable cause) {
        super(String.format("Connection discovery failed for operation: %s", operation),
                HttpStatus.CONFLICT,
                cause);
    }

    // Full constructor with custom status
    public ConnectionDiscoveryException(String message, HttpStatus status) {
        super(message, status);
    }
}
