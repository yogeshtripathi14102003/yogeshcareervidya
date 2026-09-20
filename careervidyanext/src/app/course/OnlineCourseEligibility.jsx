


// // src/app/course/OnlineCourseEligibility.jsx

// import React from "react";

// /**
//  * Decode HTML entities without using window/document.
//  * This is SSR safe and prevents hydration mismatch.
//  */
// const decodeHtmlEntities = (value) => {
//   if (value === null || value === undefined) {
//     return "";
//   }

//   let decoded = String(value);

//   // Decode multiple times because some old data
//   // may have been encoded more than once.
//   for (let i = 0; i < 3; i++) {
//     const previous = decoded;

//     decoded = decoded
//       // Non-breaking spaces
//       .replace(/&nbsp;/gi, " ")
//       .replace(/&#160;/gi, " ")
//       .replace(/&#xa0;/gi, " ")
//       .replace(/&#xA0;/gi, " ")

//       // Common HTML entities
//       .replace(/&amp;/gi, "&")
//       .replace(/&lt;/gi, "<")
//       .replace(/&gt;/gi, ">")
//       .replace(/&quot;/gi, '"')
//       .replace(/&#39;/gi, "'")
//       .replace(/&apos;/gi, "'");

//     if (decoded === previous) {
//       break;
//     }
//   }

//   // Convert actual Unicode NBSP to normal space
//   decoded = decoded.replace(/\u00a0/g, " ");

//   return decoded;
// };

// /**
//  * Clean dangerous HTML.
//  * Keeps normal formatting such as:
//  * p, strong, b, em, ul, ol, li, headings, etc.
//  */
// const sanitizeHtml = (html) => {
//   if (!html) return "";

//   return html
//     // Remove script
//     .replace(
//       /<script\b[^>]*>[\s\S]*?<\/script>/gi,
//       ""
//     )

//     // Remove iframe
//     .replace(
//       /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
//       ""
//     )

//     // Remove object
//     .replace(
//       /<object\b[^>]*>[\s\S]*?<\/object>/gi,
//       ""
//     )

//     // Remove embed
//     .replace(
//       /<embed\b[^>]*>/gi,
//       ""
//     )

//     // Remove inline JS event handlers
//     .replace(
//       /\son[a-z]+\s*=\s*(['"])[\s\S]*?\1/gi,
//       ""
//     )

//     // Remove javascript: URLs
//     .replace(
//       /javascript\s*:/gi,
//       ""
//     );
// };

// /**
//  * Detect whether content actually contains HTML.
//  */
// const containsHtml = (value) => {
//   return /<\/?[a-z][\s\S]*>/i.test(value);
// };

// /**
//  * Render rich text safely and SSR consistently.
//  */
// const RichText = ({ content, className = "" }) => {
//   if (
//     content === null ||
//     content === undefined ||
//     content === ""
//   ) {
//     return null;
//   }

//   const originalText = String(content);

//   if (!originalText.trim()) {
//     return null;
//   }

//   // Decode encoded HTML
//   let decodedContent = decodeHtmlEntities(originalText);

//   // Clean dangerous tags/attributes
//   decodedContent = sanitizeHtml(decodedContent);

//   // Normalise NBSP
//   decodedContent = decodedContent.replace(
//     /\u00a0/g,
//     " "
//   );

//   // -----------------------------------------
//   // Plain text
//   // -----------------------------------------
//   if (!containsHtml(decodedContent)) {
//     return (
//       <span className={className}>
//         {decodedContent}
//       </span>
//     );
//   }

//   // -----------------------------------------
//   // HTML / Rich text
//   // -----------------------------------------
//   return (
//     <span
//       className={`course-rich-text ${className}`}
//       dangerouslySetInnerHTML={{
//         __html: decodedContent,
//       }}
//     />
//   );
// };

// export default function OnlineCourseEligibility({
//   onlineEligibility,
//   courseTitle,
// }) {
//   const dynamicCourseTitle =
//     courseTitle || "Online Course";

//   if (
//     !Array.isArray(onlineEligibility) ||
//     onlineEligibility.length === 0
//   ) {
//     return null;
//   }

//   /**
//    * Clean bullet text.
//    * Works with old plain-text data as well.
//    */
//   const cleanPoint = (point) => {
//     if (
//       point === null ||
//       point === undefined
//     ) {
//       return "";
//     }

//     let value = String(point).trim();

//     // Decode entities first
//     value = decodeHtmlEntities(value);

