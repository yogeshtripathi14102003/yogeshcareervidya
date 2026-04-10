import express from "express";
import {
  createLeadAdmission,
  getAllLeadAdmissions,
  getLeadAdmissionById,
  updateLeadAdmission,
  deleteLeadAdmission,
} from "../controller/leadadmisonController.js";
import authMiddleware from "../middelware/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, createLeadAdmission);


router.get("/", authMiddleware, getAllLeadAdmissions);


router.get("/:id", authMiddleware, getLeadAdmissionById);


router.put("/:id", authMiddleware, updateLeadAdmission);


router.delete("/:id", authMiddleware, deleteLeadAdmission);

export default router;