import { Navigate } from 'react-router-dom';
import React from "react";
import { useAuthStore } from "../store/authStore.ts";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const token = useAuthStore();
    if (!token) {
        return <Navigate to="/login" />;
    }
    return <>{children}</>;
}