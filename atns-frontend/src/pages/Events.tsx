import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface Event {
    id: number;
    title: string;
    date: string;
    location?: string;
    description?: string;
    rsvpLink?: string;
}

const Events: React.FC = () => {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading events from API
        const fetchEvents = async () => {
            try {
                setLoading(true);
                // Mock data for now - replace with actual API call
                const mockEvents: Event[] = [
                    {
                        id: 1,
                        title: "Alumni Meet 2024",
                        date: "2024-03-15",
                        location: "Main Campus Auditorium",
                        description: "Annual alumni gathering with networking opportunities and keynote speakers.",
                        rsvpLink: "#"
                    },
                    {
                        id: 2,
                        title: "Career Fair",
                        date: "2024-04-20",
                        location: "Virtual Event",
                        description: "Connect with top companies and explore career opportunities.",
                        rsvpLink: "#"
                    },
                    {
                        id: 3,
                        title: "Tech Workshop",
                        date: "2024-05-10",
                        location: "Engineering Building",
                        description: "Hands-on workshop on latest technologies and industry trends.",
                        rsvpLink: "#"
                    }
                ];
                
                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setEvents(mockEvents);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading events...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800">Events</h2>
                            <p className="text-gray-600 mt-2">Stay connected with your alumni community</p>
                        </div>
                        <Link
                            to="/events/new"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                        >
                            + Create Event
                        </Link>
                    </div>

                    {/* Events Grid */}
                    {events.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-4">
                                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
                            <p className="text-gray-500 mb-6">Be the first to create an event for your alumni community!</p>
                            <Link
                                to="/events/new"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                            >
                                Create First Event
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div
                                    key={event.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h3>
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <span className="text-sm">{formatDate(event.date)}</span>
                                            </div>
                                            {event.location && (
                                                <div className="flex items-center text-gray-600 mb-3">
                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span className="text-sm">{event.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    {event.description && (
                                        <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                                            {event.description}
                                        </p>
                                    )}
                                    
                                    <div className="flex space-x-3">
                                        <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-semibold">
                                            RSVP
                                        </button>
                                        <Link
                                            to={`/events/${event.id}`}
                                            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors duration-200 text-sm font-semibold text-center"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Events; 