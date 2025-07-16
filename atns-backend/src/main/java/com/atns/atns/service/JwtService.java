package com.atns.atns.service;

public interface JwtService {
    String generateToken(String subject);
}
