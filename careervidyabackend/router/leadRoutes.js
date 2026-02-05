import express from "express";
import multer from "multer";
import * as ctrl from "../controller/leadController.js";

const router = express.Router();
const upload = multer();

/* ========== COUNSELOR ========== */
router.get("/counselor", ctrl.getCounselors);
router.get("/counselor/:id", ctrl.getCounselor);
router.post("/counselor", ctrl.createCounselor);
router.put("/counselor/:id", ctrl.updateCounselor);
router.delete("/counselor/:id", ctrl.deleteCounselor);
// leadRoutes.js

// GET leads assigned to logged-in counselor


/* ========== LEAD ========== */
router.get("/leads", ctrl.getLeads);
router.get("/leads/:id", ctrl.getLead);
router.post("/leads", ctrl.createLead);
router.put("/leads/:id", ctrl.updateLead);
router.delete("/leads/:id", ctrl.deleteLead);

/* ========== UPLOAD EXCEL ========== */
router.post("/leads/upload", upload.single("file"), ctrl.uploadLeads);

/* ========== ASSIGN SELECTED LEADS ========== */
router.post("/leads/assign-selected", ctrl.assignSelectedLeads);

export default router;
