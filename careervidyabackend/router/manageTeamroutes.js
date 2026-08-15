import express from "express";
import createLocalUploader from "../config/localMulter.js";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";

import {
  addTeamMember,
  getAllTeamMembers,
  getSingleTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controller/manageTeam.controller.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

const teamUploader = createLocalUploader({
  folder: "uploads/team",
  maxFileSizeMB: 5,
  maxFiles: 1,
});

// Internal HR/employee team management — admin only throughout
router.get("/", adminOnly, getAllTeamMembers);
router.get("/:id", adminOnly, getSingleTeamMember);
router.post("/add", adminOnly, teamUploader.single("image"), addTeamMember);
router.put("/:id", adminOnly, teamUploader.single("image"), updateTeamMember);
router.delete("/:id", adminOnly, deleteTeamMember);

export default router;
