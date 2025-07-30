package com.atns.atns.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Builder
@Data
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
    private String bio;

    @PastOrPresent(message = "Date of birth must be in past!")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    private String profileImageUrl;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToMany(cascade = {CascadeType.PERSIST, CascadeType.MERGE})
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

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Event> events = new ArrayList<>();

    @OneToMany(mappedBy = "follower")
    private Set<Follow> following = new HashSet<>();

    @OneToMany(mappedBy = "followed")
    private Set<Follow> followers = new HashSet<>();
}
