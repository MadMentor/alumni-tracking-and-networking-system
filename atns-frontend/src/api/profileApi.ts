import axiosInstance from "./axiosInstance";
import type { Profile } from "../types/profile";

interface FetchProfilesParams {
    page?: number;
    size?: number;
    search?: string;
    searchType?: string;
}

export async function fetchProfile(): Promise<Profile> {
    const res = await axiosInstance.get<Profile>("/profiles/me");
    return res.data;
}

export async function fetchProfileById(profileId: number): Promise<Profile> {
    const res = await axiosInstance.get<Profile>(`/profiles/${profileId}`);
    return res.data;
}

export async function updateProfile(profileId: number, formData: FormData): Promise<Profile> {
    const res = await axiosInstance.put<Profile>(`/profiles/${profileId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

export async function createProfile(formData: FormData): Promise<Profile> {
    const res = await axiosInstance.post<Profile>("/profiles", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
}

// Fetch profiles for Explore page
export async function fetchProfilesExplore(
    profileId: number,
    page: number,
    size: number,
    search: string,
    searchType: string
): Promise<Profile[]> {
    const res = await axiosInstance.get<Profile[]>("/profiles/explore", {
        params: {
            page: Number(page) || 0,
            size: Number(size) || 10,
            search: search || "",
            searchType: searchType || "",
        },
        headers: { "X-Profile-Id": profileId },
    });
    return res.data;
}