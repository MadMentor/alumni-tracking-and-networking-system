// src/pages/LoginPage.tsx
import React, {useState} from "react";
import axios from "axios";
import LoginForm from "../components/LoginForm";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);

    const handleLogin = async (username: string, password: string) => {
        try {

            const response = await axios.post("http://localhost:8080/api/v1/auth/login", {
                username,
                password,
            });

            console.log("Login successful:", response.data);

            // Store token if received
            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            // Redirect or show success
            setAlertType("success");
            setAlertMessage("Login success! Redirecting to home page...");

            setTimeout(() => {
                setAlertMessage(null);
                navigate("/");
            }, 2000);
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
            setAlertType("error");
            setAlertMessage("Login failed: " + (error.response?.data?.message || "Invalid credentials"));
        }
    };

    return (
        <div>
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
            <h2>Login</h2>
            <LoginForm onLogin={handleLogin}/>
        </div>
    );
};

export default LoginPage;
