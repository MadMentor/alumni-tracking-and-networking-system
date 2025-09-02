export interface Connection {
    id: number;
    profileId: number;
    connectedProfileId: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: string;
    updatedAt: string;
} 