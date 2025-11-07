import AppRoutes from './routes/AppRoutes';
import PublicNavbar from "./components/Navbar/PublicNavbar.tsx";
import AuthenticatedNavbar from "./components/Navbar/AuthenticatedNavbar.tsx";
import ErrorBoundary from './components/ErrorBoundary';
import { ToastContainer } from './components/ui/Toast';
import { useLocation } from 'react-router-dom';

function App() {
    const location = useLocation();
    const token = localStorage.getItem("token"); // force login for UI/UX work

    // Define public routes (where AuthenticatedNavbar should NOT be shown)
    const publicRoutes = ['/login', '/signup'];
    const isPublicRoute = publicRoutes.some(route => location.pathname.startsWith(route));

    // Show AuthenticatedNavbar only if user is logged in AND not on public route
    const shouldShowAuthenticatedNavbar = token && !isPublicRoute;
    
    return (
        <ErrorBoundary>
            <div className="App min-h-screen bg-gray-50">
                {shouldShowAuthenticatedNavbar ? <AuthenticatedNavbar /> : <PublicNavbar />}
                <div className={shouldShowAuthenticatedNavbar ? "pt-16" : "pt-16"}>
                    <AppRoutes />
                </div>
                <ToastContainer />
            </div>
        </ErrorBoundary>
    );
}

export default App;
