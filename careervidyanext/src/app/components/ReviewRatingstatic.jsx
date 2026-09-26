// "use client";

// import { useEffect, useState } from "react";


//  const REVIEWS = [
//   {
//     name: "Avijit Debnath",
//     course: "B.Com + MBA",
//     rating: 5,
//     verified: true,
//     date: "January 7, 2026",
//     location: "India",
//     comment:
//       "It is a good, reputed and well known university. It has all the major rankings and accreditations so I would like to invest my time and money here.",
//   },
//   {
//     name: "Neha Verma",
//     course: "MBA",
//     rating: 4,
//     verified: true,
//     date: "December 18, 2025",
//     location: "India",
//     comment:
//       "Good university for working professionals. Course structure and LMS support are very helpful.",
//   },
//   {
//     name: "Rahul Singh",
//     course: "BBA + MBA",
//     rating: 5,
//     verified: true,
//     date: "November 30, 2025",
//     location: "India",
//     comment:
//       "Faculty support and online learning experience are excellent.",
//   },
//   {
//     name: "Pooja Mehta",
//     course: "MA (Education)",
//     rating: 4,
//     verified: true,
//     date: "October 14, 2025",
//     location: "India",
//     comment:
//       "Study material is easy to understand and well structured.",
//   },
//   {
//     name: "Ankit Gupta",
//     course: "MCA",
//     rating: 5,
//     verified: true,
//     date: "September 20, 2025",
//     location: "India",
//     comment:
//       "Best option for online MCA. Exams and support system are smooth.",
//   },
//   {
//     name: "Sneha Patel",
//     course: "MBA (HR)",
//     rating: 4,
//     verified: true,
//     date: "August 11, 2025",
//     location: "India",
//     comment:
//       "Good guidance from counselors during admission process.",
//   },
//   {
//     name: "Vikas Yadav",
//     course: "BA",
//     rating: 4,
//     verified: true,
//     date: "July 6, 2025",
//     location: "India",
//     comment:
//       "Affordable fees and recognized degree.",
//   },
//   {
//     name: "Ritika Jain",
//     course: "MBA (Finance)",
//     rating: 5,
//     verified: true,
//     date: "June 19, 2025",
//     location: "India",
//     comment:
//       "Finance specialization is very practical and industry focused.",
//   },
//   {
//     name: "Mohit Kumar",
//     course: "BCA",
//     rating: 4,
//     verified: true,
//     date: "May 22, 2025",
//     location: "India",
//     comment:
//       "Good online platform with recorded lectures.",
//   },
//   {
//     name: "Kajal Arora",
//     course: "MBA (Marketing)",
//     rating: 5,
//     verified: true,
//     date: "April 9, 2025",
//     location: "India",
//     comment:
//       "Marketing course helped me improve practical skills.",
//   },
//   {
//     name: "Saurabh Mishra",
//     course: "M.Com",
//     rating: 4,
//     verified: true,
//     date: "March 16, 2025",
//     location: "India",
//     comment:
//       "Accounting subjects are well explained.",
//   },
//   {
//     name: "Nidhi Saxena",
//     course: "MBA (Operations)",
//     rating: 5,
//     verified: true,
//     date: "February 8, 2025",
//     location: "India",
//     comment:
//       "Operations management content is very useful.",
//   },
//   {
//     name: "Rohit Agarwal",
//     course: "Executive MBA",
//     rating: 5,
//     verified: true,
//     date: "January 25, 2025",
//     location: "India",
//     comment:
//       "Perfect for working professionals like me.",
//   },
//   {
//     name: "Simran Kaur",
//     course: "MA (English)",
//     rating: 4,
//     verified: true,
//     date: "December 3, 2024",
//     location: "India",
//     comment:
//       "Literature subjects are well covered.",
//   },
//   {
//     name: "Manish Tiwari",
//     course: "MBA (IT)",
//     rating: 5,
//     verified: true,
//     date: "November 17, 2024",
//     location: "India",
//     comment:
//       "IT management modules are industry relevant.",
//   },
//   {
//     name: "Priya Malhotra",
//     course: "BBA",
//     rating: 4,
//     verified: true,
//     date: "October 28, 2024",
//     location: "India",
//     comment:
//       "Good foundation for management studies.",
//   },
//   {
//     name: "Deepak Chauhan",
//     course: "MBA",
//     rating: 5,
//     verified: true,
//     date: "September 5, 2024",
//     location: "India",
//     comment:
//       "Overall learning experience is excellent.",
//   },
//   {
//     name: "Ayesha Khan",
//     course: "MBA (HR)",
//     rating: 4,
//     verified: true,
//     date: "August 14, 2024",
//     location: "India",
//     comment:
//       "HR subjects are updated and relevant.",
//   },
//   {
//     name: "Harsh Vardhan",
//     course: "B.Com",
//     rating: 5,
//     verified: true,
//     date: "July 2, 2024",
//     location: "India",
//     comment:
//       "Commerce concepts are well explained.",
//   },
//   {
//     name: "Shalini Gupta",
//     course: "MBA (Finance)",
//     rating: 4,
//     verified: true,
//     date: "June 10, 2024",
//     location: "India",
//     comment:
//       "Finance case studies are very useful.",
//   },
//   {
//     name: "Naveen Joshi",
//     course: "MCA",
//     rating: 5,
//     verified: true,
//     date: "May 18, 2024",
//     location: "India",
//     comment:
//       "Good technical support and faculty.",
//   },
//   {
//     name: "Rashmi Pandey",
//     course: "MA (Psychology)",
//     rating: 4,
//     verified: true,
//     date: "April 6, 2024",
//     location: "India",
//     comment:
//       "Course content is detailed and helpful.",
//   },
//   {
//     name: "Karan Malhotra",
//     course: "MBA",
//     rating: 5,
//     verified: true,
//     date: "March 12, 2024",
//     location: "India",
//     comment:
//       "Admission process was smooth and transparent.",
//   },
//   {
//     name: "Isha Kapoor",
//     course: "BBA",
//     rating: 4,
//     verified: true,
//     date: "February 1, 2024",
//     location: "India",
//     comment:
//       "Good learning platform with flexibility.",
//   },
//   {
//     name: "Alok Srivastava",
//     course: "MBA (Strategy)",
//     rating: 5,
//     verified: true,
//     date: "January 9, 2024",
//     location: "India",
//     comment:
//       "Strategic management modules are excellent.",
//   },
// ];

