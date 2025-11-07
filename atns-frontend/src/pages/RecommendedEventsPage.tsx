import { useEffect, useState } from "react";
import { fetchRecommendedEvents } from "../api/recommendationApi";
import type { RecommendedEvent } from "../types/recommendation";

export default function RecommendedEventsPage() {
    const profileId = Number(localStorage.getItem("profileId"));
    const [events, setEvents] = useState<RecommendedEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadEvents() {
            try {
                const data = await fetchRecommendedEvents(profileId); // increase limit
                setEvents(data);
            } catch (err) {
                console.error("Failed to fetch recommended events", err);
            } finally {
                setLoading(false);
            }
        }
        loadEvents();
    }, [profileId]);

    if (loading) return <div>Loading recommended events...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Recommended Events</h1>
            {events.length === 0 ? (
                <p>No upcoming events at the moment.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {events.map(event => {
                        const isLowMatch = event.score < 0.2;
                        return (
                            <li key={event.eventId} className="p-4 border rounded-lg shadow-sm">
                                <h3 className="font-semibold">{event.eventName}</h3>
                                <p className="text-sm text-gray-600">{event.category}</p>
                                <p className="text-sm">{event.location}</p>
                                <p className="text-sm">Starts: {new Date(event.startTime).toLocaleString()}</p>
                                <p className={`text-xs ${isLowMatch ? "text-gray-400" : "text-gray-500"}`}>
                                    Match Score: {(event.score * 100).toFixed(1)}% {isLowMatch && "(Low match)"}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
