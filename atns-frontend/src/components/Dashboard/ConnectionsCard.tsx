// @ts-ignore
import React from "react";

interface Props {
    total: number;
    pendingRequests: number;
}

export default function ConnectionsCard({ total, pendingRequests }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">My Network</h3>
            <p>Total Connections: <strong>{total}</strong></p>
            <p>Pending Requests: <strong>{pendingRequests}</strong></p>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                View All Connections
            </button>
        </div>
    );
}
