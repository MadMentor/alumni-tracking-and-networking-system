import { useEffect, useState } from "react";
import { fetchSkills } from "../api/skillApi";
import type { Skill } from "../types/skill";
import { Link } from "react-router-dom";
import { Plus, Edit3, Award } from "lucide-react";

const SkillList: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        fetchSkills()
            .then(setSkills)
            .catch(() => setError("Failed to load skills."))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8 text-center text-gray-600">Loading...</div>
    );

    return (
        <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
                    <Link
                        to="/skills/new"
                        className="btn btn-primary"
                    >
                        <Plus className="w-4 h-4" />
                        Add Skill
                    </Link>
                </div>

                {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

                {skills.length === 0 ? (
                    <div className="card p-8 text-center text-gray-600">
                        <Award className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        No skills found.
                    </div>
                ) : (
                    <div className="card">
                        <div className="card-body">
                            <ul className="divide-y">
                                {skills.map((skill) => (
                                    <li key={skill.id} className="py-3 flex justify-between items-center">
                                        <div className="text-lg font-medium text-gray-900">{skill.name}</div>
                                        <Link
                                            to={`/skills/${skill.id}/edit`}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            <Edit3 className="w-4 h-4" />
                                            Edit
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
};

export default SkillList;
