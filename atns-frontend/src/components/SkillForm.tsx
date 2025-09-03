import {useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createSkill, updateSkill } from "../api/skillApi";
import { Hammer } from "lucide-react";

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
        <main className="min-h-screen pt-24 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md mx-auto">
                <div className="card">
                    <div className="card-header">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Hammer className="w-5 h-5 text-blue-600" />
                            {id ? "Edit Skill" : "Add Skill"}
                        </h2>
                    </div>
                    <div className="card-body">
                        {error && <div className="mb-4 p-2 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="form-label">Skill Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="form-input"
                                    required
                                />
                            </div>
                            <div className="card-footer">
                                <button
                                    type="submit"
                                    className={`btn btn-primary w-full ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                    disabled={loading}
                                >
                                    {loading ? "Saving..." : id ? "Update Skill" : "Create Skill"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default SkillForm;
