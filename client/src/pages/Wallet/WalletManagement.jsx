import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Wallet, Banknote, Smartphone, ChevronRight,
    AlertCircle, CheckCircle, Loader2, Info, X, IndianRupee,
    Shield, Clock, Receipt, TrendingDown, Building2,
    CreditCard, HelpCircle, FileText, Lock, Download,
    Calendar, Copy, ExternalLink, Plus, Zap, Award,
    Sparkles, RefreshCw, Users, Gift, TrendingUp
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

// Custom Crown icon
const CrownIcon = ({ className }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 4l3 12h14l3-12-6 4-4-4-4 4-6-4z" />
    </svg>
);

// ── Constants ─────────────────────────────────────────────────────────────
const TDS_RATE = 0.05;
const PROCESSING_RATE = 0.02;
const QUICK_TOPUP_AMOUNTS = [
    { value: 599, label: 'Silver', icon: Award, color: '#C8A96A' },
    { value: 1299, label: 'Gold', icon: Award, color: '#C8A96A' },
    { value: 2699, label: 'Diamond', icon: Award, color: '#C8A96A' },
    { value: 500, label: 'Quick', icon: Zap, color: '#C8A96A' },
    { value: 1000, label: 'Value', icon: TrendingUp, color: '#C8A96A' },
    { value: 2000, label: 'Premium', icon: Sparkles, color: '#C8A96A' },
    { value: 5000, label: 'Elite', icon: CrownIcon, color: '#C8A96A' },
];

