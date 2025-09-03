import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, deleteEvent } from "../api/eventApi";
import type { Event } from "../types/event";

const EventList: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadEvents = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchEvents();
            setEvents(data);
        } catch (err) {
            setError("Failed to load events.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        if (!window.confirm("Are you sure you want to delete this event?")) return;

        try {
            await deleteEvent(id);
            await loadEvents();
        } catch (err) {
            alert("Failed to delete event. Please try again.");
            console.error(err);
        }
    };

    useEffect(() => {
        loadEvents();
    }, []);

    useEffect(() => {
        const loadEvents = async () => {
            try {
                const data = await fetchEvents();
                setEvents(Array.isArray(data) ? data : []); // safety check
            } catch (e) {
                console.error("Failed to load events", e);
                setEvents([]);
            }
        };

        loadEvents();
    }, []);

    if (loading) return <div className="p-4 text-center">Loading events...</div>;
    if (error) return <div className="p-4 text-center text-red-600">{error}</div>;

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md mt-8 font-sans">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Events</h2>
            <Link
                to="/events/new"
                className="inline-block mb-6 px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Add New Event
            </Link>
            <ul className="space-y-4">
                {Array.isArray(events) && events.map((event) => (
                    <li
                        key={event.id}
                        className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gray-100 p-4 rounded shadow"
                    >
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900">{event.eventName}</h3>
                            <p className="text-gray-700">
                                {new Date(event.startTime).toLocaleString()}
                                {event.endTime ? ` - ${new Date(event.endTime).toLocaleString()}` : ""}
                            </p>
                            <p className="text-gray-600">{event.eventDescription}</p>
                            {event.location && (
                                <div className="mt-1 text-sm text-gray-500">
                                    {event.location.address && <div>Address: {event.location.address}</div>}
                                    {event.location.onlineLink && (
                                        <div>
                                            Online:{" "}
                                            <a
                                                href={event.location.onlineLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Link
                                            </a>
                                        </div>
                                    )}
                                    {event.location.roomNumber && <div>Room: {event.location.roomNumber}</div>}
                                </div>
                            )}
                            {event.category && <p className="text-sm italic text-gray-500 mt-1">Category: {event.category}</p>}
                        </div>
                        <div className="space-x-4 mt-4 md:mt-0">
                            <Link
                                to={`/events/edit/${event.id}`}
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(event.id)}
                                className="text-red-600 hover:underline font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default EventList;
