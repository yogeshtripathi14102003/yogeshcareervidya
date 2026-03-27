"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import { X } from "lucide-react";

/* ================= GLOBAL CACHE ================= */
const globalCoursesCache = {};

/* ================= COURSE CARD ================= */
// Optimized CourseCard: Intersection Observer ko remove kiya performance ke liye
const CourseCard = ({ course, index }) => {
  const router = useRouter();
  const isClickable = index < 25;

  return (
    <div
      onClick={() => isClickable && router.push(`/course/${course.slug}`)}
      role="button"
      className={`w-full bg-white border-[1px] md:border-2 border-gray-200 rounded-md p-1.5 md:p-2 
        flex flex-col items-center justify-between h-full transition-all duration-200
        ${isClickable ? "cursor-pointer hover:border-[#0056B3] hover:shadow-md" : "cursor-default"}`}
    >
      <div className="flex justify-center mb-1">
        <img
          src={course.courseLogo?.url || "/placeholder.png"}
          alt={course.name}
          loading="lazy" 
          className="w-8 h-8 md:w-12 md:h-12 object-contain"
        />
      </div>
      <div className="text-center mb-1.5 px-0.5">
        <h3 className="font-black text-gray-900 text-[7.5px] md:text-[11px] line-clamp-2 leading-tight uppercase">
          {course.name}
        </h3>
      </div>
      <div className="bg-[#0056B3] text-white text-[7px] md:text-[10px] py-1 md:py-1.5 w-full rounded-sm text-center uppercase mt-auto">
        Know More
      </div>
    </div>
  );
};

export default function CoursesListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(12);

  const sidebarItems = [
    { key: "All", title: "All Courses" },
    { key: "PG", title: "PG Courses" },
    { key: "ExecutiveEducation", title: "Executive" },
    { key: "UG", title: "UG Courses" },
    { key: "Doctorate", title: "Doctorate" },
  ];

  useEffect(() => {
    setIsMounted(true);
    const updateLimit = () => setDisplayLimit(window.innerWidth < 768 ? 12 : 24);
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  // BUG FIX: Filter lagne par course gayab hone ka solution
  useEffect(() => {
    if (!isMounted) return;

    const fetchCourses = async () => {
      // Pehle cache check karein taaki loading fast ho
      if (globalCoursesCache[selectedCategory]) {
        setCourses(globalCoursesCache[selectedCategory]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const url = selectedCategory === "All" ? "/api/v1/course" : `/api/v1/course?category=${selectedCategory}`;
        const res = await api.get(url);
        
        // FIX: Data structure ensure karein aur original array ko mutate na karein
        const fetchedData = res.data.courses || [];
        const reversedData = [...fetchedData].reverse(); // Copy banakar reverse karein
        
        globalCoursesCache[selectedCategory] = reversedData;
        setCourses(reversedData);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isMounted, selectedCategory]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">
        
        {/* SEO Header */}
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="text-xl md:text-4xl font-black text-[#0056B3] uppercase tracking-tight">
            Job-Oriented Professional Courses
          </h1>
          <p className="mt-1 text-gray-500 text-[10px] md:text-sm italic">Empowering your future with CareerVidya</p>
        </header>

        {/* Sidebar/Filter */}
        <div className="block lg:hidden mb-6">
          <div className="flex gap-2 overflow-x-auto pb-3 px-1 no-scrollbar">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedCategory(item.key)}
                className={`px-4 py-1.5 text-[10px] font-black border-2 rounded-full whitespace-nowrap transition-all
                  ${selectedCategory === item.key ? "bg-[#0056B3] text-white border-[#0056B3]" : "bg-white text-black border-gray-300"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        <main className="flex flex-col items-center">
          <h2 className="sr-only">{selectedCategory} Catalog</h2>

          {loading ? (
            <div className="flex flex-col items-center py-24 w-full">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-[#0056B3] mb-4"></div>
              <p className="text-[#0056B3] font-black text-xs animate-pulse tracking-widest">LOADING COURSES...</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-6 w-full">
              {courses.slice(0, displayLimit).map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          )}

          {!loading && courses.length > displayLimit && (
            <button
              onClick={() => setIsPopupOpen(true)}
              className="mt-10 bg-[#0056B3] text-white font-black py-3 px-10 rounded-full uppercase text-[10px] md:text-sm shadow-lg hover:shadow-xl active:scale-95 transition-all"
            >
              Explore Full Catalog
            </button>
          )}
        </main>

        {/* Popup */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsPopupOpen(false)} />
            <div className="relative bg-white w-full max-w-6xl max-h-[85vh] rounded-xl overflow-hidden flex flex-col">
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="font-black text-sm md:text-2xl uppercase text-[#0056B3]">{selectedCategory} Programs</h3>
                <button onClick={() => setIsPopupOpen(false)}><X className="w-7 h-7" /></button>
              </div>
              <div className="p-3 md:p-10 overflow-y-auto bg-gray-50 flex-1">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 md:gap-5">
                  {courses.map((course, index) => (
                    <CourseCard key={course._id} course={course} index={index} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}