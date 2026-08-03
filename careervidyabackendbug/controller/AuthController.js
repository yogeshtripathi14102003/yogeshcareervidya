


import mongoose from "mongoose";
import Student from "../models/user/AuthModel.js";
import Counselor from "../models/counselor/Counselor.js";
import Admission from "../models/Admin/Admission.js";
import VerificationModel from "../models/user/verificationModel.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utilities/jwt.js";
import { generateOTP, hashOTP } from "../utilities/otpUtils.js";
import { getOTPTemplate, getWelcomeTemplate } from "../utilities/emailTemplates.js";
import { notificationQueue } from "../utilities/emailQueue.js";
import { findAssignedLeadByContact } from "../utilities/leadMatching.js";
import RealtimeNotification from "../models/counselor/RealtimeNotification.js";
import { getSecurityConfig } from "../utilities/securityConfig.js";
import { notifyCounselor } from "../utilities/notifyCounselor.js";
import Lead from "../models/counselor/Lead.js";
import { autoAssignLead, getAssignmentConfig } from "../utilities/leadAssignmentEngine.js";
import { ADMITTED_STATUS, LOST_STATUSES } from "../constant/leadStatus.js";

const isProd = process.env.NODE_ENV === "production";

const refreshCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  ...(isProd && { domain: ".careervidya.in" }),
};

const clearCookieOptions = {
  httpOnly: true,
  secure: isProd,
  sameSite: "lax",
  path: "/",
  ...(isProd && { domain: ".careervidya.in" }),
};

