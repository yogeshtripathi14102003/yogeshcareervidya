"use client";

import React from "react";
import Image from "next/image";

export default function CourseTestimonials({ testimonials, courseTitle }) {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // Calculate average rating
  const validRatings = testimonials.filter((t) => t.rating > 0);
  const avgRating =
    validRatings.length > 0
      ? (
          validRatings.reduce((sum, t) => sum + t.rating, 0) /
          validRatings.length
        ).toFixed(1)
      : null;

  // =====================================================
  // SEO: AggregateRating + Review Schema
  // =====================================================
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
        className="w-full py-16 bg-gradient-to-b from-white to-slate-50 font-sans"
      >
        <div className="max-w-[1400px] mx-auto px-4 md:px-10">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-12">
            <span className="inline-block text-xs md:text-sm font-bold tracking-[0.2em] text-blue-600 uppercase mb-3">
              Student Success Stories
            </span>

            <h2
              id="testimonials-heading"
              className="text-3xl md:text-4xl font-extrabold text-[#002147] leading-tight mb-4"
            >
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Students Say
              </span>
            </h2>

            <div
              aria-hidden="true"
              className="w-20 h-1 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"
            />

            {/* Average Rating Summary */}
            {avgRating && (
              <div className="mt-6 inline-flex items-center gap-3 bg-white border border-slate-200 rounded-full px-5 py-2.5 shadow-sm">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.round(avgRating)
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
                <span className="text-sm font-bold text-[#002147]">
                  {avgRating} / 5
                </span>
                <span className="text-xs text-gray-500">
                  ({validRatings.length} review
                  {validRatings.length > 1 ? "s" : ""})
                </span>
              </div>
            )}
          </header>

          {/* ============ TESTIMONIALS GRID ============ */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <article
                key={index}
                itemScope
                itemProp="review"
                itemType="https://schema.org/Review"
                className="group relative bg-white rounded-2xl p-6 md:p-7 border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Quote Icon */}
                <div
                  aria-hidden="true"
                  className="absolute top-4 right-4 text-5xl font-serif text-blue-100 leading-none select-none"
                >
                  &ldquo;
                </div>

                {/* Rating Stars */}
                {t.rating > 0 && (
                  <div className="flex items-center gap-0.5 mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${
                          star <= t.rating ? "text-amber-400" : "text-slate-200"
                        }`}
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
                    className="text-gray-700 text-sm md:text-base leading-relaxed mb-5 flex-1 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: t.review }}
                  />
                )}

                {/* Student Info */}
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  {/* Avatar */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                    {t.image?.url ? (
                      <Image
                        src={t.image.url}
                        alt={t.name || "Student"}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-lg">
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
                        className="font-bold text-sm text-[#002147] truncate"
                      >
                        <span itemProp="name">{t.name}</span>
                      </p>
                    )}

                    <p className="text-xs text-gray-500 truncate">
                      {t.course && <span>{t.course}</span>}
                      {t.course && t.university && " • "}
                      {t.university && (
                        <span className="font-medium text-gray-600">
                          {t.university}
                        </span>
                      )}
                    </p>

                    {t.year && (
                      <p className="text-[10px] text-gray-400 mt-0.5">
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