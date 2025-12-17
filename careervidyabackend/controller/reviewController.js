

import Review from "../models/Admin/reviewModel.js";
import Team from "../models/Admin/TeamModel.js";

/**
 * 1. SUBMIT OR EDIT REVIEW (For Students - Manual Email)
 * Agar same email se pehle review diya hai, toh update hoga.
 */
export const submitReview = async (req, res) => {
  try {
    const { rating, comment, counsellorId, guestName, email } = req.body;

    // Basic Validation
    if (!email || !rating || !counsellorId) {
      return res.status(400).json({ 
        success: false, 
        message: "Email, Rating and Counsellor ID are required." 
      });
    }

    // Upsert Logic: Find by (Counsellor + Email), if found update, else create
    const review = await Review.findOneAndUpdate(
      { counsler: counsellorId, email: email.toLowerCase() },
      { 
        rating: Number(rating), 
        comment, 
        guestName: guestName || "Guest Student",
        email: email.toLowerCase()
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    // Update Counsellor's Average Rating
    await updateCounsellorRating(counsellorId);

    res.status(200).json({ 
      success: true, 
      message: "Review submitted successfully!", 
      review 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 2. GET ALL REVIEWS FOR A COUNSELLOR
 */
export const getReviewsByCounsellor = async (req, res) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ counsler: id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * 3. ADMIN DELETE REVIEW
 * Admin kisi bhi review ki ID se use delete kar sakta hai
 */
export const adminDeleteReview = async (req, res) => {
  try {
    const { id } = req.params; // Review ID

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    const counsellorId = review.counsler;

    // Delete the review
    await Review.findByIdAndDelete(id);

    // Recalculate Rating after deletion
    await updateCounsellorRating(counsellorId);

    res.status(200).json({ 
      success: true, 
      message: "Review deleted by admin successfully." 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * HELPER FUNCTION: RE-CALCULATE RATING
 * Jab bhi review add, edit ya delete ho, ye function counsellor ki profile update karega
 */
const updateCounsellorRating = async (counsellorId) => {
  const reviews = await Review.find({ counsler: counsellorId });
  
  const count = reviews.length;
  const avg = count > 0 
    ? reviews.reduce((acc, item) => item.rating + acc, 0) / count 
    : 0;

  await Team.findByIdAndUpdate(counsellorId, {
    rating: avg.toFixed(1),
    ratingCount: count,
  });
};