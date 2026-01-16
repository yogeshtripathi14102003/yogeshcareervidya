import express from "express";
import {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  verifyAdmission,
} from "../controller/admissionController.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// ================= Cloudinary storage =================
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "admissions",            // folder in Cloudinary
    resource_type: "auto",           // image/pdf/other
    public_id: `${Date.now()}-${file.originalname}`, // unique name
  }),
});

const upload = multer({ storage });

// ================= ROUTES =================

// CREATE Admission
router.post(
  "/",
  upload.fields([
    { name: "aadhaarNumber", maxCount: 1 },
    { name: "panNumber", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  createAdmission
);

// GET All Admissions
router.get("/", getAdmissions);

// GET Admission by ID
router.get("/:id", getAdmissionById);

// UPDATE Admission
router.put(
  "/:id",
  upload.fields([
    { name: "aadhaarNumber", maxCount: 1 },
    { name: "panNumber", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateAdmission
);

// DELETE Admission
router.delete("/:id", deleteAdmission);
router.patch("/:id/verify", verifyAdmission);

export default router;
