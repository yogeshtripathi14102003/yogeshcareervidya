


// import express from "express";
// import {
//   createLeadAdmission,
//   getAllLeadAdmissions,
//   getLeadAdmissionById,
//   updateLeadAdmission,
//   deleteLeadAdmission,
//   uploadDocuments,
//   getDocuments,
//   deleteDocument,
//   verifyDocument,
//   verifyAllDocuments,
//   getNotifications,
//   markNotificationRead,
//   markAllNotificationsRead,
// } from "../controller/leadadmisonController.js";
// import createLocalUploader from "../config/localMulter.js";

// const router = express.Router();

// const docUploader = createLocalUploader({
//   folder: "uploads/documents",
//   maxFileSizeMB: 10,
//   maxFiles: 20,
// });

// // ⚠️ STATIC ROUTES PEHLE — warna /:id inhein match kar lega

// // =================== NOTIFICATION ROUTES ===================
// router.get( "/notifications",              getNotifications);
// router.put( "/notifications/read-all",     markAllNotificationsRead);
// router.put( "/notifications/:notifId/read",markNotificationRead);

// // =================== ADMISSION ROUTES ===================
// router.post(  "/",      createLeadAdmission);
// router.get(   "/",      getAllLeadAdmissions);
// router.get(   "/:id",   getLeadAdmissionById);
// router.put(   "/:id",   updateLeadAdmission);
// router.delete("/:id",   deleteLeadAdmission);

// // =================== DOCUMENT ROUTES ===================
// router.post(  "/:id/documents",             docUploader.array("documents", 20), uploadDocuments);
// router.get(   "/:id/documents",             getDocuments);
// router.delete("/:id/documents/:docId",      deleteDocument);

// // =================== ADMIN VERIFY ROUTES ===================
// // ⚠️ verify-all pehle, phir :docId — warna "verify-all" ko docId samjhega
// router.put("/:id/documents/verify-all",         verifyAllDocuments);
// router.put("/:id/documents/:docId/verify",      verifyDocument);

// export default router;

import express from "express";
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

const docUploader = createLocalUploader({
  folder: "uploads/documents",
  maxFileSizeMB: 10,
  maxFiles: 20,
});

// =================== NOTIFICATION ROUTES ===================
// 💡 Static sub-resources pehle taaki niche wale strictly catch ho sakein
router.get("/notifications", getNotifications);
router.put("/notifications/read-all", markAllNotificationsRead);
router.put("/notifications/:notifId/read", markNotificationRead);

// =================== ADMISSION ROUTES ===================
router.post("/", createLeadAdmission);
router.get("/", getAllLeadAdmissions);
router.get("/:id", getLeadAdmissionById);
router.put("/:id", updateLeadAdmission);
router.delete("/:id", deleteLeadAdmission);

// =================== DOCUMENT ROUTES ===================
// 💡 array() ki jagah any() lagaya hai taaki parallel request chunks safely ingest ho sakein
router.post("/:id/documents", docUploader.any(), uploadDocuments);
router.get("/:id/documents", getDocuments);
router.delete("/:id/documents/:docId", deleteDocument);

// =================== ADMIN VERIFY ROUTES ===================
// 💡 verify-all dynamic parameter :docId se pehle hai, absolute correct!
router.put("/:id/documents/verify-all", verifyAllDocuments);
router.put("/:id/documents/:docId/verify", verifyDocument);

export default router;