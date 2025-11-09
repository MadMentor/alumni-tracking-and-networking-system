// src/components/RegistrationWizard.tsx
import React, { useState, useEffect } from "react";
import { User, Mail, Lock, Eye, EyeOff, UserPlus, CheckCircle, ArrowLeft, Shield } from "lucide-react";
import { useRegister } from "../hooks/useRegister";

interface RegistrationWizardProps {
    onSuccess: () => void;
    onError: (error: string) => void;
}

const RegistrationWizard: React.FC<RegistrationWizardProps> = ({ onSuccess, onError }) => {
    const {
        loading,
        step,
        email,
        // assignedRole,
        initiateRegistration,
        verifyEmail,
        completeRegistration,
        resendOtp,
        goBackToEmail,
        goBackToOtp
    } = useRegister();

    const [otp, setOtp] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);

    // REMOVE THIS PROBLEMATIC USEEFFECT - it's calling onSuccess too early
    // useEffect(() => {
    //     if (step === 'profile' && !loading) {
    //         // Registration is complete, trigger success
    //         onSuccess();
    //     }
    // }, [step, loading, onSuccess]);

    // Resend OTP timer
    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [resendTimer]);

    const startResendTimer = () => {
        setResendTimer(60); // 60 seconds
    };

    const handleResendOtp = async () => {
        if (resendTimer > 0) return;

        const result = await resendOtp();
        if (result.success) {
            startResendTimer();
        } else if (result.error) {
            onError(result.error);
        }
    };

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

    const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
    const showMatchHint = confirmPassword.length > 0;

    const passwordRequirements = [
        { label: "At least 8 characters", met: password.length >= 8 },
        { label: "One uppercase letter", met: /[A-Z]/.test(password) },
        { label: "One lowercase letter", met: /[a-z]/.test(password) },
        { label: "One number", met: /\d/.test(password) },
        { label: "One special character", met: /[!@#$%^&*(),.?":{}|<>]/.test(password) },
    ];

    // Step 1: Email Input
    const renderEmailStep = () => (
        <div className="step-container">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Mail className="w-8 h-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Join Alumni Network</h2>
                <p className="text-gray-600">Enter your email to start registration</p>
            </div>

            <form onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const email = formData.get('email') as string;

                const emailError = !email ? "Email is required" :
                    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "Please enter a valid email address" : null;

                if (emailError) {
                    onError(emailError);
                    return;
                }

                const result = await initiateRegistration(email);
                if (!result.success && result.error) {
                    onError(result.error);
                }
            }}>
                <div className="form-group">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-md border border-gray-300 bg-gray-100 text-gray-500">
                            <Mail className="h-5 w-5" />
                        </span>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            required
                            placeholder="Enter your university email"
                            className="form-input rounded-l-none"
                            disabled={loading}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary w-full"
                >
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Sending Code...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 justify-center">
                            <Shield className="w-5 h-5" />
                            Send Verification Code
                        </div>
                    )}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
                        Sign in
                    </a>
                </p>
            </div>
        </div>
    );

    // Step 2: OTP Verification
    const renderOtpStep = () => (
        <div className="step-container">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <Shield className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Verify Your Email</h2>
                <p className="text-gray-600">
                    We sent a 6-digit code to <strong className="text-blue-600">{email}</strong>
                </p>
            </div>

            <button
                onClick={goBackToEmail}
                className="btn btn-ghost mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Change email
            </button>

            <form onSubmit={async (e) => {
                e.preventDefault();
                if (otp.length !== 6) {
                    onError("Please enter a 6-digit code");
                    return;
                }

                const result = await verifyEmail(otp);
                if (!result.success && result.error) {
                    onError(result.error);
                }
            }}>
                <div className="form-group">
                    <label htmlFor="otp" className="form-label">Verification Code</label>
                    <input
                        id="otp"
                        type="text"
                        placeholder="Enter 6-digit code"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        maxLength={6}
                        required
                        className="form-input text-center text-2xl font-mono tracking-widest"
                        disabled={loading}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn btn-primary w-full mb-4"
                >
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Verifying...
                        </div>
                    ) : (
                        "Verify Code"
                    )}
                </button>
            </form>

            <div className="text-center">
                <button
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="btn btn-link text-sm"
                >
                    {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend verification code'}
                </button>
            </div>
        </div>
    );

    // Step 3: Profile Completion
    const renderProfileStep = () => (
        <div className="step-container">
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mb-4 mx-auto">
                    <UserPlus className="w-8 h-8 text-purple-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
                {/*<div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">*/}
                {/*    Assigned Role: {assignedRole?.replace('ROLE_', '') || 'Student'}*/}
                {/*</div>*/}
            </div>

            <button
                onClick={goBackToOtp}
                className="btn btn-ghost mb-4"
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to verification
            </button>

            <form onSubmit={async (e) => {
                e.preventDefault();

                const usernameError = validateUsername(username);
                if (usernameError) {
                    onError(usernameError);
                    return;
                }

                const passwordError = validatePassword(password);
                if (passwordError) {
                    onError(passwordError);
                    return;
                }

                if (!passwordsMatch) {
                    onError("Passwords do not match");
                    return;
                }

                const result = await completeRegistration(username, password);
                if (result.success) {
                    // ONLY CALL onSuccess AFTER completeRegistration SUCCEEDS
                    onSuccess();
                } else if (result.error) {
                    onError(result.error);
                }
            }}>
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
                            disabled={loading}
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
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
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
                            disabled={loading}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="inline-flex items-center px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-100 text-gray-500 hover:text-gray-700"
                            disabled={loading}
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                    {showMatchHint && (
                        <p className={`text-xs mt-2 font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                            {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading || !username || !password || !passwordsMatch}
                    className="btn btn-primary w-full"
                >
                    {loading ? (
                        <div className="flex items-center gap-2 justify-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Creating Account...
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 justify-center">
                            <UserPlus className="w-5 h-5" />
                            Complete Registration
                        </div>
                    )}
                </button>
            </form>
        </div>
    );

    return (
        <div className="h-screen w-screen overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            {/* Left visual panel */}
            <div className="hidden lg:flex h-full w-full bg-gradient-to-br from-blue-600 to-purple-600 text-white items-center justify-center">
                <div className="max-w-lg px-12">
                    {/* Progress indicator */}
                    <div className="flex items-center justify-center gap-4 mb-8">
                        {['Email', 'Verify', 'Profile'].map((stepName, index) => {
                            const stepIndex = ['email', 'otp', 'profile'].indexOf(step);
                            const isCompleted = index < stepIndex;
                            const isCurrent = index === stepIndex;

                            return (
                                <div key={stepName} className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                                        isCompleted ? 'bg-green-500' :
                                            isCurrent ? 'bg-white text-blue-600' :
                                                'bg-white/20'
                                    }`}>
                                        {isCompleted ? '✓' : index + 1}
                                    </div>
                                    <span className={`text-sm ${isCurrent ? 'text-white font-medium' : 'text-blue-100'}`}>
                                        {stepName}
                                    </span>
                                    {index < 2 && <div className="w-8 h-0.5 bg-white/20"></div>}
                                </div>
                            );
                        })}
                    </div>

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
                            {step === 'email' && renderEmailStep()}
                            {step === 'otp' && renderOtpStep()}
                            {step === 'profile' && renderProfileStep()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationWizard;