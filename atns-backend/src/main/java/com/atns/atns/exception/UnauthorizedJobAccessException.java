package com.atns.atns.exception;

public class UnauthorizedJobAccessException extends RuntimeException {
    public UnauthorizedJobAccessException(Integer jobId) {
        super("Not authorized to access job with ID: " + jobId);
    }
}
