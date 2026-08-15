import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import { otpRateLimiter, authenticatedApiLimiter } from "../middelware/rateLimiter.js";

import {
  createCounselor,
  getAllCounselors,
  getCounselorById,
  updateCounselor,
  deleteCounselor,
  loginCounselor,
  getMyProfile,
  forgotPassword,
  resetPassword,
  setTeamLeadStatus,
  setTeamRoster,
  getAllTeamLeads,
  getMyTeam,
  sessionHeartbeat,
  closeSession,
  getCounselorAnalytics,
  getCounselorHoursSummary,
  getCounselorLeaderboard,
  getMyNotifications,
  markNotificationsRead,
} from "../controller/counselorController.js";

const router = express.Router();

const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// A counselor may read/update their own record; admins may access any record.
const selfOrAdmin = (req, res, next) => {
  if (req.user.role === "admin" || req.user.role === "subadmin") return next();
  if (req.user.role === "counselor" && String(req.user._id) === String(req.params.id)) return next();
  return res.status(403).json({ success: false, message: "Access denied" });
};

/* LOGIN — public */
router.post("/login", loginCounselor);

/* FORGOT / RESET PASSWORD — public, rate-limited */
router.post("/forgot-password", otpRateLimiter, forgotPassword);
router.post("/reset-password", otpRateLimiter, resetPassword);

/* MY PROFILE — any authenticated counselor */
router.get("/me", authMiddleware, getMyProfile);

/* SESSION TRACKING — Module 9 (working hours / idle time) */
router.post("/session/heartbeat", authMiddleware, authenticatedApiLimiter, sessionHeartbeat);
router.post("/session/close", authMiddleware, closeSession);

/* NOTIFICATIONS — Module 6 (dashboard bell) */
router.get("/notifications", authMiddleware, authenticatedApiLimiter, getMyNotifications);
router.patch("/notifications/read", authMiddleware, authenticatedApiLimiter, markNotificationsRead);

/* ANALYTICS — Module 9 */
router.get("/analytics/leaderboard", adminOnly, getCounselorLeaderboard);
router.get("/analytics/hours-summary/me", authMiddleware, getCounselorHoursSummary);
router.get("/analytics/hours-summary/:counselorId", authMiddleware, getCounselorHoursSummary);
router.get("/analytics/me", authMiddleware, getCounselorAnalytics);
router.get("/analytics/:counselorId", authMiddleware, getCounselorAnalytics);

/* MY TEAM — Team Lead only, read-only view of their assigned counselors */
router.get("/team/my-team", authMiddleware, getMyTeam);

/* TEAM LEAD MANAGEMENT — admin/subadmin only */
router.get("/team/leads", adminOnly, getAllTeamLeads);
router.patch("/:id/team-lead", adminOnly, setTeamLeadStatus);
router.put("/:id/team", adminOnly, setTeamRoster);

/* CREATE — admin only */
router.post("/", adminOnly, createCounselor);

/* READ ALL — admin only (contains PAN, Aadhar, address) */
router.get("/", adminOnly, getAllCounselors);

/* READ ONE — self or admin */
router.get("/:id", authMiddleware, selfOrAdmin, getCounselorById);

/* UPDATE — self or admin */
router.put("/:id", authMiddleware, selfOrAdmin, updateCounselor);

/* DELETE — admin only */
router.delete("/:id", adminOnly, deleteCounselor);

export default router;
