import axios from "axios";

const API_BASE = "/api/v1";

export async function fetchProfile() {
    try {
        const res = await axios.get(`${API_BASE}/profiles/me`);
        return res.data;
    }
}

export async function fetchConnections() {
    const res = await axios.get(`${API_BASE}/connections/summary`);
    return res.data; // e.g. { total: 120, pendingRequests: 2 }
}

// export async function fetchMessages() {
//     const res = await axios.get(`${API_BASE}/messages/summary`);
//     return res.data; // e.g. { newMessages: 3, recentMessages: [...] }
// }

export async function fetchEvents() {
    const res = await axios.get(`${API_BASE}/events/upcoming`);
    return res.data; // e.g. [{id, title, date, rsvpLink}, ...]
}

// export async function fetchOpportunities() {
//     const res = await axios.get(`${API_BASE}/jobs/recent`);
//     return res.data; // e.g. [{id, title, company}, ...]
// }

export async function fetchRecentActivity() {
    const res = await axios.get(`${API_BASE}/activity/recent`);
    return res.data; // e.g. [{id, description, date}, ...]
}
