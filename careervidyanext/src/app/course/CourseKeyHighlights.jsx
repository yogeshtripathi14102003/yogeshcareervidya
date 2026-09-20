// "use client";

// import { useState } from "react";
// import Signup from "@/app/signup/page.jsx"; // ✅ path verify kar lena

// export default function CourseKeyHighlights({ course }) {
//   const [showSignup, setShowSignup] = useState(false);

//   if (!course?.keyHighlights?.length) return null;

//   return (
//     <>
//       {/* ================= KEY HIGHLIGHTS ================= */}
//       <section className="w-full bg-white py-16 border-y border-slate-100">
//         <div className="w-full px-6 md:px-12 lg:px-20">
          
//           {/* Heading */}
//           <div className="mb-12">
//             <h2 className="text-2xl md:text-2xl font-extrabold text-[#002147] leading-tight">
//             What You'll Learn & Gain {course.name} In India ?
//             </h2>
//             <div className="w-20 h-1.5 bg-blue-600 mt-4 rounded-full"></div>
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
//             {/* LEFT: Highlights */}
//             <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
//               {course.keyHighlights.map((item, i) => (
//                 <div
//                   key={i}
//                   className="group flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-slate-50"
//                 >
//                   <div className="flex-shrink-0 mt-1">
//                     <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
//                       <svg
//                         className="w-3.5 h-3.5 text-blue-600 group-hover:text-white"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           strokeWidth="3"
//                           d="M5 13l4 4L19 7"
//                         />
//                       </svg>
//                     </div>
//                   </div>
//                   <p className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors">
//                     {item.description}
//                   </p>
//                 </div>
//               ))}
//             </div>

//             {/* RIGHT: Admission Card */}
//             <div className="lg:col-span-4">
//               <div className="sticky top-24 bg-[#002147] rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">
                
//                 {/* Decorative Circle */}
//                 <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full"></div>

//                 <h3 className="text-2xl font-bold mb-6 relative z-10">
//                   Admission Closing Soon
//                 </h3>

//                 <div className="space-y-5 relative z-10">
//                   {[
//                     "Avoid paying 25% Late Fees",
//                     "Secure a seat in your dream university",
//                     "Avail early benefits",
//                   ].map((text, idx) => (
//                     <div
//                       key={idx}
//                       className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl border border-white/10"
//                     >
//                       <span className="text-blue-400 text-lg">✦</span>
//                       <p className="text-sm font-semibold tracking-wide">
//                         {text}
//                       </p>
//                     </div>
//                   ))}
//                 </div>

//                 {/* ✅ ENROLL BUTTON */}
//                 <button
//                   onClick={() => setShowSignup(true)}
//                   className="w-full mt-8 bg-[#c15304] cursor-pointer text-white font-bold py-4 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg"
//                 >
//                   Enroll Now
//                 </button>
//               </div>
//             </div>

//           </div>
//         </div>
//       </section>

//       {/* ================= SIGNUP POPUP ================= */}
//       {showSignup && (
//         <Signup
//           onClose={() => setShowSignup(false)}
//           courseName={course.name} // ✅ optional (auto-fill)
//         />
//       )}
//     </>
//   );
// }


"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* =========================================================
   RICH TEXT NORMALIZER
   ========================================================= */
function normalizeRichText(value) {
  if (value === null || value === undefined) return "";
  if (typeof value !== "string") return String(value);

  let text = value;

  // HTML entities
  text = text.replace(/&nbsp;/gi, " ");
  text = text.replace(/&#160;/gi, " ");
  text = text.replace(/&#xa0;/gi, " ");
  text = text.replace(/&amp;/gi, "&");
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");
  text = text.replace(/&apos;/gi, "'");
  text = text.replace(/&lt;/gi, "<");
  text = text.replace(/&gt;/gi, ">");

  text = text.replace(/&#(\d+);/g, (_, code) => {
    try {
      return String.fromCodePoint(Number(code));
    } catch {
      return _;
    }
  });

  text = text.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
    try {
      return String.fromCodePoint(parseInt(code, 16));
    } catch {
      return _;
    }
  });

  // Remove dangerous HTML
  text = text
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<iframe\b[^>]*>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object\b[^>]*>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript\s*:/gi, "");

  return text.trim();
}

