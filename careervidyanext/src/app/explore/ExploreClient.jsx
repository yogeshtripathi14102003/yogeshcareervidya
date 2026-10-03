


// "use client";

// import { useState, useMemo } from "react";
// import { Search, X } from "lucide-react";
// import Header from "../layout/Header";
// import Link from "next/link";
// import Image from "next/image";
// import Footer from "../layout/Footer";

// const BLUE = "#0056B3";

// export default function ExploreClient({ initialData }) {
//   const [courses] = useState(initialData.initialCourses);
//   const [universities] = useState(initialData.initialUnis);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");

//   const categories = [
//     { key: "All", title: "All Courses" },
//     { key: "PG", title: "PG Courses" },
//     { key: "UG", title: "UG Courses" },
//     { key: "ExecutiveEducation", title: "Executive Education" },
//     { key: "Doctorate", title: "Doctorate" },
//   ];

//   const filteredCourses = useMemo(() => {
//     return courses.filter((c) => {
//       const matchesCategory = category === "All" || c.category === category;
//       const matchesSearch = c.name?.toLowerCase().includes(search.toLowerCase()) ||
//                             c.description?.toLowerCase().includes(search.toLowerCase());
//       return matchesCategory && matchesSearch;
//     });
//   }, [courses, category, search]);

//   const filteredUniversities = useMemo(() => {
//     return universities.filter((u) =>
//       u.name?.toLowerCase().includes(search.toLowerCase())
//     );
//   }, [universities, search]);

//   return (
//     <>
//       {/* Pure page ka background hamesha light gray/white rahega */}
//       <main className="min-h-screen bg-gray-50 text-gray-900">
//         <Header />
//         <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-6">

//           {/* SIDEBAR: Fixed White Background & Dark Text */}
//           <aside className="hidden lg:block border border-gray-200 rounded-lg p-4 shadow-sm h-fit sticky top-24 bg-white text-gray-900">
//             {/* ✅ SEO FIX: was <h3>. The sidebar <aside> sits before the
//                 <section> containing this page's <h1> in DOM order, so this
//                 label was becoming the page's FIRST heading — pushing the
//                 real <h1> out of first position (same class of bug as the
//                 Header mega-menu). "Filters" is a UI label, not page content,
//                 so it shouldn't be a heading at all. */}
//             <p className="font-bold text-lg mb-4" style={{ color: BLUE }}>Filters</p>
//             <div className="relative mb-5">
//               <Search className="absolute left-3 top-3 text-gray-400" />
//               <input
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
//               />
//               {search && <X className="absolute right-3 top-3 cursor-pointer text-gray-400" onClick={() => setSearch("")} />}
//             </div>
//             <div>
//               <p className="font-semibold mb-2 text-gray-900">Course Type</p>
//               <div className="flex flex-col gap-2">
//                 {categories.map((c) => (
//                   <button
//                     key={c.key}
//                     onClick={() => setCategory(c.key)}
//                     className={`px-3 py-2 rounded text-sm text-left transition ${
//                       category === c.key
//                         ? "text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                     style={category === c.key ? { background: BLUE } : {}}
//                   >
//                     {c.title}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </aside>

//           {/* MAIN SECTION */}
//           <section className="lg:col-span-3">
//             {/* ✅ Page's main H1 — was an <h2> with a broken "Found  Courses"
//                 string (missing count). Now it's a real H1 with the keyword
//                 this page is meant to rank for, plus the live count. */}
//             <h1 className="text-2xl font-bold mb-4" style={{ color: BLUE }}>
//               Explore {filteredCourses.length} Professional Courses
//             </h1>
//             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//               {filteredCourses.map((course) => (
//                 <Link key={course._id} href={`/course/${course.slug || course._id}`}>
//                   {/* COURSE CARD: Always White Background */}
//                   <div className="bg-white border border-gray-200 rounded-lg h-[130px] flex flex-col justify-between shadow-sm hover:shadow-lg transition cursor-pointer overflow-hidden">
//                     <div className="flex justify-center mt-2">
//                       {/* ✅ SEO FIX: was a plain <img> with no width/height,
//                           which risks Cumulative Layout Shift (a Core Web
//                           Vital / ranking signal) since the browser doesn't
//                           know the image's dimensions until it loads.
//                           next/image requires explicit width/height (or
//                           fill) and handles lazy-loading + responsive
//                           sizing automatically. */}
//                       <Image
//                         src={course.courseLogo?.url || "/placeholder.png"}
//                         width={48}
//                         height={48}
//                         className="w-12 h-12 object-contain"
//                         alt={`${course.name} course logo`}
//                       />
//                     </div>
//                     {/* ✅ SEO FIX: was <h3>, which put a heading right after the
//                         page's <h1> with no <h2> in between (a "levels skip"
//                         heading-order issue) — and there'd be a dozen+ of these
//                         repeated per grid, none of which are real page headings.
//                         Changed to <p> to match the university cards below,
//                         which already use <p> for the same reason. */}
//                     <p className="text-[11px] md:text-xs font-black text-center px-2 line-clamp-2 uppercase text-gray-900">
//                       {course.name}
//                     </p>
//                     <div className="text-white text-[10px] text-center py-1.5 font-bold" style={{ background: BLUE }}>KNOW MORE</div>
//                   </div>
//                 </Link>
//               ))}
//             </div>

//             {/* ✅ h2 — one level below the page's h1, consistent hierarchy */}
//             <h2 className="text-2xl font-bold mt-12 mb-4" style={{ color: BLUE }}>
//               {filteredUniversities.length} Universities Found
//             </h2>
//             <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//               {filteredUniversities.map((u) => (
//                 <Link key={u._id} href={`/university/${u.slug || u._id}`}>
//                   {/* UNIVERSITY CARD: Always White Background */}
//                   <div className="bg-white border border-gray-200 rounded-lg h-[130px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition cursor-pointer p-2">
//                     {/* ✅ Now using the server-resolved URL — no more
//                         NEXT_PUBLIC_API_URL or client-side string building.
//                         ✅ SEO FIX: converted to next/image with explicit
//                         width/height to prevent layout shift (same reasoning
//                         as the course logo above). */}
//                     <Image
//                       src={u.universityImageUrl}
//                       width={64}
//                       height={40}
//                       className="w-16 h-10 object-contain mb-2"
//                       alt={`${u.name} logo`}
//                     />
//                     {/* Text is always dark gray/black */}
//                     <p className="text-[10px] md:text-xs font-bold text-center line-clamp-2 uppercase text-gray-900">
//                       {u.name}
//                     </p>
//                   </div>
//                 </Link>
//               ))}
//             </div>
//           </section>
//         </div>
//       </main>
//       <Footer />
//     </>
//   );
// }



// "use client";

// import { useMemo, useState } from "react";
// import { Search, X } from "lucide-react";
// import Header from "../layout/Header";
// import Link from "next/link";
// import Image from "next/image";
// import Footer from "../layout/Footer";

// const BLUE = "#0056B3";

// // Special redirect courses — these three redirect to
// // /continuing-education-programs instead of their own /course/[slug] page
// const specialRedirectCourses = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// export default function ExploreClient({ initialData }) {
//   const [courses] = useState(initialData?.initialCourses || []);
//   const [universities] = useState(initialData?.initialUnis || []);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");

//   /* =========================================================
//      COURSE CATEGORIES
//   ========================================================= */

//   const categories = [
//     {
//       key: "All",
//       title: "All Courses",
//     },
//     {
//       key: "PG",
//       title: "PG Courses",
//     },
//     {
//       key: "UG",
//       title: "UG Courses",
//     },
//     {
//       key: "ExecutiveEducation",
//       title: "Executive Education",
//     },
//     {
//       key: "Doctorate",
//       title: "Doctorate",
//     },
//   ];

//   /* =========================================================
//      SEARCH VALUE
//   ========================================================= */

//   const normalizedSearch = search.trim().toLowerCase();

//   /* =========================================================
//      FILTER COURSES
//   ========================================================= */

//   const filteredCourses = useMemo(() => {
//     return courses.filter((course) => {
//       const matchesCategory =
//         category === "All" || course?.category === category;

//       const courseName =
//         course?.name?.toLowerCase() || "";

//       const courseDescription =
//         course?.description?.toLowerCase() || "";

//       const matchesSearch =
//         !normalizedSearch ||
//         courseName.includes(normalizedSearch) ||
//         courseDescription.includes(normalizedSearch);

//       return matchesCategory && matchesSearch;
//     });
//   }, [courses, category, normalizedSearch]);

//   /* =========================================================
//      FILTER UNIVERSITIES
//   ========================================================= */

//   const filteredUniversities = useMemo(() => {
//     return universities.filter((university) => {
//       const universityName =
//         university?.name?.toLowerCase() || "";

