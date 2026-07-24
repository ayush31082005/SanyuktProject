const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razorpayOrderId: {
        type: String,
        required: true,
        unique: true
    },
    razorpayPaymentId: {
        type: String
    },
    razorpaySignature: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    },
    currency: {
        type: String,
        default: 'INR'
    },
    status: {
        type: String,
        enum: ['pending', 'captured', 'failed', 'refunded'],
        default: 'pending'
    },
    method: {
        type: String
    },
    description: {
        type: String
    },
    metadata: {
        type: Object // For storing flexibile data like recharge number, operator, etc.
    },
    error: {
        code: String,
        description: String,
        source: String,
        step: String,
        reason: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);
