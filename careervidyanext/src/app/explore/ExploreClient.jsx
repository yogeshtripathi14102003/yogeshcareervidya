




// "use client";

// import { useMemo, useState } from "react";
// import {
//   Search,
//   X,
//   ChevronRight,
//   ChevronDown,
//   GraduationCap,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import Image from "next/image";

// import Header from "../layout/Header";
// import Footer from "../layout/Footer";
// import api from "@/utlis/api.js";

// /* =========================================================
//    SPECIAL COURSE REDIRECTS
// ========================================================= */

// const specialRedirectCourses = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// /* =========================================================
//    BROWSE BY DOMAINS
// ========================================================= */

// const domains = [
//   {
//     key: "PG",
//     title: "PG Courses",
//     subtitle: "After Graduation",
//   },
//   {
//     key: "UG",
//     title: "UG Courses",
//     subtitle: "After 12th",
//   },
//   {
//     key: "Diploma",
//     title: "Diploma Programs",
//     subtitle: "Diploma & Professional Programs",
//   },
//   {
//     key: "Doctorate",
//     title: "Doctorate/Ph.D.",
//     subtitle: "Get Dr. Title (After UG + Work Ex)",
//   },
// ];

// /* =========================================================
//    HELPERS
// ========================================================= */

// const normalizeText = (value) => {
//   if (value === null || value === undefined) {
//     return "";
//   }

//   return String(value).trim();
// };

// /* =========================================================
//    GET COURSE CATEGORY
// ========================================================= */

// const getCourseCategory = (course) => {
//   return normalizeText(
//     course?.category ||
//       course?.courseCategory ||
//       course?.type ||
//       course?.courseType
//   );
// };

// /* =========================================================
//    CATEGORY MATCHING
// ========================================================= */

// const matchesDomain = (course, domain) => {
//   if (!course) return false;

//   const category = getCourseCategory(course)
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

//   const domainKey = domain
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

//   if (domainKey === "pg") {
//     return (
//       category === "pg" ||
//       category === "postgraduate" ||
//       category === "postgraduatecourses"
//     );
//   }

//   if (domainKey === "ug") {
//     return (
//       category === "ug" ||
//       category === "undergraduate" ||
//       category === "undergraduatecourses"
//     );
//   }

//   if (domainKey === "executiveeducation") {
//     return (
//       category === "executiveeducation" ||
//       category === "executive" ||
//       category === "executiveeducationcourses"
//     );
//   }

//   if (domainKey === "doctorate") {
//     return (
//       category === "doctorate" ||
//       category === "phd" ||
//       category === "ph.d." ||
//       category === "doctoral"
//     );
//   }

//   if (domainKey === "engineering") {
//     return (
//       category === "engineering" ||
//       category === "engineeringcourses"
//     );
//   }

//   if (domainKey === "studyabroad") {
//     return (
//       category === "studyabroad" ||
//       category === "study abroad"
//     );
//   }

//   if (domainKey === "skilling") {
//     return (
//       category === "skilling" ||
//       category === "certificate" ||
//       category === "certification" ||
//       category === "skill"
//     );
//   }

//   if (domainKey === "diploma") {
//     return (
//       category === "diploma" ||
//       category === "diplomacourses" ||
//       category === "diplomaprograms"
//     );
//   }

//   if (domainKey === "genai") {
//     const name = normalizeText(
//       course?.name
//     ).toLowerCase();

//     const description = normalizeText(
//       course?.description
//     ).toLowerCase();

//     return (
//       category.includes("genai") ||
//       category.includes("ai") ||
//       name.includes("gen ai") ||
//       name.includes("artificial intelligence") ||
//       name.includes("agentic ai") ||
//       description.includes("gen ai") ||
//       description.includes("agentic ai")
//     );
//   }

//   return false;
// };

// /* =========================================================
//    SPECIALIZATION NAME
// ========================================================= */

// const getSpecializationName = (item) => {
//   if (!item) return "";

//   if (typeof item === "string") {
//     return item.trim();
//   }

//   if (typeof item === "object") {
//     return (
//       normalizeText(item?.name) ||
//       normalizeText(item?.title) ||
//       normalizeText(
//         item?.specializationName
//       ) ||
//       normalizeText(
//         item?.specialization
//       ) ||
//       normalizeText(item?.label) ||
//       ""
//     );
//   }

//   return "";
// };

// /* =========================================================
//    UNIVERSITY ARRAY
// ========================================================= */

// const getUniversitiesArray = (item) => {
//   if (!item) return [];

//   const possibleArrays = [
//     item?.universities,
//     item?.university,
//     item?.universityList,
//     item?.universityIds,
//     item?.universityData,
//   ];

//   for (const value of possibleArrays) {
//     if (Array.isArray(value)) {
//       return value;
//     }
//   }

//   return [];
// };

// /* =========================================================
//    UNIVERSITY COUNT
// ========================================================= */

// const getUniversityCount = (item) => {
//   if (!item) return null;

//   const values = [
//     item?.universityCount,
//     item?.universitiesCount,
//     item?.university_count,
//     item?.universityCountTotal,
//     item?.university_count_total,
//     item?.totalUniversities,
//     item?.totalUniversityCount,
//   ];

//   for (const value of values) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value)
//     ) {
//       return value;
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   const universities =
//     getUniversitiesArray(item);

//   if (universities.length) {
//     return universities.length;
//   }

//   return null;
// };

// /* =========================================================
//    COURSE SPECIALIZATIONS
// ========================================================= */

// const getCourseSpecializations = (
//   course
// ) => {
//   if (!course) return [];

//   const raw =
//     course?.specializations ??
//     course?.specialization ??
//     course?.specializationList ??
//     course?.specializationData ??
//     [];

//   if (!Array.isArray(raw)) {
//     return [];
//   }

//   return raw
//     .map((item) => {
//       if (typeof item === "string") {
//         return {
//           name: item.trim(),
//           universityCount: null,
//           universities: [],
//         };
//       }

//       return {
//         name: getSpecializationName(item),
//         universityCount:
//           getUniversityCount(item),
//         universities:
//           getUniversitiesArray(item),
//       };
//     })
//     .filter((item) => item.name);
// };

// /* =========================================================
//    COURSE UNIVERSITY COUNT
// ========================================================= */

// const getCourseUniversityCount = (
//   course
// ) => {
//   if (!course) return null;

//   const values = [
//     course?.universityCount,
//     course?.universitiesCount,
//     course?.university_count,
//     course?.universityCountTotal,
//     course?.university_count_total,
//     course?.totalUniversities,
//     course?.totalUniversityCount,
//   ];

//   for (const value of values) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value)
//     ) {
//       return value;
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return null;
// };

// /* =========================================================
//    SPECIALIZATION COUNT
// ========================================================= */

// const getSpecializationCount = (
//   course
// ) => {
//   const directValues = [
//     course?.specializationCount,
//     course?.specializationsCount,
//     course?.totalSpecializations,
//   ];

//   for (const value of directValues) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value)
//     ) {
//       return value;
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return getCourseSpecializations(course)
//     .length;
// };

// /* =========================================================
//    COURSE IMAGE
// ========================================================= */

// const getCourseImage = (course) => {
//   return (
//     course?.courseLogo?.url ||
//     course?.courseImageUrl ||
//     course?.imageUrl ||
//     course?.image ||
//     "/placeholder.png"
//   );
// };

// /* =========================================================
//    COURSE LINK
// ========================================================= */

// const getCourseHref = (course) => {
//   if (!course?.slug) {
//     return "/course";
//   }

//   if (
//     specialRedirectCourses.includes(
//       course.slug
//     )
//   ) {
//     return "/continuing-education-programs";
//   }

//   return `/course/${encodeURIComponent(
//     course.slug
//   )}`;
// };

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// export default function ExploreClient({
//   initialData,
// }) {
//   const [search, setSearch] = useState("");

//   const [activeDomain, setActiveDomain] =
//     useState("PG");

//   const [showAllDomains, setShowAllDomains] =
//     useState(false);

//   /* =======================================================
//      COURSES
//   ======================================================= */

//   const {
//     data: courses = [],
//     isLoading: coursesLoading,
//   } = useQuery({
//     queryKey: ["explore-courses"],

//     queryFn: async () => {
//       const response = await api.get(
//         "/api/v1/course"
//       );

//       if (Array.isArray(response.data)) {
//         return response.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.data
//         )
//       ) {
//         return response.data.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.courses
//         )
//       ) {
//         return response.data.courses;
//       }

//       return [];
//     },

//     initialData:
//       initialData?.initialCourses ||
//       undefined,

//     staleTime: 5 * 60 * 1000,
//   });

//   /* =======================================================
//      UNIVERSITIES
//   ======================================================= */

//   const {
//     data: universities = [],
//   } = useQuery({
//     queryKey: ["explore-universities"],

//     queryFn: async () => {
//       const response = await api.get(
//         "/api/v1/university"
//       );

//       if (Array.isArray(response.data)) {
//         return response.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.data
//         )
//       ) {
//         return response.data.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.universities
//         )
//       ) {
//         return response.data.universities;
//       }

//       return [];
//     },

//     initialData:
//       initialData?.initialUnis ||
//       undefined,

//     staleTime: 5 * 60 * 1000,
//   });

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   const normalizedSearch =
//     search.trim().toLowerCase();

//   /* =======================================================
//      DOMAIN COURSES
//   ======================================================= */

//   const domainCourses = useMemo(() => {
//     let list = courses.filter(
//       (course) =>
//         matchesDomain(
//           course,
//           activeDomain
//         )
//     );

//     /*
//      * Fallback:
//      * If backend category names do not exactly
//      * match the selected domain, PG is commonly
//      * returned directly.
//      */
//     if (
//       list.length === 0 &&
//       activeDomain === "PG"
//     ) {
//       list = courses.filter((course) => {
//         const category =
//           getCourseCategory(course)
//             .toLowerCase();

