// "use client";

// import { useEffect, useRef, useState } from "react";
// import Link from "next/link";

// export default function CourseStickyNav({
//   sections = [],
//   activeTab = "all",
//   onTabChange = () => {},
//   courseName = "",
//   category = "",
// }) {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [canScrollLeft, setCanScrollLeft] = useState(false);
//   const [canScrollRight, setCanScrollRight] = useState(false);
//   const scrollRef = useRef(null);

//   // Show nav if scrolled past 500px OR a specific tab is active
//   const isVisible = isScrolled || activeTab !== "all";

//   // ============ SHOW AFTER SCROLL ============
//   useEffect(() => {
//     const handleScroll = () => {
//       setIsScrolled(window.scrollY > 500);
//     };
//     handleScroll();
//     window.addEventListener("scroll", handleScroll, { passive: true });
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   // ============ CHECK SCROLL FOR ARROWS ============
//   const checkScroll = () => {
//     const el = scrollRef.current;
//     if (!el) return;
//     setCanScrollLeft(el.scrollLeft > 0);
//     setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
//   };

//   useEffect(() => {
//     checkScroll();
//     const el = scrollRef.current;
//     if (!el) return;
//     el.addEventListener("scroll", checkScroll, { passive: true });
//     window.addEventListener("resize", checkScroll);
//     return () => {
//       el.removeEventListener("scroll", checkScroll);
//       window.removeEventListener("resize", checkScroll);
//     };
//   }, [sections, isVisible]);

//   const scrollBy = (amount) => {
//     scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
//   };

//   // ============ AUTO-SCROLL ACTIVE TAB ============
//   useEffect(() => {
//     if (!isVisible) return;
//     const el = scrollRef.current;
//     if (!el) return;
//     const active = el.querySelector('[data-active="true"]');
//     if (active) {
//       active.scrollIntoView({
//         behavior: "smooth",
//         block: "nearest",
//         inline: "center",
//       });
//     }
//   }, [activeTab, isVisible]);

//   if (!sections.length) return null;

//   const activeSectionLabel =
//     activeTab === "all"
//       ? "Overview"
//       : sections.find((s) => s.id === activeTab)?.label || "";

//   return (
//     <nav
//       aria-label="Course sections navigation"
//       /* ✅ h-0 + overflow-hidden when hidden = NO extra space */
//       className={`sticky top-16 md:top-20 z-30 bg-white transition-all duration-300 ${
//         isVisible
//           ? "border-b border-slate-200 shadow-sm"
//           : "h-0 overflow-hidden border-b-0 pointer-events-none"
//       }`}
//     >
//       <div className="max-w-[1600px] mx-auto">
//         {/* =================================================
//             TABS — Top row
//         ================================================== */}
//         <div className="px-1 sm:px-2 md:px-4">
//           <div className="flex items-center gap-0.5">
//             {/* LEFT ARROW */}
//             <button
//               type="button"
//               aria-label="Scroll left"
//               onClick={() => scrollBy(-200)}
//               disabled={!canScrollLeft}
//               className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
//                 canScrollLeft
//                   ? "text-gray-700 hover:bg-slate-100"
//                   : "text-gray-300 cursor-not-allowed"
//               }`}
//             >
//               <svg
//                 className="w-3.5 h-3.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M15 19l-7-7 7-7"
//                 />
//               </svg>
//             </button>

//             {/* TABS */}
//             <div
//               ref={scrollRef}
//               className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
//               style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
//             >
//               <ul className="flex items-center list-none p-0 m-0">
//                 {/* ALL TAB */}
//                 <li className="flex-shrink-0">
//                   <button
//                     type="button"
//                     data-active={activeTab === "all"}
//                     onClick={() => onTabChange("all")}
//                     className={`relative whitespace-nowrap text-xs sm:text-sm font-medium px-3 sm:px-4 py-3 transition-colors ${
//                       activeTab === "all"
//                         ? "text-[#002147] font-bold"
//                         : "text-gray-600 hover:text-[#002147]"
//                     }`}
//                   >
//                     All
//                     {activeTab === "all" && (
//                       <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#1E90FF] rounded-full" />
//                     )}
//                   </button>
//                 </li>

