import React, { useState, useEffect } from 'react';
import { motion as Motion, AnimatePresence } from 'framer-motion';
import {
    Package, Shield, Zap, Star, CheckCircle2,
    Wallet, AlertCircle, X, Loader2, CheckCircle, Info, ArrowRight, ShieldCheck, QrCode, Copy
} from 'lucide-react';
import api from '../api';
import toast from 'react-hot-toast';
import { buildCompanyUpiQrUrl, companyBankDetails } from '../constants/companyBankDetails';

const loadRazorpay = () => {
    return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
    });
};

const resolveRazorpayKeyId = (serverKey) =>
    String(import.meta.env.VITE_RAZORPAY_KEY_ID || '').trim() ||
    String(serverKey || '').trim();

// ── Package definitions ───────────────────────────────────────────────────────
const PACKAGES = [
    {
        id: '599',
        name: 'Silver',
        price: 599,
        bv: '250 BV',
        pv: '0.25 PV',
        capping: '₹2,000 / day',
        color: 'from-[#1A1A1A] to-[#0D0D0D]',
        borderActive: 'ring-[#C8A96A]',
        badge: 'bg-[#C8A96A]/10 text-[#C8A96A]',
        btnColor: 'luxury-button',
        icon: Shield,
        features: [
            '250 Business Volume',
            '0.25 Point Value',
            'Daily Capping ₹2,000',
            'Elite Support',
        ],
    },
    {
        id: '1299',
        name: 'Gold',
        price: 1299,
        bv: '500 BV',
        pv: '0.5 PV',
        capping: '₹4,000 / day',
        color: 'from-[#C8A96A]/20 to-[#0D0D0D]',
        borderActive: 'ring-[#D4AF37]',
        badge: 'bg-[#D4AF37]/10 text-[#D4AF37]',
        btnColor: 'luxury-button',
        icon: Star,
        features: [
            '500 Business Volume',
            '0.5 Point Value',
            'Daily Capping ₹4,000',
            'Priority Concierge',
            'Executive Training',
        ],
    },
    {
        id: '2699',
        name: 'Diamond',
        price: 2699,
        bv: '1000 BV',
        pv: '1 PV',
        capping: '₹10,000 / day',
        color: 'from-[#D4AF37]/30 to-[#0D0D0D]',
        borderActive: 'ring-[#C8A96A]',
        badge: 'bg-[#C8A96A]/20 text-[#C8A96A]',
        btnColor: 'luxury-button',
        icon: Zap,
        features: [
            '1000 Business Volume',
            '1 Point Value',
            'Daily Capping ₹10,000',
            '24/7 Global Support',
            'Masterclass Access',
            'Elite Networking',
        ],
    },
];

// ── UI Components ─────────────────────────────────────────────────────────────

const FeatureRow = ({ label, silver, gold, diamond, isIcon = false }) => (
    <div className="grid grid-cols-4 py-4 border-b border-[#C8A96A]/10 items-center">
        <div className="text-[11px] sm:text-xs font-black text-[#C8A96A]/60 uppercase tracking-wider">{label}</div>
        <div className="text-center font-bold text-[#F5E6C8] text-sm">
            {isIcon ? (silver ? <CheckCircle2 className="w-5 h-5 text-[#C8A96A] mx-auto" strokeWidth={2.5} /> : <X className="w-5 h-5 text-white/10 mx-auto" />) : silver}
        </div>
        <div className="text-center font-bold text-[#F5E6C8] text-sm">
            {isIcon ? (gold ? <CheckCircle2 className="w-5 h-5 text-[#C8A96A] mx-auto" strokeWidth={2.5} /> : <X className="w-5 h-5 text-white/10 mx-auto" />) : gold}
        </div>
        <div className="text-center font-bold text-[#F5E6C8] text-sm">
            {isIcon ? (diamond ? <CheckCircle2 className="w-5 h-5 text-[#C8A96A] mx-auto" strokeWidth={2.5} /> : <X className="w-5 h-5 text-white/10 mx-auto" />) : diamond}
        </div>
    </div>
);

