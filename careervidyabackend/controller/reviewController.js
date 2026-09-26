// import mongoose from "mongoose";
// import Review from "../models/Admin/reviewModel.js";
// import Team from "../models/Admin/TeamModel.js";

// /* ============================
//    SUBMIT REVIEW (Solid Version)
// ============================= */
// export const submitReview = async (req, res) => {
//   try {
//     const { rating, comment, counsellorId, email, guestName } = req.body;
//     const userId = req.user?._id; 

//     /* ---------- 1. VALIDATION ---------- */
//     if (!rating || !counsellorId) {
//       return res.status(400).json({
//         success: false,
//         message: "Rating & Counsellor ID required",
//       });
//     }

//     if (!mongoose.Types.ObjectId.isValid(counsellorId)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Counsellor ID",
//       });
//     }

//     if (!userId && !email) {
//       return res.status(400).json({
//         success: false,
//         message: "Email required for guest",
//       });
//     }

//     /* ---------- 2. FILTER & DATA LOGIC ---------- */
//     let filter = { counsler: counsellorId };
    
//     // Default update object
//     let updateOps = {
//       $set: {
//         rating: Number(rating),
//         comment,
//         guestName: guestName || "Guest Student",
//         counsler: counsellorId,
//       },
//     };

//     if (userId) {
//       // Logic for Logged-in User
//       filter.user = userId;
//       updateOps.$set.user = userId;
//       updateOps.$unset = { email: "" }; // Remove email field if it exists
//     } else {
//       // Logic for Guest User
//       const guestEmail = email.toLowerCase();
//       filter.email = guestEmail;
//       updateOps.$set.email = guestEmail;
//       updateOps.$unset = { user: "" };  // 🔥 YAHI MAIN FIX HAI: user field ko puri tarah remove kar do
//     }

//     /* ---------- 3. SAVE / UPDATE (UPSERT) ---------- */
//     const review = await Review.findOneAndUpdate(
//       filter,
//       updateOps,
//       {
//         new: true,
//         upsert: true,
//         runValidators: true,
//       }
//     );

//     // Update Average Rating in Team Model
//     await updateCounsellorRating(counsellorId);

//     return res.status(200).json({
//       success: true,
//       message: "Review submitted successfully",
//       review,
//     });

//   } catch (error) {
//     console.error("Submit Review Error:", error);
//     // Duplicate Key Error handling for better user message
//     if (error.code === 11000) {
//       return res.status(400).json({
//         success: false,
//         message: "You have already submitted a review for this counsellor.",
//       });
//     }
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// /* ============================
//    GET REVIEWS
// ============================= */
// export const getReviewsByCounsellor = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({
//         success: false,
//         message: "Invalid Counsellor ID",
//       });
//     }

//     const reviews = await Review.find({ counsler: id })
//       .populate("user", "name email mobileNumber")
//       .sort({ createdAt: -1 });

//     res.status(200).json({
//       success: true,
//       count: reviews.length,
//       reviews,
//     });

//   } catch (error) {
//     console.error("Get Review Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ============================
//    DELETE REVIEW (ADMIN)
// ============================= */
// export const adminDeleteReview = async (req, res) => {
//   try {
//     const { id } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ success: false, message: "Invalid Review ID" });
//     }

//     const review = await Review.findById(id);
//     if (!review) {
//       return res.status(404).json({ success: false, message: "Review not found" });
//     }

//     const counsellorId = review.counsler;
//     await Review.findByIdAndDelete(id);

//     // Recalculate Rating
//     await updateCounsellorRating(counsellorId);

//     res.status(200).json({ success: true, message: "Review deleted" });

//   } catch (error) {
//     console.error("Delete Review Error:", error);
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// /* ============================
//    HELPER: UPDATE COUNSELLOR RATING
// ============================= */
// const updateCounsellorRating = async (id) => {
//   try {
//     const reviews = await Review.find({ counsler: id });
//     const count = reviews.length;