/* -------------------- SEND OTP -------------------- */
export const sendOTP = async (req, res) => {
  try {
    const { emailOrPhone, purpose } = req.body;

    if (!emailOrPhone || !purpose || !["register", "login"].includes(purpose)) {
      return res.status(400).json({
        msg: "Valid Email/Phone and purpose ('register' or 'login') are required.",
      });
    }

    const isEmail = emailOrPhone.includes("@");
    const query = isEmail
      ? { email: emailOrPhone }
      : { mobileNumber: emailOrPhone };

    const existingUser = await Student.findOne(query).select("_id").lean();

    if (purpose === "register" && existingUser) {
      return res.status(400).json({ msg: "User already registered. Please log in." });
    }
    if (purpose === "login" && !existingUser) {
      return res.status(400).json({ msg: "No account found. Please register first." });
    }

    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await VerificationModel.findOneAndUpdate(
      { emailOrPhone, purpose },
      {
        codeHash,
        expiresAt,
        verified: false,
        attempts: 0,
        method: isEmail ? "email" : "phone",
      },
      { upsert: true, new: true }
    );

    // Queue the notification — respond immediately, don't await email/SMS
    if (isEmail) {
      await notificationQueue.add("send-otp-email", {
        type: "email",
        to: emailOrPhone,
        subject: `${otp} is your verification code`,
        html: getOTPTemplate(otp),
      });
    } else {
      await notificationQueue.add("send-otp-sms", {
        type: "sms",
        to: emailOrPhone,
        smsText: `Your OTP is ${otp}. Valid for 5 mins.`,
      });
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

    if (!record)
      return res.status(400).json({ msg: "OTP not requested or expired." });
    if (record.verified)
      return res.status(400).json({ msg: "OTP already verified." });
    if (record.expiresAt < new Date())
      return res.status(400).json({ msg: "OTP expired." });
    if (record.attempts >= 5)
      return res.status(429).json({ msg: "Too many attempts. Request a new OTP." });

    if (hashOTP(otp) !== record.codeHash) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ msg: "Invalid OTP." });
    }

    // Valid — delete the record immediately so it can't be reused
    await VerificationModel.deleteOne({ _id: record._id });

    let student = await Student.findOne({
      $or: [{ email: emailOrPhone }, { mobileNumber: emailOrPhone }],
    });

    if (purpose === "register") {
      if (student)
        return res.status(400).json({ msg: "User already exists." });

      // SECURITY: never spread the raw request body into the document.
      // Fields like role/permissions/isSystemAdmin must never be settable
      // by the person registering — only these profile fields are.
      const {
        name,
        state,
        city,
        addresses,
        course,
        branch,
        specialization,
        dob,
        subsidyCoupon,
        description,
        gender,
      } = userData;

      student = await Student.create({
        name,
        state,
        city,
        addresses,
        course,
        branch,
        specialization,
        dob,
        subsidyCoupon,
        description,
        gender,
        email: emailOrPhone.includes("@") ? emailOrPhone : userData.email,
        mobileNumber: !emailOrPhone.includes("@") ? emailOrPhone : userData.mobileNumber,
        // role intentionally omitted — schema default ("user") always applies here
      });

      // Welcome email — fire and forget via queue
      if (student.email) {
        await notificationQueue.add("welcome-email", {
          type: "email",
          to: student.email,
          subject: "Welcome to Career Vidya!",
          html: getWelcomeTemplate(student.name),
        }).catch((err) => console.error("Welcome email queue error:", err));
      }

      // Also create the CRM lead this registration represents — best
      // effort, must never block/break registration itself.
      createLeadFromRegistration(student).catch((err) =>
        console.error("createLeadFromRegistration failed:", err.message)
      );
    }

    if (!student)
      return res.status(404).json({ msg: "Account not found." });

    const accessToken = generateAccessToken(student._id, student.role);
    const refreshToken = generateRefreshToken(student._id, student.role);

    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    const studentData = student.toObject();
    delete studentData.password;
    delete studentData.__v;

    // Module 6: "Existing Lead Logged In" — if this student's email/phone
    // matches a Lead already assigned to a counselor, let them know.
    if (purpose === "login") {
      findAssignedLeadByContact({ email: student.email, phone: student.mobileNumber })
        .then((lead) => {
          if (!lead) return;
          notifyCounselor(lead.assignedTo, {
            type: "lead_logged_in",
            title: "Lead Logged In",
            message: `${lead.name || student.name}${lead.course ? ` (${lead.course})` : ""} just logged into their account.`,
            lead: lead._id,
          });
        })
        .catch((err) => console.error("Lead-match on login failed:", err.message));
    }

    return res.status(200).json({
      msg: purpose === "register" ? "Registration successful" : "Login successful",
      accessToken,
      student: studentData,
    });

  } catch (error) {
    console.error("Verify OTP Error:", error);
    return res.status(500).json({ msg: "Verification failed" });
  }
};

