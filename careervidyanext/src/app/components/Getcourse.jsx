"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/utlis/api.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ================= SCROLL ANIMATION HOOK ================= */
function useScrollAnimation() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ================= COURSE CARD ================= */
const CourseCard = ({ course }) => {
  const { ref, visible } = useScrollAnimation();

  return (
    <div
      ref={ref}
      // Width ko full karke max-width ko thoda badhaya hai taaki gaps cover ho jayein
      className={`w-full max-w-[180px] bg-white 
      border border-gray-100 rounded-lg shadow-sm cursor-pointer p-3
      transition-all duration-700 ease-out
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      hover:shadow-md hover:scale-[1.03] flex flex-col items-center justify-between`}
    >
      <div className="flex justify-center mb-2">
        <img
          src={course.courseLogo?.url || "/placeholder.png"}
          alt={course.name}
          className="w-12 h-12 object-contain"
        />
      </div>

      <div className="text-center mb-2 px-1">
        <h3 className="font-bold text-gray-800 text-[11px] line-clamp-2 leading-tight">
          {course.name}
        </h3>
      </div>

      <button className="bg-[#0056B3] text-white text-[10px] font-bold py-1.5 w-full rounded-md hover:opacity-90 cursor-pointer transition-colors">
        Know More
      </button>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function CoursesListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef(null);

  const sidebarItems = [
    { key: "All", title: "All Courses" },
    { key: "PG", title: "PG Courses" },
    { key: "ExecutiveEducation", title: "Executive" },
    { key: "UG", title: "UG Courses" },
    { key: "Doctorate", title: "Doctorate" },
  ];

  useEffect(() => setIsMounted(true), []);

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
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isMounted, selectedCategory]);

  const scrollLeft = () =>
    scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
  const scrollRight = () =>
    scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });

  if (!isMounted) return null;

  // Desktop par zyada courses dikhane ke liye limit badha sakte hain
  const desktopCourses = courses.slice(0, 24);
  const mobileCourses = courses.slice(0, 9);

  return (
    <div className="w-full bg-[#FBFBFB]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* ================= MOBILE CATEGORY BAR ================= */}
        <div className="block lg:hidden relative mb-8">
          <button onClick={scrollLeft} className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border p-1 rounded-full shadow-lg z-10 cursor-pointer">
            <ChevronLeft className="w-4 h-4 text-[#0056B3]" />
          </button>
          <button onClick={scrollRight} className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border p-1 rounded-full shadow-lg z-10 cursor-pointer">
            <ChevronRight className="w-4 h-4 text-[#0056B3]" />
          </button>
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto scrollbar-hide px-8">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedCategory(item.key)}
                className={`whitespace-nowrap px-5 py-2 text-xs font-bold border rounded-full transition-all cursor-pointer
                  ${selectedCategory === item.key ? "bg-[#0056B3] text-white border-[#0056B3]" : "bg-white text-gray-600 border-gray-200"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="w-full">
          <h2 className="text-2xl md:text-3xl font-black mb-8 text-[#0056B3] text-center uppercase tracking-tight">
            {loading ? "Loading..." : `${selectedCategory} Programs`}
          </h2>

          {/* ===== DESKTOP GRID (Gaps and Alignment Fixed) ===== */}
          <div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 justify-items-center">
            {desktopCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* ===== MOBILE GRID (Optimized) ===== */}
          <div className="sm:hidden grid grid-cols-2 gap-4">
            {mobileCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </main>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar { display: none; }
          .scrollbar-hide { scrollbar-width: none; }
        `}</style>
      </div>
    </div>
  );
}