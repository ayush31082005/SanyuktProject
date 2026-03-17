import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Tv, Wifi, CheckCircle2, ChevronRight, Zap, CircleUser, Wallet, Heart, Shield, Clock, Users, Gift, Receipt, Search, Copy, Share2, Info, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../api';
import PaymentMethodModal from '../components/PaymentMethodModal';
import BrowsePlansModal from '../components/BrowsePlansModal';
import { rechargePlans } from '../data/rechargePlans';
import RazorpayPaymentButton from '../components/RazorpayPaymentButton';

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

    const [deviceNumber, setDeviceNumber] = useState('');
    const [deviceOperator, setDeviceOperator] = useState('');
    const [deviceAmount, setDeviceAmount] = useState('');

    // Payment Modal States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [pendingRecharge, setPendingRecharge] = useState(null);

    // Browse Plans Modal States
    const [showPlansModal, setShowPlansModal] = useState(false);

    // User Data State
    const [userData, setUserData] = useState(null);

    // Fetch User Stats (Balance) and Profile
    React.useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [statsRes, userRes] = await Promise.all([
                    api.get('mlm/get-stats'),
                    api.get('auth/profile')
                ]);
                setWalletBalance(statsRes.data?.walletBalance || 0);
                setUserData(userRes.data?.user || null);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchAllData();
    }, []);

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

    const deviceOperators = [
        { id: 'iot_device', name: 'IoT Device', logo: '🤖', tagline: 'Smart Connect' },
        { id: 'oxygen_concentrator', name: 'Oxygen Device', logo: '🌬️', tagline: 'Health Tech' },
        { id: 'pos_terminal', name: 'POS Terminal', logo: '💳', tagline: 'Business' },
        { id: 'gps_tracker', name: 'GPS Tracker', logo: '📍', tagline: 'Security' }
    ];

    const handleRecharge = (e, type) => {
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
        } else if (type === 'device') {
            operator = deviceOperator;
            rechargeNumber = deviceNumber;
            amount = deviceAmount;
        }

        if (!operator || !rechargeNumber || !amount) {
            toast.error("Please fill in all details");
            return;
        }

        setPendingRecharge({ operator, rechargeNumber, amount, type });
        setShowPaymentModal(true);
    };

    const handleSelectPayment = async (method) => {
        if (!pendingRecharge) return;
        const { operator, rechargeNumber, amount, type } = pendingRecharge;

        setIsProcessingPayment(true);
        const toastId = toast.loading(method === 'wallet' ? "Processing wallet recharge..." : "Initiating payment...");

        try {
            if (method === 'wallet') {
                const { data } = await api.post('/recharge/wallet', {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber
                });

                if (data.success) {
                    window.alert("Recharge successful using your wallet balance!");
                    toast.success("Recharge successful using wallet!", { id: toastId });
                    // Clear forms
                    if (type === 'mobile') { setMobileNumber(''); setMobileAmount(''); }
                    if (type === 'dth') { setDthNumber(''); setDthAmount(''); }
                    if (type === 'datacard') { setDataCardNumber(''); setDataCardAmount(''); }
                    if (type === 'device') { setDeviceNumber(''); setDeviceAmount(''); }
                    setShowPaymentModal(false);
                    setPendingRecharge(null);
                } else {
                    toast.error(data.message || "Wallet recharge failed", { id: toastId });
                }
            } else {
                // Online/Razorpay Payment
                const { data: orderData } = await api.post('/recharge/create-order', {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber
                });

                if (!orderData.success) {
                    toast.error("Failed to initiate order", { id: toastId });
                    setIsProcessingPayment(false);
                    return;
                }

                toast.dismiss(toastId);

                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SQbbsEM3Dlfgi2",
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Sanyukt Parivaar",
                    description: "Recharge Payment",
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
                                window.alert("Recharge Successful! Your payment has been verified and your account will be updated shortly.");
                                toast.success("Recharge successful!", { id: verifyToast });
                                if (type === 'mobile') { setMobileNumber(''); setMobileAmount(''); }
                                if (type === 'dth') { setDthNumber(''); setDthAmount(''); }
                                if (type === 'datacard') { setDataCardNumber(''); setDataCardAmount(''); }
                                if (type === 'device') { setDeviceNumber(''); setDeviceAmount(''); }
                                setShowPaymentModal(false);
                                setPendingRecharge(null);
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
                        contact: (rechargeNumber || "").toString().replace(/\D/g, '').slice(-10)
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
            }
        } catch (error) {
            console.error("Recharge Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong. Please try again.", { id: toastId });
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const tabs = [
        { id: 'mobile', label: 'Mobile Recharge', icon: Smartphone },
        { id: 'dth', label: 'DTH Recharge', icon: Tv },
        { id: 'datacard', label: 'Data Card Recharge', icon: Wifi },
        { id: 'device', label: 'Device Recharge', icon: Zap }
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

                {/* 3. DONATION SECTION - PREMIUM REDESIGN */}
                <section className="mb-8 relative text-balance">
                    {/* Decorative Background Elements */}
                    <div className="absolute -top-12 -right-12 w-96 h-96 bg-[#F7931E]/10 rounded-full blur-[120px] pointer-events-none"></div>
                    <div className="absolute -bottom-12 -left-12 w-96 h-96 bg-[#0A7A2F]/10 rounded-full blur-[120px] pointer-events-none"></div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(10,122,47,0.15)] border border-white/10"
                    >
                        {/* Complex Gradient Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0A7A2F] via-[#0A6326] to-[#085220]"></div>

                        {/* Pattern Overlay */}
                        <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>

                        <div className="relative z-10 p-5 lg:p-10">
                            <div className="max-w-5xl mx-auto">
                                {/* Header */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        initial={{ scale: 0.9 }}
                                        whileInView={{ scale: 1 }}
                                        className="inline-flex items-center gap-2 py-1.5 px-5 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-6"
                                    >
                                        <Heart className="w-4 h-4 fill-[#F7931E] text-[#F7931E]" />
                                        <span className="text-white font-black text-[10px] uppercase tracking-[0.3em]">Support Our Mission</span>
                                    </motion.div>
                                    <h2 className="text-2xl md:text-4xl font-black text-white mb-3 tracking-tight leading-tight">
                                        Empower Change <span className="text-[#F7931E]">- With Your Kindness</span>
                                    </h2>
                                    <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-medium">
                                        Your generosity fuels our commitment to building sustainable communities within the <span className="text-white font-black">Sanyukt Parivaar & Rich Life Pvt.Ltd.</span> network.
                                    </p>
                                </div>

                                {/* Features / Trust Badges */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
                                    {[
                                        { title: 'Secure Gateway', icon: Shield, subtitle: 'VERIFIED' },
                                        { title: 'Tax Benefits', icon: Receipt, subtitle: 'VERIFIED' },
                                        { title: 'Community Led', icon: Users, subtitle: 'VERIFIED' },
                                        { title: 'Direct Impact', icon: Zap, subtitle: 'VERIFIED' }
                                    ].map((feature, i) => (
                                        <motion.div
                                            key={i}
                                            whileHover={{ y: -3 }}
                                            className="bg-white/5 backdrop-blur-xl rounded-xl p-3 border border-white/10 transition-all duration-300"
                                        >
                                            <div className="w-10 h-10 bg-[#F7931E] rounded-lg flex items-center justify-center mb-2 shadow-lg shadow-[#F7931E]/20">
                                                <feature.icon className="w-5 h-5 text-white" />
                                            </div>
                                            <h4 className="text-white font-bold text-xs">{feature.title}</h4>
                                            <p className="text-white/30 text-[8px] mt-0.5 font-black tracking-widest uppercase">{feature.subtitle}</p>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Transaction Core */}
                                <div className="grid lg:grid-cols-5 gap-5">
                                    {/* Left: UPI ID & Personal Link */}
                                    <div className="lg:col-span-3 space-y-3">
                                        <div className="bg-black/20 backdrop-blur-3xl rounded-2xl p-5 border border-white/10 h-full flex flex-col justify-center">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div>
                                                    <span className="inline-block px-2.5 py-0.5 bg-[#F7931E] text-white text-[8px] font-black uppercase tracking-widest rounded mb-1.5">Direct</span>
                                                    <h3 className="text-lg font-black text-white">Scan or Copy UPI</h3>
                                                    <p className="text-[#F7931E] text-[10px] font-black uppercase tracking-wider mb-0.5">Beneficiary: Sanyukt Parivaar & Rich Life</p>
                                                    <p className="text-white/50 text-[9px] font-medium italic">Verified Official Company Account</p>
                                                </div>
                                            </div>

                                            <div className="bg-black/20 rounded-xl p-3 border border-white/5 mb-3 group/upi">
                                                <p className="text-[#F7931E] text-[9px] font-black uppercase tracking-[0.2em] mb-1.5">UPI ADDRESS</p>
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-base md:text-xl font-mono font-bold text-white break-all tracking-tight">20260325575843-iservuqrsbrp@cbin</span>
                                                    <motion.button
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                        onClick={() => {
                                                            navigator.clipboard.writeText('20260325575843-iservuqrsbrp@cbin');
                                                            toast.success('UPI Copied!');
                                                        }}
                                                        className="px-4 py-2 bg-[#F7931E] text-white rounded-lg shadow-lg shadow-[#F7931E]/20"
                                                    >
                                                        <span className="text-[9px] font-black uppercase tracking-widest">Copy</span>
                                                    </motion.button>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 text-white/40">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="w-3.5 h-3.5 text-[#F7931E]" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Verified</span>
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Clock className="w-3.5 h-3.5 text-[#F7931E]" />
                                                    <span className="text-[9px] font-black uppercase tracking-widest">Instant</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Personal SMART Link Sharing */}
                                        {userData && (
                                            <motion.div
                                                initial={{ opacity: 0 }}
                                                whileInView={{ opacity: 1 }}
                                                className="bg-white/10 backdrop-blur-3xl rounded-2xl p-5 border border-white/20"
                                            >
                                                <div className="flex items-center justify-between mb-3">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-7 h-7 bg-[#0A7A2F] rounded flex items-center justify-center">
                                                            <Share2 className="w-3.5 h-3.5 text-white" />
                                                        </div>
                                                        <h4 className="text-white font-black text-xs uppercase tracking-wide">Sharing Link</h4>
                                                    </div>
                                                    <div className="bg-green-500/20 px-2 py-0.5 rounded-full border border-green-500/30">
                                                        <span className="text-green-400 text-[8px] font-black uppercase">Your Social ID</span>
                                                    </div>
                                                </div>

                                                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex items-center gap-2.5">
                                                    <div className="flex-1 overflow-hidden">
                                                        <p className="text-white/40 text-[8px] font-black uppercase tracking-widest mb-1">Link for others to donate to you</p>
                                                        <p className="text-white font-bold text-[10px] truncate font-mono">
                                                            {window.location.origin + '/donate?for=' + (userData.memberId || userData._id)}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <button
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(window.location.origin + '/donate?for=' + (userData.memberId || userData._id));
                                                                toast.success('Link Copied!');
                                                            }}
                                                            className="p-1.5 bg-white/10 hover:bg-white/20 rounded-md text-white transition-colors"
                                                        >
                                                            <Copy className="w-3.5 h-3.5" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                if (navigator.share) {
                                                                    navigator.share({
                                                                        title: 'Sanyukt Parivaar Donation',
                                                                        text: `Support my mission on Sanyukt Parivaar.`,
                                                                        url: window.location.origin + '/donate?for=' + (userData.memberId || userData._id)
                                                                    });
                                                                } else {
                                                                    toast.error('Sharing not supported');
                                                                }
                                                            }}
                                                            className="p-1.5 bg-[#F7931E]/20 hover:bg-[#F7931E]/40 rounded-md text-[#F7931E] transition-colors"
                                                        >
                                                            <Share2 className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Right: QR Code & Razorpay Button */}
                                    <div className="lg:col-span-2 space-y-3">
                                        <div className="bg-white rounded-[1.5rem] p-5 shadow-2xl flex flex-col items-center justify-center h-full border border-gray-100">
                                            <div className="relative group/qr mb-3">
                                                <div className="absolute inset-0 bg-[#F7931E]/10 rounded-2xl blur-xl opacity-0 group-hover/qr:opacity-100 transition-opacity"></div>
                                                <div className="relative bg-white p-3 rounded-xl border border-gray-100 shadow-sm flex flex-col items-center">
                                                    <img
                                                        src="/qr.jpeg"
                                                        alt="Donation QR Code"
                                                        className="w-32 h-32 object-contain rounded-lg"
                                                        onError={(e) => { e.target.src = "https://via.placeholder.com/150x150?text=SCAN+PAY"; }}
                                                    />
                                                    <div className="mt-2 flex flex-col items-center gap-1">
                                                        <div className="flex items-center gap-1.5">
                                                            <Smartphone className="w-3 h-3 text-[#F7931E]" />
                                                            <span className="text-[9px] font-black text-gray-900 uppercase tracking-widest">Scan to Pay</span>
                                                        </div>
                                                        <span className="text-[10px] font-black text-[#F7931E] uppercase tracking-wider">to Sanyukt Parivaar & Rich Life</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="w-full h-px bg-gray-50 mb-3"></div>

                                            <div className="w-full flex justify-center">
                                                <div className="relative group/razor transition-transform hover:scale-105">
                                                    <div className="scale-100">
                                                        <RazorpayPaymentButton buttonId="pl_SROihejcCAh8Vm" />
                                                    </div>
                                                </div>
                                            </div>

                                            <p className="mt-3 text-[8px] text-gray-400 font-bold uppercase tracking-widest flex flex-col items-center gap-1">
                                                <div className="flex items-center gap-1.5">
                                                    <Shield className="w-2.5 h-2.5 text-[#F7931E]" />
                                                    <span>Secured by Razorpay</span>
                                                </div>
                                                <span className="text-[9px] text-[#F7931E] font-black">Official Payment to Sanyukt Parivaar</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Footer Note */}
                                <div className="mt-8 text-center">
                                    <p className="text-white/40 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-3">
                                        <div className="h-px w-6 bg-white/10"></div>
                                        YOUR SUPPORT BUILDS A BETTER TOMORROW
                                        <div className="h-px w-6 bg-white/10"></div>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 4. RECHARGE SERVICES SECTION */}
                <section className="mb-20">
                    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">

                        {/* Tabs Header */}
                        <div className="flex flex-col md:flex-row bg-[#0A7A2F]/5 border-b border-gray-100 p-2 gap-2">
                            {tabs.map(tab => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 py-5 px-4 flex items-center justify-center gap-3 transition-all rounded-2xl ${isActive
                                            ? 'bg-gradient-to-r from-[#0A7A2F] to-[#0A6326] text-white shadow-lg'
                                            : 'text-gray-600 hover:text-[#0A7A2F] hover:bg-white/50'
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? 'text-yellow-400' : ''}`} />
                                        <span className={`font-black text-sm uppercase tracking-widest ${isActive ? 'text-white' : ''}`}>{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content Area */}
                        <div className="p-4 md:p-8">
                            <AnimatePresence mode="wait">
                                {activeTab === 'mobile' && (
                                    <motion.div
                                        key="mobile"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <h3 className="text-2xl font-bold text-gray-900">Mobile Recharge</h3>
                                                <span className="bg-[#0A7A2F]/10 text-[#0A7A2F] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Up to 5% Commission</span>
                                            </div>

                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Zap className="w-5 h-5 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">Instant Recharge</h4>
                                                        <p className="text-xs text-gray-500">Select operator and enter number</p>
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
                                                            <div className="flex items-center justify-between mb-2">
                                                                <label className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                                                                    <Wallet className="w-4 h-4 text-[#F7931E]" />
                                                                    Amount (₹)
                                                                </label>
                                                                {mobileOperator && (
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => setShowPlansModal(true)}
                                                                        className="text-[10px] font-black text-[#0A7A2F] uppercase tracking-widest hover:underline flex items-center gap-1"
                                                                    >
                                                                        <Search className="w-3 h-3" />
                                                                        Browse Plans
                                                                    </button>
                                                                )}
                                                            </div>
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

                                        <div className="lg:col-span-5 flex flex-col gap-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Smartphone className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <h4 className="text-lg font-bold text-gray-700 mb-1">Mobile Recharge</h4>
                                                    <p className="text-gray-500 text-xs">Fast & Secure Prepaid Recharges</p>
                                                    <div className="mt-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm">
                                                        <span className="text-2xl font-bold text-[#0A7A2F]">5%</span>
                                                        <span className="text-gray-600 text-xs ml-1 font-bold">Commission</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#0A7A2F]" />
                                                    Why Choose Us?
                                                </h4>
                                                <ul className="space-y-3">
                                                    {[
                                                        'All major prepaid operators supported',
                                                        'Instant & secure recharge',
                                                        'Simple and user-friendly process',
                                                        'Available 24/7',
                                                        'Eligible for business benefits'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0A7A2F] mt-1.5 flex-shrink-0" />
                                                            <span className="text-gray-600 text-xs font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
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
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-4">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">DTH Recharge</h3>

                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Tv className="w-5 h-5 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">DTH Top-Up</h4>
                                                        <p className="text-xs text-gray-500">Enter Customer ID to proceed</p>
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

                                        <div className="lg:col-span-5 flex flex-col gap-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Tv className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <h4 className="text-lg font-bold text-gray-700 mb-1">DTH Recharge</h4>
                                                    <p className="text-gray-500 text-xs font-medium">All Major DTH Providers</p>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#0A7A2F]" />
                                                    Recharge Benefits
                                                </h4>
                                                <ul className="space-y-3">
                                                    {[
                                                        'All major DTH providers supported',
                                                        'Instant recharge confirmation',
                                                        '24/7 service availability',
                                                        'Secure transactions'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0A7A2F] mt-1.5 flex-shrink-0" />
                                                            <span className="text-gray-600 text-xs font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
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
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-4">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Data Card Recharge</h3>

                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Wifi className="w-5 h-5 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">Data Top-Up</h4>
                                                        <p className="text-xs text-gray-500">Select provider and amount</p>
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

                                        <div className="lg:col-span-5 flex flex-col gap-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Wifi className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <h4 className="text-lg font-bold text-gray-700 mb-1">Data Card Recharge</h4>
                                                    <p className="text-gray-500 text-xs font-medium">High-Speed Internet</p>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#0A7A2F]" />
                                                    Data Benefits
                                                </h4>
                                                <ul className="space-y-3">
                                                    {[
                                                        'High-speed internet support',
                                                        'Quick and hassle-free recharge',
                                                        'Reliable service uptime',
                                                        'Secure payment gateway'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0A7A2F] mt-1.5 flex-shrink-0" />
                                                            <span className="text-gray-600 text-xs font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === 'device' && (
                                    <motion.div
                                        key="device"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start"
                                    >
                                        <div className="lg:col-span-7 flex flex-col gap-4">
                                            <h3 className="text-2xl font-bold text-gray-900 mb-2">Device Recharge</h3>

                                            <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                                                        <Zap className="w-5 h-5 text-[#F7931E]" />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-bold text-gray-900">Device Top-Up</h4>
                                                        <p className="text-xs text-gray-500">Enter Device ID or Serial Number</p>
                                                    </div>
                                                </div>

                                                <form onSubmit={(e) => handleRecharge(e, 'device')} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                                                    <div className="space-y-5">
                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <Zap className="w-4 h-4 text-[#F7931E]" />
                                                                Device ID / Serial Number
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={deviceNumber}
                                                                onChange={(e) => setDeviceNumber(e.target.value)}
                                                                placeholder="Enter Device ID"
                                                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#F7931E] outline-none transition-all"
                                                                required
                                                            />
                                                        </div>

                                                        <div>
                                                            <label className="text-sm font-semibold text-gray-800 flex items-center gap-2 mb-2">
                                                                <CircleUser className="w-4 h-4 text-[#F7931E]" />
                                                                Device Type / Operator
                                                            </label>
                                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                                {deviceOperators.map((op) => (
                                                                    <button
                                                                        key={op.id}
                                                                        type="button"
                                                                        onClick={() => setDeviceOperator(op.id)}
                                                                        className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${deviceOperator === op.id
                                                                            ? 'border-[#F7931E] bg-[#F7931E]/5'
                                                                            : 'border-gray-100 bg-gray-50 hover:bg-white'
                                                                            }`}
                                                                    >
                                                                        <span className="text-2xl mb-1">{op.logo}</span>
                                                                        <span className={`text-[11px] font-bold ${deviceOperator === op.id ? 'text-[#F7931E]' : 'text-gray-700'
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
                                                                value={deviceAmount}
                                                                onChange={(e) => setDeviceAmount(e.target.value)}
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

                                        <div className="lg:col-span-5 flex flex-col gap-6">
                                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 flex items-center justify-center">
                                                <div className="text-center">
                                                    <Zap className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                                    <h4 className="text-lg font-bold text-gray-700 mb-1">Device Recharge</h4>
                                                    <p className="text-gray-500 text-xs font-medium">Smart & Secure Device Recharges</p>
                                                </div>
                                            </div>

                                            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                                                <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                                                    <CheckCircle2 className="w-4 h-4 text-[#0A7A2F]" />
                                                    Smart Features
                                                </h4>
                                                <ul className="space-y-3">
                                                    {[
                                                        'IoT & Smart Device support',
                                                        'Medical Equipment Support',
                                                        'Instant activation & processing',
                                                        'Secure payment confirmation'
                                                    ].map((feature, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-[#0A7A2F] mt-1.5 flex-shrink-0" />
                                                            <span className="text-gray-600 text-xs font-medium">{feature}</span>
                                                        </li>
                                                    ))}
                                                </ul>
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

            {/* Payment Method Modal */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handleSelectPayment}
                amount={pendingRecharge?.amount}
                walletBalance={walletBalance}
                isProcessing={isProcessingPayment}
            />

            {/* Browse Plans Modal */}
            <BrowsePlansModal
                isOpen={showPlansModal}
                onClose={() => setShowPlansModal(false)}
                onSelect={(amount) => setMobileAmount(amount)}
                operator={mobileOperator ? mobileOperators.find(op => op.id === mobileOperator)?.name : ''}
                plans={mobileOperator ? rechargePlans[mobileOperator] : []}
            />
        </div>
    );
};

export default Recharge;
