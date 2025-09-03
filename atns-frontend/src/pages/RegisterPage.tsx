// src/pages/RegisterPage.tsx
import {useState} from "react";
import axios from "axios";
import RegisterForm from "../components/RegisterForm";
import {useNavigate} from "react-router-dom";
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
                    navigate("/profile");
                }, 2000);
            }

        } catch (error: unknown) {
            console.error("Registration failed:", error);
            
            let errorMessage = "Please try again.";
            if (error && typeof error === 'object' && 'response' in error) {
                const axiosError = error as { response?: { data?: { message?: string } } };
                errorMessage = axiosError.response?.data?.message || errorMessage;
            }
            
            setAlertType("error");
            setAlertMessage("Registration failed: " + errorMessage);

            setTimeout(() => {
                setAlertMessage(null);
            }, 3000);
        }
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
                    }}
                >
                    {alertMessage}
                </div>
            )}

            {/* Full-screen layout delegated to RegisterForm */}
            <RegisterForm onRegister={handleRegister}/>
        </>
    );
};

export default RegisterPage;
