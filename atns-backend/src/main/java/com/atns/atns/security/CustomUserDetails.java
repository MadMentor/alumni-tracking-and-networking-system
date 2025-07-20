package com.atns.atns.security;

import com.atns.atns.entity.User;
import com.atns.atns.enums.Role;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
public class CustomUserDetails implements UserDetails {
    private final Integer id;           // Critical for user identification
    private final String username;
    private final String password;
    private final String email;         // Useful for JWT claims
//    private final boolean active;       // Account status flag
    private final Set<GrantedAuthority> authorities;

    public CustomUserDetails(User user) {
        this.id = user.getId();
        this.username = user.getUsername();
        this.password = user.getPassword();
        this.email = user.getEmail();
//        this.active = user.isActive();  // Assuming you have this field
        this.authorities = mapRolesToAuthorities(user.getRoles());
    }

    private Set<GrantedAuthority> mapRolesToAuthorities(Set<Role> roles) {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toSet());
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.authorities;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;  // Or tie to account expiration logic
    }

    @Override
    public boolean isAccountNonLocked() {
//        return !isAccountLocked();  // Implement this method if you have lock logic
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;  // Or implement password change policy
    }

    @Override
    public boolean isEnabled() {
//        return this.active;
        return true;
    }

    // Optional but recommended for JWT claims
    public Set<Role> getRoles() {
        return this.authorities.stream()
                .map(a -> Role.valueOf(a.getAuthority().replace("ROLE_", "")))
                .collect(Collectors.toSet());
    }
}