// import express from "express";
// import {
//   addSubscriber,
//   listSubscribers,
//   sendNewsLetter,
//   unSubscribe,
// } from "../controller/NewslatterControllert.js";
// // import authMiddleware from "../middelware/authMiddleware.js";
// import {
//   requirePermissions,
//   requireRole,
// } from "../middelware/roleMiddleware.js";

// import { PERMISSIONS } from "../constant/permission.js";

// const adminNewsletterRouter = express.Router();

// adminNewsletterRouter.post("/subscribe", addSubscriber);
// adminNewsletterRouter.post("/unsubscribe", unSubscribe);

// // admin only
// adminNewsletterRouter.get(
//   "/subscribers",

//   requireRole(["admin", "subadmin"]),
//   requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
//   listSubscribers
// );

// adminNewsletterRouter.post(
//   "/send",
 
//   requireRole(["admin", "subadmin"]),
//   requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
//   sendNewsLetter
// );

// export default adminNewsletterRouter;


import express from "express";
import {
  addSubscriber,
  listSubscribers,
  sendNewsLetter,
  unSubscribe,
  getNewsletterLogs
} from "../controller/NewslatterControllert.js";

// import {
//   requirePermissions,
//   requireRole,
// } from "../middelware/roleMiddleware.js";

// import { PERMISSIONS } from "../constant/permission.js";

const adminNewsletterRouter = express.Router();

adminNewsletterRouter.post("/subscribe", addSubscriber);
adminNewsletterRouter.post("/unsubscribe", unSubscribe);

// admin only
adminNewsletterRouter.get(
  "/subscribers",
  // requireRole(["admin", "subadmin"]),
  // requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
  listSubscribers
);

// NEW ROUTE ADDED (FIX)
adminNewsletterRouter.get(
  "/logs",
  // requireRole(["admin", "subadmin"]),
  // requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
  getNewsletterLogs
);

adminNewsletterRouter.post(
  "/send",
  // requireRole(["admin", "subadmin"]),
  // requirePermissions(PERMISSIONS.MANAGE_NEWSLETTER),
  sendNewsLetter
);

export default adminNewsletterRouter;
