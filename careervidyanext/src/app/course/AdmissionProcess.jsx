"use client";

import React, { useEffect, useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ================= LOGIN CHECK ================= */
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

  /* ================= SEO: HowTo Schema ================= */
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
        className="w-full py-14 md:py-20 bg-gradient-to-b from-white via-slate-50 to-white font-sans overflow-hidden"
        itemScope
        itemType="https://schema.org/HowTo"
      >
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 md:px-10">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-12 md:mb-20">
            <span className="inline-block text-[10px] sm:text-xs font-semibold tracking-[0.25em] uppercase text-[#c15304] mb-3">
              Admission Roadmap
            </span>

            <h2
              id="admission-heading"
              itemProp="name"
              className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-[#002147] leading-tight mb-4 px-2"
            >
              Admission Process for{" "}
              <span className="text-[#c15304]">
                {courseTitle || "this Course"}
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-2 mb-4"
            >
              <span className="w-10 h-[2px] bg-slate-300 rounded-full" />
              <span className="w-2 h-2 rounded-full bg-[#c15304]" />
              <span className="w-10 h-[2px] bg-slate-300 rounded-full" />
            </div>

            <p
              itemProp="description"
              className="text-gray-500 text-sm md:text-base max-w-2xl mx-auto px-4"
            >
              Follow these simple steps to secure your admission — 100% online
              process.
            </p>
          </header>

          {/* ============ DESKTOP HORIZONTAL TIMELINE ============ */}
          <ol className="hidden lg:flex list-none p-0 m-0 relative justify-between items-start">
            {/* Base line */}
            <div
              aria-hidden="true"
              className="absolute top-9 left-0 right-0 h-[2px] bg-slate-200"
            />
            {/* Progress gradient line */}
            <div
              aria-hidden="true"
              className="absolute top-9 left-0 w-full h-[2px] bg-gradient-to-r from-[#002147] via-[#c15304] to-[#002147] opacity-40"
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
                      {/* Glow ring */}
                      <span
                        aria-hidden="true"
                        className="absolute -inset-2 rounded-full bg-[#c15304]/0 group-hover:bg-[#c15304]/10 blur-md transition-all duration-500"
                      />
                      <span
                        aria-label={`Step ${stepNum}`}
                        className="relative z-10 w-[72px] h-[72px] rounded-full bg-white border-2 border-[#002147] text-[#002147] flex items-center justify-center font-bold text-lg shadow-sm
                          group-hover:bg-[#002147] group-hover:text-white group-hover:border-[#002147] group-hover:scale-110 group-hover:shadow-lg
                          transition-all duration-300 ease-out"
                      >
                        {String(stepNum).padStart(2, "0")}
                      </span>
                    </div>

                    {/* CONTENT */}
                    <div className="w-full px-1">
                      <h3
                        itemProp="name"
                        className="text-sm xl:text-base font-bold text-[#002147] mb-2 leading-snug break-words group-hover:text-[#c15304] transition-colors duration-300"
                      >
                        {step.title || `Step ${stepNum}`}
                      </h3>

                      {step.description && (
                        <div
                          itemProp="text"
                          className="text-gray-500 text-xs xl:text-sm leading-relaxed prose prose-sm max-w-none break-words
                            prose-p:my-1 prose-ul:my-2 prose-li:my-0.5"
                          dangerouslySetInnerHTML={{ __html: step.description }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ============ MOBILE VERTICAL TIMELINE ============ */}
          <ol className="lg:hidden list-none p-0 m-0 relative">
            {/* Vertical line */}
            <div
              aria-hidden="true"
              className="absolute left-6 sm:left-7 top-2 bottom-2 w-[2px] bg-gradient-to-b from-[#002147]/20 via-[#c15304]/30 to-[#002147]/20"
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
                      className="absolute -left-16 sm:-left-20 top-0 z-10 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white border-2 border-[#002147] text-[#002147] flex items-center justify-center font-bold text-sm sm:text-base shadow-sm
                        group-hover:bg-[#002147] group-hover:text-white group-hover:scale-110
                        transition-all duration-300"
                    >
                      {String(stepNum).padStart(2, "0")}
                    </span>

                    {/* CONTENT */}
                    <div className="pt-1">
                      <h3
                        itemProp="name"
                        className="text-sm sm:text-base font-bold text-[#002147] mb-1.5 leading-snug break-words group-hover:text-[#c15304] transition-colors duration-300"
                      >
                        {step.title || `Step ${stepNum}`}
                      </h3>

                      {step.description && (
                        <div
                          itemProp="text"
                          className="text-gray-500 text-xs sm:text-sm leading-relaxed prose prose-sm max-w-none break-words
                            prose-p:my-1 prose-ul:my-2 prose-li:my-0.5"
                          dangerouslySetInnerHTML={{ __html: step.description }}
                        />
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* ============ BOTTOM CTA ============ */}
          {!loggedIn && (
            <div className="mt-14 md:mt-20 text-center">
              <p className="text-sm md:text-base text-gray-600 mb-5 px-4">
                🎯 Ready to begin your journey?
              </p>

              <button
                type="button"
                onClick={handleStartApplication}
                aria-label="Start your application"
                className="group inline-flex items-center gap-2 bg-[#c15304] hover:bg-[#a34403] text-white text-sm md:text-base font-bold px-6 md:px-7 py-3 md:py-3.5 rounded-[6px] shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2"
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