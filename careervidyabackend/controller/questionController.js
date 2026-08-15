import Question, { QUESTION_CATEGORIES } from "../models/QA/Question.js";
import Answer from "../models/QA/Answer.js";
import { sanitizeRichText } from "../utilities/sanitizeRichText.js";

const isStaff = (role) => ["admin", "subadmin", "counselor"].includes(role);

/* =====================================================
   CREATE — students only
===================================================== */
export const createQuestion = async (req, res) => {
  try {
    if (req.user?.role !== "user") {
      return res.status(403).json({ success: false, message: "Only students can ask questions." });
    }

    const { title, body, category, tags } = req.body;
    if (!title?.trim() || !body?.trim()) {
      return res.status(400).json({ success: false, message: "Title and question body are required." });
    }

    const question = await Question.create({
      student: req.user._id,
      title: title.trim(),
      body: sanitizeRichText(body),
      category: QUESTION_CATEGORIES.includes(category) ? category : "General",
      tags: Array.isArray(tags) ? tags.slice(0, 5).map((t) => String(t).trim().toLowerCase()).filter(Boolean) : [],
    });

    res.status(201).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   LIST — search, category/tag/status filter, pagination
   (any logged-in role — students browsing, staff moderating)
===================================================== */
export const getQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 15, search, category, tag, status } = req.query;

    const filter = {};
    if (search?.trim()) filter.$text = { $search: search.trim() };
    if (category && QUESTION_CATEGORIES.includes(category)) filter.category = category;
    if (tag) filter.tags = tag.toLowerCase();
    if (status === "open" || status === "closed") filter.status = status;

    const [questions, total] = await Promise.all([
      Question.find(filter)
        .populate("student", "name")
        .sort(search ? { score: { $meta: "textScore" } } : { createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit))
        .lean(),
      Question.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: questions,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      categories: QUESTION_CATEGORIES,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   MY QUESTIONS — the logged-in student's own
===================================================== */
export const getMyQuestions = async (req, res) => {
  try {
    const { page = 1, limit = 15 } = req.query;
    const filter = { student: req.user._id };

    const [questions, total] = await Promise.all([
      Question.find(filter).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit)).lean(),
      Question.countDocuments(filter),
    ]);

    res.status(200).json({ success: true, data: questions, total, page: Number(page), totalPages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   GET ONE — full thread (question + threaded answers), bumps view count
===================================================== */
export const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate("student", "name");

    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    const answers = await Answer.find({ question: question._id }).sort({ createdAt: 1 }).lean();

    // Thread top-level answers with their reply chains for the frontend.
    const topLevel = answers.filter((a) => !a.parentAnswer);
    const replies = answers.filter((a) => a.parentAnswer);
    const threaded = topLevel.map((a) => ({
      ...a,
      replies: replies.filter((r) => String(r.parentAnswer) === String(a._id)),
    }));

    res.status(200).json({ success: true, question, answers: threaded });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/* =====================================================
   CLOSE DISCUSSION — admin/counselor only
===================================================== */
export const closeQuestion = async (req, res) => {
  try {
    if (!isStaff(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: { status: "closed" } },
      { new: true }
    );
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });

    res.status(200).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const reopenQuestion = async (req, res) => {
  try {
    if (!isStaff(req.user?.role)) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const question = await Question.findByIdAndUpdate(req.params.id, { $set: { status: "open" } }, { new: true });
    if (!question) return res.status(404).json({ success: false, message: "Question not found" });
    res.status(200).json({ success: true, data: question });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
