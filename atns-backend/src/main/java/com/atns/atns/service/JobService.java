package com.atns.atns.service;

import com.atns.atns.dto.job.JobRequestDto;
import com.atns.atns.dto.job.JobResponseDto;
import com.atns.atns.dto.job.JobUpdateDto;
import com.atns.atns.recommendation.dto.RecommendedJobDto;
import org.springframework.data.domain.Page;

import java.util.List;

public interface JobService {
    JobResponseDto createJob(JobRequestDto dto, Integer postedById);
    JobResponseDto getJobById(Integer jobId);
    Page<JobResponseDto> getAllJobs(int page, int size);
    Page<JobResponseDto> getActiveJobs(int page, int size);
    Page<JobResponseDto> getJobsByCompany(String companyName, int page, int size);
    Page<JobResponseDto> getJobsByLocation(String location, int page, int size);
    Page<JobResponseDto> getJobsByPoster(Integer postedById, int page, int size);
    Page<JobResponseDto> searchJobs(String title, String company, String location, List<String> skills, int page, int size);
    JobResponseDto updateJob(Integer jobId, JobUpdateDto updateDto, Integer currentUserId);
    void deleteJob(Integer jobId);
    List<RecommendedJobDto> recommendJobs(Integer profileId, int limit);
}