import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { User } from "lucide-react";
import type { RecommendedUser } from "../../types/recommendation";

interface Props {
    users: RecommendedUser[];
}

export default function RecommendedUsersCard({ users }: Props) {
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
                    {users.slice(0, 5).map(user => (
                        <div
                            key={user.profileId}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-between"
                        >
                            <div>
                                <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-1">
                                    {user.firstName} {user.lastName}
                                </h4>
                                <p className="text-xs text-gray-600 mb-1">{user.faculty}</p>
                                <p className="text-xs text-purple-600">
                                    Skills: {Array.from(user.skills).join(", ")}
                                </p>
                            </div>
                            <div className="text-xs text-green-600 font-medium">
                                {(user.score * 100).toFixed(0)}% match
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
}
