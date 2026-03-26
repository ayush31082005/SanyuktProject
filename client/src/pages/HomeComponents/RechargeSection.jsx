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
        <section className="py-24 bg-[#0D0D0D] relative overflow-hidden" id="recharge">
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
                                    <div className="h-1 w-10 bg-[#C8A96A] rounded-full"></div>
                                    <span className="text-[#C8A96A] font-bold text-[10px] tracking-[3px] uppercase">
                                        Fast & Secure
                                    </span>
                                </motion.div>
                                <motion.h2
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.1 }}
                                    className="text-4xl md:text-6xl font-serif font-bold text-[#C8A96A] mb-8 leading-tight"
                                >
                                    Instant Mobile <br />
                                    <span className="text-white underline decoration-[#C8A96A]/30 decoration-4 underline-offset-8">Recharge</span>
                                </motion.h2>
                                <motion.p
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                    className="text-[#F5E6C8]/80 text-xl leading-relaxed max-w-md font-light"
                                >
                                    Experience the power of instant connectivity. Recharge any mobile instantly with zero waiting time.
                                </motion.p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: Zap, title: "Instant", sub: "Processing" },
                                    { icon: BadgeCheck, title: "Secure", sub: "Verified Gateway" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col gap-3 p-6 rounded-[24px] bg-[#1A1A1A] border border-[#C8A96A]/10 shadow-xl gold-glow-hover transition-all">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] flex items-center justify-center text-[#0D0D0D] shadow-lg">
                                            <item.icon className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-[#F5E6C8] text-lg">{item.title}</div>
                                            <div className="text-[10px] text-[#C8A96A] font-bold uppercase tracking-widest mt-1">{item.sub}</div>
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
                            <div className="absolute -inset-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] rounded-[36px] blur-[4px] opacity-10 group-hover:opacity-30 transition-opacity"></div>
                            <div className="bg-[#1A1A1A]/80 backdrop-blur-xl rounded-[32px] shadow-2xl p-8 md:p-10 border border-[#C8A96A]/20 relative z-10 glass-morphism">
                                {/* Bold Cashback Badge - Reduced Size */}
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-full flex items-center justify-center text-[#0D0D0D] shadow-xl z-20 border-4 border-[#0D0D0D]"
                                >
                                    <div className="text-center">
                                        <div className="text-xl font-black leading-none italic">5%</div>
                                        <div className="text-[8px] font-black uppercase tracking-widest mt-0.5">Cashback</div>
                                    </div>
                                </motion.div>

                                <form onSubmit={handleRecharge} className="space-y-6">
                                    {/* Mobile Number */}
                                    <div className="space-y-2">
                                        <label className="text-[11px] font-bold text-[#C8A96A] uppercase tracking-[2px] block ml-1 text-center">
                                            Mobile Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-[#C8A96A]">
                                                <Smartphone className="w-5 h-5 stroke-[2.5px]" />
                                            </div>
                                            <input
                                                type="tel"
                                                maxLength="10"
                                                placeholder="Enter 10 digit number"
                                                value={mobileNumber}
                                                onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                                                className="w-full pl-14 pr-6 py-4 bg-[#0D0D0D]/50 border-2 border-[#C8A96A]/20 focus:border-[#C8A96A] focus:bg-[#0D0D0D] rounded-[20px] outline-none transition-all text-[#F5E6C8] font-bold text-lg placeholder:text-gray-600 shadow-inner"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Operator Selection */}
                                    <div className="space-y-3">
                                        <label className="text-[11px] font-bold text-[#C8A96A] uppercase tracking-[2px] block ml-1 text-center">
                                            Select Operator
                                        </label>
                                        <div className="grid grid-cols-4 gap-3">
                                            {operators.map((op) => (
                                                <button
                                                    key={op.id}
                                                    type="button"
                                                    onClick={() => setOperator(op.id)}
                                                    className={`relative p-3 rounded-[20px] border-2 transition-all duration-300 group ${operator === op.id
                                                        ? 'border-[#C8A96A] bg-[#C8A96A]/10 shadow-lg'
                                                        : 'border-transparent bg-[#0D0D0D]/50 hover:bg-[#1A1A1A] hover:border-[#C8A96A]/30'
                                                        }`}
                                                >
                                                    <div className="aspect-square flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
                                                        <img src={op.logo} alt={op.name} className="w-full h-full object-contain" />
                                                    </div>
                                                     <div className={`text-[10px] font-bold tracking-tight text-center uppercase mt-1 ${operator === op.id ? 'text-[#C8A96A]' : 'text-gray-500'}`}>
                                                        {op.name}
                                                    </div>
                                                    {operator === op.id && (
                                                        <motion.div
                                                            layoutId="active-op-small"
                                                            className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-full flex items-center justify-center text-[#0D0D0D] shadow shadow-[#0D0D0D] ring-2 ring-[#0D0D0D]"
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
                                        <label className="text-[11px] font-bold text-[#C8A96A] uppercase tracking-[2px] block ml-1 text-center">
                                            Recharge Amount
                                        </label>
                                        <div className="relative group/amount">
                                            <div className="absolute inset-y-0 left-5 flex items-center text-[#C8A96A] font-bold text-xl">
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
                                                className="w-full pl-12 pr-36 py-4 bg-[#0D0D0D]/50 border-2 border-[#C8A96A]/20 focus:border-[#C8A96A] focus:bg-[#0D0D0D] rounded-[24px] outline-none transition-all text-[#F5E6C8] font-bold text-lg placeholder:text-gray-600 shadow-inner"
                                                required
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2">
                                                <button
                                                    type="button"
                                                    onClick={openPlanPopup}
                                                    className="px-4 py-2.5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-[16px] text-[10px] font-bold tracking-widest uppercase hover:opacity-90 transition-all shadow-lg flex items-center gap-1.5"
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
                                            whileHover={{ y: -3, boxShadow: '0 20px 40px -12px rgba(200,169,106,0.4)' }}
                                            whileTap={{ scale: 0.98 }}
                                            className="w-full py-6 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] rounded-[24px] font-bold uppercase tracking-[4px] text-base shadow-xl flex items-center justify-center gap-4 transition-all relative overflow-hidden group/pay"
                                        >
                                            <span className="relative z-10">Proceed to Pay</span>
                                            <ArrowRight className="w-5 h-5 stroke-[3px] group-hover/pay:translate-x-1 transition-transform relative z-10" />
                                        </motion.button>

                                        <div className="flex items-center justify-center gap-2 mt-6 opacity-50">
                                            <p className="text-[9px] text-gray-500 font-black uppercase tracking-[2px]">
                                                Secured by <span className="text-[#C8A96A]">Razorpay</span>
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
