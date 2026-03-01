import express from "express";

import {
  addVideo,
  getVideos,
  deleteVideo,
} from "../controller/VideoController.js";

const router = express.Router();

router.post("/add", addVideo);
router.get("/", getVideos);
router.delete("/:id", deleteVideo);

export default router;