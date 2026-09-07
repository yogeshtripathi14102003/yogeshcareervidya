// // src/app/course/OnlineCourseEligibility.jsx
// import React from 'react';

// export default function OnlineCourseEligibility({ onlineEligibility, courseTitle }) {
    
//     const dynamicCourseTitle = courseTitle || "Online Course";

//     if (!onlineEligibility || onlineEligibility.length === 0) {
//         return null; 
//     }

//     // Helper to render a single bullet point
//     const renderRequirement = (text, index) => (
//         <li key={index} className="flex items-start text-gray-700 space-x-2">
//             <span className="text-blue-500 mt-1">☑️</span> 
//             <p className="leading-relaxed flex-1" dangerouslySetInnerHTML={{ __html: text }} />
//         </li>
//     );

//     // Helper to split text into points (array or string) and clean extra dots or bullets
//     const getPoints = (text) => {
//         if (!text) return [];
//         if (Array.isArray(text)) return text.map(cleanPoint).filter(p => p);
//         return text
//             .split(/\r?\n|,/) // split by newline or comma
//             .map(point => cleanPoint(point))
//             .filter(point => point.length > 0);
//     };

//     // Helper to remove leading dots, bullets, or spaces
//     const cleanPoint = (point) => {
//         return point.replace(/^(\s*[\.\•\-\*]+\s*)/, '').trim();
//     };

//     return (
//         <section className="mt-10 w-full flex justify-center py-10 bg-white">
//             <div className="w-full max-w-[1600px] px-4 md:px-10">
                
//                 <h2 className="text-2xl font-bold mb-8 text-[#002D62]">
//                     {dynamicCourseTitle} Eligibility & Duration
//                 </h2>
                
//                 <div className="space-y-6">
//                     {onlineEligibility.map((item, index) => (
//                         <div key={index} className="mb-6">
                            
//                             {item.heading && (
//                                 <h3 className="text-xl font-bold mb-3 text-[#002D62]">
//                                     {item.heading}
//                                 </h3>
//                             )}
                            
//                             {item.subHeading && (
//                                 <h4 className="text-lg font-semibold mt-4 mb-3 text-[#002D62]">
//                                     {item.subHeading}
//                                 </h4>
//                             )}

//                             {/* Render description as bullet points */}
//                             {item.description && (
//                                 <ul className="list-none space-y-3 pl-0 mb-4">
//                                     {getPoints(item.description).map((point, i) =>
//                                         renderRequirement(point, i)
//                                     )}
//                                 </ul>
//                             )}
                            
//                             {/* Render subDescription as bullet points */}
//                             {item.subDescription && (
//                                 <ul className="list-none space-y-3 pl-0">
//                                     {getPoints(item.subDescription).map((point, i) =>
//                                         renderRequirement(point, i)
//                                     )}
//                                 </ul>
//                             )}
//                         </div>
//                     ))}
//                 </div>
//             </div>
//         </section>
//     );
// }


// src/app/course/OnlineCourseEligibility.jsx

import React from "react";

/**
 * Decode HTML entities without using window/document.
 * This is SSR safe and prevents hydration mismatch.
 */
