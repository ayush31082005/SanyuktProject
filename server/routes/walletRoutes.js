const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getDeductionReport,
    getWithdrawalHistory,
    requestWithdrawal,
    getAllTransactions,
    getDailyClosingReport
} = require('../controllers/walletController');

router.get('/deduction-report', protect, getDeductionReport);
router.get('/withdrawal-history', protect, getWithdrawalHistory);
router.post('/withdraw', protect, requestWithdrawal);
router.get('/all-transactions', protect, getAllTransactions);
router.get('/daily-closing', protect, getDailyClosingReport);

module.exports = router;
