import mongoose from "mongoose";

const stepSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "5 minute reminder"
    afterMinutes: { type: Number, required: true, min: 1 },
    action: {
      type: String,
      enum: ["reminder", "manager_notification", "auto_reassign"],
      required: true,
    },
  },
  { _id: true }
);

const followUpAutomationConfigSchema = new mongoose.Schema(
  {
    enabled: { type: Boolean, default: true },

    // Sensible defaults matching the spec's example escalation ladder.
    // Admin can freely add/remove/edit these from the panel.
    steps: {
      type: [stepSchema],
      default: [
        // { label: "5 minute reminder", afterMinutes: 5, action: "reminder" },
        { label: "1 day reminder", afterMinutes: 1440, action: "reminder" },
        { label: "3 day reminder", afterMinutes: 4320, action: "reminder" },
        { label: "7 day manager notification", afterMinutes: 10080, action: "manager_notification" },
        // { label: "10 day auto-reassign", afterMinutes: 14400, action: "auto_reassign" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.model("FollowUpAutomationConfig", followUpAutomationConfigSchema);
