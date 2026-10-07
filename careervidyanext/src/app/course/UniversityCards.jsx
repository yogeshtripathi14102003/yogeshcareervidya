// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Signup from "@/app/signup/page.jsx";

// /* ═══════════════════════════════════════════════
//    LOGIN CHECK
// ═══════════════════════════════════════════════ */
// const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("accessToken");
// };

// const INITIAL_COUNT = 4;

// export default function UniversityCards({ universities, courseTitle }) {
//   const router = useRouter();
//   const [showSignup, setShowSignup] = useState(false);
//   const [selectedUnis, setSelectedUnis] = useState([]);
//   const [showAll, setShowAll] = useState(false);

//   // LOGIN STATE
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const check = () => setLoggedIn(!!localStorage.getItem("accessToken"));
//     check();

//     window.addEventListener("storage", check);
//     window.addEventListener("focus", check);
//     return () => {
//       window.removeEventListener("storage", check);
//       window.removeEventListener("focus", check);
//     };
//   }, []);

//   if (!universities || universities.length === 0) {
//     return null;
//   }

//   const sorted = [...universities].sort(
//     (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
//   );

//   const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
//   const hasMore = sorted.length > INITIAL_COUNT;

//   /* ═══════════════════════════════════════════════
//      COMPARE TOGGLE
//   ═══════════════════════════════════════════════ */
//   const toggleCompare = (uniId) => {
//     setSelectedUnis((prev) => {
//       if (prev.includes(uniId)) return prev.filter((id) => id !== uniId);
//       if (prev.length >= 3) {
//         alert("You can compare up to 3 universities at a time.");
//         return prev;
//       }
//       return [...prev, uniId];
//     });
//   };

//   /* ═══════════════════════════════════════════════
//      GO TO COMPARE PAGE
//   ═══════════════════════════════════════════════ */
//   const goToCompare = (ids) => {
//     if (!isLoggedIn()) {
//       setShowSignup(true);
//       return;
//     }
//     router.push(ids ? `/comparedetail?ids=${ids}` : "/comparedetail");
//   };

//   const handleCompareAll = () => {
//     if (selectedUnis.length < 2) {
//       alert("Please select at least 2 universities to compare.");
//       return;
//     }
//     goToCompare(selectedUnis);
//   };

//   return (
//     <>
//       <section
//         aria-labelledby="university-heading"
//         className="w-full py-12 md:py-16 font-sans"
//         style={{ background: "#fff" }}
//       >
//         <div className="py-8 rounded-lg max-w-[1800px] lg:w-[90%] mx-auto px-6">
//           {/* ═══════════════════════════════════════════
//               HEADER
//           ═══════════════════════════════════════════ */}
//           <header className="text-center mb-8 md:mb-10">
//             <h2
//               id="university-heading"
//               className="text-2xl md:text-3xl font-bold leading-tight mb-3"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               Top Universities for {courseTitle || "this Course"}
//             </h2>

//             <div
//               aria-hidden="true"
//               className="w-16 h-1 mx-auto rounded-full"
//               style={{ background: "var(--cv-primary)" }}
//             />

//             <p
//               className="text-xs md:text-sm mt-3 max-w-2xl mx-auto"
//               style={{ color: "var(--cv-neutral-mid)" }}
//             >
//               Compare fees, approvals, and ratings to find the perfect
//               university for your career goals.
//             </p>
//           </header>

//           {/* ═══════════════════════════════════════════
//               CARDS GRID
//           ═══════════════════════════════════════════ */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
//             {visible.map((uni, index) => {
//               const uniId = uni.universityId || uni.slug || index;
//               const isCompared = selectedUnis.includes(uniId);

//               return (
//                 <article
//                   key={uniId}
//                   className="group relative rounded-xl transition-all duration-300 overflow-hidden flex flex-col"
//                   style={{
//                     background: "#fff",
//                     border: isCompared
//                       ? "1px solid var(--cv-primary)"
//                       : "1px solid var(--cv-neutral-border)",
//                     boxShadow: isCompared
//                       ? "0 8px 20px rgba(30, 58, 138, 0.15)"
//                       : "0 2px 8px rgba(15, 23, 42, 0.04)",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isCompared) {
//                       e.currentTarget.style.borderColor = "var(--cv-primary)";
//                       e.currentTarget.style.boxShadow =
//                         "0 10px 24px rgba(30, 58, 138, 0.14)";
//                       e.currentTarget.style.transform = "translateY(-2px)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isCompared) {
//                       e.currentTarget.style.borderColor =
//                         "var(--cv-neutral-border)";
//                       e.currentTarget.style.boxShadow =
//                         "0 2px 8px rgba(15, 23, 42, 0.04)";
//                       e.currentTarget.style.transform = "translateY(0)";
//                     }
//                   }}
//                 >
//                   {/* ═══════════════════════════════════════
//                       TOP RATED BADGE — Border pe
//                   ═══════════════════════════════════════ */}
//                   {uni.isTopRated && (
//                     <div className="absolute -top-[1px] -right-[1px] z-10">
//                       <span
//                         className="inline-flex items-center gap-1 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl rounded-tr-xl"
//                         style={{ background: "var(--cv-accent)" }}
//                       >
//                         ⭐ Top Rated
//                       </span>
//                     </div>
//                   )}

//                   {/* ═══════════════════════════════════════
//                       CARD HEADER
//                   ═══════════════════════════════════════ */}
//                   <div
//                     className="p-4"
//                     style={{
//                       borderBottom: "1px solid var(--cv-neutral-border)",
//                     }}
//                   >
//                     <div className="flex items-start gap-3">
//                       {/* Logo */}
//                       <div
//                         className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center overflow-hidden"
//                         style={{
//                           background: "var(--cv-neutral-light)",
//                           border: "1px solid var(--cv-neutral-border)",
//                         }}
//                       >
//                         {uni.universityImage ? (
//                           <Image
//                             src={uni.universityImage}
//                             alt={uni.name || "University"}
//                             width={56}
//                             height={56}
//                             className="w-full h-full object-contain p-1"
//                           />
//                         ) : (
//                           <span
//                             className="text-lg md:text-xl font-bold"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             {uni.name?.charAt(0) || "U"}
//                           </span>
//                         )}
//                       </div>

//                       {/* Name + Rating */}
//                       <div className="flex-1 min-w-0">
//                         <h3
//                           className="text-sm md:text-[15px] font-bold leading-snug mb-1 line-clamp-2 pr-12"
//                           style={{ color: "var(--cv-primary)" }}
//                         >
//                           {uni.name}
//                         </h3>

//                         {uni.rating > 0 && (
//                           <div className="flex items-center gap-1">
//                             <div className="flex items-center gap-0.5">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <svg
//                                   key={star}
//                                   className="w-3 h-3"
//                                   style={{
//                                     color:
//                                       star <= Math.round(uni.rating)
//                                         ? "var(--cv-accent)"
//                                         : "var(--cv-neutral-border)",
//                                   }}
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                   aria-hidden="true"
//                                 >
//                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                 </svg>
//                               ))}
//                             </div>
//                             <span
//                               className="text-[11px] font-semibold"
//                               style={{ color: "var(--cv-neutral-dark)" }}
//                             >
//                               {uni.rating}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Approvals chips */}
//                     {uni.approvals?.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mt-2.5">
//                         {uni.approvals.slice(0, 2).map((a, i) => (
//                           <span
//                             key={i}
//                             className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded"
//                             style={{
//                               background: "var(--cv-primary-light)",
//                               color: "var(--cv-primary)",
//                               border: "1px solid var(--cv-primary-light)",
//                             }}
//                           >
//                             {a.name || a.label}
//                           </span>
//                         ))}
//                         {uni.approvals.length > 2 && (
//                           <span
//                             className="text-[9px] font-semibold px-1"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             +{uni.approvals.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* ═══════════════════════════════════════
//                       CARD BODY
//                   ═══════════════════════════════════════ */}
//                   <div className="p-4 flex-1 flex flex-col">
//                     {/* Fee */}
//                     <div className="mb-3">
//                       <p
//                         className="text-[9px] uppercase tracking-widest font-semibold mb-0.5"
//                         style={{ color: "var(--cv-neutral-mid)" }}
//                       >
//                         Total Fee
//                       </p>
//                       <p
//                         className="text-lg md:text-xl font-extrabold"
//                         style={{ color: "var(--cv-primary)" }}
//                       >
//                         {uni.courseFees?.total || "Contact Us"}
//                       </p>

//                       {uni.courseFees?.emiStartsFrom && (
//                         <p
//                           className="text-[10px] font-semibold mt-0.5"
//                           style={{ color: "var(--cv-accent)" }}
//                         >
//                           EMI from {uni.courseFees.emiStartsFrom}
//                         </p>
//                       )}
//                     </div>

