const User = require("../models/User");
const Repurchase = require("../models/Repurchase");
const IncomeHistory = require("../models/IncomeHistory");

/**
 * Handle Repurchase and Distribute Generation Income
 */
exports.handleRepurchase = async (req, res) => {
    try {
        const { amount, bv } = req.body;
        const userId = req.user._id;

        // 1. Create Repurchase record
        const repurchase = await Repurchase.create({
            userId,
            amount,
            bv
        });

        // 2. Update user's own BV (optional, depending on if it counts for them)
        const user = await User.findById(userId);
        user.bv += bv;
        await user.save();

        // 3. Distribute Generation Income up 20 Levels
        // We use a simplified model: 10% of BV distributed among 20 levels or similar
        // Let's use a percentage based distribution:
        // Level 1: 5%, Level 2: 3%, Level 3-20: 0.5% each (simplified example)
        // User said: "Calculate generation income based on team size and BV multiplication"
        
        const generationPercentages = [
            0.15, 0.10, 0.05, 0.025, 0.025, 0.025, 0.025, 0.0125, 0.0125, 0.0125,
            0.0125, 0.0125, 0.0075, 0.0075, 0.0075, 0.0075, 0.0075, 0.0075, 0.0075, 0.0075
        ];

        let currentId = user.parentId;
        for (let i = 0; i < generationPercentages.length; i++) {
            if (!currentId) break;

            const parent = await User.findById(currentId);
            if (!parent) break;

            const income = bv * generationPercentages[i];
            if (income > 0) {
                parent.walletBalance += income;
                await parent.save();

                await IncomeHistory.create({
                    userId: parent._id,
                    fromUserId: userId,
                    amount: income,
                    type: "Generation",
                    level: i + 1,
                    description: `Repurchase generation income from Level ${i + 1}`
                });
            }

            currentId = parent.parentId;
        }

        res.json({ message: "Repurchase successful and income distributed", repurchase });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
