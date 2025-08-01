package com.atns.atns.service;

import com.atns.atns.dto.ProfileDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {
    void followProfile(Integer followerId, Integer followeeId);
    Page<ProfileDto> getFollowers(Integer profileId, Pageable pageable);
    Page<ProfileDto> getFollowing(Integer profileId, Pageable pageable);
    void unfollowProfile(Integer followerId, Integer followeeId);
    Integer getFollowersCount(Integer profileId);
    Integer getFollowingCount(Integer profileId);
}
