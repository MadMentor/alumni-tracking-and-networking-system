package com.atns.atns.service.impl;

import com.atns.atns.dto.login.LoginRequestDto;
import com.atns.atns.dto.login.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.entity.User;
import com.atns.atns.enums.Role;
import com.atns.atns.exception.EmailAlreadyExistsException;
import com.atns.atns.exception.InvalidCredentialsException;
import com.atns.atns.exception.UsernameAlreadyExistsException;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.security.CustomUserDetails;
import com.atns.atns.security.JwtUtil;
import com.atns.atns.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepo userRepo;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    @Override
    public LoginResponseDto login(LoginRequestDto loginRequestDto) {
        try {
            Authentication authentication =
                    authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequestDto.getUsername(), loginRequestDto.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtUtil.generateToken((UserDetails) authentication.getPrincipal());

            Set<String> roles =
                    authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toSet());

            return LoginResponseDto.builder().username(loginRequestDto.getUsername()).token(token).roles(roles).build();
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid Username or Password");
        }
    }

    @Override
    public LoginResponseDto register(RegisterRequestDto registerRequestDto) {
        validateRegistrationInput(registerRequestDto);

        if (userRepo.findByUsername(registerRequestDto.getUsername()) != null) {
            throw new UsernameAlreadyExistsException("Username is already in use");
        }

        if (userRepo.findByEmail(registerRequestDto.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email is already in use");
        }

        Set<Role> role =  processRoles(registerRequestDto.getRole());

        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(registerRequestDto.getPassword()));
        user.setEmail(registerRequestDto.getEmail());
        user.setRoles(role);

        User savedUser = userRepo.save(user);

        String token = jwtUtil.generateToken(new CustomUserDetails(savedUser));

        log.info("Successfully registered user {}", savedUser);

        return LoginResponseDto.builder().username(user.getUsername()).token(token).build();
    }

    private void validateRegistrationInput(RegisterRequestDto dto) {
        if (dto.getUsername() != null || dto.getUsername().trim().isEmpty()) {
            throw  new IllegalArgumentException("Username cannot be empty");
        }
        if (dto.getPassword() != null || dto.getPassword().trim().isEmpty() || dto.getPassword().length() < 8) {
            throw  new IllegalArgumentException("Password must be at least 8 characters");
        }
        if (dto.getEmail() == null || dto.getEmail().matches(".+@.+\\..+")) {
            throw  new IllegalArgumentException("Invalid email format");
        }
    }

    private Set<Role> processRoles(Set<Role> requestedRoles) {
        if(requestedRoles == null || requestedRoles.isEmpty()) {
            return Set.of(Role.STUDENT);
        }

        Set<Role> filteredRoles = requestedRoles.stream()
                .filter(role -> !isPrivilegedRole(role))
                .collect(Collectors.toSet());

        if(filteredRoles.isEmpty()) {
            return Set.of(Role.STUDENT);
        }

        return filteredRoles;
    }

    private boolean isPrivilegedRole(Role role) {
        return role == Role.ADMIN || role == Role.MODERATOR;
    }
}
