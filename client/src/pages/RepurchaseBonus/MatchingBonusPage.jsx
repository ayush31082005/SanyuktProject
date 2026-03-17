import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, TrendingUp, Zap, Shield, Star, Activity,
    BarChart2, ArrowLeftRight, Clock, Info, CheckCircle, AlertCircle
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

// ─── Config per package type ─────────────────────────────────────────────────
const CONFIG = {
    silver: {
        label: 'Silver Matching',
        packageKey: '599',
        price: '₹599',
        bv: '250 BV',
        pv: '0.25 PV',
        capping: '₹2,000',
        icon: Shield,
        color: 'from-slate-400 to-slate-600',
        glow: 'shadow-slate-200',
        text: 'text-slate-600',
        bg: 'bg-slate-50',
        accentBg: 'bg-slate-500',
        emoji: '🥈',
    },
    gold: {
        label: 'Gold Matching',
        packageKey: '1299',
        price: '₹1,299',
        bv: '500 BV',
        pv: '0.5 PV',
        capping: '₹4,000',
        icon: Star,
        color: 'from-yellow-400 to-amber-600',
        glow: 'shadow-yellow-100',
        text: 'text-amber-600',
        bg: 'bg-amber-50',
        accentBg: 'bg-amber-500',
        emoji: '🥇',
    },
    diamond: {
        label: 'Diamond Matching',
        packageKey: '2699',
        price: '₹2,699',
        bv: '1000 BV',
        pv: '1 PV',
        capping: '₹10,000',
        icon: Zap,
        color: 'from-orange-400 to-red-600',
        glow: 'shadow-orange-100',
        text: 'text-orange-600',
        bg: 'bg-orange-50',
        accentBg: 'bg-orange-500',
        emoji: '💎',
    },
};

// ─── Sub-Components ──────────────────────────────────────────────────────────

const StatCard = ({ label, value, icon: Icon, badge, color, delay }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay, duration: 0.5 }}
        className="bg-white/70 backdrop-blur-xl border border-white/40 rounded-[2rem] p-6 shadow-xl shadow-slate-200/50 flex flex-col justify-between hover:scale-[1.02] transition-transform"
    >
        <div className="flex items-center justify-between mb-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${color} text-white shadow-lg`}>
                <Icon className="w-6 h-6" />
            </div>
            {badge && (
                <span className="px-3 py-1 rounded-full bg-slate-100 text-[10px] font-black text-slate-500 uppercase tracking-widest border border-slate-200">
                    {badge}
                </span>
            )}
        </div>
        <div>
            <p className="text-3xl font-black text-slate-800 tracking-tight mb-1">{value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.1em]">{label}</p>
        </div>
    </motion.div>
);

