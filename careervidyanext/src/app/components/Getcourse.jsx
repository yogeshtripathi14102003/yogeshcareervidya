// "use client";

// import { useEffect, useState, useMemo, useRef } from "react";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import Script from "next/script";

// const globalCoursesCache = {};

// const CourseCard = ({ course, index }) => {
//   const isClickable = index < 35;

//   return (
//     <Link
//       href={`/course/${course.slug}`}
//       className={`w-full bg-white border-[1px] md:border-2 border-gray-200 rounded-md p-1.5 md:p-2 
//       flex flex-col items-center justify-between h-full transition-all duration-200
//       ${isClickable ? "cursor-pointer hover:border-[#0056B3] hover:shadow-md" : "pointer-events-none opacity-70"}`}
//       aria-label={`Learn more about ${course.name}`}
//     >
//       <div className="flex justify-center mb-1">
//         <Image
//           src={course.courseLogo?.url || "/placeholder.png"}
//           alt={`${course.name} - Professional Online Course`}
//           width={50}
//           height={50}
//           className="object-contain"
//           loading={index < 6 ? "eager" : "lazy"}
//         />
//       </div>

//       <div className="text-center mb-1.5 px-0.5">
//         <h3 className="font-black text-gray-900 text-[7.5px] md:text-[11px] line-clamp-2 leading-tight uppercase">
//           {course.name}
//         </h3>
//       </div>

//       <div className="bg-[#0056B3] cursor-pointer text-white text-[7px] md:text-[10px] py-1 md:py-1.5 w-full rounded-sm text-center uppercase mt-auto">
//         Know More
//       </div>
//     </Link>
//   );
// };

// // ✅ initialCourses should be fetched on the server (see CourseGridSection.jsx)
// // and passed in as a prop. That guarantees the very first HTML response
// // already contains real course cards — Google never sees a loading state.
// // If this component is ever rendered with no initialCourses, it still
// // works correctly; it just fetches on mount like before (graceful fallback).

// export default function CoursesClient({ initialCourses = [] }) {
//   const [courses, setCourses] = useState(initialCourses);
//   const [allCourses, setAllCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   // ✅ ADDED: popup previously had no loading/error feedback — it opened
//   // instantly with an empty grid while fetchAllCourses() was still in
//   // flight, with no indicator either way if the request failed.
//   const [popupLoading, setPopupLoading] = useState(false);
//   const [popupError, setPopupError] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [displayLimit, setDisplayLimit] = useState(24);

//   // ✅ Tracks whether this is the very first render with server-provided
//   // data, so we don't immediately re-fetch and discard what the server
//   // already gave us (which would also cause a brief flash/duplicate call).
//   const isFirstRun = useRef(true);

//   const sidebarItems = [
//     { key: "All", title: "All Courses" },
//     { key: "PG", title: "PG Courses" },
//     { key: "ExecutiveEducation", title: "Executive" },
//     { key: "UG", title: "UG Courses" },
//     { key: "Doctorate", title: "Doctorate" },
//   ];

//   useEffect(() => {
//     const updateLimit = () => setDisplayLimit(window.innerWidth < 768 ? 12 : 24);
//     updateLimit();
//     window.addEventListener("resize", updateLimit);
//     return () => window.removeEventListener("resize", updateLimit);
//   }, []);

//   useEffect(() => {
//     // ✅ Skip the fetch on first mount if we already have server-provided
//     // courses for the default "All" category — avoids a redundant
//     // duplicate network call right after the page loads.
//     if (isFirstRun.current) {
//       isFirstRun.current = false;
//       if (selectedCategory === "All" && initialCourses.length > 0) {
//         return;
//       }
//     }

//     const fetchCourses = async () => {
//       const page = 1;
//       const limit = displayLimit;
//       const cacheKey = `${selectedCategory}_${page}_${limit}`;

//       if (globalCoursesCache[cacheKey]) {
//         setCourses(globalCoursesCache[cacheKey]);
//         return;
//       }

//       setLoading(true);
//       try {
//         const url =
//           selectedCategory === "All"
//             ? `/api/v1/short?page=${page}&limit=${limit}`
//             : `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${limit}`;

//         const res = await api.get(url);
//         const fetchedData = res.data.courses || [];

//         globalCoursesCache[cacheKey] = fetchedData;
//         setCourses(fetchedData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [selectedCategory, displayLimit]);

//   const fetchAllCourses = async () => {
//     // ✅ FIX: popup now shows a loading state while this request is in
//     // flight, and an error message if it fails — previously the popup
//     // opened instantly with an empty grid and no feedback either way.
//     setPopupLoading(true);
//     setPopupError(false);
//     try {
//       const url =
//         selectedCategory === "All"
//           ? `/api/v1/short?limit=1000`
//           : `/api/v1/short?category=${selectedCategory}&limit=1000`;

//       const res = await api.get(url);
//       setAllCourses(res.data.courses || []);
//     } catch (err) {
//       console.error(err);
//       setPopupError(true);
//     } finally {
//       setPopupLoading(false);
//     }
//   };

//   const visibleCourses = useMemo(() => {
//     return [...courses].reverse().slice(0, displayLimit);
//   }, [courses, displayLimit]);

//   const sortedPopupCourses = useMemo(() => {
//     return [...allCourses].reverse();
//   }, [allCourses]);

//   // JSON-LD Structured Data
//   // ✅ FIX: numberOfItems now matches itemListElement's actual count
//   // (visibleCourses.length, not the full courses.length) — a mismatch here
//   // triggers a "numberOfItems doesn't match itemListElement count" warning
//   // in Google's Rich Results Test.
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Job-Oriented Professional Courses",
//     description: "Browse PG, UG, Executive, and Doctorate online courses at CareerVidya",
//     numberOfItems: visibleCourses.length,
//     itemListElement: visibleCourses.map((course, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Course",
//         name: course.name,
//         url: `https://careervidya.in/course/${course.slug}`,
//         image: course.courseLogo?.url || "",
//         provider: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   return (
//     <>
//       <Script
//         id="courses-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <div className="w-full bg-white">
//         <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">

//           {/* ✅ Changed h1 → h2: this is a content SECTION on the homepage,
//               not the page itself. The page-level h1 should live once in
//               the homepage's hero/header area. Using h2 here prevents a
//               duplicate-H1 issue, which hurts Google's ability to tell
//               what the page is actually about. */}
//           <header className="mb-6 md:mb-10 text-center">
//             <h2 className="text-xl md:text-3xl font-black text-[#0056B3] uppercase">
//               Job-Oriented Professional Courses
//             </h2>
//             <p className="mt-1 text-gray-500 text-[10px] md:text-sm italic">
//               Empowering your future with CareerVidya
//             </p>
//           </header>

//           {/* CATEGORY */}
//           <nav aria-label="Course categories" className="block lg:hidden mb-6">
//             <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => setSelectedCategory(item.key)}
//                   aria-pressed={selectedCategory === item.key}
//                   className={`px-4 py-1.5 text-[10px] cursor-pointer font-black border-2 rounded-full whitespace-nowrap
//                   ${
//                     selectedCategory === item.key
//                       ? "bg-[#0056B3] text-white"
//                       : "bg-white text-black border-gray-300"
//                   }`}
//                 >
//                   {item.title}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           <main className="flex flex-col items-center">
//             <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6 w-full ${loading ? "opacity-50" : ""}`}>
//               {visibleCourses.map((course, index) => (
//                 <CourseCard key={course._id || index} course={course} index={index} />
//               ))}
//             </div>

//             {loading && <div className="mt-4 text-[#0056B3] font-bold">Updating...</div>}

//             {!loading && courses.length >= displayLimit && (
//               <button
//                 onClick={() => {
//                   setIsPopupOpen(true);
//                   fetchAllCourses();
//                 }}
//                 className="mt-10 bg-[#c15304] cursor-pointer text-white font-black py-3 px-10 rounded-lg uppercase text-[10px] md:text-sm"
//               >
//                 Explore Full Catalog
//               </button>
//             )}
//           </main>

//           {/* POPUP */}
//           {isPopupOpen && (
//             <div
//               className="fixed inset-0 z-[100] flex items-center justify-center p-2"
//               role="dialog"
//               aria-modal="true"
//               aria-label="Full Course Catalog"
//             >
//               <div
//                 className="absolute inset-0 bg-black/70"
//                 onClick={() => setIsPopupOpen(false)}
//               />
//               <div className="relative bg-white w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col rounded-lg">

//                 <div className="flex justify-between p-4 border-b">
//                   <h2 className="font-black text-[#0056B3] uppercase">
//                     {selectedCategory} Programs
//                   </h2>
//                   <button onClick={() => setIsPopupOpen(false)} aria-label="Close catalog">
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
//                   {/* ✅ ADDED: loading / error feedback so the popup never
//                       just shows a blank grid with no explanation. */}
//                   {popupLoading && (
//                     <div className="text-center text-[#0056B3] font-bold py-10">
//                       Loading courses...
//                     </div>
//                   )}

//                   {!popupLoading && popupError && (
//                     <div className="text-center text-red-600 font-bold py-10">
//                       Couldn't load courses. Please try again.
//                     </div>
//                   )}

//                   {!popupLoading && !popupError && (
//                     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//                       {sortedPopupCourses.map((course, index) => (
//                         <CourseCard key={course._id || index} course={course} index={index} />
//                       ))}
//                     </div>
//                   )}
//                 </div>

//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </>
//   );
// }




// "use client";

// import { useEffect, useState, useMemo, useRef } from "react";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import Script from "next/script";

// const globalCoursesCache = {};

// const CourseCard = ({ course, index }) => {
//   const isClickable = index < 35;

//   // First 3 courses will have TRENDING label
//   const isTrending = index < 3;

//   // Special redirect courses
//   const specialRedirectCourses = [
//     "btech-for-working-professional",
//     "mtech-for-working-professionals",
//     "diploma-for-working-professionals",
    
//   ];

//   // Only these two courses will redirect to
//   // continuing-education-programs
//   const courseHref = specialRedirectCourses.includes(course.slug)
//     ? "/continuing-education-programs"
//     : `/course/${course.slug}`;

//   return (
//     <div className="relative w-full h-full">
//       {/* TRENDING LABEL - ONLY FIRST 2 CARDS */}
//       {isTrending && (
//         <div
//           className="absolute z-10 -top-2 left-1/2 -translate-x-1/2 
//           bg-white px-2 text-[7px] md:text-[9px] font-black 
//           text-[#c15304] uppercase tracking-wide whitespace-nowrap"
//         >
//           TRENDING
//         </div>
//       )}

//       <Link
//         href={courseHref}
//         className={`w-full bg-white border-[1px] md:border-2 
//         ${
//           isTrending
//             ? "border-[#c15304]"
//             : "border-gray-200"
//         }
//         rounded-md p-1.5 md:p-2 
//         flex flex-col items-center justify-between h-full 
//         transition-all duration-200
//         ${
//           isClickable
//             ? "cursor-pointer hover:border-[#0056B3] hover:shadow-md"
//             : "pointer-events-none opacity-70"
//         }`}
//         aria-label={`Learn more about ${course.name}`}
//       >
//         <div className="flex justify-center mb-1">
//           <Image
//             src={course.courseLogo?.url || "/placeholder.png"}
//             alt={`${course.name} - Professional Online Course`}
//             width={50}
//             height={50}
//             className="object-contain"
//             loading={index < 6 ? "eager" : "lazy"}
//           />
//         </div>