//       return (
//         !normalizedSearch ||
//         universityName.includes(normalizedSearch)
//       );
//     });
//   }, [universities, normalizedSearch]);

//   /* =========================================================
//      CLEAR SEARCH
//   ========================================================= */

//   const clearSearch = () => {
//     setSearch("");
//   };

//   /* =========================================================
//      RENDER
//   ========================================================= */

//   return (
//     <>
//       <main className="min-h-screen bg-gray-50 text-gray-900">

//         {/* =====================================================
//             HEADER
//         ===================================================== */}

//         <Header />

//         <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

//           {/* ===================================================
//               SIDEBAR
//           =================================================== */}

//           <aside
//             className="hidden lg:block border border-gray-200 rounded-lg p-4 shadow-sm h-fit sticky top-24 bg-white"
//             aria-label="Course filters"
//           >
//             {/* UI label — intentionally not a heading */}
//             <p
//               className="font-bold text-lg mb-4"
//               style={{ color: BLUE }}
//             >
//               Filters
//             </p>

//             {/* SEARCH */}
//             <div className="relative mb-5">
//               <Search
//                 className="absolute left-3 top-3 text-gray-400"
//                 size={20}
//                 aria-hidden="true"
//               />

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 aria-label="Search courses or universities"
//                 className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={clearSearch}
//                   aria-label="Clear search"
//                   className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-700"
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>

//             {/* CATEGORY FILTER */}
//             <div>
//               <p className="font-semibold mb-2 text-gray-900">
//                 Course Type
//               </p>

//               <div className="flex flex-col gap-2">
//                 {categories.map((item) => (
//                   <button
//                     key={item.key}
//                     type="button"
//                     onClick={() => setCategory(item.key)}
//                     aria-pressed={category === item.key}
//                     className={`px-3 py-2 rounded text-sm text-left transition ${
//                       category === item.key
//                         ? "text-white"
//                         : "bg-gray-100 text-gray-700 hover:bg-gray-200"
//                     }`}
//                     style={
//                       category === item.key
//                         ? { background: BLUE }
//                         : {}
//                     }
//                   >
//                     {item.title}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           </aside>

//           {/* ===================================================
//               MAIN CONTENT
//           =================================================== */}

//           <section
//             className="lg:col-span-3"
//             aria-labelledby="explore-courses-heading"
//           >
//             {/* =================================================
//                 PRIMARY H1

//                 Keep this static.
//                 Do NOT change H1 based on search/filter.
//             ================================================= */}

//             <header className="mb-6">
//               <h1
//                 id="explore-courses-heading"
//                 className="text-2xl md:text-3xl font-bold"
//                 style={{ color: BLUE }}
//               >
//                 Explore Online Courses & Universities
//               </h1>

//               <p className="mt-2 text-gray-600 max-w-3xl">
//                 Discover online undergraduate, postgraduate,
//                 executive education, and doctorate programs from
//                 recognized universities in India.
//               </p>
//             </header>

//             {/* =================================================
//                 MOBILE SEARCH
//             ================================================= */}

//             <div className="lg:hidden relative mb-6">
//               <Search
//                 className="absolute left-3 top-3 text-gray-400"
//                 size={20}
//                 aria-hidden="true"
//               />

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 aria-label="Search courses or universities"
//                 className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={clearSearch}
//                   aria-label="Clear search"
//                   className="absolute right-2 top-2 p-1 text-gray-400"
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>

//             {/* =================================================
//                 COURSE SECTION
//             ================================================= */}

//             <section aria-labelledby="courses-heading">
//               <div className="flex items-center justify-between gap-4 mb-4">
//                 <h2
//                   id="courses-heading"
//                   className="text-xl md:text-2xl font-bold"
//                   style={{ color: BLUE }}
//                 >
//                   {search || category !== "All"
//                     ? `${filteredCourses.length} Courses Found`
//                     : "Explore Online Courses"}
//                 </h2>

//                 <span className="text-sm text-gray-500">
//                   {filteredCourses.length} available
//                 </span>
//               </div>

//               {filteredCourses.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {filteredCourses.map((course) => {
//                     if (!course?.slug) return null;

//                     const courseName =
//                       course?.name?.trim() || "Online Course";

//                     const courseImage =
//                       course?.courseLogo?.url ||
//                       "/placeholder.png";

//                     // Special redirect: these three courses go to
//                     // /continuing-education-programs instead of
//                     // their own /course/[slug] page.
//                     const courseHref = specialRedirectCourses.includes(
//                       course.slug
//                     )
//                       ? "/continuing-education-programs"
//                       : `/course/${encodeURIComponent(course.slug)}`;

//                     return (
//                       <Link
//                         key={course._id}
//                         href={courseHref}
//                         aria-label={`View ${courseName}`}
//                         className="block"
//                       >
//                         <article className="bg-white border border-gray-200 rounded-lg min-h-[160px] flex flex-col justify-between shadow-sm hover:shadow-lg transition overflow-hidden">
//                           <div className="flex justify-center items-center pt-3 h-20">
//                             <Image
//                               src={courseImage}
//                               width={56}
//                               height={56}
//                               sizes="56px"
//                               className="w-14 h-14 object-contain"
//                               alt={`${courseName} course logo`}
//                             />
//                           </div>

//                           <p className="text-[11px] md:text-xs font-bold text-center px-2 py-2 line-clamp-2 uppercase text-gray-900">
//                             {courseName}
//                           </p>

//                           <div
//                             className="text-white text-[10px] text-center py-2 font-bold"
//                             style={{ background: BLUE }}
//                           >
//                             KNOW MORE
//                           </div>
//                         </article>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
//                   <p className="text-gray-600">
//                     No courses found for your search.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSearch("");
//                       setCategory("All");
//                     }}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{ color: BLUE }}
//                   >
//                     Clear filters
//                   </button>
//                 </div>
//               )}
//             </section>

//             {/* =================================================
//                 UNIVERSITY SECTION
//             ================================================= */}

//             <section
//               aria-labelledby="universities-heading"
//               className="mt-12"
//             >
//               <div className="flex items-center justify-between gap-4 mb-4">
//                 <h2
//                   id="universities-heading"
//                   className="text-xl md:text-2xl font-bold"
//                   style={{ color: BLUE }}
//                 >
//                   Partner Universities
//                 </h2>

//                 <span className="text-sm text-gray-500">
//                   {filteredUniversities.length} available
//                 </span>
//               </div>

//               {filteredUniversities.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {filteredUniversities.map((university) => {
//                     if (!university?.slug) return null;

//                     const universityName =
//                       university?.name?.trim() ||
//                       "Partner University";

//                     return (
//                       <Link
//                         key={university._id}
//                         href={`/university/${encodeURIComponent(
//                           university.slug
//                         )}`}
//                         aria-label={`View ${universityName}`}
//                         className="block"
//                       >
//                         <article className="bg-white border border-gray-200 rounded-lg min-h-[160px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition p-3"
//                         >
//                           <Image
//                             src={
//                               university.universityImageUrl ||
//                               "/fallback-logo.png"
//                             }
//                             width={80}
//                             height={50}
//                             sizes="80px"
//                             className="w-20 h-12 object-contain mb-3"
//                             alt={`${universityName} logo`}
//                           />

//                           <p className="text-[10px] md:text-xs font-bold text-center line-clamp-2 uppercase text-gray-900">
//                             {universityName}
//                           </p>
//                         </article>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
//                   <p className="text-gray-600">
//                     No universities found for your search.
//                   </p>
//                 </div>
//               )}
//             </section>

//             {/* =================================================
//                 SEO / INTERNAL LINK CTA
//             ================================================= */}

//             <div className="text-center mt-12 mb-4">
//               <Link
//                 href="/course"
//                 className="font-semibold hover:underline"
//                 style={{ color: BLUE }}
//               >
//                 Browse Top Courses
//               </Link>
//             </div>
//           </section>
//         </div>
//       </main>

//       <Footer />
//     </>
//   );
// }


// "use client";

// import { useMemo, useState } from "react";
// import { Search, X } from "lucide-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Header from "../layout/Header";
// import Link from "next/link";
// import Image from "next/image";
// import Footer from "../layout/Footer";
// import api from "@/utlis/api.js";

// const specialRedirectCourses = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// export default function ExploreClient({ initialData }) {
//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("All");
//   const queryClient = useQueryClient();

