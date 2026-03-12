import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Crown, TrendingUp, Award, Calendar } from 'lucide-react';

const RoyaltyBonus = () => {
    const navigate = useNavigate();

    const royaltyDetails = {
        currentRank: 'Gold Director',
        nextRank: 'Platinum Director',
        progress: 75,
        royaltyEarned: 5000,
        totalBusiness: 250000,
        requiredBusiness: 500000,
    };

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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Royalty Bonus</h1>
                    <p className="text-sm text-gray-500 mt-1">Exclusive royalty earnings based on rank</p>
                </div>
            </div>

            {/* Current Rank Card */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200 mb-6">
                <div className="flex items-center gap-4 mb-4">
                    <Crown className="w-12 h-12 text-amber-600" />
                    <div>
                        <p className="text-sm text-amber-600 font-bold">Current Rank</p>
                        <h2 className="text-2xl font-black text-gray-800">{royaltyDetails.currentRank}</h2>
                    </div>
                </div>

                {/* Progress to next rank */}
                <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="font-bold text-gray-600">Next Rank: {royaltyDetails.nextRank}</span>
                        <span className="font-bold text-amber-600">{royaltyDetails.progress}%</span>
                    </div>
                    <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-amber-500 rounded-full transition-all duration-500"
                            style={{ width: `${royaltyDetails.progress}%` }}
                        />
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                        ₹{royaltyDetails.totalBusiness.toLocaleString()} / ₹{royaltyDetails.requiredBusiness.toLocaleString()}
                    </p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <TrendingUp className="w-8 h-8 text-green-600 mb-2" />
                    <p className="text-2xl font-black text-gray-800">₹{royaltyDetails.royaltyEarned}</p>
                    <p className="text-xs text-gray-500">Royalty Earned</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <Award className="w-8 h-8 text-purple-600 mb-2" />
                    <p className="text-2xl font-black text-gray-800">2.5%</p>
                    <p className="text-xs text-gray-500">Royalty Rate</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200">
                    <Calendar className="w-8 h-8 text-blue-600 mb-2" />
                    <p className="text-2xl font-black text-gray-800">Monthly</p>
                    <p className="text-xs text-gray-500">Payout Frequency</p>
                </div>
            </div>
        </div>
    );
};

export default RoyaltyBonus;
