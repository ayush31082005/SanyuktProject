import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Wallet, Plus, CheckCircle, AlertCircle,
    Loader2, Zap, Shield, RefreshCw, IndianRupee,
    CreditCard, Smartphone, Clock, Award, TrendingUp,
    Gift, Lock, Users, Sparkles
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

// Custom Crown icon since it's not in lucide-react
const Crown = ({ className }) => (
    <svg
        className={className}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M2 4l3 12h14l3-12-6 4-4-4-4 4-6-4z" />
    </svg>
);

// ── Load Razorpay script ─────────────────────────────────────────────────
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// ── Quick amount options with labels ──────────────────────────────────────
const QUICK_AMOUNTS = [
    { value: 599, label: 'Silver', icon: Award, color: '#94A3B8' },
    { value: 1299, label: 'Gold', icon: Award, color: '#F7931E' },
    { value: 2699, label: 'Diamond', icon: Award, color: '#0A7A2F' },
    { value: 500, label: 'Quick', icon: Zap, color: '#64748B' },
    { value: 1000, label: 'Value', icon: TrendingUp, color: '#64748B' },
    { value: 2000, label: 'Premium', icon: Sparkles, color: '#64748B' },
    { value: 5000, label: 'Elite', icon: Crown, color: '#64748B' },
];