//   /* ═══════════════════════════════════════════════
//      ✅ REACT QUERY — Courses
//      - initialData use karo → 0 network call on first load
//      - staleTime 5 min → background refetch nahi hoga
//      - same query dobara nahi jaayegi
//   ═══════════════════════════════════════════════ */
//   const {
//     data: courses = [],
//     isLoading: coursesLoading,
//     isError: coursesError,
//   } = useQuery({
//     queryKey: ["explore-courses"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/course");
//       let list = [];
//       if (Array.isArray(res.data)) list = res.data;
//       else if (Array.isArray(res.data.data)) list = res.data.data;
//       else if (Array.isArray(res.data.courses)) list = res.data.courses;
//       return list;
//     },
//     initialData: initialData?.initialCourses || undefined,
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ═══════════════════════════════════════════════
//      ✅ REACT QUERY — Universities
//   ═══════════════════════════════════════════════ */
//   const {
//     data: universities = [],
//     isLoading: unisLoading,
//     isError: unisError,
//   } = useQuery({
//     queryKey: ["explore-universities"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/university");
//       let list = [];
//       if (Array.isArray(res.data)) list = res.data;
//       else if (Array.isArray(res.data.data)) list = res.data.data;
//       else if (Array.isArray(res.data.courses)) list = res.data.courses;
//       return list;
//     },
//     initialData: initialData?.initialUnis || undefined,
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ═══════════════════════════════════════════════
//      CATEGORIES
//   ═══════════════════════════════════════════════ */
//   const categories = [
//     { key: "All", title: "All Courses" },
//     { key: "PG", title: "PG Courses" },
//     { key: "UG", title: "UG Courses" },
//     { key: "ExecutiveEducation", title: "Executive Education" },
//     { key: "Doctorate", title: "Doctorate" },
//   ];

//   const normalizedSearch = search.trim().toLowerCase();

//   /* ═══════════════════════════════════════════════
//      FILTER COURSES — same logic
//   ═══════════════════════════════════════════════ */
//   const filteredCourses = useMemo(() => {
//     return courses.filter((course) => {
//       const matchesCategory =
//         category === "All" || course?.category === category;
//       const courseName = course?.name?.toLowerCase() || "";
//       const courseDescription = course?.description?.toLowerCase() || "";
//       const matchesSearch =
//         !normalizedSearch ||
//         courseName.includes(normalizedSearch) ||
//         courseDescription.includes(normalizedSearch);
//       return matchesCategory && matchesSearch;
//     });
//   }, [courses, category, normalizedSearch]);

//   /* ═══════════════════════════════════════════════
//      FILTER UNIVERSITIES — same logic
//   ═══════════════════════════════════════════════ */
//   const filteredUniversities = useMemo(() => {
//     return universities.filter((university) => {
//       const universityName = university?.name?.toLowerCase() || "";
//       return !normalizedSearch || universityName.includes(normalizedSearch);
//     });
//   }, [universities, normalizedSearch]);

//   const clearSearch = () => setSearch("");

//   /* ═══════════════════════════════════════════════
//      MANUAL REFRESH (agar user chahe)
//   ═══════════════════════════════════════════════ */
//   const handleRefresh = () => {
//     queryClient.invalidateQueries({ queryKey: ["explore-courses"] });
//     queryClient.invalidateQueries({ queryKey: ["explore-universities"] });
//   };

//   /* ═══════════════════════════════════════════════
//      RENDER
//   ═══════════════════════════════════════════════ */
//   return (
//     <>
//       <main
//         className="min-h-screen"
//         style={{
//           background: "var(--cv-neutral-light)",
//           color: "var(--cv-neutral-dark)",
//         }}
//       >
//         <Header />

//         <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* ═══ SIDEBAR ═══ */}
//           <aside
//             className="hidden lg:block border rounded-lg p-4 shadow-sm h-fit sticky top-24 bg-white"
//             style={{ borderColor: "var(--cv-neutral-border)" }}
//             aria-label="Course filters"
//           >
//             <p
//               className="font-bold text-lg mb-4"
//               style={{ color: "var(--cv-primary)" }}
//             >
//               Filters
//             </p>

//             {/* SEARCH */}
//             <div className="relative mb-5">
//               <Search
//                 className="absolute left-3 top-3"
//                 size={20}
//                 style={{ color: "var(--cv-neutral-mid)" }}
//                 aria-hidden="true"
//               />
//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 aria-label="Search courses or universities"
//                 className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white"
//                 style={{
//                   borderColor: "var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor = "var(--cv-primary)";
//                   e.target.style.boxShadow =
//                     "0 0 0 3px rgba(30,58,138,0.1)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor = "var(--cv-neutral-border)";
//                   e.target.style.boxShadow = "none";
//                 }}
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={clearSearch}
//                   aria-label="Clear search"
//                   className="absolute right-2 top-2 p-1 transition-colors"
//                   style={{ color: "var(--cv-neutral-mid)" }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.color = "var(--cv-neutral-dark)")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.color = "var(--cv-neutral-mid)")
//                   }
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>

//             {/* CATEGORY */}
//             <div>
//               <p
//                 className="font-semibold mb-2"
//                 style={{ color: "var(--cv-neutral-dark)" }}
//               >
//                 Course Type
//               </p>

//               <div className="flex flex-col gap-2">
//                 {categories.map((item) => {
//                   const isActive = category === item.key;
//                   return (
//                     <button
//                       key={item.key}
//                       type="button"
//                       onClick={() => setCategory(item.key)}
//                       aria-pressed={isActive}
//                       className="px-3 py-2 rounded text-sm text-left transition"
//                       style={{
//                         background: isActive
//                           ? "var(--cv-primary)"
//                           : "var(--cv-neutral-light)",
//                         color: isActive ? "#fff" : "var(--cv-neutral-dark)",
//                       }}
//                       onMouseEnter={(e) => {
//                         if (!isActive) {
//                           e.currentTarget.style.background =
//                             "var(--cv-primary-light)";
//                           e.currentTarget.style.color = "var(--cv-primary)";
//                         }
//                       }}
//                       onMouseLeave={(e) => {
//                         if (!isActive) {
//                           e.currentTarget.style.background =
//                             "var(--cv-neutral-light)";
//                           e.currentTarget.style.color =
//                             "var(--cv-neutral-dark)";
//                         }
//                       }}
//                     >
//                       {item.title}
//                     </button>
//                   );
//                 })}
//               </div>
//             </div>
//           </aside>

//           {/* ═══ MAIN ═══ */}
//           <section
//             className="lg:col-span-3"
//             aria-labelledby="explore-courses-heading"
//           >
//             <header className="mb-6">
//               <h1
//                 id="explore-courses-heading"
//                 className="text-2xl md:text-3xl font-bold"
//                 style={{ color: "var(--cv-primary)" }}
//               >
//                 Explore Online Courses & Universities
//               </h1>
//               <p
//                 className="mt-2 max-w-3xl"
//                 style={{ color: "var(--cv-neutral-mid)" }}
//               >
//                 Discover online undergraduate, postgraduate, executive
//                 education, and doctorate programs from recognized universities
//                 in India.
//               </p>
//             </header>

//             {/* MOBILE SEARCH */}
//             <div className="lg:hidden relative mb-6">
//               <Search
//                 className="absolute left-3 top-3"
//                 size={20}
//                 style={{ color: "var(--cv-neutral-mid)" }}
//                 aria-hidden="true"
//               />
//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 aria-label="Search courses or universities"
//                 className="w-full pl-10 pr-10 py-2 border rounded-lg bg-white"
//                 style={{
//                   borderColor: "var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//               />
//               {search && (
//                 <button
//                   type="button"
//                   onClick={clearSearch}
//                   aria-label="Clear search"
//                   className="absolute right-2 top-2 p-1"
//                   style={{ color: "var(--cv-neutral-mid)" }}
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>

//             {/* ═══ COURSES ═══ */}
//             <section aria-labelledby="courses-heading">
//               <div className="flex items-center justify-between gap-4 mb-4">
//                 <h2
//                   id="courses-heading"
//                   className="text-xl md:text-2xl font-bold"
//                   style={{ color: "var(--cv-primary)" }}
//                 >
//                   {search || category !== "All"
//                     ? `${filteredCourses.length} Courses Found`
//                     : "Explore Online Courses"}
//                 </h2>

//                 <span
//                   className="text-sm"
//                   style={{ color: "var(--cv-neutral-mid)" }}
//                 >
//                   {filteredCourses.length} available
//                 </span>
//               </div>

//               {/* Loading state */}
//               {coursesLoading && !courses.length ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {[...Array(8)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="animate-pulse bg-white rounded-lg min-h-[160px]"
//                       style={{ border: "1px solid var(--cv-neutral-border)" }}
//                     />
//                   ))}
//                 </div>
//               ) : coursesError && !courses.length ? (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{ border: "1px solid var(--cv-neutral-border)" }}
//                 >
//                   <p style={{ color: "var(--cv-neutral-mid)" }}>
//                     Couldn't load courses. Please try again.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{ color: "var(--cv-primary)" }}
//                   >
//                     Try again
//                   </button>
//                 </div>
//               ) : filteredCourses.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {filteredCourses.map((course) => {
//                     if (!course?.slug) return null;

//                     const courseName =
//                       course?.name?.trim() || "Online Course";
//                     const courseImage =
//                       course?.courseLogo?.url || "/placeholder.png";

