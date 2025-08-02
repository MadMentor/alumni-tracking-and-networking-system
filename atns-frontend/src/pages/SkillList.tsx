// src/pages/SkillList.tsx
import React, { useEffect, useState } from "react";
import { type SkillDto, getAllSkills, deleteSkill } from "../services/skillService";
import { Link } from "react-router-dom";

const SkillList: React.FC = () => {
    const [skills, setSkills] = useState<SkillDto[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchSkills = async () => {
        try {
            console.log("Fetching skills...");
            setLoading(true);
            const response = await getAllSkills();
            console.log("Skills response:", response);
            setSkills(response.data);
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        try {
            await deleteSkill(id);
            fetchSkills(); // Refresh list
        } catch (error) {
            console.error("Error deleting skill:", error);
        }
    };

    useEffect(() => {
        console.log("SkillList component mounted");
        fetchSkills();
    }, []);

    console.log("SkillList render - loading:", loading, "skills:", skills);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading skills...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Skills Management</h2>
                        <Link
                            to="/skills/new"
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                        >
                            + Add New Skill
                        </Link>
                    </div>
                    
                    {skills.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-500 text-lg mb-4">No skills found</p>
                            <Link
                                to="/skills/new"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold"
                            >
                                Add Your First Skill
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {skills.map((skill) => (
                                <div
                                    key={skill.id}
                                    className="flex justify-between items-center bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{skill.name}</h3>
                                        <p className="text-gray-600">{skill.description}</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <Link
                                            to={`/skills/edit/${skill.id}`}
                                            className="text-blue-600 hover:text-blue-800 font-semibold transition-colors duration-200"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(skill.id)}
                                            className="text-red-600 hover:text-red-800 font-semibold transition-colors duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SkillList;
