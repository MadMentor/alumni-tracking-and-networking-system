import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Calendar, Award, Home, Settings } from "lucide-react";

export default function DashboardNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        localStorage.removeItem("token");
        navigate("/login");
    };

    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
        { to: "/profile", label: "Profile", icon: <User className="w-4 h-4" /> },
        { to: "/events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
        { to: "/skills", label: "Skills", icon: <Award className="w-4 h-4" /> },
    ];

    const isActiveRoute = (path: string) =>
        location.pathname === path ||
        (path === "/dashboard" && location.pathname.startsWith("/dashboard"));

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
                                className={`nav-link ${isActiveRoute(item.to) ? "active" : ""}`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Settings Dropdown (Desktop) */}
                    <div className="hidden md:flex items-center relative">
                        <button
                            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Settings className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                        </button>

                        {isSettingsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg p-2 animate-fade-in">
                                <Link
                                    to="/settings/password"
                                    className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    Change Password
                                </Link>
                                <Link
                                    to="/settings/email"
                                    className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    Change Email
                                </Link>
                                <Link
                                    to="/settings/security"
                                    className="block px-3 py-2 rounded-lg hover:bg-gray-100"
                                    onClick={() => setIsSettingsOpen(false)}
                                >
                                    Security Settings
                                </Link>
                                <hr className="my-1 border-gray-200" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50"
                                >
                                    <LogOut className="w-4 h-4 inline mr-2" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
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
                                    className={`nav-link ${isActiveRoute(item.to) ? "active" : ""}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.icon}
                                    {item.label}
                                </Link>
                            ))}

                            {/* Mobile Settings Dropdown */}
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                className="flex items-center justify-between w-full px-2 py-2 text-left rounded-lg hover:bg-gray-100"
                            >
                <span className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </span>
                                <span>{isSettingsOpen ? "▲" : "▼"}</span>
                            </button>

                            {isSettingsOpen && (
                                <div className="flex flex-col pl-6 space-y-1">
                                    <Link
                                        to="/settings/password"
                                        className="nav-link"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Change Password
                                    </Link>
                                    <Link
                                        to="/settings/email"
                                        className="nav-link"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Change Email
                                    </Link>
                                    <Link
                                        to="/settings/security"
                                        className="nav-link"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Security Settings
                                    </Link>
                                </div>
                            )}

                            <hr className="border-gray-200 my-2" />

                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50 w-full justify-start"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
