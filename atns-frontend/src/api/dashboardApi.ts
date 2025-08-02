import axios from "axios";

const API_BASE = "http://localhost:8080/api/v1";

export async function fetchProfile() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/profiles/me`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        // Return mock data for now
        return {
            fullName: "John Doe",
            profilePictureUrl: "https://via.placeholder.com/150",
            currentPosition: "Software Engineer",
            batch: "2020"
        };
    }
}

export async function fetchConnections() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/connections/summary`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching connections:", error);
        // Return mock data for now
        return {
            total: 45,
            pendingRequests: 3
        };
    }
}

// export async function fetchMessages() {
//     const res = await axios.get(`${API_BASE}/messages/summary`);
//     return res.data; // e.g. { newMessages: 3, recentMessages: [...] }
// }

export async function fetchEvents() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/events/upcoming`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching events:", error);
        // Return mock data for now
        return [
            {
                id: 1,
                title: "Alumni Meet 2024",
                date: "2024-03-15",
                location: "Main Campus"
            },
            {
                id: 2,
                title: "Career Fair",
                date: "2024-04-20",
                location: "Virtual"
            }
        ];
    }
}

// export async function fetchOpportunities() {
//     const res = await axios.get(`${API_BASE}/jobs/recent`);
//     return res.data; // e.g. [{id, title, company}, ...]
// }

export async function fetchRecentActivity() {
    try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_BASE}/activity/recent`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return res.data;
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        // Return mock data for now
        return [
            {
                id: 1,
                description: "New connection request from Jane Smith",
                date: "2024-01-15T10:30:00Z"
            },
            {
                id: 2,
                description: "Event 'Alumni Meet 2024' created",
                date: "2024-01-14T15:45:00Z"
            }
        ];
    }
}
