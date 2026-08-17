
// import mongoose from "mongoose";
// const reviewSchema = new mongoose.Schema({
//     counsler: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Team",
//         required: true,
//     },
//     user: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Student",
//         // default: null HATADO agar hai toh
//     },
//     email: {
//         type: String,
//         lowercase: true,
//         trim: true,
//     },
//     guestName: {
//         type: String,
//         default: "Guest Student",
//     },
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//         required: true,
//     },
//     comment: {
//         type: String,
//         trim: true,
//     },
// }, { timestamps: true });

// // 1. UNIQUE index sirf Registered Users ke liye (jab user field null na ho)
// reviewSchema.index(
//     { counsler: 1, user: 1 },
//     { 
//         unique: true, 
//         partialFilterExpression: { user: { $exists: true, $type: "objectId" } } 
//     }
// );

// // 2. UNIQUE index sirf Guest Users ke liye (jab email field null na ho)
// reviewSchema.index(
//     { counsler: 1, email: 1 },
//     { 
//         unique: true, 
//         partialFilterExpression: { email: { $exists: true, $type: "string" } } 
//     }
// );

// const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
// export default Review;

import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor", // or "Team" based on your project model
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    guestName: {
      type: String,
      default: "Guest Student",
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
    },
  },
  { timestamps: true }
);

// 1. UNIQUE index for Registered Users (Only when user exists)
reviewSchema.index(
  { counselor: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: { user: { $exists: true, $ne: null } },
  }
);

// 2. UNIQUE index for Guest Users (Only when email exists)
reviewSchema.index(
  { counselor: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: { email: { $exists: true, $ne: null } },
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;