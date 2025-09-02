// @ts-ignore
import React from "react";
import Card from "../ui/Card";
import { Activity as ActivityIcon } from "lucide-react";

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
        <Card
            title="Recent Activity"
            icon={<ActivityIcon className="w-5 h-5 text-blue-600" />}
        >
            {activities.length === 0 ? (
                <p className="text-gray-500">No recent activity.</p>
            ) : (
                <ul>
                    {activities.map((act) => (
                        <li key={act.id} className="mb-2 text-gray-700">
                            {act.description}{" "}
                            <span className="text-xs text-gray-500">
                                ({new Date(act.date).toLocaleDateString()})
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
