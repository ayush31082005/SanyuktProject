import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package, Shield, Zap, Star, CheckCircle2,
    Wallet, AlertCircle, X, Loader2, CheckCircle, Info
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';

// ── Package definitions ───────────────────────────────────────────────────────
const PACKAGES = [
    {
        id: '599',
        name: 'Silver',
        price: 599,
        bv: '250 BV',
        pv: '0.25 PV',
        capping: '₹2,000 / day',
        color: 'from-slate-400 to-slate-600',
        borderActive: 'ring-slate-400',
        badge: 'bg-slate-100 text-slate-700',
        btnColor: 'bg-slate-700 hover:bg-slate-800',
        icon: Shield,
        features: [
            '250 Business Volume',
            '0.25 Point Value',
            'Daily Capping ₹2,000',
            'Basic Support',
        ],
    },
    {
        id: '1299',
        name: 'Gold',
        price: 1299,
        bv: '500 BV',
        pv: '0.5 PV',
        capping: '₹4,000 / day',
        color: 'from-yellow-400 to-yellow-600',
        borderActive: 'ring-yellow-400',
        badge: 'bg-yellow-100 text-yellow-700',
        btnColor: 'bg-yellow-600 hover:bg-yellow-700',
        icon: Star,
        features: [
            '500 Business Volume',
            '0.5 Point Value',
            'Daily Capping ₹4,000',
            'Standard Support',
            'Priority Training',
        ],
    },
    {
        id: '2699',
        name: 'Diamond',
        price: 2699,
        bv: '1000 BV',
        pv: '1 PV',
        capping: '₹10,000 / day',
        color: 'from-orange-400 to-orange-600',
        borderActive: 'ring-orange-400',
        badge: 'bg-orange-100 text-orange-700',
        btnColor: 'bg-orange-600 hover:bg-orange-700',
        icon: Zap,
        features: [
            '1000 Business Volume',
            '1 Point Value',
            'Daily Capping ₹10,000',
            '24/7 Premium Support',
            'Advanced Training',
            'Exclusive Events',
        ],
    },
];

// ── Components ───────────────────────────────────────────────────────────────