//         return (
//           category === "pg" ||
//           category.includes("post")
//         );
//       });
//     }

//     return list;
//   }, [
//     courses,
//     activeDomain,
//   ]);

//   /* =======================================================
//      SEARCHED COURSES
//   ======================================================= */

//   const filteredCourses = useMemo(() => {
//     if (!normalizedSearch) {
//       return domainCourses;
//     }

//     return domainCourses.filter(
//       (course) => {
//         const courseName =
//           normalizeText(
//             course?.name
//           ).toLowerCase();

//         const description =
//           normalizeText(
//             course?.description
//           ).toLowerCase();

//         const specializations =
//           getCourseSpecializations(
//             course
//           );

//         const specializationText =
//           specializations
//             .map(
//               (item) =>
//                 item.name
//             )
//             .join(" ")
//             .toLowerCase();

//         return (
//           courseName.includes(
//             normalizedSearch
//           ) ||
//           description.includes(
//             normalizedSearch
//           ) ||
//           specializationText.includes(
//             normalizedSearch
//           )
//         );
//       }
//     );
//   }, [
//     domainCourses,
//     normalizedSearch,
//   ]);

//   /* =======================================================
//      ALL SEARCH RESULTS
//      Used when searching across domains.
//   ======================================================= */

//   const allSearchResults = useMemo(() => {
//     if (!normalizedSearch) {
//       return filteredCourses;
//     }

//     const results = courses.filter(
//       (course) => {
//         const name =
//           normalizeText(
//             course?.name
//           ).toLowerCase();

//         const description =
//           normalizeText(
//             course?.description
//           ).toLowerCase();

//         const specializationText =
//           getCourseSpecializations(
//             course
//           )
//             .map(
//               (item) =>
//                 item.name
//             )
//             .join(" ")
//             .toLowerCase();

//         return (
//           name.includes(
//             normalizedSearch
//           ) ||
//           description.includes(
//             normalizedSearch
//           ) ||
//           specializationText.includes(
//             normalizedSearch
//           )
//         );
//       }
//     );

//     return results.length
//       ? results
//       : filteredCourses;
//   }, [
//     courses,
//     filteredCourses,
//     normalizedSearch,
//   ]);

//   /* =======================================================
//      COURSE LIST
//   ======================================================= */

//   const visibleCourses =
//     normalizedSearch
//       ? allSearchResults
//       : filteredCourses;

//   /* =======================================================
//      UNIVERSITY SEARCH
//   ======================================================= */

//   const searchedUniversities =
//     useMemo(() => {
//       if (!normalizedSearch) {
//         return universities;
//       }

//       return universities.filter(
//         (university) =>
//           normalizeText(
//             university?.name
//           )
//             .toLowerCase()
//             .includes(
//               normalizedSearch
//             )
//       );
//     }, [
//       universities,
//       normalizedSearch,
//     ]);

//   /* =======================================================
//      DISPLAY DOMAINS
//   ======================================================= */

//   const displayedDomains =
//     showAllDomains
//       ? domains
//       : domains.slice(0, 8);

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <>
//       <Header />

//       <main
//         className="min-h-screen bg-white"
//         style={{
//           color:
//             "var(--cv-neutral-dark)",
//         }}
//       >
//         {/* =================================================
//             TOP BAR
//         ================================================= */}

//         <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5">
//           <div className="flex items-center justify-between gap-4">
//             <h1
//               className="text-lg sm:text-xl md:text-2xl font-semibold"
//               style={{
//                 color:
//                   "var(--cv-primary)",
//               }}
//             >
//               Browse by domains
//             </h1>

//             <div className="flex items-center gap-3">
//               {/* CLOSE */}

//               <button
//                 type="button"
//                 aria-label="Close"
//                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
//               >
//                 <X
//                   size={23}
//                   strokeWidth={1.8}
//                   style={{
//                     color:
//                       "var(--cv-neutral-dark)",
//                   }}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             MAIN AREA
//         ================================================= */}

//         <div className="max-w-[1600px] mx-auto px-0 md:px-4 pb-8 sm:pb-10">
//           <div className="grid grid-cols-1 lg:grid-cols-[375px_1fr] gap-0 lg:gap-10 mt-5">
//             {/* =================================================
//                 LEFT DOMAIN SIDEBAR
//             ================================================= */}

//             <aside className="hidden lg:block border-r min-h-[650px]">
//               <div className="px-4 md:px-6 lg:px-0 lg:pr-6">
//                 <div className="space-y-1">
//                   {displayedDomains.map(
//                     (domain) => {
//                       const active =
//                         activeDomain ===
//                         domain.key;

//                       return (
//                         <button
//                           key={
//                             domain.key
//                           }
//                           type="button"
//                           onClick={() => {
//                             setActiveDomain(
//                               domain.key
//                             );
//                             setSearch("");
//                           }}
//                           className="w-full text-left rounded-xl px-3 py-3 transition-all"
//                           style={{
//                             background:
//                               active
//                                 ? "var(--cv-primary)"
//                                 : "transparent",
//                             color: active
//                               ? "#fff"
//                               : "var(--cv-neutral-dark)",
//                           }}
//                         >
//                           <div className="text-base md:text-lg font-medium">
//                             {
//                               domain.title
//                             }
//                           </div>

//                           <div
//                             className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
//                             style={{
//                               background:
//                                 active
//                                   ? "#fff"
//                                   : "#EFF6FF",
//                               color:
//                                 "var(--cv-primary)",
//                             }}
//                           >
//                             {
//                               domain.subtitle
//                             }
//                           </div>
//                         </button>
//                       );
//                     }
//                   )}
//                 </div>

//                 {domains.length >
//                   8 && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowAllDomains(
//                         (value) =>
//                           !value
//                       )
//                     }
//                     className="mt-3 text-sm font-semibold flex items-center gap-1 px-3"
//                     style={{
//                       color:
//                         "var(--cv-primary)",
//                     }}
//                   >
//                     {showAllDomains
//                       ? "Show Less"
//                       : "View More"}

//                     <ChevronDown
//                       size={16}
//                       className={
//                         showAllDomains
//                           ? "rotate-180"
//                           : ""
//                       }
//                     />
//                   </button>
//                 )}
//               </div>
//             </aside>

//             {/* =================================================
//                 MOBILE DOMAIN SLIDER
//             ================================================= */}

//             <div className="lg:hidden col-span-1 px-3 sm:px-4 mb-4">
//               <div
//                 className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
//                 style={{ scrollbarWidth: "none" }}
//               >
//                 {domains.map((domain) => {
//                   const active = activeDomain === domain.key;

//                   return (
//                     <button
//                       key={domain.key}
//                       type="button"
//                       onClick={() => {
//                         setActiveDomain(domain.key);
//                         setSearch("");
//                       }}
//                       className="shrink-0 snap-start rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold border transition-all"
//                       style={{
//                         background: active ? "var(--cv-primary)" : "#fff",
//                         color: active ? "#fff" : "var(--cv-neutral-dark)",
//                         borderColor: active ? "var(--cv-primary)" : "var(--cv-neutral-border)",
//                       }}
//                     >
//                       {domain.title}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* =================================================
//                 RIGHT CONTENT
//             ================================================= */}

//             <section className="px-3 sm:px-4 md:px-0 pt-0 lg:pt-0">
//               {/* SEARCH */}

//               <div className="relative mb-5 sm:mb-7">
//                 <Search
//                   size={21}
//                   className="absolute left-5 top-1/2 -translate-y-1/2"
//                   style={{
//                     color:
//                       "var(--cv-neutral-dark)",
//                   }}
//                 />

//                 <input
//                   type="search"
//                   value={search}
//                   onChange={(event) =>
//                     setSearch(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Search courses and specializations ..."
//                   className="w-full h-12 md:h-14 pl-12 pr-12 rounded-full border bg-white outline-none text-sm md:text-base shadow-sm"
//                   style={{
//                     borderColor:
//                       "var(--cv-neutral-border)",
//                     color:
//                       "var(--cv-neutral-dark)",
//                   }}
//                 />

//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setSearch("")
//                     }
//                     className="absolute right-5 top-1/2 -translate-y-1/2"
//                     aria-label="Clear search"
//                   >
//                     <X
//                       size={19}
//                       style={{
//                         color:
//                           "var(--cv-neutral-mid)",
//                       }}
//                     />
//                   </button>
//                 )}
//               </div>

//               {/* SEARCH RESULT INFO */}

//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h2
//                     className="text-lg md:text-xl font-semibold"
//                     style={{
//                       color:
//                         "var(--cv-neutral-dark)",
//                     }}
//                   >
//                     {normalizedSearch
//                       ? "Search Results"
//                       : domains.find(
//                           (item) =>
//                             item.key ===
//                             activeDomain
//                         )?.title ||
//                         "Courses"}
//                   </h2>

//                   <p
//                     className="text-xs md:text-sm mt-1"
//                     style={{
//                       color:
//                         "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     {visibleCourses.length}{" "}
//                     courses available
//                   </p>
//                 </div>

//               </div>

//               {/* =================================================
//                   COURSE GRID
//               ================================================= */}

//               {coursesLoading &&
//               courses.length === 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
//                   {Array.from({
//                     length: 8,
//                   }).map((_, index) => (
//                     <div
//                       key={index}
//                       className="h-[280px] rounded-xl animate-pulse"
//                       style={{
//                         background:
//                           "#F1F5F9",
//                       }}
//                     />
//                   ))}
//                 </div>
//               ) : visibleCourses.length >
//                 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
//                   {visibleCourses.map(
//                     (course, index) => {
//                       const courseName =
//                         normalizeText(
//                           course?.name
//                         ) ||
//                         "Online Course";

