import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createGetInTouch,
  getAllGetInTouch,
  deleteGetInTouch,
} from "../controller/getInTouchController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// Public — contact form submission
router.post("/", createGetInTouch);

// Admin only
router.get("/", adminOnly, getAllGetInTouch);
router.delete("/:id", adminOnly, deleteGetInTouch);

export default router;
