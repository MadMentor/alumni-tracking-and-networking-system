// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import type {UserRole} from "../types/user.ts";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

    // Auto-clear alert after 5 seconds
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
                setAlertType(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    const getErrorMessage = (error: any): string => {
        const status = error.response?.status;
        const message = error.response?.data?.message || error.message;

        switch (status) {
            case 409:
                return "Account already exists with this email or username.";
            case 400:
                if (message.includes("email")) {
                    return "Invalid email format. Please enter a valid email address.";
                }
                if (message.includes("password")) {
                    return "Password does not meet requirements. Please check the password rules.";
                }
                if (message.includes("username")) {
                    return "Username is invalid or already taken. Please choose a different username.";
                }
                return "Invalid registration data. Please check your input.";
            case 422:
                return "Validation failed. Please check your input and try again.";
            case 500:
                return "Server error. Please try again later.";
            default:
                return message || "Registration failed. Please try again.";
        }
    };

    const handleRegister = async (username: string, email: string, password: string, role: UserRole[]) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
                username,
                email,
                password,
                role
            });

            const token = response.data.token;

            if (token) {
                localStorage.setItem("token", token);
                setAlertType("success");
                setAlertMessage("Registration successful! Redirecting to login...");
                setTimeout(() => {
                    setAlertMessage(null);
                    setAlertType(null);
                    navigate("/login");
                }, 2000);            }

        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            setAlertType("error");
            setAlertMessage(getErrorMessage(error));
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
        setAlertType(null);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
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
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <RegisterForm onRegister={handleRegister} />
            </div>
        </div>
    );
};

export default RegisterPage;
