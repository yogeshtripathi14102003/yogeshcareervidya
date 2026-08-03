"use client";

import { useState } from "react";
import api from "@/utlis/api.js";

export default function ReviewForm({ counsellorId, onSuccess }) {

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /* ===============================
     CHECK EXISTING REVIEW
  =============================== */
  const checkExistingReview = async () => {
    if (!email || !counsellorId) return;

    try {
      const res = await api.get(`/api/v1/review/${counsellorId}`);

      const existing = res.data.reviews.find(
        (r) => r.email && r.email.toLowerCase() === email.toLowerCase()
      );

      if (existing) {
        setRating(existing.rating);
        setComment(existing.comment || "");
        setGuestName(existing.guestName || "");
        setIsEditing(true);
      } else {
        setIsEditing(false);
        setRating(0);
        setComment("");
        setGuestName("");
      }

    } catch (err) {
      console.error("Fetch review error:", err);
      setIsEditing(false);
    }
  };

  /* ===============================
     SUBMIT REVIEW
  =============================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!email) {
      setError("Email is required.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/v1/review", {
        counsellorId: counsellorId, // ✅ FIXED
        rating,
        comment,
        guestName: guestName || "Guest Student",
        email: email.toLowerCase(),
      });

      alert(isEditing ? "✅ Review updated!" : "✅ Review submitted!");

      // Reset
      setRating(0);
      setHover(0);
      setComment("");
      setGuestName("");
      setEmail("");
      setIsEditing(false);

      if (onSuccess) onSuccess();

    } catch (err) {
      console.error(err);

      setError(
        err.response?.data?.message || "Failed to submit review."
      );

    } finally {
      setLoading(false);
    }
  };

  /* ===============================
     UI
  =============================== */
  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-sm">

      <h3 className="text-lg font-semibold mb-3">
        {isEditing ? "Update Your Review" : "Submit a Review"}
      </h3>

      {/* ⭐ STAR RATING */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl cursor-pointer ${
              star <= (hover || rating)
                ? "text-yellow-400"
                : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >

        {/* COMMENT */}
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        />

        {/* NAME */}
        <input
          type="text"
          placeholder="Your Name (optional)"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Your Email (required)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={checkExistingReview}
          className="w-full p-2 border rounded"
          required
        />

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white px-4 py-2 rounded mt-2 hover:bg-cyan-700 transition"
        >
          {loading
            ? "Processing..."
            : isEditing
            ? "Update Review"
            : "Submit Review"}
        </button>

      </form>
    </div>
  );
}
