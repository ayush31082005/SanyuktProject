import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, TrendingUp, Zap, Shield, Star, Activity,
    ChevronRight, BarChart2, ArrowLeftRight, Clock
} from 'lucide-react';
import api from '../../api';

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
        gradient: 'from-slate-400 to-slate-600',
        gradientLight: 'from-slate-50 to-slate-100',
        accentColor: 'text-slate-600',
        accentBg: 'bg-slate-100',
        accentBorder: 'border-slate-200',
        badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
        progressColor: 'bg-slate-500',
        ringColor: 'ring-slate-400',
        iconColor: 'text-slate-500',
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
        gradient: 'from-yellow-400 to-yellow-600',
        gradientLight: 'from-yellow-50 to-amber-50',
        accentColor: 'text-yellow-600',
        accentBg: 'bg-yellow-50',
        accentBorder: 'border-yellow-200',
        badgeBg: 'bg-yellow-100 text-yellow-700 border-yellow-200',
        progressColor: 'bg-yellow-500',
        ringColor: 'ring-yellow-400',
        iconColor: 'text-yellow-500',
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
        gradient: 'from-orange-400 to-orange-600',
        gradientLight: 'from-orange-50 to-red-50',
        accentColor: 'text-orange-600',
        accentBg: 'bg-orange-50',
        accentBorder: 'border-orange-200',
        badgeBg: 'bg-orange-100 text-orange-700 border-orange-200',
        progressColor: 'bg-orange-500',
        ringColor: 'ring-orange-400',
        iconColor: 'text-orange-500',
        emoji: '💎',
    },
};

