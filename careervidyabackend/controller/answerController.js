import Question from "../models/QA/Question.js";
import Answer from "../models/QA/Answer.js";
import { sanitizeRichText } from "../utilities/sanitizeRichText.js";
import { notifyCounselor, notifyStudent } from "../utilities/notifyCounselor.js";
import { emitToAdmins } from "../socket.js";

const STAFF_ROLES = ["admin", "subadmin", "counselor"];
// Agar aapke DB mein student ka role sirf "user" hai to "student" hata sakte hain
const STUDENT_ROLES = ["user", "student"];

const isStaff = (role) => STAFF_ROLES.includes(role);
const isStudent = (role) => STUDENT_ROLES.includes(role);

// Notification kabhi bhi main request ko fail na kare
const safeNotify = async (fn) => {
  try {
    await fn();
  } catch (err) {
    console.error("Notification failed:", err.message);
  }
};

// Counselor ko private room, admin/subadmin ko "admins" broadcast
const notifyAnswerAuthor = (authorType, authorId, payload) => {
  if (authorType === "counselor") {
    return notifyCounselor(authorId, payload);
  }
  return emitToAdmins("notification:new", {
    type: payload.type,
    title: payload.title,
    message: payload.message,
    question: payload.question,
    createdAt: new Date(),
  });
};

/* =====================================================
   CREATE ANSWER — staff top-level answer, ya student ka reply
===================================================== */
export const createAnswer = async (req, res) => {
  try {
    const { body, parentAnswer } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ success: false, message: "Answer body is required." });
    }

    const question = await Question.findById(req.params.questionId);
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    if (question.status === "closed") {
      return res.status(400).json({ success: false, message: "This discussion is closed." });
    }

    const role = req.user.role;
    const isReply = !!parentAnswer;
    let parent = null;

    if (isReply) {
      // Reply: sirf us question ka apna student
      if (!isStudent(role) || String(question.student) !== String(req.user._id)) {
        return res.status(403).json({ success: false, message: "Only the question's author can reply here." });
      }

      parent = await Answer.findById(parentAnswer).lean();
      if (!parent || String(parent.question) !== String(question._id)) {
        return res.status(400).json({ success: false, message: "Invalid answer to reply to." });
      }
      if (parent.parentAnswer) {
        return res.status(400).json({ success: false, message: "You can only reply to a top-level answer." });
      }
    } else if (!isStaff(role)) {
      // Naya top-level answer: sirf staff
      return res.status(403).json({ success: false, message: "Only staff can post a new answer." });
    }

    const authorType = isReply ? "student" : role;

    const answer = await Answer.create({
      question: question._id,
      authorId: req.user._id,
      authorType,
      authorName: req.user.name,
      body: sanitizeRichText(body.trim()),
      parentAnswer: isReply ? parentAnswer : null,
    });

    if (isReply) {
      // Jis staff ka answer hai usko batao
      if (isStaff(parent.authorType)) {
        await safeNotify(() =>
          notifyAnswerAuthor(parent.authorType, parent.authorId, {
            type: "qa_new_reply",
            title: "New reply on your answer",
            message: `${req.user.name} replied to your answer on "${question.title}".`,
            question: question._id,
          })
        );
      }
    } else {
      await Question.updateOne({ _id: question._id }, { $inc: { answerCount: 1 } });
      await safeNotify(() =>
        notifyStudent(question.student, {
          type: "qa_new_answer",
          title: "Your question got an answer",
          message: `${req.user.name} answered: "${question.title}".`,
          question: question._id,
        })
      );
    }

    res.status(201).json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   EDIT ANSWER — apna staff answer, ya admin/subadmin kisi ka bhi
===================================================== */
export const updateAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    if (!body?.trim()) {
      return res.status(400).json({ success: false, message: "Answer body is required." });
    }

    const answer = await Answer.findById(req.params.id);
    if (!answer) return res.status(404).json({ success: false, message: "Answer not found" });

    const role = req.user.role;
    const isOwnAnswer =
      isStaff(role) &&
      String(answer.authorId) === String(req.user._id) &&
      answer.authorType === role;
    const isAdmin = ["admin", "subadmin"].includes(role);

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
   MARK HELPFUL — sirf question ka apna student, sirf top-level answer par
===================================================== */
export const markHelpful = async (req, res) => {
  try {
    if (!isStudent(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Only the question's author can mark this helpful." });
    }

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