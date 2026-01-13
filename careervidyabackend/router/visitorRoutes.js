


import express from "express";
import {
  createVisitor,
  getAllVisitors,
  getTotalVisitors,
  getDailyVisitors,
  updateVisitor,
  deleteVisitor,
} from "../controller/visitorController.js";

const router = express.Router();

router.post("/track", createVisitor);          // CREATE
router.get("/track", getAllVisitors);          // READ ALL
router.get("/total", getTotalVisitors);  // TOTAL UNIQUE
router.get("/daily", getDailyVisitors);  // DAILY UNIQUE
router.put("/track/:id", updateVisitor);       // UPDATE
router.delete("/track/:id", deleteVisitor);    // DELETE

export default router;
