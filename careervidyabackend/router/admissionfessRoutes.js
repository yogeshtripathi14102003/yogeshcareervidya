import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createAdmissionFees,
  getAllAdmissionFees,
  getAdmissionFeesById,
  updateAdmissionFees,
  deleteAdmissionFees,
  bulkAdmissionFeesUpload,
} from "../controller/admissionfessController.js";

const router = express.Router();

// Financial records — staff only, no public access
router.use(authMiddleware, requireRole(["admin", "subadmin", "counselor"]));

router.post("/add", createAdmissionFees);
router.post("/bulk-upload", bulkAdmissionFeesUpload);

router.get("/all", getAllAdmissionFees);
router.get("/:id", getAdmissionFeesById);

router.put("/update/:id", updateAdmissionFees);

router.delete("/delete/:id", deleteAdmissionFees);

export default router;
