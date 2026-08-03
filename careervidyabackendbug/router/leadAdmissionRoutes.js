import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createLeadAdmission,
  getAllLeadAdmissions,
  getLeadAdmissionById,
  updateLeadAdmission,
  deleteLeadAdmission,
  uploadDocuments,
  getDocuments,
  deleteDocument,
  verifyDocument,
  verifyAllDocuments,
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from "../controller/leadadmisonController.js";
import createLocalUploader from "../config/localMulter.js";

const router = express.Router();

// Contains applicant identity documents (Aadhaar/PAN/photos) — staff only
router.use(authMiddleware, requireRole(["admin", "subadmin", "counselor"]));

const docUploader = createLocalUploader({
  folder: "uploads/documents",
  maxFileSizeMB: 10,
  maxFiles: 20,
});

// ⚠️ STATIC ROUTES FIRST — otherwise "/:id" would swallow them

// =================== NOTIFICATIONS ===================
router.get("/notifications", getNotifications);
router.put("/notifications/read-all", markAllNotificationsRead);
router.put("/notifications/:notifId/read", markNotificationRead);

// =================== ADMISSIONS ===================
router.post("/", createLeadAdmission);
router.get("/", getAllLeadAdmissions);
router.get("/:id", getLeadAdmissionById);
router.put("/:id", updateLeadAdmission);
router.delete("/:id", deleteLeadAdmission);

// =================== DOCUMENTS ===================
router.post("/:id/documents", docUploader.array("documents", 20), uploadDocuments);
router.get("/:id/documents", getDocuments);
router.delete("/:id/documents/:docId", deleteDocument);

// =================== ADMIN VERIFY ===================
// Intentionally admin/subadmin only, not the broader "staff" gate above —
// a counselor verifying their own uploaded documents would defeat the
// point of the check. Only admin pages call these endpoints.
const adminOnly = requireRole(["admin", "subadmin"]);
router.put("/:id/documents/verify-all", adminOnly, verifyAllDocuments);
router.put("/:id/documents/:docId/verify", adminOnly, verifyDocument);

export default router;
