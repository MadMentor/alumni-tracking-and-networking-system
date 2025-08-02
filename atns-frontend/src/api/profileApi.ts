import axiosInstance from "./axiosInstance";
import type { Profile } from "../types/profile";

// Fetch the current user's profile
export async function fetchProfile(): Promise<Profile> {
    const res = await axiosInstance.get<Profile>("/profiles/me");
    return res.data;
}

// Update profile by ID
export async function updateProfile(profileId: number, data: Partial<Profile>): Promise<Profile> {
    const res = await axiosInstance.put<Profile>(`/profiles/${profileId}`, data);
    return res.data;
}

// Create a new profile
export async function createProfile(data: any) {
    const res = await axiosInstance.post("/profiles", data);
    return res.data;
}

