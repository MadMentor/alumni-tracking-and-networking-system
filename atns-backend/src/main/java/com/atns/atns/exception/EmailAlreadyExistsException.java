package com.atns.atns.exception;

import org.springframework.http.HttpStatus;

public class EmailAlreadyExistsException extends ApiException{
    public EmailAlreadyExistsException(String email){
        super(String.format("Email %s already exists", email), HttpStatus.CONFLICT);
    }
}
