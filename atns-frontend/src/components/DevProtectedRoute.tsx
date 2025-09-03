// DevProtectedRoute.tsx
import React from "react";

export default function DevProtectedRoute({ children }: { children: React.ReactNode }) {
    return <>{children}</>; // no checks at all
}
