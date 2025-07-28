package com.atns.atns.exception;

import org.springframework.http.HttpStatus;

public class UnauthorizedOperationException extends ApiException{
    public UnauthorizedOperationException(String message) {
        super(message, HttpStatus.FORBIDDEN);
    }

    public static UnauthorizedOperationException forResource(String resourceType) {
        return new UnauthorizedOperationException(
                "Not authorized to modify " + resourceType
        );
    }
}