//         <div className="text-center mb-1.5 px-0.5">
//           <h3 className="font-black text-gray-900 text-[7.5px] md:text-[11px] line-clamp-2 leading-tight uppercase">
//             {course.name}
//           </h3>
//         </div>

//         <div className="bg-[#0056B3] cursor-pointer text-white text-[7px] md:text-[10px] py-1 md:py-1.5 w-full rounded-sm text-center uppercase mt-auto">
//           Know More
//         </div>
//       </Link>
//     </div>
//   );
// };

// // initialCourses should be fetched on the server (see CourseGridSection.jsx)
// // and passed in as a prop. That guarantees the very first HTML response
// // already contains real course cards — Google never sees a loading state.
// // If this component is ever rendered with no initialCourses, it still
// // works correctly; it just fetches on mount like before.

// export default function CoursesClient({ initialCourses = [] }) {
//   const [courses, setCourses] = useState(initialCourses);
//   const [allCourses, setAllCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Popup loading/error state
//   const [popupLoading, setPopupLoading] = useState(false);
//   const [popupError, setPopupError] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [displayLimit, setDisplayLimit] = useState(24);

//   // Tracks whether this is the very first render with server-provided data
//   const isFirstRun = useRef(true);

//   const sidebarItems = [
//     { key: "All", title: "All Courses" },
//     { key: "PG", title: "PG Courses" },
//     { key: "ExecutiveEducation", title: "Executive" },
//     { key: "UG", title: "UG Courses" },
//     { key: "Doctorate", title: "Doctorate" },
//   ];

//   useEffect(() => {
//     const updateLimit = () =>
//       setDisplayLimit(window.innerWidth < 768 ? 12 : 24);

//     updateLimit();

//     window.addEventListener("resize", updateLimit);

//     return () => window.removeEventListener("resize", updateLimit);
//   }, []);

//   useEffect(() => {
//     // Skip fetch on first mount if server already provided courses
//     if (isFirstRun.current) {
//       isFirstRun.current = false;

//       if (selectedCategory === "All" && initialCourses.length > 0) {
//         return;
//       }
//     }

//     const fetchCourses = async () => {
//       const page = 1;
//       const limit = displayLimit;
//       const cacheKey = `${selectedCategory}_${page}_${limit}`;

//       if (globalCoursesCache[cacheKey]) {
//         setCourses(globalCoursesCache[cacheKey]);
//         return;
//       }

//       setLoading(true);

//       try {
//         const url =
//           selectedCategory === "All"
//             ? `/api/v1/short?page=${page}&limit=${limit}`
//             : `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${limit}`;

//         const res = await api.get(url);
//         const fetchedData = res.data.courses || [];

//         globalCoursesCache[cacheKey] = fetchedData;
//         setCourses(fetchedData);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [selectedCategory, displayLimit]);

//   const fetchAllCourses = async () => {
//     setPopupLoading(true);
//     setPopupError(false);

//     try {
//       const url =
//         selectedCategory === "All"
//           ? `/api/v1/short?limit=1000`
//           : `/api/v1/short?category=${selectedCategory}&limit=1000`;

//       const res = await api.get(url);

//       setAllCourses(res.data.courses || []);
//     } catch (err) {
//       console.error(err);
//       setPopupError(true);
//     } finally {
//       setPopupLoading(false);
//     }
//   };

//   // Keep original API/database order
//   const visibleCourses = useMemo(() => {
//     return courses.slice(0, displayLimit);
//   }, [courses, displayLimit]);

//   // Keep original API/database order in popup
//   const sortedPopupCourses = useMemo(() => {
//     return allCourses;
//   }, [allCourses]);

//   // JSON-LD Structured Data
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Job-Oriented Professional Courses",
//     description:
//       "Browse PG, UG, Executive, and Doctorate online courses at CareerVidya",
//     numberOfItems: visibleCourses.length,

//     itemListElement: visibleCourses.map((course, i) => ({
//       "@type": "ListItem",
//       position: i + 1,

//       item: {
//         "@type": "Course",
//         name: course.name,
//         url: `https://careervidya.in/course/${course.slug}`,
//         image: course.courseLogo?.url || "",

//         provider: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   return (
//     <>
//       <Script
//         id="courses-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(jsonLd),
//         }}
//       />

//       <div className="w-full bg-white">
//         <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">

//           {/* SECTION HEADER */}
//           <header className="mb-6 md:mb-10 text-center">
//             <h2 className="text-xl md:text-3xl font-black text-[#0056B3] uppercase">
//               Job-Oriented Professional Courses
//             </h2>

//             <p className="mt-1 text-gray-500 text-[10px] md:text-sm italic">
//               Empowering your future with CareerVidya
//             </p>
//           </header>

//           {/* CATEGORY */}
//           <nav
//             aria-label="Course categories"
//             className="block lg:hidden mb-6"
//           >
//             <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => setSelectedCategory(item.key)}
//                   aria-pressed={selectedCategory === item.key}
//                   className={`px-4 py-1.5 text-[10px] cursor-pointer font-black border-2 rounded-full whitespace-nowrap
//                   ${
//                     selectedCategory === item.key
//                       ? "bg-[#0056B3] text-white"
//                       : "bg-white text-black border-gray-300"
//                   }`}
//                 >
//                   {item.title}
//                 </button>
//               ))}
//             </div>
//           </nav>

//           <main className="flex flex-col items-center">
//             <div
//               className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6 w-full ${
//                 loading ? "opacity-50" : ""
//               }`}
//             >
//               {visibleCourses.map((course, index) => (
//                 <CourseCard
//                   key={course._id || index}
//                   course={course}
//                   index={index}
//                 />
//               ))}
//             </div>

//             {loading && (
//               <div className="mt-4 text-[#0056B3] font-bold">
//                 Updating...
//               </div>
//             )}

//             {!loading && courses.length >= displayLimit && (
//               <button
//                 onClick={() => {
//                   setIsPopupOpen(true);
//                   fetchAllCourses();
//                 }}
//                 className="mt-10 bg-[#c15304] cursor-pointer text-white font-black py-3 px-10 rounded-lg uppercase text-[10px] md:text-sm"
//               >
//                 Explore Full Catalog
//               </button>
//             )}
//           </main>

//           {/* POPUP */}
//           {isPopupOpen && (
//             <div
//               className="fixed inset-0 z-[100] flex items-center justify-center p-2"
//               role="dialog"
//               aria-modal="true"
//               aria-label="Full Course Catalog"
//             >
//               <div
//                 className="absolute inset-0 bg-black/70"
//                 onClick={() => setIsPopupOpen(false)}
//               />

//               <div className="relative bg-white w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col rounded-lg">

//                 {/* POPUP HEADER */}
//                 <div className="flex justify-between p-4 border-b">
//                   <h2 className="font-black text-[#0056B3] uppercase">
//                     {selectedCategory} Programs
//                   </h2>

//                   <button
//                     onClick={() => setIsPopupOpen(false)}
//                     aria-label="Close catalog"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 {/* POPUP CONTENT */}
//                 <div className="p-4 overflow-y-auto flex-1 bg-gray-50">

//                   {popupLoading && (
//                     <div className="text-center text-[#0056B3] font-bold py-10">
//                       Loading courses...
//                     </div>
//                   )}

//                   {!popupLoading && popupError && (
//                     <div className="text-center text-red-600 font-bold py-10">
//                       Couldn't load courses. Please try again.
//                     </div>
//                   )}

//                   {!popupLoading && !popupError && (
//                     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//                       {sortedPopupCourses.map((course, index) => (
//                         <CourseCard
//                           key={course._id || index}
//                           course={course}
//                           index={index}
//                         />
//                       ))}
//                     </div>
//                   )}

//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// "use client";

// import { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import Script from "next/script";

// // ═══════════════════════════════════════════════════════════
// // CACHE SYSTEM — 3 Level (localStorage + memory + ref)
// // ═══════════════════════════════════════════════════════════

// const CACHE_KEY = "careervidya_courses_cache_v1";
// const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// // In-memory cache (fast access, survives re-renders)
// let memoryCache = {
//   all: null,
//   byCategory: {},
//   timestamp: 0,
// };

