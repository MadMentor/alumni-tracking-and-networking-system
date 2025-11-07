package com.atns.atns.service;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.enums.ConnectionStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FollowService {
    void followProfile(Integer followerId, Integer followeeId);
    Page<ProfileDto> getFollowers(Integer profileId, Pageable pageable);
    Page<ProfileDto> getFollowing(Integer profileId, Pageable pageable);
    void unfollowProfile(Integer followerId, Integer followeeId);
    Long getFollowersCount(Integer profileId);
    Long getFollowingCount(Integer profileId);
    ConnectionStatus getConnectionStatus(Integer currentProfileId, Integer otherProfileId);
}
