import mongoose from "mongoose";

const courseViewSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true, index: true },
    courseSlug: { type: String, index: true }, // denormalized for fast lookups without a join
    sessionId: { type: String, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", index: true }, // set when the visitor is logged in

    timeSpent: { type: Number, default: 0 }, // seconds spent on this course view

    brochureDownloaded: { type: Boolean, default: false },
    applyClicked: { type: Boolean, default: false },
    registered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

courseViewSchema.index({ course: 1, sessionId: 1 });
courseViewSchema.index({ createdAt: -1 });
courseViewSchema.index({ userId: 1 }); // Module 11: scored per-lead every 15 min via the matched Student account

export default mongoose.model("CourseView", courseViewSchema);
