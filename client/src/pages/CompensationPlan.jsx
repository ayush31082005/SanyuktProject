import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, Award, Zap, Star, Shield, Gift,
    TrendingUp, Briefcase, Target, Rocket, CheckCircle2,
    DollarSign, Users, PieChart, Info, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CompensationPlan = () => {
    const theme = {
        green: '#0A7A2F',
        orange: '#F7931E',
        bg: '#F8FAFC',
        textMain: '#1E293B',
        textMuted: '#64748B'
    };

    const packages = [
        { name: "Basic", price: "₹599", bv: "250", pv: "0.25", capping: "₹2,000/Day" },
        { name: "Standard", price: "₹1,299", bv: "500", pv: "0.5", capping: "₹4,000/Day" },
        { name: "Premium", price: "₹2,699", bv: "1,000", pv: "1", capping: "₹10,000/Day" }
    ];

    const levelIncome = [
        { level: "1", amount: "₹50" }, { level: "2", amount: "₹40" },
        { level: "3", amount: "₹30" }, { level: "4", amount: "₹20" },
        { level: "5-6", amount: "₹10" }, { level: "7-10", amount: "₹5" },
        { level: "11-12", amount: "₹4" }, { level: "13-18", amount: "₹3" },
        { level: "19-20", amount: "₹2" }
    ];

    const rewards = [
        { rank: "Bronze", target: "5PV : 5PV", reward: "Company Catalog" },
        { rank: "Silver", target: "25PV : 25PV", reward: "₹1,200 Cash" },
        { rank: "Gold", target: "50PV : 50PV", reward: "₹2,500 Cash" },
        { rank: "Platinum", target: "100PV : 100PV", reward: "₹5,000 + North Trip" },
        { rank: "Star", target: "200PV : 200PV", reward: "₹10,000 + North Trip" },
        { rank: "Ruby", target: "500PV : 500PV", reward: "₹50,000 Cash" },
        { rank: "Sapphire", target: "1000PV : 1000PV", reward: "₹1 Lakh + India Trip" },
        { rank: "Emerald", target: "6000PV : 6000PV", reward: "₹7 Lakh Cash" },
        { rank: "Diamond", target: "30,000PV", reward: "₹10 Lakh Cash" },
        { rank: "Blue Diamond", target: "125k PV", reward: "₹30 Lakh Cash" },
        { rank: "MD", target: "1500k PV", reward: "₹5 Crore House" }
    ];

    return (
        <div className="bg-[#F8FAFC] min-h-screen font-sans pb-24 pt-20">
            {/* Professional Header Section */}
            <div className="bg-[#0A7A2F] py-24 px-4 text-white relative overflow-hidden border-b-8 border-[#F7931E]">
                {/* Subtle Grid Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}>
                </div>
                
                <Container className="max-w-6xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <span className="inline-block px-5 py-2 bg-white/10 backdrop-blur-md rounded-lg text-sm font-bold uppercase tracking-widest mb-6 text-[#F7931E] border border-white/20">
                            Transparent & Profitable
                        </span>
                        <h1 className="text-4xl md:text-7xl font-black mb-6 uppercase tracking-tight leading-[1.1]">
                            Business <span className="text-[#F7931E]">Compensation</span> Plan
                        </h1>
                        <p className="text-xl text-white/90 max-w-3xl mx-auto font-medium leading-relaxed">
                            A mathematically proven, career-oriented reward system designed for sustainable wealth and financial freedom.
                        </p>
                    </motion.div>
                </Container>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-20">
                {/* 1. Joining Packages Card Section */}
                <section className="mb-24">
                    <div className="flex items-center justify-between mb-10 bg-white p-6 rounded-2xl shadow-sm border-l-8 border-[#F7931E]">
                        <div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Joining Packages</h2>
                            <p className="text-slate-500 font-medium">Choose your entry gateway to success</p>
                        </div>
                        <div className="w-14 h-14 bg-slate-50 rounded-xl flex items-center justify-center text-[#F7931E]">
                            <Briefcase className="w-8 h-8" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-3xl p-10 shadow-xl shadow-slate-200/60 border border-slate-100 flex flex-col relative group"
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-[#0A7A2F]/5 rounded-bl-[100px] -z-0"></div>
                                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">{pkg.name}</h3>
                                <div className="text-5xl font-black text-slate-800 mb-8 tracking-tighter">{pkg.price}</div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                        <span className="text-sm font-semibold text-slate-500">Business Volume (BV)</span>
                                        <span className="font-bold text-slate-800">{pkg.bv}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-3 border-b border-slate-50">
                                        <span className="text-sm font-semibold text-slate-500">Point Value (PV)</span>
                                        <span className="font-bold text-slate-800">{pkg.pv}</span>
                                    </div>
                                    <div className="flex items-center justify-between py-4 bg-[#0A7A2F]/5 px-4 rounded-xl mt-4">
                                        <span className="text-xs font-black text-[#0A7A2F] uppercase tracking-wider">Capping Limits</span>
                                        <span className="font-black text-[#0A7A2F]">{pkg.capping}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 2. Direct & Level Income Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
                    {/* Direct Referral Bonus */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#0A7A2F] rounded-xl flex items-center justify-center text-white">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Direct Bonus</h2>
                        </div>
                        <div className="bg-white rounded-3xl p-12 shadow-xl shadow-slate-200/60 border border-slate-100 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-5 hover:opacity-10 transition-opacity">
                                <DollarSign size={120} />
                            </div>
                            <div className="inline-flex items-center justify-center w-24 h-24 bg-[#F7931E]/10 rounded-full mb-6">
                                <DollarSign className="w-12 h-12 text-[#F7931E]" />
                            </div>
                            <div className="text-6xl font-black text-slate-800 mb-2">₹50 <span className="text-2xl text-slate-400">Fixed</span></div>
                            <p className="text-lg font-bold text-slate-500 uppercase tracking-widest mb-8">Per Active Referral</p>
                            <div className="py-3 px-6 bg-slate-50 rounded-full inline-flex items-center gap-2 text-slate-600 font-bold text-sm">
                                <CheckCircle2 className="w-4 h-4 text-[#0A7A2F]" />
                                Valid for all package activations
                            </div>
                        </div>
                    </section>

                    {/* Team Level Income */}
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 bg-[#F7931E] rounded-xl flex items-center justify-center text-white">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Team Level Income</h2>
                        </div>
                        <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/60 border border-slate-100">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {levelIncome.map((li, i) => (
                                    <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-[#F7931E] transition-all">
                                        <div className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Level {li.level}</div>
                                        <div className="text-2xl font-black text-slate-800 group-hover:text-[#F7931E]">{li.amount}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. Matching Income Banner */}
                <section className="mb-24">
                    <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden border-r-8 border-[#F7931E]">
                        <div className="absolute left-0 top-0 w-32 h-full bg-[#0A7A2F] opacity-20 skew-x-[-15deg] -translate-x-12"></div>
                        <div className="flex flex-col md:flex-row items-center justify-between gap-10 relative z-10">
                            <div className="md:w-1/3">
                                <div className="text-[#F7931E] font-black uppercase tracking-[0.3em] mb-4 flex items-center gap-2 text-sm">
                                    <PieChart className="w-5 h-5" />
                                    Binary Power
                                </div>
                                <h2 className="text-4xl font-black mb-4 uppercase leading-tight">Binary Match Income</h2>
                                <p className="text-slate-400 font-medium">Earn significantly from team balancing and performance.</p>
                            </div>
                            
                            <div className="md:w-2/3 grid grid-cols-1 sm:grid-cols-3 gap-6 w-full">
                                {[
                                    { label: "Starter", ratio: "0.25 : 0.25", profit: "₹100" },
                                    { label: "Growth", ratio: "0.5 : 0.5", profit: "₹200" },
                                    { label: "Executive", ratio: "1 : 1", profit: "₹400" }
                                ].map((m, i) => (
                                    <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all cursor-default">
                                        <div className="text-xs font-bold text-slate-500 uppercase mb-3">{m.label}</div>
                                        <div className="text-lg font-black mb-1">{m.ratio}</div>
                                        <div className="text-3xl font-black text-[#F7931E]">{m.profit}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Lifestyle Rewards Table */}
                <section className="mb-24">
                    <div className="flex items-center gap-4 mb-10">
                        <div className="w-14 h-14 bg-[#0A7A2F] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#0A7A2F]/20">
                            <Award className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-800 uppercase tracking-tight">Lifestyle Rewards</h2>
                            <p className="text-slate-500 font-medium tracking-wide">Achieve Ranks & Earn Global Assets</p>
                        </div>
                    </div>
                    
                    <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-100">
                                        <th className="px-10 py-7 text-xs font-black text-slate-400 uppercase tracking-widest">Global Rank</th>
                                        <th className="px-10 py-7 text-xs font-black text-slate-400 uppercase tracking-widest text-center">Milestone Target</th>
                                        <th className="px-10 py-7 text-xs font-black text-slate-400 uppercase tracking-widest text-right">Lifestyle Reward</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rewards.map((r, i) => (
                                        <tr key={i} className="hover:bg-[#0A7A2F]/[0.02] transition-colors group">
                                            <td className="px-10 py-6">
                                                <div className="flex items-center gap-4">
                                                    <span className="w-10 h-10 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 font-black text-xs border border-slate-100 group-hover:bg-[#0A7A2F] group-hover:text-white group-hover:border-none transition-all">
                                                        {(i + 1).toString().padStart(2, '0')}
                                                    </span>
                                                    <span className="font-black text-slate-800 text-lg">{r.rank}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-6 text-center">
                                                <span className="px-4 py-1.5 bg-slate-100 rounded-lg text-xs font-black text-slate-600 uppercase">
                                                    {r.target}
                                                </span>
                                            </td>
                                            <td className="px-10 py-6 text-right font-black text-[#0A7A2F] text-lg">
                                                <div className="flex items-center justify-end gap-2 group-hover:translate-x-[-10px] transition-transform">
                                                    {r.reward}
                                                    <ArrowUpRight className="w-5 h-5 text-[#F7931E] opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Secure Call to Action */}
                <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="max-w-4xl mx-auto rounded-[3rem] p-1 px-1 bg-[#F7931E]"
                >
                    <div className="bg-white rounded-[2.9rem] p-12 text-center shadow-2xl relative overflow-hidden">
                        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-[#0A7A2F]/5 rounded-full"></div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-800 mb-6 uppercase tracking-tight">Ready to Start Your Journey?</h2>
                        <p className="text-lg text-slate-500 mb-10 max-w-2xl mx-auto font-medium">Join Sanyukt Parivaar today and take the first step towards a sustainable business future.</p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link
                                to="/register"
                                className="w-full sm:w-auto px-12 py-5 bg-[#0A7A2F] text-white rounded-2xl font-black uppercase tracking-[0.1em] shadow-xl hover:shadow-[#0A7A2F]/30 transition-all flex items-center justify-center gap-3"
                            >
                                Get Started Now
                                <Rocket className="w-6 h-6" />
                            </Link>
                            <Link
                                to="/contact"
                                className="w-full sm:w-auto px-10 py-5 border-2 border-slate-200 text-slate-700 rounded-2xl font-black uppercase tracking-[0.1em] hover:bg-slate-50 transition-all flex items-center justify-center gap-3"
                            >
                                Contact Support
                                <Info className="w-6 h-6" />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

// Helper Container for cleaner code
const Container = ({ children, className }) => (
    <div className={`max-w-7xl mx-auto ${className}`}>
        {children}
    </div>
);

export default CompensationPlan;
