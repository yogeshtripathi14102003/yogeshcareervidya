"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx"; // ✅ path verify kar lena

export default function CourseKeyHighlights({ course }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!course?.keyHighlights?.length) return null;

  return (
    <>
      {/* ================= KEY HIGHLIGHTS ================= */}
      <section className="w-full bg-white py-16 border-y border-slate-100">
        <div className="w-full px-6 md:px-12 lg:px-20">
          
          {/* Heading */}
          <div className="mb-12">
            <h2 className="text-2xl md:text-2xl font-extrabold text-[#002147] leading-tight">
              What You’ll Learn & Gain {course.courseName} In India ?
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* LEFT: Highlights */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              {course.keyHighlights.map((item, i) => (
                <div
                  key={i}
                  className="group flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-slate-50"
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <svg
                        className="w-3.5 h-3.5 text-blue-600 group-hover:text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            {/* RIGHT: Admission Card */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 bg-[#002147] rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">
                
                {/* Decorative Circle */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>

                <h3 className="text-2xl font-bold mb-6 relative z-10">
                  Admission Closing Soon
                </h3>

                <div className="space-y-5 relative z-10">
                  {[
                    "Avoid paying 25% Late Fees",
                    "Secure a seat in your dream university",
                    "Avail early benefits",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl border border-white/10"
                    >
                      <span className="text-blue-400 text-lg">✦</span>
                      <p className="text-sm font-semibold tracking-wide">
                        {text}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ✅ ENROLL BUTTON */}
                <button
                  onClick={() => setShowSignup(true)}
                  className="w-full mt-8 bg-[#c15304] hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  Enroll Now
                </button>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= SIGNUP POPUP ================= */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={course.courseName} // ✅ optional (auto-fill)
        />
      )}
    </>
  );
}
