"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Signup from "@/app/signup/page.jsx";

/* ================= LOGIN CHECK ================= */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

const INITIAL_COUNT = 4;

export default function UniversityCards({ universities, courseTitle }) {
  const router = useRouter();
  const [showSignup, setShowSignup] = useState(false);
  const [selectedUnis, setSelectedUnis] = useState([]);
  const [showAll, setShowAll] = useState(false);

  if (!universities || universities.length === 0) {
    return null;
  }

  // Sort by displayOrder
  const sorted = [...universities].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  // Show first 4 or all
  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
  const hasMore = sorted.length > INITIAL_COUNT;

  /* ================= COMPARE TOGGLE ================= */
  const toggleCompare = (uniId) => {
    setSelectedUnis((prev) => {
      if (prev.includes(uniId)) return prev.filter((id) => id !== uniId);
      if (prev.length >= 3) {
        alert("You can compare up to 3 universities at a time.");
        return prev;
      }
      return [...prev, uniId];
    });
  };

  /* ================= GO TO COMPARE PAGE ================= */
  const goToCompare = (ids) => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }
    router.push(`/compare?universities=${ids.join(",")}`);
  };

  const handleCompareAll = () => {
    if (selectedUnis.length < 2) {
      alert("Please select at least 2 universities to compare.");
      return;
    }
    goToCompare(selectedUnis);
  };

  return (
    <>
      <section
        aria-labelledby="university-heading"
        className="w-full py-12 md:py-16 bg-white font-sans"
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-10">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-8 md:mb-10">
            <h2
              id="university-heading"
              className="text-2xl md:text-3xl font-bold text-[#002147] leading-tight mb-3"
            >
              Top Universities for {courseTitle || "this Course"}
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 bg-[#002147] mx-auto rounded-full"
            />

            <p className="text-gray-500 text-xs md:text-sm mt-3 max-w-2xl mx-auto">
              Compare fees, approvals, and ratings to find the perfect
              university for your career goals.
            </p>
          </header>

          {/* ============ UNIVERSITY CARDS GRID — 4 per row ============ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {visible.map((uni, index) => {
              const uniId = uni.universityId || uni.slug || index;
              const isCompared = selectedUnis.includes(uniId);

              return (
                <article
                  key={uniId}
                  className={`group relative bg-white rounded-xl border transition-all duration-300 overflow-hidden flex flex-col ${
                    isCompared
                      ? "border-blue-500 shadow-md shadow-blue-100"
                      : uni.isTopRated
                      ? "border-amber-300 shadow-sm"
                      : "border-slate-200 hover:border-blue-300 hover:shadow-md"
                  }`}
                >
                  {/* Top Rated Badge */}
                  {uni.isTopRated && (
                    <div className="absolute top-2 right-2 z-10">
                      <span className="inline-flex items-center gap-1 bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                        ⭐ Top
                      </span>
                    </div>
                  )}

                  {/* ============ CARD HEADER ============ */}
                  <div className="p-4 border-b border-slate-100">
                    <div className="flex items-start gap-3">
                      {/* Logo */}
                      <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-center overflow-hidden">
                        {uni.universityImage ? (
                          <Image
                            src={uni.universityImage}
                            alt={uni.name || "University"}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-lg md:text-xl font-bold text-slate-300">
                            {uni.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>

                      {/* Name + Rating */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-[15px] font-bold text-[#002147] leading-snug mb-1 line-clamp-2">
                          {uni.name}
                        </h3>

                        {uni.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= Math.round(uni.rating)
                                      ? "text-amber-400"
                                      : "text-slate-200"
                                  }`}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span className="text-[11px] font-semibold text-slate-700">
                              {uni.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Approvals chips */}
                    {uni.approvals?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {uni.approvals.slice(0, 2).map((a, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-0.5 text-[9px] font-semibold bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100"
                          >
                            {a.name || a.label}
                          </span>
                        ))}
                        {uni.approvals.length > 2 && (
                          <span className="text-[9px] font-semibold text-gray-500 px-1">
                            +{uni.approvals.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ============ CARD BODY ============ */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Fee Display */}
                    <div className="mb-3">
                      <p className="text-[9px] uppercase tracking-widest text-gray-400 font-semibold mb-0.5">
                        Total Fee
                      </p>
                      <p className="text-lg md:text-xl font-extrabold text-[#002147]">
                        {uni.courseFees?.total || "Contact Us"}
                      </p>

                      {uni.courseFees?.emiStartsFrom && (
                        <p className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                          EMI from {uni.courseFees.emiStartsFrom}
                        </p>
                      )}
                    </div>

                    {/* Details List */}
                    <div className="space-y-1.5 mb-3 text-xs">
                      {uni.duration && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">
                            Duration
                          </span>
                          <span className="font-semibold text-slate-700 text-[10px]">
                            {uni.duration}
                          </span>
                        </div>
                      )}

                      {uni.courseFees?.perSemester && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">
                            Per Sem
                          </span>
                          <span className="font-semibold text-slate-700 text-[10px]">
                            {uni.courseFees.perSemester}
                          </span>
                        </div>
                      )}

                      {uni.mode && (
                        <div className="flex justify-between items-center">
                          <span className="text-slate-500 text-[10px]">Mode</span>
                          <span className="font-semibold text-slate-700 text-[10px]">
                            {uni.mode}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ============ CTA BUTTONS ============ */}
                    <div className="mt-auto space-y-2">
                      <a
                        href={uni.applyLink || "#"}
                        className="block w-full text-center bg-[#002147] hover:bg-blue-700 text-white text-xs font-semibold py-2 rounded-md transition-colors"
                      >
                        Apply Now
                      </a>

                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => toggleCompare(uniId)}
                          className={`flex-1 text-xs font-semibold py-2 rounded-md border transition-colors ${
                            isCompared
                              ? "bg-blue-50 border-blue-500 text-blue-700"
                              : "bg-white border-slate-300 text-[#002147] hover:border-blue-500 hover:text-blue-600"
                          }`}
                        >
                          {isCompared ? "✓ Added" : "+ Compare"}
                        </button>

                        {uni.brochureLink && (
                          <a
                            href={uni.brochureLink}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center justify-center w-9 bg-white border border-slate-300 text-slate-700 rounded-md hover:border-[#002147] hover:text-[#002147] transition-colors"
                            aria-label="Download Brochure"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                              />
                            </svg>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>

          {/* ============ VIEW MORE BUTTON ============ */}
          {hasMore && !showAll && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 bg-white border border-[#002147] text-[#002147] hover:bg-[#002147] hover:text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                View More Universities
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* ============ SHOW LESS ============ */}
          {hasMore && showAll && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);
                  document
                    .getElementById("university-heading")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" });
                }}
                className="inline-flex items-center gap-2 bg-white border border-slate-300 text-slate-600 hover:border-[#002147] hover:text-[#002147] text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
              >
                Show Less
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* ============ FOOTNOTE ============ */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 text-[11px] italic">
              * Fees and approvals are indicative and subject to change. Verify
              with the university before applying.
            </p>
          </div>
        </div>
      </section>

      {/* ============ FLOATING COMPARE BAR ============ */}
      {selectedUnis.length > 0 && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-[#002147] text-white px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 max-w-[95vw]">
          <span className="text-xs font-semibold whitespace-nowrap">
            {selectedUnis.length} selected
          </span>

          <button
            type="button"
            onClick={() => setSelectedUnis([])}
            className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1.5 rounded-full transition-colors"
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleCompareAll}
            disabled={selectedUnis.length < 2}
            className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-colors ${
              selectedUnis.length < 2
                ? "bg-slate-500 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Compare Now →
          </button>
        </div>
      )}

      {/* ============ SIGNUP MODAL ============ */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={courseTitle}
        />
      )}
    </>
  );
}