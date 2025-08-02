// src/components/RegisterForm.tsx
import React, {useState} from "react";
import {UserRole} from "../types/user.ts";

interface RegisterFormProps {
    onRegister: (username: string, email: string, password: string, role: UserRole[]) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({onRegister}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([UserRole.STUDENT]);
    const [error, setError] = useState("");

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) {
            return "Password must be at least 8 characters long.";
        }
        if (!/[A-Z]/.test(password)) {
            return "Password must contain at least one uppercase letter.";
        }
        if (!/[a-z]/.test(password)) {
            return "Password must contain at least one lowercase letter.";
        }
        if (!/\d/.test(password)) {
            return "Password must contain at least one number.";
        }
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
            return "Password must contain at least one special character (!@#$%^&*).";
        }
        return null;
    };

    const validateUsername = (username: string): string | null => {
        if (username.length < 3) {
            return "Username must be at least 3 characters long.";
        }
        if (username.length > 20) {
            return "Username must be less than 20 characters.";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return "Username can only contain letters, numbers, and underscores.";
        }
        return null;
    };

    const validateEmail = (email: string): string | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return "Please enter a valid email address.";
        }
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        // Check for empty fields
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        // Validate username
        const usernameError = validateUsername(username.trim());
        if (usernameError) {
            setError(usernameError);
            return;
        }

        // Validate email
        const emailError = validateEmail(email.trim());
        if (emailError) {
            setError(emailError);
            return;
        }

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            return;
        }

        if (selectedRoles.length === 0) {
            setError("Please select at least one role.");
            return;
        }

        try {
            await onRegister(username.trim(), email.trim(), password, selectedRoles);
            // Clear form on success
            setUsername("");
            setEmail("");
            setPassword("");
        } catch (error: any) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="register-form">
            {error && <p className="error">{error}</p>}

            <div>
                <label htmlFor="username">Username:</label>
                <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter username (3-20 characters)"
                />
            </div>

            <div>
                <label htmlFor="roles">Roles:</label>
                <select
                    id="roles"
                    value={selectedRoles}
                    onChange={(e) => {
                        const selected = Array.from(e.target.selectedOptions, option => option.value as UserRole);
                        setSelectedRoles(selected);
                    }}
                    className="border rounded px-2 py-1 mt-1"
                >
                    {Object.values(UserRole).map((role) => (
                        <option key={role} value={role}>
                            {role}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
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
                    placeholder="Enter password (min 8 characters)"
                />
                <small style={{ color: '#666', fontSize: '0.8rem', display: 'block', marginTop: '4px' }}>
                    Password must contain: 8+ characters, uppercase, lowercase, number, and special character
                </small>
            </div>

            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
