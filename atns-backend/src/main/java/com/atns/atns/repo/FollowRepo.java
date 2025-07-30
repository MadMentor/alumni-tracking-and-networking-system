package com.atns.atns.repo;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.Follow;
import com.atns.atns.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepo extends JpaRepository<Follow, Integer> {
    boolean existsByFollowerAndFollowed(Profile follower, Profile followed);
    void deleteByFollowerAndFollowed(Profile follower, Profile followed);
    long countByFollowed(Profile profile);
    long countByFollower(Profile profile);
    Page<ProfileDto> findByFollowed(Profile profile, Pageable pageable);
}
