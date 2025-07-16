package com.atns.atns.entity;

import com.atns.atns.enums.Role;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotBlank(message = "Username is mandatory!")
    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Email(message = "Email should be valid!")
    @NotBlank(message = "Email is mandatory!")
    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @NotBlank(message = "Password is mandatory!")
    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Set<Role> roles = new HashSet<>();

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private Profile profile;
}
