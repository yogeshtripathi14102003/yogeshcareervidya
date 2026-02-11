// import express from "express";
// import {
//   submitReview,
//   getReviewsByCounsellor,
//   adminDeleteReview,
// } from "../controller/reviewController.js";



// const router = express.Router();

// /* ✅ GUEST + LOGIN DONO */
// router.post("/review", submitReview);

// /* PUBLIC */
// router.get("/review/:id", getReviewsByCounsellor);

// /* ADMIN */
// router.delete("/admin/review/:id",  adminDeleteReview);

// export default router;


import express from "express";
import {
  submitReview,
  getReviewsByCounsellor,
  adminDeleteReview,
} from "../controller/reviewController.js";

const router = express.Router();

/* GUEST + LOGIN */
router.post("/review", submitReview);

/* GET BY COUNSELLOR ID */
router.get("/review/:id", getReviewsByCounsellor);

/* ADMIN DELETE */
router.delete("/admin/review/:id", adminDeleteReview);

export default router;
