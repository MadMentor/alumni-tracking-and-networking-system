package com.atns.atns.service.impl;

import com.atns.atns.dto.LoginRequestDto;
import com.atns.atns.dto.LoginResponseDto;
import com.atns.atns.dto.RegisterRequestDto;
import com.atns.atns.entity.User;
import com.atns.atns.enums.Role;
import com.atns.atns.exception.EmailAlreadyExistsException;
import com.atns.atns.exception.InvalidCredentialsException;
import com.atns.atns.exception.UnauthorizedRoleException;
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
        if (userRepo.findByUsername(registerRequestDto.getUsername()) != null) {
            throw new UsernameAlreadyExistsException("Username is already in use");
        }

        if (userRepo.findByEmail(registerRequestDto.getEmail()) != null) {
            throw new EmailAlreadyExistsException("Email is already in use");
        }

        Role role = registerRequestDto.getRole() != null ? registerRequestDto.getRole() : Role.STUDENT;

        if (registerRequestDto.getRole() == Role.ADMIN || registerRequestDto.getRole() == Role.MODERATOR) {
            throw new UnauthorizedRoleException("You cannot register as Admin or Moderator!");
        }

        User user = new User();
        user.setUsername(registerRequestDto.getUsername());
        user.setPassword(bCryptPasswordEncoder.encode(registerRequestDto.getPassword()));
        user.setEmail(registerRequestDto.getEmail());
        user.setRoles(Set.of(role));

        User savedUser = userRepo.save(user);

        String token = jwtUtil.generateToken(new CustomUserDetails(savedUser));

        log.info("Successfully registered user {}", savedUser);

        return LoginResponseDto.builder().username(user.getUsername()).token(token).build();
    }
}
