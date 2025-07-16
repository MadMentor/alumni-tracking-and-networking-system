package com.atns.atns.config;

import com.atns.atns.entity.User;
import com.atns.atns.enums.Role;
import com.atns.atns.repo.UserRepo;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Collections;

@Configuration
public class DataInitializer {
    @Bean
    public CommandLineRunner initUsers(UserRepo userRepo) {
        return args -> {
            if(userRepo.count() == 0) {
                User user1 = User.builder()
                        .username("Sumit")
                        .email("sumitsainju@gmail.com")
                        .password("test12345")
                        .roles(Collections.singleton(Role.STUDENT))
                        .build();

                User user2 = User.builder()
                        .username("Hari")
                        .email("hari@gmail.com")
                        .password("test12345")
                        .roles(Collections.singleton(Role.STUDENT))
                        .build();

                User user3 = User.builder()
                        .username("Sumit Sainju")
                        .email("email@gmail.com")
                        .password("test12345")
                        .roles(Collections.singleton(Role.ADMIN))
                        .build();

                userRepo.save(user1);
                userRepo.save(user2);
                userRepo.save(user3);

                System.out.println("Dummy users inserted.");
            }
        };
    }
}
