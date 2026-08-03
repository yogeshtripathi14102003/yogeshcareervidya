import express from "express";
import createUploader from "../multer.js";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
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
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 30,
});

const courseUploads = upload.fields([
  { name: "courseLogo", maxCount: 1 },
  { name: "overviewImages", maxCount: 10 },
  { name: "whyChooseUsImages", maxCount: 10 },
  { name: "onlineCourseWorthItImage", maxCount: 1 },
  { name: "syllabusPdf", maxCount: 1 },
]);

/* ---------- Public (site display) ---------- */
router.get("/course", getCourses);
router.get("/course/:id", getCourseById);
router.get("/course/slug/:slug", getCourseBySlug);

/* ---------- Admin only ---------- */
router.post("/course", adminOnly, courseUploads, createCourse);
router.post("/course/bulk-upload", adminOnly, bulkUploadCourses);
router.put("/course/:id", adminOnly, courseUploads, updateCourse);
router.delete("/course/:id", adminOnly, deleteCourse);

export default router;
