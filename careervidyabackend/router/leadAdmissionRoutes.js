import express from "express";
import {
  createLeadAdmission,
  getAllLeadAdmissions,
  getLeadAdmissionById,
  updateLeadAdmission,
  deleteLeadAdmission,
} from "../controller/leadadmisonController.js";

const router = express.Router();


router.post("/", createLeadAdmission);


router.get("/", getAllLeadAdmissions);


router.get("/:id", getLeadAdmissionById);


router.put("/:id", updateLeadAdmission);


router.delete("/:id", deleteLeadAdmission);

export default router;