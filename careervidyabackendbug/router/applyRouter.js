import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  addApplication,
  deleteApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
} from "../controller/JobController.js";

import uploadPdf from "../middelware/uploadPdf.js";

const applyRouter = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// Public — anyone can submit a job application
applyRouter.post(
  "/",
  uploadPdf.fields([
    { name: "resume", maxCount: 1 },
    { name: "additionalDocument", maxCount: 1 },
  ]),
  addApplication
);

// Admin only — applications contain resumes and personal data
applyRouter.get("/", adminOnly, getAllApplications);
applyRouter.get("/:id", adminOnly, getApplicationById);

applyRouter.put(
  "/:id",
  adminOnly,
  uploadPdf.fields([
    { name: "resume", maxCount: 1 },
    { name: "additionalDocument", maxCount: 1 },
  ]),
  updateApplication
);

applyRouter.patch("/:id/status", adminOnly, updateApplicationStatus);
applyRouter.delete("/:id", adminOnly, deleteApplication);

export default applyRouter;
