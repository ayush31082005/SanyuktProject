import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Smartphone,
    Tv,
    Wifi,
    CheckCircle2,
    ChevronRight,
    Zap,
    CircleUser,
    Wallet,
    Heart,
    Shield,
    Clock,
    Users,
    Gift,
    Receipt,
    Search,
    Copy,
    Share2,
    Info,
    ExternalLink,
    ShieldCheck,
    Lock,
    IndianRupee,
    MapPin,
} from "lucide-react";
import toast from "react-hot-toast";
import api from "../api";
import PaymentMethodModal from "../components/PaymentMethodModal";
import BrowsePlansModal from "../components/BrowsePlansModal";
import RazorpayPaymentButton from "../components/RazorpayPaymentButton";
import {
    datacardOperators,
    dthOperators,
    mobileOperators,
} from "../data/operators";

const Recharge = () => {
    const rechargeDebugEnabled = String(import.meta.env.VITE_RECHARGE_DEBUG || "")
        .toLowerCase()
        .trim() === "true";
    const rechargeDebugLog = (...args) => {
        if (rechargeDebugEnabled) {
            console.log("[RECHARGE_DEBUG]", ...args);
        }
    };

    const [activeTab, setActiveTab] = useState("mobile");
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [successAmount, setSuccessAmount] = useState("");

    const triggerSuccessAlert = (msg, amount) => {
        setSuccessMessage(msg);
        setSuccessAmount(amount);
        setShowSuccessAlert(true);
        setTimeout(() => setShowSuccessAlert(false), 4000);
    };

    // Form States
    const [mobileNumber, setMobileNumber] = useState("");
    const [mobileOperator, setMobileOperator] = useState("");
    const [mobileAmount, setMobileAmount] = useState("");

    const [dthNumber, setDthNumber] = useState("");
    const [dthOperator, setDthOperator] = useState("");
    const [dthAmount, setDthAmount] = useState("");

    const [planCircles, setPlanCircles] = useState([]);
    const [selectedCircle, setSelectedCircle] = useState("10");
    const [mobilePlans, setMobilePlans] = useState([]);
    const [plansLoading, setPlansLoading] = useState(false);
    const [mobilePlansPage, setMobilePlansPage] = useState(1);
    const MOBILE_PLANS_PER_PAGE = 8;
    const [isDetectingOperator, setIsDetectingOperator] = useState(false);
    const [detectedOperatorInfo, setDetectedOperatorInfo] = useState(null);
    const [hasTriedDetection, setHasTriedDetection] = useState(false);

    // Payment Modal States
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [pendingRecharge, setPendingRecharge] = useState(null);

    // Browse Plans Modal States
    const [showPlansModal, setShowPlansModal] = useState(false);

    // User Data State
    const [userData, setUserData] = useState(null);

    // Detect Razorpay Payment Button redirect back to this page
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const status = params.get("razorpay_payment_link_status");
        const paymentId = params.get("razorpay_payment_id");
        if (status === "paid" || paymentId) {
            triggerSuccessAlert("Payment Successful!", "");
            toast.success("Donation payment received! Thank you.");
            // Clean up URL params so they don't persist on refresh
            const cleanUrl = window.location.pathname;
            window.history.replaceState({}, document.title, cleanUrl);
        }
    }, []);

    // Fetch User Stats (Balance) and Profile
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                const [statsRes, userRes] = await Promise.all([
                    api.get("mlm/get-stats"),
                    api.get("auth/profile"),
                ]);
                setWalletBalance(statsRes.data?.walletBalance || 0);
                setUserData(userRes.data?.user || null);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };
        fetchAllData();
    }, []);

    const normalizePlans = (providerData) => {
        if (!providerData || typeof providerData !== "object") return [];

        const normalized = [];
        Object.entries(providerData).forEach(([bucket, plans]) => {
            if (!Array.isArray(plans)) return;
            plans.forEach((plan, index) => {
                const amount = Number(plan?.rs);
                if (!Number.isFinite(amount) || amount <= 0) return;
                normalized.push({
                    id: `${bucket}-${amount}-${index}`,
                    amount,
                    validity: plan?.validity || "NA",
                    data: "N/A",
                    description: plan?.desc || "Plan details unavailable",
                    category: plan?.Type || bucket,
                });
            });
        });

        return normalized.sort((a, b) => a.amount - b.amount);
    };

    useEffect(() => {
        const fetchPlanCircles = async () => {
            try {
                const { data } = await api.get("/recharge/plan-circles");
                if (data?.success && Array.isArray(data.circles)) {
                    setPlanCircles(data.circles);
                    if (
                        data.circles.length > 0 &&
                        !data.circles.find((c) => c.code === selectedCircle)
                    ) {
                        setSelectedCircle(data.circles[0].code);
                    }
                }
            } catch (error) {
                console.error("Circle fetch failed:", error);
            }
        };

        fetchPlanCircles();
    }, []);

    useEffect(() => {
        const shouldFetch =
            mobileOperator && /^\d{10}$/.test(mobileNumber) && selectedCircle;
        if (!shouldFetch) {
            setMobilePlans([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setPlansLoading(true);
                const { data } = await api.get("/recharge/plans", {
                    params: {
                        mobile: mobileNumber,
                        operator: mobileOperator,
                        circle: selectedCircle,
                    },
                });

                if (data?.success && data?.data) {
                    setMobilePlans(normalizePlans(data.data));
                } else {
                    setMobilePlans([]);
                }
            } catch (error) {
                console.error("Live plan fetch failed:", error);
                setMobilePlans([]);
            } finally {
                setPlansLoading(false);
            }
        }, 450);

        return () => clearTimeout(timeoutId);
    }, [mobileOperator, mobileNumber, selectedCircle]);

    useEffect(() => {
        setMobilePlansPage(1);
    }, [mobileOperator, mobileNumber, selectedCircle, plansLoading]);

    const mobileTotalPages = Math.max(
        1,
        Math.ceil(mobilePlans.length / MOBILE_PLANS_PER_PAGE)
    );
    const validMobilePlanAmounts = new Set(
        mobilePlans.map((plan) => Number(plan.amount)).filter((amt) => amt > 0)
    );
    const isMobileAmountFromFetchedPlans =
        Number(mobileAmount) > 0 && validMobilePlanAmounts.has(Number(mobileAmount));
    const safeMobilePlansPage = Math.min(mobilePlansPage, mobileTotalPages);
    const paginatedMobilePlans = mobilePlans.slice(
        (safeMobilePlansPage - 1) * MOBILE_PLANS_PER_PAGE,
        safeMobilePlansPage * MOBILE_PLANS_PER_PAGE
    );

    const mapProviderCompanyToOperatorId = (company) => {
        const normalized = String(company || "").toLowerCase();
        if (normalized.includes("airtel")) return "airtel";
        if (normalized.includes("jio")) return "jio";
        if (
            normalized.includes("vi") ||
            normalized.includes("voda") ||
            normalized.includes("vodafone")
        ) {
            return "vi";
        }
        if (normalized.includes("bsnl")) return "bsnl";
        return "";
    };

    useEffect(() => {
        if (!/^\d{10}$/.test(mobileNumber)) {
            setDetectedOperatorInfo(null);
            setHasTriedDetection(false);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setIsDetectingOperator(true);
                setHasTriedDetection(true);
                const { data } = await api.get("/recharge/operator-fetch", {
                    params: { mobile: mobileNumber },
                });

                if (data?.success) {
                    const detectedOperatorId = mapProviderCompanyToOperatorId(data.company);
                    if (detectedOperatorId) {
                        setMobileOperator(detectedOperatorId);
                    }

                    if (data.circle_code) {
                        setSelectedCircle(String(data.circle_code).padStart(2, "0"));
                    }

                    setDetectedOperatorInfo({
                        company: data.company,
                        circle: data.circle,
                        circleCode: data.circle_code,
                    });
                } else {
                    setDetectedOperatorInfo(null);
                }
            } catch (error) {
                console.error("Operator detect failed:", error);
                setDetectedOperatorInfo(null);
            } finally {
                setIsDetectingOperator(false);
            }
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [mobileNumber]);

    const handleRecharge = async (e, type) => {
        e.preventDefault();

        let operator, rechargeNumber, amount;
        if (type === "mobile") {
            operator = mobileOperator;
            rechargeNumber = mobileNumber;
            amount = mobileAmount;
        } else if (type === "dth") {
            operator = dthOperator;
            rechargeNumber = dthNumber;
            amount = dthAmount;
        }

        if (!operator || !rechargeNumber || !amount) {
            toast.error("Please fill in all details");
            return;
        }

        if (type === "mobile") {
            if (mobilePlans.length === 0) {
                toast.error("No plans fetched. Please fetch and select a valid plan.");
                return;
            }
            if (!isMobileAmountFromFetchedPlans) {
                toast.error("Please select amount only from available plans.");
                return;
            }
        }

        // Set pending recharge and show payment modal
        setPendingRecharge({
            operator,
            rechargeNumber,
            amount,
            type,
        });
        setShowPaymentModal(true);
    };

    const handleSelectPayment = async (method) => {
        if (!pendingRecharge) return;
        const { operator, rechargeNumber, amount, type } = pendingRecharge;
        if (type === "mobile") {
            if (mobilePlans.length === 0 || !validMobilePlanAmounts.has(Number(amount))) {
                toast.error("Selected amount is not in fetched plan list.");
                return;
            }
        }
        rechargeDebugLog("handleSelectPayment start", {
            method,
            operator,
            rechargeNumber,
            amount,
            type,
        });

        setIsProcessingPayment(true);
        const toastId = toast.loading(
            method === "wallet"
                ? "Processing wallet recharge..."
                : "Initiating payment..."
        );

        try {
            if (method === "wallet") {
                rechargeDebugLog("wallet request payload", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                const { data } = await api.post("/recharge/wallet", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                rechargeDebugLog("wallet response", data);

                if (data.success) {
                    triggerSuccessAlert("Recharge Successful!", amount);
                    toast.success("Recharge successful using wallet!", { id: toastId });
                    // Clear forms
                    if (type === "mobile") {
                        setMobileNumber("");
                        setMobileAmount("");
                    }
                    if (type === "dth") {
                        setDthNumber("");
                        setDthAmount("");
                    }

                    setShowPaymentModal(false);
                    setPendingRecharge(null);
                } else {
                    toast.error(data.message || "Wallet recharge failed", {
                        id: toastId,
                    });
                }
            } else {
                // Online/Razorpay Payment
                rechargeDebugLog("create-order request payload", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                const { data: orderData } = await api.post("/recharge/create-order", {
                    amount: Number(amount),
                    type,
                    operator,
                    rechargeNumber,
                });
                rechargeDebugLog("create-order response", orderData);

                if (!orderData.success) {
                    toast.error("Failed to initiate order", { id: toastId });
                    setIsProcessingPayment(false);
                    return;
                }

                toast.dismiss(toastId);

                const options = {
                    key:
                        import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SQbbsEM3Dlfgi2",
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Sanyukt Parivaar",
                    description: "Recharge Payment",
                    order_id: orderData.order.id,
                    handler: async function (response) {
                        let verifyToastId;
                        try {
                            rechargeDebugLog("razorpay handler response", response);
                            verifyToastId = toast.loading("Verifying payment...");
                            const verifyPayload = {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                transactionId: orderData.transactionId,
                            };
                            rechargeDebugLog("verify-payment request payload", {
                                ...verifyPayload,
                                razorpay_signature: String(
                                    verifyPayload.razorpay_signature || ""
                                ).slice(0, 10) + "...",
                            });
                            const { data: verifyData } = await api.post(
                                "/recharge/verify-payment",
                                verifyPayload
                            );
                            rechargeDebugLog("verify-payment response", verifyData);

                            if (verifyData.success) {
                                triggerSuccessAlert("Payment Successful!", amount);
                                toast.success("Recharge successful!", { id: verifyToastId });
                                if (type === "mobile") {
                                    setMobileNumber("");
                                    setMobileAmount("");
                                }
                                if (type === "dth") {
                                    setDthNumber("");
                                    setDthAmount("");
                                }

                                setShowPaymentModal(false);
                                setPendingRecharge(null);
                            } else {
                                toast.error("Payment verification failed", { id: verifyToastId });
                            }
                        } catch (err) {
                            console.error(err);
                            rechargeDebugLog("verify-payment error", {
                                status: err?.response?.status,
                                data: err?.response?.data,
                                message: err?.message,
                            });
                            const errorMessage =
                                err.response?.data?.message ||
                                err.message ||
                                "Error verifying payment";
                            if (verifyToastId) {
                                toast.error(errorMessage, { id: verifyToastId });
                            } else {
                                toast.error(errorMessage);
                            }
                        }
                    },
                    prefill: {
                        name: "Sanyukt Member",
                        email: "richlifesanyuktprivaar@gamil.com",
                        contact: (rechargeNumber || "")
                            .toString()
                            .replace(/\D/g, "")
                            .slice(-10),
                    },
                    theme: {
                        color: "#C8A96A",
                    },
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on("payment.failed", function (response) {
                    rechargeDebugLog("razorpay payment.failed", response);
                    toast.error(`Payment Failed: ${response.error.description}`);
                });
                rzp1.open();
            }
        } catch (error) {
            console.error("Recharge Error:", error);
            rechargeDebugLog("handleSelectPayment catch", {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error?.message,
            });
            toast.error(
                error?.response?.data?.message ||
                "Something went wrong. Please try again.",
                { id: toastId }
            );
        } finally {
            setIsProcessingPayment(false);
        }
    };

    const tabs = [
        { id: "mobile", label: "Mobile Recharge", icon: Smartphone },
        { id: "dth", label: "DTH Recharge", icon: Tv },
    ];

    return (
        <div className='min-h-screen bg-[#0D0D0D] flex flex-col font-sans text-[#F5E6C8]'>
            {/* ── SUCCESS ALERT BANNER (Responsive) ── */}
            <AnimatePresence>
                {showSuccessAlert && (
                    <motion.div
                        initial={{ opacity: 0, y: -100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -100 }}
                        transition={{ type: "spring", stiffness: 300, damping: 28 }}
                        className='fixed top-[70px] md:top-[90px] left-1/2 transform -translate-x-1/2 z-[9999] w-[calc(100%-2rem)] max-w-[500px]'
                    >
                        <div className='bg-gradient-to-br from-[#1a1a1a] to-[#0D0D0D] border-2 border-[#C8A96A] rounded-2xl p-4 md:p-5 shadow-2xl flex items-center gap-3 md:gap-4'>
                            <div className='w-10 h-10 md:w-[46px] md:h-[46px] flex-shrink-0 bg-[rgba(200,169,106,0.12)] border-2 border-[#C8A96A] rounded-full flex items-center justify-center'>
                                <CheckCircle2 size={20} className='md:w-6 md:h-6' color='#C8A96A' />
                            </div>
                            <div className='flex-1 min-w-0'>
                                <p className='font-extrabold text-xs md:text-sm text-[#C8A96A] uppercase tracking-wider'>
                                    {successMessage}
                                </p>
                                <p className='text-[11px] md:text-xs text-[rgba(245,230,200,0.65)] font-medium mt-0.5'>
                                    ₹{successAmount} recharged successfully. 🎉
                                </p>
                            </div>
                            <button
                                onClick={() => setShowSuccessAlert(false)}
                                className='text-[rgba(200,169,106,0.5)] hover:text-[#C8A96A] text-xl leading-none p-1'
                            >
                                ✕
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 1. PAGE BANNER - Responsive */}
            <section className='relative min-h-[160px] md:min-h-[240px] flex items-center justify-center overflow-hidden bg-[#0D0D0D] pt-[76px] pb-8 md:pt-[96px] md:pb-12'>
                <div
                    className='absolute inset-0 bg-cover bg-center opacity-100'
                    style={{
                        backgroundImage:
                            "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')",
                    }}
                ></div>
                <div className='absolute inset-0 bg-[#0D0D0D]/40 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/60 to-transparent'></div>
                <div className='relative z-10 text-center px-4 w-full max-w-6xl mx-auto'>
                    <h1 className='text-3xl md:text-6xl font-serif font-bold mb-2 md:mb-4 tracking-tight drop-shadow-2xl text-[#C8A96A]'>
                        Premium Services
                    </h1>
                    <div className='flex items-center justify-center gap-2 text-xs md:text-sm font-medium text-[#F5E6C8]/60 mb-3 md:mb-6 tracking-widest uppercase'>
                        <span className='hover:text-[#C8A96A] cursor-pointer transition-colors'>Home</span>
                        <ChevronRight className='w-3 h-3 md:w-4 md:h-4 text-[#C8A96A]' />
                        <span className='text-[#C8A96A] font-bold'>Recharge</span>
                    </div>
                    <p className='text-sm md:text-xl font-light text-[#F5E6C8]/80 max-w-2xl mx-auto drop-shadow-md leading-relaxed px-2'>
                        Fast, secure, and exclusive services for the{" "}
                        <span className='font-serif italic text-[#C8A96A]'>Sanyukt</span> community.
                    </p>
                </div>
            </section>

            <main className='flex-grow container mx-auto px-3 md:px-4 py-4 md:py-8 max-w-7xl'>
                {/* 2. INTRODUCTION SECTION - Responsive */}
                <section className='text-center max-w-4xl mx-auto mb-6 md:mb-8'>
                    <h2 className='text-xl md:text-3xl font-serif font-bold text-[#C8A96A] mb-2 tracking-tight'>
                        Excellence in Every Transaction
                    </h2>
                    <p className='text-xs md:text-base text-[#F5E6C8]/70 leading-relaxed font-light px-2'>
                        Experience the pinnacle of convenience with our curated digital services.
                        From seamless recharges to impactful contributions.
                    </p>
                </section>

                {/* 3. DONATION SECTION - Fully Responsive */}
                <section className='mb-8 relative'>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className='bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#121212] border border-[#C8A96A]/20 rounded-2xl shadow-2xl overflow-hidden'
                    >
                        <div className='p-4 md:p-6 lg:p-8'>
                            <div className='max-w-5xl mx-auto'>
                                {/* Header */}
                                <div className='text-center mb-6 md:mb-8'>
                                    <div className='inline-flex items-center gap-2 py-1 px-3 bg-[#C8A96A]/10 backdrop-blur-md border border-[#C8A96A]/20 rounded-full mb-3'>
                                        <Heart className='w-3 h-3 md:w-4 md:h-4 text-[#C8A96A]' />
                                        <span className='text-[#C8A96A] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.3em]'>
                                            The Spirit of Giving
                                        </span>
                                    </div>
                                    <h2 className='text-2xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-2'>
                                        Empower <span className='text-[#C8A96A]'>Generations</span>
                                    </h2>
                                    <p className='text-xs md:text-sm text-[#F5E6C8]/60 max-w-2xl mx-auto font-light'>
                                        Your generosity fuels our mission of collective growth.
                                    </p>
                                </div>

                                {/* Features Grid - Responsive */}
                                <div className='grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-6 md:mb-8'>
                                    {[
                                        { title: "Secure Vault", icon: Shield, subtitle: "ENCRYPTED" },
                                        { title: "Tax Benefits", icon: Receipt, subtitle: "CERTIFIED" },
                                        { title: "Community", icon: Users, subtitle: "GLOBAL" },
                                        { title: "Instant Impact", icon: Zap, subtitle: "VERIFIED" },
                                    ].map((feature, i) => (
                                        <div key={i} className='bg-[#1A1A1A]/50 backdrop-blur-xl p-3 border border-[#C8A96A]/10 rounded-xl'>
                                            <div className='w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-lg flex items-center justify-center mb-2'>
                                                <feature.icon className='w-4 h-4 md:w-5 md:h-5 text-[#0D0D0D]' />
                                            </div>
                                            <h4 className='text-[#F5E6C8] font-bold text-xs md:text-sm'>{feature.title}</h4>
                                            <p className='text-[#C8A96A]/40 text-[8px] md:text-[9px] mt-1 font-black tracking-widest uppercase'>
                                                {feature.subtitle}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Responsive Grid for Donation Content */}
                                <div className='grid lg:grid-cols-5 gap-4 md:gap-6'>
                                    <div className='lg:col-span-3 space-y-4'>
                                        <div className='bg-[#1A1A1A]/80 backdrop-blur-3xl rounded-2xl p-4 border border-[#C8A96A]/10'>
                                            <div className='mb-3'>
                                                <span className='inline-block px-3 py-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[8px] md:text-[9px] font-black uppercase tracking-widest rounded-md mb-2'>
                                                    Exclusive
                                                </span>
                                                <h3 className='text-lg md:text-xl font-serif font-bold text-[#F5E6C8]'>Direct Contributions</h3>
                                            </div>
                                            <div className='bg-[#0D0D0D] rounded-xl p-3 border border-[#C8A96A]/20 mb-3'>
                                                <p className='text-[#C8A96A] text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] mb-2'>DIGITAL UPI ADDRESS</p>
                                                <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3'>
                                                    <span className='text-xs md:text-sm font-mono font-bold text-[#F5E6C8]/90 break-all'>
                                                        20260325575843-iservuqrsbrp@cbin
                                                    </span>
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText("20260325575843-iservuqrsbrp@cbin");
                                                            toast.success("UPI Copied!");
                                                        }}
                                                        className='px-4 py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-bold text-[10px] uppercase tracking-widest rounded-lg'
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        {userData && (
                                            <div className='bg-[#C8A96A]/5 backdrop-blur-3xl rounded-2xl p-4 border border-[#C8A96A]/10'>
                                                <h4 className='text-[#F5E6C8] font-bold text-xs uppercase tracking-widest mb-3'>Personal Referral Hub</h4>
                                                <div className='bg-[#0D0D0D]/50 rounded-xl p-3 border border-[#C8A96A]/10 flex flex-col sm:flex-row items-start sm:items-center gap-3'>
                                                    <p className='flex-1 text-[#F5E6C8] font-mono text-[10px] md:text-[11px] truncate w-full'>
                                                        {window.location.origin + "/donate?for=" + (userData.memberId || userData._id)}
                                                    </p>
                                                    <div className='flex gap-2'>
                                                        <button onClick={() => {
                                                            navigator.clipboard.writeText(window.location.origin + "/donate?for=" + (userData.memberId || userData._id));
                                                            toast.success("Link Copied!");
                                                        }} className='p-2 bg-[#1A1A1A] rounded-lg text-[#C8A96A] border border-[#C8A96A]/10'>
                                                            <Copy className='w-4 h-4' />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className='lg:col-span-2 space-y-4'>
                                        <div className='bg-[#1A1A1A] p-4 rounded-2xl border border-[#C8A96A]/20 text-center'>
                                            <div className='bg-[#0D0D0D] p-3 rounded-xl border border-[#C8A96A]/40 inline-block mx-auto mb-3'>
                                                <img src='/qr.jpeg' alt='QR' className='w-24 h-24 md:w-32 md:h-32 object-contain' onError={(e) => e.target.src = "https://via.placeholder.com/150?text=SCAN"} />
                                            </div>
                                            <div className='flex justify-center scale-90 md:scale-100'>
                                                <RazorpayPaymentButton buttonId='pl_SROihejcCAh8Vm' />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* 4. RECHARGE SERVICES SECTION - Fully Responsive */}
                <section className='mb-8'>
                    <div className='bg-[#1A1A1A] rounded-2xl border border-[#C8A96A]/20 overflow-hidden'>
                        {/* Responsive Tabs */}
                        <div className='grid grid-cols-2 gap-1 bg-[#0D0D0D]/50 border-b border-[#C8A96A]/10 p-2'>
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.id;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`py-3 md:py-5 px-2 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-3 transition-all rounded-lg ${isActive
                                            ? "bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] shadow-lg"
                                            : "text-[#F5E6C8]/40 hover:text-[#C8A96A]"
                                            }`}
                                    >
                                        <Icon className={`w-4 h-4 md:w-5 md:h-5 ${isActive ? "text-[#0D0D0D]" : ""}`} />
                                        <span className={`font-black text-[9px] md:text-[11px] uppercase tracking-wider ${isActive ? "text-[#0D0D0D]" : ""}`}>
                                            {tab.label}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Tab Content - Responsive Layout */}
                        <div className='p-3 md:p-6'>
                            <AnimatePresence mode='wait'>
                                {activeTab === "mobile" && (
                                    <motion.div key='mobile' initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
                                        {/* Left Form Section */}
                                        <div className='flex-1 space-y-4'>
                                            <div className='bg-[#1A1A1A] p-4 md:p-6 rounded-xl border border-[#C8A96A]/20'>
                                                <h3 className='text-xl md:text-2xl font-serif font-bold text-[#C8A96A] mb-4'>Mobile Recharge</h3>
                                                <form onSubmit={(e) => handleRecharge(e, "mobile")} className='space-y-4'>
                                                    <div>
                                                        <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                            <Smartphone className='w-4 h-4' /> Mobile Number
                                                        </label>
                                                        <input
                                                            type='tel'
                                                            value={mobileNumber}
                                                            onChange={(e) => setMobileNumber(e.target.value)}
                                                            placeholder='Enter 10-digit number'
                                                            className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/30 focus:border-[#C8A96A] rounded-lg text-[#F5E6C8] outline-none text-base'
                                                            maxLength='10'
                                                            required
                                                        />
                                                        {isDetectingOperator && <p className='text-[10px] text-[#C8A96A]/70 mt-1'>Detecting operator and circle...</p>}
                                                        {!isDetectingOperator && detectedOperatorInfo && (
                                                            <p className='text-[10px] text-green-500 mt-1'>Auto-detected: {detectedOperatorInfo.company} | {detectedOperatorInfo.circle} ({detectedOperatorInfo.circleCode})</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                            <CircleUser className='w-4 h-4' /> Network
                                                        </label>
                                                        <div className='grid grid-cols-4 gap-2'>
                                                            {mobileOperators.map((op) => (
                                                                <button
                                                                    key={op.id}
                                                                    type='button'
                                                                    onClick={() => setMobileOperator(op.id)}
                                                                    className={`p-2 rounded-lg border-2 transition-all ${mobileOperator === op.id ? 'border-[#C8A96A] bg-[#C8A96A]/20' : 'border-[#C8A96A]/20 bg-[#0D0D0D]'}`}
                                                                >
                                                                    <img src={op.logo} alt={op.name} className='h-6 w-auto mx-auto' />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Circle Selection */}
                                                    <div>
                                                        <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                            <MapPin className='w-4 h-4' /> Circle
                                                        </label>
                                                        <select
                                                            value={selectedCircle}
                                                            onChange={(e) => setSelectedCircle(e.target.value)}
                                                            className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-lg text-[#F5E6C8] outline-none text-sm'
                                                        >
                                                            {planCircles.length === 0 && <option value='10'>DELHI (10)</option>}
                                                            {planCircles.map((circle) => (
                                                                <option key={circle.code} value={circle.code}>
                                                                    {circle.name.replace(/_/g, " ")} ({circle.code})
                                                                </option>
                                                            ))}
                                                        </select>
                                                        {hasTriedDetection && !isDetectingOperator && !detectedOperatorInfo ? (
                                                            <p className='mt-1 text-[10px] text-[#F5E6C8]/40'>Auto-detection failed. Select circle manually.</p>
                                                        ) : (
                                                            <p className='mt-1 text-[10px] text-[#F5E6C8]/30'>Circle code will be sent with plan/recharge fetch.</p>
                                                        )}
                                                    </div>

                                                    <div>
                                                        <div className='flex justify-between items-center mb-2'>
                                                            <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider'>Amount (₹)</label>
                                                            {mobileOperator && (
                                                                <button type='button' onClick={() => setShowPlansModal(true)} className='text-[10px] text-[#C8A96A] flex items-center gap-1'>
                                                                    <Search className='w-3 h-3' /> Browse Plans
                                                                </button>
                                                            )}
                                                        </div>
                                                        <input
                                                            type='text'
                                                            value={mobileAmount}
                                                            readOnly
                                                            placeholder='Select from plans'
                                                            className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-lg text-[#F5E6C8] font-bold'
                                                        />
                                                    </div>

                                                    <button type='submit' disabled={isProcessingPayment} className='w-full py-3 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-sm uppercase tracking-wider rounded-lg disabled:opacity-50'>
                                                        {isProcessingPayment ? "Processing..." : "Recharge Now"}
                                                    </button>
                                                </form>
                                            </div>
                                        </div>

                                        {/* Right Plans Panel */}
                                        <div className='lg:w-96 flex-shrink-0'>
                                            <div className='bg-[#1A1A1A] rounded-xl border border-[#C8A96A]/20 h-[450px] flex flex-col'>
                                                <div className='p-3 border-b border-[#C8A96A]/10'>
                                                    <h4 className='text-xs font-black text-[#C8A96A] uppercase tracking-wider'>
                                                        {mobileOperator ? `${mobileOperator.toUpperCase()} Plans` : "Select Operator"}
                                                    </h4>
                                                </div>
                                                <div className='flex-1 overflow-y-auto p-2 space-y-2'>
                                                    {!mobileOperator ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Choose a network above</p>
                                                    ) : !/^\d{10}$/.test(mobileNumber) ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Enter mobile number first</p>
                                                    ) : plansLoading ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>Loading plans...</p>
                                                    ) : mobilePlans.length === 0 ? (
                                                        <p className='text-center text-[#F5E6C8]/40 text-xs py-8'>No plans available for selected circle</p>
                                                    ) : (
                                                        paginatedMobilePlans.map((plan) => (
                                                            <button
                                                                key={plan.id}
                                                                onClick={() => setMobileAmount(plan.amount)}
                                                                className={`w-full p-3 rounded-lg border text-left transition-all ${Number(mobileAmount) === plan.amount ? 'border-[#C8A96A] bg-[#C8A96A]/10' : 'border-[#C8A96A]/10 bg-[#0D0D0D]'}`}
                                                            >
                                                                <div className='flex justify-between items-center'>
                                                                    <span className='text-lg font-bold text-[#C8A96A]'>₹{plan.amount}</span>
                                                                    <span className='text-[10px] text-[#F5E6C8]/40'>{plan.validity}</span>
                                                                </div>
                                                                <p className='text-xs text-[#F5E6C8]/70 mt-1 truncate'>{plan.description}</p>
                                                                {plan.category && (
                                                                    <span className='inline-block mt-1 text-[8px] font-bold text-[#C8A96A] bg-[#C8A96A]/10 px-2 py-0.5 rounded'>
                                                                        {plan.category}
                                                                    </span>
                                                                )}
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                                {mobilePlans.length > MOBILE_PLANS_PER_PAGE && (
                                                    <div className='flex justify-between p-2 border-t border-[#C8A96A]/10'>
                                                        <button onClick={() => setMobilePlansPage(p => Math.max(1, p - 1))} disabled={safeMobilePlansPage === 1} className='px-3 py-1 text-xs text-[#C8A96A] disabled:opacity-30'>Prev</button>
                                                        <span className='text-xs'>{safeMobilePlansPage}/{mobileTotalPages}</span>
                                                        <button onClick={() => setMobilePlansPage(p => Math.min(mobileTotalPages, p + 1))} disabled={safeMobilePlansPage === mobileTotalPages} className='px-3 py-1 text-xs text-[#C8A96A] disabled:opacity-30'>Next</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTab === "dth" && (
                                    <motion.div key='dth' initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='max-w-2xl mx-auto'>
                                        <div className='bg-[#1A1A1A] p-6 rounded-xl border border-[#C8A96A]/20'>
                                            <h3 className='text-2xl font-serif font-bold text-[#C8A96A] mb-4'>DTH Recharge</h3>
                                            <form onSubmit={(e) => handleRecharge(e, "dth")} className='space-y-4'>
                                                <div>
                                                    <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                        <Tv className='w-4 h-4' /> Customer ID / Smart Card
                                                    </label>
                                                    <input
                                                        type='text'
                                                        value={dthNumber}
                                                        onChange={(e) => setDthNumber(e.target.value)}
                                                        placeholder='Enter your registered ID'
                                                        className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-lg text-[#F5E6C8] outline-none'
                                                        required
                                                    />
                                                </div>
                                                <div>
                                                    <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                        <CircleUser className='w-4 h-4' /> Select Provider
                                                    </label>
                                                    <div className='grid grid-cols-2 sm:grid-cols-4 gap-2'>
                                                        {dthOperators.map((op) => (
                                                            <button
                                                                key={op.id}
                                                                type='button'
                                                                onClick={() => setDthOperator(op.id)}
                                                                className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center ${dthOperator === op.id ? 'border-[#C8A96A] bg-[#C8A96A]/20' : 'border-[#C8A96A]/20 bg-[#0D0D0D]'}`}
                                                            >
                                                                <span className='font-bold text-sm'>{op.logo}</span>
                                                                <span className='text-[9px] mt-1 text-[#F5E6C8]/60'>{op.name}</span>
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className='text-xs font-black text-[#C8A96A] uppercase tracking-wider flex items-center gap-2 mb-2'>
                                                        <Wallet className='w-4 h-4' /> Recharge Amount (₹)
                                                    </label>
                                                    <input
                                                        type='number'
                                                        value={dthAmount}
                                                        onChange={(e) => setDthAmount(e.target.value)}
                                                        placeholder='Enter amount'
                                                        className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 rounded-lg text-[#F5E6C8] outline-none'
                                                        required
                                                    />
                                                </div>
                                                <button type='submit' disabled={isProcessingPayment} className='w-full py-3 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black rounded-lg text-sm uppercase tracking-wider'>
                                                    {isProcessingPayment ? "Processing..." : "Recharge Now"}
                                                </button>
                                            </form>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </section>
            </main>

            {/* Modals */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handleSelectPayment}
                amount={pendingRecharge?.amount}
                walletBalance={walletBalance}
                isProcessing={isProcessingPayment}
            />
            <BrowsePlansModal
                isOpen={showPlansModal}
                onClose={() => setShowPlansModal(false)}
                onSelect={(amount) => setMobileAmount(amount)}
                operator={mobileOperator ? mobileOperators.find((op) => op.id === mobileOperator)?.name : ""}
                plans={mobilePlans}
            />
        </div>
    );
};

export default Recharge;
