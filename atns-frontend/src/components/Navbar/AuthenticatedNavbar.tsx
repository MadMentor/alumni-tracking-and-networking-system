import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Calendar, Award, Home, Settings, Sparkles } from "lucide-react";
import { useAuthStore } from "../../store/authStore.ts";

export default function AuthenticatedNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleLogout = () => {
        const confirmed = window.confirm("Are you sure you want to logout?");
        if (!confirmed) return;
        useAuthStore.getState().logout();
        navigate("");
    };

    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: <Home className="w-4 h-4" /> },
        { to: "/explore", label: "Explore", icon: <User className="w-4 h-4" /> },
        { to: "/events", label: "Events", icon: <Calendar className="w-4 h-4" /> },
        { to: "/recommendations", label: "Recommendations", icon: <Sparkles className="w-4 h-4" /> },
    ];

    const isActiveRoute = (path: string) =>
        location.pathname === path || (path === "/dashboard" && location.pathname.startsWith("/dashboard"));

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                    <div className="hidden md:flex items-center space-x-4">
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

                        {/* Desktop Settings Dropdown */}
                        <div className="relative flex items-center">
                            <button
                                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                onBlur={() => setTimeout(() => setIsSettingsOpen(false), 100)}
                                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors ${
                                    isSettingsOpen ? 'bg-gray-100' : ''
                                }`}
                            >
                                <Settings className="w-5 h-5 text-gray-600 hover:text-gray-900" />
                            </button>

                            {isSettingsOpen && (
                                <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg py-2 animate-fade-in z-50">
                                    <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                        Account Settings
                                    </div>
                                    <Link
                                        to="/settings/password"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsSettingsOpen(false)}
                                    >
                                        Change Password
                                    </Link>
                                    <Link
                                        to="/settings/email"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsSettingsOpen(false)}
                                    >
                                        Change Email
                                    </Link>
                                    <Link
                                        to="/settings/security"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                        onClick={() => setIsSettingsOpen(false)}
                                    >
                                        Security Settings
                                    </Link>
                                    <div className="border-t border-gray-200 my-1"></div>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
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
                            <div className="flex flex-col">
                                <button
                                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                                    className={`flex items-center justify-between w-full px-2 py-2 text-left rounded-lg hover:bg-gray-100 transition-colors ${
                                        isSettingsOpen ? 'bg-gray-100' : ''
                                    }`}
                                >
                                    <span className="flex items-center space-x-2">
                                        <Settings className="w-4 h-4" />
                                        <span>Settings</span>
                                    </span>
                                    <span className="text-gray-500">
                                        {isSettingsOpen ? "▲" : "▼"}
                                    </span>
                                </button>

                                {isSettingsOpen && (
                                    <div className="flex flex-col pl-6 space-y-1 mt-1 animate-fade-in">
                                        <div className="px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                            Account Settings
                                        </div>
                                        <Link
                                            to="/settings/password"
                                            className="flex items-center px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsSettingsOpen(false);
                                            }}
                                        >
                                            Change Password
                                        </Link>
                                        <Link
                                            to="/settings/email"
                                            className="flex items-center px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsSettingsOpen(false);
                                            }}
                                        >
                                            Change Email
                                        </Link>
                                        <Link
                                            to="/settings/security"
                                            className="flex items-center px-2 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                                            onClick={() => {
                                                setIsMenuOpen(false);
                                                setIsSettingsOpen(false);
                                            }}
                                        >
                                            Security Settings
                                        </Link>
                                        <div className="border-t border-gray-200 my-1 mx-2"></div>
                                        <button
                                            onClick={() => {
                                                handleLogout();
                                                setIsMenuOpen(false);
                                                setIsSettingsOpen(false);
                                            }}
                                            className="flex items-center w-full text-left px-2 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/*/!* Close dropdown when clicking outside *!/*/}
            {/*{isSettingsOpen && (*/}
            {/*    <div*/}
            {/*        className="fixed inset-0 z-40"*/}
            {/*        onClick={() => setIsSettingsOpen(false)}*/}
            {/*    ></div>*/}
            {/*)}*/}
        </nav>
    );
}