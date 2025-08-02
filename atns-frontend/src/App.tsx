// @ts-ignore
import React from 'react';
import AppRoutes from './routes/AppRoutes';
import PublicNavbar from "./components/Navbar/PublicNavbar.tsx";
import DashboardNavbar from "./components/Navbar/DashboardNavbar.tsx";
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    const token = localStorage.getItem("token");
    
    // Define which routes should show the dashboard navbar (authenticated routes)
    const authenticatedRoutes = ['/dashboard', '/profile', '/events', '/skills', '/skills/new'];
    const isAuthenticatedRoute = authenticatedRoutes.some(route => 
        location.pathname.startsWith(route)
    );
    
    // Show dashboard navbar if user is authenticated and on authenticated routes
    const shouldShowDashboardNavbar = token && isAuthenticatedRoute;
    
    return (
        <div className="App">
            {shouldShowDashboardNavbar ? <DashboardNavbar /> : <PublicNavbar />}
            <AppRoutes />
        </div>
    );
}

export default App;
