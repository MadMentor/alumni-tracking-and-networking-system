// src/hooks/useRegister.ts
import { useState } from 'react';
import { registerApi } from "../api/registerApi";

export const useRegister = () => {
    const [loading, setLoading] = useState(false);
    // Remove error state completely - let parent handle errors
    const [step, setStep] = useState<'email' | 'otp' | 'profile'>('email');
    const [email, setEmail] = useState('');
    const [assignedRole, setAssignedRole] = useState('');

    const initiateRegistration = async (email: string) => {
        setLoading(true);

        try {
            const result = await registerApi.initiateRegistration(email);

            if (result.success) {
                setEmail(email);
                setStep('otp');
                return { success: true };
            } else {
                return { success: false, error: result.error };
            }
        } catch (err: any) {
            return { success: false, error: err.message || 'An error occurred' };
        } finally {
            setLoading(false);
        }
    };

    const verifyEmail = async (code: string) => {
        setLoading(true);

        try {
            const result = await registerApi.verifyEmail(email, code);

            if (result.success) {
                setAssignedRole(result.data?.assignedRole || 'ROLE_STUDENT');
                setStep('profile');
                return {
                    success: true,
                    assignedRole: result.data?.assignedRole,
                    message: result.data?.message
                };
            } else {
                return { success: false, error: result.error || 'Invalid verification code' };
            }
        } catch (err: any) {
            return { success: false, error: err.message || 'An error occurred' };
        } finally {
            setLoading(false);
        }
    };

    const completeRegistration = async (username: string, password: string) => {
        setLoading(true);

        try {
            const result = await registerApi.completeRegistration(email, username, password);

            if (result.success) {
                return {
                    success: true,
                    message: result.message
                };
            } else {
                return { success: false, error: result.error || 'Registration failed' };
            }
        } catch (err: any) {
            return { success: false, error: err.message || 'An error occurred' };
        } finally {
            setLoading(false);
        }
    };

    const resendOtp = async () => {
        setLoading(true);

        try {
            const result = await registerApi.resendOtp(email);

            if (result.success) {
                return { success: true, message: result.message };
            } else {
                return { success: false, error: result.error || 'Failed to resend code' };
            }
        } catch (err: any) {
            return { success: false, error: err.message || 'An error occurred' };
        } finally {
            setLoading(false);
        }
    };

    const goBackToEmail = () => {
        setStep('email');
    };

    const goBackToOtp = () => {
        setStep('otp');
    };

    return {
        loading,
        step,
        email,
        assignedRole,
        initiateRegistration,
        verifyEmail,
        completeRegistration,
        resendOtp,
        goBackToEmail,
        goBackToOtp
    };
};