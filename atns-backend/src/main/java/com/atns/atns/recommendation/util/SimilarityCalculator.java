package com.atns.atns.recommendation.util;

import java.util.HashSet;
import java.util.Set;

public class SimilarityCalculator {
    /**
     * Calculates Jaccard similarity between two sets.
     * Returns a value between 0.0 and 1.0
     */
    public static <T> double jaccardSimilarity(Set<T> set1, Set<T> set2) {
        if (set1 == null || set2 == null || set1.isEmpty() || set2.isEmpty()) {
            return 0.0;
        }

        Set<T> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        Set<T> union = new HashSet<>(set1);
        union.addAll(set2);

        return (double) intersection.size() / (double) union.size();
    }

    /**
     * Simple overlap score: number of common elements
     */
    public static <T> int overlapScore(Set<T> set1, Set<T> set2) {
        if (set1 == null || set2 == null) return 0;

        Set<T> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);

        return intersection.size();
    }
}
