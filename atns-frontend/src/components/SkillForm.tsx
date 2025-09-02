import React, {useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSkill, updateSkill } from "../api/skillApi";

const SkillForm: React.FC = () => {
    const [name, setName] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            if (id) {
                await updateSkill(Number(id), { name });
            } else {
                await createSkill({ name });
            }
            navigate("/skills");
        } catch (err) {
            setError("Failed to save skill. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">{id ? "Edit Skill" : "Add Skill"}</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label className="block mb-2 text-sm font-medium text-gray-700">Skill Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
                    required
                />
                <button
                    type="submit"
                    className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Saving..." : id ? "Update Skill" : "Create Skill"}
                </button>
            </form>
        </div>
    );
};

export default SkillForm;
