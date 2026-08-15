import express from "express";
import createUploader from "../multer.js";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  getCourseById,
  updateCourse,
  updateCourseUniversities,
  deleteCourse,
  getCoursesShort,
  searchCourses,
} from "../controller/courseController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 30,
});

const courseUploads = upload.fields([
  { name: "courseLogo", maxCount: 10 },
  { name: "overviewImages", maxCount: 10 },
  { name: "whyChooseUsImages", maxCount: 10 },
  { name: "onlineCourseWorthItImage", maxCount: 10 },
  { name: "syllabusPdf", maxCount: 2 },
]);

// Public — static routes before dynamic
router.get("/short", getCoursesShort);
router.get("/course/search", searchCourses);
router.get("/course/slug/:slug", getCourseBySlug);
router.get("/course", getCourses);
router.get("/course/:id", getCourseById);

// Admin only
router.post("/course", adminOnly, courseUploads, createCourse);
router.put("/course/:id", adminOnly, courseUploads, updateCourse);
router.put("/course/:id/universities", adminOnly, updateCourseUniversities);
router.delete("/course/:id", adminOnly, deleteCourse);

export default router;
