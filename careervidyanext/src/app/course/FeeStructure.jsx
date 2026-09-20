

// "use client";

// import { useState } from "react";
// import Signup from "@/app/signup/page.jsx";

// /* ================= LOGIN CHECK ================= */
// const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("accessToken");
// };

// export default function FeeStructure({
//   courseTitle,
//   feeStructureSidebar,
//   detailedFees,
//   emiOptions,
//   scholarships,
// }) {
//   const [showSignup, setShowSignup] = useState(false);

//   const hasSidebar = feeStructureSidebar?.length > 0;
//   const hasDetailed = detailedFees?.length > 0;
//   const hasEmi = emiOptions?.enabled;
//   const hasScholarships = scholarships?.length > 0;

//   if (!hasSidebar && !hasDetailed && !hasEmi && !hasScholarships) {
//     return null;
//   }

//   /* ================= SEO SCHEMA ================= */
//   const schema = {
//     "@context": "https://schema.org",
//     "@type": "Course",
//     name: courseTitle || "Course",
//     ...(hasDetailed && {
//       offers: detailedFees.flatMap((section) =>
//         (section.table || []).map((row) => ({
//           "@type": "Offer",
//           name: `${courseTitle} at ${row.universityName}`,
//           category: "Tuition Fee",
//           ...(row.courseFees && {
//             priceSpecification: {
//               "@type": "PriceSpecification",
//               price: row.courseFees,
//               priceCurrency: "INR",
//             },
//           }),
//         }))
//       ),
//     }),
//   };

//   /* ================= APPLY CLICK ================= */
//   const handleApplyClick = () => {
//     if (!isLoggedIn()) {
//       setShowSignup(true);
//       return;
//     }
//     const target =
//       document.getElementById("apply") || document.getElementById("signup");
//     if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
//     else window.location.hash = "#apply";
//   };

//   return (
//     <>
//       <script
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
//       />

//       <section
//         aria-labelledby="fee-heading"
//         className="w-full py-12 md:py-16 bg-white font-sans overflow-hidden"
//       >
//         <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
//           {/* ============ HEADER ============ */}
//           <header className="text-center mb-10 md:mb-12">
//             <h2
//               id="fee-heading"
//               className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] leading-tight mb-4 px-2"
//             >
//               Fee Structure for {courseTitle || "this Course"}
//             </h2>

//             <div
//               aria-hidden="true"
//               className="w-16 h-1 bg-[#002147] mx-auto rounded-full"
//             />
//           </header>

//           {/* ============ SIDEBAR + DETAILED ============ */}
//           {(hasSidebar || hasDetailed) && (
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-10 md:mb-12">
//               {/* ---------- SIDEBAR ---------- */}
//               {hasSidebar && (
//                 <aside className="lg:col-span-4 xl:col-span-3">
//                   <div className="lg:sticky lg:top-24 space-y-3">
//                     {feeStructureSidebar.map((item, i) => (
//                       <div
//                         key={i}
//                         className="rounded-xl p-4 sm:p-5 bg-[#002147] text-white"
//                       >
//                         <h3 className="text-[11px] font-bold uppercase tracking-widest text-blue-300 mb-2.5">
//                           {item.heading}
//                         </h3>

//                         {item.points?.length > 0 && (
//                           <ul className="space-y-1.5 list-none p-0 m-0">
//                             {item.points.map((point, j) => (
//                               <li
//                                 key={j}
//                                 className="flex items-start gap-2 text-sm leading-snug"
//                               >
//                                 <span
//                                   aria-hidden="true"
//                                   className="flex-shrink-0 w-1 h-1 rounded-full bg-[#c15304] mt-2"
//                                 />
//                                 <span className="text-white/90">{point}</span>
//                               </li>
//                             ))}
//                           </ul>
//                         )}
//                       </div>
//                     ))}

//                     <button
//                       type="button"
//                       onClick={handleApplyClick}
//                       className="block w-full text-center bg-[#c15304] hover:bg-[#a34403] text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
//                     >
//                       Apply Now →
//                     </button>
//                   </div>
//                 </aside>
//               )}

