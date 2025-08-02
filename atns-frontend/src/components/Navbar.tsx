import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-wide text-white hover:text-white">
                    ATNS
                </Link>
                <div className="flex space-x-6 text-lg">
                    <Link to="/" className="text-white hover:text-indigo-200 transition-colors duration-200">
                        Home
                    </Link>
                    <Link to="/login" className="text-white hover:text-indigo-200 transition-colors duration-200">
                        Login
                    </Link>
                    <Link to="/register" className="text-white hover:text-indigo-200 transition-colors duration-200">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
} 