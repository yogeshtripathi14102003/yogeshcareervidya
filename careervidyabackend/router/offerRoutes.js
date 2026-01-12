import express from "express";
import {
  createContent,
  getAllContent,
  getByType,
  getContentById,
  updateContent,
  deleteContent,
} from "../controller/OfferController.js";

const router = express.Router();

// ===== CREATE =====
router.post("/", createContent); // create offer / subsidy / brochure

// ===== READ =====
router.get("/", getAllContent);              // get all content
router.get("/type/:type", getByType);        // get content by type (offer | subsidy | brochure)
router.get("/:id", getContentById);          // get content by ID

// ===== UPDATE =====
router.put("/:id", updateContent);           // update content by ID

// ===== DELETE =====
router.delete("/:id", deleteContent);        // delete content by ID

export default router;
