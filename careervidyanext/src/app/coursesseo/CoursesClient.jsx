"use client";

import { useEffect, useState, useMemo } from "react";
import api from "@/utlis/api.js";
import { X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const globalCoursesCache = {};

const CourseCard = ({ course, index }) => {
  const isClickable = index < 25;

  return (
    <Link
      href={`/course/${course.slug}`}
      className={`w-full bg-white border-[1px] md:border-2 border-gray-200 rounded-md p-1.5 md:p-2 
      flex flex-col items-center justify-between h-full transition-all duration-200
      ${isClickable ? "cursor-pointer hover:border-[#0056B3] hover:shadow-md" : "pointer-events-none opacity-70"}`}
    >
      <div className="flex justify-center mb-1">
        <Image
          src={course.courseLogo?.url || "/placeholder.png"}
          alt={course.name}
          width={50}
          height={50}
          className="object-contain"
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
    </Link>
  );
};

export default function CoursesClient({ initialCourses = [] }) {
  const [courses, setCourses] = useState(initialCourses);
  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(24);

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

  // ✅ FETCH COURSES
  useEffect(() => {
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

  // ✅ FULL DATA FOR POPUP
  const fetchAllCourses = async () => {
    try {
      const url =
        selectedCategory === "All"
          ? `/api/v1/short?limit=1000`
          : `/api/v1/short?category=${selectedCategory}&limit=1000`;

      const res = await api.get(url);
      setAllCourses(res.data.courses || []);
    } catch (err) {
      console.error(err);
    }
  };

  const visibleCourses = useMemo(() => {
    return [...courses].reverse().slice(0, displayLimit);
  }, [courses, displayLimit]);

  const sortedPopupCourses = useMemo(() => {
    return [...allCourses].reverse();
  }, [allCourses]);

  return (
    <div className="w-full bg-white">
      <div className="max-w-7xl mx-auto px-2 md:px-6 py-6 md:py-10">
        
        {/* ✅ SEO HEADING */}
        <header className="mb-6 md:mb-10 text-center">
          <h1 className="text-xl md:text-4xl font-black text-[#0056B3] uppercase">
            Job-Oriented Professional Courses
          </h1>
          <p className="mt-1 text-gray-500 text-[10px] md:text-sm italic">
            Empowering your future with CareerVidya
          </p>
        </header>

        {/* CATEGORY */}
        <div className="block lg:hidden mb-6">
          <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide">
            {sidebarItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setSelectedCategory(item.key)}
                className={`px-4 py-1.5 text-[10px] font-black border-2 rounded-full whitespace-nowrap
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
        </div>

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
              className="mt-10 bg-[#0056B3] text-white font-black py-3 px-10 rounded-full uppercase text-[10px] md:text-sm"
            >
              Explore Full Catalog
            </button>
          )}
        </main>

        {/* POPUP */}
        {isPopupOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-2">
            <div
              className="absolute inset-0 bg-black/70"
              onClick={() => setIsPopupOpen(false)}
            />
            <div className="relative bg-white w-full max-w-6xl max-h-[85vh] overflow-hidden flex flex-col rounded-lg">
              
              <div className="flex justify-between p-4 border-b">
                <h3 className="font-black text-[#0056B3] uppercase">
                  {selectedCategory} Programs
                </h3>
                <button onClick={() => setIsPopupOpen(false)}>
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-4 overflow-y-auto flex-1 bg-gray-50">
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {sortedPopupCourses.map((course, index) => (
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