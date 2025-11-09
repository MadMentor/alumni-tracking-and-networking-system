import axiosInstance from './axiosInstance';
import { useAuthStore } from '../store/authStore';

export interface RegisterInitRequest {
    email: string;
}

export interface VerifyEmailRequest {
    email: string;
    code: string;
}

export interface RegisterCompleteRequest {
    email: string;
    username: string;
    password: string;
}

export interface ApiResponse<T = any> {
    success: boolean;
    message?: string;
    error?: string;
    data?: T;
}

export interface VerifyEmailResponse {
    success: boolean;
    message: string;
    email: string;
    assignedRole: string;
    nextStep: string;
}

export interface UserData {
    id: string;
    profileId: number;
    username: string;
    email: string;
    roles: string[];
    token: string;
    refreshToken: string;
}

export interface RegisterCompleteResponse {
    success: boolean;
    message: string;
    user: UserData;
}

class RegisterApi {
    // Step 1: Initiate registration - send OTP
    async initiateRegistration(email: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post('/auth/register/init', { email });
            return response.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    // Step 2: Verify OTP
    async verifyEmail(email: string, code: string): Promise<ApiResponse<VerifyEmailResponse>> {
        try {
            const response = await axiosInstance.post('/auth/register/verify-email', {
                email,
                code
            });
            return response.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    // Step 3: Complete registration with profile info
    async completeRegistration(
        email: string,
        username: string,
        password: string
    ): Promise<ApiResponse<RegisterCompleteResponse>> {
        try {
            const response = await axiosInstance.post('/auth/register/complete', {
                email,
                username,
                password
            });

            if (response.data.success && response.data.user) {
                // Auto-login after successful registration
                const userData = response.data.user;
                useAuthStore.getState().login(
                    userData.profileId,
                    userData.username,
                    userData.token,
                    userData.refreshToken,
                    userData.roles
                );
            }

            return response.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    // Resend OTP
    async resendOtp(email: string): Promise<ApiResponse> {
        try {
            const response = await axiosInstance.post('/auth/register/resend-otp', { email });
            return response.data;
        } catch (error: any) {
            return this.handleError(error);
        }
    }

    private handleError(error: any): ApiResponse {
        if (error.response?.data) {
            return {
                success: false,
                error: error.response.data.error || 'An error occurred',
                message: error.response.data.message
            };
        }

        return {
            success: false,
            error: error.message || 'Network error occurred'
        };
    }
}

export const registerApi = new RegisterApi();