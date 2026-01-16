import express from "express";
import {
  trackVisitor,
  getTotalVisitors,
  getUniqueVisitors,
  getDailyVisitors,
  getVisitorById,
} from "../controller/visitorController.js";

const router = express.Router();

router.post("/track", trackVisitor);
router.get("/total", getTotalVisitors);
router.get("/unique", getUniqueVisitors);
router.get("/daily", getDailyVisitors);
router.get("/:id", getVisitorById);

export default router;
