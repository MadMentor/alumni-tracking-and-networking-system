import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Briefcase, Calendar } from "lucide-react";
import Card from "../components/ui/Card";
import { fetchProfileById } from "../api/profileApi";
import type { Profile } from "../types/profile";

export default function ProfileDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                if (!id) return;
                const data = await fetchProfileById(Number(id));
                setProfile(data);
            } catch (err) {
                console.error(err);
                setError("Failed to load profile details");
            } finally {
                setLoading(false);
            }
        };
        loadProfile();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="text-center py-10 text-gray-600">
                {error || "Profile not found."}
            </div>
        );
    }

    const handleBack = () => {
        navigate(-1); // Goes back to the previous page in history
    };

    return (
        <div className="max-w-5xl mx-auto mt-8 space-y-6">
            <div>
                <button
                    onClick={handleBack}
                    className="btn btn-outline flex items-center gap-2"
                >
                    ← Back
                </button>
                {/* Rest of your profile details */}
            </div>

            {/* Profile Header */}
            <Card>
                <div className="flex items-center gap-4">
                    <div
                        className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-3xl">
                    <User className="w-10 h-10" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">
                            {profile.firstName} {profile.lastName}
                        </h2>
                        <p className="text-sm text-gray-600">{profile.currentPosition}</p>
                        <p className="text-xs text-gray-500">{profile.faculty} • Batch {profile.batchYear}</p>
                    </div>
                </div>
            </Card>

            {/* Contact Info */}
            <Card title="Contact Information" icon={<Briefcase className="w-5 h-5 text-blue-500" />}>
                <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Phone:</span> {profile.phoneNumber || "N/A"}</p>
                    <p><span className="font-medium">Address:</span> {profile.address || "N/A"}</p>
                    <p><span className="font-medium">Date of Birth:</span> {profile.dateOfBirth || "N/A"}</p>
                </div>
            </Card>

            {/* Skills */}
            <Card title="Skills" icon={<Briefcase className="w-5 h-5 text-green-500" />}>
                {profile.skills && profile.skills.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill) => (
                            <span key={skill.id} className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                                {skill.name}
                            </span>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 text-sm">No skills listed</p>
                )}
            </Card>

            {/* Events Section (optional for now) */}
            <Card title="Events" icon={<Calendar className="w-5 h-5 text-purple-500" />}>
                <p className="text-sm text-gray-500">No events added yet.</p>
            </Card>
        </div>
    );
}
