package com.atns.atns.repo;

import com.atns.atns.entity.Profile;
import com.atns.atns.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import java.util.Optional;

@Repository
public interface ProfileRepo extends JpaRepository<Profile, Integer> {
    Optional<Profile> findByUser(User user);

    Optional<Profile> findByUserEmail(String email);

    @Query("SELECT p from Profile p JOIN p.skills s WHERE LOWER(s.name) LIKE LOWER(CONCAT('%', :skill, '%'))")
    Page<Profile> findBySkill(@Param("skill") String skill, Pageable pageable);
}