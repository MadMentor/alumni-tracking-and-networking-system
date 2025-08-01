// src/components/RegisterForm.tsx
import React, { useState } from "react";

interface RegisterFormProps {
    onRegister: (username: string, email: string, password: string) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setError("");
        onRegister(username, email, password);
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            {error && <p className="error">{error}</p>}

            <div>
                <label>Username:</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Email:</label>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>

            <div>
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