//                     {/* Details List */}
//                     <div className="space-y-1.5 mb-3 text-xs">
//                       {uni.duration && (
//                         <div className="flex justify-between items-center">
//                           <span
//                             className="text-[10px]"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             Duration
//                           </span>
//                           <span
//                             className="font-semibold text-[10px]"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {uni.duration}
//                           </span>
//                         </div>
//                       )}

//                       {uni.courseFees?.perSemester && (
//                         <div className="flex justify-between items-center">
//                           <span
//                             className="text-[10px]"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             Per Sem
//                           </span>
//                           <span
//                             className="font-semibold text-[10px]"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {uni.courseFees.perSemester}
//                           </span>
//                         </div>
//                       )}

//                       {uni.mode && (
//                         <div className="flex justify-between items-center">
//                           <span
//                             className="text-[10px]"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             Mode
//                           </span>
//                           <span
//                             className="font-semibold text-[10px]"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {uni.mode}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* ═══════════════════════════════════════
//                         CTA BUTTONS — EK HI ROW ME
//                     ═══════════════════════════════════════ */}
//                     <div
//                       className={`mt-auto grid gap-1.5 ${
//                         !loggedIn && uni.brochureLink
//                           ? "grid-cols-[1fr_auto_auto]"
//                           : !loggedIn
//                           ? "grid-cols-[1fr_auto]"
//                           : uni.brochureLink
//                           ? "grid-cols-[1fr_auto]"
//                           : "grid-cols-1"
//                       }`}
//                     >
//                       {/* Apply Now — sirf logged-out users ko dikhega */}
//                       {!loggedIn && (
//                         <a
//                           href={uni.applyLink || "#"}
//                           className="text-center text-white text-xs font-bold py-2 px-3 rounded-md transition-all whitespace-nowrap"
//                           style={{ background: "var(--cv-primary)" }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary-dark)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                           }}
//                         >
//                           Apply Now
//                         </a>
//                       )}

//                       {/* Compare Button — Navy theme (global CSS) */}
//                       <button
//                         type="button"
//                         onClick={() => toggleCompare(uniId)}
//                         className="text-xs font-bold py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer"
//                         style={{
//                           background: isCompared ? "var(--cv-primary)" : "#fff",
//                           color: isCompared ? "#fff" : "var(--cv-primary)",
//                           border: "1px solid var(--cv-primary)",
//                         }}
//                         onMouseEnter={(e) => {
//                           if (!isCompared) {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                             e.currentTarget.style.color = "#fff";
//                           } else {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary-dark)";
//                             e.currentTarget.style.color = "#fff";
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (!isCompared) {
//                             e.currentTarget.style.background = "#fff";
//                             e.currentTarget.style.color = "var(--cv-primary)";
//                           } else {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                             e.currentTarget.style.color = "#fff";
//                           }
//                         }}
//                       >
//                         {isCompared ? "✓ Added" : "+ Compare"}
//                       </button>

//                       {/* Brochure Button */}
//                       {uni.brochureLink && (
//                         <a
//                           href={uni.brochureLink}
//                           target="_blank"
//                           rel="noreferrer noopener"
//                           className="flex items-center justify-center w-9 rounded-md transition-colors"
//                           style={{
//                             background: "#fff",
//                             border: "1px solid var(--cv-primary)",
//                             color: "var(--cv-primary)",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                             e.currentTarget.style.color = "#fff";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = "#fff";
//                             e.currentTarget.style.color = "var(--cv-primary)";
//                           }}
//                           aria-label="Download Brochure"
//                         >
//                           <svg
//                             className="w-3.5 h-3.5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                             />
//                           </svg>
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           {/* VIEW MORE BUTTON */}
//           {hasMore && !showAll && (
//             <div className="mt-8 text-center">
//               <button
//                 type="button"
//                 onClick={() => setShowAll(true)}
//                 className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
//                 style={{
//                   background: "#fff",
//                   border: "1px solid var(--cv-primary)",
//                   color: "var(--cv-primary)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "var(--cv-primary)";
//                   e.currentTarget.style.color = "#fff";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "#fff";
//                   e.currentTarget.style.color = "var(--cv-primary)";
//                 }}
//               >
//                 View More Universities
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}

//           {/* SHOW LESS BUTTON */}
//           {hasMore && showAll && (
//             <div className="mt-8 text-center">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowAll(false);
//                   document
//                     .getElementById("university-heading")
//                     ?.scrollIntoView({ behavior: "smooth", block: "start" });
//                 }}
//                 className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
//                 style={{
//                   background: "#fff",
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-mid)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.borderColor = "var(--cv-primary)";
//                   e.currentTarget.style.color = "var(--cv-primary)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.borderColor = "var(--cv-neutral-border)";
//                   e.currentTarget.style.color = "var(--cv-neutral-mid)";
//                 }}
//               >
//                 Show Less
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 15l7-7 7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}

//           {/* Footnote */}
//           <div className="mt-6 text-center">
//             <p
//               className="text-[11px] italic"
//               style={{ color: "var(--cv-neutral-mid)" }}
//             >
//               * Fees and approvals are indicative and subject to change. Verify
//               with the university before applying.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* FLOATING COMPARE BAR */}
//       {selectedUnis.length > 0 && (
//         <div
//           className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 max-w-[95vw]"
//           style={{
//             background: "var(--cv-primary)",
//             color: "#fff",
//           }}
//         >
//           <span className="text-xs font-semibold whitespace-nowrap">
//             {selectedUnis.length} selected
//           </span>

//           <button
//             type="button"
//             onClick={() => setSelectedUnis([])}
//             className="text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
//             style={{ background: "rgba(255,255,255,0.2)" }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.3)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.2)";
//             }}
//           >
//             Clear
//           </button>

//           <button
//             type="button"
//             onClick={handleCompareAll}
//             disabled={selectedUnis.length < 2}
//             className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             style={{ background: "var(--cv-accent)" }}
//             onMouseEnter={(e) => {
//               if (selectedUnis.length >= 2) {
//                 e.currentTarget.style.background = "var(--cv-accent-dark)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "var(--cv-accent)";
//             }}
//           >
//             Compare Now →
//           </button>
//         </div>
//       )}

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



// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Signup from "@/app/signup/page.jsx";

// const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("accessToken");
// };

// const INITIAL_COUNT = 6;

// const getLocation = (uni) =>
//   uni.location ||
//   [uni.city, uni.state].filter(Boolean).join(", ") ||
//   uni.address ||
//   "";

// export default function UniversityCardsCompact({ universities, courseTitle }) {
//   const router = useRouter();
//   const [showSignup, setShowSignup] = useState(false);
//   const [selectedUnis, setSelectedUnis] = useState([]);
//   const [showAll, setShowAll] = useState(false);
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;
//     const check = () => setLoggedIn(!!localStorage.getItem("accessToken"));
//     check();
//     window.addEventListener("storage", check);
//     window.addEventListener("focus", check);
//     return () => {
//       window.removeEventListener("storage", check);
//       window.removeEventListener("focus", check);
//     };
//   }, []);

//   if (!universities || universities.length === 0) return null;

//   const sorted = [...universities].sort(
//     (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
//   );
//   const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
//   const hasMore = sorted.length > INITIAL_COUNT;

//   const toggleCompare = (uniId) => {
//     setSelectedUnis((prev) => {
//       if (prev.includes(uniId)) return prev.filter((id) => id !== uniId);
//       if (prev.length >= 3) {
//         alert("You can compare up to 3 universities at a time.");
//         return prev;
//       }
//       return [...prev, uniId];
//     });
//   };

//   const selectedItems = sorted
//     .map((uni, i) => ({ uni, id: uni.universityId || uni.slug || i }))
//     .filter(({ id }) => selectedUnis.includes(id));

//   const handleCompareAll = () => {
//     if (selectedUnis.length < 2) {
//       alert("Please select at least 2 universities to compare.");
//       return;
//     }
//     if (!isLoggedIn()) {
//       setShowSignup(true);
//       return;
//     }
//     router.push(`/comparedetail?ids=${selectedUnis}`);
//   };

//   return (
//     <>
//       <section
//         aria-labelledby="university-heading"
//         className="w-full py-10 md:py-14 font-sans"
//         style={{ background: "#fff" }}
//       >
//         <div className="max-w-[1400px] lg:w-[90%] mx-auto px-5">
//           {/* HEADER */}
//           <header className="mb-6 md:mb-8">
//             <h2
//               id="university-heading"
//               className="text-xl md:text-2xl font-bold leading-tight"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               Top Universities for {courseTitle || "this Course"}
//             </h2>
//             <p
//               className="text-xs md:text-sm mt-1"
//               style={{ color: "var(--cv-neutral-mid)" }}
//             >
//               Compare fees and approvals in one glance.
//             </p>
//           </header>

