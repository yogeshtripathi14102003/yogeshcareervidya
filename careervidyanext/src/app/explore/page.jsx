

// "use client";
// import { useState } from "react";
// import { Search, X } from "lucide-react";
// import Header from "../layout/Header";

// export default function ExplorePage() {
//   const [activeCategory, setActiveCategory] = useState("All");
//   const [searchQuery, setSearchQuery] = useState("");

//   const categories = [
//     { title: "All", subtitle: "Show All Programs" },
//     { title: "PG Courses", subtitle: "After Graduation" },
//     { title: "Executive Education", subtitle: "Working Professionals & CXOs*" },
//     { title: "Doctorate/Ph.D.", subtitle: "Get Dr. Title (After UG + Work Ex)" },
//     { title: "UG Courses", subtitle: "After 12TH" },
//     { title: "Job Guarantee", subtitle: "100% Placement*" },
//     { title: "Study Abroad", subtitle: "Pathway/Hybrid Mode" },
//   ];

//   const programs = [
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "PG Courses" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "PG Courses" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "PG Courses" },
//     { title: "Executive MBA for Working Professionals", subtitle: "12 - 24 Months", compare: "Compare 13 Universities", category: "Executive Education" },
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "UG Courses" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "UG Courses" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "UG Courses" },
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "Job Guarantee" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "Job Guarantee" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "Job Guarantee" },
//     { title: "Online MBA", subtitle: "80+ Specializations", compare: "Compare 37 Universities", category: "Study Abroad" },
//     { title: "1 Year MBA Online", subtitle: "1 Year", compare: "Compare 10 Universities", highlight: "ROI 100%", category: "Study Abroad" },
//     { title: "Distance MBA", subtitle: "2 Years", compare: "Compare 15 Universities", category: "Study Abroad" },
//     { title: "Executive MBA for Working Professionals", subtitle: "12 - 24 Months", compare: "Compare 13 Universities", category: "Executive Education" },
//   ];

//   const filteredPrograms = programs.filter((program) => {
//     const matchesCategory = activeCategory === "All" || program.category?.toLowerCase() === activeCategory.toLowerCase();
//     const matchesSearch =
//       !searchQuery ||
//       program.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       program.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       program.compare.toLowerCase().includes(searchQuery.toLowerCase());
//     return matchesCategory && matchesSearch;
//   });

//   const handleClearSearch = () => {
//     setSearchQuery("");
//   };

//   return (
//     <main className="min-h-screen bg-white px-4 md:px-10 py-8">
//       {/* Add Header here */}
//       <Header />

//       <div className="flex flex-col md:flex-row gap-8 mt-4">
//         {/* Sidebar */}
//         <aside className="w-full md:w-1/4">
//           <h2 className="text-lg font-semibold mb-4">Search career vidya</h2>
//           <div className="h-64 md:h-96 overflow-y-auto">
//             <div className="flex flex-col gap-3">
//               {categories.map((cat, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setActiveCategory(cat.title)}
//                   className={`text-left px-4 py-2 rounded-md border flex justify-between items-center cursor-pointer ${
//                     activeCategory === cat.title
//                       ? "bg-blue-600 text-white"
//                       : "hover:bg-blue-50 text-gray-700"
//                   }`}
//                 >
//                   <span>{cat.title}</span>
//                   <span
//                     className={`text-xs ${activeCategory === cat.title ? "text-blue-100" : "text-blue-600"}`}
//                   >
//                     {cat.subtitle}
//                   </span>
//                 </button>
//               ))}
//             </div>
//           </div>
//         </aside>

//         {/* Main Content */}
//         <section className="flex-1 w-full">
//           {/* Search Bar */}
//           <div className="sticky top-0 z-10 bg-white mb-6">
//             <div className="relative">
//               <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
//               <input
//                 type="text"
//                 placeholder='Search "University"'
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full border rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-400"
//               />
//               {/* Clear Button */}
//               {searchQuery && (
//                 <button
//                   onClick={handleClearSearch}
//                   className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Results Count */}
//           <p className="text-sm text-gray-600 mb-4">
//             Showing {filteredPrograms.length} {activeCategory} programs
//             {searchQuery && ` matching "${searchQuery}"`}
//           </p>

//           {/* Program Cards */}
//           <div className="h-96 overflow-y-auto">
//             {filteredPrograms.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
//                 {filteredPrograms.map((p, i) => (
//                   <div
//                     key={i}
//                     className="border rounded-xl p-4 hover:shadow-md transition"
//                   >
//                     <div className="flex justify-between items-center mb-2">
//                       <h3 className="font-semibold text-gray-800">{p.title}</h3>
//                       {p.highlight && (
//                         <span className="text-xs font-bold text-green-600">
//                           ⚡ {p.highlight}
//                         </span>
//                       )}
//                     </div>
//                     <p className="text-sm text-blue-600 font-medium mb-1">{p.subtitle}</p>
//                     <p className="text-sm text-gray-700">{p.compare}</p>
//                     <a
//                       href="#"
//                       className="text-blue-600 text-sm font-medium mt-2 inline-block"
//                     >
//                       View Specialisations →
//                     </a>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-gray-500 text-center py-8">No programs found matching your filters.</p>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// }




