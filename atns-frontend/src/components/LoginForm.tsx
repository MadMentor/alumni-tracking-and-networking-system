// src/components/LoginForm.tsx
import React, { useState } from "react";

interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!username.trim() || !password.trim()) {
            setError("Username and password are required.");
            return;
        }

        setError("");
        onLogin(username, password);
    };

    return (
        <form onSubmit={handleSubmit} className="login-form">
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
                <label>Password:</label>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>

            <button type="submit">Login</button>
        </form>
    );
};

export default LoginForm;
