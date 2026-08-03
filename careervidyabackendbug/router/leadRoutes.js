import express from "express";
import multer from "multer";
import * as ctrl from "../controller/leadController.js";
import * as assignCtrl from "../controller/assignmentConfigController.js";
import * as followUpCtrl from "../controller/followUpAutomationController.js";
import { getLeadTimeline } from "../controller/activityTimelineController.js";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";

const router = express.Router();
const upload = multer();

// Internal CRM — leads/counselor-assignment data, never public
router.use(authMiddleware, requireRole(["admin", "subadmin", "counselor"]));
const adminOnly = requireRole(["admin", "subadmin"]);

// NOTE: counselor account CRUD lives in counselorRoutes.js (/api/v1/counselor).
// A duplicate, less-safe copy used to live here too but was always shadowed
// by counselorRoutes.js being registered first, so it's been removed.

/* ================== MODULE 5: SMART ASSIGNMENT — admin only ================== */
router.get("/assignment-config", adminOnly, assignCtrl.getConfig);
router.put("/assignment-config", adminOnly, assignCtrl.updateConfig);
router.post("/leads/bulk-auto-assign", adminOnly, ctrl.bulkAutoAssignUnassigned);
router.post("/leads/reassign-inactive", adminOnly, ctrl.reassignLeadsFromInactiveCounselors);
router.post("/leads/:id/auto-assign", adminOnly, ctrl.autoAssignSingleLead);

/* ================== MODULE 8: FOLLOW-UP AUTOMATION — admin only ================== */
router.get("/followup-config", adminOnly, followUpCtrl.getFollowUpConfig);
router.put("/followup-config", adminOnly, followUpCtrl.updateFollowUpConfig);
router.post("/followup-config/run-now", adminOnly, followUpCtrl.runFollowUpSweepNow);
router.get("/automation-logs", adminOnly, followUpCtrl.getAutomationLogs);

/* ================== MODULE 11: AI LEAD SCORING ================== */
router.get("/leads/score-breakdown", ctrl.getScoreBreakdown); // staff-scoped, not admin-only
router.post("/leads/rescore-all", adminOnly, ctrl.rescoreAllLeads);
router.get("/leads/:id/score-detail", ctrl.getLeadScoreDetail);

/* ================== MODULE 12: ACTIVITY TIMELINE ================== */
router.get("/leads/:id/timeline", getLeadTimeline);

/* ================== LEADS — static routes before dynamic ================== */
router.get("/daily-report", ctrl.getCounselorDailyReport);
router.get("/leads/analytics", ctrl.getLeadAnalytics);
router.post("/leads/upload", upload.single("file"), ctrl.uploadLeads);
router.post("/leads/assign-selected", ctrl.assignSelectedLeads);
router.delete("/leads/bulk-delete", ctrl.bulkDeleteLeads);

/* ================== LEADS ================== */
router.get("/leads", ctrl.getLeads);
router.post("/leads", ctrl.createLead);
router.get("/leads/:id", ctrl.getLead);
router.put("/leads/:id", ctrl.updateLead);
router.delete("/leads/:id", ctrl.deleteLead);
router.post("/leads/transfer", ctrl.transferLeads);

/* ================== COUNSELOR DASHBOARD ================== */
router.get("/counselor-leads", ctrl.getLeadsByCounselorId);

export default router;
