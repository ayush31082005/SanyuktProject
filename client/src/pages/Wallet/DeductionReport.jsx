import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Search,
    TrendingDown,
    AlertCircle,
    FileText
} from 'lucide-react';

const DeductionReport = () => {
    const navigate = useNavigate();
    const [dateRange, setDateRange] = useState('thisMonth');
    const [searchTerm, setSearchTerm] = useState('');
    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const rowsRef = useRef([]);

    // Sample deduction data
    const deductions = [
        {
            id: 1,
            date: '2024-03-15',
            description: 'Tax Deducted at Source (TDS)',
            amount: 1250,
            type: 'Tax',
            status: 'Processed',
            reference: 'TDS/MAR/001'
        },
        {
            id: 2,
            date: '2024-03-14',
            description: 'Processing Fee - Withdrawal',
            amount: 100,
            type: 'Fee',
            status: 'Processed',
            reference: 'FEE/MAR/002'
        },
        {
            id: 3,
            date: '2024-03-12',
            description: 'Admin Charges',
            amount: 500,
            type: 'Admin',
            status: 'Processed',
            reference: 'ADM/MAR/003'
        },
        {
            id: 4,
            date: '2024-03-10',
            description: 'Service Tax',
            amount: 750,
            type: 'Tax',
            status: 'Pending',
            reference: 'TAX/MAR/004'
        },
        {
            id: 5,
            date: '2024-03-08',
            description: 'Withdrawal Charges',
            amount: 50,
            type: 'Fee',
            status: 'Processed',
            reference: 'FEE/MAR/005'
        },
    ];

    // Summary statistics
    const summary = {
        totalDeductions: 2650,
        taxDeductions: 2000,
        feeDeductions: 150,
        adminCharges: 500,
        pendingDeductions: 750,
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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Deduction Report</h1>
                    <p className="text-sm text-gray-500 mt-1">View all deductions from your wallet</p>
                </div>
            </div>

            {/* Summary Cards - White with green accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
                {/* Card 1 - Total Deductions */}
                <div
                    ref={(el) => (cardsRef.current[0] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <TrendingDown className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Total</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.totalDeductions}</p>
                    <p className="text-xs text-gray-500 mt-1">All Deductions</p>
                </div>

                {/* Card 2 - Tax Deductions */}
                <div
                    ref={(el) => (cardsRef.current[1] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Tax</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.taxDeductions}</p>
                    <p className="text-xs text-gray-500 mt-1">TDS & Service Tax</p>
                </div>

                {/* Card 3 - Fee Deductions */}
                <div
                    ref={(el) => (cardsRef.current[2] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <AlertCircle className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Fees</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.feeDeductions}</p>
                    <p className="text-xs text-gray-500 mt-1">Processing Fees</p>
                </div>

                {/* Card 4 - Admin Charges */}
                <div
                    ref={(el) => (cardsRef.current[3] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <FileText className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Admin</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.adminCharges}</p>
                    <p className="text-xs text-gray-500 mt-1">Admin Charges</p>
                </div>

                {/* Card 5 - Pending Deductions */}
                <div
                    ref={(el) => (cardsRef.current[4] = el)}
                    className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <AlertCircle className="w-6 h-6 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Pending</span>
                    </div>
                    <p className="text-xl font-black text-gray-800">₹{summary.pendingDeductions}</p>
                    <p className="text-xs text-gray-500 mt-1">Pending Deductions</p>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex flex-wrap gap-3">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
                        >
                            <option value="today">Today</option>
                            <option value="yesterday">Yesterday</option>
                            <option value="thisWeek">This Week</option>
                            <option value="thisMonth">This Month</option>
                            <option value="lastMonth">Last Month</option>
                            <option value="custom">Custom Range</option>
                        </select>

                        <select className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white">
                            <option value="all">All Types</option>
                            <option value="tax">Tax Deductions</option>
                            <option value="fee">Processing Fees</option>
                            <option value="admin">Admin Charges</option>
                        </select>

                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by reference..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
                            />
                            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                        </div>
                    </div>

                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition-all duration-300 flex items-center gap-2 shadow-sm hover:shadow-lg active:scale-95">
                        <Download className="w-4 h-4" />
                        Download Report
                    </button>
                </div>


            </div>

            {/* Deductions Table */}
            <div
                ref={tableRef}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm opacity-0"
            >
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Date</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Description</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Reference</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Type</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Amount</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Status</th>
                                <th className="px-4 sm:px-6 py-3 sm:py-4 text-left text-xs font-black text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {deductions.map((deduction, index) => (
                                <tr
                                    key={deduction.id}
                                    ref={(el) => (rowsRef.current[index] = el)}
                                    className="hover:bg-gray-50 transition-all duration-300 hover:shadow-md opacity-0"
                                >
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-800 whitespace-nowrap">{deduction.date}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <p className="text-sm font-medium text-gray-800">{deduction.description}</p>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm text-gray-600 whitespace-nowrap">{deduction.reference}</td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${deduction.type === 'Tax' ? 'bg-green-100 text-green-700 border border-green-200' :
                                            deduction.type === 'Fee' ? 'bg-blue-100 text-blue-700 border border-blue-200' :
                                                'bg-purple-100 text-purple-700 border border-purple-200'
                                            }`}>
                                            {deduction.type}
                                        </span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className="text-sm font-bold text-red-600">-₹{deduction.amount}</span>
                                    </td>
                                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${deduction.status === 'Processed'
                                            ? 'bg-green-100 text-green-700 border border-green-200'
                                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                            }`}>
                                            {deduction.status}
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

export default DeductionReport;
