import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Wallet, Plus, CheckCircle, AlertCircle,
    Loader2, Zap, Shield, RefreshCw, IndianRupee
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

// ── Quick amount options ──────────────────────────────────────────────────────
const QUICK_AMOUNTS = [599, 1299, 2699, 500, 1000, 2000, 5000];

// ── Load Razorpay script ──────────────────────────────────────────────────────
const loadRazorpay = () =>
    new Promise((resolve) => {
        if (window.Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });

// ─────────────────────────────────────────────────────────────────────────────
const WalletTopup = () => {
    const navigate = useNavigate();
    const [walletBalance, setWalletBalance] = useState(0);
    const [amount, setAmount] = useState('');
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [lastTopup, setLastTopup] = useState(null);   // success state

    // ── Fetch wallet balance ──────────────────────────────────────────────────
    const fetchBalance = async () => {
        try {
            setLoadingBalance(true);
            const res = await api.get('/wallet/topup/balance');
            if (res.data.success) setWalletBalance(res.data.walletBalance || 0);
        } catch (err) {
            console.error('Balance fetch error:', err);
        } finally {
            setLoadingBalance(false);
        }
    };

    useEffect(() => { fetchBalance(); }, []);

    // ── Handle amount input ───────────────────────────────────────────────────
    const handleAmountChange = (e) => {
        const val = e.target.value.replace(/[^0-9]/g, '');
        setAmount(val);
    };

    const parsedAmount = parseInt(amount, 10);
    const isValid = !isNaN(parsedAmount) && parsedAmount >= 100 && parsedAmount <= 50000;

    // ── Razorpay payment flow ─────────────────────────────────────────────────
    const handleTopup = async () => {
        if (!isValid) return;
        setProcessing(true);

        try {
            // 1. Load Razorpay SDK
            const loaded = await loadRazorpay();
            if (!loaded) {
                toast.error('Razorpay load nahi hua. Internet check karo.');
                setProcessing(false);
                return;
            }

            // 2. Create order on backend
            const { data: orderData } = await api.post('/wallet/topup/create-order', {
                amount: parsedAmount,
            });

            if (!orderData.success) {
                toast.error(orderData.message || 'Order create karne mein error.');
                setProcessing(false);
                return;
            }

            // 3. Open Razorpay checkout
            const options = {
                key: orderData.key,
                amount: orderData.order.amount,
                currency: 'INR',
                name: 'Sanyukt Parivar',
                description: `Wallet Top-Up — ₹${parsedAmount}`,
                order_id: orderData.order.id,
                prefill: {
                    name: orderData.user.name,
                    email: orderData.user.email,
                    contact: orderData.user.mobile,
                },
                theme: { color: '#16a34a' },

                handler: async (response) => {
                    // 4. Verify on backend → credit wallet
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
                            toast.success(`₹${parsedAmount.toLocaleString('en-IN')} wallet mein add ho gaye!`);
                        } else {
                            toast.error(verifyData.message || 'Payment verify nahi hua.');
                        }
                    } catch (err) {
                        toast.error('Verification mein error. Support se contact karo.');
                    } finally {
                        setProcessing(false);
                    }
                },

                modal: {
                    ondismiss: () => {
                        toast('Payment cancel kar di.', { icon: 'ℹ️' });
                        setProcessing(false);
                    },
                },
            };

            // Mock mode — direct verify karo without Razorpay popup
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
                    toast.success(`₹${parsedAmount.toLocaleString('en-IN')} wallet mein add ho gaye! (Test Mode)`);
                }
                setProcessing(false);
                return;
            }

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error('Topup error:', err);
            toast.error(err?.response?.data?.message || 'Kuch galat ho gaya. Dobara try karo.');
            setProcessing(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="p-4 md:p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">

            {/* ── Header ── */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6"
            >
                <button
                    onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition group active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-800">Wallet Top-Up</h1>
                    <p className="text-sm text-gray-500 mt-0.5">UPI / Card se wallet mein paise daalo</p>
                </div>
            </motion.div>

            {/* ── Success Banner ── */}
            <AnimatePresence>
                {lastTopup && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="mb-5 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
                    >
                        <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                        <div className="flex-1">
                            <p className="font-black text-green-700">
                                ₹{lastTopup.toLocaleString('en-IN')} Successfully Added!
                            </p>
                            <p className="text-sm text-green-600">
                                Ab aap package activate kar sakte ho.
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/my-account/bonus/first')}
                            className="text-xs font-black text-green-700 bg-green-100 px-3 py-1.5 rounded-xl hover:bg-green-200 transition"
                        >
                            Package Activate →
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ── Current Balance Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-6 mb-6 text-white shadow-xl shadow-green-200"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-1">
                            Current Wallet Balance
                        </p>
                        {loadingBalance ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin text-green-200" />
                                <span className="text-green-200 text-sm">Loading...</span>
                            </div>
                        ) : (
                            <p className="text-4xl font-black">
                                ₹{walletBalance.toLocaleString('en-IN')}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Wallet className="w-7 h-7 text-white" />
                        </div>
                        <button
                            onClick={fetchBalance}
                            className="text-green-200 hover:text-white transition flex items-center gap-1 text-xs"
                        >
                            <RefreshCw className="w-3 h-3" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Package hint */}
                <div className="mt-4 pt-4 border-t border-white/20 flex gap-4 text-xs text-green-100">
                    <span>Silver: <strong className="text-white">₹599</strong></span>
                    <span>Gold: <strong className="text-white">₹1,299</strong></span>
                    <span>Diamond: <strong className="text-white">₹2,699</strong></span>
                </div>
            </motion.div>

            {/* ── Top-Up Form ── */}
            <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 mb-5"
            >
                <h2 className="text-base font-black text-gray-700 mb-4">Amount Enter Karo</h2>

                {/* Amount input */}
                <div className={`flex items-center gap-3 border-2 rounded-2xl px-4 py-3 transition-all mb-4
                    ${amount && !isValid
                        ? 'border-red-300 bg-red-50'
                        : amount && isValid
                            ? 'border-green-400 bg-green-50'
                            : 'border-slate-200 bg-slate-50 focus-within:border-green-400 focus-within:bg-white'
                    }`}
                >
                    <IndianRupee className={`w-5 h-5 shrink-0 ${amount && isValid ? 'text-green-600' : 'text-slate-400'}`} />
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="Minimum ₹100"
                        value={amount}
                        onChange={handleAmountChange}
                        className="flex-1 bg-transparent text-xl font-black text-gray-800 outline-none placeholder:text-slate-300"
                    />
                    {amount && (
                        <button
                            onClick={() => setAmount('')}
                            className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                            ✕
                        </button>
                    )}
                </div>

                {/* Validation messages */}
                {amount && !isNaN(parsedAmount) && parsedAmount < 100 && (
                    <p className="text-xs text-red-500 font-bold mb-3 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Minimum amount ₹100 hai
                    </p>
                )}
                {amount && !isNaN(parsedAmount) && parsedAmount > 50000 && (
                    <p className="text-xs text-red-500 font-bold mb-3 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> Maximum amount ₹50,000 hai
                    </p>
                )}

                {/* Quick amount chips */}
                <div className="mb-5">
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-2">Quick Select</p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_AMOUNTS.map((a) => (
                            <button
                                key={a}
                                onClick={() => setAmount(String(a))}
                                className={`px-3 py-1.5 rounded-xl text-sm font-black border transition-all active:scale-95
                                    ${parsedAmount === a
                                        ? 'bg-green-600 text-white border-green-600'
                                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-400 hover:text-green-700'
                                    }`}
                            >
                                ₹{a.toLocaleString('en-IN')}
                            </button>
                        ))}
                    </div>
                </div>

                {/* After top-up preview */}
                {isValid && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="bg-green-50 border border-green-200 rounded-2xl p-3 mb-5 flex items-center justify-between"
                    >
                        <span className="text-sm text-green-700 font-bold">Top-up ke baad balance:</span>
                        <span className="text-lg font-black text-green-700">
                            ₹{(walletBalance + parsedAmount).toLocaleString('en-IN')}
                        </span>
                    </motion.div>
                )}

                {/* Pay button */}
                <button
                    onClick={handleTopup}
                    disabled={!isValid || processing}
                    className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg
                        ${isValid && !processing
                            ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-green-200'
                            : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'
                        }`}
                >
                    {processing ? (
                        <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                    ) : (
                        <><Plus className="w-5 h-5" /> Add ₹{isValid ? parsedAmount.toLocaleString('en-IN') : '---'} to Wallet</>
                    )}
                </button>
            </motion.div>

            {/* ── Trust badges ── */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-3 gap-3"
            >
                {[
                    { icon: Shield, label: 'Secure Payment', sub: '256-bit SSL' },
                    { icon: Zap, label: 'Instant Credit', sub: 'Real-time' },
                    { icon: CheckCircle, label: 'Verified', sub: 'Razorpay' },
                ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center">
                        <Icon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                        <p className="text-xs font-black text-slate-700">{label}</p>
                        <p className="text-[10px] text-slate-400">{sub}</p>
                    </div>
                ))}
            </motion.div>

        </div>
    );
};

export default WalletTopup;
