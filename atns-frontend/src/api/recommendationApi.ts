import axiosInstance from "./axiosInstance";
import type { RecommendedEvent, RecommendedUser } from "../types/recommendation";

function getProfileId(): number {
    const profileId = localStorage.getItem("profileId");
    if (!profileId) {
        throw new Error("Profile ID not found in localStorage");
    }
    return Number(profileId);
}

/**
 * Fetch recommended events for the current user
 */
export async function fetchRecommendedEvents(limit = 5): Promise<RecommendedEvent[]> {
    const profileId = getProfileId();
    const res = await axiosInstance.get<RecommendedEvent[]>(`/recommendations/events/${profileId}`, {
        params: { limit },
    });

    console.log("API response from /recommendations/events:", res.data);
    return Array.isArray(res.data) ? res.data : [];
}

/**
 * Fetch recommended users for the current user
 */
export async function fetchRecommendedUsers(limit = 5): Promise<RecommendedUser[]> {
    const profileId = getProfileId();
    const res = await axiosInstance.get<RecommendedUser[]>(`/recommendations/users/${profileId}`, {
        params: { limit },
    });

    console.log("API response from /recommendations/users:", res.data);
    return Array.isArray(res.data) ? res.data : [];
}
