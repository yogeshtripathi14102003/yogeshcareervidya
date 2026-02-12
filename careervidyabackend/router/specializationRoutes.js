import express from "express";
import createUploader from "../multer.js";
import {
  createCourse,
  bulkUploadCourses,
  getCourses,
  getCourseBySlug,
  getCourseById,
  updateCourse,
  deleteCourse,
} from "../controller/specializationController.js";

const router = express.Router();

/* ======================================================
   Cloudinary uploader (same as yours)
====================================================== */
const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 30,
});

/* ======================================================
   File fields (same naming as controller)
====================================================== */
const courseUploads = upload.fields([
  { name: "courseLogo", maxCount: 1 },
  { name: "overviewImages", maxCount: 10 },
  { name: "whyChooseUsImages", maxCount: 10 },
  { name: "onlineCourseWorthItImage", maxCount: 1 },
  { name: "syllabusPdf", maxCount: 1 },
]);

/* ======================================================
   ROUTES
====================================================== */

/* ---------- CREATE COURSE ---------- */
router.post("/course", courseUploads, createCourse);

/* ---------- BULK UPLOAD COURSES ---------- */
/*
Expected body:
{
  courses: [
    { name, category, duration, seo, faqs, specializations }
  ]
}
*/
router.post("/course/bulk-upload", bulkUploadCourses);

/* ---------- GET ALL COURSES (SEARCH / FILTER) ---------- */
/*
Query support:
?search=mba
?category=management
?tag=online
*/
router.get("/course", getCourses);

/* ---------- GET / UPDATE / DELETE BY ID ---------- */
/*
IMPORTANT:
Placed BEFORE slug route to avoid conflict
*/
router
  .route("/course/:id")
  .get(getCourseById)
  .put(courseUploads, updateCourse)
  .delete(deleteCourse);

/* ---------- GET BY SLUG ---------- */
router.get("/course/slug/:slug", getCourseBySlug);

export default router;
