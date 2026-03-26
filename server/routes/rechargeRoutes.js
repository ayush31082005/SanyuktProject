const express = require('express');
const router = express.Router();
const { createOrder, verifyPayment, getUserTransactions, walletRecharge, inspayRecharge } = require('../controllers/rechargeController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-order', protect, createOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/wallet', protect, walletRecharge);
router.get('/my-transactions', protect, getUserTransactions);
router.post('/', protect, inspayRecharge);

module.exports = router;
