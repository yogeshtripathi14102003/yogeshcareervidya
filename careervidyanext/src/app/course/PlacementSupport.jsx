
"use client";

import { useEffect, useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ═══════════════════════════════════════════════
   LOGIN CHECK
═══════════════════════════════════════════════ */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

/* ═══════════════════════════════════════════════
   DESCRIPTION WRAP STYLE
═══════════════════════════════════════════════ */
const DESCRIPTION_STYLE = {
  color: "var(--cv-neutral-mid)",
  minWidth: 0,
  maxWidth: "100%",
  overflowWrap: "anywhere",
  wordBreak: "break-word",
  whiteSpace: "normal",
};

export default function PlacementSupport({
  placementSupport,
  courseTitle,
}) {
  const [showSignup, setShowSignup] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  /* ═══════════════════════════════════════════════
     LOGIN STATE — Live update
  ═══════════════════════════════════════════════ */
  useEffect(() => {
    const check = () => setLoggedIn(isLoggedIn());

    check();

    window.addEventListener("storage", check);
    window.addEventListener("focus", check);

    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
    };
  }, []);

  if (!placementSupport) return null;

  const { description, stats, services } = placementSupport;

  const hasStats =
    stats &&
    (stats.placementRate ||
      stats.avgPackage ||
      stats.highestPackage);

  const hasServices =
    Array.isArray(services) && services.length > 0;

  if (!description && !hasStats && !hasServices) {
    return null;
  }

  /* ═══════════════════════════════════════════════
     SEO SCHEMA
  ═══════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     STATS DATA
  ═══════════════════════════════════════════════ */
  const statsData = [
    {
      label: "Placement Rate",
      value: stats?.placementRate,
    },
    {
      label: "Average Package",
      value: stats?.avgPackage,
    },
    {
      label: "Highest Package",
      value: stats?.highestPackage,
    },
  ].filter((stat) => stat.value);

  /* ═══════════════════════════════════════════════
     APPLY CLICK
  ═══════════════════════════════════════════════ */
  const handleApplyClick = () => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }

    const target =
      document.getElementById("apply") ||
      document.getElementById("signup");

    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    } else {
      window.location.hash = "#apply";
    }
  };

  return (
    <>
      {/* SEO SCHEMA */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <section
        aria-labelledby="placement-heading"
        className="w-full py-8 md:py-10 font-sans overflow-x-clip"
        style={{
          background: "#fff",
          minWidth: 0,
        }}
      >
        {/* CONTAINER — Same as Overview */}
        <div className="w-full max-w-[1800px] lg:w-[90%] mx-auto px-4 sm:px-6 min-w-0">
          {/* ═══════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════ */}
          <header className="w-full min-w-0 text-center mb-8 md:mb-10">
            <h2
              id="placement-heading"
              className="text-2xl sm:text-3xl md:text-3xl font-bold leading-tight mb-3 px-2"
              style={{
                color: "var(--cv-primary)",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
              }}
            >
              Placement &amp; Career Support
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 mx-auto rounded-full"
              style={{
                background: "var(--cv-primary)",
              }}
            />

            {/* DESCRIPTION — FIXED */}
            {description && (
              <div
                className="
                  mt-4
                  w-full
                  max-w-3xl
                  mx-auto
                  px-2
                  sm:px-4
                  text-left
                  text-xs
                  sm:text-sm
                  md:text-base
                  leading-relaxed
                  break-words
                  [overflow-wrap:anywhere]
                  [&_*]:max-w-full
                  [&_p]:mb-3
                  [&_p:last-child]:mb-0
                  [&_ul]:pl-5
                  [&_ol]:pl-5
                  [&_li]:mb-1
                  [&_img]:h-auto
                  [&_img]:max-w-full
                  [&_a]:break-all
                  [&_table]:block
                  [&_table]:max-w-full
                  [&_table]:overflow-x-auto
                "
                style={DESCRIPTION_STYLE}
                dangerouslySetInnerHTML={{
                  __html: description,
                }}
              />
            )}
          </header>

          {/* ═══════════════════════════════════════════
              STATS GRID
          ═══════════════════════════════════════════ */}
          {hasStats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5 mb-8 md:mb-10">
              {statsData.map((stat, index) => (
                <article
                  key={index}
                  className="relative rounded-xl p-5 sm:p-6 shadow-sm transition-all duration-300 min-w-0"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--cv-primary)";

                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(30, 58, 138, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--cv-neutral-border)";

                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <div
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
                    style={{
                      background: "var(--cv-primary)",
                    }}
                  />

                  <div className="pt-2 min-w-0">
                    <p
                      className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-2 break-words"
                      style={{
                        color: "var(--cv-primary)",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {stat.value}
                    </p>

                    <p
                      className="text-[10px] sm:text-xs uppercase tracking-widest font-bold break-words"
                      style={{
                        color: "var(--cv-accent)",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {stat.label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              SERVICES GRID
          ═══════════════════════════════════════════ */}
          {hasServices && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-5">
              {services.map((service, index) => (
                <article
                  key={index}
                  className="group rounded-xl p-5 sm:p-6 transition-all duration-300 flex items-start gap-3 sm:gap-4 min-w-0"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--cv-primary)";

                    e.currentTarget.style.boxShadow =
                      "0 8px 20px rgba(30, 58, 138, 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor =
                      "var(--cv-neutral-border)";

                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* SERVICE NUMBER */}
                  <div
                    aria-hidden="true"
                    className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-xs transition-colors"
                    style={{
                      background: "var(--cv-primary)",
                    }}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <div className="flex-1 min-w-0">
                    {service.title && (
                      <h3
                        className="text-sm sm:text-base font-bold mb-1.5 leading-snug"
                        style={{
                          color: "var(--cv-primary)",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {service.title}
                      </h3>
                    )}

                    {service.description && (
                      <p
                        className="text-xs sm:text-sm leading-relaxed"
                        style={{
                          color: "var(--cv-neutral-mid)",
                          overflowWrap: "anywhere",
                          wordBreak: "break-word",
                        }}
                      >
                        {service.description}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              BOTTOM CTA — Logged-out users only
          ═══════════════════════════════════════════ */}
          {!loggedIn && (
            <div className="mt-8 md:mt-10 text-center">
              <p
                className="text-xs sm:text-sm md:text-base mb-4"
                style={{
                  color: "var(--cv-neutral-mid)",
                }}
              >
                🚀 Get complete placement assistance
              </p>

              <button
                type="button"
                onClick={handleApplyClick}
                aria-label="Talk to placement counselor"
                className="cv-btn-cta inline-flex items-center justify-center gap-2 px-6 py-3 max-w-full cursor-pointer"
              >
                <span>Talk to Counselor</span>

                <svg
                  className="w-4 h-4 flex-shrink-0"
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