//   // 👉 aise hi 25 bana sakte ho


// // 🔀 Shuffle on refresh
// const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

// export default function EducationReviews() {
//   const [reviews, setReviews] = useState([]);

//   useEffect(() => {
//     setReviews(shuffleArray(REVIEWS));
//   }, []);

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

//       <div className="space-y-6">
//         {reviews.map((r, i) => (
//           <div key={i} className="border-b pb-6">
//             {/* Header */}
//             <div className="flex items-center gap-3">
//               {/* Avatar */}
//               <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
//                 {r.name.charAt(0)}
//               </div>

//               <div>
//                 <p className="font-semibold">{r.name}</p>

//                 {/* Rating + Verified */}
//                 <div className="flex items-center gap-2 text-sm">
//                   <div className="flex">
//                     {[...Array(5)].map((_, idx) => (
//                       <span key={idx}>
//                         {idx < r.rating ? "⭐" : "☆"}
//                       </span>
//                     ))}
//                   </div>

//                   {r.verified && (
//                     <span className="text-orange-500 font-semibold">
//                       Verified
//                     </span>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Course */}
//             <p className="font-semibold mt-2">{r.course}</p>

//             {/* Date */}
//             <p className="text-sm text-gray-500">
//               Reviewed in {r.location} on {r.date}
//             </p>

//             {/* Comment */}
//             <p className="mt-2 text-gray-700 leading-relaxed">
//               {r.comment}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useCallback } from "react";
import { Star, MessageSquare, Loader2 } from "lucide-react";
import api from "@/utlis/api.js"; // ✅ Axios instance with JWT interceptor

function formatRelativeDate(dateStr) {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const diffMs = Date.now() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 30) return `${diffDays} days ago`;
    const diffMonths = Math.floor(diffDays / 30);
    if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
    const diffYears = Math.floor(diffMonths / 12);
    return `${diffYears} year${diffYears > 1 ? "s" : ""} ago`;
}

function StarRating({ value, size = 16, interactive = false, onChange }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => {
                const filled = interactive ? n <= (hover || value) : n <= Math.round(value);
                return (
                    <button
                        key={n}
                        type={interactive ? "button" : undefined}
                        disabled={!interactive}
                        onClick={() => interactive && onChange?.(n)}
                        onMouseEnter={() => interactive && setHover(n)}
                        onMouseLeave={() => interactive && setHover(0)}
                        className={interactive ? "cursor-pointer" : "cursor-default"}
                        aria-label={interactive ? `Rate ${n} out of 5` : undefined}
                    >
                        <Star
                            size={size}
                            fill={filled ? "#ffc107" : "none"}
                            color={filled ? "#ffc107" : "#d1d5db"}
                        />
                    </button>
                );
            })}
        </div>
    );
}