//               {/* ---------- DETAILED FEES ---------- */}
//               {hasDetailed && (
//                 <div
//                   className={
//                     hasSidebar
//                       ? "lg:col-span-8 xl:col-span-9 space-y-4"
//                       : "lg:col-span-12 space-y-4"
//                   }
//                 >
//                   {detailedFees.map((section, i) => (
//                     <article
//                       key={i}
//                       className="bg-white rounded-xl border border-slate-200 overflow-hidden"
//                     >
//                       {/* Section header */}
//                       <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-slate-50">
//                         <h3 className="text-base sm:text-lg font-bold text-[#002147]">
//                           {section.heading}
//                         </h3>

//                         {section.description && (
//                           <div
//                             className="text-xs sm:text-sm text-gray-500 mt-1 prose prose-sm max-w-none"
//                             dangerouslySetInnerHTML={{
//                               __html: section.description,
//                             }}
//                           />
//                         )}
//                       </div>

//                       {/* Table — responsive */}
//                       {section.table?.length > 0 && (
//                         <>
//                           {/* Desktop table */}
//                           <div className="hidden md:block overflow-x-auto">
//                             <table className="w-full border-collapse">
//                               <thead>
//                                 <tr className="bg-white border-b border-slate-200">
//                                   <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
//                                     University
//                                   </th>
//                                   <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
//                                     Course Fees
//                                   </th>
//                                   <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-gray-500">
//                                     Details
//                                   </th>
//                                 </tr>
//                               </thead>
//                               <tbody>
//                                 {section.table.map((row, j) => (
//                                   <tr
//                                     key={j}
//                                     className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors"
//                                   >
//                                     <td className="px-5 py-3.5 font-semibold text-sm text-[#002147]">
//                                       {row.universityName}
//                                     </td>
//                                     <td className="px-5 py-3.5">
//                                       <span className="inline-block px-2.5 py-1 rounded-md bg-[#002147] text-white font-bold text-xs">
//                                         {row.courseFees}
//                                       </span>
//                                     </td>
//                                     <td className="px-5 py-3.5 text-xs text-gray-600">
//                                       {row.detailedFeeStructure || "—"}
//                                     </td>
//                                   </tr>
//                                 ))}
//                               </tbody>
//                             </table>
//                           </div>

//                           {/* Mobile cards */}
//                           <div className="md:hidden divide-y divide-slate-100">
//                             {section.table.map((row, j) => (
//                               <div key={j} className="p-4">
//                                 <p className="font-semibold text-sm text-[#002147] mb-2">
//                                   {row.universityName}
//                                 </p>
//                                 <div className="flex items-center justify-between gap-2 mb-1">
//                                   <span className="text-[10px] uppercase tracking-widest text-gray-500">
//                                     Course Fees
//                                   </span>
//                                   <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#002147] text-white font-bold text-[11px]">
//                                     {row.courseFees}
//                                   </span>
//                                 </div>
//                                 {row.detailedFeeStructure && (
//                                   <p className="text-xs text-gray-500 mt-1">
//                                     {row.detailedFeeStructure}
//                                   </p>
//                                 )}
//                               </div>
//                             ))}
//                           </div>
//                         </>
//                       )}
//                     </article>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* ============ EMI OPTIONS ============ */}
//           {hasEmi && (
//             <article className="mb-10 md:mb-12 rounded-2xl overflow-hidden border border-slate-200">
//               <div className="grid grid-cols-1 md:grid-cols-12">
//                 {/* Left: Info */}
//                 <div className="md:col-span-7 p-5 sm:p-6 md:p-8">
//                   <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#002147] mb-3">
//                     Easy EMI Options Available
//                   </h3>

//                   <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
//                     Pay in easy monthly installments with{" "}
//                     <strong className="text-[#002147]">
//                       {emiOptions.interestRate || "0%"} interest
//                     </strong>
//                     . Don&apos;t let fees stop your career.
//                   </p>

//                   {emiOptions.tenureMonths?.length > 0 && (
//                     <div className="flex flex-wrap gap-2">
//                       {emiOptions.tenureMonths.map((months, i) => (
//                         <span
//                           key={i}
//                           className="px-3 py-1.5 rounded-md bg-slate-100 text-[#002147] text-[11px] font-bold"
//                         >
//                           {months} Months
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>

//                 {/* Right: Amount */}
//                 <div className="md:col-span-5 flex items-center justify-center bg-[#002147] p-5 sm:p-6 md:p-8">
//                   <div className="text-center text-white">
//                     <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-blue-300 mb-1.5">
//                       Starting from
//                     </p>

