package com.atns.atns.service.impl;

import com.atns.atns.converter.ProfileConverter;
import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.Follow;
import com.atns.atns.entity.Profile;
import com.atns.atns.exception.ResourceNotFoundException;
import com.atns.atns.repo.FollowRepo;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.service.FollowService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class FollowServiceImpl implements FollowService {
    private final ProfileRepo profileRepo;
    private final FollowRepo followRepo;
    private final ProfileConverter profileConverter;

    @Override
    @Transactional
    public void followProfile(Integer followerId, Integer followedId) {
        Profile follower = validateProfileExists(followerId);
        Profile followed = validateProfileExists(followedId);

        if (followRepo.existsByFollowerAndFollowed(follower, followed)) {
            throw new IllegalStateException("Already following this profile");
        }

        if (follower.equals(followed)) {
            throw new IllegalArgumentException("Cannot follow yourself");
        }

        Follow follow = Follow.builder()
                .follower(follower)
                .followed(followed)
                .build();

        followRepo.save(follow);
    }

    @Override
    @Transactional
    public void unfollowProfile(Integer followerId, Integer followedId) {
        Profile follower = validateProfileExists(followedId);
        Profile followed = validateProfileExists(followerId);

        if (!followRepo.existsByFollowerAndFollowed(follower, followed)) {
            throw new IllegalStateException("Not following this profile");
        }

        followRepo.deleteByFollowerAndFollowed(follower, followed);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProfileDto> getFollowers(Integer profileId, Pageable pageable) {
        Profile profile = validateProfileExists(profileId);

        return followRepo.findByFollowed(profile,pageable)
                .map(profileConverter::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ProfileDto> getFollowing(Integer profileId, Pageable pageable) {
        Profile profile = validateProfileExists(profileId);

        return followRepo.findByFollower(profile, pageable)
                .map(profileConverter::toDto);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getFollowersCount(Integer profileId) {
        Profile profile = validateProfileExists(profileId);

        return followRepo.countByFollowed(profile);
    }

    @Override
    @Transactional(readOnly = true)
    public Long getFollowingCount(Integer profileId) {
        Profile profile = validateProfileExists(profileId);

        return followRepo.countByFollowed(profile);
    }

    private Profile validateProfileExists(Integer profileId) {
        return profileRepo.findById(profileId)
                .orElseThrow(() -> new ResourceNotFoundException("Profile", profileId));
    }
}
