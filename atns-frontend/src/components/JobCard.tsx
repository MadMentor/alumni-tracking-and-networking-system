// components/JobCard.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import type {JobResponseDto} from '../types/job';

interface JobCardProps {
    job: JobResponseDto;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
    const isActive = job.active ?? (job.expiresAt ? new Date(job.expiresAt) > new Date() : true);

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-semibold text-gray-900 line-clamp-2">
                    {job.title}
                </h3>
                {!isActive && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Expired
          </span>
                )}
            </div>

            <p className="text-lg text-gray-600 mb-2">{job.companyName}</p>
            <p className="text-gray-500 mb-4">{job.location}</p>

            <p className="text-gray-700 line-clamp-3 mb-4">
                {job.description}
            </p>

            <div className="flex flex-wrap gap-1 mb-4">
                {job.skills.slice(0, 4).map(skill => (
                    <span
                        key={skill}
                        className="inline-block bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                    >
            {skill}
          </span>
                ))}
                {job.skills.length > 4 && (
                    <span className="inline-block bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
            +{job.skills.length - 4} more
          </span>
                )}
            </div>

            <div className="flex justify-between items-center text-sm text-gray-500">
                <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>
                {job.postedByName && (
                    <span>By {job.postedByName}</span>
                )}
            </div>

            <div className="mt-4 flex gap-2">
                <Link
                    to={`/jobs/${job.id}`}
                    className="flex-1 text-center bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
};

export default JobCard;