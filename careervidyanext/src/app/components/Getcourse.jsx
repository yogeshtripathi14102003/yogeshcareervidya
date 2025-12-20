"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import { X } from "lucide-react";

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
      { threshold: 0.1 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}

/* ================= COURSE CARD ================= */
const CourseCard = ({ course, isPopup = false, index }) => {
  const router = useRouter();
  const { ref, visible } = useScrollAnimation();

  // Sirf pehle 5 items click honge (0, 1, 2, 3, 4)
  const isClickable = index < 1;

  const handleClick = () => {
    if (isClickable) {
      router.push(`/course/${course.slug}`);
    }
  };

  return (
    <div
      ref={isPopup ? null : ref}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      className={`
        w-full bg-white border-2 border-gray-200 rounded-md p-2 
        transition-all duration-500 ease-out
        flex flex-col items-center justify-between h-full
        ${isPopup ? "opacity-100" : visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
        ${isClickable 
            ? "cursor-pointer hover:border-[#0056B3] hover:scale-[1.03] active:scale-[0.98]" 
            : "cursor-default"
        }
      `}
    >
      <div className="flex justify-center mb-1.5 pointer-events-none">
        <img
          src={course.courseLogo?.url || "/placeholder.png"}
          alt={course.name}
          className="w-10 h-10 md:w-12 md:h-12 object-contain"
        />
      </div>

      <div className="text-center mb-1.5 px-0.5 pointer-events-none">
        <h3 className="font-black text-gray-600 text-[9px] md:text-[11px] line-clamp-2 leading-tight uppercase">
          {course.name}
        </h3>
      </div>

      <div className="bg-[#0056B3] text-white text-[8px] md:text-[10px] font-black py-1.5 w-full rounded-sm text-center uppercase pointer-events-none">
        Know More
      </div>
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function CoursesListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isMounted, setIsMounted] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(24);
  const scrollRef = useRef(null);

  const sidebarItems = [
    { key: "All", title: "All Courses" },
    { key: "PG", title: "PG Courses" },
    { key: "ExecutiveEducation", title: "Executive" },
    { key: "UG", title: "UG Courses" },
    { key: "Doctorate", title: "Doctorate" },
  ];

  useEffect(() => {
    setIsMounted(true);
    const updateLimit = () => {
      setDisplayLimit(window.innerWidth < 768 ? 9 : 24);
    };
    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

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
        
        const fetchedCourses = res.data.courses || [];
        setCourses([...fetchedCourses].reverse());
        
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [isMounted, selectedCategory]);

  if (!isMounted) return null;

  return (
    <div className="w-full bg-[#f4f4f4]">
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-10">

        {/* MOBILE CATEGORY */}
        <div className="block lg:hidden mb-8">
          <div ref={scrollRef} className="flex gap-2 overflow-x-auto pb-4 custom-scrollbar px-1">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedCategory(item.key)}
                className={`px-5 py-2 text-[11px] font-black border-2 rounded-full whitespace-nowrap transition-all
                  ${selectedCategory === item.key
                    ? "bg-[#0056B3] text-white border-[#0056B3] shadow-md"
                    : "bg-white text-black border-gray-300"}`}
              >
                {item.title}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex flex-col items-center">
          <h2 className="text-2xl md:text-4xl font-black mb-10 text-[#0056B3] uppercase text-center tracking-tight">
            {loading ? "Loading..." : `${selectedCategory} Programs`}
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-6 w-full">
            {courses.slice(0, displayLimit).map((course, index) => (
              <CourseCard key={course._id} course={course} index={index} />
            ))}
          </div>

          {!loading && courses.length > displayLimit && (
            <button
              onClick={() => setIsPopupOpen(true)}
              className="mt-10 bg-[#0056B3] text-white font-black py-3 px-12 rounded-full uppercase tracking-widest text-sm shadow-lg active:scale-95 transition-all cursor-pointer"
            >
              View More
            </button>
          )}
        </main>

        {/* POPUP MODAL */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-3">
            <div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              onClick={() => setIsPopupOpen(false)}
            />
            <div className="relative bg-white w-full max-w-6xl max-h-[90vh] rounded-2xl overflow-hidden flex flex-col shadow-2xl">
              <div className="flex justify-between items-center p-5 border-b-2 border-gray-100">
                <h3 className="font-black text-lg md:text-2xl uppercase text-[#0056B3]">
                  Explore {selectedCategory} Catalog
                </h3>
                
                <button 
                  onClick={() => setIsPopupOpen(false)} 
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer group"
                  aria-label="Close modal"
                >
                  <X className="w-7 h-7 text-black font-bold group-hover:text-red-600 transition-colors" />
                </button>
              </div>

              <div className="p-4 md:p-8 overflow-y-auto bg-[#f9f9f9] flex-1">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5">
                  {courses.map((course, index) => (
                    <CourseCard key={course._id} course={course} index={index} isPopup />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          .custom-scrollbar::-webkit-scrollbar {
            height: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #e5e7eb;
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #0056B3;
            border-radius: 10px;
          }
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: #0056B3 #e5e7eb;
          }
        `}</style>
      </div>
    </div>
  );
}