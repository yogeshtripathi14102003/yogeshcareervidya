import express from "express";
import multer from "multer";
import {
  createOurStudent,
  getOurStudents,
  deleteOurStudent,
} from "../controller/ourstudentController.js";

const router = express.Router();

// Configure multer for handling multiple file fields
const storage = multer.diskStorage({}); // empty means use default temp storage
const upload = multer({ storage });

// Upload both image + companyLogo
router.post(
  "/",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "companyLogo", maxCount: 1 },
  ]),
  createOurStudent
);

router.get("/", getOurStudents);
router.delete("/:id", deleteOurStudent);

export default router;
