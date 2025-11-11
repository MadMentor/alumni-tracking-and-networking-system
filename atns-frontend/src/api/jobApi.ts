// api/jobApi.ts
import axiosInstance from './axiosInstance';
import type { JobRequestDto, JobResponseDto, JobUpdateDto, RecommendedJobDto } from '../types/job';

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

export const jobApi = {
    // Create a new job
    createJob: async (jobData: JobRequestDto): Promise<JobResponseDto> => {
        const response = await axiosInstance.post('/jobs', jobData);
        return response.data;
    },

    // Get all jobs - now returns Page
    getAllJobs: async (page: number = 0, size: number = 20): Promise<PageResponse<JobResponseDto>> => {
        const response = await axiosInstance.get(`/jobs?page=${page}&size=${size}`);
        return response.data;
    },

    // Get job by ID
    getJobById: async (id: number): Promise<JobResponseDto> => {
        const response = await axiosInstance.get(`/jobs/${id}`);
        return response.data;
    },

    // Get active jobs - now returns Page
    getActiveJobs: async (page: number = 0, size: number = 20): Promise<PageResponse<JobResponseDto>> => {
        const response = await axiosInstance.get(`/jobs/active?page=${page}&size=${size}`);
        return response.data;
    },

    // Update job
    updateJob: async (id: number, updateData: JobUpdateDto): Promise<JobResponseDto> => {
        const response = await axiosInstance.put(`/jobs/${id}`, updateData);
        return response.data;
    },

    // Delete job
    deleteJob: async (id: number): Promise<void> => {
        await axiosInstance.delete(`/jobs/${id}`);
    },

    // Get job recommendations
    getRecommendations: async (limit: number = 10): Promise<RecommendedJobDto[]> => {
        const response = await axiosInstance.get(`/jobs/recommendations?limit=${limit}`);
        return response.data;
    },

    // Get jobs by company - now returns Page
    getJobsByCompany: async (companyName: string, page: number = 0, size: number = 20): Promise<PageResponse<JobResponseDto>> => {
        const response = await axiosInstance.get(`/jobs/company/${encodeURIComponent(companyName)}?page=${page}&size=${size}`);
        return response.data;
    },

    // Get jobs by location - now returns Page
    getJobsByLocation: async (location: string, page: number = 0, size: number = 20): Promise<PageResponse<JobResponseDto>> => {
        const response = await axiosInstance.get(`/jobs/location/${encodeURIComponent(location)}?page=${page}&size=${size}`);
        return response.data;
    },

    // Get my posted jobs - now returns Page
    getMyJobs: async (page: number = 0, size: number = 20): Promise<PageResponse<JobResponseDto>> => {
        const response = await axiosInstance.get(`/jobs/my-jobs?page=${page}&size=${size}`);
        return response.data;
    },

    // Search jobs - now returns Page
    searchJobs: async (params: {
        title?: string;
        company?: string;
        location?: string;
        skills?: string[];
        page?: number;
        size?: number;
    }): Promise<PageResponse<JobResponseDto>> => {
        const response = await axiosInstance.get('/jobs/search', { params });
        return response.data;
    }
};