//                       const courseImage =
//                         getCourseImage(
//                           course
//                         );

//                       const specializations =
//                         getCourseSpecializations(
//                           course
//                         );

//                       const specializationCount =
//                         getSpecializationCount(
//                           course
//                         );

//                       const universityCount =
//                         getCourseUniversityCount(
//                           course
//                         );

//                       const courseHref =
//                         getCourseHref(
//                           course
//                         );

//                       return (
//                         <article
//                           key={
//                             course?._id ||
//                             course?.slug ||
//                             `${courseName}-${index}`
//                           }
//                           className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden relative"
//                           style={{
//                             border:
//                               "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           {/* BADGE */}

//                           {index === 1 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               Trending ⚡
//                             </div>
//                           )}

//                           {index === 2 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               ROI 100% ⚡
//                             </div>
//                           )}

//                           {index === 5 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               Global ⚡
//                             </div>
//                           )}

//                           {index === 8 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               NEW ⚡
//                             </div>
//                           )}

//                           <div className="p-3 sm:p-4 md:p-5">
//                             {/* ICON */}

//                             <div className="h-10 sm:h-12 flex items-center mb-3 sm:mb-4">
//                               {courseImage &&
//                               courseImage !==
//                                 "/placeholder.png" ? (
//                                 <Image
//                                   src={
//                                     courseImage
//                                   }
//                                   width={
//                                     52
//                                   }
//                                   height={
//                                     52
//                                   }
//                                   alt={`${courseName} icon`}
//                                   className="w-9 h-9 sm:w-12 sm:h-12 object-contain"
//                                 />
//                               ) : (
//                                 <GraduationCap
//                                   size={
//                                     42
//                                   }
//                                   strokeWidth={
//                                     1.5
//                                   }
//                                   style={{
//                                     color:
//                                       "var(--cv-primary)",
//                                   }}
//                                 />
//                               )}
//                             </div>

//                             {/* COURSE NAME */}

//                             <h3
//                               className="text-sm sm:text-base md:text-lg font-medium min-h-[42px] sm:min-h-[50px] line-clamp-2"
//                               style={{
//                                 color:
//                                   "var(--cv-neutral-dark)",
//                               }}
//                             >
//                               {
//                                 courseName
//                               }
//                             </h3>

//                             {/* SPECIALIZATION */}

//                             <div
//                               className="inline-flex items-center mt-3 sm:mt-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium"
//                               style={{
//                                 background:
//                                   "#E8F0FF",
//                                 color:
//                                   "#1769E0",
//                               }}
//                             >
//                               {specializationCount >
//                               0
//                                 ? `${specializationCount}+ Specializations`
//                                 : "Specializations"}
//                             </div>

//                             {/* UNIVERSITY COUNT */}

//                             <div className="flex items-start gap-1.5 sm:gap-2 mt-3 sm:mt-4">
//                               <span
//                                 className="w-2.5 h-2.5 rounded-full shrink-0"
//                                 style={{
//                                   background:
//                                     "#1769E0",
//                                 }}
//                               />

//                               <span
//                                 className="text-[11px] sm:text-sm font-semibold leading-4"
//                                 style={{
//                                   color:
//                                     "var(--cv-neutral-dark)",
//                                 }}
//                               >
//                                 Compare{" "}
//                                 <span
//                                   style={{
//                                     color:
//                                       "#1769E0",
//                                   }}
//                                 >
//                                   {universityCount !==
//                                   null
//                                     ? universityCount
//                                     : "—"}
//                                 </span>{" "}
//                                 Universities
//                               </span>
//                             </div>

//                             {/* VIEW SPECIALIZATIONS */}

//                             <Link
//                               href={`${courseHref}?view=specializations`}
//                               className="inline-flex items-center gap-1 mt-4 sm:mt-5 text-xs sm:text-sm md:text-base font-medium hover:gap-2 transition-all"
//                               style={{
//                                 color:
//                                   "#1769E0",
//                               }}
//                             >
//                               View
//                               specializations
//                               <ChevronRight
//                                 size={
//                                   17
//                                 }
//                               />
//                             </Link>
//                           </div>
//                         </article>
//                       );
//                     }
//                   )}
//                 </div>
//               ) : (
//                 /* =================================================
//                    NO COURSES
//                 ================================================= */

//                 <div
//                   className="rounded-xl p-10 text-center"
//                   style={{
//                     border:
//                       "1px solid var(--cv-neutral-border)",
//                     background:
//                       "#fff",
//                   }}
//                 >
//                   <GraduationCap
//                     size={45}
//                     className="mx-auto mb-4"
//                     style={{
//                       color:
//                         "var(--cv-primary)",
//                     }}
//                   />

//                   <h3
//                     className="text-lg font-semibold"
//                     style={{
//                       color:
//                         "var(--cv-neutral-dark)",
//                     }}
//                   >
//                     No courses found
//                   </h3>

//                   <p
//                     className="text-sm mt-2"
//                     style={{
//                       color:
//                         "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     Try another search or
//                     select a different domain.
//                   </p>

//                   {search && (
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setSearch("")
//                       }
//                       className="mt-4 font-semibold"
//                       style={{
//                         color:
//                           "var(--cv-primary)",
//                       }}
//                     >
//                       Clear Search
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* =================================================
//                   UNIVERSITY INFO
//               ================================================= */}

//               {normalizedSearch &&
//                 searchedUniversities.length >
//                   0 && (
//                   <div className="mt-10">
//                     <div className="flex items-center justify-between mb-4">
//                       <div>
//                         <h2
//                           className="text-lg md:text-xl font-semibold"
//                           style={{
//                             color:
//                               "var(--cv-neutral-dark)",
//                           }}
//                         >
//                           Matching Universities
//                         </h2>

