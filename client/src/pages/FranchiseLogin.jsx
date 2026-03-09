import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from "../api"
import {
    Home,
    ChevronDown,
    User,
    Lock,
    Eye,
    EyeOff,
    CheckCircle,
    Store,
    Shield,
    ArrowRight,
    Sparkles,
    TrendingUp,
    Users,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';

const FranchiseLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        franchiseId: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [franchiseName, setFranchiseName] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsLoading(true);
        setError("");

        try {

            const res = await api.post("/franchises/login", {
                franchiseId: formData.franchiseId,
                password: formData.password
            });

            if (res.data.success) {

                const franchise = res.data.franchise;

                setFranchiseName(franchise.name);
                setShowSuccess(true);

                // LocalStorage save
                localStorage.setItem(
                    "franchiseData",
                    JSON.stringify(franchise)
                );

                // Redirect
                setTimeout(() => {
                    navigate("/franchise/dashboard");
                }, 2000);

            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Invalid Franchise ID or Password"
            );

        } finally {

            setIsLoading(false);

        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-orange-50 p-4 md:p-6 lg:p-8 relative overflow-hidden">

            {/* Animated Background Elements */}
            <div className="absolute inset-0 overflow-hidden">
                <motion.div
                    className="absolute -top-40 -right-40 w-80 h-80 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-40 -left-40 w-80 h-80 bg-orange-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
            </div>

            {/* Floating Elements */}
            <motion.div
                className="absolute top-20 left-20 hidden lg:block"
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="bg-white/30 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/50">
                    <Store className="h-6 w-6 text-green-600" />
                </div>
            </motion.div>

            <motion.div
                className="absolute bottom-20 right-20 hidden lg:block"
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="bg-white/30 backdrop-blur-sm p-3 rounded-2xl shadow-xl border border-white/50">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
            </motion.div>

            {/* Success Modal */}
            <AnimatePresence>
                {showSuccess && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm px-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-green-100"
                        >
                            {/* Top Success Bar */}
                            <div className="h-2 bg-gradient-to-r from-green-500 to-orange-500" />

                            <div className="p-8 text-center">
                                {/* Success Icon with Animation */}
                                <motion.div
                                    className="flex justify-center mb-6"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                                >
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-orange-100 flex items-center justify-center">
                                        <CheckCircle className="h-10 w-10 text-green-600" />
                                    </div>
                                </motion.div>

                                {/* Success Message */}
                                <motion.h3
                                    className="text-2xl font-bold text-gray-900 mb-2"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    Welcome Back!
                                </motion.h3>

                                <motion.p
                                    className="text-gray-500 mb-6"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <span className="font-semibold text-green-600">{franchiseName}</span> - Franchise Partner
                                </motion.p>

                                {/* Franchise Info Card */}
                                <motion.div
                                    className="bg-gradient-to-r from-green-50 to-orange-50 rounded-xl p-4 mb-6 border border-green-100"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="bg-white p-2 rounded-lg">
                                                <Store className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-xs text-gray-500">Franchise ID</p>
                                                <p className="text-sm font-semibold text-gray-800">{formData.franchiseId}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Shield className="h-4 w-4 text-green-500" />
                                            <span className="text-xs text-green-600">Verified</span>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Redirect Message */}
                                <motion.div
                                    className="flex items-center justify-between text-sm text-gray-400 mb-3"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.6 }}
                                >
                                    <span>Redirecting to Franchise Dashboard</span>
                                    <div className="flex items-center gap-1">
                                        <Sparkles className="h-4 w-4 text-orange-400" />
                                        <span className="font-medium text-orange-500">2s</span>
                                    </div>
                                </motion.div>

                                {/* Progress Bar */}
                                <motion.div
                                    className="h-1.5 bg-gray-100 rounded-full overflow-hidden"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.7 }}
                                >
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-green-500 to-orange-500 rounded-full"
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 2, ease: "linear" }}
                                    />
                                </motion.div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto relative z-10">
                {/* Breadcrumb */}
                <motion.div
                    className="flex items-center space-x-2 text-gray-600 mb-8"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Home className="h-4 w-4" />
                    <Link to="/" className="hover:text-green-600 transition-colors">Home</Link>
                    <ChevronDown className="h-4 w-4 rotate-[-90deg]" />
                    <span className="text-green-600 font-semibold">Franchise Login</span>
                </motion.div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-2 gap-8 items-center">
                    {/* Left Side - Hero Section */}
                    <motion.div
                        className="text-center lg:text-left"
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <motion.div
                            className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-orange-100 px-4 py-2 rounded-full mb-6"
                            whileHover={{ scale: 1.05 }}
                        >
                            <Store className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">Franchise Partner Portal</span>
                        </motion.div>

                        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                            <span className="bg-gradient-to-r from-green-600 to-orange-500 bg-clip-text text-transparent">
                                Welcome Back,
                            </span>
                            <br />
                            Franchise Partner!
                        </h1>

                        <p className="text-gray-600 text-lg max-w-md mx-auto lg:mx-0 mb-8">
                            Access your franchise dashboard to manage orders, track performance, and grow your business.
                        </p>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 mb-8">
                            <motion.div
                                className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <Users className="h-6 w-6 text-green-600 mb-2" />
                                <p className="text-2xl font-bold text-gray-800">500+</p>
                                <p className="text-sm text-gray-600">Active Franchises</p>
                            </motion.div>
                            <motion.div
                                className="bg-white/60 backdrop-blur-sm p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                                whileHover={{ scale: 1.05, y: -5 }}
                            >
                                <TrendingUp className="h-6 w-6 text-orange-600 mb-2" />
                                <p className="text-2xl font-bold text-gray-800">₹50K+</p>
                                <p className="text-sm text-gray-600">Avg. Monthly</p>
                            </motion.div>
                        </div>

                        {/* Features */}
                        <div className="space-y-3 max-w-md mx-auto lg:mx-0">
                            {[
                                "Real-time order management",
                                "Inventory tracking system",
                                "Performance analytics",
                                "24/7 support assistance"
                            ].map((feature, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center gap-3"
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + index * 0.1 }}
                                >
                                    <div className="h-5 w-5 rounded-full bg-green-100 flex items-center justify-center">
                                        <CheckCircle className="h-3 w-3 text-green-600" />
                                    </div>
                                    <span className="text-gray-700">{feature}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Side - Login Form */}
                    <motion.div
                        className="w-full max-w-md mx-auto lg:mx-0"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                            {/* Header with Gradient */}
                            <div className="bg-gradient-to-r from-green-600 via-green-500 to-orange-500 px-8 py-6 text-center relative overflow-hidden">
                                <motion.div
                                    className="absolute inset-0 bg-white/20"
                                    animate={{
                                        x: ['-100%', '100%'],
                                    }}
                                    transition={{
                                        duration: 3,
                                        repeat: Infinity,
                                        ease: "easeInOut"
                                    }}
                                />
                                <Store className="h-12 w-12 text-white mx-auto mb-3" />
                                <h2 className="text-2xl font-bold text-white mb-1">Franchise Login</h2>
                                <p className="text-white/90 text-sm">Enter your credentials to continue</p>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="p-8">
                                <div className="space-y-6">
                                    {/* Error Message */}
                                    <AnimatePresence>
                                        {error && (
                                            <motion.div
                                                className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm"
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                            >
                                                {error}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Franchise ID */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Franchise ID <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Store className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                                            </div>
                                            <input
                                                type="text"
                                                name="franchiseId"
                                                value={formData.franchiseId}
                                                onChange={handleChange}
                                                placeholder="Enter your franchise ID (e.g., FRANCHISE123)"
                                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-400"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-gray-700">
                                            Password <span className="text-red-500">*</span>
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                                <Lock className="h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors duration-300" />
                                            </div>
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder="Enter your password"
                                                className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 hover:border-green-400"
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-300"
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Remember Me & Forgot Password */}
                                    <div className="flex items-center justify-between">
                                        <label className="flex items-center space-x-2 cursor-pointer group">
                                            <input
                                                type="checkbox"
                                                checked={rememberMe}
                                                onChange={(e) => setRememberMe(e.target.checked)}
                                                className="w-4 h-4 text-green-600 rounded focus:ring-green-500 transition-transform duration-200 group-hover:scale-110"
                                            />
                                            <span className="text-sm text-gray-600 group-hover:text-green-600 transition-colors duration-300">
                                                Remember me
                                            </span>
                                        </label>

                                    </div>

                                    {/* Login Button */}
                                    <motion.button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full group relative px-8 py-4 bg-gradient-to-r from-green-600 to-orange-500 text-white font-bold rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <span className="relative z-10 flex items-center justify-center space-x-2">
                                            {isLoading ? (
                                                <>
                                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    <span>VERIFYING...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <span>LOGIN TO DASHBOARD</span>
                                                    <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                                                </>
                                            )}
                                        </span>
                                    </motion.button>

                                    {/* Register Link */}
                                    <div className="text-center pt-2">
                                        <p className="text-gray-600 text-sm">
                                            New franchise partner?{' '}
                                            <Link
                                                to="/franchise/list"
                                                className="text-green-600 hover:text-green-800 font-semibold hover:underline transition-all duration-300"
                                            >
                                                Apply for Franchise
                                            </Link>
                                        </p>
                                    </div>

                                    {/* Demo Credentials */}
                                    <motion.div
                                        className="mt-4 p-4 bg-gradient-to-r from-green-50 to-orange-50 rounded-lg border border-green-100"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <div className="flex items-center gap-2 mb-2">
                                            <Star className="h-4 w-4 text-orange-500" />
                                            <p className="text-xs font-semibold text-gray-700">Demo Credentials</p>
                                        </div>
                                        <div className="space-y-1 text-xs text-gray-600">
                                            <p><span className="font-medium text-green-700">Franchise ID:</span> FRANCHISE123</p>
                                            <p><span className="font-medium text-green-700">Password:</span> franchise123</p>
                                        </div>
                                    </motion.div>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Animation Styles */}
            <style>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

// AnimatePresence import ke liye
import { AnimatePresence } from 'framer-motion';

export default FranchiseLogin;
