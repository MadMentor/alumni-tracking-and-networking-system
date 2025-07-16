package com.atns.atns.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "profiles")
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
    private String phoneNumber;

    @NotBlank(message = "Address is Mandatory!")
    @Column(nullable = false)
    private String address;

    private String bio;

    @Past(message = "Date of birth must be in past!")
    @Column(nullable = false)
    private LocalDate dateOfBirth;

    private String profileImageUrl;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @ManyToMany
    @JoinTable(
            name = "profile_skills",
            joinColumns = @JoinColumn(name = "profile_id"),
            inverseJoinColumns = @JoinColumn(name = "skill_id")
    )
    private Set<Skill> skills = new HashSet<>();

}
