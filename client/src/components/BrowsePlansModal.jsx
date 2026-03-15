import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Zap, Clock, Database, ChevronRight } from 'lucide-react';

const BrowsePlansModal = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    operator, 
    plans = [] 
}) => {
    const [activeCategory, setActiveCategory] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const categories = ['All', ...new Set(plans.map(p => p.category))];
    
    const filteredPlans = plans.filter(plan => {
        const matchesCategory = activeCategory === 'All' || plan.category === activeCategory;
        const matchesSearch = plan.amount.toString().includes(searchQuery) || 
                             plan.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-white/20"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">
                                {operator ? `${operator} Plans` : 'Recharge Plans'}
                            </h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">
                                Select a plan to continue
                            </p>
                        </div>
                        <button 
                            onClick={onClose} 
                            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Search & Categories */}
                    <div className="p-6 space-y-4 bg-white sticky top-0 z-10 border-b border-gray-50">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                            <input 
                                type="text"
                                placeholder="Search by amount or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:ring-2 focus:ring-[#0A7A2F] outline-none transition-all placeholder:text-gray-300 font-medium"
                            />
                        </div>

                        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setActiveCategory(cat)}
                                    className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                        activeCategory === cat 
                                            ? 'bg-[#0A7A2F] text-white shadow-lg shadow-green-900/20' 
                                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Plans List */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {filteredPlans.length > 0 ? (
                            filteredPlans.map((plan) => (
                                <motion.button
                                    key={plan.id}
                                    whileHover={{ x: 5 }}
                                    onClick={() => {
                                        onSelect(plan.amount);
                                        onClose();
                                    }}
                                    className="w-full text-left bg-white border border-gray-100 rounded-2xl p-5 hover:border-[#0A7A2F] hover:shadow-lg transition-all group flex items-center gap-6"
                                >
                                    <div className="flex flex-col items-center justify-center bg-green-50 rounded-2xl p-3 min-w-[80px]">
                                        <span className="text-2xl font-black text-[#0A7A2F]">₹{plan.amount}</span>
                                        <span className="text-[9px] font-black text-[#0A7A2F] uppercase tracking-tighter">View Detail</span>
                                    </div>

                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                                <Clock className="w-3 h-3" />
                                                {plan.validity}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] font-black text-[#F7931E] uppercase tracking-widest">
                                                <Database className="w-3 h-3" />
                                                {plan.data}
                                            </div>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 line-clamp-2 leading-snug">
                                            {plan.description}
                                        </p>
                                    </div>

                                    <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#0A7A2F] transition-colors" />
                                </motion.button>
                            ))
                        ) : (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Search className="w-12 h-12 text-gray-200 mb-4" />
                                <p className="text-gray-400 font-bold uppercase text-xs tracking-widest">No plans found</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default BrowsePlansModal;
