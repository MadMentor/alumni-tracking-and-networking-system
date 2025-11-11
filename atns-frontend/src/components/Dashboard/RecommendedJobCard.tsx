import { Link } from "react-router-dom";
import Card from "../ui/Card";
import { Briefcase, MapPin, Building, Star } from "lucide-react";
import type { RecommendedJob } from "../../types/recommendation";

interface Props {
    jobs: RecommendedJob[];
}

export default function RecommendedJobsCard({ jobs }: Props) {
    const getScoreColor = (score: number) => {
        if (score >= 0.8) return "text-green-600 bg-green-50 border-green-200";
        if (score >= 0.6) return "text-blue-600 bg-blue-50 border-blue-200";
        if (score >= 0.4) return "text-yellow-600 bg-yellow-50 border-yellow-200";
        return "text-gray-600 bg-gray-50 border-gray-200";
    };

    const formatScore = (score: number) => {
        return Math.round(score * 100);
    };

    return (
        <Card
            title="Recommended Jobs"
            icon={<Briefcase className="w-5 h-5 text-blue-500" />}
            footer={
                <Link to="/recommendations?tab=jobs" className="w-full">
                    <button className="btn btn-primary w-full flex items-center justify-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        See All Job Recommendations
                    </button>
                </Link>
            }
        >
            {jobs.length === 0 ? (
                <div className="text-center py-8">
                    <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm">No recommended jobs yet</p>
                    <p className="text-gray-400 text-xs mt-1">
                        Complete your profile to get personalized job matches
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {jobs.slice(0, 3).map((job) => (
                        <div
                            key={job.jobId}
                            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Link
                                to={`/jobs/${job.jobId}`}
                                className="block hover:scale-[1.02] transition-transform"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2">
                                            {job.title}
                                        </h4>
                                        <div className="flex items-center text-gray-600 text-xs space-x-3">
                                            <div className="flex items-center gap-1">
                                                <Building className="w-3 h-3" />
                                                <span>{job.companyName}</span>
                                            </div>
                                            {job.location && (
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-3 h-3" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div
                                        className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${getScoreColor(job.similarityScore)}`}
                                    >
                                        <Star className="w-3 h-3" />
                                        {formatScore(job.similarityScore)}%
                                    </div>
                                </div>

                                {job.requiredSkills && job.requiredSkills.length > 0 && (
                                    <div className="mt-2">
                                        <div className="flex flex-wrap gap-1">
                                            {job.requiredSkills.slice(0, 3).map((skill) => (
                                                <span
                                                    key={skill}
                                                    className="text-xs bg-gray-200 text-gray-700 rounded px-1.5 py-0.5"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {job.requiredSkills.length > 3 && (
                                                <span className="text-xs bg-gray-200 text-gray-500 rounded px-1.5 py-0.5">
                                                    +{job.requiredSkills.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Link>
                        </div>
                    ))}
                    {jobs.length > 3 && (
                        <div className="text-center pt-2">
                            <p className="text-xs text-gray-500">
                                +{jobs.length - 3} more job recommendations
                            </p>
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}