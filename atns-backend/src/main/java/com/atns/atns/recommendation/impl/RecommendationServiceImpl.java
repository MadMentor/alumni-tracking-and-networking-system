package com.atns.atns.recommendation.impl;

import com.atns.atns.entity.Event;
import com.atns.atns.entity.Profile;
import com.atns.atns.entity.Skill;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.recommendation.RecommendationService;
import com.atns.atns.recommendation.dto.RecommendedEventDto;
import com.atns.atns.recommendation.dto.RecommendedUserDto;
import com.atns.atns.recommendation.util.SimilarityCalculator;
import com.atns.atns.repo.EventRepo;
import com.atns.atns.repo.ProfileRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class RecommendationServiceImpl implements RecommendationService {

    private final ProfileRepo profileRepo;
    private final EventRepo eventRepo;

    @Override
    public List<RecommendedEventDto> recommendEvents(Integer profileId, int limit) {
        Profile profile = profileRepo.findById(profileId).orElseThrow(() -> {
            log.error("Profile with id {} not found!", profileId);
            return new ResourceNotFoundException("Profile", profileId);
        });
        Set<String> userSkillNames = profile.getSkills().stream()
                .map(Skill::getName)
                .collect(Collectors.toSet());

        List<Event> events = eventRepo.findAllActive(); // you can filter by future events

        return events.stream().map(event -> {
                    Set<String> eventSkillNames = event.getOrganizer().getSkills().stream()
                            .map(Skill::getName)
                            .collect(Collectors.toSet());

                    double score = SimilarityCalculator.jaccardSimilarity(userSkillNames, eventSkillNames);

                    String location = event.getLocation() != null ?
                            (event.getLocation().getAddress() != null ? event.getLocation().getAddress() : event.getLocation().getOnlineLink()) : "";

                    return RecommendedEventDto.builder()
                            .eventId(event.getId())
                            .eventName(event.getEventName())
                            .category(event.getCategory())
                            .startTime(event.getStartTime())
                            .location(location)
                            .score(score)
                            .build();
                })
                .sorted(Comparator.comparingDouble(RecommendedEventDto::getScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }

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

                    return RecommendedUserDto.builder()
                            .profileId(p.getId())
                            .firstName(p.getFirstName())
                            .lastName(p.getLastName())
                            .faculty(p.getFaculty())
                            .skills(p.getSkills().stream().map(Skill::getName).collect(Collectors.toSet()))
                            .score(totalScore)
                            .build();
                })
                .sorted(Comparator.comparingDouble(RecommendedUserDto::getScore).reversed())
                .limit(limit)
                .collect(Collectors.toList());
    }
}
