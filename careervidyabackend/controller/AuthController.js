

// third code 
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

import { UAParser } from "ua-parser-js"; // ✅ FIXED IMPORT

/* -------------------- SEND OTP -------------------- */
export const sendOTP = async (req, res) => {
  try {
    const { emailOrPhone, purpose } = req.body;

    if (!emailOrPhone || !purpose) {
      return res
        .status(400)
        .json({ msg: "Email/Phone and purpose are required." });
    }

    if (!["register", "login"].includes(purpose)) {
      return res.status(400).json({ msg: "Invalid purpose value." });
    }

    const existingUser = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    if (purpose === "register" && existingUser) {
      return res
        .status(400)
        .json({ msg: "User already registered. Please log in." });
    }

    if (purpose === "login" && !existingUser) {
      return res
        .status(400)
        .json({ msg: "No account found. Please register first." });
    }

    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await VerificationModel.findOneAndUpdate(
      { emailOrPhone, purpose },
      {
        emailOrPhone,
        codeHash,
        method: emailOrPhone.includes("@") ? "email" : "phone",
        purpose,
        expiresAt,
        verified: false,
        attempts: 0,
      },
      { upsert: true, new: true }
    );

    if (emailOrPhone.includes("@")) {
      await sendToEmail({
        to: emailOrPhone,
        subject: `${otp} is your verification code`,
        html: `
          <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 450px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
            <div style="background-color: #1a73e8; height: 6px;"></div>
            <div style="padding: 30px 20px 10px 20px; text-align: center;">
              <h2 style="color: #202124; margin: 0; font-size: 22px;">Verification Required</h2>
              <p style="color: #5f6368; font-size: 15px; margin-top: 10px;">Enter the verification code below to securely access your account</p>
            </div>
            <div style="padding: 20px; text-align: center;">
              <div style="background-color: #f1f3f4; border-radius: 8px; padding: 25px; display: inline-block; min-width: 200px;">
                <span style="font-size: 40px; font-weight: 800; letter-spacing: 8px; color: #1a73e8;">${otp}</span>
              </div>
              <p style="color: #70757a; font-size: 13px; margin-top: 15px;">This code expires in 5 minutes</p>
            </div>
            <div style="margin: 20px; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
              <p style="margin: 0; font-size: 14px; color: #3c4043; font-weight: 500;">Need Help?</p>
              <p style="margin: 5px 0 10px 0; font-size: 13px; color: #5f6368;">If you did not request this code or face issues logging in, reach out to our support team</p>
              <a href="mailto:info@Careervidya.in" style="color: #1a73e8; text-decoration: none; font-weight: bold; font-size: 14px; border: 1px solid #1a73e8; padding: 5px 15px; border-radius: 4px; display: inline-block;">
                📩 support@careervidya.in
              </a>
            </div>
            <div style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee;">
              <a href="https://careervidya.in" style="text-decoration: none; color: #5f6368; font-size: 13px; font-weight: 600;"> Visit our website Careervidya.in</a>
              <div style="margin-top: 15px; color: #9aa0a6; font-size: 11px;">
                &copy; ${new Date().getFullYear()} Careervidya.in. All rights reserved.
              </div>
            </div>
          </div>
        `,
      });
    } else {
      await sendToSMS(emailOrPhone, `Your OTP is ${otp}`);
    }

    return res.status(200).json({ msg: "OTP sent successfully" });
  } catch (error) {
    console.error("Send OTP Error:", error);
    return res
      .status(500)
      .json({ msg: "Failed to send OTP", error: error.message });
  }
};

