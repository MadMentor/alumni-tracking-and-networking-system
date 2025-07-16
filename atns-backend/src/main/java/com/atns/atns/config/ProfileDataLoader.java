package com.atns.atns.config;

import com.atns.atns.entity.Profile;
import com.atns.atns.entity.User;
import com.atns.atns.repo.ProfileRepo;
import com.atns.atns.repo.UserRepo;
import jakarta.transaction.Transactional;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class ProfileDataLoader {

    @Bean
    @Transactional
    public CommandLineRunner loadProfiles(UserRepo userRepo, ProfileRepo profileRepo) {
        return args -> {
            Optional<User> optionalUser = Optional.ofNullable(userRepo.findByEmail("sumitsainju@gmail.com"));

            if (optionalUser.isPresent() && profileRepo.count() == 0) {
                User user = optionalUser.get();

                Profile profile = Profile.builder()
                        .firstName("Sumit")
                        .lastName("Sainju")
                        .bio("Java Developer")
                        .phoneNumber("982358695")
                        .address("Jadibuti")
                        .dateOfBirth(LocalDate.of(2001, 12, 13))
                        .user(user)
                        .build();

                profileRepo.save(profile);
                System.out.println("Dummy profile inserted for user: " + user.getUsername());
            }
        };
    }
}
