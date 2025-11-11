// pages/JobsPage.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {jobApi} from "../../api/jobApi.ts";
import type { JobResponseDto, PageResponse } from "../../types/job.ts";
import JobCard from "../../components/JobCard.tsx";
import SearchFilters from "../../components/SearchFilters.tsx";

const JobsPage: React.FC = () => {
    const [jobsPage, setJobsPage] = useState<PageResponse<JobResponseDto> | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');
    const [currentPage, setCurrentPage] = useState(0);
    const [filters, setFilters] = useState({
        title: '',
        company: '',
        location: '',
        skills: [] as string[]
    });

    useEffect(() => {
        loadJobs();
    }, [currentPage]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const jobsData = await jobApi.getAllJobs(currentPage, 20);
            setJobsPage(jobsData);
        } catch (err) {
            setError('Failed to load jobs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (searchFilters: typeof filters) => {
        try {
            setLoading(true);
            setCurrentPage(0);
            const jobsData = await jobApi.searchJobs({
                ...searchFilters,
                page: 0,
                size: 20
            });
            setJobsPage(jobsData);
            setFilters(searchFilters);
        } catch (err) {
            setError('Failed to search jobs');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Job Listings</h1>
                <Link
                    to="/jobs/create"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Post a Job
                </Link>
            </div>

            <SearchFilters onSearch={handleSearch} />

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
                {jobsPage?.content.map(job => (
                    <JobCard key={job.id} job={job} />
                ))}
            </div>

            {jobsPage?.content.length === 0 && !loading && (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">No jobs found matching your criteria.</p>
                </div>
            )}

            {/* Pagination */}
            {jobsPage && jobsPage.totalPages > 1 && (
                <div className="flex justify-center items-center space-x-2">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="px-3 py-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Previous
                    </button>

                    <span className="text-sm text-gray-600">
                        Page {currentPage + 1} of {jobsPage.totalPages}
                    </span>

                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage >= jobsPage.totalPages - 1}
                        className="px-3 py-2 rounded border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default JobsPage;