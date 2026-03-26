const path = require('path');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Transaction = require('../models/Transaction');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const IncomeHistory = require('../models/IncomeHistory');
const axios = require('axios');
const fs = require('fs');

// Debug helper for Inspay
const logInspayDebug = (data) => {
    const logPath = path.join(__dirname, '../inspay_debug.log');
    const timestamp = new Date().toISOString();

    const safe = { ...data };
    if (typeof safe.response === 'string' && safe.response.length > 2000) {
        safe.response = `${safe.response.slice(0, 2000)}...[truncated]`;
    }

    const entry = `[${timestamp}] ${JSON.stringify(safe, null, 2)}\n\n---\n\n`;
    fs.appendFileSync(logPath, entry);
};

// Initialize Razorpay lazily to prevent server crash if keys are missing
let razorpay;
if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
    razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET
    });
} else {
    console.warn("[PAYMENT] Razorpay keys are missing. Recharge functionality will be disabled.");
}

// @desc    Create a new recharge order
// @route   POST /api/recharge/create-order
// @access  Public (Should be protected in production)
exports.createOrder = async (req, res) => {
    try {
        const { amount, type, operator, rechargeNumber } = req.body;

        if (!razorpay) {
            return res.status(503).json({ message: "Payment service is currently unavailable. Please configure Razorpay keys." });
        }

        if (!amount || !type || !operator || !rechargeNumber || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid amount or missing fields" });
        }

        // Razorpay expects amount in paise (multiply by 100)
        const options = {
            amount: amount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);

        if (!order) {
            return res.status(500).json({ message: "Failed to create order" });
        }

        // Save initial transaction state as pending
        const transaction = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            operator,
            rechargeNumber,
            status: 'pending',
            razorpayOrderId: order.id
        });

        res.status(200).json({
            success: true,
            order,
            transactionId: transaction._id
        });
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Server error", error: error.message || error.toString(), detailed: error });
    }
};

// @desc    Verify Razorpay payment signature
// @route   POST /api/recharge/verify-payment
// @access  Public
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            transactionId
        } = req.body;

        const secret = process.env.RAZORPAY_KEY_SECRET;
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", secret)
            .update(body.toString())
            .digest("hex");

        const isAuthentic = expectedSignature === razorpay_signature;

        if (isAuthentic) {
            // Update transaction status to success
            await Transaction.findByIdAndUpdate(transactionId, {
                status: 'success',
                razorpayPaymentId: razorpay_payment_id,
                transactionId: `TXN${Date.now()}` // Generate a unique TXN ID for your system
            });

            // Send Email notification
            const transaction = await Transaction.findById(transactionId);
            if (transaction) {
                const user = await User.findById(transaction.userId);
                if (user && user.email) {
                    const subject = `Recharge Successful - Sanyukt Parivaar`;
                    const text = `Dear ${user.userName || 'Member'},\n\nYour ${transaction.type} recharge of Rs.${transaction.amount} for ${transaction.rechargeNumber} was successful.\n\nTransaction Details:\nOperator: ${transaction.operator}\nTransaction ID: TXN${Date.now()}\nDate: ${new Date().toLocaleString()}\n\nThank you for choosing Sanyukt Parivaar!`;
                    sendEmail(user.email, subject, text).catch(err => console.error("Email error:", err));

                    // Credit 5% reward to user for recharges only (not donations)
                    if (transaction.type !== 'donation') {
                        await creditRechargeReward(user._id, transaction.amount, transaction.type, transaction.rechargeNumber);
                    }
                }
            }

            res.status(200).json({
                success: true,
                message: "Payment verified successfully"
            });
        } else {
            // Update transaction status to failed
            await Transaction.findByIdAndUpdate(transactionId, {
                status: 'failed'
            });

            res.status(400).json({
                success: false,
                message: "Payment verification failed"
            });
        }
    } catch (error) {
        console.error("Verify payment error:", error);
        res.status(500).json({ message: "Server error", error: error.message, stack: error.stack });
    }
};

