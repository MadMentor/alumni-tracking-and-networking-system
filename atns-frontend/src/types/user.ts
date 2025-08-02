export const UserRole = {
    STUDENT: 'STUDENT',
    ALUMNI: 'ALUMNI',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];