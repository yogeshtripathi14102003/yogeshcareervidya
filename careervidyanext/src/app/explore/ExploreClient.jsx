


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


"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import Header from "../layout/Header";
import Link from "next/link";
import Image from "next/image";
import Footer from "../layout/Footer";

const BLUE = "#0056B3";

export default function ExploreClient({ initialData }) {
  const [courses] = useState(initialData?.initialCourses || []);
  const [universities] = useState(initialData?.initialUnis || []);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  /* =========================================================
     COURSE CATEGORIES
  ========================================================= */

  const categories = [
    {
      key: "All",
      title: "All Courses",
    },
    {
      key: "PG",
      title: "PG Courses",
    },
    {
      key: "UG",
      title: "UG Courses",
    },
    {
      key: "ExecutiveEducation",
      title: "Executive Education",
    },
    {
      key: "Doctorate",
      title: "Doctorate",
    },
  ];

  /* =========================================================
     SEARCH VALUE
  ========================================================= */

  const normalizedSearch = search.trim().toLowerCase();

  /* =========================================================
     FILTER COURSES
  ========================================================= */

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        category === "All" || course?.category === category;

      const courseName =
        course?.name?.toLowerCase() || "";

      const courseDescription =
        course?.description?.toLowerCase() || "";

      const matchesSearch =
        !normalizedSearch ||
        courseName.includes(normalizedSearch) ||
        courseDescription.includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });
  }, [courses, category, normalizedSearch]);

  /* =========================================================
     FILTER UNIVERSITIES
  ========================================================= */

  const filteredUniversities = useMemo(() => {
    return universities.filter((university) => {
      const universityName =
        university?.name?.toLowerCase() || "";

      return (
        !normalizedSearch ||
        universityName.includes(normalizedSearch)
      );
    });
  }, [universities, normalizedSearch]);

  /* =========================================================
     CLEAR SEARCH
  ========================================================= */

  const clearSearch = () => {
    setSearch("");
  };

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      <main className="min-h-screen bg-gray-50 text-gray-900">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <Header />

        <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-4 gap-6">

          {/* ===================================================
              SIDEBAR
          =================================================== */}

          <aside
            className="hidden lg:block border border-gray-200 rounded-lg p-4 shadow-sm h-fit sticky top-24 bg-white"
            aria-label="Course filters"
          >
            {/* UI label — intentionally not a heading */}
            <p
              className="font-bold text-lg mb-4"
              style={{ color: BLUE }}
            >
              Filters
            </p>

            {/* SEARCH */}
            <div className="relative mb-5">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or universities..."
                aria-label="Search courses or universities"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white text-gray-900 placeholder-gray-400"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-2 p-1 text-gray-400 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* CATEGORY FILTER */}
            <div>
              <p className="font-semibold mb-2 text-gray-900">
                Course Type
              </p>

              <div className="flex flex-col gap-2">
                {categories.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setCategory(item.key)}
                    aria-pressed={category === item.key}
                    className={`px-3 py-2 rounded text-sm text-left transition ${
                      category === item.key
                        ? "text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={
                      category === item.key
                        ? { background: BLUE }
                        : {}
                    }
                  >
                    {item.title}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* ===================================================
              MAIN CONTENT
          =================================================== */}

          <section
            className="lg:col-span-3"
            aria-labelledby="explore-courses-heading"
          >
            {/* =================================================
                PRIMARY H1

                Keep this static.
                Do NOT change H1 based on search/filter.
            ================================================= */}

            <header className="mb-6">
              <h1
                id="explore-courses-heading"
                className="text-2xl md:text-3xl font-bold"
                style={{ color: BLUE }}
              >
                Explore Online Courses & Universities
              </h1>

              <p className="mt-2 text-gray-600 max-w-3xl">
                Discover online undergraduate, postgraduate,
                executive education, and doctorate programs from
                recognized universities in India.
              </p>
            </header>

            {/* =================================================
                MOBILE SEARCH
            ================================================= */}

            <div className="lg:hidden relative mb-6">
              <Search
                className="absolute left-3 top-3 text-gray-400"
                size={20}
                aria-hidden="true"
              />

              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search courses or universities..."
                aria-label="Search courses or universities"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg bg-white text-gray-900"
              />

              {search && (
                <button
                  type="button"
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="absolute right-2 top-2 p-1 text-gray-400"
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* =================================================
                COURSE SECTION
            ================================================= */}

            <section aria-labelledby="courses-heading">
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2
                  id="courses-heading"
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: BLUE }}
                >
                  {search || category !== "All"
                    ? `${filteredCourses.length} Courses Found`
                    : "Explore Online Courses"}
                </h2>

                <span className="text-sm text-gray-500">
                  {filteredCourses.length} available
                </span>
              </div>

              {filteredCourses.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredCourses.map((course) => {
                    if (!course?.slug) return null;

                    const courseName =
                      course?.name?.trim() || "Online Course";

                    const courseImage =
                      course?.courseLogo?.url ||
                      "/placeholder.png";

                    return (
                      <Link
                        key={course._id}
                        href={`/course/${encodeURIComponent(
                          course.slug
                        )}`}
                        aria-label={`View ${courseName}`}
                        className="block"
                      >
                        <article className="bg-white border border-gray-200 rounded-lg min-h-[160px] flex flex-col justify-between shadow-sm hover:shadow-lg transition overflow-hidden">
                          <div className="flex justify-center items-center pt-3 h-20">
                            <Image
                              src={courseImage}
                              width={56}
                              height={56}
                              sizes="56px"
                              className="w-14 h-14 object-contain"
                              alt={`${courseName} course logo`}
                            />
                          </div>

                          <p className="text-[11px] md:text-xs font-bold text-center px-2 py-2 line-clamp-2 uppercase text-gray-900">
                            {courseName}
                          </p>

                          <div
                            className="text-white text-[10px] text-center py-2 font-bold"
                            style={{ background: BLUE }}
                          >
                            KNOW MORE
                          </div>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    No courses found for your search.
                  </p>

                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setCategory("All");
                    }}
                    className="mt-3 font-semibold hover:underline"
                    style={{ color: BLUE }}
                  >
                    Clear filters
                  </button>
                </div>
              )}
            </section>

            {/* =================================================
                UNIVERSITY SECTION
            ================================================= */}

            <section
              aria-labelledby="universities-heading"
              className="mt-12"
            >
              <div className="flex items-center justify-between gap-4 mb-4">
                <h2
                  id="universities-heading"
                  className="text-xl md:text-2xl font-bold"
                  style={{ color: BLUE }}
                >
                  Partner Universities
                </h2>

                <span className="text-sm text-gray-500">
                  {filteredUniversities.length} available
                </span>
              </div>

              {filteredUniversities.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredUniversities.map((university) => {
                    if (!university?.slug) return null;

                    const universityName =
                      university?.name?.trim() ||
                      "Partner University";

                    return (
                      <Link
                        key={university._id}
                        href={`/university/${encodeURIComponent(
                          university.slug
                        )}`}
                        aria-label={`View ${universityName}`}
                        className="block"
                      >
                        <article className="bg-white border border-gray-200 rounded-lg min-h-[160px] flex flex-col items-center justify-center shadow-sm hover:shadow-lg transition p-3"
                        >
                          <Image
                            src={
                              university.universityImageUrl ||
                              "/fallback-logo.png"
                            }
                            width={80}
                            height={50}
                            sizes="80px"
                            className="w-20 h-12 object-contain mb-3"
                            alt={`${universityName} logo`}
                          />

                          <p className="text-[10px] md:text-xs font-bold text-center line-clamp-2 uppercase text-gray-900">
                            {universityName}
                          </p>
                        </article>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white border border-gray-200 rounded-lg p-8 text-center">
                  <p className="text-gray-600">
                    No universities found for your search.
                  </p>
                </div>
              )}
            </section>

            {/* =================================================
                SEO / INTERNAL LINK CTA
            ================================================= */}

            <div className="text-center mt-12 mb-4">
              <Link
                href="/course"
                className="font-semibold hover:underline"
                style={{ color: BLUE }}
              >
                Browse Top Courses
              </Link>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

