import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ArrowLeft, Trophy, Target, TrendingUp, Award, 
    CheckCircle2, Lock, Star, Shield, Zap, Activity, Info 
} from 'lucide-react';
import api from '../api';

const RANKS = [
    { name: "Bronze", matchPV: 5, reward: "Company Catalog", color: "bg-[#B87333]", accent: "orange" },
    { name: "Silver", matchPV: 25, reward: "₹1,200", color: "bg-[#71717A]", accent: "slate" },
    { name: "Gold", matchPV: 50, reward: "₹2,500", color: "bg-[#D4AF37]", accent: "amber" },
    { name: "Platinum", matchPV: 100, reward: "₹5,000 + NT", color: "bg-[#334155]", accent: "slate" },
    { name: "Star", matchPV: 200, reward: "₹10,000 + NT", color: "bg-[#7C3AED]", accent: "violet" },
    { name: "Ruby", matchPV: 500, reward: "₹50,000", color: "bg-[#DC2626]", accent: "red" },
    { name: "Sapphire", matchPV: 1000, reward: "₹1 Lakh + India Trip", color: "bg-[#2563EB]", accent: "blue" },
    { name: "Star Sapphire", matchPV: 2500, reward: "₹5 Lakh + India Trip (Couple)", color: "bg-[#0EA5E9]", accent: "sky" },
    { name: "Emerald", matchPV: 6000, reward: "₹7 Lakh", color: "bg-[#059669]", accent: "emerald" },
    { name: "Diamond", matchPV: 30000, reward: "₹10 Lakh", color: "bg-[#18181B]", accent: "slate" },
    { name: "Double Diamond", matchPV: 70000, reward: "₹15 Lakh", color: "bg-[#09090B]", accent: "slate" },
    { name: "Blue Diamond", matchPV: 125000, reward: "₹30 Lakh", color: "bg-[#1E3A8A]", accent: "blue" },
    { name: "Ambassador", matchPV: 300000, reward: "₹1 Crore", color: "bg-[#4C1D95]", accent: "purple" },
    { name: "Crown", matchPV: 700000, reward: "₹2.5 Crore", color: "bg-[#92400E]", accent: "amber" },
    { name: "MD", matchPV: 1500000, reward: "₹5 Crore", color: "bg-[#450A0A]", accent: "red" },
];

const StatCard = ({ label, value, icon: Icon, color, isPoints }) => (
    <div className="bg-white border border-slate-100 rounded-[2rem] p-5 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div className={`p-2.5 rounded-xl ${color} text-white shadow-sm`}>
                <Icon className="w-5 h-5 md:w-6 md:h-6" />
            </div>
        </div>
        <div>
            <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter leading-none mb-1 uppercase">
                {value}{isPoints && <span className="text-[10px] ml-1 text-slate-400 uppercase">PV</span>}
            </p>
            <p className="text-[9px] md:text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</p>
        </div>
    </div>
);

