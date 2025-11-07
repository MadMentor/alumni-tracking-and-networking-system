import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import { useAuthStore } from "../store/authStore";
import { loginApi } from "../api/loginApi";
import { fetchProfile } from "../api/profileApi";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const authStore = useAuthStore();

    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
    const [checkingAuth, setCheckingAuth] = useState(true);

    // Auto-hide alerts
    useEffect(() => {
        if (alertMessage) {
            const timer = setTimeout(() => {
                setAlertMessage(null);
                setAlertType(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [alertMessage]);

    // Check token on mount - FIXED: Only run once on component mount
    useEffect(() => {
        const token = authStore.token;

        if (!token) {
            setCheckingAuth(false);
            return;
        }

        if (isTokenExpired(token)) {
            authStore.logout();
            setCheckingAuth(false);
        } else {
            navigate("/dashboard");
        }
    }, []); // Empty dependency array to run only once on mount

    function isTokenExpired(token: string | null): boolean {
        if (!token) return true;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const expiry = payload.exp * 1000;
            return Date.now() > expiry;
        } catch {
            return true;
        }
    }

    const getErrorMessage = (error: unknown): string => {
        if (error && typeof error === "object" && "response" in error) {
            const err = error as { response?: { status?: number; data?: { message?: string } } };
            const status = err.response?.status;
            const message = err.response?.data?.message;

            switch (status) {
                case 401: return "Invalid email or password.";
                case 404: return "Account not found.";
                case 400: return message || "Invalid login data.";
                case 422: return "Validation failed. Check your input.";
                case 500: return "Server error. Try again later.";
                default: return message || "Login failed.";
            }
        }
        return "Login failed. Please check your credentials.";
    };

    const handleLogin = async (email: string, password: string) => {
        try {
            console.log("Starting login...");
            // Call backend login API
            const data = await loginApi({ email, password });
            console.log("Login API response:", data);
            if (!data.token || data.token === "null" || data.token === "undefined") {
                throw new Error("Invalid token received from server");
            }

            // Save user & token in Zustand
            authStore.login(
                data.username,
                data.token,
                data.refreshToken,
                Array.from(data.roles)
            );

            // Fetch profile after login
            const profile = await fetchProfile();
            if (profile.id) localStorage.setItem("profileId", profile.id.toString());

            setAlertType("success");
            setAlertMessage("Login successful! Redirecting...");

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

    if (checkingAuth)
        return <div className="text-center mt-20">Checking authentication...</div>;

    return (
        <>
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
            <LoginForm onLogin={handleLogin} />
        </>
    );
};

export default LoginPage;