//           {/* GRID */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
//             {visible.map((uni, index) => {
//               const uniId = uni.universityId || uni.slug || index;
//               const isCompared = selectedUnis.includes(uniId);
//               const recommended = uni.isRecommended || uni.isTopRated;
//               const location = getLocation(uni);
//               const approval = uni.approvals?.[0];
//               const emi = uni.courseFees?.emiStartsFrom || uni.emi || null;
//               const extraApprovals = (uni.approvals?.length || 1) - 1;

//               return (
//                 <article
//                   key={uniId}
//                   className="relative flex flex-col rounded-xl bg-white p-3.5 transition-shadow duration-200 hover:shadow-md"
//                   style={{
//                     border: isCompared
//                       ? "1.5px solid var(--cv-primary)"
//                       : "1px solid var(--cv-neutral-border)",
//                     borderLeft: recommended
//                       ? "4px solid #f59e0b"
//                       : undefined,
//                     boxShadow: isCompared
//                       ? "0 6px 16px rgba(30, 58, 138, 0.14)"
//                       : "0 1px 4px rgba(15, 23, 42, 0.04)",
//                   }}
//                 >
//                   {/* TOP: logo + name + compare toggle */}
//                   <div className="flex items-start gap-3">
//                     <div
//                       className="flex h-11 w-11 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white"
//                       style={{ border: "1px solid var(--cv-neutral-border)" }}
//                     >
//                       {uni.universityImage ? (
//                         <Image
//                           src={uni.universityImage}
//                           alt={`${uni.name || "University"} logo`}
//                           width={44}
//                           height={44}
//                           className="h-full w-full object-contain p-1"
//                         />
//                       ) : (
//                         <span
//                           className="text-base font-bold"
//                           style={{ color: "var(--cv-neutral-mid)" }}
//                         >
//                           {uni.name?.charAt(0) || "U"}
//                         </span>
//                       )}
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <h3
//                         className="line-clamp-2 text-[13px] font-bold leading-snug"
//                         style={{ color: "#111827" }}
//                       >
//                         {uni.name}
//                       </h3>
//                       {location && (
//                         <p
//                           className="mt-0.5 truncate text-[11px]"
//                           style={{ color: "var(--cv-neutral-mid)" }}
//                         >
//                           {location}
//                         </p>
//                       )}
//                     </div>

//                     {/* Compare toggle (icon only) */}
//                     <button
//                       type="button"
//                       onClick={() => toggleCompare(uniId)}
//                       aria-pressed={isCompared}
//                       aria-label={
//                         isCompared
//                           ? `Remove ${uni.name} from compare`
//                           : `Add ${uni.name} to compare`
//                       }
//                       title={isCompared ? "Added to compare" : "Add to compare"}
//                       className="flex h-7 w-7 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors"
//                       style={{
//                         background: isCompared ? "var(--cv-primary)" : "#fff",
//                         color: isCompared ? "#fff" : "var(--cv-primary)",
//                         border: "1px solid var(--cv-primary)",
//                       }}
//                     >
//                       <svg
//                         className="h-3.5 w-3.5"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth={2.5}
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d={isCompared ? "M5 13l4 4L19 7" : "M12 5v14M5 12h14"}
//                         />
//                       </svg>
//                     </button>
//                   </div>

//                   {/* META LINE: rating · duration · approval */}
//                   <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px]">
//                     {uni.rating > 0 && (
//                       <span
//                         className="inline-flex items-center gap-1 font-semibold"
//                         style={{ color: "var(--cv-neutral-dark)" }}
//                       >
//                         <svg
//                           className="h-3 w-3"
//                           fill="currentColor"
//                           viewBox="0 0 20 20"
//                           style={{ color: "var(--cv-accent)" }}
//                           aria-hidden="true"
//                         >
//                           <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                         </svg>
//                         {uni.rating}
//                       </span>
//                     )}

//                     {uni.duration && (
//                       <span style={{ color: "var(--cv-neutral-mid)" }}>
//                         {uni.duration}
//                       </span>
//                     )}

//                     {approval && (
//                       <span
//                         className="rounded-md px-1.5 py-0.5 text-[10px] font-semibold"
//                         style={{
//                           background: "var(--cv-primary-light)",
//                           color: "var(--cv-primary)",
//                         }}
//                       >
//                         {approval.name || approval.label}
//                         {extraApprovals > 0 && ` +${extraApprovals}`}
//                       </span>
//                     )}

//                     {recommended && (
//                       <span
//                         className="rounded-md px-1.5 py-0.5 text-[10px] font-bold"
//                         style={{ background: "#fef3c7", color: "#92400e" }}
//                       >
//                         Recommended
//                       </span>
//                     )}
//                   </div>

//                   {/* BOTTOM: fee + buttons */}
//                   <div
//                     className="mt-3 border-t pt-3"
//                     style={{ borderColor: "var(--cv-neutral-border)" }}
//                   >
//                     <div className="flex items-end justify-between gap-2">
//                       <div className="min-w-0">
//                         <p
//                           className="text-[10px]"
//                           style={{ color: "var(--cv-neutral-mid)" }}
//                         >
//                           Total fee
//                         </p>
//                         <p
//                           className="text-base font-extrabold leading-tight"
//                           style={{ color: "var(--cv-primary)" }}
//                         >
//                           {uni.courseFees?.total || "Contact Us"}
//                         </p>
//                       </div>

//                       {emi && (
//                         <div
//                           className="flex-shrink-0 rounded-lg px-2.5 py-1 text-right"
//                           style={{
//                             background: "#ecfdf5",
//                             border: "1px solid #a7f3d0",
//                           }}
//                         >
//                           <p
//                             className="text-[9px] font-semibold uppercase tracking-wide"
//                             style={{ color: "#047857" }}
//                           >
//                             EMI from
//                           </p>
//                           <p
//                             className="text-xs font-extrabold leading-tight"
//                             style={{ color: "#065f46" }}
//                           >
//                             {emi}
//                             <span className="text-[9px] font-semibold">/mo</span>
//                           </p>
//                         </div>
//                       )}
//                     </div>

//                     <div
//                       className={`mt-3 grid gap-2 ${
//                         !loggedIn || uni.brochureLink
//                           ? "grid-cols-2"
//                           : "grid-cols-1"
//                       }`}
//                     >
//                       {/* COMPARE button — 3 states */}
//                       {isCompared && selectedUnis.length >= 2 ? (
//                         <button
//                           type="button"
//                           onClick={handleCompareAll}
//                           className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold text-white transition-colors"
//                           style={{ background: "var(--cv-accent)" }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.background =
//                               "var(--cv-accent-dark)")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.background =
//                               "var(--cv-accent)")
//                           }
//                         >
//                           Compare now ({selectedUnis.length})
//                         </button>
//                       ) : (
//                         <button
//                           type="button"
//                           onClick={() => toggleCompare(uniId)}
//                           aria-pressed={isCompared}
//                           className="cursor-pointer whitespace-nowrap rounded-lg px-3 py-2 text-xs font-bold transition-colors"
//                           style={{
//                             background: isCompared
//                               ? "var(--cv-primary-light)"
//                               : "#fff",
//                             color: "var(--cv-primary)",
//                             border: "1px solid var(--cv-primary)",
//                           }}
//                         >
//                           {isCompared ? "✓ Added" : "+ Compare"}
//                         </button>
//                       )}

//                       {/* Apply / Brochure */}
//                       {!loggedIn ? (
//                         <a
//                           href={uni.applyLink || "#"}
//                           className="whitespace-nowrap rounded-lg px-3 py-2 text-center text-xs font-bold text-white transition-colors"
//                           style={{ background: "var(--cv-primary)" }}
//                           onMouseEnter={(e) =>
//                             (e.currentTarget.style.background =
//                               "var(--cv-primary-dark)")
//                           }
//                           onMouseLeave={(e) =>
//                             (e.currentTarget.style.background =
//                               "var(--cv-primary)")
//                           }
//                         >
//                           Apply Now
//                         </a>
//                       ) : (
//                         uni.brochureLink && (
//                           <a
//                             href={uni.brochureLink}
//                             target="_blank"
//                             rel="noreferrer noopener"
//                             className="whitespace-nowrap rounded-lg px-3 py-2 text-center text-xs font-bold transition-colors"
//                             style={{
//                               background: "var(--cv-primary)",
//                               color: "#fff",
//                             }}
//                           >
//                             Brochure
//                           </a>
//                         )
//                       )}
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           {/* VIEW MORE / LESS */}
//           {hasMore && (
//             <div className="mt-6 text-center">
//               <button
//                 type="button"
//                 onClick={() => {
//                   if (showAll) {
//                     setShowAll(false);
//                     document
//                       .getElementById("university-heading")
//                       ?.scrollIntoView({ behavior: "smooth", block: "start" });
//                   } else {
//                     setShowAll(true);
//                   }
//                 }}
//                 className="cursor-pointer rounded-lg px-5 py-2 text-sm font-semibold transition-colors"
//                 style={{
//                   background: "#fff",
//                   border: "1px solid var(--cv-primary)",
//                   color: "var(--cv-primary)",
//                 }}
//               >
//                 {showAll ? "Show less" : `View all ${sorted.length} universities`}
//               </button>
//             </div>
//           )}

