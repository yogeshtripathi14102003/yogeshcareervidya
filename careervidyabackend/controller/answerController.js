import Question from "../models/QA/Question.js";
import Answer from "../models/QA/Answer.js";
import { sanitizeRichText } from "../utilities/sanitizeRichText.js";
import { notifyCounselor, notifyStudent } from "../utilities/notifyCounselor.js";
import { emitToAdmins } from "../socket.js";

const isStaff = (role) => ["admin", "subadmin", "counselor"].includes(role);

// Notifies whoever needs to know about new Q&A activity. Staff identity is
// split across two collections (Counselor vs Student-for-admin/subadmin),
// and only counselors have a private per-user notification room — admins
// only have the shared "admins" broadcast room — so this routes each case
// through whichever channel actually reaches that kind of recipient.
const notifyAnswerAuthor = (authorType, authorId, payload) => {
  if (authorType === "counselor") {
    return notifyCounselor(authorId, payload);
  }
  // admin/subadmin — no private room exists for them individually yet,
  // so this goes out as a broadcast to everyone currently on an admin
  // dashboard, same pattern Module 8 already uses for manager alerts.
  return emitToAdmins("notification:new", {
    type: payload.type,
    title: payload.title,
    message: payload.message,
    question: payload.question,
    createdAt: new Date(),
  });
};

/* =====================================================
   CREATE ANSWER — staff top-level answer, or a student's reply to one
===================================================== */
export const createAnswer = async (req, res) => {
  try {
    const { body, parentAnswer } = req.body;
    if (!body?.trim()) return res.status(400).json({ success: false, message: "Answer body is required." });

    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    if (question.status === "closed") {
      return res.status(400).json({ success: false, message: "This discussion is closed." });
    }

    const role = req.user.role;
    const isReply = !!parentAnswer;

    // Only the question's own student may reply on an answer thread;
    // only staff may post a fresh top-level answer.
    if (isReply) {
      if (String(question.student) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: "Only the question's author can reply here." });
      }
      const parent = await Answer.findById(parentAnswer);
      if (!parent || String(parent.question) !== String(question._id)) {
        return res.status(400).json({ success: false, message: "Invalid answer to reply to." });
      }
    } else if (!isStaff(role)) {
      return res.status(403).json({ success: false, message: "Only staff can post a new answer." });
    }

    const authorType = isReply ? "student" : role; // role is admin/subadmin/counselor here (checked above)

    const answer = await Answer.create({
      question: question._id,
      authorId: req.user._id,
      authorType,
      authorName: req.user.name,
      body: sanitizeRichText(body.trim()),
      parentAnswer: parentAnswer || null,
    });

    if (isReply) {
      // Notify whoever wrote the answer being replied to.
      const parent = await Answer.findById(parentAnswer).select("authorType authorId").lean();
      if (isStaff(parent.authorType)) {
        notifyAnswerAuthor(parent.authorType, parent.authorId, {
          type: "qa_new_reply",
          title: "New reply on your answer",
          message: `${req.user.name} replied to your answer on "${question.title}".`,
          question: question._id,
        });
      }
    } else {
      await Question.updateOne({ _id: question._id }, { $inc: { answerCount: 1 } });
      notifyStudent(question.student, {
        type: "qa_new_answer",
        title: "Your question got an answer",
        message: `${req.user.name} answered: "${question.title}".`,
        question: question._id,
      });
    }

    res.status(201).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   EDIT ANSWER — original staff author only
===================================================== */
export const updateAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) return res.status(400).json({ success: false, message: "Answer body is required." });

    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ success: false, message: "Answer not found" });

    // Ownership check is scoped to staff-authored top-level answers,
    // matching the spec ("Admin/Counselor can edit answers") — a student's
    // own reply has authorType "student" while their role is "user", so
    // this correctly can't match for replies. Editing replies isn't a
    // requested feature; admins can still edit anyone's answer as a
    // moderation fallback.
    const isOwnAnswer = String(answer.authorId) === String(req.user._id) && answer.authorType === req.user.role;
    const isAdmin = ["admin", "subadmin"].includes(req.user.role);
    if (!isOwnAnswer && !isAdmin) {
      return res.status(403).json({ success: false, message: "You can only edit your own answers." });
    }

    answer.body = sanitizeRichText(body.trim());
    answer.edited = true;
    answer.editedAt = new Date();
    await answer.save();

    res.status(200).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   MARK HELPFUL — only the question's own student, only on top-level answers
===================================================== */
export const markHelpful = async (req, res) => {
  try {
    const answer = await Answer.findById(req.params.id).populate("question", "student");
    if (!answer) return res.status(404).json({ success: false, message: "Answer not found" });
    if (answer.parentAnswer) {
      return res.status(400).json({ success: false, message: "Only top-level answers can be marked helpful." });
    }
    if (String(answer.question.student) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: "Only the question's author can mark this helpful." });
    }

    answer.isHelpful = !answer.isHelpful;
    await answer.save();

    res.status(200).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