function containsHtml(value) {
  if (!value) return false;
  return /<\/?[a-z][\s\S]*?>/i.test(value);
}

/* =========================================================
   RICH TEXT COMPONENT
   ========================================================= */
function RichText({ content, className = "" }) {
  const normalized = normalizeRichText(content);
  if (!normalized) return null;

  if (!containsHtml(normalized)) {
    return <p className={className}>{normalized}</p>;
  }

  return (
    <div
      className={`key-highlight-rich-text ${className}`}
      dangerouslySetInnerHTML={{ __html: normalized }}
    />
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */
export default function CourseKeyHighlights({ course }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!course?.keyHighlights?.length) return null;

  const courseName = course?.name || "this Course";

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Key Highlights of ${courseName}`,
    numberOfItems: course.keyHighlights.length,
    itemListElement: course.keyHighlights.map((item, i) => {
      const desc = typeof item === "string" ? item : item?.description;
      return {
        "@type": "ListItem",
        position: i + 1,
        name: (desc || "").replace(/<[^>]*>/g, "").trim().slice(0, 100),
      };
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        aria-labelledby="key-highlights-heading"
        className="w-full bg-white py-12 md:py-16 border-y border-slate-100 font-sans"
      >
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
          {/* ============ HEADER ============ */}
          <header className="mb-8 md:mb-12">
            <h2
              id="key-highlights-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] leading-tight px-1"
            >
              What You&apos;ll Learn &amp; Gain from {courseName}?
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 bg-[#002147] mt-4 rounded-full"
            />
          </header>

          {/* ============ GRID ============ */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-10">
            {/* ============ LEFT: HIGHLIGHTS ============ */}
            <div className="lg:col-span-8">
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 list-none p-0 m-0">
                {course.keyHighlights.map((item, i) => {
                  const description =
                    typeof item === "string" ? item : item?.description;

                  if (!description) return null;

                  return (
                    <li
                      key={item?._id || i}
                      className="group flex items-start gap-3 p-4 bg-slate-50 hover:bg-white border border-slate-200 hover:border-[#c15304]/40 rounded-xl transition-all duration-300 hover:shadow-sm"
                    >
                      {/* Check Icon */}
                      <div
                        aria-hidden="true"
                        className="flex-shrink-0 mt-0.5 w-7 h-7 rounded-full bg-[#002147] group-hover:bg-[#c15304] flex items-center justify-center transition-colors"
                      >
                        <svg
                          className="w-3.5 h-3.5 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="3"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>

                      {/* Description */}
                      <div className="min-w-0 flex-1">
                        <RichText
                          content={description}
                          className="text-gray-700 text-sm md:text-[15px] leading-relaxed group-hover:text-[#002147] transition-colors"
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* ============ RIGHT: ADMISSION CARD ============ */}
            <div className="lg:col-span-4">
              <div className="lg:sticky lg:top-24 relative bg-[#002147] rounded-2xl p-6 md:p-8 text-white shadow-lg overflow-hidden">
                {/* Decorative circles */}
                <div
                  aria-hidden="true"
                  className="absolute -top-12 -right-12 w-32 h-32 bg-white/5 rounded-full pointer-events-none"
                />
                <div
                  aria-hidden="true"
                  className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full pointer-events-none"
                />

                <div className="relative z-10">
                  {/* Label */}
                  <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#c15304] bg-orange-100/10 px-3 py-1 rounded-full mb-3">
                    ⏰ Limited Time
                  </span>

                  {/* Title */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-2 leading-snug">
                    Admission Closing Soon
                  </h3>

                  <p className="text-sm text-white/70 mb-6 leading-relaxed">
                    Secure your seat before the deadline and enjoy exclusive
                    benefits.
                  </p>

                  {/* Benefits list */}
                  <div className="space-y-3 mb-7">
                    {[
                      "Avoid paying 25% Late Fees",
                      "Secure a seat in your dream university",
                      "Avail early bird benefits",
                    ].map((text, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 bg-white/[0.08] hover:bg-white/[0.12] transition-colors p-3 rounded-lg border border-white/10"
                      >
                        <span
                          aria-hidden="true"
                          className="flex-shrink-0 w-5 h-5 rounded-full bg-[#c15304] flex items-center justify-center text-[10px] font-bold mt-0.5"
                        >
                          ✓
                        </span>
                        <p className="text-sm font-medium leading-snug">
                          {text}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Enroll Button */}
                  <button
                    type="button"
                    onClick={() => setShowSignup(true)}
                    aria-label="Enroll now"
                    className="w-full bg-[#c15304] hover:bg-[#a34403] text-white font-bold text-sm py-3.5 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2 focus-visible:ring-offset-[#002147]"
                  >
                    Enroll Now →
                  </button>

                  {/* Trust line */}
                  <p className="text-center text-[11px] text-white/60 mt-3">
                    🔒 100% Safe &amp; Secure
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SIGNUP MODAL */}
      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={courseName}
        />
      )}

      {/* =====================================================
          RICH TEXT CSS
      ===================================================== */}
      <style jsx global>{`
        .key-highlight-rich-text {
          width: 100%;
          max-width: 100%;
          min-width: 0;
          overflow-wrap: anywhere;
          word-break: break-word;
          white-space: normal;
        }

        .key-highlight-rich-text p {
          margin: 0 0 6px 0;
        }

        .key-highlight-rich-text p:last-child {
          margin-bottom: 0;
        }

        .key-highlight-rich-text strong,
        .key-highlight-rich-text b {
          font-weight: 700;
          color: #002147;
        }

        .key-highlight-rich-text em,
        .key-highlight-rich-text i {
          font-style: italic;
        }

        .key-highlight-rich-text u {
          text-decoration: underline;
        }

        .key-highlight-rich-text ul {
          list-style-type: disc;
          padding-left: 1.25rem;
          margin: 6px 0;
        }

        .key-highlight-rich-text ol {
          list-style-type: decimal;
          padding-left: 1.25rem;
          margin: 6px 0;
        }

        .key-highlight-rich-text li {
          margin-bottom: 3px;
        }

        .key-highlight-rich-text a {
          color: #2563eb;
          text-decoration: underline;
        }

        .key-highlight-rich-text h1,
        .key-highlight-rich-text h2,
        .key-highlight-rich-text h3,
        .key-highlight-rich-text h4 {
          font-weight: 700;
          line-height: 1.4;
          margin-top: 6px;
          margin-bottom: 5px;
          color: #002147;
        }

        .key-highlight-rich-text h1 {
          font-size: 1.5rem;
        }
        .key-highlight-rich-text h2 {
          font-size: 1.35rem;
        }
        .key-highlight-rich-text h3 {
          font-size: 1.2rem;
        }
        .key-highlight-rich-text h4 {
          font-size: 1.1rem;
        }

        .key-highlight-rich-text blockquote {
          border-left: 3px solid #c15304;
          padding-left: 10px;
          margin: 8px 0;
          color: #4b5563;
          font-style: italic;
        }

        .key-highlight-rich-text img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 8px 0;
          border-radius: 8px;
        }

        .key-highlight-rich-text table {
          width: 100%;
          max-width: 100%;
          border-collapse: collapse;
          margin: 8px 0;
        }

        .key-highlight-rich-text th,
        .key-highlight-rich-text td {
          border: 1px solid #d1d5db;
          padding: 6px;
          text-align: left;
          word-break: break-word;
        }

        .key-highlight-rich-text br {
          display: block;
          content: "";
          margin-top: 3px;
        }

        @media (max-width: 640px) {
          .key-highlight-rich-text {
            font-size: 14px;
            line-height: 1.6;
          }

          .key-highlight-rich-text ul,
          .key-highlight-rich-text ol {
            padding-left: 1rem;
          }

          .key-highlight-rich-text table {
            display: block;
            overflow-x: auto;
          }
        }
      `}</style>
    </>
  );
}