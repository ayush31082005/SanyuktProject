import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, TrendingUp, Target, Award } from 'lucide-react';

const CarFund = () => {
    const navigate = useNavigate();

    const carFundDetails = {
        saved: 350000,
        target: 800000,
        carModel: 'Premium SUV',
        monthlyContribution: 35000,
        estimatedMonths: 13,
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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Car Fund</h1>
                    <p className="text-sm text-gray-500 mt-1">Drive your dream car</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-3xl border border-red-200 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <Car className="w-16 h-16 text-red-600" />
                    <div>
                        <p className="text-sm text-red-600 font-bold">Target: {carFundDetails.carModel}</p>
                        <p className="text-4xl font-black text-gray-800">₹{carFundDetails.saved.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-1">of ₹{carFundDetails.target.toLocaleString()} target</p>
                    </div>
                </div>

                <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-red-600 rounded-full transition-all duration-500"
                        style={{ width: `${(carFundDetails.saved / carFundDetails.target) * 100}%` }}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/50 p-4 rounded-xl">
                        <TrendingUp className="w-5 h-5 text-red-600 mb-1" />
                        <p className="text-sm text-gray-600">Monthly Contribution</p>
                        <p className="text-xl font-bold text-gray-800">₹{carFundDetails.monthlyContribution.toLocaleString()}</p>
                    </div>
                    <div className="bg-white/50 p-4 rounded-xl">
                        <Target className="w-5 h-5 text-red-600 mb-1" />
                        <p className="text-sm text-gray-600">Est. Time Remaining</p>
                        <p className="text-xl font-bold text-gray-800">{carFundDetails.estimatedMonths} months</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarFund;
