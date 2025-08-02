import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
            <div className="bg-white shadow-xl rounded-2xl p-8 max-w-xl w-full text-center">
                <h1 className="text-4xl font-bold text-indigo-700 mb-4">Welcome to ATNS</h1>
                <p className="text-gray-600 mb-6">
                    Track and connect with alumni, manage networking events, and keep your academic community alive!
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        to="/login"
                        className="w-fit mx-auto sm:mx-0 border border-indigo-600 text-indigo-700 font-medium px-6 py-2 rounded-xl hover:bg-indigo-50 transition duration-200"
                    >
                        Login
                    </Link>
                    <br></br>
                    <Link
                        to="/register"
                        className="w-fit mx-auto sm:mx-0 border border-indigo-600 text-indigo-700 font-medium px-6 py-2 rounded-xl hover:bg-indigo-50 transition duration-200"
                    >
                        Register
                    </Link>
                </div>
            </div>
        </main>
    );
}
