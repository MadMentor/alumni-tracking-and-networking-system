// src/pages/SkillForm.tsx
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { type SkillDto, getSkillById, createSkill, updateSkill } from "../services/skillService";

const SkillForm: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [formData, setFormData] = useState<SkillDto>({
        name: "",
        description: "",
    });

    useEffect(() => {
        if (isEdit && id) {
            getSkillById(parseInt(id)).then((res) => setFormData(res.data));
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isEdit && id) {
            await updateSkill(parseInt(id), { ...formData, id: parseInt(id) });
        } else {
            await createSkill(formData);
        }
        navigate("/skills");
    };

    return (
        <div className="skill-form-container">
            <h2>{isEdit ? "Edit Skill" : "Add Skill"}</h2>
            <form onSubmit={handleSubmit} className="skill-form">
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        style={{
                            padding: "10px 12px",
                            fontSize: "16px",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            width: "100%",
                        }}
                    />
                </div>
                <button type="submit">
                    {isEdit ? "Update" : "Create"}
                </button>
            </form>
        </div>
    );
};

export default SkillForm;
