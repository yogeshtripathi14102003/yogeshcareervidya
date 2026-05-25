


// import express from "express";
// import multer from "multer";
// import * as ctrl from "../controller/leadController.js";


// const router = express.Router();
// const upload = multer();

// /* ================== COUNSELOR ================== */

// router.get("/counselor", ctrl.getCounselors);
// router.get("/counselor/:id", ctrl.getCounselor);
// router.post("/counselor", ctrl.createCounselor);
// router.put("/counselor/:id", ctrl.updateCounselor);
// router.delete("/counselor/:id", ctrl.deleteCounselor);
// router.delete("/leads/bulk-delete", ctrl.bulkDeleteLeads);
// /* ================== LEADS ================== */

// router.get("/leads", ctrl.getLeads);
// router.get("/leads/:id", ctrl.getLead);
// router.get("/counselor-leads", ctrl.getLeadsByCounselorId);
// router.post("/leads", ctrl.createLead);
// router.put("/leads/:id", ctrl.updateLead);
// router.delete("/leads/:id", ctrl.deleteLead);


// /* ================== EXCEL ================== */

// router.post("/leads/upload", upload.single("file"), ctrl.uploadLeads);

// /* ================== ASSIGN ================== */

// router.post("/leads/assign-selected", ctrl.assignSelectedLeads);

// /* ================== COUNSELOR DASHBOARD ================== */



// export default router;


import express from "express";
import multer from "multer";
import * as ctrl from "../controller/leadController.js";

const router = express.Router();
const upload = multer();

/* ================== COUNSELOR ================== */

router.get("/counselor", ctrl.getCounselors);
router.get("/counselor/:id", ctrl.getCounselor);
router.post("/counselor", ctrl.createCounselor);
router.put("/counselor/:id", ctrl.updateCounselor);
router.delete("/counselor/:id", ctrl.deleteCounselor);

/* ================== LEADS — STATIC ROUTES PEHLE ================== */
// ✅ IMPORTANT: /leads/upload, /leads/bulk-delete, /leads/assign-selected
// yeh sab /:id se PEHLE hone chahiye — warna Express "upload" ko ID samajh leta hai

router.post("/leads/upload", upload.single("file"), ctrl.uploadLeads);
router.post("/leads/assign-selected", ctrl.assignSelectedLeads);
router.delete("/leads/bulk-delete", ctrl.bulkDeleteLeads);

/* ================== LEADS — DYNAMIC ROUTES BAAD MEIN ================== */

router.get("/leads", ctrl.getLeads);
router.post("/leads", ctrl.createLead);
router.get("/leads/:id", ctrl.getLead);
router.put("/leads/:id", ctrl.updateLead);
router.delete("/leads/:id", ctrl.deleteLead);

/* ================== COUNSELOR DASHBOARD ================== */

router.get("/counselor-leads", ctrl.getLeadsByCounselorId);

export default router;