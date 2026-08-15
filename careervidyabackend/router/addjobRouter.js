import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  addJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controller/addjobController.js";

const companyJobRouter = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// Public — job listings are shown on the careers page
companyJobRouter.get("/", getAllJobs);
companyJobRouter.get("/:jobId", getJobById);

// Admin only
companyJobRouter.post("/", adminOnly, addJob);
companyJobRouter.patch("/:jobId", adminOnly, updateJob);
companyJobRouter.delete("/:jobId", adminOnly, deleteJob);

export default companyJobRouter;
