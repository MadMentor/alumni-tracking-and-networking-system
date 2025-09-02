export interface Skill {
    id: number;
    name: string;
    profiles?: any[]; // You can replace `any` with actual Profile type if needed
    createdAt?: string;
    updatedAt?: string;
}
