export interface EventLocation {
    address?: string;
    onlineLink?: string;
    roomNumber?: string;
}

export interface Event {
    eventId?: number;
    eventName: string;
    eventDescription?: string;
    startTime: string; // ISO string
    endTime?: string | null; // ISO string or null
    eventLocation?: EventLocation;
    category?: string;
    active?: boolean;
}
