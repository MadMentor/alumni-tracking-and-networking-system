import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import type { Event } from "../../types/event.ts";

interface Props {
    events: Event[];
}

export default function EventsCard({ events }: Props) {
    return (
        <Card
            title="Upcoming Events"
            icon={<Calendar className="w-5 h-5 text-purple-600" />}
            footer={
                <Link to="/events" className="w-full">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4" />
                        See All Events
                    </button>
                </Link>
            }
        >
            {events.length === 0 ? (
                <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No upcoming events</p>
                    <p className="text-gray-400 text-xs mt-1">Check back later for new events</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.slice(0, 3).map(event => (
                        <div key={event.eventId} className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm mb-2 line-clamp-2">
                                        {event.eventName}
                                    </h4>
                                    <div className="flex items-center gap-4 text-xs text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>
                                                {new Date(event.startTime).toLocaleDateString(undefined, {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-3 h-3"/>
                                            <span>
                                                {event.eventLocation?.address
                                                    ? event.eventLocation.address
                                                    : event.eventLocation?.onlineLink
                                                        ? "Online"
                                                        : "TBA"}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {/*<a*/}
                                {/*    href={event.rsvpLink}*/}
                                {/*    target="_blank"*/}
                                {/*    rel="noopener noreferrer"*/}
                                {/*    className="btn btn-secondary btn-sm flex-shrink-0"*/}
                                {/*>*/}
                                {/*    <ExternalLink className="w-3 h-3" />*/}
                                {/*    RSVP*/}
                                {/*</a>*/}
                            </div>
                        </div>
                    ))}

                    {events.length > 3 && (
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                                +{events.length - 3} more events
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
