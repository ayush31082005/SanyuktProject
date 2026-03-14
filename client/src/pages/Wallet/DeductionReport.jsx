import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft, Download, Search,
    TrendingDown, AlertCircle, FileText
} from 'lucide-react';
import api from '../../api';

const DeductionReport = () => {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('thisMonth');
    const [typeFilter, setTypeFilter] = useState('All Types');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [summary, setSummary] = useState({
        totalDeductions: 0, taxDeductions: 0,
        feeDeductions: 0, adminDeductions: 0, pendingDeductions: 0
    });
    const [deductions, setDeductions] = useState([]);

    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const rowsRef = useRef([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/wallet/deduction-report', {
                params: { period: dateRange, type: typeFilter, search: searchTerm }
            });
            if (res.data.success) {
                setSummary(res.data.summary);
                setDeductions(res.data.deductions);
            }
        } catch (err) {
            setError('Data load karne mein error aaya. Dobara try karein.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [dateRange, typeFilter]);

    useEffect(() => {
        const timer = setTimeout(() => { fetchData(); }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

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
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString('en-IN');
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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Deduction Report</h1>
                    <p className="text-sm text-gray-500 mt-1">View all deductions from your wallet</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {[
                    { label: 'All Deductions', value: summary.totalDeductions, badge: 'Total', icon: TrendingDown },
                    { label: 'TDS & Service Tax', value: summary.taxDeductions, badge: 'Tax', icon: FileText },
                    { label: 'Processing Fees', value: summary.feeDeductions, badge: 'Fees', icon: AlertCircle },
                    { label: 'Admin Charges', value: summary.adminDeductions, badge: 'Admin', icon: FileText },
                    { label: 'Pending Deductions', value: summary.pendingDeductions, badge: 'Pending', icon: AlertCircle },
                ].map((card, i) => (
                    <div key={i} ref={(el) => (cardsRef.current[i] = el)}
                        className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0">
                        <div className="flex items-center justify-between mb-2">
                            <card.icon className="w-6 h-6 text-green-600" />
                            <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">{card.badge}</span>
                        </div>
                        <p className="text-xl font-black text-gray-800">₹{card.value?.toLocaleString() || 0}</p>
                        <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <select value={dateRange} onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                        </select>
                        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="All Types">All Types</option>
                            <option value="Tax">Tax Deductions</option>
                            <option value="Fee">Processing Fees</option>
                            <option value="Admin">Admin Charges</option>
                        </select>
                        <div className="relative">
                            <input type="text" placeholder="Search by reference..."
                                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64" />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg active:scale-95">
                        <Download className="w-4 h-4" /> Download Report
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
                ) : deductions.length === 0 ? (
                    <div className="text-center py-16 text-gray-400">
                        <TrendingDown className="w-12 h-12 mx-auto mb-3 opacity-30" />
                        <p className="font-medium">No deductions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    {['Date', 'Description', 'Reference', 'Type', 'Amount', 'Status', 'Action'].map(h => (
                                        <th key={h} className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {deductions.map((d, index) => (
                                    <tr key={d._id} ref={(el) => (rowsRef.current[index] = el)}
                                        className="hover:bg-gray-50 transition-all duration-300">
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap">{formatDate(d.createdAt)}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium text-gray-800">{d.description}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">{d.referenceNo}</td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.type === 'Tax' ? 'bg-green-100 text-green-700 border border-green-200' :
                                                d.type === 'Fee' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                    'bg-purple-100 text-purple-700 border border-purple-200'}`}>
                                                {d.type}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className="text-sm font-bold text-red-600">-₹{d.amount?.toLocaleString()}</span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${d.status === 'Processed' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-4 sm:px-6 py-3 sm:py-4">
                                            <button className="text-green-600 hover:text-green-700 text-sm font-bold transition-all duration-300 hover:translate-x-1">
                                                View Details
                                            </button>
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

export default DeductionReport;
