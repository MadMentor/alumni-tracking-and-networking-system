package com.atns.atns.service;

import com.atns.atns.entity.Profile;

import java.util.List;
import java.util.Map;

public interface ConnectionService {
    Map<Integer, Integer> findConnections(Integer startProfileId, int maxDegree);
}
