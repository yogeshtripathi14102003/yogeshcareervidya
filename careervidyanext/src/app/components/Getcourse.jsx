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
      className={`w-full max-w-[160px] flex flex-col justify-between bg-white 
      border border-gray-200 rounded-md shadow-sm cursor-pointer p-2 min-h-[120px]
      transition-all duration-700 ease-out
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      hover:shadow-md hover:scale-[1.02]`}
    >
      <div className="flex justify-center mt-1">
        <img
          src={course.courseLogo?.url || "/placeholder.png"}
          alt={course.name}
          className="w-12 h-12 object-contain"
        />
      </div>

      <div className="text-center mt-2 mb-1 px-1 flex-1">
        <h3 className="font-semibold text-gray-800 text-[10px] line-clamp-2 leading-tight">
          {course.name}
        </h3>
      </div>

      <button className="bg-[#0056B3] text-white text-[9px] font-semibold py-1 w-full rounded mt-1 hover:opacity-90">
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
    { key: "ExecutiveEducation", title: "Executive Education" },
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

  const desktopCourses = courses.slice(0, 20);
  const mobileCourses = courses.slice(0, 6);

  return (
    <div className="w-full bg-white">
      <div className="w-full mx-auto px-4 md:px-6 py-4">

        {/* ================= MOBILE CATEGORY BAR ================= */}
        <div className="block lg:hidden relative mb-6">
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border p-1 rounded-full shadow z-10"
          >
            <ChevronLeft className="w-4 h-4 text-[#0056B3]" />
          </button>

          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border p-1 rounded-full shadow z-10"
          >
            <ChevronRight className="w-4 h-4 text-[#0056B3]" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto scrollbar-hide px-6"
          >
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedCategory(item.key)}
                className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border
                  ${
                    selectedCategory === item.key
                      ? "bg-[#0056B3] text-white border-[#0056B3]"
                      : "bg-white text-[#0056B3] border-gray-300"
                  }`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* ================= MAIN CONTENT ================= */}
        <main className="w-full">
          <h2 className="text-3xl font-extrabold mb-5 text-[#0056B3] text-center">
            {loading ? "Loading..." : `${selectedCategory} Courses`}
          </h2>

          {/* ===== DESKTOP GRID (FIXED WIDTH) ===== */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 place-items-center">
            {desktopCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* ===== MOBILE GRID ===== */}
          <div className="sm:hidden grid grid-cols-3 gap-2 place-items-center">
            {mobileCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        </main>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            scrollbar-width: none;
          }
        `}</style>
      </div>
    </div>
  );
}
