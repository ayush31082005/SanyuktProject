import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Wallet, CheckCircle,
    XCircle, Clock, Banknote, CreditCard, Smartphone,
    ChevronRight, RefreshCw, Filter, ShieldCheck
} from 'lucide-react';
import api from '../../api';

const WithdrawalHistory = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('All Status');
    const [methodFilter, setMethodFilter] = useState('All Methods');
    const [periodFilter, setPeriodFilter] = useState('This Month');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        totalWithdrawn: 0, successful: 0, pending: 0,
        count: 0, avgWithdrawal: 0
    });
    const [withdrawals, setWithdrawals] = useState([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/wallet/withdrawal-history', {
                params: { status: statusFilter, method: methodFilter, period: periodFilter }
            });
            if (res.data.success) {
                setSummary(res.data.summary);
                setWithdrawals(res.data.withdrawals);
            }
        } catch (err) {
            setError('Data load synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [statusFilter, methodFilter, periodFilter]);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === '-') return '-';
        return new Date(dateStr).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'Completed': return 'text-green-500 bg-green-500/5 border-green-500/20';
            case 'Pending': return 'text-orange-500 bg-orange-500/5 border-orange-500/20';
            case 'Rejected': return 'text-red-500 bg-red-500/5 border-red-500/20';
            default: return 'text-[#C8A96A] bg-[#C8A96A]/5 border-[#C8A96A]/20';
        }
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case 'Bank Transfer': return <Banknote className="w-3.5 h-3.5" />;
            case 'UPI': return <Smartphone className="w-3.5 h-3.5" />;
            default: return <CreditCard className="w-3.5 h-3.5" />;
        }
    };

    const getAccountDisplay = (w) => {
        if (w.method === 'UPI') return w.upiId || '-';
        if (w.bankName && w.accountNumber)
            return `${w.bankName} ••••${w.accountNumber.slice(-4)}`;
        return 'Standard Protocol';
    };

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
                            <h1 className="text-lg font-serif font-bold text-[#F5E6C8] tracking-widest uppercase">Liquidation Ledger</h1>
                            <p className="text-[8px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em]">Audit Trail • Institutional Grade</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={fetchData} className="p-2 luxury-box border-[#C8A96A]/20 hover:bg-[#C8A96A]/5 transition text-[#C8A96A]">
                            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                    {[
                        { label: 'GROSS SETTLEMENT', value: `₹${summary.totalWithdrawn?.toLocaleString()}`, icon: Wallet, color: '#C8A96A' },
                        { label: 'SUCCESSFUL', value: `₹${summary.successful?.toLocaleString()}`, icon: CheckCircle, color: '#C8A96A' },
                        { label: 'PENDING', value: `₹${summary.pending?.toLocaleString()}`, icon: Clock, color: '#D4AF37' },
                        { label: 'TXN COUNT', value: summary.count, icon: CreditCard, color: '#C8A96A' },
                        { label: 'AVG FLOW', value: `₹${summary.avgWithdrawal?.toLocaleString()}`, icon: RefreshCw, color: '#C8A96A' },
                    ].map((card, i) => (
                        <div key={i} className="luxury-box p-3 bg-[#1A1A1A] border-[#C8A96A]/10 group hover:border-[#C8A96A]/40 transition-all">
                            <div className="flex items-center justify-between mb-2">
                                <card.icon className="w-3.5 h-3.5 text-[#C8A96A]/40 group-hover:text-[#C8A96A] transition-colors" />
                                <div className="w-1 h-1 rounded-full bg-[#C8A96A]/20 group-hover:bg-[#C8A96A] shadow-[0_0_5px_#C8A96A]" />
                            </div>
                            <p className="text-base font-serif font-bold text-[#F5E6C8]">{card.value}</p>
                            <p className="text-[8px] font-black text-[#C8A96A]/30 uppercase tracking-widest mt-0.5">{card.label}</p>
                        </div>
                    ))}
                </div>

                {/* Filters & Export */}
                <div className="luxury-box p-3 bg-[#1A1A1A] border-[#C8A96A]/10 mb-6">
                    <div className="flex flex-col md:flex-row gap-3 items-center justify-between">
                        <div className="flex flex-wrap gap-2 w-full md:w-auto">
                            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0D0D0D] border border-[#C8A96A]/10 text-[#C8A96A]/40">
                                <Filter size={12} strokeWidth={3} />
                                <span className="text-[9px] font-black uppercase tracking-widest">Filters:</span>
                            </div>
                            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                                className="px-3 py-1.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#C8A96A] transition cursor-pointer">
                                <option>All Status</option>
                                <option>Completed</option>
                                <option>Pending</option>
                                <option>Rejected</option>
                            </select>
                            <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}
                                className="px-3 py-1.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#C8A96A] transition cursor-pointer">
                                <option>All Methods</option>
                                <option>Bank Transfer</option>
                                <option>UPI</option>
                            </select>
                            <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}
                                className="px-3 py-1.5 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[#F5E6C8] text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#C8A96A] transition cursor-pointer">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>All Time</option>
                            </select>
                        </div>
                        <button className="w-full md:w-auto px-5 py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-[10px] uppercase tracking-[0.2em] shadow-lg hover:shadow-[#C8A96A]/20 transition-all flex items-center justify-center gap-2">
                            <Download className="w-3.5 h-3.5" strokeWidth={3} /> Export Ledger
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="luxury-box bg-[#1A1A1A] border-[#C8A96A]/10 overflow-hidden shadow-2xl animate-fade-in">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 grayscale opacity-50">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A96A] mb-4" />
                            <span className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">Syncing Audit Trail...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 px-4">
                            <div className="w-12 h-12 bg-red-950/20 border border-red-900/40 rounded-full flex items-center justify-center mx-auto mb-4">
                                <XCircle className="w-6 h-6 text-red-500" />
                            </div>
                            <p className="text-red-400 font-bold text-sm tracking-wide mb-4 uppercase">{error}</p>
                            <button onClick={fetchData} className="px-6 py-2 border border-[#C8A96A]/20 text-[#C8A96A] text-[10px] font-black uppercase tracking-[0.2em] hover:bg-[#C8A96A]/10 transition">Re-Sync System</button>
                        </div>
                    ) : withdrawals.length === 0 ? (
                        <div className="text-center py-24 px-4 opacity-30 grayscale">
                            <Wallet className="w-16 h-16 mx-auto mb-4 text-[#C8A96A]" strokeWidth={1} />
                            <p className="text-[10px] font-black text-[#C8A96A] uppercase tracking-[0.3em]">No Recorded Liquidity Events</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="bg-[#0D0D0D] border-b border-[#C8A96A]/10">
                                        {['REQUEST DATE', 'MANIFEST REF', 'SETTLEMENT', 'CHANNEL', 'VAULT INFO', 'STATUS', 'ACTION'].map(h => (
                                            <th key={h} className="px-6 py-4 text-left text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em]">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#C8A96A]/5">
                                    {withdrawals.map((w) => (
                                        <tr key={w._id} className="group hover:bg-[#C8A96A]/[0.02] transition-colors">
                                            <td className="px-6 py-4">
                                                <p className="text-xs font-bold text-[#F5E6C8]">{formatDate(w.createdAt)}</p>
                                                <p className="text-[8px] font-medium text-[#C8A96A]/30 mt-0.5">Manifest Origin</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-[10px] font-mono font-bold text-[#C8A96A]/60 group-hover:text-[#C8A96A] transition-colors">{w.referenceNo}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-black text-[#F5E6C8]">₹{w.amount?.toLocaleString()}</span>
                                                    <span className="text-[8px] font-black text-[#C8A96A]/40 uppercase tracking-widest mt-0.5">Gross Settlement</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-lg bg-[#C8A96A]/5 border border-[#C8A96A]/10 flex items-center justify-center text-[#C8A96A]/40 group-hover:text-[#C8A96A] group-hover:border-[#C8A96A]/30 transition-all">
                                                        {getMethodIcon(w.method)}
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/60">{w.method}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="text-[10px] font-medium text-[#C8A96A]/60">
                                                    {getAccountDisplay(w)}
                                                </div>
                                                <p className="text-[8px] font-black text-[#C8A96A]/20 uppercase tracking-[0.2em] mt-1">Verified Destination</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center px-2.5 py-1 text-[9px] font-black uppercase tracking-widest border transition-colors ${getStatusStyles(w.status)}`}>
                                                    {w.status}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <button className="flex items-center gap-1.5 text-[9px] font-black text-[#C8A96A]/40 hover:text-[#C8A96A] uppercase tracking-[0.2em] transition-all py-1.5 px-3 border border-transparent hover:border-[#C8A96A]/20 bg-transparent hover:bg-[#C8A96A]/5">
                                                    Details <ChevronRight size={10} strokeWidth={3} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 p-5 border border-[#C8A96A]/10 bg-[#1A1A1A] flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-[#C8A96A]/20 flex items-center justify-center">
                            <ShieldCheck className="w-5 h-5 text-[#C8A96A]/40" />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-[#F5E6C8] uppercase tracking-widest">System Integrity Verified</p>
                            <p className="text-[8px] font-medium text-[#C8A96A]/30 uppercase tracking-[0.2em]">All transactions are end-to-end encrypted</p>
                        </div>
                    </div>
                    <div className="flex -space-x-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full border-2 border-[#1A1A1A] bg-[#0D0D0D] flex items-center justify-center overflow-hidden">
                                <div className="w-4 h-4 rounded-full bg-[#C8A96A]/10" />
                            </div>
                        ))}
                    </div>
                </div>

                <p className="text-center text-[9px] font-black text-[#C8A96A]/10 uppercase tracking-[0.5em] mt-12 pb-8">
                    Lattice Security Protocol • End-of-Line
                </p>
            </div>
        </div>
    );
};

export default WithdrawalHistory;
