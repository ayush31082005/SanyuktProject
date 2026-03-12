import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Users, TrendingUp, Target } from 'lucide-react';

const DirectorBonus = () => {
    const navigate = useNavigate();

    const directorLevels = [
        { level: 'Bronze Director', requirement: '10 Directs', bonus: 1000, achieved: true },
        { level: 'Silver Director', requirement: '25 Directs', bonus: 2500, achieved: true },
        { level: 'Gold Director', requirement: '50 Directs', bonus: 5000, achieved: false },
        { level: 'Platinum Director', requirement: '100 Directs', bonus: 10000, achieved: false },
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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Director Bonus</h1>
                    <p className="text-sm text-gray-500 mt-1">Achievement-based director rewards</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {directorLevels.map((level, index) => (
                    <div
                        key={index}
                        className={`p-6 rounded-2xl border-2 transition-all ${level.achieved
                                ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                                : 'bg-gray-50 border-gray-200 opacity-75'
                            }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <Star className={`w-8 h-8 mb-2 ${level.achieved ? 'text-green-600' : 'text-gray-400'}`} />
                                <h3 className="text-xl font-black text-gray-800">{level.level}</h3>
                                <p className="text-sm text-gray-600 mt-1">Requires: {level.requirement}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-2xl font-black text-green-600">₹{level.bonus}</p>
                                <p className="text-xs text-gray-500">Bonus Amount</p>
                            </div>
                        </div>

                        {level.achieved ? (
                            <span className="inline-block px-4 py-2 bg-green-600 text-white text-sm font-bold rounded-xl">
                                Achieved ✓
                            </span>
                        ) : (
                            <span className="inline-block px-4 py-2 bg-gray-300 text-gray-600 text-sm font-bold rounded-xl">
                                In Progress
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DirectorBonus;
