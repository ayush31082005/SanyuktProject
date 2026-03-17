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
    { value: 599, label: 'Silver', icon: Award, color: '#94A3B8' },
    { value: 1299, label: 'Gold', icon: Award, color: '#F7931E' },
    { value: 2699, label: 'Diamond', icon: Award, color: '#0A7A2F' },
    { value: 500, label: 'Quick', icon: Zap, color: '#64748B' },
    { value: 1000, label: 'Value', icon: TrendingUp, color: '#64748B' },
    { value: 2000, label: 'Premium', icon: Sparkles, color: '#64748B' },
    { value: 5000, label: 'Elite', icon: CrownIcon, color: '#64748B' },
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
                        className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1.5 bg-gray-800 text-white text-xs rounded-lg whitespace-nowrap z-50"
                    >
                        {text}
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
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
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="px-6 py-5 bg-gradient-to-r from-[#0A7A2F] to-[#0e8a37] text-white">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Receipt className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-bold">Confirm Withdrawal</h2>
                        </div>
                        <button onClick={onCancel} className="p-1.5 hover:bg-white/20 rounded-lg transition">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="p-6">
                    <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-200">
                        <div className={`p-2.5 rounded-xl ${method === 'Bank Transfer' ? 'bg-blue-100' : 'bg-purple-100'}`}>
                            {method === 'Bank Transfer'
                                ? <Building2 className="w-5 h-5 text-blue-600" />
                                : <Smartphone className="w-5 h-5 text-purple-600" />
                            }
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-gray-500">Withdrawal Method</p>
                            <p className="font-bold text-gray-800">{method}</p>
                        </div>
                        {method === 'Bank Transfer' && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">{bankName}</p>
                                <p className="text-sm font-mono font-bold text-gray-700">
                                    xxxx{accountNumber?.slice(-4)}
                                </p>
                            </div>
                        )}
                        {method === 'UPI' && (
                            <div className="text-right">
                                <p className="text-xs text-gray-500">UPI ID</p>
                                <p className="text-sm font-mono font-bold text-gray-700">{upiId}</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-5 mb-5 border border-gray-200">
                        <h3 className="text-sm font-bold text-gray-700 mb-4">Amount Breakdown</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Withdrawal Amount</span>
                                <span className="font-bold text-gray-800">₹{amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-red-600">TDS (5%)</span>
                                    <Tooltip text="Tax Deducted at Source">
                                        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                    </Tooltip>
                                </div>
                                <span className="font-bold text-red-600">- ₹{tds.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <span className="text-sm text-orange-600">Processing Fee (2%)</span>
                                    <Tooltip text="Platform processing charges">
                                        <HelpCircle className="w-3.5 h-3.5 text-gray-400" />
                                    </Tooltip>
                                </div>
                                <span className="font-bold text-orange-600">- ₹{fee.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="border-t border-gray-200 pt-3 mt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-bold text-gray-700">Net Payable</span>
                                    <span className="text-2xl font-bold text-[#0A7A2F]">₹{net.toLocaleString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
                        <div className="flex gap-3">
                            <Info className="w-5 h-5 text-[#F7931E] shrink-0" />
                            <div>
                                <p className="text-sm font-bold text-gray-800 mb-1">Important Information</p>
                                <ul className="text-xs text-gray-600 space-y-1">
                                    <li className="flex items-start gap-1.5">
                                        <span className="text-[#F7931E]">•</span>
                                        Amount will be deducted from wallet immediately
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="text-[#F7931E]">•</span>
                                        Processing takes 24-48 hours after admin approval
                                    </li>
                                    <li className="flex items-start gap-1.5">
                                        <span className="text-[#F7931E]">•</span>
                                        You'll receive SMS/email confirmation
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button onClick={onCancel} disabled={loading}
                            className="flex-1 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition disabled:opacity-50">
                            Cancel
                        </button>
                        <button onClick={onConfirm} disabled={loading}
                            className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-[#0A7A2F] to-[#0e8a37] text-white font-bold text-sm hover:shadow-lg hover:shadow-green-200 transition flex items-center justify-center gap-2 disabled:opacity-60">
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
            case 'approved': return 'bg-green-100 text-[#0A7A2F] border-green-200';
            case 'pending': return 'bg-orange-100 text-[#F7931E] border-orange-200';
            case 'rejected': return 'bg-red-100 text-red-600 border-red-200';
            case 'processing': return 'bg-blue-100 text-blue-600 border-blue-200';
            case 'success': return 'bg-green-100 text-[#0A7A2F] border-green-200';
            default: return 'bg-gray-100 text-gray-600 border-gray-200';
        }
    };

    // ── Render Functions ──────────────────────────────────────────────────
    const renderTopupTab = () => (
        <div className="space-y-6">
            {/* Quick Topup Amounts */}
            <div className="grid grid-cols-4 gap-2">
                {QUICK_TOPUP_AMOUNTS.map(({ value, label, icon: Icon, color }) => (
                    <button
                        key={value}
                        onClick={() => setTopupAmount(String(value))}
                        className={`relative p-3 rounded-xl border-2 transition-all group ${parsedTopupAmount === value
                            ? 'border-[#0A7A2F] bg-green-50'
                            : 'border-gray-200 hover:border-[#F7931E] hover:bg-orange-50'
                            }`}
                    >
                        <div className="flex flex-col items-center">
                            <Icon className={`w-4 h-4 mb-1 ${parsedTopupAmount === value ? 'text-[#0A7A2F]' : 'text-gray-400 group-hover:text-[#F7931E]'
                                }`} />
                            <span className="text-xs font-medium text-gray-600">{label}</span>
                            <span className="text-sm font-bold text-gray-800">₹{value}</span>
                        </div>
                    </button>
                ))}
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Enter Amount (₹)</label>
                <div className={`flex items-center border-2 rounded-xl transition-all ${topupAmount && !isTopupValid
                    ? 'border-red-300 bg-red-50'
                    : topupAmount && isTopupValid
                        ? 'border-[#0A7A2F] bg-green-50'
                        : 'border-gray-200 hover:border-[#0A7A2F]'
                    }`}>
                    <span className="pl-4 text-gray-500">₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Minimum ₹100"
                        value={topupAmount}
                        onChange={(e) => setTopupAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-4 bg-transparent outline-none text-xl font-semibold"
                    />
                    {topupAmount && (
                        <button onClick={() => setTopupAmount('')} className="pr-4 text-gray-400 hover:text-gray-600">
                            ✕
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
            {isTopupValid && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-r from-[#0A7A2F]/10 to-[#F7931E]/10 rounded-xl p-4 border border-[#0A7A2F]/20"
                >
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Balance after top-up:</span>
                        <span className="text-2xl font-bold text-[#0A7A2F]">
                            ₹{(walletBalance + parsedTopupAmount).toLocaleString('en-IN')}
                        </span>
                    </div>
                </motion.div>
            )}

            {/* Pay Button */}
            <button
                onClick={handleTopup}
                disabled={!isTopupValid || processingTopup}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${isTopupValid && !processingTopup
                    ? 'bg-gradient-to-r from-[#0A7A2F] to-[#0e8a37] text-white hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
            >
                {processingTopup ? (
                    <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing Payment...
                    </>
                ) : (
                    <>
                        <Plus className="w-5 h-5" />
                        Add ₹{isTopupValid ? parsedTopupAmount.toLocaleString('en-IN') : 'Money'} to Wallet
                    </>
                )}
            </button>
        </div>
    );

    const renderWithdrawTab = () => (
        <div className="space-y-6">
            {/* Quick Withdraw Amounts */}
            <div className="flex flex-wrap gap-2">
                {[500, 1000, 2000, 5000].map(a => (
                    <button
                        key={a}
                        onClick={() => setWithdrawAmount(String(Math.min(a, walletBalance)))}
                        className={`px-4 py-2 rounded-xl border-2 transition-all ${parsedWithdrawAmount === a
                            ? 'border-[#0A7A2F] bg-green-50 text-[#0A7A2F]'
                            : 'border-gray-200 text-gray-600 hover:border-[#F7931E] hover:bg-orange-50'
                            }`}
                    >
                        ₹{a.toLocaleString('en-IN')}
                    </button>
                ))}
                <button
                    onClick={() => setWithdrawAmount(String(walletBalance))}
                    className="px-4 py-2 rounded-xl border-2 border-[#0A7A2F] bg-[#0A7A2F] text-white hover:bg-[#0e8a37] transition-all"
                >
                    Max
                </button>
            </div>

            {/* Amount Input */}
            <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Enter Amount (₹)</label>
                <div className={`flex items-center border-2 rounded-xl transition-all ${withdrawAmount && !isWithdrawValid
                    ? 'border-red-300 bg-red-50'
                    : withdrawAmount && isWithdrawValid
                        ? 'border-[#0A7A2F] bg-green-50'
                        : 'border-gray-200 hover:border-[#0A7A2F]'
                    }`}>
                    <span className="pl-4 text-gray-500">₹</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Minimum ₹500"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full p-4 bg-transparent outline-none text-xl font-semibold"
                    />
                    {withdrawAmount && (
                        <button onClick={() => setWithdrawAmount('')} className="pr-4 text-gray-400 hover:text-gray-600">
                            ✕
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
                    className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200"
                >
                    <h3 className="text-sm font-bold text-gray-700 mb-3">Amount Breakdown</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Withdrawal Amount</span>
                            <span className="font-bold text-gray-800">₹{parsedWithdrawAmount.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-red-600">TDS (5%)</span>
                            <span className="font-bold text-red-600">- ₹{tds.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-orange-600">Processing Fee (2%)</span>
                            <span className="font-bold text-orange-600">- ₹{fee.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="border-t border-gray-200 pt-2 mt-2">
                            <div className="flex justify-between items-center">
                                <span className="font-bold text-gray-700">Net Payable</span>
                                <span className="text-xl font-bold text-[#0A7A2F]">₹{net.toLocaleString('en-IN')}</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Withdrawal Method Selection */}
            <div>
                <p className="text-sm font-medium text-gray-600 mb-3">Select Withdrawal Method</p>
                <div className="grid grid-cols-2 gap-3">
                    {[
                        { id: 'Bank Transfer', icon: Building2, label: 'Bank Transfer', sub: 'NEFT/IMPS' },
                        { id: 'UPI', icon: Smartphone, label: 'UPI', sub: 'Instant Transfer' },
                    ].map(({ id, icon: Icon, label, sub }) => (
                        <button
                            key={id}
                            onClick={() => setWithdrawMethod(id)}
                            className={`p-4 rounded-xl border-2 transition-all ${withdrawMethod === id
                                ? 'border-[#0A7A2F] bg-green-50'
                                : 'border-gray-200 hover:border-gray-300'
                                }`}
                        >
                            <div className={`p-2 rounded-lg ${withdrawMethod === id ? 'bg-blue-50' : 'bg-gray-100'} w-fit mb-3`}>
                                <Icon className={`w-5 h-5 ${withdrawMethod === id ? 'text-blue-600' : 'text-gray-500'}`} />
                            </div>
                            <p className={`font-bold mb-1 ${withdrawMethod === id ? 'text-[#0A7A2F]' : 'text-gray-700'}`}>
                                {label}
                            </p>
                            <p className="text-xs text-gray-500">{sub}</p>
                        </button>
                    ))}
                </div>
            </div>

            {/* Bank Transfer Fields */}
            <AnimatePresence>
                {withdrawMethod === 'Bank Transfer' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="space-y-4"
                    >
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Bank Name</label>
                            <input
                                type="text"
                                value={bankName}
                                onChange={(e) => setBankName(e.target.value)}
                                placeholder="e.g. State Bank of India"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#0A7A2F] outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Account Number</label>
                            <input
                                type="text"
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Enter account number"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#0A7A2F] outline-none transition"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Account Number</label>
                            <input
                                type="text"
                                value={confirmAccount}
                                onChange={(e) => setConfirmAccount(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="Re-enter account number"
                                className={`w-full p-3 border-2 rounded-xl outline-none transition ${confirmAccount && accountNumber !== confirmAccount
                                    ? 'border-red-300 bg-red-50'
                                    : 'border-gray-200 focus:border-[#0A7A2F]'
                                    }`}
                            />
                            {confirmAccount && accountNumber !== confirmAccount && (
                                <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                    <AlertCircle className="w-3 h-3" /> Account numbers do not match
                                </p>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">IFSC Code</label>
                            <input
                                type="text"
                                value={ifscCode}
                                onChange={(e) => setIfscCode(e.target.value.toUpperCase())}
                                placeholder="e.g. SBIN0001234"
                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-[#0A7A2F] outline-none transition uppercase"
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* UPI Field */}
            <AnimatePresence>
                {withdrawMethod === 'UPI' && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                    >
                        <label className="block text-sm font-medium text-gray-600 mb-1">UPI ID</label>
                        <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. name@okaxis"
                            className={`w-full p-3 border-2 rounded-xl outline-none transition ${upiId && !isUpiValid
                                ? 'border-red-300 bg-red-50'
                                : 'border-gray-200 focus:border-[#0A7A2F]'
                                }`}
                        />
                        {upiId && !isUpiValid && (
                            <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" /> Please enter a valid UPI ID
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Submit Withdrawal Button */}
            <button
                onClick={() => setShowWithdrawConfirm(true)}
                disabled={!canWithdraw}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-3 ${canWithdraw
                    ? 'bg-gradient-to-r from-[#0A7A2F] to-[#0e8a37] text-white hover:shadow-lg hover:shadow-green-200 hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
            >
                <Receipt className="w-5 h-5" />
                Submit Withdrawal Request
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

            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">

                    {/* Header with Breadcrumb */}
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
                            <span className="text-[#0A7A2F] font-medium">Wallet Management</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(-1)}
                                    className="p-2 hover:bg-white rounded-xl transition-all group"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-[#0A7A2F] group-hover:-translate-x-1 transition-all" />
                                </button>
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                                        Wallet Management
                                    </h1>
                                    <p className="text-sm text-gray-500 mt-1">
                                        Add money to your wallet or withdraw funds
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={fetchWalletData}
                                className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-gray-200 hover:border-[#0A7A2F] transition-all group"
                            >
                                <RefreshCw className={`w-4 h-4 text-gray-500 group-hover:text-[#0A7A2F] transition-all ${loadingBalance ? 'animate-spin' : 'group-hover:rotate-180'}`} />
                                <span className="text-sm text-gray-600 group-hover:text-[#0A7A2F]">Refresh</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* Success Messages */}
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
                                            ₹{lastTopup.amount.toLocaleString('en-IN')} Added Successfully!
                                        </h3>
                                        <p className="text-white/90 text-sm mb-2">Ref: {lastTopup.refNo}</p>
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

                        {lastWithdrawal && (
                            <motion.div
                                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                                className="mb-6 bg-gradient-to-r from-[#F7931E] to-[#e07d0e] rounded-2xl p-5 text-white shadow-xl shadow-orange-200/50"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="p-3 bg-white/20 rounded-xl">
                                        <Receipt className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">
                                            Withdrawal Request Submitted!
                                        </h3>
                                        <p className="text-white/90 text-sm mb-2">Ref: {lastWithdrawal.refNo}</p>
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => navigate('/my-account/wallet/withdrawal-history')}
                                                className="px-4 py-2 bg-white text-[#F7931E] rounded-xl font-semibold text-sm hover:bg-gray-100 transition-all"
                                            >
                                                View History
                                            </button>
                                            <button
                                                onClick={() => setLastWithdrawal(null)}
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

                    {/* Main Grid */}
                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Left Column - Wallet Balance & Actions */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Wallet Balance Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-gradient-to-br from-[#0A7A2F] to-[#0e8a37] rounded-2xl p-6 text-white shadow-xl relative overflow-hidden"
                            >
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

                                        <div className="text-right">
                                            <p className="text-white/70 text-xs">Lifetime</p>
                                            <p className="text-lg font-semibold">₹{(walletBalance + 2500).toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-white/20">
                                        <div className="text-center">
                                            <div className="text-xs font-medium bg-white/20 px-2 py-1 rounded-lg mb-1">
                                                Silver
                                            </div>
                                            <div className="text-sm font-bold">₹599</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-medium bg-[#F7931E] px-2 py-1 rounded-lg mb-1">
                                                Gold
                                            </div>
                                            <div className="text-sm font-bold">₹1,299</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-xs font-medium bg-emerald-600 px-2 py-1 rounded-lg mb-1">
                                                Diamond
                                            </div>
                                            <div className="text-sm font-bold">₹2,699</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Tab Navigation */}
                            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                                <div className="flex border-b border-gray-200">
                                    <button
                                        onClick={() => setActiveTab('topup')}
                                        className={`flex-1 py-4 px-6 font-bold text-sm transition-all relative ${activeTab === 'topup'
                                            ? 'text-[#0A7A2F]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <Plus className="w-4 h-4" />
                                            Add Money
                                        </div>
                                        {activeTab === 'topup' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A7A2F]"
                                            />
                                        )}
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('withdraw')}
                                        className={`flex-1 py-4 px-6 font-bold text-sm transition-all relative ${activeTab === 'withdraw'
                                            ? 'text-[#0A7A2F]'
                                            : 'text-gray-500 hover:text-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-center gap-2">
                                            <TrendingDown className="w-4 h-4" />
                                            Withdraw
                                        </div>
                                        {activeTab === 'withdraw' && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0A7A2F]"
                                            />
                                        )}
                                    </button>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'topup' ? renderTopupTab() : renderWithdrawTab()}
                                </div>
                            </div>

                            {/* Recent Transactions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800">Recent Transactions</h3>
                                    <button
                                        onClick={() => navigate('/my-account/transactions')}
                                        className="text-sm text-[#0A7A2F] hover:text-[#F7931E] font-medium flex items-center gap-1"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {loadingTransactions ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-[#0A7A2F]" />
                                    </div>
                                ) : recentTransactions.length > 0 ? (
                                    <div className="space-y-3">
                                        {recentTransactions.map((tx, idx) => (
                                            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${tx.type === 'credit' ? 'bg-green-100' : 'bg-orange-100'
                                                        }`}>
                                                        {tx.type === 'credit' ? (
                                                            <TrendingUp className="w-4 h-4 text-[#0A7A2F]" />
                                                        ) : (
                                                            <TrendingDown className="w-4 h-4 text-[#F7931E]" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                                                        <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className={`font-bold ${tx.type === 'credit' ? 'text-[#0A7A2F]' : 'text-[#F7931E]'
                                                        }`}>
                                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                                    </span>
                                                    <p className={`text-xs ${getStatusColor(tx.status)} px-2 py-0.5 rounded-full mt-1`}>
                                                        {tx.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <Receipt className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium">No transactions yet</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Your transactions will appear here
                                        </p>
                                    </div>
                                )}
                            </motion.div>
                        </div>

                        {/* Right Column - Info & History */}
                        <div className="space-y-6">
                            {/* Quick Stats */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                            >
                                <h3 className="font-bold text-gray-800 mb-4">Quick Stats</h3>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Deposits</p>
                                        <p className="text-2xl font-bold text-[#0A7A2F]">₹{totalDeposits.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Total Withdrawals</p>
                                        <p className="text-2xl font-bold text-[#F7931E]">₹{totalWithdrawals.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="pt-3 border-t border-gray-100">
                                        <p className="text-sm text-gray-500 mb-1">Net Balance</p>
                                        <p className="text-xl font-bold text-gray-800">₹{walletBalance.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Recent Withdrawals */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.05 }}
                                className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="font-bold text-gray-800">Recent Withdrawals</h3>
                                    <button
                                        onClick={() => navigate('/my-account/wallet/withdrawal-history')}
                                        className="text-sm text-[#0A7A2F] hover:text-[#F7931E] font-medium flex items-center gap-1"
                                    >
                                        View All
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>

                                {loadingWithdrawals ? (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-6 h-6 animate-spin text-[#0A7A2F]" />
                                    </div>
                                ) : withdrawalHistory.length > 0 ? (
                                    <div className="space-y-3">
                                        {withdrawalHistory.map((withdrawal, idx) => (
                                            <div
                                                key={idx}
                                                className="p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all cursor-pointer"
                                                onClick={() => navigate(`/my-account/wallet/withdrawal/${withdrawal._id}`)}
                                            >
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-xs font-mono text-gray-500">
                                                        {withdrawal.referenceNo?.slice(-8) || `WID${idx + 1}`}
                                                    </span>
                                                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(withdrawal.status)}`}>
                                                        {withdrawal.status || 'Pending'}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">
                                                            ₹{withdrawal.amount?.toLocaleString('en-IN')}
                                                        </p>
                                                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(withdrawal.createdAt)}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-xs text-gray-500">Net</p>
                                                        <p className="text-sm font-bold text-[#0A7A2F]">
                                                            ₹{withdrawal.netAmount?.toLocaleString('en-IN')}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                                            <Receipt className="w-8 h-8 text-gray-400" />
                                        </div>
                                        <p className="text-gray-600 font-medium">No withdrawals yet</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Your withdrawal history will appear here
                                        </p>
                                    </div>
                                )}
                            </motion.div>

                            {/* Information Cards */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 }}
                                className="space-y-3"
                            >
                                {/* Withdrawal Limits Card */}
                                <div className="bg-gradient-to-br from-[#0A7A2F]/5 to-[#F7931E]/5 rounded-2xl p-5 border border-[#0A7A2F]/10">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-[#0A7A2F]/10 rounded-lg">
                                            <Shield className="w-5 h-5 text-[#0A7A2F]" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Withdrawal Limits</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Minimum Amount</span>
                                            <span className="font-bold text-gray-800">₹500</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Maximum per transaction</span>
                                            <span className="font-bold text-gray-800">₹50,000</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Daily Limit</span>
                                            <span className="font-bold text-gray-800">₹1,00,000</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Processing Times Card */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-orange-100 rounded-lg">
                                            <Clock className="w-5 h-5 text-[#F7931E]" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Processing Times</h4>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">Bank Transfer</span>
                                            <span className="text-sm font-bold text-gray-800">24-48 hours</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-600">UPI Transfer</span>
                                            <span className="text-sm font-bold text-gray-800">12-24 hours</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Tax Information Card */}
                                <div className="bg-white rounded-2xl border border-gray-200 p-5">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <FileText className="w-5 h-5 text-purple-600" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Tax Information</h4>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#F7931E] mt-1.5"></div>
                                            <p className="text-gray-600">
                                                <span className="font-bold">TDS (5%):</span> Tax Deducted at Source
                                            </p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <div className="w-1.5 h-1.5 rounded-full bg-[#F7931E] mt-1.5"></div>
                                            <p className="text-gray-600">
                                                <span className="font-bold">Processing Fee (2%):</span> Platform charges
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Help Card */}
                                <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-200">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="p-2 bg-blue-100 rounded-lg">
                                            <HelpCircle className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <h4 className="font-bold text-gray-800">Need Help?</h4>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3">
                                        Having issues with wallet transactions?
                                    </p>
                                    <button
                                        onClick={() => navigate('/contact')}
                                        className="w-full py-2.5 bg-[#0A7A2F] text-white rounded-xl text-sm font-medium hover:bg-[#0e8a37] transition-all"
                                    >
                                        Contact Support
                                    </button>
                                </div>
                            </motion.div>

                            {/* Referral Card */}
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.15 }}
                                className="bg-gradient-to-r from-[#0A7A2F] to-[#F7931E] rounded-2xl p-6 text-white shadow-lg"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white/20 rounded-lg">
                                        <Users className="w-5 h-5" />
                                    </div>
                                    <h4 className="font-bold">Refer & Earn</h4>
                                </div>
                                <p className="text-sm text-white/90 mb-4">
                                    Invite friends and earn ₹100 for each referral
                                </p>
                                <button
                                    onClick={() => navigate('/referral')}
                                    className="w-full py-2.5 bg-white text-[#0A7A2F] rounded-xl font-medium hover:bg-gray-100 transition-all"
                                >
                                    Share Referral Link
                                </button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Trust Badges Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="mt-8 grid grid-cols-4 gap-4"
                    >
                        {[
                            { icon: Shield, label: 'RBI Guidelines', sub: 'Compliant' },
                            { icon: Lock, label: '256-bit SSL', sub: 'Encrypted' },
                            { icon: Clock, label: '24/7 Support', sub: 'Always here' },
                            { icon: CheckCircle, label: 'Verified', sub: 'KYC Required' },
                        ].map((item, idx) => (
                            <div key={idx} className="text-center">
                                <div className="inline-flex p-2 bg-gray-100 rounded-lg mb-2">
                                    <item.icon className="w-4 h-4 text-[#0A7A2F]" />
                                </div>
                                <p className="text-xs font-bold text-gray-700">{item.label}</p>
                                <p className="text-[10px] text-gray-500">{item.sub}</p>
                            </div>
                        ))}
                    </motion.div>

                    {/* Footer Note */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                        className="text-center text-xs text-gray-400 mt-6"
                    >
                        All transactions are secure and encrypted. For any issues, contact our support team.
                    </motion.p>
                </div>
            </div>
        </>
    );
};

export default WalletManagement;