//                 {/* SECTION TABS */}
//                 {sections.map((section) => {
//                   const isActive = activeTab === section.id;
//                   return (
//                     <li key={section.id} className="flex-shrink-0">
//                       <button
//                         type="button"
//                         data-active={isActive}
//                         onClick={() => onTabChange(section.id)}
//                         className={`relative whitespace-nowrap text-xs sm:text-sm font-medium px-3 sm:px-4 py-3 transition-colors ${
//                           isActive
//                             ? "text-[#002147] font-bold"
//                             : "text-gray-600 hover:text-[#002147]"
//                         }`}
//                       >
//                         {section.label}
//                         {isActive && (
//                           <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#1E90FF] rounded-full" />
//                         )}
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             </div>

//             {/* RIGHT ARROW */}
//             <button
//               type="button"
//               aria-label="Scroll right"
//               onClick={() => scrollBy(200)}
//               disabled={!canScrollRight}
//               className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
//                 canScrollRight
//                   ? "text-gray-700 hover:bg-slate-100"
//                   : "text-gray-300 cursor-not-allowed"
//               }`}
//             >
//               <svg
//                 className="w-3.5 h-3.5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2.5}
//                   d="M9 5l7 7-7 7"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* =================================================
//             BREADCRUMB — Bottom row
//         ================================================== */}
//         <div className="px-3 sm:px-4 md:px-6 py-2 border-t border-slate-100 bg-slate-50/60">
//           <ol className="flex items-center flex-wrap gap-1.5 text-[11px] sm:text-xs list-none p-0 m-0">
//             <li className="flex items-center">
//               <Link
//                 href="/"
//                 className="text-gray-500 hover:text-[#002147] transition-colors flex items-center gap-1"
//               >
//                 <svg
//                   className="w-3 h-3"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
//                   />
//                 </svg>
//                 Home
//               </Link>
//             </li>

//             <li aria-hidden="true" className="text-gray-300">
//               /
//             </li>

//             <li className="flex items-center">
//               <Link
//                 href="/course"
//                 className="text-gray-500 hover:text-[#002147] transition-colors"
//               >
//                 Courses
//               </Link>
//             </li>

//             {category && (
//               <>
//                 <li aria-hidden="true" className="text-gray-300">
//                   /
//                 </li>
//                 <li className="flex items-center">
//                   <Link
//                     href={`/courses?category=${category.toLowerCase()}`}
//                     className="text-gray-500 hover:text-[#002147] transition-colors"
//                   >
//                     {category}
//                   </Link>
//                 </li>
//               </>
//             )}

//             {courseName && (
//               <>
//                 <li aria-hidden="true" className="text-gray-300">
//                   /
//                 </li>
//                 <li className="flex items-center min-w-0">
//                   <span className="text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">
//                     {courseName}
//                   </span>
//                 </li>
//               </>
//             )}

//             {activeSectionLabel && (
//               <>
//                 <li aria-hidden="true" className="text-gray-300">
//                   /
//                 </li>
//                 <li className="flex items-center">
//                   <span
//                     aria-current="page"
//                     className="text-[#002147] font-semibold"
//                   >
//                     {activeSectionLabel}
//                   </span>
//                 </li>
//               </>
//             )}
//           </ol>
//         </div>
//       </div>
//     </nav>
//   );
// }


