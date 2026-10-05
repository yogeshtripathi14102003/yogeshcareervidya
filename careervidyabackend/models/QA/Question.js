import mongoose from "mongoose";

const CATEGORIES = [
  "Admissions",
  "Courses",
  "Fees & Scholarships",
  "Placements",
  "University Selection",
  "Exams",
  "General",
];

const questionSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true, index: true },

    title: { type: String, required: true, trim: true, maxlength: 200 },
    body: { type: String, required: true }, // rich text HTML from the editor

    category: { type: String, enum: CATEGORIES, default: "General" },
    tags: { type: [String], default: [] },

    status: { type: String, enum: ["open", "closed"], default: "open" },

    views: { type: Number, default: 0 },
    answerCount: { type: Number, default: 0 }, // denormalized, kept in sync by the Answer controller
  },
  { timestamps: true }
);

questionSchema.index({ title: "text", body: "text", tags: "text" });
questionSchema.index({ category: 1, createdAt: -1 });
questionSchema.index({ student: 1, createdAt: -1 });
questionSchema.index({ status: 1 });

export const QUESTION_CATEGORIES = CATEGORIES;
export default mongoose.model("Question", questionSchema);
