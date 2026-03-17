import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from "../api"; // path check kar lena
import { Snackbar, Alert, Fade } from '@mui/material';

import { ChevronRight, Phone, Mail, User, MessageSquare, Send, AlertCircle, CheckCircle, ExternalLink, UserCircle, FileText, X, Ticket } from 'lucide-react';

const GrievancePage = () => {
    const [formData, setFormData] = useState({
        directSellerId: '',
        name: '',
        mobileNo: '',
        emailId: '',
        category: '',
        subject: '',
        message: ''
    });

    const [statusFormData, setStatusFormData] = useState({
        directSellerId: '',
        name: '',
        ticketNumber: ''
    });

    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusResult, setStatusResult] = useState(null);
    const [statusError, setStatusError] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const location = useLocation();

    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsedUser = JSON.parse(user);
                setFormData(prev => ({
                    ...prev,
                    name: parsedUser.userName || '',
                    emailId: parsedUser.email || '',
                    mobileNo: parsedUser.mobile || ''
                }));
            } catch (error) {
                console.error("Error parsing user for grievance form:", error);
            }
        }
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const ticket = queryParams.get('ticket');
        if (ticket) {
            setStatusFormData(prev => ({ ...prev, ticketNumber: ticket }));
            setShowStatusModal(true);

            // Auto-trigger check if ticket is provided
            const fetchStatus = async () => {
                try {
                    const res = await api.post("/grievance/track", { ticket });
                    setStatusResult({
                        ticketNumber: res.data.ticketNumber,
                        status: res.data.status,
                        submittedDate: new Date(res.data.submittedDate).toLocaleDateString(),
                        lastUpdated: new Date(res.data.submittedDate).toLocaleDateString(),
                        department: "Support Team",
                        description: "Your grievance is being processed"
                    });
                } catch (err) {
                    setStatusError("❌ Ticket not found");
                }
            };
            fetchStatus();
        }
    }, [location.search]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleStatusChange = (e) => {
        const { name, value } = e.target;
        setStatusFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.mobileNo || !formData.emailId || !formData.category || !formData.subject || !formData.message) {
            setError('Please fill in all required fields');
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.emailId)) {
            setError('Please enter a valid email address');
            return;
        }

        const mobileRegex = /^\d{10}$/;
        if (!mobileRegex.test(formData.mobileNo)) {
            setError('Please enter a valid 10-digit mobile number');
            return;
        }

        try {
            setError("");

            const res = await api.post("/grievance/create", {
                sellerId: formData.directSellerId,
                name: formData.name,
                mobile: formData.mobileNo,
                email: formData.emailId,
                category: formData.category,
                subject: formData.subject,
                message: formData.message
            });

            // 🎫 Ticket show
            setSnackbar({
                open: true,
                message: "🎫 Your grievance has been submitted! Ticket Number: " + res.data.ticket,
                severity: 'success'
            });

            setIsSubmitted(true);

            // reset form
            setFormData({
                directSellerId: '',
                name: '',
                mobileNo: '',
                emailId: '',
                category: '',
                subject: '',
                message: ''
            });

        } catch (err) {
            setError("❌ Server error, try again");
        }
    };
    const handleStatusCheck = async (e) => {
        e.preventDefault();

        if (!statusFormData.ticketNumber) {
            setStatusError('Please enter your ticket number');
            return;
        }

        try {
            setStatusError("");

            const res = await api.post("/grievance/track", {
                ticket: statusFormData.ticketNumber
            });

            setStatusResult({
                ticketNumber: res.data.ticketNumber,
                status: res.data.status,
                submittedDate: new Date(res.data.submittedDate).toLocaleDateString(),
                lastUpdated: new Date(res.data.submittedDate).toLocaleDateString(),
                department: "Support Team",
                description: "Your grievance is being processed"
            });

        } catch (err) {
            setStatusError("❌ Ticket not found");
            setStatusResult(null);
        }
    };
    const closeModal = () => {
        setShowStatusModal(false);
        setStatusResult(null);
        setStatusError('');
        setStatusFormData({
            directSellerId: '',
            name: '',
            ticketNumber: ''
        });
    };

    return (
        <div className="bg-[#F8FAF5] font-sans min-h-screen">
            {/* Hero Banner */}
            <header className="relative h-[200px] bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')" }}>
                <div className="absolute inset-0 bg-black/65"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 animate-fade-in">
                        Grievance
                    </h1>
                    <div className="flex items-center text-white/90 text-sm md:text-base flex-wrap justify-center">
                        <Link to="/" className="hover:text-white transition-colors">Home</Link>
                        <ChevronRight className="w-4 h-4 mx-2" />
                        <span className="text-white">Grievance</span>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <section className="py-12 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Guidelines and Nodal Office */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Guidelines Card */}
                        <div className="bg-white rounded-[14px] shadow-lg overflow-hidden animate-slide-right">
                            <div className="bg-[#B8FFB8] p-4 text-[#0A7A2F]">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <FileText className="w-5 h-5" />
                                    Guidelines
                                </h2>
                            </div>
                            <div className="p-6">
                                <ol className="space-y-4 list-decimal list-inside text-[#222222] text-sm">
                                    <li className="leading-relaxed animate-fade-in">
                                        Customer / Distributor can make Grievances in either of the mentioned modes - Calls / Written Application / Email / Walk-in / Online Grievance Cell, etc.
                                    </li>
                                    <li className="leading-relaxed animate-fade-in animation-delay-200">
                                        Grievances received will be feded into the internal Grievance software. A unique track ID will be generated against all the Grievances and is intimated to the customer / distributor on his / her registered Email id and Mobile Number.
                                    </li>
                                    <li className="leading-relaxed animate-fade-in animation-delay-400">
                                        Customers / distributors need to keep the unique track Id secure with them in order to take follow-up against the Grievance.
                                    </li>
                                </ol>
                            </div>
                        </div>

                        {/* Nodal Office Contact Details */}
                        <div className="bg-white rounded-[14px] shadow-lg overflow-hidden animate-slide-right animation-delay-200">
                            <div className="bg-[#F8D7A8] p-4 text-[#F7931E]">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <UserCircle className="w-5 h-5" />
                                    Our Nodal Office Contact Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex items-start gap-3 p-3 bg-[#F8FAF5] rounded-lg">
                                    <User className="w-5 h-5 text-[#B8FFB8] mt-0.5" />
                                    <div>
                                        <span className="font-bold text-[#222222]">Name:</span>
                                        <span className="text-[#222222] ml-2">Mr. Prabhat Kumar Verma</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-[#F8FAF5] rounded-lg">
                                    <Phone className="w-5 h-5 text-[#B8FFB8] mt-0.5" />
                                    <div>
                                        <span className="font-bold text-[#222222]">Mobile Number:</span>
                                        <span className="text-[#222222] ml-2">+91 78803 70057</span>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 p-3 bg-[#F8FAF5] rounded-lg">
                                    <Mail className="w-5 h-5 text-[#B8FFB8] mt-0.5" />
                                    <div>
                                        <span className="font-bold text-[#222222]">Email ID:</span>
                                        <span className="text-[#222222] ml-2">support@sanyuktparivaar.com</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Grievance Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-[14px] shadow-lg overflow-hidden animate-slide-left">
                            <div className="bg-[#B8FFB8] p-4 text-[#0A7A2F]">
                                <h2 className="text-xl font-bold flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    Submit Grievance
                                </h2>
                            </div>

                            <div className="p-6 md:p-8">
                                {isSubmitted && (
                                    <div className="mb-6 bg-green-50 border-l-4 border-[#B8FFB8] p-4 rounded-r-lg animate-slide-up">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="w-5 h-5 text-[#B8FFB8]" />
                                            <p className="text-[#0A7A2F] text-sm">
                                                Your grievance has been submitted successfully! A unique track ID will be sent to your email and mobile.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {error && (
                                    <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg animate-slide-up">
                                        <div className="flex items-center gap-3">
                                            <AlertCircle className="w-5 h-5 text-red-500" />
                                            <p className="text-red-700 text-sm">{error}</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Direct Seller ID */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Direct Seller ID
                                        </label>
                                        <input
                                            type="text"
                                            name="directSellerId"
                                            value={formData.directSellerId}
                                            onChange={handleChange}
                                            placeholder="Enter Direct Seller ID"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Your Name"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Mobile No. * */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Mobile No. <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleChange}
                                            placeholder="Enter 10-digit mobile number"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Email Id * */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Email Id <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="emailId"
                                            value={formData.emailId}
                                            onChange={handleChange}
                                            placeholder="your.email@example.com"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Category * */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Category <span className="text-red-500">*</span>
                                        </label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all bg-white"
                                        >
                                            <option value="">Select Category</option>
                                            <option value="Billing">Billing</option>
                                            <option value="Product">Product</option>
                                            <option value="Delivery">Delivery</option>
                                            <option value="Payment">Payment</option>
                                            <option value="Technical">Technical</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    {/* Subject * */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Subject <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            placeholder="Enter subject"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Message * */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Type your message here..."
                                            required
                                            rows="4"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all resize-none"
                                        ></textarea>
                                    </div>

                                    {/* Submit Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#B8FFB8] hover:bg-[#B8FFB8]/90 text-[#0A7A2F] font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg flex items-center justify-center gap-2 group"
                                    >
                                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Check Grievance Status Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-[14px] shadow-lg overflow-hidden animate-slide-up">
                        <div className="bg-[#B8FFB8] p-4 text-[#0A7A2F]">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <ExternalLink className="w-5 h-5" />
                                Check Grievance Status
                            </h2>
                        </div>
                        <div className="p-6 md:p-8">
                            <p className="text-[#222222] mb-4">
                                Dear Customer / Distributor, You can check Grievance Status online at anytime. Please use following link to check current status.
                            </p>
                            <div className="flex justify-center mt-4">
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="inline-flex items-center gap-2 bg-[#F7931E] hover:bg-[#F7931E]/90 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                                >
                                    Check Grievance Status
                                    <ExternalLink className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Grievance Status Check Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="bg-white rounded-[14px] shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-slide-up">
                        {/* Modal Header */}
                        <div className="bg-[#B8FFB8] p-4 text-[#0A7A2F] flex justify-between items-center sticky top-0">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <Ticket className="w-5 h-5" />
                                Check Grievance Status
                            </h3>
                            <button
                                onClick={closeModal}
                                className="hover:bg-[#0A7A2F]/10 p-1 rounded-full transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            {statusResult ? (
                                // Status Result Display
                                <div className="space-y-4">
                                    <div className="bg-green-50 border-l-4 border-[#B8FFB8] p-4 rounded-r-lg">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-[#B8FFB8]" />
                                            <h4 className="font-bold text-[#0A7A2F]">Grievance Status Found</h4>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex justify-between p-3 bg-[#F8FAF5] rounded-lg">
                                            <span className="font-bold text-[#222222]">Ticket Number:</span>
                                            <span className="text-[#222222]">{statusResult.ticketNumber}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-[#F8FAF5] rounded-lg">
                                            <span className="font-bold text-[#222222]">Current Status:</span>
                                            <span className="text-[#F7931E] font-bold">{statusResult.status}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-[#F8FAF5] rounded-lg">
                                            <span className="font-bold text-[#222222]">Submitted Date:</span>
                                            <span className="text-[#222222]">{statusResult.submittedDate}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-[#F8FAF5] rounded-lg">
                                            <span className="font-bold text-[#222222]">Last Updated:</span>
                                            <span className="text-[#222222]">{statusResult.lastUpdated}</span>
                                        </div>
                                        <div className="flex justify-between p-3 bg-[#F8FAF5] rounded-lg">
                                            <span className="font-bold text-[#222222]">Department:</span>
                                            <span className="text-[#222222]">{statusResult.department}</span>
                                        </div>
                                        <div className="p-3 bg-[#F8FAF5] rounded-lg">
                                            <span className="font-bold text-[#222222] block mb-1">Description:</span>
                                            <p className="text-[#222222] text-sm">{statusResult.description}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={closeModal}
                                        className="w-full bg-[#B8FFB8] hover:bg-[#B8FFB8]/90 text-[#0A7A2F] font-bold py-3 rounded-lg transition-colors mt-4"
                                    >
                                        Close
                                    </button>
                                </div>
                            ) : (
                                // Status Check Form
                                <form onSubmit={handleStatusCheck} className="space-y-4">
                                    {statusError && (
                                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-r-lg">
                                            <p className="text-red-700 text-sm flex items-center gap-2">
                                                <AlertCircle className="w-4 h-4" />
                                                {statusError}
                                            </p>
                                        </div>
                                    )}

                                    {/* Direct Seller ID */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Direct Seller ID
                                        </label>
                                        <input
                                            type="text"
                                            name="directSellerId"
                                            value={statusFormData.directSellerId}
                                            onChange={handleStatusChange}
                                            placeholder="Enter Direct Seller ID"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Name */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={statusFormData.name}
                                            onChange={handleStatusChange}
                                            placeholder="Your Name"
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Ticket Number * */}
                                    <div className="space-y-1">
                                        <label className="block text-sm font-bold text-[#222222]">
                                            Ticket Number <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="ticketNumber"
                                            value={statusFormData.ticketNumber}
                                            onChange={handleStatusChange}
                                            placeholder="Enter Your Ticket Number"
                                            required
                                            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B8FFB8] focus:border-transparent transition-all"
                                        />
                                    </div>

                                    {/* Check Status Button */}
                                    <button
                                        type="submit"
                                        className="w-full bg-[#F7931E] hover:bg-[#F7931E]/90 text-white font-bold py-3 rounded-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg mt-4"
                                    >
                                        Check Status
                                    </button>

                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="w-full bg-gray-200 hover:bg-gray-300 text-[#222222] font-bold py-3 rounded-lg transition-colors mt-2"
                                    >
                                        Cancel
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            )}
            {/* Global Notifications Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={8000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '16px',
                        fontWeight: 800,
                        boxShadow: '0 8px 30px rgba(247,147,30,0.25)',
                        bgcolor: '#f7931e',
                        color: 'white',
                        '& .MuiAlert-icon': { color: 'white' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default GrievancePage;