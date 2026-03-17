import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Wallet, Banknote, Smartphone, ChevronRight,
    AlertCircle, CheckCircle, Loader2, Info, X, IndianRupee,
    Shield, Clock, Receipt, Building, CreditCard, Sparkles,
    Trash2, Send
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

const TDS_RATE = 0.05;
const PROCESSING_RATE = 0.02;

const calc = (amount) => {
    const tds = Math.round(amount * TDS_RATE);
    const fee = Math.round(amount * PROCESSING_RATE);
    const net = amount - tds - fee;
    return { tds, fee, net };
};

// ── Styled Components ────────────────────────────────────────────────────
const ThemeCard = ({ children, className = '' }) => (
    <div className={`bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/50 p-6 ${className}`}>
        {children}
    </div>
);

const InputWrapper = ({ label, children, error, icon: Icon }) => (
    <div className="space-y-2">
        <label className="text-sm font-bold text-gray-700 ml-1 flex items-center gap-2">
            {Icon && <Icon className="w-4 h-4 text-[#0A7A2F]" />}
            {label}
        </label>
        <div className="relative group">
            {children}
        </div>
        {error && (
            <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-xs text-red-500 font-medium ml-1 flex items-center gap-1"
            >
                <AlertCircle className="w-3 h-3" /> {error}
            </motion.p>
        )}
    </div>
);

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ data, onConfirm, onCancel, loading }) => {
    const { amount, method, tds, fee, net, bankName, accountNumber, ifscCode, upiId } = data;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-sm px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden"
            >
                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div className="bg-[#0A7A2F]/10 p-3 rounded-2xl">
                            <Receipt className="w-6 h-6 text-[#0A7A2F]" />
                        </div>
                        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <X className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>

                    <h2 className="text-2xl font-black text-gray-900 mb-2">Review Withdrawal</h2>
                    <p className="text-gray-500 text-sm mb-6">Please verify your details before we process the transfer.</p>

                    <div className="bg-gray-50 rounded-3xl p-6 space-y-4 mb-6 border border-gray-100">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-500 font-medium">Request amount</span>
                            <span className="font-bold text-gray-900 text-lg">₹{amount.toLocaleString('en-IN')}</span>
                        </div>

                        <div className="h-px bg-gray-200" />

                        <div className="space-y-3">
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">TDS Deduction (5%)</span>
                                <span className="font-bold text-red-500">- ₹ {tds.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-gray-400">Processing Fee (2%)</span>
                                <span className="font-bold text-red-500">- ₹ {fee.toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <div className="h-px bg-gray-200" />

                        <div className="flex justify-between items-center">
                            <span className="font-bold text-gray-900">Net To Receive</span>
                            <span className="text-2xl font-black text-[#0A7A2F]">₹{net.toLocaleString('en-IN')}</span>
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex items-start gap-4 p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                            {method === 'Bank Transfer' ? (
                                <>
                                    <Building className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-blue-600 mb-1">Target Account</p>
                                        <p className="text-sm font-bold text-gray-900">{bankName}</p>
                                        <p className="text-xs text-gray-500 font-medium">A/C: ****{accountNumber.slice(-4)}</p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Smartphone className="w-5 h-5 text-purple-600 mt-1" />
                                    <div>
                                        <p className="text-[10px] uppercase tracking-wider font-bold text-purple-600 mb-1">Target UPI</p>
                                        <p className="text-sm font-bold text-gray-900">{upiId}</p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={onConfirm}
                            disabled={loading}
                            className="flex-1 bg-[#0A7A2F] text-white py-4 rounded-2xl font-bold hover:bg-[#0e8a37] transition-all flex items-center justify-center gap-2 shadow-lg shadow-green-100 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            Confirm Transfer
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const WithdrawalRequest = () => {
    const navigate = useNavigate();

    const [walletBalance, setWalletBalance] = useState(0);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('Bank Transfer');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccount, setConfirmAccount] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [upiId, setUpiId] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        fetchBalance();
    }, []);

    const fetchBalance = async () => {
        try {
            const res = await api.get('/wallet/topup/balance');
            setWalletBalance(res.data.walletBalance || 0);
        } catch (err) {
            console.error(err);
        } finally {
            setLoadingBalance(false);
        }
    };

    const parsedAmount = parseInt(amount, 10);
    const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 500 && parsedAmount <= walletBalance;
    const { tds, fee, net } = isValidAmount ? calc(parsedAmount) : { tds: 0, fee: 0, net: 0 };

    const isBankValid = method === 'Bank Transfer' &&
        bankName.trim() && accountNumber.trim() &&
        accountNumber === confirmAccount &&
        ifscCode.trim().length >= 11;

    const isUpiValid = method === 'UPI' &&
        /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim());

    const canSubmit = isValidAmount && (isBankValid || isUpiValid);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                amount: parsedAmount,
                method,
                ...(method === 'Bank Transfer' ? { bankName, accountNumber, ifscCode } : {}),
                ...(method === 'UPI' ? { upiId } : {}),
            };
            const res = await api.post('/wallet/withdraw', payload);
            if (res.data.success) {
                setSuccess({
                    refNo: res.data.withdrawal?.referenceNo || '—',
                    net: res.data.withdrawal?.amount || net,
                    tds: res.data.deductions?.tds || tds,
                    fee: res.data.deductions?.processingFee || fee,
                });
                setWalletBalance(prev => prev - parsedAmount);
                setShowConfirm(false);
                toast.success('Withdrawal request successfully placed!');
                // Reset form
                setAmount(''); setBankName('');
                setAccountNumber(''); setConfirmAccount('');
                setIfscCode(''); setUpiId('');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Transaction failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            <AnimatePresence>
                {showConfirm && (
                    <ConfirmModal
                        data={{ amount: parsedAmount, method, tds, fee, net, bankName, accountNumber, ifscCode, upiId }}
                        onConfirm={handleSubmit}
                        onCancel={() => setShowConfirm(false)}
                        loading={submitting}
                    />
                )}
            </AnimatePresence>

            {/* Premium Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-10 backdrop-blur-md bg-white/80">
                <div className="max-w-xl mx-auto px-6 py-5 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="p-3 hover:bg-gray-50 rounded-2xl transition-all group">
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-gray-900" />
                    </button>
                    <h1 className="text-xl font-black text-gray-900">Withdraw Funds</h1>
                    <div className="w-10" /> {/* Spacer */}
                </div>
            </div>

            <main className="max-w-xl mx-auto px-6 pt-8 space-y-6">

                <AnimatePresence mode="wait">
                    {success ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center py-10"
                        >
                            <div className="w-24 h-24 bg-green-100 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-100/50">
                                <CheckCircle className="w-12 h-12 text-[#0A7A2F]" />
                            </div>
                            <h2 className="text-3xl font-black text-gray-900 mb-2">Request Placed!</h2>
                            <p className="text-gray-500 mb-8 max-w-[280px] mx-auto">
                                Your withdrawal of <span className="font-bold text-gray-900">₹{success.net.toLocaleString('en-IN')}</span> has been submitted for approval.
                            </p>

                            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 mb-8 space-y-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Reference ID</span>
                                    <span className="font-bold text-gray-900">{success.refNo}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Expected Processing</span>
                                    <span className="font-bold text-[#0A7A2F]">24-48 Hours</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={() => navigate('/my-account/wallet/withdrawal-history')}
                                    className="w-full py-4 bg-[#0A7A2F] text-white rounded-2xl font-bold shadow-lg shadow-green-100"
                                >
                                    View History
                                </button>
                                <button
                                    onClick={() => setSuccess(null)}
                                    className="w-full py-4 text-gray-500 font-bold hover:text-gray-900 transition-colors"
                                >
                                    Make Another Withdrawal
                                </button>
                            </div>
                        </motion.div>
                    ) : (
                        <>
                            {/* Wallet Balance Hero Section */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="relative overflow-hidden bg-[#0A7A2F] rounded-[2.5rem] p-8 text-white shadow-2xl shadow-green-200"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-4 -translate-y-4">
                                    <Wallet className="w-32 h-32" />
                                </div>

                                <div className="relative z-10">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Sparkles className="w-4 h-4 text-emerald-300" />
                                        <p className="text-xs font-bold uppercase tracking-widest text-emerald-100">Withdrawable Balance</p>
                                    </div>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-medium text-emerald-200">₹</span>
                                        <h2 className="text-5xl font-black tracking-tight">
                                            {loadingBalance ? "..." : walletBalance.toLocaleString('en-IN')}
                                        </h2>
                                    </div>

                                    <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-4">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Min. Amount</span>
                                                <span className="text-sm font-black">₹500</span>
                                            </div>
                                            <div className="w-px h-6 bg-white/10" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] text-emerald-200 font-bold uppercase tracking-wider">Avg. Time</span>
                                                <span className="text-sm font-black">24-48h</span>
                                            </div>
                                        </div>
                                        <div className="bg-white/20 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-sm">
                                            <div className="flex items-center gap-1.5">
                                                <Shield className="w-3 h-3 text-emerald-300" />
                                                <span className="text-[10px] font-black uppercase tracking-tighter">Verified</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Withdrawal Form */}
                            <div className="space-y-6">
                                <ThemeCard>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">01. Withdrawal Amount</h3>
                                        <div className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md">REQUIRED</div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className={`relative group transition-all`}>
                                            <div className={`absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none transition-colors ${amount && isValidAmount ? 'text-[#0A7A2F]' : 'text-gray-400 group-focus-within:text-[#0A7A2F]'}`}>
                                                <IndianRupee className="w-6 h-6" />
                                            </div>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                placeholder="Enter amount (Min ₹500)"
                                                value={amount}
                                                onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                                className={`w-full bg-gray-50 border-2 rounded-2xl pl-16 pr-12 py-5 text-2xl font-black text-gray-900 outline-none transition-all placeholder:text-gray-300
                                                    ${amount && !isValidAmount ? 'border-red-100 focus:border-red-500' : 'border-gray-50 focus:border-[#0A7A2F] focus:bg-white focus:shadow-xl focus:shadow-green-50'}`}
                                            />
                                            {amount && (
                                                <button onClick={() => setAmount('')} className="absolute inset-y-0 right-0 pr-6 flex items-center text-gray-300 hover:text-gray-500 transition-colors">
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>

                                        {/* Error Messages */}
                                        <AnimatePresence>
                                            {amount && parsedAmount < 500 && (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-xs text-red-500 font-bold ml-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Minimum ₹500 required for withdrawal.
                                                </motion.div>
                                            )}
                                            {amount && parsedAmount > walletBalance && (
                                                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-2 text-xs text-red-500 font-bold ml-1">
                                                    <AlertCircle className="w-4 h-4" />
                                                    Insufficient balance in your wallet.
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Quick Selection */}
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {[500, 1000, 2000, 5000].map(val => (
                                                <button
                                                    key={val}
                                                    onClick={() => setAmount(String(Math.min(val, walletBalance)))}
                                                    className={`px-5 py-2.5 rounded-2xl text-xs font-black transition-all border-2
                                                        ${parsedAmount === val
                                                            ? 'bg-[#0A7A2F] text-white border-[#0A7A2F] shadow-lg shadow-green-100'
                                                            : 'bg-white text-gray-500 border-gray-100 hover:border-gray-300 active:scale-95'}`}
                                                >
                                                    ₹{val.toLocaleString('en-IN')}
                                                </button>
                                            ))}
                                            <button
                                                onClick={() => setAmount(String(walletBalance))}
                                                className="px-5 py-2.5 rounded-2xl text-xs font-black bg-orange-50 text-orange-600 border-2 border-orange-100 hover:bg-orange-600 hover:text-white hover:border-orange-600 transition-all active:scale-95"
                                            >
                                                WITHDRAW ALL
                                            </button>
                                        </div>

                                        {/* Real-time Tax Receipt breakdown */}
                                        <AnimatePresence>
                                            {isValidAmount && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: 'auto' }}
                                                    className="bg-[#FAFAFA] rounded-3xl p-6 space-y-3 mt-6 border-2 border-dashed border-gray-200"
                                                >
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">Processing Fee (2%)</span>
                                                        <span className="font-bold text-gray-900">-₹{fee.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center text-sm">
                                                        <span className="text-gray-500 font-bold uppercase tracking-wider text-[10px]">TDS Deduction (5%)</span>
                                                        <span className="font-bold text-gray-900">-₹{tds.toLocaleString('en-IN')}</span>
                                                    </div>
                                                    <div className="h-px bg-gray-200 my-2" />
                                                    <div className="flex justify-between items-center">
                                                        <span className="text-gray-900 font-black">Net To Wallet</span>
                                                        <span className="text-xl font-black text-[#0A7A2F]">₹{net.toLocaleString('en-IN')}</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </ThemeCard>

                                <ThemeCard>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="font-black text-gray-900 uppercase tracking-widest text-xs">02. Payout Method</h3>
                                        <div className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-1 rounded-md">STEP 2</div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-8">
                                        {[
                                            { id: 'Bank Transfer', icon: Building, label: 'Bank', sub: 'NEFT/IMPS' },
                                            { id: 'UPI', icon: Smartphone, label: 'UPI ID', sub: 'PhonePe/GPay' },
                                        ].map(({ id, icon: Icon, label, sub }) => (
                                            <button
                                                key={id}
                                                onClick={() => setMethod(id)}
                                                className={`relative p-6 rounded-3xl border-2 text-left transition-all group overflow-hidden
                                                    ${method === id
                                                        ? 'border-[#0A7A2F] bg-[#0A7A2F]/5'
                                                        : 'border-gray-50 hover:border-gray-200'}`}
                                            >
                                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all
                                                    ${method === id ? 'bg-[#0A7A2F] text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-gray-200'}`}>
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <p className={`text-sm font-black ${method === id ? 'text-gray-900' : 'text-gray-500'}`}>{label}</p>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{sub}</p>

                                                {method === id && (
                                                    <div className="absolute top-4 right-4 animate-in fade-in zoom-in">
                                                        <div className="w-2 h-2 rounded-full bg-[#0A7A2F]" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="space-y-6">
                                        {method === 'Bank Transfer' ? (
                                            <div className="space-y-4 animate-in slide-in-from-top-4 duration-300">
                                                <InputWrapper label="BANK NAME" icon={Building} error={bankName && !bankName.trim() ? "Required" : null}>
                                                    <input
                                                        type="text"
                                                        value={bankName}
                                                        onChange={e => setBankName(e.target.value)}
                                                        placeholder="e.g. State Bank of India"
                                                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:border-[#0A7A2F] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                                    />
                                                </InputWrapper>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <InputWrapper label="ACCOUNT NUMBER" icon={CreditCard}>
                                                        <input
                                                            type="text"
                                                            value={accountNumber}
                                                            onChange={e => setAccountNumber(e.target.value.replace(/[^0-9]/g, ''))}
                                                            placeholder="Account Number"
                                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:border-[#0A7A2F] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                                        />
                                                    </InputWrapper>

                                                    <InputWrapper label="CONFIRM ACCOUNT" error={confirmAccount && accountNumber !== confirmAccount ? "Account numbers don't match" : null}>
                                                        <input
                                                            type="text"
                                                            value={confirmAccount}
                                                            onChange={e => setConfirmAccount(e.target.value.replace(/[^0-9]/g, ''))}
                                                            placeholder="Re-enter Number"
                                                            className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:border-[#0A7A2F] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                                        />
                                                    </InputWrapper>
                                                </div>

                                                <InputWrapper label="IFSC CODE" icon={Building} error={ifscCode && ifscCode.length < 11 ? "Must be 11 characters" : null}>
                                                    <input
                                                        type="text"
                                                        value={ifscCode}
                                                        onChange={e => setIfscCode(e.target.value.toUpperCase())}
                                                        placeholder="SBIN0001234"
                                                        maxLength={11}
                                                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:border-[#0A7A2F] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                                    />
                                                </InputWrapper>
                                            </div>
                                        ) : (
                                            <div className="animate-in slide-in-from-top-4 duration-300">
                                                <InputWrapper label="UPI ID" icon={Smartphone} error={upiId && !isUpiValid ? "Enter a valid UPI ID (e.g. name@axis)" : null}>
                                                    <input
                                                        type="text"
                                                        value={upiId}
                                                        onChange={e => setUpiId(e.target.value.toLowerCase())}
                                                        placeholder="username@bank"
                                                        className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-5 py-4 text-sm font-bold text-gray-900 focus:border-[#0A7A2F] focus:bg-white outline-none transition-all placeholder:text-gray-300"
                                                    />
                                                </InputWrapper>
                                            </div>
                                        )}
                                    </div>
                                </ThemeCard>

                                <button
                                    onClick={() => setShowConfirm(true)}
                                    disabled={!canSubmit}
                                    className={`w-full py-5 rounded-[2rem] font-black text-lg shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95
                                        ${canSubmit
                                            ? 'bg-[#0A7A2F] text-white shadow-green-200 hover:bg-[#0e8a37] hover:-translate-y-1'
                                            : 'bg-gray-100 text-gray-300 shadow-none cursor-not-allowed'}`}
                                >
                                    Review & Submit
                                    <ChevronRight className="w-5 h-5" />
                                </button>

                                {/* Security Badges */}
                                <div className="grid grid-cols-3 gap-4 pt-4">
                                    {[
                                        { icon: Shield, label: 'SECURE', sub: '256-BIT' },
                                        { icon: Clock, label: 'EXPECTED', sub: '24-48 HRS' },
                                        { icon: Info, label: 'SUPPORT', sub: '24/7' },
                                    ].map(({ icon: Icon, label, sub }) => (
                                        <div key={label} className="text-center group">
                                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-50 flex items-center justify-center mx-auto mb-2 shadow-sm group-hover:scale-110 transition-transform">
                                                <Icon className="w-5 h-5 text-gray-300 group-hover:text-[#0A7A2F]" />
                                            </div>
                                            <p className="text-[10px] font-black text-gray-900 tracking-widest">{label}</p>
                                            <p className="text-[9px] font-bold text-gray-400">{sub}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};

export default WithdrawalRequest;