const TransactionDetailModal = ({ isOpen, onClose, transaction, cfg }) => {
    if (!transaction) return null;

    const details = [
        { label: 'Transaction ID', value: `#MB-${transaction._id.slice(-8)}`, icon: Shield },
        { label: 'Date & Time', value: new Date(transaction.date).toLocaleString('en-IN', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }), icon: Clock },
        { label: 'Matched Volume', value: `${transaction.matchedPV} PV`, icon: ArrowLeftRight },
        { label: 'Bonus Amount', value: `₹${transaction.bonusAmount.toLocaleString()}`, icon: TrendingUp },
        { label: 'Description', value: transaction.description || 'Matching bonus for binary tree volume.', icon: Info },
    ];

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-100"
                    >
                        <div className={`h-32 bg-gradient-to-br ${cfg.color} p-8 flex items-end justify-between relative`}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-2xl rounded-full -mr-16 -mt-16" />
                            <div className="relative z-10">
                                <p className="text-white/70 text-[10px] font-black uppercase tracking-widest mb-1">Transaction Success</p>
                                <h2 className="text-3xl font-black text-white tracking-tight leading-none">₹{transaction.bonusAmount.toLocaleString()}</h2>
                            </div>
                            <button onClick={onClose} className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur rounded-xl flex items-center justify-center text-white transition">
                                <ArrowLeft className="w-5 h-5 rotate-90" />
                            </button>
                        </div>
                        <div className="p-8">
                            <div className="space-y-6">
                                {details.map((item, idx) => (
                                    <div key={idx} className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 shrink-0 border border-slate-100">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.label}</p>
                                            <p className="text-sm font-bold text-slate-700 leading-relaxed">{item.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <div className="mt-10 flex gap-3">
                                <div className="flex-1 flex items-center gap-2 px-4 py-3 bg-green-50 rounded-2xl border border-green-100">
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-black text-green-700 uppercase tracking-widest">Credited to Wallet</span>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-slate-200 hover:bg-slate-900 transition active:scale-95"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

const MatchingBonusPage = ({ type }) => {
    const navigate = useNavigate();
    const cfg = CONFIG[type] || CONFIG.silver;
    const Icon = cfg.icon;

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTx, setSelectedTx] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/mlm/matching-bonus/${type}`);
                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load data');
                toast.error('Failed to sync bonus data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="text-center">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className={`w-14 h-14 border-4 border-slate-200 border-t-green-500 rounded-full mb-6`} 
                />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] animate-pulse">Syncing data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#F8FAFC]">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2.5rem] p-10 text-center shadow-2xl shadow-slate-200 border border-slate-100 max-w-md w-full"
            >
                <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-red-500">
                    <AlertCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Access Denied</h2>
                <p className="text-slate-500 font-medium mb-8 leading-relaxed">{error}</p>
                <button onClick={() => navigate(-1)} className="w-full py-4 rounded-2xl bg-slate-800 text-white font-black uppercase text-sm tracking-widest shadow-xl transition-all active:scale-95">Go Back</button>
            </motion.div>
        </div>
    );

    const {
        totalEarned = 0,
        thisMonth = 0,
        todayEarned = 0,
        cappingUsed = 0,
        cappingLimit = 0,
        carryForwardBV = 0,
        leftBV = 0,
        rightBV = 0,
        personalPV = 0,
        matchedPV = 0,
        userHasPackage = false,
        history = [],
    } = data || {};

    const cappingPct = cappingLimit > 0 ? Math.min((cappingUsed / cappingLimit) * 100, 100) : 0;

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20">
            {/* ── Detail Modal ── */}
            <TransactionDetailModal 
                isOpen={!!selectedTx} 
                onClose={() => setSelectedTx(null)} 
                transaction={selectedTx} 
                cfg={cfg}
            />

            {/* ── Background Blobs ── */}
            <div className="fixed inset-0 pointer-events-none -overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-green-400/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[20%] left-[-5%] w-[400px] h-[400px] bg-blue-400/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 p-4 md:p-8 max-w-7xl mx-auto">
                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-6">
                        <motion.button 
                            whileHover={{ x: -4 }}
                            onClick={() => navigate(-1)}
                            className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-slate-400 hover:text-slate-600 transition"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </motion.button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{cfg.emoji}</span>
                                <h1 className="text-3xl md:text-4xl font-black text-slate-800 uppercase tracking-tighter leading-none">{cfg.label}</h1>
                            </div>
                            <p className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-[0.2em]">{cfg.price} Package · Daily Cap {cfg.capping}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 px-6 py-4 bg-white/50 backdrop-blur rounded-[2rem] border border-white max-w-fit shadow-lg shadow-slate-100/50">
                        <div className={`p-2 rounded-xl bg-gradient-to-br ${cfg.color} text-white`}>
                            <Icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-tight">Current Status</p>
                            <p className={`text-sm font-black ${userHasPackage ? 'text-green-600' : 'text-slate-400'} uppercase`}>
                                {userHasPackage ? 'Fully Active ✓' : 'Inactive'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* ── Main Stats Dashboard ── */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12 text-slate-800">
                    {/* Primary Large Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`md:col-span-2 relative overflow-hidden bg-gradient-to-br ${cfg.color} rounded-[2.5rem] p-8 text-white shadow-2xl ${cfg.glow}`}
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-20 -mt-20" />
                        <div className="relative z-10 h-full flex flex-col justify-between">
                            <div className="flex justify-between items-start mb-10">
                                <div>
                                    <p className="text-xs font-bold text-white/70 uppercase tracking-[0.2em] mb-1">Personal PV Balance</p>
                                    <h4 className="text-5xl font-black tracking-tight">{personalPV.toLocaleString()} <span className="text-lg text-white/60">PV</span></h4>
                                </div>
                                <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl border border-white/20">
                                    <Icon className="w-8 h-8" />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-black mb-1">Carry Forward</p>
                                    <p className="text-xl font-black">{carryForwardBV.toLocaleString()} <span className="text-xs opacity-60">BV</span></p>
                                </div>
                                <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10">
                                    <p className="text-[10px] text-white/60 uppercase tracking-widest font-black mb-1">Matched Bonus</p>
                                    <p className="text-xl font-black">{matchedPV.toLocaleString()} <span className="text-xs opacity-60">PV</span></p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Secondary Stat Cards */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <StatCard delay={0.1} label="Total Earnings" value={`₹${totalEarned.toLocaleString()}`} icon={TrendingUp} badge="All-Time" color="from-green-500 to-emerald-700" />
                        <StatCard delay={0.2} label="Earnings Today" value={`₹${todayEarned.toLocaleString()}`} icon={Activity} badge="Live" color="from-blue-500 to-indigo-700" />
                        <StatCard delay={0.3} label="This Month" value={`₹${thisMonth.toLocaleString()}`} icon={BarChart2} badge="Active" color="from-violet-500 to-purple-700" />
                        <StatCard delay={0.4} label="Binary Matched" value={`${matchedPV} PV`} icon={ArrowLeftRight} badge="Volume" color="from-orange-500 to-amber-700" />
                    </div>
                </div>

                {/* ── Operational Insights ── */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
                    
                    {/* Capping Progress */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                                <Zap className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Earnings Capping</h3>
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                            <div className="relative w-40 h-40 mx-auto mb-8">
                                <svg className="w-full h-full rotate-[-90deg]">
                                    <circle cx="80" cy="80" r="70" fill="none" stroke="#F1F5F9" strokeWidth="12" />
                                    <motion.circle 
                                        cx="80" cy="80" r="70" fill="none" stroke="#10B981" strokeWidth="12" 
                                        strokeDasharray="440"
                                        initial={{ strokeDashoffset: 440 }}
                                        whileInView={{ strokeDashoffset: 440 - (440 * cappingPct) / 100 }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-3xl font-black text-slate-800 tracking-tighter">{cappingPct.toFixed(0)}%</span>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Utilized</span>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Today Used</span>
                                    <span className="text-slate-800 font-black">₹{cappingUsed.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Daily Limit</span>
                                    <span className="text-slate-800 font-black">₹{cappingLimit.toLocaleString()}</span>
                                </div>
                                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                    <span className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Remaining</span>
                                    <span className="text-green-600 font-black">₹{Math.max(0, cappingLimit - todayEarned).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Binary Comparison */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/60 border border-slate-100"
                    >
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <ArrowLeftRight className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Binary Team Strength</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
                            {/* Left Leg */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Left Leg</p>
                                        <h4 className="text-2xl font-black text-slate-800">{leftBV.toLocaleString()} <span className="text-xs text-slate-400">BV</span></h4>
                                    </div>
                                    <span className="text-xs font-bold text-slate-300">{(leftBV / Math.max(leftBV + rightBV, 1) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(leftBV / Math.max(leftBV + rightBV, 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full`}
                                    />
                                </div>
                                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Recommendation</p>
                                    <p className="text-xs font-medium text-slate-600">
                                        {leftBV < rightBV ? "Focus on increasing Left leg volume to unlock more matching bonuses." : "Left leg is performing well. Maintain momentum."}
                                    </p>
                                </div>
                            </div>
                            {/* Right Leg */}
                            <div className="relative">
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Right Leg</p>
                                        <h4 className="text-2xl font-black text-slate-800">{rightBV.toLocaleString()} <span className="text-xs text-slate-400">BV</span></h4>
                                    </div>
                                    <span className="text-xs font-bold text-slate-300">{(rightBV / Math.max(leftBV + rightBV, 1) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="h-4 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(rightBV / Math.max(leftBV + rightBV, 1)) * 100}%` }}
                                        transition={{ duration: 1, delay: 0.5 }}
                                        className={`h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full`}
                                    />
                                </div>
                                <div className="mt-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-2">Recommendation</p>
                                    <p className="text-xs font-medium text-slate-600">
                                        {rightBV < leftBV ? "Focus on increasing Right leg volume to unlock more matching bonuses." : "Right leg is performing well. Maintain momentum."}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
                                    <Info className="w-5 h-5" />
                                </div>
                                <p className="text-xs text-slate-400 font-medium">Binary volumes are updated in real-time as users join your network.</p>
                            </div>
                            <div className="text-center sm:text-right">
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Carry Forward Volume</p>
                                <p className="text-xl font-black text-slate-800">{carryForwardBV.toLocaleString()} <span className="text-sm font-medium">BV</span></p>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* ── Transaction History ── */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden"
                >
                    <div className="px-8 py-8 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center text-white">
                                <Clock className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Matching Log</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{history.length} Recent Transactions</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
                            <Activity className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider uppercase">Live Sync Active</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-slate-50/50">
                                <tr>
                                    {['Transaction ID', 'Date', 'Matched Volume', 'Bonus Earned', 'Status', 'Action'].map(h => (
                                        <th key={h} className="px-8 py-6 text-left text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {history.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-8 py-20 text-center">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                                                <Clock className="w-8 h-8" />
                                            </div>
                                            <p className="text-slate-500 font-black uppercase text-xs tracking-widest mt-4">No records found</p>
                                            <p className="text-xs text-slate-400 mt-1">Start growing your binary tree to see transactions here.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    history.map((row) => (
                                        <tr 
                                            key={row._id} 
                                            onClick={() => setSelectedTx(row)}
                                            className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                                        >
                                            <td className="px-8 py-6">
                                                <span className="text-xs font-black text-slate-600 font-mono tracking-tight uppercase">#MB-{row._id.slice(-8)}</span>
                                            </td>
                                            <td className="px-8 py-6 text-sm font-bold text-slate-500">
                                                {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${cfg.accentBg}`} />
                                                    <span className="text-sm font-black text-slate-800">{row.matchedPV} PV</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className="text-lg font-black text-emerald-600 tracking-tight">+ ₹{row.bonusAmount.toLocaleString()}</span>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full border border-green-100 w-fit">
                                                    <CheckCircle className="w-3 h-3" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Credited</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-800 transition-colors">
                                                    View Details
                                                    <ArrowLeft className="w-3 h-3 rotate-180" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default MatchingBonusPage;
