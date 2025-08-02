import React from "react";
import Card from "../ui/Card";
import { Calendar } from "lucide-react";

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
    return (
        <Card
            title="Upcoming Events"
            icon={<Calendar className="w-5 h-5 text-blue-600" />}
            footer={
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                    See All Events
                </button>
            }
        >
            {events.length === 0 ? (
                <p className="text-gray-500">No upcoming events.</p>
            ) : (
                <ul>
                    {events.map(event => (
                        <li key={event.id} className="mb-2">
                            <div className="flex justify-between">
                                <span>
                                    {event.title} -{" "}
                                    {new Date(event.date).toLocaleDateString(undefined, {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                                <a
                                    href={event.rsvpLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:underline"
                                >
                                    RSVP
                                </a>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </Card>
    );
}
