// import express from "express";
// import authMiddleware from "../middelware/authMiddleware.js";
// import { authenticatedApiLimiter } from "../middelware/rateLimiter.js";
// import {
//   createQuestion,
//   getQuestions,
//   getMyQuestions,
//   getQuestionById,
//   closeQuestion,
//   reopenQuestion,
// } from "../controller/questionController.js";
// import {
//   createAnswer,
//   updateAnswer,
//   markHelpful,
// } from "../controller/answerController.js";

// const router = express.Router();

// // Every Q&A route requires login — asking, browsing, and answering are all
// // scoped to logged-in students/staff, not public.
// router.use(authMiddleware, authenticatedApiLimiter);

// /* ---- Questions ---- */
// router.post("/questions", createQuestion);
// router.get("/questions/mine", getMyQuestions); // static before dynamic :id
// router.get("/questions", getQuestions);
// router.get("/questions/:id", getQuestionById);
// router.patch("/questions/:id/close", closeQuestion);
// router.patch("/questions/:id/reopen", reopenQuestion);

// /* ---- Answers ---- */
// router.post("/questions/:questionId/answers", createAnswer);
// router.patch("/answers/:id", updateAnswer);
// router.patch("/answers/:id/helpful", markHelpful);

// export default router;


import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { requireRole } from "../middelware/roleMiddleware.js";
import { createQuestion, getQuestions, getMyQuestions, getQuestionById, closeQuestion, reopenQuestion } from "../controllers/questionController.js";
import { createAnswer, updateAnswer, markHelpful } from "../controllers/answerController.js";

const router = express.Router();

const STUDENT = ["user"];
const STAFF = ["admin", "subadmin", "counselor"];

router.use(authMiddleware);

router.post("/questions", requireRole(STUDENT), createQuestion);
router.get("/questions", getQuestions);
router.get("/questions/mine", requireRole(STUDENT), getMyQuestions); // :id se pehle
router.get("/questions/:id", getQuestionById);
router.patch("/questions/:id/close", requireRole(STAFF), closeQuestion);
router.patch("/questions/:id/reopen", requireRole(STAFF), reopenQuestion);

router.post("/questions/:questionId/answers", createAnswer); // controller khud role check karta hai
router.patch("/answers/:id", requireRole(STAFF), updateAnswer);
router.patch("/answers/:id/helpful", requireRole(STUDENT), markHelpful);

export default router;