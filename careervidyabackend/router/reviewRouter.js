import express from "express";
const router = express.Router();
import { 
  submitReview, 
  getReviewsByCounsellor, 
  adminDeleteReview 
} from "../controller/reviewController.js";

// Student/User routes
router.post("/review", submitReview); // Submit or Edit
router.get("/review/:id", getReviewsByCounsellor); // Get for frontend

// Admin route
router.delete("/admin/review/:id", adminDeleteReview); // Delete by Admin

export default router;