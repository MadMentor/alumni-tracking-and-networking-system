import axiosInstance from "./axiosInstance";
import type { Skill } from "../types/skill";

// Get all skills by Id
export async function fetchSkills(): Promise<Skill[]> {
    const res = await axiosInstance.get<Skill[]>(`/profiles/me/skills`);
    return res.data;
}

// Create a new skill
export async function createSkill(skill: Partial<Skill>): Promise<Skill> {
    const res = await axiosInstance.post<Skill>("/skills", skill);
    return res.data;
}

// Update an existing skill
export async function updateSkill(id: number, skill: Partial<Skill>): Promise<Skill> {
    const res = await axiosInstance.put<Skill>(`/skills/${id}`, skill);
    return res.data;
}

// Delete a skill
export async function deleteSkill(id: number): Promise<void> {
    await axiosInstance.delete(`/skills/${id}`);
}
