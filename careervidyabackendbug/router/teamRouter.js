import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createTeamMember,
  getAllTeamMembers,
  getTeamMemberById,
  updateTeamMember,
  deleteTeamMember,
} from "../controller/TeamController.js";
import createUploader from "../multer.js";

const router = express.Router();
const upload = createUploader({ folder: "team" });
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// Public — displayed on the "Our Team" page
router.get("/team", getAllTeamMembers);
router.get("/team/:id", getTeamMemberById);

// Admin only
router.post("/team", adminOnly, upload.single("image"), createTeamMember);
router.put("/team/:id", adminOnly, upload.single("image"), updateTeamMember);
router.delete("/team/:id", adminOnly, deleteTeamMember);

export default router;
