import express from "express";
import authMiddleware, { optionalAuth } from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import { publicApiLimiter, adminApiLimiter } from "../middelware/rateLimiter.js";
import {
  startOrUpdateSession,
  endSession,
  sessionHeartbeat,
  trackPageEnter,
  trackPageExit,
  trackEvent,
  getVisitorJourney,
  trackCourseView,
  getCourseAnalytics,
  getTopCourses,
  getDashboardSummary,
} from "../controller/analyticsController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// ---- Public beacons — fired by every visitor's browser ----
// NOTE: these deliberately do NOT require authMiddleware. A logged-out
// visitor must still be trackable; when a session IS authenticated,
// authMiddleware-populated req.user is used opportunistically (see
// optionalAuth below) without blocking anonymous calls.
//
// These fire very frequently by design (heartbeats every 60s, page
// enter/exit on every navigation) — explicitly on the generous
// publicApiLimiter rather than relying only on the global backstop.
router.post("/session/start", publicApiLimiter, optionalAuth, startOrUpdateSession);
router.post("/session/end", publicApiLimiter, optionalAuth, endSession);
router.post("/session/heartbeat", publicApiLimiter, sessionHeartbeat);
router.post("/page/enter", publicApiLimiter, trackPageEnter);
router.post("/page/exit", publicApiLimiter, trackPageExit);
router.post("/event", publicApiLimiter, trackEvent);
router.post("/course-view", publicApiLimiter, optionalAuth, trackCourseView);

// ---- Admin only — reading the analytics ----
router.get("/visitor-journey/:sessionId", ...adminOnly, adminApiLimiter, getVisitorJourney);
router.get("/course/:courseId", ...adminOnly, adminApiLimiter, getCourseAnalytics);
router.get("/courses/top", ...adminOnly, adminApiLimiter, getTopCourses);
router.get("/dashboard-summary", ...adminOnly, adminApiLimiter, getDashboardSummary);

export default router;
