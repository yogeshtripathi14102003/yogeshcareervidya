

// import express from "express";
// import createUploader from "../multer.js";
// import {
//   createCourse,
//   getCourses,
//   getCourseBySlug,
//   deleteCourse,
//   updateCourse,
// } from "../controller/courseController.js";

// const router = express.Router();

// // ✅ create uploader instance for course images
// const upload = createUploader({ folder: "courses" });

// // ✅ Accept all image fields dynamically
// router.post("/course", upload.any(), createCourse);
// router.put("/course/:id", upload.single("courseLogo"), updateCourse);
// router.get("/course", getCourses);
// router.get("/course/:slug", getCourseBySlug);
// router.delete("/course/:id", deleteCourse);


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

// ✅ Cloudinary-based uploader
const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 20,
});

// ✅ Define expected multiple file fields
const courseUploads = upload.fields([
  { name: "courseLogo", maxCount: 1 },
  { name: "overviewImages", maxCount: 10 },
  { name: "whyChooseUsImages", maxCount: 10 },
]);

// ✅ Routes
router.post("/course", courseUploads, createCourse);
router.get("/course", getCourses);
router.get("/course/:slug", getCourseBySlug);
router.put("/course/:id", courseUploads, updateCourse);
router.delete("/course/:id", deleteCourse);

export default router;
