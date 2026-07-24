const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/Payment');
const User = require('../models/User');

// Initialize Razorpay
const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

/**
 * @desc    Create Razorpay Order
 * @route   POST /api/payments/create-order
 */
exports.createOrder = async (req, res) => {
    try {
        const { amount, currency = 'INR', description, metadata } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({ success: false, message: 'Invalid amount' });
        }

        const options = {
            amount: Math.round(amount * 100), // convert to paisa
            currency,
            receipt: `receipt_${Date.now()}`,
            notes: metadata || {}
        };

        const order = await razorpay.orders.create(options);

        // Save pending payment to DB
        await Payment.create({
            userId: req.user._id,
            razorpayOrderId: order.id,
            amount,
            currency,
            description,
            metadata,
            status: 'pending'
        });

        res.status(200).json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID
        });
    } catch (error) {
        console.error('Razorpay Create Order Error:', error);
        res.status(500).json({ success: false, message: 'Failed to create order', error: error.message });
    }
};

/**
 * @desc    Verify Razorpay Payment Signature
 * @route   POST /api/payments/verify
 */
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update payment in DB
            const payment = await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                {
                    razorpayPaymentId: razorpay_payment_id,
                    razorpaySignature: razorpay_signature,
                    status: 'captured'
                },
                { new: true }
            );

            if (!payment) {
                return res.status(404).json({ success: false, message: 'Payment record not found' });
            }

            res.status(200).json({
                success: true,
                message: 'Payment verified successfully',
                payment
            });
        } else {
            // Mark as failed
            await Payment.findOneAndUpdate(
                { razorpayOrderId: razorpay_order_id },
                { status: 'failed' }
            );
            res.status(400).json({ success: false, message: 'Invalid payment signature' });
        }
    } catch (error) {
        console.error('Razorpay Verification Error:', error);
        res.status(500).json({ success: false, message: 'Verification failed', error: error.message });
    }
};

/**
 * @desc    Razorpay Webhook Handler
 * @route   POST /api/payments/webhook
 */
exports.handleWebhook = async (req, res) => {
    try {
        const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

        if (!secret) {
            console.error('Webhook Error: RAZORPAY_WEBHOOK_SECRET is not defined in environment variables.');
            return res.status(400).json({ status: 'error', message: 'Webhook secret not configured' });
        }

        const signature = req.headers['x-razorpay-signature'];

        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (expectedSignature === signature) {
            const event = req.body.event;
            const payload = req.body.payload.payment.entity;

            console.log(`Webhook Event: ${event}`, payload.id);

            // Handle specific events
            if (event === 'payment.captured') {
                await Payment.findOneAndUpdate(
                    { razorpayOrderId: payload.order_id },
                    {
                        razorpayPaymentId: payload.id,
                        status: 'captured',
                        method: payload.method
                    }
                );
            } else if (event === 'payment.failed') {
                await Payment.findOneAndUpdate(
                    { razorpayOrderId: payload.order_id },
                    {
                        razorpayPaymentId: payload.id,
                        status: 'failed',
                        error: payload.error
                    }
                );
            }

            res.status(200).json({ status: 'ok' });
        } else {
            res.status(400).json({ status: 'invalid signature' });
        }
    } catch (error) {
        console.error('Webhook Error:', error);
        res.status(500).json({ status: 'error', message: error.message });
    }
};
