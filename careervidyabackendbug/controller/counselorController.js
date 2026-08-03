import Counselor from "../models/counselor/Counselor.js";
import CounselorSession from "../models/counselor/CounselorSession.js";
import Lead from "../models/counselor/Lead.js";
import RealtimeNotification from "../models/counselor/RealtimeNotification.js";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "../utilities/jwt.js";
import VerificationModel from "../models/user/verificationModel.js";
import { generateOTP, hashOTP } from "../utilities/otpUtils.js";
import { getOTPTemplate } from "../utilities/emailTemplates.js";
import { notificationQueue } from "../utilities/emailQueue.js";
import { getViewableCounselorIds } from "../utilities/teamScope.js";
import { getOnlineCounselorIds } from "../socket.js";
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

/* ===============================
   FORGOT PASSWORD — send OTP to registered email
================================ */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required" });
    }

    const counselor = await Counselor.findOne({ email }).select("_id").lean();

    // Always respond the same way whether or not the email exists —
    // don't let this endpoint be used to enumerate registered counselors.
    if (!counselor) {
      return res.status(200).json({
        success: true,
        message: "If that email is registered, an OTP has been sent.",
      });
    }

    const otp = generateOTP();
    const codeHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await VerificationModel.findOneAndUpdate(
      { emailOrPhone: email, purpose: "reset-password" },
      { codeHash, expiresAt, verified: false, attempts: 0, method: "email" },
      { upsert: true, new: true }
    );

    await notificationQueue.add("send-otp-email", {
      type: "email",
      to: email,
      subject: `${otp} is your password reset code`,
      html: getOTPTemplate(otp),
    });

    return res.status(200).json({
      success: true,
      message: "If that email is registered, an OTP has been sent.",
    });
  } catch (error) {
    console.error("Counselor Forgot Password Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ===============================
   RESET PASSWORD — verify OTP + set new password
================================ */
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
    }

    const record = await VerificationModel.findOne({ emailOrPhone: email, purpose: "reset-password" });
    if (!record) return res.status(400).json({ success: false, message: "OTP not requested or expired." });
    if (record.expiresAt < new Date())
      return res.status(400).json({ success: false, message: "OTP expired." });
    if (record.attempts >= 5)
      return res.status(429).json({ success: false, message: "Too many attempts. Request a new OTP." });

    if (hashOTP(otp) !== record.codeHash) {
      record.attempts += 1;
      await record.save();
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }

    await VerificationModel.deleteOne({ _id: record._id });

    const counselor = await Counselor.findOne({ email });
    if (!counselor) {
      return res.status(404).json({ success: false, message: "Account not found." });
    }

    const salt = await bcrypt.genSalt(10);
    counselor.password = await bcrypt.hash(newPassword, salt);
    await counselor.save();

    return res.status(200).json({ success: true, message: "Password reset successfully. Please log in." });
  } catch (error) {
    console.error("Counselor Reset Password Error:", error);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ===============================
   GET MY PROFILE (logged-in counselor)
================================ */
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });
    return res.status(200).json({ success: true, data: { ...req.user, role: "counselor" } });
  } catch (error) {
    console.error("Get My Profile Error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ===============================
   CREATE - Register Counselor
================================ */
export const createCounselor = async (req, res) => {
  try {
    const {
      name,
      email,
      userid,
      password,
      phone,
      pan,
      aadhar,
      dob,
      doj,
      address,
      status, // ✅ NEW
      leadLimit,
    } = req.body;

    /* Validation */
    if (!name || !email || !userid || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing",
      });
    }

    /* Check Duplicate */
    const exists = await Counselor.findOne({
      $or: [{ email }, { userid }],
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email or UserID already exists",
      });
    }

    /* Hash Password */
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const counselor = await Counselor.create({
      name,
      email,
      userid,
      password: hashPassword,
      phone,
      pan,
      aadhar,
      dob,
      doj,
      address,

      // ✅ Status (agar na bhejo to default active lagega)
      status: status || "active",
      leadLimit: leadLimit != null && leadLimit !== "" ? Number(leadLimit) : null,
    });

    res.status(201).json({
      success: true,
      message: "Counselor Created Successfully",
      data: counselor,
    });
  } catch (error) {
    console.error("Create Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/* ===============================
   READ ALL Counselors
================================ */
export const getAllCounselors = async (req, res) => {
  try {
    const counselors = await Counselor.find()
      .select("-password");

    res.status(200).json({
      success: true,
      total: counselors.length,
      data: counselors,
    });
  } catch (error) {
    console.error("Fetch All Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* ===============================
   READ Single Counselor
================================ */
export const getCounselorById = async (req, res) => {
  try {
    const counselor = await Counselor.findById(req.params.id)
      .select("-password");

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor Not Found",
      });
    }

    res.status(200).json({
      success: true,
      data: counselor,
    });
  } catch (error) {
    console.error("Fetch One Error:", error);

    res.status(500).json({
      success: false,
      message: "Invalid ID / Server Error",
    });
  }
};

/* ===============================
   UPDATE Counselor
================================ */
export const updateCounselor = async (req, res) => {
  try {
    const { id } = req.params;

    let updateData = { ...req.body };

    // A counselor editing their own profile (selfOrAdmin allows this)
    // must never be able to grant themselves privileged fields.
    const isAdmin = ["admin", "subadmin"].includes(req.user?.role);
    if (!isAdmin) {
      delete updateData.isTeamLead;
      delete updateData.reportsTo;
      delete updateData.leadLimit;
      delete updateData.status;
      delete updateData.userid;
    }

    /* ✅ Status Validation */
    if (req.body.status) {
      const allowed = ["active", "leave", "Inactive"];

      if (!allowed.includes(req.body.status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value",
        });
      }
    }

    /* If Password Updated → Hash */
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const counselor = await Counselor.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Counselor Updated",
      data: counselor,
    });
  } catch (error) {
    console.error("Update Error:", error);

    res.status(500).json({
      success: false,
      message: error.message || "Server Error",
    });
  }
};

