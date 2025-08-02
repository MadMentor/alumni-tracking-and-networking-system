import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav className="bg-blue-600 text-white px-6 py-4 shadow-md sticky top-0 z-50 w-full">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-extrabold tracking-wide">
                    ATNS
                </Link>
                <div className="flex space-x-6 text-lg">
                    <Link to="/" className="hover:underline hover:text-indigo-200 transition">
                        Home
                    </Link>
                    <Link to="/dashboard" className="hover:underline hover:text-indigo-200 transition">
                        Dashboard
                    </Link>
                    <Link to="/login" className="hover:underline hover:text-indigo-200 transition">
                        Login
                    </Link>
                    <Link to="/register" className="hover:underline hover:text-indigo-200 transition">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}
