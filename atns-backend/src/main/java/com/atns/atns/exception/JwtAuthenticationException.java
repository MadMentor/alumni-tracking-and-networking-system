package com.atns.atns.exception;

public class JwtAuthenticationException extends RuntimeException{
    public JwtAuthenticationException(String message){
        super(message);
    }
}
