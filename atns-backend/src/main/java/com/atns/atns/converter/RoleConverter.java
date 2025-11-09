package com.atns.atns.converter;

import com.atns.atns.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class RoleConverter {
    public static String enumToRoleString(Role role) {
        return "ROLE_" + role.name();
    }

    public static Role roleStringToEnum(String roleString) {
        if (roleString.startsWith("ROLE_")) {
            return Role.valueOf(roleString.substring(5));
        }
        return Role.valueOf(roleString);
    }

    public static Set<String> enumSetToRoleStrings(Set<Role> roles) {
        return roles.stream()
                .map(RoleConverter::enumToRoleString)
                .collect(Collectors.toSet());
    }

    public static Set<Role> roleStringsToEnumSet(Set<String> roleStrings) {
        return roleStrings.stream()
                .map(roleString -> {
                    // Handle both "ROLE_ADMIN" and "ADMIN" formats
                    String roleName = roleString.startsWith("ROLE_")
                            ? roleString.substring(5)
                            : roleString;
                    return Role.valueOf(roleName.toUpperCase());
                })
                .collect(Collectors.toSet());
    }
}
