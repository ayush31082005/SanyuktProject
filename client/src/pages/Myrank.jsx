import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, TrendingUp, Award, CheckCircle2, Lock } from 'lucide-react';
import api from '../api';

const RANKS = [
    { name: "Bronze", matchPV: 5, reward: "Company Catalog", color: "#cd7f32", bg: "#fff7ed" },
    { name: "Silver", matchPV: 25, reward: "₹1,200", color: "#64748b", bg: "#f8fafc" },
    { name: "Gold", matchPV: 50, reward: "₹2,500", color: "#d97706", bg: "#fffbeb" },
    { name: "Platinum", matchPV: 100, reward: "₹5,000 + NT", color: "#3b82f6", bg: "#eff6ff" },
    { name: "Star", matchPV: 200, reward: "₹10,000 + NT", color: "#8b5cf6", bg: "#f5f3ff" },
    { name: "Ruby", matchPV: 500, reward: "₹50,000", color: "#ef4444", bg: "#fef2f2" },
    { name: "Sapphire", matchPV: 1000, reward: "₹1 Lakh + India Trip", color: "#06b6d4", bg: "#ecfeff" },
    { name: "Star Sapphire", matchPV: 2500, reward: "₹5 Lakh + India Trip (Couple)", color: "#0ea5e9", bg: "#f0f9ff" },
    { name: "Emerald", matchPV: 6000, reward: "₹7 Lakh", color: "#10b981", bg: "#ecfdf5" },
    { name: "Diamond", matchPV: 30000, reward: "₹10 Lakh", color: "#0A7A2F", bg: "#f0fdf4" },
    { name: "Double Diamond", matchPV: 70000, reward: "₹15 Lakh", color: "#065f23", bg: "#dcfce7" },
    { name: "Blue Diamond", matchPV: 125000, reward: "₹30 Lakh", color: "#1d4ed8", bg: "#dbeafe" },
    { name: "Ambassador", matchPV: 300000, reward: "₹1 Crore", color: "#7c3aed", bg: "#ede9fe" },
    { name: "Crown", matchPV: 700000, reward: "₹2.5 Crore", color: "#be185d", bg: "#fce7f3" },
    { name: "MD", matchPV: 1500000, reward: "₹5 Crore", color: "#92400e", bg: "#fef3c7" },
];

const MyRank = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const headerRef = useRef(null);

    useEffect(() => {
        api.get('/mlm/get-stats')
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const matchedPV = Number(stats?.matchedPV || 0);
    const currentRank = stats?.rank || 'Member';

    const currentRankIdx = RANKS.findIndex(r => r.name === currentRank);
    const nextRank = RANKS[currentRankIdx + 1] || null;
    const progressPct = nextRank
        ? Math.min((matchedPV / nextRank.matchPV) * 100, 100)
        : 100;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="p-4 md:p-6 max-w-4xl mx-auto bg-gray-50 min-h-screen">

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-6">
                <button onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition group active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-800">My Rank</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Lifetime matching achievement</p>
                </div>
            </motion.div>

            {/* Current Rank Hero Card */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
                className="rounded-3xl p-6 mb-6 text-white shadow-xl"
                style={{ background: `linear-gradient(135deg, ${RANKS.find(r => r.name === currentRank)?.color || '#0A7A2F'}, ${RANKS.find(r => r.name === currentRank)?.color || '#0A7A2F'}99)` }}>
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                            <Trophy className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Current Rank</p>
                            <p className="text-3xl font-black">{currentRank}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-white/70 text-xs font-black uppercase tracking-widest mb-1">Matched PV</p>
                        <p className="text-2xl font-black">{matchedPV.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                {/* Progress to next rank */}
                {nextRank ? (
                    <div>
                        <div className="flex justify-between text-xs font-black text-white/70 mb-2">
                            <span>Progress to {nextRank.name}</span>
                            <span>{progressPct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-1.5">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${progressPct}%` }}
                                transition={{ duration: 1.5, ease: "easeOut" }}
                                className="h-full bg-white rounded-full"
                            />
                        </div>
                        <p className="text-white/70 text-xs">
                            <span className="font-black text-white">{Math.max(0, nextRank.matchPV - matchedPV).toLocaleString('en-IN')} PV</span> aur chahiye {nextRank.name} ke liye
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-2 bg-white/10 rounded-2xl">
                        <p className="text-white font-black text-sm">🏆 Highest Rank Achieved — MD!</p>
                    </div>
                )}
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Matching Bonus', value: `₹${Number(stats?.totalMatchingBonus || 0).toLocaleString('en-IN')}`, color: '#0A7A2F' },
                    { label: 'Direct Income', value: `₹${Number(stats?.totalDirectIncome || 0).toLocaleString('en-IN')}`, color: '#F7931E' },
                    { label: 'Level Income', value: `₹${Number(stats?.totalLevelIncome || 0).toLocaleString('en-IN')}`, color: '#8b5cf6' },
                ].map(({ label, value, color }, i) => (
                    <motion.div key={label}
                        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 + i * 0.05 }}
                        className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm text-center">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
                        <p className="text-lg font-black" style={{ color }}>{value}</p>
                    </motion.div>
                ))}
            </div>

            {/* All Ranks Journey */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
                    <Award className="w-5 h-5 text-green-600" />
                    <h2 className="text-base font-black text-gray-700">Rank Journey</h2>
                </div>

                <div className="divide-y divide-slate-50">
                    {RANKS.map((rank, i) => {
                        const achieved = matchedPV >= rank.matchPV;
                        const isCurrent = rank.name === currentRank;
                        const isNext = nextRank?.name === rank.name;
                        const pct = Math.min((matchedPV / rank.matchPV) * 100, 100);

                        return (
                            <motion.div key={rank.name}
                                initial={{ opacity: 0, x: -12 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.18 + i * 0.04 }}
                                className={`px-5 py-4 flex items-center gap-4 transition-all
                                    ${isCurrent ? 'bg-green-50' : isNext ? 'bg-amber-50' : ''}`}>

                                {/* Rank number / check */}
                                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: achieved ? rank.color : '#f1f5f9' }}>
                                    {achieved
                                        ? <CheckCircle2 size={18} className="text-white" />
                                        : <Lock size={15} className="text-slate-400" />}
                                </div>

                                {/* Rank info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-black text-slate-800">{rank.name}</p>
                                        {isCurrent && (
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                                                Current
                                            </span>
                                        )}
                                        {isNext && !achieved && (
                                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">
                                                Next Target
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] text-slate-400 font-bold">
                                            {rank.matchPV.toLocaleString('en-IN')} PV : {rank.matchPV.toLocaleString('en-IN')} PV
                                        </span>
                                        {isNext && !achieved && (
                                            <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full rounded-full bg-amber-400 transition-all duration-1000"
                                                    style={{ width: `${pct}%` }} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Reward */}
                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black" style={{ color: achieved ? rank.color : '#94a3b8' }}>
                                        {rank.reward}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

        </div>
    );
};

export default MyRank;
