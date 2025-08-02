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

    // const handleRoleChange = (role: UserRole, isChecked: boolean) => {
    //     setSelectedRoles(prev =>
    //         isChecked
    //             ? [...prev, role]
    //             : prev.filter(r => r !== role)
    //     );
    // };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            return;
        }

        // Basic email validation
        if (!/\S+@\S+\.\S+/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        if (selectedRoles.length === 0) {
            setError("Please select at least one role.");
            return;
        }

        try {
            await onRegister(username, email, password, selectedRoles);
            // Clear form on success

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
                />
            </div>

            {/*<div>*/}
            {/*    <span>Roles:</span>*/}
            {/*    <div className="role-options">*/}
            {/*        {Object.values(UserRole).map(role => (*/}
            {/*            <label key={role}>*/}
            {/*                <input*/}
            {/*                    type="checkbox"*/}
            {/*                    checked={selectedRoles.includes(role)}*/}
            {/*                    onChange={(e) => handleRoleChange(role, e.target.checked)}*/}
            {/*                />*/}
            {/*                {role}*/}
            {/*            </label>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</div>*/}

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
                />
            </div>


            <button type="submit">Register</button>
        </form>
    );
};

export default RegisterForm;
