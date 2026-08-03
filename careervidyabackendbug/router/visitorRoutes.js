import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  trackVisitor,
  getTotalVisitors,
  getUniqueVisitors,
  getDailyVisitors,
  getVisitorById,
} from "../controller/visitorController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// Public — analytics beacon fired by every page load
router.post("/track", trackVisitor);

// Admin only — aggregate analytics
router.get("/total", adminOnly, getTotalVisitors);
router.get("/unique", adminOnly, getUniqueVisitors);
router.get("/daily", adminOnly, getDailyVisitors);
router.get("/visitor/:id", adminOnly, getVisitorById);

export default router;
