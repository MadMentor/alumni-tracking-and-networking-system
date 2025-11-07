import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import FollowButton from "../components/FollowButton";

type Profile = {
    profileId: number;
    firstName: string;
    lastName: string;
    faculty: string;
    batchYear?: number;
    currentPosition?: string;
    skills: string[];
    events: Event[];
};

type Event = {
    id: number;
    title: string;
    date: string;
    description?: string;
};

export default function ProfileDetailPage() {
    const { id } = useParams<{ id: string }>();
    const profileId = Number(localStorage.getItem("profileId"));
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!id) return;

        const fetchProfile = async () => {
            try {
                const res = await axiosInstance.get<Profile>(`/profiles/${id}`, {
                    headers: { "X-Profile-Id": profileId },
                });
                setProfile(res.data);
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [id, profileId]);

    if (loading) return <p className="text-center mt-6">Loading...</p>;
    if (!profile) return <p className="text-center mt-6">Profile not found</p>;

    return (
        <div className="max-w-4xl mx-auto mt-6 space-y-6">
            {/* Profile Info */}
            <div className="flex justify-between items-center p-6 bg-white rounded-lg shadow">
                <div>
                    <h1 className="text-2xl font-bold">
                        {profile.firstName} {profile.lastName}
                    </h1>
                    <p className="text-gray-600">{profile.currentPosition}</p>
                    <p className="text-gray-500 text-sm">
                        {profile.faculty} | Batch {profile.batchYear}
                    </p>
                </div>
                <FollowButton
                    currentProfileId={profileId}
                    targetProfileId={profile.profileId}
                />
            </div>

            {/* Skills */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Skills</h2>
                <div className="flex flex-wrap gap-2">
                    {profile.skills.length === 0 ? (
                        <p className="text-gray-500 text-sm">No skills listed</p>
                    ) : (
                        profile.skills.map(skill => (
                            <span
                                key={skill}
                                className="px-2 py-1 bg-gray-200 text-gray-700 rounded-full text-sm"
                            >
                {skill}
              </span>
                        ))
                    )}
                </div>
            </div>

            {/* Events */}
            <div className="p-6 bg-white rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-2">Events</h2>
                {profile.events.length === 0 ? (
                    <p className="text-gray-500 text-sm">No events</p>
                ) : (
                    <ul className="space-y-3">
                        {profile.events.map(event => (
                            <li
                                key={event.id}
                                className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                            >
                                <h3 className="font-medium">{event.title}</h3>
                                <p className="text-gray-500 text-sm">{new Date(event.date).toLocaleDateString()}</p>
                                {event.description && (
                                    <p className="text-gray-600 text-sm mt-1">{event.description}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
