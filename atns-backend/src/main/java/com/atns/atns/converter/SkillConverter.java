package com.atns.atns.converter;

import com.atns.atns.dto.SkillDto;
import com.atns.atns.entity.Skill;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class SkillConverter extends AbstractConverter<SkillDto, Skill> {
    @Override
    public SkillDto toDto(Skill skill) {
        if(skill == null) return null;
        return SkillDto.builder()
                .id(skill.getId())
                .name(skill.getName())
                .build();
    }

    @Override
    public Skill toEntity(SkillDto skillDto) {
        if(skillDto == null) return null;

        Skill entity = new Skill();

        entity.setId(skillDto.getId());
        entity.setName(skillDto.getName().trim().toLowerCase());

        return entity;
    }
}
