import mongoose from "mongoose";
import Review from "../models/Admin/reviewModel.js";
import Team from "../models/Admin/TeamModel.js";

/* ============================
   SUBMIT REVIEW (Solid Version)
============================= */
export const submitReview = async (req, res) => {
  try {
    const { rating, comment, counsellorId, email, guestName } = req.body;
    const userId = req.user?._id; 

    /* ---------- 1. VALIDATION ---------- */
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

    /* ---------- 2. FILTER & DATA LOGIC ---------- */
    let filter = { counsler: counsellorId };
    
    // Default update object
    let updateOps = {
      $set: {
        rating: Number(rating),
        comment,
        guestName: guestName || "Guest Student",
        counsler: counsellorId,
      },
    };

    if (userId) {
      // Logic for Logged-in User
      filter.user = userId;
      updateOps.$set.user = userId;
      updateOps.$unset = { email: "" }; // Remove email field if it exists
    } else {
      // Logic for Guest User
      const guestEmail = email.toLowerCase();
      filter.email = guestEmail;
      updateOps.$set.email = guestEmail;
      updateOps.$unset = { user: "" };  // 🔥 YAHI MAIN FIX HAI: user field ko puri tarah remove kar do
    }

    /* ---------- 3. SAVE / UPDATE (UPSERT) ---------- */
    const review = await Review.findOneAndUpdate(
      filter,
      updateOps,
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    // Update Average Rating in Team Model
    await updateCounsellorRating(counsellorId);

    return res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      review,
    });

  } catch (error) {
    console.error("Submit Review Error:", error);
    // Duplicate Key Error handling for better user message
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already submitted a review for this counsellor.",
      });
    }
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ============================
   GET REVIEWS
============================= */
export const getReviewsByCounsellor = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Counsellor ID",
      });
    }

    const reviews = await Review.find({ counsler: id })
      .populate("user", "name email mobileNumber")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });

  } catch (error) {
    console.error("Get Review Error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ============================
   DELETE REVIEW (ADMIN)
============================= */
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

    const counsellorId = review.counsler;
    await Review.findByIdAndDelete(id);

    // Recalculate Rating
    await updateCounsellorRating(counsellorId);

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
    const reviews = await Review.find({ counsler: id });
    const count = reviews.length;

    const avg =
      count > 0
        ? reviews.reduce((a, b) => a + b.rating, 0) / count
        : 0;

    await Team.findByIdAndUpdate(id, {
      rating: avg.toFixed(1),
      ratingCount: count,
    });
  } catch (err) {
    console.error("Rating Update Error:", err);
  }
};

