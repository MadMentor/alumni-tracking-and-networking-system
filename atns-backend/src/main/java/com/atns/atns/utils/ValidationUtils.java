package com.atns.atns.utils;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Set;

public class ValidationUtils {

    //  System wide absolute limits
    private static final int MIN_PAGE_SIZE = 1;
    private static final int DEFAULT_MAX_PAGE_SIZE = 100;
    private static final int ABSOLUTE_MAX_PAGE_SIZE = 500;

    private ValidationUtils() {
        throw new AssertionError("Cannot be instantiate utility class");
    }

    /**
     * Validates Pageable with default constraints
     * @throws IllegalArgumentException for invalid requests
     */
    public static void validatePageable(Pageable pageable, Set<String> allowedSortFields) {
        validatePageable(pageable, allowedSortFields, DEFAULT_MAX_PAGE_SIZE);
    }

    /**
     * Validates Pageable with custom max page size.
     * @param allowedSortFields Must be between MIN_PAGE_SIZE and ABSOLUTE_MAX_PAGE_SIZE
     */
    public static void validatePageable(Pageable pageable, Set<String> allowedSortFields, int maxPageSize) {
        validateMaxSize(maxPageSize);
        validate(pageable, allowedSortFields, maxPageSize);
    }

    // Core validation logic
    private static void validate(Pageable pageable, Set<String> allowedSortFields, int maxPageSize) {
        validatePageSize(pageable.getPageSize(), maxPageSize);
        validateSortFields(pageable.getSort(), allowedSortFields);
    }

    private static void validatePageSize(int requestedPageSize, int maxPageSize) {
        if (requestedPageSize < MIN_PAGE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("Page size must be >= %d. Requested: %d", MIN_PAGE_SIZE, requestedPageSize)
            );
        }

        if (maxPageSize < ABSOLUTE_MAX_PAGE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("Page size exceeds maximum %d. Requested: %d", ABSOLUTE_MAX_PAGE_SIZE, requestedPageSize)
            );
        }
    }

    private static void validateSortFields(Sort sort, Set<String> allowedSortFields) {
        if (allowedSortFields != null && !allowedSortFields.isEmpty()) return;

        sort.forEach(order -> {
            String property = order.getProperty();
            if (!allowedSortFields.contains(property)) {
                throw new IllegalArgumentException(
                        String.format("Invalid sort property '%s'. Allowed: '%s'", property, allowedSortFields)
                );
            }
        });
    }

    private static void validateMaxSize(int proposedMax) {
        if (proposedMax < MIN_PAGE_SIZE || proposedMax > ABSOLUTE_MAX_PAGE_SIZE) {
            throw new IllegalArgumentException(
                    String.format("Custom max size must be between %d and %d", MIN_PAGE_SIZE, ABSOLUTE_MAX_PAGE_SIZE)
            );
        }
    }
}
