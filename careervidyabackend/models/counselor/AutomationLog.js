import mongoose from "mongoose";

const automationLogSchema = new mongoose.Schema(
  {
    lead: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true, index: true },
    stepLabel: { type: String, required: true },
    action: {
      type: String,
      enum: ["reminder", "manager_notification", "auto_reassign"],
      required: true,
    },
    details: { type: String },
    meta: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

automationLogSchema.index({ createdAt: -1 });

export default mongoose.model("AutomationLog", automationLogSchema);