const ComparisonTable = () => (
    <div className="mt-12 sm:mt-20 mb-12 sm:mb-20 luxury-box p-4 sm:p-10 shadow-3xl">
        <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#F5E6C8] uppercase tracking-tight mb-3">Elite Comparison</h2>
            <p className="text-[#C8A96A]/60 font-black uppercase text-xs tracking-[0.3em]">Select the plan that fits your ambition</p>
        </div>
        <div className="grid grid-cols-4 pb-4 sm:pb-6 border-b border-[#C8A96A]/30">
            <div className="text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Feature</div>
            <div className="text-center text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Silver</div>
            <div className="text-center text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Gold</div>
            <div className="text-center text-[11px] sm:text-xs font-black text-[#C8A96A] uppercase tracking-wider">Diamond</div>
        </div>
        <FeatureRow label="Price" silver="₹599" gold="₹1299" diamond="₹2699" />
        <FeatureRow label="Team BV" silver="250" gold="500" diamond="1000" />
        <FeatureRow label="Team PV" silver="0.25" gold="0.5" diamond="1" />
        <FeatureRow label="Daily Capping" silver="₹2,000" gold="₹4,000" diamond="₹10,000" />
        <FeatureRow label="Direct Income" silver="₹0" gold="₹50" diamond="₹50" />
        <FeatureRow label="Binary Matching" silver="10%" gold="10%" diamond="10%" />
        <FeatureRow label="Support" silver="Elite" gold="Concierge" diamond="24/7 Global" />
        <FeatureRow label="Training" silver={true} gold={true} diamond={true} isIcon={true} />
        <FeatureRow label="Events" silver={false} gold={true} diamond={true} isIcon={true} />
        <FeatureRow label="Legacy Mentor" silver={false} gold={false} diamond={true} isIcon={true} />
    </div>
);

