"use client";

import React from "react";

export default function Offerdcourse({
  offeredCourses,
  courseName = "Programs",
}) {
  if (!offeredCourses || offeredCourses.length === 0) {
    return null;
  }

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Offered ${courseName} Programs & Courses`,
    numberOfItems: offeredCourses.length,
    itemListElement: offeredCourses.map((offer, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: offer.heading || `Program ${i + 1}`,
      description: (offer.points || []).join(", ").slice(0, 200),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        aria-labelledby="offered-courses-heading"
        className="w-full bg-white py-12 md:py-16 border-y border-slate-100 font-sans"
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-8 md:mb-12">
            <h2
              id="offered-courses-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] leading-tight mb-4 px-2"
            >
              Offered {courseName} Programs &amp; Courses
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 bg-[#002147] mx-auto rounded-full"
            />
          </header>

          {/* ============ GRID ============ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {offeredCourses.map((offer, i) => (
              <article
                key={i}
                className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#c15304]/40 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* ---------- Header ---------- */}
                <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <h3 className="text-base sm:text-lg md:text-xl font-bold text-[#002147] leading-snug flex items-start gap-3">
                    {/* Number badge */}
                    <span
                      aria-hidden="true"
                      className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#002147] text-white text-xs font-bold flex items-center justify-center"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <span className="flex-1 pt-1">
                      {offer.heading || `Program ${i + 1}`}
                    </span>
                  </h3>
                </div>

                {/* ---------- Points ---------- */}
                <div className="p-5 sm:p-6 flex-1">
                  {offer.points?.length > 0 ? (
                    <ul className="space-y-2.5 list-none p-0 m-0">
                      {offer.points.map((point, j) => (
                        <li
                          key={j}
                          className="flex items-start gap-2.5 text-sm md:text-[15px] text-gray-700 leading-relaxed"
                        >
                          {/* Check icon */}
                          <span
                            aria-hidden="true"
                            className="flex-shrink-0 mt-1 w-4 h-4 rounded-full bg-[#c15304]/10 flex items-center justify-center"
                          >
                            <svg
                              className="w-2.5 h-2.5 text-[#c15304]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth="3.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </span>

                          <span className="flex-1 break-words">{point}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-xs sm:text-sm text-gray-400 italic">
                      No specific programs listed for this section.
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}