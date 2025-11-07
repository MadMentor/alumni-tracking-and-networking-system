import axiosInstance from "./axiosInstance.ts";


import type { Event } from "../types/event";
import { useAuthStore } from "../store/authStore.ts";

type PageResponse<T> = {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
    last: boolean;
};


export async function fetchProfile() {
    const res = await axiosInstance.get("/profiles/me");
    return res.data;
}

export async function fetchConnections() {
    const res = await axiosInstance.get(`/connections/summary`);
    return res.data; // e.g. { total: 120, pendingRequests: 2 }
}

// export async function fetchMessages() {
//     const res = await axiosInstance.get(`${API_BASE}/messages/summary`);
//     return res.data; // e.g. { newMessages: 3, recentMessages: [...] }
// }

export async function fetchEvents():Promise<PageResponse<Event>> {
    const res = await axiosInstance.get<PageResponse<Event>>(`/events/upcoming`, {
        headers: { "X-Profile-Id": useAuthStore.getState().profileId || "0" }
    });
    return res.data;
}

// export async function fetchOpportunities() {
//     const res = await axiosInstance.get(`${API_BASE}/jobs/recent`);
//     return res.data; // e.g. [{id, title, company}, ...]
// }

export async function fetchRecentActivity() {
    const res = await axiosInstance.get(`/activity/recent`);
    return res.data; // e.g. [{id, description, date}, ...]
}

export async function searchAlumni(query: string) {
    const res = await axiosInstance.get(`/profiles/search`, {
        params: { query }
    });
    return res.data;
}