"use client";
import { useState, useEffect, useRef } from "react";
import { Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import Header from "../layout/Header";
import api from "@/utlis/api.js";

export default function ExplorePage() {
  // ---------- STATES ----------
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef(null);

  // ---------- CATEGORY DATA ----------
  const categories = [
    { key: "All", title: "All Courses", subtitle: "Browse Everything" },
    { key: "PG", title: "PG Courses", subtitle: "After Graduation" },
    {
      key: "ExecutiveEducation",
      title: "Executive Education",
      subtitle: "For Working Professionals",
    },
    { key: "Doctorate", title: "Doctorate", subtitle: "Get Dr. Title (After UG + Work Ex)" },
    { key: "UG", title: "UG Courses", subtitle: "After 12TH" },
    { key: "JobGuarantee", title: "Job Guarantee", subtitle: "100% Placement" },
    { key: "StudyAbroad", title: "Study Abroad", subtitle: "Pathway/Hybrid Mode" },
  ];

  // ---------- ENABLE CLIENT RENDER ----------
  useEffect(() => setIsMounted(true), []);

  // ---------- FETCH COURSES ----------
  useEffect(() => {
    if (!isMounted) return;
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const url =
          selectedCategory === "All"
            ? "/api/v1/course"
            : `/api/v1/course?category=${selectedCategory}`;
        const res = await api.get(url);
        let data = res.data.courses || [];

        // Filter by search query
        if (searchQuery) {
          data = data.filter(
            (course) =>
              course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
              course.description?.toLowerCase().includes(searchQuery.toLowerCase())
          );
        }

        setCourses(data);
      } catch (err) {
        console.error("❌ Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [isMounted, selectedCategory, searchQuery]);

  // ---------- SCROLL BUTTONS ----------
  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });

  // ---------- COURSE CARD ----------
  const CourseCard = ({ course }) => (
    <div className="relative bg-white border border-gray-200 shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex flex-col justify-between min-w-[180px] sm:min-w-0">
      <span className="absolute top-3 left-3 bg-gradient-to-r from-[#0056B3] to-[#F58220] text-white text-xs px-3 py-1 font-medium shadow-sm">
        {course.duration || "2 Years"}
      </span>

      <div className="flex justify-center items-center mt-10 text-[#F58220] text-3xl">
        <i className="fa-solid fa-book-open"></i>
      </div>

      <div className="text-center mt-6 mb-10 px-2">
        <h3 className="font-semibold text-gray-800 text-sm line-clamp-2">
          {course.name}
        </h3>
      </div>

      <button className="bg-gradient-to-r from-[#0056B3] to-[#F58220] hover:opacity-90 text-white text-xs font-semibold py-2 transition-all">
        Know More
      </button>
    </div>
  );

  // ---------- CLEAR SEARCH ----------
  const handleClearSearch = () => setSearchQuery("");

  // ---------- PREVENT HYDRATION MISMATCH ----------
  if (!isMounted)
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 px-4 md:px-8 py-8 transition-all">
      <Header />

      <div className="flex flex-col lg:flex-row gap-8 mt-6">
        {/* ---------- SIDEBAR ---------- */}
        <aside className="lg:w-1/4 bg-white border border-gray-100 shadow-lg p-5 md:p-6">
          <h3 className="hidden lg:block text-2xl font-bold text-[#0056B3] mb-6">
            Categories
          </h3>

          {/* MOBILE SCROLL MENU */}
          <div className="block lg:hidden relative mb-6">
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-1 rounded-full shadow z-10"
            >
              <ChevronLeft className="w-4 h-4 text-[#0056B3]" />
            </button>
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border border-gray-300 p-1 rounded-full shadow z-10"
            >
              <ChevronRight className="w-4 h-4 text-[#0056B3]" />
            </button>

            <div
              ref={scrollRef}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-6"
            >
              {categories.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-semibold transition-all border ${
                    selectedCategory === cat.key
                      ? "bg-[#0056B3] text-white border-[#0056B3]"
                      : "bg-white text-[#0056B3] border-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {cat.title}
                </button>
              ))}
            </div>
          </div>

          {/* DESKTOP CATEGORY LIST */}
          <div className="hidden lg:block">
            {categories.map((cat) => (
              <div
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`mb-4 p-4 cursor-pointer border-2 transition-all ${
                  selectedCategory === cat.key
                    ? "border-[#F58220] bg-orange-50 shadow-md"
                    : "border-transparent hover:border-[#0056B3]/30 hover:bg-blue-50/30"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-3 flex justify-center items-center transition-all ${
                      selectedCategory === cat.key
                        ? "bg-gradient-to-r from-[#0056B3] to-[#F58220] text-white"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    <i className="fa-solid fa-graduation-cap text-base"></i>
                  </div>
                  <div>
                    <h3
                      className={`font-semibold text-[16px] ${
                        selectedCategory === cat.key
                          ? "text-[#0056B3]"
                          : "text-gray-800"
                      }`}
                    >
                      {cat.title}
                    </h3>
                    <p className="text-sm text-gray-500">↳ {cat.subtitle}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* ---------- MAIN CONTENT ---------- */}
        <section className="flex-1 w-full">
          {/* SEARCH BAR */}
          <div className="sticky top-0 z-10 bg-white mb-6 shadow-sm p-3 rounded-md">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder='Search "Course Name"'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full border rounded-full pl-10 pr-10 py-2 text-sm focus:ring-2 focus:ring-blue-400"
              />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-2.5 w-5 h-5 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* RESULTS COUNT */}
          <p className="text-sm text-gray-600 mb-4">
            Showing {courses.length} {selectedCategory} courses
            {searchQuery && ` matching "${searchQuery}"`}
          </p>

          {/* COURSE GRID */}
          {loading ? (
            <p className="text-center text-gray-500 animate-pulse">
              Loading courses...
            </p>
          ) : courses.length === 0 ? (
            <p className="text-center text-gray-500">
              No courses found for your filters.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {courses.map((course) => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ---------- STYLES ---------- */}
      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}
