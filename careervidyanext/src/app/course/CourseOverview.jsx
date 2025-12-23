"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx";

export default function CourseOverview({ course }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!course?.overview?.length) return null;

  return (
    <>
      {/* ================= OVERVIEW SECTION ================= */}
      <section className="w-full bg-white overflow-hidden">
        <div className="max-w-[1800px] lg:w-[90%] mx-auto">
          {course.overview.map((item, i) => (
            <div
              key={i}
              className={`flex flex-col lg:flex-row items-center w-full min-h-[350px] bg-white ${
                i % 2 !== 0 ? "lg:flex-row-reverse" : ""
              }`}
            >
              {/* IMAGE SIDE */}
              <div className="w-full lg:w-1/2 flex items-center justify-center">
                {item.image?.url ? (
                  <div className="w-full h-full flex items-center justify-center p-4 lg:p-6">
                    <img
                      src={item.image.url}
                      alt={item.heading}
                      className="w-full h-auto max-h-[250px] lg:h-[350px] object-contain transition-transform duration-500 hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="w-full h-[200px] lg:h-[350px] bg-slate-50 flex items-center justify-center">
                    <span className="text-slate-400 font-bold">
                      Image Placeholder
                    </span>
                  </div>
                )}
              </div>

              {/* CONTENT SIDE */}
              <div className="w-full lg:w-1/2 px-6 md:px-16 lg:px-10 py-6 lg:py-4">
                <div className="max-w-2xl mx-auto lg:mx-0">
                  <div className="inline-block px-3 py-1 mb-3 bg-blue-100/80 text-blue-700 rounded-full text-[11px] font-bold uppercase tracking-widest">
                    Career Vidya Insight
                  </div>

                  <h2 className="text-2xl font-extrabold text-[#002147] mb-3">
                    {item.heading}
                  </h2>

                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
                    {item.description}
                  </p>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-start">
                    
                    {/* ✅ SYLLABUS BUTTON (SIGNUP FLOW) */}
                    <button
                      type="button"
                      onClick={() => setShowSignup(true)}
                      className="w-full sm:w-auto bg-[#002147] text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-blue-900 transition-all text-center text-sm"
                    >
                      Get Full Syllabus
                    </button>

                    {/* VIDEO LINK */}
                    {item.videoLink && (
                      <a
                        href={item.videoLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-[#002147] font-bold hover:text-blue-600 transition-colors py-1 group text-sm"
                      >
                        <span className="w-10 h-10 flex items-center justify-center rounded-full bg-white border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                          ▶
                        </span>
                        Watch Details
                      </a>
                    )}
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= SIGNUP POPUP ================= */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onSuccess={() => {
            setShowSignup(false);
            if (course?.syllabusFile?.url) {
              window.open(course.syllabusFile.url, "_blank");
            }
          }}
          courseName={course?.courseName}
        />
      )}
    </>
  );
}
