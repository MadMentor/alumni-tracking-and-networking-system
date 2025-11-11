package com.atns.atns.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "jobs")
@ToString(exclude = {"postedBy", "requiredSkills"})
public class Job {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT", length = 10000)
    private String description;

    @Column(name = "company_name", nullable = false, length = 200)
    private String companyName;

    @Column(length = 100)
    private String location;

    @Column(name = "posted_at", nullable = false)
    private LocalDateTime postedAt;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @ManyToMany(fetch = FetchType.LAZY) // Changed to LAZY for better performance
    @JoinTable(
            name = "job_skills",
            joinColumns = @JoinColumn(name = "job_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    @Builder.Default
    private Set<Skill> requiredSkills = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "posted_by", nullable = false)
    private Profile postedBy;
}
