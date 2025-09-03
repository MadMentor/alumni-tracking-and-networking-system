// src/components/LoginForm.tsx
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";

interface LoginFormProps {
    onLogin: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const validateInputs = (email: string, password: string): string | null => {
        if (!email.trim()) return "Email is required.";
        if (!password.trim()) return "Password is required.";
        if (email.trim().length < 3) return "Email must be at least 3 characters long.";
        return null;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        const validationError = validateInputs(email, password);
        if (validationError) {
            setError(validationError);
            setIsLoading(false);
            return;
        }

        try {
            await onLogin(email.trim(), password);
        } catch (error: any) {
            setError(error.message || "Login failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left visual panel */}
            <div className="hidden lg:flex h-full w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white items-center justify-center">
                <div className="max-w-lg px-12">
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                        <LogIn className="w-8 h-8" />
                    </div>
                    <h2 className="text-4xl font-extrabold mb-4 leading-tight">Welcome back to ATNS</h2>
                    <p className="text-blue-100 text-lg">Connect, collaborate, and grow with your alumni network.</p>
                </div>
            </div>

            {/* Right form panel */}
            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
                <div className="w-full max-w-lg px-6">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <p className="text-sm text-red-600 font-medium">{error}</p>
                                    </div>
                                )}

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
                                            placeholder="Enter your password"
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
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5" />
                                            ) : (
                                                <Eye className="h-5 w-5" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" disabled={isLoading} className="btn btn-primary w-full">
                                    {isLoading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                            Signing in...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <LogIn className="w-5 h-5" />
                                            Sign In
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

export default LoginForm;
