



// "use client";

// import { useEffect, useState, useMemo } from "react";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";

// const globalCoursesCache = {};

// const CourseCard = ({ course, index }) => {
//   const isClickable = index < 25;

//   return (
//     <Link
//       href={`/course/${course.slug}`}
//       className={`w-full bg-white border-[1px] md:border-2 border-gray-200 rounded-md p-1.5 md:p-2 
//       flex flex-col items-center justify-between h-full transition-all duration-200
//       ${isClickable ? "cursor-pointer hover:border-[#0056B3] hover:shadow-md" : "pointer-events-none opacity-70"}`}
//     >
//       <div className="flex justify-center mb-1">
//         <Image
//           src={course.courseLogo?.url || "/placeholder.png"}
//           alt={course.name}
//           width={50}
//           height={50}
//           className="object-contain"
//         />
//       </div>

//       <div className="text-center mb-1.5 px-0.5">
//         <h3 className="font-black text-gray-900 text-[7.5px] md:text-[11px] line-clamp-2 leading-tight uppercase">
//           {course.name}
//         </h3>
//       </div>

//       <div className="bg-[#0056B3]  cursor-pointer text-white text-[7px] md:text-[10px] py-1 md:py-1.5 w-full rounded-sm text-center uppercase mt-auto">
//         Know More
//       </div>
//     </Link>
//   );
// };

// export default function CoursesClient({ initialCourses = [] }) {
//   const [courses, setCourses] = useState(initialCourses);
//   const [allCourses, setAllCourses] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [isPopupOpen, setIsPopupOpen] = useState(false);
//   const [displayLimit, setDisplayLimit] = useState(24);

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

//   // ✅ FETCH COURSES
//   useEffect(() => {
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

//   // ✅ FULL DATA FOR POPUP
//   const fetchAllCourses = async () => {
//     try {
//       const url =
//         selectedCategory === "All"
//           ? `/api/v1/short?limit=1000`
//           : `/api/v1/short?category=${selectedCategory}&limit=1000`;

//       const res = await api.get(url);
//       setAllCourses(res.data.courses || []);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const visibleCourses = useMemo(() => {
//     return [...courses].reverse().slice(0, displayLimit);
//   }, [courses, displayLimit]);

//   const sortedPopupCourses = useMemo(() => {
//     return [...allCourses].reverse();
//   }, [allCourses]);

//   return (
//     <div className="w-full bg-white">
//       <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">
        
//         {/* ✅ SEO HEADING */}
//         <header className="mb-6 md:mb-10 text-center">
//           <h1 className="text-xl md:text-3xl font-black text-[#0056B3] uppercase">
//             Job-Oriented Professional Courses
//           </h1>
//           <p className="mt-1 text-gray-500 text-[10px] md:text-sm italic">
//             Empowering your future with CareerVidya
//           </p>
//         </header>

//         {/* CATEGORY */}
//         <div className="block lg:hidden mb-6">
//           <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
//             {sidebarItems.map((item) => (
//               <button
//                 key={item.key}
//                 onClick={() => setSelectedCategory(item.key)}
//                 className={`px-4 py-1.5 text-[10px] cursor-pointer font-black border-2 rounded-full whitespace-nowrap
//                 ${
//                   selectedCategory === item.key
//                     ? "bg-[#0056B3] text-white"
//                     : "bg-white text-black border-gray-300"
//                 }`}
//               >
//                 {item.title}
//               </button>
//             ))}
//           </div>
//         </div>

//         <main className="flex flex-col items-center">
//           <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6 w-full ${loading ? "opacity-50" : ""}`}>
//             {visibleCourses.map((course, index) => (
//               <CourseCard key={course._id || index} course={course} index={index} />
//             ))}
//           </div>

//           {loading && <div className="mt-4 text-[#0056B3] font-bold">Updating...</div>}

//           {!loading && courses.length >= displayLimit && (
//             <button
//               onClick={() => {
//                 setIsPopupOpen(true);
//                 fetchAllCourses();
//               }}
//               className="mt-10 bg-[#c15304]  cursor-pointer text-white font-black py-3 px-10 rounded-lg uppercase text-[10px] md:text-sm"
//             >
//               Explore Full Catalog
//             </button>
//           )}
//         </main>

