
// import express from "express";
// import createUploader from "../multer.js";
// import {
//   createCourse,
//   getCourses,
//   getCourseBySlug,
//   updateCourse,
//   deleteCourse,
// } from "../controller/courseController.js";

// const router = express.Router();

// // Cloudinary uploader
// const upload = createUploader({
//   folder: "courses",
//   maxFileSizeMB: 10,
//   maxFiles: 30,
// });

// // ⚡ Correct field names matching the controller
// const courseUploads = upload.fields([
//   { name: "courseLogo", maxCount: 1 },
//   { name: "overviewImages", maxCount: 10 },
//   { name: "whyChooseUsImages", maxCount: 10 },
//   { name: "onlineCourseWorthItImage", maxCount: 1 }, // ✔ matches controller
//   { name: "syllabusPdf", maxCount: 1 },             // ✔ matches controller
// ]);

// // Routes
// router.post("/course", courseUploads, createCourse);
// router.get("/course", getCourses);
// router.get("/course/:slug", getCourseBySlug);
// router.put("/course/:id", courseUploads, updateCourse);
// router.delete("/course/:id", deleteCourse);

// export default router;


import express from "express";
import createUploader from "../multer.js";
import {
  createCourse,
  getCourses,
  getCourseBySlug,
  getCourseById,      // ⬅️ 1. Import the new function
  updateCourse,
  deleteCourse,
} from "../controller/courseController.js"; // ⬅️ Ensure path is correct

const router = express.Router();

// Cloudinary uploader (Configuration remains the same)
const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 30,
});

// Correct field names matching the controller (Configuration remains the same)
const courseUploads = upload.fields([
  { name: "courseLogo", maxCount: 10 },
  { name: "overviewImages", maxCount: 10 },
  { name: "whyChooseUsImages", maxCount: 10 },
  { name: "onlineCourseWorthItImage", maxCount: 10 }, 
  { name: "syllabusPdf", maxCount: 2 },             
]);

// -------------------------------------------------------------
// Routes
// -------------------------------------------------------------

// Route for creating/getting ALL courses
router.post("/course", courseUploads, createCourse);
router.get("/course", getCourses);

// 2. ⚡ CRITICAL FIX: Group GET/PUT/DELETE by ID and place BEFORE the :slug route
// When the frontend requests /api/v1/course/656c1f198f12a67e43b174b0, 
// this route will be correctly matched first.
router.route("/course/:id")
    .get(getCourseById)    // ⬅️ Handles the course data fetch for the edit modal
    .put(courseUploads, updateCourse)
    .delete(deleteCourse);

// The GET by slug route (placed second to prevent collision with ID)
router.get("/course/slug/:slug", getCourseBySlug);


export default router;