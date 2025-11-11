package com.atns.atns.recommendation.impl;

import com.atns.atns.entity.Event;
import com.atns.atns.entity.Job;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.Skill;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.recommendation.RecommendationService;
import com.atns.atns.recommendation.dto.RecommendedEventDto;
import com.atns.atns.recommendation.dto.RecommendedJobDto;
import com.atns.atns.recommendation.dto.RecommendedUserDto;
import com.atns.atns.recommendation.util.SimilarityCalculator;
import com.atns.atns.repo.EventRepo;
import com.atns.atns.repo.JobRepo;
import com.atns.atns.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final ProfileRepo profileRepo;
    private final EventRepo eventRepo;
    private final JobRepo jobRepo;

    @Transactional(readOnly = true)
    @Override
    public List<RecommendedEventDto> recommendEvents(Integer profileId, int limit) {
        Profile profile = profileRepo.findById(profileId).orElseThrow(() -> {
            log.error("Profile with id {} not found!", profileId);
            return new ResourceNotFoundException("Profile", profileId);
        });
        Set<String> userSkillNames = profile.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        List<Event> events = eventRepo.findUpcomingEvent(LocalDateTime.now(), Pageable.unpaged()).getContent();

        return events.stream().map(event -> {
                    Set<String> organizerSkills = event.getOrganizer().getSkills().stream()
                            .map(Skill::getName)
                            .collect(Collectors.toSet());

                    // Skill similarity (weight: 0.5)
                    double skillScore = SimilarityCalculator.jaccardSimilarity(userSkillNames, organizerSkills);

                    // Category match (weight: 0.2)
                    double categoryScore = 0.0;
                    if (event.getCategory() != null) {
                        for (String skill : userSkillNames) {
                            if (skill.equalsIgnoreCase(event.getCategory())) {
                                categoryScore = 1.0;
                                break;
                            }
                        }
                    }

                    // Organizer connection (weight: 0.2)
                    boolean isConnected = profile.getFollowing().stream()
                            .anyMatch(f -> f.getFollowed().getId().equals(event.getOrganizer().getId()));
                    double connectionScore = isConnected ? 1.0 : 0.0;

                    // Upcoming event priority (weight: 0.1)
                    long hoursUntilStart = java.time.Duration.between(java.time.LocalDateTime.now(), event.getStartTime()).toHours();
                    double timeScore = hoursUntilStart <= 0 ? 0 : 1.0 / (1 + hoursUntilStart);

                    // Weighted sum
                    double totalScore = skillScore * 0.5 + categoryScore * 0.2 + connectionScore * 0.2 + timeScore * 0.1;

                    totalScore = Math.max(0.05, totalScore);

                    String location = event.getLocation() != null
                            ? (event.getLocation().getAddress() != null ? event.getLocation().getAddress() : event.getLocation().getOnlineLink())
                            : "";

                    return RecommendedEventDto.builder()
                            .eventId(event.getId())
                            .eventName(event.getEventName())
                            .category(event.getCategory())
                            .startTime(event.getStartTime())
                            .location(location)
                            .score(totalScore)
                            .build();
                })
                .sorted(Comparator.comparingDouble(RecommendedEventDto::getScore).reversed()
                        .thenComparing(RecommendedEventDto::getStartTime))
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<RecommendedUserDto> recommendUsers(Integer profileId, int limit) {
        Profile profile = profileRepo.findById(profileId).orElseThrow(() -> {
            log.error("Profile with id {} not found!", profileId);
            return new ResourceNotFoundException("Profile", profileId);
        });

        Set<String> userSkillNames = profile.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        List<Profile> allProfiles = profileRepo.findAll();

        return allProfiles.stream()
                .filter(p -> !p.getId().equals(profileId)) // exclude self
                .map(p -> {
                    Set<String> profileSkillNames = p.getSkills().stream()
                            .map(Skill::getName)
                            .collect(Collectors.toSet());


                    // Skill similarity (weight: 0.5)
                    double skillScore = SimilarityCalculator.jaccardSimilarity(userSkillNames, profileSkillNames);

                    // Faculty match (weight: 0.2)
                    double facultyScore = profile.getFaculty().equalsIgnoreCase(p.getFaculty()) ? 1.0 : 0.0;

                    // Batch year closeness (weight: 0.2)
                    int yearDiff = Math.abs(profile.getBatchYear() - p.getBatchYear());
                    double batchScore = 1.0 / (1 + yearDiff); // smaller difference = higher score

                    // Mutual connection (weight: 0.1)
                    boolean isConnected = profile.getFollowing().stream().anyMatch(f -> f.getFollowed().getId().equals(p.getId())) ||
                            profile.getFollowers().stream().anyMatch(f -> f.getFollower().getId().equals(p.getId()));
                    double connectionScore = isConnected ? 1.0 : 0.0;

                    // Weighted sum
                    double totalScore = skillScore * 0.5 + facultyScore * 0.2 + batchScore * 0.2 + connectionScore * 0.1;

                    totalScore = Math.max(0.05, totalScore);

                    return RecommendedUserDto.builder()
                            .profileId(p.getId())
                            .firstName(p.getFirstName())
                            .lastName(p.getLastName())
                            .faculty(p.getFaculty())
                            .skills(p.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                            .score(totalScore)
                            .profileImageUrl(p.getProfileImageUrl())
                            .currentPosition(p.getCurrentPosition())
                            .build();
                })
                .filter(u -> u.getScore() > 0.0)
                .sorted(Comparator.comparingDouble(RecommendedUserDto::getScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    @Override
    public List<RecommendedJobDto> recommendJobs(Integer profileId, int limit) {
        Profile profile = profileRepo.findById(profileId).orElseThrow(() -> {
            log.error("Profile with id {} not found!", profileId);
            return new ResourceNotFoundException("Profile", profileId);
        });

        Set<String> userSkills = profile.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        // Get all active jobs
        List<Job> activeJobs = jobRepo.findActiveJobs();

        // Calculate IDF scores for skills across all jobs
        Map<String, Double> idfScores = calculateIdfScores(activeJobs);

        return activeJobs.stream()
                .map(job -> {
                    Set<String> jobSkills = job.getRequiredSkills().stream()
                            .map(Skill::getName)
                            .collect(Collectors.toSet());

                    // 1. Skill Match using Cosine Similarity with TF-IDF (Weight: 0.5)
                    double skillScore = SimilarityCalculator.cosineSimilarityWithTFIDF(userSkills, jobSkills, idfScores);

                    // 2. Location Preference (Weight: 0.2)
                    double locationScore = calculateLocationScore(profile, job);

                    // 3. Company Preference (Weight: 0.15)
                    double companyScore = calculateCompanyScore(profile, job);

                    // 4. Job Freshness (Weight: 0.1)
                    double freshnessScore = calculateFreshnessScore(job);

                    // 5. Experience Level Match (Weight: 0.05)
                    double experienceScore = calculateExperienceScore(profile, job);

                    // Weighted sum
                    double totalScore = skillScore * 0.5 +
                            locationScore * 0.2 +
                            companyScore * 0.15 +
                            freshnessScore * 0.1 +
                            experienceScore * 0.05;

                    // Apply boost for jobs posted by connections
                    double connectionBoost = calculateConnectionBoost(profile, job);
                    totalScore *= (1.0 + connectionBoost);

                    // Ensure minimum score for diversity
                    totalScore = Math.max(0.05, totalScore);

                    return RecommendedJobDto.builder()
                            .jobId(job.getId())
                            .title(job.getTitle())
                            .companyName(job.getCompanyName())
                            .location(job.getLocation())
                            .requiredSkills(jobSkills)
                            .similarityScore(totalScore)
                            .build();
                })
                .sorted(Comparator.comparingDouble(RecommendedJobDto::getSimilarityScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Calculate IDF (Inverse Document Frequency) scores for skills
     * IDF = log(total_jobs / (number_of_jobs_with_skill + 1))
     */
    private Map<String, Double> calculateIdfScores(List<Job> jobs) {
        Map<String, Integer> skillFrequency = new HashMap<>();
        int totalJobs = jobs.size();

        // Count frequency of each skill across all jobs
        for (Job job : jobs) {
            Set<String> jobSkills = job.getRequiredSkills().stream()
                    .map(Skill::getName)
                    .collect(Collectors.toSet());

            for (String skill : jobSkills) {
                skillFrequency.put(skill, skillFrequency.getOrDefault(skill, 0) + 1);
            }
        }

        // Calculate IDF scores
        Map<String, Double> idfScores = new HashMap<>();
        for (Map.Entry<String, Integer> entry : skillFrequency.entrySet()) {
            double idf = Math.log((double) totalJobs / (entry.getValue() + 1));
            idfScores.put(entry.getKey(), idf);
        }

        return idfScores;
    }

    private double calculateLocationScore(Profile profile, Job job) {
        if (job.getLocation() == null || profile.getAddress() == null) {
            return 0.3; // Neutral score if location info is missing
        }

        String userLocation = profile.getAddress().toLowerCase();
        String jobLocation = job.getLocation().toLowerCase();

        // Exact match
        if (userLocation.contains(jobLocation) || jobLocation.contains(userLocation)) {
            return 1.0;
        }

        // Check for common location keywords
        Set<String> commonLocations = Set.of("remote", "kathmandu", "pokhara", "lalitpur", "bhaktapur");
        boolean userHasCommonLocation = commonLocations.stream().anyMatch(userLocation::contains);
        boolean jobHasCommonLocation = commonLocations.stream().anyMatch(jobLocation::contains);

        if (userHasCommonLocation && jobHasCommonLocation) {
            return 0.7;
        }

        // Remote work preference
        if (jobLocation.contains("remote") && userLocation.contains("remote")) {
            return 0.9;
        }

        return 0.2; // Default low score for different locations
    }

    /**
     * Calculate company preference score based on user's network
     */
    private double calculateCompanyScore(Profile profile, Job job) {
        // Check if user follows anyone who works at this company
        boolean hasConnectionAtCompany = profile.getFollowing().stream()
                .anyMatch(follow -> {
                    Profile followed = follow.getFollowed();
                    return followed.getCurrentPosition() != null &&
                            followed.getCurrentPosition().toLowerCase().contains(job.getCompanyName().toLowerCase());
                });

        return hasConnectionAtCompany ? 1.0 : 0.3;
    }

    /**
     * Calculate job freshness score - newer jobs get higher scores
     */
    private double calculateFreshnessScore(Job job) {
        if (job.getPostedAt() == null) {
            return 0.5;
        }

        long daysOld = java.time.Duration.between(job.getPostedAt(), LocalDateTime.now()).toDays();

        if (daysOld <= 1) return 1.0;      // Posted today
        if (daysOld <= 7) return 0.8;      // Posted this week
        if (daysOld <= 30) return 0.6;     // Posted this month
        if (daysOld <= 90) return 0.4;     // Posted last 3 months

        return 0.2; // Older than 3 months
    }

    /**
     * Calculate experience level match
     */
    private double calculateExperienceScore(Profile profile, Job job) {
        // Simple heuristic based on job title keywords
        String jobTitle = job.getTitle().toLowerCase();
        String userPosition = profile.getCurrentPosition() != null ?
                profile.getCurrentPosition().toLowerCase() : "";

        Set<String> seniorKeywords = Set.of("senior", "lead", "principal", "manager", "director");
        Set<String> midKeywords = Set.of("mid", "intermediate", "engineer", "developer");
        Set<String> juniorKeywords = Set.of("junior", "entry", "intern", "trainee", "fresh");

        // Determine job level
        String jobLevel = "mid"; // default
        if (seniorKeywords.stream().anyMatch(jobTitle::contains)) {
            jobLevel = "senior";
        } else if (juniorKeywords.stream().anyMatch(jobTitle::contains)) {
            jobLevel = "junior";
        }

        // Determine user level (simplified)
        String userLevel = "mid"; // default
        if (seniorKeywords.stream().anyMatch(userPosition::contains)) {
            userLevel = "senior";
        } else if (juniorKeywords.stream().anyMatch(userPosition::contains) ||
                profile.getBatchYear() >= LocalDateTime.now().getYear() - 2) {
            userLevel = "junior";
        }

        // Score based on level match
        if (jobLevel.equals(userLevel)) return 1.0;
        if ("senior".equals(userLevel) && "mid".equals(jobLevel)) return 0.8;
        if ("mid".equals(userLevel) && "junior".equals(jobLevel)) return 0.6;

        return 0.3; // Mismatch
    }

    /**
     * Calculate connection boost - jobs posted by connections get a boost
     */
    private double calculateConnectionBoost(Profile profile, Job job) {
        if (job.getPostedBy() == null) {
            return 0.0;
        }

        // Check if the job poster is in user's network
        boolean isConnected = profile.getFollowing().stream()
                .anyMatch(follow -> follow.getFollowed().getId().equals(job.getPostedBy().getId()));

        return isConnected ? 0.2 : 0.0; // 20% boost for connections
    }
}
