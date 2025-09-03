import AppRoutes from './routes/AppRoutes';
import PublicNavbar from "./components/Navbar/PublicNavbar.tsx";
import DashboardNavbar from "./components/Navbar/DashboardNavbar.tsx";
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    const token = "dev-mode"; // force login for UI/UX work
    
    // Define which routes should show the dashboard navbar (authenticated routes)
    const authenticatedRoutes = ['/dashboard', '/profile', '/events', '/skills', '/skills/new'];
    const isAuthenticatedRoute = authenticatedRoutes.some(route => 
        location.pathname.startsWith(route)
    );
    
    // Show dashboard navbar if user is authenticated and on authenticated routes
    const shouldShowDashboardNavbar = token && isAuthenticatedRoute;
    
    return (
        <ErrorBoundary>
            <div className="App min-h-screen bg-gray-50">
                {shouldShowDashboardNavbar ? <DashboardNavbar /> : <PublicNavbar />}
                <div className={shouldShowDashboardNavbar ? "pt-16" : "pt-16"}>
                    <AppRoutes />
                </div>
                <ToastContainer />
            </div>
        </ErrorBoundary>
    );
}

export default App;
