 import mongoose from "mongoose";
import { nanoid } from "nanoid";

const subscriberSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: String,
      required: true,
      unique: true,
      default: () => nanoid(12),
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    isActive: { type: Boolean, default: true },
    unsubscribedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", subscriberSchema);

export default NewsletterSubscriber;