"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function CourseStickyNav({
  sections = [],
  activeTab = "all",
  onTabChange = () => {},
  courseName = "",
  category = "",
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  const isVisible = isScrolled || activeTab !== "all";

  // ============ SHOW AFTER SCROLL ============
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 500);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ============ CHECK SCROLL FOR ARROWS ============
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [sections, isVisible]);

  const scrollBy = (amount) => {
    scrollRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  };

  // ============ AUTO-SCROLL ACTIVE TAB ============
  useEffect(() => {
    if (!isVisible) return;
    const el = scrollRef.current;
    if (!el) return;
    const active = el.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "center",
      });
    }
  }, [activeTab, isVisible]);

  if (!sections.length) return null;

  const activeSectionLabel =
    activeTab === "all"
      ? "Overview"
      : sections.find((s) => s.id === activeTab)?.label || "";

  return (
    <nav
      aria-label="Course sections navigation"
      className={`sticky top-16 md:top-20 z-30 bg-white transition-all duration-300 ${
        isVisible
          ? "border-b border-slate-200 shadow-sm"
          : "h-0 overflow-hidden border-b-0 pointer-events-none"
      }`}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* =================================================
            TABS — Top row
        ================================================== */}
        <div className="px-1 sm:px-2 md:px-4">
          <div className="flex items-center gap-0.5">
            {/* LEFT ARROW */}
            <button
              type="button"
              aria-label="Scroll left"
              onClick={() => scrollBy(-200)}
              disabled={!canScrollLeft}
              className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                canScrollLeft
                  ? "text-gray-700 hover:bg-slate-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            {/* TABS */}
            <div
              ref={scrollRef}
              className="flex-1 overflow-x-auto [&::-webkit-scrollbar]:hidden"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <ul className="flex items-center list-none p-0 m-0">
                {/* ALL TAB */}
                <li className="flex-shrink-0">
                  <button
                    type="button"
                    data-active={activeTab === "all"}
                    onClick={() => onTabChange("all")}
                    className={`relative whitespace-nowrap text-xs sm:text-sm font-medium px-3 sm:px-4 py-3 transition-colors ${
                      activeTab === "all"
                        ? "text-[#002147] font-bold"
                        : "text-gray-600 hover:text-[#002147]"
                    }`}
                  >
                    All
                    {activeTab === "all" && (
                      <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#1E90FF] rounded-full" />
                    )}
                  </button>
                </li>

                {/* SECTION TABS */}
                {sections.map((section) => {
                  const isActive = activeTab === section.id;
                  return (
                    <li key={section.id} className="flex-shrink-0">
                      <button
                        type="button"
                        data-active={isActive}
                        onClick={() => onTabChange(section.id)}
                        className={`relative whitespace-nowrap text-xs sm:text-sm font-medium px-3 sm:px-4 py-3 transition-colors ${
                          isActive
                            ? "text-[#002147] font-bold"
                            : "text-gray-600 hover:text-[#002147]"
                        }`}
                      >
                        {section.label}
                        {isActive && (
                          <span className="absolute bottom-0 left-2.5 right-2.5 h-0.5 bg-[#1E90FF] rounded-full" />
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* RIGHT ARROW */}
            <button
              type="button"
              aria-label="Scroll right"
              onClick={() => scrollBy(200)}
              disabled={!canScrollRight}
              className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full transition-all ${
                canScrollRight
                  ? "text-gray-700 hover:bg-slate-100"
                  : "text-gray-300 cursor-not-allowed"
              }`}
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* =================================================
            BREADCRUMB — Bottom row
        ================================================== */}
        <div className="px-3 sm:px-4 md:px-6 py-2 border-t border-slate-100 bg-slate-50/60">
          <ol className="flex items-center flex-wrap gap-1.5 text-[11px] sm:text-xs list-none p-0 m-0">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 hover:text-[#002147] transition-colors flex items-center gap-1"
              >
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
            </li>

            <li aria-hidden="true" className="text-gray-300">
              /
            </li>

            <li className="flex items-center">
              <Link
                href="/course"
                className="text-gray-500 hover:text-[#002147] transition-colors"
              >
                Courses
              </Link>
            </li>

            {category && (
              <>
                <li aria-hidden="true" className="text-gray-300">
                  /
                </li>
                <li className="flex items-center">
                  <Link
                    href={`/courses?category=${category.toLowerCase()}`}
                    className="text-gray-500 hover:text-[#002147] transition-colors"
                  >
                    {category}
                  </Link>
                </li>
              </>
            )}

            {courseName && (
              <>
                <li aria-hidden="true" className="text-gray-300">
                  /
                </li>
                <li className="flex items-center min-w-0">
                  <span className="text-gray-500 truncate max-w-[120px] sm:max-w-[200px]">
                    {courseName}
                  </span>
                </li>
              </>
            )}

            {activeSectionLabel && (
              <>
                <li aria-hidden="true" className="text-gray-300">
                  /
                </li>
                <li className="flex items-center">
                  <span
                    aria-current="page"
                    className="text-[#002147] font-semibold"
                  >
                    {activeSectionLabel}
                  </span>
                </li>
              </>
            )}
          </ol>
        </div>
      </div>
    </nav>
  );
}