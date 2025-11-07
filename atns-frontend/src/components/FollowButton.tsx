import React, { useState, useEffect } from "react";
import { UserPlus, UserCheck } from "lucide-react";
import axiosInstance from "../api/axiosInstance.ts";

type FollowButtonProps = {
    currentProfileId: number;
    targetProfileId: number;
};

type ConnectionStatus = "CONNECTED" | "FOLLOWED" | "NONE";

const FollowButton: React.FC<FollowButtonProps> = ({ currentProfileId, targetProfileId }) => {
    const [status, setStatus] = useState<ConnectionStatus | null>(null);
    const [loading, setLoading] = useState(false);

    const headers = { "X-Profile-Id": currentProfileId };

    // Fetch connection status
    useEffect(() => {
        if (!currentProfileId || !targetProfileId) return;

        const fetchStatus = async () => {
            try {
                const res = await axiosInstance.get<ConnectionStatus>(
                    `/profiles/${currentProfileId}/follows/status/${targetProfileId}`,
                    { headers }
                );
                setStatus(res.data);
            } catch (err) {
                console.error("Failed to fetch connection status", err);
            }
        };

        fetchStatus();
    }, [currentProfileId, targetProfileId]);

    // Follow profile
    const handleFollow = async () => {
        setLoading(true);
        try {
            await axiosInstance.post(
                `/profiles/${currentProfileId}/follows/${targetProfileId}`,
                null,
                { headers }
            );
            setStatus("FOLLOWED");
        } catch (err) {
            console.error("Failed to follow profile", err);
        } finally {
            setLoading(false);
        }
    };

    // Unfollow profile
    const handleUnfollow = async () => {
        setLoading(true);
        try {
            await axiosInstance.delete(
                `/profiles/${currentProfileId}/follows/${targetProfileId}`,
                { headers }
            );
            setStatus("NONE");
        } catch (err) {
            console.error("Failed to unfollow profile", err);
        } finally {
            setLoading(false);
        }
    };

    const renderButton = () => {
        if (loading)
            return (
                <button className="px-4 py-2 bg-gray-100 rounded-lg text-gray-600">
                    ...
                </button>
            );

        switch (status) {
            case "CONNECTED":
                return (
                    <button
                        onClick={handleUnfollow}
                        className="px-4 py-2 flex items-center gap-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition"
                    >
                        <UserCheck className="w-4 h-4" />
                        Connected
                    </button>
                );
            case "FOLLOWED":
                return (
                    <button
                        onClick={handleUnfollow}
                        className="px-4 py-2 flex items-center gap-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition"
                    >
                        <UserCheck className="w-4 h-4" />
                        Following
                    </button>
                );
            default:
                return (
                    <button
                        onClick={handleFollow}
                        className="px-4 py-2 flex items-center gap-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
                    >
                        <UserPlus className="w-4 h-4" />
                        Follow
                    </button>
                );
        }
    };

    return <>{renderButton()}</>;
};

export default FollowButton;
