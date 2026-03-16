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

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ pkg, walletBalance, onConfirm, onCancel, loading }) => {
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
                    <h2 className="text-xl font-black text-slate-800">Package Confirm Karo</h2>
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
                            Wallet mein ₹{(pkg.price - walletBalance).toLocaleString('en-IN')} aur chahiye. Pehle wallet recharge karo.
                        </p>
                    </div>
                )}

                {canAfford && (
                    <div className="bg-slate-50 rounded-2xl p-3 mb-5 text-sm text-slate-500 flex gap-2">
                        <Info className="w-4 h-4 shrink-0 mt-0.5 text-slate-400" />
                        <p>₹{pkg.price.toLocaleString('en-IN')} wallet se deduct ho jaayenge aur package turant activate ho jaayega.</p>
                    </div>
                )}

                {/* Actions */}
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
                            <>Confirm & Activate</>
                        )}
                    </button>
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
                toast.success(`${selectedPkg.name} package activate ho gaya!`);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Activation failed. Dobara try karo.';
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
                <p className="text-gray-500 text-sm font-medium">Package status load ho raha hai...</p>
            </div>
        </div>
    );

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
                                <p className="text-sm text-green-600">Aapka MLM earnings ab unlock ho gaya hai. Binary tree mein BV/PV add ho gaya.</p>
                            </div>
                            <button onClick={() => setSuccess(null)} className="p-1 hover:bg-green-100 rounded-lg">
                                <X className="w-4 h-4 text-green-500" />
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* ── Header ── */}
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-slate-800 uppercase tracking-tight mb-2">
                        Activate Your Success
                    </h1>
                    <p className="text-slate-500 font-bold uppercase text-xs tracking-[0.2em]">
                        Choose a package to unlock your MLM earnings and potential
                    </p>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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

                {/* ── Info Note ── */}
                <div className="mt-10 p-6 bg-white rounded-[2rem] border border-slate-200 flex flex-col md:flex-row items-start md:items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                        <Info className="w-7 h-7" />
                    </div>
                    <div>
                        <h4 className="font-black text-slate-700 uppercase tracking-wider mb-1">Kaise kaam karta hai?</h4>
                        <p className="text-sm text-slate-500 font-medium leading-relaxed">
                            Package activate hote hi aapki BV/PV binary tree mein add ho jaati hai.
                            Aapke sponsor ko 10% direct income milti hai. Roz raat ko server matching bonus
                            calculate karta hai — Left aur Right leg ka minimum PV match karke daily capping
                            tak bonus aapke wallet mein credit hota hai.
                        </p>
                    </div>
                </div>

            </div>
        </>
    );
};

export default PackageUpgrade;
