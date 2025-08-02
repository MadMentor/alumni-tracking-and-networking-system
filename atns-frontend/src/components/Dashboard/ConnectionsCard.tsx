import React from "react";
import { Users } from "lucide-react";
import Card from "../ui/Card.tsx";

interface Props {
    total: number;
    pendingRequests: number;
}

export default function ConnectionsCard({ total, pendingRequests }: Props) {
    return (
        <Card
            title="My Network"
            icon={<Users className="w-5 h-5 text-blue-600" />}
            footer={
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    View All Connections
                </button>
            }
        >
            <p>Total Connections: <strong>{total}</strong></p>
            <p>Pending Requests: <strong>{pendingRequests}</strong></p>
        </Card>
    );
}