// // Load from localStorage on first import
// if (typeof window !== "undefined") {
//   try {
//     const stored = localStorage.getItem(CACHE_KEY);
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       if (Date.now() - parsed.timestamp < CACHE_TTL) {
//         memoryCache = parsed;
//       } else {
//         localStorage.removeItem(CACHE_KEY);
//       }
//     }
//   } catch (e) {
//     console.warn("Cache load failed:", e);
//   }
// }

// // Save to localStorage
// const saveCache = () => {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
//   } catch (e) {
//     console.warn("Cache save failed:", e);
//   }
// };

// // ─── CourseCard ────────────────────────────────────────────────
// const CourseCard = ({ course, index }) => {
//   const isClickable = index < 35;
//   const isTrending = index < 3;

//   const specialRedirectCourses = [
//     "btech-for-working-professional",
//     "mtech-for-working-professionals",
//     "diploma-for-working-professionals",
//   ];

//   const courseHref = specialRedirectCourses.includes(course.slug)
//     ? "/continuing-education-programs"
//     : `/course/${course.slug}`;

//   return (
//     <div className="relative w-full h-full">
//       {isTrending && (
//         <div
//           className="absolute z-10 -top-2 left-1/2 -translate-x-1/2 
//           bg-white px-2 text-[7px] md:text-[9px] font-semibold 
//           uppercase tracking-wide whitespace-nowrap"
//           style={{ color: "#F97316" }}
//         >
//           TRENDING
//         </div>
//       )}

//       <Link
//         href={courseHref}
//         className={`w-full bg-white rounded-md p-1.5 md:p-2 
//         flex flex-col items-center justify-between h-full 
//         transition-all duration-200
//         ${isClickable ? "cursor-pointer" : "pointer-events-none opacity-70"}`}
//         style={{
//           border: isTrending ? "2px solid #F97316" : "1.5px solid #E5E7EB",
//         }}
//         onMouseEnter={(e) => {
//           if (isClickable) {
//             e.currentTarget.style.borderColor = "#1E3A8A";
//             e.currentTarget.style.boxShadow = "0 4px 12px rgba(30,58,138,0.15)";
//           }
//         }}
//         onMouseLeave={(e) => {
//           e.currentTarget.style.borderColor = isTrending ? "#F97316" : "#E5E7EB";
//           e.currentTarget.style.boxShadow = "none";
//         }}
//         aria-label={`Learn more about ${course.name}`}
//       >
//         <div className="flex justify-center mb-1">
//           <Image
//             src={course.courseLogo?.url || "/placeholder.png"}
//             alt={`${course.name} - Professional Online Course`}
//             width={50}
//             height={50}
//             className="object-contain"
//             loading={index < 6 ? "eager" : "lazy"}
//           />
//         </div>

//         <div className="text-center mb-1.5 px-0.5">
//           <h3
//             className="font-semibold text-[7.5px] md:text-[11px] line-clamp-2 leading-tight uppercase"
//             style={{ color: "#1E3A8A" }}
//           >
//             {course.name}
//           </h3>
//         </div>

//         <div
//           className="cursor-pointer text-white text-[7px] md:text-[10px] py-1 md:py-1.5 w-full rounded-sm text-center uppercase mt-auto font-medium"
//           style={{ background: "#1E3A8A" }}
//         >
//           Know More
//         </div>
//       </Link>
//     </div>
//   );
// };

// // ─── Priority Courses ──────────────────────────────────────────
// const priorityAfterTrending = [
//   "1-year-online-mba",
//   "online-mba-1",
//   "bba-bachelor-of-business-administration",
//   "online-mca",
//   "online-bca-bachelor-of-computer-applications",
// ];

// const normalizeSlug = (s) => (s || "").toString().trim().toLowerCase();

// // ═══════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════
// export default function CoursesClient({ initialCourses = [] }) {
//   const [courses, setCourses] = useState(initialCourses);
//   const [allCourses, setAllCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [popupLoading, setPopupLoading] = useState(false);
//   const [popupError, setPopupError] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [displayLimit, setDisplayLimit] = useState(24);

//   // ✅ Ref to track whether we've already fetched
//   const hasFetchedRef = useRef(false);
//   const isFirstRun = useRef(true);

//   const sidebarItems = [
//     { key: "All", title: "All Courses" },
//     { key: "PG", title: "PG Courses" },
//     { key: "ExecutiveEducation", title: "Executive" },
//     { key: "UG", title: "UG Courses" },
//     { key: "Doctorate", title: "Doctorate" },
//   ];

//   // ✅ Responsive display limit
//   useEffect(() => {
//     const updateLimit = () => setDisplayLimit(window.innerWidth < 768 ? 12 : 24);
//     updateLimit();
//     window.addEventListener("resize", updateLimit);
//     return () => window.removeEventListener("resize", updateLimit);
//   }, []);

//   // ═══════════════════════════════════════════════════════════
//   // ✅ FETCH — sirf ek baar, cache use karo
//   // ═══════════════════════════════════════════════════════════
//   useEffect(() => {
//     // Check cache first
//     const now = Date.now();
//     const cacheValid = memoryCache.timestamp && now - memoryCache.timestamp < CACHE_TTL;

//     if (cacheValid) {
//       // Use cached data
//       if (selectedCategory === "All" && memoryCache.all) {
//         setCourses(memoryCache.all);
//         return;
//       }
//       if (selectedCategory !== "All" && memoryCache.byCategory[selectedCategory]) {
//         setCourses(memoryCache.byCategory[selectedCategory]);
//         return;
//       }
//     }

//     // If already fetched for this category, skip
//     const cacheKey = selectedCategory;
//     if (hasFetchedRef.current === cacheKey) {
//       return;
//     }
//     hasFetchedRef.current = cacheKey;

//     const isSilentInitialFetch =
//       isFirstRun.current && selectedCategory === "All" && initialCourses.length > 0;
//     isFirstRun.current = false;

//     const fetchCourses = async () => {
//       if (!isSilentInitialFetch) setLoading(true);

//       try {
//         const page = 1;
//         const fetchLimit = 200;

//         const url =
//           selectedCategory === "All"
//             ? `/api/v1/short?page=${page}&limit=${fetchLimit}`
//             : `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${fetchLimit}`;

//         const res = await api.get(url);
//         const fetchedData = res.data.courses || [];

//         // ✅ Save to cache
//         memoryCache.timestamp = Date.now();
//         if (selectedCategory === "All") {
//           memoryCache.all = fetchedData;
//         } else {
//           memoryCache.byCategory[selectedCategory] = fetchedData;
//         }
//         saveCache();

//         setCourses(fetchedData);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [selectedCategory, displayLimit, initialCourses]);

//   // ═══════════════════════════════════════════════════════════
//   // ✅ POPUP — fetch all courses (only when popup opens)
//   // ═══════════════════════════════════════════════════════════
//   const fetchAllCourses = useCallback(async () => {
//     // If already cached, use it
//     if (allCourses.length > 0) return;

//     setPopupLoading(true);
//     setPopupError(false);

//     try {
//       const url =
//         selectedCategory === "All"
//           ? `/api/v1/short?limit=1000`
//           : `/api/v1/short?category=${selectedCategory}&limit=1000`;

//       const res = await api.get(url);
//       setAllCourses(res.data.courses || []);
//     } catch (err) {
//       console.error(err);
//       setPopupError(true);
//     } finally {
//       setPopupLoading(false);
//     }
//   }, [selectedCategory, allCourses.length]);

//   // ═══════════════════════════════════════════════════════════
//   // ✅ VISIBLE COURSES — sorted + priority pinned
//   // ═══════════════════════════════════════════════════════════
//   const visibleCourses = useMemo(() => {
//     const all = [...courses];

//     const picked = [];
//     priorityAfterTrending.forEach((slug) => {
//       const idx = all.findIndex(
//         (c) => normalizeSlug(c.slug) === normalizeSlug(slug)
//       );
//       if (idx !== -1) {
//         picked.push(all[idx]);
//         all.splice(idx, 1);
//       }
//     });

//     const trending = all.slice(0, 3);

//     const rest = [...all.slice(3)].sort((a, b) => {
//       const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       return aTime - bTime;
//     });

//     const remainingLimit = Math.max(displayLimit - picked.length, 0);
//     const limited = [...trending, ...rest].slice(0, remainingLimit);

//     limited.splice(3, 0, ...picked);

//     return limited;
//   }, [courses, displayLimit]);

//   const sortedPopupCourses = useMemo(() => allCourses, [allCourses]);

//   // ═══════════════════════════════════════════════════════════
//   // JSON-LD
//   // ═══════════════════════════════════════════════════════════
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Job-Oriented Professional Courses",
//     description:
//       "Browse PG, UG, Executive, and Doctorate online courses at CareerVidya",
//     numberOfItems: visibleCourses.length,
//     itemListElement: visibleCourses.map((course, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Course",
//         name: course.name,
//         url: `https://careervidya.in/course/${course.slug}`,
//         image: course.courseLogo?.url || "",
//         provider: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   return (
//     <>
//       <Script
//         id="courses-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <div className="w-full bg-white">
//         <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">

//           {/* HEADER */}
//           <header className="mb-6 md:mb-10 text-center">
//             <h2
//               className="text-xl md:text-3xl font-bold uppercase"
//               style={{ color: "#1E3A8A" }}
//             >
//               Find the Right Course for Your Career
//             </h2>
//             <p
//               className="mt-1 text-[10px] md:text-sm italic"
//               style={{ color: "#64748B" }}
//             >
//               Empowering your future with CareerVidya
//             </p>
//           </header>

//           {/* CATEGORY */}
//           <nav aria-label="Course categories" className="block lg:hidden mb-6">
//             <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
//               {sidebarItems.map((item) => {
//                 const isActive = selectedCategory === item.key;
//                 return (
//                   <button
//                     key={item.key}
//                     onClick={() => setSelectedCategory(item.key)}
//                     aria-pressed={isActive}
//                     className="px-4 py-1.5 text-[10px] cursor-pointer font-semibold border-2 rounded-full whitespace-nowrap transition-all"
//                     style={{
//                       background: isActive ? "#1E3A8A" : "#ffffff",
//                       color: isActive ? "#ffffff" : "#0F172A",
//                       borderColor: isActive ? "#1E3A8A" : "#E5E7EB",
//                     }}
//                   >
//                     {item.title}
//                   </button>
//                 );
//               })}
//             </div>
//           </nav>

//           <main className="flex flex-col items-center">
//             <div
//               className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6 w-full ${
//                 loading ? "opacity-50" : ""
//               }`}
//             >
//               {visibleCourses.map((course, index) => (
//                 <CourseCard
//                   key={course._id || index}
//                   course={course}
//                   index={index}
//                 />
//               ))}
//             </div>

//             {loading && (
//               <div
//                 className="mt-4 font-semibold text-sm"
//                 style={{ color: "#1E3A8A" }}
//               >
//                 Updating...
//               </div>
//             )}

//             {!loading && courses.length >= displayLimit && (
//               <button
//                 onClick={() => {
//                   setIsPopupOpen(true);
//                   fetchAllCourses();
//                 }}
//                 className="mt-10 cursor-pointer text-white font-semibold py-3 px-10 rounded-lg uppercase text-[10px] md:text-sm transition-all duration-200"
//                 style={{
//                   background: "linear-gradient(180deg, #ec7425, #c15304)",
//                 }}
//                 onMouseEnter={(e) => {
//                   e.currentTarget.style.background =
//                     "linear-gradient(180deg, #c15304, #a34203)";
//                   e.currentTarget.style.transform = "translateY(-1px)";
//                 }}
//                 onMouseLeave={(e) => {
//                   e.currentTarget.style.background =
//                     "linear-gradient(180deg, #ec7425, #c15304)";
//                   e.currentTarget.style.transform = "translateY(0)";
//                 }}
//               >
//                 Explore Full Catalog
//               </button>
//             )}
//           </main>

//           {/* POPUP */}
//           {isPopupOpen && (
//             <div
//               className="fixed inset-0 z-[100] flex items-center justify-center p-2"
//               role="dialog"
//               aria-modal="true"
//               aria-label="Full Course Catalog"
//             >
//               <div
//                 className="absolute inset-0 bg-black/70"
//                 onClick={() => setIsPopupOpen(false)}
//               />

//               <div className="relative bg-white w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col rounded-lg">

//                 <div
//                   className="flex justify-between p-4"
//                   style={{ borderBottom: "1px solid #E5E7EB" }}
//                 >
//                   <h2
//                     className="font-bold uppercase"
//                     style={{ color: "#1E3A8A" }}
//                   >
//                     {selectedCategory} Programs
//                   </h2>

//                   <button
//                     onClick={() => setIsPopupOpen(false)}
//                     aria-label="Close catalog"
//                   >
//                     <X className="w-6 h-6" />
//                   </button>
//                 </div>

//                 <div
//                   className="p-4 overflow-y-auto flex-1"
//                   style={{ background: "#F8FAFC" }}
//                 >
//                   {popupLoading && (
//                     <div
//                       className="text-center font-semibold py-10"
//                       style={{ color: "#1E3A8A" }}
//                     >
//                       Loading courses...
//                     </div>
//                   )}

//                   {!popupLoading && popupError && (
//                     <div className="text-center text-red-600 font-semibold py-10">
//                       Couldn't load courses. Please try again.
//                     </div>
//                   )}

//                   {!popupLoading && !popupError && (
//                     <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//                       {sortedPopupCourses.map((course, index) => (
//                         <CourseCard
//                           key={course._id || index}
//                           course={course}
//                           index={index}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }




// "use client";

// import { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import Script from "next/script";

// // ═══════════════════════════════════════════════════════════
// // THEME — change colors ONLY here
// // ═══════════════════════════════════════════════════════════
// const THEME = {
//   "--cv-primary": "#1E3A8A", // headings, buttons, active pill
//   "--cv-accent": "#F97316", // trending / featured / explore button
//   "--cv-soft": "#EFF6FF", // logo circle, popup background
//   "--cv-border": "#E5E7EB",
//   "--cv-text": "#0F172A",
//   "--cv-muted": "#64748B",
// };

// /* Other palettes (copy values above):
//    Teal + Amber   → primary #0F766E, accent #F59E0B, soft #F0FDFA
//    Purple + Pink  → primary #6D28D9, accent #EC4899, soft #F5F3FF
//    Green + Gold   → primary #14532D, accent #CA8A04, soft #F0FDF4
// */

// // ═══════════════════════════════════════════════════════════
// // CACHE SYSTEM — localStorage + memory + ref
// // ═══════════════════════════════════════════════════════════
// const CACHE_KEY = "careervidya_courses_cache_v4";
// const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// let memoryCache = {
//   all: null,
//   byCategory: {},
//   timestamp: 0,
// };

// if (typeof window !== "undefined") {
//   try {
//     const stored = localStorage.getItem(CACHE_KEY);
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       if (Date.now() - parsed.timestamp < CACHE_TTL) {
//         memoryCache = { all: null, byCategory: {}, ...parsed };
//       } else {
//         localStorage.removeItem(CACHE_KEY);
//       }
//     }
//   } catch (e) {
//     console.warn("Cache load failed:", e);
//   }
// }

// const saveCache = () => {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
//   } catch (e) {
//     console.warn("Cache save failed:", e);
//   }
// };

// // ═══════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════
// const WORKING_SLUGS = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// const priorityAfterTrending = [
//   "1-year-online-mba",
//   "online-mba-1",
//   "bba-bachelor-of-business-administration",
//   "online-mca",
//   "online-bca-bachelor-of-computer-applications",
// ];

// const sidebarItems = [
//   { key: "All", title: "All Courses" },
//   { key: "PG", title: "PG Courses" },
//   { key: "UG", title: "UG Courses" },
//   { key: "Diploma", title: "Diploma" },
//   { key: "WorkingProfessional", title: "Working Professionals" },
//   { key: "ExecutiveEducation", title: "Executive" },
//   { key: "Doctorate", title: "Doctorate" },
// ];

// const ROWS = 3;

// const normalizeSlug = (s) => (s || "").toString().trim().toLowerCase();

// // ═══════════════════════════════════════════════════════════
// // CARDS
// // ═══════════════════════════════════════════════════════════

// // Shared card shell: used by CourseCard and the static featured card
// const CardShell = ({
//   href,
//   label,
//   badge,
//   highlighted,
//   disabled,
//   imageSrc,
//   imageAlt,
//   title,
//   eager,
// }) => (
//   <div className="relative h-full w-full">
//     {badge && (
//       <span
//         className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap
//         rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide
//         text-white shadow md:text-[10px]"
//         style={{ background: "var(--cv-accent)" }}
//       >
//         {badge}
//       </span>
//     )}

//     <Link
//       href={href}
//       aria-label={label}
//       className={`group flex h-full w-full flex-col items-center justify-between
//       rounded-xl border bg-white p-2 shadow-sm transition-all duration-200
//       hover:-translate-y-1 hover:shadow-lg md:p-3
//       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
//       ${disabled ? "pointer-events-none opacity-70" : ""}`}
//       style={{
//         borderColor: highlighted ? "var(--cv-accent)" : "var(--cv-border)",
//         borderWidth: highlighted ? 2 : 1,
//         outlineColor: "var(--cv-primary)",
//       }}
//     >
//       {/* Logo inside a soft circle */}
//       <div
//         className="mb-2 flex h-12 w-12 items-center justify-center rounded-full md:h-16 md:w-16"
//         style={{ background: "var(--cv-soft)" }}
//       >
//         <Image
//           src={imageSrc}
//           alt={imageAlt}
//           width={44}
//           height={44}
//           className="object-contain"
//           loading={eager ? "eager" : "lazy"}
//         />
//       </div>

//       {/* Title */}
//       <h3
//         className="mb-2 line-clamp-2 px-0.5 text-center text-[9px] font-semibold
//         uppercase leading-tight md:text-xs"
//         style={{ color: "var(--cv-primary)" }}
//       >
//         {title}
//       </h3>

//       {/* Button */}
//       <span
//         className="mt-auto w-full rounded-md py-1 text-center text-[8px] font-semibold
//         uppercase text-white transition duration-200 group-hover:brightness-125
//         md:py-1.5 md:text-[11px]"
//         style={{ background: "var(--cv-primary)" }}
//       >
//         Know More →
//       </span>
//     </Link>
//   </div>
// );

// const CourseCard = ({ course, index, isGlobalTrending }) => (
//   <CardShell
//     href={`/course/${course.slug}`}
//     label={`Learn more about ${course.name}`}
//     badge={isGlobalTrending ? "🔥 Trending" : null}
//     highlighted={isGlobalTrending}
//     disabled={index >= 35}
//     imageSrc={course.courseLogo?.url || "/placeholder.png"}
//     imageAlt={`${course.name} Professional Online Course`}
//     title={course.name}
//     eager={index < 6}
//   />
// );

// const StaticContinuingEducationCard = () => (
//   <CardShell
//     href="/continuing-education-programs"
//     label="Continuing Education Programs for Working Professionals"
//     badge="Featured"
//     highlighted
//     imageSrc="/images/continuing-education-programs.png"
//     imageAlt="Continuing Education Programs"
//     title="Continuing Education Programs (Working Professionals)"
//     eager
//   />
// );

// // ═══════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════
// export default function CoursesClient({ initialCourses = [] }) {
//   const [courses, setCourses] = useState(initialCourses);
//   const [allCourses, setAllCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [popupLoading, setPopupLoading] = useState(false);
//   const [popupError, setPopupError] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);

//   // Number of grid columns for the current screen (matches Tailwind classes below)
//   const [cols, setCols] = useState(6);

//   const fetchedCategoriesRef = useRef(new Set());
//   const isFirstRun = useRef(true);

//   // Detect columns: <768 → 3, <1024 → 4, else 6
//   useEffect(() => {
//     const handleResize = () => {
//       const w = window.innerWidth;
//       setCols(w < 768 ? 3 : w < 1024 ? 4 : 6);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Fetch courses for the selected category (with cache)
//   useEffect(() => {
//     const now = Date.now();
//     const cacheValid = memoryCache.timestamp && now - memoryCache.timestamp < CACHE_TTL;

//     if (cacheValid) {
//       if (selectedCategory === "All" && memoryCache.all) {
//         setCourses(memoryCache.all);
//         return;
//       }
//       if (selectedCategory !== "All" && memoryCache.byCategory[selectedCategory]) {
//         setCourses(memoryCache.byCategory[selectedCategory]);
//         return;
//       }
//     }

//     if (fetchedCategoriesRef.current.has(selectedCategory)) {
//       return;
//     }
//     fetchedCategoriesRef.current.add(selectedCategory);

//     const isSilentInitialFetch =
//       isFirstRun.current && selectedCategory === "All" && initialCourses.length > 0;
//     isFirstRun.current = false;

//     const fetchCourses = async () => {
//       if (!isSilentInitialFetch) setLoading(true);

//       try {
//         const page = 1;
//         const fetchLimit = 200;

//         let url = `/api/v1/short?page=${page}&limit=${fetchLimit}`;
//         if (selectedCategory !== "All" && selectedCategory !== "WorkingProfessional") {
//           url = `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${fetchLimit}`;
//         }

//         const res = await api.get(url);
//         let fetchedData = res.data.courses || [];

//         if (selectedCategory === "WorkingProfessional") {
//           fetchedData = fetchedData.filter((c) =>
//             WORKING_SLUGS.includes(normalizeSlug(c.slug))
//           );
//         }

//         memoryCache.timestamp = Date.now();
//         if (selectedCategory === "All") {
//           memoryCache.all = fetchedData;
//         } else {
//           memoryCache.byCategory[selectedCategory] = fetchedData;
//         }
//         saveCache();

//         setCourses(fetchedData);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [selectedCategory, initialCourses]);

//   // Load full catalog for the popup
//   const fetchAllCourses = useCallback(async () => {
//     if (allCourses.length > 0) return;

//     setPopupLoading(true);
//     setPopupError(false);

//     try {
//       let url = `/api/v1/short?limit=1000`;
//       if (selectedCategory !== "All" && selectedCategory !== "WorkingProfessional") {
//         url = `/api/v1/short?category=${selectedCategory}&limit=1000`;
//       }

//       const res = await api.get(url);
//       let fetchedData = res.data.courses || [];

//       if (selectedCategory === "WorkingProfessional") {
//         fetchedData = fetchedData.filter((c) =>
//           WORKING_SLUGS.includes(normalizeSlug(c.slug))
//         );
//       }

//       setAllCourses(fetchedData);
//     } catch (err) {
//       console.error(err);
//       setPopupError(true);
//     } finally {
//       setPopupLoading(false);
//     }
//   }, [selectedCategory, allCourses.length]);

//   const handleCategoryChange = (key) => {
//     setSelectedCategory(key);
//     setAllCourses([]); // bug fix: popup must not show the previous category's courses
//     setPopupError(false);
//   };

//   const sortedCourses = useMemo(() => {
//     const all = [...courses];

//     if (selectedCategory === "WorkingProfessional") {
//       return all;
//     }

//     const workingProfCourses = [];
//     WORKING_SLUGS.forEach((slug) => {
//       const idx = all.findIndex((c) => normalizeSlug(c.slug) === normalizeSlug(slug));
//       if (idx !== -1) {
//         workingProfCourses.push(all[idx]);
//         all.splice(idx, 1);
//       }
//     });

//     const picked = [];
//     priorityAfterTrending.forEach((slug) => {
//       const idx = all.findIndex((c) => normalizeSlug(c.slug) === normalizeSlug(slug));
//       if (idx !== -1) {
//         picked.push(all[idx]);
//         all.splice(idx, 1);
//       }
//     });

//     const trending = all.slice(0, 3);

//     const rest = [...all.slice(3)].sort((a, b) => {
//       const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       return aTime - bTime;
//     });

//     const fullList = [...trending, ...rest];
//     fullList.splice(3, 0, ...picked);
//     fullList.unshift(...workingProfCourses);

//     return fullList;
//   }, [courses, selectedCategory]);

//   // 3 full rows: (cols × 3) slots, minus 1 for the static featured card
//   const maxApiCoursesLimit = cols * ROWS - 1;
//   const visibleCourses = sortedCourses.slice(0, maxApiCoursesLimit);

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Job-Oriented Professional Courses",
//     description: "Browse PG, UG, Executive, and Doctorate online courses at CareerVidya",
//     numberOfItems: visibleCourses.length,
//     itemListElement: visibleCourses.map((course, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Course",
//         name: course.name,
//         url: `https://careervidya.in/course/${course.slug}`,
//         image: course.courseLogo?.url || "",
//         provider: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   return (
//     <>
//       <Script
//         id="courses-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <div className="w-full bg-white" style={THEME}>
//         <div className="mx-auto max-w-7xl px-2 py-6 md:px-6 md:py-10">
//           {/* HEADER */}
//           <header className="mb-6 text-center md:mb-10">
//             <h2
//               className="text-xl font-bold uppercase md:text-3xl"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               Find the Right Course for Your Career
//             </h2>
//             <p
//               className="mt-1 text-[10px] italic md:text-sm"
//               style={{ color: "var(--cv-muted)" }}
//             >
//               Empowering your future with CareerVidya
//             </p>
//           </header>

//           {/* CATEGORY NAV */}
//           <nav aria-label="Course categories" className="mb-6">
//             <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-3 lg:justify-center">
//               {sidebarItems.map((item) => {
//                 const isActive = selectedCategory === item.key;
//                 return (
//                   <button
//                     key={item.key}
//                     onClick={() => handleCategoryChange(item.key)}
//                     aria-pressed={isActive}
//                     className="cursor-pointer whitespace-nowrap rounded-full border-2 px-4 py-1.5
//                     text-[10px] font-semibold transition-all hover:shadow-md md:text-xs"
//                     style={{
//                       background: isActive ? "var(--cv-primary)" : "#ffffff",
//                       color: isActive ? "#ffffff" : "var(--cv-text)",
//                       borderColor: isActive ? "var(--cv-primary)" : "var(--cv-border)",
//                     }}
//                   >
//                     {item.title}
//                   </button>
//                 );
//               })}
//             </div>
//           </nav>

//           <main className="flex flex-col items-center">
//             {/* Exactly 3 rows grid */}
//             <div
//               className={`grid w-full grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-4 md:gap-x-6 md:gap-y-7 lg:grid-cols-6 ${
//                 loading ? "opacity-50" : ""
//               }`}
//             >
//               <StaticContinuingEducationCard />

//               {visibleCourses.map((course, index) => {
//                 const isGlobalTrending = selectedCategory === "All" && index <= 2;

//                 return (
//                   <CourseCard
//                     key={course._id || index}
//                     course={course}
//                     index={index}
//                     isGlobalTrending={isGlobalTrending}
//                   />
//                 );
//               })}
//             </div>

//             {loading && (
//               <div
//                 className="mt-4 text-sm font-semibold"
//                 style={{ color: "var(--cv-primary)" }}
//               >
//                 Updating...
//               </div>
//             )}

//             {/* EXPLORE FULL CATALOG BUTTON */}
//             {!loading && selectedCategory !== "WorkingProfessional" && (
//               <button
//                 onClick={() => {
//                   setIsPopupOpen(true);
//                   fetchAllCourses();
//                 }}
//                 className="mt-8 cursor-pointer rounded-lg px-8 py-2.5 text-[10px] font-semibold
//                 uppercase text-white shadow-md transition-all duration-200
//                 hover:-translate-y-0.5 hover:shadow-lg md:text-sm"
//                 style={{
//                   background:
//                     "linear-gradient(180deg, var(--cv-accent), color-mix(in srgb, var(--cv-accent) 70%, black))",
//                 }}
//               >
//                 Explore Full Catalog
//               </button>
//             )}
//           </main>

//           {/* POPUP */}
//           {isPopupOpen && (
//             <div
//               className="fixed inset-0 z-[100] flex items-center justify-center p-2"
//               role="dialog"
//               aria-modal="true"
//               aria-label="Full Course Catalog"
//             >
//               <div
//                 className="absolute inset-0 bg-black/70"
//                 onClick={() => setIsPopupOpen(false)}
//               />

//               <div className="relative flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white">
//                 <div
//                   className="flex justify-between p-4"
//                   style={{ borderBottom: "1px solid var(--cv-border)" }}
//                 >
//                   <h2 className="font-bold uppercase" style={{ color: "var(--cv-primary)" }}>
//                     {selectedCategory} Programs
//                   </h2>

//                   <button onClick={() => setIsPopupOpen(false)} aria-label="Close catalog">
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>

//                 <div
//                   className="flex-1 overflow-y-auto p-4"
//                   style={{ background: "var(--cv-soft)" }}
//                 >
//                   {popupLoading && (
//                     <div
//                       className="py-10 text-center font-semibold"
//                       style={{ color: "var(--cv-primary)" }}
//                     >
//                       Loading courses...
//                     </div>
//                   )}

//                   {!popupLoading && popupError && (
//                     <div className="py-10 text-center font-semibold text-red-600">
//                       Couldn't load courses. Please try again.
//                     </div>
//                   )}

//                   {!popupLoading && !popupError && (
//                     <div className="grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-4 lg:grid-cols-6">
//                       {allCourses.map((course, index) => (
//                         <CourseCard
//                           key={course._id || index}
//                           course={course}
//                           index={index}
//                           isGlobalTrending={false}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }


// "use client";

// import { useEffect, useState, useMemo, useRef, useCallback } from "react";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import Script from "next/script";

// // ═══════════════════════════════════════════════════════════
// // THEME — change colors ONLY here
// // ═══════════════════════════════════════════════════════════
// const THEME = {
//   "--cv-primary": "#1E3A8A", // headings, buttons, active pill
//   "--cv-accent": "#F97316", // trending / featured / explore button
//   "--cv-soft": "#EFF6FF", // logo circle, popup background
//   "--cv-border": "#E5E7EB",
//   "--cv-text": "#0F172A",
//   "--cv-muted": "#64748B",
// };

// /* Other palettes (copy values above):
//    Teal + Amber   → primary #0F766E, accent #F59E0B, soft #F0FDFA
//    Purple + Pink  → primary #6D28D9, accent #EC4899, soft #F5F3FF
//    Green + Gold   → primary #14532D, accent #CA8A04, soft #F0FDF4
// */

// // ═══════════════════════════════════════════════════════════
// // CACHE SYSTEM — localStorage + memory + ref
// // ═══════════════════════════════════════════════════════════
// const CACHE_KEY = "careervidya_courses_cache_v4";
// const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

// let memoryCache = {
//   all: null,
//   byCategory: {},
//   timestamp: 0,
// };

// if (typeof window !== "undefined") {
//   try {
//     const stored = localStorage.getItem(CACHE_KEY);
//     if (stored) {
//       const parsed = JSON.parse(stored);
//       if (Date.now() - parsed.timestamp < CACHE_TTL) {
//         memoryCache = { all: null, byCategory: {}, ...parsed };
//       } else {
//         localStorage.removeItem(CACHE_KEY);
//       }
//     }
//   } catch (e) {
//     console.warn("Cache load failed:", e);
//   }
// }

// const saveCache = () => {
//   if (typeof window === "undefined") return;
//   try {
//     localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
//   } catch (e) {
//     console.warn("Cache save failed:", e);
//   }
// };

// // ═══════════════════════════════════════════════════════════
// // CONSTANTS
// // ═══════════════════════════════════════════════════════════
// const WORKING_SLUGS = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// const priorityAfterTrending = [
//   "1-year-online-mba",
//   "online-mba-1",
//   "bba-bachelor-of-business-administration",
//   "online-mca",
//   "online-bca-bachelor-of-computer-applications",
// ];

// const sidebarItems = [
//   { key: "All", title: "All Courses" },
//   { key: "PG", title: "PG Courses" },
//   { key: "UG", title: "UG Courses" },
//   { key: "Diploma", title: "Diploma" },
//   { key: "WorkingProfessional", title: "Working Professionals" },
//   { key: "ExecutiveEducation", title: "Executive" },
//   { key: "Doctorate", title: "Doctorate" },
// ];

// const ROWS = 3;

// const normalizeSlug = (s) => (s || "").toString().trim().toLowerCase();

// // ═══════════════════════════════════════════════════════════
// // CARDS
// // ═══════════════════════════════════════════════════════════

// // Shared card shell: used by CourseCard and the static featured card
// const CardShell = ({
//   href,
//   label,
//   badge,
//   highlighted,
//   disabled,
//   imageSrc,
//   imageAlt,
//   title,
//   eager,
// }) => (
//   <div className="relative h-full w-full">
//     {badge && (
//       <span
//         className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap
//         rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide
//         text-white shadow md:text-[10px]"
//         style={{ background: "var(--cv-accent)" }}
//       >
//         {badge}
//       </span>
//     )}

//     <Link
//       href={href}
//       aria-label={label}
//       className={`group flex h-full w-full flex-col items-center justify-between
//       rounded-xl border bg-white p-2 shadow-sm transition-all duration-200
//       hover:-translate-y-1 hover:shadow-lg md:p-3
//       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
//       ${disabled ? "pointer-events-none opacity-70" : ""}`}
//       style={{
//         borderColor: highlighted ? "var(--cv-accent)" : "var(--cv-border)",
//         borderWidth: highlighted ? 2 : 1,
//         outlineColor: "var(--cv-primary)",
//       }}
//     >
//       {/* Logo inside a soft circle */}
//       <div
//         className="mb-2 flex h-12 w-12 items-center justify-center rounded-full md:h-16 md:w-16"
//         style={{ background: "var(--cv-soft)" }}
//       >
//         <Image
//           src={imageSrc}
//           alt={imageAlt}
//           width={44}
//           height={44}
//           className="object-contain"
//           loading={eager ? "eager" : "lazy"}
//         />
//       </div>

//       {/* Title */}
//       <h3
//         className="mb-2 line-clamp-2 px-0.5 text-center text-[9px] font-semibold
//         uppercase leading-tight md:text-xs"
//         style={{ color: "var(--cv-primary)" }}
//       >
//         {title}
//       </h3>

//       {/* Button */}
//       <span
//         className="mt-auto w-full rounded-md bg-[var(--cv-primary)] py-1 text-center
//         text-[8px] font-semibold uppercase text-white transition-colors duration-200
//         group-hover:bg-[var(--cv-accent)] md:py-1.5 md:text-[11px]"
//       >
//         Know More →
//       </span>
//     </Link>
//   </div>
// );

// const CourseCard = ({ course, index, isGlobalTrending }) => (
//   <CardShell
//     href={`/course/${course.slug}`}
//     label={`Learn more about ${course.name}`}
//     badge={isGlobalTrending ? "🔥 Trending" : null}
//     highlighted={isGlobalTrending}
//     disabled={index >= 35}
//     imageSrc={course.courseLogo?.url || "/placeholder.png"}
//     imageAlt={`${course.name} Professional Online Course`}
//     title={course.name}
//     eager={index < 6}
//   />
// );

// const StaticContinuingEducationCard = () => (
//   <CardShell
//     href="/continuing-education-programs"
//     label="Continuing Education Programs for Working Professionals"
//     badge="Featured"
//     highlighted
//     imageSrc="/images/continuing-education-programs.png"
//     imageAlt="Continuing Education Programs"
//     title="Continuing Education Programs (Working Professionals)"
//     eager
//   />
// );

// // Placeholder card shown while a category is loading
// const SkeletonCard = () => (
//   <div
//     className="flex h-full min-h-[120px] w-full animate-pulse flex-col items-center rounded-xl border bg-white p-2 md:min-h-[150px] md:p-3"
//     style={{ borderColor: "var(--cv-border)" }}
//     aria-hidden="true"
//   >
//     <div
//       className="mb-2 h-12 w-12 rounded-full md:h-16 md:w-16"
//       style={{ background: "var(--cv-soft)" }}
//     />
//     <div className="mb-1 h-2 w-4/5 rounded" style={{ background: "var(--cv-border)" }} />
//     <div className="mb-3 h-2 w-3/5 rounded" style={{ background: "var(--cv-border)" }} />
//     <div className="mt-auto h-5 w-full rounded-md" style={{ background: "var(--cv-border)" }} />
//   </div>
// );

// // ═══════════════════════════════════════════════════════════
// // MAIN COMPONENT
// // ═══════════════════════════════════════════════════════════
// export default function CoursesClient({ initialCourses = [] }) {
//   const [courses, setCourses] = useState(initialCourses);
//   const [allCourses, setAllCourses] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [popupLoading, setPopupLoading] = useState(false);
//   const [popupError, setPopupError] = useState(false);

//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [popupSearch, setPopupSearch] = useState("");

//   // Number of grid columns for the current screen (matches Tailwind classes below)
//   const [cols, setCols] = useState(6);

//   const fetchedCategoriesRef = useRef(new Set());
//   const isFirstRun = useRef(true);

//   // Detect columns: <768 → 3, <1024 → 4, else 6
//   useEffect(() => {
//     const handleResize = () => {
//       const w = window.innerWidth;
//       setCols(w < 768 ? 3 : w < 1024 ? 4 : 6);
//     };
//     handleResize();
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);

//   // Popup: close on Escape + lock background scroll
//   useEffect(() => {
//     if (!isPopupOpen) return;
//     const onKey = (e) => e.key === "Escape" && setIsPopupOpen(false);
//     document.addEventListener("keydown", onKey);
//     const prevOverflow = document.body.style.overflow;
//     document.body.style.overflow = "hidden";
//     return () => {
//       document.removeEventListener("keydown", onKey);
//       document.body.style.overflow = prevOverflow;
//     };
//   }, [isPopupOpen]);

//   // Fetch courses for the selected category (with cache)
//   useEffect(() => {
//     const now = Date.now();
//     const cacheValid = memoryCache.timestamp && now - memoryCache.timestamp < CACHE_TTL;

//     if (cacheValid) {
//       if (selectedCategory === "All" && memoryCache.all) {
//         setCourses(memoryCache.all);
//         return;
//       }
//       if (selectedCategory !== "All" && memoryCache.byCategory[selectedCategory]) {
//         setCourses(memoryCache.byCategory[selectedCategory]);
//         return;
//       }
//     }

//     if (fetchedCategoriesRef.current.has(selectedCategory)) {
//       return;
//     }
//     fetchedCategoriesRef.current.add(selectedCategory);

//     const isSilentInitialFetch =
//       isFirstRun.current && selectedCategory === "All" && initialCourses.length > 0;
//     isFirstRun.current = false;

//     const fetchCourses = async () => {
//       if (!isSilentInitialFetch) setLoading(true);

//       try {
//         const page = 1;
//         const fetchLimit = 200;

//         let url = `/api/v1/short?page=${page}&limit=${fetchLimit}`;
//         if (selectedCategory !== "All" && selectedCategory !== "WorkingProfessional") {
//           url = `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${fetchLimit}`;
//         }

//         const res = await api.get(url);
//         let fetchedData = res.data.courses || [];

//         if (selectedCategory === "WorkingProfessional") {
//           fetchedData = fetchedData.filter((c) =>
//             WORKING_SLUGS.includes(normalizeSlug(c.slug))
//           );
//         }

//         memoryCache.timestamp = Date.now();
//         if (selectedCategory === "All") {
//           memoryCache.all = fetchedData;
//         } else {
//           memoryCache.byCategory[selectedCategory] = fetchedData;
//         }
//         saveCache();

//         setCourses(fetchedData);
//       } catch (err) {
//         console.error("Fetch error:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [selectedCategory, initialCourses]);

//   // Load full catalog for the popup
//   const fetchAllCourses = useCallback(async () => {
//     if (allCourses.length > 0) return;

//     setPopupLoading(true);
//     setPopupError(false);

//     try {
//       let url = `/api/v1/short?limit=1000`;
//       if (selectedCategory !== "All" && selectedCategory !== "WorkingProfessional") {
//         url = `/api/v1/short?category=${selectedCategory}&limit=1000`;
//       }

//       const res = await api.get(url);
//       let fetchedData = res.data.courses || [];

//       if (selectedCategory === "WorkingProfessional") {
//         fetchedData = fetchedData.filter((c) =>
//           WORKING_SLUGS.includes(normalizeSlug(c.slug))
//         );
//       }

//       setAllCourses(fetchedData);
//     } catch (err) {
//       console.error(err);
//       setPopupError(true);
//     } finally {
//       setPopupLoading(false);
//     }
//   }, [selectedCategory, allCourses.length]);

//   const handleCategoryChange = (key) => {
//     setSelectedCategory(key);
//     setAllCourses([]); // bug fix: popup must not show the previous category's courses
//     setPopupError(false);
//   };

//   const sortedCourses = useMemo(() => {
//     const all = [...courses];

//     if (selectedCategory === "WorkingProfessional") {
//       return all;
//     }

//     const workingProfCourses = [];
//     WORKING_SLUGS.forEach((slug) => {
//       const idx = all.findIndex((c) => normalizeSlug(c.slug) === normalizeSlug(slug));
//       if (idx !== -1) {
//         workingProfCourses.push(all[idx]);
//         all.splice(idx, 1);
//       }
//     });

//     const picked = [];
//     priorityAfterTrending.forEach((slug) => {
//       const idx = all.findIndex((c) => normalizeSlug(c.slug) === normalizeSlug(slug));
//       if (idx !== -1) {
//         picked.push(all[idx]);
//         all.splice(idx, 1);
//       }
//     });

//     const trending = all.slice(0, 3);

//     const rest = [...all.slice(3)].sort((a, b) => {
//       const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
//       const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
//       return aTime - bTime;
//     });

//     const fullList = [...trending, ...rest];
//     fullList.splice(3, 0, ...picked);
//     fullList.unshift(...workingProfCourses);

//     return fullList;
//   }, [courses, selectedCategory]);

//   const filteredPopupCourses = useMemo(() => {
//     const q = popupSearch.trim().toLowerCase();
//     if (!q) return allCourses;
//     return allCourses.filter((c) => (c.name || "").toLowerCase().includes(q));
//   }, [allCourses, popupSearch]);

//   // 3 full rows: (cols × 3) slots, minus 1 for the static featured card
//   const maxApiCoursesLimit = cols * ROWS - 1;
//   const visibleCourses = sortedCourses.slice(0, maxApiCoursesLimit);

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "Job-Oriented Professional Courses",
//     description: "Browse PG, UG, Executive, and Doctorate online courses at CareerVidya",
//     numberOfItems: visibleCourses.length,
//     itemListElement: visibleCourses.map((course, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Course",
//         name: course.name,
//         url: `https://careervidya.in/course/${course.slug}`,
//         image: course.courseLogo?.url || "",
//         provider: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   return (
//     <>
//       <Script
//         id="courses-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <div className="w-full bg-white" style={THEME}>
//         <style>{`
//           @keyframes cv-fade { from { opacity: 0 } to { opacity: 1 } }
//           @keyframes cv-pop { from { opacity: 0; transform: translateY(12px) scale(.98) } to { opacity: 1; transform: none } }
//           .cv-fade { animation: cv-fade .35s ease-out }
//           .cv-pop { animation: cv-pop .25s ease-out }
//           @media (prefers-reduced-motion: reduce) { .cv-fade, .cv-pop { animation: none } }
//         `}</style>
//         <div className="mx-auto max-w-7xl px-2 py-6 md:px-6 md:py-10">
//           {/* HEADER */}
//           <header className="mb-6 text-center md:mb-10">
//             <h2
//               className="text-xl font-bold uppercase md:text-3xl"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               Find the Right Course for Your Career
//             </h2>
//             <p
//               className="mt-1 text-[10px] italic md:text-sm"
//               style={{ color: "var(--cv-muted)" }}
//             >
//               Empowering your future with CareerVidya
//             </p>
//             <div
//               className="mx-auto mt-3 h-1 w-14 rounded-full"
//               style={{ background: "var(--cv-accent)" }}
//             />
//           </header>

//           {/* CATEGORY NAV */}
//           <nav aria-label="Course categories" className="mb-6">
//             <div className="scrollbar-hide flex gap-2 overflow-x-auto pb-3 lg:justify-center">
//               {sidebarItems.map((item) => {
//                 const isActive = selectedCategory === item.key;
//                 return (
//                   <button
//                     key={item.key}
//                     onClick={() => handleCategoryChange(item.key)}
//                     aria-pressed={isActive}
//                     className="cursor-pointer whitespace-nowrap rounded-full border-2 px-4 py-1.5
//                     text-[10px] font-semibold transition-all hover:shadow-md md:text-xs"
//                     style={{
//                       background: isActive ? "var(--cv-primary)" : "#ffffff",
//                       color: isActive ? "#ffffff" : "var(--cv-text)",
//                       borderColor: isActive ? "var(--cv-primary)" : "var(--cv-border)",
//                     }}
//                   >
//                     {item.title}
//                   </button>
//                 );
//               })}
//             </div>
//           </nav>

//           <main className="flex flex-col items-center">
//             {/* Exactly 3 rows grid */}
//             <div
//               key={selectedCategory}
//               className="cv-fade grid w-full grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-4 md:gap-x-6 md:gap-y-7 lg:grid-cols-6"
//             >
//               <StaticContinuingEducationCard />

//               {loading
//                 ? Array.from({ length: maxApiCoursesLimit }).map((_, i) => (
//                     <SkeletonCard key={i} />
//                   ))
//                 : visibleCourses.map((course, index) => {
//                 const isGlobalTrending = selectedCategory === "All" && index <= 2;

//                 return (
//                   <CourseCard
//                     key={course._id || index}
//                     course={course}
//                     index={index}
//                     isGlobalTrending={isGlobalTrending}
//                   />
//                 );
//               })}
//             </div>

//             {/* EXPLORE FULL CATALOG BUTTON */}
//             {!loading && selectedCategory !== "WorkingProfessional" && (
//               <button
//                 onClick={() => {
//                   setPopupSearch("");
//                   setIsPopupOpen(true);
//                   fetchAllCourses();
//                 }}
//                 className="mt-8 cursor-pointer rounded-lg px-8 py-2.5 text-[10px] font-semibold
//                 uppercase text-white shadow-md transition-all duration-200
//                 hover:-translate-y-0.5 hover:shadow-lg md:text-sm"
//                 style={{
//                   background:
//                     "linear-gradient(180deg, var(--cv-accent), color-mix(in srgb, var(--cv-accent) 70%, black))",
//                 }}
//               >
//                 Explore Full Catalog
//               </button>
//             )}
//           </main>

//           {/* POPUP */}
//           {isPopupOpen && (
//             <div
//               className="fixed inset-0 z-[100] flex items-center justify-center p-2"
//               role="dialog"
//               aria-modal="true"
//               aria-label="Full Course Catalog"
//             >
//               <div
//                 className="cv-fade absolute inset-0 bg-black/70"
//                 onClick={() => setIsPopupOpen(false)}
//               />

//               <div className="cv-pop relative flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white">
//                 <div
//                   className="flex justify-between p-4"
//                   style={{ borderBottom: "1px solid var(--cv-border)" }}
//                 >
//                   <h2 className="font-bold uppercase" style={{ color: "var(--cv-primary)" }}>
//                     {selectedCategory} Programs
//                   </h2>

//                   <button onClick={() => setIsPopupOpen(false)} aria-label="Close catalog">
//                     <X className="h-6 w-6" />
//                   </button>
//                 </div>

//                 <div
//                   className="px-4 pb-2 pt-3"
//                   style={{ background: "var(--cv-soft)" }}
//                 >
//                   <input
//                     type="search"
//                     value={popupSearch}
//                     onChange={(e) => setPopupSearch(e.target.value)}
//                     placeholder="Search courses..."
//                     aria-label="Search courses"
//                     className="w-full rounded-lg border bg-white px-3 py-2 text-xs outline-none focus:ring-2 md:text-sm"
//                     style={{
//                       borderColor: "var(--cv-border)",
//                       "--tw-ring-color": "var(--cv-primary)",
//                     }}
//                   />
//                   {!popupLoading && !popupError && allCourses.length > 0 && (
//                     <p className="mt-2 text-[10px] md:text-xs" style={{ color: "var(--cv-muted)" }}>
//                       {filteredPopupCourses.length} courses
//                     </p>
//                   )}
//                 </div>

//                 <div
//                   className="flex-1 overflow-y-auto px-4 pb-4 pt-2"
//                   style={{ background: "var(--cv-soft)" }}
//                 >
//                   {popupLoading && (
//                     <div
//                       className="py-10 text-center font-semibold"
//                       style={{ color: "var(--cv-primary)" }}
//                     >
//                       Loading courses...
//                     </div>
//                   )}

//                   {!popupLoading && popupError && (
//                     <div className="py-10 text-center font-semibold text-red-600">
//                       Couldn't load courses. Please try again.
//                     </div>
//                   )}

//                   {!popupLoading && !popupError && filteredPopupCourses.length === 0 && (
//                     <div className="py-10 text-center text-sm" style={{ color: "var(--cv-muted)" }}>
//                       No course found. Try a different keyword.
//                     </div>
//                   )}

//                   {!popupLoading && !popupError && (
//                     <div className="grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-4 lg:grid-cols-6">
//                       {filteredPopupCourses.map((course, index) => (
//                         <CourseCard
//                           key={course._id || index}
//                           course={course}
//                           index={index}
//                           isGlobalTrending={false}
//                         />
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// }




"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import api from "@/utlis/api.js";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

// ═══════════════════════════════════════════════════════════
// THEME — change colors ONLY here
// ═══════════════════════════════════════════════════════════
const THEME = {
  "--cv-primary": "#1E3A8A", // headings, buttons, active pill
  "--cv-accent": "#F97316", // trending / featured / explore button
  "--cv-soft": "#EFF6FF", // logo circle, popup background
  "--cv-border": "#E5E7EB",
  "--cv-text": "#0F172A",
  "--cv-muted": "#64748B",
};

/* Other palettes (copy values above):
   Teal + Amber   → primary #0F766E, accent #F59E0B, soft #F0FDFA
   Purple + Pink  → primary #6D28D9, accent #EC4899, soft #F5F3FF
   Green + Gold   → primary #14532D, accent #CA8A04, soft #F0FDF4
*/

// ═══════════════════════════════════════════════════════════
// CACHE SYSTEM — localStorage + memory + ref
// ═══════════════════════════════════════════════════════════
const CACHE_KEY = "careervidya_courses_cache_v4";
const CACHE_TTL = 1000 * 60 * 30; // 30 minutes

let memoryCache = {
  all: null,
  byCategory: {},
  timestamp: 0,
};

if (typeof window !== "undefined") {
  try {
    const stored = localStorage.getItem(CACHE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Date.now() - parsed.timestamp < CACHE_TTL) {
        memoryCache = { all: null, byCategory: {}, ...parsed };
      } else {
        localStorage.removeItem(CACHE_KEY);
      }
    }
  } catch (e) {
    console.warn("Cache load failed:", e);
  }
}

