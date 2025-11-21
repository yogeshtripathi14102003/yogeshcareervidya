

// router/companyJobRouter.js
import express from "express";
import {
  addJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
} from "../controller/addjobController.js";

const companyJobRouter = express.Router();

// Create job
companyJobRouter.post("/", addJob);

// Get all jobs (with filters)
companyJobRouter.get("/", getAllJobs);

// Get job by jobId
companyJobRouter.get("/:jobId", getJobById);

// Update job by jobId
companyJobRouter.patch("/:jobId", updateJob); 

// Delete job by jobId
companyJobRouter.delete("/:jobId", deleteJob);

export default companyJobRouter;
