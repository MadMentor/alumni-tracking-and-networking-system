import Card from "../ui/Card";
import { Activity, UserPlus, Calendar, Award, MessageCircle } from "lucide-react";

interface Activity {
    id: number;
    description: string;
    date: string;
    type?: "connection" | "event" | "skill" | "message";
}

interface Props {
    activities: Activity[];
}

export default function RecentActivityCard({ activities }: Props) {
    const getActivityIcon = (type?: string) => {
        switch (type) {
            case "connection":
                return <UserPlus className="w-4 h-4 text-blue-500" />;
            case "event":
                return <Calendar className="w-4 h-4 text-purple-500" />;
            case "skill":
                return <Award className="w-4 h-4 text-green-500" />;
            case "message":
                return <MessageCircle className="w-4 h-4 text-orange-500" />;
            default:
                return <Activity className="w-4 h-4 text-gray-500" />;
        }
    };

    const getActivityColor = (type?: string) => {
        switch (type) {
            case "connection":
                return "bg-blue-50 border-blue-200";
            case "event":
                return "bg-purple-50 border-purple-200";
            case "skill":
                return "bg-green-50 border-green-200";
            case "message":
                return "bg-orange-50 border-orange-200";
            default:
                return "bg-gray-50 border-gray-200";
        }
    };

    return (
        <Card
            title="Recent Activity"
            icon={<Activity className="w-5 h-5 text-orange-600" />}
            footer={
                <button className="btn btn-secondary w-full">
                    <Activity className="w-4 h-4" />
                    View All Activity
                </button>
            }
        >
            {activities.length === 0 ? (
                <div className="text-center py-8">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recent activity</p>
                    <p className="text-gray-400 text-xs mt-1">Your activity will appear here</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {activities.slice(0, 5).map((act) => (
                        <div
                            key={act.id}
                            className={`p-3 rounded-lg border ${getActivityColor(act.type)} hover:shadow-sm transition-shadow`}
                        >
                            <div className="flex items-start gap-3">
                                <div className="flex-shrink-0 mt-0.5">
                                    {getActivityIcon(act.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-700 leading-relaxed">
                                        {act.description}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {new Date(act.date).toLocaleDateString(undefined, {
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    {activities.length > 5 && (
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                                +{activities.length - 5} more activities
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
