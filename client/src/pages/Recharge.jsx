import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tv, Wifi, CheckCircle2, ChevronRight, Zap, CircleUser, Wallet, Heart, Shield, Clock, Users, Gift } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';

const Recharge = () => {
    const [activeTab, setActiveTab] = useState('mobile');

    // Form States
    const [mobileNumber, setMobileNumber] = useState('');
    const [mobileOperator, setMobileOperator] = useState('');
    const [mobileAmount, setMobileAmount] = useState('');

    const [dthNumber, setDthNumber] = useState('');
    const [dthOperator, setDthOperator] = useState('');
    const [dthAmount, setDthAmount] = useState('');

    const [dataCardNumber, setDataCardNumber] = useState('');
    const [dataCardOperator, setDataCardOperator] = useState('');
    const [dataCardAmount, setDataCardAmount] = useState('');

    // Operators
    const AIRTEL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='100' y='52' font-family='Arial,sans-serif' font-size='36' font-weight='900' fill='%23ED1C24' text-anchor='middle'>airtel</text></svg>`;
    const JIO_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='100' y='55' font-family='Arial,sans-serif' font-size='44' font-weight='900' fill='%230066CC' text-anchor='middle'>Jio</text></svg>`;
    const VI_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='90' y='55' font-family='Arial,sans-serif' font-size='44' font-weight='900' fill='%23E11D48' text-anchor='middle'>Vi</text><text x='148' y='55' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23FBBF24' text-anchor='middle'>!</text></svg>`;
    const BSNL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='100' y='52' font-family='Arial,sans-serif' font-size='32' font-weight='900' fill='%23FF6600' text-anchor='middle'>BSNL</text></svg>`;

    const mobileOperators = [
        { id: 'airtel', name: 'Airtel', logo: AIRTEL_LOGO, tagline: '5G Ready' },
        { id: 'jio', name: 'Jio', logo: JIO_LOGO, tagline: 'True 5G' },
        { id: 'vi', name: 'Vi', logo: VI_LOGO, tagline: 'Best Value' },
        { id: 'bsnl', name: 'BSNL', logo: BSNL_LOGO, tagline: 'Pan-India' }
    ];

    const dthOperators = [
        { id: 'tataplay', name: 'Tata Play', logo: '📺', tagline: 'HD Quality' },
        { id: 'airteldth', name: 'Airtel DTH', logo: '🛰️', tagline: 'HD Quality' },
        { id: 'dishtv', name: 'Dish TV', logo: '📡', tagline: 'Best Value' },
        { id: 'd2h', name: 'd2h', logo: '📺', tagline: 'Popular' }
    ];

    const datacardOperators = [
        { id: 'jiofi', name: 'JioFi', logo: '🌐', tagline: 'High Speed' },
        { id: 'airtel4g', name: 'Airtel 4G', logo: '📶', tagline: 'Pan-India' },
        { id: 'vi_dongle', name: 'Vi Dongle', logo: '💻', tagline: 'Best Value' },
        { id: 'bsnl_evdo', name: 'BSNL', logo: '📡', tagline: 'Wide Coverage' }
    ];

    const handleRecharge = async (e, type) => {
        e.preventDefault();

        let operator, rechargeNumber, amount;
        if (type === 'mobile') {
            operator = mobileOperator;
            rechargeNumber = mobileNumber;
            amount = mobileAmount;
        } else if (type === 'dth') {
            operator = dthOperator;
            rechargeNumber = dthNumber;
            amount = dthAmount;
        } else if (type === 'datacard') {
            operator = dataCardOperator;
            rechargeNumber = dataCardNumber;
            amount = dataCardAmount;
        }

        if (!operator || !rechargeNumber || !amount) {
            toast.error("Please fill in all details");
            return;
        }

        try {
            const toastId = toast.loading("Initiating secure payment...");

            const { data: orderData } = await api.post('/recharge/create-order', {
                amount: Number(amount),
                type,
                operator,
                rechargeNumber
            });

            if (!orderData.success) {
                toast.error("Failed to initiate order", { id: toastId });
                return;
            }

            toast.dismiss(toastId);

            if (orderData.order.id && orderData.order.id.startsWith('order_mock_')) {
                const verifyToast = toast.loading("Mocking payment success...");

                const { data: verifyData } = await api.post('/recharge/verify-payment', {
                    razorpay_order_id: orderData.order.id,
                    razorpay_payment_id: `pay_mock_${Date.now()}`,
                    razorpay_signature: "mock_signature",
                    transactionId: orderData.transactionId
                });

                if (verifyData.success) {
                    toast.success("Recharge successful! (Mocked)", { id: verifyToast });
                    if (type === 'mobile') { setMobileNumber(''); setMobileAmount(''); }
                    if (type === 'dth') { setDthNumber(''); setDthAmount(''); }
                    if (type === 'datacard') { setDataCardNumber(''); setDataCardAmount(''); }
                } else {
                    toast.error("Payment verification failed", { id: verifyToast });
                }
                return;
            }

            const options = {
                key: "rzp_test_your_key_here",
                amount: orderData.order.amount,
                currency: "INR",
                name: "Sanyukt Parivaar",
                description: `${type.toUpperCase()} Recharge for ${rechargeNumber}`,
                image: "https://your-logo-url.com/logo.png",
                order_id: orderData.order.id,
                handler: async function (response) {
                    try {
                        const verifyToast = toast.loading("Verifying payment...");

                        const { data: verifyData } = await api.post('/recharge/verify-payment', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            transactionId: orderData.transactionId
                        });

                        if (verifyData.success) {
                            toast.success("Recharge successful!", { id: verifyToast });
                            if (type === 'mobile') { setMobileNumber(''); setMobileAmount(''); }
                            if (type === 'dth') { setDthNumber(''); setDthAmount(''); }
                            if (type === 'datacard') { setDataCardNumber(''); setDataCardAmount(''); }
                        } else {
                            toast.error("Payment verification failed", { id: verifyToast });
                        }
                    } catch (err) {
                        console.error(err);
                        toast.error("Error verifying payment");
                    }
                },
                prefill: {
                    name: "Sanyukt Member",
                    email: "richlifesanyuktprivaar@gamil.com",
                    contact: "+91 7880370057"
                },
                theme: {
                    color: "#0A7A2F"

                }
            };

            const rzp1 = new window.Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                toast.error(`Payment Failed: ${response.error.description}`);
            });
            rzp1.open();

        } catch (error) {
            console.error("Recharge Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
        }
    };

    const tabs = [
        { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone },
        { id: 'dth', label: 'DTH Recharge', icon: Tv },
        { id: 'datacard', label: 'Data Card Recharge', icon: Wifi }
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            {/* 1. PAGE BANNER / HEADER SECTION */}
            <section className="relative h-[260px] flex items-center justify-center overflow-hidden bg-[#2F7A32]">
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')" }}
                ></div>

                <div className="absolute inset-0 bg-black/60"></div>

                <div className="relative z-10 text-center text-white px-4 w-full flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-8">
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight drop-shadow-lg text-white">Recharge </h1>

                        <div className="flex items-center justify-center md:justify-start gap-2 text-sm md:text-base font-medium text-white/80 mb-6 drop-shadow">
                            <span className="hover:text-white cursor-pointer transition-colors">Home</span>
                            <ChevronRight className="w-4 h-4" />
                            <span className="text-[#F7931E]">Services</span>
                        </div>

                        <p className="text-lg md:text-xl font-light text-white/90 max-w-2xl drop-shadow-md">
                            Fast, secure, and reliable recharge services. Support our cause with donations.
                        </p>
                    </div>
                    {/* <div className="hidden md:block flex-1 flex justify-end">
                        <div className="w-[400px] h-[180px] bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 flex items-center justify-center text-white/70 shadow-2xl overflow-hidden">
                            <span className="text-sm font-medium">Recharge & Donate Banner</span>
                        </div> */}
                    {/* </div> */}
                </div>
            </section>

            <main className="flex-grow container mx-auto px-4 py-16 max-w-7xl">

                {/* 2. INTRODUCTION SECTION */}
                <section className="text-center max-w-4xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-[#0A7A2F] mb-6 tracking-tight">
                        Complete Digital Solutions Under One Platform
                    </h2>
                    <div className="space-y-4 text-gray-600 text-lg leading-relaxed">
                        <p>
                            Sanyukt Parivartan & Rich Life  brings you convenient digital recharge services and donation platforms.
                            Perform quick recharge while also contributing to meaningful causes that help communities thrive.
                        </p>
                        <p>
                            With secure transactions and instant processing, our services are designed for simplicity, speed, and reliability.
                        </p>
                    </div>
                </section>

                {/* 3. DONATION SECTION - WITH PUBLIC QR CODE IMAGE */}
                <section className="mb-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-[#0A7A2F] to-[#0A7A2F]/90 rounded-3xl shadow-2xl overflow-hidden"
                    >
                        <div className="p-10 lg:p-16">
                            <div className="max-w-4xl mx-auto">
                                {/* Header */}
                                <div className="text-center mb-10">
                                    <div className="flex items-center justify-center gap-3 mb-4">
                                        <Heart className="w-10 h-10 fill-white text-white" />
                                        <h2 className="text-3xl md:text-4xl font-bold text-white">Support Our Cause</h2>
                                    </div>
                                    <p className="text-white/90 text-lg leading-relaxed max-w-3xl mx-auto">
                                        Your contribution helps us serve communities better, provide essential services,
                                        and create lasting impact. Every donation, big or small, makes a difference.
                                    </p>
                                </div>

                                {/* Features Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-white font-medium">100% Secure Payments</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-white font-medium">Instant Tax Receipts</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="w-6 h-6 bg-white/20 rounded flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-white font-medium">Direct Impact on Communities</span>
                                    </div>
                                    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                        <div className="w-6 h-6 bg-white rounded flex items-center justify-center">
                                            <CheckCircle2 className="w-4 h-4 text-[#0A7A2F]" />
                                        </div>
                                        <span className="text-white font-medium">Corporate Matching Available</span>
                                    </div>
                                </div>

                                {/* UPI and QR Code Section */}
                                <div className="grid md:grid-cols-2 gap-8 items-center bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
                                    {/* UPI ID */}
                                    <div className="text-center md:text-left">
                                        <p className="text-sm text-white/70 mb-2 font-medium uppercase tracking-wider">UPI ID for Direct Transfer</p>
                                        <div className="flex items-center justify-between bg-white/10 rounded-lg p-4 border border-white/20 mb-4">
                                            <span className="text-xl md:text-2xl font-mono font-bold text-white">20260325575843-iservuqrsbrp@cbin</span>
                                            <button
                                                onClick={() => {
                                                    navigator.clipboard.writeText('organizaton@kohddfchain');
                                                    toast.success('UPI ID copied to clipboard!');
                                                }}
                                                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-semibold transition-colors text-white"
                                            >
                                                Copy
                                            </button>
                                        </div>
                                        <p className="text-white/60 text-sm flex items-center gap-2 justify-center md:justify-start">
                                            <Shield className="w-4 h-4" /> Secure & verified UPI ID
                                        </p>
                                    </div>

                                    {/* QR Code - Using Public Image */}
                                    <div className="text-center md:text-left md:border-l md:border-white/20 md:pl-8">
                                        <p className="text-sm text-white/70 mb-3 font-medium uppercase tracking-wider">Scan QR Code</p>
                                        <div className="flex flex-col md:flex-row items-center gap-6">
                                            <div className="w-40 h-40 bg-white rounded-xl flex items-center justify-center shadow-xl overflow-hidden">
                                                <img
                                                    src="/images/qr.png"
                                                    alt="Donation QR Code"
                                                    className="w-full h-full object-contain"
                                                    onError={(e) => {
                                                        e.target.onerror = null;
                                                        e.target.src = "https://via.placeholder.com/160x160?text=QR+Code";
                                                    }}
                                                />
                                            </div>
                                            <div className="text-white/80 text-sm">
                                                <p className="font-semibold text-lg">Use any UPI app</p>
                                                <p className="text-white/60">Google Pay • PhonePe • Paytm • BHIM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Note */}
                                <p className="text-center text-white/60 text-sm mt-8">
                                    Your donation helps us create lasting impact in communities. Thank you for your support!
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 4. RECHARGE SERVICES SECTION */}
                <section className="mb-20">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                        {/* Tabs Header */}
                        <div className="flex flex-col md:flex-row bg-gray-50 border-b border-gray-100">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-6 px-4 flex items-center justify-center gap-3 transition-all relative ${isActive ? 'bg-white text-[#0A7A2F]' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-[#F7931E]' : ''}`} />
                                        <span className={`font-semibold text-lg ${isActive ? 'text-[#0A7A2F]' : ''}`}>{tab.label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTabBottom"
                                                className="absolute bottom-0 left-0 right-0 h-1 bg-[#F7931E]"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content Area */}
                        <div className="p-8 md:p-12">
                            <AnimatePresence mode="wait">
                                {activeTab === 'mobile' && (
                                    <motion.div
                                        key="mobile"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-8">
                                            <div>
                                                <div className="flex items-center justify-between mb-6">
                                                    <h3 className="text-3xl font-bold text-gray-900">Mobile Recharge</h3>
                                                    <span className="bg-[#0A7A2F]/10 text-[#0A7A2F] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Up to 5% Commission</span>
                                                </div>
                                                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                                    Recharge prepaid mobile numbers across all major telecom operators in India with ease.
                                                    Instant confirmation and secure payment.
                                                </p>
                                                <ul className="space-y-4">
                                                    {[
                                                        'All major prepaid operators supported',
                                                        'Instant & secure recharge',
                                                        'Simple and user-friendly process',
                                                        'Available 24/7',
                                                        'Eligible for business benefits'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <CheckCircle2 className="w-6 h-6 text-[#0A7A2F] flex-shrink-0" />
                                                            <span className="text-gray-700 font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Zap className="w-6 h-6 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-900">Instant Recharge</h4>
                                                        <p className="text-gray-500">Select operator and enter number</p>
                                                    </div>
                                                </div>

                                                <form onSubmit={(e) => handleRecharge(e, 'mobile')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Smartphone className="w-4 h-4 text-[#F7931E]" />
                                                                Phone Number
                                                            </label>
                                                            <div className="relative">
                                                                <input
                                                                    type="tel"
                                                                    value={mobileNumber}
                                                                    onChange={(e) => setMobileNumber(e.target.value)}
                                                                    placeholder="10-digit mobile number"
                                                                    className="w-full pl-4 pr-16 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                    maxLength="10"
                                                                    required
                                                                />
                                                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">🇮🇳 +91</span>
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <CircleUser className="w-4 h-4 text-[#F7931E]" />
                                                                Choose Network
                                                            </label>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                {mobileOperators.map((op) => (
                                                                    <button
                                                                        key={op.id}
                                                                        type="button"
                                                                        onClick={() => setMobileOperator(op.id)}
                                                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${mobileOperator === op.id
                                                                            ? 'border-[#F7931E] bg-[#F7931E]/5'
                                                                            : 'border-gray-100 bg-gray-50 hover:bg-white'
                                                                            }`}
                                                                    >
                                                                        <img src={op.logo} alt={op.name} className="h-6 w-auto object-contain" />
                                                                        <span className={`text-[10px] font-medium ${mobileOperator === op.id ? 'text-[#F7931E]' : 'text-gray-400'
                                                                            }`}>{op.tagline}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Wallet className="w-4 h-4 text-[#F7931E]" />
                                                                Amount (₹)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={mobileAmount}
                                                                onChange={(e) => setMobileAmount(e.target.value)}
                                                                placeholder="Enter amount"
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            type="submit"
                                                            className="w-full py-3.5 bg-[#0A7A2F] text-white font-bold rounded-xl shadow-lg shadow-green-900/20 hover:bg-[#086326] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Zap className="w-5 h-5 fill-current" />
                                                            Recharge Now
                                                        </motion.button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-5">
                                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <Smartphone className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-xl font-bold text-gray-700 mb-2">Mobile Recharge</h4>
                                                    <p className="text-gray-500">Fast & Secure Prepaid Recharges</p>
                                                    <div className="mt-4 p-4 bg-white rounded-xl">
                                                        <span className="text-3xl font-bold text-[#0A7A2F]">5%</span>
                                                        <span className="text-gray-600 ml-2">Commission</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'dth' && (
                                    <motion.div
                                        key="dth"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-8">
                                            <div>
                                                <h3 className="text-3xl font-bold text-gray-900 mb-4">DTH Recharge</h3>
                                                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                                    Never miss your favorite entertainment. Recharge your DTH connection quickly and conveniently.
                                                </p>
                                                <ul className="space-y-4">
                                                    {[
                                                        'All major DTH providers supported',
                                                        'Instant recharge confirmation',
                                                        '24/7 service availability',
                                                        'Secure transactions'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <CheckCircle2 className="w-6 h-6 text-[#0A7A2F] flex-shrink-0" />
                                                            <span className="text-gray-700 font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Tv className="w-6 h-6 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-900">DTH Top-Up</h4>
                                                        <p className="text-gray-500">Enter Customer ID to proceed</p>
                                                    </div>
                                                </div>

                                                <form onSubmit={(e) => handleRecharge(e, 'dth')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Tv className="w-4 h-4 text-[#F7931E]" />
                                                                Customer ID / Smart Card Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dthNumber}
                                                                onChange={(e) => setDthNumber(e.target.value)}
                                                                placeholder="Enter your ID"
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <CircleUser className="w-4 h-4 text-[#F7931E]" />
                                                                Provider
                                                            </label>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                {dthOperators.map((op) => (
                                                                    <button
                                                                        key={op.id}
                                                                        type="button"
                                                                        onClick={() => setDthOperator(op.id)}
                                                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${dthOperator === op.id
                                                                            ? 'border-[#F7931E] bg-[#F7931E]/5'
                                                                            : 'border-gray-100 bg-gray-50 hover:bg-white'
                                                                            }`}
                                                                    >
                                                                        <span className="text-2xl mb-1">{op.logo}</span>
                                                                        <span className={`text-[11px] font-bold ${dthOperator === op.id ? 'text-[#F7931E]' : 'text-gray-700'
                                                                            }`}>{op.name}</span>
                                                                        <span className="text-[10px] text-gray-400 font-medium">{op.tagline}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Wallet className="w-4 h-4 text-[#F7931E]" />
                                                                Amount (₹)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={dthAmount}
                                                                onChange={(e) => setDthAmount(e.target.value)}
                                                                placeholder="Enter amount"
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            type="submit"
                                                            className="w-full py-3.5 bg-[#0A7A2F] text-white font-bold rounded-xl shadow-lg shadow-green-900/20 hover:bg-[#086326] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Zap className="w-5 h-5 fill-current" />
                                                            Recharge Now
                                                        </motion.button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-5">
                                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <Tv className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-xl font-bold text-gray-700 mb-2">DTH Recharge</h4>
                                                    <p className="text-gray-500">All Major DTH Providers</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'datacard' && (
                                    <motion.div
                                        key="datacard"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-8">
                                            <div>
                                                <h3 className="text-3xl font-bold text-gray-900 mb-4">Data Card Recharge</h3>
                                                <p className="text-gray-600 leading-relaxed mb-8 text-lg">
                                                    Stay connected with our data card recharge services. Quick and hassle-free recharge.
                                                </p>
                                                <ul className="space-y-4">
                                                    {[
                                                        'High-speed internet support',
                                                        'Quick and hassle-free recharge',
                                                        'Reliable service uptime',
                                                        'Secure payment gateway'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-3">
                                                            <CheckCircle2 className="w-6 h-6 text-[#0A7A2F] flex-shrink-0" />
                                                            <span className="text-gray-700 font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-6">
                                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Wifi className="w-6 h-6 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-xl font-bold text-gray-900">Data Top-Up</h4>
                                                        <p className="text-gray-500">Select provider and amount</p>
                                                    </div>
                                                </div>

                                                <form onSubmit={(e) => handleRecharge(e, 'datacard')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Wifi className="w-4 h-4 text-[#F7931E]" />
                                                                Data Card Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={dataCardNumber}
                                                                onChange={(e) => setDataCardNumber(e.target.value)}
                                                                placeholder="Enter data card number"
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <CircleUser className="w-4 h-4 text-[#F7931E]" />
                                                                Provider
                                                            </label>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                {datacardOperators.map((op) => (
                                                                    <button
                                                                        key={op.id}
                                                                        type="button"
                                                                        onClick={() => setDataCardOperator(op.id)}
                                                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${dataCardOperator === op.id
                                                                            ? 'border-[#F7931E] bg-[#F7931E]/5'
                                                                            : 'border-gray-100 bg-gray-50 hover:bg-white'
                                                                            }`}
                                                                    >
                                                                        <span className="text-2xl mb-1">{op.logo}</span>
                                                                        <span className={`text-[11px] font-bold ${dataCardOperator === op.id ? 'text-[#F7931E]' : 'text-gray-700'
                                                                            }`}>{op.name}</span>
                                                                        <span className="text-[10px] text-gray-400 font-medium">{op.tagline}</span>
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Wallet className="w-4 h-4 text-[#F7931E]" />
                                                                Amount (₹)
                                                            </label>
                                                            <input
                                                                type="number"
                                                                value={dataCardAmount}
                                                                onChange={(e) => setDataCardAmount(e.target.value)}
                                                                placeholder="Enter amount"
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            type="submit"
                                                            className="w-full py-3.5 bg-[#0A7A2F] text-white font-bold rounded-xl shadow-lg shadow-green-900/20 hover:bg-[#086326] transition-all flex items-center justify-center gap-2"
                                                        >
                                                            <Zap className="w-5 h-5 fill-current" />
                                                            Recharge Now
                                                        </motion.button>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>

                                        <div className="lg:col-span-5">
                                            <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 h-full flex items-center justify-center">
                                                <div className="text-center">
                                                    <Wifi className="w-24 h-24 text-gray-300 mx-auto mb-4" />
                                                    <h4 className="text-xl font-bold text-gray-700 mb-2">Data Card Recharge</h4>
                                                    <p className="text-gray-500">High-Speed Internet</p>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>

                {/* 5. HOW IT WORKS SECTION */}
                <section className="bg-white rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-xl border border-gray-100">
                    <div className="relative z-10">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-black mb-4 tracking-tight text-[#0A7A2F]">How It Works</h2>
                            <p className="text-gray-500 text-lg max-w-2xl mx-auto font-medium">
                                Simple steps to recharge through our secure platform
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="space-y-8">
                                {[
                                    { step: 1, title: 'Login to your account', desc: 'Securely access the Sanyukt Parivaar platform.' },
                                    { step: 2, title: 'Choose Service', desc: 'Select Mobile, DTH, or Data Card recharge.' },
                                    { step: 3, title: 'Enter Details', desc: 'Fill in the required information.' },
                                    { step: 4, title: 'Make Payment', desc: 'Use our secure E-Payment gateway.' },
                                    { step: 5, title: 'Transaction Complete!', desc: 'Instant confirmation and receipt.' }
                                ].map((item, idx) => (
                                    <div key={idx} className="flex gap-6 group">
                                        <div className="flex flex-col items-center">
                                            <div className="w-12 h-12 rounded-2xl bg-[#0A7A2F]/10 flex items-center justify-center text-xl font-black text-[#0A7A2F] group-hover:bg-[#0A7A2F] group-hover:text-white transition-colors duration-300 shadow-sm border border-[#0A7A2F]/20">
                                                {item.step}
                                            </div>
                                            {idx < 4 && <div className="w-[2px] h-full bg-gray-200 mt-2"></div>}
                                        </div>
                                        <div className="pb-8">
                                            <h4 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h4>
                                            <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-[#F7931E]/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                                <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#0A7A2F]/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                                <div className="relative bg-white rounded-3xl p-8 border border-gray-100 shadow-2xl">
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <span className="text-3xl font-black">₹</span>
                                        </div>
                                        <h3 className="font-extrabold text-2xl text-gray-800 tracking-tight mb-2">Secure E-Payment</h3>
                                        <p className="text-gray-600 mb-6">100% Safe & Encrypted</p>

                                        <div className="grid grid-cols-2 gap-4 mt-6">
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <Shield className="w-6 h-6 text-[#0A7A2F] mx-auto mb-2" />
                                                <span className="text-xs font-semibold">Secure</span>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <Zap className="w-6 h-6 text-[#F7931E] mx-auto mb-2" />
                                                <span className="text-xs font-semibold">Instant</span>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <CheckCircle2 className="w-6 h-6 text-[#0A7A2F] mx-auto mb-2" />
                                                <span className="text-xs font-semibold">Verified</span>
                                            </div>
                                            <div className="p-3 bg-gray-50 rounded-xl">
                                                <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
                                                <span className="text-xs font-semibold">Trusted</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
};

export default Recharge;
