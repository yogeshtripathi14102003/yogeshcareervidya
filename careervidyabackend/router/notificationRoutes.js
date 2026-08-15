import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import {
  getNotifications,
  getNotificationById,
  createNotification,
  updateNotification,
  deleteNotification,
} from "../controller/notificationController.js";

const router = express.Router();
// Internal notifications — staff only
const staff = [authMiddleware, requireRole(["admin", "subadmin", "counselor"])];
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

router.get("/",  getNotifications);
router.get("/:id", ...staff, getNotificationById);
router.post("/", ...adminOnly, createNotification);
router.put("/:id", ...adminOnly, updateNotification);
router.delete("/:id", ...adminOnly, deleteNotification);

export default router;
