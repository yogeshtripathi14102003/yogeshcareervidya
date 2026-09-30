
// "use client";

// import { useState } from "react";
// import Signup from "@/app/signup/page.jsx";

// /* ================= LOGIN CHECK ================= */
// const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("accessToken");
// };

// export default function OnlineCourseEligibility({
//   onlineEligibility,
//   courseTitle,
//   whoShouldPursue,
// }) {
//   const [showSignup, setShowSignup] = useState(false);

//   if (!onlineEligibility || onlineEligibility.length === 0) {
//     return null;
//   }

//   /* ================= DETECT WHO SHOULD PURSUE ================= */
//   const isWhoShouldPursue = (item) =>
//     item?.heading?.toLowerCase().includes("who should");

//   const eligibilityItems = onlineEligibility.filter(
//     (item) => !isWhoShouldPursue(item)
//   );

//   const whoShouldPursueItem =
//     onlineEligibility.find(isWhoShouldPursue) || whoShouldPursue;

//   /* ================= SEO SCHEMA ================= */
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "EducationalOccupationalProgram",
//     name: courseTitle || "Course",
//     programPrerequisites: eligibilityItems.map((item) => ({
//       "@type": "EducationalOccupationalCredential",
//       name: item.heading,
//       ...(item.description && {
//         description: item.description.replace(/<[^>]*>/g, "").trim(),
//       }),
//     })),
//   };

//   /* ================= APPLY CLICK ================= */
//   const handleApplyClick = () => {
//     if (!isLoggedIn()) {
//       setShowSignup(true);
//       return;
//     }
//     const target =
//       document.getElementById("apply") || document.getElementById("signup");
//     if (target) {
//       target.scrollIntoView({ behavior: "smooth", block: "center" });
//     } else {
//       window.location.hash = "#apply";
//     }
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//       />

//       <section
//         aria-labelledby="eligibility-heading"
//         className="w-full py-10 sm:py-12 md:py-16 bg-white font-sans"
//       >
//         <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
//           {/* ============ HEADER ============ */}
//           <header className="text-center mb-7 sm:mb-8 md:mb-10">
//             <h2
//               id="eligibility-heading"
//               className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-[#002147] leading-tight mb-3 px-2"
//             >
//               Eligibility for {courseTitle || "this Course"}
//             </h2>

//             <div
//               aria-hidden="true"
//               className="w-14 sm:w-16 h-1 bg-[#002147] mx-auto rounded-full"
//             />

//             <p className="text-gray-500 text-xs sm:text-sm md:text-base mt-3 max-w-2xl mx-auto px-4">
//               Check if you meet the requirements before applying.
//             </p>
//           </header>

//           {/* ============ ELIGIBILITY CARDS ============ */}
//           {eligibilityItems.length > 0 && (
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-7 sm:mb-8 md:mb-10">
//               {eligibilityItems.map((item, i) => (
//                 <article
//                   key={i}
//                   className="bg-white border border-slate-200 rounded-lg p-4 sm:p-5 hover:shadow-sm transition-shadow"
//                 >
//                   {item.subHeading && (
//                     <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c15304] mb-1.5">
//                       {item.subHeading}
//                     </p>
//                   )}

//                   {item.heading && (
//                     <h3 className="text-sm sm:text-base md:text-lg font-bold text-[#002147] leading-snug mb-2.5 sm:mb-3 break-words">
//                       {item.heading}
//                     </h3>
//                   )}

//                   {item.description && (
//                     <div
//                       className="text-gray-700 text-[13px] sm:text-sm leading-relaxed break-words
//                         [&_p]:my-0 [&_p+p]:mt-2
//                         [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5
//                         [&_ol]:my-2 [&_ol]:pl-5
//                         [&_strong]:text-[#002147] [&_strong]:font-semibold"
//                       dangerouslySetInnerHTML={{ __html: item.description }}
//                     />
//                   )}

//                   {item.subDescription && (
//                     <div
//                       className="mt-3 pt-3 border-t border-slate-100 text-gray-600 text-[13px] sm:text-sm leading-relaxed break-words
//                         [&_p]:my-0 [&_p+p]:mt-2
//                         [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5
//                         [&_strong]:text-[#002147] [&_strong]:font-semibold"
//                       dangerouslySetInnerHTML={{ __html: item.subDescription }}
//                     />
//                   )}
//                 </article>
//               ))}
//             </div>
//           )}