//     // Remove only leading bullet characters.
//     // Do NOT remove HTML tags.
//     value = value.replace(
//       /^\s*(?:[-•●▪◦*]+|\d+[.)])\s*/,
//       ""
//     );

//     return value.trim();
//   };

//   /**
//    * Convert description into points.
//    *
//    * Supports:
//    * - Array
//    * - Plain text with new lines
//    * - HTML <p>
//    * - HTML <li>
//    * - HTML <br>
//    */
//   const getPoints = (text) => {
//     if (
//       text === null ||
//       text === undefined ||
//       text === ""
//     ) {
//       return [];
//     }

//     // -----------------------------------------
//     // Already an array
//     // -----------------------------------------
//     if (Array.isArray(text)) {
//       return text
//         .map(cleanPoint)
//         .filter(Boolean);
//     }

//     let value = String(text).trim();

//     if (!value) {
//       return [];
//     }

//     // Decode HTML
//     value = decodeHtmlEntities(value);

//     // -----------------------------------------
//     // If rich HTML contains <li>,
//     // extract each list item.
//     // -----------------------------------------
//     if (/<li\b[^>]*>/i.test(value)) {
//       const liMatches = value.match(
//         /<li\b[^>]*>[\s\S]*?<\/li>/gi
//       );

//       if (liMatches && liMatches.length > 0) {
//         return liMatches
//           .map((item) => {
//             return item
//               .replace(
//                 /^<li\b[^>]*>/i,
//                 ""
//               )
//               .replace(
//                 /<\/li>$/i,
//                 ""
//               )
//               .trim();
//           })
//           .map(cleanPoint)
//           .filter(Boolean);
//       }
//     }

//     // -----------------------------------------
//     // Split paragraphs
//     // -----------------------------------------
//     if (/<p\b[^>]*>/i.test(value)) {
//       const paragraphs = value
//         .split(
//           /<\/p>\s*<p\b[^>]*>/i
//         )
//         .map((item) =>
//           item
//             .replace(
//               /^<p\b[^>]*>/i,
//               ""
//             )
//             .replace(
//               /<\/p>$/i,
//               ""
//             )
//             .trim()
//         )
//         .filter(Boolean);

//       if (paragraphs.length > 1) {
//         return paragraphs
//           .map(cleanPoint)
//           .filter(Boolean);
//       }
//     }

//     // -----------------------------------------
//     // <br> separated content
//     // -----------------------------------------
//     if (/<br\s*\/?>/i.test(value)) {
//       return value
//         .split(/<br\s*\/?>/gi)
//         .map(cleanPoint)
//         .filter(Boolean);
//     }

//     // -----------------------------------------
//     // Old plain text
//     // -----------------------------------------
//     return value
//       .split(/\r?\n/)
//       .flatMap((line) => {
//         // If comma separated old data,
//         // split it as well.
//         if (
//           !containsHtml(line) &&
//           line.includes(",")
//         ) {
//           return line.split(",");
//         }

//         return [line];
//       })
//       .map(cleanPoint)
//       .filter(Boolean);
//   };

//   /**
//    * Single requirement item
//    */
//   const renderRequirement = (
//     text,
//     index
//   ) => {
//     return (
//       <li
//         key={index}
//         className="flex items-start text-gray-700 space-x-2 min-w-0"
//       >
//         <span className="text-blue-500 mt-1 shrink-0">
//           ☑️
//         </span>

//         <RichText
//           content={text}
//           className="leading-relaxed flex-1 min-w-0"
//         />
//       </li>
//     );
//   };

//   return (
//     <section className="mt-10 w-full flex justify-center py-10 bg-white">
//       <div className="w-full max-w-[1600px] px-4 md:px-10 min-w-0">

//         {/* ==========================================
//             HEADING
//         ========================================== */}
//         <h2 className="text-2xl font-bold mb-8 text-[#002D62]">
//           {dynamicCourseTitle} Eligibility & Duration
//         </h2>

//         {/* ==========================================
//             CONTENT
//         ========================================== */}
//         <div className="space-y-6">

//           {onlineEligibility.map(
//             (item, index) => {
//               if (!item) return null;

//               return (
//                 <div
//                   key={index}
//                   className="mb-6 min-w-0"
//                 >

//                   {/* Heading */}
//                   {item.heading && (
//                     <h3 className="text-xl font-bold mb-3 text-[#002D62]">
//                       {item.heading}
//                     </h3>
//                   )}