//           <p
//             className="mt-5 text-[11px] italic"
//             style={{ color: "var(--cv-neutral-mid)" }}
//           >
//             * Fees and approvals are indicative. Verify with the university
//             before applying.
//           </p>
//         </div>
//       </section>

//       {/* FLOATING COMPARE BAR */}
//       {selectedUnis.length > 0 && (
//         <div
//           className="fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 sm:pb-5 pointer-events-none"
//           style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
//         >
//           <div
//             role="region"
//             aria-label="Compare universities"
//             className="pointer-events-auto relative flex w-full max-w-3xl flex-col gap-3 rounded-2xl bg-white p-3 sm:flex-row sm:items-center sm:gap-4 sm:p-4"
//             style={{
//               border: "1.5px solid var(--cv-primary)",
//               boxShadow: "0 12px 40px rgba(15, 23, 42, 0.25)",
//             }}
//           >
//             {/* Close (cross) button — corner */}
//             <button
//               type="button"
//               onClick={() => setSelectedUnis([])}
//               aria-label="Close compare bar"
//               className="absolute -right-2 -top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-110 active:scale-95"
//               style={{ background: "var(--cv-primary)", border: "2px solid #fff" }}
//             >
//               <svg
//                 className="h-4 w-4"
//                 fill="none"
//                 stroke="currentColor"
//                 strokeWidth={3}
//                 viewBox="0 0 24 24"
//                 aria-hidden="true"
//               >
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
//               </svg>
//             </button>

//             {/* Selected universities */}
//             <div className="min-w-0 flex-1">
//               <p
//                 className="mb-2 text-xs font-bold sm:text-sm"
//                 style={{ color: "var(--cv-primary)" }}
//               >
//                 {selectedUnis.length} of 3 selected
//                 {selectedUnis.length < 2 && (
//                   <span
//                     className="ml-2 font-medium"
//                     style={{ color: "var(--cv-neutral-mid)" }}
//                   >
//                     Add 1 more to compare
//                   </span>
//                 )}
//               </p>

//               <div className="flex flex-wrap gap-2">
//                 {selectedItems.map(({ uni, id }) => (
//                   <span
//                     key={id}
//                     className="inline-flex max-w-full items-center gap-2 rounded-full py-1 pl-1 pr-2 text-xs font-semibold"
//                     style={{
//                       background: "var(--cv-primary-light)",
//                       color: "var(--cv-primary)",
//                     }}
//                   >
//                     <span className="flex h-7 w-7 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
//                       {uni.universityImage ? (
//                         <Image
//                           src={uni.universityImage}
//                           alt=""
//                           width={28}
//                           height={28}
//                           className="h-full w-full object-contain p-0.5"
//                         />
//                       ) : (
//                         <span className="text-xs font-bold">
//                           {uni.name?.charAt(0) || "U"}
//                         </span>
//                       )}
//                     </span>
//                     <span className="max-w-[110px] truncate sm:max-w-[150px]">
//                       {uni.name}
//                     </span>
//                     <button
//                       type="button"
//                       onClick={() => toggleCompare(id)}
//                       aria-label={`Remove ${uni.name}`}
//                       className="flex h-5 w-5 flex-shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors hover:bg-white"
//                     >
//                       <svg
//                         className="h-3 w-3"
//                         fill="none"
//                         stroke="currentColor"
//                         strokeWidth={3}
//                         viewBox="0 0 24 24"
//                         aria-hidden="true"
//                       >
//                         <path
//                           strokeLinecap="round"
//                           strokeLinejoin="round"
//                           d="M6 6l12 12M18 6L6 18"
//                         />
//                       </svg>
//                     </button>
//                   </span>
//                 ))}
//               </div>
//             </div>

//             {/* Actions — equal size */}
//             <div className="grid w-full grid-cols-2 gap-3 sm:w-[300px] sm:flex-shrink-0">
//               <button
//                 type="button"
//                 onClick={() => setSelectedUnis([])}
//                 className="cursor-pointer whitespace-nowrap rounded-xl bg-white px-4 py-3 text-sm font-extrabold transition-colors hover:bg-[var(--cv-primary-light)] sm:text-base"
//                 style={{
//                   color: "var(--cv-primary)",
//                   border: "1.5px solid var(--cv-primary)",
//                 }}
//               >
//                 Clear
//               </button>

//               <button
//                 type="button"
//                 onClick={handleCompareAll}
//                 disabled={selectedUnis.length < 2}
//                 className="cursor-pointer whitespace-nowrap rounded-xl px-4 py-3 text-sm font-extrabold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
//                 style={{
//                   background: "var(--cv-accent)",
//                   border: "1.5px solid var(--cv-accent)",
//                 }}
//               >
//                 Compare now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {showSignup && (
//         <Signup onClose={() => setShowSignup(false)} courseName={courseTitle} />
//       )}
//     </>
//   );
// }


// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import Signup from "@/app/signup/page.jsx";

// /* ═══════════════════════════════════════════════
//    LOGIN CHECK
// ═══════════════════════════════════════════════ */
// const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("accessToken");
// };

// const INITIAL_COUNT = 4;

// export default function UniversityCards({ universities, courseTitle }) {
//   const router = useRouter();
//   const [showSignup, setShowSignup] = useState(false);
//   const [selectedUnis, setSelectedUnis] = useState([]);
//   const [showAll, setShowAll] = useState(false);

//   // LOGIN STATE
//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     if (typeof window === "undefined") return;

//     const check = () => setLoggedIn(!!localStorage.getItem("accessToken"));
//     check();

//     window.addEventListener("storage", check);
//     window.addEventListener("focus", check);
//     return () => {
//       window.removeEventListener("storage", check);
//       window.removeEventListener("focus", check);
//     };
//   }, []);

//   if (!universities || universities.length === 0) {
//     return null;
//   }

//   const sorted = [...universities].sort(
//     (a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)
//   );

//   const visible = showAll ? sorted : sorted.slice(0, INITIAL_COUNT);
//   const hasMore = sorted.length > INITIAL_COUNT;

//   /* ═══════════════════════════════════════════════
//      COMPARE TOGGLE
//   ═══════════════════════════════════════════════ */
//   const toggleCompare = (uniId) => {
//     setSelectedUnis((prev) => {
//       if (prev.includes(uniId)) return prev.filter((id) => id !== uniId);
//       if (prev.length >= 3) {
//         alert("You can compare up to 3 universities at a time.");
//         return prev;
//       }
//       return [...prev, uniId];
//     });
//   };

//   /* ═══════════════════════════════════════════════
//      GO TO COMPARE PAGE
//   ═══════════════════════════════════════════════ */
//   const goToCompare = (ids) => {
//     if (!isLoggedIn()) {
//       setShowSignup(true);
//       return;
//     }
//     router.push(ids ? `/comparedetail?ids=${ids}` : "/comparedetail");
//   };

//   const handleCompareAll = () => {
//     if (selectedUnis.length < 2) {
//       alert("Please select at least 2 universities to compare.");
//       return;
//     }
//     goToCompare(selectedUnis);
//   };

//   return (
//     <>
//       <section
//         aria-labelledby="university-heading"
//         className="w-full py-12 md:py-16 font-sans"
//         style={{ background: "#fff" }}
//       >
//         <div className="py-8 rounded-lg max-w-[1800px] lg:w-[90%] mx-auto px-6">
//           {/* ═══════════════════════════════════════════
//               HEADER
//           ═══════════════════════════════════════════ */}
//           <header className="text-center mb-8 md:mb-10">
//             <h2
//               id="university-heading"
//               className="text-2xl md:text-3xl font-bold leading-tight mb-3"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               Top Universities for {courseTitle || "this Course"}
//             </h2>

//             <div
//               aria-hidden="true"
//               className="w-16 h-1 mx-auto rounded-full"
//               style={{ background: "var(--cv-primary)" }}
//             />

//             <p
//               className="text-xs md:text-sm mt-3 max-w-2xl mx-auto"
//               style={{ color: "var(--cv-neutral-mid)" }}
//             >
//               Compare fees, approvals, and ratings to find the perfect
//               university for your career goals.
//             </p>
//           </header>

//           {/* ═══════════════════════════════════════════
//               CARDS GRID
//           ═══════════════════════════════════════════ */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
//             {visible.map((uni, index) => {
//               const uniId = uni.universityId || uni.slug || index;
//               const isCompared = selectedUnis.includes(uniId);

