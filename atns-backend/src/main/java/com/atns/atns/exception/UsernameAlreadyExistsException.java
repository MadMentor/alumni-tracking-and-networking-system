package com.atns.atns.exception;

import org.springframework.http.HttpStatus;

public class UsernameAlreadyExistsException extends ApiException {
    public UsernameAlreadyExistsException(String username) {
        super(String.format("Username %s already exists", username),
                HttpStatus.CONFLICT);
    }
}
