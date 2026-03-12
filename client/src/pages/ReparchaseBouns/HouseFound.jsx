import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, TrendingUp, Target, Clock } from 'lucide-react';

const HouseFund = () => {
    const navigate = useNavigate();

    const fundProgress = {
        saved: 250000,
        target: 1000000,
        monthlyContribution: 25000,
        estimatedTime: '30 months',
    };

    const progressPercentage = (fundProgress.saved / fundProgress.target) * 100;

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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">House Fund</h1>
                    <p className="text-sm text-gray-500 mt-1">Your journey to your dream home</p>
                </div>
            </div>

            {/* Main Progress Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-3xl border border-blue-200 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <Home className="w-16 h-16 text-blue-600" />
                    <div>
                        <p className="text-sm text-blue-600 font-bold">Your House Fund</p>
                        <p className="text-4xl font-black text-gray-800">₹{fundProgress.saved.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-1">of ₹{fundProgress.target.toLocaleString()} target</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-4">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercentage}%` }}
                    />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-white/50 p-4 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-blue-600 mb-1" />
                        <p className="text-sm text-gray-600">Monthly Contribution</p>
                        <p className="text-xl font-bold text-gray-800">₹{fundProgress.monthlyContribution.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-xl">
                        <Clock className="w-5 h-5 text-blue-600 mb-1" />
                        <p className="text-sm text-gray-600">Estimated Time</p>
                        <p className="text-xl font-bold text-gray-800">{fundProgress.estimatedTime}</p>
                    </div>
                </div>
            </div>

            {/* Milestones */}
            <h3 className="text-lg font-black text-gray-800 mb-4">Milestones</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[250000, 500000, 750000].map((milestone, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-gray-200">
                        <Target className="w-6 h-6 text-green-600 mb-2" />
                        <p className="text-lg font-bold text-gray-800">₹{milestone.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                            {fundProgress.saved >= milestone ? 'Achieved ✓' : 'In Progress'}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HouseFund;
