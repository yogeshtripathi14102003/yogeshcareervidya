import express from "express";
import {
  createGetInTouch,
  getAllGetInTouch,
  deleteGetInTouch,
} from "../controller/getInTouchController.js";

const router = express.Router();

// POST → create new entry
router.post("/", createGetInTouch);

// GET → get all entries
router.get("/", getAllGetInTouch);

// DELETE → delete one
router.delete("/:id", deleteGetInTouch);

export default router;
