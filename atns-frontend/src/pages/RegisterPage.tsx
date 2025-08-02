// src/pages/RegisterPage.tsx
import React from "react";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";

const RegisterPage: React.FC = () => {
    const handleRegister = async (username: string, email: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:8080/api/v1/auth/register", {
                username,
                email,
                password,
            });

            console.log("Registration successful:", response.data);
            alert("Registration successful! You can now log in.");
            // Optionally redirect to login page here
        } catch (error: any) {
            console.error("Registration failed:", error.response?.data || error.message);
            alert("Registration failed: " + (error.response?.data?.message || "Please try again."));
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                <RegisterForm onRegister={handleRegister} />
            </div>
        </div>
    );
};

export default RegisterPage;
