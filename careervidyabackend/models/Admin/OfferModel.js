import mongoose from "mongoose";
import { nanoid } from "nanoid"; // lightweight unique ID generator

const contentSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["offer", "subsidy", "brochure"],
      required: true,
    },

    /* ===== COMMON FIELDS ===== */
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    /* ===== OFFER FIELDS ===== */
    discountPercentage: Number,
    validFrom: Date,
    validTill: Date,

    /* ===== SUBSIDY FIELDS ===== */
    provider: String,
    amount: Number,
    eligibility: String,

    /* ===== BROCHURE FIELDS ===== */
    fileUrl: String,
    thumbnail: String,

    /* ===== AUTO GENERATED COUPON ID ===== */
    couponId: {
      type: String,
      unique: true,
      default: () => nanoid(8).toUpperCase(), // 8-character unique ID
    },
  },
  { timestamps: true }
);

export default mongoose.model("Content", contentSchema);