//                     const courseHref = specialRedirectCourses.includes(
//                       course.slug
//                     )
//                       ? "/continuing-education-programs"
//                       : `/course/${encodeURIComponent(course.slug)}`;

//                     return (
//                       <Link
//                         key={course._id}
//                         href={courseHref}
//                         aria-label={`View ${courseName}`}
//                         className="block"
//                       >
//                         <article
//                           className="bg-white rounded-lg min-h-[160px] flex flex-col justify-between shadow-sm hover:shadow-lg transition overflow-hidden"
//                           style={{
//                             border: "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           <div className="flex justify-center items-center pt-3 h-20">
//                             <Image
//                               src={courseImage}
//                               width={56}
//                               height={56}
//                               sizes="56px"
//                               className="w-14 h-14 object-contain"
//                               alt={`${courseName} course logo`}
//                             />
//                           </div>

//                           <p
//                             className="text-[11px] md:text-xs font-bold text-center px-2 py-2 line-clamp-2 uppercase"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {courseName}
//                           </p>

//                           <div
//                             className="text-white text-[10px] text-center py-2 font-bold"
//                             style={{ background: "var(--cv-primary)" }}
//                           >
//                             KNOW MORE
//                           </div>
//                         </article>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{ border: "1px solid var(--cv-neutral-border)" }}
//                 >
//                   <p style={{ color: "var(--cv-neutral-mid)" }}>
//                     No courses found for your search.
//                   </p>
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSearch("");
//                       setCategory("All");
//                     }}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{ color: "var(--cv-primary)" }}
//                   >
//                     Clear filters
//                   </button>
//                 </div>
//               )}
//             </section>

//             {/* ═══ UNIVERSITIES ═══ */}
//             <section
//               aria-labelledby="universities-heading"
//               className="mt-12"
//             >
//               <div className="flex items-center justify-between gap-4 mb-4">
//                 <h2
//                   id="universities-heading"
//                   className="text-xl md:text-2xl font-bold"
//                   style={{ color: "var(--cv-primary)" }}
//                 >
//                   Partner Universities
//                 </h2>

//                 <span
//                   className="text-sm"
//                   style={{ color: "var(--cv-neutral-mid)" }}
//                 >
//                   {filteredUniversities.length} available
//                 </span>
//               </div>

//               {unisLoading && !universities.length ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {[...Array(8)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="animate-pulse bg-white rounded-lg min-h-[160px]"
//                       style={{ border: "1px solid var(--cv-neutral-border)" }}
//                     />
//                   ))}
//                 </div>
//               ) : unisError && !universities.length ? (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{ border: "1px solid var(--cv-neutral-border)" }}
//                 >
//                   <p style={{ color: "var(--cv-neutral-mid)" }}>
//                     Couldn't load universities. Please try again.
//                   </p>
//                 </div>
//               ) : filteredUniversities.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {filteredUniversities.map((university) => {
//                     if (!university?.slug) return null;

//                     const universityName =
//                       university?.name?.trim() || "Partner University";

//                     return (
//                       <Link
//                         key={university._id}
//                         href={`/university/${encodeURIComponent(
//                           university.slug
//                         )}`}
//                         aria-label={`View ${universityName}`}
//                         className="block"
//                       >
//                         <article
//                           className="bg-white rounded-lg min-h-[160px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition p-3"
//                           style={{
//                             border: "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           <Image
//                             src={
//                               university.universityImageUrl ||
//                               "/fallback-logo.png"
//                             }
//                             width={80}
//                             height={50}
//                             sizes="80px"
//                             className="w-20 h-12 object-contain mb-3"
//                             alt={`${universityName} logo`}
//                           />
//                           <p
//                             className="text-[10px] md:text-xs font-bold text-center line-clamp-2 uppercase"
//                             style={{ color: "var(--cv-neutral-dark)" }}
//                           >
//                             {universityName}
//                           </p>
//                         </article>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{ border: "1px solid var(--cv-neutral-border)" }}
//                 >
//                   <p style={{ color: "var(--cv-neutral-mid)" }}>
//                     No universities found for your search.
//                   </p>
//                 </div>
//               )}
//             </section>

//             {/* CTA */}
//             <div className="text-center mt-12 mb-4">
//               <Link
//                 href="/course"
//                 className="font-semibold hover:underline"
//                 style={{ color: "var(--cv-primary)" }}
//               >
//                 Browse Top Courses
//               </Link>
//             </div>
//           </section>
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
//   GraduationCap,
//   Building2,
// } from "lucide-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Header from "../layout/Header";
// import Link from "next/link";
// import Image from "next/image";
// import Footer from "../layout/Footer";
// import api from "@/utlis/api.js";

// const specialRedirectCourses = [
//   "btech-for-working-professional",
//   "mtech-for-working-professionals",
//   "diploma-for-working-professionals",
// ];

// export default function ExploreClient({ initialData }) {
//   const [search, setSearch] = useState("");
//   const queryClient = useQueryClient();

//   /* ═══════════════════════════════════════════════
//      REACT QUERY — Courses
//      ═══════════════════════════════════════════════ */
//   const {
//     data: courses = [],
//     isLoading: coursesLoading,
//     isError: coursesError,
//   } = useQuery({
//     queryKey: ["explore-courses"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/course");

//       let list = [];

//       if (Array.isArray(res.data)) {
//         list = res.data;
//       } else if (Array.isArray(res.data.data)) {
//         list = res.data.data;
//       } else if (Array.isArray(res.data.courses)) {
//         list = res.data.courses;
//       }

//       return list;
//     },
//     initialData: initialData?.initialCourses || undefined,
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ═══════════════════════════════════════════════
//      REACT QUERY — Universities
//      ═══════════════════════════════════════════════ */
//   const {
//     data: universities = [],
//     isLoading: unisLoading,
//     isError: unisError,
//   } = useQuery({
//     queryKey: ["explore-universities"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/university");

//       let list = [];

//       if (Array.isArray(res.data)) {
//         list = res.data;
//       } else if (Array.isArray(res.data.data)) {
//         list = res.data.data;
//       } else if (Array.isArray(res.data.courses)) {
//         list = res.data.courses;
//       }

//       return list;
//     },
//     initialData: initialData?.initialUnis || undefined,
//     staleTime: 5 * 60 * 1000,
//   });

//   const normalizedSearch = search.trim().toLowerCase();

//   /* ═══════════════════════════════════════════════
//      GET SPECIALIZATION NAMES
//      Supports:
//      - ["Finance", "Marketing"]
//      - [{ name: "Finance" }]
//      - [{ title: "Marketing" }]
//      ═══════════════════════════════════════════════ */
//   const getSpecializationNames = (course) => {
//     const specializations = Array.isArray(course?.specializations)
//       ? course.specializations
//       : [];

//     return specializations
//       .map((item) => {
//         if (typeof item === "string") {
//           return item.trim();
//         }

//         if (item && typeof item === "object") {
//           return (
//             item?.name?.trim() ||
//             item?.title?.trim() ||
//             item?.specializationName?.trim() ||
//             ""
//           );
//         }

//         return "";
//       })
//       .filter(Boolean);
//   };

//   /* ═══════════════════════════════════════════════
//      FILTER COURSES
     
//      Search works on:
//      - Course name
//      - Course description
//      - Specialization names
     
//      Category filter completely removed.
//      ═══════════════════════════════════════════════ */
//   const filteredCourses = useMemo(() => {
//     return courses.filter((course) => {
//       const courseName = course?.name?.toLowerCase() || "";
//       const courseDescription =
//         course?.description?.toLowerCase() || "";

//       const specializationNames = getSpecializationNames(course);

//       const specializationText = specializationNames
//         .join(" ")
//         .toLowerCase();

//       return (
//         !normalizedSearch ||
//         courseName.includes(normalizedSearch) ||
//         courseDescription.includes(normalizedSearch) ||
//         specializationText.includes(normalizedSearch)
//       );
//     });
//   }, [courses, normalizedSearch]);

//   /* ═══════════════════════════════════════════════
//      FILTER UNIVERSITIES
//      ═══════════════════════════════════════════════ */
//   const filteredUniversities = useMemo(() => {
//     return universities.filter((university) => {
//       const universityName =
//         university?.name?.toLowerCase() || "";

//       return (
//         !normalizedSearch ||
//         universityName.includes(normalizedSearch)
//       );
//     });
//   }, [universities, normalizedSearch]);

//   const clearSearch = () => {
//     setSearch("");
//   };

//   /* ═══════════════════════════════════════════════
//      MANUAL REFRESH
//      ═══════════════════════════════════════════════ */
//   const handleRefresh = () => {
//     queryClient.invalidateQueries({
//       queryKey: ["explore-courses"],
//     });

//     queryClient.invalidateQueries({
//       queryKey: ["explore-universities"],
//     });
//   };

