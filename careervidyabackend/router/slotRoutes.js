// routes/slotRoutes.js

import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  addSlot,
  getAllSlotsForAdmin,
  getAvailableSlotsForUsers,
  bookSlotDirectly,
  approveSlot,
  rejectSlot,
  updateSlotByAdmin,
  deleteSlot,
} from "../controller/slotController.js";

const router = express.Router();
const staff = [authMiddleware, requireRole(["admin", "subadmin", "counselor"])];

// ── Public / student-facing routes ──────────────────────────────
router.get("/available", getAvailableSlotsForUsers);
router.put("/book/:id", bookSlotDirectly);

// ── Admin / counselor routes ────────────────────────────────────
router.post("/add", ...staff, addSlot);
router.get("/admin/all", ...staff, getAllSlotsForAdmin);
router.put("/admin/approve/:id", ...staff, approveSlot);
router.put("/admin/reject/:id", ...staff, rejectSlot);
router.put("/admin/update/:id", ...staff, updateSlotByAdmin);
router.delete("/admin/delete/:id", ...staff, deleteSlot);

export default router;
