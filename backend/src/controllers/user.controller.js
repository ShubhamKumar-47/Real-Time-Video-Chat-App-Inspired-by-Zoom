import httpStatus from "http-status";
import { User } from "../models/user.model.js";
import bcrypt, { hash } from "bcrypt"

import crypto from "crypto"
import { Meeting } from "../models/meeting.model.js";
import nodemailer from "nodemailer";
const login = async (req, res) => {

    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Please Provide" })
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User Not Found" })
        }


        let isPasswordCorrect = await bcrypt.compare(password, user.password)

        if (isPasswordCorrect) {
            let token = crypto.randomBytes(20).toString("hex");

            user.token = token;
            await user.save();
            return res.status(httpStatus.OK).json({ token: token })
        } else {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid Username or password" })
        }

    } catch (e) {
        return res.status(500).json({ message: `Something went wrong ${e}` })
    }
}


const register = async (req, res) => {
    const { name, username, password } = req.body;


    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(httpStatus.CONFLICT).json({ message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            name: name,
            username: username,
            password: hashedPassword
        });

        await newUser.save();

        res.status(httpStatus.CREATED).json({ message: "User Registered" })

    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }

}


const getUserHistory = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token" })
        }
        const meetings = await Meeting.find({ user_id: user.username })
        res.json(meetings)
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }
}

const addToHistory = async (req, res) => {
    const { token, meeting_code } = req.body;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.UNAUTHORIZED).json({ message: "Invalid token" })
        }

        const newMeeting = new Meeting({
            user_id: user.username,
            meetingCode: meeting_code
        })

        await newMeeting.save();

        res.status(httpStatus.CREATED).json({ message: "Added code to history" })
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }
}

const getUserInfo = async (req, res) => {
    const { token } = req.query;

    try {
        const user = await User.findOne({ token: token });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" })
        }
        res.status(httpStatus.OK).json({ name: user.name, username: user.username })
    } catch (e) {
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong ${e}` })
    }
}


const forgotPassword = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide your email address" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User with this email does not exist" });
        }

        // Generate 6-digit numeric OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.resetPasswordOtp = otp;
        user.resetPasswordOtpExpires = otpExpires;
        await user.save();

        // Check if Gmail SMTP is configured
        if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
            console.warn("WARNING: EMAIL_USER or EMAIL_PASS environment variables are not configured in backend/.env.");
            console.log(`\n======================================================\n[PASSWORD RESET OTP] For: ${username} | Code: ${otp}\n======================================================\n`);
            return res.status(httpStatus.OK).json({ 
                message: "A 6-digit verification code has been logged to the server console.",
                isMock: true
            });
        }

        // Create nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"EasyMeet Support" <${process.env.EMAIL_USER}>`,
            to: username,
            subject: "EasyMeet Password Reset Verification Code",
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
                    <div style="text-align: center; margin-bottom: 24px;">
                        <h2 style="color: #6D4AFF; font-size: 24px; font-weight: 800; margin: 0;">EasyMeet</h2>
                    </div>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6;">Hello,</p>
                    <p style="font-size: 16px; color: #334155; line-height: 1.6;">We received a request to reset your password. Use the verification code below to verify your identity. This code is valid for 10 minutes.</p>
                    <div style="text-align: center; margin: 32px 0;">
                        <span style="font-size: 32px; font-weight: 800; letter-spacing: 6px; color: #0F172A; background-color: #F8FAFC; border: 1px solid #E2E8F0; padding: 12px 28px; border-radius: 8px; display: inline-block;">
                            ${otp}
                        </span>
                    </div>
                    <p style="font-size: 15px; color: #64748B; line-height: 1.6;">If you didn't request a password reset, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #E2E8F0; margin: 24px 0;" />
                    <p style="font-size: 12px; color: #94A3B8; text-align: center; margin: 0;">EasyMeet &copy; 2026. Secure meetings for modern teams.</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(httpStatus.OK).json({ message: "Verification code sent to your email" });
        } catch (emailError) {
            console.error("Failed to send email via Gmail SMTP:", emailError);
            console.log(`\n======================================================\n[FALLBACK OTP] For: ${username} | Code: ${otp}\n======================================================\n`);
            return res.status(httpStatus.OK).json({ 
                message: "SMTP sending failed. The 6-digit code has been logged to the server console.",
                isMock: true
            });
        }
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

const resetPassword = async (req, res) => {
    const { username, otp, newPassword } = req.body;

    if (!username || !otp || !newPassword) {
        return res.status(httpStatus.BAD_REQUEST).json({ message: "Please provide email, verification code, and new password" });
    }

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: "User not found" });
        }

        if (!user.resetPasswordOtp || user.resetPasswordOtp !== otp) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Invalid verification code" });
        }

        if (Date.now() > user.resetPasswordOtpExpires) {
            return res.status(httpStatus.BAD_REQUEST).json({ message: "Verification code has expired" });
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        // Clear OTP fields
        user.resetPasswordOtp = undefined;
        user.resetPasswordOtpExpires = undefined;
        await user.save();

        return res.status(httpStatus.OK).json({ message: "Password reset successfully. You can now login with your new password." });
    } catch (e) {
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: `Something went wrong: ${e.message}` });
    }
};

export { login, register, getUserHistory, addToHistory, getUserInfo, forgotPassword, resetPassword }