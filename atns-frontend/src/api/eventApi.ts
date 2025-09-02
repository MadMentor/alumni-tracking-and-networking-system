import axiosInstance from "./axiosInstance";
import type { Event } from "../types/event";

function getProfileIdHeader() {
    const profileId = localStorage.getItem("profileId");
    if (!profileId) {
        throw new Error("Profile ID not found in localStorage");
    }
    return { "X-Profile-Id": profileId };
}

export async function fetchEvents(): Promise<Event[]> {
    const res = await axiosInstance.get<Event[]>("/events", {
        headers: getProfileIdHeader(),
    });
    console.log("API response from /events:", res.data);
    return res.data;
}

export async function fetchEventById(id: number): Promise<Event> {
    const res = await axiosInstance.get<Event>(`/events/${id}`, {
        headers: getProfileIdHeader(),
    });
    return res.data;
}

export async function createEvent(event: Partial<Event>): Promise<Event> {
    const res = await axiosInstance.post<Event>("/events", event, {
        headers: getProfileIdHeader(),
    });
    return res.data;
}

export async function updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const res = await axiosInstance.put<Event>(`/events/${id}`, event, {
        headers: getProfileIdHeader(),
    });
    return res.data;
}

export async function deleteEvent(id: number): Promise<void> {
    await axiosInstance.delete(`/events/${id}`, {
        headers: getProfileIdHeader(),
    });
}