const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[#C8A96A]/10">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="w-full py-5 sm:py-6 flex items-center justify-between text-left group gap-4"
            >
                <span className="text-base sm:text-lg font-serif font-bold text-[#F5E6C8] group-hover:text-[#C8A96A] transition-colors uppercase tracking-tight">{question}</span>
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isOpen ? 'bg-[#C8A96A] text-[#0D0D0D] rotate-180' : 'bg-[#0D0D0D] border border-[#C8A96A]/30 text-[#C8A96A]'}`}>
                    <Star className="w-4 h-4 fill-current" />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <Motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <p className="pb-6 sm:pb-8 text-sm sm:text-base text-[#F5E6C8]/60 font-medium leading-relaxed italic">{answer}</p>
                    </Motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const FAQSection = () => (
    <div className="max-w-4xl mx-auto mb-12 sm:mb-20 px-0 sm:px-4">
        <div className="mb-8 sm:mb-12 text-center">
            <h2 className="text-2xl sm:text-4xl font-serif font-bold text-[#F5E6C8] uppercase tracking-tight mb-4 text-center">Inquiries & Clarity</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-[#C8A96A] to-transparent mx-auto rounded-full" />
        </div>
        <div className="space-y-1 sm:space-y-2">
            <FAQItem 
                question="How soon is my package activated?" 
                answer="After a successful payment (Wallet or Razorpay), your package is activated instantly. You will see your updated BV, PV, and Daily Capping limit on your dashboard immediately." 
            />
            <FAQItem 
                question="Can I upgrade my package later?" 
                answer="Yes! You can upgrade from Silver to Gold or Diamond at any time. Simply choose the higher package and complete the payment. Your team volume will remain intact." 
            />
            <FAQItem 
                question="What happens to my team volume if I upgrade?" 
                answer="All your previous team volume (BV/PV) is preserved. The upgrade only increases your future earnings potential and daily capping limit." 
            />
            <FAQItem 
                question="How is matching bonus calculated?" 
                answer="The system matches the PV from your Left and Right legs. For every matched PV, you receive a bonus according to your current package's rate, up to your daily capping limit." 
            />
        </div>
    </div>
);

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ pkg, currentBalance, onConfirm, onCancel, loading }) => {
    const [payMethod, setPayMethod] = useState('razorpay');
    const [upiCopied, setUpiCopied] = useState(false);
    const upiQrUrl = buildCompanyUpiQrUrl({ amount: pkg.price, size: 220 });

    const handleCopyUpi = async () => {
        try {
            await navigator.clipboard.writeText(companyBankDetails.upiId);
            setUpiCopied(true);
            toast.success('UPI ID copied');
            window.setTimeout(() => setUpiCopied(false), 1800);
        } catch {
            toast.error('Unable to copy UPI ID');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/80 p-4 backdrop-blur-sm">
            <div className="flex min-h-full items-start justify-center py-4 sm:items-center">
            <Motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="relative flex max-h-[calc(100vh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-[2rem] border border-[#C8A96A]/20 bg-[#111111] shadow-2xl"
            >
                {/* Header with Background Pattern */}
                <div className="relative h-32 bg-black flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 opacity-20" 
                        style={{ 
                            backgroundImage: `radial-gradient(circle at 2px 2px, #C8A96A 1px, transparent 0)`,
                            backgroundSize: '24px 24px'
                        }} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#111111]" />
                    <div className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-[#C8A96A]/30 bg-black/50 backdrop-blur-md">
                        {pkg.icon ? <pkg.icon className="h-8 w-8 text-[#C8A96A]" /> : <Zap className="h-8 w-8 text-[#C8A96A]" />}
                    </div>
                </div>

                <div className="overflow-y-auto px-8 pb-8 pt-4 text-center">
                    <h3 className="text-xl font-black uppercase tracking-widest text-[#F5E6C8]">
                        Confirm Activation
                    </h3>
                    <p className="mt-2 text-sm text-[#F5E6C8]/60">
                        You are about to activate the <span className="text-[#C8A96A] font-bold">{pkg.name}</span> package.
                    </p>

                    <div className="my-6 space-y-4">
                        <div className="rounded-2xl border border-[#C8A96A]/10 bg-black/40 p-5">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-tighter text-[#F5E6C8]/40 mb-3">
                                <span>Package Price</span>
                                <span className="text-[#C8A96A]">₹{pkg.price}</span>
                            </div>
                            
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-black/60 cursor-pointer hover:border-[#C8A96A]/20 transition-all">
                                    <input 
                                        type="radio" 
                                        name="payMethod" 
                                        value="razorpay" 
                                        checked={payMethod === 'razorpay'}
                                        onChange={(e) => setPayMethod(e.target.value)}
                                        className="h-4 w-4 accent-[#C8A96A]"
                                    />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck size={14} className="text-[#C8A96A]" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#F5E6C8]">Razorpay</span>
                                        </div>
                                        <span className="text-[10px] items-center py-0.5 px-2 rounded-full bg-[#C8A96A]/10 text-[#C8A96A] font-bold">Recommended</span>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-black/60 cursor-pointer hover:border-[#C8A96A]/20 transition-all">
                                    <input 
                                        type="radio" 
                                        name="payMethod" 
                                        value="wallet" 
                                        checked={payMethod === 'wallet'}
                                        onChange={(e) => setPayMethod(e.target.value)}
                                        className="h-4 w-4 accent-[#C8A96A]"
                                    />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Wallet size={14} className="text-[#F5E6C8]/70" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#F5E6C8]">E-Wallet</span>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-[9px] text-[#F5E6C8]/40 uppercase font-black">Balance</div>
                                            <div className={`text-[11px] font-bold ${currentBalance < pkg.price ? 'text-red-500' : 'text-[#F5E6C8]'}`}>
                                                ₹{(Number(currentBalance) || 0).toFixed(2)}
                                            </div>
                                        </div>
                                    </div>
                                </label>

                                <label className="flex items-center gap-3 p-3 rounded-xl border border-transparent bg-black/60 cursor-pointer hover:border-[#C8A96A]/20 transition-all">
                                    <input
                                        type="radio"
                                        name="payMethod"
                                        value="upi"
                                        checked={payMethod === 'upi'}
                                        onChange={(e) => setPayMethod(e.target.value)}
                                        className="h-4 w-4 accent-[#C8A96A]"
                                    />
                                    <div className="flex flex-1 items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <QrCode size={14} className="text-[#C8A96A]" />
                                            <span className="text-[11px] font-black uppercase tracking-widest text-[#F5E6C8]">QR / UPI</span>
                                        </div>
                                        <span className="text-[9px] font-black uppercase text-[#F5E6C8]/40">Scan & Copy</span>
                                    </div>
                                </label>
                            </div>

                            {payMethod === 'upi' && (
                                <div className="mt-4 rounded-2xl border border-[#C8A96A]/10 bg-[#0D0D0D] p-4 text-left">
                                    <div className="grid gap-4 sm:grid-cols-[110px,1fr] sm:items-center">
                                        <div className="mx-auto flex h-[110px] w-[110px] items-center justify-center rounded-2xl bg-white p-2">
                                            <img
                                                src={upiQrUrl}
                                                alt="UPI QR Code"
                                                className="h-full w-full object-contain"
                                            />
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#C8A96A]">
                                                Official UPI ID
                                            </p>
                                            <div className="mt-2 flex items-center gap-2 rounded-2xl border border-[#C8A96A]/10 bg-black/50 p-3">
                                                <p className="min-w-0 flex-1 break-all text-sm font-bold text-[#F5E6C8]">
                                                    {companyBankDetails.upiId}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={handleCopyUpi}
                                                    className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#C8A96A]/20 bg-[#C8A96A]/10 text-[#C8A96A] transition hover:bg-[#C8A96A] hover:text-[#0D0D0D]"
                                                    aria-label="Copy UPI ID"
                                                >
                                                    {upiCopied ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                                                </button>
                                            </div>
                                            <p className="mt-3 text-[10px] font-medium leading-relaxed text-[#F5E6C8]/45">
                                                Scan the QR code or copy the UPI ID to complete your payment. This option displays manual payment details only.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <button
                        onClick={() => onConfirm(payMethod)}
                        disabled={loading || payMethod === 'upi' || (payMethod === 'wallet' && currentBalance < pkg.price)}
                        className="group relative h-14 w-full overflow-hidden rounded-2xl bg-[#C8A96A] text-[13px] font-black uppercase tracking-[0.2em] text-[#0D0D0D] transition-transform active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                    >
                        <div className="flex items-center justify-center gap-2">
                            {loading ? (
                                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
                            ) : (
                                <>
                                    <span>{payMethod === 'upi' ? 'Manual UPI Payment' : 'Proceed to Pay'}</span>
                                    <ArrowRight size={18} className="translate-x-0 transition-transform group-hover:translate-x-1" />
                                </>
                            )}
                        </div>
                    </button>

                    {payMethod === 'upi' && (
                        <p className="mt-3 text-[10px] font-medium uppercase tracking-[0.14em] text-[#F5E6C8]/35">
                            QR / UPI shows manual payment details only. Razorpay and E-Wallet continue to work as usual.
                        </p>
                    )}

                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="mt-4 w-full text-[10px] font-black text-[#F5E6C8]/40 uppercase tracking-widest hover:text-[#F5E6C8] transition py-2"
                    >
                        Cancel Selection
                    </button>
                </div>
            </Motion.div>
            </div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const PackageUpgrade = () => {
    const [status, setStatus] = useState(null);
    const [loadingStatus, setLoadingStatus] = useState(true);
    const [selectedPkg, setSelectedPkg] = useState(null);
    const [activating, setActivating] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const res = await api.get('/package/status');
                setStatus(res.data.data);
            } catch (err) {
                console.error('Package status fetch error:', err);
            } finally {
                setLoadingStatus(false);
            }
        };
        fetchStatus();
    }, []);

    const handleActivate = async (payMethod = 'wallet') => {
        if (!selectedPkg) return;
        setActivating(true);
        try {
            if (payMethod === 'razorpay') {
                const resScript = await loadRazorpay();
                if (!resScript) {
                    toast.error('Razorpay SDK failed to load');
                    setActivating(false);
                    return;
                }

                const { data: orderData } = await api.post('/orders/razorpay-order', {
                    amount: selectedPkg.price
                });
                if (!orderData || !orderData.id) throw new Error('Payment order creation failed');

                const razorpayKeyId = resolveRazorpayKeyId(orderData?.key);
                if (!razorpayKeyId) {
                    toast.error('Payment configuration error. Please contact support.');
                    setActivating(false);
                    return;
                }

                const options = {
                    key: razorpayKeyId,
                    amount: orderData.amount,
                    currency: "INR",
                    name: "Sanyukt Parivaar",
                    description: `${selectedPkg.name} Package Activation`,
                    order_id: orderData.id,
                    handler: async (resp) => {
                        try {
                            const res = await api.post('/package/activate', {
                                packageType: selectedPkg.id,
                                paymentMethod: 'razorpay',
                                razorpay_payment_id: resp.razorpay_payment_id,
                                razorpay_order_id: resp.razorpay_order_id,
                                razorpay_signature: resp.razorpay_signature
                            });

                            if (res.data.success) {
                                handleActivationSuccess(res.data.data);
                            }
                        } catch (err) {
                            toast.error(err.response?.data?.message || 'Activation failed');
                            setActivating(false);
                        }
                    },
                    modal: { ondismiss: () => setActivating(false) },
                    theme: { color: "#C8A96A" }
                };
                
                if (window.Razorpay) {
                    const rzp = new window.Razorpay(options);
                    rzp.open();
                } else {
                    toast.error('Razorpay failed to initialize');
                    setActivating(false);
                }
                return;
            }

            const res = await api.post('/package/activate', {
                packageType: selectedPkg.id,
                paymentMethod: 'wallet',
            });

            if (res.data.success) {
                handleActivationSuccess(res.data.data);
            }
        } catch (err) {
            const msg = err?.response?.data?.message || 'Activation failed. Please try again.';
            toast.error(msg);
            setActivating(false);
        }
    };

    const handleActivationSuccess = (data) => {
        setStatus(prev => ({
            ...prev,
            packageType: selectedPkg.id,
            packageName: selectedPkg.name,
            activeStatus: true,
            walletBalance: data.walletBalance,
            bv: data.bv,
            pv: data.pv,
            dailyCapping: data.dailyCapping,
        }));
        setSuccess(selectedPkg.name);
        setSelectedPkg(null);
        setActivating(false);
        toast.success(`${selectedPkg.name} package activated successfully!`);
    };

    const isCurrentPkg = (id) => status?.packageType === id && status?.activeStatus;
    const isLowerPkg = (id) => {
        const prices = { '599': 599, '1299': 1299, '2699': 2699 };
        const currentPrice = prices[status?.packageType] || 0;
        return status?.activeStatus && prices[id] <= currentPrice;
    };

    if (loadingStatus) return (
        <div className="min-h-screen flex items-center justify-center bg-[#0D0D0D]">
            <div className="text-center">
                <Loader2 className="w-10 h-10 text-[#C8A96A] animate-spin mx-auto mb-4" />
                <p className="text-[#C8A96A]/40 text-[10px] font-black uppercase tracking-[0.2em]">Loading Packages...</p>
            </div>
        </div>
    );

    return (
        <>
            <AnimatePresence>
                {selectedPkg && (
                    <ConfirmModal
                        pkg={selectedPkg}
                        currentBalance={status?.walletBalance || 0}
                        onConfirm={handleActivate}
                        onCancel={() => setSelectedPkg(null)}
                        loading={activating}
                    />
                )}
            </AnimatePresence>

            <div className="pb-12 px-3 sm:px-4 max-w-7xl mx-auto min-h-screen bg-[#0D0D0D] font-sans selection:bg-[#C8A96A]/30">
                {/* Success Banner */}
                <AnimatePresence>
                    {success && (
                        <Motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="mb-8 luxury-box p-5 flex items-center gap-4 relative"
                        >
                            <div className="w-14 h-14 bg-[#C8A96A]/10 border border-[#C8A96A]/30 rounded-full flex items-center justify-center shrink-0">
                                <CheckCircle className="w-7 h-7 text-[#C8A96A]" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1">
                                <p className="text-xs text-[#C8A96A]/60 font-black uppercase mb-1">Upgrade Successful</p>
                                <p className="text-xl sm:text-2xl font-serif font-bold text-[#F5E6C8]">{success} Tier Unlocked</p>
                            </div>
                            <button onClick={() => setSuccess(null)} className="luxury-button !p-2 shrink-0">
                                <X className="w-4 h-4" />
                            </button>
                        </Motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <div className="relative mb-8 sm:mb-12 py-10 text-center">
                    <Motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-3xl sm:text-4xl md:text-6xl font-serif font-bold text-[#F5E6C8] uppercase mb-4">
                            Upgrade Their <span className="text-[#C8A96A]">Potential</span>
                        </h1>
                        <p className="max-w-xl mx-auto text-[#F5E6C8]/50 font-semibold italic">
                            Elevate your business capabilities by transitioning to a superior package tier.
                        </p>
                    </Motion.div>
                </div>

                {/* Balance Strip */}
                <div className="mb-8 luxury-box p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl flex items-center justify-center text-[#C8A96A]">
                            <Wallet className="w-7 h-7" />
                        </div>
                        <div>
                            <p className="text-xs text-[#C8A96A]/60 font-black uppercase mb-1">Digital Credits</p>
                            <p className="text-2xl font-serif font-bold text-[#F5E6C8]">
                                ₹{(status?.walletBalance || 0).toLocaleString('en-IN')}
                            </p>
                        </div>
                    </div>
                    {status?.activeStatus && (
                        <div className="px-5 py-2 rounded-full text-xs font-black uppercase border border-[#C8A96A]/30 bg-[#C8A96A]/5 text-[#C8A96A]">
                            Current: {status.packageName} Active
                        </div>
                    )}
                </div>

                {/* Package Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    {PACKAGES.map((pkg, index) => {
                        const isCurrent = isCurrentPkg(pkg.id);
                        const isLower = isLowerPkg(pkg.id);
                        const Icon = pkg.icon;

                        return (
                            <Motion.div
                                key={pkg.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`luxury-box flex flex-col h-full hover:scale-[1.02] transition-transform ${isCurrent ? '!border-[#C8A96A]/60' : ''}`}
                            >
                                <div className={`bg-gradient-to-br ${pkg.color} p-6 text-center border-b border-[#C8A96A]/10`}>
                                    <div className="flex justify-center mb-4">
                                        <div className="p-4 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-2xl text-[#C8A96A]">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-serif font-bold text-[#F5E6C8] uppercase tracking-widest mb-2">{pkg.name}</h3>
                                    <div className="text-4xl font-serif font-bold text-[#C8A96A]">₹{pkg.price}</div>
                                </div>

                                <div className="px-6 py-4 border-b border-[#C8A96A]/5 grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] text-[#C8A96A]/60 font-black uppercase">Volume</p>
                                        <p className="text-lg font-bold text-[#F5E6C8]">{pkg.bv}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] text-[#C8A96A]/60 font-black uppercase">Points</p>
                                        <p className="text-lg font-bold text-[#F5E6C8]">{pkg.pv}</p>
                                    </div>
                                </div>

                                <div className="p-6 flex-1">
                                    <ul className="space-y-3 mb-6">
                                        {pkg.features.map((f, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <CheckCircle2 className="w-4 h-4 text-[#C8A96A]/40" />
                                                <span className="text-xs font-bold text-[#F5E6C8]/70 uppercase">{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="mt-auto">
                                        {isCurrent ? (
                                            <div className="w-full py-4 text-center text-[#C8A96A] text-[10px] font-black uppercase border border-[#C8A96A]/30 bg-[#C8A96A]/5 rounded-xl">
                                                Active Standing
                                            </div>
                                        ) : isLower ? (
                                            <div className="w-full py-4 text-center text-white/20 text-[10px] font-black uppercase border border-white/5 bg-white/5 rounded-xl">
                                                Legacy Tier
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setSelectedPkg(pkg)}
                                                className="luxury-button w-full h-12 flex items-center justify-center gap-2"
                                            >
                                                Apply Upgrade
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </Motion.div>
                        );
                    })}
                </div>

                <ComparisonTable />
                <FAQSection />
            </div>
        </>
    );
};

export default PackageUpgrade;