//   /* ═══════════════════════════════════════════════
//      RENDER
//      ═══════════════════════════════════════════════ */
//   return (
//     <>
//       <main
//         className="min-h-screen"
//         style={{
//           background: "var(--cv-neutral-light)",
//           color: "var(--cv-neutral-dark)",
//         }}
//       >
//         <Header />

//         <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
//           {/* ═══════════════════════════════════════
//               SIDEBAR
//               ═══════════════════════════════════════ */}
//           <aside
//             className="hidden lg:block border rounded-lg p-4 shadow-sm h-fit sticky top-24 bg-white"
//             style={{
//               borderColor: "var(--cv-neutral-border)",
//             }}
//             aria-label="Course search"
//           >
//             <p
//               className="font-bold text-lg mb-4"
//               style={{
//                 color: "var(--cv-primary)",
//               }}
//             >
//               Search
//             </p>

//             {/* SEARCH */}
//             <div className="relative">
//               <Search
//                 className="absolute left-3 top-3"
//                 size={20}
//                 style={{
//                   color: "var(--cv-neutral-mid)",
//                 }}
//                 aria-hidden="true"
//               />

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 aria-label="Search courses or universities"
//                 className="w-full pl-10 pr-10 py-2 border rounded-lg focus:outline-none bg-white"
//                 style={{
//                   borderColor: "var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//                 onFocus={(e) => {
//                   e.target.style.borderColor =
//                     "var(--cv-primary)";

//                   e.target.style.boxShadow =
//                     "0 0 0 3px rgba(30,58,138,0.1)";
//                 }}
//                 onBlur={(e) => {
//                   e.target.style.borderColor =
//                     "var(--cv-neutral-border)";

//                   e.target.style.boxShadow = "none";
//                 }}
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={clearSearch}
//                   aria-label="Clear search"
//                   className="absolute right-2 top-2 p-1 transition-colors"
//                   style={{
//                     color: "var(--cv-neutral-mid)",
//                   }}
//                   onMouseEnter={(e) =>
//                     (e.currentTarget.style.color =
//                       "var(--cv-neutral-dark)")
//                   }
//                   onMouseLeave={(e) =>
//                     (e.currentTarget.style.color =
//                       "var(--cv-neutral-mid)")
//                   }
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>
//           </aside>

//           {/* ═══════════════════════════════════════
//               MAIN
//               ═══════════════════════════════════════ */}
//           <section
//             className="lg:col-span-3"
//             aria-labelledby="explore-courses-heading"
//           >
//             <header className="mb-6">
//               <h1
//                 id="explore-courses-heading"
//                 className="text-2xl md:text-3xl font-bold"
//                 style={{
//                   color: "var(--cv-primary)",
//                 }}
//               >
//                 Explore Online Courses & Universities
//               </h1>

//               <p
//                 className="mt-2 max-w-3xl"
//                 style={{
//                   color: "var(--cv-neutral-mid)",
//                 }}
//               >
//                 Discover online undergraduate, postgraduate,
//                 diploma, executive education, and doctorate
//                 programs from recognized universities in India.
//               </p>
//             </header>

//             {/* ═══════════════════════════════════════
//                 MOBILE SEARCH
//                 ═══════════════════════════════════════ */}
//             <div className="lg:hidden relative mb-6">
//               <Search
//                 className="absolute left-3 top-3"
//                 size={20}
//                 style={{
//                   color: "var(--cv-neutral-mid)",
//                 }}
//                 aria-hidden="true"
//               />

//               <input
//                 type="search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search courses or universities..."
//                 aria-label="Search courses or universities"
//                 className="w-full pl-10 pr-10 py-2 border rounded-lg bg-white"
//                 style={{
//                   borderColor: "var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//               />

//               {search && (
//                 <button
//                   type="button"
//                   onClick={clearSearch}
//                   aria-label="Clear search"
//                   className="absolute right-2 top-2 p-1"
//                   style={{
//                     color: "var(--cv-neutral-mid)",
//                   }}
//                 >
//                   <X size={20} />
//                 </button>
//               )}
//             </div>

//             {/* ═══════════════════════════════════════
//                 COURSES
//                 ═══════════════════════════════════════ */}
//             <section aria-labelledby="courses-heading">
//               <div className="flex items-center justify-between gap-4 mb-4">
//                 <h2
//                   id="courses-heading"
//                   className="text-xl md:text-2xl font-bold"
//                   style={{
//                     color: "var(--cv-primary)",
//                   }}
//                 >
//                   {search
//                     ? `${filteredCourses.length} Courses Found`
//                     : "Explore Online Courses"}
//                 </h2>

//                 <span
//                   className="text-sm"
//                   style={{
//                     color: "var(--cv-neutral-mid)",
//                   }}
//                 >
//                   {filteredCourses.length} available
//                 </span>
//               </div>

//               {/* Loading */}
//               {coursesLoading && !courses.length ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {[...Array(8)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="animate-pulse bg-white rounded-lg min-h-[190px]"
//                       style={{
//                         border:
//                           "1px solid var(--cv-neutral-border)",
//                       }}
//                     />
//                   ))}
//                 </div>
//               ) : coursesError && !courses.length ? (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{
//                     border:
//                       "1px solid var(--cv-neutral-border)",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     Couldn't load courses. Please try again.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{
//                       color: "var(--cv-primary)",
//                     }}
//                   >
//                     Try again
//                   </button>
//                 </div>
//               ) : filteredCourses.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {filteredCourses.map((course) => {
//                     if (!course?.slug) return null;

//                     const courseName =
//                       course?.name?.trim() ||
//                       "Online Course";

//                     const courseImage =
//                       course?.courseLogo?.url ||
//                       "/placeholder.png";

//                     /* Specializations */
//                     const specializationNames =
//                       getSpecializationNames(course);

//                     const specializationCount =
//                       specializationNames.length;

//                     const courseHref =
//                       specialRedirectCourses.includes(
//                         course.slug
//                       )
//                         ? "/continuing-education-programs"
//                         : `/course/${encodeURIComponent(
//                             course.slug
//                           )}`;

//                     return (
//                       <Link
//                         key={course._id}
//                         href={courseHref}
//                         aria-label={`View ${courseName}`}
//                         className="block"
//                       >
//                         <article
//                           className="bg-white rounded-lg min-h-[190px] flex flex-col justify-between shadow-sm hover:shadow-lg transition overflow-hidden"
//                           style={{
//                             border:
//                               "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           {/* COURSE IMAGE */}
//                           <div className="flex justify-center items-center pt-3 h-20">
//                             <Image
//                               src={courseImage}
//                               width={56}
//                               height={56}
//                               sizes="56px"
//                               className="w-14 h-14 object-contain"
//                               alt={`${courseName} course logo`}
//                             />
//                           </div>

//                           {/* COURSE NAME */}
//                           <p
//                             className="text-[11px] md:text-xs font-bold text-center px-2 pt-2 line-clamp-2 uppercase"
//                             style={{
//                               color:
//                                 "var(--cv-neutral-dark)",
//                             }}
//                           >
//                             {courseName}
//                           </p>

//                           {/* SPECIALIZATIONS */}
//                           {specializationCount > 0 && (
//                             <div className="px-2 pb-2 text-center">
//                               <p
//                                 className="text-[10px] md:text-xs font-semibold"
//                                 style={{
//                                   color:
//                                     "var(--cv-primary)",
//                                 }}
//                               >
//                                 {specializationCount}{" "}
//                                 {specializationCount === 1
//                                   ? "Specialization"
//                                   : "Specializations"}
//                               </p>

//                               <p
//                                 className="text-[9px] md:text-[10px] mt-1 line-clamp-2"
//                                 style={{
//                                   color:
//                                     "var(--cv-neutral-mid)",
//                                 }}
//                               >
//                                 {specializationNames
//                                   .slice(0, 2)
//                                   .join(" • ")}

//                                 {specializationCount > 2 &&
//                                   " + more"}
//                               </p>
//                             </div>
//                           )}

//                           {/* NO SPECIALIZATION */}
//                           {specializationCount === 0 && (
//                             <div className="h-7" />
//                           )}

//                           {/* KNOW MORE */}
//                           <div
//                             className="text-white text-[10px] text-center py-2 font-bold"
//                             style={{
//                               background:
//                                 "var(--cv-primary)",
//                             }}
//                           >
//                             KNOW MORE
//                           </div>
//                         </article>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{
//                     border:
//                       "1px solid var(--cv-neutral-border)",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     No courses found for your search.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSearch("");
//                     }}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{
//                       color: "var(--cv-primary)",
//                     }}
//                   >
//                     Clear search
//                   </button>
//                 </div>
//               )}
//             </section>

