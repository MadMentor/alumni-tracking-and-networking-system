// components/JobForm.tsx
import React, { useState } from 'react';
import type {JobRequestDto} from '../types/job';

interface JobFormProps {
    onSubmit: (data: JobRequestDto) => void; // Changed to only accept JobRequestDto
    loading?: boolean;
    initialData?: any;
    submitText?: string;
}

const JobForm: React.FC<JobFormProps> = ({
                                             onSubmit,
                                             loading = false,
                                             initialData,
                                             submitText = "Save Job"
                                         }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
        companyName: initialData?.companyName || '',
        location: initialData?.location || '',
        skills: initialData?.skills || [] as string[],
        expiresAt: initialData?.expiresAt ? initialData.expiresAt.split('T')[0] : ''
    });

    const [currentSkill, setCurrentSkill] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (currentSkill.trim() && !formData.skills.includes(currentSkill.trim())) {
            setFormData(prev => ({
                ...prev,
                skills: [...prev.skills, currentSkill.trim()]
            }));
            setCurrentSkill('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddSkill();
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.filter((skill: string) => skill !== skillToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Create a proper JobRequestDto with required fields
        const submitData: JobRequestDto = {
            title: formData.title,
            description: formData.description,
            companyName: formData.companyName,
            location: formData.location,
            skills: formData.skills,
            ...(formData.expiresAt && { expiresAt: new Date(formData.expiresAt).toISOString() })
        };

        onSubmit(submitData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-sm border">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Job Title *
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="e.g., Senior Software Engineer"
                />
            </div>

            <div>
                <label htmlFor="companyName" className="block text-sm font-medium text-gray-700">
                    Company Name *
                </label>
                <input
                    type="text"
                    id="companyName"
                    name="companyName"
                    required
                    value={formData.companyName}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="e.g., Tech Corp Inc."
                />
            </div>

            <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                    Location
                </label>
                <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="e.g., Remote, New York, NY"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    Job Description
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={6}
                    value={formData.description}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    placeholder="Describe the job responsibilities, requirements, and benefits..."
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Skills
                </label>
                <div className="flex gap-2 mb-2">
                    <input
                        type="text"
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="Add a skill and press Enter"
                    />
                    <button
                        type="button"
                        onClick={handleAddSkill}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
                    >
                        Add
                    </button>
                </div>
                <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill: string) => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
              {skill}
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-blue-600 hover:text-blue-800"
                            >
                ×
              </button>
            </span>
                    ))}
                </div>
            </div>

            <div>
                <label htmlFor="expiresAt" className="block text-sm font-medium text-gray-700">
                    Expiration Date
                </label>
                <input
                    type="date"
                    id="expiresAt"
                    name="expiresAt"
                    value={formData.expiresAt}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                />
            </div>

            <div className="flex justify-end gap-4 pt-4">
                <button
                    type="button"
                    className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? 'Saving...' : submitText}
                </button>
            </div>
        </form>
    );
};

export default JobForm;