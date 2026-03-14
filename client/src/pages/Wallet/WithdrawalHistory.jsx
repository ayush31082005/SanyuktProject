import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Wallet,
    CheckCircle,
    XCircle,
    Clock,
    Banknote,
    CreditCard,
    Smartphone
} from 'lucide-react';

const WithdrawalHistory = () => {
    const navigate = useNavigate();
    const [statusFilter, setStatusFilter] = useState('all');
    const [methodFilter, setMethodFilter] = useState('all');
    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const rowsRef = useRef([]);

    // Sample withdrawal data
    const withdrawals = [
        {
            id: 1,
            date: '2024-03-15',
            amount: 5000,
            method: 'Bank Transfer',
            account: 'HDFC Bank ****1234',
            status: 'Completed',
            reference: 'WDL/001/2024',
            processedDate: '2024-03-16',
        },
        {
            id: 2,
            date: '2024-03-14',
            amount: 2500,
            method: 'UPI',
            account: 'user@okhdfcbank',
            status: 'Pending',
            reference: 'WDL/002/2024',
            processedDate: '-',
        },
        {
            id: 3,
            date: '2024-03-12',
            amount: 10000,
            method: 'Bank Transfer',
            account: 'SBI ****5678',
            status: 'Processing',
            reference: 'WDL/003/2024',
            processedDate: '-',
        },
        {
            id: 4,
            date: '2024-03-10',
            amount: 3000,
            method: 'Paytm',
            account: '9876543210',
            status: 'Completed',
            reference: 'WDL/004/2024',
            processedDate: '2024-03-11',
        },
        {
            id: 5,
            date: '2024-03-08',
            amount: 1500,
            method: 'Bank Transfer',
            account: 'ICICI ****9012',
            status: 'Failed',
            reference: 'WDL/005/2024',
            processedDate: '2024-03-09',
            failureReason: 'Insufficient balance',
        },
    ];

    // Summary statistics
    const summary = {
        totalWithdrawn: 22000,
        successfulWithdrawals: 18000,
        pendingWithdrawals: 4000,
        totalTransactions: 5,
        averageWithdrawal: 4400,
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Completed':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'Pending':
                return <Clock className="w-4 h-4 text-yellow-600" />;
            case 'Processing':
                return <Clock className="w-4 h-4 text-blue-600" />;
            case 'Failed':
                return <XCircle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    const getMethodIcon = (method) => {
        switch (method) {
            case 'Bank Transfer':
                return <Banknote className="w-4 h-4 text-gray-600" />;
            case 'UPI':
                return <Smartphone className="w-4 h-4 text-gray-600" />;
            case 'Paytm':
                return <Wallet className="w-4 h-4 text-gray-600" />;
            default:
                return <CreditCard className="w-4 h-4 text-gray-600" />;
        }
    };

    useEffect(() => {
        // Header animation
        if (headerRef.current) {
            headerRef.current.classList.add('animate-slideDown');
        }

        // Cards animation
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

        // Table animation
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

        // Rows animation
        const rowObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.classList.add('animate-slideLeft-visible');
                    }, index * 100);
                    rowObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        rowsRef.current.forEach((row) => {
            if (row) rowObserver.observe(row);
        });

    }, []);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div
                ref={headerRef}
                className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 opacity-0"
            >
                <button
                    onClick={() => navigate('/my-account/wallet')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 w-fit group active:scale-95"
                    aria-label="Go back"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Withdrawal History</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all your withdrawal requests</p>
                </div>
            </div>

            {/* Summary Cards - White with green accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Card 1 - Total Withdrawn */}
                <div
                    ref={(el) => (cardsRef.current[0] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Wallet className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Total</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.totalWithdrawn}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Withdrawn</p>
                </div>

                {/* Card 2 - Successful */}
                <div
                    ref={(el) => (cardsRef.current[1] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Success</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.successfulWithdrawals}</p>
                    <p className="text-xs text-gray-500 mt-1">Successful</p>
                </div>

                {/* Card 3 - Pending */}
                <div
                    ref={(el) => (cardsRef.current[2] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-6 h-6 text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-700 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">Pending</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.pendingWithdrawals}</p>
                    <p className="text-xs text-gray-500 mt-1">Pending</p>
                </div>

                {/* Card 4 - Count */}
                <div
                    ref={(el) => (cardsRef.current[3] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <CreditCard className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Count</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">{summary.totalTransactions}</p>
                    <p className="text-xs text-gray-500 mt-1">Transactions</p>
                </div>

                {/* Card 5 - Average */}
                <div
                    ref={(el) => (cardsRef.current[4] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Banknote className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Average</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.averageWithdrawal}</p>
                    <p className="text-xs text-gray-500 mt-1">Avg. Withdrawal</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="all">All Status</option>
                            <option value="completed">Completed</option>
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="failed">Failed</option>
                        </select>

                        <select
                            value={methodFilter}
                            onChange={(e) => setMethodFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="all">All Methods</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="upi">UPI</option>
                            <option value="paytm">Paytm</option>
                        </select>

                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg active:scale-95">
                        <Download className="w-4 h-4" />
                        Export History
                    </button>
                </div>
            </div>

            {/* Withdrawals Table */}
            <div
                ref={tableRef}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-0"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Request Date</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Reference</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Amount</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Method</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Account</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Status</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Processed Date</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {withdrawals.map((withdrawal, index) => (
                                <tr
                                    key={withdrawal.id}
                                    ref={(el) => (rowsRef.current[index] = el)}
                                    className="hover:bg-gray-50 transition-all duration-300 hover:shadow-md opacity-0"
                                >
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap">{withdrawal.date}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className="text-sm font-mono text-gray-600">{withdrawal.reference}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className="text-sm font-bold text-green-600">₹{withdrawal.amount}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-100 rounded-lg">
                                                {getMethodIcon(withdrawal.method)}
                                            </div>
                                            <span className="text-sm text-gray-600">{withdrawal.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">{withdrawal.account}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <div className="flex items-center gap-1.5">
                                            {getStatusIcon(withdrawal.status)}
                                            <span className={`text-xs font-bold ${withdrawal.status === 'Completed' ? 'text-green-700' :
                                                withdrawal.status === 'Pending' ? 'text-yellow-700' :
                                                    withdrawal.status === 'Processing' ? 'text-blue-700' :
                                                        'text-red-700'
                                                }`}>
                                                {withdrawal.status}
                                            </span>
                                        </div>
                                        {withdrawal.failureReason && (
                                            <p className="text-xs text-red-500 mt-1">{withdrawal.failureReason}</p>
                                        )}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600">
                                        {withdrawal.processedDate}
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <button className="text-green-600 hover:text-green-700 text-sm font-bold transition-all duration-300 hover:translate-x-1">
                                            Track
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>



            {/* Animation Styles */}
            <style jsx>{`
                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes slideLeft {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .animate-slideDown {
                    animation: slideDown 0.6s ease-out forwards;
                }
                
                .animate-slideUp-visible {
                    animation: slideUp 0.6s ease-out forwards;
                }
                
                .animate-slideLeft-visible {
                    animation: slideLeft 0.6s ease-out forwards;
                }
                
                /* Responsive touch feedback */
                @media (max-width: 640px) {
                    .bg-white:active {
                        transform: scale(0.98);
                        transition: transform 0.1s ease;
                    }
                }
            `}</style>
        </div>
    );
};

export default WithdrawalHistory;
