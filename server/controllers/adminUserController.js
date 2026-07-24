const User = require("../models/User");
const { propagateBinaryVolume, syncBinaryTreeSnapshot } = require("../services/binaryService");
const { applyMatchingBonusesForUser } = require("../services/matchingService");
const mlmController = require("./mlmController");

const SILVER_PACKAGE = {
    packageType: "599",
    pv: 0.25,
    bv: 250,
    dailyCapping: 2000,
};

const applyAdminActivationDefaults = (user) => {
    user.activeStatus = true;
    user.packageType = SILVER_PACKAGE.packageType;
    user.pv = SILVER_PACKAGE.pv;
    user.bv = SILVER_PACKAGE.bv;
    user.dailyCapping = SILVER_PACKAGE.dailyCapping;
};

const applyAdminInactivationDefaults = (user) => {
    user.activeStatus = false;
    user.packageType = "none";
    user.dailyCapping = 0;
};

const reconcileAdminActivation = async (user, wasActive) => {
    if (!user || wasActive || !user.activeStatus) {
        return;
    }

    await syncBinaryTreeSnapshot({ user });

    const affectedUplineIds = await propagateBinaryVolume({
        sourceUserId: user._id,
        pv: Number(user.pv || 0),
        bv: Number(user.bv || 0),
    });

    for (const affectedUserId of affectedUplineIds) {
        await applyMatchingBonusesForUser({
            userId: affectedUserId,
            sourceUserId: user._id,
        });

        const affectedUser = await User.findById(affectedUserId);
        if (affectedUser) {
            await mlmController.checkAndUpgradeRank(affectedUser);
        }
    }
};

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [users, total] = await Promise.all([
            User.find()
                .select("-password")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            User.countDocuments()
        ]);

        res.json({
            success: true,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            limit,
            count: users.length,
            users: users
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// GET single user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.json({
            success: true,
            user: user
        });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

// DELETE user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "User deleted successfully"
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
            success: false,
            message: "Delete failed"
        });
    }
};

// UPDATE user
exports.updateUser = async (req, res) => {
    try {
        const { name, userName, email, role, status, activeStatus, phone, kycStatus, kycMessage } = req.body;

        // Check if user exists
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Check if email is already taken by another user
        if (email && email !== user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser && existingUser._id.toString() !== req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: "Email already in use"
                });
            }
        }

        const wasActive = Boolean(user.activeStatus);

        // Update fields
        user.userName = userName || name || user.userName || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.phone = phone || user.phone;
        if (typeof activeStatus === "boolean") {
            if (activeStatus) {
                applyAdminActivationDefaults(user);
            } else {
                applyAdminInactivationDefaults(user);
            }
        } else if (status) {
            if (status === "active") {
                applyAdminActivationDefaults(user);
            } else {
                applyAdminInactivationDefaults(user);
            }
        }
        if (kycStatus) user.kycStatus = kycStatus;
        if (kycMessage !== undefined) user.kycMessage = kycMessage;

        await user.save();
        await reconcileAdminActivation(user, wasActive);

        // Return updated user without password
        const updatedUser = await User.findById(req.params.id).select("-password");

        res.json({
            success: true,
            message: "User updated successfully",
            user: updatedUser
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
};

// UPDATE user status
exports.updateUserStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!['active', 'inactive', 'pending'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status value"
            });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const wasActive = Boolean(user.activeStatus);

        if (status === 'active') {
            applyAdminActivationDefaults(user);
        } else {
            applyAdminInactivationDefaults(user);
        }
        await user.save();
        await reconcileAdminActivation(user, wasActive);

        res.json({
            success: true,
            message: "User status updated successfully",
            user: {
                id: user._id,
                activeStatus: user.activeStatus,
                status: user.activeStatus ? 'active' : 'inactive',
                packageType: user.packageType,
                pv: user.pv,
                bv: user.bv,
            }
        });
    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
};

// UPDATE user role
exports.updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;

        if (!['user', 'admin', 'premium'].includes(role)) {
            return res.status(400).json({
                success: false,
                message: "Invalid role value"
            });
        }

        // Prevent last admin from changing role
        if (req.user.role === 'admin' && role !== 'admin') {
            const adminCount = await User.countDocuments({ role: 'admin' });
            if (adminCount === 1 && req.user._id.toString() === req.params.id) {
                return res.status(400).json({
                    success: false,
                    message: "Cannot change role of the last admin"
                });
            }
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        user.role = role;
        await user.save();

        res.json({
            success: true,
            message: "User role updated successfully",
            user: {
                id: user._id,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({
            success: false,
            message: "Update failed"
        });
    }
};

