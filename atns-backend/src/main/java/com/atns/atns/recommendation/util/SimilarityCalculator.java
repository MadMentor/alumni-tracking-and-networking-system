package com.atns.atns.recommendation.util;

import java.util.HashSet;
import java.util.Map;
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

    /**
     * Calculates Cosine similarity between two sets of strings.
     * Treats each set as a vector in the space of all possible skills.
     */
    public static double cosineSimilarity(Set<String> set1, Set<String> set2) {
        if (set1 == null || set2 == null || set1.isEmpty() || set2.isEmpty()) {
            return 0.0;
        }

        // Get all unique terms from both sets
        Set<String> allTerms = new HashSet<>(set1);
        allTerms.addAll(set2);

        // Create vectors
        double[] vector1 = new double[allTerms.size()];
        double[] vector2 = new double[allTerms.size()];

        int index = 0;
        for (String term : allTerms) {
            vector1[index] = set1.contains(term) ? 1.0 : 0.0;
            vector2[index] = set2.contains(term) ? 1.0 : 0.0;
            index++;
        }

        return cosineSimilarity(vector1, vector2);
    }

    /**
     * Calculates Cosine similarity between two vectors
     */
    public static double cosineSimilarity(double[] vectorA, double[] vectorB) {
        if (vectorA.length != vectorB.length) {
            throw new IllegalArgumentException("Vectors must have the same length");
        }

        double dotProduct = 0.0;
        double normA = 0.0;
        double normB = 0.0;

        for (int i = 0; i < vectorA.length; i++) {
            dotProduct += vectorA[i] * vectorB[i];
            normA += Math.pow(vectorA[i], 2);
            normB += Math.pow(vectorB[i], 2);
        }

        if (normA == 0 || normB == 0) {
            return 0.0;
        }

        return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
    }

    /**
     * Calculates Cosine similarity with TF-IDF weighting for better job recommendations
     */
    public static double cosineSimilarityWithTFIDF(Set<String> userSkills, Set<String> jobSkills,
                                                   Map<String, Double> idfScores) {
        if (userSkills == null || jobSkills == null || userSkills.isEmpty() || jobSkills.isEmpty()) {
            return 0.0;
        }

        Set<String> allTerms = new HashSet<>(userSkills);
        allTerms.addAll(jobSkills);

        double[] userVector = new double[allTerms.size()];
        double[] jobVector = new double[allTerms.size()];

        int index = 0;
        for (String term : allTerms) {
            double userTF = userSkills.contains(term) ? 1.0 : 0.0;
            double jobTF = jobSkills.contains(term) ? 1.0 : 0.0;

            double idf = idfScores.getOrDefault(term, 1.0); // Default to 1 if term not in IDF map

            userVector[index] = userTF * idf;
            jobVector[index] = jobTF * idf;
            index++;
        }

        return cosineSimilarity(userVector, jobVector);
    }
}
