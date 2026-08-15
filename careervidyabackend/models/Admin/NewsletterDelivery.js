import mongoose from "mongoose";

const newsletterDeliverySchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "NewsletterLog", required: true, index: true },
    subscriber: { type: mongoose.Schema.Types.ObjectId, ref: "NewsletterSubscriber", required: true },
    email: { type: String, required: true },

    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    error: String,
    sentAt: Date,

    // Open/click tracking — set the first time each happens, not
    // re-counted on repeat opens (a simple, honest "did this land" signal
    // rather than trying to count total opens/clicks precisely).
    openedAt: Date,
    clickedAt: Date,

    // A per-delivery token used in the tracking pixel URL and unsubscribe
    // link, so opens/clicks can be attributed without requiring login.
    trackingToken: { type: String, unique: true, required: true },
  },
  { timestamps: true }
);

newsletterDeliverySchema.index({ campaign: 1, status: 1 });

const NewsletterDelivery =
  mongoose.models.NewsletterDelivery ||
  mongoose.model("NewsletterDelivery", newsletterDeliverySchema);

export default NewsletterDelivery;
