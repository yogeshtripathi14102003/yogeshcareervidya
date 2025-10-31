import express from "express";
import { createCourse, getCourses, deleteCourse } from "../controller/courseController.js";


const router = express.Router();

router.post("/course", createCourse);      // Create new course
router.get("/course",getCourses );      // Get all courses
router.delete("/course:id", deleteCourse); // Delete course

export default router;
