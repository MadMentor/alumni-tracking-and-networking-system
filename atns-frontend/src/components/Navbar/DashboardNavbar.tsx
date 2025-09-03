import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Calendar, Award, Home } from "lucide-react";

export default function DashboardNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
        { to: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
        { to: "/events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
        { to: "/skills", label: "Skills", icon: <Award className="w-4 h-4" /> },
    ];

    const isActiveRoute = (path: string) => {
        return location.pathname === path || 
               (path === "/dashboard" && location.pathname.startsWith("/dashboard"));
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/dashboard" 
                        className="flex items-center space-x-2 text-xl font-bold text-gradient hover:scale-105 transition-transform"
                    >
                        <div className="w-7 h-7 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xs font-bold">A</span>
                        </div>
                        <span>ATNS</span>
                    </Link>
                    
                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link 
                                key={item.to}
                                to={item.to} 
                                className={`nav-link ${isActiveRoute(item.to) ? 'active' : ''}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Actions */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button
                            onClick={handleLogout}
                            className="btn btn-ghost btn-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>

                    {/* Mobile menu button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200/50 animate-fade-in">
                        <div className="flex flex-col space-y-2">
                            {navItems.map((item) => (
                                <Link 
                                    key={item.to}
                                    to={item.to} 
                                    className={`nav-link ${isActiveRoute(item.to) ? 'active' : ''}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
