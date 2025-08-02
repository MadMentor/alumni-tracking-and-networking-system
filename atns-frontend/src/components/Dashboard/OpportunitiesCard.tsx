import React from "react";

interface Opportunity {
    id: number;
    title: string;
    company: string;
}

interface Props {
    opportunities: Opportunity[];
}

export default function OpportunitiesCard({ opportunities }: Props) {
    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Job Opportunities</h3>
            <ul>
                {opportunities.map(job => (
                    <li key={job.id} className="mb-2">
                        {job.title} @ <strong>{job.company}</strong>
                    </li>
                ))}
            </ul>
            <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                See All Opportunities
            </button>
        </div>
    );
}
