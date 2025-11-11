// pages/JobDetailsPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { jobApi } from "../../api/jobApi.ts";
import type {JobResponseDto} from "../../types/job.ts";

const JobDetailsPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<JobResponseDto | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        if (id) {
            loadJob(parseInt(id));
        }
    }, [id]);

    const loadJob = async (jobId: number) => {
        try {
            setLoading(true);
            const jobData = await jobApi.getJobById(jobId);
            setJob(jobData);
        } catch (err) {
            setError('Job not found');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!job || !window.confirm('Are you sure you want to delete this job?')) return;

        try {
            await jobApi.deleteJob(job.id);
            navigate('/jobs');
        } catch (err) {
            setError('Failed to delete job');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    {error || 'Job not found'}
                </div>
                <Link to="/jobs" className="inline-block mt-4 text-blue-600 hover:text-blue-800">
                    ← Back to Jobs
                </Link>
            </div>
        );
    }

    const isActive = job.active ?? (job.expiresAt ? new Date(job.expiresAt) > new Date() : true);

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
                ← Back to Jobs
            </Link>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <p className="text-xl text-gray-600 mb-1">{job.companyName}</p>
                        <p className="text-gray-500">{job.location}</p>
                    </div>
                    {!isActive && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
              Expired
            </span>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="md:col-span-2">
                        <div className="prose max-w-none">
                            <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                            <p className="text-gray-700 whitespace-pre-wrap">{job.description}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Job Details</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-600">Posted: </span>
                                    <span>{new Date(job.postedAt).toLocaleDateString()}</span>
                                </div>
                                {job.expiresAt && (
                                    <div>
                                        <span className="text-gray-600">Expires: </span>
                                        <span>{new Date(job.expiresAt).toLocaleDateString()}</span>
                                    </div>
                                )}
                                {job.postedByName && (
                                    <div>
                                        <span className="text-gray-600">Posted by: </span>
                                        <span>{job.postedByName}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                            <div className="flex flex-wrap gap-2">
                                {job.skills.map(skill => (
                                    <span
                                        key={skill}
                                        className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                    >
                    {skill}
                  </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 pt-6 border-t border-gray-200">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Apply Now
                    </button>
                    <Link
                        to={`/jobs/${job.id}/edit`}
                        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                        Edit Job
                    </Link>
                    <button
                        onClick={handleDelete}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Delete Job
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JobDetailsPage;