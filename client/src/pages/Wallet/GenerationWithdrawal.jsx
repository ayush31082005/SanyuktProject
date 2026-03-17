import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, Clock } from 'lucide-react';
import api from '../../api';

const GenerationWithdrawal = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [withdrawals, setWithdrawals] = useState([]);

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const res = await api.get('/wallet/withdrawal-history');
                if (res.data.success) {
                    setWithdrawals(res.data.withdrawals || []);
                }
            } catch (err) {
                console.error("Error fetching withdrawals:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchWithdrawals();
    }, []);

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={() => navigate('/my-account/wallet/generation')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-2xl font-black text-gray-800">Withdrawal History</h1>
                    <p className="text-sm text-gray-500">Status of your generation wallet payouts</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#0A7A2F] border-t-transparent rounded-full animate-spin"></div></div>
                ) : withdrawals.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <Clock className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No withdrawals found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawals.map((w, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(w.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm font-black text-gray-800">₹{w.amount.toFixed(2)}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                                                w.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                                                w.status === 'Pending' ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {w.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {w.remark || 'N/A'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GenerationWithdrawal;
