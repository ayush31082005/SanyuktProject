import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Wallet, CreditCard, ChevronRight, ShieldCheck, ArrowRight } from 'lucide-react';

const PaymentMethodModal = ({ 
    isOpen, 
    onClose, 
    onSelect, 
    amount, 
    walletBalance, 
    isProcessing 
}) => {
    if (!isOpen) return null;

    const canPayWithWallet = walletBalance >= amount;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="bg-white rounded-[32px] w-full max-w-md overflow-hidden flex flex-col shadow-2xl border border-white/20"
                >
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-wider">Payment Method</h3>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1 italic">Choose how you want to pay</p>
                        </div>
                        <button 
                            onClick={onClose} 
                            disabled={isProcessing}
                            className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    <div className="p-6 space-y-4">
                        {/* Summary */}
                        <div className="bg-[#0A7A2F]/5 rounded-2xl p-4 border border-[#0A7A2F]/10 flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-[#0A7A2F] uppercase tracking-widest">Total Payable</span>
                            <span className="text-2xl font-black text-[#0A7A2F]">₹{amount}</span>
                        </div>

                        {/* Wallet Option */}
                        <motion.button
                            whileHover={canPayWithWallet && !isProcessing ? { x: 5 } : {}}
                            whileTap={canPayWithWallet && !isProcessing ? { scale: 0.98 } : {}}
                            onClick={() => canPayWithWallet && onSelect('wallet')}
                            disabled={!canPayWithWallet || isProcessing}
                            className={`w-full p-5 rounded-[24px] border-2 transition-all flex items-center justify-between relative group ${
                                canPayWithWallet 
                                    ? 'border-gray-50 hover:border-[#0A7A2F] bg-white cursor-pointer' 
                                    : 'border-gray-100 bg-gray-50 cursor-not-allowed grayscale'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                                    canPayWithWallet ? 'bg-green-50 text-[#0A7A2F]' : 'bg-gray-200 text-gray-400'
                                }`}>
                                    <Wallet className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-black text-gray-900 uppercase text-xs tracking-wider">Sanyukt Wallet</div>
                                    <div className={`text-[10px] font-bold ${canPayWithWallet ? 'text-[#F7931E]' : 'text-red-400'}`}>
                                        Balance: ₹{walletBalance?.toFixed(2)}
                                        {!canPayWithWallet && " (Insufficient)"}
                                    </div>
                                </div>
                            </div>
                            <ChevronRight className={`w-5 h-5 transition-colors ${canPayWithWallet ? 'text-gray-300 group-hover:text-[#0A7A2F]' : 'text-gray-200'}`} />
                            
                            {canPayWithWallet && (
                                <div className="absolute -top-2 -right-2 bg-[#0A7A2F] text-white text-[8px] font-black px-2 py-1 rounded-lg shadow-lg uppercase">Fastest</div>
                            )}
                        </motion.button>

                        {/* Razorpay Option */}
                        <motion.button
                            whileHover={!isProcessing ? { x: 5 } : {}}
                            whileTap={!isProcessing ? { scale: 0.98 } : {}}
                            onClick={() => onSelect('online')}
                            disabled={isProcessing}
                            className={`w-full p-5 rounded-[24px] border-2 border-gray-50 hover:border-[#F7931E] bg-white cursor-pointer transition-all flex items-center justify-between group ${
                                isProcessing ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-[#F7931E] flex items-center justify-center shadow-sm">
                                    <CreditCard className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <div className="font-black text-gray-900 uppercase text-xs tracking-wider">Online Payment</div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">UPI, Cards, Net Banking</div>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#F7931E] transition-colors" />
                        </motion.button>
                    </div>

                    {/* Footer */}
                    <div className="p-6 bg-gray-50 flex flex-col items-center gap-3">
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            <ShieldCheck className="w-3 h-3 text-[#0A7A2F]" />
                            100% Secure & Encrypted Payment
                        </div>
                        {isProcessing && (
                            <div className="flex items-center gap-2 text-[10px] font-black text-[#0A7A2F] uppercase animate-pulse">
                                <div className="w-2 h-2 rounded-full bg-[#0A7A2F]"></div>
                                Processing transaction...
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentMethodModal;
