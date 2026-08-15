import express from "express";
import authMiddleware from "../middelware/authMiddleware.js";
import { authenticatedApiLimiter } from "../middelware/rateLimiter.js";
import {
  createQuestion,
  getQuestions,
  getMyQuestions,
  getQuestionById,
  closeQuestion,
  reopenQuestion,
} from "../controller/questionController.js";
import {
  createAnswer,
  updateAnswer,
  markHelpful,
} from "../controller/answerController.js";

const router = express.Router();

// Every Q&A route requires login — asking, browsing, and answering are all
// scoped to logged-in students/staff, not public.
router.use(authMiddleware, authenticatedApiLimiter);

/* ---- Questions ---- */
router.post("/questions", createQuestion);
router.get("/questions/mine", getMyQuestions); // static before dynamic :id
router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionById);
router.patch("/questions/:id/close", closeQuestion);
router.patch("/questions/:id/reopen", reopenQuestion);

/* ---- Answers ---- */
router.post("/questions/:questionId/answers", createAnswer);
router.patch("/answers/:id", updateAnswer);
router.patch("/answers/:id/helpful", markHelpful);

export default router;
