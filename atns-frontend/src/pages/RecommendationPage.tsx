import { useEffect, useState } from "react";
import { fetchRecommendedEvents, fetchRecommendedUsers } from "../api/recommendationApi";
import type { RecommendedEvent, RecommendedUser } from "../types/recommendation";
import { Calendar, MapPin, User, Users, Award, Star } from "lucide-react";
import FollowButton from "../components/FollowButton";
import { useAuthStore } from "../store/authStore.ts";
import {Link} from "react-router-dom";

export default function RecommendationPage() {
    const [events, setEvents] = useState<RecommendedEvent[]>([]);
    const [users, setUsers] = useState<RecommendedUser[]>([]);
    const [loading, setLoading] = useState(true);
    const profileId = useAuthStore().profileId;

    useEffect(() => {
        async function loadRecommendations() {
            try {
                const [eventsData, usersData] = await Promise.all([
                    fetchRecommendedEvents(profileId!),
                    fetchRecommendedUsers(profileId!),
                ]);
                setEvents(eventsData);
                setUsers(usersData);
            } catch (err) {
                console.error("Failed to load recommendations", err);
            } finally {
                setLoading(false);
            }
        }
        loadRecommendations();
    }, [profileId]);

    if (!profileId) {
        return <div>Please log in t view recommendations</div>
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Recommendations</h1>
                <p className="text-gray-600">Personalized suggestions based on your profile and interests</p>
            </div>

            {/* Recommended Events Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Events</h2>
                        <p className="text-gray-600">Events matching your interests and skills</p>
                    </div>
                </div>

                {events.length === 0 ? (
                    <div className="text-center py-12">
                        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No recommended events yet</p>
                        <p className="text-gray-400 text-sm mt-1">Complete your profile to get better recommendations</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {events.map(event => (
                            <div key={event.eventId} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-semibold text-gray-900 text-lg line-clamp-2">{event.eventName}</h3>
                                    <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                        <Star className="w-3 h-3" />
                                        {(event.score * 100).toFixed(0)}%
                                    </div>
                                </div>

                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>{new Date(event.startTime).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <MapPin className="w-4 h-4" />
                                        <span className="line-clamp-1">{event.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                            {event.category}
                                        </span>
                                    </div>
                                </div>

                                <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                                    View Event
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Recommended Users Section */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Recommended Users</h2>
                        <p className="text-gray-600">Connect with alumni who share similar interests</p>
                    </div>
                </div>

                {users.length === 0 ? (
                    <div className="text-center py-12">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No recommended users yet</p>
                        <p className="text-gray-400 text-sm mt-1">Complete your profile to get better matches</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(user => (
                            <div key={user.profileId} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow">
                                {/* User Header with Picture and Follow Button */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="relative">
                                            <img
                                                src={user.profileImageUrl || "/default-avatar.png"}
                                                alt={`${user.firstName} ${user.lastName}`}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                            />
                                            <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1 border-2 border-white">
                                                <div className="flex items-center gap-1 bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                                                    <Star className="w-2 h-2" />
                                                    {(user.score * 100).toFixed(0)}%
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                {user.firstName} {user.lastName}
                                            </h3>
                                            <p className="text-sm text-gray-600">{user.faculty}</p>
                                        </div>
                                    </div>
                                    <FollowButton
                                        currentProfileId={profileId}
                                        targetProfileId={user.profileId}
                                    />
                                </div>

                                {/* Skills */}
                                <div className="mb-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Award className="w-4 h-4 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-700">Skills</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1">
                                        {Array.from(user.skills).slice(0, 3).map((skill) => (
                                            <span
                                                key={skill}
                                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                            >
                                                {skill}
                                            </span>
                                        ))}
                                        {user.skills.length > 3 && (
                                            <span className="px-2 py-1 bg-gray-50 text-gray-500 rounded-full text-xs">
                                                +{user.skills.length - 3} more
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Additional Info */}
                                {user.currentPosition && (
                                    <div className="text-sm text-gray-600 mb-2">
                                        <span className="font-medium">Works at:</span> {user.currentPosition}
                                    </div>
                                )}

                                {/* Connect Button */}
                                <Link
                                    to={`/profiledetails/${user.profileId}`}
                                    className="flex-1 hover:no-underline"
                                >
                                    <button className="w-full border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                                        View Profile
                                    </button>
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* Empty State for Both */}
            {events.length === 0 && users.length === 0 && (
                <div className="text-center py-16">
                    <User className="w-20 h-20 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No recommendations yet</h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                        Complete your profile, add your skills, and interests to get personalized recommendations for events and connections.
                    </p>
                    <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Complete Your Profile
                    </button>
                </div>
            )}
        </div>
    );
}