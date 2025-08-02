// src/pages/LoginPage.tsx
import React, {useState, useEffect} from "react";
import axios from "axios";
import LoginForm from "../components/LoginForm";
import {useNavigate} from "react-router-dom";

const LoginPage: React.FC = () => {
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
            case 401:
                return "Invalid username or password. Please check your credentials.";
            case 404:
                return "Account not found. Please check your username or register a new account.";
            case 400:
                if (message.includes("username")) {
                    return "Username is required. Please enter your username.";
                }
                if (message.includes("password")) {
                    return "Password is required. Please enter your password.";
                }
                return "Invalid login data. Please check your input.";
            case 422:
                return "Validation failed. Please check your input and try again.";
            case 500:
                return "Server error. Please try again later.";
            default:
                return message || "Login failed. Please check your credentials and try again.";
        }
    };

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
            setAlertMessage("Login success! Redirecting to dashboard...");

            setTimeout(() => {
                setAlertMessage(null);
                setAlertType(null);
                navigate("/dashboard");
            }, 1000);
        } catch (error: any) {
            console.error("Login failed:", error.response?.data || error.message);
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
                <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                <LoginForm onLogin={handleLogin}/>
            </div>
        </div>
    );
};

export default LoginPage;
