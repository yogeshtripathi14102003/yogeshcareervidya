import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  addVideo,
  getVideos,
  deleteVideo,
} from "../controller/VideoController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

router.get("/", getVideos); // public — shown on the site
router.post("/add", adminOnly, addVideo);
router.delete("/:id", adminOnly, deleteVideo);

export default router;
