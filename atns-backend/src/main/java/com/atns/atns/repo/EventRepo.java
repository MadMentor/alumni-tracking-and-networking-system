package com.atns.atns.repo;

import com.atns.atns.entity.Event;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EventRepo extends JpaRepository<Event, Integer> {
    @Query("SELECT e FROM Event e WHERE e.active = true")
    Page<Event> findAllActive(Pageable pageable);

    @Query("SELECT e FROM Event e WHERE e.active = true AND e.startTime > :now ORDER BY e.startTime ASC")
    List<Event> findUpcomingEvent(@Param("now") LocalDateTime now);

    @Query("""
            SELECT e FROM Event e
            WHERE e.active = true
            AND e.startTime BETWEEN :start AND :end
            """)
    List<Event> findEventsBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
