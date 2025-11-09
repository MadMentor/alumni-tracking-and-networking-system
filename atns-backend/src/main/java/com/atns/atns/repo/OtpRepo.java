package com.atns.atns.repo;

import com.atns.atns.entity.Otp;
import com.atns.atns.enums.OtpType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OtpRepo extends JpaRepository<Otp, Long> {
    @Modifying
    @Query("UPDATE Otp o SET o.used = true WHERE o.email = :email AND o.type = :type AND o.used = false")
    void invalidatePreviousOtps(@Param("email") String email, @Param("type") OtpType type);

    @Query("SELECT o FROM Otp o WHERE o.email = :email AND o.code = :code AND o.type = :type AND o.used = false AND o.expiresAt > :now")
    Optional<Otp> findValidOtp(@Param("email") String email, @Param("code") String code,
                               @Param("type") OtpType type, @Param("now") LocalDateTime now);

    boolean existsByEmailAndCodeAndTypeAndUsedFalseAndExpiresAtAfter(String email, String code, OtpType type, LocalDateTime now);

    List<Otp> findByEmailAndTypeAndUsedFalse(String email, OtpType type);
//    @Query("SELECT o FROM Otp WHERE o.email = :email AND o.type = :type AND o.used = false ")
//    List<Otp> findByEmailAndTypeAndUsedFalse(@Param("email") String email, @Param("type") OtpType type);
}
