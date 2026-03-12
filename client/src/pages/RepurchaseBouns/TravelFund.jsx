import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, TrendingUp, Map, Award } from 'lucide-react';

const TravelFund = () => {
    const navigate = useNavigate();

    const travelFundDetails = {
        saved: 150000,
        target: 300000,
        destinations: ['Bali', 'Dubai', 'Switzerland'],
        monthlyContribution: 25000,
        tripsPlanned: 2,
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
                    <h1 className="text-2xl md:text-3xl font-black text-gray-800">Travel Fund</h1>
                    <p className="text-sm text-gray-500 mt-1">Explore the world with your earnings</p>
                </div>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-3xl border border-blue-200 mb-6">
                <div className="flex items-center gap-4 mb-6">
                    <Plane className="w-16 h-16 text-blue-600" />
                    <div>
                        <p className="text-sm text-blue-600 font-bold">Dream Destinations</p>
                        <p className="text-4xl font-black text-gray-800">₹{travelFundDetails.saved.toLocaleString()}</p>
                        <p className="text-sm text-gray-600 mt-1">of ₹{travelFundDetails.target.toLocaleString()} target</p>
                    </div>
                </div>

                <div className="w-full h-4 bg-white rounded-full overflow-hidden mb-6">
                    <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${(travelFundDetails.saved / travelFundDetails.target) * 100}%` }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {travelFundDetails.destinations.map((destination, index) => (
                        <div key={index} className="bg-white/50 p-4 rounded-xl flex items-center gap-3">
                            <Map className="w-5 h-5 text-blue-600" />
                            <span className="font-bold text-gray-800">{destination}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TravelFund;
