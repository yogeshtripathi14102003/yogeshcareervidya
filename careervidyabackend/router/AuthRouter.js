import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import { otpRateLimiter } from "../middelware/rateLimiter.js";
import {
  sendOTP,
  verifyOTP,
  refreshAccessToken,
  logout,
  getAllStudents,
  deleteStudent,
  getStudentById,
  getLoggedInStudent,
  getAppliedCourses,
  getMyStudentNotifications,
  markStudentNotificationsRead,
  assignAccess,
  getAdminProfile,
  getAllSubAdmins,
  revokeAccess,
} from "../controller/AuthController.js";

const router = express.Router();

// ---- OTP flow (public) — strict rate limit on both endpoints ----
router.post("/send-otp", otpRateLimiter, sendOTP);
router.post("/verify-otp", otpRateLimiter, verifyOTP);

// ---- Token / session management (public — token itself is the credential) ----
router.post("/refresh", refreshAccessToken);
router.post("/logout", logout);

// ---- Logged-in student's own profile ----
// (must come before "/students/:id" to avoid Express matching "me" as an :id)
router.get("/students/me", authMiddleware, getLoggedInStudent);
router.get("/students/applied-courses", authMiddleware, getAppliedCourses);
router.get("/students/notifications", authMiddleware, getMyStudentNotifications);
router.patch("/students/notifications/read", authMiddleware, markStudentNotificationsRead);

// ---- Student management — admin/subadmin only ----
router.get("/students", authMiddleware, requireRole(["admin", "subadmin"]), getAllStudents);
router.get("/students/:id", authMiddleware, requireRole(["admin", "subadmin"]), getStudentById);
router.delete("/students/:id", authMiddleware, requireRole(["admin"]), deleteStudent);

// ---- Admin profile (any authenticated admin/subadmin) ----
router.get("/me", authMiddleware, requireRole(["admin", "subadmin"]), getAdminProfile);

// ---- Sub-admin management — super admin only ----
router.post("/assign-access", authMiddleware, requireRole(["admin"]), assignAccess);
router.post("/revoke-access", authMiddleware, requireRole(["admin"]), revokeAccess);
router.get("/sub-admins", authMiddleware, requireRole(["admin"]), getAllSubAdmins);

export default router;