//           {/* ============ WHO SHOULD PURSUE ============ */}
//           {whoShouldPursueItem && (
//             <article
//               aria-labelledby="who-pursue-heading"
//               className="bg-slate-50 border border-slate-200 rounded-lg p-4 sm:p-6 md:p-8"
//             >
//               {whoShouldPursueItem.heading && (
//                 <h3
//                   id="who-pursue-heading"
//                   className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#002147] mb-2 leading-snug break-words"
//                 >
//                   {whoShouldPursueItem.heading}
//                 </h3>
//               )}

//               {whoShouldPursueItem.subHeading && (
//                 <p className="text-gray-600 text-[13px] sm:text-sm mb-3 sm:mb-4">
//                   {whoShouldPursueItem.subHeading}
//                 </p>
//               )}

//               {whoShouldPursueItem.description && (
//                 <div
//                   className="text-gray-700 text-[13px] sm:text-sm leading-relaxed mb-3 sm:mb-4 break-words
//                     [&_p]:my-0 [&_p+p]:mt-2
//                     [&_strong]:text-[#002147] [&_strong]:font-semibold"
//                   dangerouslySetInnerHTML={{
//                     __html: whoShouldPursueItem.description,
//                   }}
//                 />
//               )}

//               {whoShouldPursueItem.subDescription && (
//                 <div
//                   className="text-gray-700 text-[13px] sm:text-sm leading-relaxed break-words
//                     [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-1
//                     [&_ol]:my-2 [&_ol]:pl-5
//                     [&_p]:my-0"
//                   dangerouslySetInnerHTML={{
//                     __html: whoShouldPursueItem.subDescription,
//                   }}
//                 />
//               )}
//             </article>
//           )}

//           {/* ============ BOTTOM CTA ============ */}
//           <div className="mt-7 sm:mt-8 md:mt-10 text-center">
//             <button
//               type="button"
//               onClick={handleApplyClick}
//               aria-label="Apply now"
//               className="inline-flex items-center justify-center gap-2 w-full sm:w-auto bg-[#c15304] hover:bg-[#a34403] text-white text-sm font-bold px-5 sm:px-6 py-3 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c15304] focus-visible:ring-offset-2"
//             >
//               Apply Now
//               <svg
//                 className="w-4 h-4"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M13 7l5 5m0 0l-5 5m5-5H6"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>
//       </section>

//       {/* SIGNUP MODAL */}
//       {showSignup && (
//         <Signup onClose={() => setShowSignup(false)} courseName={courseTitle} />
//       )}
//     </>
//   );
// }


"use client";

import { useState } from "react";
import Signup from "@/app/signup/page.jsx";

