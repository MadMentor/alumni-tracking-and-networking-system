package com.atns.atns.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EntityListeners(AuditingEntityListener.class)
@Table(name = "profiles",indexes = {
        @Index(name = "odx_profile_user", columnList = "user_id"),
        @Index(name = "idx_profile_name", columnList = "lastName,firstName")
})
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "First Name is required!")
    @Size(max = 30, message = "First Name must be less than 30 characters!")
    @Column(nullable = false, length = 30)
    private String firstName;

    @Size(max = 30, message = "Middle Name must be less than 30 characters!")
    @Column(length = 30)
    private String middleName;

    @NotBlank(message = "Last Name is required!")
    @Size(max = 30, message = "Last Name must be less than 30 characters!")
    @Column(nullable = false, length = 30)
    private String lastName;

    @NotBlank(message = "Phone Number is Mandatory!")
    @Column(nullable = false, length = 20)
    @Pattern(regexp = "^\\+?[0-9\\s-]{10,}$")
    private String phoneNumber;

    @NotBlank(message = "Address is Mandatory!")
    @Column(nullable = false)
    private String address;

    @Lob
    @Basic(fetch = FetchType.EAGER)
    private String bio;

    @PastOrPresent(message = "Date of birth must be in past!")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    private String profileImageUrl;

    @NotNull(message = "Batch year is required")
    @Column(nullable = false)
    private Integer batchYear;

    @NotBlank(message = "Faculty is required")
    @Column(nullable = false, length = 100)
    private String faculty;

    @NotBlank(message = "Current position is required")
    @Column(nullable = false, length = 150)
    private String currentPosition;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    @ToString.Exclude
    private User user;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JsonIgnore
    @JoinTable(
            name = "profile_skills",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Event> events = new ArrayList<>();

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "follower", fetch = FetchType.LAZY)
    private Set<Follow> following = new HashSet<>();

    @EqualsAndHashCode.Exclude
    @ToString.Exclude
    @OneToMany(mappedBy = "followed", fetch = FetchType.LAZY)
    private Set<Follow> followers = new HashSet<>();
}
