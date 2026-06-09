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

// ── User / Frontend routes ─────────────────────────────────────────────────────
// Returns slots where bookedSeats < totalSeats (seats still available)
router.get("/available", getAvailableSlotsForUsers);

// Student books a seat — increments bookedSeats, marks isBooked only when full
router.put("/book/:id", bookSlotDirectly);

// ── Admin routes ───────────────────────────────────────────────────────────────
// Add new slot with date, time, totalSeats
router.post("/add", addSlot);

// Get all slots with remainingSeats info
router.get("/admin/all", getAllSlotsForAdmin);

// Approve booking → sends confirmation email
// Body (optional): { bookingId } — if omitted, approves slot-level booking
router.put("/admin/approve/:id", approveSlot);

// Reject booking → frees seat + sends rejection email
// Body: { bookingId (optional), rejectionReason (optional) }
router.put("/admin/reject/:id", rejectSlot);

// Manual slot edit (date, time, totalSeats) — bookedSeats/isBooked protected
router.put("/admin/update/:id", updateSlotByAdmin);

// Delete slot permanently
router.delete("/admin/delete/:id", deleteSlot);

export default router;