const createLeadFromRegistration = async (student) => {
  // Dedup: don't create a second open lead if this person already has one
  // (e.g. they'd already submitted a contact-form inquiry before signing up).
  const existing = await Lead.findOne({
    $or: [
      ...(student.email ? [{ email: student.email }] : []),
      ...(student.mobileNumber ? [{ phone: student.mobileNumber }] : []),
    ],
    status: { $nin: [ADMITTED_STATUS, ...LOST_STATUSES] },
  });
  if (existing) return;

  let assignedTo = null;
  let assignedToName = "";

  const config = await getAssignmentConfig();
  if (config.autoAssignOnCreate) {
    const assignment = await autoAssignLead({
      state: student.state,
      city: student.city,
      course: student.course,
      universityName: student.branch,
      leadScore: 0,
    });
    if (assignment) {
      assignedTo = assignment.counselorId;
      assignedToName = assignment.counselorName;
    }
  }

  const lead = await Lead.create({
    name: student.name,
    phone: student.mobileNumber,
    email: student.email,
    course: student.course,
    city: student.city,
    state: student.state,
    universityName: student.branch,
    source: "Website Registration",
    status: "New",
    assignedTo,
    assignedToName,
    assignedAt: assignedTo ? new Date() : null,
  });

  if (assignedTo) {
    notifyCounselor(assignedTo, {
      type: "lead_assigned",
      title: "New Lead Assigned",
      message: `${student.name} just registered on the website and has been assigned to you.`,
      lead: lead._id,
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

    if (decoded.role === "counselor") {
      const counselor = await Counselor.findById(decoded.id).select("status lastActivity").lean();
      if (!counselor) {
        return res.status(401).json({ msg: "User not found" });
      }
      if (counselor.status && counselor.status !== "active") {
        res.clearCookie("refreshToken", clearCookieOptions);
        return res.status(403).json({ msg: "Counselor account is not active" });
      }

      const securityConfig = await getSecurityConfig();
      const now = Date.now();
      const lastSeen = counselor.lastActivity ? new Date(counselor.lastActivity).getTime() : 0;

      if (lastSeen && now - lastSeen > securityConfig.inactivityLimitMinutes * 60 * 1000) {
        await Counselor.updateOne({ _id: counselor._id }, { $set: { lastActivity: null } });
        res.clearCookie("refreshToken", clearCookieOptions);
        return res.status(401).json({
          msg: "Session expired due to inactivity. Please login again.",
          code: "INACTIVITY_LOGOUT",
        });
      }

      const newAccessToken = generateAccessToken(counselor._id, "counselor");
      return res.status(200).json({ accessToken: newAccessToken });
    }

    const user = await Student.findById(decoded.id).select("role lastActivity").lean();
    if (!user) {
      return res.status(401).json({ msg: "User not found" });
    }

    // Inactivity check for admin/subadmin
    if (user.role === "admin" || user.role === "subadmin") {
      const now = Date.now();
      const lastSeen = user.lastActivity ? new Date(user.lastActivity).getTime() : 0;
      const securityConfig = await getSecurityConfig();

      if (lastSeen && now - lastSeen > securityConfig.inactivityLimitMinutes * 60 * 1000) {
        await Student.updateOne({ _id: user._id }, { $set: { lastActivity: null } });
        res.clearCookie("refreshToken", clearCookieOptions);
        return res.status(401).json({
          msg: "Session expired due to inactivity. Please login again.",
          code: "INACTIVITY_LOGOUT",
        });
      }
    }

    const newAccessToken = generateAccessToken(user._id, user.role);
    return res.status(200).json({ accessToken: newAccessToken });

  } catch (error) {
    console.error("Refresh Token Error:", error);
    return res.status(401).json({ msg: "Refresh token invalid or expired" });
  }
};

/* -------------------- LOGOUT -------------------- */
export const logout = async (req, res) => {
  try {
    res.clearCookie("refreshToken", clearCookieOptions);
    return res.status(200).json({ msg: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    return res.status(500).json({ msg: "Logout failed", error: err.message });
  }
};

/* -------------------- GET ALL STUDENTS -------------------- */
export const getAllStudents = async (req, res) => {
  try {
    const page  = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const skip  = (page - 1) * limit;

    const [students, total] = await Promise.all([
      Student.find({ role: { $ne: "admin" } })
        .select("-password -__v")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Student.countDocuments({ role: { $ne: "admin" } }),
    ]);

    return res.status(200).json({
      success: true,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: students.length,
      },
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);
    return res.status(500).json({ msg: "Server Error" });
  }
};

/* -------------------- DELETE STUDENT -------------------- */
export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ msg: "Student ID is required" });

    const deletedStudent = await Student.findByIdAndDelete(id);
    if (!deletedStudent) return res.status(404).json({ msg: "Student not found" });

    return res.status(200).json({ msg: "Student deleted successfully" });
  } catch (error) {
    console.error("Delete Student Error:", error);
    return res.status(500).json({ msg: "Failed to delete student", error: error.message });
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

/* -------------------- GET LOGGED IN STUDENT -------------------- */
export const getLoggedInStudent = (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ msg: "Unauthorized" });
    return res.status(200).json({ success: true, student: req.user });
  } catch (error) {
    console.error("getLoggedInStudent error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* -------------------- MY APPLIED COURSES --------------------
 * Previously missing entirely — the frontend's "/user/courses" page called
 * this exact route and always got a 404, so every student silently saw
 * "You haven't applied to any course yet." regardless of reality.
 * A student's course applications live in the Admission collection,
 * keyed by email — scoped to req.user.email, no client input trusted. */
export const getAppliedCourses = async (req, res) => {
  try {
    if (!req.user?.email) return res.status(401).json({ msg: "Unauthorized" });

    const admissions = await Admission.find({ email: req.user.email })
      .sort({ createdAt: -1 })
      .select("course university status createdAt")
      .lean();

    const courses = admissions.map((a) => ({
      _id: a._id,
      courseName: a.course || "—",
      universityName: a.university || "—",
      status: a.status || "pending",
      createdAt: a.createdAt,
    }));

    return res.status(200).json({ success: true, courses });
  } catch (error) {
    console.error("getAppliedCourses error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* -------------------- ASSIGN ACCESS -------------------- */
export const assignAccess = async (req, res) => {
  try {
    const { email, permissions } = req.body;
    if (!email || !Array.isArray(permissions)) {
      return res.status(400).json({ msg: "Valid Email and Permissions array required" });
    }

    const user = await Student.findOneAndUpdate(
      { email },
      { $set: { role: "subadmin", permissions } },
      { new: true, runValidators: true }
    ).select("email role permissions").lean();

    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.status(200).json({ msg: "Access updated successfully", user });
  } catch (error) {
    console.error("Assign Access Error:", error);
    return res.status(500).json({ msg: "Failed to assign access" });
  }
};

/* -------------------- GET ADMIN PROFILE -------------------- */
export const getAdminProfile = async (req, res) => {
  try {
    const user = await Student.findById(req.user._id)
      .select("email role permissions")
      .lean();

    if (!user) return res.status(404).json({ msg: "User not found" });

    return res.status(200).json({
      success: true,
      role: user.role,
      permissions: user.permissions || [],
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    return res.status(500).json({ msg: "Error fetching profile" });
  }
};

/* -------------------- GET ALL SUB-ADMINS -------------------- */
export const getAllSubAdmins = async (req, res) => {
  try {
    const subAdmins = await Student.find({ role: "subadmin" })
      .select("email role permissions")
      .lean();

    return res.status(200).json(subAdmins);
  } catch (error) {
    console.error("Get Sub-Admins Error:", error);
    return res.status(500).json({ msg: "Failed to fetch sub-admins" });
  }
};

/* -------------------- REVOKE ACCESS -------------------- */
export const revokeAccess = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await Student.findOneAndUpdate(
      { email },
      { $set: { role: "student", permissions: [] } },
      { new: true }
    ).select("email role");

    if (!user) return res.status(404).json({ msg: "User not found" });
    return res.status(200).json({ msg: "All permissions removed", user });
  } catch (error) {
    console.error("Revoke Access Error:", error);
    return res.status(500).json({ msg: "Failed to revoke access" });
  }
};  
 
/* -------------------- STUDENT NOTIFICATIONS (Q&A answers, etc.) -------------------- */
export const getMyStudentNotifications = async (req, res) => {
  try {
    const { unreadOnly, limit = 30 } = req.query;
    const filter = { recipient: req.user._id, recipientType: "Student" };
    if (unreadOnly === "true") filter.read = false;

    const notifications = await RealtimeNotification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const unreadCount = await RealtimeNotification.countDocuments({
      recipient: req.user._id,
      recipientType: "Student",
      read: false,
    });

    res.status(200).json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const markStudentNotificationsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body;
    const filter = { recipient: req.user._id, recipientType: "Student" };
    if (Array.isArray(notificationIds) && notificationIds.length) {
      filter._id = { $in: notificationIds };
    }
    await RealtimeNotification.updateMany(filter, { $set: { read: true } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
