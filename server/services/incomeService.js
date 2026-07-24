const IncomeHistory = require("../models/IncomeHistory");
const User = require("../models/User");
const { creditWallet } = require("./walletService");

const createIncomeEntry = async ({
    userId,
    type,
    amount,
    walletType = "",
    matchedPV = 0,
    sourceUserId = null,
    sourceOrderId = null,
    fromUserId = null,
    level = null,
    description = "",
    remark = "",
    referenceId = "",
    meta = {},
    session = null,
}) => {
    const numericAmount = Number(amount || 0);
    if (numericAmount <= 0) {
        return null;
    }

    const incomeEntry = await IncomeHistory.create(
        [
            {
                userId,
                type,
                amount: numericAmount,
                walletType,
                matchedPV: Number(matchedPV || 0),
                sourceUserId,
                sourceOrderId,
                fromUserId: fromUserId || sourceUserId || null,
                level,
                description,
                remark: remark || description || "",
                referenceId: referenceId || "",
                meta,
            },
        ],
        { session, ordered: true }
    );

    return incomeEntry[0];
};

/**
 * Distributes ₹50 direct income to sponsor if they are qualified (PV >= 0.5)
 */
const distributeDirectIncome = async ({ userId, session = null }) => {
    try {
        const user = await User.findById(userId).session(session);
        if (!user || !user.sponsorId) return null;

        const sponsor = await User.findOne({ memberId: user.sponsorId }).session(session);
        if (!sponsor) return null;

        // Qualification Rule: Sponsor must be active and have at least 0.5 PV
        const isQualified = sponsor.activeStatus && (Number(sponsor.pv) >= 0.5);
        if (!isQualified) return null;

        const directIncomeAmount = 50;

        // Create Income Entry
        const incomeEntry = await createIncomeEntry({
            userId: sponsor._id,
            fromUserId: user._id,
            sourceUserId: user._id,
            amount: directIncomeAmount,
            type: "Direct",
            description: `Direct income from referral: ${user.userName || user.memberId}`,
            session,
        });

        // Credit Wallet
        await creditWallet({
            userId: sponsor._id,
            amount: directIncomeAmount,
            walletType: "e-wallet",
            sourceType: "Direct",
            sourceId: incomeEntry?._id,
            description: `Direct income from referral: ${user.userName || user.memberId}`,
            session,
        });

        // Update sponsor's total direct income
        sponsor.totalDirectIncome = (Number(sponsor.totalDirectIncome) || 0) + directIncomeAmount;
        await sponsor.save({ session });

        return incomeEntry;
    } catch (error) {
        console.error("[IncomeService] Direct income distribution failed:", error);
        return null;
    }
};

module.exports = {
    createIncomeEntry,
    distributeDirectIncome,
};
