import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import { getSecuritySettings, updateSecuritySettings } from "../controller/securityConfigController.js";

const router = express.Router();
const adminOnly = [authMiddleware, requireRole(["admin", "subadmin"])];

router.get("/", ...adminOnly, getSecuritySettings);
router.put("/", ...adminOnly, updateSecuritySettings);

export default router;
