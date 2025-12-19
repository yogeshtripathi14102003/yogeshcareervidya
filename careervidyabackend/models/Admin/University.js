

// import mongoose from 'mongoose';

// // Helper Schemas for repeated structures
// const ApprovalSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     logo: { type: String, default: null }
// });

// const CourseSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     duration: { type: String, default: 'N/A' },
//     logo: { type: String, default: null }
// });

// const UniversitySchema = new mongoose.Schema({
//     name: { type: String, required: true },

//     // ⭐ REQUIRED FIELD (Missing)
//     universityImage: { type: String, default: null },

//     description: { type: String, default: "" },
//     youtubeLink: { type: String, default: "" },
//     shareDescription: { type: String, default: "" },
//     cardDescription: { type: String, default: "" },

//     highlights: {
//         heading: { type: String, default: "" },
//         points: { type: [String], default: [] }
//     },

//     facts: {
//         factsHeading: { type: String, default: "" },
//         factsSubHeading: { type: String, default: "" },
//         factsPoints: { type: [String], default: [] }
//     },

//     approvals: { type: [ApprovalSchema], default: [] },

//     recognition: {
//         recognitionHeading: { type: String, default: 'Recognition' },
//         recognitionDescription: { type: String, default: '' },
//         recognitionPoints: { type: [String], default: [] },
//         certificateImage: { type: String, default: null }
//     },

//     admission: {
//         admissionHeading: { type: String, default: 'Admission Process' },
//         admissionSubHeading: { type: String, default: '' },
//         admissionDescription: { type: String, default: '' },
//         admissionPoints: { type: [String], default: [] }
//     },

//     courses: { type: [CourseSchema], default: [] }
// }, { timestamps: true });

// export default mongoose.model('University', UniversitySchema);


"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(6);

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");
      setUniversities(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading universities...
      </div>
    );
  }

  return (
    <section className="py-16 bg-white">
      {/* ===== HEADING ===== */}
      <h2 className="text-4xl font-bold mb-12 text-center text-gray-900">
        Explore over 100 online universities & compare on 30+ factors
      </h2>

      <div className="max-w-7xl mx-auto px-6">
        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.slice(0, displayLimit).map((uni) => {
            const bannerImage = uni.universityImage
              ? uni.universityImage.startsWith("http")
                ? uni.universityImage
                : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
              : "/fallback.png";

            const logoImage = uni.universityLogo
              ? uni.universityLogo.startsWith("http")
                ? uni.universityLogo
                : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityLogo.replace(/^\/+/, "")}`
              : "/fallback-logo.png";

            const approvals = uni.approvals || [
              "NIRF",
              "NAAC A+",
              "AICTE",
              "WES",
            ];

            const courseCount = uni.courses?.length || 0;

            return (
              <div
                key={uni._id}
                className="bg-white rounded-3xl shadow-lg border overflow-hidden"
              >
                {/* ===== BANNER IMAGE ===== */}
                <div className="relative w-full h-44">
                  <Image
                    src={bannerImage}
                    alt={uni.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* ===== CONTENT ===== */}
                <div className="p-6">
                  {/* UNIVERSITY NAME */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {uni.name}
                  </h3>

                  {/* APPROVALS */}
                  <div className="flex items-start gap-2 mb-4">
                    <span className="text-blue-700 mt-1">🏆</span>
                    <p className="text-sm text-gray-600">
                      {approvals.join(", ")}
                    </p>
                  </div>

                  {/* COURSES + LOGO */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2 text-blue-700 font-semibold text-sm">
                      🎓 {courseCount} Courses
                    </div>

                    <div className="relative w-16 h-10 bg-white rounded-md border p-1">
                      <Image
                        src={logoImage}
                        alt={`${uni.name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="grid grid-cols-3 gap-3">
                    <button className="bg-black text-white text-sm py-2 rounded-md">
                      Details
                    </button>

                    <button className="border border-black text-black text-sm py-2 rounded-md">
                      Apply Now
                    </button>

                    <button className="bg-black text-white text-sm py-2 rounded-md">
                      Compare
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ===== VIEW MORE ===== */}
        {universities.length > displayLimit && (
          <div className="text-center mt-12">
            <button
              onClick={() => setDisplayLimit((prev) => prev + 3)}
              className="bg-[#05347f] text-white px-10 py-3 rounded-full font-semibold hover:bg-[#042a63] transition"
            >
              VIEW MORE UNIVERSITIES →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
