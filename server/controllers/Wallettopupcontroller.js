const Razorpay = require('razorpay');
const crypto = require('crypto');
const User = require('../models/User');
const IncomeHistory = require('../models/IncomeHistory');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
    key_secret: process.env.RAZORPAY_KEY_SECRET || 'your_secret_here',
});

const isMocking = () =>
    !process.env.RAZORPAY_KEY_ID ||
    process.env.RAZORPAY_KEY_ID === 'rzp_test_your_key_here';

/**
 * POST /api/wallet/topup/create-order
 * Body: { amount: Number }   — amount in ₹ (min ₹100)
 */
exports.createTopupOrder = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || isNaN(amount) || amount < 100) {
            return res.status(400).json({ success: false, message: 'Minimum top-up amount ₹100 hai.' });
        }
        if (amount > 50000) {
            return res.status(400).json({ success: false, message: 'Maximum top-up amount ₹50,000 hai.' });
        }

        let order;
        if (isMocking()) {
            order = {
                id: `order_mock_${Date.now()}`,
                amount: amount * 100,
                currency: 'INR',
                receipt: `topup_${Date.now()}`,
                status: 'created',
            };
        } else {
            // Receipt ID max length is 40 chars. 
            // ObjectID (24) + "_" (1) + timestamp (approx 13) = 38. 
            // "topup_" prefix was pushing it over 40.
            order = await razorpay.orders.create({
                amount: amount * 100,
                currency: 'INR',
                receipt: `${req.user._id}_${Date.now()}`, 
                notes: { userId: req.user._id.toString(), purpose: 'wallet_topup' },
            });
        }

        return res.json({
            success: true,
            order,
            key: process.env.RAZORPAY_KEY_ID || 'rzp_test_your_key_here',
            user: {
                name: req.user.userName || 'User',
                email: req.user.email,
                mobile: req.user.mobile || '',
            },
        });
    } catch (err) {
        console.error('createTopupOrder error complete details:', err);
        return res.status(500).json({ 
            success: false, 
            message: 'Order create karne mein error aaya.',
            error: err.message // Send error message temporarily to help user debug
        });
    }
};

/**
 * POST /api/wallet/topup/verify
 * Body: { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount }
 */
exports.verifyTopup = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount } = req.body;

        if (!amount || amount < 100) {
            return res.status(400).json({ success: false, message: 'Invalid amount.' });
        }

        // Signature verify
        let isAuthentic = false;
        if (isMocking()) {
            isAuthentic = true;
        } else {
            const body = razorpay_order_id + '|' + razorpay_payment_id;
            const expectedSig = crypto
                .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
                .update(body)
                .digest('hex');
            isAuthentic = expectedSig === razorpay_signature;
        }

        if (!isAuthentic) {
            return res.status(400).json({ success: false, message: 'Payment verification failed. Fraudulent request.' });
        }

        // Credit wallet
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found.' });

        user.walletBalance = (user.walletBalance || 0) + Number(amount);
        await user.save();

        // Record in IncomeHistory as "Direct" (credit entry)
        await IncomeHistory.create({
            userId: user._id,
            fromUserId: user._id,
            amount: Number(amount),
            type: 'Direct',
            description: `Wallet top-up via Razorpay — ₹${amount} (Txn: ${razorpay_payment_id || 'mock'})`,
        });

        return res.json({
            success: true,
            message: `₹${Number(amount).toLocaleString('en-IN')} wallet mein credit ho gaye!`,
            walletBalance: user.walletBalance,
        });
    } catch (err) {
        console.error('verifyTopup error:', err);
        return res.status(500).json({ success: false, message: 'Payment verify karne mein error aaya.' });
    }
};

/**
 * GET /api/wallet/topup/balance
 */
exports.getWalletBalance = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('walletBalance userName memberId');
        return res.json({ success: true, walletBalance: user.walletBalance || 0 });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error.' });
    }
};
