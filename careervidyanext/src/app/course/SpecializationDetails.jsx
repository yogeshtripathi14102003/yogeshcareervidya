"use client";

import React, { useState } from "react";

export default function SpecializationDetails({ specializations, courseTitle }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (!specializations || specializations.length === 0) {
    return null;
  }

  const valid = specializations.filter((s) => s.name);
  if (valid.length === 0) return null;

  const active = valid[activeIndex] || valid[0];

  // =====================================================
  // SEO: ItemList + Occupation Schema
  // =====================================================
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Specializations in ${courseTitle || "Course"}`,
    numberOfItems: valid.length,
    itemListElement: valid.map((spec, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "EducationalOccupationalCredential",
        name: spec.name,
        ...(spec.description && {
          description: spec.description.replace(/<[^>]*>/g, "").trim(),
        }),
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        aria-labelledby="specialization-heading"
        className="w-full py-16 bg-gradient-to-b from-white to-slate-50 font-sans"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-12">
            <span className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] text-blue-600 uppercase mb-3">
              Explore Your Path
            </span>

            <h2
              id="specialization-heading"
              className="text-3xl md:text-4xl font-extrabold text-[#002147] leading-tight mb-4"
            >
              Specializations in{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {courseTitle || "this Course"}
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"
            />

            <p className="text-gray-500 text-sm md:text-base mt-4 max-w-2xl mx-auto">
              Choose a specialization that matches your career goals. Each track
              opens doors to specific high-demand roles.
            </p>
          </header>

          {/* ============ TABS + CONTENT ============ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* ============ LEFT: TABS ============ */}
            <nav
              aria-label="Specialization tabs"
              className="lg:col-span-4 xl:col-span-3"
            >
              {/* Mobile: horizontal scroll */}
              <div className="lg:hidden -mx-4 px-4 overflow-x-auto pb-2">
                <div className="flex gap-2 min-w-max">
                  {valid.map((spec, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-current={activeIndex === i ? "true" : "false"}
                      className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-semibold transition-all ${
                        activeIndex === i
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                          : "bg-white text-gray-700 border border-slate-200 hover:border-blue-300"
                      }`}
                    >
                      {spec.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Desktop: vertical list */}
              <div className="hidden lg:flex flex-col gap-2">
                {valid.map((spec, i) => {
                  const isActive = activeIndex === i;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-current={isActive ? "true" : "false"}
                      className={`group text-left px-5 py-4 rounded-xl transition-all duration-300 flex items-center justify-between gap-3 ${
                        isActive
                          ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-200/50"
                          : "bg-white text-gray-700 border border-slate-200 hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <span className="font-semibold text-sm leading-snug">
                        {spec.name}
                      </span>

                      <span
                        aria-hidden="true"
                        className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          isActive
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-blue-50 group-hover:text-blue-600"
                        }`}
                      >
                        {isActive ? "●" : "→"}
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

            {/* ============ RIGHT: ACTIVE CONTENT ============ */}
            <div className="lg:col-span-8 xl:col-span-9">
              <article
                key={activeIndex}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-8 lg:p-10"
              >
                {/* Title */}
                <header className="mb-6 pb-5 border-b border-slate-100">
                  <span className="inline-block text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-600 mb-2">
                    Specialization
                  </span>
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[#002147] leading-tight">
                    {active.name}
                  </h3>
                </header>

                {/* Description */}
                {active.description && (
                  <div
                    className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: active.description }}
                  />
                )}

                {/* Career Roles */}
                {active.careerRoles?.length > 0 && (
                  <div>
                    <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-gray-500 mb-4 flex items-center gap-2">
                      <span className="w-6 h-0.5 bg-blue-600" />
                      Career Opportunities
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {active.careerRoles
                        .filter((r) => r.role)
                        .map((role, i) => (
                          <div
                            key={i}
                            className="group flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all duration-300"
                          >
                            {/* Icon */}
                            <div
                              aria-hidden="true"
                              className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white"
                            >
                              <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                />
                              </svg>
                            </div>

                            {/* Role + Salary */}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm text-[#002147] leading-snug truncate">
                                {role.role}
                              </p>
                              {role.salary && (
                                <p className="text-xs font-semibold text-emerald-600 mt-0.5">
                                  {role.salary}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3">
                  <p className="text-sm text-gray-500 flex-1 text-center sm:text-left">
                    Interested in {active.name}?
                  </p>
                  <a
                    href="#apply"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-semibold px-6 py-2.5 rounded-full hover:shadow-lg hover:shadow-blue-200 transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  >
                    Apply Now
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
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </a>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}