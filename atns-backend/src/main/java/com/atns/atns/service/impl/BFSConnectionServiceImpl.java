package com.atns.atns.service.impl;

import com.atns.atns.exception.ConnectionDiscoveryException;
import com.atns.atns.repo.FollowRepo;
import com.atns.atns.service.ConnectionService;
import com.atns.atns.service.ProfileService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class BFSConnectionServiceImpl implements ConnectionService {
    private static final int BATCH_SIZE = 100;
    private final FollowRepo followRepo;
    private final ProfileService profileService;

    @Override
    @Transactional(readOnly = true)
    public Map<Integer, Integer> findConnections(Integer startProfileId, int maxDegree) {
        validateInput(startProfileId, maxDegree);
        log.debug("Discovering connections for profile {} up to {} degrees", startProfileId, maxDegree);

        try {
            Map<Integer, Integer> degreeMap = new LinkedHashMap<>();
            Set<Integer> visited = new HashSet<>();
            Queue<ProfileDegree> queue = new LinkedList<>();

            // Initialize with starting profile
            visited.add(startProfileId);
            queue.add(new ProfileDegree(startProfileId, 0));

            while (!queue.isEmpty()) {
                ProfileDegree current = queue.poll();

                if (current.degree() >= maxDegree) continue;

                processConnectionsBatch(current, queue, visited, degreeMap);
            }

            log.info("Found {} connections for profile {}", degreeMap.size(), startProfileId);
            return degreeMap;
        } catch (Exception e) {
            log.error("Connection discovery failed for profile {}", startProfileId, e);
            throw new ConnectionDiscoveryException("Failed to discover connections", e);
        }
    }

    private void processConnectionsBatch(ProfileDegree current, Queue<ProfileDegree> queue,
                                         Set<Integer> visited, Map<Integer, Integer> degreeMap) {
        int page = 0;
        List<Integer> connections;

        do {
            PageRequest pageable = PageRequest.of(page++, BATCH_SIZE);
            connections = followRepo.findFollowedIdsByFollowerId(current.profileId(), pageable);

            for (Integer connectionId : connections) {
                if (!visited.contains(connectionId)) {
                    visited.add(connectionId);
                    int newDegree = current.degree() + 1;
                    degreeMap.put(connectionId, newDegree);
                    queue.add(new ProfileDegree(connectionId, newDegree));
                }
            }
        } while (!connections.isEmpty());
    }

    private void validateInput(Integer profileId, int maxDegree) {
        if (profileId == null) {
            throw new IllegalArgumentException("Profile ID cannot be null");
        }
        if (maxDegree < 1 || maxDegree > 3) {
            throw new IllegalArgumentException("Max degree must be between 1 and 3");
        }
        // Verify profile exists
        profileService.findById(profileId);
    }

    private record ProfileDegree(Integer profileId, int degree) {}
}