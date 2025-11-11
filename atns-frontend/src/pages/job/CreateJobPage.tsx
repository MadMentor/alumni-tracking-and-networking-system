// pages/CreateJobPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import JobForm from "../../components/JobForm.tsx";
import { jobApi } from '../../api/jobApi.ts';
import type {JobRequestDto} from '../../types/job.ts';

const CreateJobPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (jobData: JobRequestDto) => {
    try {
      setLoading(true);
      setError('');
      await jobApi.createJob(jobData);
      navigate('/jobs');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Post a New Job</h1>
        <p className="text-gray-600 mt-2">Fill in the details below to create a new job posting.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <JobForm
        onSubmit={handleSubmit}
        loading={loading}
        submitText="Create Job"
      />
    </div>
  );
};

export default CreateJobPage;