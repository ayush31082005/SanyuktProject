import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Users, Award, ChevronDown } from 'lucide-react';

const RepurchaseLevelIncome = () => {
    const navigate = useNavigate();
    const [selectedLevel, setSelectedLevel] = useState('all');

    const levelIncome = [
        { level: 1, percentage: 5, earnings: 1250, downline: 8, volume: 25000 },
        { level: 2, percentage: 3, earnings: 750, downline: 15, volume: 25000 },
        { level: 3, percentage: 2, earnings: 500, downline: 22, volume: 25000 },
        { level: 4, percentage: 1, earnings: 250, downline: 30, volume: 25000 },
    ];

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => navigate('/my-account/bonus/repurchase')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Repurchase Level Income</h1>
                    <p className="text-sm text-gray-500 mt-1">Multi-level earnings from team repurchases</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 p-6 rounded-2xl border border-indigo-100">
                    <TrendingUp className="w-8 h-8 text-indigo-600 mb-2" />
                    <p className="text-3xl font-black text-gray-800">₹2,750</p>
                    <p className="text-xs text-gray-500">Total Level Income</p>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border border-purple-100">
                    <Users className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-3xl font-black text-gray-800">75</p>
                    <p className="text-xs text-gray-500">Active Downline</p>
                </div>
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100">
                    <Award className="w-8 h-8 text-amber-600 mb-2" />
                    <p className="text-3xl font-black text-gray-800">4</p>
                    <p className="text-xs text-gray-500">Active Levels</p>
                </div>
            </div>

            {/* Level Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {levelIncome.map((level) => (
                    <div key={level.level} className="bg-white p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                                    <span className="text-green-600 font-black">L{level.level}</span>
                                </div>
                                <div>
                                    <h3 className="font-black text-gray-800">Level {level.level}</h3>
                                    <p className="text-xs text-gray-500">{level.percentage}% Commission</p>
                                </div>
                            </div>
                            <span className="text-xl font-black text-green-600">₹{level.earnings}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-gray-500">Downline Members</p>
                                <p className="text-lg font-bold text-gray-800">{level.downline}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Business Volume</p>
                                <p className="text-lg font-bold text-gray-800">₹{level.volume}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RepurchaseLevelIncome;
