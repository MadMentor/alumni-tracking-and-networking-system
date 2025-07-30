package com.atns.atns.repo;

import com.atns.atns.dto.ProfileDto;
import com.atns.atns.entity.Follow;
import com.atns.atns.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface FollowRepo extends JpaRepository<Follow, Integer> {
    boolean existsByFollowerAndFollowed(Profile follower, Profile followed);
    void deleteByFollowerAndFollowed(Profile follower, Profile followed);
    int countByFollowed(Profile profile);
    int countByFollower(Profile profile);

    @Query("SELECT f.follower FROM Follow f WHERE f.followed = :profile")
    Page<Profile> findByFollowed(@Param("profile") Profile profile, Pageable pageable);

    @Query("SELECT f.follwed FROM Follow f WHERE f.follower =: profile")
    Page<Profile> findByFollower(@Param("profile") Profile profile, Pageable pageable);
}
