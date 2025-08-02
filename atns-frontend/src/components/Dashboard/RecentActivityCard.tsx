import React from "react";

interface Activity {
    id: number;
    description: string;
    date: string;
}

interface Props {
    activities: Activity[];
}

export default function RecentActivityCard({ activities }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Recent Activity</h3>
            <ul>
                {activities.map(act => (
                    <li key={act.id} className="mb-2 text-gray-700">
                        {act.description} <span className="text-xs text-gray-500">({new Date(act.date).toLocaleDateString()})</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