//     const avg =
//       count > 0
//         ? reviews.reduce((a, b) => a + b.rating, 0) / count
//         : 0;

//     await Team.findByIdAndUpdate(id, {
//       rating: avg.toFixed(1),
//       ratingCount: count,
//     });
//   } catch (err) {
//     console.error("Rating Update Error:", err);
//   }
// };

import mongoose from "mongoose";
import Review from "../models/Admin/reviewModel.js";
import Team from "../models/Admin/TeamModel.js";
// ⚠️ Adjust these two paths to wherever your files actually live —
// I've followed the same "../models/Admin/XModel.js" pattern as Team above.
import University from "../models/Admin/University.js"
import Course from "../models/Admin/Course.js";

/* ============================================================
   1. COUNSELLOR REVIEW — UNCHANGED (guests + logged-in users)
============================================================= */
export const submitReview = async (req, res) => {
  try {
    const { rating, comment, counsellorId, email, guestName } = req.body;
    const userId = req.user?._id;

    if (!rating || !counsellorId) {
      return res.status(400).json({
        success: false,
        message: "Rating & Counsellor ID required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(counsellorId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Counsellor ID",
      });
    }

    if (!userId && !email) {
      return res.status(400).json({
        success: false,
        message: "Email required for guest",
      });
    }

    let filter = { reviewFor: "counselor", counselor: counsellorId };

    let updateOps = {
      $set: {
        reviewFor: "counselor",
        rating: Number(rating),
        comment,
        guestName: guestName || "Guest Student",
        counselor: counsellorId,
      },
    };

    if (userId) {
      filter.user = userId;
      updateOps.$set.user = userId;
      updateOps.$unset = { email: "" };
    } else {
      const guestEmail = email.toLowerCase();
      filter.email = guestEmail;
      updateOps.$set.email = guestEmail;
      updateOps.$unset = { user: "" };
    }

    const review = await Review.findOneAndUpdate(filter, updateOps, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    await updateCounsellorRating(counsellorId);

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Submit Review Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this counsellor.",
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByCounsellor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Counsellor ID" });
    }

    const reviews = await Review.find({ reviewFor: "counselor", counselor: id })
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Get Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   2. UNIVERSITY REVIEW — NEW, LOGIN REQUIRED
   name / email / phone come from the logged-in Student's own
   profile, never from req.body.
============================================================= */
export const submitUniversityReview = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to submit a review.",
      });
    }

    const { rating, comment, universityId } = req.body;

    if (!rating || !universityId) {
      return res.status(400).json({
        success: false,
        message: "Rating & University ID required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(universityId)) {
      return res.status(400).json({ success: false, message: "Invalid University ID" });
    }

    const university = await University.findById(universityId).select("_id");
    if (!university) {
      return res.status(404).json({ success: false, message: "University not found" });
    }

    // Student model file path not shared yet — using registered model name.
    // Swap this for a direct import once you share the model file.
    const Student = mongoose.model("Student");
    const student = await Student.findById(userId).select("name email mobileNumber");
    if (!student) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    const review = await Review.findOneAndUpdate(
      { reviewFor: "university", university: universityId, user: userId },
      {
        $set: {
          reviewFor: "university",
          university: universityId,
          user: userId,
          name: student.name,
          email: student.email,
          phone: student.mobileNumber,
          rating: Number(rating),
          comment,
        },
        $unset: { course: "" },
      },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Submit University Review Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this university.",
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByUniversity = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid University ID" });
    }

    const reviews = await Review.find({ reviewFor: "university", university: id })
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Get University Reviews Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   3. COURSE REVIEW (at a specific University) — LOGIN REQUIRED
   Course.universities[] already stores a per-university `rating`
   + `reviewsCount`, so after every submit/delete we recompute
   that exact subdocument from the Review collection.
============================================================= */
export const submitCourseReview = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Please login to submit a review.",
      });
    }

    const { rating, comment, courseId, universityId } = req.body;

    if (!rating || !courseId || !universityId) {
      return res.status(400).json({
        success: false,
        message: "Rating, Course ID & University ID required",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(courseId) ||
      !mongoose.Types.ObjectId.isValid(universityId)
    ) {
      return res.status(400).json({ success: false, message: "Invalid Course/University ID" });
    }

    // Confirm this course is actually offered at this university
    const course = await Course.findOne({
      _id: courseId,
      "universities.universityId": universityId,
    }).select("_id");

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "This course is not offered at the given university",
      });
    }

    const Student = mongoose.model("Student");
    const student = await Student.findById(userId).select("name email mobileNumber");
    if (!student) {
      return res.status(404).json({ success: false, message: "User profile not found" });
    }

    const review = await Review.findOneAndUpdate(
      { reviewFor: "course", course: courseId, university: universityId, user: userId },
      {
        $set: {
          reviewFor: "course",
          course: courseId,
          university: universityId,
          user: userId,
          name: student.name,
          email: student.email,
          phone: student.mobileNumber,
          rating: Number(rating),
          comment,
        },
      },
      { new: true, upsert: true, runValidators: true }
    );

    await updateCourseUniversityRating(courseId, universityId);

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });
  } catch (error) {
    console.error("Submit Course Review Error:", error);
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already reviewed this course at this university.",
      });
    }
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getReviewsByCourse = async (req, res) => {
  try {
    const { courseId, universityId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(courseId)) {
      return res.status(400).json({ success: false, message: "Invalid Course ID" });
    }

    const filter = { reviewFor: "course", course: courseId };
    // universityId is optional: /review/course/:courseId lists all
    // universities' reviews for that course; pass ?universityId= to narrow.
    if (universityId && mongoose.Types.ObjectId.isValid(universityId)) {
      filter.university = universityId;
    }

    const reviews = await Review.find(filter)
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error("Get Course Reviews Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================================================
   4. DELETE REVIEW (ADMIN) — works for all 3 types by _id
============================================================= */
export const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid Review ID" });
    }

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    const { reviewFor, counselor: counselorId, course: courseId, university: universityId } = review;
    await Review.findByIdAndDelete(id);

    if (reviewFor === "counselor" && counselorId) {
      await updateCounsellorRating(counselorId);
    }
    if (reviewFor === "course" && courseId && universityId) {
      await updateCourseUniversityRating(courseId, universityId);
    }
    // Plain "university" reviews aren't cached anywhere (University model
    // has no rating field yet) — nothing to recalculate there.

    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    console.error("Delete Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   HELPER: UPDATE COUNSELLOR RATING
============================= */
const updateCounsellorRating = async (id) => {
  try {
    const reviews = await Review.find({ reviewFor: "counselor", counselor: id });
    const count = reviews.length;

    const avg = count > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / count : 0;

    await Team.findByIdAndUpdate(id, {
      rating: avg.toFixed(1),
      ratingCount: count,
    });
  } catch (err) {
    console.error("Rating Update Error:", err);
  }
};

/* ============================
   HELPER: UPDATE Course.universities[].rating / reviewsCount
   for one specific (course, university) pair
============================= */
const updateCourseUniversityRating = async (courseId, universityId) => {
  try {
    const reviews = await Review.find({
      reviewFor: "course",
      course: courseId,
      university: universityId,
    });
    const count = reviews.length;
    const avg = count > 0 ? reviews.reduce((a, b) => a + b.rating, 0) / count : 0;

    await Course.updateOne(
      { _id: courseId, "universities.universityId": universityId },
      {
        $set: {
          "universities.$.rating": Number(avg.toFixed(1)),
          "universities.$.reviewsCount": count,
        },
      }
    );
  } catch (err) {
    console.error("Course-University Rating Update Error:", err);
  }
};