import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  submitReview,
  getReviewsByCounsellor,
  adminDeleteReview,
} from "../controller/reviewController.js";

const router = express.Router();

/* Public — guests and logged-in users can both submit/view reviews */
router.post("/review", submitReview);
router.get("/review/:id", getReviewsByCounsellor);

/* Admin only */
router.delete(
  "/admin/review/:id",
  authMiddleware,
  requireRole(["admin", "subadmin"]),
  adminDeleteReview
);

export default router;