// ── Tooltip Component ─────────────────────────────────────────────────────
const Tooltip = ({ text, children }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative inline-block"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}>
            {children}
            <AnimatePresence>
                {show && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-[#1A1A1A] border border-[#C8A96A]/20 text-[#F5E6C8] text-xs rounded-lg whitespace-nowrap z-50 shadow-2xl"
                    >
                        {text}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-[#1A1A1A]"></div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

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

// ── Withdrawal Calculation ───────────────────────────────────────────────
const calcWithdrawal = (amount) => {
    const tds = Math.round(amount * TDS_RATE);
    const fee = Math.round(amount * PROCESSING_RATE);
    const net = amount - tds - fee;
    return { tds, fee, net };
};

// ── Confirm Withdrawal Modal ─────────────────────────────────────────────
const ConfirmWithdrawalModal = ({ data, onConfirm, onCancel, loading }) => {
    const { amount, method, tds, fee, net, bankName, accountNumber, ifscCode, upiId } = data;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onCancel} />
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="relative luxury-box w-full max-w-md overflow-hidden bg-[#0D0D0D] shadow-2xl"
            >
                <div className="px-6 py-5 bg-[#1A1A1A] border-b border-[#C8A96A]/20 text-[#C8A96A]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-[#C8A96A]/10 rounded-xl">
                                <Receipt className="w-5 h-5 text-[#C8A96A]" />
                            </div>
                            <h2 className="text-lg font-serif font-bold uppercase tracking-widest">Confirm Withdrawal</h2>
                        </div>
                        <button onClick={onCancel} className="p-1.5 hover:bg-[#C8A96A]/10 rounded-lg transition text-[#C8A96A]/60">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6 bg-[#0D0D0D]">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-[#1A1A1A] rounded-xl border border-[#C8A96A]/10">
                        <div className={`p-2.5 rounded-xl bg-[#C8A96A]/5 border border-[#C8A96A]/20`}>
                            {method === 'Bank Transfer'
                                ? <Building2 className="w-5 h-5 text-[#C8A96A]" />
                                : <Smartphone className="w-5 h-5 text-[#C8A96A]" />
                            }
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest leading-none mb-1">Method</p>
                            <p className="font-bold text-[#F5E6C8]">{method}</p>
                        </div>
                        {method === 'Bank Transfer' && (
                            <div className="text-right">
                                <p className="text-[10px] text-[#C8A96A]/40 font-black uppercase tracking-widest mb-1">{bankName}</p>
                                <p className="text-sm font-mono font-bold text-[#C8A96A]">
                                    ****{accountNumber?.slice(-4)}
                                </p>
                            </div>
                        )}
                        {method === 'UPI' && (
                            <div className="text-right">
                                <p className="text-[10px] text-[#C8A96A]/40 font-black uppercase tracking-widest mb-1">UPI ID</p>
                                <p className="text-sm font-mono font-bold text-[#C8A96A]">{upiId}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-[#1A1A1A] rounded-xl p-5 mb-5 border border-[#C8A96A]/10">
                        <h3 className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em] mb-4">Amount Breakdown</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-[#F5E6C8]/60 font-medium">Withdrawal Amount</span>
                                <span className="font-bold text-[#F5E6C8]">₹{amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-[#C8A96A]/60">TDS (5%)</span>
                                </div>
                                <span className="font-bold text-[#C8A96A]">- ₹{tds.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-[#C8A96A]/60">Processing Fee (2%)</span>
                                </div>
                                <span className="font-bold text-[#C8A96A]">- ₹{fee.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="border-t border-[#C8A96A]/10 pt-3 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-[#C8A96A]/40 uppercase tracking-widest">Net Payable</span>
                                    <span className="text-2xl font-serif font-bold text-[#C8A96A]">₹{net.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#C8A96A]/5 border border-[#C8A96A]/20 rounded-xl p-4 mb-5">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-[#C8A96A] shrink-0" />
                            <div>
                                <p className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest mb-1">Important Information</p>
                                <ul className="text-[9px] text-[#F5E6C8]/60 space-y-1 font-medium italic">
                                    <li className="flex items-start gap-1.5">• Amount will be deducted from wallet immediately</li>
                                    <li className="flex items-start gap-1.5">• Processing takes 24-48 hours after admin approval</li>
                                    <li className="flex items-start gap-1.5">• You'll receive SMS/email confirmation</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onCancel} disabled={loading}
                            className="flex-1 py-3.5 rounded-xl border border-[#C8A96A]/20 text-[#C8A96A]/60 font-bold text-[10px] uppercase tracking-widest hover:bg-[#C8A96A]/5 transition disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-[10px] uppercase tracking-[0.2em] hover:shadow-lg hover:shadow-[#C8A96A]/20 transition flex items-center justify-center gap-2 disabled:opacity-60">
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="w-4 h-4" />
                                    Confirm Withdrawal
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────
const WalletManagement = ({ defaultTab = 'topup' }) => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(defaultTab); // 'topup' or 'withdraw'

    useEffect(() => {
        setActiveTab(defaultTab);
    }, [defaultTab]);

    // Common State
    const [walletBalance, setWalletBalance] = useState(0);
    const [totalDeposits, setTotalDeposits] = useState(0);
    const [totalWithdrawals, setTotalWithdrawals] = useState(0);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [recentTransactions, setRecentTransactions] = useState([]);
    const [loadingTransactions, setLoadingTransactions] = useState(false);

    // Topup State
    const [topupAmount, setTopupAmount] = useState('');
    const [processingTopup, setProcessingTopup] = useState(false);
    const [lastTopup, setLastTopup] = useState(null);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('all');

    // Withdrawal State
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [withdrawMethod, setWithdrawMethod] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccount, setConfirmAccount] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [upiId, setUpiId] = useState('');
    const [showWithdrawConfirm, setShowWithdrawConfirm] = useState(false);
    const [processingWithdraw, setProcessingWithdraw] = useState(false);
    const [lastWithdrawal, setLastWithdrawal] = useState(null);
    const [withdrawalHistory, setWithdrawalHistory] = useState([]);
    const [loadingWithdrawals, setLoadingWithdrawals] = useState(false);

    // Payment methods for topup
    const paymentMethods = [
        { id: 'all', label: 'All', icon: CreditCard },
        { id: 'upi', label: 'UPI', icon: Smartphone },
        { id: 'card', label: 'Card', icon: CreditCard },
        { id: 'netbanking', label: 'NetBanking', icon: Lock },
    ];

    // ── Data Fetching ─────────────────────────────────────────────────────
    const fetchWalletData = async () => {
        try {
            setLoadingBalance(true);
            setLoadingTransactions(true);
            setLoadingWithdrawals(true);

            const balanceRes = await api.get('/wallet/topup/balance');
            if (balanceRes.data.success) {
                setWalletBalance(balanceRes.data.walletBalance || 0);
                setTotalDeposits(balanceRes.data.totalDeposits || 0);
                setTotalWithdrawals(balanceRes.data.totalWithdrawals || 0);
            }

            // Fetch recent transactions
            try {
                const txRes = await api.get('/wallet/recent-transactions?limit=5');
                if (txRes.data.success) setRecentTransactions(txRes.data.transactions || []);
            } catch (txErr) {
                console.warn('Transactions 404/Error:', txErr);
                setRecentTransactions([]);
            }

            // Fetch withdrawal history
            try {
                const withdrawRes = await api.get('/wallet/withdrawal-history?limit=3');
                if (withdrawRes.data.success) setWithdrawalHistory(withdrawRes.data.withdrawals || []);
            } catch (wErr) {
                console.warn('Withdrawals 404/Error:', wErr);
                setWithdrawalHistory([]);
            }

        } catch (err) {
            console.error('Error fetching wallet data:', err);
        } finally {
            setLoadingBalance(false);
            setLoadingTransactions(false);
            setLoadingWithdrawals(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    // ── Topup Logic ───────────────────────────────────────────────────────
    const parsedTopupAmount = parseInt(topupAmount, 10);
    const isTopupValid = !isNaN(parsedTopupAmount) && parsedTopupAmount >= 100 && parsedTopupAmount <= 50000;

    const handleTopup = async () => {
        if (!isTopupValid) return;
        setProcessingTopup(true);

        try {
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error('Unable to load payment gateway. Please check your internet connection.');
                setProcessingTopup(false);
                return;
            }

            const { data: orderData } = await api.post('/wallet/topup/create-order', {
                amount: parsedTopupAmount,
            });

            if (!orderData.success) {
                toast.error(orderData.message || 'Failed to create order.');
                setProcessingTopup(false);
                return;
            }

            // Mock mode check
            if (orderData.order.id.startsWith('order_mock_')) {
                const { data: verifyData } = await api.post('/wallet/topup/verify', {
                    razorpay_order_id: orderData.order.id,
                    razorpay_payment_id: `pay_mock_${Date.now()}`,
                    razorpay_signature: 'mock_signature',
                    amount: parsedTopupAmount,
                });

                if (verifyData.success) {
                    setWalletBalance(verifyData.walletBalance);
                    setLastTopup({
                        amount: parsedTopupAmount,
                        refNo: `TXN${Date.now()}`,
                        date: new Date().toISOString()
                    });
                    setTopupAmount('');
                    toast.success(
                        <div>
                            <div className="font-bold">₹{parsedTopupAmount.toLocaleString('en-IN')} added successfully!</div>
                            <div className="text-xs opacity-90">(Test Mode)</div>
                        </div>
                    );
                    fetchWalletData();
                }
                setProcessingTopup(false);
                return;
            }

            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Sanyukt Parivar',
                description: `Wallet Top-Up - ₹${parsedTopupAmount}`,
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
                            amount: parsedTopupAmount,
                        });

                        if (verifyData.success) {
                            setWalletBalance(verifyData.walletBalance);
                            setLastTopup({
                                amount: parsedTopupAmount,
                                refNo: response.razorpay_payment_id,
                                date: new Date().toISOString()
                            });
                            setTopupAmount('');
                            toast.success(
                                <div>
                                    <div className="font-bold">₹{parsedTopupAmount.toLocaleString('en-IN')} added successfully!</div>
                                    <div className="text-xs opacity-90">Your wallet has been credited</div>
                                </div>
                            );
                            fetchWalletData();
                        } else {
                            toast.error(verifyData.message || 'Payment verification failed.');
                        }
                    } catch (err) {
                        toast.error('Verification failed. Please contact support.');
                    } finally {
                        setProcessingTopup(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        toast('Payment cancelled', { icon: 'ℹ️' });
                        setProcessingTopup(false);
                    },
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Topup error:', err);
            toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
            setProcessingTopup(false);
        }
    };

    // ── Withdrawal Logic ──────────────────────────────────────────────────
    const parsedWithdrawAmount = parseInt(withdrawAmount, 10);
    const isWithdrawValid = !isNaN(parsedWithdrawAmount) && parsedWithdrawAmount >= 500 && parsedWithdrawAmount <= walletBalance;
    const { tds, fee, net } = isWithdrawValid ? calcWithdrawal(parsedWithdrawAmount) : { tds: 0, fee: 0, net: 0 };

    const isBankValid = withdrawMethod === 'Bank Transfer' &&
        bankName.trim().length >= 3 &&
        accountNumber.trim().length >= 9 &&
        accountNumber === confirmAccount &&
        ifscCode.trim().length >= 11;

    const isUpiValid = withdrawMethod === 'UPI' &&
        /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim());

    const canWithdraw = isWithdrawValid && (isBankValid || isUpiValid);

    const handleWithdraw = async () => {
        setProcessingWithdraw(true);
        try {
            const payload = {
                amount: parsedWithdrawAmount,
                method: withdrawMethod,
                ...(withdrawMethod === 'Bank Transfer' ? { bankName, accountNumber, ifscCode } : {}),
                ...(withdrawMethod === 'UPI' ? { upiId } : {}),
            };
            const res = await api.post('/wallet/withdraw', payload);
            if (res.data.success) {
                setLastWithdrawal({
                    refNo: res.data.withdrawal?.referenceNo || `WID${Date.now()}`,
                    amount: parsedWithdrawAmount,
                    net: res.data.withdrawal?.amount || net,
                    tds: res.data.deductions?.tds || tds,
                    fee: res.data.deductions?.processingFee || fee,
                    date: new Date().toISOString(),
                });
                setWalletBalance(prev => prev - parsedWithdrawAmount);
                setShowWithdrawConfirm(false);
                toast.success(
                    <div>
                        <div className="font-bold">Withdrawal Request Submitted!</div>
                        <div className="text-xs opacity-90">Reference: {res.data.withdrawal?.referenceNo}</div>
                    </div>
                );
                // Reset form
                setWithdrawAmount('');
                setWithdrawMethod('');
                setBankName('');
                setAccountNumber('');
                setConfirmAccount('');
                setIfscCode('');
                setUpiId('');

                fetchWalletData();
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Something went wrong. Please try again.');
        } finally {
            setProcessingWithdraw(false);
        }
    };

    // ── Helper Functions ──────────────────────────────────────────────────
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'approved': return 'bg-green-100/10 text-green-500 border-green-500/20';
            case 'pending': return 'bg-orange-100/10 text-orange-500 border-orange-500/20';
            case 'rejected': return 'bg-red-100/10 text-red-500 border-red-500/20';
            case 'processing': return 'bg-blue-100/10 text-blue-500 border-blue-500/20';
            case 'success': return 'bg-green-100/10 text-green-500 border-green-500/20';
            default: return 'bg-gray-100/10 text-gray-500 border-gray-500/20';
        }
    };

    // ── Render Functions ──────────────────────────────────────────────────
    const renderTopupTab = () => (
        <div className="space-y-6">
            {/* Quick Topup Amounts */}
            <div className="grid grid-cols-4 gap-3">
                {QUICK_TOPUP_AMOUNTS.map(({ value, label, icon: Icon, color }) => (
                    <button
                        key={value}
                        onClick={() => setTopupAmount(String(value))}
                        className={`relative p-3 luxury-box transition-all group ${parsedTopupAmount === value
                            ? 'border-[#C8A96A] bg-[#C8A96A]/10 shadow-[0_0_15px_rgba(200,169,106,0.1)]'
                            : 'hover:border-[#C8A96A]/40 hover:bg-[#C8A96A]/5'
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            <Icon className={`w-3.5 h-3.5 mb-1.5 ${parsedTopupAmount === value ? 'text-[#C8A96A]' : 'text-[#C8A96A]/40 group-hover:text-[#C8A96A]'
                                }`} />
                            <span className="text-[8px] font-black text-[#C8A96A]/30 uppercase tracking-[0.2em] group-hover:text-[#C8A96A]/60">{label}</span>
                            <span className="text-sm font-bold text-[#F5E6C8]">₹{value}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em] mb-3 ml-1 text-center">Enter Capital Amount</label>
                <div className={`flex items-center luxury-box bg-[#0D0D0D] transition-all ${topupAmount && !isTopupValid
                    ? 'border-red-900/50 bg-red-950/20'
                    : 'border-[#C8A96A]/20 hover:border-[#C8A96A]/60'
                    }`}>
                    <span className={`pl-6 font-serif font-bold text-2xl ${topupAmount ? 'text-[#C8A96A]' : 'text-[#C8A96A]/20'}`}>₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MIN ₹100"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-6 bg-transparent outline-none text-3xl font-serif font-bold text-[#F5E6C8] placeholder:text-[#C8A96A]/10 placeholder:font-sans placeholder:text-sm placeholder:tracking-widest"
                    />
                    {topupAmount && (
                        <button onClick={() => setTopupAmount('')} className="pr-6 text-[#C8A96A]/40 hover:text-[#C8A96A]">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {topupAmount && !isNaN(parsedTopupAmount) && parsedTopupAmount < 100 && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Minimum amount is ₹100
                    </p>
                )}
                {topupAmount && !isNaN(parsedTopupAmount) && parsedTopupAmount > 50000 && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Maximum amount is ₹50,000
                    </p>
                )}
            </div>

            {/* Payment Methods */}
            <div>
                <p className="text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em] mb-4 ml-1 text-center">Proprietary Gateway</p>
                <div className="flex flex-wrap justify-center gap-3">
                    {paymentMethods.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            onClick={() => setSelectedPaymentMethod(id)}
                            className={`flex items-center gap-2 px-5 py-2.5 transition-all border ${selectedPaymentMethod === id
                                ? 'bg-[#C8A96A]/10 border-[#C8A96A] text-[#C8A96A]'
                                : 'bg-[#0D0D0D] border-[#C8A96A]/10 text-[#C8A96A]/40 hover:border-[#C8A96A]/40'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                            <span className="text-[9px] font-black uppercase tracking-widest">{label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {isTopupValid && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 border border-[#C8A96A]/20 bg-gradient-to-r from-[#C8A96A]/5 to-[#D4AF37]/5"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em]">Manifested Vault Balance</span>
                        <span className="text-2xl font-serif font-bold text-[#C8A96A]">
                            ₹{(walletBalance + parsedTopupAmount).toLocaleString('en-IN')}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Pay Button */}
            <button
                onClick={handleTopup}
                disabled={!isTopupValid || processingTopup}
                className={`w-full h-16 transition-all flex items-center justify-center gap-4 ${isTopupValid && !processingTopup
                    ? 'bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black uppercase tracking-[0.3em] text-xs hover:shadow-gold-900/40 hover:-translate-y-1'
                    : 'bg-[#1A1A1A] border border-[#C8A96A]/10 text-[#C8A96A]/10 cursor-not-allowed font-black uppercase tracking-[0.3em] text-xs'
                    }`}
            >
                {processingTopup ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Initiating Secure Transfer...
                    </>
                ) : (
                    <>
                        <Zap className="w-5 h-5" />
                        Execute ₹{isTopupValid ? parsedTopupAmount.toLocaleString('en-IN') : 'Deposit'}
                    </>
                )}
            </button>
        </div>
    );

    const renderWithdrawTab = () => (
        <div className="space-y-6">
            {/* Quick Withdraw Amounts */}
            <div className="flex flex-wrap justify-center gap-3">
                {[500, 1000, 2000, 5000].map(a => (
                    <button
                        key={a}
                        onClick={() => setWithdrawAmount(String(Math.min(a, walletBalance)))}
                        className={`px-5 py-2 transition-all border ${parsedWithdrawAmount === a
                            ? 'bg-[#C8A96A]/10 border-[#C8A96A] text-[#C8A96A]'
                            : 'bg-[#0D0D0D] border-[#C8A96A]/10 text-[#C8A96A]/40 hover:border-[#C8A96A]/40'
                            }`}
                    >
                        <span className="text-[10px] font-black tracking-widest uppercase">₹{a.toLocaleString('en-IN')}</span>
                    </button>
                ))}
                <button
                    onClick={() => setWithdrawAmount(String(walletBalance))}
                    className="px-5 py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] hover:shadow-gold-900/40 transition-all font-black text-[10px] uppercase tracking-widest"
                >
                    Liquidate All
                </button>
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em] mb-3 ml-1 text-center">Enter Liquidation Amount</label>
                <div className={`flex items-center luxury-box bg-[#0D0D0D] transition-all ${withdrawAmount && !isWithdrawValid
                    ? 'border-red-900/50 bg-red-950/20'
                    : 'border-[#C8A96A]/20 hover:border-[#C8A96A]/60'
                    }`}>
                    <span className={`pl-6 font-serif font-bold text-2xl ${withdrawAmount ? 'text-[#C8A96A]' : 'text-[#C8A96A]/20'}`}>₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MIN ₹500"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-6 bg-transparent outline-none text-3xl font-serif font-bold text-[#F5E6C8] placeholder:text-[#C8A96A]/10 placeholder:font-sans placeholder:text-sm placeholder:tracking-widest"
                    />
                    {withdrawAmount && (
                        <button onClick={() => setWithdrawAmount('')} className="pr-6 text-[#C8A96A]/40 hover:text-[#C8A96A]">
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
                {withdrawAmount && !isNaN(parsedWithdrawAmount) && parsedWithdrawAmount < 500 && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Minimum withdrawal is ₹500
                    </p>
                )}
                {withdrawAmount && !isNaN(parsedWithdrawAmount) && parsedWithdrawAmount > walletBalance && (
                    <p className="text-xs text-red-500 font-medium mt-2 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Insufficient balance
                    </p>
                )}
            </div>

            {/* Withdrawal Breakdown */}
            {isWithdrawValid && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 border border-[#C8A96A]/10 bg-[#1A1A1A]"
                >
                    <h3 className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em] mb-4 text-center">Settlement Structure</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                            <span className="text-[#F5E6C8]/60 font-medium">Liquidation Gross</span>
                            <span className="font-bold text-[#F5E6C8]">₹{parsedWithdrawAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-[#C8A96A]/60 italic">TDS Withheld (5%)</span>
                            <span className="font-bold text-[#C8A96A]">- ₹{tds.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-xs font-medium">
                            <span className="text-[#C8A96A]/60 italic">Management Fee (2%)</span>
                            <span className="font-bold text-[#C8A96A]">- ₹{fee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t border-[#C8A96A]/10 pt-4 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest">Net Settlement</span>
                                <span className="text-3xl font-serif font-bold text-[#C8A96A]">₹{net.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Withdrawal Method Selection */}
            <div>
                <p className="text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em] mb-4 ml-1 text-center">Settlement Channel</p>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { id: 'Bank Transfer', icon: Building2, label: 'Standard Bank', sub: 'NEFT/IMPS' },
                        { id: 'UPI', icon: Smartphone, label: 'Instant UPI', sub: 'Lattice Verify' },
                    ].map(({ id, icon: Icon, label, sub }) => (
                        <button
                            key={id}
                            onClick={() => setWithdrawMethod(id)}
                            className={`p-5 transition-all border relative overflow-hidden group ${withdrawMethod === id
                                ? 'bg-[#C8A96A]/5 border-[#C8A96A]'
                                : 'bg-[#0D0D0D] border-[#C8A96A]/10 hover:border-[#C8A96A]/40'
                                }`}
                        >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors ${withdrawMethod === id ? 'bg-[#C8A96A] text-[#0D0D0D]' : 'bg-[#1A1A1A] text-[#C8A96A]/40'}`}>
                                <Icon className="w-5 h-5" strokeWidth={1.5} />
                            </div>
                            <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${withdrawMethod === id ? 'text-[#C8A96A]' : 'text-[#F5E6C8]/60'}`}>
                                {label}
                            </p>
                            <p className="text-[10px] font-medium text-[#C8A96A]/30 italic">{sub}</p>
                            {withdrawMethod === id && (
                                <div className="absolute top-0 right-0 p-2">
                                    <div className="w-2 h-2 rounded-full bg-[#C8A96A] shadow-[0_0_8px_#C8A96A]" />
                                </div>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            <AnimatePresence mode="wait">
                {withdrawMethod === 'Bank Transfer' && (
                    <motion.div
                        key="bank"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-4 overflow-hidden"
                    >
                        <div>
                            <label className="block text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest mb-1.5 ml-1">Bank Institution</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="E.G. RESERVE BANK OF INDIA"
                                className="w-full p-4 bg-[#0D0D0D] border-b-2 border-[#C8A96A]/20 focus:border-[#C8A96A] outline-none transition text-[#F5E6C8] text-sm uppercase tracking-wider"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest mb-1.5 ml-1">Vault Number</label>
                                <input
                                    type="text"
                                    value={accountNumber}
                                    onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="0000 0000 0000"
                                    className="w-full p-4 bg-[#0D0D0D] border-b-2 border-[#C8A96A]/20 focus:border-[#C8A96A] outline-none transition text-[#F5E6C8] text-sm font-mono tracking-[0.2em]"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest mb-1.5 ml-1">Routing Code</label>
                                <input
                                    type="text"
                                    value={ifscCode}
                                    onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                    placeholder="IFSC0000000"
                                    className="w-full p-4 bg-[#0D0D0D] border-b-2 border-[#C8A96A]/20 focus:border-[#C8A96A] outline-none transition text-[#F5E6C8] text-sm font-mono uppercase tracking-[0.2em]"
                                />
                            </div>
                        </div>
                    </motion.div>
                )}

                {withdrawMethod === 'UPI' && (
                    <motion.div
                        key="upi"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <label className="block text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest mb-1.5 ml-1">UPI Identifier</label>
                        <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="IDENTIFIER@UPI"
                            className={`w-full p-4 bg-[#0D0D0D] border-b-2 outline-none transition font-mono text-sm tracking-wider ${upiId && !isUpiValid
                                ? 'border-red-900 text-red-400'
                                : 'border-[#C8A96A]/20 focus:border-[#C8A96A] text-[#F5E6C8]'
                                }`}
                        />
                        {upiId && !isUpiValid && (
                            <p className="text-[10px] text-red-500 mt-2 flex items-center gap-1 font-bold italic">
                                <AlertCircle className="w-3 h-3" /> Input hash mismatch. Verify UPI ID.
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Withdrawal Button */}
            <button
                onClick={() => setShowWithdrawConfirm(true)}
                disabled={!canWithdraw}
                className={`w-full h-16 transition-all flex items-center justify-center gap-4 ${canWithdraw
                    ? 'bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black uppercase tracking-[0.3em] text-xs hover:shadow-gold-900/40 hover:-translate-y-1'
                    : 'bg-[#1A1A1A] border border-[#C8A96A]/10 text-[#C8A96A]/10 cursor-not-allowed font-black uppercase tracking-[0.3em] text-xs'
                    }`}
            >
                <Receipt className="w-5 h-5" />
                Manifest Liquidation Request
            </button>
        </div>
    );

    // ── Main Render ────────────────────────────────────────────────────────
    return (
        <>
            <AnimatePresence>
                {showWithdrawConfirm && (
                    <ConfirmWithdrawalModal
                        data={{
                            amount: parsedWithdrawAmount,
                            method: withdrawMethod,
                            tds,
                            fee,
                            net,
                            bankName,
                            accountNumber,
                            ifscCode,
                            upiId
                        }}
                        onConfirm={handleWithdraw}
                        onCancel={() => setShowWithdrawConfirm(false)}
                        loading={processingWithdraw}
                    />
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-[#0D0D0D] pb-12 font-sans selection:bg-[#C8A96A]/30">
                {/* Header */}
                <div className="bg-[#0D0D0D] border-b border-[#C8A96A]/20 sticky top-0 z-30">
                    <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button onClick={() => navigate(-1)} className="p-2 hover:bg-[#C8A96A]/10 rounded-xl transition text-[#C8A96A]">
                                <ArrowLeft className="w-6 h-6" />
                            </button>
                            <h1 className="text-xl font-serif font-bold text-[#F5E6C8] tracking-widest uppercase">Vault Management</h1>
                        </div>
                        <button
                            onClick={fetchWalletData}
                            className="flex items-center gap-2 px-3 py-1.5 luxury-box border-[#C8A96A]/20 transition-all hover:bg-[#C8A96A]/5"
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-[#C8A96A] ${loadingBalance ? 'animate-spin' : ''}`} />
                            <span className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">Update</span>
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 mt-8">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                        <button onClick={() => navigate('/my-account')} className="text-[#C8A96A]/40 hover:text-[#C8A96A]">Account</button>
                        <span className="text-[#C8A96A]/20">/</span>
                        <span className="text-[#C8A96A]">Vault</span>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Left Column */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Balance Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="luxury-box p-8 relative overflow-hidden group"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Shield className="w-32 h-32 text-[#C8A96A]" strokeWidth={1} />
                                </div>
                                
                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="w-8 h-8 rounded-lg bg-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A]">
                                            <Wallet className="w-4 h-4" />
                                        </div>
                                        <span className="text-[10px] font-black text-[#C8A96A]/60 uppercase tracking-[0.3em]">Institutional Grade Liquidity</span>
                                    </div>
                                    
                                    <div className="flex items-baseline gap-4 mb-8">
                                        <span className="text-6xl font-serif font-bold text-[#F5E6C8] tracking-tighter">
                                            ₹{walletBalance.toLocaleString('en-IN')}
                                        </span>
                                        <div className="p-1 px-2 border border-[#C8A96A]/20 bg-[#C8A96A]/5 text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">
                                            Live Ledger
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4 border-t border-[#C8A96A]/10 pt-8">
                                        <div>
                                            <p className="text-[8px] font-black text-[#C8A96A]/30 uppercase tracking-[0.2em] mb-1">Total Manifested</p>
                                            <p className="text-xl font-bold text-[#F5E6C8]">₹{totalDeposits.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-[#C8A96A]/30 uppercase tracking-[0.2em] mb-1">Total Liquidated</p>
                                            <p className="text-xl font-bold text-[#F5E6C8]">₹{totalWithdrawals.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[8px] font-black text-[#C8A96A]/30 uppercase tracking-[0.2em] mb-1">Lifetime Flow</p>
                                            <p className="text-xl font-bold text-[#C8A96A]">₹{(totalDeposits + totalWithdrawals).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Navigation Tabs */}
                            <div className="luxury-box p-1.5 flex gap-2">
                                <button
                                    onClick={() => setActiveTab('topup')}
                                    className={`flex-1 py-4 px-6 font-black text-[10px] uppercase tracking-[0.3em] transition-all relative ${activeTab === 'topup' ? 'text-[#0D0D0D]' : 'text-[#C8A96A]/40 hover:text-[#C8A96A]'}`}
                                >
                                    {activeTab === 'topup' && (
                                        <motion.div layoutId="activeTabMain" className="absolute inset-0 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]" />
                                    )}
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                                        Capital Ingress
                                    </span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('withdraw')}
                                    className={`flex-1 py-4 px-6 font-black text-[10px] uppercase tracking-[0.3em] transition-all relative ${activeTab === 'withdraw' ? 'text-[#0D0D0D]' : 'text-[#C8A96A]/40 hover:text-[#C8A96A]'}`}
                                >
                                    {activeTab === 'withdraw' && (
                                        <motion.div layoutId="activeTabMain" className="absolute inset-0 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]" />
                                    )}
                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                        <TrendingDown className="w-3.5 h-3.5" strokeWidth={3} />
                                        Liquid Egress
                                    </span>
                                </button>
                            </div>

                            <motion.div 
                                layout
                                className="luxury-box p-8 min-h-[400px]"
                            >
                                {activeTab === 'topup' ? renderTopupTab() : renderWithdrawTab()}
                            </motion.div>

                            {/* Recent Transactions */}
                            <div className="luxury-box p-8">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-lg font-serif font-bold text-[#F5E6C8] uppercase tracking-widest">Transaction Ledger</h3>
                                        <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em] mt-1">Institutional Audit Trail</p>
                                    </div>
                                    <button onClick={() => navigate('/my-account/transactions')} className="text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 group">
                                        Full Ledger
                                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>

                                {loadingTransactions ? (
                                    <div className="flex flex-col items-center justify-center py-20 grayscale opacity-50">
                                        <RefreshCw className="w-8 h-8 animate-spin text-[#C8A96A] mb-4" />
                                        <span className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">Syncing Data...</span>
                                    </div>
                                ) : recentTransactions.length > 0 ? (
                                    <div className="space-y-4">
                                        {recentTransactions.map((tx, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-4 bg-[#1A1A1A] border border-[#C8A96A]/5 hover:border-[#C8A96A]/20 transition-all">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-10 h-10 flex items-center justify-center ${tx.type === 'credit' ? 'bg-green-950/30 text-green-500' : 'bg-red-950/30 text-red-500'}`}>
                                                        {tx.type === 'credit' ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-[#F5E6C8] uppercase tracking-wider">{tx.description}</p>
                                                        <p className="text-[9px] font-medium text-[#C8A96A]/40 mt-0.5">{formatDate(tx.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className={`text-sm font-black ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                        {tx.type === 'credit' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                                                    </p>
                                                    <span className={`text-[8px] font-black uppercase tracking-widest mt-1 inline-block px-1.5 py-0.5 ${getStatusColor(tx.status)}`}>
                                                        {tx.status}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-20 border-2 border-dashed border-[#C8A96A]/10">
                                        <Receipt className="w-12 h-12 text-[#C8A96A]/10 mx-auto mb-4" strokeWidth={1} />
                                        <p className="text-[10px] font-black text-[#C8A96A]/40 uppercase tracking-widest">No Activity Records Found</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="space-y-8">
                            {/* Settlement Insight */}
                            <div className="luxury-box p-6 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D]">
                                <h3 className="text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                    <Shield className="w-3 h-3 text-[#D4AF37]" />
                                    Vault Parameters
                                </h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-end border-b border-[#C8A96A]/5 pb-3">
                                        <span className="text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-widest">Floor Liquidation</span>
                                        <span className="text-sm font-bold text-[#F5E6C8]">₹500</span>
                                    </div>
                                    <div className="flex justify-between items-end border-b border-[#C8A96A]/5 pb-3">
                                        <span className="text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-widest">Ceiling Liquidation</span>
                                        <span className="text-sm font-bold text-[#F5E6C8]">₹50,000</span>
                                    </div>
                                    <div className="flex justify-between items-end">
                                        <span className="text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-widest">SLA Turnaround</span>
                                        <span className="text-sm font-bold text-[#C8A96A]">12-24 Hours</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Footer */}
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Shield, label: 'RBI COMPLIANT' },
                                    { icon: Lock, label: 'AES-256 SECURE' },
                                    { icon: Clock, label: '24/7 PRIORITY' },
                                    { icon: CheckCircle, label: 'VERIFIED' }
                                ].map((item, idx) => (
                                    <div key={idx} className="luxury-box p-4 text-center group hover:border-[#C8A96A]/40 transition-colors">
                                        <item.icon className="w-4 h-4 text-[#C8A96A]/40 mx-auto mb-2 group-hover:text-[#C8A96A] transition-colors" />
                                        <p className="text-[8px] font-black text-[#C8A96A]/30 uppercase tracking-widest group-hover:text-[#C8A96A]/60">{item.label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Help Call */}
                            <div className="p-1 luxury-box bg-gradient-to-r from-[#C8A96A] to-[#D4AF37]">
                                <button
                                    onClick={() => navigate('/contact')}
                                    className="w-full py-4 bg-[#0D0D0D] text-[#C8A96A] hover:bg-transparent hover:text-[#0D0D0D] transition-all font-black text-[10px] uppercase tracking-[0.3em]"
                                >
                                    Concierge Support
                                </button>
                            </div>
                        </div>
                    </div>

                    <p className="text-center text-[9px] font-black text-[#C8A96A]/20 uppercase tracking-[0.4em] mt-12 pb-8">
                        Lattice Protocol • Secure • Encrypted • Private
                    </p>
                </div>
            </div>
        </>
    );
};

export default WalletManagement;