// @desc    Recharge using internal wallet balance
// @route   POST /api/recharge/wallet
// @access  Protected
exports.walletRecharge = async (req, res) => {
    try {
        const { amount, type, operator, rechargeNumber } = req.body;

        if (!amount || !type || !operator || !rechargeNumber || Number(amount) <= 0) {
            return res.status(400).json({ message: "Invalid amount or missing fields" });
        }

        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.walletBalance < amount) {
            return res.status(400).json({ message: "Insufficient wallet balance" });
        }

        // Deduct balance
        user.walletBalance -= amount;
        await user.save();

        // Create transaction record
        const transaction = await Transaction.create({
            userId: req.user._id,
            amount,
            type,
            operator,
            rechargeNumber,
            status: 'success',
            paymentMethod: 'wallet',
            transactionId: `TXN_WL_${Date.now()}`
        });

        // Send Email notification
        if (user && user.email) {
            const subject = `Recharge Successful - Sanyukt Parivaar`;
            const text = `Dear ${user.userName || 'Member'},\n\nYour ${type} recharge of Rs.${amount} for ${rechargeNumber} was successful using your wallet balance.\n\nTransaction Details:\nOperator: ${operator}\nTransaction ID: TXN_WL_${Date.now()}\nDate: ${new Date().toLocaleString()}\n\nThank you for choosing Sanyukt Parivaar!`;
            sendEmail(user.email, subject, text).catch(err => console.error("Email error:", err));
        }

        // Credit 5% reward to user
        await creditRechargeReward(req.user._id, amount, type, rechargeNumber);

        res.status(200).json({
            success: true,
            message: "Recharge successful using wallet balance",
            transactionId: transaction._id
        });
    } catch (error) {
        console.error("Wallet recharge error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
// @desc    Get logged in user transactions
// @route   GET /api/recharge/my-transactions
// @access  Protected
exports.getUserTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ userId: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Fetch transactions error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// Helper to map UI operator IDs to Inspay operator codes as per latest specs
const mapOperatorToInspay = (opId) => {
    const mapping = {
        'airtel': 'AT',
        'jio': 'RJ',
        'vi': 'VF',
        'bsnl': 'BS'
    };
    // Return the mapped value or fallback to uppercase if not found
    return mapping[opId.toLowerCase()] || opId.toUpperCase();
};

const creditRechargeReward = async (userId, amount, type, rechargeNumber) => {
    try {
        const rewardAmount = amount * 0.05; // 5% reward
        if (rewardAmount <= 0) return;

        const user = await User.findById(userId);
        if (user) {
            user.walletBalance = (user.walletBalance || 0) + rewardAmount;
            await user.save();

            await IncomeHistory.create({
                userId: user._id,
                amount: rewardAmount,
                type: 'RechargeReward',
                description: `5% reward for ${type} recharge of ₹${amount} for ${rechargeNumber}`
            });
            console.log(`Recharge reward of ₹${rewardAmount} credited to user ${userId}`);
        }
    } catch (error) {
        console.error("Error crediting recharge reward:", error);
        console.error(error.stack);
    }
};

const isInspaySuccess = (resp) => {
    if (!resp) return false;
    return resp.status === 'Success' || resp.status === 'success' || resp.status === 'Pending';
};

const isInvalidOrderIdError = (resp) => {
    const msg = `${resp?.message || ""} ${resp?.opid || ""}`.toLowerCase();
    return msg.includes('invalid orderid') || msg.includes('invalid order id');
};

const getOperatorCandidates = (opIdRaw) => {
    const opId = (opIdRaw || "").toString().toLowerCase();
    const map = {
        airtel: ['AT', 'AIRTEL'],
        jio: ['RJ', 'JIO', 'JO'],
        vi: ['VF', 'VI'],
        bsnl: ['BS', 'BSNL']
    };
    return map[opId] || [opIdRaw?.toString() || ''];
};

const normalizeInspayUrl = (url) => {
    if (!url) return url;
    // Inspay's www host serves a login page with a JS redirect to non-www,
    // which breaks API calls. Always prefer non-www.
    return url.replace('://www.', '://');
};

const isHtmlResponse = (data) => {
    return typeof data === 'string' && data.toLowerCase().includes('<html');
};

// @desc    Perform recharge using Inspay API (POST with Fallback)
// @route   POST /api/recharge
// @access  Protected
exports.inspayRecharge = async (req, res) => {
    try {
        const { mobile, operator: opId, amount } = req.body;
        const querystring = require('querystring');

        // 1. Validation
        if (!mobile || !opId || !amount || Number(amount) <= 0) {
            return res.status(400).json({ success: false, message: "Missing required fields or invalid amount" });
        }

        if (!/^\d{10}$/.test(mobile)) {
            return res.status(400).json({ success: false, message: "Mobile number must be exactly 10 digits" });
        }

        // Inspay endpoints
        // v3 generally accepts form data and often requires orderid
        const apiUrlV3 = normalizeInspayUrl(process.env.INSPAY_V3_API_URL || "http://connect.inspay.in/v3/recharge/api");
        // v2/legacy endpoint sometimes works without orderid (gateway dependent)
        const apiUrlV2 = normalizeInspayUrl(process.env.INSPAY_API_URL || "https://connect.inspay.in/api/recharge/post");
        const token = process.env.INSPAY_TOKEN;
        if (!token) {
            return res.status(503).json({ success: false, message: "Recharge service not configured (missing INSPAY_TOKEN)." });
        }

        if (!process.env.INSPAY_USERNAME) {
            return res.status(503).json({ success: false, message: "Recharge service not configured (missing INSPAY_USERNAME)." });
        }

        const operatorCandidates = Array.from(new Set([
            ...getOperatorCandidates(opId),
            mapOperatorToInspay(opId)
        ].filter(Boolean)));

        const useProxy = process.env.INSPAY_USE_PROXY === 'true';
        const axiosBaseOptions = {
            timeout: 20000,
            ...(useProxy ? {} : { proxy: false })
        };

        // Inspay tends to reject some numeric-only order IDs; try a few safe formats.
        const orderIdCandidates = [
            `ORD${Date.now()}`,
            Date.now().toString(),
            Math.floor(1000000000 + Math.random() * 9000000000).toString()
        ];

        // 2. Retry Logic Matrix
        // We try: 
        // A) username without IP prefix + "number" field (Legacy Successful Pattern)
        // B) username with IP prefix + "number" field
        // C) username with IP prefix + "mobile" field
        
        const rawUsername = process.env.INSPAY_USERNAME.replace(/^IP/, '');
        const ipUsername = "IP" + rawUsername;
        
        const attempts = [
            { username: rawUsername, field: 'number' },
            { username: ipUsername, field: 'number' },
            { username: ipUsername, field: 'mobile' }
        ];

        let lastResponse = null;
        let success = false;
        let usedOrderId = null;
        let usedEndpoint = null;
        let usedOperatorCode = null;

        // ---- Try v3 ----
        for (const attempt of attempts) {
            for (const operatorCode of operatorCandidates) {
                for (const orderid of orderIdCandidates) {
                    const payload = {
                        username: attempt.username,
                        token: token,
                        // Some Inspay variants use `opcode`, others use `operator` even on v3.
                        // Send both with the same value to be resilient.
                        opcode: operatorCode,
                        operator: operatorCode,
                        amount: amount.toString(),
                        orderid: orderid
                    };
                    payload[attempt.field] = mobile;

                    console.log(`REQUEST (v3 Attempt ${attempts.indexOf(attempt) + 1}):`, { ...payload, token: 'REDACTED' });

                    try {
                        const response = await axios.post(apiUrlV3, querystring.stringify(payload), {
                            ...axiosBaseOptions,
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            maxRedirects: 0,
                            validateStatus: () => true
                        });

                        lastResponse = response.data;
                        console.log(`RESPONSE (v3 Attempt ${attempts.indexOf(attempt) + 1}):`, lastResponse);
                        logInspayDebug({
                            endpoint: 'v3',
                            attempt: attempts.indexOf(attempt) + 1,
                            status: response.status,
                            location: response.headers?.location,
                            payload: { ...payload, token: 'REDACTED' },
                            response: lastResponse
                        });

                        if (isHtmlResponse(lastResponse) || response.status === 301 || response.status === 302) {
                            lastResponse = {
                                status: 'Failure',
                                message:
                                    'Inspay API returned a login/HTML page (verify token/username have API access; also check HTTP_PROXY/HTTPS_PROXY).'
                            };
                            break;
                        }

                        if (isInspaySuccess(lastResponse)) {
                            success = true;
                            usedOrderId = orderid;
                            usedEndpoint = 'v3';
                            usedOperatorCode = operatorCode;
                            break;
                        }

                        // If the gateway explicitly says orderid is invalid, try a different format (same attempt/operator).
                        if (isInvalidOrderIdError(lastResponse)) {
                            continue;
                        }

                        // If maintenance window is reported, we stop retrying as it's a server-side window
                        if (lastResponse && lastResponse.opid && lastResponse.opid.includes('Service unavailable')) {
                            break;
                        }

                    } catch (error) {
                        console.log(`ERROR (v3 Attempt ${attempts.indexOf(attempt) + 1}):`, error.message);
                        logInspayDebug({ endpoint: 'v3', attempt: attempts.indexOf(attempt) + 1, error: error.message });
                        lastResponse = { status: 'Failure', message: error.message };
                    }
                }

                if (success) break;
            }

            if (success) break;
        }

        // ---- Fallback to v2/legacy (no orderid) ----
        if (!success) {
            const fields = ['mobile', 'number'];
            const usernames = Array.from(new Set([rawUsername, ipUsername]));
            const requestHeadersBase = {
                'Accept': 'application/json,text/plain,*/*',
                'User-Agent': 'SanyuktProject/1.0'
            };

            for (const username of usernames) {
                for (const operatorCode of operatorCandidates) {
                    for (const field of fields) {
                        const payload = {
                            username,
                            token,
                            operator: operatorCode,
                            amount: amount.toString(),
                        };
                        payload[field] = mobile;

                        console.log(`REQUEST (v2 Fallback):`, { ...payload, token: 'REDACTED' });

                        try {
                            // Try FORM first (most gateways expect form-encoded), then JSON
                            const formResp = await axios.post(apiUrlV2, querystring.stringify(payload), {
                        ...axiosBaseOptions,
                        headers: { ...requestHeadersBase, 'Content-Type': 'application/x-www-form-urlencoded' },
                        maxRedirects: 0,
                        validateStatus: () => true
                    });

                            lastResponse = formResp.data;
                            logInspayDebug({
                                endpoint: 'v2',
                                mode: 'form',
                                status: formResp.status,
                                location: formResp.headers?.location,
                                payload: { ...payload, token: 'REDACTED' },
                                response: lastResponse
                            });

                            if (isHtmlResponse(lastResponse) || formResp.status === 301 || formResp.status === 302) {
                                lastResponse = {
                                    status: 'Failure',
                                    message:
                                        'Inspay API returned a login/HTML page (check INSPAY_API_URL without www, and verify token/username have API access).'
                                };
                            } else if (isInspaySuccess(lastResponse)) {
                                success = true;
                                usedEndpoint = 'v2';
                                usedOperatorCode = operatorCode;
                                break;
                            }

                            const jsonResp = await axios.post(apiUrlV2, payload, {
                                ...axiosBaseOptions,
                                headers: { ...requestHeadersBase, 'Content-Type': 'application/json' },
                                maxRedirects: 0,
                                validateStatus: () => true
                            });

                            lastResponse = jsonResp.data;
                            logInspayDebug({
                                endpoint: 'v2',
                                mode: 'json',
                                status: jsonResp.status,
                                location: jsonResp.headers?.location,
                                payload: { ...payload, token: 'REDACTED' },
                                response: lastResponse
                            });

                            if (isHtmlResponse(lastResponse) || jsonResp.status === 301 || jsonResp.status === 302) {
                                lastResponse = {
                                    status: 'Failure',
                                    message:
                                        'Inspay API returned a login/HTML page (check INSPAY_API_URL without www, and verify token/username have API access).'
                                };
                                continue;
                            }

                            if (isInspaySuccess(lastResponse)) {
                                success = true;
                                usedEndpoint = 'v2';
                                usedOperatorCode = operatorCode;
                                break;
                            }

                        } catch (error) {
                            logInspayDebug({ endpoint: 'v2', error: error.message });
                            lastResponse = { status: 'Failure', message: error.message };
                        }
                    }

                    if (success) break;
                }

                if (success) break;
            }
        }

        // 3. Final Handling
        if (success) {
            const txid = lastResponse.txid || usedOrderId || `TXN_${Date.now()}`;
            
            await Transaction.create({
                userId: req.user?._id || null,
                amount,
                type: 'recharge',
                operator: usedOperatorCode || operatorCandidates[0] || opId,
                rechargeNumber: mobile,
                status: lastResponse.status.toLowerCase(),
                paymentMethod: 'inspay',
                transactionId: txid
            });

            if (req.user && (lastResponse.status === 'Success' || lastResponse.status === 'success')) {
                await creditRechargeReward(req.user._id, amount, 'recharge', mobile);
            }

            return res.status(200).json({ success: true, data: lastResponse });
        } else {
            return res.status(400).json({
                success: false,
                message: lastResponse?.message || lastResponse?.opid || "Recharge Failed",
                error: lastResponse,
                ...(process.env.NODE_ENV !== 'production'
                    ? {
                        debug: {
                            v3: apiUrlV3,
                            v2: apiUrlV2,
                            operatorCandidates,
                            triedOrderIds: orderIdCandidates
                        }
                    }
                    : {})
            });
        }

    } catch (error) {
        console.log("FINAL ERROR:", error.message);
        logInspayDebug({ finalError: error.message });
        return res.status(500).json({ success: false, message: "Server Error", error: error.message });
    }
};