//             {/* ═══════════════════════════════════════
//                 UNIVERSITIES
//                 ═══════════════════════════════════════ */}
//             <section
//               aria-labelledby="universities-heading"
//               className="mt-12"
//             >
//               <div className="flex items-center justify-between gap-4 mb-4">
//                 <h2
//                   id="universities-heading"
//                   className="text-xl md:text-2xl font-bold"
//                   style={{
//                     color: "var(--cv-primary)",
//                   }}
//                 >
//                   Partner Universities
//                 </h2>

//                 <span
//                   className="text-sm"
//                   style={{
//                     color: "var(--cv-neutral-mid)",
//                   }}
//                 >
//                   {filteredUniversities.length} available
//                 </span>
//               </div>

//               {unisLoading && !universities.length ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {[...Array(8)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="animate-pulse bg-white rounded-lg min-h-[160px]"
//                       style={{
//                         border:
//                           "1px solid var(--cv-neutral-border)",
//                       }}
//                     />
//                   ))}
//                 </div>
//               ) : unisError && !universities.length ? (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{
//                     border:
//                       "1px solid var(--cv-neutral-border)",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     Couldn't load universities. Please try
//                     again.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{
//                       color: "var(--cv-primary)",
//                     }}
//                   >
//                     Try again
//                   </button>
//                 </div>
//               ) : filteredUniversities.length > 0 ? (
//                 <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
//                   {filteredUniversities.map((university) => {
//                     if (!university?.slug) return null;

//                     const universityName =
//                       university?.name?.trim() ||
//                       "Partner University";

//                     return (
//                       <Link
//                         key={university._id}
//                         href={`/university/${encodeURIComponent(
//                           university.slug
//                         )}`}
//                         aria-label={`View ${universityName}`}
//                         className="block"
//                       >
//                         <article
//                           className="bg-white rounded-lg min-h-[160px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition p-3"
//                           style={{
//                             border:
//                               "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           <Image
//                             src={
//                               university.universityImageUrl ||
//                               "/fallback-logo.png"
//                             }
//                             width={80}
//                             height={50}
//                             sizes="80px"
//                             className="w-20 h-12 object-contain mb-3"
//                             alt={`${universityName} logo`}
//                           />

//                           <p
//                             className="text-[10px] md:text-xs font-bold text-center line-clamp-2 uppercase"
//                             style={{
//                               color:
//                                 "var(--cv-neutral-dark)",
//                             }}
//                           >
//                             {universityName}
//                           </p>
//                         </article>
//                       </Link>
//                     );
//                   })}
//                 </div>
//               ) : (
//                 <div
//                   className="bg-white rounded-lg p-8 text-center"
//                   style={{
//                     border:
//                       "1px solid var(--cv-neutral-border)",
//                   }}
//                 >
//                   <p
//                     style={{
//                       color: "var(--cv-neutral-mid)",
//                     }}
//                   >
//                     No universities found for your search.
//                   </p>
//                 </div>
//               )}
//             </section>

//             {/* CTA */}
//             <div className="text-center mt-12 mb-4">
//               <Link
//                 href="/course"
//                 className="font-semibold hover:underline"
//                 style={{
//                   color: "var(--cv-primary)",
//                 }}
//               >
//                 Browse Top Courses
//               </Link>
//             </div>
//           </section>
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
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

import Header from "../layout/Header";
import Footer from "../layout/Footer";
import api from "@/utlis/api.js";

/* =========================================================
   SPECIAL COURSE REDIRECTS
========================================================= */

const specialRedirectCourses = [
  "btech-for-working-professional",
  "mtech-for-working-professionals",
  "diploma-for-working-professionals",
];

/* =========================================================
   BROWSE BY DOMAINS
========================================================= */