//                   {/* Sub Heading */}
//                   {item.subHeading && (
//                     <h4 className="text-lg font-semibold mt-4 mb-3 text-[#002D62]">
//                       {item.subHeading}
//                     </h4>
//                   )}

//                   {/* ====================================
//                       DESCRIPTION
//                   ==================================== */}
//                   {item.description && (
//                     <ul className="list-none space-y-3 pl-0 mb-4">
//                       {getPoints(
//                         item.description
//                       ).map(
//                         (point, i) =>
//                           renderRequirement(
//                             point,
//                             i
//                           )
//                       )}
//                     </ul>
//                   )}

//                   {/* ====================================
//                       SUB DESCRIPTION
//                   ==================================== */}
//                   {item.subDescription && (
//                     <ul className="list-none space-y-3 pl-0">
//                       {getPoints(
//                         item.subDescription
//                       ).map(
//                         (point, i) =>
//                           renderRequirement(
//                             point,
//                             i
//                           )
//                       )}
//                     </ul>
//                   )}

//                 </div>
//               );
//             }
//           )}

//         </div>
//       </div>

//       {/* ==============================================
//           RICH TEXT STYLES
//       ============================================== */}
//       <style jsx global>{`
//         .course-rich-text {
//           display: block;
//           max-width: 100%;
//           min-width: 0;
//           overflow-wrap: anywhere;
//           word-break: break-word;
//           white-space: normal;
//         }

//         .course-rich-text p {
//           margin: 0 0 8px 0;
//         }

//         .course-rich-text p:last-child {
//           margin-bottom: 0;
//         }

//         .course-rich-text strong,
//         .course-rich-text b {
//           font-weight: 700;
//         }

//         .course-rich-text em,
//         .course-rich-text i {
//           font-style: italic;
//         }

//         .course-rich-text u {
//           text-decoration: underline;
//         }

//         .course-rich-text ul {
//           list-style-type: disc;
//           padding-left: 1.5rem;
//           margin: 8px 0;
//         }

//         .course-rich-text ol {
//           list-style-type: decimal;
//           padding-left: 1.5rem;
//           margin: 8px 0;
//         }

//         .course-rich-text li {
//           margin-bottom: 5px;
//         }

//         .course-rich-text h1,
//         .course-rich-text h2,
//         .course-rich-text h3,
//         .course-rich-text h4,
//         .course-rich-text h5,
//         .course-rich-text h6 {
//           font-weight: 700;
//           line-height: 1.4;
//           margin: 10px 0 6px;
//         }

//         .course-rich-text h1 {
//           font-size: 1.75rem;
//         }

//         .course-rich-text h2 {
//           font-size: 1.5rem;
//         }

//         .course-rich-text h3 {
//           font-size: 1.25rem;
//         }

//         .course-rich-text a {
//           color: #2563eb;
//           text-decoration: underline;
//           overflow-wrap: anywhere;
//           word-break: break-word;
//         }

//         .course-rich-text img {
//           display: block;
//           max-width: 100%;
//           height: auto;
//           margin: 8px 0;
//           border-radius: 6px;
//         }

//         .course-rich-text table {
//           width: 100%;
//           max-width: 100%;
//           border-collapse: collapse;
//           margin: 10px 0;
//         }

//         .course-rich-text th,
//         .course-rich-text td {
//           border: 1px solid #d1d5db;
//           padding: 8px;
//           word-break: break-word;
//         }

//         @media (max-width: 640px) {
//           .course-rich-text {
//             font-size: 14px;
//             line-height: 1.6;
//           }

//           .course-rich-text ul,
//           .course-rich-text ol {
//             padding-left: 1.25rem;
//           }

//           .course-rich-text table {
//             display: block;
//             overflow-x: auto;
//           }
//         }
//       `}</style>
//     </section>
//   );
// }


"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ================= LOGIN CHECK ================= */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

