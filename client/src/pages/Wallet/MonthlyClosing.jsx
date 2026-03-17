import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, PieChart } from 'lucide-react';

const MonthlyClosing = () => {
    const navigate = useNavigate();

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/my-account/wallet/generation')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-800">Monthly Closing Report</h1>
                    <p className="text-sm text-gray-500">Summarized monthly earnings and payouts</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden text-center p-20">
                <PieChart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-800 mb-2">Monthly Data Synchronizing</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Monthly closing cycles are calculated at the end of each month. Your next report will be available on the 1st of the upcoming month.</p>
                
                <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg text-sm text-gray-600 font-bold">
                    <Calendar className="w-4 h-4" /> Next Closing: April 1, 2026
                </div>
            </div>
        </div>
    );
};

export default MonthlyClosing;
