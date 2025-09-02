import axiosInstance from "./axiosInstance";
import type { Profile } from "../types/profile";

// Fetch the current user's profile
export async function fetchProfile(): Promise<Profile> {
    const res = await axiosInstance.get<Profile>("/profiles/me");
    return res.data;
}

// Update profile by ID
export async function updateProfile(profileId: number, data: Partial<Profile>): Promise<Profile> {
    // Convert dateOfBirth to proper format if it exists
    const profileData = { ...data };
    if (profileData.dateOfBirth) {
        // Ensure dateOfBirth is in YYYY-MM-DD format
        const date = new Date(profileData.dateOfBirth);
        profileData.dateOfBirth = date.toISOString().split('T')[0];
    }
    
    // Ensure batchYear is a number
    if (profileData.batchYear) {
        profileData.batchYear = typeof profileData.batchYear === 'string' 
            ? parseInt(profileData.batchYear) 
            : profileData.batchYear;
    }
    
    const res = await axiosInstance.put<Profile>(`/profiles/${profileId}`, profileData);
    return res.data;
}

// Create a new profile
export async function createProfile(data: Partial<Profile>) {
    // Convert dateOfBirth to proper format if it exists
    const profileData = { ...data };
    if (profileData.dateOfBirth) {
        // Ensure dateOfBirth is in YYYY-MM-DD format
        const date = new Date(profileData.dateOfBirth);
        profileData.dateOfBirth = date.toISOString().split('T')[0];
    }
    
    // Ensure batchYear is a number
    if (profileData.batchYear) {
        profileData.batchYear = typeof profileData.batchYear === 'string' 
            ? parseInt(profileData.batchYear) 
            : profileData.batchYear;
    }
    
    const res = await axiosInstance.post("/profiles", profileData);
    return res.data;
}


