package com.atns.atns.constants;

import java.util.Set;

public class EventConstants {
    public static final Set<String> ALLOWED_SORT_FIELDS = Set.of(
            "id",
            "eventName",
            "startTime",
            "endTime",
            "createdAt",
            "category",
            "active"
    );

    // Pagination Configuration
    public static final int MIN_PAGE_SIZE = 1;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final int MAX_PAGE_SIZE = 100;

    // Field length constraints
    public static final int EVENT_NAME_MAX_LENGTH = 200;
    public static final int CATEGORY_MAX_LENGTH = 50;

    public EventConstants() {
        throw new AssertionError("Cannot instantiate EventConstants");
    }
}
