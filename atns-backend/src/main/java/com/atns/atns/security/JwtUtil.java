package com.atns.atns.security;

import com.atns.atns.exception.JwtAuthenticationException;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Slf4j
@Component
public class JwtUtil {

    @Value("${JWT_SECRET}")
    private String secret;

    @Value("${JWT_EXPIRATION}")
    private long expirationTime;

    private SecretKey secretKey;

    @PostConstruct
    public void init() {
        validateSecretKey();
        this.secretKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    private void validateSecretKey() {
        if (secret == null || secret.length() < 64) {
            throw new IllegalArgumentException(
                    "JWT secret key must be at least 256 bits (32 characters) long. " + "Current length: " +
                            (secret == null ? 0 : secret.length()) + " characters.");
        }
    }

    public String generateToken(UserDetails userDetails) {
        return buildToken(new HashMap<>(), userDetails);
    }

    public String buildToken(Map<String, Object> extraClaims, UserDetails userDetails) {
        return Jwts.builder().claims(extraClaims).subject(((CustomUserDetails) userDetails).getEmail()).issuedAt(new Date(System.currentTimeMillis())).expiration(new Date(
                System.currentTimeMillis() + expirationTime)).signWith(secretKey).compact();
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        System.out.println("Extracted username from token: '" + username + "'");
        System.out.println("Username from UserDetails: '" + userDetails.getUsername() + "'");
//        return username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        boolean notExpired = !isTokenExpired(token);
        System.out.println("Token expired? " + !notExpired);
        boolean valid = username.equals(userDetails.getUsername()) && notExpired;
        System.out.println("Token valid: " + valid);
        return valid;
    }


    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = parseClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims parseClaims(String token) {
        try {
            return Jwts.parser().verifyWith(secretKey).build().parseSignedClaims(token).getPayload();
        } catch (ExpiredJwtException ex) {
            log.warn("JWT token is expired: {}", ex.getMessage());
            throw JwtAuthenticationException.expiredToken();
        } catch (UnsupportedJwtException ex) {
            log.warn("JWT token is unsupported: {}", ex.getMessage());
            throw JwtAuthenticationException.unsupportedToken();
        } catch (MalformedJwtException ex) {
            log.warn("JWT token is malformed: {}", ex.getMessage());
            throw JwtAuthenticationException.malformedToken();
        } catch (SecurityException ex) {
            log.warn("Invalid JWT signature: {}", ex.getMessage());
            throw JwtAuthenticationException.invalidSignature();
        } catch (IllegalArgumentException ex) {
            log.warn("JWT claims string is empty: {}", ex.getMessage());
            throw JwtAuthenticationException.emptyClaims();
        } catch (JwtException ex) {
            log.warn("General JWT exception: {}", ex.getMessage());
            throw JwtAuthenticationException.genericError(ex.getMessage());
        }
    }
}
