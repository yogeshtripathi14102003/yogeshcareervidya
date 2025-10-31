import express from "express";
import {
  addUniversity,
  getAllUniversities,
  addCourseToUniversity,
} from "../controller/universityController.js";

const router = express.Router();

router.post("/", addUniversity); // ➕ Add a new university
router.get("/", getAllUniversities); // 📋 Get all universities
router.post("/:id/course", addCourseToUniversity); // ➕ Add a new course to existing university

export default router;