const FeatureRow = ({ label, silver, gold, diamond, isIcon = false }) => (
    <div className="grid grid-cols-4 py-4 border-b border-slate-100 items-center">
        <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">{label}</div>
        <div className="text-center font-black text-slate-700">
            {isIcon ? (silver ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />) : silver}
        </div>
        <div className="text-center font-black text-slate-700">
            {isIcon ? (gold ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />) : gold}
        </div>
        <div className="text-center font-black text-slate-700">
            {isIcon ? (diamond ? <CheckCircle2 className="w-5 h-5 text-green-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />) : diamond}
        </div>
    </div>
);

const ComparisonTable = () => (
    <div className="mt-20 mb-20 bg-white rounded-[3rem] p-8 shadow-2xl shadow-slate-200 border border-slate-100">
        <div className="mb-10 text-center">
            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight mb-2">Detailed Comparison</h2>
            <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.2em]">Select the plan that fits your ambition</p>
        </div>
        <div className="grid grid-cols-4 pb-6 border-b-2 border-slate-100">
            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Feature</div>
            <div className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Silver</div>
            <div className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Gold</div>
            <div className="text-center text-xs font-black text-slate-400 uppercase tracking-widest">Diamond</div>
        </div>
        <FeatureRow label="Price" silver="₹599" gold="₹1299" diamond="₹2699" />
        <FeatureRow label="Team BV" silver="250" gold="500" diamond="1000" />
        <FeatureRow label="Team PV" silver="0.25" gold="0.5" diamond="1" />
        <FeatureRow label="Daily Capping" silver="₹2,000" gold="₹4,000" diamond="₹10,000" />
        <FeatureRow label="Direct Income" silver="₹0" gold="₹50" diamond="₹50" />
        <FeatureRow label="Binary Matching" silver="10%" gold="10%" diamond="10%" />
        <FeatureRow label="Support" silver="Standard" gold="Priority" diamond="24/7 Premium" />
        <FeatureRow label="Training" silver={true} gold={true} diamond={true} isIcon={true} />
        <FeatureRow label="Events" silver={false} gold={true} diamond={true} isIcon={true} />
        <FeatureRow label="Personal Mentor" silver={false} gold={false} diamond={true} isIcon={true} />
    </div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-slate-100">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-6 flex items-center justify-between text-left group"
            >
                <span className="text-lg font-bold text-slate-700 group-hover:text-green-600 transition-colors uppercase tracking-tight">{question}</span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-green-600 text-white rotate-180' : 'bg-slate-50 text-slate-400'}`}>
                    <Star className="w-4 h-4 fill-current" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 text-slate-500 font-medium leading-relaxed">{answer}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => (
    <div className="max-w-4xl mx-auto mb-20">
        <div className="mb-12 text-center">
            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-4 text-center">Frequently Asked Questions</h2>
            <div className="w-20 h-1.5 bg-green-500 mx-auto rounded-full" />
        </div>
        <div className="space-y-2">
            <FAQItem 
                question="How soon is my package activated?" 
                answer="After a successful payment (Wallet or Razorpay), your package is activated instantly. You will see your updated BV, PV, and Daily Capping limit on your dashboard immediately." 
            />
            <FAQItem 
                question="Can I upgrade my package later?" 
                answer="Yes! You can upgrade from Silver to Gold or Diamond at any time. Simply choose the higher package and complete the payment. Your team volume will remain intact." 
            />
            <FAQItem 
                question="What happens to my team volume if I upgrade?" 
                answer="All your previous team volume (BV/PV) is preserved. The upgrade only increases your future earnings potential and daily capping limit." 
            />
            <FAQItem 
                question="How is matching bonus calculated?" 
                answer="The system matches the PV from your Left and Right legs. For every matched PV, you receive a bonus according to your current package's rate, up to your daily capping limit." 
            />
        </div>
    </div>
);

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ pkg, walletBalance, onConfirm, onRazorpay, onCancel, loading }) => {
    const canAfford = walletBalance >= pkg.price;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-xl font-black text-slate-800">Confirm Activation</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl transition">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                {/* Package summary */}
                <div className={`bg-gradient-to-r ${pkg.color} rounded-2xl p-4 text-white mb-5`}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                            <pkg.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{pkg.name} Package</p>
                            <p className="text-2xl font-black">₹{pkg.price.toLocaleString('en-IN')}</p>
                        </div>
                    </div>
                    <div className="flex gap-6 mt-3 text-sm">
                        <span className="text-white/80">BV: <strong>{pkg.bv}</strong></span>
                        <span className="text-white/80">PV: <strong>{pkg.pv}</strong></span>
                        <span className="text-white/80">Cap: <strong>{pkg.capping}</strong></span>
                    </div>
                </div>

                {/* Wallet info */}
                <div className={`rounded-2xl p-4 mb-5 flex items-center gap-3 ${canAfford ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                    <Wallet className={`w-5 h-5 shrink-0 ${canAfford ? 'text-green-600' : 'text-red-500'}`} />
                    <div className="flex-1">
                        <p className="text-sm font-bold text-slate-700">Wallet Balance</p>
                        <p className={`text-lg font-black ${canAfford ? 'text-green-600' : 'text-red-500'}`}>
                            ₹{walletBalance.toLocaleString('en-IN')}
                        </p>
                    </div>
                    {canAfford ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                        <AlertCircle className="w-6 h-6 text-red-500" />
                    )}
                </div>

                {!canAfford && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-3 mb-4 flex gap-2">
                        <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-600">
                            Extra ₹{(pkg.price - walletBalance).toLocaleString('en-IN')} required. Please top up your wallet or pay via Razorpay.
                        </p>
                    </div>
                )}

                {canAfford && (
                    <div className="bg-slate-50 rounded-2xl p-3 mb-5 text-sm text-slate-500 flex gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                        <p>₹{pkg.price.toLocaleString('en-IN')} will be deducted from your wallet and the package will be activated immediately.</p>
                    </div>
                )}

                {/* Actions */}
                <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                        <button
                            onClick={onCancel}
                            disabled={loading}
                            className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={!canAfford || loading}
                            className={`flex-1 py-3 rounded-2xl text-white font-black text-sm transition flex items-center justify-center gap-2 ${pkg.btnColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            {loading ? (
                                <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                            ) : (
                                <>Pay with Wallet</>
                            )}
                        </button>
                    </div>
                    
                    {!loading && (
                        <button
                            onClick={onRazorpay}
                            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                        >
                            <Shield className="w-4 h-4" />
                            Pay with Razorpay
                        </button>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PackageUpgrade = () => {
    const [status, setStatus] = useState(null);   // current package status from API
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [selectedPkg, setSelectedPkg] = useState(null);  // pkg object for confirm modal
    const [activating, setActivating] = useState(false);
    const [success, setSuccess] = useState(null);   // activated pkg name

    // ── Fetch current status ──────────────────────────────────────────────────
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get('/package/status');
                setStatus(res.data.data);
            } catch (err) {
                console.error('Package status fetch error:', err);
            } finally {
                setLoadingStatus(false);
            }
        };
        fetchStatus();
    }, []);

    // ── Activate handler ──────────────────────────────────────────────────────
    const handleActivate = async () => {
        if (!selectedPkg) return;
        setActivating(true);
        try {
            const res = await api.post('/package/activate', {
                packageType: selectedPkg.id,
                paymentMethod: 'wallet',
            });

            if (res.data.success) {
                setStatus(prev => ({
                    ...prev,
                    packageType: selectedPkg.id,
                    packageName: selectedPkg.name,
                    activeStatus: true,
                    walletBalance: res.data.data.walletBalance,
                    bv: res.data.data.bv,
                    pv: res.data.data.pv,
                    dailyCapping: res.data.data.dailyCapping,
                }));
                setSuccess(selectedPkg.name);
                setSelectedPkg(null);
                toast.success(`${selectedPkg.name} package activated successfully!`);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Activation failed. Please try again.';
            toast.error(msg);
        } finally {
            setActivating(false);
        }
    };

    // ── Helpers ───────────────────────────────────────────────────────────────
    const isCurrentPkg = (id) => status?.packageType === id && status?.activeStatus;
    const isLowerPkg = (id) => {
        const prices = { '599': 599, '1299': 1299, '2699': 2699 };
        const currentPrice = prices[status?.packageType] || 0;
        return status?.activeStatus && prices[id] <= currentPrice;
    };

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loadingStatus) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-green-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-500 text-sm font-medium">Loading package status...</p>
            </div>
        </div>
    );

    // ── Razorpay Integration ───────────────────────────────────────────────
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handleRazorpayPayment = async () => {
        if (!selectedPkg) return;
        setActivating(true);

        const resScript = await loadRazorpay();
        if (!resScript) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setActivating(false);
            return;
        }

        try {
            // 1. Create order on backend
            // Note: Reusing /orders/razorpay-order if exists, or adding direct support
            const { data: orderData } = await api.post('/orders/razorpay-order', {
                amount: selectedPkg.price,
                isPackage: true,
                packageType: selectedPkg.id
            });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SQbbsEM3Dlfgi2', // Updated to VITE_
                amount: orderData.amount,
                currency: "INR",
                name: "Sanyukt Parivaar",
                description: `Activate ${selectedPkg.name} Package`,
                order_id: orderData.id,
                handler: async (response) => {
                    try {
                        const verifyRes = await api.post('/package/activate', {
                            packageType: selectedPkg.id,
                            paymentMethod: 'razorpay',
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verifyRes.data.success) {
                            setStatus(prev => ({
                                ...prev,
                                packageType: selectedPkg.id,
                                packageName: selectedPkg.name,
                                activeStatus: true,
                                walletBalance: verifyRes.data.data.walletBalance,
                                bv: verifyRes.data.data.bv,
                                pv: verifyRes.data.data.pv,
                                dailyCapping: verifyRes.data.data.dailyCapping,
                            }));
                            setSuccess(selectedPkg.name);
                            setSelectedPkg(null);
                            toast.success(`${selectedPkg.name} package activated!`);
                        }
                    } catch (err) {
                        toast.error(err.response?.data?.message || 'Verification failed');
                    }
                },
                prefill: {
                    name: status?.userName || '',
                    email: status?.email || '',
                },
                theme: { color: "#0A7A2F" },
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (err) {
            console.error('Razorpay Error:', err);
            toast.error('Failed to initiate Razorpay payment.');
        } finally {
            setActivating(false);
        }
    };

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            {/* ── Confirm Modal ── */}
            <AnimatePresence>
                {selectedPkg && (
                    <ConfirmModal
                        pkg={selectedPkg}
                        walletBalance={status?.walletBalance || 0}
                        onConfirm={handleActivate}
                        onRazorpay={handleRazorpayPayment}
                        onCancel={() => setSelectedPkg(null)}
                        loading={activating}
                    />
                )}
            </AnimatePresence>

            <div className="py-6 px-4 max-w-7xl mx-auto min-h-screen bg-gray-50">

                {/* ── Success Banner ── */}
                <AnimatePresence>
                    {success && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="mb-6 bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3"
                        >
                            <CheckCircle className="w-6 h-6 text-green-500 shrink-0" />
                            <div className="flex-1">
                                <p className="font-black text-green-700">{success} Package Activated!</p>
                                <p className="text-sm text-green-600">Your MLM earnings are now unlocked. BV/PV added to the binary tree.</p>
                            </div>
                            <button onClick={() => setSuccess(null)} className="p-1 hover:bg-green-100 rounded-lg">
                                <X className="w-4 h-4 text-green-500" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Header ── */}
                <div className="relative mb-12 py-10 text-center overflow-hidden">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-green-400/10 blur-[120px] rounded-full -z-10" />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative z-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-black text-slate-800 uppercase tracking-tighter mb-4">
                            Accelerate Your <span className="text-green-600">Growth</span>
                        </h1>
                        <p className="max-w-2xl mx-auto text-slate-500 font-bold uppercase text-xs md:text-sm tracking-[0.3em] leading-relaxed">
                            Upgrade to a premium package and unlock the full potential of your MLM journey with Sanyukt Parivaar
                        </p>
                    </motion.div>
                </div>

                {/* ── Wallet Balance Strip ── */}
                <div className="mb-8 bg-white rounded-2xl border border-slate-200 shadow-sm p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                            <Wallet className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Wallet Balance</p>
                            <p className="text-2xl font-black text-slate-800">
                                ₹{(status?.walletBalance || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    {status?.activeStatus && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-black ${status.packageType === '2699' ? 'bg-orange-100 text-orange-700' :
                                status.packageType === '1299' ? 'bg-yellow-100 text-yellow-700' :
                                    'bg-slate-100 text-slate-700'
                            }`}>
                            <CheckCircle2 className="w-4 h-4" />
                            Current: {status.packageName} Active
                        </div>
                    )}
                </div>

                {/* ── Package Cards ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* ... (existing cards) */}
                    {PACKAGES.map((pkg, index) => {
                        const isCurrent = isCurrentPkg(pkg.id);
                        const isLower = isLowerPkg(pkg.id);
                        const Icon = pkg.icon;

                        return (
                            <motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 24 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 flex flex-col h-full transform transition-all hover:scale-[1.02]
                                    ${isCurrent ? `ring-4 ${pkg.borderActive} ring-offset-4` : ''}`}
                            >
                                {/* Header */}
                                <div className={`bg-gradient-to-br ${pkg.color} p-8 text-white relative overflow-hidden`}>
                                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full" />
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl">
                                                <Icon className="w-8 h-8" />
                                            </div>
                                            {isCurrent ? (
                                                <span className="px-3 py-1 bg-white/30 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                                    <CheckCircle2 className="w-3 h-3" /> Active
                                                </span>
                                            ) : (
                                                <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest">
                                                    Available
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-black uppercase tracking-wider mb-1">{pkg.name}</h3>
                                        <div className="text-4xl font-black">₹{pkg.price.toLocaleString('en-IN')}</div>
                                    </div>
                                </div>

                                {/* Stats Strip */}
                                <div className="bg-slate-50 px-8 py-4 border-b border-slate-100 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Business Volume</p>
                                        <p className="text-lg font-black text-slate-700">{pkg.bv}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Point Value</p>
                                        <p className="text-lg font-black text-slate-700">{pkg.pv}</p>
                                    </div>
                                </div>

                                {/* Daily Capping */}
                                <div className="px-8 py-5 bg-green-50/50 flex items-center gap-3 border-b border-green-100">
                                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Zap className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-green-600/70 font-bold uppercase tracking-widest">Daily Capping</p>
                                        <p className="text-xl font-black text-green-700">{pkg.capping}</p>
                                    </div>
                                </div>

                                {/* Features */}
                                <div className="px-8 py-6 flex-1">
                                    <ul className="space-y-3">
                                        {pkg.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
                                                <span className="text-sm font-bold text-slate-600 uppercase tracking-tight">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Action */}
                                <div className="p-8 pt-0">
                                    {isCurrent ? (
                                        <div className="w-full py-5 rounded-[1.5rem] bg-green-100 text-green-700 font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2">
                                            <CheckCircle2 className="w-5 h-5" /> Currently Active
                                        </div>
                                    ) : isLower ? (
                                        <div className="w-full py-5 rounded-[1.5rem] bg-slate-100 text-slate-400 font-black uppercase tracking-[0.15em] text-sm flex items-center justify-center gap-2 cursor-not-allowed">
                                            Already Upgraded
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setSelectedPkg(pkg)}
                                            className={`w-full py-5 rounded-[1.5rem] text-white font-black uppercase tracking-[0.2em] text-sm transition-all active:scale-95 flex items-center justify-center gap-3 shadow-xl ${pkg.btnColor}`}
                                        >
                                            <Package className="w-5 h-5" />
                                            Activate Now
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* ── Trust Section ── */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                            <Shield className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-wider">Secure Payments</p>
                            <p className="text-xs text-slate-500 font-medium">Verified by Razorpay</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                            <Zap className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-wider">Instant Activation</p>
                            <p className="text-xs text-slate-500 font-medium">No wait time required</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600">
                            <Star className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="font-black text-slate-800 uppercase text-xs tracking-wider">Premium Support</p>
                            <p className="text-xs text-slate-500 font-medium">Dedicated expert help</p>
                        </div>
                    </div>
                </div>

                {/* ── Comparison Table ── */}
                <ComparisonTable />

                {/* ── FAQ Section ── */}
                <FAQSection />

                {/* ── Info Note ── */}
                <div className="mt-10 p-6 bg-white rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <Info className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-700 uppercase tracking-wider mb-1">How it works?</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Once your package is activated, your BV/PV is added to the binary tree.
                            Your sponsor receives a direct income bonus as per the plan. Every night, the server
                            calculates matching bonuses by matching the minimum PV of your Left and Right legs,
                            up to your daily capping limit.
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default PackageUpgrade;