//                         <p
//                           className="text-sm mt-1"
//                           style={{
//                             color:
//                               "var(--cv-neutral-mid)",
//                           }}
//                         >
//                           {
//                             searchedUniversities.length
//                           }{" "}
//                           universities found
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       {searchedUniversities
//                         .slice(0, 8)
//                         .map(
//                           (
//                             university
//                           ) => {
//                             if (
//                               !university?.slug
//                             ) {
//                               return null;
//                             }

//                             const name =
//                               normalizeText(
//                                 university?.name
//                               ) ||
//                               "University";

//                             return (
//                               <Link
//                                 key={
//                                   university?._id ||
//                                   university?.slug
//                                 }
//                                 href={`/university/${encodeURIComponent(
//                                   university.slug
//                                 )}`}
//                                 className="bg-white rounded-xl p-4 flex flex-col items-center justify-center min-h-[130px] shadow-sm hover:shadow-md transition"
//                                 style={{
//                                   border:
//                                     "1px solid var(--cv-neutral-border)",
//                                 }}
//                               >
//                                 <Image
//                                   src={
//                                     university?.universityImageUrl ||
//                                     "/fallback-logo.png"
//                                   }
//                                   width={
//                                     80
//                                   }
//                                   height={
//                                     50
//                                   }
//                                   alt={`${name} logo`}
//                                   className="w-20 h-12 object-contain mb-3"
//                                 />

//                                 <span
//                                   className="text-xs font-semibold text-center line-clamp-2"
//                                   style={{
//                                     color:
//                                       "var(--cv-neutral-dark)",
//                                   }}
//                                 >
//                                   {
//                                     name
//                                   }
//                                 </span>
//                               </Link>
//                             );
//                           }
//                         )}
//                     </div>
//                   </div>
//                 )}
//             </section>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }



// "use client";

// import { useMemo, useState } from "react";
// import {
//   Search,
//   X,
//   ChevronRight,
//   ChevronDown,
//   GraduationCap,
// } from "lucide-react";
// import { useQuery } from "@tanstack/react-query";
// import Link from "next/link";
// import Image from "next/image";

// import Header from "../layout/Header";
// import Footer from "../layout/Footer";
// import api from "@/utlis/api.js";

// /* =========================================================
//    WORKING PROFESSIONAL COURSE SLUGS
//    (used only to put these courses in the Working
//     Professionals filter. They still open on their own slug)
// ========================================================= */

// const workingProfessionalSlugs = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// /* =========================================================
//    BROWSE BY DOMAINS
// ========================================================= */

// const domains = [
//   {
//     key: "PG",
//     title: "PG Courses",
//     subtitle: "After Graduation",
//   },
//   {
//     key: "UG",
//     title: "UG Courses",
//     subtitle: "After 12th",
//   },
//   {
//     key: "Diploma",
//     title: "Diploma Programs",
//     subtitle: "Diploma & Professional Programs",
//   },
//   {
//     key: "WorkingProfessional",
//     title: "Working Professionals",
//     subtitle: "Learn While You Work",
//   },
//   {
//     key: "Doctorate",
//     title: "Doctorate/Ph.D.",
//     subtitle: "Get Dr. Title (After UG + Work Ex)",
//   },
// ];

// /* =========================================================
//    HELPERS
// ========================================================= */

// const normalizeText = (value) => {
//   if (value === null || value === undefined) {
//     return "";
//   }

//   return String(value).trim();
// };

// /* =========================================================
//    GET COURSE CATEGORY
// ========================================================= */

// const getCourseCategory = (course) => {
//   return normalizeText(
//     course?.category ||
//       course?.courseCategory ||
//       course?.type ||
//       course?.courseType
//   );
// };

// /* =========================================================
//    WORKING PROFESSIONAL CHECK
// ========================================================= */

// const isWorkingProfessional = (course) => {
//   if (!course) return false;

//   const category = getCourseCategory(course)
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

//   const name = normalizeText(course?.name).toLowerCase();

//   return (
//     workingProfessionalSlugs.includes(course?.slug) ||
//     category.includes("workingprofessional") ||
//     category === "executiveeducation" ||
//     category === "executive" ||
//     category === "executiveeducationcourses" ||
//     name.includes("working professional")
//   );
// };

// /* =========================================================
//    CATEGORY MATCHING
// ========================================================= */

// const matchesDomain = (course, domain) => {
//   if (!course) return false;

//   const category = getCourseCategory(course)
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

//   const domainKey = domain
//     .toLowerCase()
//     .replace(/[\s_-]/g, "");

//   /* Working Professionals */
//   if (domainKey === "workingprofessional") {
//     return isWorkingProfessional(course);
//   }

//   /* Working Professional courses should not repeat in other filters */
//   if (isWorkingProfessional(course)) {
//     return false;
//   }

//   if (domainKey === "pg") {
//     return (
//       category === "pg" ||
//       category === "postgraduate" ||
//       category === "postgraduatecourses"
//     );
//   }

//   if (domainKey === "ug") {
//     return (
//       category === "ug" ||
//       category === "undergraduate" ||
//       category === "undergraduatecourses"
//     );
//   }

//   if (domainKey === "executiveeducation") {
//     return (
//       category === "executiveeducation" ||
//       category === "executive" ||
//       category === "executiveeducationcourses"
//     );
//   }

//   if (domainKey === "doctorate") {
//     return (
//       category === "doctorate" ||
//       category === "phd" ||
//       category === "ph.d." ||
//       category === "doctoral"
//     );
//   }

//   if (domainKey === "engineering") {
//     return (
//       category === "engineering" ||
//       category === "engineeringcourses"
//     );
//   }

//   if (domainKey === "studyabroad") {
//     return (
//       category === "studyabroad" ||
//       category === "study abroad"
//     );
//   }

//   if (domainKey === "skilling") {
//     return (
//       category === "skilling" ||
//       category === "certificate" ||
//       category === "certification" ||
//       category === "skill"
//     );
//   }

//   if (domainKey === "diploma") {
//     return (
//       category === "diploma" ||
//       category === "diplomacourses" ||
//       category === "diplomaprograms"
//     );
//   }

//   if (domainKey === "genai") {
//     const name = normalizeText(
//       course?.name
//     ).toLowerCase();

//     const description = normalizeText(
//       course?.description
//     ).toLowerCase();

//     return (
//       category.includes("genai") ||
//       category.includes("ai") ||
//       name.includes("gen ai") ||
//       name.includes("artificial intelligence") ||
//       name.includes("agentic ai") ||
//       description.includes("gen ai") ||
//       description.includes("agentic ai")
//     );
//   }

//   return false;
// };

// /* =========================================================
//    SPECIALIZATION NAME
// ========================================================= */

// const getSpecializationName = (item) => {
//   if (!item) return "";

//   if (typeof item === "string") {
//     return item.trim();
//   }

//   if (typeof item === "object") {
//     return (
//       normalizeText(item?.name) ||
//       normalizeText(item?.title) ||
//       normalizeText(
//         item?.specializationName
//       ) ||
//       normalizeText(
//         item?.specialization
//       ) ||
//       normalizeText(item?.label) ||
//       ""
//     );
//   }

//   return "";
// };

// /* =========================================================
//    UNIVERSITY ARRAY
// ========================================================= */

// const getUniversitiesArray = (item) => {
//   if (!item) return [];

//   const possibleArrays = [
//     item?.universities,
//     item?.university,
//     item?.universityList,
//     item?.universityIds,
//     item?.universityData,
//   ];

//   for (const value of possibleArrays) {
//     if (Array.isArray(value)) {
//       return value;
//     }
//   }

//   return [];
// };

// /* =========================================================
//    UNIVERSITY COUNT
// ========================================================= */

// const getUniversityCount = (item) => {
//   if (!item) return null;

//   const values = [
//     item?.universityCount,
//     item?.universitiesCount,
//     item?.university_count,
//     item?.universityCountTotal,
//     item?.university_count_total,
//     item?.totalUniversities,
//     item?.totalUniversityCount,
//   ];

//   for (const value of values) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value)
//     ) {
//       return value;
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   const universities =
//     getUniversitiesArray(item);

//   if (universities.length) {
//     return universities.length;
//   }

//   return null;
// };

// /* =========================================================
//    COURSE SPECIALIZATIONS
// ========================================================= */

// const getCourseSpecializations = (
//   course
// ) => {
//   if (!course) return [];

//   const raw =
//     course?.specializations ??
//     course?.specialization ??
//     course?.specializationList ??
//     course?.specializationData ??
//     [];

//   if (!Array.isArray(raw)) {
//     return [];
//   }

//   return raw
//     .map((item) => {
//       if (typeof item === "string") {
//         return {
//           name: item.trim(),
//           universityCount: null,
//           universities: [],
//         };
//       }

//       return {
//         name: getSpecializationName(item),
//         universityCount:
//           getUniversityCount(item),
//         universities:
//           getUniversitiesArray(item),
//       };
//     })
//     .filter((item) => item.name);
// };

// /* =========================================================
//    COURSE UNIVERSITY COUNT
// ========================================================= */

// const getCourseUniversityCount = (
//   course
// ) => {
//   if (!course) return null;

//   const values = [
//     course?.universityCount,
//     course?.universitiesCount,
//     course?.university_count,
//     course?.universityCountTotal,
//     course?.university_count_total,
//     course?.totalUniversities,
//     course?.totalUniversityCount,
//   ];

//   for (const value of values) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value)
//     ) {
//       return value;
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return null;
// };

// /* =========================================================
//    SPECIALIZATION COUNT
// ========================================================= */

// const getSpecializationCount = (
//   course
// ) => {
//   const directValues = [
//     course?.specializationCount,
//     course?.specializationsCount,
//     course?.totalSpecializations,
//   ];

//   for (const value of directValues) {
//     if (
//       typeof value === "number" &&
//       Number.isFinite(value)
//     ) {
//       return value;
//     }

//     if (
//       typeof value === "string" &&
//       value.trim() !== "" &&
//       !Number.isNaN(Number(value))
//     ) {
//       return Number(value);
//     }
//   }

//   return getCourseSpecializations(course)
//     .length;
// };

// /* =========================================================
//    COURSE IMAGE
// ========================================================= */

// const getCourseImage = (course) => {
//   return (
//     course?.courseLogo?.url ||
//     course?.courseImageUrl ||
//     course?.imageUrl ||
//     course?.image ||
//     "/placeholder.png"
//   );
// };

// /* =========================================================
//    COURSE LINK
//    Every course opens on its own slug page.
// ========================================================= */

// const getCourseHref = (course) => {
//   if (!course?.slug) {
//     return "/course";
//   }

//   return `/course/${encodeURIComponent(
//     course.slug
//   )}`;
// };

// /* =========================================================
//    MAIN COMPONENT
// ========================================================= */

// export default function ExploreClient({
//   initialData,
// }) {
//   const [search, setSearch] = useState("");

//   const [activeDomain, setActiveDomain] =
//     useState("PG");

//   const [showAllDomains, setShowAllDomains] =
//     useState(false);

//   /* =======================================================
//      COURSES
//   ======================================================= */

//   const {
//     data: courses = [],
//     isLoading: coursesLoading,
//   } = useQuery({
//     queryKey: ["explore-courses"],

//     queryFn: async () => {
//       const response = await api.get(
//         "/api/v1/course"
//       );

//       if (Array.isArray(response.data)) {
//         return response.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.data
//         )
//       ) {
//         return response.data.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.courses
//         )
//       ) {
//         return response.data.courses;
//       }

//       return [];
//     },

//     initialData:
//       initialData?.initialCourses ||
//       undefined,

//     staleTime: 5 * 60 * 1000,
//   });

//   /* =======================================================
//      UNIVERSITIES
//   ======================================================= */

//   const {
//     data: universities = [],
//   } = useQuery({
//     queryKey: ["explore-universities"],

//     queryFn: async () => {
//       const response = await api.get(
//         "/api/v1/university"
//       );

//       if (Array.isArray(response.data)) {
//         return response.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.data
//         )
//       ) {
//         return response.data.data;
//       }

//       if (
//         Array.isArray(
//           response.data?.universities
//         )
//       ) {
//         return response.data.universities;
//       }

//       return [];
//     },

//     initialData:
//       initialData?.initialUnis ||
//       undefined,

//     staleTime: 5 * 60 * 1000,
//   });

//   /* =======================================================
//      SEARCH
//   ======================================================= */

//   const normalizedSearch =
//     search.trim().toLowerCase();

//   /* =======================================================
//      DOMAIN COURSES
//   ======================================================= */

//   const domainCourses = useMemo(() => {
//     let list = courses.filter(
//       (course) =>
//         matchesDomain(
//           course,
//           activeDomain
//         )
//     );

//     /*
//      * Fallback:
//      * If backend category names do not exactly
//      * match the selected domain, PG is commonly
//      * returned directly.
//      */
//     if (
//       list.length === 0 &&
//       activeDomain === "PG"
//     ) {
//       list = courses.filter((course) => {
//         const category =
//           getCourseCategory(course)
//             .toLowerCase();

//         return (
//           !isWorkingProfessional(course) &&
//           (category === "pg" ||
//             category.includes("post"))
//         );
//       });
//     }

//     return list;
//   }, [
//     courses,
//     activeDomain,
//   ]);

//   /* =======================================================
//      SEARCHED COURSES
//   ======================================================= */

//   const filteredCourses = useMemo(() => {
//     if (!normalizedSearch) {
//       return domainCourses;
//     }

//     return domainCourses.filter(
//       (course) => {
//         const courseName =
//           normalizeText(
//             course?.name
//           ).toLowerCase();

//         const description =
//           normalizeText(
//             course?.description
//           ).toLowerCase();

//         const specializations =
//           getCourseSpecializations(
//             course
//           );

//         const specializationText =
//           specializations
//             .map(
//               (item) =>
//                 item.name
//             )
//             .join(" ")
//             .toLowerCase();

//         return (
//           courseName.includes(
//             normalizedSearch
//           ) ||
//           description.includes(
//             normalizedSearch
//           ) ||
//           specializationText.includes(
//             normalizedSearch
//           )
//         );
//       }
//     );
//   }, [
//     domainCourses,
//     normalizedSearch,
//   ]);

//   /* =======================================================
//      ALL SEARCH RESULTS
//      Used when searching across domains.
//   ======================================================= */

//   const allSearchResults = useMemo(() => {
//     if (!normalizedSearch) {
//       return filteredCourses;
//     }

//     const results = courses.filter(
//       (course) => {
//         const name =
//           normalizeText(
//             course?.name
//           ).toLowerCase();

//         const description =
//           normalizeText(
//             course?.description
//           ).toLowerCase();

//         const specializationText =
//           getCourseSpecializations(
//             course
//           )
//             .map(
//               (item) =>
//                 item.name
//             )
//             .join(" ")
//             .toLowerCase();

//         return (
//           name.includes(
//             normalizedSearch
//           ) ||
//           description.includes(
//             normalizedSearch
//           ) ||
//           specializationText.includes(
//             normalizedSearch
//           )
//         );
//       }
//     );

//     return results.length
//       ? results
//       : filteredCourses;
//   }, [
//     courses,
//     filteredCourses,
//     normalizedSearch,
//   ]);

//   /* =======================================================
//      COURSE LIST
//   ======================================================= */

//   const visibleCourses =
//     normalizedSearch
//       ? allSearchResults
//       : filteredCourses;

//   /* =======================================================
//      UNIVERSITY SEARCH
//   ======================================================= */

//   const searchedUniversities =
//     useMemo(() => {
//       if (!normalizedSearch) {
//         return universities;
//       }

//       return universities.filter(
//         (university) =>
//           normalizeText(
//             university?.name
//           )
//             .toLowerCase()
//             .includes(
//               normalizedSearch
//             )
//       );
//     }, [
//       universities,
//       normalizedSearch,
//     ]);

//   /* =======================================================
//      DISPLAY DOMAINS
//   ======================================================= */

//   const displayedDomains =
//     showAllDomains
//       ? domains
//       : domains.slice(0, 8);

//   /* =======================================================
//      RENDER
//   ======================================================= */

//   return (
//     <>
//       <Header />

//       <main
//         className="min-h-screen bg-white"
//         style={{
//           color:
//             "var(--cv-neutral-dark)",
//         }}
//       >
//         {/* =================================================
//             TOP BAR
//         ================================================= */}

//         <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5">
//           <div className="flex items-center justify-between gap-4">
//             <h1
//               className="text-lg sm:text-xl md:text-2xl font-semibold"
//               style={{
//                 color:
//                   "var(--cv-primary)",
//               }}
//             >
//               Browse by domains
//             </h1>

//             <div className="flex items-center gap-3">
//               {/* CLOSE */}

//               <button
//                 type="button"
//                 aria-label="Close"
//                 className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
//               >
//                 <X
//                   size={23}
//                   strokeWidth={1.8}
//                   style={{
//                     color:
//                       "var(--cv-neutral-dark)",
//                   }}
//                 />
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* =================================================
//             MAIN AREA
//         ================================================= */}

//         <div className="max-w-[1600px] mx-auto px-0 md:px-4 pb-8 sm:pb-10">
//           <div className="grid grid-cols-1 lg:grid-cols-[375px_1fr] gap-0 lg:gap-10 mt-5">
//             {/* =================================================
//                 LEFT DOMAIN SIDEBAR
//             ================================================= */}

//             <aside className="hidden lg:block border-r min-h-[650px]">
//               <div className="px-4 md:px-6 lg:px-0 lg:pr-6">
//                 <div className="space-y-1">
//                   {displayedDomains.map(
//                     (domain) => {
//                       const active =
//                         activeDomain ===
//                         domain.key;

//                       return (
//                         <button
//                           key={
//                             domain.key
//                           }
//                           type="button"
//                           onClick={() => {
//                             setActiveDomain(
//                               domain.key
//                             );
//                             setSearch("");
//                           }}
//                           className="w-full text-left rounded-xl px-3 py-3 transition-all"
//                           style={{
//                             background:
//                               active
//                                 ? "var(--cv-primary)"
//                                 : "transparent",
//                             color: active
//                               ? "#fff"
//                               : "var(--cv-neutral-dark)",
//                           }}
//                         >
//                           <div className="text-base md:text-lg font-medium">
//                             {
//                               domain.title
//                             }
//                           </div>

//                           <div
//                             className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
//                             style={{
//                               background:
//                                 active
//                                   ? "#fff"
//                                   : "#EFF6FF",
//                               color:
//                                 "var(--cv-primary)",
//                             }}
//                           >
//                             {
//                               domain.subtitle
//                             }
//                           </div>
//                         </button>
//                       );
//                     }
//                   )}
//                 </div>

//                 {domains.length >
//                   8 && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setShowAllDomains(
//                         (value) =>
//                           !value
//                       )
//                     }
//                     className="mt-3 text-sm font-semibold flex items-center gap-1 px-3"
//                     style={{
//                       color:
//                         "var(--cv-primary)",
//                     }}
//                   >
//                     {showAllDomains
//                       ? "Show Less"
//                       : "View More"}

//                     <ChevronDown
//                       size={16}
//                       className={
//                         showAllDomains
//                           ? "rotate-180"
//                           : ""
//                       }
//                     />
//                   </button>
//                 )}
//               </div>
//             </aside>

//             {/* =================================================
//                 MOBILE DOMAIN SLIDER
//             ================================================= */}

//             <div className="lg:hidden col-span-1 px-3 sm:px-4 mb-4">
//               <div
//                 className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
//                 style={{ scrollbarWidth: "none" }}
//               >
//                 {domains.map((domain) => {
//                   const active = activeDomain === domain.key;

//                   return (
//                     <button
//                       key={domain.key}
//                       type="button"
//                       onClick={() => {
//                         setActiveDomain(domain.key);
//                         setSearch("");
//                       }}
//                       className="shrink-0 snap-start rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold border transition-all"
//                       style={{
//                         background: active ? "var(--cv-primary)" : "#fff",
//                         color: active ? "#fff" : "var(--cv-neutral-dark)",
//                         borderColor: active ? "var(--cv-primary)" : "var(--cv-neutral-border)",
//                       }}
//                     >
//                       {domain.title}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>

//             {/* =================================================
//                 RIGHT CONTENT
//             ================================================= */}

//             <section className="px-3 sm:px-4 md:px-0 pt-0 lg:pt-0">
//               {/* SEARCH */}

//               <div className="relative mb-5 sm:mb-7">
//                 <Search
//                   size={21}
//                   className="absolute left-5 top-1/2 -translate-y-1/2"
//                   style={{
//                     color:
//                       "var(--cv-neutral-dark)",
//                   }}
//                 />

//                 <input
//                   type="search"
//                   value={search}
//                   onChange={(event) =>
//                     setSearch(
//                       event.target.value
//                     )
//                   }
//                   placeholder="Search courses and specializations ..."
//                   className="w-full h-12 md:h-14 pl-12 pr-12 rounded-full border bg-white outline-none text-sm md:text-base shadow-sm"
//                   style={{
//                     borderColor:
//                       "var(--cv-neutral-border)",
//                     color:
//                       "var(--cv-neutral-dark)",
//                   }}
//                 />

//                 {search && (
//                   <button
//                     type="button"
//                     onClick={() =>
//                       setSearch("")
//                     }
//                     className="absolute right-5 top-1/2 -translate-y-1/2"
//                     aria-label="Clear search"
//                   >
//                     <X
//                       size={19}
//                       style={{
//                         color:
//                           "var(--cv-neutral-mid)",
//                       }}
//                     />
//                   </button>
//                 )}
//               </div>

//               {/* SEARCH RESULT INFO */}

//               <div className="flex items-center justify-between mb-4">
//                 <div>
//                   <h2
//                     className="text-lg md:text-xl font-semibold"
//                     style={{
//                       color:
//                         "var(--cv-neutral-dark)",
//                     }}
//                   >
//                     {normalizedSearch
//                       ? "Search Results"
//                       : domains.find(
//                           (item) =>
//                             item.key ===
//                             activeDomain
//                         )?.title ||
//                         "Courses"}
//                   </h2>

//                   <p
//                     className="text-xs md:text-sm mt-1"
//                     style={{
//                       color:
//                         "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     {visibleCourses.length}{" "}
//                     courses available
//                   </p>
//                 </div>

//               </div>

//               {/* =================================================
//                   COURSE GRID
//               ================================================= */}

//               {coursesLoading &&
//               courses.length === 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
//                   {Array.from({
//                     length: 8,
//                   }).map((_, index) => (
//                     <div
//                       key={index}
//                       className="h-[280px] rounded-xl animate-pulse"
//                       style={{
//                         background:
//                           "#F1F5F9",
//                       }}
//                     />
//                   ))}
//                 </div>
//               ) : visibleCourses.length >
//                 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
//                   {visibleCourses.map(
//                     (course, index) => {
//                       const courseName =
//                         normalizeText(
//                           course?.name
//                         ) ||
//                         "Online Course";

//                       const courseImage =
//                         getCourseImage(
//                           course
//                         );

//                       const specializationCount =
//                         getSpecializationCount(
//                           course
//                         );

//                       const universityCount =
//                         getCourseUniversityCount(
//                           course
//                         );

//                       const courseHref =
//                         getCourseHref(
//                           course
//                         );

//                       return (
//                         <article
//                           key={
//                             course?._id ||
//                             course?.slug ||
//                             `${courseName}-${index}`
//                           }
//                           className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden relative"
//                           style={{
//                             border:
//                               "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           {/* BADGE */}

//                           {index === 1 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               Trending ⚡
//                             </div>
//                           )}

//                           {index === 2 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               ROI 100% ⚡
//                             </div>
//                           )}

//                           {index === 5 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               Global ⚡
//                             </div>
//                           )}

//                           {index === 8 && (
//                             <div
//                               className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
//                               style={{
//                                 background:
//                                   "#C8F7E6",
//                                 color:
//                                   "#14B887",
//                               }}
//                             >
//                               NEW ⚡
//                             </div>
//                           )}

//                           <div className="p-3 sm:p-4 md:p-5">
//                             {/* ICON */}

//                             <div className="h-10 sm:h-12 flex items-center mb-3 sm:mb-4">
//                               {courseImage &&
//                               courseImage !==
//                                 "/placeholder.png" ? (
//                                 <Image
//                                   src={
//                                     courseImage
//                                   }
//                                   width={
//                                     52
//                                   }
//                                   height={
//                                     52
//                                   }
//                                   alt={`${courseName} icon`}
//                                   className="w-9 h-9 sm:w-12 sm:h-12 object-contain"
//                                 />
//                               ) : (
//                                 <GraduationCap
//                                   size={
//                                     42
//                                   }
//                                   strokeWidth={
//                                     1.5
//                                   }
//                                   style={{
//                                     color:
//                                       "var(--cv-primary)",
//                                   }}
//                                 />
//                               )}
//                             </div>

//                             {/* COURSE NAME */}

//                             <h3
//                               className="text-sm sm:text-base md:text-lg font-medium min-h-[42px] sm:min-h-[50px] line-clamp-2"
//                               style={{
//                                 color:
//                                   "var(--cv-neutral-dark)",
//                               }}
//                             >
//                               {
//                                 courseName
//                               }
//                             </h3>

//                             {/* SPECIALIZATION */}

//                             <div
//                               className="inline-flex items-center mt-3 sm:mt-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium"
//                               style={{
//                                 background:
//                                   "#E8F0FF",
//                                 color:
//                                   "#1769E0",
//                               }}
//                             >
//                               {specializationCount >
//                               0
//                                 ? `${specializationCount}+ Specializations`
//                                 : "Specializations"}
//                             </div>

//                             {/* UNIVERSITY COUNT */}

//                             <div className="flex items-start gap-1.5 sm:gap-2 mt-3 sm:mt-4">
//                               <span
//                                 className="w-2.5 h-2.5 rounded-full shrink-0"
//                                 style={{
//                                   background:
//                                     "#1769E0",
//                                 }}
//                               />

//                               <span
//                                 className="text-[11px] sm:text-sm font-semibold leading-4"
//                                 style={{
//                                   color:
//                                     "var(--cv-neutral-dark)",
//                                 }}
//                               >
//                                 Compare{" "}
//                                 <span
//                                   style={{
//                                     color:
//                                       "#1769E0",
//                                   }}
//                                 >
//                                   {universityCount !==
//                                   null
//                                     ? universityCount
//                                     : "—"}
//                                 </span>{" "}
//                                 Universities
//                               </span>
//                             </div>

//                             {/* VIEW SPECIALIZATIONS */}

//                             <Link
//                               href={`${courseHref}?view=specializations`}
//                               className="inline-flex items-center gap-1 mt-4 sm:mt-5 text-xs sm:text-sm md:text-base font-medium hover:gap-2 transition-all"
//                               style={{
//                                 color:
//                                   "#1769E0",
//                               }}
//                             >
//                               View
//                               specializations
//                               <ChevronRight
//                                 size={
//                                   17
//                                 }
//                               />
//                             </Link>
//                           </div>
//                         </article>
//                       );
//                     }
//                   )}
//                 </div>
//               ) : (
//                 /* =================================================
//                    NO COURSES
//                 ================================================= */

//                 <div
//                   className="rounded-xl p-10 text-center"
//                   style={{
//                     border:
//                       "1px solid var(--cv-neutral-border)",
//                     background:
//                       "#fff",
//                   }}
//                 >
//                   <GraduationCap
//                     size={45}
//                     className="mx-auto mb-4"
//                     style={{
//                       color:
//                         "var(--cv-primary)",
//                     }}
//                   />

//                   <h3
//                     className="text-lg font-semibold"
//                     style={{
//                       color:
//                         "var(--cv-neutral-dark)",
//                     }}
//                   >
//                     No courses found
//                   </h3>

//                   <p
//                     className="text-sm mt-2"
//                     style={{
//                       color:
//                         "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     Try another search or
//                     select a different domain.
//                   </p>

//                   {search && (
//                     <button
//                       type="button"
//                       onClick={() =>
//                         setSearch("")
//                       }
//                       className="mt-4 font-semibold"
//                       style={{
//                         color:
//                           "var(--cv-primary)",
//                       }}
//                     >
//                       Clear Search
//                     </button>
//                   )}
//                 </div>
//               )}

//               {/* =================================================
//                   UNIVERSITY INFO
//               ================================================= */}

//               {normalizedSearch &&
//                 searchedUniversities.length >
//                   0 && (
//                   <div className="mt-10">
//                     <div className="flex items-center justify-between mb-4">
//                       <div>
//                         <h2
//                           className="text-lg md:text-xl font-semibold"
//                           style={{
//                             color:
//                               "var(--cv-neutral-dark)",
//                           }}
//                         >
//                           Matching Universities
//                         </h2>

//                         <p
//                           className="text-sm mt-1"
//                           style={{
//                             color:
//                               "var(--cv-neutral-mid)",
//                           }}
//                         >
//                           {
//                             searchedUniversities.length
//                           }{" "}
//                           universities found
//                         </p>
//                       </div>
//                     </div>

//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//                       {searchedUniversities
//                         .slice(0, 8)
//                         .map(
//                           (
//                             university
//                           ) => {
//                             if (
//                               !university?.slug
//                             ) {
//                               return null;
//                             }

//                             const name =
//                               normalizeText(
//                                 university?.name
//                               ) ||
//                               "University";

//                             return (
//                               <Link
//                                 key={
//                                   university?._id ||
//                                   university?.slug
//                                 }
//                                 href={`/university/${encodeURIComponent(
//                                   university.slug
//                                 )}`}
//                                 className="bg-white rounded-xl p-4 flex flex-col items-center justify-center min-h-[130px] shadow-sm hover:shadow-md transition"
//                                 style={{
//                                   border:
//                                     "1px solid var(--cv-neutral-border)",
//                                 }}
//                               >
//                                 <Image
//                                   src={
//                                     university?.universityImageUrl ||
//                                     "/fallback-logo.png"
//                                   }
//                                   width={
//                                     80
//                                   }
//                                   height={
//                                     50
//                                   }
//                                   alt={`${name} logo`}
//                                   className="w-20 h-12 object-contain mb-3"
//                                 />

//                                 <span
//                                   className="text-xs font-semibold text-center line-clamp-2"
//                                   style={{
//                                     color:
//                                       "var(--cv-neutral-dark)",
//                                   }}
//                                 >
//                                   {
//                                     name
//                                   }
//                                 </span>
//                               </Link>
//                             );
//                           }
//                         )}
//                     </div>
//                   </div>
//                 )}
//             </section>
//           </div>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }


"use client";

import { useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import api from "@/utlis/api.js";

/* =========================================================
   WORKING PROFESSIONAL COURSE SLUGS
========================================================= */

const workingProfessionalSlugs = [
  "btech-for-working-professional",
  "mtech-for-working-professionals",
  "diploma-for-working-professionals",
];

/* =========================================================
   BROWSE BY DOMAINS
========================================================= */

const domains = [
  { key: "PG", title: "PG Courses", subtitle: "After Graduation" },
  { key: "UG", title: "UG Courses", subtitle: "After 12th" },
  {
    key: "Diploma",
    title: "Diploma Programs",
    subtitle: "Diploma & Professional Programs",
  },
  {
    key: "WorkingProfessional",
    title: "Working Professionals",
    subtitle: "Learn While You Work",
  },
  {
    key: "Doctorate",
    title: "Doctorate/Ph.D.",
    subtitle: "Get Dr. Title (After UG + Work Ex)",
  },
];

/* =========================================================
   HELPERS
========================================================= */

const normalizeText = (value) => {
  if (value === null || value === undefined) return "";
  return String(value).trim();
};

const getCourseCategory = (course) =>
  normalizeText(
    course?.category ||
      course?.courseCategory ||
      course?.type ||
      course?.courseType
  );

const isWorkingProfessional = (course) => {
  if (!course) return false;
  const category = getCourseCategory(course)
    .toLowerCase()
    .replace(/[\s_-]/g, "");
  const name = normalizeText(course?.name).toLowerCase();
  return (
    workingProfessionalSlugs.includes(course?.slug) ||
    category.includes("workingprofessional") ||
    category === "executiveeducation" ||
    category === "executive" ||
    category === "executiveeducationcourses" ||
    name.includes("working professional")
  );
};

const matchesDomain = (course, domain) => {
  if (!course) return false;
  const category = getCourseCategory(course)
    .toLowerCase()
    .replace(/[\s_-]/g, "");
  const domainKey = domain.toLowerCase().replace(/[\s_-]/g, "");

  if (domainKey === "workingprofessional") return isWorkingProfessional(course);
  if (isWorkingProfessional(course)) return false;

  if (domainKey === "pg")
    return (
      category === "pg" ||
      category === "postgraduate" ||
      category === "postgraduatecourses"
    );

  if (domainKey === "ug")
    return (
      category === "ug" ||
      category === "undergraduate" ||
      category === "undergraduatecourses"
    );

  if (domainKey === "executiveeducation")
    return (
      category === "executiveeducation" ||
      category === "executive" ||
      category === "executiveeducationcourses"
    );

  if (domainKey === "doctorate")
    return (
      category === "doctorate" ||
      category === "phd" ||
      category === "ph.d." ||
      category === "doctoral"
    );

  if (domainKey === "engineering")
    return category === "engineering" || category === "engineeringcourses";

  if (domainKey === "studyabroad")
    return category === "studyabroad" || category === "study abroad";

  if (domainKey === "skilling")
    return (
      category === "skilling" ||
      category === "certificate" ||
      category === "certification" ||
      category === "skill"
    );

  if (domainKey === "diploma")
    return (
      category === "diploma" ||
      category === "diplomacourses" ||
      category === "diplomaprograms"
    );

  if (domainKey === "genai") {
    const name = normalizeText(course?.name).toLowerCase();
    const description = normalizeText(course?.description).toLowerCase();
    return (
      category.includes("genai") ||
      category.includes("ai") ||
      name.includes("gen ai") ||
      name.includes("artificial intelligence") ||
      name.includes("agentic ai") ||
      description.includes("gen ai") ||
      description.includes("agentic ai")
    );
  }

  return false;
};

const getSpecializationName = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  if (typeof item === "object") {
    return (
      normalizeText(item?.name) ||
      normalizeText(item?.title) ||
      normalizeText(item?.specializationName) ||
      normalizeText(item?.specialization) ||
      normalizeText(item?.label) ||
      ""
    );
  }
  return "";
};

const getUniversitiesArray = (item) => {
  if (!item) return [];
  const possibleArrays = [
    item?.universities,
    item?.university,
    item?.universityList,
    item?.universityIds,
    item?.universityData,
  ];
  for (const value of possibleArrays) if (Array.isArray(value)) return value;
  return [];
};

const getUniversityCount = (item) => {
  if (!item) return null;
  const values = [
    item?.universityCount,
    item?.universitiesCount,
    item?.university_count,
    item?.universityCountTotal,
    item?.university_count_total,
    item?.totalUniversities,
    item?.totalUniversityCount,
  ];
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    )
      return Number(value);
  }
  const universities = getUniversitiesArray(item);
  if (universities.length) return universities.length;
  return null;
};

