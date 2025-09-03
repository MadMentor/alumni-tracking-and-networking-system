import { Users, UserPlus, Clock } from "lucide-react";
import Card from "../ui/Card.tsx";

interface Props {
    total: number;
    pendingRequests: number;
}

export default function ConnectionsCard({ total, pendingRequests }: Props) {
    return (
        <Card
            title="My Network"
            icon={<Users className="w-5 h-5 text-blue-600" />}
            footer={
                <button className="btn btn-primary w-full">
                    <UserPlus className="w-4 h-4" />
                    View All Connections
                </button>
            }
        >
            <div className="space-y-6">
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{total}</div>
                        <div className="text-sm text-blue-700 font-medium">Total Connections</div>
                    </div>
                    <div className="text-center p-4 bg-orange-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 mb-1">{pendingRequests}</div>
                        <div className="text-sm text-orange-700 font-medium">Pending Requests</div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-3">
                    <button className="w-full btn btn-secondary btn-sm">
                        <UserPlus className="w-4 h-4" />
                        Send Connection Request
                    </button>
                    <button className="w-full btn btn-ghost btn-sm">
                        <Clock className="w-4 h-4" />
                        View Pending Requests
                    </button>
                </div>

                {/* Network Growth */}
                <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Network Growth</span>
                        <span className="text-green-600 font-medium">+12% this month</span>
                    </div>
                    <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