//                     <p className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none mb-1.5">
//                       {emiOptions.minMonthly || "₹3,000"}
//                     </p>

//                     <p className="text-xs sm:text-sm text-white/80 mb-4">
//                       per month
//                       {emiOptions.maxMonthly && (
//                         <> — up to {emiOptions.maxMonthly}</>
//                       )}
//                     </p>

//                     <button
//                       type="button"
//                       onClick={handleApplyClick}
//                       className="inline-block bg-[#c15304] hover:bg-[#a34403] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
//                     >
//                       Check Eligibility →
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </article>
//           )}

//           {/* ============ SCHOLARSHIPS ============ */}
//           {hasScholarships && (
//             <article className="rounded-2xl border border-slate-200 bg-slate-50 p-5 sm:p-6 md:p-8">
//               {/* Header */}
//               <header className="text-center mb-6 md:mb-8">
//                 <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#002147] mb-2 leading-tight">
//                   Scholarships & Financial Aid
//                 </h3>

//                 <div
//                   aria-hidden="true"
//                   className="w-12 h-1 bg-[#002147] mx-auto rounded-full"
//                 />

//                 <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-3">
//                   Avail exclusive discounts and scholarships to reduce your fees.
//                 </p>
//               </header>

//               {/* Scholarship cards — compact */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
//                 {scholarships.map((s, i) => (
//                   <div
//                     key={i}
//                     className="group relative bg-white rounded-xl p-4 sm:p-5 border border-slate-200 hover:border-[#c15304]/40 hover:shadow-md transition-all"
//                   >
//                     {/* Discount badge */}
//                     {s.discount && (
//                       <span className="inline-block bg-[#c15304] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded mb-3">
//                         {s.discount}
//                       </span>
//                     )}

//                     {/* Title */}
//                     {s.title && (
//                       <h4 className="text-sm sm:text-base font-bold text-[#002147] mb-1.5 leading-snug">
//                         {s.title}
//                       </h4>
//                     )}

//                     {/* Description */}
//                     {s.description && (
//                       <div
//                         className="text-gray-600 text-xs leading-relaxed prose prose-sm max-w-none [&_p]:my-0"
//                         dangerouslySetInnerHTML={{ __html: s.description }}
//                       />
//                     )}
//                   </div>
//                 ))}
//               </div>

//               {/* Footer CTA */}
//               <div className="mt-6 text-center">
//                 <button
//                   type="button"
//                   onClick={handleApplyClick}
//                   className="inline-flex items-center gap-2 bg-[#c15304] hover:bg-[#a34403] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
//                 >
//                   Check Scholarship Eligibility
//                   <svg
//                     className="w-3.5 h-3.5"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                     aria-hidden="true"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M13 7l5 5m0 0l-5 5m5-5H6"
//                     />
//                   </svg>
//                 </button>
//               </div>
//             </article>
//           )}
//         </div>
//       </section>

//       {/* SIGNUP MODAL */}
//       {showSignup && (
//         <Signup
//           onClose={() => setShowSignup(false)}
//           courseName={courseTitle}
//         />
//       )}
//     </>
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

