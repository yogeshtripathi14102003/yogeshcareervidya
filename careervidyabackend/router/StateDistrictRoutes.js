import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  bulkUploadStatesDistricts,
  getAllStates,
  getDistrictsByState,
} from "../controller/StateDistrictController.js";

const router = express.Router();

// Public — used by address/location dropdowns across forms
router.get("/states", getAllStates);
router.get("/districts/:state", getDistrictsByState);

// Admin only
router.post(
  "/bulk-upload",
  authMiddleware,
  requireRole(["admin", "subadmin"]),
  bulkUploadStatesDistricts
);

export default router;
