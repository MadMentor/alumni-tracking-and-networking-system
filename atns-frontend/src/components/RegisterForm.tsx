// src/components/RegisterForm.tsx
import React, { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle } from "lucide-react";
import { UserRole } from "../types/user.ts";

interface RegisterFormProps {
    onRegister: (username: string, email: string, password: string, role: UserRole[]) => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([UserRole.STUDENT]);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);

        // Check for empty fields
        if (!username.trim() || !email.trim() || !password.trim()) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        // Validate username
        const usernameError = validateUsername(username.trim());
        if (usernameError) {
            setError(usernameError);
            setIsLoading(false);
            return;
        }

        // Validate email
        const emailError = validateEmail(email.trim());
        if (emailError) {
            setError(emailError);
            setIsLoading(false);
            return;
        }

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        if (selectedRoles.length === 0) {
            setError("Please select at least one role.");
            setIsLoading(false);
            return;
        }

        try {
            await onRegister(username.trim(), email.trim(), password, selectedRoles);
            // Clear form on success
            setUsername("");
            setEmail("");
            setPassword("");
            setSelectedRoles([UserRole.STUDENT]);
        } catch (error: any) {
            setError(error.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter", met: /[a-z]/.test(password) },
        { label: "One number", met: /\d/.test(password) },
        { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                        <UserPlus className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h2>
                    <p className="text-gray-600">
                        Join the ATNS alumni network
                    </p>
                </div>

                {/* Form */}
                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                <p className="text-sm text-red-600 font-medium">{error}</p>
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="username" className="form-label">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    placeholder="Enter username (3-20 characters)"
                                    className="form-input pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="roles" className="form-label">
                                Role
                            </label>
                            <select
                                id="roles"
                                value={selectedRoles}
                                onChange={(e) => {
                                    const selected = Array.from(e.target.selectedOptions, option => option.value as UserRole);
                                    setSelectedRoles(selected);
                                }}
                                className="form-input"
                                disabled={isLoading}
                            >
                                {Object.values(UserRole).map((role) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="email" className="form-label">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="Enter your email address"
                                    className="form-input pl-10"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="password" className="form-label">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter password"
                                    className="form-input pl-10 pr-10"
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                    ) : (
                                        <Eye className="h-5 w-5" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Password Requirements */}
                            <div className="mt-3 space-y-2">
                                <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                                {passwordRequirements.map((req, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <CheckCircle 
                                            className={`w-4 h-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} 
                                        />
                                        <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="btn btn-primary w-full btn-lg"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    Creating account...
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <UserPlus className="w-5 h-5" />
                                    Create Account
                                </div>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{" "}
                            <a href="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                                Sign in here
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
