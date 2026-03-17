import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Receipt, TrendingUp, TrendingDown } from 'lucide-react';
import api from '../../api';

const GenerationTransactions = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const res = await api.get('/wallet/all-transactions');
                if (res.data.success) {
                    // Filter specifically for generation related transactions
                    const genTxns = (res.data.transactions || []).filter(tx => 
                        tx.type === 'Generation' || tx.type === 'Repurchase'
                    );
                    setTransactions(genTxns);
                }
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
    }, []);

    const filtered = transactions.filter(t => 
        t.description?.toLowerCase().includes(search.toLowerCase()) ||
        t.source?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-4 md:p-6 max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate('/my-account/wallet/generation')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800">Generation Transactions</h1>
                        <p className="text-sm text-gray-500">History of generation income credits</p>
                    </div>
                </div>
                
                <div className="relative">
                    <input 
                        type="text" 
                        placeholder="Search transactions..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none w-full sm:w-64"
                    />
                    <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {loading ? (
                    <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-[#0A7A2F] border-t-transparent rounded-full animate-spin"></div></div>
                ) : filtered.length === 0 ? (
                    <div className="py-20 text-center text-gray-400">
                        <Receipt className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No generation transactions found</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Type</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-black text-gray-500 uppercase">Description</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.map((tx, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(tx.date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${
                                                tx.txType === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                                {tx.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-sm font-black ${
                                                tx.txType === 'credit' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                                {tx.txType === 'credit' ? '+' : '-'}₹{tx.amount.toFixed(2)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {tx.description}
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

export default GenerationTransactions;
