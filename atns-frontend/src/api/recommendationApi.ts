import axiosInstance from "./axiosInstance";
import type { RecommendedEvent, RecommendedUser, RecommendedJob } from "../types/recommendation";
import { useAuthStore } from "../store/authStore.ts";

function getProfileId(): number {
    const profileId = useAuthStore.getState().profileId;
    if (!profileId) throw new Error("Profile ID not found in authStore");
    return profileId;
}

export async function fetchRecommendedEvents(limit = 10): Promise<RecommendedEvent[]> {
    try {
        const profileId = getProfileId();
        const res = await axiosInstance.get<RecommendedEvent[]>(`/recommendations/events/${profileId}`, {
            params: { limit },
        });
        console.log("API response from /recommendations/events:", res.data);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch recommended events:", err);
        return [];
    }
}

export async function fetchRecommendedUsers(limit = 10): Promise<RecommendedUser[]> {
    try {
        const profileId = getProfileId();
        const res = await axiosInstance.get<RecommendedUser[]>(`/recommendations/users/${profileId}`, {
            params: { limit },
        });
        console.log("API response from /recommendations/users:", res.data);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch recommended users:", err);
        return [];
    }
}

export async function fetchRecommendedJobs(limit = 10): Promise<RecommendedJob[]> {
    try {
        const profileId = getProfileId();
        const res = await axiosInstance.get<RecommendedJob[]>(`/recommendations/jobs/${profileId}`, {
            params: { limit },
        });
        console.log("API response from /recommendations/jobs:", res.data);
        return res.data;
    } catch (err) {
        console.error("Failed to fetch recommended jobs:", err);
        return [];
    }
}