export default function UniversityReviewSection({
    universityId,
    isAuthenticated,
    authLoading,
    onRequireLogin,
}) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [submitSuccess, setSubmitSuccess] = useState(false);

    /* -------------------- Fetch reviews -------------------- */
    const fetchReviews = useCallback(async () => {
        if (!universityId) {
            setReviews([]);
            setLoading(false);
            return;
        }
        setLoading(true);
        setFetchError("");
        try {
            const res = await api.get(`/api/v1/review/university/${universityId}`);
            setReviews(res.data?.reviews || []);
        } catch (err) {
            setFetchError(
                err.response?.data?.message || err.message || "Failed to load reviews"
            );
        } finally {
            setLoading(false);
        }
    }, [universityId]);

    useEffect(() => {
        fetchReviews();
    }, [fetchReviews]);

    const avgRating =
        reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

    /* -------------------- Write review click -------------------- */
    const handleWriteReviewClick = () => {
        if (authLoading) {
            setSubmitError("Please wait, checking your login status...");
            return;
        }

        if (!isAuthenticated) {
            if (typeof onRequireLogin === "function") {
                onRequireLogin();
            } else {
                setSubmitError("Please log in to write a review.");
            }
            return;
        }

        setShowForm((prev) => !prev);
        setSubmitSuccess(false);
        setSubmitError("");
    };

    /* -------------------- Submit review -------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setSubmitError("Please select a star rating.");
            return;
        }

        setSubmitting(true);
        setSubmitError("");
        try {
            await api.post("/api/v1/review/university", {
                universityId,
                rating,
                comment,
            });

            setSubmitSuccess(true);
            setShowForm(false);
            setRating(0);
            setComment("");
            fetchReviews();
        } catch (err) {
            if (err.response?.status === 401) {
                if (typeof onRequireLogin === "function") {
                    onRequireLogin();
                } else {
                    setSubmitError("Please log in to submit a review.");
                }
            } else {
                setSubmitError(
                    err.response?.data?.message ||
                        err.message ||
                        "Could not submit review"
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    /* -------------------- Render -------------------- */
    return (
        <div
            className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8 shadow-sm"
            aria-labelledby="reviews-heading"
        >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h2
                        id="reviews-heading"
                        className="text-2xl md:text-3xl font-bold text-[#002147] mb-2"
                    >
                        Student Reviews
                    </h2>
                    {reviews.length > 0 ? (
                        <div className="flex items-center gap-2">
                            <StarRating value={avgRating} size={18} />
                            <span className="font-bold text-gray-800">
                                {avgRating.toFixed(1)}
                            </span>
                            <span className="text-gray-500 text-sm">
                                ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
                            </span>
                        </div>
                    ) : (
                        !loading && (
                            <p className="text-gray-500 text-sm">
                                No reviews yet — be the first.
                            </p>
                        )
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleWriteReviewClick}
                    disabled={authLoading}
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-[#c15304] text-white font-bold py-2.5 px-5 rounded-xl hover:bg-[#a04503] transition shadow-sm text-sm disabled:opacity-60 shrink-0"
                >
                    <MessageSquare size={16} aria-hidden="true" />
                    {authLoading
                        ? "Loading..."
                        : showForm
                        ? "Cancel"
                        : "Write a Review"}
                </button>
            </div>

            {submitSuccess && (
                <div className="mb-6 rounded-xl bg-green-50 border border-green-200 text-green-800 text-sm px-4 py-3">
                    Thanks! Your review has been submitted.
                </div>
            )}

            {submitError && !showForm && (
                <div className="mb-6 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3">
                    {submitError}
                </div>
            )}

            {showForm && isAuthenticated && (
                <form
                    onSubmit={handleSubmit}
                    className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5"
                >
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your rating
                    </label>
                    <StarRating
                        value={rating}
                        size={26}
                        interactive
                        onChange={setRating}
                    />

                    <label
                        htmlFor="review-comment"
                        className="block text-sm font-semibold text-gray-700 mt-4 mb-2"
                    >
                        Your review (optional)
                    </label>
                    <textarea
                        id="review-comment"
                        rows={3}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Share your experience with this university..."
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#c15304]/40"
                    />

                    {submitError && (
                        <p className="text-red-600 text-sm mt-2">{submitError}</p>
                    )}

                    <button
                        type="submit"
                        disabled={submitting}
                        className="cursor-pointer mt-4 inline-flex items-center gap-2 bg-[#0056D2] text-white font-bold py-2.5 px-6 rounded-xl hover:bg-[#00459e] transition text-sm disabled:opacity-60"
                    >
                        {submitting && (
                            <Loader2
                                size={16}
                                className="animate-spin"
                                aria-hidden="true"
                            />
                        )}
                        {submitting ? "Submitting..." : "Submit Review"}
                    </button>
                </form>
            )}

            {loading ? (
                <p className="text-gray-500 text-sm">Loading reviews...</p>
            ) : fetchError ? (
                <p className="text-red-600 text-sm">{fetchError}</p>
            ) : reviews.length === 0 ? null : (
                <ul className="space-y-5">
                    {reviews.map((r) => (
                        <li
                            key={r._id}
                            className="border-t border-gray-100 pt-5 first:border-t-0 first:pt-0"
                        >
                            <div className="flex items-start gap-3">
                                <div className="shrink-0 w-10 h-10 rounded-full bg-[#0056D2]/10 text-[#0056D2] font-bold flex items-center justify-center text-sm">
                                    {(r.name || r.user?.name || "S")
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                                        <span className="font-semibold text-gray-900 text-sm">
                                            {r.name || r.user?.name || "Student"}
                                        </span>
                                        <span className="text-gray-400 text-xs">
                                            {formatRelativeDate(r.createdAt)}
                                        </span>
                                    </div>
                                    <StarRating value={r.rating} size={14} />
                                    {r.comment && (
                                        <p className="text-gray-700 text-sm mt-1.5 leading-relaxed break-words">
                                            {r.comment}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}