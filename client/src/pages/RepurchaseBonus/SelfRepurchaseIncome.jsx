import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Layers, ChevronDown } from 'lucide-react';
import api from '../../api'; // ✅ apna path check kar lena

const SelfRepurchaseIncome = () => {
    const navigate = useNavigate();
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const rowsRef = useRef([]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ Real API call
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/repurchase/level-income');
                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Animations
    useEffect(() => {
        if (!data) return;

        const header = document.getElementById('page-header');
        if (header) header.classList.add('animate-slideDown');

        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-slideUp-visible');
                    }, index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        cardsRef.current.forEach((card) => {
            if (card) cardObserver.observe(card);
        });

        const rowObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-slideLeft-visible');
                    }, index * 80);
                    rowObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        rowsRef.current.forEach((row) => {
            if (row) rowObserver.observe(row);
        });

        if (tableRef.current) {
            const tableObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slideUp-visible');
                        tableObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            tableObserver.observe(tableRef.current);
        }
    }, [data]);

    // ─── Loading State ───
    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Loading income data...</p>
                </div>
            </div>
        );
    }

    // ─── Error State ───
    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center bg-white rounded-xl p-8 border border-red-100 shadow-sm">
                    <p className="text-red-500 font-bold text-lg mb-2">⚠️ Error</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const {
        totalLevelIncome = 0,
        activeDownline = 0,
        activeLevels = 0,
        generationBreakdown = [],
        recentTransactions = [],
    } = data || {};

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">

            {/* ── Header ── */}
            <div id="page-header" className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 opacity-0">
                <button
                    onClick={() => navigate('/my-account/bonus/repurchase')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 w-fit group active:scale-95"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Repurchase Level Income</h1>
                    <p className="text-sm text-gray-500 mt-1">Multi-level earnings from team repurchases</p>
                </div>
            </div>

            {/* ── Stats Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {/* Total Income */}
                <div
                    ref={(el) => (cardsRef.current[0] = el)}
                    className="stats-card bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-3">
                        <TrendingUp className="w-8 h-8 text-green-600 icon-bounce" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Total</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">₹{totalLevelIncome.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Level Income</p>
                </div>

                {/* Active Downline */}
                <div
                    ref={(el) => (cardsRef.current[1] = el)}
                    className="stats-card bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Users className="w-8 h-8 text-green-600 icon-pulse" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Active</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{activeDownline}</p>
                    <p className="text-xs text-gray-500 mt-1">Active Downline</p>
                </div>

                {/* Active Levels */}
                <div
                    ref={(el) => (cardsRef.current[2] = el)}
                    className="stats-card bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Layers className="w-8 h-8 text-green-600 icon-pulse" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Levels</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{activeLevels}</p>
                    <p className="text-xs text-gray-500 mt-1">Active Levels</p>
                </div>
            </div>

            {/* ── Generation Breakdown Cards ── */}
            {generationBreakdown.length > 0 && (
                <div className="mb-6">
                    <h2 className="text-base font-black text-gray-700 mb-3 px-1">Generation Breakdown</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                        {generationBreakdown.map((gen, index) => (
                            <div
                                key={gen.generation}
                                ref={(el) => (cardsRef.current[3 + index] = el)}
                                className="stats-card bg-white p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                            >
                                {/* Level Badge + Income */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-full bg-green-100 text-green-700 text-xs font-black flex items-center justify-center border border-green-200">
                                            L{gen.generation}
                                        </span>
                                        <span className="text-sm font-bold text-gray-700">Level {gen.generation}</span>
                                    </div>
                                    <span className="text-lg font-black text-green-600">
                                        ₹{gen.totalIncome.toLocaleString('en-IN')}
                                    </span>
                                </div>

                                {/* Commission % */}
                                <p className="text-xs text-gray-500 mb-3">{gen.commissionPercent}% Commission</p>

                                {/* Stats row */}
                                <div className="flex justify-between text-xs text-gray-500 mb-2">
                                    <span>Downline Members</span>
                                    <span className="font-bold text-gray-700">{gen.downlineMembers}</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mb-3">
                                    <span>Business Volume</span>
                                    <span className="font-bold text-gray-700">₹{gen.totalBV.toLocaleString('en-IN')}</span>
                                </div>

                                {/* Progress bar */}
                                <div className="w-full bg-gray-100 rounded-full h-1.5">
                                    <div
                                        className="bg-green-500 h-1.5 rounded-full transition-all duration-700"
                                        style={{ width: `${Math.min(gen.commissionPercent * 6, 100)}%` }}
                                    />
                                </div>
                                <p className="text-right text-xs text-green-600 font-bold mt-1">{gen.commissionPercent}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* ── Recent Transactions Table ── */}
            <div
                ref={tableRef}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-0"
            >
                <div className="px-5 py-4 border-b border-gray-100">
                    <h2 className="text-base font-black text-gray-700">Recent Transactions</h2>
                </div>

                {recentTransactions.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 text-sm">
                        No transactions yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[560px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Date</th>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">From Member</th>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Generation</th>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">BV</th>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Commission</th>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-5 py-3 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentTransactions.map((tx, index) => (
                                    <tr
                                        key={tx._id}
                                        ref={(el) => (rowsRef.current[index] = el)}
                                        className="table-row hover:bg-gray-50 transition-all duration-300 cursor-pointer opacity-0"
                                    >
                                        <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {new Date(tx.createdAt).toLocaleDateString('en-IN')}
                                        </td>
                                        <td className="px-5 py-3 text-sm font-medium text-gray-800 whitespace-nowrap">
                                            {tx.fromUserId?.name || 'N/A'}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                                                Gen {tx.generation}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {tx.bv}
                                        </td>
                                        <td className="px-5 py-3 text-sm text-gray-600 whitespace-nowrap">
                                            {tx.commissionPercent}%
                                        </td>
                                        <td className="px-5 py-3 text-sm font-bold text-green-600 whitespace-nowrap">
                                            ₹{tx.commissionAmount.toLocaleString('en-IN')}
                                        </td>
                                        <td className="px-5 py-3 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block status-badge
                                                ${tx.status === 'credited'
                                                    ? 'bg-green-100 text-green-700'
                                                    : tx.status === 'pending'
                                                        ? 'bg-yellow-100 text-yellow-700'
                                                        : 'bg-red-100 text-red-700'
                                                }`}>
                                                {tx.status.charAt(0).toUpperCase() + tx.status.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* ── Animation Styles ── */}
            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideLeft {
                    from { opacity: 0; transform: translateX(30px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes pulseIcon {
                    0%, 100% { transform: scale(1); opacity: 1; }
                    50%      { transform: scale(1.1); opacity: 0.8; }
                }
                @keyframes bounceIcon {
                    0%, 100% { transform: translateY(0); }
                    50%      { transform: translateY(-5px); }
                }
                @keyframes badgePulse {
                    0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(34,197,94,0.3); }
                    50%      { opacity: 0.9; box-shadow: 0 0 0 4px rgba(34,197,94,0.1); }
                }
                .animate-slideDown         { animation: slideDown 0.6s ease-out forwards; }
                .animate-slideUp-visible   { animation: slideUp 0.6s ease-out forwards; }
                .animate-slideLeft-visible { animation: slideLeft 0.6s ease-out forwards; }
                .icon-pulse  { animation: pulseIcon 2s ease-in-out infinite; }
                .icon-bounce { animation: bounceIcon 2s ease-in-out infinite; }
                .status-badge { animation: badgePulse 2s ease-in-out infinite; }
                .stats-card:hover .icon-pulse,
                .stats-card:hover .icon-bounce { animation-duration: 1s; }
                @media (max-width: 640px) {
                    .stats-card:active { transform: scale(0.98); transition: transform 0.1s ease; }
                }
            `}</style>
        </div>
    );
};

export default SelfRepurchaseIncome;
