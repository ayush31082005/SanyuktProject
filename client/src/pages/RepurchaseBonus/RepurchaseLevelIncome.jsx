import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Layers } from 'lucide-react';
import api from '../../api';

const RepurchaseLevelIncome = () => {
    const navigate = useNavigate();
    const cardsRef = useRef([]);
    const tableRef = useRef(null);
    const rowsRef = useRef([]);

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await api.get('/repurchase/level-income');
                setData(res.data.data);
            } catch (err) {
                setError(err?.response?.data?.message || 'Failed to load data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 text-sm font-medium">Loading income data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-center bg-white rounded-xl p-8 border border-red-100 shadow-sm">
                    <p className="text-red-500 font-bold text-lg mb-2">⚠️ Error</p>
                    <p className="text-gray-500 text-sm">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-bold hover:bg-green-700 transition"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    const {
        totalLevelIncome = 0,
        activeDownline = 0,
        activeLevels = 0,
        generationBreakdown = [],
        recentTransactions = [],
    } = data || {};

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/my-account')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Repurchase Level Income</h1>
                    <p className="text-sm text-gray-500 mt-1">Earnings from team repurchases</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <TrendingUp className="w-8 h-8 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Total</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">₹{totalLevelIncome.toLocaleString('en-IN')}</p>
                    <p className="text-xs text-gray-500 mt-1">Total Level Income</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <Users className="w-8 h-8 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Active</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{activeDownline}</p>
                    <p className="text-xs text-gray-500 mt-1">Active Downline</p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm transition-all hover:-translate-y-1">
                    <div className="flex items-center justify-between mb-3">
                        <Layers className="w-8 h-8 text-green-600" />
                        <span className="text-xs font-bold text-green-700 bg-green-50 px-2 py-1 rounded-full border border-green-200">Levels</span>
                    </div>
                    <p className="text-2xl font-black text-gray-800">{activeLevels}</p>
                    <p className="text-xs text-gray-500 mt-1">Active Levels</p>
                </div>
            </div>
            
            {/* Table and breakdown can be added here as needed */}
            <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
                <p className="text-gray-500">No recent transactions found.</p>
            </div>
        </div>
    );
};

export default RepurchaseLevelIncome;