const MyRank = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/mlm/get-stats')
            .then(res => setStats(res.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const matchedPV = Number(stats?.matchedPV || 0);
    const personalPV = Number(stats?.pv || 0);
    const currentRankName = stats?.rank || 'Member';
    const currentRankIdx = RANKS.findIndex(r => r.name === currentRankName);
    const currentRank = RANKS[currentRankIdx] || { name: 'Member', color: 'bg-emerald-600', accent: 'emerald' };
    const nextRank = RANKS[currentRankIdx + 1] || null;
    const progressPct = nextRank ? Math.min((matchedPV / nextRank.matchPV) * 100, 100) : 100;

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
            <div className="text-center">
                <div className="w-14 h-14 border-4 border-slate-200 border-t-emerald-500 rounded-full mb-6 mx-auto animate-spin" />
                <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Analyzing Achievements...</p>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8FAFC] pb-20 relative overflow-hidden">
            {/* ── Background Blobs ── */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-400/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[10%] left-[-5%] w-[500px] h-[500px] bg-blue-400/10 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 p-4 md:p-8 max-w-5xl mx-auto">
                {/* ── Header ── */}
                <div className="flex items-center gap-6 mb-8 md:mb-10">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-lg shadow-slate-200/50 text-slate-400 hover:text-slate-600 transition"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-tighter leading-none mb-1">My Rank</h1>
                        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Lifetime Achievement Journey</p>
                    </div>
                </div>

                {/* ── Current Rank Hero Card ── */}
                <div
                    className={`${currentRank.color} rounded-[2rem] md:rounded-[2.5rem] p-6 md:p-10 text-white shadow-2xl mb-10 border border-black/5 relative overflow-hidden`}
                >
                    <div className="relative z-10">
                        {/* Rank Identification */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 md:mb-10 border-b border-white/10 pb-6 md:pb-10">
                            <div className="flex items-center gap-4 md:gap-6">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white shadow-xl rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center shrink-0">
                                    <Trophy className="w-8 h-8 md:w-10 md:h-10 text-slate-900" />
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] md:text-[11px] font-black text-white/80 uppercase tracking-widest mb-1">Current Achievement</p>
                                    <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase truncate leading-none">{currentRankName}</h2>
                                </div>
                            </div>
                            <div className="bg-black/10 px-6 py-4 rounded-2xl md:rounded-3xl border border-white/5">
                                <p className="text-[10px] md:text-[11px] font-black text-white/70 uppercase tracking-widest mb-1">Total Matched PV</p>
                                <p className="text-3xl md:text-4xl font-black tracking-tighter tabular-nums leading-none">{matchedPV.toLocaleString('en-IN')}</p>
                            </div>
                        </div>

                        {/* Progress Bar Area */}
                        {nextRank ? (
                            <div className="bg-black/10 p-5 md:p-6 rounded-[1.75rem] md:rounded-[2rem] border border-white/5">
                                <div className="flex justify-between items-end mb-4">
                                    <div className="min-w-0">
                                        <p className="text-[10px] md:text-[11px] font-black text-white/70 uppercase tracking-widest mb-2">Next Target: {nextRank.name}</p>
                                        <div className="flex items-center gap-2">
                                            <Zap className="w-4 h-4 text-white" />
                                            <p className="text-sm font-bold truncate">
                                                <span className="font-black">{(nextRank.matchPV - matchedPV).toLocaleString('en-IN')} PV</span> more to go
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 ml-4">
                                        <p className="text-2xl font-black text-white tabular-nums leading-none">{(progressPct || 0).toFixed(1)}%</p>
                                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mt-1">Progress</p>
                                    </div>
                                </div>
                                <div className="h-3 md:h-4 w-full bg-white/10 rounded-full overflow-hidden border border-white/5">
                                    <div
                                        style={{ width: `${progressPct}%` }}
                                        className="h-full bg-white rounded-full transition-all duration-1000"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="py-6 bg-black/10 rounded-[2rem] border border-white/5 text-center">
                                <Star className="w-8 h-8 text-amber-300 mx-auto mb-2 animate-bounce" />
                                <h3 className="text-xl font-black uppercase tracking-widest">Ultimate Rank Achieved: MD</h3>
                            </div>
                        )}

                        <div className="mt-6 flex items-center gap-2.5 px-4 py-3 bg-black/20 rounded-xl w-fit">
                            <Info className="w-4 h-4 text-white/80 shrink-0" />
                            <p className="text-[9px] font-black uppercase tracking-[0.05em] leading-tight text-white/90">Equal matching PV required on Left & Right legs</p>
                        </div>
                    </div>
                </div>

                {/* ── Stats Row ── */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
                    <StatCard
                        label="Personal PV" isPoints
                        value={personalPV.toLocaleString('en-IN')}
                        icon={Shield} color="bg-indigo-600"
                    />
                    <StatCard
                        label="Matching Bonus"
                        value={`₹${Number(stats?.totalMatchingBonus || 0).toLocaleString('en-IN')}`}
                        icon={TrendingUp} color="bg-emerald-600"
                    />
                    <StatCard
                        label="Direct Income"
                        value={`₹${Number(stats?.totalDirectIncome || 0).toLocaleString('en-IN')}`}
                        icon={Zap} color="bg-amber-600"
                    />
                    <StatCard
                        label="Level Income"
                        value={`₹${Number(stats?.totalLevelIncome || 0).toLocaleString('en-IN')}`}
                        icon={Award} color="bg-purple-600"
                    />
                </div>

                {/* ── Rank Journey Timeline ── */}
                <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
                    <div className="p-6 md:p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                                <Award className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">The Rank Journey</h3>
                                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Achieve milestones, unlock rewards</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-50 self-start md:self-auto">
                            <Activity className="w-3.5 h-3.5 text-slate-400" />
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Unlock Status</span>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <div className="space-y-4">
                            {RANKS.filter(rank => matchedPV < rank.matchPV).map((rank) => {
                                const isNext = nextRank?.name === rank.name;

                                return (
                                    <div
                                        key={rank.name}
                                        className={`flex items-center gap-4 p-5 rounded-[1.75rem] border transition-all duration-300 ${isNext ? 'bg-amber-50/80 border-amber-200 ring-4 ring-amber-100/50 shadow-xl' : 'bg-white border-slate-100 shadow-sm'}`}
                                    >
                                        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl flex items-center justify-center bg-slate-100 text-slate-400">
                                            <Lock className="w-4 h-4 md:w-5 md:h-5 text-slate-300" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-2 mb-1">
                                                <h4 className="text-lg md:text-xl font-black tracking-tight text-slate-800 uppercase">
                                                    {rank.name}
                                                </h4>
                                                {isNext && (
                                                    <span className="px-3 py-1 bg-slate-900 text-white text-[8px] font-black uppercase tracking-widest rounded-full">
                                                        Target
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Target className="w-3.5 h-3.5 text-slate-400" />
                                                <p className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-widest leading-none">Req: {rank.matchPV.toLocaleString()} PV</p>
                                            </div>
                                        </div>

                                        <div className="text-right flex flex-col items-end gap-1">
                                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Benefit</p>
                                            <div className="px-5 py-2 rounded-xl text-xs font-black tracking-tight uppercase bg-slate-100 text-slate-700 border border-slate-200">
                                                {rank.reward}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyRank;
