export interface EventLocation {
    address?: string;
    onlineLink?: string;
    roomNumber?: string;
}

export interface Event {
    id?: number;
    eventName: string;
    eventDescription?: string;
    startTime: string; // ISO string
    endTime?: string | null; // ISO string or null
    location?: EventLocation;
    category?: string;
    active?: boolean;
}
