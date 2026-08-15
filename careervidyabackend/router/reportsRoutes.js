import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  getReportPreview,
  exportReportSpreadsheet,
  exportReportPDF,
} from "../controller/reportsController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

router.get("/preview", ...adminOnly, getReportPreview);
router.get("/export/spreadsheet", ...adminOnly, exportReportSpreadsheet); // ?format=xlsx|csv
router.get("/export/pdf", ...adminOnly, exportReportPDF);

export default router;
