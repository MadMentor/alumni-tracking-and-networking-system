import {useEffect, useState} from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import ConnectionsCard from "../components/Dashboard/ConnectionsCard";
// import MessagesCard from "../components/Dashboard/MessagesCard";
import EventsCard from "../components/Dashboard/EventsCard";
import RecommendedEventCard from "../components/Dashboard/RecommendedEventCard.tsx";
import RecommendedUsersCard from "../components/Dashboard/RecommendedUsersCard.tsx";
import SearchAlumni from "../components/Dashboard/SearchAlumni";
// import OpportunitiesCard from "../components/Dashboard/OpportunitiesCard";
import RecentActivityCard from "../components/Dashboard/RecentActivityCard";
import type {Profile} from "../types/profile";
import type { Event } from "../types/event";
import type {RecommendedEvent, RecommendedUser} from "../types/recommendation";


import {
    fetchProfile,
    fetchConnections,
    // fetchMessages,
    fetchEvents,
    // fetchOpportunities,
    fetchRecentActivity,
} from "../api/dashboardApi";

import { fetchRecommendedEvents, fetchRecommendedUsers} from "../api/recommendationApi";

export default function Dashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [connections, setConnections] = useState<{ total: number; pendingRequests: number } | null>(null);
    // const [messages, setMessages] = useState(null);
    const [events, setEvents] = useState<Event[]>([]);
    const [recommendedEvents, setRecommendedEvents] = useState<RecommendedEvent[]>([]);
    const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([]);
    // const [opportunities, setOpportunities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetchProfile().then(setProfile).catch((err) => {
                console.error("Failed to fetch profile:", err);
                setProfile(null); // fallback
            }),
            fetchConnections().then(setConnections).catch((err) => {
                console.error("Failed to fetch connections:", err);
                setConnections(null);
            }),
            fetchEvents().then((page) => setEvents(page.content)).catch((err) => {
                console.error("Failed to fetch events:", err);
                setEvents([]);
            }),
            fetchRecentActivity().then(setActivities).catch((err) => {
                console.error("Failed to fetch recent activity:", err);
                setActivities([]);
            }),
            fetchRecommendedEvents(3) // fetch top 3 recommended events
                .then(setRecommendedEvents)
                .catch((err) => {
                    console.error("Failed to fetch recommended events:", err);
                    setRecommendedEvents([]);
                }),
            fetchRecommendedUsers(3)
                .then(setRecommendedUsers)
                .catch((err) => {
                    console.error("Failed to fetch recommended users:", err);
                    setRecommendedUsers([]);
                }),
        ]).finally(() => setIsLoading(false));
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-center min-h-[60vh]">
                        <div className="text-center">
                            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-gray-600 text-lg">Loading your dashboard...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-gray-600">Failed to load profile.</p>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 pt-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Welcome, Section */}
                <div className="animate-fade-in">
                    <WelcomeCard
                        fullName={profile.firstName + " " + profile.lastName}
                        profileImageUrl={profile.profileImageUrl}
                        address={profile.address}
                        batchYear={profile.batchYear}
                        faculty={profile.faculty}
                        currentPosition={profile.currentPosition}
                    />
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{animationDelay: '0.1s'}}>
                    {connections && (
                        <ConnectionsCard
                            total={connections.total}
                            pendingRequests={connections.pendingRequests}
                        />
                    )}

                    {/*{messages && (*/}
                    {/*    <MessagesCard*/}
                    {/*        newMessages={messages.newMessages}*/}
                    {/*        recentMessages={messages.recentMessages}*/}
                    {/*    />*/}
                    {/*)}*/}

                    <EventsCard events={events}/>
                </div>

                <div className="flex flex-col md:flex-row gap-6">
                    <div className="flex-1">
                        <RecommendedEventCard events={recommendedEvents}/>
                    </div>
                    <div className="flex-1">
                        <RecommendedUsersCard users={recommendedUsers}/>
                    </div>
                </div>

                {/* Search Section */}
                <div className="animate-fade-in" style={{animationDelay: '0.2s'}}>
                    <SearchAlumni/>
                </div>

                {/* Bottom Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in" style={{animationDelay: '0.3s'}}>
                    {/*<OpportunitiesCard opportunities={opportunities} />*/}
                    <RecentActivityCard activities={activities}/>
                </div>
            </div>
        </main>
    );
}
