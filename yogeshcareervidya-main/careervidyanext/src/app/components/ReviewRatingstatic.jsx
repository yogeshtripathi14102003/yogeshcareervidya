"use client";

import { useEffect, useState } from "react";


 const REVIEWS = [
  {
    name: "Avijit Debnath",
    course: "B.Com + MBA",
    rating: 5,
    verified: true,
    date: "January 7, 2026",
    location: "India",
    comment:
      "It is a good, reputed and well known university. It has all the major rankings and accreditations so I would like to invest my time and money here.",
  },
  {
    name: "Neha Verma",
    course: "MBA",
    rating: 4,
    verified: true,
    date: "December 18, 2025",
    location: "India",
    comment:
      "Good university for working professionals. Course structure and LMS support are very helpful.",
  },
  {
    name: "Rahul Singh",
    course: "BBA + MBA",
    rating: 5,
    verified: true,
    date: "November 30, 2025",
    location: "India",
    comment:
      "Faculty support and online learning experience are excellent.",
  },
  {
    name: "Pooja Mehta",
    course: "MA (Education)",
    rating: 4,
    verified: true,
    date: "October 14, 2025",
    location: "India",
    comment:
      "Study material is easy to understand and well structured.",
  },
  {
    name: "Ankit Gupta",
    course: "MCA",
    rating: 5,
    verified: true,
    date: "September 20, 2025",
    location: "India",
    comment:
      "Best option for online MCA. Exams and support system are smooth.",
  },
  {
    name: "Sneha Patel",
    course: "MBA (HR)",
    rating: 4,
    verified: true,
    date: "August 11, 2025",
    location: "India",
    comment:
      "Good guidance from counselors during admission process.",
  },
  {
    name: "Vikas Yadav",
    course: "BA",
    rating: 4,
    verified: true,
    date: "July 6, 2025",
    location: "India",
    comment:
      "Affordable fees and recognized degree.",
  },
  {
    name: "Ritika Jain",
    course: "MBA (Finance)",
    rating: 5,
    verified: true,
    date: "June 19, 2025",
    location: "India",
    comment:
      "Finance specialization is very practical and industry focused.",
  },
  {
    name: "Mohit Kumar",
    course: "BCA",
    rating: 4,
    verified: true,
    date: "May 22, 2025",
    location: "India",
    comment:
      "Good online platform with recorded lectures.",
  },
  {
    name: "Kajal Arora",
    course: "MBA (Marketing)",
    rating: 5,
    verified: true,
    date: "April 9, 2025",
    location: "India",
    comment:
      "Marketing course helped me improve practical skills.",
  },
  {
    name: "Saurabh Mishra",
    course: "M.Com",
    rating: 4,
    verified: true,
    date: "March 16, 2025",
    location: "India",
    comment:
      "Accounting subjects are well explained.",
  },
  {
    name: "Nidhi Saxena",
    course: "MBA (Operations)",
    rating: 5,
    verified: true,
    date: "February 8, 2025",
    location: "India",
    comment:
      "Operations management content is very useful.",
  },
  {
    name: "Rohit Agarwal",
    course: "Executive MBA",
    rating: 5,
    verified: true,
    date: "January 25, 2025",
    location: "India",
    comment:
      "Perfect for working professionals like me.",
  },
  {
    name: "Simran Kaur",
    course: "MA (English)",
    rating: 4,
    verified: true,
    date: "December 3, 2024",
    location: "India",
    comment:
      "Literature subjects are well covered.",
  },
  {
    name: "Manish Tiwari",
    course: "MBA (IT)",
    rating: 5,
    verified: true,
    date: "November 17, 2024",
    location: "India",
    comment:
      "IT management modules are industry relevant.",
  },
  {
    name: "Priya Malhotra",
    course: "BBA",
    rating: 4,
    verified: true,
    date: "October 28, 2024",
    location: "India",
    comment:
      "Good foundation for management studies.",
  },
  {
    name: "Deepak Chauhan",
    course: "MBA",
    rating: 5,
    verified: true,
    date: "September 5, 2024",
    location: "India",
    comment:
      "Overall learning experience is excellent.",
  },
  {
    name: "Ayesha Khan",
    course: "MBA (HR)",
    rating: 4,
    verified: true,
    date: "August 14, 2024",
    location: "India",
    comment:
      "HR subjects are updated and relevant.",
  },
  {
    name: "Harsh Vardhan",
    course: "B.Com",
    rating: 5,
    verified: true,
    date: "July 2, 2024",
    location: "India",
    comment:
      "Commerce concepts are well explained.",
  },
  {
    name: "Shalini Gupta",
    course: "MBA (Finance)",
    rating: 4,
    verified: true,
    date: "June 10, 2024",
    location: "India",
    comment:
      "Finance case studies are very useful.",
  },
  {
    name: "Naveen Joshi",
    course: "MCA",
    rating: 5,
    verified: true,
    date: "May 18, 2024",
    location: "India",
    comment:
      "Good technical support and faculty.",
  },
  {
    name: "Rashmi Pandey",
    course: "MA (Psychology)",
    rating: 4,
    verified: true,
    date: "April 6, 2024",
    location: "India",
    comment:
      "Course content is detailed and helpful.",
  },
  {
    name: "Karan Malhotra",
    course: "MBA",
    rating: 5,
    verified: true,
    date: "March 12, 2024",
    location: "India",
    comment:
      "Admission process was smooth and transparent.",
  },
  {
    name: "Isha Kapoor",
    course: "BBA",
    rating: 4,
    verified: true,
    date: "February 1, 2024",
    location: "India",
    comment:
      "Good learning platform with flexibility.",
  },
  {
    name: "Alok Srivastava",
    course: "MBA (Strategy)",
    rating: 5,
    verified: true,
    date: "January 9, 2024",
    location: "India",
    comment:
      "Strategic management modules are excellent.",
  },
];

  // 👉 aise hi 25 bana sakte ho


// 🔀 Shuffle on refresh
const shuffleArray = (arr) => [...arr].sort(() => Math.random() - 0.5);

export default function EducationReviews() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(shuffleArray(REVIEWS));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Student Reviews</h2>

      <div className="space-y-6">
        {reviews.map((r, i) => (
          <div key={i} className="border-b pb-6">
            {/* Header */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center font-semibold text-gray-700">
                {r.name.charAt(0)}
              </div>

              <div>
                <p className="font-semibold">{r.name}</p>

                {/* Rating + Verified */}
                <div className="flex items-center gap-2 text-sm">
                  <div className="flex">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx}>
                        {idx < r.rating ? "⭐" : "☆"}
                      </span>
                    ))}
                  </div>

                  {r.verified && (
                    <span className="text-orange-500 font-semibold">
                      Verified
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Course */}
            <p className="font-semibold mt-2">{r.course}</p>

            {/* Date */}
            <p className="text-sm text-gray-500">
              Reviewed in {r.location} on {r.date}
            </p>

            {/* Comment */}
            <p className="mt-2 text-gray-700 leading-relaxed">
              {r.comment}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
