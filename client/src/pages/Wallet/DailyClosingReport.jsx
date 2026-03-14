import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    Wallet,
    CheckCircle,
    Clock,
    Printer
} from 'lucide-react';

const DailyClosingReport = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const headerRef = useRef(null);
    const cardsRef = useRef([]);
    const breakdownRef = useRef(null);
    const transactionsRef = useRef(null);

    // Sample daily closing data
    const closingData = {
        date: '2024-03-15',
        openingBalance: 25000,
        closingBalance: 32450,
        totalCredits: 12450,
        totalDebits: 5000,
        netChange: 7450,
        transactions: {
            total: 28,
            successful: 26,
            failed: 2,
            pending: 0,
        },
        breakdown: {
            commissions: 8500,
            bonuses: 2500,
            withdrawals: 4000,
            deductions: 1000,
            transfers: 500,
        }
    };

    // Sample daily transactions
    const dailyTransactions = [
        { id: 1, time: '09:30 AM', type: 'Credit', description: 'Level Income', amount: 500, status: 'Success' },
        { id: 2, time: '10:15 AM', type: 'Credit', description: 'Sponsor Bonus', amount: 350, status: 'Success' },
        { id: 3, time: '11:00 AM', type: 'Debit', description: 'Withdrawal Request', amount: 2000, status: 'Success' },
        { id: 4, time: '01:30 PM', type: 'Credit', description: 'Royalty Bonus', amount: 1000, status: 'Success' },
        { id: 5, time: '02:45 PM', type: 'Debit', description: 'TDS Deduction', amount: 250, status: 'Success' },
        { id: 6, time: '03:20 PM', type: 'Credit', description: 'Repurchase Commission', amount: 750, status: 'Success' },
        { id: 7, time: '04:00 PM', type: 'Credit', description: 'Direct Referral', amount: 300, status: 'Pending' },
        { id: 8, time: '05:30 PM', type: 'Debit', description: 'Processing Fee', amount: 50, status: 'Success' },
    ];

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

        // Breakdown section animation
        if (breakdownRef.current) {
            const breakdownObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slideLeft-visible');
                        breakdownObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            breakdownObserver.observe(breakdownRef.current);
        }

        // Transactions section animation
        if (transactionsRef.current) {
            const transactionsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-slideRight-visible');
                        transactionsObserver.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            transactionsObserver.observe(transactionsRef.current);
        }

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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Daily Closing Report</h1>
                    <p className="text-sm text-gray-500 mt-1">End of day wallet summary and statistics</p>
                </div>
            </div>

            {/* Date Selector */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-green-600" />
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                        />
                    </div>

                </div>
            </div>

            {/* Balance Summary Cards - White with green accents */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {/* Card 1 - Opening Balance */}
                <div
                    ref={(el) => (cardsRef.current[0] = el)}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Wallet className="w-8 h-8 text-green-600 icon-pulse" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Opening</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-gray-800">₹{closingData.openingBalance.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Opening Balance</p>
                </div>

                {/* Card 2 - Closing Balance */}
                <div
                    ref={(el) => (cardsRef.current[1] = el)}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <Wallet className="w-8 h-8 text-green-600 icon-bounce" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Closing</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-gray-800">₹{closingData.closingBalance.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Closing Balance</p>
                </div>

                {/* Card 3 - Total Credits */}
                <div
                    ref={(el) => (cardsRef.current[2] = el)}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <TrendingUp className="w-8 h-8 text-green-600 icon-pulse" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Credits</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-gray-800">₹{closingData.totalCredits.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Credits</p>
                </div>

                {/* Card 4 - Total Debits */}
                <div
                    ref={(el) => (cardsRef.current[3] = el)}
                    className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0"
                >
                    <div className="flex items-center justify-between mb-2">
                        <TrendingDown className="w-8 h-8 text-red-600" />
                        <span className="text-xs font-bold text-red-700 bg-red-50 px-2 py-1 rounded-full border border-red-200">Debits</span>
                    </div>
                    <p className="text-xl sm:text-2xl font-black text-gray-800">₹{closingData.totalDebits.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Debits</p>
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
                        transform: translateX(-30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideRight {
                    from {
                        opacity: 0;
                        transform: translateX(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes pulseIcon {
                    0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                    }
                    50% {
                        transform: scale(1.1);
                        opacity: 0.8;
                    }
                }
                
                @keyframes bounceIcon {
                    0%, 100% {
                        transform: translateY(0);
                    }
                    50% {
                        transform: translateY(-5px);
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
                
                .animate-slideRight-visible {
                    animation: slideRight 0.6s ease-out forwards;
                }
                
                .icon-pulse {
                    animation: pulseIcon 2s ease-in-out infinite;
                }
                
                .icon-bounce {
                    animation: bounceIcon 2s ease-in-out infinite;
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

export default DailyClosingReport;
