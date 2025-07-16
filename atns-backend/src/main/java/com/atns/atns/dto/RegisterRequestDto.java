package com.atns.atns.dto;

import com.atns.atns.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequestDto {

    @NotBlank(message = "Username is mandatory!")
    private String username;

    @Email(message = "Invalid Email Format!")
    @NotBlank(message = "Email is mandatory!")
    private String email;

    @NotBlank(message = "Password is mandatory!")
    @Size(min = 8, message = "Password must be at least 8 characters!")
    private String password;

    private Role role;
}
