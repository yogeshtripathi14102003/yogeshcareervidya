import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    counsler: {
      type: mongoose.Schema.ObjectId,
      ref: "Team", // Aapka Counsellor model
      required: true,
    },
    // User login hai toh ID jayegi, nahi toh null
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: false, 
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    guestName: {
      type: String,
      default: "Guest Student"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      trim: true,
    }
  },
  { timestamps: true }
);

// IMPORTANT: Ek email se ek counsellor ko ek hi review allow hoga
reviewSchema.index({ counsler: 1, email: 1 }, { unique: true });

const reviewModel = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default reviewModel;