//               return (
//                 <article
//                   key={uniId}
//                   className="group relative rounded-xl transition-all duration-300 overflow-hidden flex flex-col"
//                   style={{
//                     background: isCompared
//                       ? "linear-gradient(180deg, #f0f7ff 0%, #ffffff 100%)"
//                       : "linear-gradient(180deg, #f8fafc 0%, #ffffff 100%)",
//                     border: isCompared
//                       ? "1px solid var(--cv-primary)"
//                       : "1px solid var(--cv-neutral-border)",
//                     boxShadow: isCompared
//                       ? "0 8px 20px rgba(30, 58, 138, 0.15)"
//                       : "0 2px 8px rgba(15, 23, 42, 0.04)",
//                   }}
//                   onMouseEnter={(e) => {
//                     if (!isCompared) {
//                       e.currentTarget.style.borderColor = "var(--cv-primary)";
//                       e.currentTarget.style.boxShadow =
//                         "0 10px 24px rgba(30, 58, 138, 0.14)";
//                       e.currentTarget.style.transform = "translateY(-2px)";
//                     }
//                   }}
//                   onMouseLeave={(e) => {
//                     if (!isCompared) {
//                       e.currentTarget.style.borderColor =
//                         "var(--cv-neutral-border)";
//                       e.currentTarget.style.boxShadow =
//                         "0 2px 8px rgba(15, 23, 42, 0.04)";
//                       e.currentTarget.style.transform = "translateY(0)";
//                     }
//                   }}
//                 >
//                   {/* ═══════════════════════════════════════
//                       TOP RATED BADGE
//                   ═══════════════════════════════════════ */}
//                   {uni.isTopRated && (
//                     <div className="absolute -top-[1px] -right-[1px] z-10">
//                       <span
//                         className="inline-flex items-center gap-1 text-white text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-bl-xl rounded-tr-xl"
//                         style={{ background: "var(--cv-accent)" }}
//                       >
//                         ⭐ Top Rated
//                       </span>
//                     </div>
//                   )}

//                   {/* ═══════════════════════════════════════
//                       CARD HEADER
//                   ═══════════════════════════════════════ */}
//                   <div
//                     className="p-4"
//                     style={{
//                       background: "rgba(241, 245, 249, 0.6)",
//                       borderBottom: "1px solid var(--cv-neutral-border)",
//                     }}
//                   >
//                     <div className="flex items-start gap-3">
//                       {/* Logo */}
//                       <div
//                         className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 rounded-lg flex items-center justify-center overflow-hidden shadow-sm"
//                         style={{
//                           background: "#fff",
//                           border: "1px solid var(--cv-neutral-border)",
//                         }}
//                       >
//                         {uni.universityImage ? (
//                           <Image
//                             src={uni.universityImage}
//                             alt={uni.name || "University"}
//                             width={56}
//                             height={56}
//                             className="w-full h-full object-contain p-1"
//                           />
//                         ) : (
//                           <span
//                             className="text-lg md:text-xl font-bold"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             {uni.name?.charAt(0) || "U"}
//                           </span>
//                         )}
//                       </div>

//                       {/* Name + Rating */}
//                       <div className="flex-1 min-w-0">
//                         <h3
//                           className="text-sm md:text-[15px] font-bold leading-snug mb-1 line-clamp-2 pr-12"
//                           style={{ color: "var(--cv-primary)" }}
//                         >
//                           {uni.name}
//                         </h3>

//                         {uni.rating > 0 && (
//                           <div className="flex items-center gap-1">
//                             <div className="flex items-center gap-0.5">
//                               {[1, 2, 3, 4, 5].map((star) => (
//                                 <svg
//                                   key={star}
//                                   className="w-3 h-3"
//                                   style={{
//                                     color:
//                                       star <= Math.round(uni.rating)
//                                         ? "var(--cv-accent)"
//                                         : "var(--cv-neutral-border)",
//                                   }}
//                                   fill="currentColor"
//                                   viewBox="0 0 20 20"
//                                   aria-hidden="true"
//                                 >
//                                   <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
//                                 </svg>
//                               ))}
//                             </div>
//                             <span
//                               className="text-[11px] font-semibold"
//                               style={{ color: "var(--cv-neutral-dark)" }}
//                             >
//                               {uni.rating}
//                             </span>
//                           </div>
//                         )}
//                       </div>
//                     </div>

//                     {/* Approvals chips */}
//                     {uni.approvals?.length > 0 && (
//                       <div className="flex flex-wrap gap-1 mt-2.5">
//                         {uni.approvals.slice(0, 2).map((a, i) => (
//                           <span
//                             key={i}
//                             className="inline-flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded shadow-2xs"
//                             style={{
//                               background: "var(--cv-primary-light, #e0f2fe)",
//                               color: "var(--cv-primary)",
//                               border: "1px solid rgba(30, 58, 138, 0.15)",
//                             }}
//                           >
//                             {a.name || a.label}
//                           </span>
//                         ))}
//                         {uni.approvals.length > 2 && (
//                           <span
//                             className="text-[9px] font-semibold px-1 flex items-center"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             +{uni.approvals.length - 2}
//                           </span>
//                         )}
//                       </div>
//                     )}
//                   </div>

//                   {/* ═══════════════════════════════════════
//                       CARD BODY
//                   ═══════════════════════════════════════ */}
//                   <div className="p-4 flex-1 flex flex-col">
//                     {/* Fee */}
//                     <div className="mb-3 p-2.5 rounded-lg" style={{ background: "rgba(255, 255, 255, 0.8)", border: "1px solid var(--cv-neutral-border)" }}>
//                       <p
//                         className="text-[9px] uppercase tracking-widest font-semibold mb-0.5"
//                         style={{ color: "var(--cv-neutral-mid)" }}
//                       >
//                         Total Fee
//                       </p>
//                       <p
//                         className="text-lg md:text-xl font-extrabold"
//                         style={{ color: "var(--cv-primary)" }}
//                       >
//                         {uni.courseFees?.total || "Contact Us"}
//                       </p>

//                       {uni.courseFees?.emiStartsFrom && (
//                         <p
//                           className="text-[10px] font-semibold mt-0.5"
//                           style={{ color: "var(--cv-accent)" }}
//                         >
//                           EMI from {uni.courseFees.emiStartsFrom}
//                         </p>
//                       )}
//                     </div>

//                     {/* Details List Box */}
//                     <div
//                       className="space-y-1.5 mb-3 text-xs p-2.5 rounded-lg"
//                       style={{ background: "#f8fafc", border: "1px solid #f1f5f9" }}
//                     >
//                       {uni.duration && (
//                         <div className="flex justify-between items-center">
//                           <span
//                             className="text-[10px]"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             Duration
//                           </span>
//                           <span
//                             className="font-semibold text-[10px]"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {uni.duration}
//                           </span>
//                         </div>
//                       )}

//                       {uni.courseFees?.perSemester && (
//                         <div className="flex justify-between items-center">
//                           <span
//                             className="text-[10px]"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             Per Sem
//                           </span>
//                           <span
//                             className="font-semibold text-[10px]"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {uni.courseFees.perSemester}
//                           </span>
//                         </div>
//                       )}

//                       {uni.mode && (
//                         <div className="flex justify-between items-center">
//                           <span
//                             className="text-[10px]"
//                             style={{ color: "var(--cv-neutral-mid)" }}
//                           >
//                             Mode
//                           </span>
//                           <span
//                             className="font-semibold text-[10px]"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {uni.mode}
//                           </span>
//                         </div>
//                       )}
//                     </div>

//                     {/* ═══════════════════════════════════════
//                         CTA BUTTONS
//                     ═══════════════════════════════════════ */}
//                     <div
//                       className={`mt-auto grid gap-1.5 ${
//                         !loggedIn && uni.brochureLink
//                           ? "grid-cols-[1fr_auto_auto]"
//                           : !loggedIn
//                           ? "grid-cols-[1fr_auto]"
//                           : uni.brochureLink
//                           ? "grid-cols-[1fr_auto]"
//                           : "grid-cols-1"
//                       }`}
//                     >
//                       {!loggedIn && (
//                         <a
//                           href={uni.applyLink || "#"}
//                           className="text-center text-white text-xs font-bold py-2 px-3 rounded-md transition-all whitespace-nowrap shadow-xs"
//                           style={{ background: "var(--cv-primary)" }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary-dark)";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                           }}
//                         >
//                           Apply Now
//                         </a>
//                       )}

