import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function PublicNavbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="flex items-center space-x-2 text-2xl font-bold text-gradient hover:scale-105 transition-transform"
                    >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-sm font-bold">A</span>
                        </div>
                        <span>ATNS</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link 
                            to="/" 
                            className="nav-link"
                        >
                            Home
                        </Link>
                        <Link 
                            to="/login" 
                            className="nav-link"
                        >
                            Sign In
                        </Link>
                        <Link 
                            to="/register" 
                            className="btn btn-primary btn-sm"
                        >
                            Get Started
                        </Link>
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
                        <div className="flex flex-col space-y-4">
                            <Link 
                                to="/" 
                                className="nav-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Home
                            </Link>
                            <Link 
                                to="/login" 
                                className="nav-link"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/register" 
                                className="btn btn-primary w-full justify-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
} 