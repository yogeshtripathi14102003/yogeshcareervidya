"use client";

import { useState } from "react";
import api from "@/utlis/api.js";

export default function ReviewForm({ counsellorId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [guestName, setGuestName] = useState("");
  const [email, setEmail] = useState(""); // Required per model
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  // Check if review already exists for this email
  const checkExistingReview = async () => {
    if (!email || !counsellorId) return;

    try {
      const res = await api.get(`/api/v1/review/${counsellorId}`);
      const existing = res.data.reviews.find(
        (r) => r.email.toLowerCase() === email.toLowerCase()
      );

      if (existing) {
        setRating(existing.rating);
        setComment(existing.comment);
        setGuestName(existing.guestName || "");
        setIsEditing(true);
      } else {
        setIsEditing(false);
        setRating(0);
        setComment("");
        setGuestName("");
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setIsEditing(false);
    }
  };

  // Handle form submit
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
        counsler: counsellorId,
        rating,
        comment,
        guestName: guestName || "Guest Student",
        email: email.toLowerCase(),
      });

      alert(isEditing ? "✅ Review updated!" : "✅ Review submitted!");

      // Reset fields after submit
      setRating(0);
      setHover(0);
      setComment("");
      setGuestName("");
      setEmail("");
      setIsEditing(false);

      // Callback to refresh reviews in parent component
      onSuccess && onSuccess();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-sm">
      <h3 className="text-lg font-semibold mb-3">
        {isEditing ? "Update Your Review" : "Submit a Review"}
      </h3>

      {/* Star Rating */}
      <div className="flex gap-1 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-2xl cursor-pointer ${
              star <= (hover || rating) ? "text-yellow-400" : "text-gray-300"
            }`}
            onMouseEnter={() => setHover(star)}
            onMouseLeave={() => setHover(0)}
            onClick={() => setRating(star)}
          >
            ★
          </span>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full p-2 border rounded"
          rows={4}
        />

        <input
          type="text"
          placeholder="Your Name (optional)"
          value={guestName}
          onChange={(e) => setGuestName(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="email"
          placeholder="Your Email (required)"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={checkExistingReview} // Check if review exists on blur
          className="w-full p-2 border rounded"
          required
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-cyan-600 text-white px-4 py-2 rounded mt-2 hover:bg-cyan-700 transition"
        >
          {loading ? "Processing..." : isEditing ? "Update Review" : "Submit Review"}
        </button>
      </form>
    </div>
  );
}
