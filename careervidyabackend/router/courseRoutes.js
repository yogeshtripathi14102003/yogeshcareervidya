
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

// // All upload fields based on your model
// const courseUploads = upload.fields([
//   { name: "courseLogo", maxCount: 1 },

//   // Overview section (multiple images)
//   { name: "overviewImages", maxCount: 10 },

//   // Why choose us section (multiple images)
//   { name: "whyChooseUsImages", maxCount: 10 },

//   // Online course worth it image
//   { name: "worthItImage", maxCount: 1 },

//   // ⭐ NEW FIELD: Syllabus PDF / File Upload
//   { name: "syllabusFile", maxCount: 1 },
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
  updateCourse,
  deleteCourse,
} from "../controller/courseController.js";

const router = express.Router();

// Cloudinary uploader
const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 30,
});

// ⚡ Correct field names matching the controller
const courseUploads = upload.fields([
  { name: "courseLogo", maxCount: 1 },
  { name: "overviewImages", maxCount: 10 },
  { name: "whyChooseUsImages", maxCount: 10 },
  { name: "onlineCourseWorthItImage", maxCount: 1 }, // ✔ matches controller
  { name: "syllabusPdf", maxCount: 1 },             // ✔ matches controller
]);

// Routes
router.post("/course", courseUploads, createCourse);
router.get("/course", getCourses);
router.get("/course/:slug", getCourseBySlug);
router.put("/course/:id", courseUploads, updateCourse);
router.delete("/course/:id", deleteCourse);

export default router;
