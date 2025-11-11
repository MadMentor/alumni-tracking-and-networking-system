// types/job.ts
export interface JobRequestDto {
    title: string;
    description: string;
    companyName: string;
    location: string;
    skills: string[];
    expiresAt?: string;
}

export interface JobResponseDto {
    id: number;
    title: string;
    description: string;
    companyName: string;
    location: string;
    skills: string[];
    postedAt: string;
    expiresAt?: string;
    postedById?: number;
    postedByName?: string;
    active?: boolean;
}

export interface JobUpdateDto {
    title?: string;
    description?: string;
    companyName?: string;
    location?: string;
    skills?: string[];
    expiresAt?: string;
}

export interface RecommendedJobDto {
    jobId: number;
    title: string;
    companyName: string;
    location: string;
    requiredSkills: string[];
    similarityScore: number;
}

// Add Page response type
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    size: number;
    number: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}