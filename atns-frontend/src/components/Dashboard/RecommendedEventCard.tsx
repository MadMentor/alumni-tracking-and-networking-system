import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { Calendar, MapPin, Clock, Sparkles } from "lucide-react";
import type { RecommendedEvent } from "../../types/recommendation"; // define this type separately

interface Props {
    events: RecommendedEvent[];
}

export default function RecommendedEventsCard({ events }: Props) {
    return (
        <Card
            title="Recommended Events"
            icon={<Sparkles className="w-5 h-5 text-yellow-500" />}
            footer={
                <Link to="/events/recommended" className="w-full">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        See All Recommendations
                    </button>
                </Link>
            }
        >
            {events.length === 0 ? (
                <div className="text-center py-8">
                    <Sparkles className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recommendations yet</p>
                    <p className="text-gray-400 text-xs mt-1">Build your profile and connect to get recommendations</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {events.slice(0, 3).map(event => (
                        <div
                            key={event.eventId}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                        {event.eventName}
                                    </h4>
                                    <p className="text-xs text-purple-600 mb-2">{event.category}</p>

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
                                            <MapPin className="w-3 h-3" />
                                            <span>{event.location || "TBA"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-shrink-0 text-xs text-green-600 font-medium">
                                    {(event.score * 100).toFixed(0)}% match
                                </div>
                            </div>
                        </div>
                    ))}

                    {events.length > 3 && (
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                                +{events.length - 3} more recommendations
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
