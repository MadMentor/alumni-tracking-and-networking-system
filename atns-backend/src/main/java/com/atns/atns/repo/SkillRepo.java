package com.atns.atns.repo;

import com.atns.atns.entity.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SkillRepo extends JpaRepository<Skill, Integer> {
    Optional<Skill> findByName(String name);
    boolean existsByName(String name);
}
