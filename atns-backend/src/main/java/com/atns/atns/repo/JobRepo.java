package com.atns.atns.repo;

import com.atns.atns.entity.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface JobRepo extends JpaRepository<Job, Integer> {

    List<Job> findByCompanyNameContainingIgnoreCase(String companyName);
    Page<Job> findByCompanyNameContainingIgnoreCase(String companyName, Pageable pageable);

    List<Job> findByLocationContainingIgnoreCase(String location);
    Page<Job> findByLocationContainingIgnoreCase(String location, Pageable pageable);

    List<Job> findByExpiresAtAfter(LocalDateTime date);
    List<Job> findByExpiresAtBefore(LocalDateTime date);

    @Query("SELECT j FROM Job j WHERE j.postedAt >= :since")
    List<Job> findRecentJobs(@Param("since") LocalDateTime since);

    @Query("SELECT j FROM Job j JOIN j.requiredSkills s WHERE s.name = :skillName")
    List<Job> findBySkillName(@Param("skillName") String skillName);

    @Query("SELECT j FROM Job j WHERE j.expiresAt IS NULL OR j.expiresAt > CURRENT_TIMESTAMP")
    List<Job> findActiveJobs();

    @Query("SELECT j FROM Job j WHERE j.expiresAt IS NULL OR j.expiresAt > CURRENT_TIMESTAMP")
    Page<Job> findActiveJobs(Pageable pageable);

    List<Job> findByPostedById(Integer postedById);
    Page<Job> findByPostedById(Integer postedById, Pageable pageable);

    // Remove this method if you're not using it anymore
    // Optional<Job> findByIdWithDescription(Integer id);
}