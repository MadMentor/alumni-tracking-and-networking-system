import React, { useEffect, useState } from "react";
// @ts-ignore
import { Link } from "react-router-dom";

interface UserProfile {
    id: number;
    fullName: string;
    email: string;
    username: string;
    currentPosition: string;
    company: string;
    batch: string;
    graduationYear: string;
    profilePictureUrl?: string;
    bio?: string;
    location?: string;
    phone?: string;
    linkedinUrl?: string;
    githubUrl?: string;
}

const Profile: React.FC = () => {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        // Simulate loading profile from API
        const fetchProfile = async () => {
            try {
                setLoading(true);
                // Mock data for now - replace with actual API call
                const mockProfile: UserProfile = {
                    id: 1,
                    fullName: "John Doe",
                    email: "john.doe@example.com",
                    username: "johndoe",
                    currentPosition: "Senior Software Engineer",
                    company: "Tech Corp",
                    batch: "2020",
                    graduationYear: "2020",
                    profilePictureUrl: "https://via.placeholder.com/150",
                    bio: "Passionate software engineer with 3+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies.",
                    location: "San Francisco, CA",
                    phone: "+1 (555) 123-4567",
                    linkedinUrl: "https://linkedin.com/in/johndoe",
                    githubUrl: "https://github.com/johndoe"
                };

                // Simulate API delay
                await new Promise(resolve => setTimeout(resolve, 1000));
                setProfile(mockProfile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 mb-4">Failed to load profile</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Profile</h2>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                        >
                            {isEditing ? "Cancel" : "Edit Profile"}
                        </button>
                    </div>

                    {/* Profile Picture and Basic Info */}
                    <div className="flex items-start space-x-6">
                        <div className="flex-shrink-0">
                            <img
                                src={profile.profilePictureUrl || "https://via.placeholder.com/150"}
                                alt={`${profile.fullName}'s profile`}
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{profile.fullName}</h3>
                            <p className="text-lg text-gray-600 mb-1">{profile.currentPosition}</p>
                            <p className="text-gray-600 mb-4">{profile.company}</p>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                                <span>Batch of {profile.batch}</span>
                                <span>•</span>
                                <span>Graduated {profile.graduationYear}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Personal Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <p className="text-gray-900">{profile.fullName}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <p className="text-gray-900">{profile.email}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                <p className="text-gray-900">{profile.username}</p>
                            </div>
                            {profile.phone && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <p className="text-gray-900">{profile.phone}</p>
                                </div>
                            )}
                            {profile.location && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                    <p className="text-gray-900">{profile.location}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Professional Information */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">Professional Information</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Position</label>
                                <p className="text-gray-900">{profile.currentPosition}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                                <p className="text-gray-900">{profile.company}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                                <p className="text-gray-900">{profile.batch}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Graduation Year</label>
                                <p className="text-gray-900">{profile.graduationYear}</p>
                            </div>
                        </div>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">About</h3>
                            <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
                        </div>
                    )}

                    {/* Social Links */}
                    {(profile.linkedinUrl || profile.githubUrl) && (
                        <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Social Links</h3>
                            <div className="flex space-x-4">
                                {profile.linkedinUrl && (
                                    <a
                                        href={profile.linkedinUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                        </svg>
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                                {profile.githubUrl && (
                                    <a
                                        href={profile.githubUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                        </svg>
                                        <span>GitHub</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Account Actions</h3>
                    <div className="flex flex-wrap gap-4">
                        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold">
                            Change Password
                        </button>
                        <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold">
                            Privacy Settings
                        </button>
                        <button className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors duration-200 font-semibold">
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile; 