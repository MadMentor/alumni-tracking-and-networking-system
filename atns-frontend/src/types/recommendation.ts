export interface RecommendedEvent {
    eventId: number;
    eventName: string;
    category: string;
    location: string;
    startTime: string;
    score: number;
}

export interface RecommendedUser {
    profileId: number;
    firstName: string;
    lastName: string;
    faculty: string;
    skills: string[];
    score: number;
    profileImageUrl?: string;
    currentPosition: string;
}
