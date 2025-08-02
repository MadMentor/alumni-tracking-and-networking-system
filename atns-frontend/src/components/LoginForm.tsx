// src/components/LoginForm.tsx
import React, { useState } from "react";

interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const validateInputs = (username: string, password: string): string | null => {
        if (!username.trim()) {
            return "Username is required.";
        }
        if (!password.trim()) {
            return "Password is required.";
        }
        if (username.trim().length < 3) {
            return "Username must be at least 3 characters long.";
        }
        if (password.length < 1) {
            return "Password is required.";
        }
        return null;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const validationError = validateInputs(username, password);
        if (validationError) {
            setError(validationError);
            return;
        }

        onLogin(username.trim(), password);
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
            {error && <p className="error">{error}</p>}
            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter your username"
                />
            </div>

            <div>
                <label htmlFor="password">Password:</label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
