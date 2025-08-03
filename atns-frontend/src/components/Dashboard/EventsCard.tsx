// @ts-ignore
import React from "react";
import { useNavigate } from "react-router-dom"; // 1️⃣ Import navigate

interface Event {
    id: number;
    title: string;
    date: string;
    rsvpLink: string;
}

interface Props {
    events: Event[];
}

export default function EventsCard({ events }: Props) {
    const navigate = useNavigate(); // 2️⃣ Initialize navigate

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Upcoming Events</h3>
            <ul>
                {events.map(event => (
                    <li key={event.id} className="mb-2">
                        <div className="flex justify-between">
                            <span>{event.title} - {new Date(event.date).toLocaleDateString()}</span>
                            <a href={event.rsvpLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                                RSVP
                            </a>
                        </div>
                    </li>
                ))}
            </ul>
            <button
                onClick={() => navigate("/events")} // 3️⃣ Add click handler
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
                See All Events
            </button>
        </div>
    );
}
