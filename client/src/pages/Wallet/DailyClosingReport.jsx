import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, TrendingUp, TrendingDown, Wallet } from 'lucide-react';
import api from '../../api';

const DailyClosingReport = () => {
    const navigate = useNavigate();
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState({
        openingBalance: 0, closingBalance: 0,
        totalCredits: 0, totalDebits: 0
    });

    const headerRef = useRef(null);
    const cardsRef = useRef([]);

    const fetchData = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await api.get('/wallet/daily-closing', {
                params: { date: selectedDate }
            });
            if (res.data.success) setData(res.data);
        } catch (err) {
            setError('Data load karne mein error aaya.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [selectedDate]);

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

    const cards = [
        { label: 'Opening Balance', value: data.openingBalance, badge: 'Opening', icon: Wallet, color: 'green', iconClass: 'icon-pulse' },
        { label: 'Closing Balance', value: data.closingBalance, badge: 'Closing', icon: Wallet, color: 'green', iconClass: 'icon-bounce' },
        { label: 'Total Credits', value: data.totalCredits, badge: 'Credits', icon: TrendingUp, color: 'green', iconClass: 'icon-pulse' },
        { label: 'Total Debits', value: data.totalDebits, badge: 'Debits', icon: TrendingDown, color: 'red', iconClass: '' },
    ];

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            {/* Header */}
            <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 opacity-0">
                <button onClick={() => navigate('/my-account/wallet')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-300 hover:scale-110 w-fit group active:scale-95">
                    <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform duration-300" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Daily Closing Report</h1>
                    <p className="text-sm text-gray-500 mt-1">End of day wallet summary and statistics</p>
                </div>
            </div>

            {/* Date Selector */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
                <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-green-600" />
                    <input type="date" value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
            </div>

            {/* Cards */}
            {loading ? (
                <div className="flex justify-center items-center py-16">
                    <div className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : error ? (
                <div className="text-center py-16">
                    <p className="text-red-500 mb-3">{error}</p>
                    <button onClick={fetchData} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold">Retry</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {cards.map((card, i) => (
                        <div key={i} ref={(el) => (cardsRef.current[i] = el)}
                            className="bg-white p-4 sm:p-5 rounded-xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 opacity-0">
                            <div className="flex items-center justify-between mb-2">
                                <card.icon className={`w-8 h-8 text-${card.color}-600 ${card.iconClass}`} />
                                <span className={`text-xs font-bold text-${card.color}-700 bg-${card.color}-50 px-2 py-1 rounded-full border border-${card.color}-200`}>
                                    {card.badge}
                                </span>
                            </div>
                            <p className="text-xl sm:text-2xl font-black text-gray-800">
                                ₹{card.value?.toLocaleString() || 0}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">{card.label}</p>
                        </div>
                    ))}
                </div>
            )}

            <style>{`
                @keyframes slideDown { from { opacity: 0; transform: translateY(-30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes pulseIcon { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); } }
                @keyframes bounceIcon { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
                .animate-slideDown { animation: slideDown 0.6s ease-out forwards; }
                .animate-slideUp-visible { animation: slideUp 0.6s ease-out forwards; }
                .icon-pulse { animation: pulseIcon 2s ease-in-out infinite; }
                .icon-bounce { animation: bounceIcon 2s ease-in-out infinite; }
            `}</style>
        </div>
    );
};

export default DailyClosingReport;
