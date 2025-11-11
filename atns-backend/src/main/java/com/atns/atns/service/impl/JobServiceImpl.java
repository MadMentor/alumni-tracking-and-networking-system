package com.atns.atns.service.impl;

import com.atns.atns.converter.JobConverter;
import com.atns.atns.dto.job.JobRequestDto;
import com.atns.atns.dto.job.JobResponseDto;
import com.atns.atns.dto.job.JobUpdateDto;
import com.atns.atns.entity.Job;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.Skill;
import com.atns.atns.exception.JobNotFoundException;
import com.atns.atns.exception.UnauthorizedJobAccessException;
import com.atns.atns.repo.JobRepo;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.repo.SkillRepo;
import com.atns.atns.recommendation.dto.RecommendedJobDto;
import com.atns.atns.repo.UserRepo;
import com.atns.atns.service.JobService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class JobServiceImpl implements JobService {

    private final JobRepo jobRepo;
    private final ProfileRepo profileRepo;
    private final SkillRepo skillRepo;
    private final JobConverter jobConverter;
    private final UserRepo userRepo;

    @Override
    @Transactional
    public JobResponseDto createJob(JobRequestDto dto, Integer postedById) {
        log.info("Creating new job by profile ID: {}", postedById);

        Profile poster = userRepo.findById(postedById)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + postedById))
                .getProfile();

        Job job = Job.builder()
                .title(dto.getTitle())
                .companyName(dto.getCompanyName())
                .location(dto.getLocation())
                .description(dto.getDescription())
                .postedBy(poster)
                .postedAt(LocalDateTime.now())
                .expiresAt(dto.getExpiresAt())
                .build();

        // Handle skills
        if (dto.getSkills() != null && !dto.getSkills().isEmpty()) {
            Set<Skill> skills = resolveSkills(dto.getSkills());
            job.setRequiredSkills(skills);
        }

        Job savedJob = jobRepo.save(job);
        log.info("Job created successfully with ID: {}", savedJob.getId());

        return jobConverter.toResponseDto(savedJob);
    }

    @Override
    @Transactional(readOnly = true)
    public JobResponseDto getJobById(Integer jobId) {
        log.debug("Fetching job by ID: {}", jobId);

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException(jobId));

        return jobConverter.toDetailedResponseDto(job);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getAllJobs(int page, int size) {
        log.debug("Fetching all jobs - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        return jobRepo.findAll(pageable)
                .map(jobConverter::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getActiveJobs(int page, int size) {
        log.debug("Fetching active jobs - page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        return jobRepo.findActiveJobs(pageable)
                .map(jobConverter::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getJobsByCompany(String companyName, int page, int size) {
        log.debug("Fetching jobs by company: {} - page: {}, size: {}", companyName, page, size);

        Pageable pageable = PageRequest.of(page, size);
        return jobRepo.findByCompanyNameContainingIgnoreCase(companyName, pageable)
                .map(jobConverter::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getJobsByLocation(String location, int page, int size) {
        log.debug("Fetching jobs by location: {} - page: {}, size: {}", location, page, size);

        Pageable pageable = PageRequest.of(page, size);
        return jobRepo.findByLocationContainingIgnoreCase(location, pageable)
                .map(jobConverter::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> getJobsByPoster(Integer postedById, int page, int size) {
        log.debug("Fetching jobs posted by profile ID: {} - page: {}, size: {}", postedById, page, size);

        Pageable pageable = PageRequest.of(page, size);
        return jobRepo.findByPostedById(postedById, pageable)
                .map(jobConverter::toResponseDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobResponseDto> searchJobs(String title, String company, String location, List<String> skills, int page, int size) {
        log.debug("Searching jobs - title: {}, company: {}, location: {}, skills: {}", title, company, location, skills);

        Pageable pageable = PageRequest.of(page, size);
        // For now, return all jobs - implement actual search logic later
        return jobRepo.findAll(pageable)
                .map(jobConverter::toResponseDto);
    }

    @Override
    @Transactional
    public JobResponseDto updateJob(Integer jobId, JobUpdateDto updateDto, Integer currentUserId) {
        log.info("Updating job with ID: {}", jobId);

        Job job = jobRepo.findById(jobId)
                .orElseThrow(() -> new JobNotFoundException(jobId));

        if (!job.getPostedBy().getId().equals(currentUserId)) {
            throw new UnauthorizedJobAccessException(jobId);
        }

        // Update fields if provided
        if (updateDto.getTitle() != null) {
            job.setTitle(updateDto.getTitle());
        }
        if (updateDto.getDescription() != null) {
            job.setDescription(updateDto.getDescription());
        }
        if (updateDto.getCompanyName() != null) {
            job.setCompanyName(updateDto.getCompanyName());
        }
        if (updateDto.getLocation() != null) {
            job.setLocation(updateDto.getLocation());
        }
        if (updateDto.getExpiresAt() != null) {
            job.setExpiresAt(updateDto.getExpiresAt());
        }

        // Update skills if provided
        if (updateDto.getSkills() != null) {
            Set<Skill> skills = resolveSkills(updateDto.getSkills());
            job.setRequiredSkills(skills);
        }

        Job updatedJob = jobRepo.save(job);
        log.info("Job updated successfully with ID: {}", jobId);

        return jobConverter.toResponseDto(updatedJob);
    }

    @Override
    @Transactional
    public void deleteJob(Integer jobId) {
        log.info("Deleting job with ID: {}", jobId);

        if (!jobRepo.existsById(jobId)) {
            throw new JobNotFoundException(jobId);
        }

        jobRepo.deleteById(jobId);
        log.info("Job deleted successfully with ID: {}", jobId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<RecommendedJobDto> recommendJobs(Integer profileId, int limit) {
        log.debug("Generating job recommendations for profile ID: {} with limit: {}", profileId, limit);

        // TODO: Implement actual recommendation logic
        // For now, returning active jobs as placeholder
        return jobRepo.findActiveJobs(PageRequest.of(0, limit)).stream()
                .map(this::convertToRecommendedJobDto)
                .collect(Collectors.toList());
    }

    private Set<Skill> resolveSkills(Set<String> skillNames) {
        Set<Skill> skills = new HashSet<>();

        for (String skillName : skillNames) {
            Skill skill = skillRepo.findByName(skillName)
                    .orElseGet(() -> {
                        Skill newSkill = Skill.builder()
                                .name(skillName)
                                .build();
                        return skillRepo.save(newSkill);
                    });
            skills.add(skill);
        }

        return skills;
    }

    private RecommendedJobDto convertToRecommendedJobDto(Job job) {
        return RecommendedJobDto.builder()
                .jobId(job.getId())
                .title(job.getTitle())
                .companyName(job.getCompanyName())
                .location(job.getLocation())
                .requiredSkills(job.getRequiredSkills().stream()
                        .map(Skill::getName)
                        .collect(Collectors.toSet()))
                .similarityScore(0.0) // Placeholder - implement actual scoring
                .build();
    }
}