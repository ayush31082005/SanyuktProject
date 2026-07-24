import { useState, useCallback } from 'react';
import api from '../api';
import toast from 'react-hot-toast';

const useRazorpay = () => {
    const [isProcessing, setIsProcessing] = useState(false);

    const loadScript = (src) => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const initiatePayment = useCallback(async (paymentData) => {
        setIsProcessing(true);
        const toastId = toast.loading("Initializing secure payment...");

        try {
            // 1. Load Razorpay script
            const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
            if (!res) {
                toast.error("Razorpay SDK failed to load. Are you online?", { id: toastId });
                setIsProcessing(false);
                return;
            }

            // 2. Create Order on Backend
            const { data } = await api.post('/payments/create-order', paymentData);
            
            if (!data.success) {
                toast.error(data.message || "Failed to initiate order", { id: toastId });
                setIsProcessing(false);
                return;
            }

            const { order, key } = data;
            toast.dismiss(toastId);

            // 3. Open Razorpay Checkout
            return new Promise((resolve, reject) => {
                const options = {
                    key: key,
                    amount: order.amount,
                    currency: order.currency,
                    name: "Sanyukt Parivaar",
                    description: paymentData.description || "Digital Transaction",
                    order_id: order.id,
                    handler: async (response) => {
                        try {
                            const verifyToast = toast.loading("Verifying payment...");
                            const { data: verifyData } = await api.post('/payments/verify', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verifyData.success) {
                                toast.success("Payment successful!", { id: verifyToast });
                                resolve({ success: true, payment: verifyData.payment });
                            } else {
                                toast.error("Verification failed", { id: verifyToast });
                                resolve({ success: false, message: "Verification failed" });
                            }
                        } catch (err) {
                            console.error("Verification Error:", err);
                            toast.error("Error verifying payment", { id: verifyToast });
                            reject(err);
                        } finally {
                            setIsProcessing(false);
                        }
                    },
                    prefill: paymentData.prefill || {},
                    theme: {
                        color: "#C8A96A" // Matching your design theme
                    },
                    modal: {
                        ondismiss: () => {
                            setIsProcessing(false);
                            resolve({ success: false, message: "Payment cancelled" });
                        }
                    }
                };

                const rzp = new window.Razorpay(options);
                rzp.on('payment.failed', function (response) {
                    toast.error(`Payment Failed: ${response.error.description}`);
                    setIsProcessing(false);
                    resolve({ success: false, error: response.error });
                });
                rzp.open();
            });

        } catch (error) {
            console.error("Initiate Payment Error:", error);
            toast.error(error?.response?.data?.message || "Something went wrong", { id: toastId });
            setIsProcessing(false);
            return { success: false, error };
        }
    }, []);

    return { initiatePayment, isProcessing };
};

export default useRazorpay;
