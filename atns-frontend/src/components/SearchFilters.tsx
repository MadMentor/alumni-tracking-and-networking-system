// components/SearchFilters.tsx
import React, { useState } from 'react';

interface SearchFiltersProps {
    onSearch: (filters: {
        title: string;
        company: string;
        location: string;
        skills: string[];
    }) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
    const [filters, setFilters] = useState({
        title: '',
        company: '',
        location: '',
        skills: [] as string[]
    });

    const [currentSkill, setCurrentSkill] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (currentSkill.trim() && !filters.skills.includes(currentSkill.trim())) {
            setFilters(prev => ({
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
        setFilters(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(filters);
    };

    const handleReset = () => {
        setFilters({
            title: '',
            company: '',
            location: '',
            skills: []
        });
        setCurrentSkill('');
        onSearch({
            title: '',
            company: '',
            location: '',
            skills: []
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                        Job Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        value={filters.title}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="Search by title"
                    />
                </div>

                <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                        Company
                    </label>
                    <input
                        type="text"
                        id="company"
                        name="company"
                        value={filters.company}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="Search by company"
                    />
                </div>

                <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                    </label>
                    <input
                        type="text"
                        id="location"
                        name="location"
                        value={filters.location}
                        onChange={handleChange}
                        className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                        placeholder="Search by location"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Skills
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={currentSkill}
                            onChange={(e) => setCurrentSkill(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                            placeholder="Add skill"
                        />
                        <button
                            type="button"
                            onClick={handleAddSkill}
                            className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                        >
                            Add
                        </button>
                    </div>
                </div>
            </div>

            {filters.skills.length > 0 && (
                <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                        {filters.skills.map(skill => (
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
            )}

            <div className="flex gap-3">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                    Search
                </button>
                <button
                    type="button"
                    onClick={handleReset}
                    className="bg-gray-200 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
                >
                    Reset
                </button>
            </div>
        </form>
    );
};

export default SearchFilters;