// import express from "express";
// import authMiddleware from "../middelware/authMiddleware.js";
// import { requireRole } from "../middelware/roleMiddleware.js";
// import {
//   submitReview,
//   getReviewsByCounsellor,
//   adminDeleteReview,
// } from "../controller/reviewController.js";

// const router = express.Router();

// /* Public — guests and logged-in users can both submit/view reviews */
// router.post("/review", submitReview);
// router.get("/review/:id", getReviewsByCounsellor);

// /* Admin only */
// router.delete(
//   "/admin/review/:id",
//   authMiddleware,
//   requireRole(["admin", "subadmin"]),
//   adminDeleteReview
// );

// export default router;


import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  submitReview,
  getReviewsByCounsellor,
  submitUniversityReview,
  getReviewsByUniversity,
  submitCourseReview,
  getReviewsByCourse,
  adminDeleteReview,
} from "../controller/reviewController.js";

const router = express.Router();

/* ---------- Counsellor reviews: guests + logged-in users ---------- */
router.post("/review", submitReview);
router.get("/review/:id", getReviewsByCounsellor);

/* ---------- University reviews: LOGIN REQUIRED ---------- */
router.post("/review/university", authMiddleware, submitUniversityReview);
router.get("/review/university/:id", getReviewsByUniversity);

/* ---------- Course reviews (at a specific university): LOGIN REQUIRED ---------- */
router.post("/review/course", authMiddleware, submitCourseReview);
// universityId optional query param — see getReviewsByCourse
router.get("/review/course/:courseId", getReviewsByCourse);
router.get("/review/course/:courseId/:universityId", getReviewsByCourse);

/* ---------- Admin only ---------- */
router.delete(
  "/admin/review/:id",
  authMiddleware,
  requireRole(["admin", "subadmin"]),
  adminDeleteReview
);

export default router;
