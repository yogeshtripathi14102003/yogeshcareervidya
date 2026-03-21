



import mongoose from "mongoose";
import Student from "../models/user/AuthModel.js";
import VerificationModel from "../models/user/verificationModel.js";

import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utilities/jwt.js";

import { generateOTP, hashOTP } from "../utilities/otpUtils.js";
import { sendToEmail } from "../utilities/sendEmail.js";
import { sendToSMS } from "../utilities/sendSMS.js";

// ✅ Import templates
import { getOTPTemplate, getWelcomeTemplate } from "../utilities/emailTemplates.js";

/* -------------------- SEND OTP -------------------- */
export const sendOTP = async (req, res) => {
  try {
    const { emailOrPhone, purpose } = req.body;

    if (!emailOrPhone || !purpose || !["register", "login"].includes(purpose)) {
      return res.status(400).json({ msg: "Valid Email/Phone and purpose ('register' or 'login') are required." });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail ? { email: emailOrPhone } : { mobileNumber: emailOrPhone };
    const existingUser = await Student.findOne(query).select("_id").lean();

    if (purpose === "register" && existingUser) {
      return res.status(400).json({ msg: "User already registered. Please log in." });
    }
    if (purpose === "login" && !existingUser) {
      return res.status(400).json({ msg: "No account found. Please register first." });
    }

    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    // Upsert strategy to prevent spam and maintain clean records
    await VerificationModel.findOneAndUpdate(
      { emailOrPhone, purpose },
      { 
        codeHash, 
        expiresAt, 
        verified: false, 
        attempts: 0, 
        method: isEmail ? "email" : "phone" 
      },
      { upsert: true, new: true }
    );

    if (isEmail) {
      await sendToEmail({
        to: emailOrPhone,
        subject: `${otp} is your verification code`,
        html: getOTPTemplate(otp),
      });
    } else {
      await sendToSMS(emailOrPhone, `Your OTP is ${otp}. Valid for 5 mins.`);
    }

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res.status(500).json({ msg: "Internal Server Error" });
  }
};

/* -------------------- VERIFY OTP -------------------- */
export const verifyOTP = async (req, res) => {
  try {
    const { emailOrPhone, otp, purpose, ...userData } = req.body;

    if (!emailOrPhone || !otp || !purpose) {
      return res.status(400).json({ msg: "Missing required fields." });
    }

    const record = await VerificationModel.findOne({ emailOrPhone, purpose });

    if (!record) return res.status(400).json({ msg: "OTP not requested or expired." });
    if (record.verified) return res.status(400).json({ msg: "OTP already verified." });
    if (record.expiresAt < new Date()) return res.status(400).json({ msg: "OTP expired." });
    if (record.attempts >= 5) return res.status(429).json({ msg: "Too many attempts. Try again later." });

    // Validate OTP
    if (hashOTP(otp) !== record.codeHash) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    // Success - Mark as verified or Delete
    await VerificationModel.deleteOne({ _id: record._id }); 

    let student = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    if (purpose === "register") {
      if (student) return res.status(400).json({ msg: "User already exists." });

      student = await Student.create({
        ...userData,
        email: emailOrPhone.includes("@") ? emailOrPhone : userData.email,
        mobileNumber: !emailOrPhone.includes("@") ? emailOrPhone : userData.mobileNumber,
      });

      if (student.email) {
        sendToEmail({
          to: student.email,
          subject: "Welcome to Career Vidya!",
          html: getWelcomeTemplate(student.name),
        }).catch(err => console.error("Welcome Email Error:", err));
      }
    }

    if (!student) return res.status(404).json({ msg: "Account not found." });

    // JWT Generation
    const accessToken = generateAccessToken(student._id);
    const refreshToken = generateRefreshToken(student._id);
// Backend verifyOTP logic
const isProd = process.env.NODE_ENV === "production";

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: isProd, // Local (http) pe false rahega, Live (https) pe true
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  ...(isProd && { domain: ".careervidya.in" })
});

    // Sanitized student object
    const studentData = student.toObject();
    delete studentData.password;
    delete studentData.__v;

    return res.status(200).json({
      msg: purpose === "register" ? "Registration successful" : "Login successful",
      accessToken,
      student: studentData
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ msg: "Verification failed" });
  }
};

