import express from "express";
import {
  addSubscriber,
  listSubscribers,
  sendNewsLetter,
  unSubscribe,
} from "../controller/NewslatterControllert.js";
import authMiddleware from "../middelware/authMiddleware.js";
import {
  requirePermissions,
  requireRole,
} from "../middelware/roleMiddleware.js";

import { PERMISSIONS } from "../constant/permission.js";

const adminNewsletterRouter = express.Router();

adminNewsletterRouter.post("/subscribe", addSubscriber);
adminNewsletterRouter.post("/unsubscribe", unSubscribe);

// admin only
adminNewsletterRouter.get(
  "/subscribers",
  authMiddleware,
  requireRole(["admin", "subadmin"]),
  requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
  listSubscribers
);

adminNewsletterRouter.post(
  "/send",
  authMiddleware,
  requireRole(["admin", "subadmin"]),
  requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
  sendNewsLetter
);

export default adminNewsletterRouter;
