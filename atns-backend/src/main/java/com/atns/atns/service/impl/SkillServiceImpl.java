package com.atns.atns.service.impl;

import com.atns.atns.converter.SkillConverter;
import com.atns.atns.dto.SkillDto;
import com.atns.atns.entity.Skill;
import com.atns.atns.repo.SkillRepo;
import com.atns.atns.service.SkillService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillConverter skillConverter;
    private final SkillRepo skillRepo;

    @Override
    public SkillDto save(SkillDto skillDto) {
        Skill skill = skillConverter.toEntity(skillDto);
        Skill saved = skillRepo.save(skill);
        log.info("Saved Skill: {}", saved);
        return skillConverter.toDto(saved);
    }

    @Override
    public SkillDto update(SkillDto skillDto) {
        Skill existingSkill = skillRepo.findById(skillDto.getId())
                .orElseThrow(() -> {
                    log.error("Skill not found");
                    return new RuntimeException("Skill not found");
                });

        existingSkill.setName(skillDto.getName());
        Skill saved = skillRepo.save(existingSkill);
        log.info("Updated Skill: {}", saved);
        return skillConverter.toDto(saved);
    }

    @Override
    public SkillDto findById(Integer id) {
        return skillRepo.findById(id)
                .map(skillConverter::toDto)
                .orElseThrow(() -> {
                    log.error("Skill with id {} not found!", id);
                    return new RuntimeException("Skill not Found!");
                });
    }

    @Override
    public List<SkillDto> findAll() {
        return skillRepo.findAll().stream()
                .map(skillConverter::toDto)
                .collect(Collectors.toList());
    }

    @Override
    public void delete(Integer id) {
        if (!skillRepo.existsById(id)) {
            log.warn("Attempted to delete non-existing skill with id {}", id);
            throw new RuntimeException("Skill not found!");
        }
        skillRepo.deleteById(id);
        log.info("Deleted Skill with Id: {}", id);
    }
}
