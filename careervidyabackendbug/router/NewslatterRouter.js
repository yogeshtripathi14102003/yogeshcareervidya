import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import {
  requirePermissions,
  requireRole,
} from "../middelware/roleMiddleware.js";
import { PERMISSIONS } from "../constant/permission.js";
import { publicApiLimiter } from "../middelware/rateLimiter.js";
import {
  addSubscriber,
  confirmSubscription,
  unSubscribe,
  unsubscribeByToken,
  listSubscribers,
  exportSubscribers,
  deleteSubscriber,
  getNewsletterLogs,
  getCampaignDeliveries,
  sendNewsLetter,
  trackOpen,
  trackClick,
  getNewsletterAnalytics,
} from "../controller/NewslatterControllert.js";

const adminNewsletterRouter = express.Router();
const adminOnly = [
  authMiddleware,
  requireRole(["admin", "subadmin"]),
  requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
];

// ---- Public — visitors subscribe/unsubscribe ----
adminNewsletterRouter.post("/subscribe", publicApiLimiter, addSubscriber);
adminNewsletterRouter.post("/unsubscribe", publicApiLimiter, unSubscribe);

// ---- Public — hit directly by email clients / links in emails, no auth possible here ----
adminNewsletterRouter.get("/newsletter/confirm/:token", publicApiLimiter, confirmSubscription);
adminNewsletterRouter.get("/newsletter/unsubscribe/:token", publicApiLimiter, unsubscribeByToken);
adminNewsletterRouter.get("/newsletter/track/open/:token", publicApiLimiter, trackOpen);
adminNewsletterRouter.get("/newsletter/track/click/:token", publicApiLimiter, trackClick);

// ---- Admin only ----
adminNewsletterRouter.get("/subscribers", ...adminOnly, listSubscribers);
adminNewsletterRouter.get("/subscribers/export", ...adminOnly, exportSubscribers);
adminNewsletterRouter.delete("/subscribers/:id", ...adminOnly, deleteSubscriber);
adminNewsletterRouter.get("/logs", ...adminOnly, getNewsletterLogs);
adminNewsletterRouter.get("/logs/:id/deliveries", ...adminOnly, getCampaignDeliveries);
adminNewsletterRouter.post("/send", ...adminOnly, sendNewsLetter);
adminNewsletterRouter.get("/newsletter/analytics", ...adminOnly, getNewsletterAnalytics);

export default adminNewsletterRouter;
