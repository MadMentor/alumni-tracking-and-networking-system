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
    const [confirmPassword, setConfirmPassword] = useState("");
    const [selectedRoles, setSelectedRoles] = useState<UserRole[]>([UserRole.STUDENT]);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const showMatchHint = confirmPassword.length > 0;

    const validatePassword = (password: string): string | null => {
        if (password.length < 8) return "Password must be at least 8 characters long.";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
        if (!/[a-z]/.test(password)) return "Password must contain at least one lowercase letter.";
        if (!/\d/.test(password)) return "Password must contain at least one number.";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return "Password must contain at least one special character (!@#$%^&*).";
        return null;
    };

    const validateUsername = (username: string): string | null => {
        if (username.length < 3) return "Username must be at least 3 characters long.";
        if (username.length > 20) return "Username must be less than 20 characters.";
        if (!/^[a-zA-Z0-9_]+$/.test(username)) return "Username can only contain letters, numbers, and underscores.";
        return null;
    };

    const validateEmail = (email: string): string | null => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email) ? null : "Please enter a valid email address.";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("All fields are required.");
            setIsLoading(false);
            return;
        }

        const usernameError = validateUsername(username.trim());
        if (usernameError) { setError(usernameError); setIsLoading(false); return; }

        const emailError = validateEmail(email.trim());
        if (emailError) { setError(emailError); setIsLoading(false); return; }

        const passwordError = validatePassword(password);
        if (passwordError) { setError(passwordError); setIsLoading(false); return; }

        if (!passwordsMatch) { setError("Passwords do not match."); setIsLoading(false); return; }

        if (selectedRoles.length === 0) { setError("Please select at least one role."); setIsLoading(false); return; }

        try {
            await onRegister(username.trim(), email.trim(), password, selectedRoles);
            setUsername(""); setEmail(""); setPassword(""); setConfirmPassword(""); setSelectedRoles([UserRole.STUDENT]);
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
        <div className="h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left visual panel */}
            <div className="hidden lg:flex h-full w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white items-center justify-center">
                <div className="max-w-lg px-12">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <UserPlus className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">Create your ATNS account</h2>
                    <p className="text-blue-100 text-lg">Join your alumni network and get connected.</p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="w-full max-w-lg px-6">
                    <div className="card">
                        <div className="card-body">
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-red-600 font-medium">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">Username</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-100 text-gray-500">
                                            <User className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="username"
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            placeholder="Enter username (3-20 characters)"
                                            className="form-input rounded-l-none"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="roles" className="form-label">Role</label>
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
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email Address</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-100 text-gray-500">
                                            <Mail className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="email"
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            placeholder="Enter your email address"
                                            className="form-input rounded-l-none"
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="password" className="form-label">Password</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-100 text-gray-500">
                                            <Lock className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            placeholder="Enter password"
                                            className="form-input rounded-l-none rounded-r-none"
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 hover:text-gray-700"
                                            disabled={isLoading}
                                            aria-label={showPassword ? "Hide password" : "Show password"}
                                        >
                                            {showPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                                        </button>
                                    </div>
                                    <div className="mt-3 space-y-2">
                                        <p className="text-xs font-medium text-gray-700">Password requirements:</p>
                                        {passwordRequirements.map((req, index) => (
                                            <div key={index} className="flex items-center gap-2">
                                                <CheckCircle className={`w-4 h-4 ${req.met ? 'text-green-500' : 'text-gray-300'}`} />
                                                <span className={`text-xs ${req.met ? 'text-green-600' : 'text-gray-500'}`}>{req.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                                    <div className="flex">
                                        <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-100 text-gray-500">
                                            <Lock className="h-5 w-5" />
                                        </span>
                                        <input
                                            id="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                            placeholder="Re-enter password"
                                            className="form-input rounded-l-none rounded-r-none"
                                            disabled={isLoading}
                                            aria-describedby="password-match-hint"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 hover:text-gray-700"
                                            disabled={isLoading}
                                            aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                                        >
                                            {showConfirmPassword ? (<EyeOff className="h-5 w-5" />) : (<Eye className="h-5 w-5" />)}
                                        </button>
                                    </div>
                                    {showMatchHint && (
                                        <p id="password-match-hint" aria-live="polite" className={`text-xs mt-2 font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                                            {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                                        </p>
                                    )}
                                </div>

                                <button type="submit" disabled={isLoading || (showMatchHint && !passwordsMatch)} className="btn btn-primary w-full">
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
