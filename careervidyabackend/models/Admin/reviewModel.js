import mongoose from "mongoose";

/**
 * ONE Review collection, THREE possible targets:
 *   1. counselor  -> existing behaviour, unchanged. Guests allowed.
 *   2. university -> NEW. Login required. Plain review of a University.
 *   3. course     -> NEW. Login required. Review of a Course AS OFFERED
 *                    BY a specific University (Course.universities[] already
 *                    carries a per-university `rating` + `reviewsCount`,
 *                    so this review type always carries BOTH course + university).
 *
 * name / email / phone are never taken from req.body for university/course
 * reviews — they're snapshotted from the logged-in user's own profile.
 */
const reviewSchema = new mongoose.Schema(
  {
    reviewFor: {
      type: String,
      enum: ["counselor", "university", "course"],
      required: true,
      index: true,
    },

    /* ---------- TARGETS ---------- */
    counselor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Counselor", // change to "Team" if that's your registered model name
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "University",
      // set for BOTH "university" reviews and "course" reviews
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      // set only when reviewFor === "course"
    },

    /* ---------- REVIEWER ---------- */
    // counselor reviews: user optional (guests allowed via email).
    // university/course reviews: user REQUIRED (login only).
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    // Snapshot fields — copied from the logged-in user's profile at
    // submit time for university/course reviews (not user-editable).
    name: { type: String, trim: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, trim: true },

    // kept for the existing counselor/guest flow
    guestName: { type: String, default: "Guest Student" },

    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

/* =========================================================
   INDEXES — one review per user (or guest email) per target
========================================================= */

// --- Counselor: existing behaviour (guest + logged-in) ---
reviewSchema.index(
  { counselor: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      counselor: { $exists: true },
      user: { $exists: true, $ne: null },
    },
  }
);
reviewSchema.index(
  { counselor: 1, email: 1 },
  {
    unique: true,
    partialFilterExpression: {
      counselor: { $exists: true },
      email: { $exists: true, $ne: null },
    },
  }
);

// --- University (plain, no course): one review per logged-in user ---
reviewSchema.index(
  { university: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      reviewFor: "university",
      user: { $exists: true, $ne: null },
    },
  }
);

// --- Course @ a specific University: one review per logged-in user ---
reviewSchema.index(
  { course: 1, university: 1, user: 1 },
  {
    unique: true,
    partialFilterExpression: {
      reviewFor: "course",
      user: { $exists: true, $ne: null },
    },
  }
);

const Review = mongoose.models.Review || mongoose.model("Review", reviewSchema);
export default Review;