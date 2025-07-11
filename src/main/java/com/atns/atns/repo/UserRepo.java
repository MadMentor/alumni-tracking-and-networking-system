package com.atns.atns.repo;

import com.atns.atns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepo extends JpaRepository<User, Integer> {
        boolean existsByUsername(String username);
        boolean existsByEmail(String email);
        User findByUsername(String username);
        User findByEmail(String email);
}
