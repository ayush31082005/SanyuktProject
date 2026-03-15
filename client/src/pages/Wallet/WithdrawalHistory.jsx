import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Wallet, CheckCircle,
    XCircle, Clock, Banknote, CreditCard, Smartphone
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

    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const rowsRef = useRef([]);

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
            setError('Data load karne mein error aaya.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [statusFilter, methodFilter, periodFilter]);

    useEffect(() => {
        if (headerRef.current) headerRef.current.classList.add('animate-slideDown');
        const cardObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => entry.target.classList.add('animate-slideUp-visible'), index * 100);
                    cardObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        cardsRef.current.forEach((card) => { if (card) cardObserver.observe(card); });
    }, []);

    const formatDate = (dateStr) => {
        if (!dateStr || dateStr === '-') return '-';
        return new Date(dateStr).toLocaleDateString('en-IN');
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed': return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'Pending': return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'Rejected': return <XCircle className="w-4 h-4 text-red-600" />;
            default: return <Clock className="w-4 h-4 text-blue-600" />;
        }
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case 'Bank Transfer': return <Banknote className="w-4 h-4 text-gray-600" />;
            case 'UPI': return <Smartphone className="w-4 h-4 text-gray-600" />;
            default: return <CreditCard className="w-4 h-4 text-gray-600" />;
        }
    };

    const getAccountDisplay = (w) => {
        if (w.method === 'UPI') return w.upiId || '-';
        if (w.bankName && w.accountNumber)
            return `${w.bankName} ****${w.accountNumber.slice(-4)}`;
        return '-';
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 opacity-0">
                <button onClick={() => navigate('/my-account/wallet')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 w-fit group active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Withdrawal History</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all your withdrawal requests</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[
                    { label: 'Total Withdrawn', value: `₹${summary.totalWithdrawn?.toLocaleString()}`, badge: 'Total', icon: Wallet, color: 'green' },
                    { label: 'Successful', value: `₹${summary.successful?.toLocaleString()}`, badge: 'Success', icon: CheckCircle, color: 'green' },
                    { label: 'Pending', value: `₹${summary.pending?.toLocaleString()}`, badge: 'Pending', icon: Clock, color: 'yellow' },
                    { label: 'Transactions', value: summary.count, badge: 'Count', icon: CreditCard, color: 'green' },
                    { label: 'Avg. Withdrawal', value: `₹${summary.avgWithdrawal?.toLocaleString()}`, badge: 'Average', icon: Banknote, color: 'green' },
                ].map((card, i) => (
                    <div key={i} ref={(el) => (cardsRef.current[i] = el)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0">
                        <div className="flex items-center justify-between mb-2">
                            <card.icon className={`w-6 h-6 text-${card.color}-600`} />
                            <span className={`text-xs font-bold text-${card.color}-700 bg-${card.color}-50 px-2 py-1 rounded-full border border-${card.color}-200`}>
                                {card.badge}
                            </span>
                        </div>
                        <p className="text-xl font-black text-gray-800">{card.value}</p>
                        <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option>All Status</option>
                            <option>Completed</option>
                            <option>Pending</option>
                            <option>Rejected</option>
                        </select>
                        <select value={methodFilter} onChange={(e) => setMethodFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option>All Methods</option>
                            <option>Bank Transfer</option>
                            <option>UPI</option>
                        </select>
                        <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option>This Month</option>
                            <option>Last Month</option>
                            <option>All Time</option>
                        </select>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg active:scale-95">
                        <Download className="w-4 h-4" /> Export History
                    </button>
                </div>
            </div>

            {/* Table */}
            <div ref={tableRef} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : error ? (
                    <div className="text-center py-16">
                        <p className="text-red-500 mb-3">{error}</p>
                        <button onClick={fetchData} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">Retry</button>
                    </div>
                ) : withdrawals.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <Wallet className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No withdrawals found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['Request Date', 'Reference', 'Amount', 'Method', 'Account', 'Status', 'Processed Date', 'Action'].map(h => (
                                        <th key={h} className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {withdrawals.map((w, index) => (
                                    <tr key={w._id} ref={(el) => (rowsRef.current[index] = el)}
                                        className="hover:bg-gray-50 transition-all duration-300">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap">{formatDate(w.createdAt)}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-mono text-gray-600">{w.referenceNo}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className="text-sm font-bold text-green-600">₹{w.amount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="p-1.5 bg-gray-100 rounded-lg">{getMethodIcon(w.method)}</div>
                                                <span className="text-sm text-gray-600">{w.method}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{getAccountDisplay(w)}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <div className="flex items-center gap-1.5">
                                                {getStatusIcon(w.status)}
                                                <span className={`text-xs font-bold ${w.status === 'Completed' ? 'text-green-700' : w.status === 'Pending' ? 'text-yellow-700' : 'text-red-700'}`}>
                                                    {w.status}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                                            {formatDate(w.processedDate)}
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <button className="text-green-600 hover:text-green-700 text-sm font-bold transition-all duration-300 hover:translate-x-1">Track</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideLeft { from { opacity: 0; transform: translateX(30px); } to { opacity: 1; transform: translateX(0); } }
                .animate-slideDown { animation: slideDown 0.6s ease-out forwards; }
                .animate-slideUp-visible { animation: slideUp 0.6s ease-out forwards; }
                .animate-slideLeft-visible { animation: slideLeft 0.6s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default WithdrawalHistory;
