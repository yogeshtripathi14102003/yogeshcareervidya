import mongoose from "mongoose";

const newsletterLogSchema = new mongoose.Schema(
  {
    subject: String,
    body: String,
    recipients: [String],
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    error: String,
    sentAt: Date,
  },
  { timestamps: true }
);

const NewsletterLog =
  mongoose.models.NewsletterLog ||
  mongoose.model("NewsletterLog", newsletterLogSchema);

export default NewsletterLog;
