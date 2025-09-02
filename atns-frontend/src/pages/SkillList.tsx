import React, { useEffect, useState } from "react";
import { fetchSkills } from "../api/skillApi";
import type { Skill } from "../types/skill";
import { Link } from "react-router-dom";

const SkillList: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchSkills()
            .then(setSkills)
            .catch(() => setError("Failed to load skills."));
    }, []);

    return (
        <div className="p-4 bg-white rounded-xl shadow-md max-w-3xl mx-auto mt-6">
            <h1 className="text-2xl font-bold mb-4">Skills</h1>
            {error && <p className="text-red-500">{error}</p>}
            <div className="mb-4 text-right">
                <Link
                    to="/skills/new"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    Add Skill
                </Link>
            </div>
            {skills.length === 0 ? (
                <p>No skills found.</p>
            ) : (
                <ul className="divide-y">
                    {skills.map((skill) => (
                        <li key={skill.id} className="py-3 flex justify-between items-center">
                            <div>
                                <div className="text-lg font-medium">{skill.name}</div>
                                {/*<div className="text-sm text-gray-500">*/}
                                {/*    /!*Created: {new Date(skill.createdAt).toLocaleDateString()}*!/*/}
                                {/*</div>*/}
                            </div>
                            <Link
                                to={`/skills/${skill.id}/edit`}
                                className="text-blue-600 hover:underline"
                            >
                                Edit
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SkillList;
