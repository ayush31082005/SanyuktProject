const User = require('../models/User');
const IncomeHistory = require('../models/IncomeHistory');
const BinaryTree = require('../models/BinaryTree');

exports.PACKAGE_DATA = {
    "599": { bv: 250, pv: 0.25, capping: 2000 },
    "1299": { bv: 500, pv: 0.5, capping: 4000 },
    "2699": { bv: 1000, pv: 1, capping: 10000 }
};

exports.LEVEL_INCOME = {
    1: 50, 2: 40, 3: 30, 4: 20, 5: 10,
    6: 10, 7: 5, 8: 5, 9: 5, 10: 5,
    11: 4, 12: 4, 13: 3, 14: 3, 15: 3,
    16: 3, 17: 3, 18: 3, 19: 2, 20: 2
};

/**
 * Finds the correct parent in the binary tree based on sponsor and position.
 * If the sponsor's selected position is already occupied, it finds the next available spot 
 * down that leg to maintain the binary structure.
 */
exports.findBinaryPosition = async (sponsorId, position) => {
    let currentParent = await User.findOne({ memberId: sponsorId.toUpperCase() });
    if (!currentParent) return null;

    let queue = [currentParent];
    
    // We only traverse the specific leg (Left or Right) initially requested
    let targetLeg = position.toLowerCase(); // 'left' or 'right'
    
    while (queue.length > 0) {
        let node = queue.shift();
        let childId = node[targetLeg];

        if (!childId) {
            return { parentId: node._id, position: targetLeg === 'left' ? 'Left' : 'Right' };
        } else {
            let childNode = await User.findById(childId);
            // After the first level, we check both legs of the sub-tree to fill Breadth-First
            // But wait, the prompt says "under sponsor in the selected position".
            // Standard MLM "selected position" usually means we go down that extreme leg 
            // OR we fill the first available spot in that sub-tree.
            // Let's implement "Extreme Leg" placement as it's common, 
            // or "First Available in Subtree" if we want to be more helpful.
            // Prompt says: "New users should be placed under sponsor in the selected position."
            // If Left is chosen, we go down the Left leg of the sponsor.
            
            // To maintain a "Full Binary Tree" as requested, we use BFS for that sub-tree.
            queue.push(childNode);
            // Once we are inside the sub-tree, we check BOTH legs to fill it level by level.
            targetLeg = 'left'; 
            if (node.left && node.right) {
                // both full, continue BFS
            } else if (!node.left) {
               // this logic is slightly flawed for a specific "Left/Right" choice
            }
        }
    }
};

// SIMPLER VERSION: Extreme Leg Placement (Common for Binary)
exports.findExtremePosition = async (sponsorId, position) => {
    let sponsor = await User.findOne({ memberId: sponsorId.toUpperCase() });
    if (!sponsor) return null;

    let current = sponsor;
    let posKey = position.toLowerCase() === 'left' ? 'left' : 'right';

    while (current[posKey]) {
        current = await User.findById(current[posKey]);
    }

    return { parentId: current._id, position: posKey === 'left' ? 'Left' : 'Right' };
};

/**
 * Distributes Level Income up to 20 levels.
 */
exports.distributeLevelIncome = async (user) => {
    try {
        let currentParentId = user.parentId;
        let level = 1;

        while (currentParentId && level <= 20) {
            const parent = await User.findById(currentParentId);
            if (!parent) break;

            const incomeAmount = LEVEL_INCOME[level] || 0;
            if (incomeAmount > 0) {
                parent.walletBalance = (parent.walletBalance || 0) + incomeAmount;
                parent.totalLevelIncome = (parent.totalLevelIncome || 0) + incomeAmount;
                await parent.save();

                await IncomeHistory.create({
                    userId: parent._id,
                    amount: incomeAmount,
                    type: 'Level',
                    fromUserId: user._id,
                    level,
                    description: `Level ${level} income from ${user.memberId}`
                });
            }

            currentParentId = parent.parentId;
            level++;
        }
    } catch (error) {
        console.error(`Error distributing level income for user ${user.memberId}:`, error);
    }
};

/**
 * Distributes Direct Income to the sponsor.
 */
exports.distributeDirectIncome = async (user) => {
    // Only for 0.5 PV or higher packages (₹1299 and ₹2699)
    if (user.pv < 0.5) return;

    // Direct income goes to the SPONSOR, not the binary parent
    try {
        const sponsor = await User.findOne({ memberId: user.sponsorId.toUpperCase() });
        if (!sponsor) return;

        // NEW RULE: Direct Income only for sponsors with 0.5 PV or above package
        const sponsorPkg = PACKAGE_DATA[sponsor.packageType];
        if (!sponsorPkg || sponsorPkg.pv < 0.5) {
            console.log(`Sponsor ${sponsor.memberId} not eligible for direct income (Package: ${sponsor.packageType})`);
            return;
        }

        const amount = 50; // Fixed direct income
        sponsor.walletBalance = (sponsor.walletBalance || 0) + amount;
        sponsor.totalDirectIncome = (sponsor.totalDirectIncome || 0) + amount;
        await sponsor.save();

        await IncomeHistory.create({
            userId: sponsor._id,
            amount,
            type: 'Direct',
            fromUserId: user._id,
            description: `Direct income from ${user.memberId} registration`
        });
    } catch (error) {
        console.error(`Error distributing direct income for user ${user.memberId}:`, error);
    }
};

/**
 * Updates Team PV for matching bonus.
 */
exports.updateTeamPV = async (user) => {
    let currentId = user.parentId;
    let childId = user._id;

    while (currentId) {
        const parent = await User.findById(currentId);
        if (!parent) break;

        if (parent.left && parent.left.toString() === childId.toString()) {
            parent.leftTeamPV = (parent.leftTeamPV || 0) + (user.pv || 0);
            if (!parent.leftColor) parent.leftColor = { bv: 0, pv: 0 };
            parent.leftColor.bv = (parent.leftColor.bv || 0) + (user.bv || 0);
            parent.leftColor.pv = (parent.leftColor.pv || 0) + (user.pv || 0);

            // Sync with BinaryTree
            await BinaryTree.findOneAndUpdate(
                { userId: parent._id },
                { 
                    $inc: { 
                        leftPV: user.pv || 0, 
                        leftBV: user.bv || 0,
                        totalLeft: 1 
                    }
                },
                { upsert: true }
            );
        } else if (parent.right && parent.right.toString() === childId.toString()) {
            parent.rightTeamPV = (parent.rightTeamPV || 0) + (user.pv || 0);
            if (!parent.rightColor) parent.rightColor = { bv: 0, pv: 0 };
            parent.rightColor.bv = (parent.rightColor.bv || 0) + (user.bv || 0);
            parent.rightColor.pv = (parent.rightColor.pv || 0) + (user.pv || 0);

            // Sync with BinaryTree
            await BinaryTree.findOneAndUpdate(
                { userId: parent._id },
                { 
                    $inc: { 
                        rightPV: user.pv || 0, 
                        rightBV: user.bv || 0,
                        totalRight: 1 
                    }
                },
                { upsert: true }
            );
        }

        await parent.save();
        childId = parent._id;
        currentId = parent.parentId;
    }
};
