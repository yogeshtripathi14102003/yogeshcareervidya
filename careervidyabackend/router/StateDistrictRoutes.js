import express from "express";
import {
  bulkUploadStatesDistricts,
  getAllStates,
  getDistrictsByState,
} from "../controller/StateDistrictController.js";

const router = express.Router();

router.post("/bulk-upload", bulkUploadStatesDistricts);
router.get("/states", getAllStates);
router.get("/districts/:state", getDistrictsByState);

export default router;