const domains = [
  {
    key: "PG",
    title: "PG Courses",
    subtitle: "After Graduation",
  },
  {
    key: "UG",
    title: "UG Courses",
    subtitle: "After 12th",
  },
  {
    key: "Diploma",
    title: "Diploma Programs",
    subtitle: "Diploma & Professional Programs",
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
  if (value === null || value === undefined) {
    return "";
  }

  return String(value).trim();
};

/* =========================================================
   GET COURSE CATEGORY
========================================================= */

const getCourseCategory = (course) => {
  return normalizeText(
    course?.category ||
      course?.courseCategory ||
      course?.type ||
      course?.courseType
  );
};

/* =========================================================
   CATEGORY MATCHING
========================================================= */

const matchesDomain = (course, domain) => {
  if (!course) return false;

  const category = getCourseCategory(course)
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const domainKey = domain
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  if (domainKey === "pg") {
    return (
      category === "pg" ||
      category === "postgraduate" ||
      category === "postgraduatecourses"
    );
  }

  if (domainKey === "ug") {
    return (
      category === "ug" ||
      category === "undergraduate" ||
      category === "undergraduatecourses"
    );
  }

  if (domainKey === "executiveeducation") {
    return (
      category === "executiveeducation" ||
      category === "executive" ||
      category === "executiveeducationcourses"
    );
  }

  if (domainKey === "doctorate") {
    return (
      category === "doctorate" ||
      category === "phd" ||
      category === "ph.d." ||
      category === "doctoral"
    );
  }

  if (domainKey === "engineering") {
    return (
      category === "engineering" ||
      category === "engineeringcourses"
    );
  }

  if (domainKey === "studyabroad") {
    return (
      category === "studyabroad" ||
      category === "study abroad"
    );
  }

  if (domainKey === "skilling") {
    return (
      category === "skilling" ||
      category === "certificate" ||
      category === "certification" ||
      category === "skill"
    );
  }

  if (domainKey === "diploma") {
    return (
      category === "diploma" ||
      category === "diplomacourses" ||
      category === "diplomaprograms"
    );
  }

  if (domainKey === "genai") {
    const name = normalizeText(
      course?.name
    ).toLowerCase();

    const description = normalizeText(
      course?.description
    ).toLowerCase();

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

/* =========================================================
   SPECIALIZATION NAME
========================================================= */

const getSpecializationName = (item) => {
  if (!item) return "";

  if (typeof item === "string") {
    return item.trim();
  }

  if (typeof item === "object") {
    return (
      normalizeText(item?.name) ||
      normalizeText(item?.title) ||
      normalizeText(
        item?.specializationName
      ) ||
      normalizeText(
        item?.specialization
      ) ||
      normalizeText(item?.label) ||
      ""
    );
  }

  return "";
};

/* =========================================================
   UNIVERSITY ARRAY
========================================================= */

const getUniversitiesArray = (item) => {
  if (!item) return [];

  const possibleArrays = [
    item?.universities,
    item?.university,
    item?.universityList,
    item?.universityIds,
    item?.universityData,
  ];

  for (const value of possibleArrays) {
    if (Array.isArray(value)) {
      return value;
    }
  }

  return [];
};

/* =========================================================
   UNIVERSITY COUNT
========================================================= */

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
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  const universities =
    getUniversitiesArray(item);

  if (universities.length) {
    return universities.length;
  }

  return null;
};

/* =========================================================
   COURSE SPECIALIZATIONS
========================================================= */

const getCourseSpecializations = (
  course
) => {
  if (!course) return [];

  const raw =
    course?.specializations ??
    course?.specialization ??
    course?.specializationList ??
    course?.specializationData ??
    [];

  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((item) => {
      if (typeof item === "string") {
        return {
          name: item.trim(),
          universityCount: null,
          universities: [],
        };
      }

      return {
        name: getSpecializationName(item),
        universityCount:
          getUniversityCount(item),
        universities:
          getUniversitiesArray(item),
      };
    })
    .filter((item) => item.name);
};

/* =========================================================
   COURSE UNIVERSITY COUNT
========================================================= */

const getCourseUniversityCount = (
  course
) => {
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
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return null;
};

/* =========================================================
   SPECIALIZATION COUNT
========================================================= */

const getSpecializationCount = (
  course
) => {
  const directValues = [
    course?.specializationCount,
    course?.specializationsCount,
    course?.totalSpecializations,
  ];

  for (const value of directValues) {
    if (
      typeof value === "number" &&
      Number.isFinite(value)
    ) {
      return value;
    }

    if (
      typeof value === "string" &&
      value.trim() !== "" &&
      !Number.isNaN(Number(value))
    ) {
      return Number(value);
    }
  }

  return getCourseSpecializations(course)
    .length;
};

/* =========================================================
   COURSE IMAGE
========================================================= */

const getCourseImage = (course) => {
  return (
    course?.courseLogo?.url ||
    course?.courseImageUrl ||
    course?.imageUrl ||
    course?.image ||
    "/placeholder.png"
  );
};

/* =========================================================
   COURSE LINK
========================================================= */

const getCourseHref = (course) => {
  if (!course?.slug) {
    return "/course";
  }

  if (
    specialRedirectCourses.includes(
      course.slug
    )
  ) {
    return "/continuing-education-programs";
  }

  return `/course/${encodeURIComponent(
    course.slug
  )}`;
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function ExploreClient({
  initialData,
}) {
  const [search, setSearch] = useState("");

  const [activeDomain, setActiveDomain] =
    useState("PG");

  const [showAllDomains, setShowAllDomains] =
    useState(false);

  /* =======================================================
     COURSES
  ======================================================= */

  const {
    data: courses = [],
    isLoading: coursesLoading,
  } = useQuery({
    queryKey: ["explore-courses"],

    queryFn: async () => {
      const response = await api.get(
        "/api/v1/course"
      );

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (
        Array.isArray(
          response.data?.data
        )
      ) {
        return response.data.data;
      }

      if (
        Array.isArray(
          response.data?.courses
        )
      ) {
        return response.data.courses;
      }

      return [];
    },

    initialData:
      initialData?.initialCourses ||
      undefined,

    staleTime: 5 * 60 * 1000,
  });

  /* =======================================================
     UNIVERSITIES
  ======================================================= */

  const {
    data: universities = [],
  } = useQuery({
    queryKey: ["explore-universities"],

    queryFn: async () => {
      const response = await api.get(
        "/api/v1/university"
      );

      if (Array.isArray(response.data)) {
        return response.data;
      }

      if (
        Array.isArray(
          response.data?.data
        )
      ) {
        return response.data.data;
      }

      if (
        Array.isArray(
          response.data?.universities
        )
      ) {
        return response.data.universities;
      }

      return [];
    },

    initialData:
      initialData?.initialUnis ||
      undefined,

    staleTime: 5 * 60 * 1000,
  });

  /* =======================================================
     SEARCH
  ======================================================= */

  const normalizedSearch =
    search.trim().toLowerCase();

  /* =======================================================
     DOMAIN COURSES
  ======================================================= */

  const domainCourses = useMemo(() => {
    let list = courses.filter(
      (course) =>
        matchesDomain(
          course,
          activeDomain
        )
    );

    /*
     * Fallback:
     * If backend category names do not exactly
     * match the selected domain, PG is commonly
     * returned directly.
     */
    if (
      list.length === 0 &&
      activeDomain === "PG"
    ) {
      list = courses.filter((course) => {
        const category =
          getCourseCategory(course)
            .toLowerCase();

        return (
          category === "pg" ||
          category.includes("post")
        );
      });
    }

    return list;
  }, [
    courses,
    activeDomain,
  ]);

  /* =======================================================
     SEARCHED COURSES
  ======================================================= */

  const filteredCourses = useMemo(() => {
    if (!normalizedSearch) {
      return domainCourses;
    }

    return domainCourses.filter(
      (course) => {
        const courseName =
          normalizeText(
            course?.name
          ).toLowerCase();

        const description =
          normalizeText(
            course?.description
          ).toLowerCase();

        const specializations =
          getCourseSpecializations(
            course
          );

        const specializationText =
          specializations
            .map(
              (item) =>
                item.name
            )
            .join(" ")
            .toLowerCase();

        return (
          courseName.includes(
            normalizedSearch
          ) ||
          description.includes(
            normalizedSearch
          ) ||
          specializationText.includes(
            normalizedSearch
          )
        );
      }
    );
  }, [
    domainCourses,
    normalizedSearch,
  ]);

  /* =======================================================
     ALL SEARCH RESULTS
     Used when searching across domains.
  ======================================================= */

  const allSearchResults = useMemo(() => {
    if (!normalizedSearch) {
      return filteredCourses;
    }

    const results = courses.filter(
      (course) => {
        const name =
          normalizeText(
            course?.name
          ).toLowerCase();

        const description =
          normalizeText(
            course?.description
          ).toLowerCase();

        const specializationText =
          getCourseSpecializations(
            course
          )
            .map(
              (item) =>
                item.name
            )
            .join(" ")
            .toLowerCase();

        return (
          name.includes(
            normalizedSearch
          ) ||
          description.includes(
            normalizedSearch
          ) ||
          specializationText.includes(
            normalizedSearch
          )
        );
      }
    );

    return results.length
      ? results
      : filteredCourses;
  }, [
    courses,
    filteredCourses,
    normalizedSearch,
  ]);

  /* =======================================================
     COURSE LIST
  ======================================================= */

  const visibleCourses =
    normalizedSearch
      ? allSearchResults
      : filteredCourses;

  /* =======================================================
     UNIVERSITY SEARCH
  ======================================================= */

  const searchedUniversities =
    useMemo(() => {
      if (!normalizedSearch) {
        return universities;
      }

      return universities.filter(
        (university) =>
          normalizeText(
            university?.name
          )
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }, [
      universities,
      normalizedSearch,
    ]);

  /* =======================================================
     DISPLAY DOMAINS
  ======================================================= */

  const displayedDomains =
    showAllDomains
      ? domains
      : domains.slice(0, 8);

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <Header />

      <main
        className="min-h-screen bg-white"
        style={{
          color:
            "var(--cv-neutral-dark)",
        }}
      >
        {/* =================================================
            TOP BAR
        ================================================= */}

        <div className="max-w-[1600px] mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5">
          <div className="flex items-center justify-between gap-4">
            <h1
              className="text-lg sm:text-xl md:text-2xl font-semibold"
              style={{
                color:
                  "var(--cv-primary)",
              }}
            >
              Browse by domains
            </h1>

            <div className="flex items-center gap-3">
              {/* CLOSE */}

              <button
                type="button"
                aria-label="Close"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-gray-100 transition"
              >
                <X
                  size={23}
                  strokeWidth={1.8}
                  style={{
                    color:
                      "var(--cv-neutral-dark)",
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* =================================================
            MAIN AREA
        ================================================= */}

        <div className="max-w-[1600px] mx-auto px-0 md:px-4 pb-8 sm:pb-10">
          <div className="grid grid-cols-1 lg:grid-cols-[375px_1fr] gap-0 lg:gap-10 mt-5">
            {/* =================================================
                LEFT DOMAIN SIDEBAR
            ================================================= */}

            <aside className="hidden lg:block border-r min-h-[650px]">
              <div className="px-4 md:px-6 lg:px-0 lg:pr-6">
                <div className="space-y-1">
                  {displayedDomains.map(
                    (domain) => {
                      const active =
                        activeDomain ===
                        domain.key;

                      return (
                        <button
                          key={
                            domain.key
                          }
                          type="button"
                          onClick={() => {
                            setActiveDomain(
                              domain.key
                            );
                            setSearch("");
                          }}
                          className="w-full text-left rounded-xl px-3 py-3 transition-all"
                          style={{
                            background:
                              active
                                ? "var(--cv-primary)"
                                : "transparent",
                            color: active
                              ? "#fff"
                              : "var(--cv-neutral-dark)",
                          }}
                        >
                          <div className="text-base md:text-lg font-medium">
                            {
                              domain.title
                            }
                          </div>

                          <div
                            className="inline-flex mt-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{
                              background:
                                active
                                  ? "#fff"
                                  : "#EFF6FF",
                              color:
                                "var(--cv-primary)",
                            }}
                          >
                            {
                              domain.subtitle
                            }
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>

                {domains.length >
                  8 && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowAllDomains(
                        (value) =>
                          !value
                      )
                    }
                    className="mt-3 text-sm font-semibold flex items-center gap-1 px-3"
                    style={{
                      color:
                        "var(--cv-primary)",
                    }}
                  >
                    {showAllDomains
                      ? "Show Less"
                      : "View More"}

                    <ChevronDown
                      size={16}
                      className={
                        showAllDomains
                          ? "rotate-180"
                          : ""
                      }
                    />
                  </button>
                )}
              </div>
            </aside>

            {/* =================================================
                MOBILE DOMAIN SLIDER
            ================================================= */}

            <div className="lg:hidden col-span-1 px-3 sm:px-4 mb-4">
              <div
                className="flex gap-2 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide"
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
                      className="shrink-0 snap-start rounded-full px-4 py-2.5 text-xs sm:text-sm font-semibold border transition-all"
                      style={{
                        background: active ? "var(--cv-primary)" : "#fff",
                        color: active ? "#fff" : "var(--cv-neutral-dark)",
                        borderColor: active ? "var(--cv-primary)" : "var(--cv-neutral-border)",
                      }}
                    >
                      {domain.title}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* =================================================
                RIGHT CONTENT
            ================================================= */}

            <section className="px-3 sm:px-4 md:px-0 pt-0 lg:pt-0">
              {/* SEARCH */}

              <div className="relative mb-5 sm:mb-7">
                <Search
                  size={21}
                  className="absolute left-5 top-1/2 -translate-y-1/2"
                  style={{
                    color:
                      "var(--cv-neutral-dark)",
                  }}
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search courses and specializations ..."
                  className="w-full h-12 md:h-14 pl-12 pr-12 rounded-full border bg-white outline-none text-sm md:text-base shadow-sm"
                  style={{
                    borderColor:
                      "var(--cv-neutral-border)",
                    color:
                      "var(--cv-neutral-dark)",
                  }}
                />

                {search && (
                  <button
                    type="button"
                    onClick={() =>
                      setSearch("")
                    }
                    className="absolute right-5 top-1/2 -translate-y-1/2"
                    aria-label="Clear search"
                  >
                    <X
                      size={19}
                      style={{
                        color:
                          "var(--cv-neutral-mid)",
                      }}
                    />
                  </button>
                )}
              </div>

              {/* SEARCH RESULT INFO */}

              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2
                    className="text-lg md:text-xl font-semibold"
                    style={{
                      color:
                        "var(--cv-neutral-dark)",
                    }}
                  >
                    {normalizedSearch
                      ? "Search Results"
                      : domains.find(
                          (item) =>
                            item.key ===
                            activeDomain
                        )?.title ||
                        "Courses"}
                  </h2>

                  <p
                    className="text-xs md:text-sm mt-1"
                    style={{
                      color:
                        "var(--cv-neutral-mid)",
                    }}
                  >
                    {visibleCourses.length}{" "}
                    courses available
                  </p>
                </div>

              </div>

              {/* =================================================
                  COURSE GRID
              ================================================= */}

              {coursesLoading &&
              courses.length === 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  {Array.from({
                    length: 8,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-[280px] rounded-xl animate-pulse"
                      style={{
                        background:
                          "#F1F5F9",
                      }}
                    />
                  ))}
                </div>
              ) : visibleCourses.length >
                0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-5">
                  {visibleCourses.map(
                    (course, index) => {
                      const courseName =
                        normalizeText(
                          course?.name
                        ) ||
                        "Online Course";

                      const courseImage =
                        getCourseImage(
                          course
                        );

                      const specializations =
                        getCourseSpecializations(
                          course
                        );

                      const specializationCount =
                        getSpecializationCount(
                          course
                        );

                      const universityCount =
                        getCourseUniversityCount(
                          course
                        );

                      const courseHref =
                        getCourseHref(
                          course
                        );

                      return (
                        <article
                          key={
                            course?._id ||
                            course?.slug ||
                            `${courseName}-${index}`
                          }
                          className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden relative"
                          style={{
                            border:
                              "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          {/* BADGE */}

                          {index === 1 && (
                            <div
                              className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
                              style={{
                                background:
                                  "#C8F7E6",
                                color:
                                  "#14B887",
                              }}
                            >
                              Trending ⚡
                            </div>
                          )}

                          {index === 2 && (
                            <div
                              className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
                              style={{
                                background:
                                  "#C8F7E6",
                                color:
                                  "#14B887",
                              }}
                            >
                              ROI 100% ⚡
                            </div>
                          )}

                          {index === 5 && (
                            <div
                              className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
                              style={{
                                background:
                                  "#C8F7E6",
                                color:
                                  "#14B887",
                              }}
                            >
                              Global ⚡
                            </div>
                          )}

                          {index === 8 && (
                            <div
                              className="absolute right-0 top-0 px-3 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold"
                              style={{
                                background:
                                  "#C8F7E6",
                                color:
                                  "#14B887",
                              }}
                            >
                              NEW ⚡
                            </div>
                          )}

                          <div className="p-3 sm:p-4 md:p-5">
                            {/* ICON */}

                            <div className="h-10 sm:h-12 flex items-center mb-3 sm:mb-4">
                              {courseImage &&
                              courseImage !==
                                "/placeholder.png" ? (
                                <Image
                                  src={
                                    courseImage
                                  }
                                  width={
                                    52
                                  }
                                  height={
                                    52
                                  }
                                  alt={`${courseName} icon`}
                                  className="w-9 h-9 sm:w-12 sm:h-12 object-contain"
                                />
                              ) : (
                                <GraduationCap
                                  size={
                                    42
                                  }
                                  strokeWidth={
                                    1.5
                                  }
                                  style={{
                                    color:
                                      "var(--cv-primary)",
                                  }}
                                />
                              )}
                            </div>

                            {/* COURSE NAME */}

                            <h3
                              className="text-sm sm:text-base md:text-lg font-medium min-h-[42px] sm:min-h-[50px] line-clamp-2"
                              style={{
                                color:
                                  "var(--cv-neutral-dark)",
                              }}
                            >
                              {
                                courseName
                              }
                            </h3>

                            {/* SPECIALIZATION */}

                            <div
                              className="inline-flex items-center mt-3 sm:mt-4 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-medium"
                              style={{
                                background:
                                  "#E8F0FF",
                                color:
                                  "#1769E0",
                              }}
                            >
                              {specializationCount >
                              0
                                ? `${specializationCount}+ Specializations`
                                : "Specializations"}
                            </div>

                            {/* UNIVERSITY COUNT */}

                            <div className="flex items-start gap-1.5 sm:gap-2 mt-3 sm:mt-4">
                              <span
                                className="w-2.5 h-2.5 rounded-full shrink-0"
                                style={{
                                  background:
                                    "#1769E0",
                                }}
                              />

                              <span
                                className="text-[11px] sm:text-sm font-semibold leading-4"
                                style={{
                                  color:
                                    "var(--cv-neutral-dark)",
                                }}
                              >
                                Compare{" "}
                                <span
                                  style={{
                                    color:
                                      "#1769E0",
                                  }}
                                >
                                  {universityCount !==
                                  null
                                    ? universityCount
                                    : "—"}
                                </span>{" "}
                                Universities
                              </span>
                            </div>

                            {/* VIEW SPECIALIZATIONS */}

                            <Link
                              href={`${courseHref}?view=specializations`}
                              className="inline-flex items-center gap-1 mt-4 sm:mt-5 text-xs sm:text-sm md:text-base font-medium hover:gap-2 transition-all"
                              style={{
                                color:
                                  "#1769E0",
                              }}
                            >
                              View
                              specializations
                              <ChevronRight
                                size={
                                  17
                                }
                              />
                            </Link>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              ) : (
                /* =================================================
                   NO COURSES
                ================================================= */

                <div
                  className="rounded-xl p-10 text-center"
                  style={{
                    border:
                      "1px solid var(--cv-neutral-border)",
                    background:
                      "#fff",
                  }}
                >
                  <GraduationCap
                    size={45}
                    className="mx-auto mb-4"
                    style={{
                      color:
                        "var(--cv-primary)",
                    }}
                  />

                  <h3
                    className="text-lg font-semibold"
                    style={{
                      color:
                        "var(--cv-neutral-dark)",
                    }}
                  >
                    No courses found
                  </h3>

                  <p
                    className="text-sm mt-2"
                    style={{
                      color:
                        "var(--cv-neutral-mid)",
                    }}
                  >
                    Try another search or
                    select a different domain.
                  </p>

                  {search && (
                    <button
                      type="button"
                      onClick={() =>
                        setSearch("")
                      }
                      className="mt-4 font-semibold"
                      style={{
                        color:
                          "var(--cv-primary)",
                      }}
                    >
                      Clear Search
                    </button>
                  )}
                </div>
              )}

              {/* =================================================
                  UNIVERSITY INFO
              ================================================= */}

              {normalizedSearch &&
                searchedUniversities.length >
                  0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2
                          className="text-lg md:text-xl font-semibold"
                          style={{
                            color:
                              "var(--cv-neutral-dark)",
                          }}
                        >
                          Matching Universities
                        </h2>

                        <p
                          className="text-sm mt-1"
                          style={{
                            color:
                              "var(--cv-neutral-mid)",
                          }}
                        >
                          {
                            searchedUniversities.length
                          }{" "}
                          universities found
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {searchedUniversities
                        .slice(0, 8)
                        .map(
                          (
                            university
                          ) => {
                            if (
                              !university?.slug
                            ) {
                              return null;
                            }

                            const name =
                              normalizeText(
                                university?.name
                              ) ||
                              "University";

                            return (
                              <Link
                                key={
                                  university?._id ||
                                  university?.slug
                                }
                                href={`/university/${encodeURIComponent(
                                  university.slug
                                )}`}
                                className="bg-white rounded-xl p-4 flex flex-col items-center justify-center min-h-[130px] shadow-sm hover:shadow-md transition"
                                style={{
                                  border:
                                    "1px solid var(--cv-neutral-border)",
                                }}
                              >
                                <Image
                                  src={
                                    university?.universityImageUrl ||
                                    "/fallback-logo.png"
                                  }
                                  width={
                                    80
                                  }
                                  height={
                                    50
                                  }
                                  alt={`${name} logo`}
                                  className="w-20 h-12 object-contain mb-3"
                                />

                                <span
                                  className="text-xs font-semibold text-center line-clamp-2"
                                  style={{
                                    color:
                                      "var(--cv-neutral-dark)",
                                  }}
                                >
                                  {
                                    name
                                  }
                                </span>
                              </Link>
                            );
                          }
                        )}
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