//                       <button
//                         type="button"
//                         onClick={() => toggleCompare(uniId)}
//                         className="text-xs font-bold py-2 px-3 rounded-md transition-all whitespace-nowrap cursor-pointer shadow-xs"
//                         style={{
//                           background: isCompared ? "var(--cv-primary)" : "#fff",
//                           color: isCompared ? "#fff" : "var(--cv-primary)",
//                           border: "1px solid var(--cv-primary)",
//                         }}
//                         onMouseEnter={(e) => {
//                           if (!isCompared) {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                             e.currentTarget.style.color = "#fff";
//                           } else {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary-dark)";
//                             e.currentTarget.style.color = "#fff";
//                           }
//                         }}
//                         onMouseLeave={(e) => {
//                           if (!isCompared) {
//                             e.currentTarget.style.background = "#fff";
//                             e.currentTarget.style.color = "var(--cv-primary)";
//                           } else {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                             e.currentTarget.style.color = "#fff";
//                           }
//                         }}
//                       >
//                         {isCompared ? "✓ Added" : "+ Compare"}
//                       </button>

//                       {uni.brochureLink && (
//                         <a
//                           href={uni.brochureLink}
//                           target="_blank"
//                           rel="noreferrer noopener"
//                           className="flex items-center justify-center w-9 rounded-md transition-colors shadow-xs"
//                           style={{
//                             background: "#fff",
//                             border: "1px solid var(--cv-primary)",
//                             color: "var(--cv-primary)",
//                           }}
//                           onMouseEnter={(e) => {
//                             e.currentTarget.style.background =
//                               "var(--cv-primary)";
//                             e.currentTarget.style.color = "#fff";
//                           }}
//                           onMouseLeave={(e) => {
//                             e.currentTarget.style.background = "#fff";
//                             e.currentTarget.style.color = "var(--cv-primary)";
//                           }}
//                           aria-label="Download Brochure"
//                         >
//                           <svg
//                             className="w-3.5 h-3.5"
//                             fill="none"
//                             stroke="currentColor"
//                             viewBox="0 0 24 24"
//                           >
//                             <path
//                               strokeLinecap="round"
//                               strokeLinejoin="round"
//                               strokeWidth={2}
//                               d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
//                             />
//                           </svg>
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           {/* VIEW MORE BUTTON */}
//           {hasMore && !showAll && (
//             <div className="mt-8 text-center">
//               <button
//                 type="button"
//                 onClick={() => setShowAll(true)}
//                 className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
//                 style={{
//                   background: "#fff",
//                   border: "1px solid var(--cv-primary)",
//                   color: "var(--cv-primary)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background = "var(--cv-primary)";
//                   e.currentTarget.style.color = "#fff";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background = "#fff";
//                   e.currentTarget.style.color = "var(--cv-primary)";
//                 }}
//               >
//                 View More Universities
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M19 9l-7 7-7-7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}

//           {/* SHOW LESS BUTTON */}
//           {hasMore && showAll && (
//             <div className="mt-8 text-center">
//               <button
//                 type="button"
//                 onClick={() => {
//                   setShowAll(false);
//                   document
//                     .getElementById("university-heading")
//                     ?.scrollIntoView({ behavior: "smooth", block: "start" });
//                 }}
//                 className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors cursor-pointer"
//                 style={{
//                   background: "#fff",
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-mid)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.borderColor = "var(--cv-primary)";
//                   e.currentTarget.style.color = "var(--cv-primary)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.borderColor = "var(--cv-neutral-border)";
//                   e.currentTarget.style.color = "var(--cv-neutral-mid)";
//                 }}
//               >
//                 Show Less
//                 <svg
//                   className="w-4 h-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M5 15l7-7 7 7"
//                   />
//                 </svg>
//               </button>
//             </div>
//           )}

//           {/* Footnote */}
//           <div className="mt-6 text-center">
//             <p
//               className="text-[11px] italic"
//               style={{ color: "var(--cv-neutral-mid)" }}
//             >
//               * Fees and approvals are indicative and subject to change. Verify
//               with the university before applying.
//             </p>
//           </div>
//         </div>
//       </section>

//       {/* FLOATING COMPARE BAR */}
//       {selectedUnis.length > 0 && (
//         <div
//           className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-3 max-w-[95vw]"
//           style={{
//             background: "var(--cv-primary)",
//             color: "#fff",
//           }}
//         >
//           <span className="text-xs font-semibold whitespace-nowrap">
//             {selectedUnis.length} selected
//           </span>

//           <button
//             type="button"
//             onClick={() => setSelectedUnis([])}
//             className="text-xs px-3 py-1.5 rounded-full transition-colors cursor-pointer"
//             style={{ background: "rgba(255,255,255,0.2)" }}
//             onMouseEnter={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.3)";
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "rgba(255,255,255,0.2)";
//             }}
//           >
//             Clear
//           </button>

//           <button
//             type="button"
//             onClick={handleCompareAll}
//             disabled={selectedUnis.length < 2}
//             className="text-xs font-semibold px-4 py-1.5 rounded-full transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
//             style={{ background: "var(--cv-accent)" }}
//             onMouseEnter={(e) => {
//               if (selectedUnis.length >= 2) {
//                 e.currentTarget.style.background = "var(--cv-accent-dark)";
//               }
//             }}
//             onMouseLeave={(e) => {
//               e.currentTarget.style.background = "var(--cv-accent)";
//             }}
//           >
//             Compare Now →
//           </button>
//         </div>
//       )}

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

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Signup from "@/app/signup/page.jsx";

/* ═══════════════════════════════════════════════
   LOGIN CHECK
═══════════════════════════════════════════════ */
const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("accessToken");
};

const INITIAL_COUNT = 4;

