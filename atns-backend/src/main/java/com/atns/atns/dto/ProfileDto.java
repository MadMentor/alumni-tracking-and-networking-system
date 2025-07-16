package com.atns.atns.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileDto {
    private Integer id;
    private String firstName;
    private String middleName;
    private String lastName;
    private String bio;
    private String phoneNumber;
    private String address;
    private LocalDate dateOfBirth;
    private String profileImageUrl;
    private Integer userId;
    private Set<SkillDto> skills;
}
