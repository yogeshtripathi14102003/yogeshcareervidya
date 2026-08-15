import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question", required: true, index: true },

    // Who wrote this — denormalized rather than a dynamic ref, since
    // authors come from two different collections (Student for
    // admin/subadmin/student, Counselor for counselor) and this survives
    // the author's account being deleted later.
    authorId: { type: mongoose.Schema.Types.ObjectId, required: true },
    authorType: { type: String, enum: ["admin", "subadmin", "counselor", "student"], required: true },
    authorName: { type: String, required: true },

    body: { type: String, required: true },

    // null = a top-level answer (from staff). Set = a reply thread on that
    // answer (typically the asking student following up).
    parentAnswer: { type: mongoose.Schema.Types.ObjectId, ref: "Answer", default: null, index: true },

    // Only meaningful on top-level staff answers, set by the question's
    // own student.
    isHelpful: { type: Boolean, default: false },

    edited: { type: Boolean, default: false },
    editedAt: { type: Date },
  },
  { timestamps: true }
);

answerSchema.index({ question: 1, createdAt: 1 });

export default mongoose.model("Answer", answerSchema);