// ── Styled Components ────────────────────────────────────────────────────
const GradientCard = ({ children, className = '' }) => (
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-gray-50 border border-gray-100 shadow-lg ${className}`}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        {children}
    </div>
);

// ─────────────────────────────────────────────────────────────────────────
const WalletTopup = () => {
    const navigate = useNavigate();
    const [walletBalance, setWalletBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [lastTopup, setLastTopup] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');
    const [recentTransactions, setRecentTransactions] = useState([]);

    // ── Fetch wallet balance ──────────────────────────────────────────────
    const fetchBalance = async () => {
        try {
            setLoadingBalance(true);
            const res = await api.get('/wallet/topup/balance');
            if (res.data.success) setWalletBalance(res.data.walletBalance || 0);

            // Also fetch recent transactions
            const txRes = await api.get('/wallet/recent-transactions?limit=3');
            if (txRes.data.success) setRecentTransactions(txRes.data.transactions || []);
        } catch (err) {
            console.error('Balance fetch error:', err);
        } finally {
            setLoadingBalance(false);
        }
    };

    useEffect(() => { fetchBalance(); }, []);

    // ── Handle amount input ───────────────────────────────────────────────
    const handleAmountChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setAmount(val);
    };

    const parsedAmount = parseInt(amount, 10);
    const isValid = !isNaN(parsedAmount) && parsedAmount >= 100 && parsedAmount <= 50000;

    // ── Payment methods ───────────────────────────────────────────────────
    const paymentMethods = [
        { id: 'all', label: 'All', icon: CreditCard },
        { id: 'upi', label: 'UPI', icon: Smartphone },
        { id: 'card', label: 'Card', icon: CreditCard },
        { id: 'netbanking', label: 'NetBanking', icon: Lock },
    ];

    // ── Razorpay payment flow ─────────────────────────────────────────────
    const handleTopup = async () => {
        if (!isValid) return;
        setProcessing(true);

        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error('Unable to load payment gateway. Please check your internet connection.');
                setProcessing(false);
                return;
            }

            const { data: orderData } = await api.post('/wallet/topup/create-order', {
                amount: parsedAmount,
            });

            if (!orderData.success) {
                toast.error(orderData.message || 'Failed to create order.');
                setProcessing(false);
                return;
            }

            // Mock mode check
            if (orderData.order.id.startsWith('order_mock_')) {
                const { data: verifyData } = await api.post('/wallet/topup/verify', {
                    razorpay_order_id: orderData.order.id,
                    razorpay_payment_id: `pay_mock_${Date.now()}`,
                    razorpay_signature: 'mock_signature',
                    amount: parsedAmount,
                });

                if (verifyData.success) {
                    setWalletBalance(verifyData.walletBalance);
                    setLastTopup(parsedAmount);
                    setAmount('');
                    toast.success(
                        <div>
                            <div className="font-bold">₹{parsedAmount.toLocaleString('en-IN')} added successfully!</div>
                            <div className="text-xs opacity-90">(Test Mode)</div>
                        </div>
                    );
                }
                setProcessing(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Sanyukt Parivar',
                description: `Wallet Top-Up - ₹${parsedAmount}`,
                order_id: orderData.order.id,
                prefill: {
                    name: orderData.user.name,
                    email: orderData.user.email,
                    contact: orderData.user.mobile,
                },
                theme: { color: '#0A7A2F' },

                handler: async (response) => {
                    try {
                        const { data: verifyData } = await api.post('/wallet/topup/verify', {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            amount: parsedAmount,
                        });

                        if (verifyData.success) {
                            setWalletBalance(verifyData.walletBalance);
                            setLastTopup(parsedAmount);
                            setAmount('');
                            toast.success(
                                <div>
                                    <div className="font-bold">₹{parsedAmount.toLocaleString('en-IN')} added successfully!</div>
                                    <div className="text-xs opacity-90">Your wallet has been credited</div>
                                </div>
                            );

                            // Refresh recent transactions
                            fetchBalance();
                        } else {
                            toast.error(verifyData.message || 'Payment verification failed.');
                        }
                    } catch (err) {
                        toast.error('Verification failed. Please contact support.');
                    } finally {
                        setProcessing(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        toast('Payment cancelled', { icon: 'ℹ️' });
                        setProcessing(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Topup error:', err);
            toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
            setProcessing(false);
        }
    };

    // ── Format date ───────────────────────────────────────────────────────
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    };

    // ─────────────────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div className="max-w-3xl mx-auto px-4 py-6 md:py-8">

                {/* ── Header with Breadcrumb ── */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6"
                >
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <button
                            onClick={() => navigate('/my-account')}
                            className="hover:text-[#0A7A2F] transition-colors"
                        >
                            My Account
                        </button>
                        <span>›</span>
                        <span className="text-[#0A7A2F] font-medium">Wallet Top-Up</span>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate(-1)}
                                className="p-2 hover:bg-white rounded-xl transition-all group"
                                aria-label="Go back"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#0A7A2F] group-hover:-translate-x-1 transition-all" />
                            </button>
                            <div>
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Wallet Top-Up
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">
                                    Add funds securely to your wallet
                                </p>
                            </div>
                        </div>

                        {/* Balance Refresh */}
                        <button
                            onClick={fetchBalance}
                            className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 hover:border-[#0A7A2F] transition-all group"
                        >
                            <RefreshCw className="w-4 h-4 text-gray-500 group-hover:text-[#0A7A2F] group-hover:rotate-180 transition-all duration-500" />
                            <span className="text-sm text-gray-600 group-hover:text-[#0A7A2F]">Refresh</span>
                        </button>
                    </div>
                </motion.div>

                {/* ── Success Banner ── */}
                <AnimatePresence>
                    {lastTopup && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="mb-6 bg-gradient-to-r from-[#0A7A2F] to-[#0e8a37] rounded-2xl p-5 text-white shadow-xl shadow-green-200/50"
                        >
                            <div className="flex items-start gap-4">
                                <div className="p-3 bg-white/20 rounded-xl">
                                    <CheckCircle className="w-6 h-6" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-lg mb-1">
                                        ₹{lastTopup.toLocaleString('en-IN')} Added Successfully!
                                    </h3>
                                    <p className="text-white/90 text-sm mb-3">
                                        Your wallet has been credited. You can now activate packages or make purchases.
                                    </p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate('/packages')}
                                            className="px-4 py-2 bg-white text-[#0A7A2F] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all"
                                        >
                                            View Packages
                                        </button>
                                        <button
                                            onClick={() => setLastTopup(null)}
                                            className="px-4 py-2 bg-white/20 text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-all"
                                        >
                                            Dismiss
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Main Grid ── */}
                <div className="grid md:grid-cols-5 gap-6">

                    {/* Left Column - Main Form (3 cols) */}
                    <div className="md:col-span-3 space-y-6">

                        {/* ── Current Balance Card ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-[#0A7A2F] to-[#0e8a37] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                        >
                            {/* Decorative Elements */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />

                            <div className="relative">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="p-3 bg-white/20 rounded-xl">
                                            <Wallet className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-white/70 text-sm font-medium">Current Balance</p>
                                            {loadingBalance ? (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    <span className="text-sm">Loading...</span>
                                                </div>
                                            ) : (
                                                <p className="text-3xl font-bold">₹{walletBalance.toLocaleString('en-IN')}</p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Quick Stats */}
                                    <div className="text-right">
                                        <p className="text-white/70 text-xs">Lifetime</p>
                                        <p className="text-lg font-semibold">₹{(walletBalance + 2500).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                {/* Package Quick Info */}
                                <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20">
                                    {[
                                        { name: 'Silver', amount: 599, color: 'from-gray-400 to-gray-500' },
                                        { name: 'Gold', amount: 1299, color: 'from-[#F7931E] to-amber-600' },
                                        { name: 'Diamond', amount: 2699, color: 'from-[#0A7A2F] to-emerald-600' },
                                    ].map((pkg) => (
                                        <div key={pkg.name} className="text-center">
                                            <div className={`text-xs font-medium bg-gradient-to-r ${pkg.color} px-2 py-1 rounded-lg mb-1`}>
                                                {pkg.name}
                                            </div>
                                            <div className="text-sm font-bold">₹{pkg.amount}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* ── Top-Up Form ── */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                        >
                            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Money to Wallet</h2>

                            {/* Amount Input */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-600 mb-2">
                                    Enter Amount (₹)
                                </label>
                                <div className={`flex items-center border-2 rounded-xl transition-all ${amount && !isValid
                                    ? 'border-red-300 bg-red-50'
                                    : amount && isValid
                                        ? 'border-[#0A7A2F] bg-green-50'
                                        : 'border-gray-200 hover:border-[#0A7A2F]'
                                    }`}>
                                    <span className="pl-4 text-gray-500">₹</span>
                                    <input
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="100"
                                        value={amount}
                                        onChange={handleAmountChange}
                                        className="w-full p-4 bg-transparent outline-none text-xl font-semibold"
                                    />
                                    {amount && (
                                        <button
                                            onClick={() => setAmount('')}
                                            className="pr-4 text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Validation Messages */}
                                {amount && !isNaN(parsedAmount) && parsedAmount < 100 && (
                                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Minimum amount is ₹100
                                    </p>
                                )}
                                {amount && !isNaN(parsedAmount) && parsedAmount > 50000 && (
                                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                                        <AlertCircle className="w-3 h-3" /> Maximum amount is ₹50,000
                                    </p>
                                )}
                            </div>

                            {/* Quick Amount Options */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-600 mb-3">Quick Select</p>
                                <div className="grid grid-cols-4 gap-2">
                                    {QUICK_AMOUNTS.map(({ value, label, icon: Icon, color }) => (
                                        <button
                                            key={value}
                                            onClick={() => setAmount(String(value))}
                                            className={`relative p-3 rounded-xl border-2 transition-all group ${parsedAmount === value
                                                ? 'border-[#0A7A2F] bg-green-50'
                                                : 'border-gray-200 hover:border-[#F7931E] hover:bg-orange-50'
                                                }`}
                                        >
                                            <div className="flex flex-col items-center">
                                                <Icon
                                                    className={`w-4 h-4 mb-1 ${parsedAmount === value
                                                        ? 'text-[#0A7A2F]'
                                                        : 'text-gray-400 group-hover:text-[#F7931E]'
                                                        }`}
                                                    style={parsedAmount === value ? {} : { color }}
                                                />
                                                <span className="text-xs font-medium text-gray-600">
                                                    {label}
                                                </span>
                                                <span className="text-sm font-bold text-gray-800">
                                                    ₹{value}
                                                </span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Methods */}
                            <div className="mb-6">
                                <p className="text-sm font-medium text-gray-600 mb-3">Payment Method</p>
                                <div className="flex flex-wrap gap-2">
                                    {paymentMethods.map(({ id, label, icon: Icon }) => (
                                        <button
                                            key={id}
                                            onClick={() => setSelectedPaymentMethod(id)}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${selectedPaymentMethod === id
                                                ? 'border-[#0A7A2F] bg-green-50 text-[#0A7A2F]'
                                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                                                }`}
                                        >
                                            <Icon className="w-4 h-4" />
                                            <span className="text-sm font-medium">{label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* New Balance Preview */}
                            {isValid && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-gradient-to-r from-[#0A7A2F]/10 to-[#F7931E]/10 rounded-xl p-4 mb-6 border border-[#0A7A2F]/20"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600">Balance after top-up:</span>
                                        <span className="text-2xl font-bold text-[#0A7A2F]">
                                            ₹{(walletBalance + parsedAmount).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                </motion.div>
                            )}

                            {/* Pay Button */}
                            <button
                                onClick={handleTopup}
                                disabled={!isValid || processing}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${isValid && !processing
                                    ? 'bg-gradient-to-r from-[#0A7A2F] to-[#0e8a37] text-white hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02] active:scale-[0.98]'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    }`}
                            >
                                {processing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Processing Payment...
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        Add ₹{isValid ? parsedAmount.toLocaleString('en-IN') : 'Money'} to Wallet
                                    </>
                                )}
                            </button>

                            {/* Secure Payment Note */}
                            <p className="text-xs text-gray-500 text-center mt-4 flex items-center justify-center gap-1">
                                <Lock className="w-3 h-3" />
                                Secure payment powered by Razorpay
                            </p>
                        </motion.div>
                    </div>

                    {/* Right Column - Info & History (2 cols) */}
                    <div className="md:col-span-2 space-y-6">

                        {/* Recent Transactions */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.15 }}
                            className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                                <button
                                    onClick={() => navigate('/my-account/transactions')}
                                    className="text-sm text-[#0A7A2F] hover:text-[#F7931E] font-medium"
                                >
                                    View All
                                </button>
                            </div>

                            {recentTransactions.length > 0 ? (
                                <div className="space-y-3">
                                    {recentTransactions.map((tx, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-green-100' : 'bg-orange-100'
                                                    }`}>
                                                    {tx.type === 'credit' ? (
                                                        <TrendingUp className={`w-4 h-4 ${tx.type === 'credit' ? 'text-[#0A7A2F]' : 'text-[#F7931E]'
                                                            }`} />
                                                    ) : (
                                                        <TrendingUp className="w-4 h-4 text-[#F7931E] rotate-180" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                                    <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                                                </div>
                                            </div>
                                            <span className={`font-bold ${tx.type === 'credit' ? 'text-[#0A7A2F]' : 'text-[#F7931E]'
                                                }`}>
                                                {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-6">
                                    <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                    <p className="text-gray-500 text-sm">No recent transactions</p>
                                    <p className="text-xs text-gray-400 mt-1">Your transactions will appear here</p>
                                </div>
                            )}
                        </motion.div>

                        {/* Benefits Cards */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            className="space-y-3"
                        >
                            {[
                                {
                                    icon: Shield,
                                    title: 'Secure Payments',
                                    desc: '256-bit SSL encrypted transactions',
                                    color: '#0A7A2F'
                                },
                                {
                                    icon: Zap,
                                    title: 'Instant Credit',
                                    desc: 'Money added to wallet instantly',
                                    color: '#F7931E'
                                },
                                {
                                    icon: Gift,
                                    title: 'Welcome Bonus',
                                    desc: 'Get ₹50 bonus on first top-up',
                                    color: '#0A7A2F'
                                },
                                {
                                    icon: Users,
                                    title: 'Refer & Earn',
                                    desc: 'Earn ₹100 for each referral',
                                    color: '#F7931E'
                                },
                            ].map((item, idx) => (
                                <div
                                    key={idx}
                                    className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200 hover:border-[#0A7A2F]/30 transition-all group"
                                >
                                    <div
                                        className="p-3 rounded-xl"
                                        style={{ backgroundColor: `${item.color}15` }}
                                    >
                                        <item.icon
                                            className="w-5 h-5"
                                            style={{ color: item.color }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 group-hover:text-[#0A7A2F] transition-colors">
                                            {item.title}
                                        </h4>
                                        <p className="text-xs text-gray-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </motion.div>

                        {/* Support Card */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.25 }}
                            className="bg-gradient-to-r from-[#0A7A2F]/5 to-[#F7931E]/5 rounded-2xl p-6 border border-[#0A7A2F]/10"
                        >
                            <h3 className="font-bold text-gray-800 mb-2">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Having issues with payment? Our support team is here to help.
                            </p>
                            <button
                                onClick={() => navigate('/contact')}
                                className="w-full py-3 bg-white border-2 border-[#0A7A2F] text-[#0A7A2F] rounded-xl font-semibold hover:bg-[#0A7A2F] hover:text-white transition-all"
                            >
                                Contact Support
                            </button>
                        </motion.div>
                    </div>
                </div>

                {/* Trust Badges Footer */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 grid grid-cols-3 md:grid-cols-5 gap-4"
                >
                    {[
                        { icon: Shield, label: 'PCI DSS Compliant' },
                        { icon: Lock, label: '256-bit SSL' },
                        { icon: CheckCircle, label: 'RBI Guidelines' },
                        { icon: Award, label: '100% Secure' },
                        { icon: Clock, label: '24/7 Support' },
                    ].map((item, idx) => (
                        <div key={idx} className="text-center">
                            <item.icon className="w-5 h-5 text-[#0A7A2F] mx-auto mb-2" />
                            <p className="text-xs text-gray-500">{item.label}</p>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Add global styles for grid pattern */}
            <style jsx>{`
                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
                        linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px);
                    background-size: 20px 20px;
                }
            `}</style>
        </div>
    );
};

export default WalletTopup;