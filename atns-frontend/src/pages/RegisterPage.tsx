// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "../types/user";
import { useAuthStore } from "../store/authStore";
import axiosInstance from "../api/axiosInstance";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

    const handleRegister = async (username: string, email: string, password: string, role: UserRole[]) => {
        try {
            const response = await axiosInstance.post("/auth/register", {
                username,
                email,
                password,
                role
            });

            const data = response.data;
            console.log("Registration response:", data);

            // Check if we have the expected response structure
            if (data.token) {
                // Store everything in authStore ONLY - the store will handle persistence
                authStore.login(
                    data.username || username,
                    data.token,
                    data.refreshToken || "",
                    data.profileId,
                    data.roles || role.map(r => r.toString())
                );

                setAlertType("success");
                setAlertMessage("Registration successful! Logging you in...");

                setTimeout(() => {
                    setAlertMessage(null);
                    navigate("/profile");
                }, 2000);
            } else {
                // If no token in response, just show success and redirect to log in
                setAlertType("success");
                setAlertMessage("Registration successful! Please login with your credentials.");

                setTimeout(() => {
                    setAlertMessage(null);
                    navigate("/login");
                }, 2000);
            }

        } catch (error: unknown) {
            console.error("Registration failed:", error);

            let errorMessage = "Please try again.";
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as {
                    response?: {
                        status?: number;
                        data?: {
                            message?: string;
                            error?: string;
                        }
                    }
                };

                if (axiosError.response?.data?.message) {
                    errorMessage = axiosError.response.data.message;
                } else if (axiosError.response?.data?.error) {
                    errorMessage = axiosError.response.data.error;
                } else if (axiosError.response?.status === 409) {
                    errorMessage = "User with this email already exists.";
                } else if (axiosError.response?.status === 400) {
                    errorMessage = "Invalid registration data.";
                } else if (axiosError.response?.status === 422) {
                    errorMessage = "Validation failed. Please check your input.";
                }
            }

            setAlertType("error");
            setAlertMessage("Registration failed: " + errorMessage);

            setTimeout(() => {
                setAlertMessage(null);
            }, 5000);
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
        setAlertType(null);
    };

    return (
        <>
            {/* Alert Banner */}
            {alertMessage && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: "15px",
                        color: "white",
                        backgroundColor: alertType === "success" ? "green" : "red",
                        textAlign: "center",
                        zIndex: 9999,
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}
                >
                    <span style={{ flex: 1 }}>{alertMessage}</span>
                    <button
                        onClick={closeAlert}
                        style={{
                            background: "none",
                            border: "none",
                            color: "white",
                            fontSize: "20px",
                            cursor: "pointer",
                            padding: "0 10px",
                        }}
                    >
                        ×
                    </button>
                </div>
            )}

            <RegisterForm onRegister={handleRegister} />
        </>
    );
};

export default RegisterPage;