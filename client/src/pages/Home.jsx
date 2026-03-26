import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api, { API_URL } from '../api';
import { useCart } from '../context/CartContext';
import {
    ChevronRight, ChevronDown, Check, ArrowRight,
    Smartphone, Search, ShoppingCart, Mail, Phone,
    MapPin, Clock, Facebook, Instagram, Youtube, Twitter,
    Shield, Star, Package, TrendingUp, Users, Heart, Award, Play, X, Wallet
} from 'lucide-react';

// Lazy load section components
const HeroSection = React.lazy(() => import('./HomeComponents/HeroSection'));
// const RechargeSection = React.lazy(() => import('./HomeComponents/RechargeSection'));
const AboutSection = React.lazy(() => import('./HomeComponents/AboutSection'));
const WhyChooseSection = React.lazy(() => import('./HomeComponents/WhyChooseSection'));
const ProductsCarousel = React.lazy(() => import('./HomeComponents/ProductsCarousel'));
const BusinessOpportunity = React.lazy(() => import('./HomeComponents/BusinessOpportunity'));
const TrainingSection = React.lazy(() => import('./HomeComponents/TrainingSection'));
const NewsSection = React.lazy(() => import('./HomeComponents/NewsSection'));
// const ContactFormSection = React.lazy(() => import('./HomeComponents/ContactFormSection'));

import ProductDetailsModal from '../components/ProductDetailsModal';
import PaymentMethodModal from '../components/PaymentMethodModal';
import BrowsePlansModal from '../components/BrowsePlansModal';
import { rechargePlans } from '../data/rechargePlans';

// Simple loading fallback
const SectionLoader = () => (
    <div className="w-full py-20 flex items-center justify-center bg-[#0D0D0D]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#C8A96A]"></div>
    </div>
);

