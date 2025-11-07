import {MapPin, GraduationCap, Briefcase, Clock} from "lucide-react";
import {Link} from "react-router-dom";
import { useAuthStore } from "../../store/authStore.ts";

interface Props {
    fullName: string;
    profileImageUrl?: string;
    address: string;
    batchYear: number;
    faculty: string;
    currentPosition: string;
    size?: 'sm' | 'md' | 'lg';
    status?: 'active' | 'away';
}

const profileId = useAuthStore.getState().profileId;
const DEFAULT_AVATAR = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face';

export default function WelcomeCard({
                                        fullName,
                                        profileImageUrl,
                                        address,
                                        batchYear,
                                        faculty,
                                        currentPosition,
                                        size = 'md',
                                        status
                                    }: Props) {
    const sizeClasses = {
        sm: {img: 'w-16 h-16', text: 'text-lg', subtitle: 'text-sm'},
        md: {img: 'w-20 h-20', text: 'text-2xl', subtitle: 'text-base'},
        lg: {img: 'w-24 h-24', text: 'text-3xl', subtitle: 'text-lg'}
    };

    const {img, text, subtitle} = sizeClasses[size];

    return (
        <div className="card overflow-hidden group">
            <div className="relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 opacity-50"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full -translate-y-16 translate-x-16"></div>
                
                <div className="relative p-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {/* Profile Image */}
                        <div className="relative flex-shrink-0">
                            <div className={`${img} rounded-2xl overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-blue-200 transition-all duration-300`}>
                                <img
                                    src={profileImageUrl || DEFAULT_AVATAR}
                                    alt={`${fullName}'s profile`}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {status && (
                                <span
                                    className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-3 border-white shadow-sm
                                        ${status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}
                                    aria-label={status}
                                />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <h2 className={`${text} font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors`}>
                                Welcome back, {fullName}! 👋
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <span className={`${subtitle} truncate`}>
                                        {address || "Address not available"}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-3 text-gray-600">
                                    <GraduationCap className="w-5 h-5 text-purple-500 flex-shrink-0" />
                                    <span className={`${subtitle} truncate`}>
                                        {faculty}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Clock className="w-5 h-5 text-green-500 flex-shrink-0" />
                                    <span className={`${subtitle} truncate`}>
                                        Batch of {batchYear || "N/A"}
                                    </span>
                                </div>
                                
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Briefcase className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                                    <span className={`${subtitle} truncate`}>
                                        {currentPosition || "Position not specified"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex-shrink-0">
                            <div className="flex flex-col gap-2">
                                <Link to="/profile" className="w-full">
                                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                                        Update Profile
                                    </button>
                                </Link>
                                {/* View Details button */}
                                <Link to={`/profiledetails/${profileId}`} className="w-full">
                                    <button className="btn btn-secondary w-full flex items-center justify-center gap-2">
                                        View Details
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
