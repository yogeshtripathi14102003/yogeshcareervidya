"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ================= LOGIN CHECK ================= */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

export default function PlacementSupport({ placementSupport, courseTitle }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!placementSupport) return null;

  const { description, stats, services } = placementSupport;

  const hasStats =
    stats &&
    (stats.placementRate || stats.avgPackage || stats.highestPackage);

  const hasServices = Array.isArray(services) && services.length > 0;

  if (!description && !hasStats && !hasServices) {
    return null;
  }

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: courseTitle || "Course",
    ...(description && {
      description: description.replace(/<[^>]*>/g, "").trim(),
    }),
    ...(stats?.placementRate && {
      occupationalCategory: "Information Technology",
    }),
  };

  /* ================= STATS DATA ================= */
  const statsData = [
    { label: "Placement Rate", value: stats?.placementRate },
    { label: "Average Package", value: stats?.avgPackage },
    { label: "Highest Package", value: stats?.highestPackage },
  ].filter((s) => s.value);

  /* ================= APPLY CLICK ================= */
  const handleApplyClick = () => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }
    const target =
      document.getElementById("apply") || document.getElementById("signup");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    else window.location.hash = "#apply";
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        aria-labelledby="placement-heading"
        className="w-full py-12 md:py-16 bg-white font-sans overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-10 md:mb-12">
            <h2
              id="placement-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] leading-tight mb-4 px-2"
            >
              Placement & Career Support
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 bg-[#002147] mx-auto rounded-full"
            />

            {description && (
              <div
                className="text-gray-600 text-xs sm:text-sm md:text-base mt-4 max-w-3xl mx-auto leading-relaxed prose prose-sm max-w-none px-4"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            )}
          </header>

          {/* ============ STATS GRID ============ */}
          {hasStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-10 md:mb-12">
              {statsData.map((stat, i) => (
                <article
                  key={i}
                  className="relative rounded-xl p-5 sm:p-6 bg-white border border-slate-200 shadow-sm hover:shadow-md hover:border-[#c15304]/40 transition-all duration-300"
                >
                  {/* Top accent line */}
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl bg-[#002147]"
                  />

                  <div className="pt-2">
                    {/* Value */}
                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#002147] leading-none mb-2">
                      {stat.value}
                    </p>

                    {/* Label */}
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-[#c15304]">
                      {stat.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ============ SERVICES GRID ============ */}
          {hasServices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {services.map((service, i) => (
                <article
                  key={i}
                  className="group bg-white rounded-xl p-5 sm:p-6 border border-slate-200 hover:border-[#c15304]/40 hover:shadow-md transition-all duration-300 flex items-start gap-3 sm:gap-4"
                >
                  {/* Number circle */}
                  <div
                    aria-hidden="true"
                    className="flex-shrink-0 w-10 h-10 rounded-full bg-[#002147] group-hover:bg-[#c15304] flex items-center justify-center text-white font-bold text-xs transition-colors"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>

                  <div className="flex-1 min-w-0">
                    {service.title && (
                      <h3 className="text-sm sm:text-base font-bold text-[#002147] mb-1.5 leading-snug">
                        {service.title}
                      </h3>
                    )}

                    {service.description && (
                      <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ============ BOTTOM CTA ============ */}
          <div className="mt-10 md:mt-14 text-center">
            <p className="text-xs sm:text-sm md:text-base text-gray-600 mb-4">
              🚀 Get complete placement assistance
            </p>

            <button
              type="button"
              onClick={handleApplyClick}
              aria-label="Talk to placement counselor"
              className="inline-flex items-center gap-2 bg-[#c15304] hover:bg-[#a34403] text-white text-sm font-bold px-6 py-3 rounded-[5px] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2"
            >
              Talk to Counselor
              <svg
                className="w-4 h-4"
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
        </div>
      </section>

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