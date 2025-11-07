import axiosInstance from "./axiosInstance";
import type { Profile } from "../types/profile";
import {useAuthStore} from "../store/authStore.ts";

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
    page: number,
    size: number,
    search: string,
    searchType: string
): Promise<Profile[]> {
    const profileId = useAuthStore.getState().profileId;

    if (!profileId) {
        throw new Error("No profileId available - user not logged in");
    }

    const res = await axiosInstance.get<Profile[]>("/profiles/explore", {
        params: {
            page: Number(page) || 0,
            size: Number(size) || 10,
            search: search || "",
            searchType: searchType || "name",
        },
        headers: { "X-Profile-Id": profileId },
    });
    return res.data;
}
