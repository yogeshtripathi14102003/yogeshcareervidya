// import Question, { QUESTION_CATEGORIES } from "../models/QA/Question.js";
// import Answer from "../models/QA/Answer.js";
// import { sanitizeRichText } from "../utilities/sanitizeRichText.js";

// const isStaff = (role) => ["admin", "subadmin", "counselor","user"].includes(role);

// /* =====================================================
//    CREATE — students only
// ===================================================== */
// export const createQuestion = async (req, res) => {
//   try {
//     if (req.user?.role !== "user") {
//       return res.status(403).json({ success: false, message: "Only students can ask questions." });
//     }

//     const { title, body, category, tags } = req.body;
//     if (!title?.trim() || !body?.trim()) {
//       return res.status(400).json({ success: false, message: "Title and question body are required." });
//     }

//     const question = await Question.create({
//       student: req.user._id,
//       title: title.trim(),
//       body: sanitizeRichText(body),
//       category: QUESTION_CATEGORIES.includes(category) ? category : "General",
//       tags: Array.isArray(tags) ? tags.slice(0, 5).map((t) => String(t).trim().toLowerCase()).filter(Boolean) : [],
//     });

//     res.status(201).json({ success: true, data: question });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    LIST — search, category/tag/status filter, pagination
//    (any logged-in role — students browsing, staff moderating)
// ===================================================== */
// export const getQuestions = async (req, res) => {
//   try {
//     const { page = 1, limit = 15, search, category, tag, status } = req.query;

//     const filter = {};
//     if (search?.trim()) filter.$text = { $search: search.trim() };
//     if (category && QUESTION_CATEGORIES.includes(category)) filter.category = category;
//     if (tag) filter.tags = tag.toLowerCase();
//     if (status === "open" || status === "closed") filter.status = status;

//     const [questions, total] = await Promise.all([
//       Question.find(filter)
//         .populate("student", "name")
//         .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
//         .skip((page - 1) * limit)
//         .limit(Number(limit))
//         .lean(),
//       Question.countDocuments(filter),
//     ]);

//     res.status(200).json({
//       success: true,
//       data: questions,
//       total,
//       page: Number(page),
//       totalPages: Math.ceil(total / limit),
//       categories: QUESTION_CATEGORIES,
//     });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    MY QUESTIONS — the logged-in student's own
// ===================================================== */
// export const getMyQuestions = async (req, res) => {
//   try {
//     const { page = 1, limit = 15 } = req.query;
//     const filter = { student: req.user._id };

//     const [questions, total] = await Promise.all([
//       Question.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
//       Question.countDocuments(filter),
//     ]);

//     res.status(200).json({ success: true, data: questions, total, page: Number(page), totalPages: Math.ceil(total / limit) });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    GET ONE — full thread (question + threaded answers), bumps view count
// ===================================================== */
// export const getQuestionById = async (req, res) => {
//   try {
//     const question = await Question.findByIdAndUpdate(
//       req.params.id,
//       { $inc: { views: 1 } },
//       { new: true }
//     ).populate("student", "name");

//     if (!question) return res.status(404).json({ success: false, message: "Question not found" });

//     const answers = await Answer.find({ question: question._id }).sort({ createdAt: 1 }).lean();

//     // Thread top-level answers with their reply chains for the frontend.
//     const topLevel = answers.filter((a) => !a.parentAnswer);
//     const replies = answers.filter((a) => a.parentAnswer);
//     const threaded = topLevel.map((a) => ({
//       ...a,
//       replies: replies.filter((r) => String(r.parentAnswer) === String(a._id)),
//     }));

//     res.status(200).json({ success: true, question, answers: threaded });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// /* =====================================================
//    CLOSE DISCUSSION — admin/counselor only
// ===================================================== */
// export const closeQuestion = async (req, res) => {
//   try {
//     if (!isStaff(req.user?.role)) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }

//     const question = await Question.findByIdAndUpdate(
//       req.params.id,
//       { $set: { status: "closed" } },
//       { new: true }
//     );
//     if (!question) return res.status(404).json({ success: false, message: "Question not found" });

//     res.status(200).json({ success: true, data: question });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// export const reopenQuestion = async (req, res) => {
//   try {
//     if (!isStaff(req.user?.role)) {
//       return res.status(403).json({ success: false, message: "Access denied" });
//     }
//     const question = await Question.findByIdAndUpdate(req.params.id, { $set: { status: "open" } }, { new: true });
//     if (!question) return res.status(404).json({ success: false, message: "Question not found" });
//     res.status(200).json({ success: true, data: question });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };


import mongoose from "mongoose";
import Question, {
  QUESTION_CATEGORIES,
} from "../models/QA/Question.js";
import Answer from "../models/QA/Answer.js";
import { sanitizeRichText } from "../utilities/sanitizeRichText.js";

const STAFF_ROLES = ["admin", "subadmin", "counselor"];

const isStaff = (role) => STAFF_ROLES.includes(role);

const isValidObjectId = (id) =>
  mongoose.Types.ObjectId.isValid(id);

const getPagination = (page, limit) => {
  const safePage = Math.max(Number(page) || 1, 1);
  const safeLimit = Math.min(
    Math.max(Number(limit) || 15, 1),
    50
  );

  return {
    page: safePage,
    limit: safeLimit,
    skip: (safePage - 1) * safeLimit,
  };
};

