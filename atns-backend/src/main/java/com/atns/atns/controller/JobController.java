package com.atns.atns.controller;

import com.atns.atns.dto.job.JobRequestDto;
import com.atns.atns.dto.job.JobResponseDto;
import com.atns.atns.dto.job.JobUpdateDto;
import com.atns.atns.recommendation.dto.RecommendedJobDto;
import com.atns.atns.security.SecurityUtils;
import com.atns.atns.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/jobs")
@RequiredArgsConstructor
@Slf4j
public class JobController {

    private final JobService jobService;
    private final SecurityUtils securityUtils;

    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<JobResponseDto> create(@RequestBody @Valid JobRequestDto jobRequestDto) {
        log.info("Creating job with title: {}", jobRequestDto.getTitle());
        log.info("User ID: {}", securityUtils.getCurrentUserId());
        JobResponseDto saved = jobService.createJob(jobRequestDto, securityUtils.getCurrentUserId());
        log.info("Saved job with id: {}", saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // SPECIFIC ROUTES FIRST
    @GetMapping("/search")
    public ResponseEntity<Page<JobResponseDto>> searchJobs(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String company,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) List<String> skills,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        log.info("Searching jobs - title: {}, company: {}, location: {}, skills: {}",
                title, company, location, skills);

        return ResponseEntity.ok(jobService.searchJobs(title, company, location, skills, page, size));
    }

    @GetMapping("/active")
    public ResponseEntity<Page<JobResponseDto>> getActiveJobs(@RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching active jobs");
        return ResponseEntity.ok(jobService.getActiveJobs(page, size));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/my-jobs")
    public ResponseEntity<Page<JobResponseDto>> getMyJobs(@RequestParam(defaultValue = "0") int page,
                                                          @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching jobs posted by user: {}", securityUtils.getCurrentUserId());
        return ResponseEntity.ok(jobService.getJobsByPoster(securityUtils.getCurrentUserId(), page, size));
    }

    @GetMapping("/company/{companyName}")
    public ResponseEntity<Page<JobResponseDto>> getByCompany(@PathVariable String companyName,
                                                             @RequestParam(defaultValue = "0") int page,
                                                             @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching jobs by company: {}", companyName);
        return ResponseEntity.ok(jobService.getJobsByCompany(companyName, page, size));
    }

    @GetMapping("/location/{location}")
    public ResponseEntity<Page<JobResponseDto>> getByLocation(@PathVariable String location,
                                                              @RequestParam(defaultValue = "0") int page,
                                                              @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching jobs by location: {}", location);
        return ResponseEntity.ok(jobService.getJobsByLocation(location, page, size));
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendedJobDto>> getRecommendations(@RequestParam(defaultValue = "10") int limit) {
        log.info("Fetching job recommendations for user: {}", securityUtils.getCurrentUserId());
        return ResponseEntity.ok(jobService.recommendJobs(securityUtils.getCurrentUserId(), limit));
    }

    // PARAMETERIZED ROUTES LAST
    @GetMapping("/{id}")
    public ResponseEntity<JobResponseDto> getById(@PathVariable Integer id) {
        log.info("Fetching job by id: {}", id);
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @GetMapping
    public ResponseEntity<Page<JobResponseDto>> getAll(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "20") int size) {
        log.info("Fetching all jobs");
        return ResponseEntity.ok(jobService.getAllJobs(page, size));
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}")
    public ResponseEntity<JobResponseDto> update(@PathVariable Integer id, @RequestBody @Valid JobUpdateDto jobUpdateDto) {
        log.info("Updating job ID: {}", id);
        JobResponseDto updated = jobService.updateJob(id, jobUpdateDto, securityUtils.getCurrentUserId());
        log.info("Updated job ID: {}", updated.getId());
        return ResponseEntity.ok(updated);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        log.info("Deleting job ID: {}", id);
        jobService.deleteJob(id);
        log.info("Deleted job ID: {}", id);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/admin/{id}")
    public ResponseEntity<Void> deleteByAdmin(@PathVariable Integer id) {
        log.info("Admin deleting job ID: {}", id);
        jobService.deleteJob(id);
        log.info("Admin deleted job ID: {}", id);
        return ResponseEntity.noContent().build();
    }
}