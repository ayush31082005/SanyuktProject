import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Receipt, Filter, RefreshCw } from 'lucide-react';
import api from '../../api';

const AllTransactionReport = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/wallet/all-transactions', {
                params: { search }
            });
            if (res.data.success) {
                setTransactions(res.data.transactions || []);
                setTotalRecords(res.data.totalRecords || 0);
            }
        } catch (err) {
            setError('Transaction ledger synchronization failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 500);
        return () => clearTimeout(timer);
    }, [search]);

    const filtered = transactions.filter(txn => {
        if (filterType === 'All') return true;
        if (filterType === 'Credit') return txn.txType === 'credit';
        if (filterType === 'Debit') return txn.txType === 'debit';
        return true;
    });

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '-';

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
                            <h1 className="text-lg font-serif font-bold text-[#F5E6C8] tracking-widest uppercase">Institutional Ledger</h1>
                            <p className="text-[8px] font-black text-[#C8A96A]/40 uppercase tracking-[0.3em]">Comprehensive Audit History</p>
                        </div>
                    </div>
                    <button onClick={fetchData} className="p-2 luxury-box border-[#C8A96A]/20 hover:bg-[#C8A96A]/5 transition text-[#C8A96A]">
                        <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* Filters */}
                <div className="luxury-box p-3 bg-[#1A1A1A] border-[#C8A96A]/10 mb-6 flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0D0D0D] border border-[#C8A96A]/10 text-[#C8A96A]/40 min-w-[80px]">
                            <Filter size={12} strokeWidth={3} />
                            <span className="text-[9px] font-black uppercase tracking-widest">Type:</span>
                        </div>
                        {['All', 'Credit', 'Debit'].map(f => (
                            <button key={f} onClick={() => setFilterType(f)}
                                className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border transition-all ${filterType === f
                                        ? 'bg-[#C8A96A] text-[#0D0D0D] border-[#C8A96A]'
                                        : 'bg-[#0D0D0D] text-[#C8A96A]/40 border-[#C8A96A]/10 hover:border-[#C8A96A]/30'
                                    }`}>
                                {f}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64 group">
                        <input type="text" placeholder="SERIES SEARCH..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 bg-[#0D0D0D] border border-[#C8A96A]/20 text-[10px] font-black uppercase tracking-widest text-[#F5E6C8] outline-none focus:border-[#C8A96A] transition-all placeholder:text-[#C8A96A]/10" />
                        <Search className="w-3.5 h-3.5 text-[#C8A96A]/20 group-focus-within:text-[#C8A96A] absolute left-3 top-2.5 transition-colors" />
                    </div>

                    <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-[#C8A96A]/5 border border-[#C8A96A]/10">
                        <span className="text-[9px] font-black text-[#C8A96A] uppercase tracking-widest">
                            Manifested Records: {filtered.length}
                        </span>
                    </div>
                </div>

                {/* Table */}
                <div className="luxury-box bg-[#1A1A1A] border-[#C8A96A]/10 overflow-hidden shadow-2xl animate-fade-in text-[11px]">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-24 grayscale opacity-50">
                            <RefreshCw className="w-8 h-8 animate-spin text-[#C8A96A] mmb-4" />
                            <span className="text-[10px] font-black text-[#C8A96A] uppercase tracking-widest">Parsing Transaction Stream...</span>
                        </div>
                    ) : error ? (
                        <div className="text-center py-20 px-4">
                            <p className="text-red-400 font-bold mb-4 uppercase text-[10px] tracking-widest">{error}</p>
                            <button onClick={fetchData} className="px-5 py-2 border border-[#C8A96A]/20 text-[#C8A96A] text-[9px] font-black uppercase tracking-widest hover:bg-[#C8A96A]/5 transition">Try Re-Sync</button>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="text-center py-24 grayscale opacity-30">
                            <Receipt className="w-16 h-16 mx-auto mb-4 text-[#C8A96A]" strokeWidth={1} />
                            <p className="text-[9px] font-black text-[#C8A96A] uppercase tracking-[0.4em]">Zero Manifests Discovered</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead className="bg-[#0D0D0D] border-b border-[#C8A96A]/10">
                                    <tr>
                                        {['SN', 'MANIFEST DATE', 'TYPE', 'TXN VALUE', 'ORIGIN', 'MANIFEST DETAILS'].map(h => (
                                            <th key={h} className="px-6 py-4 text-left text-[9px] font-black text-[#C8A96A]/40 uppercase tracking-[0.2em]">
                                                {h}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#C8A96A]/5">
                                    {filtered.map((txn, index) => (
                                        <tr key={txn._id || index} className="group hover:bg-[#C8A96A]/[0.02] transition-colors">
                                            <td className="px-6 py-4 text-[#C8A96A]/20 font-mono text-[10px]">{String(index + 1).padStart(3, '0')}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#F5E6C8]">{formatDate(txn.date)}</p>
                                                <p className="text-[8px] font-medium text-[#C8A96A]/30 uppercase tracking-widest mt-0.5">Execution Timestamp</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 border text-[9px] font-black uppercase tracking-widest ${txn.txType === 'credit'
                                                        ? 'bg-green-500/5 text-green-500 border-green-500/20'
                                                        : 'bg-orange-500/5 text-orange-500 border-orange-500/20'
                                                    }`}>
                                                    {txn.txType === 'credit' ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                                                    {txn.type}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`text-sm font-black ${txn.txType === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                                                    {txn.txType === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-[#F5E6C8]/60 uppercase tracking-wider truncate max-w-[150px]">{txn.source || 'INTERNAL'}</p>
                                            </td>
                                            <td className="px-6 py-4 font-mono text-[9px] text-[#C8A96A]/40 group-hover:text-[#C8A96A]/80 transition-colors">
                                                {txn.details || 'System Generated Entry'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex flex-col md:flex-row items-center justify-between gap-4 py-8 border-t border-[#C8A96A]/5">
                    <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[9px] font-black text-[#C8A96A]/30 uppercase tracking-[0.3em]">Ledger Integrity: Verified</span>
                    </div>
                    <div className="flex gap-4">
                        <span className="text-[9px] font-black text-[#C8A96A]/10 uppercase tracking-[0.4em]">Proprietary Lattice Architecture</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AllTransactionReport;