export default function FeeStructure({
  courseTitle,
  feeStructureSidebar,
  detailedFees,
  emiOptions,
  scholarships,
}) {
  const [showSignup, setShowSignup] = useState(false);

  const hasSidebar = feeStructureSidebar?.length > 0;
  const hasDetailed = detailedFees?.length > 0;
  const hasEmi = emiOptions?.enabled;
  const hasScholarships = scholarships?.length > 0;

  if (!hasSidebar && !hasDetailed && !hasEmi && !hasScholarships) {
    return null;
  }

  /* ================= SEO SCHEMA ================= */
  const schema = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: courseTitle || "Course",
    ...(hasDetailed && {
      offers: detailedFees.flatMap((section) =>
        (section.table || []).map((row) => ({
          "@type": "Offer",
          name: `${courseTitle} at ${row.universityName}`,
          category: "Tuition Fee",
          ...(row.courseFees && {
            priceSpecification: {
              "@type": "PriceSpecification",
              price: row.courseFees,
              priceCurrency: "INR",
            },
          }),
        }))
      ),
    }),
  };

  /* ================= APPLY CLICK ================= */
  const handleApplyClick = () => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }
    const target =
      document.getElementById("apply") || document.getElementById("signup");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
    else window.location.hash = "#apply";
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <section
        aria-labelledby="fee-heading"
        className="w-full py-12 md:py-16 bg-slate-50 font-sans overflow-hidden"
      >
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 md:px-12">
          {/* ============ HEADER ============ */}
          <header className="text-center mb-10 md:mb-12">
            <span className="inline-block text-[10px] sm:text-xs font-bold tracking-[0.2em] text-[#c15304] uppercase mb-2.5">
              Transparent Pricing
            </span>

            <h2
              id="fee-heading"
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#002147] leading-tight mb-4 px-2"
            >
              Fee Structure for {courseTitle || "this Course"}
            </h2>

            <div
              aria-hidden="true"
              className="w-16 h-1 bg-[#002147] mx-auto rounded-full"
            />
          </header>

          {/* ============ SIDEBAR + DETAILED ============ */}
          {(hasSidebar || hasDetailed) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 md:gap-6 mb-10 md:mb-12">
              {/* ---------- SIDEBAR ---------- */}
              {hasSidebar && (
                <aside className="lg:col-span-4 xl:col-span-3">
                  <div className="lg:sticky lg:top-24 space-y-3">
                    {feeStructureSidebar.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-4 sm:p-5 bg-white border border-slate-200 border-l-4 border-l-[#002147] shadow-sm hover:shadow-md transition-all"
                      >
                        <h3 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-[#c15304] mb-2.5">
                          {item.heading}
                        </h3>

                        {item.points?.length > 0 && (
                          <ul className="space-y-1.5 list-none p-0 m-0">
                            {item.points.map((point, j) => (
                              <li
                                key={j}
                                className="flex items-start gap-2 text-sm leading-snug text-[#002147] font-semibold"
                              >
                                <span
                                  aria-hidden="true"
                                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-[#c15304] mt-1.5"
                                />
                                <span>{point}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="block w-full text-center bg-[#c15304] hover:bg-[#a34403] text-white font-bold text-sm py-2.5 rounded-lg transition-colors"
                    >
                      Apply Now →
                    </button>
                  </div>
                </aside>
              )}

              {/* ---------- DETAILED FEES ---------- */}
              {hasDetailed && (
                <div
                  className={
                    hasSidebar
                      ? "lg:col-span-8 xl:col-span-9 space-y-4"
                      : "lg:col-span-12 space-y-4"
                  }
                >
                  {detailedFees.map((section, i) => (
                    <article
                      key={i}
                      className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden"
                    >
                      {/* Section header */}
                      <div className="px-5 sm:px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-[#002147] to-[#003366]">
                        <h3 className="text-base sm:text-lg font-bold text-white">
                          {section.heading}
                        </h3>

                        {section.description && (
                          <div
                            className="text-xs sm:text-sm text-blue-100 mt-1 prose prose-sm prose-invert max-w-none"
                            dangerouslySetInnerHTML={{
                              __html: section.description,
                            }}
                          />
                        )}
                      </div>

                      {/* Table — responsive */}
                      {section.table?.length > 0 && (
                        <>
                          {/* Desktop table */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full border-collapse">
                              <thead>
                                <tr className="bg-slate-100 border-b border-slate-200">
                                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#002147]">
                                    University
                                  </th>
                                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#002147]">
                                    Course Fees
                                  </th>
                                  <th className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[#002147]">
                                    Details
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {section.table.map((row, j) => (
                                  <tr
                                    key={j}
                                    className="border-b border-slate-100 last:border-0 hover:bg-orange-50/40 transition-colors"
                                  >
                                    <td className="px-5 py-4 font-semibold text-sm text-[#002147]">
                                      {row.universityName}
                                    </td>
                                    <td className="px-5 py-4">
                                      <span className="inline-block px-3 py-1 rounded-md bg-[#c15304] text-white font-bold text-xs">
                                        {row.courseFees}
                                      </span>
                                    </td>
                                    <td className="px-5 py-4 text-xs text-gray-600">
                                      {row.detailedFeeStructure || "—"}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          {/* Mobile cards */}
                          <div className="md:hidden divide-y divide-slate-100">
                            {section.table.map((row, j) => (
                              <div key={j} className="p-4">
                                <p className="font-semibold text-sm text-[#002147] mb-2">
                                  {row.universityName}
                                </p>
                                <div className="flex items-center justify-between gap-2 mb-1">
                                  <span className="text-[10px] uppercase tracking-widest text-gray-500">
                                    Course Fees
                                  </span>
                                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#c15304] text-white font-bold text-[11px]">
                                    {row.courseFees}
                                  </span>
                                </div>
                                {row.detailedFeeStructure && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    {row.detailedFeeStructure}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </article>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ============ EMI OPTIONS ============ */}
          {hasEmi && (
            <article className="mb-10 md:mb-12 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white">
              <div className="grid grid-cols-1 md:grid-cols-12">
                {/* Left: Info */}
                <div className="md:col-span-7 p-5 sm:p-6 md:p-8">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-[#c15304] mb-2">
                    Flexible Payment
                  </span>

                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#002147] mb-3">
                    Easy EMI Options Available
                  </h3>

                  <p className="text-gray-600 text-xs sm:text-sm md:text-base leading-relaxed mb-4">
                    Pay in easy monthly installments with{" "}
                    <strong className="text-[#002147]">
                      {emiOptions.interestRate || "0%"} interest
                    </strong>
                    . Don&apos;t let fees stop your career.
                  </p>

                  {emiOptions.tenureMonths?.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {emiOptions.tenureMonths.map((months, i) => (
                        <span
                          key={i}
                          className="px-3 py-1.5 rounded-md bg-[#002147] text-white text-[11px] font-bold"
                        >
                          {months} Months
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Right: Amount */}
                <div className="md:col-span-5 flex items-center justify-center bg-gradient-to-br from-[#c15304] to-[#a34403] p-5 sm:p-6 md:p-8">
                  <div className="text-center text-white">
                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-orange-100 mb-1.5">
                      Starting from
                    </p>

                    <p className="text-3xl sm:text-4xl md:text-5xl font-bold leading-none mb-1.5">
                      {emiOptions.minMonthly || "₹3,000"}
                    </p>

                    <p className="text-xs sm:text-sm text-orange-100 mb-4">
                      per month
                      {emiOptions.maxMonthly && (
                        <> — up to {emiOptions.maxMonthly}</>
                      )}
                    </p>

                    <button
                      type="button"
                      onClick={handleApplyClick}
                      className="inline-block bg-white text-[#c15304] hover:bg-orange-50 text-xs sm:text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
                    >
                      Check Eligibility →
                    </button>
                  </div>
                </div>
              </div>
            </article>
          )}

          {/* ============ SCHOLARSHIPS ============ */}
          {hasScholarships && (
            <article className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 md:p-8 shadow-sm">
              {/* Header */}
              <header className="text-center mb-6 md:mb-8">
                <span className="inline-block text-[10px] sm:text-xs font-bold uppercase tracking-widest text-[#c15304] mb-2">
                  Save More
                </span>

                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#002147] mb-2 leading-tight">
                  Scholarships & Financial Aid
                </h3>

                <div
                  aria-hidden="true"
                  className="w-12 h-1 bg-[#002147] mx-auto rounded-full"
                />

                <p className="text-gray-600 text-xs sm:text-sm md:text-base max-w-2xl mx-auto mt-3">
                  Avail exclusive discounts and scholarships to reduce your fees.
                </p>
              </header>

              {/* Scholarship cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {scholarships.map((s, i) => (
                  <div
                    key={i}
                    className="group relative bg-slate-50 rounded-xl p-4 sm:p-5 border border-slate-200 border-t-4 border-t-[#c15304] hover:shadow-md transition-all"
                  >
                    {/* Discount badge */}
                    {s.discount && (
                      <span className="inline-block bg-[#c15304] text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded mb-3">
                        {s.discount}
                      </span>
                    )}

                    {/* Title */}
                    {s.title && (
                      <h4 className="text-sm sm:text-base font-bold text-[#002147] mb-1.5 leading-snug">
                        {s.title}
                      </h4>
                    )}

                    {/* Description */}
                    {s.description && (
                      <div
                        className="text-gray-600 text-xs leading-relaxed prose prose-sm max-w-none [&_p]:my-0"
                        dangerouslySetInnerHTML={{ __html: s.description }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Footer CTA */}
              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={handleApplyClick}
                  className="inline-flex items-center gap-2 bg-[#c15304] hover:bg-[#a34403] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-md transition-colors"
                >
                  Check Scholarship Eligibility
                  <svg
                    className="w-3.5 h-3.5"
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
            </article>
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