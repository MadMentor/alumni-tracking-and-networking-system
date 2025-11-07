import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { User } from "lucide-react";
import type { RecommendedUser } from "../../types/recommendation";
import FollowButton from "../FollowButton";

interface Props {
    users: RecommendedUser[];
    profileId: number; // current logged-in user
}

export default function RecommendedUsersCard({ users, profileId }: Props) {
    return (
        <Card
            title="Recommended Users"
            icon={<User className="w-5 h-5 text-blue-500" />}
            footer={
                <Link to="/users/recommended" className="w-full">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <User className="w-4 h-4" />
                        See All Recommendations
                    </button>
                </Link>
            }
        >
            {users.length === 0 ? (
                <div className="text-center py-8">
                    <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recommended users yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {users.slice(0, 3).map((user) => (
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

                            {/* Use FollowButton for each user */}
                            <FollowButton
                                currentProfileId={profileId}
                                targetProfileId={user.profileId}
                            />
                        </div>
                    ))}
                    {users.length > 3 && (
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">+{users.length - 3} more recommendations</p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
