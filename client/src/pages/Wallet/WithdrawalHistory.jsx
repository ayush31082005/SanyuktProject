import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Filter,
    Calendar,
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
                return <Banknote className="w-4 h-4" />;
            case 'UPI':
                return <Smartphone className="w-4 h-4" />;
            case 'Paytm':
                return <Wallet className="w-4 h-4" />;
            default:
                return <CreditCard className="w-4 h-4" />;
        }
    };

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/my-account/wallet')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Withdrawal History</h1>
                    <p className="text-sm text-gray-500 mt-1">Track all your withdrawal requests</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-100">
                    <div className="flex items-center justify-between mb-2">
                        <Wallet className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">Total</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.totalWithdrawn}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Withdrawn</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-100">
                    <div className="flex items-center justify-between mb-2">
                        <CheckCircle className="w-6 h-6 text-blue-600" />
                        <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">Success</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.successfulWithdrawals}</p>
                    <p className="text-xs text-gray-500 mt-1">Successful</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 p-4 rounded-2xl border border-yellow-100">
                    <div className="flex items-center justify-between mb-2">
                        <Clock className="w-6 h-6 text-yellow-600" />
                        <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Pending</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.pendingWithdrawals}</p>
                    <p className="text-xs text-gray-500 mt-1">Pending</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border border-purple-100">
                    <div className="flex items-center justify-between mb-2">
                        <CreditCard className="w-6 h-6 text-purple-600" />
                        <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 rounded-full">Count</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">{summary.totalTransactions}</p>
                    <p className="text-xs text-gray-500 mt-1">Transactions</p>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-4 rounded-2xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <Banknote className="w-6 h-6 text-gray-600" />
                        <span className="text-xs font-bold text-gray-600 bg-gray-200 px-2 py-1 rounded-full">Average</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.averageWithdrawal}</p>
                    <p className="text-xs text-gray-500 mt-1">Avg. Withdrawal</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-2xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
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
                            className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="all">All Methods</option>
                            <option value="bank">Bank Transfer</option>
                            <option value="upi">UPI</option>
                            <option value="paytm">Paytm</option>
                        </select>

                        <select className="px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="last3Months">Last 3 Months</option>
                            <option value="custom">Custom Range</option>
                        </select>
                    </div>

                    <button className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Export History
                    </button>
                </div>
            </div>

            {/* Withdrawals Table */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Request Date</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Reference</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Method</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Account</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Processed Date</th>
                                <th className="px-6 py-4 text-left text-xs font-black text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {withdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-800">{withdrawal.date}</td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-mono text-gray-600">{withdrawal.reference}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="text-sm font-bold text-green-600">₹{withdrawal.amount}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-gray-100 rounded-lg">
                                                {getMethodIcon(withdrawal.method)}
                                            </div>
                                            <span className="text-sm text-gray-600">{withdrawal.method}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">{withdrawal.account}</td>
                                    <td className="px-6 py-4">
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
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {withdrawal.processedDate}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button className="text-green-600 hover:text-green-700 text-sm font-bold">
                                            Track
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                    <p className="text-sm text-gray-500">Showing 1-5 of 24 withdrawals</p>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Previous</button>
                        <button className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm">1</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">2</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">3</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg text-sm hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>

            {/* Withdrawal Stats and Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-black text-gray-800 mb-4">Withdrawal Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">This Month</span>
                            <span className="font-bold text-gray-800">₹15,000</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Last Month</span>
                            <span className="font-bold text-gray-800">₹12,500</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <span className="text-sm text-gray-600">Average Processing Time</span>
                            <span className="font-bold text-gray-800">24 Hours</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Success Rate</span>
                            <span className="font-bold text-green-600">98%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <h3 className="font-black text-gray-800 mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button className="p-4 bg-green-50 rounded-xl text-center hover:bg-green-100 transition-colors">
                            <Wallet className="w-6 h-6 text-green-600 mx-auto mb-2" />
                            <span className="text-xs font-bold text-gray-800">New Withdrawal</span>
                        </button>
                        <button className="p-4 bg-blue-50 rounded-xl text-center hover:bg-blue-100 transition-colors">
                            <Banknote className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                            <span className="text-xs font-bold text-gray-800">Add Bank Account</span>
                        </button>
                        <button className="p-4 bg-purple-50 rounded-xl text-center hover:bg-purple-100 transition-colors">
                            <CreditCard className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                            <span className="text-xs font-bold text-gray-800">Withdrawal Limits</span>
                        </button>
                        <button className="p-4 bg-amber-50 rounded-xl text-center hover:bg-amber-100 transition-colors">
                            <Clock className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                            <span className="text-xs font-bold text-gray-800">Pending Requests</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WithdrawalHistory;