const saveCache = () => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(memoryCache));
  } catch (e) {
    console.warn("Cache save failed:", e);
  }
};

// ═══════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════
const WORKING_SLUGS = [
  "btech-for-working-professional",
  "mtech-for-working-professionals",
  "diploma-for-working-professionals",
];

const priorityAfterTrending = [
  "1-year-online-mba",
  "online-mba-1",
  "bba-bachelor-of-business-administration",
  "online-mca",
  "online-bca-bachelor-of-computer-applications",
];

const sidebarItems = [
  { key: "All", title: "All Courses" },
  { key: "PG", title: "PG Courses" },
  { key: "UG", title: "UG Courses" },
  { key: "Diploma", title: "Diploma" },
  { key: "WorkingProfessional", title: "Working Professionals" },
  { key: "ExecutiveEducation", title: "Executive" },
];

const ROWS = 3;

const normalizeSlug = (s) => (s || "").toString().trim().toLowerCase();

// ═══════════════════════════════════════════════════════════
// CARDS
// ═══════════════════════════════════════════════════════════

// Shared card shell: used by CourseCard and the static featured card
const CardShell = ({
  href,
  label,
  badge,
  highlighted,
  disabled,
  imageSrc,
  imageAlt,
  title,
  eager,
}) => {
  const tiltRef = useRef(null);

  // Cursor-follow spotlight + slight 3D tilt (desktop with a mouse only)
  const handleMove = (e) => {
    const el = tiltRef.current;
    if (
      !el ||
      !window.matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches
    )
      return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--mx", `${px * 100}%`);
    el.style.setProperty("--my", `${py * 100}%`);
    el.style.transform = `perspective(700px) rotateX(${(0.5 - py) * 8}deg) rotateY(${(px - 0.5) * 8}deg)`;
  };
  const handleLeave = () => {
    if (tiltRef.current) tiltRef.current.style.transform = "";
  };

  return (
    <div
      ref={tiltRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="relative h-full w-full transition-transform duration-150 ease-out will-change-transform"
    >
      {badge && (
        <span
          className="absolute -top-2 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap
          rounded-full px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide
          text-white shadow md:text-[10px]"
          style={{ background: "var(--cv-accent)" }}
        >
          {badge}
        </span>
      )}

      <Link
        href={href}
        aria-label={label}
        className={`group relative flex h-full w-full flex-col items-center justify-between
        overflow-hidden rounded-xl border bg-white p-2 shadow-sm transition-all duration-200
        hover:-translate-y-1 hover:shadow-lg md:p-3
        focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
        ${disabled ? "pointer-events-none opacity-70" : ""}`}
        style={{
          borderColor: highlighted ? "var(--cv-accent)" : "var(--cv-border)",
          borderWidth: highlighted ? 2 : 1,
          outlineColor: "var(--cv-primary)",
        }}
      >
        {/* Spotlight that follows the cursor */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          style={{
            background:
              "radial-gradient(160px circle at var(--mx, 50%) var(--my, 50%), color-mix(in srgb, var(--cv-accent) 22%, transparent), transparent 70%)",
          }}
        />

        {/* Logo inside a soft circle */}
        <div
          className="relative mb-2 flex h-12 w-12 items-center justify-center rounded-full md:h-16 md:w-16"
          style={{ background: "var(--cv-soft)" }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={44}
            height={44}
            className="object-contain"
            loading={eager ? "eager" : "lazy"}
          />
        </div>

        {/* Title */}
        <h3
          className="relative mb-2 line-clamp-2 px-0.5 text-center text-[9px] font-semibold
          uppercase leading-tight md:text-xs"
          style={{ color: "var(--cv-primary)" }}
        >
          {title}
        </h3>

        {/* Button */}
        <span
          className="relative mt-auto w-full rounded-md bg-[var(--cv-primary)] py-1 text-center
          text-[8px] font-semibold uppercase text-white transition-colors duration-200
          group-hover:bg-[var(--cv-accent)] md:py-1.5 md:text-[11px]"
        >
          Know More →
        </span>
      </Link>
    </div>
  );
};

const CourseCard = ({ course, index, isGlobalTrending }) => (
  <CardShell
    href={`/course/${course.slug}`}
    label={`Learn more about ${course.name}`}
    badge={isGlobalTrending ? "🔥 Trending" : null}
    highlighted={isGlobalTrending}
    disabled={index >= 35}
    imageSrc={course.courseLogo?.url || "/placeholder.png"}
    imageAlt={`${course.name} Professional Online Course`}
    title={course.name}
    eager={index < 6}
  />
);

const StaticContinuingEducationCard = () => (
  <CardShell
    href="/continuing-education-programs"
    label="Continuing Education Programs for Working Professionals"
    badge="Featured"
    highlighted
    imageSrc="/images/continuing-education-programs.png"
    imageAlt="Continuing Education Programs"
    title="Continuing Education Programs (Working Professionals)"
    eager
  />
);

// Placeholder card shown while a category is loading
const SkeletonCard = () => (
  <div
    className="flex h-full min-h-[120px] w-full animate-pulse flex-col items-center rounded-xl border bg-white p-2 md:min-h-[150px] md:p-3"
    style={{ borderColor: "var(--cv-border)" }}
    aria-hidden="true"
  >
    <div
      className="mb-2 h-12 w-12 rounded-full md:h-16 md:w-16"
      style={{ background: "var(--cv-soft)" }}
    />
    <div className="mb-1 h-2 w-4/5 rounded" style={{ background: "var(--cv-border)" }} />
    <div className="mb-3 h-2 w-3/5 rounded" style={{ background: "var(--cv-border)" }} />
    <div className="mt-auto h-5 w-full rounded-md" style={{ background: "var(--cv-border)" }} />
  </div>
);

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════
export default function CoursesClient({ initialCourses = [] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [popupLoading, setPopupLoading] = useState(false);
  const [popupError, setPopupError] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupSearch, setPopupSearch] = useState("");

  // Sliding highlight behind the active category pill
  const pillRefs = useRef({});
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false });

  // Number of grid columns for the current screen (matches Tailwind classes below)
  const [cols, setCols] = useState(6);

  const fetchedCategoriesRef = useRef(new Set());
  const isFirstRun = useRef(true);

  // Detect columns: <768 → 3, <1024 → 4, else 6
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setCols(w < 768 ? 3 : w < 1024 ? 4 : 6);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Move the highlight to the active pill (and bring it into view on mobile)
  useEffect(() => {
    const update = () => {
      const el = pillRefs.current[selectedCategory];
      if (el) setPill({ left: el.offsetLeft, width: el.offsetWidth, ready: true });
    };
    update();
    pillRefs.current[selectedCategory]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [selectedCategory, cols]);

  // Popup: close on Escape + lock background scroll
  useEffect(() => {
    if (!isPopupOpen) return;
    const onKey = (e) => e.key === "Escape" && setIsPopupOpen(false);
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isPopupOpen]);

  // Fetch courses for the selected category (with cache)
  useEffect(() => {
    const now = Date.now();
    const cacheValid = memoryCache.timestamp && now - memoryCache.timestamp < CACHE_TTL;

    if (cacheValid) {
      if (selectedCategory === "All" && memoryCache.all) {
        setCourses(memoryCache.all);
        return;
      }
      if (selectedCategory !== "All" && memoryCache.byCategory[selectedCategory]) {
        setCourses(memoryCache.byCategory[selectedCategory]);
        return;
      }
    }

    if (fetchedCategoriesRef.current.has(selectedCategory)) {
      return;
    }
    fetchedCategoriesRef.current.add(selectedCategory);

    const isSilentInitialFetch =
      isFirstRun.current && selectedCategory === "All" && initialCourses.length > 0;
    isFirstRun.current = false;

    const fetchCourses = async () => {
      if (!isSilentInitialFetch) setLoading(true);

      try {
        const page = 1;
        const fetchLimit = 200;

        let url = `/api/v1/short?page=${page}&limit=${fetchLimit}`;
        if (selectedCategory !== "All" && selectedCategory !== "WorkingProfessional") {
          url = `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${fetchLimit}`;
        }

        const res = await api.get(url);
        let fetchedData = res.data.courses || [];

        if (selectedCategory === "WorkingProfessional") {
          fetchedData = fetchedData.filter((c) =>
            WORKING_SLUGS.includes(normalizeSlug(c.slug))
          );
        }

        memoryCache.timestamp = Date.now();
        if (selectedCategory === "All") {
          memoryCache.all = fetchedData;
        } else {
          memoryCache.byCategory[selectedCategory] = fetchedData;
        }
        saveCache();

        setCourses(fetchedData);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, initialCourses]);

  // Load full catalog for the popup
  const fetchAllCourses = useCallback(async () => {
    if (allCourses.length > 0) return;

    setPopupLoading(true);
    setPopupError(false);

    try {
      let url = `/api/v1/short?limit=1000`;
      if (selectedCategory !== "All" && selectedCategory !== "WorkingProfessional") {
        url = `/api/v1/short?category=${selectedCategory}&limit=1000`;
      }

      const res = await api.get(url);
      let fetchedData = res.data.courses || [];

      if (selectedCategory === "WorkingProfessional") {
        fetchedData = fetchedData.filter((c) =>
          WORKING_SLUGS.includes(normalizeSlug(c.slug))
        );
      }

      setAllCourses(fetchedData);
    } catch (err) {
      console.error(err);
      setPopupError(true);
    } finally {
      setPopupLoading(false);
    }
  }, [selectedCategory, allCourses.length]);

  const handleCategoryChange = (key) => {
    setSelectedCategory(key);
    setAllCourses([]); // bug fix: popup must not show the previous category's courses
    setPopupError(false);
  };

  const sortedCourses = useMemo(() => {
    const all = [...courses];

    if (selectedCategory === "WorkingProfessional") {
      return all;
    }

    const workingProfCourses = [];
    WORKING_SLUGS.forEach((slug) => {
      const idx = all.findIndex((c) => normalizeSlug(c.slug) === normalizeSlug(slug));
      if (idx !== -1) {
        workingProfCourses.push(all[idx]);
        all.splice(idx, 1);
      }
    });

    const picked = [];
    priorityAfterTrending.forEach((slug) => {
      const idx = all.findIndex((c) => normalizeSlug(c.slug) === normalizeSlug(slug));
      if (idx !== -1) {
        picked.push(all[idx]);
        all.splice(idx, 1);
      }
    });

    const trending = all.slice(0, 3);

    const rest = [...all.slice(3)].sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return aTime - bTime;
    });

    const fullList = [...trending, ...rest];
    fullList.splice(3, 0, ...picked);
    fullList.unshift(...workingProfCourses);

    return fullList;
  }, [courses, selectedCategory]);

  const filteredPopupCourses = useMemo(() => {
    const q = popupSearch.trim().toLowerCase();
    if (!q) return allCourses;
    return allCourses.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [allCourses, popupSearch]);

  // 3 full rows: (cols × 3) slots, minus 1 for the static featured card
  const maxApiCoursesLimit = cols * ROWS - 1;
  const visibleCourses = sortedCourses.slice(0, maxApiCoursesLimit);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Job-Oriented Professional Courses",
    description: "Browse PG, UG, Executive,  online courses at CareerVidya",
    numberOfItems: visibleCourses.length,
    itemListElement: visibleCourses.map((course, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Course",
        name: course.name,
        url: `https://careervidya.in/course/${course.slug}`,
        image: course.courseLogo?.url || "",
        provider: {
          "@type": "Organization",
          name: "CareerVidya",
        },
      },
    })),
  };

  return (
    <>
      <Script
        id="courses-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="w-full bg-white" style={THEME}>
        <style>{`
          @keyframes cv-fade { from { opacity: 0 } to { opacity: 1 } }
          @keyframes cv-pop { from { opacity: 0; transform: translateY(12px) scale(.98) } to { opacity: 1; transform: none } }
          .cv-fade { animation: cv-fade .35s ease-out }
          .cv-pop { animation: cv-pop .25s ease-out }
          @media (prefers-reduced-motion: reduce) { .cv-fade, .cv-pop { animation: none } }
        `}</style>
        <div className="mx-auto max-w-7xl px-2 py-6 md:px-6 md:py-10">
          {/* HEADER */}
          <header className="mb-6 text-center md:mb-10">
            <h2
              className="text-xl font-bold uppercase md:text-3xl"
              style={{ color: "var(--cv-primary)" }}
            >
              Find the Right Course for Your Career
            </h2>
            <p
              className="mt-1 text-[10px] italic md:text-sm"
              style={{ color: "var(--cv-muted)" }}
            >
              Empowering your future with CareerVidya
            </p>
            <div
              className="mx-auto mt-3 h-1 w-14 rounded-full"
              style={{ background: "var(--cv-accent)" }}
            />
          </header>

          {/* CATEGORY NAV */}
          <nav aria-label="Course categories" className="mb-6">
            <div className="scrollbar-hide flex overflow-x-auto pb-3 lg:justify-center">
              <div className="relative flex w-max gap-2">
                <span
                  aria-hidden="true"
                  className="absolute top-0 h-full rounded-full transition-[left,width] duration-300 ease-out motion-reduce:transition-none"
                  style={{
                    left: pill.left,
                    width: pill.width,
                    background: "var(--cv-primary)",
                    opacity: pill.ready ? 1 : 0,
                  }}
                />
                {sidebarItems.map((item) => {
                  const isActive = selectedCategory === item.key;
                  return (
                    <button
                      key={item.key}
                      ref={(el) => (pillRefs.current[item.key] = el)}
                      onClick={() => handleCategoryChange(item.key)}
                      aria-pressed={isActive}
                      className="relative z-10 cursor-pointer whitespace-nowrap rounded-full border-2 px-4 py-1.5
                      text-[10px] font-semibold transition-colors duration-300 md:text-xs"
                      style={{
                        background: isActive ? "transparent" : "#ffffff",
                        color: isActive ? "#ffffff" : "var(--cv-text)",
                        borderColor: isActive ? "var(--cv-primary)" : "var(--cv-border)",
                      }}
                    >
                      {item.title}
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          <main className="flex flex-col items-center">
            {/* Exactly 3 rows grid */}
            <div
              key={selectedCategory}
              className="cv-fade grid w-full grid-cols-3 gap-x-2 gap-y-4 md:grid-cols-4 md:gap-x-6 md:gap-y-7 lg:grid-cols-6"
            >
              <StaticContinuingEducationCard />

              {loading
                ? Array.from({ length: maxApiCoursesLimit }).map((_, i) => (
                    <SkeletonCard key={i} />
                  ))
                : visibleCourses.map((course, index) => {
                const isGlobalTrending = selectedCategory === "All" && index <= 2;

                return (
                  <CourseCard
                    key={course._id || index}
                    course={course}
                    index={index}
                    isGlobalTrending={isGlobalTrending}
                  />
                );
              })}
            </div>

            {/* EXPLORE FULL CATALOG BUTTON */}
            {!loading && selectedCategory !== "WorkingProfessional" && (
              <button
                onClick={() => {
                  setPopupSearch("");
                  setIsPopupOpen(true);
                  fetchAllCourses();
                }}
                className="mt-8 cursor-pointer rounded-lg px-8 py-2.5 text-[10px] font-semibold
                uppercase text-white shadow-md transition-all duration-200
                hover:-translate-y-0.5 hover:shadow-lg md:text-sm"
                style={{
                  background:
                    "linear-gradient(180deg, var(--cv-accent), color-mix(in srgb, var(--cv-accent) 70%, black))",
                }}
              >
                Explore Full Catalog
              </button>
            )}
          </main>

          {/* POPUP */}
          {isPopupOpen && (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-2"
              role="dialog"
              aria-modal="true"
              aria-label="Full Course Catalog"
            >
              <div
                className="cv-fade absolute inset-0 bg-black/70"
                onClick={() => setIsPopupOpen(false)}
              />

              <div className="cv-pop relative flex max-h-[85vh] w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white">
                <div
                  className="flex justify-between p-4"
                  style={{ borderBottom: "1px solid var(--cv-border)" }}
                >
                  <h2 className="font-bold uppercase" style={{ color: "var(--cv-primary)" }}>
                    {selectedCategory} Programs
                  </h2>

                  <button onClick={() => setIsPopupOpen(false)} aria-label="Close catalog">
                    <X className="h-6 w-6" />
                  </button>
                </div>

                <div
                  className="px-4 pb-2 pt-3"
                  style={{ background: "var(--cv-soft)" }}
                >
                  <input
                    type="search"
                    value={popupSearch}
                    onChange={(e) => setPopupSearch(e.target.value)}
                    placeholder="Search courses..."
                    aria-label="Search courses"
                    className="w-full rounded-lg border bg-white px-3 py-2 text-xs outline-none focus:ring-2 md:text-sm"
                    style={{
                      borderColor: "var(--cv-border)",
                      "--tw-ring-color": "var(--cv-primary)",
                    }}
                  />
                  {!popupLoading && !popupError && allCourses.length > 0 && (
                    <p className="mt-2 text-[10px] md:text-xs" style={{ color: "var(--cv-muted)" }}>
                      {filteredPopupCourses.length} courses
                    </p>
                  )}
                </div>

                <div
                  className="flex-1 overflow-y-auto px-4 pb-4 pt-2"
                  style={{ background: "var(--cv-soft)" }}
                >
                  {popupLoading && (
                    <div
                      className="py-10 text-center font-semibold"
                      style={{ color: "var(--cv-primary)" }}
                    >
                      Loading courses...
                    </div>
                  )}

                  {!popupLoading && popupError && (
                    <div className="py-10 text-center font-semibold text-red-600">
                      Couldn't load courses. Please try again.
                    </div>
                  )}

                  {!popupLoading && !popupError && filteredPopupCourses.length === 0 && (
                    <div className="py-10 text-center text-sm" style={{ color: "var(--cv-muted)" }}>
                      No course found. Try a different keyword.
                    </div>
                  )}

                  {!popupLoading && !popupError && (
                    <div className="grid grid-cols-3 gap-x-3 gap-y-5 md:grid-cols-4 lg:grid-cols-6">
                      {filteredPopupCourses.map((course, index) => (
                        <CourseCard
                          key={course._id || index}
                          course={course}
                          index={index}
                          isGlobalTrending={false}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}