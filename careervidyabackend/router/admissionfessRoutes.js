import express from "express";
import {
  createAdmissionFees,
  getAllAdmissionFees,
  getAdmissionFeesById,
  updateAdmissionFees,
  deleteAdmissionFees,
  bulkAdmissionFeesUpload,
} from "../controller/admissionfessController.js";

const router = express.Router();

/* ================= Admission Fees Routes ================= */

// ✅ Create Admission Fees
router.post("/add", createAdmissionFees);              // Manual Add
router.post("/bulk-upload", bulkAdmissionFeesUpload);  // Bulk Add

// ✅ Read Admission Fees
router.get("/all", getAllAdmissionFees);              // Get All
router.get("/:id", getAdmissionFeesById);             // Get By ID

// ✅ Update Admission Fees
router.put("/update/:id", updateAdmissionFees);       // Update By ID

// ✅ Delete Admission Fees
router.delete("/delete/:id", deleteAdmissionFees);    // Delete By ID

export default router;