//         {/* POPUP */}
//         {isPopupOpen && (
//           <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
//             <div
//               className="absolute inset-0 bg-black/70"
//               onClick={() => setIsPopupOpen(false)}
//             />
//             <div className="relative bg-white w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col rounded-lg">
              
//               <div className="flex justify-between p-4 border-b">
//                 <h3 className="font-black text-[#0056B3] uppercase">
//                   {selectedCategory} Programs
//                 </h3>
//                 <button onClick={() => setIsPopupOpen(false)}>
//                   <X className="w-6 h-6" />
//                 </button>
//               </div>

//               <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
//                 <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
//                   {sortedPopupCourses.map((course, index) => (
//                     <CourseCard key={course._id} course={course} index={index} />
//                   ))}
//                 </div>
//               </div>

//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import api from "@/utlis/api.js";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";

const globalCoursesCache = {};

const CourseCard = ({ course, index }) => {
  const isClickable = index < 25;

  return (
    <Link
      href={`/course/${course.slug}`}
      className={`w-full bg-white border-[1px] md:border-2 border-gray-200 rounded-md p-1.5 md:p-2 
      flex flex-col items-center justify-between h-full transition-all duration-200
      ${isClickable ? "cursor-pointer hover:border-[#0056B3] hover:shadow-md" : "pointer-events-none opacity-70"}`}
      aria-label={`Learn more about ${course.name}`}
    >
      <div className="flex justify-center mb-1">
        <Image
          src={course.courseLogo?.url || "/placeholder.png"}
          alt={`${course.name} - Professional Online Course`}
          width={50}
          height={50}
          className="object-contain"
          loading={index < 6 ? "eager" : "lazy"}
        />
      </div>

      <div className="text-center mb-1.5 px-0.5">
        <h3 className="font-black text-gray-900 text-[7.5px] md:text-[11px] line-clamp-2 leading-tight uppercase">
          {course.name}
        </h3>
      </div>

      <div className="bg-[#0056B3] cursor-pointer text-white text-[7px] md:text-[10px] py-1 md:py-1.5 w-full rounded-sm text-center uppercase mt-auto">
        Know More
      </div>
    </Link>
  );
};

// ✅ initialCourses should be fetched on the server (see CourseGridSection.jsx)
// and passed in as a prop. That guarantees the very first HTML response
// already contains real course cards — Google never sees a loading state.
// If this component is ever rendered with no initialCourses, it still
// works correctly; it just fetches on mount like before (graceful fallback).

