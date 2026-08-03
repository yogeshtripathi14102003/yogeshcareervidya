import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createAdmission,
  getAdmissions,
  getAdmissionById,
  updateAdmission,
  deleteAdmission,
  verifyAdmission,
  getStatusByEmail,
} from "../controller/admissionController.js";

import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();
const staff = [authMiddleware, requireRole(["admin", "subadmin", "counselor"])];

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "admissions",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

/** 1. STATUS CHECK — must be logged in; controller enforces the caller can
 *  only look up their own email unless they're staff (admin/subadmin/counselor).
 */
router.get("/status", authMiddleware, getStatusByEmail);

/** 2. CREATE ADMISSION (Public — applicant submits the form) */
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

/** 3-5. Everything else touches applicant PII (Aadhaar/PAN) — staff only */
router.get("/", ...staff, getAdmissions);
router.get("/:id", ...staff, getAdmissionById);

router.put(
  "/:id",
  ...staff,
  upload.fields([
    { name: "aadhaarNumber", maxCount: 1 },
    { name: "panNumber", maxCount: 1 },
    { name: "photo", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]),
  updateAdmission
);

router.delete("/:id", ...staff, deleteAdmission);
router.patch("/:id/verify", ...staff, verifyAdmission);

export default router;
