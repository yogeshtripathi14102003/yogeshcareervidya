

// import express from "express";
// import multer from "multer";
// import {
//   addUniversity,
//   getAllUniversities,
//   addCourseToUniversity,
//   deleteUniversity,
//   updateUniversity,
// } from "../controller/universityController.js";

// const router = express.Router();

// // ✅ Use memory storage (for Cloudinary)
// const storage = multer.memoryStorage();

// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
// });

// // ✅ Add a new University (main image + multiple course logos)
// router.post(
//   "/",
//   upload.fields([
//     { name: "universityImage", maxCount: 1 },
//     { name: "courseLogos", maxCount: 20 },
//   ]),
//   addUniversity
// );

// // ✅ Get all universities
// router.get("/", getAllUniversities);

// // ✅ Delete a university
// router.delete("/:id", deleteUniversity);

// // ✅ Update a university
// router.put(
//   "/:id",
//   upload.fields([{ name: "universityImage", maxCount: 1 }]),
//   updateUniversity
// );

// // ✅ Add a course to an existing university (optional future use)
// // router.post("/:id/course", upload.single("logo"), addCourseToUniversity);

// export default router;




import express from "express";
import multer from "multer";
import {
  addUniversity,
  getAllUniversities,
  getUniversityById,
  addCourseToUniversity,
  deleteUniversity,
  updateUniversity,
} from "../controller/universityController.js";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ✅ Add new University
router.post(
  "/",
  upload.fields([
    { name: "universityImage", maxCount: 1 },
    { name: "courseLogos", maxCount: 20 },
  ]),
  addUniversity
);

// ✅ Get all universities
router.get("/", getAllUniversities);

// ✅ Get single university (for frontend expand)
router.get("/:id", getUniversityById);

// ✅ Delete university
router.delete("/:id", deleteUniversity);

// ✅ Update university
router.put(
  "/:id",
  upload.fields([{ name: "universityImage", maxCount: 1 }]),
  updateUniversity
);

export default router;
