import React, { useEffect, useState } from "react";
import { fetchRecommendedEvents, fetchRecommendedUsers } from "../api/recommendationApi";
import type { RecommendedEvent, RecommendedUser } from "../types/recommendation";

export default function RecommendationPage({ profileId }: { profileId: number }) {
    const [events, setEvents] = useState<RecommendedEvent[]>([]);
    const [users, setUsers] = useState<RecommendedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadRecommendations() {
            try {
                const [eventsData, usersData] = await Promise.all([
                    fetchRecommendedEvents(profileId, 5),
                    fetchRecommendedUsers(profileId, 5),
                ]);
                setEvents(eventsData);
                setUsers(usersData);
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setLoading(false);
            }
        }
        loadRecommendations();
    }, [profileId]);

    if (loading) return <div>Loading recommendations...</div>;

    return (
        <div className="p-6 space-y-8">
            <section>
                <h2 className="text-xl font-bold mb-4">Recommended Events</h2>
                {events.length === 0 ? (
                    <p>No recommended events.</p>
                ) : (
                    <ul className="space-y-2">
                        {events.map(e => (
                            <li key={e.eventId} className="p-4 border rounded-lg shadow-sm">
                                <h3 className="font-semibold">{e.eventName}</h3>
                                <p className="text-sm text-gray-600">{e.category}</p>
                                <p className="text-sm">{e.location}</p>
                                <p className="text-sm">Starts: {new Date(e.startTime).toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Match Score: {(e.score * 100).toFixed(1)}%</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <section>
                <h2 className="text-xl font-bold mb-4">Recommended Users</h2>
                {users.length === 0 ? (
                    <p>No recommended users.</p>
                ) : (
                    <ul className="space-y-2">
                        {users.map(u => (
                            <li key={u.profileId} className="p-4 border rounded-lg shadow-sm">
                                <h3 className="font-semibold">{u.firstName} {u.lastName}</h3>
                                <p className="text-sm text-gray-600">Faculty: {u.faculty}</p>
                                <p className="text-sm">Skills: {u.skills.join(", ")}</p>
                                <p className="text-xs text-gray-500">Match Score: {(u.score * 100).toFixed(1)}%</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}
