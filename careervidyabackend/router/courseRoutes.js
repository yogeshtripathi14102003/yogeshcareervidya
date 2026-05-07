import express from "express";
import createUploader from "../multer.js";
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  getCourseById,
  updateCourse,
  deleteCourse,
  getCoursesShort,
} from "../controller/courseController.js";

const router = express.Router();

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

// ✅ Static routes PEHLE — dynamic routes baad mein
router.get("/short", getCoursesShort);            // ✅ /short pehle
router.get("/course/slug/:slug", getCourseBySlug);       // ✅ slug pehle

// ✅ CRUD routes
router.post("/course", courseUploads, createCourse);
router.get("/course", getCourses);

// ✅ ID routes sabse baad
router.get("/course/:id", getCourseById);
router.put("/course/:id", courseUploads, updateCourse);
router.delete("/course/:id", deleteCourse);

export default router;