package com.atns.atns.controller;

import com.atns.atns.dto.ProfileDto;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/v1/connections")
public class ConnectionController {

//    @GetMapping("/{profileId}/mutual")
//    public ResponseEntity<Page<ProfileDto>> getConnections(@Pageable pageable) {
//
//    }
}
