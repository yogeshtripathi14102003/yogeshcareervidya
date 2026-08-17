// import mongoose from "mongoose";
// import { nanoid } from "nanoid";

// const subscriberSchema = new mongoose.Schema(
//   {
//     subscriberId: {
//       type: String,
//       required: true,
//       unique: true,
//       default: () => nanoid(12),
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       lowercase: true,
//       trim: true,
//       match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
//     },
//     isActive: { type: Boolean, default: true },
//     unsubscribedAt: { type: Date, default: null },

//     // Double opt-in (Newsletter Module requirement)
//     verified: { type: Boolean, default: false },
//     verificationToken: { type: String },
//     verificationExpires: { type: Date },

//     // One-click unsubscribe token — lets an unsubscribe link work without
//     // requiring the person to log in or type their email again.
//     unsubscribeToken: { type: String, unique: true, default: () => nanoid(24) },
//   },
//   { timestamps: true }
// );

// subscriberSchema.index({ email: 1 });
// subscriberSchema.index({ isActive: 1, verified: 1 });
// subscriberSchema.index({ createdAt: -1 });

// const NewsletterSubscriber =
//   mongoose.models.NewsletterSubscriber ||
//   mongoose.model("NewsletterSubscriber", subscriberSchema);

// export default NewsletterSubscriber;


import mongoose from "mongoose";
import { nanoid } from "nanoid";

const subscriberSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: String,
      required: true,
      unique: true, // Auto-creates unique index
      default: () => nanoid(12),
    },
    email: {
      type: String,
      required: true,
      unique: true, // Auto-creates unique index (do NOT add duplicate subscriberSchema.index for email below)
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    isActive: { type: Boolean, default: true },
    unsubscribedAt: { type: Date, default: null },

    // Double opt-in (Newsletter Module requirement)
    verified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationExpires: { type: Date },

    // One-click unsubscribe token
    unsubscribeToken: {
      type: String,
      unique: true, // Auto-creates unique index
      default: () => nanoid(24),
    },
  },
  { timestamps: true }
);

// Compound / Query-specific Indexes ONLY (removed duplicate email index)
subscriberSchema.index({ isActive: 1, verified: 1 });
subscriberSchema.index({ createdAt: -1 });

const NewsletterSubscriber =
  mongoose.models.NewsletterSubscriber ||
  mongoose.model("NewsletterSubscriber", subscriberSchema);

export default NewsletterSubscriber;