export default function CoursesClient({ initialCourses = [] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  // ✅ ADDED: popup previously had no loading/error feedback — it opened
  // instantly with an empty grid while fetchAllCourses() was still in
  // flight, with no indicator either way if the request failed.
  const [popupLoading, setPopupLoading] = useState(false);
  const [popupError, setPopupError] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(24);

  // ✅ Tracks whether this is the very first render with server-provided
  // data, so we don't immediately re-fetch and discard what the server
  // already gave us (which would also cause a brief flash/duplicate call).
  const isFirstRun = useRef(true);

  const sidebarItems = [
    { key: "All", title: "All Courses" },
    { key: "PG", title: "PG Courses" },
    { key: "ExecutiveEducation", title: "Executive" },
    { key: "UG", title: "UG Courses" },
    { key: "Doctorate", title: "Doctorate" },
  ];

  useEffect(() => {
    const updateLimit = () => setDisplayLimit(window.innerWidth < 768 ? 12 : 24);
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  useEffect(() => {
    // ✅ Skip the fetch on first mount if we already have server-provided
    // courses for the default "All" category — avoids a redundant
    // duplicate network call right after the page loads.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (selectedCategory === "All" && initialCourses.length > 0) {
        return;
      }
    }

    const fetchCourses = async () => {
      const page = 1;
      const limit = displayLimit;
      const cacheKey = `${selectedCategory}_${page}_${limit}`;

      if (globalCoursesCache[cacheKey]) {
        setCourses(globalCoursesCache[cacheKey]);
        return;
      }

      setLoading(true);
      try {
        const url =
          selectedCategory === "All"
            ? `/api/v1/short?page=${page}&limit=${limit}`
            : `/api/v1/short?category=${selectedCategory}&page=${page}&limit=${limit}`;

        const res = await api.get(url);
        const fetchedData = res.data.courses || [];

        globalCoursesCache[cacheKey] = fetchedData;
        setCourses(fetchedData);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [selectedCategory, displayLimit]);

  const fetchAllCourses = async () => {
    // ✅ FIX: popup now shows a loading state while this request is in
    // flight, and an error message if it fails — previously the popup
    // opened instantly with an empty grid and no feedback either way.
    setPopupLoading(true);
    setPopupError(false);
    try {
      const url =
        selectedCategory === "All"
          ? `/api/v1/short?limit=1000`
          : `/api/v1/short?category=${selectedCategory}&limit=1000`;

      const res = await api.get(url);
      setAllCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
      setPopupError(true);
    } finally {
      setPopupLoading(false);
    }
  };

  const visibleCourses = useMemo(() => {
    return [...courses].reverse().slice(0, displayLimit);
  }, [courses, displayLimit]);

  const sortedPopupCourses = useMemo(() => {
    return [...allCourses].reverse();
  }, [allCourses]);

  // JSON-LD Structured Data
  // ✅ FIX: numberOfItems now matches itemListElement's actual count
  // (visibleCourses.length, not the full courses.length) — a mismatch here
  // triggers a "numberOfItems doesn't match itemListElement count" warning
  // in Google's Rich Results Test.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Job-Oriented Professional Courses",
    description: "Browse PG, UG, Executive, and Doctorate online courses at CareerVidya",
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

      <div className="w-full bg-white">
        <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">

          {/* ✅ Changed h1 → h2: this is a content SECTION on the homepage,
              not the page itself. The page-level h1 should live once in
              the homepage's hero/header area. Using h2 here prevents a
              duplicate-H1 issue, which hurts Google's ability to tell
              what the page is actually about. */}
          <header className="mb-6 md:mb-10 text-center">
            <h2 className="text-xl md:text-3xl font-black text-[#0056B3] uppercase">
              Job-Oriented Professional Courses
            </h2>
            <p className="mt-1 text-gray-500 text-[10px] md:text-sm italic">
              Empowering your future with CareerVidya
            </p>
          </header>

          {/* CATEGORY */}
          <nav aria-label="Course categories" className="block lg:hidden mb-6">
            <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
              {sidebarItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setSelectedCategory(item.key)}
                  aria-pressed={selectedCategory === item.key}
                  className={`px-4 py-1.5 text-[10px] cursor-pointer font-black border-2 rounded-full whitespace-nowrap
                  ${
                    selectedCategory === item.key
                      ? "bg-[#0056B3] text-white"
                      : "bg-white text-black border-gray-300"
                  }`}
                >
                  {item.title}
                </button>
              ))}
            </div>
          </nav>

          <main className="flex flex-col items-center">
            <div className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6 w-full ${loading ? "opacity-50" : ""}`}>
              {visibleCourses.map((course, index) => (
                <CourseCard key={course._id || index} course={course} index={index} />
              ))}
            </div>

            {loading && <div className="mt-4 text-[#0056B3] font-bold">Updating...</div>}

            {!loading && courses.length >= displayLimit && (
              <button
                onClick={() => {
                  setIsPopupOpen(true);
                  fetchAllCourses();
                }}
                className="mt-10 bg-[#c15304] cursor-pointer text-white font-black py-3 px-10 rounded-lg uppercase text-[10px] md:text-sm"
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
                className="absolute inset-0 bg-black/70"
                onClick={() => setIsPopupOpen(false)}
              />
              <div className="relative bg-white w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col rounded-lg">

                <div className="flex justify-between p-4 border-b">
                  <h2 className="font-black text-[#0056B3] uppercase">
                    {selectedCategory} Programs
                  </h2>
                  <button onClick={() => setIsPopupOpen(false)} aria-label="Close catalog">
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
                  {/* ✅ ADDED: loading / error feedback so the popup never
                      just shows a blank grid with no explanation. */}
                  {popupLoading && (
                    <div className="text-center text-[#0056B3] font-bold py-10">
                      Loading courses...
                    </div>
                  )}

                  {!popupLoading && popupError && (
                    <div className="text-center text-red-600 font-bold py-10">
                      Couldn't load courses. Please try again.
                    </div>
                  )}

                  {!popupLoading && !popupError && (
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                      {sortedPopupCourses.map((course, index) => (
                        <CourseCard key={course._id || index} course={course} index={index} />
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