/**
 * CREATE QUESTION
 * Only logged-in users/students can create questions.
 */
export const createQuestion = async (req, res) => {
  try {
    if (req.user?.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only students can ask questions.",
      });
    }

    const { title, body, category, tags } = req.body;

    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Title and question body are required.",
      });
    }

    const normalizedTags = Array.isArray(tags)
      ? [
          ...new Set(
            tags
              .slice(0, 5)
              .map((tag) =>
                String(tag).trim().toLowerCase()
              )
              .filter(Boolean)
          ),
        ]
      : [];

    const question = await Question.create({
      student: req.user._id,
      title: title.trim(),
      body: sanitizeRichText(body.trim()),
      category: QUESTION_CATEGORIES.includes(category)
        ? category
        : "General",
      tags: normalizedTags,
    });

    return res.status(201).json({
      success: true,
      data: question,
    });
  } catch (err) {
    console.error("createQuestion:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to create question.",
    });
  }
};

/**
 * GET ALL QUESTIONS
 */
export const getQuestions = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 15,
      search,
      category,
      tag,
      status,
    } = req.query;

    const {
      page: currentPage,
      limit: currentLimit,
      skip,
    } = getPagination(page, limit);

    const filter = {};

    if (search?.trim()) {
      filter.$text = {
        $search: search.trim(),
      };
    }

    if (
      category &&
      QUESTION_CATEGORIES.includes(category)
    ) {
      filter.category = category;
    }

    if (tag?.trim()) {
      filter.tags = tag.trim().toLowerCase();
    }

    if (status === "open" || status === "closed") {
      filter.status = status;
    }

    const query = Question.find(filter)
      .populate("student", "name")
      .skip(skip)
      .limit(currentLimit)
      .lean();

    if (search?.trim()) {
      query.sort({
        score: {
          $meta: "textScore",
        },
      });
    } else {
      query.sort({
        createdAt: -1,
      });
    }

    const [questions, total] = await Promise.all([
      query,
      Question.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: questions,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
      categories: QUESTION_CATEGORIES,
    });
  } catch (err) {
    console.error("getQuestions:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions.",
    });
  }
};

/**
 * GET MY QUESTIONS
 */
export const getMyQuestions = async (req, res) => {
  try {
    if (req.user?.role !== "user") {
      return res.status(403).json({
        success: false,
        message: "Only students can access their questions.",
      });
    }

    const { page = 1, limit = 15 } = req.query;

    const {
      page: currentPage,
      limit: currentLimit,
      skip,
    } = getPagination(page, limit);

    const filter = {
      student: req.user._id,
    };

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(currentLimit)
        .lean(),

      Question.countDocuments(filter),
    ]);

    return res.status(200).json({
      success: true,
      data: questions,
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    });
  } catch (err) {
    console.error("getMyQuestions:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your questions.",
    });
  }
};

/**
 * GET QUESTION BY ID
 */
export const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID.",
      });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      {
        $inc: {
          views: 1,
        },
      },
      {
        new: true,
      }
    ).populate("student", "name");

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    const answers = await Answer.find({
      question: question._id,
    })
      .sort({ createdAt: 1 })
      .lean();

    const topLevelAnswers = answers.filter(
      (answer) => !answer.parentAnswer
    );

    const replies = answers.filter(
      (answer) => answer.parentAnswer
    );

    const threadedAnswers = topLevelAnswers.map(
      (answer) => ({
        ...answer,
        replies: replies.filter(
          (reply) =>
            String(reply.parentAnswer) ===
            String(answer._id)
        ),
      })
    );

    return res.status(200).json({
      success: true,
      question,
      answers: threadedAnswers,
    });
  } catch (err) {
    console.error("getQuestionById:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch question.",
    });
  }
};

/**
 * CLOSE QUESTION
 *
 * admin/subadmin/counselor:
 *   can close any question
 *
 * user:
 *   can close only their own question
 */
export const closeQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID.",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    if (question.status === "closed") {
      return res.status(400).json({
        success: false,
        message: "Question is already closed.",
      });
    }

    // User can close only own question
    if (
      role === "user" &&
      String(question.student) !==
        String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only close your own question.",
      });
    }

    // Other roles must be staff
    if (
      role !== "user" &&
      !isStaff(role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    question.status = "closed";
    await question.save();

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    console.error("closeQuestion:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to close question.",
    });
  }
};

/**
 * REOPEN QUESTION
 *
 * admin/subadmin/counselor:
 *   can reopen any question
 *
 * user:
 *   can reopen only their own question
 */
export const reopenQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const role = req.user?.role;

    if (!isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid question ID.",
      });
    }

    const question = await Question.findById(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found.",
      });
    }

    if (question.status === "open") {
      return res.status(400).json({
        success: false,
        message: "Question is already open.",
      });
    }

    // User can reopen only own question
    if (
      role === "user" &&
      String(question.student) !==
        String(req.user._id)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You can only reopen your own question.",
      });
    }

    // Other roles must be staff
    if (
      role !== "user" &&
      !isStaff(role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    question.status = "open";
    await question.save();

    return res.status(200).json({
      success: true,
      data: question,
    });
  } catch (err) {
    console.error("reopenQuestion:", err);

    return res.status(500).json({
      success: false,
      message: "Failed to reopen question.",
    });
  }
};
