import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Zap, Filter, Search, Check, CreditCard, X, ArrowRight, Wallet, BadgeCheck, ZapIcon } from 'lucide-react';

const RechargeSection = ({
    mobileNumber, setMobileNumber,
    operator, setOperator,
    amount, setAmount,
    operators,
    openPlanPopup,
    handleRecharge,
    isLoggedIn
}) => {
    return (
        <section className="py-20 bg-white relative overflow-hidden" id="recharge">
            <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-6xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        {/* Info Side */}
                        <div className="space-y-8">
                            <div>
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    className="flex items-center gap-2 mb-3"
                                >
                                    <div className="h-1 w-10 bg-[#F7931E] rounded-full"></div>
                                    <span className="text-[#F7931E] font-black text-[10px] tracking-[2px] uppercase">
                                        Fast & Secure
                                    </span>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl md:text-5xl font-black text-[#0A7A2F] mb-6 leading-tight"
                                >
                                    Instant Mobile <br />
                                    <span className="text-gray-950 underline decoration-[#F7931E]/30 decoration-4 underline-offset-4">Recharge</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-gray-600 text-lg leading-relaxed max-w-md font-medium"
                                >
                                    Experience the power of instant connectivity. Recharge any mobile instantly with zero waiting time.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Zap, title: "Instant", sub: "Processing" },
                                    { icon: BadgeCheck, title: "Secure", sub: "Verified Gateway" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-3 p-5 rounded-[28px] bg-gray-50 border border-white shadow-lg shadow-gray-200/50">
                                        <div className="w-10 h-10 rounded-xl bg-[#0A7A2F] flex items-center justify-center text-white shadow-md">
                                            <item.icon className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-950 text-base">{item.title}</div>
                                            <div className="text-[9px] text-[#0A7A2F] font-black uppercase tracking-widest mt-0.5">{item.sub}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Form Side */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            className="relative group lg:mt-0"
                        >
                            {/* Main Highlight Border */}
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0A7A2F] to-[#F7931E] rounded-[36px] blur-[2px] opacity-10 group-hover:opacity-20 transition-opacity"></div>

                            <div className="bg-white rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] p-8 md:p-10 border border-gray-100 relative z-10">
                                {/* Bold Cashback Badge - Reduced Size */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#F7931E] to-[#FF4500] rounded-full flex items-center justify-center text-white shadow-xl shadow-orange-500/40 z-20 border-4 border-white"
                                >
                                    <div className="text-center">
                                        <div className="text-xl font-black leading-none italic">5%</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest mt-0.5">Cashback</div>
                                    </div>
                                </motion.div>

                                <form onSubmit={handleRecharge} className="space-y-6">
                                    {/* Mobile Number */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-950 uppercase tracking-[1.5px] block ml-1">
                                            Mobile Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-[#0A7A2F]">
                                                <Smartphone className="w-5 h-5 stroke-[2.5px]" />
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength="10"
                                                placeholder="Enter 10 digit number"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                                className="w-full pl-14 pr-6 py-4 bg-gray-50 border-2 border-gray-100 focus:border-[#0A7A2F] focus:bg-white rounded-[20px] outline-none transition-all text-gray-900 font-bold text-lg placeholder:text-gray-300 shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Operator Selection */}
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-gray-950 uppercase tracking-[1.5px] block ml-1">
                                            Select Operator
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {operators.map((op) => (
                                                <button
                                                    key={op.id}
                                                    type="button"
                                                    onClick={() => setOperator(op.id)}
                                                    className={`relative p-3 rounded-[20px] border-2 transition-all duration-300 group ${operator === op.id
                                                        ? 'border-[#0A7A2F] bg-green-50 shadow-md shadow-green-900/5'
                                                        : 'border-transparent bg-gray-50 hover:bg-white hover:border-gray-200'
                                                        }`}
                                                >
                                                    <div className="aspect-square flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                                                        <img src={op.logo} alt={op.name} className="w-full h-full object-contain" />
                                                    </div>
                                                    <div className={`text-[9px] font-black tracking-tighter text-center uppercase ${operator === op.id ? 'text-[#0A7A2F]' : 'text-gray-400'}`}>
                                                        {op.name}
                                                    </div>
                                                    {operator === op.id && (
                                                        <motion.div
                                                            layoutId="active-op-small"
                                                            className="absolute -top-2 -right-2 w-5 h-5 bg-[#0A7A2F] rounded-full flex items-center justify-center text-white shadow shadow-white ring-2 ring-white"
                                                        >
                                                            <Check className="w-3 h-3 stroke-[3px]" />
                                                        </motion.div>
                                                    )}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Amount Selector */}
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-gray-950 uppercase tracking-[1.5px] block ml-1">
                                            Recharge Amount
                                        </label>
                                        <div className="relative group/amount">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-[#0A7A2F] font-black text-xl">
                                                ₹
                                            </div>
                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="Enter amount"
                                                value={amount}
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    // Allow empty string or numbers >= 0
                                                    if (val === "" || Number(val) >= 0) {
                                                        setAmount(val);
                                                    }
                                                }}
                                                className="w-full pl-12 pr-36 py-4 bg-gray-50 border-2 border-gray-100 focus:border-[#0A7A2F] focus:bg-white rounded-[24px] outline-none transition-all text-gray-900 font-bold text-lg placeholder:text-gray-300 shadow-inner"
                                                required
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <button
                                                    type="button"
                                                    onClick={openPlanPopup}
                                                    className="px-4 py-2.5 bg-[#F7931E] text-white rounded-[16px] text-[10px] font-black tracking-widest uppercase hover:bg-[#e07d0b] transition-all shadow-md shadow-orange-500/20 flex items-center gap-1.5"
                                                >
                                                    <Search className="w-3 h-3 stroke-[2.5px]" />
                                                    Plans
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="pt-4">
                                        <motion.button
                                            whileHover={{ y: -3 }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-6 bg-[#0A7A2F] text-white rounded-[24px] font-black uppercase tracking-[4px] text-base shadow-[0_15px_30px_-12px_rgba(10,122,47,0.3)] flex items-center justify-center gap-4 hover:bg-[#086326] transition-all relative overflow-hidden group/pay"
                                        >
                                            <span className="relative z-10">Proceed to Pay</span>
                                            <ArrowRight className="w-5 h-5 stroke-[3px] group-hover/pay:translate-x-1 transition-transform relative z-10" />
                                        </motion.button>

                                        <div className="flex items-center justify-center gap-2 mt-6 opacity-50">
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[2px]">
                                                Secured by <span className="text-[#0A7A2F]">Razorpay</span>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default RechargeSection;
