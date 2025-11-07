import axiosInstance from "./axiosInstance";

export interface LoginResponseDto {
    profileId: number;
    username: string;
    token: string;
    refreshToken: string;
    roles: string[];
}

export interface LoginRequestDto {
    email: string;
    password: string;
}

export async function loginApi({ email, password }: LoginRequestDto): Promise<LoginResponseDto> {
    const res = await axiosInstance.post<LoginResponseDto>("/auth/login", { email, password });
    if (!res.data.token) {
        throw new Error('No token received from server');
    }
    return res.data; // contains token, refreshToken, username, roles
}
