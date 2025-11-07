import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/ui/Card";
import { User, Users } from "lucide-react";
import FollowButton from "../components/FollowButton";
import { fetchRecommendedUsers } from "../api/recommendationApi";
import { fetchProfilesExplore } from "../api/profileApi";
import type { RecommendedUser } from "../types/recommendation";
import type { Profile } from "../types/profile";
import Explore from "../components/Dashboard/Explore";

export default function ExplorePage() {
    const [recommended, setRecommended] = useState<RecommendedUser[]>([]);
    const [explore, setExplore] = useState<Profile[]>([]);
    const [search, setSearch] = useState("");
    const [searchType, setSearchType] = useState<"name" | "batch" | "company" | "skill">("name");
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const size = 10;
    const profileId = Number(localStorage.getItem("profileId"));

    // Fetch recommended users
    useEffect(() => {
        const fetchRecommended = async () => {
            const data = await fetchRecommendedUsers(10);
            setRecommended(data);
        };
        fetchRecommended();
    }, []);

    // Fetch explore users
    useEffect(() => {
        const fetchExplore = async () => {
            setLoading(true);
            try {
                const data = await fetchProfilesExplore(profileId, page, size, search, searchType);
                setExplore(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        const timeoutId = setTimeout(() => {
            fetchExplore();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [profileId, page, search, searchType]);

    // Handle search from Explore component
    const handleExploreSearch = (query: string, type: "name" | "batch" | "company" | "skill") => {
        setSearch(query);
        setSearchType(type);
        setPage(0); // Reset to first page
    };

    return (
        <div className="max-w-5xl mx-auto mt-6 space-y-6">
            {/* Recommended Users Card */}
            <Card
                title="Recommended Users"
                icon={<User className="w-5 h-5 text-blue-500" />}
                footer={
                    recommended.length > 0 && (
                        <Link to="/users/recommended" className="w-full">
                            <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                                <User className="w-4 h-4" />
                                See All Recommendations
                            </button>
                        </Link>
                    )
                }
            >
                {recommended.length === 0 ? (
                    <div className="text-center py-8">
                        <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No recommended users yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {recommended.slice(0, 3).map((user) => (
                            <div
                                key={user.profileId}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                            >
                                <div>
                                    <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                        {user.firstName} {user.lastName}
                                    </h4>
                                    <p className="text-xs text-gray-600">{user.faculty}</p>
                                    <div className="flex flex-wrap gap-1 mt-1">
                                        {Array.from(user.skills).map((skill) => (
                                            <span key={skill} className="text-xs bg-gray-200 rounded px-1">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <FollowButton
                                    currentProfileId={profileId}
                                    targetProfileId={user.profileId}
                                />
                            </div>
                        ))}
                        {recommended.length > 3 && (
                            <div className="text-center pt-2">
                                <p className="text-xs text-gray-500">+{recommended.length - 3} more recommendations</p>
                            </div>
                        )}
                    </div>
                )}
            </Card>

            {/* Explore Component */}
            <Explore onSearch={handleExploreSearch} />

            {/* Explore Users Card */}
            <Card
                title="Explore Users"
                icon={<Users className="w-5 h-5 text-green-500" />}
            >
                {loading ? (
                    <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                        <p className="text-gray-500 text-sm mt-2">Loading users...</p>
                    </div>
                ) : explore.length === 0 ? (
                    <div className="text-center py-8">
                        <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">
                            {search ? "No users found matching your search" : "No users to explore"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {explore.map((user) => (
                            <div
                                key={user.id}
                                className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center"
                            >
                                <Link
                                    to={`/profiles/${user.id}`}
                                    className="flex-1 hover:no-underline"
                                >
                                    <div>
                                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 hover:text-blue-600">
                                            {user.firstName} {user.lastName}
                                        </h4>
                                        <p className="text-xs text-gray-600">{user.faculty}</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {user.skills?.slice(0, 3).map((skill) => (
                                                <span key={skill.id} className="text-xs bg-gray-200 rounded px-1">
            {skill.name} {/* use skill.name */}
        </span>
                                            ))}
                                            {user.skills && user.skills.length > 3 && (
                                                <span className="text-xs text-gray-500">
            +{user.skills.length - 3} more
        </span>
                                            )}
                                        </div>

                                    </div>
                                </Link>
                                <FollowButton
                                    currentProfileId={profileId}
                                    targetProfileId={user.id!}
                                />
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {explore.length > 0 && (
                    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
                        <button
                            onClick={() => setPage(Math.max(page - 1, 0))}
                            disabled={page === 0}
                            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Previous
                        </button>
                        <span className="text-sm text-gray-600">Page {page + 1}</span>
                        <button
                            onClick={() => setPage(page + 1)}
                            disabled={explore.length < size}
                            className="btn btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Next
                        </button>
                    </div>
                )}
            </Card>
        </div>
    );
}
