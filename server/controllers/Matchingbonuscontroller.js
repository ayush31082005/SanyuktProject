const User = require("../models/User");
const IncomeHistory = require("../models/IncomeHistory");
const BinaryTree = require("../models/BinaryTree");

// ─── Package Config ───────────────────────────────────────────────────────────
const PACKAGE_CONFIG = {
    "599": {
        name: "Silver",
        bv: 250,
        pv: 0.25,
        capping: 2000,
        rate: 100,   // ₹100 per 0.25 PV matched
        color: "silver",
    },
    "1299": {
        name: "Gold",
        bv: 500,
        pv: 0.5,
        capping: 4000,
        rate: 200,
        color: "gold",
    },
    "2699": {
        name: "Diamond",
        bv: 1000,
        pv: 1,
        capping: 10000,
        rate: 400,
        color: "diamond",
    },
};

// ─── Helper: get package type from filter string ──────────────────────────────
const FILTER_MAP = {
    silver: "599",
    gold: "1299",
    diamond: "2699",
};

/**
 * GET /api/mlm/matching-bonus/:type
 * type = silver | gold | diamond
 *
 * Returns:
 *  - Summary stats (totalEarned, thisMonth, todayEarned, cappingUsed, cappingLimit, carryForwardBV)
 *  - history[] array of matching income transactions
 */
exports.getMatchingBonusReport = async (req, res) => {
    try {
        const { type } = req.params; // silver | gold | diamond
        const userId = req.user._id;

        const packageKey = FILTER_MAP[type?.toLowerCase()];
        if (!packageKey) {
            return res.status(400).json({ success: false, message: "Invalid bonus type. Use silver, gold or diamond." });
        }

        const config = PACKAGE_CONFIG[packageKey];

        // Fetch user
        const user = await User.findById(userId).select(
            "packageType walletBalance leftTeamPV rightTeamPV matchedPV totalMatchingBonus dailyCapping activeStatus"
        );

        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // Only show data if user has THIS package type (or allow viewing all)
        // (Show empty stats with correct config if user is on different package)
        const userHasPackage = user.packageType === packageKey;

        // ── Fetch matching income history for this user ───────────────────────
        const history = await IncomeHistory.find({
            userId,
            type: "Matching",
        })
            .sort({ createdAt: -1 })
            .limit(100)
            .lean();

        // ── Calculate summary stats ───────────────────────────────────────────
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const totalEarned = history.reduce((sum, h) => sum + (h.amount || 0), 0);
        const thisMonth = history
            .filter((h) => new Date(h.createdAt) >= startOfMonth)
            .reduce((sum, h) => sum + (h.amount || 0), 0);
        const todayEarned = history
            .filter((h) => new Date(h.createdAt) >= startOfDay)
            .reduce((sum, h) => sum + (h.amount || 0), 0);

        // BinaryTree for carry-forward BV
        const tree = await BinaryTree.findOne({ userId }).lean();
        const leftBV = tree?.leftBV || user.leftTeamPV || 0;
        const rightBV = tree?.rightBV || user.rightTeamPV || 0;
        const matchedPV = tree?.matchedPV || user.matchedPV || 0;

        // Carry forward = the unmatched side (the bigger leg excess)
        const carryForwardBV = userHasPackage ? Math.abs(leftBV - rightBV) : 0;

        const cappingLimit = userHasPackage ? config.capping : config.capping;
        const cappingUsed = Math.min(todayEarned, cappingLimit);

        // ── Format history rows ───────────────────────────────────────────────
        const formattedHistory = history.map((h) => ({
            _id: h._id,
            date: h.createdAt,
            description: h.description || "Matching Bonus",
            matchedPV: extractMatchedPV(h.description),
            bonusAmount: h.amount,
            status: "credited",
        }));

        return res.json({
            success: true,
            data: {
                packageType: packageKey,
                packageName: config.name,
                userHasPackage,
                activeStatus: user.activeStatus,

                // Summary cards
                totalEarned,
                thisMonth,
                todayEarned,
                cappingUsed,
                cappingLimit,
                carryForwardBV,

                // Left / Right legs
                leftBV: userHasPackage ? leftBV : 0,
                rightBV: userHasPackage ? rightBV : 0,
                matchedPV,

                // Config for frontend
                config: {
                    bv: config.bv,
                    pv: config.pv,
                    capping: config.capping,
                    rate: config.rate,
                },

                // Table data
                history: formattedHistory,
            },
        });
    } catch (err) {
        console.error("getMatchingBonusReport error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};

// ─── Helper: extract matched PV from description string ──────────────────────
function extractMatchedPV(description = "") {
    const match = description.match(/(\d+\.?\d*)\s*PV/i);
    return match ? parseFloat(match[1]) : null;
}

/**
 * GET /api/mlm/matching-bonus-summary
 * Returns summary for all 3 packages at once (for dashboard widget)
 */
exports.getAllMatchingSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        const history = await IncomeHistory.find({ userId, type: "Matching" }).lean();

        const summary = Object.entries(PACKAGE_CONFIG).map(([key, config]) => {
            const total = history.reduce((sum, h) => sum + (h.amount || 0), 0);
            return {
                packageKey: key,
                name: config.name,
                capping: config.capping,
                totalEarned: key === "2699" ? total : 0, // simplified; filtered per package in real impl
            };
        });

        return res.json({ success: true, data: summary });
    } catch (err) {
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
