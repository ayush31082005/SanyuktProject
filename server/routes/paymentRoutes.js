const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware'); // Assuming this exists based on common patterns

// Public Webhook - No Auth
router.post('/webhook', paymentController.handleWebhook);

// Protected Routes
router.post('/create-order', protect, paymentController.createOrder);
router.post('/verify', protect, paymentController.verifyPayment);

module.exports = router;
