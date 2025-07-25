package com.atns.atns.utils;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import java.util.Set;

public class ValidationUtils {

    private static final int DEFAULT_MAX_PAGE_SIZE = 100;
    private static final int ABSOLUTE_MAX_PAGE_SIZE = 1000;

    public static void validatePageable(Pageable pageable, Set<String> allowedSortFields) {
        validatePageable(pageable, allowedSortFields, DEFAULT_MAX_PAGE_SIZE);
    }

    public static void validatePageable(Pageable pageable, Set<String> allowedSortFields, int maxPageSize) {
        // Validate maxPageSize parameter
        if (maxPageSize <= 0 || maxPageSize > ABSOLUTE_MAX_PAGE_SIZE) {
            throw new IllegalArgumentException("Max page size must be between 1 and " + ABSOLUTE_MAX_PAGE_SIZE);
        }

        // Page size validation
        if (pageable.getPageSize() > maxPageSize) {
            throw new IllegalArgumentException(
                String.format("Page size cannot exceed %d. Requested: %d", maxPageSize, pageable.getPageSize())
            );
        }

        // Sort validation
        if (allowedSortFields != null && !allowedSortFields.isEmpty()) {
            for (Sort.Order order : pageable.getSort()) {
                if (!allowedSortFields.contains(order.getProperty())) {
                    throw new IllegalArgumentException(
                            String.format("Invalid sort field: '%s'. Allowed fields: %s", order.getProperty(), allowedSortFields)
                    );
                }
            }
        }
    }
}