const HomePage = () => {
    const navigate = useNavigate();
    const [currentSlide, setCurrentSlide] = useState(0);
    const [imageErrors, setImageErrors] = useState({});
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);

    // Mobile recharge form state
    const [mobileNumber, setMobileNumber] = useState('');
    const [operator, setOperator] = useState('');
    const [amount, setAmount] = useState('');
    const [showPlansModal, setShowPlansModal] = useState(false);
    const [planTab, setPlanTab] = useState('All');

    // Payment Modal State
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [walletBalance, setWalletBalance] = useState(0);
    const [isProcessingPayment, setIsProcessingPayment] = useState(false);

    // E-commerce state
    const [viewMode, setViewMode] = useState('grid');
    const [wishlist, setWishlist] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const { addToCart: contextAddToCart, removeFromCart, isInCart } = useCart();
    const [showCartNotification, setShowCartNotification] = useState(false);
    const [addedToCartProduct, setAddedToCartProduct] = useState('');
    const [searchAmount, setSearchAmount] = useState('');

    // Contact form state
    const [contactForm, setContactForm] = useState({
        firstName: '', lastName: '', email: '', phone: '', enquiryType: 'Product Enquiry', message: ''
    });
    const [contactSubmitting, setContactSubmitting] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);

    // Hero slides data
    const heroSlides = [
        {
            image: "/hero4.jpeg",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "A Trusted & Fast-Growing Multi-Level Marketing Plateform",
            description: "Sanyukt Parivaar & Rich Life Pvt.Ltd. is a people-driven direct selling organization committed to empowering individuals with sustainable income opportunities. Through our transparent MLM business model and high-quality products, we help ordinary people build extraordinary futures."
        },
        {
            image: "/hero5.jpeg",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "A Trusted & Fast-Growing Multi-Level Marketing Plateform",
            description: "Sanyukt Parivaar & Rich Life Pvt.Ltd. is a people-driven direct selling organization committed to empowering individuals with sustainable income opportunities. Through our transparent MLM business model and high-quality products, we help ordinary people build extraordinary futures."
        },
        {
            image: "/hero4.jpeg",
            title: "Welcome to Sanyukt Parivaar & Rich Life Pvt.Ltd.",
            subtitle: "A Trusted & Fast-Growing Multi-Level Marketing Plateform",
            description: "Sanyukt Parivaar & Rich Life Pvt.Ltd. is a people-driven direct selling organization committed to empowering individuals with sustainable income opportunities. Through our transparent MLM business model and high-quality products, we help ordinary people build extraordinary futures."
        }
    ];

    // About section image
    const aboutImage = "https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

    // Team images
    const teamImages = [
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80",
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60&q=80"
    ];

    // Category images
    const skinCareImage = "https://images.pexels.com/photos/6621360/pexels-photo-6621360.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";
    const hairCareImage = "https://images.pexels.com/photos/3993447/pexels-photo-3993447.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop";

    // Product Images from Pexels
    const productImages = [
        "https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
        "https://images.pexels.com/photos/5946066/pexels-photo-5946066.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop",
        "https://images.pexels.com/photos/6955177/pexels-photo-6955177.jpeg",
        "https://images.pexels.com/photos/3738345/pexels-photo-3738345.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop"
    ];

    // Business opportunity image
    const businessImage = "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

    // Training image
    const trainingImage = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80";

    // Mobile operators list with inline SVG logos (no external URL needed)
    const AIRTEL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='100' y='52' font-family='Arial,sans-serif' font-size='36' font-weight='900' fill='%23ED1C24' text-anchor='middle'>airtel</text></svg>`;
    const JIO_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='100' y='55' font-family='Arial,sans-serif' font-size='44' font-weight='900' fill='%230066CC' text-anchor='middle'>Jio</text></svg>`;
    const VI_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='90' y='55' font-family='Arial,sans-serif' font-size='44' font-weight='900' fill='%23E11D48' text-anchor='middle'>Vi</text><text x='148' y='55' font-family='Arial,sans-serif' font-size='20' font-weight='700' fill='%23FBBF24' text-anchor='middle'>!</text></svg>`;
    const BSNL_LOGO = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 80'><text x='100' y='52' font-family='Arial,sans-serif' font-size='32' font-weight='900' fill='%23FF6600' text-anchor='middle'>BSNL</text></svg>`;

    const operators = [
        {
            id: 'airtel',
            name: 'Airtel',
            logo: AIRTEL_LOGO,
            tagline: '5G Ready',
            bgColor: 'bg-red-50'
        },
        {
            id: 'jio',
            name: 'Jio',
            logo: JIO_LOGO,
            tagline: 'True 5G',
            bgColor: 'bg-blue-50'
        },
        {
            id: 'vi',
            name: 'Vi',
            logo: VI_LOGO,
            tagline: 'Best Value',
            bgColor: 'bg-purple-50'
        },
        {
            id: 'bsnl',
            name: 'BSNL',
            logo: BSNL_LOGO,
            tagline: 'Pan-India',
            bgColor: 'bg-yellow-50'
        }
    ];



    // E-commerce state
    const [products, setProducts] = useState([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    const whyChoosePoints = [
        { icon: <Shield className="w-5 h-5" />, text: "Transparent & legal MLM business model" },
        { icon: <Package className="w-5 h-5" />, text: "High-quality, daily-use products" },
        { icon: <TrendingUp className="w-5 h-5" />, text: "Unlimited income potential" },
        { icon: <Users className="w-5 h-5" />, text: "Regular training & leadership programs" },
        { icon: <Heart className="w-5 h-5" />, text: "Strong support system" },
        { icon: <Award className="w-5 h-5" />, text: "Long-term vision with stable growth" }
    ];

    const businessHighlights = [
        "Low investment, high growth potential",
        "Work from anywhere",
        "Earn part-time or full-time",
        "Build a stable and scalable income"
    ];

    const supportItems = [
        "Product knowledge training",
        "Business & leadership development",
        "Online and offline seminars",
        "Marketing & growth strategies"
    ];


    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await api.get('/products');
                // Only show featured products on the homepage carousel,
                // fallback to first 8 products if no featured products found
                const featured = data.filter(p => p.isFeatured);
                setProducts(featured.length > 0 ? featured : data.slice(0, 8));
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoadingProducts(false);
            }
        };
        fetchProducts();
    }, []);

    // Check authentication status
    useEffect(() => {
        const checkAuth = () => {
            const token = localStorage.getItem('token');
            const user = localStorage.getItem('user');
            if (token && user) {
                try {
                    const parsedUser = JSON.parse(user);
                    setIsLoggedIn(true);
                    setUserRole(parsedUser.role || 'user');
                } catch (e) {
                    setIsLoggedIn(false);
                }
            } else {
                setIsLoggedIn(false);
            }
        };
        checkAuth();
        window.addEventListener('storage', checkAuth);
        return () => window.removeEventListener('storage', checkAuth);
    }, [navigate]);



    const handleNavigation = (path, options = {}) => {
        navigate(path, options);
    };

    const fetchWalletBalance = async () => {
        try {
            const { data } = await api.get('mlm/get-stats');
            setWalletBalance(data.walletBalance || 0);
        } catch (error) {
            console.error("Error fetching wallet balance:", error);
        }
    };

    const handleRecharge = async (e) => {
        e.preventDefault();
        if (!isLoggedIn) {
            toast.error('Please login to proceed with recharge');
            navigate('/login');
            return;
        }
        if (mobileNumber && operator && Number(amount) > 0) {
            await fetchWalletBalance();
            setShowPaymentModal(true);
        } else if (Number(amount) <= 0 && amount !== '') {
            toast.error('Amount must be greater than 0');
        } else {
            toast.error('Please fill all fields');
        }
    };

    const handleFinalPayment = async (method) => {
        if (method === 'wallet') {
            try {
                setIsProcessingPayment(true);
                const toastId = toast.loading("Processing wallet payment...");

                const { data } = await api.post('/recharge/wallet', {
                    amount: Number(amount),
                    type: 'mobile',
                    operator,
                    rechargeNumber: mobileNumber
                });

                if (data.success) {
                    toast.success("Recharge successful!", { id: toastId });
                    setMobileNumber('');
                    setOperator('');
                    setAmount('');
                    setSearchAmount('');
                    setShowPaymentModal(false);
                } else {
                    toast.error(data.message || "Wallet payment failed", { id: toastId });
                }
            } catch (error) {
                console.error("Wallet Payment Error:", error);
                toast.error(error?.response?.data?.message || "Something went wrong with wallet payment");
            } finally {
                setIsProcessingPayment(false);
            }
        } else if (method === 'online') {
            // Razorpay logic
            const loadScript = (src) => {
                return new Promise((resolve) => {
                    const script = document.createElement("script");
                    script.src = src;
                    script.onload = () => resolve(true);
                    script.onerror = () => resolve(false);
                    document.body.appendChild(script);
                });
            };

            try {
                setIsProcessingPayment(true);
                const toastId = toast.loading("Initiating secure payment...");

                // 1. Create Order on backend
                const { data: orderData } = await api.post('/recharge/create-order', {
                    amount: Number(amount),
                    type: 'mobile',
                    operator,
                    rechargeNumber: mobileNumber
                });

                if (!orderData.success) {
                    toast.error("Failed to initiate order", { id: toastId });
                    setIsProcessingPayment(false);
                    return;
                }

                toast.dismiss(toastId);

                // 2. Open Razorpay Checkout Widget
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_SQbbsEM3Dlfgi2",
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "Sanyukt Parivaar",
                    description: "Mobile Recharge",
                    order_id: orderData.order.id,
                    handler: async function (response) {
                        try {
                            const verifyToast = toast.loading("Verifying payment...");

                            // 3. Verify Payment
                            const { data: verifyData } = await api.post('/recharge/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                transactionId: orderData.transactionId
                            });

                            if (verifyData.success) {
                                toast.success("Recharge successful!", { id: verifyToast });
                                setMobileNumber('');
                                setOperator('');
                                setAmount('');
                                setSearchAmount('');
                                setShowPaymentModal(false);
                            } else {
                                toast.error("Payment verification failed", { id: verifyToast });
                            }
                        } catch (err) {
                            console.error(err);
                            toast.error("Error verifying payment");
                        } finally {
                            setIsProcessingPayment(false);
                        }
                    },
                    modal: {
                        ondismiss: function () {
                            setIsProcessingPayment(false);
                        }
                    },
                    prefill: {
                        name: "Sanyukt Member",
                        email: "info@sanyuktparivaar.com",
                        contact: (mobileNumber || "").toString().replace(/\D/g, '').slice(-10)
                    },
                    theme: {
                        color: "#C9A84C"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    toast.error(`Payment Failed: ${response.error.description}`);
                    setIsProcessingPayment(false);
                });
                rzp1.open();

            } catch (error) {
                console.error("Recharge Error:", error);
                toast.error(error?.response?.data?.message || "Something went wrong. Please try again.");
                setIsProcessingPayment(false);
            }
        }
    };

    const selectPlan = (planAmount) => {
        setAmount(planAmount);
        setShowPlansModal(false);
    };

    const openPlanPopup = () => {
        setShowPlansModal(true);
    };

    const handleImageError = (productName) => {
        setImageErrors(prev => ({ ...prev, [productName]: true }));
    };

    const toggleWishlist = (productName) => {
        setWishlist(prev =>
            prev.includes(productName)
                ? prev.filter(p => p !== productName)
                : [...prev, productName]
        );
    };

    const addToCart = (product) => {
        contextAddToCart(product);
        setAddedToCartProduct(product.name);
        setShowCartNotification(true);
        setTimeout(() => setShowCartNotification(false), 3000);
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setIsProductModalOpen(true);
    };

    const handleBuyNow = (product) => {
        if (!isLoggedIn) {
            toast.error('Please login to proceed');
            navigate('/login');
            return;
        }
        setIsProductModalOpen(false);
        navigate('/checkout', { state: { product } });
    };

    const handleContactSubmit = async (e) => {
        e.preventDefault();
        const { firstName, message } = contactForm;
        if (!firstName.trim() || !message.trim()) {
            toast.error('Please fill in your name and message.');
            return;
        }
        setContactSubmitting(true);
        try {
            const { data } = await api.post('/contact', contactForm);
            toast.success(data.message || 'Message sent successfully!');
            setContactSuccess(true);
            setContactForm({ firstName: '', lastName: '', email: '', phone: '', enquiryType: 'Product Enquiry', message: '' });
            setTimeout(() => setContactSuccess(false), 3000);
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Failed to send message. Please try again.');
        } finally {
            setContactSubmitting(false);
        }
    };

    const calculateDiscount = (mrp, dp) => {
        const mrpValue = typeof mrp === 'string' ? parseInt(mrp.replace('₹', '')) : mrp;
        const dpValue = typeof dp === 'string' ? parseInt(dp.replace('₹', '')) : dp;
        if (!mrpValue || !dpValue) return 0;
        const discount = ((mrpValue - dpValue) / mrpValue * 100).toFixed(0);
        return discount;
    };

    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars.push(<Star key={i} className="w-3 h-3 fill-current text-yellow-400" />);
            } else if (i === fullStars && hasHalfStar) {
                stars.push(
                    <div key={i} className="relative">
                        <Star className="w-3 h-3 text-gray-300" />
                        <div className="absolute inset-0 overflow-hidden w-1/2">
                            <Star className="w-3 h-3 fill-current text-yellow-400" />
                        </div>
                    </div>
                );
            } else {
                stars.push(<Star key={i} className="w-3 h-3 text-gray-300" />);
            }
        }
        return stars;
    };

    const carouselRef = React.useRef(null);
    const scroll = (direction) => {
        const container = carouselRef.current;
        if (container) {
            const scrollAmount = container.offsetWidth * 0.8;
            const targetScroll = direction === 'left'
                ? container.scrollLeft - scrollAmount
                : container.scrollLeft + scrollAmount;

            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
        }
    };


    return (
        <div className="min-h-screen bg-[#0D0D0D] font-sans">
            <React.Suspense fallback={<SectionLoader />}>
                <HeroSection
                    currentSlide={currentSlide}
                    setCurrentSlide={setCurrentSlide}
                    heroSlides={heroSlides}
                    isLoggedIn={isLoggedIn}
                    userRole={userRole}
                    handleNavigation={handleNavigation}
                />

                {/* </RechargeSection> */}

                <div className="w-full flex items-center justify-center gap-2 sm:gap-5 mt-2 mb-2 sm:my-6 px-4 sm:px-5">
                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />

                    <span
                        className="text-center text-xl sm:text-2xl md:text-[38px] italic font-medium text-[#d4a64a] leading-tight"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                        Create a Life You Love with Your Family!
                    </span>

                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />
                </div>

                <AboutSection
                    aboutImage={aboutImage}
                    teamImages={teamImages}
                />

                <div className="luxury-divider"><span>WHY CHOOSE US</span></div>

                <WhyChooseSection
                    whyChoosePoints={whyChoosePoints}
                />

                <div className="w-full flex items-center justify-center gap-2 sm:gap-5 mt-2 mb-2 sm:my-6 px-4 sm:px-5">
                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />

                    <span
                        className="text-center text-xl sm:text-2xl md:text-[38px] italic font-medium text-[#d4a64a] leading-tight"
                        style={{ fontFamily: '"Cormorant Garamond", serif' }}
                    >
                        Join Our Community!
                    </span>

                    <div className="hidden sm:block flex-1 max-w-[180px] h-px bg-gradient-to-r from-transparent via-[#b88a44] to-transparent" />
                </div>
                <div className="luxury-divider"><span>OUR PRODUCTS</span></div>

                <ProductsCarousel
                    products={products}
                    scroll={scroll}
                    carouselRef={carouselRef}
                    calculateDiscount={calculateDiscount}
                    imageErrors={imageErrors}
                    handleImageError={handleImageError}
                    renderStars={renderStars}
                    addToCart={addToCart}
                    onProductClick={handleProductClick}
                    handleNavigation={handleNavigation}
                />

                <div className="luxury-divider"><span>OPPORTUNITY</span></div>

                <BusinessOpportunity
                    businessHighlights={businessHighlights}
                    businessImage={businessImage}
                    handleNavigation={handleNavigation}
                />

                <div className="luxury-divider"><span>SANYUKT PARIVAAR</span></div>

                {/* Mid CTA Strip */}
                <section className="py-4 px-4">
                    <div className="max-w-5xl mx-auto luxury-box p-4 md:p-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <h3 className="text-sm md:text-lg font-serif font-bold text-[#F5E6C8] text-center md:text-left uppercase tracking-widest">
                            One of India's Fastest Growing <br /> Direct Selling Companies
                        </h3>
                        <button
                            onClick={() => handleNavigation('/contact')}
                            className="luxury-button"
                        >
                            Contact Now
                        </button>
                    </div>
                </section>

                <div className="luxury-divider"><span>Sanyukt Parivaar TRAINING</span></div>

                <TrainingSection
                    supportItems={supportItems}
                    trainingImage={trainingImage}
                    handleNavigation={handleNavigation}
                />

                <NewsSection />

                {/* <ContactFormSection
                    contactForm={contactForm}
                    setContactForm={setContactForm}
                    handleContactSubmit={handleContactSubmit}
                    contactSubmitting={contactSubmitting}
                    contactSuccess={contactSuccess}
                /> */}

                <div className="luxury-divider"><span>OUR VISION</span></div>

                {/* Final Trust Section */}
                <section className="py-8 bg-[#0D0D0D] relative overflow-hidden" >
                    <div className="container mx-auto px-4 text-center relative z-10">
                        <h2 className="text-xl md:text-3xl font-serif font-bold mb-2 text-[#C8A96A] uppercase tracking-widest">
                            Together We Grow, <span className="text-[#F5E6C8]">Together We Prosper</span>
                        </h2>
                        <div className="w-20 h-[1px] bg-[#C8A96A]/40 mx-auto mb-4"></div>
                        <p className="text-xs md:text-sm font-light mb-6 max-w-2xl mx-auto text-[#F5E6C8]/60 uppercase tracking-tight">
                            We don't just build income - we build people, confidence, and a better future.
                        </p>
                        <button
                            onClick={() => handleNavigation('/registation')}
                            className="luxury-button px-10 py-3 text-sm"
                        >
                            Join Sanyukt Parivaar Today
                        </button>
                    </div>
                </section>
            </React.Suspense>

            {/* Payment Method Modal */}
            <PaymentMethodModal
                isOpen={showPaymentModal}
                onClose={() => setShowPaymentModal(false)}
                onSelect={handleFinalPayment}
                amount={Number(amount)}
                walletBalance={walletBalance}
                isProcessing={isProcessingPayment}
            />

            {/* Product Details Modal */}
            <ProductDetailsModal
                isOpen={isProductModalOpen}
                onClose={() => setIsProductModalOpen(false)}
                product={selectedProduct}
                onAddToCart={addToCart}
                onRemoveFromCart={removeFromCart}
                onBuyNow={handleBuyNow}
                isInCart={selectedProduct ? isInCart(selectedProduct._id) : false}
            />

            {/* Cart Notification */}
            {showCartNotification && (
                <div className="fixed bottom-8 right-8 z-50 animate-fadeInUp">
                    <div className="bg-[#C8A96A] text-[#0D0D0D] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4 glass-morphism border border-white/20">
                        <div className="w-8 h-8 rounded-full bg-[#0D0D0D] flex items-center justify-center text-[#C8A96A]">
                            <Check className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-sm tracking-tight">{addedToCartProduct} added to cart!</span>
                    </div>
                </div>
            )}

            {/* Browse Plans Modal */}
            <BrowsePlansModal
                isOpen={showPlansModal}
                onClose={() => setShowPlansModal(false)}
                onSelect={(amount) => setAmount(amount)}
                operator={operator ? operators.find(op => op.id === operator)?.name : ''}
                plans={operator ? rechargePlans[operator] : []}
            />
        </div>
    );
};

export default HomePage;
