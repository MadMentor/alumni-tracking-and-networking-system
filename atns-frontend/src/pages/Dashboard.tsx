// @ts-ignore
import React, { useEffect, useState } from "react";
import WelcomeCard from "../components/Dashboard/WelcomeCard";
import ConnectionsCard from "../components/Dashboard/ConnectionsCard";
// import MessagesCard from "../components/Dashboard/MessagesCard";
import EventsCard from "../components/Dashboard/EventsCard";
import SearchAlumni from "../components/Dashboard/SearchAlumni";
// import OpportunitiesCard from "../components/Dashboard/OpportunitiesCard";
import RecentActivityCard from "../components/Dashboard/RecentActivityCard";

import {
    fetchProfile,
    fetchConnections,
    // fetchMessages,
    fetchEvents,
    // fetchOpportunities,
    fetchRecentActivity,
} from "../api/dashboardApi";

export default function Dashboard() {
    const [profile, setProfile] = useState(null);
    const [connections, setConnections] = useState(null);
    // const [messages, setMessages] = useState(null);
    const [events, setEvents] = useState([]);
    // const [opportunities, setOpportunities] = useState([]);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        fetchProfile().then(setProfile).catch(console.error);
        fetchConnections().then(setConnections).catch(console.error);
        // fetchMessages().then(setMessages).catch(console.error);
        fetchEvents().then(setEvents).catch(console.error);
        // fetchOpportunities().then(setOpportunities).catch(console.error);
        fetchRecentActivity().then(setActivities).catch(console.error);
    }, []);

    if (!profile) {
        return <div className="p-6">Loading...</div>;
    }

    return (
        <main className="p-6 space-y-6 bg-gray-50 min-h-screen">
            <WelcomeCard
                fullName={profile.fullName}
                profilePictureUrl={profile.profilePictureUrl}
                currentPosition={profile.currentPosition}
                batch={profile.batch}
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

                <EventsCard events={events} />
            </div>

            <SearchAlumni />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/*<OpportunitiesCard opportunities={opportunities} />*/}
                <RecentActivityCard activities={activities} />
            </div>
        </main>
    );
}
