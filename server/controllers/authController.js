const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");

const generateOTP = () =>
    Math.floor(100000 + Math.random() * 900000).toString();


// ================= REGISTER =================
exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });

        if (user && user.isVerified)
            return res.status(400).json({ message: "Email already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();

        if (!user) {
            // Generate a unique member ID
            const generateMemberId = () => 'SPRL' + Math.floor(1000 + Math.random() * 9000).toString();
            let newMemberId = generateMemberId();
            while (await User.findOne({ memberId: newMemberId })) {
                newMemberId = generateMemberId();
            }

            user = new User({
                ...req.body,
                memberId: newMemberId,
                password: hashedPassword,
                otp,
                otpExpire: Date.now() + 5 * 60 * 1000
            });
        } else {
            user.password = hashedPassword;
            user.otp = otp;
            user.otpExpire = Date.now() + 5 * 60 * 1000;
        }

        await user.save();

        await sendEmail(email, "Registration OTP", `Your OTP is ${otp}`);

        res.json({ message: "OTP Sent to Email" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


// ================= VERIFY OTP =================
exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpire < Date.now())
        return res.status(400).json({ message: "Invalid or Expired OTP" });

    user.isVerified = true;
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Account Verified Successfully" });
};


// ================= LOGIN =================
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        let user;
        if (email.match(/^[0-9a-fA-F]{24}$/)) {
            user = await User.findOne({ $or: [{ email: email }, { _id: email }] });
        } else if (email.toUpperCase().startsWith('SPRL') || email.toUpperCase().startsWith('SP')) {
             user = await User.findOne({ memberId: email.toUpperCase() });
        } else {
            user = await User.findOne({ email: email });
        }

        if (!user)
            return res.status(400).json({ message: "User not found" });

        if (!user.isVerified)
            return res.status(400).json({ message: "Verify Email First" });

        const match = await bcrypt.compare(password, user.password);

        if (!match)
            return res.status(400).json({ message: "Wrong Password" });

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Login Success",
            token,
            user   // 🔥 FULL USER OBJECT
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= FORGOT PASSWORD =================
exports.forgotPassword = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user)
        return res.status(400).json({ message: "User not found" });

    const otp = generateOTP();

    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000;

    await user.save();

    await sendEmail(email, "Reset Password OTP", `Your OTP is ${otp}`);

    res.json({ message: "OTP Sent for Reset" });
};

// ================= RESEND OTP =================
exports.resendOtp = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user)
            return res.status(400).json({ message: "User not found" });

        if (user.isVerified)
            return res.status(400).json({ message: "User already verified" });

        const otp = generateOTP();

        user.otp = otp;
        user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes

        await user.save();

        await sendEmail(email, "Resend OTP", `Your new OTP is ${otp}`);

        res.json({ message: "New OTP Sent Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};



// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.otp !== otp || user.otpExpire < Date.now())
        return res.status(400).json({ message: "Invalid or Expired OTP" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.otp = undefined;
    user.otpExpire = undefined;

    await user.save();

    res.json({ message: "Password Reset Successful" });
};


// ================= CREATE ADMIN =================
exports.createAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existing = await User.findOne({ email });
        if (existing)
            return res.status(400).json({ message: "Admin already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = new User({
            email,
            password: hashedPassword,
            role: "admin",
            isVerified: true
        });

        await admin.save();

        res.json({ message: "Admin Created Successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server Error" });
    }
};


// ================= PROFILE =================
exports.profile = async (req, res) => {
    try {
        let user = req.user;
        if (!user.memberId) {
            const generateMemberId = () => 'SPRL' + Math.floor(1000 + Math.random() * 9000).toString();
            let newMemberId = generateMemberId();
            while (await User.findOne({ memberId: newMemberId })) {
                newMemberId = generateMemberId();
            }
            user.memberId = newMemberId;
            await user.save();
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// ================= UPDATE PROFILE =================
exports.updateProfile = async (req, res) => {
    try {
        const allowedFields = [
            'userName', 'fatherName', 'mobile', 'gender', 'position',
            'shippingAddress', 'state', 'district', 'assemblyArea',
            'block', 'villageCouncil', 'village', 'profileImage'
        ];

        const updates = {};
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) updates[field] = req.body[field];
        });

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: false }
        ).select('-password -otp -otpExpire');

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ================= SUBMIT KYC =================
exports.submitKyc = async (req, res) => {
    try {
        const { aadharNumber, panNumber, bankDetails, kycDocuments } = req.body;

        const updates = {
            kycStatus: 'Submitted',
            aadharNumber,
            panNumber,
            bankDetails,
            kycDocuments
        };

        const user = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updates },
            { new: true, runValidators: false }
        ).select('-password -otp -otpExpire');

        res.json({ message: 'KYC submitted successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// ================= GET SPONSOR NAME =================
exports.getSponsorName = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({ 
            $or: [
                { memberId: id.toUpperCase() },
                { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }
            ]
        }).select("userName");

        if (!user) {
            return res.status(404).json({ message: "Sponsor not found" });
        }

        res.json({ name: user.userName });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
