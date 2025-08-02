package com.atns.atns.repo;

import com.atns.atns.entity.Follow;
import com.atns.atns.entity.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FollowRepo extends JpaRepository<Follow, Integer> {
    boolean existsByFollowerAndFollowed(Profile follower, Profile followed);
    void deleteByFollowerAndFollowed(Profile follower, Profile followed);
    long countByFollowed(Profile profile);
    long countByFollower(Profile profile);

    @Query("SELECT f.follower FROM Follow f WHERE f.followed = :profile")
    Page<Profile> findByFollowed(@Param("profile") Profile profile, Pageable pageable);

    @Query("SELECT f.followed FROM Follow f WHERE f.follower =: profile")
    Page<Profile> findByFollower(@Param("profile") Profile profile, Pageable pageable);

    @Query("""
            SELECT f.followed FROM Follow f
            WHERE f.follower = :profileId
            AND EXISTS (
                SELECT 1 FROM Follow f2
                WHERE f2.follower = f.followed AND f2.followed = :profileId)
            """)
    Page<Profile> getMutualConnection(Integer profileId, Pageable pageable);

    @Query("SELECT f.followed.id FROM Follow f WHERE f.follower.id = :followerId")
    List<Integer> findFollowedIdsByFollowerId(@Param("followerId") Integer followerId, Pageable pageable);
}