export default function UniversityCards({
  universities,
  courseTitle,
}) {
  const router = useRouter();

  const [showSignup, setShowSignup] = useState(false);
  const [selectedUnis, setSelectedUnis] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);

  /* ═══════════════════════════════════════════════
     LOGIN STATE
  ═══════════════════════════════════════════════ */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const check = () => {
      setLoggedIn(!!localStorage.getItem("accessToken"));
    };

    check();

    window.addEventListener("storage", check);
    window.addEventListener("focus", check);

    return () => {
      window.removeEventListener("storage", check);
      window.removeEventListener("focus", check);
    };
  }, []);

  /* ═══════════════════════════════════════════════
     EMPTY STATE
  ═══════════════════════════════════════════════ */
  if (!universities || universities.length === 0) {
    return null;
  }

  /* ═══════════════════════════════════════════════
     SORT / DISPLAY
  ═══════════════════════════════════════════════ */
  const sorted = [...universities].sort(
    (a, b) =>
      (a.displayOrder || 0) -
      (b.displayOrder || 0)
  );

  const visible = showAll
    ? sorted
    : sorted.slice(0, INITIAL_COUNT);

  const hasMore = sorted.length > INITIAL_COUNT;

  /* ═══════════════════════════════════════════════
     COMPARE
  ═══════════════════════════════════════════════ */
  const toggleCompare = (uniId) => {
    setSelectedUnis((prev) => {
      if (prev.includes(uniId)) {
        return prev.filter((id) => id !== uniId);
      }

      if (prev.length >= 3) {
        alert(
          "You can compare up to 3 universities at a time."
        );
        return prev;
      }

      return [...prev, uniId];
    });
  };

  /* ═══════════════════════════════════════════════
     GO TO COMPARE
  ═══════════════════════════════════════════════ */
  const goToCompare = (ids) => {
    if (!isLoggedIn()) {
      setShowSignup(true);
      return;
    }

    router.push(
      ids
        ? `/comparedetail?ids=${ids}`
        : "/comparedetail"
    );
  };

  const handleCompareAll = () => {
    if (selectedUnis.length < 2) {
      alert(
        "Please select at least 2 universities to compare."
      );
      return;
    }

    goToCompare(selectedUnis.join(","));
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════
          UNIVERSITY SECTION
      ═══════════════════════════════════════════════ */}
      <section
        aria-labelledby="university-heading"
        className="relative w-full overflow-hidden py-10 md:py-14"
        style={{
          background:
            "linear-gradient(180deg, #F8FAFC 0%, #EFF6FF 45%, #FFFFFF 100%)",
        }}
      >
        {/* Decorative Glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -left-32 -top-32 h-72 w-72 rounded-full blur-3xl"
          style={{
            background:
              "rgba(30, 58, 138, 0.08)",
          }}
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-32 top-10 h-80 w-80 rounded-full blur-3xl"
          style={{
            background:
              "rgba(249, 115, 22, 0.06)",
          }}
        />

        {/* ═══════════════════════════════════════════════
            MAIN CONTAINER
        ═══════════════════════════════════════════════ */}
        <div className="relative z-10 mx-auto w-full max-w-[1380px] px-4 sm:px-5 lg:px-6">

          {/* ═══════════════════════════════════════════════
              HEADER
          ═══════════════════════════════════════════════ */}
          <header className="mx-auto mb-8 max-w-3xl text-center md:mb-10">

            <div className="mb-3 flex justify-center">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-[0.15em]"
                style={{
                  background:
                    "var(--cv-primary-light)",
                  color:
                    "var(--cv-primary)",
                  border:
                    "1px solid rgba(30,58,138,0.10)",
                }}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full"
                  style={{
                    background:
                      "var(--cv-accent)",
                  }}
                />
                Explore Universities
              </span>
            </div>

            <h2
              id="university-heading"
              className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl md:text-4xl"
              style={{
                color:
                  "var(--cv-neutral-dark)",
              }}
            >
              Top Universities for{" "}
              <span className="cv-text-gradient">
                {courseTitle || "this Course"}
              </span>
            </h2>

            <div className="mx-auto mt-4 flex items-center justify-center gap-1.5">
              <span
                className="h-1 w-6 rounded-full"
                style={{
                  background:
                    "var(--cv-primary)",
                }}
              />

              <span
                className="h-1 w-10 rounded-full"
                style={{
                  background:
                    "var(--cv-grad-horizontal)",
                }}
              />

              <span
                className="h-1 w-6 rounded-full"
                style={{
                  background:
                    "var(--cv-accent)",
                }}
              />
            </div>

            <p
              className="mx-auto mt-3 max-w-xl text-xs leading-5 sm:text-sm"
              style={{
                color:
                  "var(--cv-neutral-mid)",
              }}
            >
              Compare fees, approvals, ratings and
              course details to find the right
              university for your career goals.
            </p>

            <div className="mt-4 flex flex-wrap justify-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold shadow-sm"
                style={{
                  color:
                    "var(--cv-neutral-dark)",
                  border:
                    "1px solid var(--cv-neutral-border)",
                }}
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white"
                  style={{
                    background:
                      "var(--cv-primary)",
                  }}
                >
                  ✓
                </span>
                Verified Details
              </span>

              <span
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[9px] font-semibold shadow-sm"
                style={{
                  color:
                    "var(--cv-neutral-dark)",
                  border:
                    "1px solid var(--cv-neutral-border)",
                }}
              >
                <span
                  className="flex h-4 w-4 items-center justify-center rounded-full text-[8px] text-white"
                  style={{
                    background:
                      "var(--cv-accent)",
                  }}
                >
                  ★
                </span>
                Compare Universities
              </span>
            </div>
          </header>

          {/* ═══════════════════════════════════════════════
              CARDS GRID
          ═══════════════════════════════════════════════ */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

            {visible.map((uni, index) => {
              const uniId =
                uni.universityId ||
                uni.slug ||
                index;

              const isCompared =
                selectedUnis.includes(uniId);

              const roundedRating = Math.round(
                Number(uni.rating || 0)
              );

              return (
                <article
                  key={uniId}
                  className={`group relative flex min-w-0 flex-col overflow-visible rounded-xl bg-white transition-all duration-300 ${
                    isCompared
                      ? "ring-2 ring-[var(--cv-primary)]"
                      : ""
                  }`}
                  style={{
                    border: isCompared
                      ? "1px solid var(--cv-primary)"
                      : "1px solid var(--cv-neutral-border)",

                    boxShadow: isCompared
                      ? "0 10px 28px rgba(30,58,138,0.14)"
                      : "0 4px 16px rgba(15,23,42,0.05)",
                  }}
                >
                  {/* Hover Accent */}
                  <div
                    className="absolute left-0 right-0 top-0 z-10 h-[2px] rounded-t-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                    style={{
                      background:
                        "var(--cv-grad-horizontal)",
                    }}
                  />

                  {/* ═══════════════════════════════════════
                      TOP RATED
                      Attached to border without overlap
                  ═══════════════════════════════════════ */}
                  {uni.isTopRated && (
                    <div
                      className="absolute right-3 top-0 z-30"
                      style={{
                        transform:
                          "translateY(-1px)",
                      }}
                    >
                      <span
                        className="inline-flex items-center gap-1 rounded-b-lg px-2.5 py-1 text-[8px] font-bold uppercase tracking-wide text-white"
                        style={{
                          background:
                            "var(--cv-grad-cta)",

                          borderLeft:
                            "1px solid var(--cv-accent-dark)",

                          borderRight:
                            "1px solid var(--cv-accent-dark)",

                          borderBottom:
                            "1px solid var(--cv-accent-dark)",

                          boxShadow:
                            "0 3px 8px rgba(193,83,4,0.18)",
                        }}
                      >
                        <span className="text-[8px]">
                          ★
                        </span>

                        Top Rated
                      </span>
                    </div>
                  )}

                  {/* ═══════════════════════════════════════
                      CARD HEADER
                      Extra top padding ONLY for Top Rated
                  ═══════════════════════════════════════ */}
                  <div
                    className={`relative overflow-hidden rounded-t-xl px-3.5 pb-3.5 ${
                      uni.isTopRated
                        ? "pt-5"
                        : "pt-3.5"
                    }`}
                    style={{
                      background:
                        "linear-gradient(135deg, #FFFFFF 0%, #F8FAFC 100%)",

                      borderBottom:
                        "1px solid var(--cv-neutral-border)",
                    }}
                  >
                    <div className="flex items-start gap-2.5">

                      {/* Logo */}
                      <div
                        className="relative flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm"
                        style={{
                          border:
                            "1px solid var(--cv-neutral-border)",
                        }}
                      >
                        <div
                          className="absolute inset-0 opacity-40"
                          style={{
                            background:
                              "var(--cv-primary-light)",
                          }}
                        />

                        {uni.universityImage ? (
                          <Image
                            src={
                              uni.universityImage
                            }
                            alt={
                              uni.name ||
                              "University"
                            }
                            width={48}
                            height={48}
                            className="relative z-10 h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <span
                            className="relative z-10 text-lg font-extrabold"
                            style={{
                              color:
                                "var(--cv-primary)",
                            }}
                          >
                            {uni.name
                              ?.charAt(0)
                              ?.toUpperCase() ||
                              "U"}
                          </span>
                        )}
                      </div>

                      {/* University Name + Rating */}
                      <div className="min-w-0 flex-1 pt-0.5">

                        <h3
                          className="pr-2 text-[13px] font-bold leading-[18px]"
                          style={{
                            color:
                              "var(--cv-neutral-dark)",
                          }}
                        >
                          {uni.name}
                        </h3>

                        {uni.rating > 0 && (
                          <div className="mt-1.5 flex items-center gap-1.5">
                            <div
                              className="flex items-center gap-0.5 rounded px-1 py-0.5"
                              style={{
                                background:
                                  "var(--cv-accent-light)",
                              }}
                            >
                              {[1, 2, 3, 4, 5].map(
                                (star) => (
                                  <svg
                                    key={star}
                                    className="h-2.5 w-2.5"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    aria-hidden="true"
                                    style={{
                                      color:
                                        star <=
                                        roundedRating
                                          ? "var(--cv-accent)"
                                          : "#CBD5E1",
                                    }}
                                  >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-1.81.588-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                )
                              )}
                            </div>

                            <span
                              className="text-[10px] font-bold"
                              style={{
                                color:
                                  "var(--cv-neutral-dark)",
                              }}
                            >
                              {uni.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Approval Chips */}
                    {uni.approvals?.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {uni.approvals
                          .slice(0, 3)
                          .map((a, i) => (
                            <span
                              key={i}
                              className="inline-flex max-w-full items-center gap-1 rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
                              style={{
                                background:
                                  "var(--cv-primary-light)",
                                color:
                                  "var(--cv-primary)",
                                border:
                                  "1px solid rgba(30,58,138,0.10)",
                              }}
                            >
                              <span className="h-1 w-1 shrink-0 rounded-full bg-current" />

                              <span className="truncate">
                                {a.name ||
                                  a.label}
                              </span>
                            </span>
                          ))}

                        {uni.approvals.length > 3 && (
                          <span
                            className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[8px] font-semibold"
                            style={{
                              background:
                                "var(--cv-neutral-light)",
                              color:
                                "var(--cv-neutral-mid)",
                            }}
                          >
                            +
                            {uni.approvals
                              .length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* ═══════════════════════════════════════
                      CARD BODY
                  ═══════════════════════════════════════ */}
                  <div className="flex flex-1 flex-col rounded-b-xl p-3.5">

                    {/* Fee */}
                    <div
                      className="relative mb-3 overflow-hidden rounded-lg p-3"
                      style={{
                        background:
                          "linear-gradient(135deg, #EFF6FF 0%, #FFFFFF 70%, #FFF7ED 100%)",

                        border:
                          "1px solid var(--cv-neutral-border)",
                      }}
                    >
                      <div
                        className="absolute -right-5 -top-5 h-14 w-14 rounded-full blur-xl"
                        style={{
                          background:
                            "rgba(30,58,138,0.08)",
                        }}
                      />

                      <div className="relative">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className="text-[8px] font-bold uppercase tracking-[0.12em]"
                            style={{
                              color:
                                "var(--cv-neutral-mid)",
                            }}
                          >
                            Total Course Fee
                          </p>

                          <span
                            className="rounded-full px-1.5 py-0.5 text-[7px] font-bold uppercase"
                            style={{
                              background:
                                "var(--cv-accent-light)",
                              color:
                                "var(--cv-accent-dark)",
                            }}
                          >
                            Fee
                          </span>
                        </div>

                        <p
                          className="mt-0.5 text-lg font-extrabold tracking-tight"
                          style={{
                            color:
                              "var(--cv-primary)",
                          }}
                        >
                          {uni.courseFees?.total ||
                            "Contact Us"}
                        </p>

                        {uni.courseFees
                          ?.emiStartsFrom && (
                          <p
                            className="mt-0.5 text-[9px] font-semibold"
                            style={{
                              color:
                                "var(--cv-accent-dark)",
                            }}
                          >
                            EMI from{" "}
                            {
                              uni.courseFees
                                .emiStartsFrom
                            }
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div
                      className="mb-3 overflow-hidden rounded-lg"
                      style={{
                        background:
                          "var(--cv-neutral-light)",

                        border:
                          "1px solid var(--cv-neutral-border)",
                      }}
                    >
                      {uni.duration && (
                        <div
                          className="flex items-center justify-between gap-2 px-2.5 py-2"
                          style={{
                            borderBottom:
                              "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded text-[9px]"
                              style={{
                                background:
                                  "var(--cv-primary-light)",
                                color:
                                  "var(--cv-primary)",
                              }}
                            >
                              ◷
                            </span>

                            <span
                              className="text-[9px]"
                              style={{
                                color:
                                  "var(--cv-neutral-mid)",
                              }}
                            >
                              Duration
                            </span>
                          </div>

                          <span
                            className="text-[9px] font-bold"
                            style={{
                              color:
                                "var(--cv-neutral-dark)",
                            }}
                          >
                            {uni.duration}
                          </span>
                        </div>
                      )}

                      {uni.courseFees
                        ?.perSemester && (
                        <div
                          className="flex items-center justify-between gap-2 px-2.5 py-2"
                          style={{
                            borderBottom:
                              uni.mode
                                ? "1px solid var(--cv-neutral-border)"
                                : "none",
                          }}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded text-[9px] font-bold"
                              style={{
                                background:
                                  "var(--cv-accent-light)",
                                color:
                                  "var(--cv-accent-dark)",
                              }}
                            >
                              ₹
                            </span>

                            <span
                              className="text-[9px]"
                              style={{
                                color:
                                  "var(--cv-neutral-mid)",
                              }}
                            >
                              Per Semester
                            </span>
                          </div>

                          <span
                            className="text-[9px] font-bold"
                            style={{
                              color:
                                "var(--cv-neutral-dark)",
                            }}
                          >
                            {
                              uni.courseFees
                                .perSemester
                            }
                          </span>
                        </div>
                      )}

                      {uni.mode && (
                        <div className="flex items-center justify-between gap-2 px-2.5 py-2">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="flex h-5 w-5 items-center justify-center rounded text-[8px] font-bold"
                              style={{
                                background:
                                  "var(--cv-primary-light)",
                                color:
                                  "var(--cv-primary)",
                              }}
                            >
                              ◉
                            </span>

                            <span
                              className="text-[9px]"
                              style={{
                                color:
                                  "var(--cv-neutral-mid)",
                              }}
                            >
                              Mode
                            </span>
                          </div>

                          <span
                            className="max-w-[55%] truncate text-right text-[9px] font-bold"
                            style={{
                              color:
                                "var(--cv-neutral-dark)",
                            }}
                          >
                            {uni.mode}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ═══════════════════════════════════════
                        ACTIONS
                    ═══════════════════════════════════════ */}
                    <div className="mt-auto flex gap-1.5">

                      {/* Apply */}
                      {!loggedIn && (
                        <a
                          href={
                            uni.applyLink || "#"
                          }
                          className="cv-btn-cta flex min-w-0 flex-1 items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[10px] font-bold"
                        >
                          Apply Now

                          <svg
                            className="h-3 w-3"
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
                      )}

                      {/* Compare */}
                      <button
                        type="button"
                        onClick={() =>
                          toggleCompare(uniId)
                        }
                        className="flex items-center justify-center gap-1 rounded-lg px-2.5 py-2 text-[10px] font-bold transition-all duration-200"
                        style={{
                          flex:
                            loggedIn &&
                            !uni.brochureLink
                              ? "1"
                              : undefined,

                          background: isCompared
                            ? "var(--cv-primary)"
                            : "#FFFFFF",

                          color: isCompared
                            ? "#FFFFFF"
                            : "var(--cv-primary)",

                          border:
                            "1px solid var(--cv-primary)",
                        }}
                      >
                        {isCompared ? (
                          <>
                            <span>✓</span>
                            Added
                          </>
                        ) : (
                          <>
                            <span>＋</span>
                            Compare
                          </>
                        )}
                      </button>

                      {/* Brochure */}
                      {uni.brochureLink && (
                        <a
                          href={
                            uni.brochureLink
                          }
                          target="_blank"
                          rel="noreferrer noopener"
                          className="flex h-[34px] w-[35px] shrink-0 items-center justify-center rounded-lg transition-all duration-200"
                          style={{
                            background:
                              "var(--cv-primary-light)",

                            border:
                              "1px solid rgba(30,58,138,0.12)",

                            color:
                              "var(--cv-primary)",
                          }}
                          aria-label="Download Brochure"
                          title="Download Brochure"
                        >
                          <svg
                            className="h-3.5 w-3.5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Selected Bottom Line */}
                  {isCompared && (
                    <div
                      className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-xl"
                      style={{
                        background:
                          "var(--cv-grad-horizontal)",
                      }}
                    />
                  )}
                </article>
              );
            })}
          </div>

          {/* ═══════════════════════════════════════════════
              VIEW MORE
          ═══════════════════════════════════════════════ */}
          {hasMore && !showAll && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="group inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[11px] font-bold shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
                style={{
                  color:
                    "var(--cv-primary)",
                  border:
                    "1px solid var(--cv-primary)",
                }}
              >
                View More Universities

                <svg
                  className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              SHOW LESS
          ═══════════════════════════════════════════════ */}
          {hasMore && showAll && (
            <div className="mt-8 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setShowAll(false);

                  document
                    .getElementById(
                      "university-heading"
                    )
                    ?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-[11px] font-bold transition-all hover:shadow-sm"
                style={{
                  color:
                    "var(--cv-neutral-mid)",
                  border:
                    "1px solid var(--cv-neutral-border)",
                }}
              >
                Show Less

                <svg
                  className="h-3.5 w-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* ═══════════════════════════════════════════════
              FOOTNOTE
          ═══════════════════════════════════════════════ */}
          <div className="mt-5 text-center">
            <p
              className="text-[9px] leading-4"
              style={{
                color:
                  "var(--cv-neutral-mid)",
              }}
            >
              * Fees, ratings and approvals are
              indicative and subject to change.
              Please verify the latest details with
              the university before applying.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════
          FLOATING COMPARE BAR
      ═══════════════════════════════════════════════ */}
      {selectedUnis.length > 0 && (
        <div className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-20px)] max-w-lg -translate-x-1/2">
          <div
            className="flex items-center justify-between gap-2 rounded-xl p-2 pl-3 shadow-2xl backdrop-blur-xl"
            style={{
              background:
                "rgba(30,58,138,0.97)",

              border:
                "1px solid rgba(255,255,255,0.15)",
            }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <span
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold text-white"
                style={{
                  background:
                    "rgba(255,255,255,0.15)",
                }}
              >
                {selectedUnis.length}
              </span>

              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white">
                  Universities selected
                </p>

                <p className="hidden text-[8px] text-blue-100 sm:block">
                  Select up to 3 universities
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setSelectedUnis([])
                }
                className="rounded-lg px-2 py-1.5 text-[9px] font-semibold text-white hover:bg-white/10"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleCompareAll}
                disabled={
                  selectedUnis.length < 2
                }
                className="rounded-lg px-3 py-1.5 text-[9px] font-bold text-white transition-all disabled:cursor-not-allowed disabled:opacity-40"
                style={{
                  background:
                    "var(--cv-grad-cta)",
                }}
              >
                Compare Now →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════
          SIGNUP MODAL
      ═══════════════════════════════════════════════ */}
      {showSignup && (
        <Signup
          onClose={() =>
            setShowSignup(false)
          }
          courseName={courseTitle}
        />
      )}
    </>
  );
}

