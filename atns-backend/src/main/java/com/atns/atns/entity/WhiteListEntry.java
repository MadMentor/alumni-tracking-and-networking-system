package com.atns.atns.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "registration_whitelist")
@Data
public class WhiteListEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String role; // ROLE_STUDENT, ROLE_ALUMNI, ROLE_ADMIN, etc.

    private boolean used = false;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
