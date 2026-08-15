import mongoose from "mongoose";

// One document per campaign send. Per-recipient outcomes (sent/failed/
// opened/clicked) live in NewsletterDelivery — this is the campaign-level
// summary + rollup counts, kept in sync as deliveries land.
const newsletterLogSchema = new mongoose.Schema(
  {
    subject: { type: String, required: true },
    body: { type: String, required: true },

    totalRecipients: { type: Number, default: 0 },
    successCount: { type: Number, default: 0 },
    failedCount: { type: Number, default: 0 },
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },

    status: {
      type: String,
      enum: ["pending", "sending", "sent", "failed"],
      default: "pending",
    },
    error: String,
    sentAt: Date,
  },
  { timestamps: true }
);

newsletterLogSchema.index({ createdAt: -1 });

const NewsletterLog =
  mongoose.models.NewsletterLog ||
  mongoose.model("NewsletterLog", newsletterLogSchema);

export default NewsletterLog;