const getCourseSpecializations = (course) => {
  if (!course) return [];
  const raw =
    course?.specializations ??
    course?.specialization ??
    course?.specializationList ??
    course?.specializationData ??
    [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (typeof item === "string") {
        return { name: item.trim(), universityCount: null, universities: [] };
      }
      return {
        name: getSpecializationName(item),
        universityCount: getUniversityCount(item),
        universities: getUniversitiesArray(item),
      };
    })
    .filter((item) => item.name);
};

const getCourseUniversityCount = (course) => {
  if (!course) return null;
  const values = [
    course?.universityCount,
    course?.universitiesCount,
    course?.university_count,
    course?.universityCountTotal,
    course?.university_count_total,
    course?.totalUniversities,
    course?.totalUniversityCount,
  ];
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    )
      return Number(value);
  }
  return null;
};

const getSpecializationCount = (course) => {
  const directValues = [
    course?.specializationCount,
    course?.specializationsCount,
    course?.totalSpecializations,
  ];
  for (const value of directValues) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    )
      return Number(value);
  }
  return getCourseSpecializations(course).length;
};

const getCourseImage = (course) =>
  course?.courseLogo?.url ||
  course?.courseImageUrl ||
  course?.imageUrl ||
  course?.image ||
  "/placeholder.png";

