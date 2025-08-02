import { Link, useNavigate } from "react-router-dom";

export default function DashboardNavbar() {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <nav className="bg-blue-600 text-white px-6 py-3 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-center h-12">
                <Link to="/dashboard" className="text-2xl font-extrabold tracking-wide text-white hover:text-white">
                    ATNS
                </Link>
                
                <div className="flex space-x-6 text-base items-center">
                    <Link 
                        to="/dashboard" 
                        className="text-white hover:text-indigo-200 transition-colors duration-200"
                    >
                        Dashboard
                    </Link>
                    <Link 
                        to="/profile" 
                        className="text-white hover:text-indigo-200 transition-colors duration-200"
                    >
                        Profile
                    </Link>
                    <Link 
                        to="/events" 
                        className="text-white hover:text-indigo-200 transition-colors duration-200"
                    >
                        Events
                    </Link>
                    <Link 
                        to="/skills" 
                        className="text-white hover:text-indigo-200 transition-colors duration-200"
                    >
                        Skills
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-red-200 transition-colors duration-200"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
}
