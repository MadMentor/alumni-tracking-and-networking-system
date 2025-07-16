//package com.atns.atns.config;
//
//import com.atns.atns.entity.Profile;
//import com.atns.atns.entity.Skill;
//import com.atns.atns.repo.ProfileRepo;
//import com.atns.atns.repo.SkillRepo;
//import jakarta.transaction.Transactional;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//
//import java.util.Optional;
//import java.util.Set;
//
//@Configuration
//public class SkillDataLoader {
//
//    @Bean
//    @Transactional
//    public CommandLineRunner loadSkills(SkillRepo skillRepo, ProfileRepo profileRepo) {
//        return args -> {
//            if(skillRepo.count() == 0) {
//                Skill java = Skill.builder().name("Java").build();
//                Skill spring = Skill.builder().name("Spring Boot").build();
//                Skill sql = Skill.builder().name("SQL").build();
//
//                skillRepo.saveAll(Set.of(java, spring, sql));
//                System.out.println("Dummy skill inserted!!!");
//            }
//
//            Optional<Profile> optionalProfile = profileRepo.findById(1);
//
//            if(optionalProfile.isPresent()) {
//                Profile profile = optionalProfile.get();
//
//                Skill java = skillRepo.findByName("Java").orElseThrow();
//                Skill spring = skillRepo.findByName("Spring Boot").orElseThrow();
//
//                profile.getSkills().add(java);
//                profile.getSkills().add(spring);
//
//                profileRepo.save(profile);
//
//                System.out.println("Skills linked to profile: " + profile.getFirstName());
//            } else {
//                System.out.println("No profile found");
//            }
//        };
//    }
//}
