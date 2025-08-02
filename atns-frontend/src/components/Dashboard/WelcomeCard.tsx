import React from "react";

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

const DEFAULT_AVATAR = '/default-avatar.png';

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
        sm: {img: 'w-12 h-12', text: 'text-base'},
        md: {img: 'w-16 h-16', text: 'text-xl'},
        lg: {img: 'w-20 h-20', text: 'text-2xl'}
    };

    const {img, text} = sizeClasses[size];

    return (
        <div
            className="bg-white p-6 rounded-lg shadow flex items-center gap-4 hover:shadow-md transition-shadow relative">
            <div className="relative">
                <img
                    src={profileImageUrl || DEFAULT_AVATAR}
                    alt={`${fullName}'s profile`}
                    className={`${img} rounded-full object-cover`}
                />
                {status && (
                    <span
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white 
                            ${status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`}
                        aria-label={status}
                    />
                )}
            </div>
            <div>
                <h2
                    className={`${text} font-semibold`}
                    aria-label={`Welcome back, ${fullName}`}
                    title={fullName}
                >
                    Welcome back, {fullName}!
                </h2>
                <p className="text-gray-600">
                    {address || "Address not available"} · Batch of {batchYear || "N/A"}
                </p>
                <p className="text-gray-600">
                    {faculty} · Batch of {batchYear} · {currentPosition}
                </p>
            </div>
        </div>
    );
}
