// import express from "express";
// // import verifyUser from "../middelware/authMiddleware.js";
// import uploadPdf from "../middelware/uploadPdf.js";

// import {
//   addApplication,
//   deleteApplication,
//   getAllApplications,
//   getApplicationById,
//   updateApplication,
//   updateApplicationStatus,
// } from "../controller/JobController.js";


// const applyRouter = express.Router();

// /* ----------------------- ADD APPLICATION ----------------------- */
// // Upload fields → resume + additionalDocument
// applyRouter.post(
//   "/",
//   uploadPdf.fields([
//     { name: "resume", maxCount: 1 },
//     { name: "additionalDocument", maxCount: 1 },
//   ]),
//   addApplication
// );

// /* ----------------------- GET ALL APPLICATIONS ----------------------- */
// applyRouter.get("/", getAllApplications);

// /* ----------------------- GET SINGLE APPLICATION BY ID ----------------------- */
// applyRouter.get("/:id",getApplicationById);

// /* ----------------------- UPDATE APPLICATION ----------------------- */
// applyRouter.put(
//   "/:id",
 
//   uploadPdf.fields([
//     { name: "resume", maxCount: 1 },
//     { name: "additionalDocument", maxCount: 1 },
//   ]),
//   updateApplication
// );

// /* ----------------------- DELETE APPLICATION ----------------------- */
// applyRouter.delete("/:id",deleteApplication);

// /* ----------------------- UPDATE STATUS ----------------------- */
// applyRouter.patch("/:id/status", updateApplicationStatus);

// export default applyRouter;

import express from "express";
import {
  addApplication,
  deleteApplication,
  getAllApplications,
  getApplicationById,
  updateApplication,
  updateApplicationStatus,
} from "../controller/JobController.js";

import  uploadPdf from "../middelware/uploadPdf.js";

const applyRouter = express.Router();

applyRouter.post(
  "/",
  uploadPdf.fields([
    { name: "resume", maxCount: 1 },
    { name: "additionalDocument", maxCount: 1 },
  ]),
  addApplication
);

applyRouter.get("/", getAllApplications);
applyRouter.get("/:id", getApplicationById);

applyRouter.put(
  "/:id",
  uploadPdf.fields([
    { name: "resume", maxCount: 1 },
    { name: "additionalDocument", maxCount: 1 },
  ]),
  updateApplication
);

applyRouter.patch("/:id/status", updateApplicationStatus);
applyRouter.delete("/:id", deleteApplication);

export default applyRouter;
