package com.atns.atns.controller;

import com.atns.atns.dto.SkillDto;
import com.atns.atns.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RequestMapping("/api/skills")
@RestController
@Slf4j
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    @PostMapping
    public ResponseEntity<SkillDto> create(@RequestBody @Valid SkillDto skillDto) {
        log.info("Creating skill: {}", skillDto.getName());
        SkillDto saved = skillService.save(skillDto);
        log.info("Created skill: {}", saved.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<SkillDto> getById(@PathVariable Integer id) {
        log.info("Fetching skill by id: {}", id);
        return ResponseEntity.ok(skillService.findById(id));
    }
    
    @GetMapping
    public ResponseEntity<List<SkillDto>> getAll() {
        log.info("Fetching all skills");
        return ResponseEntity.ok(skillService.findAll());
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<SkillDto> update(@PathVariable Integer id, @RequestBody @Valid SkillDto skillDto) {
        if (!Objects.equals(skillDto.getId(), id)) {
            throw new IllegalArgumentException("Id in the URl does not match the Id in the request body");
        }
        log.info("Updating skill with Id; {}", id);
        SkillDto updated = skillService.update(skillDto);
        log.info("Updated skill: {}", updated);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        log.info("Deleting skill with id: {}", id);
        skillService.delete(id);
        log.info("Deleted skill: {}", id);
        return ResponseEntity.noContent().build();
    }
}
