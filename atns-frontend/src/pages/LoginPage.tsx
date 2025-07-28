// src/pages/LoginPage.tsx
import React from "react";
import axios from "axios";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
    const handleLogin = async (username: string, password: string) => {
        try {
            const response = await axios.post("http://localhost:8080/api/auth/login", {
                username,
                password,
            });

            console.log("Login successful:", response.data);

            // Store token if received
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            // Redirect or show success
            alert("Login success!");
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            alert("Login failed: " + (error.response?.data?.message || "Invalid credentials"));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <LoginForm onLogin={handleLogin} />
        </div>
    );
};

export default LoginPage;