// ─── MatchingBonusPage ────────────────────────────────────────────────────────
const MatchingBonusPage = ({ type }) => {
    const navigate = useNavigate();
    const cfg = CONFIG[type];
    const Icon = cfg.icon;

    const cardsRef = useRef([]);
    const rowsRef = useRef([]);
    const tableRef = useRef(null);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ── Fetch ─────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get(`/mlm/matching-bonus/${type}`);
                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [type]);

    // ── Animations ────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!data) return;
        const header = document.getElementById('match-page-header');
        if (header) header.classList.add('anim-slide-down');

        const cardObs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('anim-slide-up'), i * 100);
                    cardObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cardsRef.current.forEach(c => c && cardObs.observe(c));

        const rowObs = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('anim-slide-left'), i * 70);
                    rowObs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.05 });
        rowsRef.current.forEach(r => r && rowObs.observe(r));

        if (tableRef.current) {
            const tObs = new IntersectionObserver((entries) => {
                entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('anim-slide-up'); tObs.unobserve(e.target); } });
            }, { threshold: 0.1 });
            tObs.observe(tableRef.current);
        }
    }, [data]);

    // ── Loading ───────────────────────────────────────────────────────────────
    if (loading) return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <div className={`w-12 h-12 border-4 border-t-transparent rounded-full animate-spin mx-auto mb-4 ${cfg.accentBorder} border-${cfg.progressColor.replace('bg-', '')}`}
                    style={{ borderColor: type === 'gold' ? '#eab308' : type === 'diamond' ? '#f97316' : '#94a3b8', borderTopColor: 'transparent' }} />
                <p className="text-gray-500 text-sm font-medium">Loading {cfg.label} data…</p>
            </div>
        </div>
    );

    // ── Error ─────────────────────────────────────────────────────────────────
    if (error) return (
        <div className="p-6 max-w-7xl mx-auto min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center bg-white rounded-xl p-8 border border-red-100 shadow-sm">
                <p className="text-red-500 font-bold text-lg mb-2">⚠️ Error</p>
                <p className="text-gray-500 text-sm">{error}</p>
                <button onClick={() => window.location.reload()}
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition">
                    Retry
                </button>
            </div>
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
        matchedPV = 0,
        userHasPackage = false,
        history = [],
        config: pkgCfg = {},
    } = data || {};

    const cappingPct = cappingLimit > 0 ? Math.min((cappingUsed / cappingLimit) * 100, 100) : 0;

    // ─────────────────────────────────────────────────────────────────────────
    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">

            {/* ── Animated CSS ── */}
            <style>{`
                @keyframes slideDown  { from { opacity:0; transform:translateY(-28px) } to { opacity:1; transform:translateY(0) } }
                @keyframes slideUp    { from { opacity:0; transform:translateY(28px)  } to { opacity:1; transform:translateY(0) } }
                @keyframes slideLeft  { from { opacity:0; transform:translateX(28px)  } to { opacity:1; transform:translateX(0) } }
                @keyframes pulseSlow  { 0%,100%{opacity:1} 50%{opacity:.7} }
                .anim-slide-down  { animation: slideDown 0.55s ease-out forwards }
                .anim-slide-up    { animation: slideUp  0.55s ease-out forwards }
                .anim-slide-left  { animation: slideLeft 0.5s ease-out forwards }
                .anim-pulse-slow  { animation: pulseSlow 2.5s ease-in-out infinite }
                .no-opacity       { opacity: 0 }
            `}</style>

            {/* ── Header ── */}
            <div id="match-page-header" className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 no-opacity">
                <button onClick={() => navigate(-1)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all w-fit group active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div className="flex items-center gap-3">
                    <span className="text-3xl">{cfg.emoji}</span>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-gray-800">{cfg.label}</h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Binary tree matching income — {cfg.price} package · Daily cap {cfg.capping}
                        </p>
                    </div>
                </div>
            </div>

            {/* ── Package Banner ── */}
            <div ref={el => cardsRef.current[0] = el}
                className={`no-opacity bg-gradient-to-r ${cfg.gradient} rounded-2xl p-5 mb-6 text-white shadow-lg flex flex-col sm:flex-row sm:items-center gap-4`}>
                <div className="flex items-center gap-3 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0">
                        <Icon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                        <p className="text-white/70 text-xs font-bold uppercase tracking-widest">{cfg.label} Package</p>
                        <p className="text-2xl font-black">{cfg.price}</p>
                    </div>
                </div>
                <div className="flex gap-6 flex-wrap">
                    <div className="text-center">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">BV</p>
                        <p className="text-lg font-black">{cfg.bv}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">PV</p>
                        <p className="text-lg font-black">{cfg.pv}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-white/60 text-[10px] uppercase tracking-widest font-bold">Daily Cap</p>
                        <p className="text-lg font-black">{cfg.capping}</p>
                    </div>
                    <div className="flex items-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider 
                            ${userHasPackage ? 'bg-white/20 text-white' : 'bg-white/10 text-white/60'}`}>
                            {userHasPackage ? '✓ Active' : 'Not Active'}
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Total Earned', value: `₹${totalEarned.toLocaleString('en-IN')}`, icon: TrendingUp, badge: 'Total', idx: 1 },
                    { label: 'This Month', value: `₹${thisMonth.toLocaleString('en-IN')}`, icon: BarChart2, badge: 'Month', idx: 2 },
                    { label: "Today's Earning", value: `₹${todayEarned.toLocaleString('en-IN')}`, icon: Activity, badge: 'Today', idx: 3 },
                    { label: 'Carry Forward BV', value: carryForwardBV.toLocaleString('en-IN'), icon: ArrowLeftRight, badge: 'Carry', idx: 4 },
                ].map(({ label, value, icon: CardIcon, badge, idx }) => (
                    <div key={label}
                        ref={el => cardsRef.current[idx] = el}
                        className="no-opacity bg-white rounded-xl border border-gray-200 shadow-sm p-4 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center justify-between mb-2">
                            <CardIcon className={`w-6 h-6 ${cfg.iconColor}`} />
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.badgeBg}`}>{badge}</span>
                        </div>
                        <p className="text-xl font-black text-gray-800">{value}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{label}</p>
                    </div>
                ))}
            </div>

            {/* ── Capping Meter + Legs Row ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">

                {/* Daily Capping Meter */}
                <div ref={el => cardsRef.current[5] = el}
                    className="no-opacity bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Zap className={`w-5 h-5 ${cfg.iconColor}`} />
                            <span className="text-sm font-black text-gray-700">Daily Capping</span>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${cfg.badgeBg}`}>
                            {cappingPct.toFixed(0)}% Used
                        </span>
                    </div>
                    <div className="flex justify-between text-sm font-bold text-gray-600 mb-2">
                        <span>₹{cappingUsed.toLocaleString('en-IN')} used</span>
                        <span>₹{cappingLimit.toLocaleString('en-IN')} limit</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3">
                        <div className={`${cfg.progressColor} h-3 rounded-full transition-all duration-1000`}
                            style={{ width: `${cappingPct}%` }} />
                    </div>
                    <p className="text-xs text-gray-400 mt-2">
                        Remaining: <span className="font-bold text-gray-600">₹{Math.max(0, cappingLimit - cappingUsed).toLocaleString('en-IN')}</span>
                    </p>
                </div>

                {/* Left vs Right BV Legs */}
                <div ref={el => cardsRef.current[6] = el}
                    className="no-opacity bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <ArrowLeftRight className={`w-5 h-5 ${cfg.iconColor}`} />
                        <span className="text-sm font-black text-gray-700">Binary Leg Balance</span>
                    </div>
                    <div className="flex justify-between items-end gap-4">
                        {/* Left Leg */}
                        <div className="flex-1 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Left Leg</p>
                            <div className="w-full bg-gray-100 rounded-lg h-16 flex items-end justify-center overflow-hidden">
                                <div className={`${cfg.progressColor} opacity-70 rounded-t-lg w-full transition-all duration-1000`}
                                    style={{ height: `${Math.min((leftBV / (Math.max(leftBV, rightBV, 1))) * 100, 100)}%` }} />
                            </div>
                            <p className="text-sm font-black text-gray-700 mt-1">{leftBV.toLocaleString('en-IN')} BV</p>
                        </div>
                        {/* Matched indicator */}
                        <div className="text-center shrink-0">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Matched</p>
                            <p className={`text-base font-black ${cfg.accentColor}`}>{matchedPV} PV</p>
                        </div>
                        {/* Right Leg */}
                        <div className="flex-1 text-center">
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Right Leg</p>
                            <div className="w-full bg-gray-100 rounded-lg h-16 flex items-end justify-center overflow-hidden">
                                <div className={`${cfg.progressColor} opacity-70 rounded-t-lg w-full transition-all duration-1000`}
                                    style={{ height: `${Math.min((rightBV / (Math.max(leftBV, rightBV, 1))) * 100, 100)}%` }} />
                            </div>
                            <p className="text-sm font-black text-gray-700 mt-1">{rightBV.toLocaleString('en-IN')} BV</p>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-3 text-center">
                        Carry Forward: <span className="font-bold text-gray-600">{carryForwardBV.toLocaleString('en-IN')} BV</span>
                    </p>
                </div>
            </div>

            {/* ── Matching History Table ── */}
            <div ref={tableRef}
                className="no-opacity bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Clock className={`w-5 h-5 ${cfg.iconColor}`} />
                        <h2 className="text-base font-black text-gray-700">Matching History</h2>
                    </div>
                    <span className={`text-xs font-bold px-3 py-1 rounded-full border ${cfg.badgeBg}`}>
                        {history.length} records
                    </span>
                </div>

                {history.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <div className="text-4xl mb-3">📭</div>
                        <p className="text-sm font-bold text-gray-400">No matching history yet</p>
                        <p className="text-xs text-gray-300 mt-1">
                            {userHasPackage
                                ? 'Build your left & right teams to start earning matching bonus'
                                : `Activate ${cfg.label} package (${cfg.price}) to earn this bonus`}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[520px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['Date', 'Description', 'Matched PV', 'Bonus Amount', 'Status'].map(h => (
                                        <th key={h} className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {history.map((row, i) => (
                                    <tr key={row._id}
                                        ref={el => rowsRef.current[i] = el}
                                        className="no-opacity hover:bg-gray-50 transition-colors duration-200">
                                        <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(row.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-700 max-w-[200px] truncate">
                                            {row.description}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            {row.matchedPV != null ? (
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold border ${cfg.badgeBg}`}>
                                                    {row.matchedPV} PV
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-sm font-black text-green-600 whitespace-nowrap">
                                            ₹{row.bonusAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                                                Credited
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </div>
    );
};

export default MatchingBonusPage;