// ... Baki controllers (refreshAccessToken, logout, getAllStudents, etc.) as it is rahenge
export const refreshAccessToken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({ msg: "Refresh token missing" });
    }

    const decoded = verifyRefreshToken(token);

    if (!decoded?.id) {
      return res.status(401).json({ msg: "Invalid refresh token" });
    }

    // Fetch user to check role and activity
    const user = await Student.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // --- INACTIVITY CHECK FOR ADMIN/SUBADMIN ---
    if (user.role === "admin" || user.role === "subadmin") {
      const now = Date.now();
      const lastSeen = user.lastActivity ? new Date(user.lastActivity).getTime() : 0;
      const INACTIVITY_LIMIT = 15 * 60 * 1000;

      if (lastSeen && (now - lastSeen > INACTIVITY_LIMIT)) {
        // Session expire ho chuka hai, cookie saaf karo
        res.clearCookie("refreshToken");
        user.lastActivity = null;
        await user.save();
        return res.status(401).json({ msg: "Session expired due to inactivity. Please login again." });
      }
      
      // Note: Hum yahan lastActivity update nahi kar rahe kyunki refresh token 
      // background call hai. Activity sirf main API calls (authMiddleware) se update honi chahiye.
    }

    // Generate new Access Token
    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({
      msg: "Refresh token invalid or expired",
    });
  }
};

/* -------------------- LOGOUT -------------------- */
export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

    // Cookie ko clear karte waqt vahi options dena zaruri hai jo set karte waqt diye the
    res.clearCookie("refreshToken", {
      path: "/",
      httpOnly: true,
      secure: isProd,
      sameSite: "lax",
      ...(isProd && { domain: ".careervidya.in" }) // Yeh line sabse important hai
    });

    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ msg: "Logout failed", error: err.message });
  }
};

/* -------------------- GET ALL STUDENTS -------------------- */
export const getAllStudents = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20); // Max limit cap for security
    const skip = (page - 1) * limit;

    // Parallel execution for speed
    const [students, total] = await Promise.all([
      Student.find({ role: { $ne: "admin" } })
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ role: { $ne: "admin" } })
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: students.length
      },
      students
    });
  } catch (error) {
    return res.status(500).json({ msg: "Server Error" });
  }
};

/* -------------------- DELETE STUDENT -------------------- */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) return res.status(400).json({ msg: "Student ID is required" });

    const deletedStudent = await Student.findByIdAndDelete(id);

    if (!deletedStudent)
      return res.status(404).json({ msg: "Student not found" });

    return res.status(200).json({ msg: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    return res
      .status(500)
      .json({ msg: "Failed to delete student", error: error.message });
  }
};

/* -------------------- GET STUDENT BY ID -------------------- */
export const getStudentById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ msg: "Invalid Student ID format" });
    }

    const student = await Student.findById(id).select("-password -__v").lean();

    if (!student) return res.status(404).json({ msg: "Student not found" });

    return res.status(200).json({ success: true, student });
  } catch (error) {
    return res.status(500).json({ msg: "Server error", error: error.message });
  }
};

export const getLoggedInStudent = (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    res.status(200).json({
      success: true,
      student: req.user,
    });
  } catch (error) {
    console.error("getLoggedInStudent error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};






// 1. CREATE / UPDATE ACCESS (Assign Permissions)
export const assignAccess = async (req, res) => {
  try {
    const { email, permissions } = req.body;

    if (!email || !Array.isArray(permissions)) {
      return res.status(400).json({ msg: "Valid Email and Permissions array required" });
    }

    const user = await Student.findOneAndUpdate(
      { email },
      { 
        $set: { 
          role: "subadmin", 
          permissions: permissions 
        } 
      },
      { new: true, runValidators: true }
    ).select("email role permissions").lean();

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ msg: "Access updated successfully", user });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to assign access" });
  }
};

// 2. READ (Get Profile & Permissions for Logged-in User)
export const getAdminProfile = async (req, res) => {
  try {
    // req.user.id auth middleware se aana chahiye
    const user = await Student.findById(req.user.id)
      .select("email role permissions")
      .lean();

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({
      success: true,
      role: user.role, 
      permissions: user.permissions || []
    });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching profile" });
  }
};

// 3. READ ALL (Get All Sub-Admins List for Super Admin)
export const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Student.find({ role: "subadmin" })
      .select("email role permissions")
      .lean();
    
    return res.status(200).json(subAdmins);
  } catch (error) {
    return res.status(500).json({ msg: "Failed to fetch sub-admins" });
  }
};

// 4. DELETE / REVOKE (Remove All Access & Reset Role)
export const revokeAccess = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Student.findOneAndUpdate(
      { email },
      { 
        $set: { 
          role: "student", // Normal user role
          permissions: [] // Khali array
        } 
      },
      { new: true }
    ).select("email role");

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({ msg: "All permissions removed", user });
  } catch (error) {
    return res.status(500).json({ msg: "Failed to revoke access" });
  }
};
 

