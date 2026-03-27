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

  const [dataCardNumber, setDataCardNumber] = useState("");
  const [dataCardOperator, setDataCardOperator] = useState("");
  const [dataCardAmount, setDataCardAmount] = useState("");
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

  // Operators

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
    } else if (type === "datacard") {
      operator = dataCardOperator;
      rechargeNumber = dataCardNumber;
      amount = dataCardAmount;
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
          if (type === "datacard") {
            setDataCardNumber("");
            setDataCardAmount("");
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
            try {
              rechargeDebugLog("razorpay handler response", response);
              const verifyToast = toast.loading("Verifying payment...");
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
                toast.success("Recharge successful!", { id: verifyToast });
                if (type === "mobile") {
                  setMobileNumber("");
                  setMobileAmount("");
                }
                if (type === "dth") {
                  setDthNumber("");
                  setDthAmount("");
                }
                if (type === "datacard") {
                  setDataCardNumber("");
                  setDataCardAmount("");
                }

                setShowPaymentModal(false);
                setPendingRecharge(null);
              } else {
                toast.error("Payment verification failed", { id: verifyToast });
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
              toast.error(errorMessage, { id: verifyToast });
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
    { id: "datacard", label: "Data Card Recharge", icon: Wifi },
  ];

  return (
    <div className='min-h-screen bg-[#0D0D0D] flex flex-col font-sans text-[#F5E6C8]'>
      {/* ── SUCCESS ALERT BANNER ── */}
      <AnimatePresence>
        {showSuccessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            style={{
              position: "fixed",
              top: "90px",
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #1a1a1a 0%, #0D0D0D 100%)",
                border: "1.5px solid #C8A96A",
                borderRadius: "16px",
                padding: "18px 24px",
                boxShadow:
                  "0 20px 60px rgba(0,0,0,0.8), 0 0 0 1px rgba(200,169,106,0.1)",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div
                style={{
                  width: "46px",
                  height: "46px",
                  flexShrink: 0,
                  background: "rgba(200,169,106,0.12)",
                  border: "1.5px solid #C8A96A",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CheckCircle2 size={24} color='#C8A96A' />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 800,
                    fontSize: "14px",
                    color: "#C8A96A",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                  }}
                >
                  {successMessage}
                </p>
                <p
                  style={{
                    margin: "4px 0 0",
                    fontFamily: '"Inter", sans-serif',
                    fontSize: "12px",
                    color: "rgba(245,230,200,0.65)",
                    fontWeight: 500,
                  }}
                >
                  ₹{successAmount} recharged successfully. Your account will be
                  updated shortly. 🎉
                </p>
              </div>
              <button
                onClick={() => setShowSuccessAlert(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(200,169,106,0.5)",
                  cursor: "pointer",
                  fontSize: "18px",
                  lineHeight: 1,
                  padding: "4px",
                }}
              >
                ✕
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* 1. PAGE BANNER / HEADER SECTION */}
      <section className='relative min-h-[180px] md:min-h-[240px] flex items-center justify-center overflow-hidden bg-[#0D0D0D] py-12'>
        <div
          className='absolute inset-0 bg-cover bg-center opacity-100'
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070')",
          }}
        ></div>

        <div className='absolute inset-0 bg-[#0D0D0D]/40 bg-gradient-to-r from-[#0D0D0D]/90 via-[#0D0D0D]/60 to-transparent'></div>

        <div className='relative z-10 text-center px-4 w-full flex flex-col md:flex-row items-center justify-center max-w-6xl mx-auto gap-8'>
          <div className='flex-1 text-center md:text-left animate-fade-in'>
            <h1 className='text-4xl md:text-6xl font-serif font-bold mb-4 tracking-tight drop-shadow-2xl text-[#C8A96A]'>
              Premium Services
            </h1>

            <div className='flex items-center justify-center md:justify-start gap-2 text-sm md:text-base font-medium text-[#F5E6C8]/60 mb-6 tracking-widest uppercase'>
              <span className='hover:text-[#C8A96A] cursor-pointer transition-colors'>
                Home
              </span>
              <ChevronRight className='w-4 h-4 text-[#C8A96A]' />
              <span className='text-[#C8A96A] font-bold'>
                Recharge & Support
              </span>
            </div>

            <p className='text-lg md:text-xl font-light text-[#F5E6C8]/80 max-w-2xl drop-shadow-md leading-relaxed'>
              Fast, secure, and exclusive services for the{" "}
              <span className='font-serif italic text-[#C8A96A]'>Sanyukt</span>{" "}
              community.
            </p>
          </div>
        </div>
      </section>

      <main className='flex-grow container mx-auto px-4 py-2 max-w-7xl'>
        {/* 2. INTRODUCTION SECTION */}
        <section className='text-center max-w-4xl mx-auto mb-4'>
          <h2 className='text-2xl md:text-3xl font-serif font-bold text-[#C8A96A] mb-2 tracking-tight'>
            Excellence in Every Transaction
          </h2>
          <div className='space-y-2 text-[#F5E6C8]/70 text-sm md:text-base leading-relaxed font-light'>
            <p>
              Experience the pinnacle of convenience with our curated digital
              services. From seamless recharges to impactful contributions, we
              empower your lifestyle while fostering community growth.
            </p>
          </div>
        </section>

        {/* 3. DONATION SECTION - PREMIUM REDESIGN */}
        <section className='mb-8 relative text-balance'>
          {/* Decorative Background Elements */}
          <div className='absolute -top-12 -right-12 w-96 h-96 bg-[#C8A96A]/5 rounded-full blur-[120px] pointer-events-none'></div>
          <div className='absolute -bottom-12 -left-12 w-96 h-96 bg-[#3B2F2F]/10 rounded-full blur-[120px] pointer-events-none'></div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className='luxury-box relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-[#C8A96A]/20'
          >
            {/* Complex Gradient Background */}
            <div className='absolute inset-0 bg-gradient-to-br from-[#1A1A1A] via-[#0D0D0D] to-[#121212]'></div>

            {/* Pattern Overlay */}
            <div
              className='absolute inset-0 opacity-[0.03] pointer-events-none'
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23C8A96A' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            ></div>

            <div className='relative z-10 p-3 lg:p-6'>
              <div className='max-w-5xl mx-auto'>
                {/* Header */}
                <div className='text-center mb-4'>
                  <motion.div
                    initial={{ scale: 0.9 }}
                    whileInView={{ scale: 1 }}
                    className='inline-flex items-center gap-2 py-1 px-4 bg-[#C8A96A]/10 backdrop-blur-md border border-[#C8A96A]/20 mb-3'
                  >
                    <Heart className='w-4 h-4 text-[#C8A96A]' />
                    <span className='text-[#C8A96A] font-bold text-[10px] uppercase tracking-[0.4em]'>
                      The Spirit of Giving
                    </span>
                  </motion.div>
                  <h2 className='text-2xl md:text-3xl font-serif font-bold text-[#F5E6C8] mb-2 tracking-tight leading-tight'>
                    Empower <span className='text-[#C8A96A]'>Generations</span>
                  </h2>
                  <p className='text-[#F5E6C8]/60 text-xs md:text-sm leading-relaxed max-w-2xl mx-auto font-light mb-2'>
                    Your generosity fuels our mission of collective growth.
                    Together, we build a legacy of empowerment within the{" "}
                    <span className='text-[#C8A96A] font-bold'>
                      Sanyukt Parivaar
                    </span>{" "}
                    ecosystem.
                  </p>
                </div>

                {/* Features / Trust Badges */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4'>
                  {[
                    {
                      title: "Secure Vault",
                      icon: Shield,
                      subtitle: "ENCRYPTED",
                    },
                    {
                      title: "Tax Benefits",
                      icon: Receipt,
                      subtitle: "CERTIFIED",
                    },
                    { title: "Community", icon: Users, subtitle: "GLOBAL" },
                    {
                      title: "Instant Impact",
                      icon: Zap,
                      subtitle: "VERIFIED",
                    },
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      whileHover={{
                        y: -5,
                        backgroundColor: "rgba(200, 169, 106, 0.05)",
                      }}
                      className='bg-[#1A1A1A]/50 backdrop-blur-xl p-3 border border-[#C8A96A]/10 transition-all duration-500'
                    >
                      <div className='w-10 h-10 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] flex items-center justify-center mb-2 shadow-xl shadow-gold-900/10'>
                        <feature.icon className='w-6 h-6 text-[#0D0D0D]' />
                      </div>
                      <h4 className='text-[#F5E6C8] font-bold text-sm tracking-tight'>
                        {feature.title}
                      </h4>
                      <p className='text-[#C8A96A]/40 text-[9px] mt-1 font-black tracking-widest uppercase'>
                        {feature.subtitle}
                      </p>
                    </motion.div>
                  ))}
                </div>

                {/* Transaction Core */}
                <div className='grid lg:grid-cols-5 gap-3'>
                  {/* Left: UPI ID & Personal Link */}
                  <div className='lg:col-span-3 space-y-4'>
                    <div className='bg-[#1A1A1A]/80 backdrop-blur-3xl rounded-2xl p-4 border border-[#C8A96A]/10 h-full flex flex-col justify-center shadow-2xl'>
                      <div className='mb-3 flex items-center justify-between'>
                        <div>
                          <span className='inline-block px-3 py-1 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] text-[9px] font-black uppercase tracking-widest rounded-md mb-2'>
                            Exclusive
                          </span>
                          <h3 className='text-xl font-serif font-bold text-[#F5E6C8]'>
                            Direct Contributions
                          </h3>
                          <p className='text-[#C8A96A] text-[10px] font-bold uppercase tracking-widest mt-1'>
                            Beneficiary: Sanyukt Parivaar & Rich Life
                          </p>
                          <p className='text-white/30 text-[9px] font-medium italic mt-0.5'>
                            Verified Institutional Account
                          </p>
                        </div>
                      </div>

                      <div className='bg-[#0D0D0D] rounded-xl p-3 border border-[#C8A96A]/20 mb-2 group/upi relative overflow-hidden'>
                        <div className='absolute top-0 right-0 w-24 h-24 bg-[#C8A96A]/5 rounded-full -mr-8 -mt-8'></div>
                        <p className='text-[#C8A96A] text-[9px] font-black uppercase tracking-[0.3em] mb-2 font-mono'>
                          DIGITAL UPI ADDRESS
                        </p>
                        <div className='flex items-center justify-between gap-4 relative z-10'>
                          <span className='text-base md:text-lg font-mono font-bold text-[#F5E6C8]/90 break-all tracking-tighter'>
                            20260325575843-iservuqrsbrp@cbin
                          </span>
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "20260325575843-iservuqrsbrp@cbin"
                              );
                              toast.success("UPI Copied!");
                            }}
                            className='px-6 py-2 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] shadow-xl shadow-gold-900/20 font-bold text-[10px] uppercase tracking-widest flex-shrink-0'
                          >
                            Copy
                          </motion.button>
                        </div>
                      </div>

                      <div className='flex items-center gap-4 text-[#F5E6C8]/40'>
                        <div className='flex items-center gap-2'>
                          <ShieldCheck className='w-4 h-4 text-[#C8A96A]/60' />
                          <span className='text-[10px] font-bold uppercase tracking-widest font-mono'>
                            End-to-End Secure
                          </span>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Clock className='w-4 h-4 text-[#C8A96A]/60' />
                          <span className='text-[10px] font-bold uppercase tracking-widest font-mono'>
                            Instant Ledger
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Personal SMART Link Sharing */}
                    {userData && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className='bg-[#C8A96A]/5 backdrop-blur-3xl rounded-2xl p-4 border border-[#C8A96A]/10 shadow-xl'
                      >
                        <div className='flex items-center justify-between mb-4'>
                          <div className='flex items-center gap-3'>
                            <div className='w-8 h-8 bg-gradient-to-br from-[#1A1A1A] to-[#0D0D0D] rounded-lg border border-[#C8A96A]/20 flex items-center justify-center'>
                              <Share2 className='w-4 h-4 text-[#C8A96A]' />
                            </div>
                            <h4 className='text-[#F5E6C8] font-bold text-xs uppercase tracking-widest'>
                              Personal Referral Hub
                            </h4>
                          </div>
                          <div className='bg-[#C8A96A]/10 px-3 py-1 rounded-full border border-[#C8A96A]/20'>
                            <span className='text-[#C8A96A] text-[8px] font-black uppercase tracking-tighter'>
                              Verified Member
                            </span>
                          </div>
                        </div>

                        <div className='bg-[#0D0D0D]/50 rounded-2xl p-4 border border-[#C8A96A]/10 flex items-center gap-4'>
                          <div className='flex-1 overflow-hidden'>
                            <p className='text-[#F5E6C8]/40 text-[8px] font-black uppercase tracking-[0.2em] mb-1.5'>
                              Your bespoke donation link
                            </p>
                            <p className='text-[#F5E6C8] font-mono font-medium text-[11px] truncate'>
                              {window.location.origin +
                                "/donate?for=" +
                                (userData.memberId || userData._id)}
                            </p>
                          </div>
                          <div className='flex gap-2'>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(
                                  window.location.origin +
                                    "/donate?for=" +
                                    (userData.memberId || userData._id)
                                );
                                toast.success("Link Copied!");
                              }}
                              className='p-2 bg-[#1A1A1A] hover:bg-[#C8A96A]/10 rounded-xl text-[#C8A96A] border border-[#C8A96A]/10 transition-all'
                            >
                              <Copy className='w-4 h-4' />
                            </button>
                            <button
                              onClick={() => {
                                if (navigator.share) {
                                  navigator.share({
                                    title: "Sanyukt Parivaar Donation",
                                    text: `Support my mission on Sanyukt Parivaar.`,
                                    url:
                                      window.location.origin +
                                      "/donate?for=" +
                                      (userData.memberId || userData._id),
                                  });
                                } else {
                                  toast.error("Sharing not supported");
                                }
                              }}
                              className='p-2 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] rounded-xl text-[#0D0D0D] shadow-lg shadow-gold-900/10 transition-all'
                            >
                              <Share2 className='w-4 h-4' />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right: QR Code & Razorpay Button */}
                  <div className='lg:col-span-2 space-y-4'>
                    <div className='luxury-box bg-[#1A1A1A] p-3 shadow-2xl flex flex-col items-center justify-center h-full border border-[#C8A96A]/20 relative overflow-hidden group/card'>
                      <div className='absolute inset-0 bg-gradient-to-b from-[#C8A96A]/5 to-transparent'></div>

                      <div className='relative group/qr mb-3'>
                        <div className='absolute inset-0 bg-[#C8A96A]/20 rounded-3xl blur-2xl opacity-0 group-hover/qr:opacity-100 transition-opacity duration-700'></div>
                        <div className='relative bg-[#0D0D0D] p-3 border border-[#C8A96A]/40 shadow-2xl flex flex-col items-center group-hover/qr:border-[#C8A96A] transition-colors duration-500'>
                          <div className='p-2 bg-white rounded-xl'>
                            <img
                              src='/qr.jpeg'
                              alt='Donation QR Code'
                              className='w-32 h-32 object-contain rounded-lg shadow-inner'
                              onError={(e) => {
                                e.target.src =
                                  "https://via.placeholder.com/150x150?text=SCAN+PAY";
                              }}
                            />
                          </div>
                          <div className='mt-2 flex flex-col items-center gap-1'>
                            <div className='flex items-center gap-2'>
                              <Smartphone className='w-4 h-4 text-[#C8A96A]' />
                              <span className='text-[10px] font-black text-[#F5E6C8] uppercase tracking-[0.3em]'>
                                Secure Scan
                              </span>
                            </div>
                            <span className='text-[11px] font-bold text-[#C8A96A] uppercase tracking-wider text-center'>
                              Sanykt Parivaar Rich Life
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className='w-full h-px bg-[#C8A96A]/10 mb-3'></div>

                      <div className='w-full flex justify-center scale-110'>
                        <div className='relative group/razor transition-transform hover:scale-105 active:scale-95'>
                          <RazorpayPaymentButton buttonId='pl_SROihejcCAh8Vm' />
                        </div>
                      </div>

                      <div className='mt-3 text-[9px] text-[#F5E6C8]/40 font-bold uppercase tracking-[0.2em] flex flex-col items-center gap-1'>
                        <div className='flex items-center gap-2'>
                          <ShieldCheck className='w-3.5 h-3.5 text-[#C8A96A]' />
                          <span>Verified by Razorpay & NPCI</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Note */}
                <div className='mt-6 text-center'>
                  <p className='text-[#C8A96A]/30 text-[9px] font-black uppercase tracking-[0.4em] flex items-center justify-center gap-4'>
                    <div className='h-px w-10 bg-[#C8A96A]/10'></div>A
                    CULTIVATED CO-OPERATIVE SYSTEM
                    <div className='h-px w-10 bg-[#C8A96A]/10'></div>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. RECHARGE SERVICES SECTION */}
        <section className='mb-8'>
          <div className='luxury-box bg-[#1A1A1A] shadow-2xl border border-[#C8A96A]/20 overflow-hidden'>
            {/* Tabs Header */}
            <div className='flex flex-col md:flex-row bg-[#0D0D0D]/50 border-b border-[#C8A96A]/10 p-3 gap-3'>
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 py-6 px-4 flex items-center justify-center gap-4 transition-all duration-500 relative overflow-hidden group ${
                      isActive
                        ? "bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] shadow-2xl shadow-gold-900/20"
                        : "text-[#F5E6C8]/40 hover:text-[#C8A96A] hover:bg-[#C8A96A]/5"
                    }`}
                  >
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? "text-[#0D0D0D]"
                          : "group-hover:scale-110 transition-transform"
                      }`}
                    />
                    <span
                      className={`font-black text-[11px] uppercase tracking-[0.2em] ${
                        isActive ? "text-[#0D0D0D]" : ""
                      }`}
                    >
                      {tab.label}
                    </span>
                    {isActive && (
                      <motion.div
                        layoutId='activeTabGlow'
                        className='absolute inset-0 bg-white/10'
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Area */}
            <div className='p-3 md:p-6'>
              <AnimatePresence mode='wait'>
                {activeTab === "mobile" && (
                  <motion.div
                    key='mobile'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='grid lg:grid-cols-12 gap-8 lg:gap-12 items-start'
                  >
                    <div className='lg:col-span-7 flex flex-col gap-3'>
                      <div className='flex items-center justify-between mb-0'>
                        <h3 className='text-3xl font-serif font-bold text-[#C8A96A]'>
                          Mobile Recharge
                        </h3>
                        <span className='bg-[#C8A96A]/10 text-[#C8A96A] text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-[#C8A96A]/20'>
                          Premium Benefits Enabled
                        </span>
                      </div>

                      <div className='luxury-box bg-[#1A1A1A] p-2.5 md:p-4 border border-[#C8A96A]/20 shadow-2xl relative overflow-hidden group'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl -mr-16 -mt-16'></div>

                        <div className='flex items-center gap-3 mb-2'>
                          <div className='w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] flex items-center justify-center shadow-xl shadow-gold-900/10'>
                            <Zap className='w-6 h-6 text-[#0D0D0D]' />
                          </div>
                          <div>
                            <h4 className='text-xl font-serif font-bold text-[#F5E6C8]'>
                              Instant Connectivity
                            </h4>
                            <p className='text-xs text-[#F5E6C8]/40 uppercase tracking-widest font-bold'>
                              Secure Gateway • Real-time Processing
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => handleRecharge(e, "mobile")}
                          className='space-y-2'
                        >
                          <div className='space-y-2'>
                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-1.5'>
                                <Smartphone className='w-4 h-4' />
                                Recipient Number
                              </label>
                              <div className='relative'>
                                <input
                                  type='tel'
                                  value={mobileNumber}
                                  onChange={(e) =>
                                    setMobileNumber(e.target.value)
                                  }
                                  placeholder='Enter 10-digit number'
                                  className='w-full pl-6 pr-20 py-4 bg-[#0D0D0D] border border-[#C8A96A]/30 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A]/40 text-[#F5E6C8] outline-none transition-all placeholder:text-[#F5E6C8]/20 font-mono text-lg'
                                  maxLength='10'
                                  required
                                />
                                <span className='absolute right-6 top-1/2 -translate-y-1/2 text-xs font-black text-[#C8A96A]/40 uppercase tracking-widest'>
                                  IND +91
                                </span>
                              </div>
                              {isDetectingOperator && (
                                <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-[#C8A96A]/70'>
                                  Detecting operator and circle...
                                </p>
                              )}
                              {!isDetectingOperator && detectedOperatorInfo && (
                                <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-[#4CAF50]'>
                                  Auto-detected: {detectedOperatorInfo.company} |{" "}
                                  {detectedOperatorInfo.circle} (
                                  {detectedOperatorInfo.circleCode})
                                </p>
                              )}
                            </div>

                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-1.5'>
                                <CircleUser className='w-4 h-4' />
                                Choose Network
                              </label>
                              <div className='grid grid-cols-2 md:grid-cols-4 gap-3'>
                                {mobileOperators.map((op) => (
                                  <button
                                    key={op.id}
                                    type='button'
                                    onClick={() => setMobileOperator(op.id)}
                                    className={`group p-3 border-2 transition-all duration-300 flex flex-col items-center justify-center gap-1 ${
                                      mobileOperator === op.id
                                        ? `${op.activeClass} shadow-lg shadow-black/20 text-white`
                                        : `border-[#C8A96A]/5 bg-[#0D0D0D] ${op.colorClass}`
                                    }`}
                                  >
                                    <img
                                      src={op.logo}
                                      alt={op.name}
                                      className={`h-6 w-auto object-contain filter transition-all duration-300 ${
                                        mobileOperator === op.id
                                          ? "brightness-0 invert"
                                          : "brightness-110 group-hover:brightness-0 group-hover:invert"
                                      }`}
                                    />
                                    <span
                                      className={`text-[10px] font-medium transition-colors duration-300 ${
                                        mobileOperator === op.id
                                          ? "text-white"
                                          : "text-[#F5E6C8]/40 group-hover:text-white"
                                      }`}
                                    >
                                      {op.tagline}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            {hasTriedDetection &&
                              !isDetectingOperator &&
                              !detectedOperatorInfo && (
                                <div className='group/field'>
                                  <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-1.5'>
                                    <MapPin className='w-4 h-4' />
                                    Circle
                                  </label>
                                  <select
                                    value={selectedCircle}
                                    onChange={(e) =>
                                      setSelectedCircle(e.target.value)
                                    }
                                    className='w-full px-4 py-3 bg-[#0D0D0D] border border-[#C8A96A]/20 focus:border-[#C8A96A] text-[#F5E6C8] outline-none text-sm font-semibold'
                                  >
                                    {planCircles.length === 0 && (
                                      <option value='10'>DELHI (10)</option>
                                    )}
                                    {planCircles.map((circle) => (
                                      <option
                                        key={circle.code}
                                        value={circle.code}
                                      >
                                        {circle.name.replace(/_/g, " ")} (
                                        {circle.code})
                                      </option>
                                    ))}
                                  </select>
                                  <p className='mt-1 text-[10px] font-bold uppercase tracking-widest text-[#F5E6C8]/40'>
                                    Auto-detection failed. Select circle
                                    manually.
                                  </p>
                                </div>
                              )}

                            <div className='group/field'>
                              <div className='flex items-center justify-between mb-1.5'>
                                <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2'>
                                  <Wallet className='w-4 h-4' />
                                  Recharge Amount
                                </label>
                                {mobileOperator && (
                                  <button
                                    type='button'
                                    onClick={() => {
                                      if (!/^\d{10}$/.test(mobileNumber)) {
                                        toast.error(
                                          "Enter a valid 10-digit mobile number first"
                                        );
                                        return;
                                      }
                                      setShowPlansModal(true);
                                    }}
                                    className='text-[10px] font-black text-[#C8A96A] uppercase tracking-widest hover:text-[#F5E6C8] transition-colors flex items-center gap-2'
                                  >
                                    <Search className='w-3 h-3' />
                                    Browse Exclusive Plans
                                  </button>
                                )}
                              </div>
                              <div className='relative'>
                                <span className='absolute left-6 top-1/2 -translate-y-1/2 text-[#C8A96A] font-bold'>
                                  ₹
                                </span>
                                <input
                                  type='number'
                                  value={mobileAmount}
                                  onChange={() => {}}
                                  onFocus={() => {
                                    if (mobilePlans.length > 0) {
                                      toast("Select a plan to set amount");
                                    }
                                  }}
                                  placeholder='Select from fetched plans'
                                  readOnly
                                  className='w-full pl-10 pr-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] text-[#F5E6C8] outline-none transition-all placeholder:text-[#F5E6C8]/20 font-bold text-lg'
                                  required
                                />
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type='submit'
                              disabled={isProcessingPayment}
                              className='w-full py-5 bg-gradient-to-r from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] font-black text-xs uppercase tracking-[0.3em] hover:shadow-[0_0_30px_rgba(200,169,106,0.3)] shadow-xl shadow-gold-900/20 transition-all disabled:opacity-50'
                            >
                              {isProcessingPayment
                                ? "Securing Gateway..."
                                : "Recharge Now"}
                            </motion.button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className='lg:col-span-5 flex flex-col gap-3'>
                      {/* ── RECHARGE PLANS PANEL ── */}
                      <div
                        className='luxury-box bg-[#1A1A1A] border border-[#C8A96A]/20 shadow-xl flex flex-col'
                        style={{ maxHeight: "480px" }}
                      >
                        {/* Header */}
                        <div className='flex items-center justify-between p-3 pb-2 border-b border-[#C8A96A]/10 flex-shrink-0'>
                          <h4 className='text-[11px] font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2'>
                            <Zap className='w-3.5 h-3.5' />
                            {mobileOperator
                              ? `${mobileOperator.toUpperCase()} Plans`
                              : "Select Operator"}
                          </h4>
                          <span className='text-[9px] text-[#F5E6C8]/30 font-bold uppercase tracking-widest'>
                            Click to apply
                          </span>
                        </div>

                        {/* Plans List */}
                        <div
                          className='overflow-y-auto flex-1 p-2 space-y-1.5'
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#C8A96A22 transparent",
                          }}
                        >
                          {!mobileOperator ? (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Smartphone className='w-10 h-10 text-[#C8A96A]/15 mb-3' />
                              <p className='text-[#F5E6C8]/30 text-[11px] font-bold uppercase tracking-widest'>
                                Choose a network above
                                <br />
                                to see available plans
                              </p>
                            </div>
                          ) : !/^\d{10}$/.test(mobileNumber) ? (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Smartphone className='w-10 h-10 text-[#C8A96A]/20 mb-3' />
                              <p className='text-[#F5E6C8]/40 text-[11px] font-bold uppercase tracking-widest'>
                                Enter a 10-digit number to fetch live plans
                              </p>
                            </div>
                          ) : plansLoading ? (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Smartphone className='w-10 h-10 text-[#C8A96A]/20 mb-3 animate-pulse' />
                              <p className='text-[#F5E6C8]/40 text-[11px] font-bold uppercase tracking-widest'>
                                Fetching live plans...
                              </p>
                            </div>
                          ) : mobilePlans.length === 0 ? (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Search className='w-10 h-10 text-[#C8A96A]/20 mb-3' />
                              <p className='text-[#F5E6C8]/30 text-[11px] font-bold uppercase tracking-widest'>
                                No plans available
                                <br />
                                for selected circle
                              </p>
                            </div>
                          ) : (
                            paginatedMobilePlans.map((plan) => {
                              const categoryColors = {
                                Popular: "bg-[#C8A96A] text-[#0D0D0D]",
                                Unlimited: "bg-[#4CAF50]/20 text-[#4CAF50]",
                                Data: "bg-blue-500/20 text-blue-400",
                                "5G": "bg-purple-500/20 text-purple-400",
                                Annual: "bg-[#C8A96A]/20 text-[#C8A96A]",
                                Smart: "bg-orange-500/20 text-orange-400",
                                STV: "bg-pink-500/20 text-pink-400",
                              };
                              const badgeClass =
                                categoryColors[plan.category] ||
                                "bg-[#C8A96A]/10 text-[#C8A96A]";
                              return (
                                <motion.button
                                  key={plan.id}
                                  type='button'
                                  whileHover={{ scale: 1.01 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() => setMobileAmount(plan.amount)}
                                  className={`w-full text-left p-2.5 border transition-all duration-200 flex items-center gap-3 group/plan ${
                                    Number(mobileAmount) === plan.amount
                                      ? "border-[#C8A96A] bg-[#C8A96A]/10"
                                      : "border-[#C8A96A]/10 bg-[#0D0D0D] hover:border-[#C8A96A]/40 hover:bg-[#C8A96A]/5"
                                  }`}
                                >
                                  {/* Amount */}
                                  <div className='flex-shrink-0 w-14 text-center'>
                                    <span className='text-lg font-black text-[#C8A96A] leading-none'>
                                      ₹{plan.amount}
                                    </span>
                                  </div>
                                  {/* Details */}
                                  <div className='flex-1 min-w-0'>
                                    <p className='text-[#F5E6C8] text-[11px] font-bold truncate leading-tight'>
                                      {plan.description}
                                    </p>
                                    <div className='flex items-center gap-2 mt-0.5'>
                                      <span className='text-[#F5E6C8]/40 text-[10px]'>
                                        {plan.validity}
                                      </span>
                                      {plan.data &&
                                        plan.data !== "None" &&
                                        plan.data !== "N/A" && (
                                          <span className='text-[#C8A96A]/60 text-[10px]'>
                                            • {plan.data}
                                          </span>
                                        )}
                                    </div>
                                  </div>
                                  {/* Badge */}
                                  <span
                                    className={`flex-shrink-0 text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded ${badgeClass}`}
                                  >
                                    {plan.category}
                                  </span>
                                </motion.button>
                              );
                            })
                          )}
                        </div>
                        {mobilePlans.length > MOBILE_PLANS_PER_PAGE && (
                          <div className='flex items-center justify-between p-2 border-t border-[#C8A96A]/10 bg-[#0D0D0D]/40'>
                            <button
                              type='button'
                              onClick={() =>
                                setMobilePlansPage((prev) =>
                                  Math.max(1, prev - 1)
                                )
                              }
                              disabled={safeMobilePlansPage === 1}
                              className='px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#C8A96A] border border-[#C8A96A]/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C8A96A]/10'
                            >
                              Prev
                            </button>
                            <span className='text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/50'>
                              Page {safeMobilePlansPage} / {mobileTotalPages}
                            </span>
                            <button
                              type='button'
                              onClick={() =>
                                setMobilePlansPage((prev) =>
                                  Math.min(mobileTotalPages, prev + 1)
                                )
                              }
                              disabled={
                                safeMobilePlansPage === mobileTotalPages
                              }
                              className='px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#C8A96A] border border-[#C8A96A]/20 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#C8A96A]/10'
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "dth" && (
                  <motion.div
                    key='dth'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='grid lg:grid-cols-12 gap-8 lg:gap-12 items-start'
                  >
                    <div className='lg:col-span-7 flex flex-col gap-6'>
                      <h3 className='text-3xl font-serif font-bold text-[#C8A96A] mb-2'>
                        DTH Services
                      </h3>

                      <div className='bg-[#1A1A1A] rounded-3xl p-8 border border-[#C8A96A]/10 shadow-2xl relative overflow-hidden group'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl -mr-16 -mt-16'></div>

                        <div className='flex items-center gap-4 mb-8'>
                          <div className='w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] flex items-center justify-center shadow-xl shadow-gold-900/10'>
                            <Tv className='w-6 h-6 text-[#0D0D0D]' />
                          </div>
                          <div>
                            <h4 className='text-xl font-serif font-bold text-[#F5E6C8]'>
                              DTH Top-Up
                            </h4>
                            <p className='text-xs text-[#F5E6C8]/40 uppercase tracking-widest font-bold'>
                              Satellite Entertainment Gateway
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => handleRecharge(e, "dth")}
                          className='space-y-6'
                        >
                          <div className='space-y-6'>
                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-3'>
                                <Tv className='w-4 h-4' />
                                Customer ID / Smart Card
                              </label>
                              <input
                                type='text'
                                value={dthNumber}
                                onChange={(e) => setDthNumber(e.target.value)}
                                placeholder='Enter your registered ID'
                                className='w-full px-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] text-[#F5E6C8] outline-none transition-all placeholder:text-[#F5E6C8]/20 font-mono text-lg'
                                required
                              />
                            </div>

                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-3'>
                                <CircleUser className='w-4 h-4' />
                                Select Provider
                              </label>
                              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                                {dthOperators.map((op) => (
                                  <button
                                    key={op.id}
                                    type='button'
                                    onClick={() => setDthOperator(op.id)}
                                    className={`p-4 border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                                      dthOperator === op.id
                                        ? `${op.activeClass} shadow-lg shadow-black/20 text-white`
                                        : `border-[#C8A96A]/5 bg-[#0D0D0D] ${op.colorClass}`
                                    }`}
                                  >
                                    <span
                                      className={`text-lg font-black uppercase tracking-wide transition-colors duration-300 ${
                                        dthOperator === op.id
                                          ? "text-white"
                                          : "text-[#F5E6C8]/60 group-hover:text-white"
                                      }`}
                                    >
                                      {op.logo}
                                    </span>
                                    <span
                                      className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                        dthOperator === op.id
                                          ? "text-white"
                                          : "text-[#F5E6C8]/40 group-hover:text-white"
                                      }`}
                                    >
                                      {op.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-3'>
                                <Wallet className='w-4 h-4' />
                                Recharge Amount
                              </label>
                              <div className='relative'>
                                <span className='absolute left-6 top-1/2 -translate-y-1/2 text-[#C8A96A] font-bold'>
                                  ₹
                                </span>
                                <input
                                  type='number'
                                  value={dthAmount}
                                  onChange={(e) => setDthAmount(e.target.value)}
                                  placeholder='0.00'
                                  className='w-full pl-10 pr-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] text-[#F5E6C8] outline-none transition-all placeholder:text-[#F5E6C8]/20 font-bold text-lg'
                                  required
                                />
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type='submit'
                              disabled={isProcessingPayment}
                              className='luxury-button w-full py-5 font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-gold-900/20 transition-all disabled:opacity-50'
                            >
                              {isProcessingPayment
                                ? "Initializing..."
                                : "Recharge Now"}
                            </motion.button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className='lg:col-span-5 flex flex-col gap-3'>
                      <div
                        className='luxury-box bg-[#1A1A1A] border border-[#C8A96A]/20 shadow-xl flex flex-col'
                        style={{ maxHeight: "480px" }}
                      >
                        <div className='flex items-center justify-between p-3 pb-2 border-b border-[#C8A96A]/10 flex-shrink-0'>
                          <h4 className='text-[11px] font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2'>
                            <Tv className='w-3.5 h-3.5' />
                            {dthOperator
                              ? `${dthOperator.toUpperCase()} Plans`
                              : "Select Provider"}
                          </h4>
                          <span className='text-[9px] text-[#F5E6C8]/30 font-bold uppercase tracking-widest'>
                            Click to apply
                          </span>
                        </div>
                        <div
                          className='overflow-y-auto flex-1 p-2 space-y-1.5'
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#C8A96A22 transparent",
                          }}
                        >
                          {!dthOperator ? (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Tv className='w-10 h-10 text-[#C8A96A]/15 mb-3' />
                              <p className='text-[#F5E6C8]/30 text-[11px] font-bold uppercase tracking-widest'>
                                Choose a provider above
                                <br />
                                to see available plans
                              </p>
                            </div>
                          ) : (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Search className='w-10 h-10 text-[#C8A96A]/20 mb-3' />
                              <p className='text-[#F5E6C8]/30 text-[11px] font-bold uppercase tracking-widest'>
                                Live DTH plans not enabled yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "datacard" && (
                  <motion.div
                    key='datacard'
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className='grid lg:grid-cols-12 gap-8 lg:gap-12 items-start'
                  >
                    <div className='lg:col-span-7 flex flex-col gap-6'>
                      <h3 className='text-3xl font-serif font-bold text-[#C8A96A] mb-2'>
                        Data Services
                      </h3>

                      <div className='luxury-box bg-[#1A1A1A] p-8 border border-[#C8A96A]/20 shadow-2xl relative overflow-hidden group'>
                        <div className='absolute top-0 right-0 w-32 h-32 bg-[#C8A96A]/5 rounded-full blur-3xl -mr-16 -mt-16'></div>

                        <div className='flex items-center gap-4 mb-8'>
                          <div className='w-12 h-12 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] flex items-center justify-center shadow-xl shadow-gold-900/10'>
                            <Wifi className='w-6 h-6 text-[#0D0D0D]' />
                          </div>
                          <div>
                            <h4 className='text-xl font-serif font-bold text-[#F5E6C8]'>
                              Data Top-Up
                            </h4>
                            <p className='text-xs text-[#F5E6C8]/40 uppercase tracking-widest font-bold'>
                              High-Speed Broadband Access
                            </p>
                          </div>
                        </div>

                        <form
                          onSubmit={(e) => handleRecharge(e, "datacard")}
                          className='space-y-6'
                        >
                          <div className='space-y-6'>
                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-3'>
                                <Wifi className='w-4 h-4' />
                                Terminal Number
                              </label>
                              <input
                                type='text'
                                value={dataCardNumber}
                                onChange={(e) =>
                                  setDataCardNumber(e.target.value)
                                }
                                placeholder='Enter data card ID'
                                className='w-full px-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] text-[#F5E6C8] outline-none transition-all placeholder:text-[#F5E6C8]/20 font-mono text-lg'
                                required
                              />
                            </div>

                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-3'>
                                <CircleUser className='w-4 h-4' />
                                Select Provider
                              </label>
                              <div className='grid grid-cols-2 lg:grid-cols-4 gap-4'>
                                {datacardOperators.map((op) => (
                                  <button
                                    key={op.id}
                                    type='button'
                                    onClick={() => setDataCardOperator(op.id)}
                                    className={`p-4 border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 group ${
                                      dataCardOperator === op.id
                                        ? `${op.activeClass} shadow-lg shadow-black/20 text-white`
                                        : `border-[#C8A96A]/5 bg-[#0D0D0D] ${op.colorClass}`
                                    }`}
                                  >
                                    <span
                                      className={`text-lg font-black uppercase tracking-wide transition-colors duration-300 ${
                                        dataCardOperator === op.id
                                          ? "text-white"
                                          : "text-[#F5E6C8]/60 group-hover:text-white"
                                      }`}
                                    >
                                      {op.logo}
                                    </span>
                                    <span
                                      className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${
                                        dataCardOperator === op.id
                                          ? "text-white"
                                          : "text-[#F5E6C8]/40 group-hover:text-white"
                                      }`}
                                    >
                                      {op.name}
                                    </span>
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div className='group/field'>
                              <label className='text-xs font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2 mb-3'>
                                <IndianRupee className='w-4 h-4' />
                                Access Credits (₹)
                              </label>
                              <div className='relative'>
                                <span className='absolute left-6 top-1/2 -translate-y-1/2 text-[#C8A96A] font-bold'>
                                  ₹
                                </span>
                                <input
                                  type='number'
                                  value={dataCardAmount}
                                  onChange={(e) =>
                                    setDataCardAmount(e.target.value)
                                  }
                                  placeholder='0.00'
                                  className='w-full pl-10 pr-6 py-4 bg-[#0D0D0D] border border-[#C8A96A]/20 focus:border-[#C8A96A] focus:ring-1 focus:ring-[#C8A96A] text-[#F5E6C8] outline-none transition-all placeholder:text-[#F5E6C8]/20 font-bold text-lg'
                                  required
                                />
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              type='submit'
                              disabled={isProcessingPayment}
                              className='luxury-button w-full py-5 font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-gold-900/20 transition-all disabled:opacity-50'
                            >
                              {isProcessingPayment
                                ? "Connecting..."
                                : "Recharge Now"}
                            </motion.button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className='lg:col-span-5 flex flex-col gap-3'>
                      <div
                        className='luxury-box bg-[#1A1A1A] border border-[#C8A96A]/20 shadow-xl flex flex-col'
                        style={{ maxHeight: "480px" }}
                      >
                        <div className='flex items-center justify-between p-3 pb-2 border-b border-[#C8A96A]/10 flex-shrink-0'>
                          <h4 className='text-[11px] font-black text-[#C8A96A] uppercase tracking-[0.2em] flex items-center gap-2'>
                            <Wifi className='w-3.5 h-3.5' />
                            {dataCardOperator
                              ? `${dataCardOperator.toUpperCase()} Plans`
                              : "Select Provider"}
                          </h4>
                          <span className='text-[9px] text-[#F5E6C8]/30 font-bold uppercase tracking-widest'>
                            Click to apply
                          </span>
                        </div>
                        <div
                          className='overflow-y-auto flex-1 p-2 space-y-1.5'
                          style={{
                            scrollbarWidth: "thin",
                            scrollbarColor: "#C8A96A22 transparent",
                          }}
                        >
                          {!dataCardOperator ? (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Wifi className='w-10 h-10 text-[#C8A96A]/15 mb-3' />
                              <p className='text-[#F5E6C8]/30 text-[11px] font-bold uppercase tracking-widest'>
                                Choose a provider above
                                <br />
                                to see available plans
                              </p>
                            </div>
                          ) : (
                            <div className='flex flex-col items-center justify-center py-10 text-center'>
                              <Search className='w-10 h-10 text-[#C8A96A]/20 mb-3' />
                              <p className='text-[#F5E6C8]/30 text-[11px] font-bold uppercase tracking-widest'>
                                Live data-card plans not enabled yet
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* 5. HOW IT WORKS SECTION */}
        <section className='luxury-box bg-[#1A1A1A] p-6 md:p-10 relative overflow-hidden shadow-2xl border border-[#C8A96A]/20 mt-10'>
          <div className='absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C8A96A]/30 to-transparent'></div>

          <div className='relative z-10'>
            <div className='text-center mb-10'>
              <h2 className='text-3xl md:text-4xl font-serif font-bold mb-4 tracking-tight text-[#C8A96A]'>
                The Ritual of Recharge
              </h2>
              <p className='text-[#F5E6C8]/60 text-lg max-w-2xl mx-auto font-medium leading-relaxed'>
                A seamless, elite experience designed for the modern family.
                Every transaction, a step towards financial freedom.
              </p>
            </div>

            <div className='grid lg:grid-cols-2 gap-10 items-center'>
              <div className='space-y-4'>
                {[
                  {
                    step: 1,
                    title: "Identity Verification",
                    desc: "Step into your private sanctuary with high-level authentication.",
                  },
                  {
                    step: 2,
                    title: "Service Selection",
                    desc: "Choose from our curated list of elite digital services.",
                  },
                  {
                    step: 3,
                    title: "Asset Configuration",
                    desc: "Provide the unique identifiers for your digital assets.",
                  },
                  {
                    step: 4,
                    title: "Secure Authorization",
                    desc: "Confirm via our military-grade E-Payment gateway.",
                  },
                  {
                    step: 5,
                    title: "Instant Activation",
                    desc: "Immediate gratification with real-time confirmation.",
                  },
                ].map((item, idx) => (
                  <div key={idx} className='flex gap-4 group'>
                    <div className='flex flex-col items-center'>
                      <div className='w-12 h-12 bg-[#0D0D0D] border border-[#C8A96A]/20 flex items-center justify-center text-xl font-serif font-bold text-[#C8A96A] group-hover:border-[#C8A96A] group-hover:bg-[#C8A96A] group-hover:text-[#0D0D0D] transition-all duration-500 shadow-xl'>
                        {item.step}
                      </div>
                      {idx < 4 && (
                        <div className='w-[1px] h-full bg-gradient-to-b from-[#C8A96A]/20 to-transparent mt-4'></div>
                      )}
                    </div>
                    <div className='pb-4'>
                      <h4 className='text-xl font-serif font-bold text-[#F5E6C8] mb-1 group-hover:text-[#C8A96A] transition-colors'>
                        {item.title}
                      </h4>
                      <p className='text-[#F5E6C8]/40 text-xs md:text-sm leading-relaxed font-medium'>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className='relative'>
                <div className='absolute inset-0 bg-gradient-to-br from-[#C8A96A]/10 to-transparent blur-3xl'></div>

                <div className='relative bg-[#0D0D0D] p-3 md:p-6 border border-[#C8A96A]/20 shadow-3xl overflow-hidden group'>
                  <div className='absolute top-0 right-0 w-64 h-64 bg-[#C8A96A]/5 rounded-full blur-3xl -mr-32 -mt-32'></div>

                  <div className='text-center relative z-10'>
                    <div className='w-16 h-16 bg-gradient-to-br from-[#C8A96A] to-[#D4AF37] text-[#0D0D0D] flex items-center justify-center mx-auto mb-6 shadow-2xl rotate-3 group-hover:rotate-0 transition-transform duration-700'>
                      <ShieldCheck className='w-12 h-12' />
                    </div>
                    <h3 className='font-serif font-extrabold text-2xl text-[#F5E6C8] tracking-tight mb-2'>
                      Fortified Gateway
                    </h3>
                    <p className='text-[#C8A96A]/60 font-black uppercase tracking-[0.3em] text-[10px] mb-4'>
                      RSA-4096 Encryption Protocol
                    </p>

                    <div className='grid grid-cols-2 gap-2 mt-4'>
                      {[
                        { icon: Shield, label: "Protected", color: "#C8A96A" },
                        { icon: Zap, label: "Instant", color: "#C8A96A" },
                        {
                          icon: CheckCircle2,
                          label: "Verified",
                          color: "#C8A96A",
                        },
                        { icon: Lock, label: "Encrypted", color: "#C8A96A" },
                      ].map((feature, i) => (
                        <div
                          key={i}
                          className='p-3 bg-[#1A1A1A] border border-[#C8A96A]/10 hover:border-[#C8A96A]/20 transition-colors shadow-lg'
                        >
                          <feature.icon
                            className='w-6 h-6 mx-auto mb-3'
                            style={{ color: feature.color }}
                          />
                          <span className='text-[10px] font-black uppercase tracking-widest text-[#F5E6C8]/60'>
                            {feature.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Payment Method Modal */}
      <PaymentMethodModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onSelect={handleSelectPayment}
        amount={pendingRecharge?.amount}
        walletBalance={walletBalance}
        isProcessing={isProcessingPayment}
      />

      {/* Browse Plans Modal */}
      <BrowsePlansModal
        isOpen={showPlansModal}
        onClose={() => setShowPlansModal(false)}
        onSelect={(amount) => setMobileAmount(amount)}
        operator={
          mobileOperator
            ? mobileOperators.find((op) => op.id === mobileOperator)?.name
            : ""
        }
        plans={mobilePlans}
      />
    </div>
  );
};

export default Recharge;
