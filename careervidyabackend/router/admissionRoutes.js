import express from "express";
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
// import { protect } from "../middleware/authMiddleware.js"; // Agar admin protection use kar rahe hain

const router = express.Router();

// ================= Cloudinary storage =================
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: "admissions",
    resource_type: "auto",
    public_id: `${Date.now()}-${file.originalname}`,
  }),
});

const upload = multer({ storage });

// ================= ROUTES =================

/** * 1. STATUS CHECK (Public Route)
 * Ise sabse upar rakhein taaki Express "/status" ko ":id" na samajhle.
 */
router.get("/status", getStatusByEmail);

/** * 2. CREATE ADMISSION (Public Route)
 */
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

/** * 3. GET ALL ADMISSIONS (Admin Route)
 */
router.get("/", getAdmissions); 

/** * 4. ID BASED ROUTES (Hamesha niche rakhein)
 */
router.get("/:id", getAdmissionById);

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

router.delete("/:id", deleteAdmission);

/** * 5. VERIFICATION ROUTE
 */
router.patch("/:id/verify", verifyAdmission);

export default router;