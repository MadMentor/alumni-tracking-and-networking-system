package com.atns.atns.repo;

import com.atns.atns.entity.Profile;
import com.atns.atns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileRepo extends JpaRepository<Profile, Integer> {
    Optional<Profile> findByUser(User user);
}
