// src/services/SkillService.ts
import axios from "axios";

export interface SkillDto {
    id?: number;
    name: string;
    description: string;
}

const BASE_URL = "http://localhost:8080/api/v1/skills";

// Helper function to get auth headers
const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getAllSkills = () => axios.get<SkillDto[]>(BASE_URL, { headers: getAuthHeaders() });

export const getSkillById = (id: number) => axios.get<SkillDto>(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });

export const createSkill = (skill: SkillDto) => axios.post<SkillDto>(BASE_URL, skill, { headers: getAuthHeaders() });

export const updateSkill = (id: number, skill: SkillDto) => axios.put<SkillDto>(`${BASE_URL}/${id}`, skill, { headers: getAuthHeaders() });

export const deleteSkill = (id: number) => axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeaders() });