const getCourseHref = (course) => {
  if (!course?.slug) return "/course";
  return `/course/${encodeURIComponent(course.slug)}`;
};

/* =========================================================
   BADGES (by index) — brand palette
========================================================= */

const getBadge = (index) => {
  const map = {
    1: { label: "Trending", bg: "#FFF7ED", color: "#C15304" },
    2: { label: "ROI 100%", bg: "#ECFDF5", color: "#047857" },
    5: { label: "Global", bg: "#EFF6FF", color: "#1E3A8A" },
    8: { label: "New", bg: "#FDF2F8", color: "#BE185D" },
  };
  return map[index] || null;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ExploreClient({ initialData }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeDomain, setActiveDomain] = useState("PG");
  const [showAllDomains, setShowAllDomains] = useState(false);

  /* ---------- HANDLE CLOSE ---------- */
  const handleClose = () => {
    // Agar history hai to back, warna home
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  /* ---------- COURSES ---------- */
  const { data: courses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["explore-courses"],
    queryFn: async () => {
      const response = await api.get("/api/v1/course");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data?.courses)) return response.data.courses;
      return [];
    },
    initialData: initialData?.initialCourses || undefined,
    staleTime: 5 * 60 * 1000,
  });

  /* ---------- UNIVERSITIES ---------- */
  const { data: universities = [] } = useQuery({
    queryKey: ["explore-universities"],
    queryFn: async () => {
      const response = await api.get("/api/v1/university");
      if (Array.isArray(response.data)) return response.data;
      if (Array.isArray(response.data?.data)) return response.data.data;
      if (Array.isArray(response.data?.universities))
        return response.data.universities;
      return [];
    },
    initialData: initialData?.initialUnis || undefined,
    staleTime: 5 * 60 * 1000,
  });

  const normalizedSearch = search.trim().toLowerCase();

  /* ---------- DOMAIN COURSES ---------- */
  const domainCourses = useMemo(() => {
    let list = courses.filter((course) => matchesDomain(course, activeDomain));

    if (list.length === 0 && activeDomain === "PG") {
      list = courses.filter((course) => {
        const category = getCourseCategory(course).toLowerCase();
        return (
          !isWorkingProfessional(course) &&
          (category === "pg" || category.includes("post"))
        );
      });
    }
    return list;
  }, [courses, activeDomain]);

  /* ---------- SEARCH FILTER ---------- */
  const filteredCourses = useMemo(() => {
    if (!normalizedSearch) return domainCourses;
    return domainCourses.filter((course) => {
      const courseName = normalizeText(course?.name).toLowerCase();
      const description = normalizeText(course?.description).toLowerCase();
      const specializationText = getCourseSpecializations(course)
        .map((item) => item.name)
        .join(" ")
        .toLowerCase();
      return (
        courseName.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        specializationText.includes(normalizedSearch)
      );
    });
  }, [domainCourses, normalizedSearch]);

  /* ---------- ALL SEARCH RESULTS ---------- */
  const allSearchResults = useMemo(() => {
    if (!normalizedSearch) return filteredCourses;
    const results = courses.filter((course) => {
      const name = normalizeText(course?.name).toLowerCase();
      const description = normalizeText(course?.description).toLowerCase();
      const specializationText = getCourseSpecializations(course)
        .map((item) => item.name)
        .join(" ")
        .toLowerCase();
      return (
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        specializationText.includes(normalizedSearch)
      );
    });
    return results.length ? results : filteredCourses;
  }, [courses, filteredCourses, normalizedSearch]);

  const visibleCourses = normalizedSearch ? allSearchResults : filteredCourses;

  /* ---------- UNIVERSITY SEARCH ---------- */
  const searchedUniversities = useMemo(() => {
    if (!normalizedSearch) return universities;
    return universities.filter((university) =>
      normalizeText(university?.name)
        .toLowerCase()
        .includes(normalizedSearch)
    );
  }, [universities, normalizedSearch]);

  const displayedDomains = showAllDomains ? domains : domains.slice(0, 8);

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-white"
        style={{ color: "var(--cv-neutral-dark)" }}
      >
        {/* ===== TOP BAR ===== */}
        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5">
          <div className="flex items-center justify-between gap-4">
            <h1
              className="text-lg sm:text-xl md:text-2xl font-semibold"
              style={{ color: "var(--cv-primary)" }}
            >
              Browse by domains
            </h1>

            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all hover:bg-[var(--cv-primary-light)] active:scale-95"
            >
              <X
                size={22}
                strokeWidth={2}
                style={{ color: "var(--cv-neutral-dark)" }}
              />
            </button>
          </div>
        </div>

        {/* ===== MAIN AREA ===== */}
        <div className="max-w-[1600px] mx-auto px-0 md:px-4 pb-8 sm:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-0 lg:gap-8 mt-5">
            {/* =====================================================
                LEFT SIDEBAR (sticky)
            ===================================================== */}
            <aside
              className="hidden lg:block border-r"
              style={{ borderColor: "var(--cv-neutral-border)" }}
            >
              {/* sticky wrapper — scroll karte time sidebar top pe rahega */}
              <div className="sticky top-[80px] px-4 md:px-6 lg:px-0 lg:pr-5">
                <div className="space-y-1.5">
                  {displayedDomains.map((domain) => {
                    const active = activeDomain === domain.key;
                    return (
                      <button
                        key={domain.key}
                        type="button"
                        onClick={() => {
                          setActiveDomain(domain.key);
                          setSearch("");
                        }}
                        className="w-full text-left rounded-lg px-3 py-2.5 transition-all duration-200"
                        style={{
                          background: active
                            ? "var(--cv-primary)"
                            : "transparent",
                          color: active ? "#fff" : "var(--cv-neutral-dark)",
                          borderLeft: active
                            ? "3px solid var(--cv-accent)"
                            : "3px solid transparent",
                        }}
                      >
                        <div
                          className={`text-sm font-semibold ${
                            active ? "text-white" : ""
                          }`}
                        >
                          {domain.title}
                        </div>
                        <div
                          className="text-[11px] mt-0.5"
                          style={{
                            color: active
                              ? "rgba(255,255,255,0.75)"
                              : "var(--cv-neutral-mid)",
                          }}
                        >
                          {domain.subtitle}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {domains.length > 8 && (
                  <button
                    type="button"
                    onClick={() => setShowAllDomains((v) => !v)}
                    className="mt-3 text-xs font-semibold flex items-center gap-1 px-3"
                    style={{ color: "var(--cv-primary)" }}
                  >
                    {showAllDomains ? "Show Less" : "View More"}
                    <ChevronDown
                      size={14}
                      className={showAllDomains ? "rotate-180" : ""}
                    />
                  </button>
                )}
              </div>
            </aside>

            {/* =====================================================
                MOBILE DOMAIN SLIDER (sticky)
            ===================================================== */}
            <div
              className="lg:hidden col-span-1 sticky top-[64px] z-20 bg-white/95 backdrop-blur-sm px-3 sm:px-4 py-2 mb-2 border-b"
              style={{ borderColor: "var(--cv-neutral-border)" }}
            >
              <div
                className="flex gap-2 overflow-x-auto pb-1 snap-x snap-mandatory"
                style={{ scrollbarWidth: "none" }}
              >
                {domains.map((domain) => {
                  const active = activeDomain === domain.key;
                  return (
                    <button
                      key={domain.key}
                      type="button"
                      onClick={() => {
                        setActiveDomain(domain.key);
                        setSearch("");
                      }}
                      className="shrink-0 snap-start rounded-full px-3 py-1.5 text-[11px] sm:text-xs font-semibold border transition-all"
                      style={{
                        background: active ? "var(--cv-primary)" : "#fff",
                        color: active ? "#fff" : "var(--cv-neutral-dark)",
                        borderColor: active
                          ? "var(--cv-primary)"
                          : "var(--cv-neutral-border)",
                      }}
                    >
                      {domain.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =====================================================
                RIGHT CONTENT
            ===================================================== */}
            <section className="px-3 sm:px-4 md:px-0">
              {/* ===== STICKY FILTER BAR (search + heading) ===== */}
              <div
                className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm pb-3 pt-1 -mx-3 sm:-mx-4 md:mx-0 px-3 sm:px-4 md:px-0 border-b"
                style={{ borderColor: "var(--cv-neutral-border)" }}
              >
                {/* SEARCH */}
                <div className="relative mb-3">
                  <Search
                    size={19}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search courses and specializations ..."
                    className="w-full h-11 pl-11 pr-11 rounded-full border bg-white outline-none text-sm shadow-sm transition-all focus:shadow-md focus:border-[var(--cv-accent)]"
                    style={{
                      borderColor: "var(--cv-neutral-border)",
                      color: "var(--cv-neutral-dark)",
                    }}
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                      aria-label="Clear search"
                    >
                      <X
                        size={17}
                        style={{ color: "var(--cv-neutral-mid)" }}
                      />
                    </button>
                  )}
                </div>

                {/* HEADING + COUNT */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2
                      className="text-base md:text-lg font-semibold leading-tight"
                      style={{ color: "var(--cv-neutral-dark)" }}
                    >
                      {normalizedSearch
                        ? "Search Results"
                        : domains.find((item) => item.key === activeDomain)
                            ?.title || "Courses"}
                    </h2>
                    <p
                      className="text-[11px] md:text-xs mt-0.5"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      {visibleCourses.length} courses available
                    </p>
                  </div>
                </div>
              </div>

              {/* ===== COURSE GRID ===== */}
              <div className="pt-4">
                {coursesLoading && courses.length === 0 ? (
                  <div className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-[280px] rounded-xl animate-pulse"
                        style={{ background: "var(--cv-neutral-light)" }}
                      />
                    ))}
                  </div>
                ) : visibleCourses.length > 0 ? (
                  <div
                    className="grid grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4"
                    style={{ contentVisibility: "auto" }}
                  >
                    {visibleCourses.map((course, index) => {
                      const courseName =
                        normalizeText(course?.name) || "Online Course";
                      const courseImage = getCourseImage(course);
                      const specializationCount =
                        getSpecializationCount(course);
                      const universityCount =
                        getCourseUniversityCount(course);
                      const courseHref = getCourseHref(course);
                      const badge = getBadge(index);

                      return (
                        <article
                          key={
                            course?._id ||
                            course?.slug ||
                            `${courseName}-${index}`
                          }
                          className="group relative bg-white rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg flex flex-col"
                          style={{
                            border: "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          {/* ⭐ Left accent strip on hover */}
                          <div
                            className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{ background: "var(--cv-grad-horizontal)" }}
                          />

                          <div className="p-3 sm:p-4 flex flex-col flex-1">
                            {/* TOP ROW: icon + badge */}
                            <div className="flex items-start justify-between mb-2.5">
                              {courseImage &&
                              courseImage !== "/placeholder.png" ? (
                                <div className="relative w-10 h-10 shrink-0">
                                  <Image
                                    src={courseImage}
                                    fill
                                    sizes="40px"
                                    alt={`${courseName} icon`}
                                    className="object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                </div>
                              ) : (
                                <div
                                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                  style={{
                                    background: "var(--cv-primary-light)",
                                  }}
                                >
                                  <GraduationCap
                                    size={20}
                                    strokeWidth={1.8}
                                    style={{ color: "var(--cv-primary)" }}
                                  />
                                </div>
                              )}

                              {badge && (
                                <span
                                  className="text-[9px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5"
                                  style={{
                                    background: badge.bg,
                                    color: badge.color,
                                  }}
                                >
                                  {badge.label}
                                  <Sparkles size={9} />
                                </span>
                              )}
                            </div>

                            {/* COURSE NAME */}
                            <h3
                              className="text-sm sm:text-[15px] font-semibold line-clamp-2 leading-snug min-h-[38px]"
                              style={{ color: "var(--cv-neutral-dark)" }}
                            >
                              {courseName}
                            </h3>

                            {/* PILL */}
                            <div
                              className="inline-flex self-start items-center mt-2 px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold"
                              style={{
                                background: "var(--cv-primary-light)",
                                color: "var(--cv-primary)",
                              }}
                            >
                              {specializationCount > 0
                                ? `${specializationCount}+ Specializations`
                                : "Specializations"}
                            </div>

                            {/* UNIVERSITY COUNT */}
                            <div className="flex items-center gap-1.5 mt-2.5">
                              <span
                                className="w-1.5 h-1.5 rounded-full shrink-0"
                                style={{ background: "var(--cv-accent)" }}
                              />
                              <span
                                className="text-[11px] sm:text-xs font-medium"
                                style={{ color: "var(--cv-neutral-mid)" }}
                              >
                                Compare{" "}
                                <span
                                  className="font-bold"
                                  style={{ color: "var(--cv-neutral-dark)" }}
                                >
                                  {universityCount !== null
                                    ? universityCount
                                    : "—"}
                                </span>{" "}
                                Universities
                              </span>
                            </div>

                            {/* FOOTER LINK */}
                            <Link
                              href={`${courseHref}?view=specializations`}
                              className="mt-auto pt-3 inline-flex items-center justify-between text-[11px] sm:text-xs font-semibold transition-all group-hover:gap-1"
                              style={{ color: "var(--cv-accent-dark)" }}
                            >
                              <span className="flex items-center gap-0.5">
                                View specializations
                                <ChevronRight
                                  size={14}
                                  className="transition-transform group-hover:translate-x-0.5"
                                />
                              </span>
                            </Link>
                          </div>

                          {/* Full-card invisible link */}
                          <Link
                            href={courseHref}
                            className="absolute inset-0 z-0"
                            aria-label={`View ${courseName}`}
                          />
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  /* ===== NO COURSES ===== */
                  <div
                    className="rounded-2xl p-10 text-center"
                    style={{
                      border: "1px solid var(--cv-neutral-border)",
                      background: "#fff",
                    }}
                  >
                    <div
                      className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                      style={{ background: "var(--cv-primary-light)" }}
                    >
                      <GraduationCap
                        size={30}
                        style={{ color: "var(--cv-primary)" }}
                      />
                    </div>
                    <h3
                      className="text-lg font-semibold"
                      style={{ color: "var(--cv-neutral-dark)" }}
                    >
                      No courses found
                    </h3>
                    <p
                      className="text-sm mt-2"
                      style={{ color: "var(--cv-neutral-mid)" }}
                    >
                      Try another search or select a different domain.
                    </p>
                    {search && (
                      <button
                        type="button"
                        onClick={() => setSearch("")}
                        className="mt-4 font-semibold"
                        style={{ color: "var(--cv-accent-dark)" }}
                      >
                        Clear Search
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* ===== UNIVERSITY INFO ===== */}
              {normalizedSearch && searchedUniversities.length > 0 && (
                <div className="mt-10">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2
                        className="text-lg md:text-xl font-semibold"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        Matching Universities
                      </h2>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--cv-neutral-mid)" }}
                      >
                        {searchedUniversities.length} universities found
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {searchedUniversities.slice(0, 8).map((university) => {
                      if (!university?.slug) return null;
                      const name =
                        normalizeText(university?.name) || "University";
                      return (
                        <Link
                          key={university?._id || university?.slug}
                          href={`/university/${encodeURIComponent(
                            university.slug
                          )}`}
                          className="bg-white rounded-xl p-3 flex flex-col items-center justify-center min-h-[120px] transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                          style={{
                            border: "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          <Image
                            src={
                              university?.universityImageUrl ||
                              "/fallback-logo.png"
                            }
                            width={80}
                            height={50}
                            alt={`${name} logo`}
                            className="w-20 h-12 object-contain mb-2"
                          />
                          <span
                            className="text-xs font-semibold text-center line-clamp-2"
                            style={{ color: "var(--cv-neutral-dark)" }}
                          >
                            {name}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}