import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ChevronLeft, CreditCard, Truck, Shield, MapPin, Phone, Mail, User, Package, IndianRupee } from 'lucide-react';
import api, { API_URL } from '../api';
import { Snackbar, Alert, Fade } from '@mui/material';

const CheckoutPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const product = location.state?.product;

    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Form states
    const [shippingInfo, setShippingInfo] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });

    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [discount, setDiscount] = useState(0);

    // Agar product नहीं है तो redirect
    useEffect(() => {
        if (!product) {
            navigate('/products');
        }
    }, [product, navigate]);

    if (!product) return null;

    // Calculate totals
    const subtotal = product.price || 0;
    const shipping = subtotal > 500 ? 0 : 40;
    const tax = subtotal * 0.18; // 18% GST
    const total = subtotal + shipping + tax - discount;

    const handleInputChange = (e) => {
        setShippingInfo({
            ...shippingInfo,
            [e.target.name]: e.target.value
        });
    };

    const handleApplyCoupon = () => {
        // Demo coupons
        if (couponCode === 'WELCOME10') {
            setDiscount(subtotal * 0.1);
            setCouponApplied(true);
            setSnackbar({ open: true, message: 'Coupon applied successfully! 10% discount', severity: 'success' });
        } else if (couponCode === 'SAVE20') {
            setDiscount(subtotal * 0.2);
            setCouponApplied(true);
            setSnackbar({ open: true, message: 'Coupon applied successfully! 20% discount', severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Invalid coupon code', severity: 'error' });
        }
    };

    const loadRazorpayScript = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const handlePlaceOrder = async () => {
        // Validate form
        if (!shippingInfo.fullName || !shippingInfo.email || !shippingInfo.phone ||
            !shippingInfo.address || !shippingInfo.city || !shippingInfo.state || !shippingInfo.pincode) {
            setSnackbar({ open: true, message: 'Please fill all shipping details', severity: 'warning' });
            return;
        }

        if (paymentMethod === 'cod') {
            await createOrder();
        } else {
            await handleRazorpayPayment();
        }
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);
        try {
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                setSnackbar({ open: true, message: 'Razorpay SDK failed to load. Are you online?', severity: 'error' });
                setLoading(false);
                return;
            }

            // 1. Create order on server
            const { data: rpOrder } = await api.post('/orders/razorpay-order', { amount: total });

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SROihejcCAh8Vm', // Fallback to provided key if env not set
                amount: rpOrder.amount,
                currency: rpOrder.currency,
                name: "Sanyukt Parivaar",
                description: `Order for ${product.name}`,
                image: `${API_URL}/logo.png`,
                order_id: rpOrder.id,
                handler: async (response) => {
                    // 2. Verification and Order Finalization
                    await createOrder({
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    });
                },
                prefill: {
                    name: shippingInfo.fullName,
                    email: shippingInfo.email,
                    contact: shippingInfo.phone,
                },
                theme: {
                    color: "#0A7A2F",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response) {
                setSnackbar({ open: true, message: 'Payment Failed: ' + response.error.description, severity: 'error' });
                setLoading(false);
            });
            rzp.open();
        } catch (error) {
            console.error('Razorpay payment error:', error);
            setSnackbar({ open: true, message: 'Error initiating payment. Please try again.', severity: 'error' });
            setLoading(false);
        }
    };

    const createOrder = async (paymentDetails = {}) => {
        setLoading(true);
        try {
            const orderData = {
                product: product._id,
                quantity: 1,
                shippingInfo,
                paymentMethod,
                subtotal,
                shipping,
                tax,
                discount,
                total,
                orderDate: new Date(),
                ...paymentDetails
            };

            // API call to place order
            const response = await api.post('/orders', orderData);

            setOrderDetails(response.data);
            setOrderPlaced(true);
            setCurrentStep(3);
        } catch (error) {
            console.error('Error placing order:', error?.response || error);
            const message = error?.response?.data?.message;
            setSnackbar({
                open: true,
                message: message || 'Error placing order. Please try again.',
                severity: 'error'
            });
        } finally {
            setLoading(false);
        }
    };

    // Order Success Page
    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-3xl mx-auto px-4">
                    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>

                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
                        <p className="text-gray-600 mb-6">Thank you for your purchase</p>

                        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
                            <h3 className="font-semibold text-gray-800 mb-4">Order Details</h3>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-medium text-gray-800">#{orderDetails?._id?.slice(-8)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Product:</span>
                                    <span className="font-medium text-gray-800">{product.name}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Quantity:</span>
                                    <span className="font-medium text-gray-800">1</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="font-medium text-[#0A7A2F]">₹{total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-medium text-gray-800 uppercase">
                                        {paymentMethod}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Estimated Delivery:</span>
                                    <span className="font-medium text-gray-800">
                                        {new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <button
                                onClick={() => navigate('/products')}
                                className="flex-1 px-6 py-3 bg-[#0A7A2F] text-white rounded-xl font-semibold hover:bg-[#2F7A32] transition-all"
                            >
                                Continue Shopping
                            </button>
                            <button
                                onClick={() => navigate(`/order-details/${orderDetails?._id}`)}
                                className="flex-1 px-6 py-3 border border-[#0A7A2F] text-[#0A7A2F] rounded-xl font-semibold hover:bg-[#0A7A2F] hover:text-white transition-all"
                            >
                                Track Order Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-[#0A7A2F] mb-6 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5" />
                    Back to Products
                </button>

                {/* Checkout Steps */}
                <div className="flex items-center justify-center mb-8">
                    <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-[#0A7A2F] text-white' : 'bg-gray-200 text-gray-600'
                            }`}>1</div>
                        <div className={`w-24 h-1 ${currentStep >= 2 ? 'bg-[#0A7A2F]' : 'bg-gray-200'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-[#0A7A2F] text-white' : 'bg-gray-200 text-gray-600'
                            }`}>2</div>
                        <div className={`w-24 h-1 ${currentStep >= 3 ? 'bg-[#0A7A2F]' : 'bg-gray-200'}`}></div>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${currentStep >= 3 ? 'bg-[#0A7A2F] text-white' : 'bg-gray-200 text-gray-600'
                            }`}>3</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Forms */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Information */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-[#0A7A2F]" />
                                Shipping Information
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={shippingInfo.fullName}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="Enter your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={shippingInfo.email}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="Enter your email"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={shippingInfo.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="Enter your phone number"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Landmark (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        name="landmark"
                                        value={shippingInfo.landmark}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="Nearby landmark"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address *
                                    </label>
                                    <textarea
                                        name="address"
                                        value={shippingInfo.address}
                                        onChange={handleInputChange}
                                        rows="3"
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="Enter your complete address"
                                    ></textarea>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        City *
                                    </label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={shippingInfo.city}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="City"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        State *
                                    </label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={shippingInfo.state}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="State"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Pincode *
                                    </label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={shippingInfo.pincode}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        placeholder="Pincode"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-[#0A7A2F]" />
                                Payment Method
                            </h2>

                            <div className="space-y-3">
                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-[#0A7A2F] bg-green-50' : 'border-gray-100'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#0A7A2F]"
                                    />
                                    <span className="ml-3 flex items-center gap-2">
                                        <IndianRupee className="w-5 h-5 text-gray-600" />
                                        <span className="font-semibold text-gray-800">Cash on Delivery</span>
                                    </span>
                                </label>

                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-[#0A7A2F] bg-green-50' : 'border-gray-100'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="upi"
                                        checked={paymentMethod === 'upi'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#0A7A2F]"
                                    />
                                    <span className="ml-3 flex items-center gap-2">
                                        <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[10px] text-white font-bold">UPI</div>
                                        <span className="font-semibold text-gray-800">UPI (GPay/PhonePe/Paytm)</span>
                                    </span>
                                </label>

                                <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#0A7A2F] bg-green-50' : 'border-gray-100'}`}>
                                    <input
                                        type="radio"
                                        name="payment"
                                        value="card"
                                        checked={paymentMethod === 'card'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-[#0A7A2F]"
                                    />
                                    <span className="ml-3 flex items-center gap-2">
                                        <CreditCard className="w-5 h-5 text-gray-600" />
                                        <span className="font-semibold text-gray-800">Debit / Credit Card</span>
                                    </span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>

                            {/* Product Details */}
                            <div className="flex gap-3 mb-4 pb-4 border-b">
                                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={product.image.startsWith('http') ? product.image : `${API_URL}${product.image.startsWith('/uploads') ? product.image : '/uploads/' + product.image}`}
                                            alt={product.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-2xl">
                                            📦
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 text-sm line-clamp-2">
                                        {product.name}
                                    </h3>
                                    <p className="text-[#0A7A2F] font-bold mt-1">
                                        ₹{product.price?.toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            {/* Price Breakdown */}
                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span className="font-medium">₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Shipping</span>
                                    <span className="font-medium">
                                        {shipping === 0 ? 'Free' : `₹${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">GST (18%)</span>
                                    <span className="font-medium">₹{tax.toFixed(2)}</span>
                                </div>
                                {discount > 0 && (
                                    <div className="flex justify-between text-sm text-green-600">
                                        <span>Discount</span>
                                        <span>-₹{discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="border-t pt-2 mt-2">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span className="text-[#0A7A2F] text-xl">₹{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Coupon Code */}
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0A7A2F] focus:border-transparent"
                                        disabled={couponApplied}
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        disabled={couponApplied}
                                        className={`px-4 py-2 bg-[#0A7A2F] text-white rounded-lg text-sm font-medium hover:bg-[#2F7A32] transition-all ${couponApplied ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className={`w-full py-3 bg-gradient-to-r from-[#0A7A2F] to-[#2F7A32] text-white rounded-xl font-bold hover:shadow-lg transition-all ${loading ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>

                            {/* Trust Badges */}
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                                    <div className="flex items-center gap-1">
                                        <Shield className="w-4 h-4" />
                                        Secure Payment
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Truck className="w-4 h-4" />
                                        Free Shipping
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Package className="w-4 h-4" />
                                        7 Days Return
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Global Notifications Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                TransitionComponent={Fade}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    variant="filled"
                    sx={{
                        width: '100%',
                        borderRadius: '16px',
                        fontWeight: 800,
                        boxShadow: '0 8px 30px rgba(247,147,30,0.25)',
                        bgcolor: '#f7931e',
                        color: 'white',
                        '& .MuiAlert-icon': { color: 'white' }
                    }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default CheckoutPage;
