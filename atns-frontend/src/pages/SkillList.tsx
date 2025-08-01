// src/pages/SkillList.tsx
import React, { useEffect, useState } from "react";
import { type SkillDto, getAllSkills, deleteSkill } from "../services/skillService";
import { Link } from "react-router-dom";

const SkillList: React.FC = () => {
    const [skills, setSkills] = useState<SkillDto[]>([]);

    const fetchSkills = async () => {
        const response = await getAllSkills();
        setSkills(response.data);
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        await deleteSkill(id);
        fetchSkills(); // Refresh list
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-8 font-sans">
            <h2 className="text-3xl font-bold mb-6 text-gray-800">Skills</h2>
            <Link
                to="/skills/new"
                className="inline-block bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition mb-6"
            >
                Add New
            </Link>
            <ul className="space-y-4">
                {skills.map((skill) => (
                    <li
                        key={skill.id}
                        className="flex justify-between items-center bg-gray-100 p-4 rounded-md shadow-sm"
                    >
                        <div>
                            <strong className="text-lg text-gray-900">{skill.name}</strong>:{" "}
                            <span className="text-gray-700">{skill.description}</span>
                        </div>
                        <div className="space-x-4">
                            <Link
                                to={`/skills/edit/${skill.id}`}
                                className="text-blue-600 hover:underline font-semibold"
                            >
                                Edit
                            </Link>
                            <button
                                onClick={() => handleDelete(skill.id)}
                                className="text-red-600 hover:underline font-semibold"
                            >
                                Delete
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SkillList;
