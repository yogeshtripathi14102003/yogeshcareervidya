// routes/slotRoutes.js

import express from "express";
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

// ── User/Frontend routes ───────────────────────────────────────────────────────
router.get("/available", getAvailableSlotsForUsers);  // Free slots for booking
router.put("/book/:id",  bookSlotDirectly);           // Student books a slot

// ── Admin routes ──────────────────────────────────────────────────────────────
router.post("/add",                  addSlot);              // Add new slot with totalSeats
router.get("/admin/all",             getAllSlotsForAdmin);   // All slots + grouped availability
router.put("/admin/approve/:id",     approveSlot);          // Approve → auto email
router.put("/admin/reject/:id",      rejectSlot);           // Reject → auto email + free slot
router.put("/admin/update/:id",      updateSlotByAdmin);    // Manual edit
router.delete("/admin/delete/:id",   deleteSlot);           // Delete slot

export default router;