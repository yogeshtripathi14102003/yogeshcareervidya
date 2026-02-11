


import express from "express";
import multer from "multer";
import * as ctrl from "../controller/leadController.js";
import authMiddleware from "../middelware/authMiddleware.js";

const router = express.Router();
const upload = multer();

/* ================== COUNSELOR ================== */

router.get("/counselor", ctrl.getCounselors);
router.get("/counselor/:id", ctrl.getCounselor);
router.post("/counselor", ctrl.createCounselor);
router.put("/counselor/:id", ctrl.updateCounselor);
router.delete("/counselor/:id", ctrl.deleteCounselor);

/* ================== LEADS ================== */

router.get("/leads", ctrl.getLeads);
router.get("/leads/:id", ctrl.getLead);
router.post("/leads", ctrl.createLead);
router.put("/leads/:id", ctrl.updateLead);
router.delete("/leads/:id", ctrl.deleteLead);

/* ================== EXCEL ================== */

router.post("/leads/upload", upload.single("file"), ctrl.uploadLeads);

/* ================== ASSIGN ================== */

router.post("/leads/assign-selected", ctrl.assignSelectedLeads);

/* ================== COUNSELOR DASHBOARD ================== */

router.get("/my-leads",authMiddleware,  ctrl.getMyLeads);

export default router;
