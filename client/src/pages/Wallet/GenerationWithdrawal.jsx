import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Clock, RefreshCw, ChevronRight } from 'lucide-react';
import api from '../../api';

const GenerationWithdrawal = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const res = await api.get('/wallet/withdrawal-history');
                if (res.data.success) {
                    setWithdrawals(res.data.withdrawals || []);
                }
            } catch (err) {
                console.error("Error fetching withdrawals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWithdrawals();
    }, []);

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Approved': case 'Completed': return 'text-green-500 bg-green-500/5 border-green-500/20';
            case 'Pending': return 'text-orange-500 bg-orange-500/5 border-orange-500/20';
            default: return 'text-red-500 bg-red-500/5 border-red-500/20';
        }
    };

    return (
        <div className="min-h-screen bg-[#0D0D0D] text-[#F5E6C8] selection:bg-[#C8A96A]/30">
            {/* Header */}
            <div className="bg-[#0D0D0D] border-b border-[#C8A96A]/20 sticky top-0 z-30">
                <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-3">
                    <button onClick={() => navigate('/my-account/wallet/generation')}
                        className="p-1.5 hover:bg-[#C8A96A]/10 rounded-lg transition text-[#C8A96A]">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="text-lg font-serif font-bold text-[#F5E6C8] tracking-widest uppercase">Generation Payouts</h1>
                        <p className="text-[8px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em]">Network Yield Settlement Audit</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="luxury-box bg-[#1A1A1A] border-[#C8A96A]/10 overflow-hidden shadow-2xl">
                    {loading ? (
                        <div className="py-24 flex flex-col items-center justify-center">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A96A] mb-4" />
                            <p className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">Parsing Settlement Feed...</p>
                        </div>
                    ) : withdrawals.length === 0 ? (
                        <div className="py-24 text-center opacity-30">
                            <Clock className="w-16 h-16 mx-auto mb-4 text-[#C8A96A]" strokeWidth={1} />
                            <p className="text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.3em]">No Recorded Distribution Events</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#0D0D0D] border-b border-[#C8A96A]/10">
                                        {['SETTLEMENT DATE', 'DISTRIBUTION AMT', 'STATUS', 'MANIFEST REMARK', 'ACTION'].map(h => (
                                            <th key={h} className="px-6 py-4 text-left text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#C8A96A]/5">
                                    {withdrawals.map((w, i) => (
                                        <tr key={i} className="group hover:bg-[#C8A96A]/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-xs font-bold text-[#F5E6C8]">
                                                {new Date(w.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-sm font-black text-[#F5E6C8]">₹{w.amount.toFixed(2)}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border transition-colors ${getStatusStyles(w.status)}`}>
                                                    {w.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-[10px] font-medium text-[#C8A96A]/60">
                                                {w.remark || 'Standard Yield Logic'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="text-[9px] font-black text-[#C8A96A]/40 hover:text-[#C8A96A] flex items-center gap-1 transition-all">
                                                    VERIFY <ChevronRight size={10} strokeWidth={3} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-[9px] font-black text-[#C8A96A]/10 uppercase tracking-[0.5em]">
                        Institutional Liquidity Verification Protocol
                    </p>
                </div>
            </div>
        </div>
    );
};

export default GenerationWithdrawal;
