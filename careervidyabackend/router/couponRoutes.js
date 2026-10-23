import { Router } from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponsByCourse,
  getPublicCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCoupon,
  getCouponUsage,
  validateCoupon,
  applyCoupon,
} from "../controller/couponController.js";
// Apne middleware ke naam/path se badal lo:
// import { protect, adminOnly } from "../middleware/auth.js";

const router = Router();

/* ---------- Public (website ka Coupons page, login nahi chahiye) ---------- */
router.get("/public", getPublicCoupons);

/* ---------- User (login zaroori) ---------- */
router.post("/validate", /* protect, */ validateCoupon);
router.post("/apply", /* protect, */ applyCoupon);

/* ---------- Admin (protect + adminOnly zaroor lagao) ---------- */
router.post("/", /* protect, adminOnly, */ createCoupon);
router.get("/", /* protect, adminOnly, */ getAllCoupons);
router.get("/course/:courseId", /* protect, adminOnly, */ getCouponsByCourse);

// ":id" wale routes hamesha upar ke fixed routes ke baad rakho
router.get("/:id", /* protect, adminOnly, */ getCouponById);
router.patch("/:id", /* protect, adminOnly, */ updateCoupon);
router.delete("/:id", /* protect, adminOnly, */ deleteCoupon);
router.patch("/:id/toggle", /* protect, adminOnly, */ toggleCoupon);
router.get("/:id/usage", /* protect, adminOnly, */ getCouponUsage);

export default router;