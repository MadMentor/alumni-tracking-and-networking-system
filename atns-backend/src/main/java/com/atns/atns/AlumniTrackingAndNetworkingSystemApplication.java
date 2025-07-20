package com.atns.atns;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing(auditorAwareRef = "auditorProvider")
@SpringBootApplication
public class AlumniTrackingAndNetworkingSystemApplication {

    public static void main(String[] args) {
        SpringApplication.run(AlumniTrackingAndNetworkingSystemApplication.class, args);
    }

}
