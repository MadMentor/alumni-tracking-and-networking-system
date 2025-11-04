import React, { useEffect, useState } from "react";
import { fetchRecommendedUsers } from "../api/recommendationApi";
import type { RecommendedUser } from "../types/recommendation";

export default function RecommendedUsersPage({ profileId }: { profileId: number }) {
    const [users, setUsers] = useState<RecommendedUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadUsers() {
            try {
                const data = await fetchRecommendedUsers(profileId, 20); // increase limit
                setUsers(data);
            } catch (err) {
                console.error("Failed to fetch recommended users", err);
            } finally {
                setLoading(false);
            }
        }
        loadUsers();
    }, [profileId]);

    if (loading) return <div>Loading recommended users...</div>;

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Recommended Users</h1>
            {users.length === 0 ? (
                <p>No recommended users at the moment.</p>
            ) : (
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {users.map(user => {
                        const isLowMatch = user.score < 0.2;
                        return (
                            <li key={user.profileId} className="p-4 border rounded-lg shadow-sm">
                                <h3 className="font-semibold">{user.firstName} {user.lastName}</h3>
                                <p className="text-sm text-gray-600">Faculty: {user.faculty}</p>
                                <p className="text-sm">Skills: {user.skills.join(", ")}</p>
                                <p className={`text-xs ${isLowMatch ? "text-gray-400" : "text-gray-500"}`}>
                                    Match Score: {(user.score * 100).toFixed(1)}% {isLowMatch && "(Low match)"}
                                </p>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
}