/* ===============================
   DELETE Counselor
================================ */
export const deleteCounselor = async (req, res) => {
  try {
    const { id } = req.params;

    const counselor = await Counselor.findByIdAndDelete(id);

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Counselor Not Found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Counselor Deleted Successfully",
    });
  } catch (error) {
    console.error("Delete Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};



/* 
   LOGIN Counselor (userid + password)
 */
export const loginCounselor = async (req, res) => {
  try {
    const { userid, password } = req.body;

    // Validation
    if (!userid || !password) {
      return res.status(400).json({
        success: false,
        message: "UserID and Password required",
      });
    }

    // Find user
    const counselor = await Counselor.findOne({ userid });

    if (!counselor) {
      return res.status(404).json({
        success: false,
        message: "Invalid UserID",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, counselor.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Password",
      });
    }

    if (counselor.status && counselor.status !== "active") {
      return res.status(403).json({
        success: false,
        message: "Your account is not active. Please contact the admin.",
      });
    }

    const accessToken = generateAccessToken(counselor._id, "counselor");
    const refreshToken = generateRefreshToken(counselor._id, "counselor");
    res.cookie("refreshToken", refreshToken, refreshCookieOptions);

    // Module 9: Counselor Analytics — start a new session record for
    // working-hours / login-time tracking.
    const session = await CounselorSession.create({ counselor: counselor._id });

    // Success
    res.status(200).json({
      success: true,
      message: "Login Success",
      accessToken,
      sessionId: session._id,
      data: {
        _id: counselor._id,
        name: counselor.name,
        userid: counselor.userid,
        email: counselor.email,
        role: "counselor",
        status: counselor.status,
        phone: counselor.phone,
        doj: counselor.doj,
        address: counselor.address,
        isTeamLead: counselor.isTeamLead,
        reportsTo: counselor.reportsTo,
      },
    });

  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

/* =====================================================
   TEAM LEAD (TL) MANAGEMENT — admin/subadmin only.
   A TL can VIEW their team's CRM data (leads, admissions, tickets),
   but cannot edit/delete it — only admin or the owning counselor can.
===================================================== */

/* Promote / demote a counselor as Team Lead */
export const setTeamLeadStatus = async (req, res) => {
  try {
    const { isTeamLead } = req.body;
    if (typeof isTeamLead !== "boolean") {
      return res.status(400).json({ success: false, message: "isTeamLead (boolean) is required" });
    }

    const counselor = await Counselor.findById(req.params.id);
    if (!counselor) {
      return res.status(404).json({ success: false, message: "Counselor not found" });
    }

    counselor.isTeamLead = isTeamLead;
    // Demoting a TL — clear out their team so nobody is left silently
    // reporting to a counselor who's no longer a TL.
    if (!isTeamLead) {
      await Counselor.updateMany({ reportsTo: counselor._id }, { $set: { reportsTo: null } });
    }
    await counselor.save();

    return res.status(200).json({
      success: true,
      message: isTeamLead ? "Counselor promoted to Team Lead" : "Team Lead role removed",
      data: counselor,
    });
  } catch (error) {
    console.error("setTeamLeadStatus error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Replace a Team Lead's full roster in one call:
 * body: { counselorIds: [id1, id2, ...] }
 * Anyone currently reporting to this TL but missing from the new list is
 * detached (reportsTo set back to null); everyone in the list is attached. */
export const setTeamRoster = async (req, res) => {
  try {
    const { counselorIds } = req.body;
    if (!Array.isArray(counselorIds)) {
      return res.status(400).json({ success: false, message: "counselorIds must be an array" });
    }

    const teamLead = await Counselor.findById(req.params.id);
    if (!teamLead) {
      return res.status(404).json({ success: false, message: "Team Lead not found" });
    }
    if (!teamLead.isTeamLead) {
      return res.status(400).json({
        success: false,
        message: "This counselor is not a Team Lead yet — promote them first.",
      });
    }

    // A TL cannot be their own team member, and a TL can't be assigned
    // under another TL's roster (keep the hierarchy flat, one level deep).
    const cleanIds = counselorIds.filter((id) => String(id) !== String(teamLead._id));

    const otherTeamLeadsInList = await Counselor.find({
      _id: { $in: cleanIds },
      isTeamLead: true,
    }).select("name");

    if (otherTeamLeadsInList.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot add existing Team Lead(s) to another team: ${otherTeamLeadsInList
          .map((c) => c.name)
          .join(", ")}. Demote them first if you want to move them.`,
      });
    }

    await Counselor.updateMany(
      { reportsTo: teamLead._id, _id: { $nin: cleanIds } },
      { $set: { reportsTo: null } }
    );
    await Counselor.updateMany(
      { _id: { $in: cleanIds } },
      { $set: { reportsTo: teamLead._id } }
    );

    const updatedTeam = await Counselor.find({ reportsTo: teamLead._id }).select(
      "name email userid status"
    );

    return res.status(200).json({ success: true, data: updatedTeam });
  } catch (error) {
    console.error("setTeamRoster error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Admin: list every Team Lead with their team size */
export const getAllTeamLeads = async (req, res) => {
  try {
    const teamLeads = await Counselor.find({ isTeamLead: true }).select(
      "name email userid status"
    );

    const withTeamSize = await Promise.all(
      teamLeads.map(async (tl) => {
        const teamSize = await Counselor.countDocuments({ reportsTo: tl._id });
        return { ...tl.toObject(), teamSize };
      })
    );

    return res.status(200).json({ success: true, data: withTeamSize });
  } catch (error) {
    console.error("getAllTeamLeads error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Team Lead: view their own team roster (read-only) */
export const getMyTeam = async (req, res) => {
  try {
    if (!req.user?.isTeamLead) {
      return res.status(403).json({ success: false, message: "You are not a Team Lead" });
    }

    const team = await Counselor.find({ reportsTo: req.user._id }).select(
      "name email userid phone status doj"
    ).lean();

    const onlineIds = new Set(getOnlineCounselorIds().map(String));
    const teamIds = team.map((c) => c._id);

    // Most recent session per team member, in one query rather than N.
    const lastSessions = await CounselorSession.aggregate([
      { $match: { counselor: { $in: teamIds } } },
      { $sort: { loginAt: -1 } },
      { $group: { _id: "$counselor", loginAt: { $first: "$loginAt" }, logoutAt: { $first: "$logoutAt" } } },
    ]);
    const sessionByCounselor = Object.fromEntries(lastSessions.map((s) => [String(s._id), s]));

    const enriched = team.map((c) => ({
      ...c,
      isOnline: onlineIds.has(String(c._id)),
      lastLogin: sessionByCounselor[String(c._id)]?.loginAt || null,
      lastLogout: sessionByCounselor[String(c._id)]?.logoutAt || null,
    }));

    return res.status(200).json({ success: true, data: enriched });
  } catch (error) {
    console.error("getMyTeam error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =====================================================
   MODULE 9 — COUNSELOR ANALYTICS
===================================================== */

/* Heartbeat — called periodically (e.g. every 60s) while the counselor
 * dashboard tab is open and active, so we can compute idle time. */
export const sessionHeartbeat = async (req, res) => {
  try {
    if (req.user?.role !== "counselor") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const session = await CounselorSession.findOne({
      counselor: req.user._id,
      logoutAt: { $exists: false },
    }).sort({ loginAt: -1 });

    if (session) {
      session.lastActiveAt = new Date();
      await session.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Close the current session — called on logout. */
export const closeSession = async (req, res) => {
  try {
    if (req.user?.role !== "counselor") {
      return res.status(200).json({ success: true }); // no-op for non-counselors
    }

    const session = await CounselorSession.findOne({
      counselor: req.user._id,
      logoutAt: { $exists: false },
    }).sort({ loginAt: -1 });

    if (session) {
      session.logoutAt = new Date();
      session.lastActiveAt = session.logoutAt;
      await session.save();
    }

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Full performance analytics for one counselor — self, or any team member
 * if the caller is that counselor's Team Lead, or any counselor at all for
 * admin/subadmin. */
export const getCounselorAnalytics = async (req, res) => {
  try {
    const targetId = req.params.counselorId || String(req.user._id);
    const isStaffAdmin = ["admin", "subadmin"].includes(req.user?.role);

    if (!isStaffAdmin) {
      const viewableIds = await getViewableCounselorIds(req.user);
      if (!viewableIds.includes(String(targetId))) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    const { fromDate, toDate } = req.query;
    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(`${fromDate}T00:00:00+05:30`);
    if (toDate) dateFilter.$lte = new Date(`${toDate}T23:59:59.999+05:30`);

    // ---- Session / working-hours stats ----
    const sessionFilter = { counselor: targetId };
    if (Object.keys(dateFilter).length) sessionFilter.loginAt = dateFilter;

    const sessions = await CounselorSession.find(sessionFilter).lean();
    const now = Date.now();
    let totalWorkingSeconds = 0;
    let totalIdleSeconds = 0;
    const IDLE_THRESHOLD_SECONDS = 15 * 60; // beyond 15 min since last heartbeat counts as idle

    sessions.forEach((s) => {
      const end = s.logoutAt ? new Date(s.logoutAt).getTime() : now;
      const lastActive = s.lastActiveAt ? new Date(s.lastActiveAt).getTime() : end;
      const start = new Date(s.loginAt).getTime();

      totalWorkingSeconds += Math.max(0, (lastActive - start) / 1000);
      if (!s.logoutAt) {
        // still-open session — time since last heartbeat counts as idle
        const idleSecs = (now - lastActive) / 1000;
        if (idleSecs > IDLE_THRESHOLD_SECONDS) totalIdleSeconds += idleSecs;
      }
    });

    const lastSession = sessions.sort((a, b) => new Date(b.loginAt) - new Date(a.loginAt))[0];

    // ---- Lead-derived stats ----
    const leadFilter = { assignedTo: targetId };
    if (Object.keys(dateFilter).length) leadFilter.createdAt = dateFilter;

    const leads = await Lead.find(leadFilter)
      .select("status createdAt firstResponseAt resolvedAt followUpHistory followUpDate")
      .lean();

    const totalLeads = leads.length;
    const admissions = leads.filter((l) => l.status === ADMITTED_STATUS).length;
    const lostLeads = leads.filter((l) => LOST_STATUSES.includes(l.status)).length;
    const conversionRate = totalLeads > 0 ? +((admissions / totalLeads) * 100).toFixed(2) : 0;

    // "Calls Done" is approximated as leads with at least one follow-up
    // logged — there's no dedicated call-log model yet.
    const callsDone = leads.filter((l) => l.followUpHistory?.length > 0).length;
    const followUps = leads.reduce((sum, l) => sum + (l.followUpHistory?.length || 0), 0);
    const pendingCalls = leads.filter(
      (l) =>
        l.status !== ADMITTED_STATUS &&
        !LOST_STATUSES.includes(l.status) &&
        l.followUpDate &&
        new Date(l.followUpDate) <= new Date()
    ).length;

    const responded = leads.filter((l) => l.firstResponseAt);
    const avgResponseMinutes =
      responded.length > 0
        ? Math.round(
            responded.reduce((s, l) => s + (new Date(l.firstResponseAt) - new Date(l.createdAt)) / 60000, 0) /
              responded.length
          )
        : null;

    const resolved = leads.filter((l) => l.resolvedAt);
    const avgResolutionHours =
      resolved.length > 0
        ? +(
            resolved.reduce((s, l) => s + (new Date(l.resolvedAt) - new Date(l.createdAt)) / 3600000, 0) /
            resolved.length
          ).toFixed(1)
        : null;

    res.status(200).json({
      success: true,
      data: {
        counselorId: targetId,
        loginTime: lastSession?.loginAt || null,
        logoutTime: lastSession?.logoutAt || null,
        workingHours: +(totalWorkingSeconds / 3600).toFixed(1),
        idleMinutes: Math.round(totalIdleSeconds / 60),
        totalLeads,
        callsDone,
        pendingCalls,
        followUps,
        admissions,
        lostLeads,
        conversionRate,
        avgResponseMinutes,
        avgResolutionHours,
      },
    });
  } catch (error) {
    console.error("getCounselorAnalytics error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Combined today / this-week / this-month / all-time working hours in one
 * call — computed via aggregation rather than re-running the full
 * getCounselorAnalytics per period, since this is meant for a lightweight
 * dashboard summary card. */
export const getCounselorHoursSummary = async (req, res) => {
  try {
    const targetId = req.params.counselorId || String(req.user._id);
    const isStaffAdmin = ["admin", "subadmin"].includes(req.user?.role);

    if (!isStaffAdmin) {
      const viewableIds = await getViewableCounselorIds(req.user);
      if (!viewableIds.includes(String(targetId))) {
        return res.status(403).json({ success: false, message: "Access denied" });
      }
    }

    const now = new Date();
    const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
    const weekStart = new Date(now); weekStart.setDate(now.getDate() - now.getDay()); weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    const sessions = await CounselorSession.find({ counselor: targetId })
      .select("loginAt logoutAt lastActiveAt")
      .lean();

    const workingSecondsSince = (cutoff) =>
      sessions
        .filter((s) => new Date(s.loginAt) >= cutoff)
        .reduce((sum, s) => {
          const end = s.logoutAt ? new Date(s.logoutAt).getTime() : Date.now();
          const lastActive = s.lastActiveAt ? new Date(s.lastActiveAt).getTime() : end;
          const start = new Date(s.loginAt).getTime();
          return sum + Math.max(0, (lastActive - start) / 1000);
        }, 0);

    const toHours = (seconds) => +(seconds / 3600).toFixed(1);

    res.status(200).json({
      success: true,
      data: {
        today: toHours(workingSecondsSince(todayStart)),
        thisWeek: toHours(workingSecondsSince(weekStart)),
        thisMonth: toHours(workingSecondsSince(monthStart)),
        allTime: toHours(workingSecondsSince(new Date(0))),
      },
    });
  } catch (error) {
    console.error("getCounselorHoursSummary error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* Admin: leaderboard across all counselors for a period, ranked by admissions. */
export const getCounselorLeaderboard = async (req, res) => {
  try {
    const { fromDate, toDate, sortBy = "admissions" } = req.query;
    const dateFilter = {};
    if (fromDate) dateFilter.$gte = new Date(`${fromDate}T00:00:00+05:30`);
    if (toDate) dateFilter.$lte = new Date(`${toDate}T23:59:59.999+05:30`);

    const matchStage = Object.keys(dateFilter).length ? { createdAt: dateFilter } : {};

    const agg = await Lead.aggregate([
      { $match: { ...matchStage, assignedTo: { $ne: null } } },
      {
        $group: {
          _id: "$assignedTo",
          totalLeads: { $sum: 1 },
          admissions: { $sum: { $cond: [{ $eq: ["$status", ADMITTED_STATUS] }, 1, 0] } },
          lostLeads: { $sum: { $cond: [{ $in: ["$status", LOST_STATUSES] }, 1, 0] } },
        },
      },
      {
        $addFields: {
          conversionRate: {
            $cond: [{ $gt: ["$totalLeads", 0] }, { $multiply: [{ $divide: ["$admissions", "$totalLeads"] }, 100] }, 0],
          },
        },
      },
      { $sort: sortBy === "conversion" ? { conversionRate: -1 } : { admissions: -1 } },
      {
        $lookup: { from: "counselors", localField: "_id", foreignField: "_id", as: "counselor" },
      },
      { $unwind: { path: "$counselor", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          counselorId: "$_id",
          name: "$counselor.name",
          email: "$counselor.email",
          totalLeads: 1,
          admissions: 1,
          lostLeads: 1,
          conversionRate: { $round: ["$conversionRate", 2] },
        },
      },
    ]);

    res.status(200).json({ success: true, data: agg });
  } catch (error) {
    console.error("getCounselorLeaderboard error:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* =====================================================
   MODULE 6 — NOTIFICATION HISTORY (dashboard bell)
===================================================== */
export const getMyNotifications = async (req, res) => {
  try {
    const { unreadOnly, limit = 30 } = req.query;
    const filter = { recipient: req.user._id };
    if (unreadOnly === "true") filter.read = false;

    const notifications = await RealtimeNotification.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .lean();

    const unreadCount = await RealtimeNotification.countDocuments({
      recipient: req.user._id,
      read: false,
    });

    res.status(200).json({ success: true, data: notifications, unreadCount });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const markNotificationsRead = async (req, res) => {
  try {
    const { notificationIds } = req.body; // omit to mark ALL as read
    const filter = { recipient: req.user._id };
    if (Array.isArray(notificationIds) && notificationIds.length) {
      filter._id = { $in: notificationIds };
    }

    await RealtimeNotification.updateMany(filter, { $set: { read: true } });
    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
