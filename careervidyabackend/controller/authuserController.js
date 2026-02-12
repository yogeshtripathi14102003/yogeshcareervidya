import User from "../models/user/User.js";
import twilioPkg from "twilio";

const twilio = twilioPkg(
  process.env.TWILIO_SID,
  process.env.TWILIO_AUTH_TOKEN
);

// Generate 6 digit OTP
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// 1. SEND OTP
export const sendOTP = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;
    const otp = generateOTP();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    await twilio.messages.create({
      body: `Your Career Vidya verification code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: emailOrPhone
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
      // otp ❌ production me mat bhejna
    });
  } catch (error) {
    res.status(500).json({
      message: "Error sending OTP",
      error: error.message
    });
  }
};

// 2. VERIFY OTP & REGISTER
export const verifyOTPAndRegister = async (req, res) => {
  try {
    const { otp, ...userData } = req.body;

    const newUser = new User({
      ...userData,
      isVerified: true
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: newUser
    });
  } catch (error) {
    res.status(400).json({
      message: "Registration failed",
      error: error.message
    });
  }
};

// 3. LOGIN
export const login = async (req, res) => {
  try {
    const { emailOrPhone } = req.body;

    const user = await User.findOne({
      $or: [
        { email: emailOrPhone },
        { mobileNumber: emailOrPhone }
      ]
    });

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Login error" });
  }
};

// 4. GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch users"
    });
  }
};
