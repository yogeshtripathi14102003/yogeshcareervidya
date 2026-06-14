import express from "express";
import createLocalUploader from "../config/localMulter.js";

import {
  addTeamMember,
  getAllTeamMembers,
  getSingleTeamMember,
  updateTeamMember,
  deleteTeamMember,
} from "../controller/manageTeam.controller.js";

const router = express.Router();

const teamUploader = createLocalUploader({
  folder: "uploads/team",
  maxFileSizeMB: 5,
  maxFiles: 1,
});

router.post(
  "/add",
  teamUploader.single("image"),
  addTeamMember
);

router.put(
  "/:id",
  teamUploader.single("image"),
  updateTeamMember
);

router.get("/", getAllTeamMembers);
router.get("/:id", getSingleTeamMember);
router.delete("/:id", deleteTeamMember);

export default router;