/* ═══════════════════════════════════════════════
   LOGIN CHECK
═══════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     DETECT WHO SHOULD PURSUE
  ═══════════════════════════════════════════════ */
  const isWhoShouldPursue = (item) =>
    item?.heading?.toLowerCase().includes("who should");

  const eligibilityItems = onlineEligibility.filter(
    (item) => !isWhoShouldPursue(item)
  );

  const whoShouldPursueItem =
    onlineEligibility.find(isWhoShouldPursue) || whoShouldPursue;

  /* ═══════════════════════════════════════════════
     SEO SCHEMA
  ═══════════════════════════════════════════════ */
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

  /* ═══════════════════════════════════════════════
     APPLY CLICK
  ═══════════════════════════════════════════════ */
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
        className="w-full py-10 sm:py-12 md:py-16 font-sans"
        style={{ background: "#fff" }}
      >
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
          {/* ═══════════════════════════════════════════
              HEADER — Navy heading + Navy underline
          ═══════════════════════════════════════════ */}
          <header className="text-center mb-7 sm:mb-8 md:mb-10">
            <h2
              id="eligibility-heading"
              className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-tight mb-3 px-2"
              style={{ color: "var(--cv-primary)" }}
            >
              Eligibility for {courseTitle || "this Course"}
            </h2>

            <div
              aria-hidden="true"
              className="w-14 sm:w-16 h-1 mx-auto rounded-full"
              style={{ background: "var(--cv-primary)" }}
            />

            <p
              className="text-xs sm:text-sm md:text-base mt-3 max-w-2xl mx-auto px-4"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              Check if you meet the requirements before applying.
            </p>
          </header>

          {/* ═══════════════════════════════════════════
              ELIGIBILITY CARDS
          ═══════════════════════════════════════════ */}
          {eligibilityItems.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-7 sm:mb-8 md:mb-10">
              {eligibilityItems.map((item, i) => (
                <article
                  key={i}
                  className="rounded-lg p-4 sm:p-5 transition-shadow"
                  style={{
                    background: "#fff",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 14px rgba(30, 58, 138, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  {/* Sub-heading — Navy accent */}
                  {item.subHeading && (
                    <p
                      className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest mb-1.5"
                      style={{ color: "var(--cv-accent)" }}
                    >
                      {item.subHeading}
                    </p>
                  )}

                  {/* Heading — Navy */}
                  {item.heading && (
                    <h3
                      className="text-sm sm:text-base md:text-lg font-bold leading-snug mb-2.5 sm:mb-3 break-words"
                      style={{ color: "var(--cv-primary)" }}
                    >
                      {item.heading}
                    </h3>
                  )}

                  {/* Description */}
                  {item.description && (
                    <div
                      className="text-[13px] sm:text-sm leading-relaxed break-words
                        [&_p]:my-0 [&_p+p]:mt-2
                        [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5
                        [&_ol]:my-2 [&_ol]:pl-5
                        [&_strong]:font-semibold"
                      style={{ color: "var(--cv-neutral-dark)" }}
                      dangerouslySetInnerHTML={{ __html: item.description }}
                    />
                  )}

                  {/* Sub-description */}
                  {item.subDescription && (
                    <div
                      className="mt-3 pt-3 text-[13px] sm:text-sm leading-relaxed break-words
                        [&_p]:my-0 [&_p+p]:mt-2
                        [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-0.5
                        [&_strong]:font-semibold"
                      style={{
                        color: "var(--cv-neutral-mid)",
                        borderTop: "1px solid var(--cv-neutral-border)",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: item.subDescription,
                      }}
                    />
                  )}
                </article>
              ))}
            </div>
          )}

          {/* ═══════════════════════════════════════════
              WHO SHOULD PURSUE
          ═══════════════════════════════════════════ */}
          {whoShouldPursueItem && (
            <article
              aria-labelledby="who-pursue-heading"
              className="rounded-lg p-4 sm:p-6 md:p-8"
              style={{
                background: "var(--cv-neutral-light)",
                border: "1px solid var(--cv-neutral-border)",
              }}
            >
              {whoShouldPursueItem.heading && (
                <h3
                  id="who-pursue-heading"
                  className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold mb-2 leading-snug break-words"
                  style={{ color: "var(--cv-primary)" }}
                >
                  {whoShouldPursueItem.heading}
                </h3>
              )}

              {whoShouldPursueItem.subHeading && (
                <p
                  className="text-[13px] sm:text-sm mb-3 sm:mb-4"
                  style={{ color: "var(--cv-neutral-mid)" }}
                >
                  {whoShouldPursueItem.subHeading}
                </p>
              )}

              {whoShouldPursueItem.description && (
                <div
                  className="text-[13px] sm:text-sm leading-relaxed mb-3 sm:mb-4 break-words
                    [&_p]:my-0 [&_p+p]:mt-2
                    [&_strong]:font-semibold"
                  style={{ color: "var(--cv-neutral-dark)" }}
                  dangerouslySetInnerHTML={{
                    __html: whoShouldPursueItem.description,
                  }}
                />
              )}

              {whoShouldPursueItem.subDescription && (
                <div
                  className="text-[13px] sm:text-sm leading-relaxed break-words
                    [&_ul]:my-2 [&_ul]:pl-5 [&_li]:my-1
                    [&_ol]:my-2 [&_ol]:pl-5
                    [&_p]:my-0"
                  style={{ color: "var(--cv-neutral-dark)" }}
                  dangerouslySetInnerHTML={{
                    __html: whoShouldPursueItem.subDescription,
                  }}
                />
              )}
            </article>
          )}

          {/* ═══════════════════════════════════════════
              BOTTOM CTA — Orange gradient
          ═══════════════════════════════════════════ */}
          <div className="mt-7 sm:mt-8 md:mt-10 text-center">
            <button
              type="button"
              onClick={handleApplyClick}
              aria-label="Apply now"
              className="cv-btn-cta inline-flex items-center justify-center gap-2 w-full sm:w-auto px-5 sm:px-6 py-3 cursor-pointer"
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