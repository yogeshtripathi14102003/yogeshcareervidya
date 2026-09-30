"use client";

import React from "react";
import Image from "next/image";

export default function CourseTestimonials({ testimonials, courseTitle }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  /* ═══════════════════════════════════════════════
     Calculate average rating
  ═══════════════════════════════════════════════ */
  const validRatings = testimonials.filter((t) => t.rating > 0);
  const avgRating =
    validRatings.length > 0
      ? (
          validRatings.reduce((sum, t) => sum + t.rating, 0) /
          validRatings.length
        ).toFixed(1)
      : null;

  /* ═══════════════════════════════════════════════
     SEO: AggregateRating + Review Schema
  ═══════════════════════════════════════════════ */
  const reviewSchema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseTitle || "Course",
    ...(avgRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating,
        reviewCount: validRatings.length,
        bestRating: 5,
        worstRating: 1,
      },
    }),
    review: testimonials
      .filter((t) => t.name && t.review)
      .map((t) => ({
        "@type": "Review",
        author: { "@type": "Person", name: t.name },
        reviewRating: {
          "@type": "Rating",
          ratingValue: t.rating || 5,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: t.review?.replace(/<[^>]*>/g, "").trim() || "",
        ...(t.year && { datePublished: `${t.year}-01-01` }),
      })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewSchema) }}
      />

      <section
        aria-labelledby="testimonials-heading"
        className="w-full py-16 font-sans"
        style={{
          background:
            "linear-gradient(180deg, #fff 0%, var(--cv-neutral-light) 100%)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          {/* ═══════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════ */}
          <header className="text-center mb-12">
            <span
              className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] uppercase mb-3"
              style={{ color: "var(--cv-primary)" }}
            >
              Student Success Stories
            </span>

            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-extrabold leading-tight mb-4"
              style={{ color: "var(--cv-primary)" }}
            >
              What Our{" "}
              <span style={{ color: "var(--cv-accent)" }}>Students Say</span>
            </h2>

            <div
              aria-hidden="true"
              className="w-20 h-1 mx-auto rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, var(--cv-primary), var(--cv-accent))",
              }}
            />

            {/* Average Rating Summary */}
            {avgRating && (
              <div
                className="mt-6 inline-flex items-center gap-3 rounded-full px-5 py-2.5 shadow-sm"
                style={{
                  background: "#fff",
                  border: "1px solid var(--cv-neutral-border)",
                }}
              >
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className="w-4 h-4"
                      style={{
                        color:
                          star <= Math.round(avgRating)
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
                  className="text-sm font-bold"
                  style={{ color: "var(--cv-primary)" }}
                >
                  {avgRating} / 5
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--cv-neutral-mid)" }}
                >
                  ({validRatings.length} review
                  {validRatings.length > 1 ? "s" : ""})
                </span>
              </div>
            )}
          </header>

          {/* ═══════════════════════════════════════════
              TESTIMONIALS GRID
          ═══════════════════════════════════════════ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <article
                key={index}
                itemScope
                itemProp="review"
                itemType="https://schema.org/Review"
                className="group relative rounded-2xl p-6 md:p-7 shadow-sm transition-all duration-300 flex flex-col"
                style={{
                  background: "#fff",
                  border: "1px solid var(--cv-neutral-border)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--cv-primary)";
                  e.currentTarget.style.boxShadow =
                    "0 20px 40px rgba(30, 58, 138, 0.15)";
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor =
                    "var(--cv-neutral-border)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Quote Icon — Light Navy */}
                <div
                  aria-hidden="true"
                  className="absolute top-4 right-4 text-5xl font-serif leading-none select-none"
                  style={{ color: "var(--cv-primary-light)" }}
                >
                  &ldquo;
                </div>

                {/* Rating Stars — Orange accent */}
                {t.rating > 0 && (
                  <div className="flex items-center gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className="w-4 h-4"
                        style={{
                          color:
                            star <= t.rating
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
                )}

                {/* Review Text */}
                {t.review && (
                  <div
                    itemProp="reviewBody"
                    className="text-sm md:text-base leading-relaxed mb-5 flex-1 prose prose-sm max-w-none"
                    style={{ color: "var(--cv-neutral-dark)" }}
                    dangerouslySetInnerHTML={{ __html: t.review }}
                  />
                )}

                {/* Student Info */}
                <div
                  className="flex items-center gap-3 pt-4"
                  style={{ borderTop: "1px solid var(--cv-neutral-border)" }}
                >
                  {/* Avatar */}
                  <div
                    className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
                    style={{ background: "var(--cv-primary)" }}
                  >
                    {t.image?.url ? (
                      <Image
                        src={t.image.url}
                        alt={t.name || "Student"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span
                        className="font-bold text-lg"
                        style={{ color: "#fff" }}
                      >
                        {t.name?.charAt(0)?.toUpperCase() || "S"}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    {t.name && (
                      <p
                        itemProp="author"
                        itemScope
                        itemType="https://schema.org/Person"
                        className="font-bold text-sm truncate"
                        style={{ color: "var(--cv-primary)" }}
                      >
                        <span itemProp="name">{t.name}</span>
                      </p>
                    )}

                    <p
                      className="text-xs truncate"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      {t.course && <span>{t.course}</span>}
                      {t.course && t.university && " • "}
                      {t.university && (
                        <span
                          className="font-medium"
                          style={{ color: "var(--cv-neutral-dark)" }}
                        >
                          {t.university}
                        </span>
                      )}
                    </p>

                    {t.year && (
                      <p
                        className="text-[10px] mt-0.5"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        Batch of {t.year}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}