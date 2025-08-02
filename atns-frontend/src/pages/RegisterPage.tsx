// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";
import { useNavigate } from "react-router-dom";
import type {UserRole} from "../types/user.ts";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

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
                setAlertMessage("Registration successful! Logging you in...");
                setTimeout(() => {
                    setAlertMessage(null);
                    navigate("/");
                }, 2000);            }

        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            setAlertType("error")
            setAlertMessage("Registration failed: " + (error.response?.data?.message || "Please try again."));
        }
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
                    }}
                >
                    {alertMessage}
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
