package com.atns.atns.exception;

public class JobNotFoundException extends RuntimeException {
    public JobNotFoundException(Integer jobId) {
        super("Job not found with ID: " + jobId);
    }
}

