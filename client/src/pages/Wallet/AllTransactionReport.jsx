import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, TrendingUp, TrendingDown, Receipt } from 'lucide-react';
import api from '../../api';

const AllTransactionReport = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [search, setSearch] = useState('');
    const [filterType, setFilterType] = useState('All');
    const headerRef = useRef(null);

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
            setError('Failed to load Transaction Report');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useEffect(() => {
        const timer = setTimeout(() => fetchData(), 500);
        return () => clearTimeout(timer);
    }, [search]);

    useEffect(() => {
        if (headerRef.current) headerRef.current.classList.add('animate-slideDown');
    }, []);

    const filtered = transactions.filter(txn => {
        if (filterType === 'All') return true;
        if (filterType === 'Credit') return txn.txType === 'credit';
        if (filterType === 'Debit') return txn.txType === 'debit';
        return true;
    });

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '-';

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">

            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 opacity-0">
                <button onClick={() => navigate('/my-account/wallet')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 w-fit group active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Transaction Report</h1>
                    <p className="text-sm text-gray-500 mt-1">All wallet credits and debits</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3 items-center">
                        {/* Filter Buttons */}
                        {['All', 'Credit', 'Debit'].map(f => (
                            <button key={f} onClick={() => setFilterType(f)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${filterType === f
                                        ? f === 'Debit'
                                            ? 'bg-red-600 text-white'
                                            : 'bg-green-600 text-white'
                                        : f === 'Debit'
                                            ? 'border border-red-600 text-red-600 hover:bg-red-50'
                                            : 'border border-green-600 text-green-700 hover:bg-green-50'
                                    }`}>
                                {f === 'Credit' ? '↑ Credits' : f === 'Debit' ? '↓ Debits' : 'All'}
                            </button>
                        ))}

                        {/* Search */}
                        <div className="relative">
                            <input type="text" placeholder="Search records..."
                                value={search} onChange={(e) => setSearch(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-56" />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>

                    {/* Total Records Badge */}
                    <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
                        <span className="text-sm font-bold text-green-700">
                            Total Records: {filtered.length}
                        </span>
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-red-500 font-medium mb-3">{error}</p>
                        <button onClick={fetchData}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700">
                            Retry
                        </button>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <Receipt className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">NO RECORDS FOUND</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[750px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['#', 'DATE', 'TYPE', 'AMOUNT', 'SOURCE', 'DETAILS'].map(h => (
                                        <th key={h} className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filtered.map((txn, index) => (
                                    <tr key={txn._id || index}
                                        className={`hover:bg-gray-50 transition-colors duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-400">{index + 1}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">
                                            {formatDate(txn.date)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${txn.txType === 'credit'
                                                    ? 'bg-green-100 text-green-700 border border-green-200'
                                                    : 'bg-orange-100 text-orange-700 border border-orange-200'
                                                }`}>
                                                {txn.txType === 'credit'
                                                    ? <TrendingUp className="w-3 h-3" />
                                                    : <TrendingDown className="w-3 h-3" />}
                                                {txn.type}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`text-sm font-bold ${txn.txType === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                                                {txn.txType === 'credit' ? '+' : '-'}₹{txn.amount?.toLocaleString()}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 max-w-[200px]">
                                            <p className="truncate">{txn.source || '-'}</p>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-500 font-mono">
                                            {txn.details || '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideDown {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-slideDown { animation: slideDown 0.5s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default AllTransactionReport;
