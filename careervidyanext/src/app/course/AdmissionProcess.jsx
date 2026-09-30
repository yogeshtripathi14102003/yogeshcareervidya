"use client";

import React, { useEffect, useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ═══════════════════════════════════════════════
   LOGIN CHECK
═══════════════════════════════════════════════ */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

export default function AdmissionProcess({ steps, courseTitle }) {
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setLoggedIn(isLoggedIn());
  }, []);

  if (!steps || steps.length === 0) return null;

  const sorted = [...steps].sort((a, b) => (a.step || 0) - (b.step || 0));

  /* ═══════════════════════════════════════════════
     SEO: HowTo Schema
  ═══════════════════════════════════════════════ */
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Admission Process for ${courseTitle || "Course"}`,
    description: `Step-by-step guide to complete admission for ${
      courseTitle || "this course"
    }. The entire process is 100% online.`,
    totalTime: "P7D",
    step: sorted.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title || `Step ${index + 1}`,
      text: step.description?.replace(/<[^>]*>/g, "").trim() || "",
    })),
  };

  const handleStartApplication = () => {
    if (!loggedIn) {
      setShowSignup(true);
      return;
    }
    const target =
      document.getElementById("apply") || document.getElementById("signup");
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
      window.location.hash = "#apply";
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <section
        aria-labelledby="admission-heading"
        className="w-full py-14 md:py-20 font-sans overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #fff 0%, var(--cv-neutral-light) 50%, #fff 100%)",
        }}
        itemScope
        itemType="https://schema.org/HowTo"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10">
          {/* ═══════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════ */}
          <header className="text-center mb-12 md:mb-20">
            <span
              className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase mb-3"
              style={{ color: "var(--cv-accent)" }}
            >
              Admission Roadmap
            </span>

            <h2
              id="admission-heading"
              itemProp="name"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight mb-4 px-2"
              style={{ color: "var(--cv-primary)" }}
            >
              Admission Process for{" "}
              <span style={{ color: "var(--cv-accent)" }}>
                {courseTitle || "this Course"}
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <span
                className="w-10 h-[2px] rounded-full"
                style={{ background: "var(--cv-neutral-border)" }}
              />
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: "var(--cv-accent)" }}
              />
              <span
                className="w-10 h-[2px] rounded-full"
                style={{ background: "var(--cv-neutral-border)" }}
              />
            </div>

            <p
              itemProp="description"
              className="text-sm md:text-base max-w-2xl mx-auto px-4"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              Follow these simple steps to secure your admission — 100% online
              process.
            </p>
          </header>

          {/* ═══════════════════════════════════════════
              DESKTOP HORIZONTAL TIMELINE
          ═══════════════════════════════════════════ */}
          <ol className="hidden lg:flex list-none p-0 m-0 relative justify-between items-start">
            {/* Base line */}
            <div
              aria-hidden="true"
              className="absolute top-9 left-0 right-0 h-[2px]"
              style={{ background: "var(--cv-neutral-border)" }}
            />

            {/* Progress gradient line — Navy → Orange → Navy */}
            <div
              aria-hidden="true"
              className="absolute top-9 left-0 w-full h-[2px] opacity-50"
              style={{
                background:
                  "linear-gradient(90deg, var(--cv-primary), var(--cv-accent), var(--cv-primary))",
              }}
            />

            {sorted.map((step, index) => {
              const stepNum = step.step || index + 1;
              return (
                <li
                  key={index}
                  itemScope
                  itemProp="step"
                  itemType="https://schema.org/HowToStep"
                  className="relative group flex-1 px-2 xl:px-3"
                  style={{ maxWidth: `${100 / sorted.length}%` }}
                >
                  <div className="flex flex-col items-center text-center">
                    {/* NUMBER CIRCLE */}
                    <div className="relative mb-5 z-10">
                      <span
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-full blur-md transition-all duration-500"
                        style={{
                          background:
                            "radial-gradient(circle, rgba(249,115,22,0.15) 0%, transparent 70%)",
                          opacity: 0,
                        }}
                      />
                      <span
                        aria-label={`Step ${stepNum}`}
                        className="relative z-10 w-[72px] h-[72px] rounded-full flex items-center justify-center font-bold text-lg shadow-sm transition-all duration-300 ease-out"
                        style={{
                          background: "#fff",
                          border: "2px solid var(--cv-primary)",
                          color: "var(--cv-primary)",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "var(--cv-primary)";
                          e.currentTarget.style.color = "#fff";
                          e.currentTarget.style.transform = "scale(1.1)";
                          e.currentTarget.style.boxShadow =
                            "0 8px 20px rgba(30, 58, 138, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "#fff";
                          e.currentTarget.style.color = "var(--cv-primary)";
                          e.currentTarget.style.transform = "scale(1)";
                          e.currentTarget.style.boxShadow = "none";
                        }}
                      >
                        {String(stepNum).padStart(2, "0")}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="w-full px-1">
                      <h3
                        itemProp="name"
                        className="text-sm xl:text-base font-bold mb-2 leading-snug break-words transition-colors duration-300"
                        style={{ color: "var(--cv-primary)" }}
                      >
                        {step.title || `Step ${stepNum}`}
                      </h3>

                      {step.description && (
                        <div
                          itemProp="text"
                          className="text-xs xl:text-sm leading-relaxed prose prose-sm max-w-none break-words prose-p:my-1 prose-ul:my-2 prose-li:my-0.5"
                          style={{ color: "var(--cv-neutral-mid)" }}
                          dangerouslySetInnerHTML={{ __html: step.description }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ═══════════════════════════════════════════
              MOBILE VERTICAL TIMELINE
          ═══════════════════════════════════════════ */}
          <ol className="lg:hidden list-none p-0 m-0 relative">
            {/* Vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-6 sm:left-7 top-2 bottom-2 w-[2px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(30,58,138,0.2), rgba(249,115,22,0.4), rgba(30,58,138,0.2))",
              }}
            />

            {sorted.map((step, index) => {
              const stepNum = step.step || index + 1;
              return (
                <li
                  key={index}
                  itemScope
                  itemProp="step"
                  itemType="https://schema.org/HowToStep"
                  className="relative group pl-16 sm:pl-20 pb-8 last:pb-0"
                >
                  <div className="relative">
                    {/* NUMBER CIRCLE */}
                    <span
                      aria-label={`Step ${stepNum}`}
                      className="absolute -left-16 sm:-left-20 top-0 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-sm transition-all duration-300"
                      style={{
                        background: "#fff",
                        border: "2px solid var(--cv-primary)",
                        color: "var(--cv-primary)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--cv-primary)";
                        e.currentTarget.style.color = "#fff";
                        e.currentTarget.style.transform = "scale(1.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#fff";
                        e.currentTarget.style.color = "var(--cv-primary)";
                        e.currentTarget.style.transform = "scale(1)";
                      }}
                    >
                      {String(stepNum).padStart(2, "0")}
                    </span>

                    {/* CONTENT */}
                    <div className="pt-1">
                      <h3
                        itemProp="name"
                        className="text-sm sm:text-base font-bold mb-1.5 leading-snug break-words transition-colors duration-300"
                        style={{ color: "var(--cv-primary)" }}
                      >
                        {step.title || `Step ${stepNum}`}
                      </h3>

                      {step.description && (
                        <div
                          itemProp="text"
                          className="text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none break-words prose-p:my-1 prose-ul:my-2 prose-li:my-0.5"
                          style={{ color: "var(--cv-neutral-mid)" }}
                          dangerouslySetInnerHTML={{ __html: step.description }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ═══════════════════════════════════════════
              BOTTOM CTA — Orange gradient
          ═══════════════════════════════════════════ */}
          {!loggedIn && (
            <div className="mt-14 md:mt-20 text-center">
              <p
                className="text-sm md:text-base mb-5 px-4"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                🎯 Ready to begin your journey?
              </p>

              <button
                type="button"
                onClick={handleStartApplication}
                aria-label="Start your application"
                className="cv-btn-cta group inline-flex items-center gap-2 px-6 md:px-7 py-3 md:py-3.5 cursor-pointer"
              >
                Start Application
                <svg
                  className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {showSignup && (
        <Signup onClose={() => setShowSignup(false)} courseName={courseTitle} />
      )}
    </>
  );
}