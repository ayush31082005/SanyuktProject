import React from 'react';
import { motion } from 'framer-motion';
import {
    ChevronRight, Award, Zap, Star, Shield, Gift,
    TrendingUp, Briefcase, Target, Rocket, CheckCircle2,
    DollarSign, Users, PieChart, Info
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CompensationPlan = () => {
    const packages = [
        { name: "Basic", price: "₹599", bv: "250", pv: "0.25", capping: "₹2000/Day", color: "blue" },
        { name: "Standard", price: "₹1299", bv: "500", pv: "0.5", capping: "₹4000/Day", color: "green" },
        { name: "Premium", price: "₹2699", bv: "1000", pv: "1", capping: "₹10000/Day", color: "orange" }
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
        { rank: "Silver", target: "25PV : 25PV", reward: "₹1,200" },
        { rank: "Gold", target: "50PV : 50PV", reward: "₹2,500" },
        { rank: "Platinum", target: "100PV : 100PV", reward: "₹5,000 + NT" },
        { rank: "Star", target: "200PV : 200PV", reward: "₹10,000 + NT" },
        { rank: "Ruby", target: "500PV : 500PV", reward: "₹50,000" },
        { rank: "Sapphire", target: "1000PV : 1000PV", reward: "₹1 Lakh + India Trip" },
        { rank: "Star Sapphire", target: "2500PV : 2500PV", reward: "₹5 Lakh + India Trip Couple" },
        { rank: "Emerald", target: "6000PV : 6000PV", reward: "₹7 Lakh" },
        { rank: "Diamond", target: "30000PV : 30000PV", reward: "₹10 Lakh" },
        { rank: "Double Diamond", target: "70000PV : 70000PV", reward: "₹15 Lakh" },
        { rank: "Blue Diamond", target: "125k PV : 125k PV", reward: "₹30 Lakh" },
        { rank: "Ambassador", target: "300k PV : 300k PV", reward: "₹1 Crore" },
        { rank: "Crown", target: "700k PV : 700k PV", reward: "₹2.5 Crore" },
        { rank: "MD", target: "1500k PV : 1500k PV", reward: "₹5 Crore" }
    ];

    return (
        <div className="bg-[#f8fafc] min-h-screen font-sans pb-20">
            {/* Hero Header */}
            <div className="bg-gradient-to-br from-[#0A7A2F] to-[#2ecc71] py-20 px-4 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative z-10"
                >
                    <div className="inline-block px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-xs font-black uppercase tracking-widest mb-6 translate-y-[-10px]">
                        Business Binary Plan
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black mb-4 uppercase tracking-tight">Our Compensation Plan</h1>
                    <p className="text-lg text-white/80 max-w-2xl mx-auto font-medium">Unlock unlimited financial freedom with the industry's most transparent and rewarding growth system.</p>
                </motion.div>
            </div>

            <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
                {/* 1. Joining Packages */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-[#F7931E] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-orange-200">
                            <Zap className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Joining Packages</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {packages.map((pkg, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 border border-slate-100 relative overflow-hidden group"
                            >
                                <div className={`absolute top-0 right-0 w-32 h-32 bg-${pkg.color}-500/5 -mr-16 -mt-16 rounded-full group-hover:scale-150 transition-transform duration-700`}></div>
                                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-1">{pkg.name}</h3>
                                <div className="text-4xl font-black text-slate-800 mb-6">{pkg.price}</div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-500 uppercase">BV</span>
                                        <span className="font-black text-slate-700">{pkg.bv}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                                        <span className="text-xs font-bold text-slate-500 uppercase">PV</span>
                                        <span className="font-black text-slate-700">{pkg.pv}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                                        <span className="text-xs font-bold text-green-600 uppercase">Capping</span>
                                        <span className="font-black text-green-700">{pkg.capping}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>

                {/* 2. Direct & Level Income */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
                    {/* Direct Income */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                                <Users className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Direct Income</h2>
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-10 shadow-xl shadow-slate-200 border border-slate-100 text-center">
                            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <DollarSign className="w-10 h-10 text-blue-600" />
                            </div>
                            <div className="text-5xl font-black text-slate-800 mb-4">₹50</div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Per Referral</p>
                            <div className="p-4 bg-green-50 rounded-2xl inline-block border border-green-100">
                                <p className="text-xs font-black text-green-700 uppercase">✓ Sabhi Active Members ko milta hai</p>
                            </div>
                            <div className="mt-4 grid grid-cols-3 gap-3">
                                {[
                                    { name: "Basic", price: "₹599", color: "bg-slate-100 text-slate-600" },
                                    { name: "Standard", price: "₹1299", color: "bg-yellow-100 text-yellow-700" },
                                    { name: "Premium", price: "₹2699", color: "bg-orange-100 text-orange-700" },
                                ].map((p) => (
                                    <div key={p.name} className={`p-2 rounded-xl ${p.color}`}>
                                        <p className="text-[10px] font-black uppercase">{p.name}</p>
                                        <p className="text-sm font-black">{p.price}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>

                    {/* Level Income */}
                    <section>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="w-12 h-12 bg-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-purple-200">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">20 Level Income</h2>
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200 border border-slate-100">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                {levelIncome.map((li, i) => (
                                    <div key={i} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center">
                                        <span className="text-[10px] font-black text-slate-400 uppercase mb-1">Level {li.level}</span>
                                        <span className="text-xl font-black text-slate-800">{li.amount}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                {/* 3. Matching Bonus */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8 text-center justify-center">
                        <div className="w-12 h-12 bg-green-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-green-200">
                            <PieChart className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Matching Bonus</h2>
                    </div>
                    <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-green-500/10 rounded-full blur-3xl"></div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                            <div className="text-center p-6 bg-white/5 rounded-3xl backdrop-blur-sm">
                                <div className="text-xs font-black text-green-400 mb-2 uppercase">Starter Match</div>
                                <div className="text-2xl font-black">0.25 PV : 0.25 PV</div>
                                <div className="text-4xl font-black text-green-500 mt-2">₹100</div>
                            </div>
                            <div className="text-center p-6 bg-white/5 rounded-3xl backdrop-blur-sm border border-white/10 scale-110">
                                <div className="text-xs font-black text-orange-400 mb-2 uppercase">Growth Match</div>
                                <div className="text-2xl font-black">0.5 PV : 0.5 PV</div>
                                <div className="text-4xl font-black text-orange-500 mt-2">₹200</div>
                            </div>
                            <div className="text-center p-6 bg-white/5 rounded-3xl backdrop-blur-sm">
                                <div className="text-xs font-black text-blue-400 mb-2 uppercase">Pro Match</div>
                                <div className="text-2xl font-black">1 PV : 1 PV</div>
                                <div className="text-4xl font-black text-blue-500 mt-2">₹400</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. Rewards Table */}
                <section className="mb-20">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="w-12 h-12 bg-pink-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-pink-200">
                            <Award className="w-6 h-6" />
                        </div>
                        <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Lifetime Rewards</h2>
                    </div>
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-slate-200 border border-slate-100 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Rank</th>
                                        <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Match Target</th>
                                        <th className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Reward</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {rewards.map((r, i) => (
                                        <tr key={i} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 font-black text-xs">
                                                        {i + 1}
                                                    </div>
                                                    <span className="font-black text-slate-700">{r.rank}</span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-5">
                                                <span className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black text-slate-500 uppercase">{r.target}</span>
                                            </td>
                                            <td className="px-8 py-5 text-right font-black text-green-600">{r.reward}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Footer Link */}
                <div className="text-center">
                    <Link
                        to="/register"
                        className="inline-flex items-center gap-3 bg-[#0A7A2F] text-white px-12 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl shadow-green-200 hover:bg-green-700 transition-all active:scale-95"
                    >
                        Join Now & Start Earning
                        <Rocket className="w-6 h-6" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default CompensationPlan;
