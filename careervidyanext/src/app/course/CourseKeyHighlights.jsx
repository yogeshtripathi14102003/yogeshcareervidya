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
   Handles old database content + editor content
   ========================================================= */

function normalizeRichText(value) {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value !== "string") {
    return String(value);
  }

  let text = value;

  /* -------------------------------------------------------
     Decode HTML entities safely and deterministically
     ------------------------------------------------------- */

  // nbsp variants
  text = text.replace(/&nbsp;/gi, " ");
  text = text.replace(/&#160;/gi, " ");
  text = text.replace(/&#xa0;/gi, " ");

  // Common HTML entities
  text = text.replace(/&amp;/gi, "&");
  text = text.replace(/&quot;/gi, '"');
  text = text.replace(/&#39;/gi, "'");
  text = text.replace(/&apos;/gi, "'");
  text = text.replace(/&lt;/gi, "<");
  text = text.replace(/&gt;/gi, ">");

  // Numeric entities
  text = text.replace(/&#(\d+);/g, (_, code) => {
    try {
      return String.fromCodePoint(Number(code));
    } catch {
      return _;
    }
  });

  // Hex entities
  text = text.replace(/&#x([0-9a-f]+);/gi, (_, code) => {
    try {
      return String.fromCodePoint(parseInt(code, 16));
    } catch {
      return _;
    }
  });

  /* -------------------------------------------------------
     Remove dangerous HTML
     ------------------------------------------------------- */

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

/* =========================================================
   CHECK WHETHER CONTENT CONTAINS HTML
   ========================================================= */

function containsHtml(value) {
  if (!value) return false;

  return /<\/?[a-z][\s\S]*?>/i.test(value);
}

/* =========================================================
   RICH TEXT COMPONENT
   ========================================================= */

function RichText({ content, className = "" }) {
  const normalized = normalizeRichText(content);

  if (!normalized) {
    return null;
  }

  /* -------------------------------------------------------
     Plain text
     ------------------------------------------------------- */

  if (!containsHtml(normalized)) {
    return (
      <p className={className}>
        {normalized}
      </p>
    );
  }

  /* -------------------------------------------------------
     HTML content
     ------------------------------------------------------- */

  return (
    <div
      className={`key-highlight-rich-text ${className}`}
      dangerouslySetInnerHTML={{
        __html: normalized,
      }}
    />
  );
}

/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function CourseKeyHighlights({ course }) {
  const [showSignup, setShowSignup] = useState(false);

  if (!course?.keyHighlights?.length) {
    return null;
  }

  return (
    <>
      {/* =====================================================
          KEY HIGHLIGHTS
      ===================================================== */}

      <section className="w-full bg-white py-16 border-y border-slate-100">
        <div className="w-full px-6 md:px-12 lg:px-20">

          {/* =================================================
              HEADING
          ================================================= */}

          <div className="mb-12">
            <h2 className="text-2xl md:text-2xl font-extrabold text-[#002147] leading-tight">
              What You'll Learn & Gain {course?.name || "This Course"} In India?
            </h2>

            <div className="w-20 h-1.5 bg-blue-600 mt-4 rounded-full" />
          </div>

          {/* =================================================
              CONTENT GRID
          ================================================= */}

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* =================================================
                LEFT: HIGHLIGHTS
            ================================================= */}

            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">

              {course.keyHighlights.map((item, i) => {

                /*
                  Support both formats:

                  {
                    description: "..."
                  }

                  OR

                  "some text"
                */

                const description =
                  typeof item === "string"
                    ? item
                    : item?.description;

                if (!description) {
                  return null;
                }

                return (
                  <div
                    key={item?._id || i}
                    className="group flex items-start space-x-4 p-4 rounded-xl transition-all duration-300 hover:bg-slate-50 min-w-0"
                  >

                    {/* =================================================
                        CHECK ICON
                    ================================================= */}

                    <div className="flex-shrink-0 mt-1">
                      <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-colors">

                        <svg
                          className="w-3.5 h-3.5 text-blue-600 group-hover:text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="3"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>

                      </div>
                    </div>

                    {/* =================================================
                        DESCRIPTION
                    ================================================= */}

                    <div className="min-w-0 flex-1">

                      <RichText
                        content={description}
                        className="text-gray-600 font-medium leading-relaxed group-hover:text-gray-900 transition-colors"
                      />

                    </div>

                  </div>
                );
              })}

            </div>

            {/* =================================================
                RIGHT: ADMISSION CARD
            ================================================= */}

            <div className="lg:col-span-4">

              <div className="sticky top-24 bg-[#002147] rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-900/20 overflow-hidden relative">

                {/* Decorative Circle */}

                <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full pointer-events-none" />

                {/* Small decorative circle */}

                <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />

                {/* =================================================
                    TITLE
                ================================================= */}

                <h3 className="text-2xl font-bold mb-6 relative z-10">
                  Admission Closing Soon
                </h3>

                {/* =================================================
                    BENEFITS
                ================================================= */}

                <div className="space-y-5 relative z-10">

                  {[
                    "Avoid paying 25% Late Fees",
                    "Secure a seat in your dream university",
                    "Avail early benefits",
                  ].map((text, idx) => (
                    <div
                      key={idx}
                      className="flex items-center space-x-3 bg-white/10 p-3 rounded-xl border border-white/10"
                    >

                      <span className="text-blue-400 text-lg flex-shrink-0">
                        ✦
                      </span>

                      <p className="text-sm font-semibold tracking-wide">
                        {text}
                      </p>

                    </div>
                  ))}

                </div>

                {/* =================================================
                    ENROLL BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() => setShowSignup(true)}
                  className="w-full mt-8 bg-[#c15304] cursor-pointer text-white font-bold py-4 rounded-xl transition-all duration-300 hover:bg-[#a94703] hover:scale-[1.02] shadow-lg relative z-10"
                >
                  Enroll Now
                </button>

              </div>

            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          SIGNUP POPUP
      ===================================================== */}

      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          courseName={course?.name || ""}
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

        /* Paragraph */

        .key-highlight-rich-text p {
          margin: 0 0 6px 0;
        }

        .key-highlight-rich-text p:last-child {
          margin-bottom: 0;
        }

        /* Bold */

        .key-highlight-rich-text strong,
        .key-highlight-rich-text b {
          font-weight: 700;
        }

        /* Italic */

        .key-highlight-rich-text em,
        .key-highlight-rich-text i {
          font-style: italic;
        }

        /* Underline */

        .key-highlight-rich-text u {
          text-decoration: underline;
        }

        /* Lists */

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

        .key-highlight-rich-text li:last-child {
          margin-bottom: 0;
        }

        /* Links */

        .key-highlight-rich-text a {
          color: #2563eb;
          text-decoration: underline;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        /* Headings */

        .key-highlight-rich-text h1,
        .key-highlight-rich-text h2,
        .key-highlight-rich-text h3,
        .key-highlight-rich-text h4,
        .key-highlight-rich-text h5,
        .key-highlight-rich-text h6 {
          font-weight: 700;
          line-height: 1.4;
          margin-top: 6px;
          margin-bottom: 5px;
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

        /* Blockquote */

        .key-highlight-rich-text blockquote {
          border-left: 3px solid #2563eb;
          padding-left: 10px;
          margin: 8px 0;
          color: #4b5563;
        }

        /* Images */

        .key-highlight-rich-text img {
          display: block;
          max-width: 100%;
          height: auto;
          margin: 8px 0;
          border-radius: 8px;
        }

        /* Tables */

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

        /* BR */

        .key-highlight-rich-text br {
          display: block;
          content: "";
          margin-top: 3px;
        }

        /* Mobile */

        @media (max-width: 640px) {

          .key-highlight-rich-text {
            font-size: 14px;
            line-height: 1.6;
          }

          .key-highlight-rich-text h1 {
            font-size: 1.35rem;
          }

          .key-highlight-rich-text h2 {
            font-size: 1.2rem;
          }

          .key-highlight-rich-text h3 {
            font-size: 1.1rem;
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