export default function OnlineCourseEligibility({
  onlineEligibility,
  courseTitle,
  whoShouldPursue,
}) {
  const [showSignup, setShowSignup] = useState(false);

  if (!onlineEligibility || onlineEligibility.length === 0) {
    return null;
  }

  /* ================= DETECT WHO SHOULD PURSUE ================= */
  const isWhoShouldPursue = (item) =>
    item?.heading?.toLowerCase().includes("who should");

  const eligibilityItems = onlineEligibility.filter(
    (item) => !isWhoShouldPursue(item)
  );

  const whoShouldPursueItem =
    onlineEligibility.find(isWhoShouldPursue) || whoShouldPursue;

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "EducationalOccupationalProgram",
    name: courseTitle || "Course",
    programPrerequisites: eligibilityItems.map((item) => ({
      "@type": "EducationalOccupationalCredential",
      name: item.heading,
      ...(item.description && {
        description: item.description.replace(/<[^>]*>/g, "").trim(),
      }),
    })),
  };

  /* ================= APPLY CLICK ================= */
  const handleApplyClick = () => {
    if (!isLoggedIn()) {
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        aria-labelledby="eligibility-heading"
        className="w-full py-10 sm:py-12 md:py-16 bg-white font-sans"
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-7 sm:mb-8 md:mb-10">
            <h2
              id="eligibility-heading"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#002147] leading-tight mb-3 px-2"
            >
              Eligibility for {courseTitle || "this Course"}
            </h2>

            <div
              aria-hidden="true"
              className="w-14 sm:w-16 h-1 bg-[#002147] mx-auto rounded-full"
            />

            <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-3 max-w-2xl mx-auto px-4">
              Check if you meet the requirements before applying.
            </p>
          </header>

          {/* ============ ELIGIBILITY CARDS ============ */}
          {eligibilityItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-7 sm:mb-8 md:mb-10">
              {eligibilityItems.map((item, i) => (
                <article
                  key={i}
                  className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow"
                >
                  {item.subHeading && (
                    <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c15304] mb-1.5">
                      {item.subHeading}
                    </p>
                  )}

                  {item.heading && (
                    <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#002147] leading-snug mb-2.5 sm:mb-3 break-words">
                      {item.heading}
                    </h3>
                  )}

                  {item.description && (
                    <div
                      className="text-gray-700 text-[13px] sm:text-sm leading-relaxed break-words
                        [&_p]:my-0 [&_p+p]:mt-2
                        [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5
                        [&_ol]:my-2 [&_ol]:pl-5
                        [&_strong]:text-[#002147] [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}

                  {item.subDescription && (
                    <div
                      className="mt-3 pt-3 border-t border-slate-100 text-gray-600 text-[13px] sm:text-sm leading-relaxed break-words
                        [&_p]:my-0 [&_p+p]:mt-2
                        [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5
                        [&_strong]:text-[#002147] [&_strong]:font-semibold"
                      dangerouslySetInnerHTML={{ __html: item.subDescription }}
                    />
                  )}
                </article>
              ))}
            </div>
          )}

          {/* ============ WHO SHOULD PURSUE ============ */}
          {whoShouldPursueItem && (
            <article
              aria-labelledby="who-pursue-heading"
              className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-6 md:p-8"
            >
              {whoShouldPursueItem.heading && (
                <h3
                  id="who-pursue-heading"
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#002147] mb-2 leading-snug break-words"
                >
                  {whoShouldPursueItem.heading}
                </h3>
              )}

              {whoShouldPursueItem.subHeading && (
                <p className="text-gray-600 text-[13px] sm:text-sm mb-3 sm:mb-4">
                  {whoShouldPursueItem.subHeading}
                </p>
              )}

              {whoShouldPursueItem.description && (
                <div
                  className="text-gray-700 text-[13px] sm:text-sm leading-relaxed mb-3 sm:mb-4 break-words
                    [&_p]:my-0 [&_p+p]:mt-2
                    [&_strong]:text-[#002147] [&_strong]:font-semibold"
                  dangerouslySetInnerHTML={{
                    __html: whoShouldPursueItem.description,
                  }}
                />
              )}

              {whoShouldPursueItem.subDescription && (
                <div
                  className="text-gray-700 text-[13px] sm:text-sm leading-relaxed break-words
                    [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-1
                    [&_ol]:my-2 [&_ol]:pl-5
                    [&_p]:my-0"
                  dangerouslySetInnerHTML={{
                    __html: whoShouldPursueItem.subDescription,
                  }}
                />
              )}
            </article>
          )}

          {/* ============ BOTTOM CTA ============ */}
          <div className="mt-7 sm:mt-8 md:mt-10 text-center">
            <button
              type="button"
              onClick={handleApplyClick}
              aria-label="Apply now"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#c15304] hover:bg-[#a34403] text-white text-sm font-bold px-5 sm:px-6 py-3 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2"
            >
              Apply Now
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
        <Signup onClose={() => setShowSignup(false)} courseName={courseTitle} />
      )}
    </>
  );
}