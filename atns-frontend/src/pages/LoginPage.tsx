// src/pages/LoginPage.tsx
import React, {useState, useEffect} from "react";
import LoginForm from "../components/LoginForm";
import {useNavigate} from "react-router-dom";
import axiosInstance from "../api/axiosInstance.ts";
import {fetchProfile} from "../api/profileApi.ts";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
                setAlertType(null);
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    function isTokenExpired(token: string | null): boolean {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const expiry = payload.exp * 1000;
            return Date.now() > expiry;
        } catch (e) {
            return true; // invalid token format treated as expired
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token || isTokenExpired(token)) {
            localStorage.removeItem('token');
            setCheckingAuth(false);
        } else {
            navigate("/dashboard");
        }
    }, []);

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === 'object' && 'response' in error) {
            const errorResponse = error as { response?: { status?: number; data?: { message?: string } } };
            const status = errorResponse.response?.status;
            const message = errorResponse.response?.data?.message;
            
            switch (status) {
                case 401:
                    return "Invalid username or password. Please check your credentials.";
                case 404:
                    return "Account not found. Please check your username or register a new account.";
                case 400:
                    if (message?.includes("username")) {
                        return "Username is required. Please enter your username.";
                    }
                    if (message?.includes("password")) {
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
        }
        
        return "Login failed. Please check your credentials and try again.";
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            const response = await axiosInstance.post("/auth/login", {
                email,
                password,
            });

            if (response.data.token) {
                localStorage.setItem("token", response.data.token);
            }

            const profile = await fetchProfile();
            if (profile.id !== undefined && profile.id !== null) {
                localStorage.setItem("profileId", profile.id.toString());
            }

            if (response.data.roles) {
                localStorage.setItem("roles", JSON.stringify(response.data.roles));
            }

            setAlertType("success");
            setAlertMessage("Login success! Redirecting to dashboard...");

            setTimeout(() => {
                setAlertMessage(null);
                setAlertType(null);
                navigate("/dashboard");
            }, 1000);
        } catch (error: unknown) {
            setAlertType("error");
            setAlertMessage(getErrorMessage(error));
        }
    };

    const closeAlert = () => {
        setAlertMessage(null);
        setAlertType(null);
    };

    if (checkingAuth) return <div className="text-center mt-20">Checking authentication...</div>;

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

            {/* Full-screen layout delegated to LoginForm */}
            <LoginForm onLogin={handleLogin} />
        </>
    );
};

export default LoginPage;
