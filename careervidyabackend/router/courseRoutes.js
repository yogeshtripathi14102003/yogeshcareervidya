

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

// ✅ Cloudinary-based uploader
const upload = createUploader({
  folder: "courses",
  maxFileSizeMB: 10,
  maxFiles: 20,
});

// ✅ Routes
router.post("/course", upload.any(), createCourse);
router.get("/course", getCourses);
router.get("/course/:slug", getCourseBySlug);
router.put("/course/:id", upload.any(), updateCourse);
router.delete("/course/:id", deleteCourse);

export default router;

