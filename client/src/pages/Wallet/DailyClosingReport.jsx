import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Wallet, RefreshCw } from 'lucide-react';
import api from '../../api';

const DailyClosingReport = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        openingBalance: 0, closingBalance: 0,
        totalCredits: 0, totalDebits: 0
    });

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/wallet/daily-closing', {
                params: { date: selectedDate }
            });
            if (res.data.success) setData(res.data);
        } catch (err) {
            setError('System synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [selectedDate]);

    const cards = [
        { label: 'OPENING LIQUIDITY', value: data.openingBalance, badge: 'Origin', icon: Wallet, color: '#C8A96A' },
        { label: 'CLOSING LIQUIDITY', value: data.closingBalance, badge: 'Terminal', icon: Wallet, color: '#C8A96A' },
        { label: 'TOTAL INFLOW', value: data.totalCredits, badge: 'Credits', icon: TrendingUp, color: '#10b981' },
        { label: 'TOTAL OUTFLOW', value: data.totalDebits, badge: 'Debits', icon: TrendingDown, color: '#ef4444' },
    ];

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5E6C8] selection:bg-[#C8A96A]/30">
            {/* Header */}
            <div className="bg-[#0D0D0D] border-b border-[#C8A96A]/20 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <button onClick={() => navigate('/my-account/wallet')}
                            className="p-1.5 hover:bg-[#C8A96A]/10 rounded-lg transition text-[#C8A96A]">
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-lg font-serif font-bold text-[#F5E6C8] tracking-widest uppercase">Closing Audit</h1>
                            <p className="text-[8px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em]">Snapshot • Integrity Verified</p>
                        </div>
                    </div>
                    <button onClick={fetchData} className="p-2 luxury-box border-[#C8A96A]/20 hover:bg-[#C8A96A]/5 transition text-[#C8A96A]">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {/* Date Selector */}
                <div className="luxury-box p-3 bg-[#1A1A1A] border-[#C8A96A]/10 mb-8 max-w-sm">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-4 h-4 text-[#C8A96A]/40" />
                        <div className="flex flex-col flex-1">
                            <span className="text-[8px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em] mb-1">Audit Dimension</span>
                            <input type="date" value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="bg-transparent border-none text-[11px] font-black uppercase tracking-widest text-[#F5E6C8] p-0 outline-none cursor-pointer [color-scheme:dark]" />
                        </div>
                    </div>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 grayscale opacity-50">
                        <RefreshCw className="w-8 h-8 animate-spin text-[#C8A96A] mb-4" />
                        <span className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">Reconstructing State...</span>
                    </div>
                ) : error ? (
                    <div className="text-center py-20 px-4">
                        <p className="text-red-400 font-bold mb-4 uppercase text-[10px] tracking-widest">{error}</p>
                        <button onClick={fetchData} className="px-5 py-2 border border-[#C8A96A]/20 text-[#C8A96A] text-[9px] font-black uppercase tracking-widest hover:bg-[#C8A96A]/5 transition">Try Refresh</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {cards.map((card, i) => (
                            <div key={i} className="luxury-box p-5 bg-[#1A1A1A] border-[#C8A96A]/10 group hover:border-[#C8A96A]/40 transition-all shadow-2xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="p-2 border border-[#C8A96A]/10 bg-[#0D0D0D] text-[#C8A96A]/60 group-hover:text-[#C8A96A] transition-colors">
                                        <card.icon className="w-5 h-5" />
                                    </div>
                                    <div className="px-2 py-0.5 border border-[#C8A96A]/20 text-[8px] font-black text-[#C8A96A] uppercase tracking-widest">
                                        {card.badge}
                                    </div>
                                </div>
                                <p className="text-3xl font-serif font-bold text-[#F5E6C8] tracking-tight">
                                    ₹{card.value?.toLocaleString() || 0}
                                </p>
                                <p className="text-[9px] font-black text-[#C8A96A]/30 uppercase tracking-[0.2em] mt-1 group-hover:text-[#C8A96A]/50 transition-colors">
                                    {card.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {/* Audit Seal */}
                <div className="mt-20 flex flex-col items-center grayscale opacity-10">
                    <div className="w-16 h-16 border-2 border-[#C8A96A] rounded-full flex items-center justify-center mb-4">
                        <div className="w-12 h-12 border border-[#C8A96A] rounded-full flex items-center justify-center">
                            <span className="text-[8px] font-black">CERT</span>
                        </div>
                    </div>
                    <p className="text-[9px] font-black uppercase tracking-[0.5em]">Lattice Protocol • Verified Audit</p>
                </div>
            </div>
        </div>
    );
};

export default DailyClosingReport;
