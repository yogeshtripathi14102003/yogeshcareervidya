import mongoose from "mongoose";

const realtimeNotificationSchema = new mongoose.Schema(
  {
    recipient: { type: mongoose.Schema.Types.ObjectId, required: true, index: true },
    // Which collection `recipient` points to — Counselor (CRM notifications,
    // Modules 6-8) or Student (Q&A answer notifications). Defaults to
    // Counselor to stay backward-compatible with every notification
    // created before this field existed.
    recipientType: { type: String, enum: ["Counselor", "Student"], default: "Counselor" },

    type: {
      type: String,
      enum: [
        "lead_assigned",
        "lead_logged_in",
        "lead_revisited",
        "lead_viewed_fees",
        "lead_brochure_download",
        "lead_applied",
        "lead_profile_updated",
        "lead_documents_uploaded",
        "qa_new_answer",
        "qa_new_reply",
      ],
      required: true,
    },

    title: { type: String, required: true },
    message: { type: String, required: true },

    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead" },
    question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },

    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

realtimeNotificationSchema.index({ recipient: 1, createdAt: -1 });
realtimeNotificationSchema.index({ lead: 1, type: 1, createdAt: -1 });

export default mongoose.model("RealtimeNotification", realtimeNotificationSchema);
