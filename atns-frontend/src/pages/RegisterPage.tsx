// src/pages/RegisterPage.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAuthStore } from "../store/authStore";
import RegistrationWizard from "../components/RegistrationWizard";

const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    // const authStore = useAuthStore();
    const [alertMessage, setAlertMessage] = useState<string | null>(null);
    const [alertType, setAlertType] = useState<"success" | "error" | null>(null);
    const [showAlert, setShowAlert] = useState(false);

    // // Redirect if already authenticated
    // useEffect(() => {
    //     if (authStore.isAuthenticated) {
    //         navigate("/dashboard");
    //     }
    // }, [authStore.isAuthenticated, navigate]);

    // Auto-hide alert after 5 seconds
    useEffect(() => {
        if (showAlert) {
            const timer = setTimeout(() => {
                setShowAlert(false);
                // Clear message after fade-out animation
                setTimeout(() => {
                    setAlertMessage(null);
                    setAlertType(null);
                }, 300);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [showAlert]);

    const closeAlert = () => {
        setShowAlert(false);
        // Clear message after fade-out animation
        setTimeout(() => {
            setAlertMessage(null);
            setAlertType(null);
        }, 300);
    };

    const handleRegistrationSuccess = () => {
        setAlertType("success");
        setAlertMessage("Registration successful! Redirecting to profile...");
        setShowAlert(true);

        setTimeout(() => {
            navigate("/profile");
        }, 2000);
    };

    const handleRegistrationError = (error: string) => {
        setAlertType("error");
        // Format the error message for better user experience
        const formattedError = error.includes("whitelist") || error.includes("authorized")
            ? "This email is not authorized for registration. Please contact the College Administration."
            : error;

        setAlertMessage(formattedError);
        setShowAlert(true);
    };

    return (
        <>
            {/* Alert Banner with fade animation */}
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
                        transition: "opacity 0.3s ease-in-out",
                        opacity: showAlert ? 1 : 0,
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

            <RegistrationWizard
                onSuccess={handleRegistrationSuccess}
                onError={handleRegistrationError}
            />
        </>
    );
};

export default RegisterPage;