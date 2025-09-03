import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchEvents, deleteEvent } from "../api/eventApi";
import type { Event } from "../types/event";
import { Calendar, MapPin, Clock, Plus, Edit, Trash2, ExternalLink } from "lucide-react";

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

    if (loading) return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center text-gray-600">Loading events...</div>
            </div>
        </div>
    );
    if (error) return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center text-red-600">{error}</div>
            </div>
        </div>
    );

    return (
        <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-bold text-gray-900">Events</h2>
                    <Link to="/events/new" className="btn btn-primary">
                        <Plus className="w-4 h-4" />
                        Add New Event
                    </Link>
                </div>

                {events.length === 0 ? (
                    <div className="card p-8 text-center text-gray-600">No events found.</div>
                ) : (
                    <div className="space-y-4">
                        {events.map((event) => (
                            <div key={event.id} className="card">
                                <div className="card-body">
                                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                        <div className="min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                                                {event.eventName}
                                            </h3>
                                            <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-gray-600">
                                                <span className="inline-flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    {new Date(event.startTime).toLocaleString()}
                                                    {event.endTime ? ` - ${new Date(event.endTime).toLocaleString()}` : ""}
                                                </span>
                                                {event.location?.address && (
                                                    <span className="inline-flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {event.location.address}
                                                    </span>
                                                )}
                                                {event.location?.onlineLink && (
                                                    <a
                                                        href={event.location.onlineLink}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                                    >
                                                        <ExternalLink className="w-4 h-4" />
                                                        Online Link
                                                    </a>
                                                )}
                                            </div>
                                            {event.category && (
                                                <p className="text-xs text-gray-500 mt-2">Category: {event.category}</p>
                                            )}
                                            {event.eventDescription && (
                                                <p className="text-sm text-gray-700 mt-3 line-clamp-2">{event.eventDescription}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3 md:justify-end">
                                            <Link to={`/events/edit/${event.id}`} className="btn btn-secondary btn-sm">
                                                <Edit className="w-4 h-4" />
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(event.id)} className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50">
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
};

export default EventList;
