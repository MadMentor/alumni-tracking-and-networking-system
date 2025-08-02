// src/pages/SkillForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { type SkillDto, getSkillById, createSkill, updateSkill } from "../services/skillService";

const SkillForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState<SkillDto>({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (isEdit && id) {
            setLoading(true);
            getSkillById(parseInt(id))
                .then((res) => setFormData(res.data))
                .catch((error) => console.error("Error fetching skill:", error))
                .finally(() => setLoading(false));
        }
    }, [id, isEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate form data
        if (!formData.name.trim() || !formData.description.trim()) {
            console.error("Form validation failed: name or description is empty");
            alert("Please fill in both skill name and description");
            return;
        }
        
        setLoading(true);
        
        console.log("Submitting form with data:", formData);
        
        try {
            if (isEdit && id) {
                console.log("Updating skill with ID:", id);
                await updateSkill(parseInt(id), { ...formData, id: parseInt(id) });
            } else {
                console.log("Creating new skill");
                const response = await createSkill(formData);
                console.log("Create skill response:", response);
            }
            console.log("Success! Navigating to /skills");
            navigate("/skills");
        } catch (error: any) {
            console.error("Error saving skill:", error);
            console.error("Error details:", error.response?.data);
            
            // Show user-friendly error message
            const errorMessage = error.response?.data?.message || error.message || "Failed to save skill. Please try again.";
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEdit) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading skill...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold text-gray-800">
                            {isEdit ? "Edit Skill" : "Add New Skill"}
                        </h2>
                        <Link
                            to="/skills"
                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                        >
                            ← Back to Skills
                        </Link>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                                Skill Name *
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                                placeholder="Enter skill name (e.g., JavaScript, React, Python)"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-none"
                                placeholder="Describe your skill level, experience, or any relevant details..."
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex space-x-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        {isEdit ? "Updating..." : "Creating..."}
                                    </div>
                                ) : (
                                    isEdit ? "Update Skill" : "Create Skill"
                                )}
                            </button>
                            
                            <Link
                                to="/skills"
                                className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-semibold text-center"
                            >
                                Cancel
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SkillForm;
