package com.atns.atns.dto;

import com.atns.atns.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRequestDto {
    private String userName;
    private String password;
    private String email;
    private Set<Role> roles;
}
