import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  createContent,
  getAllContent,
  getByType,
  getContentById,
  updateContent,
  deleteContent,
} from "../controller/OfferController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

// Public — offers/subsidies/brochures are shown to site visitors
router.get("/", getAllContent);
router.get("/type/:type", getByType);
router.get("/:id", getContentById);

// Admin only
router.post("/", adminOnly, createContent);
router.put("/:id", adminOnly, updateContent);
router.delete("/:id", adminOnly, deleteContent);

export default router;
