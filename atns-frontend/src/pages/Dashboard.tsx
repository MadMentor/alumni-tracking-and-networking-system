import React, {useEffect, useState} from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import ConnectionsCard from "../components/Dashboard/ConnectionsCard";
// import MessagesCard from "../components/Dashboard/MessagesCard";
import EventsCard from "../components/Dashboard/EventsCard";
import SearchAlumni from "../components/Dashboard/SearchAlumni";
// import OpportunitiesCard from "../components/Dashboard/OpportunitiesCard";
import RecentActivityCard from "../components/Dashboard/RecentActivityCard";
import type {Profile} from "../types/profile";

import {
    fetchProfile,
    fetchConnections,
    // fetchMessages,
    fetchEvents,
    // fetchOpportunities,
    fetchRecentActivity,
} from "../api/dashboardApi";

export default function Dashboard() {
    const [profile, setProfile] = useState<Profile | null>(null);
    const [connections, setConnections] = useState<{ total: number; pendingRequests: number } | null>(null);
    // const [messages, setMessages] = useState(null);
    const [events, setEvents] = useState([]);
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
            fetchEvents().then(setEvents).catch((err) => {
                console.error("Failed to fetch events:", err);
                setEvents([]); // empty fallback
            }),
            fetchRecentActivity().then(setActivities).catch((err) => {
                console.error("Failed to fetch recent activity:", err);
                setActivities([]);
            }),
        ]).finally(() => setIsLoading(false));
    }, []);

    if (isLoading || !profile || !connections) {
        return <div className="p-6">Loading dashboard...</div>;
    }


    return (
        <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <WelcomeCard
                fullName={profile.firstName + " " + profile.lastName}
                profileImageUrl={profile.profileImageUrl}
                address={profile.address}
                batchYear={profile.batchYear}
                faculty={profile.faculty}
                currentPosition={profile.currentPosition}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

            <SearchAlumni/>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/*<OpportunitiesCard opportunities={opportunities} />*/}
                <RecentActivityCard activities={activities}/>
            </div>
        </main>
    );
}
