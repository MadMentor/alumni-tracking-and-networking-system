package com.atns.atns.repo;

import com.atns.atns.entity.WhiteListEntry;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WhiteListRepo extends JpaRepository<WhiteListEntry, Long> {
    Optional<WhiteListEntry> findByEmailAndUsedFalse(String email);
    boolean existsByEmailAndUsedFalse(String email);
    List<WhiteListEntry> findByUsedFalse();
    void deleteByEmail(String email);

    @Query("SELECT w.role FROM WhiteListEntry w where  w.email = :email AND w.used = false")
    String findRoleByEmail(@Param("email") String email);
    WhiteListEntry findByEmail(String email);
}
