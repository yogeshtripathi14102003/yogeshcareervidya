import express from "express";
import multer from "multer";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createOurStudent,
  getOurStudents,
  deleteOurStudent,
  editOurStudent,
} from "../controller/ourstudentController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const storage = multer.diskStorage({});
const upload = multer({ storage });

// Public — showcased on the site
router.get("/", getOurStudents);

// Admin only
router.post(
  "/",
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  createOurStudent
);

router.delete("/:id", adminOnly, deleteOurStudent);

router.put(
  "/:id",
  adminOnly,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  editOurStudent
);

export default router;
