import React, { useState } from 'react';
import {
    Download, Building2, Landmark, QrCode, ClipboardCheck,
    Copy, Info, CheckCircle2, CreditCard, ShieldCheck
} from 'lucide-react';
import toast from 'react-hot-toast';

const OurBanker = () => {
    const [copied, setCopied] = useState(false);

    const bankDetails = {
        accountName: "SAYUKT PARIVAR AND RICH LIFE PVT. LTD.",
        accountNumber: "5935938755",
        ifsc: "CBIN0282390",
        bankName: "CENTRAL BANK OF INDIA",
        branch: "LALPUR",
        upiId: "20260325575843-iservuqrsbrp@cbin"
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Copied to clipboard!");
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handlePrint = () => window.print();

    return (
        <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans transition-all duration-500 selection:bg-green-100 selection:text-green-800">
            {/* Header Section */}
            <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row md:items-end justify-between gap-6 print:hidden">
                <div className="animate-slideUp">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-px w-8 bg-green-500"></span>
                        <p className="text-[11px] font-black uppercase tracking-[0.3em] text-green-600">Company Portfolio</p>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
                        Our <span className="text-green-600">Banker</span>
                    </h1>
                    <p className="mt-3 text-slate-500 font-medium max-w-md">Official banking and settlement details for Sanyukt Parivaar & Rich Life Pvt Ltd.</p>
                </div>

                <button
                    onClick={handlePrint}
                    className="group relative inline-flex items-center gap-3 overflow-hidden rounded-2xl bg-white px-8 py-4 text-sm font-black text-slate-800 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-95 border border-slate-100"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-green-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100"></div>
                    <Download size={18} className="relative z-10 text-green-600 group-hover:bounce" />
                    <span className="relative z-10 uppercase tracking-widest">Download Details</span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-start">

                {/* Left Side: Bank Card */}
                <div className="space-y-6 animate-slideInLeft">
                    <div className="relative overflow-hidden group">
                        {/* Decorative Background for Card */}
                        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-green-600/5 rounded-full blur-3xl pointer-events-none group-hover:bg-green-600/10 transition-colors"></div>

                        <div className="relative bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-8 md:p-12 overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center border border-green-100/50 shadow-inner">
                                    <Building2 className="text-green-600 w-8 h-8" />
                                </div>
                                <div className="text-right">
                                    <ShieldCheck className="text-green-500 w-6 h-6 ml-auto mb-1 opacity-40" />
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verified Multi-City Account</span>
                                </div>
                            </div>

                            <div className="space-y-8">
                                <div className="group/item cursor-pointer" onClick={() => handleCopy(bankDetails.accountName)}>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex justify-between">
                                        Account Holder Name
                                        <Copy className="w-3 h-3 opacity-0 group-hover/item:opacity-100 transition-opacity" />
                                    </p>
                                    <h2 className="text-xl md:text-2xl font-black text-slate-900 group-hover/item:text-green-600 transition-colors uppercase leading-tight">
                                        {bankDetails.accountName}
                                    </h2>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="group/item cursor-pointer" onClick={() => handleCopy(bankDetails.accountNumber)}>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">A/C Number</p>
                                        <p className="text-2xl font-black font-mono tracking-tight text-slate-800 group-hover/item:text-green-600 transition-colors">
                                            {bankDetails.accountNumber}
                                        </p>
                                    </div>
                                    <div className="group/item cursor-pointer" onClick={() => handleCopy(bankDetails.ifsc)}>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">IFSC Code</p>
                                        <p className="text-2xl font-black font-mono tracking-tight text-slate-800 group-hover/item:text-green-600 transition-colors">
                                            {bankDetails.ifsc}
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{bankDetails.bankName}</p>
                                        <p className="text-sm font-bold text-slate-700 flex items-center gap-2">
                                            <Landmark className="w-4 h-4 text-green-600" />
                                            {bankDetails.branch}
                                        </p>
                                    </div>
                                    <div className="bg-slate-50 px-4 py-2 rounded-xl">
                                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none">Status: <span className="text-green-600">Active</span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Badge */}
                    <div className="bg-green-600 rounded-[2rem] p-6 text-white shadow-lg shadow-green-900/10 flex items-center gap-6 overflow-hidden relative">
                        <div className="absolute right-0 top-0 bottom-0 w-24 bg-white/10 -skew-x-12 transform translate-x-8"></div>
                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 animate-pulse">
                            <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                            <h4 className="font-black text-sm uppercase tracking-widest mb-1">Corporate Settlement</h4>
                            <p className="text-white/70 text-xs font-medium leading-relaxed">Payments made to this account are directly linked to Sanyukt Parivaar corporate clearing.</p>
                        </div>
                    </div>
                </div>

                {/* Right Side: UPI & QR Code */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] p-8 md:p-12 animate-slideInRight">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-3 py-2 px-6 bg-slate-50 rounded-full border border-slate-100 mb-6">
                            <QrCode className="w-4 h-4 text-green-600" />
                            <span className="text-slate-800 font-black text-[10px] uppercase tracking-[0.2em]">Instant UPI Payment</span>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Scan & Pay</h3>
                        <p className="text-slate-500 text-sm font-medium">Fastest way to settle your account balance</p>
                    </div>

                    <div className="relative mx-auto w-64 h-64 mb-10 group">
                        {/* Decorative Frames for QR */}
                        <div className="absolute inset-0 border-2 border-green-600/20 rounded-3xl animate-ping opacity-25"></div>
                        <div className="absolute -inset-4 border border-slate-100 rounded-[2rem]"></div>

                        <div className="relative bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-full w-full flex items-center justify-center">
                            {/* In a real app, generate the actual QR. Using a placeholder for now */}
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=upi://pay?pa=${bankDetails.upiId}&pn=${encodeURIComponent(bankDetails.accountName)}&cu=INR`}
                                alt="Payment QR Code"
                                className="w-full h-full object-contain grayscale transition duration-500 group-hover:grayscale-0"
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div
                            className="bg-slate-50 rounded-2xl p-4 border border-slate-100 hover:border-green-300 transition-all flex items-center justify-between group cursor-pointer"
                            onClick={() => handleCopy(bankDetails.upiId)}
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                    <Landmark className="w-5 h-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">VPA / UPI ID</p>
                                    <p className="text-sm font-black text-slate-800">{bankDetails.upiId}</p>
                                </div>
                            </div>
                            <div className="p-2 rounded-lg bg-white shadow-sm border border-slate-100 group-hover:bg-green-600 group-hover:text-white transition-all">
                                {copied ? <CheckCircle2 className="w-5 h-5" /> : <ClipboardCheck className="w-5 h-5" />}
                            </div>
                        </div>

                        <div className="p-6 bg-slate-900 rounded-3xl relative overflow-hidden">
                            <div className="absolute bottom-0 right-0 -mb-4 -mr-4 opacity-5">
                                <Info className="w-32 h-32 text-white" />
                            </div>
                            <div className="flex gap-4 relative z-10">
                                <Info className="w-6 h-6 text-green-400 flex-shrink-0" />
                                <div className="space-y-3">
                                    <p className="text-white font-black text-sm tracking-wide">IMPORTANT NOTE</p>
                                    <ul className="text-white/60 text-[11px] leading-relaxed space-y-2 list-disc pl-4 font-medium">
                                        <li>Always share a screenshot of the payment receipt.</li>
                                        <li>Include your <span className="text-white font-bold">Member ID</span> in the payment remark.</li>
                                        <li>Settlement may take up to 2-4 hours for verification.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── STEP-BY-STEP DEPOSIT GUIDE ── */}
            <div className="max-w-6xl mx-auto mt-4 px-4 md:px-0">
                <div className="text-center mb-12 animate-slideUp">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">How to <span className="text-green-600">Deposit</span></h2>
                    <p className="text-slate-500 mt-2 font-medium">Follow these simple steps for a hassle-free settlement</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {[
                        { step: "01", title: "Scan or Copy", desc: "Scan the QR code or copy the bank details/UPI ID provided above.", icon: Copy },
                        { step: "02", title: "Complete Payment", desc: "Use any UPI app or Net Banking to transfer the desired amount.", icon: CreditCard },
                        { step: "03", title: "Share Screenshot", desc: "Upload the payment proof or share it with your manager for instant update.", icon: ClipboardCheck }
                    ].map((item, i) => (
                        <div key={i} className="group relative bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 text-center animate-slideUp" style={{ animationDelay: `${i * 0.1}s` }}>
                            <div className="absolute top-4 right-8 text-6xl font-black text-slate-50 opacity-0 group-hover:opacity-100 transition-opacity">{item.step}</div>
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <item.icon className="w-8 h-8 text-green-600" />
                            </div>
                            <h4 className="text-lg font-black text-slate-900 mb-3">{item.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FAQ SECTION ── */}
            <div className="max-w-6xl mx-auto mt-10 px-4 md:px-0 grid lg:grid-cols-3 gap-12 items-start">
                <div className="lg:col-span-1 animate-slideInLeft">
                    <div className="sticky top-24">
                        <span className="text-[10px] font-black text-green-600 uppercase tracking-[0.3em] mb-4 block">Help Center</span>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-6">Frequently Asked <span className="text-green-600">Questions</span></h2>
                        <p className="text-slate-500 font-medium leading-relaxed mb-8">Can't find what you're looking for? Contact our 24/7 support team for immediate assistance.</p>

                        <div className="p-6 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/20 text-center">
                                    <ShieldCheck className="w-6 h-6 mx-auto" />
                                </div>
                                <div>
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Support Priority</p>
                                    <p className="text-sm font-black text-slate-900">Member Protection</p>
                                </div>
                            </div>
                            <p className="text-[11px] text-slate-500 font-medium leading-relaxed">We ensure 100% safety of your funds. Every transaction is legally verified and acknowledged.</p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-4 animate-slideInRight">
                    {[
                        { q: "How much time does it take for wallet update?", a: "Most UPI transactions are updated within 30 minutes. Bank transfers (NEFT/IMPS) may take up to 2-4 working hours." },
                        { q: "What should I write in the payment remark?", a: "Please always mention your unique Member ID in the remark to help us identify your payment quickly." },
                        { q: "Is there any limit on the deposit amount?", a: "There is no limit from our side, but your bank or UPI app may have daily limits for transactions." },
                        { q: "What if my payment is deducted but not updated?", a: "Don't worry! Contact support with your UTR/Transaction ID, and we will verify it manually within an hour." }
                    ].map((faq, i) => (
                        <div key={i} className="bg-white p-6 rounded-[1.5rem] border border-slate-100 hover:border-green-200 transition-all group">
                            <h4 className="text-sm font-black text-slate-900 mb-2 flex items-center gap-3">
                                <span className="w-6 h-6 rounded-lg bg-slate-50 flex items-center justify-center text-[10px] text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">?</span>
                                {faq.q}
                            </h4>
                            <p className="text-xs text-slate-500 leading-relaxed font-medium pl-9">{faq.a}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ── FINAL TRUST BANNER ── */}
            <div className="max-w-6xl mx-auto mt-10 px-4 md:px-0 mb-12">
                <div className="bg-green-600 rounded-[2.5rem] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl shadow-green-900/20">
                    <div className="absolute top-0 right-0 p-8 opacity-10 animate-pulse">
                        <ShieldCheck className="w-64 h-64" />
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        <div className="w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center shadow-inner flex-shrink-0">
                            <ShieldCheck className="w-10 h-10 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-2xl font-black mb-2">Transact with Total Confidence</h4>
                            <p className="text-white/80 text-sm font-medium leading-relaxed max-w-2xl">
                                Your association with <span className="text-white font-black italic underline decoration-green-400">Sanyukt Parivaar</span> is protected by state-of-the-art security and legal compliance. We maintain 100% transparency in all financial dealings.
                            </p>
                        </div>
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map(n => (
                                <div key={n} className="w-12 h-12 rounded-full border-4 border-green-500 bg-slate-100 flex items-center justify-center overflow-hidden">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${n}`} alt="user" className="w-full h-full object-cover" />
                                </div>
                            ))}
                            <div className="w-12 h-12 rounded-full border-4 border-green-500 bg-white flex items-center justify-center text-[10px] font-black text-green-600 uppercase">10k+</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Print Only Section (Plain details for clear printing) */}
            <div className="hidden print:block p-8 border-2 border-slate-900 mt-20">
                <h1 className="text-2xl font-bold mb-6 text-center underline uppercase">Official Banking Details</h1>
                <div className="space-y-4">
                    <p><strong>Company Name:</strong> {bankDetails.accountName}</p>
                    <p><strong>Bank Name:</strong> {bankDetails.bankName}</p>
                    <p><strong>Account Number:</strong> {bankDetails.accountNumber}</p>
                    <p><strong>IFSC Code:</strong> {bankDetails.ifsc}</p>
                    <p><strong>Branch:</strong> {bankDetails.branch}</p>
                    <p><strong>UPI ID:</strong> {bankDetails.upiId}</p>
                </div>
                <div className="mt-12 text-center text-sm text-slate-500">
                    Sanyukt Parivaar & Rich Life Pvt Ltd - Official Document
                </div>
            </div>

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes slideInLeft {
                    from { opacity: 0; transform: translateX(-40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes slideInRight {
                    from { opacity: 0; transform: translateX(40px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                .animate-slideUp { animation: slideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slideInLeft { animation: slideInLeft 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                .animate-slideInRight { animation: slideInRight 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
                
                @media print {
                    .print\\:hidden { display: none !important; }
                    body { background: white !important; padding: 0 !important; }
                }
            `}</style>
        </div>
    );
};

export default OurBanker;
