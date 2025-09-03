import axiosInstance from "./axiosInstance";
import type { Event } from "../types/event";

function getProfileIdHeader() {
    const profileId = localStorage.getItem("profileId");
    if (!profileId) {
        throw new Error("Profile ID not found in localStorage");
    }
    return { "X-Profile-Id": profileId };
}

function getOrganizerIdHeader(): { "X-Organizer-Id": string } {
    const organizerId = localStorage.getItem("profileId");
    if (!organizerId) throw new Error("Organizer ID (profileId) not found in localStorage");
    return { "X-Organizer-Id": organizerId };
}

export async function fetchEvents(): Promise<Event[]> {
    const res = await axiosInstance.get("/events", {
        headers: getProfileIdHeader(),
    });
    console.log("API response from /events:", res.data);
    return res.data.content ?? res.data;
}

export async function fetchMyEvents(): Promise<Event[]> {
    const res = await axiosInstance.get("/events/myevents", {
        headers: getOrganizerIdHeader(),
    });
    console.log("API response from /events/myevents:", res.data);
    return res.data.content ?? res.data;
}

export async function fetchEventById(id: number): Promise<Event> {
    const res = await axiosInstance.get(`/events/${id}`, {
        headers: getProfileIdHeader(),
    });
    return res.data;
}

export async function createEvent(event: Partial<Event>): Promise<Event> {
    const res = await axiosInstance.post<Event>("/events", event, {
        headers: getOrganizerIdHeader(),
    });
    return res.data;
}

export async function updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const res = await axiosInstance.put<Event>(`/events/${id}`, event, {
        headers: getOrganizerIdHeader(),
    });
    return res.data;
}

export async function deleteEvent(id: number): Promise<void> {
    await axiosInstance.delete(`/events/${id}`, {
        headers: getOrganizerIdHeader(),
    });
}

export async function fetchUpcomingEvents(): Promise<Event[]> {
    const res = await axiosInstance.get<Event[]>("/events/upcoming", {
        headers: getProfileIdHeader(),
    });
    return res.data;
}

// Search events (any organizer)
export async function searchEvents(query: string): Promise<Event[]> {
    const res = await axiosInstance.get<Event[]>("/events/search", {
        params: {query},
        headers: getProfileIdHeader(),
    });
    return res.data;
}