const decodeHtmlEntities = (value) => {
  if (value === null || value === undefined) {
    return "";
  }

  let decoded = String(value);

  // Decode multiple times because some old data
  // may have been encoded more than once.
  for (let i = 0; i < 3; i++) {
    const previous = decoded;

    decoded = decoded
      // Non-breaking spaces
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/gi, " ")
      .replace(/&#xa0;/gi, " ")
      .replace(/&#xA0;/gi, " ")

      // Common HTML entities
      .replace(/&amp;/gi, "&")
      .replace(/&lt;/gi, "<")
      .replace(/&gt;/gi, ">")
      .replace(/&quot;/gi, '"')
      .replace(/&#39;/gi, "'")
      .replace(/&apos;/gi, "'");

    if (decoded === previous) {
      break;
    }
  }

  // Convert actual Unicode NBSP to normal space
  decoded = decoded.replace(/\u00a0/g, " ");

  return decoded;
};

/**
 * Clean dangerous HTML.
 * Keeps normal formatting such as:
 * p, strong, b, em, ul, ol, li, headings, etc.
 */
const sanitizeHtml = (html) => {
  if (!html) return "";

  return html
    // Remove script
    .replace(
      /<script\b[^>]*>[\s\S]*?<\/script>/gi,
      ""
    )

    // Remove iframe
    .replace(
      /<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi,
      ""
    )

    // Remove object
    .replace(
      /<object\b[^>]*>[\s\S]*?<\/object>/gi,
      ""
    )

    // Remove embed
    .replace(
      /<embed\b[^>]*>/gi,
      ""
    )

    // Remove inline JS event handlers
    .replace(
      /\son[a-z]+\s*=\s*(['"])[\s\S]*?\1/gi,
      ""
    )

    // Remove javascript: URLs
    .replace(
      /javascript\s*:/gi,
      ""
    );
};

/**
 * Detect whether content actually contains HTML.
 */
const containsHtml = (value) => {
  return /<\/?[a-z][\s\S]*>/i.test(value);
};

/**
 * Render rich text safely and SSR consistently.
 */
const RichText = ({ content, className = "" }) => {
  if (
    content === null ||
    content === undefined ||
    content === ""
  ) {
    return null;
  }

  const originalText = String(content);

  if (!originalText.trim()) {
    return null;
  }

  // Decode encoded HTML
  let decodedContent = decodeHtmlEntities(originalText);

  // Clean dangerous tags/attributes
  decodedContent = sanitizeHtml(decodedContent);

  // Normalise NBSP
  decodedContent = decodedContent.replace(
    /\u00a0/g,
    " "
  );

  // -----------------------------------------
  // Plain text
  // -----------------------------------------
  if (!containsHtml(decodedContent)) {
    return (
      <span className={className}>
        {decodedContent}
      </span>
    );
  }

  // -----------------------------------------
  // HTML / Rich text
  // -----------------------------------------
  return (
    <span
      className={`course-rich-text ${className}`}
      dangerouslySetInnerHTML={{
        __html: decodedContent,
      }}
    />
  );
};

export default function OnlineCourseEligibility({
  onlineEligibility,
  courseTitle,
}) {
  const dynamicCourseTitle =
    courseTitle || "Online Course";

  if (
    !Array.isArray(onlineEligibility) ||
    onlineEligibility.length === 0
  ) {
    return null;
  }

  /**
   * Clean bullet text.
   * Works with old plain-text data as well.
   */
  const cleanPoint = (point) => {
    if (
      point === null ||
      point === undefined
    ) {
      return "";
    }

    let value = String(point).trim();

    // Decode entities first
    value = decodeHtmlEntities(value);

    // Remove only leading bullet characters.
    // Do NOT remove HTML tags.
    value = value.replace(
      /^\s*(?:[-•●▪◦*]+|\d+[.)])\s*/,
      ""
    );

    return value.trim();
  };

  /**
   * Convert description into points.
   *
   * Supports:
   * - Array
   * - Plain text with new lines
   * - HTML <p>
   * - HTML <li>
   * - HTML <br>
   */
  const getPoints = (text) => {
    if (
      text === null ||
      text === undefined ||
      text === ""
    ) {
      return [];
    }

    // -----------------------------------------
    // Already an array
    // -----------------------------------------
    if (Array.isArray(text)) {
      return text
        .map(cleanPoint)
        .filter(Boolean);
    }

    let value = String(text).trim();

    if (!value) {
      return [];
    }

    // Decode HTML
    value = decodeHtmlEntities(value);

    // -----------------------------------------
    // If rich HTML contains <li>,
    // extract each list item.
    // -----------------------------------------
    if (/<li\b[^>]*>/i.test(value)) {
      const liMatches = value.match(
        /<li\b[^>]*>[\s\S]*?<\/li>/gi
      );

      if (liMatches && liMatches.length > 0) {
        return liMatches
          .map((item) => {
            return item
              .replace(
                /^<li\b[^>]*>/i,
                ""
              )
              .replace(
                /<\/li>$/i,
                ""
              )
              .trim();
          })
          .map(cleanPoint)
          .filter(Boolean);
      }
    }

    // -----------------------------------------
    // Split paragraphs
    // -----------------------------------------
    if (/<p\b[^>]*>/i.test(value)) {
      const paragraphs = value
        .split(
          /<\/p>\s*<p\b[^>]*>/i
        )
        .map((item) =>
          item
            .replace(
              /^<p\b[^>]*>/i,
              ""
            )
            .replace(
              /<\/p>$/i,
              ""
            )
            .trim()
        )
        .filter(Boolean);

      if (paragraphs.length > 1) {
        return paragraphs
          .map(cleanPoint)
          .filter(Boolean);
      }
    }

    // -----------------------------------------
    // <br> separated content
    // -----------------------------------------
    if (/<br\s*\/?>/i.test(value)) {
      return value
        .split(/<br\s*\/?>/gi)
        .map(cleanPoint)
        .filter(Boolean);
    }

    // -----------------------------------------
    // Old plain text
    // -----------------------------------------
    return value
      .split(/\r?\n/)
      .flatMap((line) => {
        // If comma separated old data,
        // split it as well.
        if (
          !containsHtml(line) &&
          line.includes(",")
        ) {
          return line.split(",");
        }

        return [line];
      })
      .map(cleanPoint)
      .filter(Boolean);
  };

  /**
   * Single requirement item
   */
  const renderRequirement = (
    text,
    index
  ) => {
    return (
      <li
        key={index}
        className="flex items-start text-gray-700 space-x-2 min-w-0"
      >
        <span className="text-blue-500 mt-1 shrink-0">
          ☑️
        </span>

        <RichText
          content={text}
          className="leading-relaxed flex-1 min-w-0"
        />
      </li>
    );
  };

  return (
    <section className="mt-10 w-full flex justify-center py-10 bg-white">
      <div className="w-full max-w-[1600px] px-4 md:px-10 min-w-0">

        {/* ==========================================
            HEADING
        ========================================== */}
        <h2 className="text-2xl font-bold mb-8 text-[#002D62]">
          {dynamicCourseTitle} Eligibility & Duration
        </h2>

        {/* ==========================================
            CONTENT
        ========================================== */}
        <div className="space-y-6">

          {onlineEligibility.map(
            (item, index) => {
              if (!item) return null;

              return (
                <div
                  key={index}
                  className="mb-6 min-w-0"
                >

                  {/* Heading */}
                  {item.heading && (
                    <h3 className="text-xl font-bold mb-3 text-[#002D62]">
                      {item.heading}
                    </h3>
                  )}

                  {/* Sub Heading */}
                  {item.subHeading && (
                    <h4 className="text-lg font-semibold mt-4 mb-3 text-[#002D62]">
                      {item.subHeading}
                    </h4>
                  )}

                  {/* ====================================
                      DESCRIPTION
                  ==================================== */}
                  {item.description && (
                    <ul className="list-none space-y-3 pl-0 mb-4">
                      {getPoints(
                        item.description
                      ).map(
                        (point, i) =>
                          renderRequirement(
                            point,
                            i
                          )
                      )}
                    </ul>
                  )}

                  {/* ====================================
                      SUB DESCRIPTION
                  ==================================== */}
                  {item.subDescription && (
                    <ul className="list-none space-y-3 pl-0">
                      {getPoints(
                        item.subDescription
                      ).map(
                        (point, i) =>
                          renderRequirement(
                            point,
                            i
                          )
                      )}
                    </ul>
                  )}

                </div>
              );
            }
          )}

        </div>
      </div>

      {/* ==============================================
          RICH TEXT STYLES
      ============================================== */}
      <style jsx global>{`
        .course-rich-text {
          display: block;
          max-width: 100%;
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
        }

        .course-rich-text p {
          margin: 0 0 8px 0;
        }

        .course-rich-text p:last-child {
          margin-bottom: 0;
        }

        .course-rich-text strong,
        .course-rich-text b {
          font-weight: 700;
        }

        .course-rich-text em,
        .course-rich-text i {
          font-style: italic;
        }

        .course-rich-text u {
          text-decoration: underline;
        }

        .course-rich-text ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin: 8px 0;
        }

        .course-rich-text ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin: 8px 0;
        }

        .course-rich-text li {
          margin-bottom: 5px;
        }

        .course-rich-text h1,
        .course-rich-text h2,
        .course-rich-text h3,
        .course-rich-text h4,
        .course-rich-text h5,
        .course-rich-text h6 {
          font-weight: 700;
          line-height: 1.4;
          margin: 10px 0 6px;
        }

        .course-rich-text h1 {
          font-size: 1.75rem;
        }

        .course-rich-text h2 {
          font-size: 1.5rem;
        }

        .course-rich-text h3 {
          font-size: 1.25rem;
        }

        .course-rich-text a {
          color: #2563eb;
          text-decoration: underline;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .course-rich-text img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 8px 0;
          border-radius: 6px;
        }

        .course-rich-text table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
        }

        .course-rich-text th,
        .course-rich-text td {
          border: 1px solid #d1d5db;
          padding: 8px;
          word-break: break-word;
        }

        @media (max-width: 640px) {
          .course-rich-text {
            font-size: 14px;
            line-height: 1.6;
          }

          .course-rich-text ul,
          .course-rich-text ol {
            padding-left: 1.25rem;
          }

          .course-rich-text table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </section>
  );
}