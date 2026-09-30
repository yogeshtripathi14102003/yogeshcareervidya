"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Signup from "@/app/signup/page.jsx";

/* ═══════════════════════════════════════════════
   LOGIN CHECK
═══════════════════════════════════════════════ */
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

  const sorted = [...universities].sort(
    (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
  );

  const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
  const hasMore = sorted.length > INITIAL_COUNT;

  /* ═══════════════════════════════════════════════
     COMPARE TOGGLE
  ═══════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     GO TO COMPARE PAGE
  ═══════════════════════════════════════════════ */
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
        className="w-full py-12 md:py-16 font-sans"
        style={{ background: "#fff" }}
      >
        <div className="max-w-[1600px] mx-auto px-4 md:px-10">
          {/* ═══════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════ */}
          <header className="text-center mb-8 md:mb-10">
            <h2
              id="university-heading"
              className="text-2xl md:text-3xl font-bold leading-tight mb-3"
              style={{ color: "var(--cv-primary)" }}
            >
              Top Universities for {courseTitle || "this Course"}
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 mx-auto rounded-full"
              style={{ background: "var(--cv-primary)" }}
            />

            <p
              className="text-xs md:text-sm mt-3 max-w-2xl mx-auto"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              Compare fees, approvals, and ratings to find the perfect
              university for your career goals.
            </p>
          </header>

          {/* ═══════════════════════════════════════════
              CARDS GRID
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {visible.map((uni, index) => {
              const uniId = uni.universityId || uni.slug || index;
              const isCompared = selectedUnis.includes(uniId);

              return (
                <article
                  key={uniId}
                  className="group relative rounded-xl transition-all duration-300 overflow-hidden flex flex-col"
                  style={{
                    background: "#fff",
                    border: isCompared
                      ? "1px solid var(--cv-primary)"
                      : "1px solid var(--cv-neutral-border)",
                    boxShadow: isCompared
                      ? "0 8px 20px rgba(30, 58, 138, 0.15)"
                      : "none",
                  }}
                  onMouseEnter={(e) => {
                    if (!isCompared) {
                      e.currentTarget.style.borderColor = "var(--cv-primary)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 20px rgba(30, 58, 138, 0.12)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isCompared) {
                      e.currentTarget.style.borderColor =
                        "var(--cv-neutral-border)";
                      e.currentTarget.style.boxShadow = "none";
                    }
                  }}
                >
                  {/* Top Rated Badge — Orange accent */}
                  {uni.isTopRated && (
                    <div className="absolute top-2 right-2 z-10">
                      <span
                        className="inline-flex items-center gap-1 text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
                        style={{ background: "var(--cv-accent)" }}
                      >
                        ⭐ Top
                      </span>
                    </div>
                  )}

                  {/* ═══════════════════════════════════════
                      CARD HEADER
                  ═══════════════════════════════════════ */}
                  <div
                    className="p-4"
                    style={{ borderBottom: "1px solid var(--cv-neutral-border)" }}
                  >
                    <div className="flex items-start gap-3">
                      {/* Logo */}
                      <div
                        className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center overflow-hidden"
                        style={{
                          background: "var(--cv-neutral-light)",
                          border: "1px solid var(--cv-neutral-border)",
                        }}
                      >
                        {uni.universityImage ? (
                          <Image
                            src={uni.universityImage}
                            alt={uni.name || "University"}
                            width={56}
                            height={56}
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span
                            className="text-lg md:text-xl font-bold"
                            style={{ color: "var(--cv-neutral-mid)" }}
                          >
                            {uni.name?.charAt(0) || "U"}
                          </span>
                        )}
                      </div>

                      {/* Name + Rating */}
                      <div className="flex-1 min-w-0">
                        <h3
                          className="text-sm md:text-[15px] font-bold leading-snug mb-1 line-clamp-2"
                          style={{ color: "var(--cv-primary)" }}
                        >
                          {uni.name}
                        </h3>

                        {uni.rating > 0 && (
                          <div className="flex items-center gap-1">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <svg
                                  key={star}
                                  className="w-3 h-3"
                                  style={{
                                    color:
                                      star <= Math.round(uni.rating)
                                        ? "var(--cv-accent)"
                                        : "var(--cv-neutral-border)",
                                  }}
                                  fill="currentColor"
                                  viewBox="0 0 20 20"
                                  aria-hidden="true"
                                >
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                              ))}
                            </div>
                            <span
                              className="text-[11px] font-semibold"
                              style={{ color: "var(--cv-neutral-dark)" }}
                            >
                              {uni.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Approvals chips — Navy */}
                    {uni.approvals?.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {uni.approvals.slice(0, 2).map((a, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded"
                            style={{
                              background: "var(--cv-primary-light)",
                              color: "var(--cv-primary)",
                              border: "1px solid var(--cv-primary-light)",
                            }}
                          >
                            {a.name || a.label}
                          </span>
                        ))}
                        {uni.approvals.length > 2 && (
                          <span
                            className="text-[9px] font-semibold px-1"
                            style={{ color: "var(--cv-neutral-mid)" }}
                          >
                            +{uni.approvals.length - 2}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ═══════════════════════════════════════
                      CARD BODY
                  ═══════════════════════════════════════ */}
                  <div className="p-4 flex-1 flex flex-col">
                    {/* Fee */}
                    <div className="mb-3">
                      <p
                        className="text-[9px] uppercase tracking-widest font-semibold mb-0.5"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        Total Fee
                      </p>
                      <p
                        className="text-lg md:text-xl font-extrabold"
                        style={{ color: "var(--cv-primary)" }}
                      >
                        {uni.courseFees?.total || "Contact Us"}
                      </p>

                      {uni.courseFees?.emiStartsFrom && (
                        <p
                          className="text-[10px] font-semibold mt-0.5"
                          style={{ color: "var(--cv-accent)" }}
                        >
                          EMI from {uni.courseFees.emiStartsFrom}
                        </p>
                      )}
                    </div>

                    {/* Details List */}
                    <div className="space-y-1.5 mb-3 text-xs">
                      {uni.duration && (
                        <div className="flex justify-between items-center">
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--cv-neutral-mid)" }}
                          >
                            Duration
                          </span>
                          <span
                            className="font-semibold text-[10px]"
                            style={{ color: "var(--cv-neutral-dark)" }}
                          >
                            {uni.duration}
                          </span>
                        </div>
                      )}

                      {uni.courseFees?.perSemester && (
                        <div className="flex justify-between items-center">
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--cv-neutral-mid)" }}
                          >
                            Per Sem
                          </span>
                          <span
                            className="font-semibold text-[10px]"
                            style={{ color: "var(--cv-neutral-dark)" }}
                          >
                            {uni.courseFees.perSemester}
                          </span>
                        </div>
                      )}

                      {uni.mode && (
                        <div className="flex justify-between items-center">
                          <span
                            className="text-[10px]"
                            style={{ color: "var(--cv-neutral-mid)" }}
                          >
                            Mode
                          </span>
                          <span
                            className="font-semibold text-[10px]"
                            style={{ color: "var(--cv-neutral-dark)" }}
                          >
                            {uni.mode}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ═══════════════════════════════════════
                        CTA BUTTONS
                    ═══════════════════════════════════════ */}
                    <div className="mt-auto space-y-2">
                      {/* Apply Now — Navy solid */}
                      <a
                        href={uni.applyLink || "#"}
                        className="block w-full text-center text-white text-xs font-semibold py-2 rounded-md transition-colors"
                        style={{ background: "var(--cv-primary)" }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background =
                            "var(--cv-primary-dark)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "var(--cv-primary)";
                        }}
                      >
                        Apply Now
                      </a>

                      <div className="flex gap-1.5">
                        {/* Compare Button */}
                        <button
                          type="button"
                          onClick={() => toggleCompare(uniId)}
                          className="flex-1 text-xs font-semibold py-2 rounded-md transition-colors"
                          style={{
                            background: isCompared
                              ? "var(--cv-primary-light)"
                              : "#fff",
                            color: isCompared
                              ? "var(--cv-primary)"
                              : "var(--cv-primary)",
                            border: isCompared
                              ? "1px solid var(--cv-primary)"
                              : "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          {isCompared ? "✓ Added" : "+ Compare"}
                        </button>

                        {/* Brochure Button */}
                        {uni.brochureLink && (
                          <a
                            href={uni.brochureLink}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="flex items-center justify-center w-9 rounded-md transition-colors"
                            style={{
                              background: "#fff",
                              border: "1px solid var(--cv-neutral-border)",
                              color: "var(--cv-neutral-mid)",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--cv-primary)";
                              e.currentTarget.style.color = "var(--cv-primary)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.borderColor =
                                "var(--cv-neutral-border)";
                              e.currentTarget.style.color =
                                "var(--cv-neutral-mid)";
                            }}
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

          {/* ═══════════════════════════════════════════
              VIEW MORE BUTTON
          ═══════════════════════════════════════════ */}
          {hasMore && !showAll && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: "#fff",
                  border: "1px solid var(--cv-primary)",
                  color: "var(--cv-primary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "var(--cv-primary)";
                  e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#fff";
                  e.currentTarget.style.color = "var(--cv-primary)";
                }}
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

          {/* ═══════════════════════════════════════════
              SHOW LESS BUTTON
          ═══════════════════════════════════════════ */}
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
                className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
                style={{
                  background: "#fff",
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-mid)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cv-primary)";
                  e.currentTarget.style.color = "var(--cv-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "var(--cv-neutral-border)";
                  e.currentTarget.style.color = "var(--cv-neutral-mid)";
                }}
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

          {/* Footnote */}
          <div className="mt-6 text-center">
            <p
              className="text-[11px] italic"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              * Fees and approvals are indicative and subject to change. Verify
              with the university before applying.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FLOATING COMPARE BAR — Navy bg
      ═══════════════════════════════════════════ */}
      {selectedUnis.length > 0 && (
        <div
          className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 max-w-[95vw]"
          style={{
            background: "var(--cv-primary)",
            color: "#fff",
          }}
        >
          <span className="text-xs font-semibold whitespace-nowrap">
            {selectedUnis.length} selected
          </span>

          <button
            type="button"
            onClick={() => setSelectedUnis([])}
            className="text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
            style={{ background: "rgba(255,255,255,0.2)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.2)";
            }}
          >
            Clear
          </button>

          <button
            type="button"
            onClick={handleCompareAll}
            disabled={selectedUnis.length < 2}
            className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "var(--cv-accent)" }}
            onMouseEnter={(e) => {
              if (selectedUnis.length >= 2) {
                e.currentTarget.style.background = "var(--cv-accent-dark)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--cv-accent)";
            }}
          >
            Compare Now →
          </button>
        </div>
      )}

      {/* SIGNUP MODAL */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={courseTitle}
        />
      )}
    </>
  );
}