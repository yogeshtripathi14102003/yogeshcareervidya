import express from "express";
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

// ✅ Create new member
router.post("/team", upload.single("image"), createTeamMember);

// ✅ Get all members
router.get("/team", getAllTeamMembers);

// ✅ Get single member by ID
router.get("/team/:id", getTeamMemberById);

// ✅ Update member
router.put("/team/:id", upload.single("image"), updateTeamMember);

// ✅ Delete member
router.delete("/team/:id", deleteTeamMember);

export default router;
