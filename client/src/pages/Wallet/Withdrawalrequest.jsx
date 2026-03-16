import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, Wallet, Banknote, Smartphone, ChevronRight,
    AlertCircle, CheckCircle, Loader2, Info, X, IndianRupee,
    Shield, Clock, Receipt
} from 'lucide-react';
import api from '../../api';
import toast from 'react-hot-toast';

const TDS_RATE = 0.05;
const PROCESSING_RATE = 0.02;

const calc = (amount) => {
    const tds = Math.round(amount * TDS_RATE);
    const fee = Math.round(amount * PROCESSING_RATE);
    const net = amount - tds - fee;
    return { tds, fee, net };
};

// ── Confirm Modal ─────────────────────────────────────────────────────────────
const ConfirmModal = ({ data, onConfirm, onCancel, loading }) => {
    const { amount, method, tds, fee, net, bankName, accountNumber, ifscCode, upiId } = data;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.93 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.93 }}
                className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-6"
            >
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-lg font-black text-gray-800">Withdrawal Confirm Karo</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-xl">
                        <X className="w-4 h-4 text-gray-500" />
                    </button>
                </div>

                <div className="flex items-center gap-2 mb-4">
                    {method === 'Bank Transfer'
                        ? <Banknote className="w-5 h-5 text-blue-500" />
                        : <Smartphone className="w-5 h-5 text-purple-500" />}
                    <span className="text-sm font-black text-gray-700">{method}</span>
                    {method === 'Bank Transfer' && (
                        <span className="text-xs text-gray-500 ml-1">
                            — {bankName} · ****{accountNumber?.slice(-4)}
                        </span>
                    )}
                    {method === 'UPI' && (
                        <span className="text-xs text-gray-500 ml-1">— {upiId}</span>
                    )}
                </div>

                <div className="bg-gray-50 rounded-2xl p-4 mb-5 space-y-3">
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Withdrawal Amount</span>
                        <span className="font-bold text-gray-800">₹{amount.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-red-500">TDS Deduction (5%)</span>
                        <span className="font-bold text-red-500">- ₹{tds.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                        <span className="text-orange-500">Processing Fee (2%)</span>
                        <span className="font-bold text-orange-500">- ₹{fee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                        <span className="font-black text-gray-700">Net Amount</span>
                        <span className="text-xl font-black text-green-600">₹{net.toLocaleString('en-IN')}</span>
                    </div>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 mb-5 flex gap-2">
                    <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-amber-700 font-medium">
                        Request submit hone ke baad admin 24-48 ghante mein process karega. Wallet se amount abhi deduct ho jaayega.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button onClick={onCancel} disabled={loading}
                        className="flex-1 py-3 rounded-2xl border border-gray-200 text-gray-600 font-bold text-sm hover:bg-gray-50 transition disabled:opacity-50">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={loading}
                        className="flex-1 py-3 rounded-2xl bg-green-600 text-white font-black text-sm hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-60">
                        {loading
                            ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                            : <>Confirm Submit</>}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

// ── Main Component ────────────────────────────────────────────────────────────
const WithdrawalRequest = () => {
    const navigate = useNavigate();

    const [walletBalance, setWalletBalance] = useState(0);
    const [loadingBalance, setLoadingBalance] = useState(true);
    const [amount, setAmount] = useState('');
    const [method, setMethod] = useState('');
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [confirmAccount, setConfirmAccount] = useState('');
    const [ifscCode, setIfscCode] = useState('');
    const [upiId, setUpiId] = useState('');
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        api.get('/wallet/topup/balance')
            .then(res => setWalletBalance(res.data.walletBalance || 0))
            .catch(() => { })
            .finally(() => setLoadingBalance(false));
    }, []);

    const parsedAmount = parseInt(amount, 10);
    const isValidAmount = !isNaN(parsedAmount) && parsedAmount >= 500 && parsedAmount <= walletBalance;
    const { tds, fee, net } = isValidAmount ? calc(parsedAmount) : { tds: 0, fee: 0, net: 0 };

    const isBankValid = method === 'Bank Transfer' &&
        bankName.trim() && accountNumber.trim() &&
        accountNumber === confirmAccount &&
        ifscCode.trim().length >= 11;

    const isUpiValid = method === 'UPI' &&
        /^[\w.\-]{2,256}@[a-zA-Z]{2,64}$/.test(upiId.trim());

    const canSubmit = isValidAmount && (isBankValid || isUpiValid);

    const handleSubmit = async () => {
        setSubmitting(true);
        try {
            const payload = {
                amount: parsedAmount,
                method,
                ...(method === 'Bank Transfer' ? { bankName, accountNumber, ifscCode } : {}),
                ...(method === 'UPI' ? { upiId } : {}),
            };
            const res = await api.post('/wallet/withdraw', payload);
            if (res.data.success) {
                setSuccess({
                    refNo: res.data.withdrawal?.referenceNo || '—',
                    net: res.data.withdrawal?.amount || net,
                    tds: res.data.deductions?.tds || tds,
                    fee: res.data.deductions?.processingFee || fee,
                });
                setWalletBalance(prev => prev - parsedAmount);
                setShowConfirm(false);
                toast.success('Withdrawal request submit ho gayi!');
                // Reset form
                setAmount(''); setMethod(''); setBankName('');
                setAccountNumber(''); setConfirmAccount('');
                setIfscCode(''); setUpiId('');
            }
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Error aaya. Dobara try karo.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <AnimatePresence>
                {showConfirm && (
                    <ConfirmModal
                        data={{ amount: parsedAmount, method, tds, fee, net, bankName, accountNumber, ifscCode, upiId }}
                        onConfirm={handleSubmit}
                        onCancel={() => setShowConfirm(false)}
                        loading={submitting}
                    />
                )}
            </AnimatePresence>

            <div className="p-4 md:p-6 max-w-2xl mx-auto bg-gray-50 min-h-screen">

                {/* Header */}
                <motion.div initial={{ opacity: 0, y: -18 }} animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-6">
                    <button onClick={() => navigate(-1)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition group active:scale-95">
                        <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-gray-800">Withdrawal Request</h1>
                        <p className="text-sm text-gray-500 mt-0.5">Wallet se bank / UPI mein paise nikalo</p>
                    </div>
                </motion.div>

                {/* Success state */}
                <AnimatePresence>
                    {success && (
                        <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="mb-5 bg-green-50 border border-green-200 rounded-3xl p-5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="font-black text-green-700 text-lg">Request Submitted!</p>
                                    <p className="text-sm text-green-600">Ref: {success.refNo}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-3 text-center mb-4">
                                {[
                                    { label: 'Net Amount', val: `₹${success.net.toLocaleString('en-IN')}`, color: 'text-green-700' },
                                    { label: 'TDS (5%)', val: `₹${success.tds.toLocaleString('en-IN')}`, color: 'text-red-500' },
                                    { label: 'Fee (2%)', val: `₹${success.fee.toLocaleString('en-IN')}`, color: 'text-orange-500' },
                                ].map(({ label, val, color }) => (
                                    <div key={label} className="bg-white rounded-2xl p-3">
                                        <p className={`text-base font-black ${color}`}>{val}</p>
                                        <p className="text-xs text-gray-400">{label}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => navigate('/my-account/wallet/withdrawal-history')}
                                    className="flex-1 py-2.5 rounded-2xl bg-green-600 text-white text-sm font-black hover:bg-green-700 transition">
                                    History Dekho
                                </button>
                                <button onClick={() => setSuccess(null)}
                                    className="flex-1 py-2.5 rounded-2xl border border-green-200 text-green-700 text-sm font-black hover:bg-green-50 transition">
                                    Naya Request
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {!success && (
                    <>
                        {/* Wallet Balance Card */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.05 }}
                            className="bg-gradient-to-r from-green-600 to-green-700 rounded-3xl p-5 mb-5 text-white shadow-lg shadow-green-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-1">Available Balance</p>
                                    {loadingBalance
                                        ? <Loader2 className="w-6 h-6 animate-spin text-green-200" />
                                        : <p className="text-4xl font-black">₹{walletBalance.toLocaleString('en-IN')}</p>}
                                    <p className="text-green-200 text-xs mt-2">Min: ₹500 · TDS 5% + Processing 2%</p>
                                </div>
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                    <Wallet className="w-7 h-7 text-white" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Step 1: Amount */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.08 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-4">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                Step 1 — Amount
                            </p>

                            <div className={`flex items-center gap-3 border-2 rounded-2xl px-4 py-3 transition-all mb-3
                                ${amount && !isValidAmount ? 'border-red-300 bg-red-50'
                                    : amount && isValidAmount ? 'border-green-400 bg-green-50'
                                        : 'border-slate-200 focus-within:border-green-400'}`}>
                                <IndianRupee className={`w-5 h-5 shrink-0 ${amount && isValidAmount ? 'text-green-600' : 'text-slate-400'}`} />
                                <input
                                    type="text" inputMode="numeric" placeholder="Minimum ₹500"
                                    value={amount}
                                    onChange={e => setAmount(e.target.value.replace(/[^0-9]/g, ''))}
                                    className="flex-1 bg-transparent text-xl font-black text-gray-800 outline-none placeholder:text-slate-300"
                                />
                                {amount && (
                                    <button onClick={() => setAmount('')} className="text-slate-400 text-xs font-bold">✕</button>
                                )}
                            </div>

                            {amount && !isNaN(parsedAmount) && parsedAmount < 500 && (
                                <p className="text-xs text-red-500 font-bold flex items-center gap-1 mb-2">
                                    <AlertCircle className="w-3 h-3" /> Minimum ₹500 chahiye
                                </p>
                            )}
                            {amount && !isNaN(parsedAmount) && parsedAmount > walletBalance && (
                                <p className="text-xs text-red-500 font-bold flex items-center gap-1 mb-2">
                                    <AlertCircle className="w-3 h-3" /> Balance insufficient hai
                                </p>
                            )}

                            {/* Quick amounts */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {[500, 1000, 2000, 5000].map(a => (
                                    <button key={a}
                                        onClick={() => setAmount(String(Math.min(a, walletBalance)))}
                                        className={`px-3 py-1.5 rounded-xl text-sm font-black border transition active:scale-95
                                            ${parsedAmount === a ? 'bg-green-600 text-white border-green-600'
                                                : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-green-400'}`}>
                                        ₹{a.toLocaleString('en-IN')}
                                    </button>
                                ))}
                                <button onClick={() => setAmount(String(walletBalance))}
                                    className="px-3 py-1.5 rounded-xl text-sm font-black border border-slate-200 bg-slate-50 text-slate-600 hover:border-green-400 transition active:scale-95">
                                    Max
                                </button>
                            </div>

                            {/* Live breakdown */}
                            <AnimatePresence>
                                {isValidAmount && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="bg-slate-50 rounded-2xl p-4 space-y-2">
                                        {[
                                            { label: 'Gross Amount', val: `₹${parsedAmount.toLocaleString('en-IN')}`, color: 'text-gray-700' },
                                            { label: 'TDS (5%)', val: `- ₹${tds.toLocaleString('en-IN')}`, color: 'text-red-500' },
                                            { label: 'Processing (2%)', val: `- ₹${fee.toLocaleString('en-IN')}`, color: 'text-orange-500' },
                                        ].map(({ label, val, color }) => (
                                            <div key={label} className="flex justify-between text-sm">
                                                <span className="text-gray-500">{label}</span>
                                                <span className={`font-bold ${color}`}>{val}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-gray-200 pt-2 flex justify-between">
                                            <span className="font-black text-gray-700 text-sm">Net Payable</span>
                                            <span className="font-black text-green-600 text-lg">₹{net.toLocaleString('en-IN')}</span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Step 2: Method */}
                        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.11 }}
                            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-4">
                            <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3">
                                Step 2 — Payment Method
                            </p>

                            <div className="grid grid-cols-2 gap-3 mb-4">
                                {[
                                    { id: 'Bank Transfer', icon: Banknote, label: 'Bank Transfer', sub: 'NEFT / IMPS' },
                                    { id: 'UPI', icon: Smartphone, label: 'UPI', sub: 'Instant transfer' },
                                ].map(({ id, icon: Icon, label, sub }) => (
                                    <button key={id} onClick={() => setMethod(id)}
                                        className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95
                                            ${method === id ? 'border-green-500 bg-green-50' : 'border-slate-200 hover:border-slate-300'}`}>
                                        <Icon className={`w-6 h-6 mb-2 ${method === id ? 'text-green-600' : 'text-slate-400'}`} />
                                        <p className={`text-sm font-black ${method === id ? 'text-green-700' : 'text-slate-700'}`}>{label}</p>
                                        <p className="text-xs text-slate-400">{sub}</p>
                                    </button>
                                ))}
                            </div>

                            {/* Bank fields */}
                            <AnimatePresence>
                                {method === 'Bank Transfer' && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }} className="space-y-3">
                                        {[
                                            { label: 'Bank Name', val: bankName, setter: setBankName, ph: 'e.g. SBI, HDFC, ICICI' },
                                            { label: 'Account Number', val: accountNumber, setter: setAccountNumber, ph: 'Enter account number' },
                                            { label: 'Confirm Account Number', val: confirmAccount, setter: setConfirmAccount, ph: 'Re-enter account number' },
                                            { label: 'IFSC Code', val: ifscCode, setter: v => setIfscCode(v.toUpperCase()), ph: 'e.g. SBIN0001234' },
                                        ].map(({ label, val, setter, ph }) => (
                                            <div key={label}>
                                                <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">{label}</label>
                                                <input type="text" value={val} onChange={e => setter(e.target.value)}
                                                    placeholder={ph}
                                                    className="w-full border-2 border-slate-200 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none focus:border-green-400 transition placeholder:text-slate-300" />
                                                {label === 'Confirm Account Number' && confirmAccount && accountNumber !== confirmAccount && (
                                                    <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                                                        <AlertCircle className="w-3 h-3" /> Account numbers match nahi kar rahe
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* UPI field */}
                            <AnimatePresence>
                                {method === 'UPI' && (
                                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}>
                                        <label className="text-xs font-black text-gray-500 uppercase tracking-wider block mb-1">UPI ID</label>
                                        <input type="text" value={upiId} onChange={e => setUpiId(e.target.value)}
                                            placeholder="yourname@upi"
                                            className={`w-full border-2 rounded-2xl px-4 py-3 text-sm font-bold text-gray-800 outline-none transition placeholder:text-slate-300
                                                ${upiId && !isUpiValid ? 'border-red-300' : 'border-slate-200 focus:border-green-400'}`} />
                                        {upiId && !isUpiValid && (
                                            <p className="text-xs text-red-500 font-bold mt-1 flex items-center gap-1">
                                                <AlertCircle className="w-3 h-3" /> Valid UPI ID likho (e.g. name@okaxis)
                                            </p>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.button
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.14 }}
                            onClick={() => setShowConfirm(true)}
                            disabled={!canSubmit}
                            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-lg mb-5
                                ${canSubmit
                                    ? 'bg-green-600 text-white hover:bg-green-700 active:scale-95 shadow-green-200'
                                    : 'bg-slate-100 text-slate-300 cursor-not-allowed shadow-none'}`}>
                            <Receipt className="w-5 h-5" />
                            Submit Withdrawal Request
                            <ChevronRight className="w-4 h-4" />
                        </motion.button>

                        {/* Trust badges */}
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.16 }}
                            className="grid grid-cols-3 gap-3">
                            {[
                                { icon: Shield, label: 'Secure', sub: 'Encrypted' },
                                { icon: Clock, label: '24-48 hrs', sub: 'Processing time' },
                                { icon: CheckCircle, label: 'Verified', sub: 'Admin approval' },
                            ].map(({ icon: Icon, label, sub }) => (
                                <div key={label} className="bg-white rounded-2xl border border-slate-100 p-3 text-center">
                                    <Icon className="w-5 h-5 text-green-500 mx-auto mb-1" />
                                    <p className="text-xs font-black text-slate-700">{label}</p>
                                    <p className="text-[10px] text-slate-400">{sub}</p>
                                </div>
                            ))}
                        </motion.div>
                    </>
                )}
            </div>
        </>
    );
};

export default WithdrawalRequest;
