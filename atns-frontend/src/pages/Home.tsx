import { Link } from 'react-router-dom';
import { Users, Calendar, Award, ArrowRight } from 'lucide-react';

export default function Home() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
                            <Users className="w-4 h-4" />
                            Alumni Network Platform
                        </div>
                        
                        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
                            Welcome to{' '}
                            <span className="text-gradient">ATNS</span>
                        </h1>
                        
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8 leading-relaxed animate-fade-in">
                            Connect, collaborate, and grow with your alumni community. Track networking events, 
                            showcase skills, and build meaningful professional relationships.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                            <Link
                                to="/login"
                                className="btn btn-primary btn-lg group"
                            >
                                Get Started
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                to="/register"
                                className="btn btn-secondary btn-lg"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                            Everything you need to stay connected
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Powerful tools designed to help you maintain and grow your professional network
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-blue-200 transition-colors">
                                <Users className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Network Management</h3>
                            <p className="text-gray-600">
                                Connect with fellow alumni, manage connections, and build your professional network.
                            </p>
                        </div>
                        
                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-purple-200 transition-colors">
                                <Calendar className="w-8 h-8 text-purple-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Event Tracking</h3>
                            <p className="text-gray-600">
                                Discover and participate in networking events, workshops, and alumni meetups.
                            </p>
                        </div>
                        
                        <div className="card p-8 text-center group">
                            <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-green-200 transition-colors">
                                <Award className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-3">Skill Showcase</h3>
                            <p className="text-gray-600">
                                Highlight your expertise and discover opportunities that match your skills.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
                <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Ready to join your alumni network?
                    </h2>
                    <p className="text-xl text-blue-100 mb-8">
                        Start building meaningful connections today and unlock new opportunities.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="btn bg-white text-blue-600 hover:bg-gray-50 btn-lg"
                        >
                            Join Now
                        </Link>
                        <Link
                            to="/login"
                            className="btn border-2 border-white text-white hover:bg-white hover:text-blue-600 btn-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