/* -------------------- VERIFY OTP -------------------- */
export const verifyOTP = async (req, res) => {
  try {
    const {
      emailOrPhone,
      otp,
      purpose,
      name,
      city,
      state,
      course,
      gender,
      addresses,
      mobileNumber,
      branch,
      description,
      specialization,
      dob,
      subsidyCoupon,
    } = req.body;

    if (!emailOrPhone || !otp || !purpose) {
      return res.status(400).json({
        msg: "Email/Phone, OTP, and purpose are required.",
      });
    }

    const record = await VerificationModel.findOne({ emailOrPhone, purpose });

    if (!record)
      return res.status(400).json({ msg: "No OTP record found. Please resend." });
    if (record.verified)
      return res.status(400).json({ msg: "OTP already used." });
    if (record.expiresAt < new Date())
      return res.status(400).json({ msg: "OTP expired." });

    if (record.attempts >= 5)
      return res
        .status(400)
        .json({ msg: "Too many invalid attempts. Request new OTP." });

    const isValid = hashOTP(otp) === record.codeHash;

    if (!isValid) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ msg: "Invalid OTP" });
    }

    record.verified = true;
    await record.save();

    let student = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    /* ----------- REGISTER ----------- */
    if (purpose === "register") {
      if (student)
        return res
          .status(400)
          .json({ msg: "User already exists. Please login." });

      student = await Student.create({
        name,
        email: emailOrPhone.includes("@") ? emailOrPhone : undefined,
        mobileNumber:
          mobileNumber || (!emailOrPhone.includes("@") ? emailOrPhone : undefined),
        city,
        state,
        course,
        gender,
        addresses,
        branch,
        description,
        specialization,
        dob,
        subsidyCoupon,
      });

      // ------------------- SEND THANK YOU EMAIL -------------------
      if (student.email) {
        await sendToEmail({
          to: student.email,
          subject: "Welcome to Careervidya!",
          html: `
            <div style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 450px; margin: 0 auto; border: 1px solid #eeeeee; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
              <div style="background-color: #1a73e8; height: 6px;"></div>
              <div style="padding: 30px 20px; text-align: center;">
                <h2 style="color: #202124; margin: 0; font-size: 22px;">Thank You for Registering!</h2>
                <p style="color: #5f6368; font-size: 15px; margin-top: 10px;">Hi ${student.name}, welcome to Careervidya! We're excited to have you on board.</p>
              </div>
              <div style="padding: 20px; text-align: center;">
                <p style="color: #70757a; font-size: 14px;">You can now explore courses, updates, and personalized content from your account.</p>
                <a href="https://careervidya.in" style="display: inline-block; margin-top: 15px; background-color: #1a73e8; color: white; text-decoration: none; padding: 10px 20px; border-radius: 6px; font-weight: bold;">Visit Website</a>
              </div>
              <div style="padding: 20px; text-align: center; border-top: 1px solid #eeeeee; font-size: 12px; color: #9aa0a6;">
                &copy; ${new Date().getFullYear()} Careervidya.in. All rights reserved.
              </div>
            </div>
          `,
        });
      }
    }

    if (purpose === "login" && !student)
      return res
        .status(400)
        .json({ msg: "User not found. Please register first." });

    /* ---------------- ADMIN LOGIN EMAIL NOTIFICATION ---------------- */
    if (student.role === "admin") {
      // Get IP
      const ip =
        req.headers["x-forwarded-for"] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress;

      // Parse user agent
      const parser = new UAParser(req.headers["user-agent"]);
      const ua = parser.getResult();

      const browser = `${ua.browser.name || "Unknown"} ${
        ua.browser.version || ""
      }`;
      const os = `${ua.os.name || "Unknown"} ${ua.os.version || ""}`;
      const device = ua.device.model || "Desktop / Laptop";

      // Fetch location using ipapi.co
      let locationData = {};
      try {
        const fetchRes = await fetch(`https://ipapi.co/${ip}/json/`);
        locationData = await fetchRes.json();
      } catch (err) {
        locationData = { city: "Unknown", region: "Unknown", country: "Unknown" };
      }

      await sendToEmail({
        to: process.env.ADMIN_NOTIFICATION_EMAIL,
        subject: "Admin Logged In",
        html: `
          <h2>Admin Login Alert</h2>
          <p><b>Admin Email:</b> ${student.email}</p>
          <p><b>Login Time:</b> ${new Date().toLocaleString()}</p>
          <h3>System Details</h3>
          <p><b>IP Address:</b> ${ip}</p>
          <p><b>Browser:</b> ${browser}</p>
          <p><b>Operating System:</b> ${os}</p>
          <p><b>Device:</b> ${device}</p>
          <h3>Location</h3>
          <p><b>City:</b> ${locationData.city}</p>
          <p><b>Region:</b> ${locationData.region}</p>
          <p><b>Country:</b> ${locationData.country_name}</p>
        `,
      });
    }

    /* ------------------- GENERATE TOKENS ------------------- */
    const accessToken = generateAccessToken(student._id);
    const refreshToken = generateRefreshToken(student._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      msg: purpose === "register" ? "Registration successful" : "Login successful",
      accessToken,
      student: {
        id: student._id,
        name: student.name,
        email: student.email,
        mobileNumber: student.mobileNumber,
        city: student.city,
        state: student.state,
        course: student.course,
        gender: student.gender,
        addresses: student.addresses,
        branch: student.branch,
        description: student.description,
        specialization: student.specialization,
        dob: student.dob,
        subsidyCoupon: student.subsidyCoupon,
        role: student.role,
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({
      msg: "OTP verification failed",
      error: error.message,
    });
  }
};

/* -------------------- REFRESH ACCESS TOKEN -------------------- */
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

    const newAccessToken = generateAccessToken(decoded.id);

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({
      msg: "Refresh token invalid or expired",
      error: error.message,
    });
  }
};

/* -------------------- LOGOUT -------------------- */
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken");
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ msg: "Logout failed", error: err.message });
  }
};

/* -------------------- GET ALL STUDENTS -------------------- */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: { $ne: "admin" } }).select(
      "-password"
    );

    if (students.length === 0)
      return res.status(404).json({ msg: "No students found" });

    return res.status(200).json({ count: students.length, students });
  } catch (error) {
    console.error("Get All Students Error:", error);
    return res
      .status(500)
      .json({ msg: "Failed to fetch students", error: error.message });
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

    if (!id) {
      return res.status(400).json({ msg: "Student ID is required" });
    }

    const student = await Student.findById(id).select("-password");

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    return res.status(200).json({ student });
  } catch (error) {
    console.error("Get Student By ID Error:", error);
    
    // Check if the error is due to an invalid MongoDB ObjectId format
    if (error.kind === "ObjectId") {
      return res.status(400).json({ msg: "Invalid Student ID format" });
    }

    return res
      .status(500)
      .json({ msg: "Failed to fetch student", error: error.message });
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


