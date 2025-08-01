// src/services/SkillService.ts
import axios from "axios";

export interface SkillDto {
    id?: number;
    name: string;
    description: string;
}

const BASE_URL = "/api/v1/skills";

export const getAllSkills = () => axios.get<SkillDto[]>(BASE_URL);

export const getSkillById = (id: number) => axios.get<SkillDto>(`${BASE_URL}/${id}`);

export const createSkill = (skill: SkillDto) => axios.post<SkillDto>(BASE_URL, skill);

export const updateSkill = (id: number, skill: SkillDto) => axios.put<SkillDto>(`${BASE_URL}/${id}`, skill);

export const deleteSkill = (id: number) => axios.delete(`${BASE_URL}/${id}`);
