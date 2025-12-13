


// "use client";

// import { useEffect, useState, useRef } from "react";
// import api from "@/utlis/api.js";
// import { ChevronLeft, ChevronRight, X } from "lucide-react";
// import Link from "next/link";

// /* ================= SCROLL ANIMATION HOOK ================= */
// function useScrollAnimation() {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold: 0.15 }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, []);

//   return { ref, visible };
// }

// /* ================= COURSE CARD ================= */
// const CourseCard = ({ course }) => {
//   const { ref, visible } = useScrollAnimation();

//   return (
//     <div
//       ref={ref}
//       className={`flex flex-col justify-between bg-white border border-gray-200 rounded-md
//       shadow-sm cursor-pointer p-2 min-h-[120px]
//       transition-all duration-700 ease-out
//       ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
//       hover:shadow-md hover:scale-[1.02]`}
//     >
//       <Link href={`/course/${course.slug}`} className="flex-1 flex flex-col">
//         <div className="flex justify-center mt-1">
//           <img
//             src={course.courseLogo?.url || "/placeholder.png"}
//             alt={course.name}
//             className="w-8 h-8 object-contain"
//           />
//         </div>

//         <div className="text-center mt-2 mb-1 px-1 flex-1">
//           <h3 className="font-semibold text-gray-800 text-[10px] line-clamp-2 leading-tight">
//             {course.name}
//           </h3>
//         </div>
//       </Link>

//       <Link href={`/course/${course.slug}`}>
//         <button className="bg-[#0056B3] text-white text-[9px] font-semibold py-1 w-full rounded mt-1 hover:opacity-90">
//           Know More
//         </button>
//       </Link>
//     </div>
//   );
// };

// /* ================= MAIN PAGE ================= */
// export default function CoursesListingPage() {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState("All");
//   const [showAll, setShowAll] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);
//   const scrollRef = useRef(null);

//   const sidebarItems = [
//     { key: "All", title: "All Courses", subtitle: "Browse everything" },
//     { key: "PG", title: "PG Courses", subtitle: "After Graduation" },
//     {
//       key: "ExecutiveEducation",
//       title: "Executive Education",
//       subtitle: "For Working Professionals",
//     },
//     { key: "UG", title: "UG Courses", subtitle: "After 12th" },
//     {
//       key: "Doctorate",
//       title: "Doctorate",
//       subtitle: "Get Dr. Title",
//     },
//   ];

//   useEffect(() => setIsMounted(true), []);

//   useEffect(() => {
//     if (!isMounted) return;

//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const url =
//           selectedCategory === "All"
//             ? "/api/v1/course"
//             : `/api/v1/course?category=${selectedCategory}`;
//         const res = await api.get(url);
//         setCourses(res.data.courses || []);
//       } catch (err) {
//         console.error("Error fetching courses:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCourses();
//   }, [isMounted, selectedCategory]);

//   const scrollLeft = () =>
//     scrollRef.current?.scrollBy({ left: -150, behavior: "smooth" });
//   const scrollRight = () =>
//     scrollRef.current?.scrollBy({ left: 150, behavior: "smooth" });

//   if (!isMounted) return null;

//   const desktopCourses = courses.slice(0, 20);
//   const mobileCourses = courses.slice(0, 6);

//   return (
//     <div className="flex justify-center w-full bg-white">
//       <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 px-4 md:px-6 py-4 shadow-lg rounded-lg">

//         {/* ================= SIDEBAR ================= */}
//         <aside className="lg:w-1/5 lg:bg-white lg:border lg:border-gray-200 lg:shadow p-4 rounded-lg">

//           <h3 className="hidden lg:block text-xl font-bold text-[#0056B3] mb-6">
//             Categories
//           </h3>

//           {/* MOBILE CATEGORY SCROLL */}
//           <div className="block lg:hidden relative mb-6">
//             <button
//               onClick={scrollLeft}
//               className="absolute left-0 top-1/2 -translate-y-1/2 bg-white border p-1 rounded-full shadow z-10"
//             >
//               <ChevronLeft className="w-4 h-4 text-[#0056B3]" />
//             </button>

//             <button
//               onClick={scrollRight}
//               className="absolute right-0 top-1/2 -translate-y-1/2 bg-white border p-1 rounded-full shadow z-10"
//             >
//               <ChevronRight className="w-4 h-4 text-[#0056B3]" />
//             </button>

//             <div
//               ref={scrollRef}
//               className="flex gap-3 overflow-x-auto scrollbar-hide px-6"
//             >
//               {sidebarItems.map((item) => (
//                 <button
//                   key={item.key}
//                   onClick={() => setSelectedCategory(item.key)}
//                   className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border transition-all
//                     ${
//                       selectedCategory === item.key
//                         ? "bg-[#0056B3] text-white border-[#0056B3]"
//                         : "bg-white text-[#0056B3] border-gray-300"
//                     }`}
//                 >
//                   {item.title}
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* DESKTOP SIDEBAR */}
//           <div className="hidden lg:block space-y-3">
//             {sidebarItems.map((item) => (
//               <div
//                 key={item.key}
//                 onClick={() => setSelectedCategory(item.key)}
//                 className={`p-3 cursor-pointer rounded-lg border transition-all
//                   ${
//                     selectedCategory === item.key
//                       ? "border-[#0056B3] bg-blue-50 shadow-sm"
//                       : "border-transparent hover:border-[#0056B3]/30 hover:bg-blue-50/40"
//                   }`}
//               >
//                 <h4 className="font-semibold text-gray-800 text-sm">
//                   {item.title}
//                 </h4>
//                 <p className="text-xs text-gray-500 mt-0.5">
//                   {item.subtitle}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </aside>

//         {/* ================= MAIN ================= */}
//         <main className="flex-1">
//           <h2 className="text-3xl font-extrabold mb-5 text-[#0056B3]">
//             {loading ? "Loading..." : `${selectedCategory} Courses`}
//           </h2>

//           {/* Desktop Grid */}
//           <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
//             {desktopCourses.map((course) => (
//               <CourseCard key={course._id} course={course} />
//             ))}
//           </div>

//           {/* Mobile Grid */}
//           <div className="sm:hidden grid grid-cols-3 gap-2">
//             {mobileCourses.map((course) => (
//               <CourseCard key={course._id} course={course} />
//             ))}
//           </div>

//           <div className="text-center mt-6">
//             <button
//               onClick={() => setShowAll(true)}
//               className="bg-[#0056B3] text-white px-6 py-2 rounded-md font-semibold"
//             >
//               View All
//             </button>
//           </div>
//         </main>

//         {/* ================= MODAL ================= */}
//         {showAll && (
//           <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-12 p-4 overflow-y-auto">
//             <div className="bg-white w-full max-w-5xl p-6 rounded-xl relative">
//               <button
//                 onClick={() => setShowAll(false)}
//                 className="absolute top-4 right-4 bg-gray-200 rounded-full p-1"
//               >
//                 <X className="w-5 h-5" />
//               </button>

//               <div className="grid sm:grid-cols-3 gap-3">
//                 {courses.map((course) => (
//                   <CourseCard key={course._id} course={course} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         )}

//         <style jsx>{`
//           .scrollbar-hide::-webkit-scrollbar {
//             display: none;
//           }
//           .scrollbar-hide {
//             scrollbar-width: none;
//           }
//         `}</style>
//       </div>
//     </div>
//   );
// }



"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/utlis/api.js";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";

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
      className={`flex flex-col justify-between bg-white border border-gray-200 rounded-md
      shadow-sm cursor-pointer p-2 min-h-[120px]
      transition-all duration-700 ease-out
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}
      hover:shadow-md hover:scale-[1.02]`}
    >
      {/* <Link href={`/course/${course.slug}`} className="flex-1 flex flex-col"> */}
        <div className="flex justify-center mt-1">
          <img
            src={course.courseLogo?.url || "/placeholder.png"}
            alt={course.name}
            className="w-8 h-8 object-contain"
          />
        </div>

        <div className="text-center mt-2 mb-1 px-1 flex-1">
          <h3 className="font-semibold text-gray-800 text-[10px] line-clamp-2 leading-tight">
            {course.name}
          </h3>
        </div>
      {/* </Link> */}

      {/* <Link href={`/course/${course.slug}`}> */}
        <button className="bg-[#0056B3] text-white text-[9px] font-semibold py-1 w-full rounded mt-1 hover:opacity-90">
          Know More
        </button>
      {/* </Link> */}
    </div>
  );
};

/* ================= MAIN PAGE ================= */
export default function CoursesListingPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const scrollRef = useRef(null);

  const sidebarItems = [
    { key: "All", title: "All Courses", subtitle: "Browse everything" },
    { key: "PG", title: "PG Courses", subtitle: "After Graduation" },
    {
      key: "ExecutiveEducation",
      title: "Executive Education",
      subtitle: "For Working Professionals",
    },
    { key: "UG", title: "UG Courses", subtitle: "After 12th" },
    {
      key: "Doctorate",
      title: "Doctorate",
      subtitle: "Get Dr. Title",
    },
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
        console.error("Error fetching courses:", err);
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
    <div className="flex justify-center w-full bg-white">
      <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 px-4 md:px-6 py-4 shadow-lg rounded-lg">

        {/* ================= SIDEBAR ================= */}
        <aside className="lg:w-1/5 lg:bg-white lg:border lg:border-gray-200 lg:shadow p-4 rounded-lg">

          <h3 className="hidden lg:block text-xl font-bold text-[#0056B3] mb-6">
            Categories
          </h3>

          {/* MOBILE CATEGORY SCROLL */}
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
                  // onClick={() => setSelectedCategory(item.key)}
                  className={`whitespace-nowrap px-4 py-2 text-sm font-semibold border transition-all
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

          {/* DESKTOP SIDEBAR */}
          <div className="hidden lg:block space-y-3">
            {sidebarItems.map((item) => (
              <div
                key={item.key}
                // onClick={() => setSelectedCategory(item.key)}
                className={`p-3 cursor-pointer rounded-lg border transition-all
                  ${
                    selectedCategory === item.key
                      ? "border-[#0056B3] bg-blue-50 shadow-sm"
                      : "border-transparent hover:border-[#0056B3]/30 hover:bg-blue-50/40"
                  }`}
              >
                <h4 className="font-semibold text-gray-800 text-sm">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-500 mt-0.5">
                  {item.subtitle}
                </p>
              </div>
            ))}
          </div>
        </aside>

        {/* ================= MAIN ================= */}
        <main className="flex-1">
          <h2 className="text-3xl font-extrabold mb-5 text-[#0056B3]">
            {loading ? "Loading..." : `${selectedCategory} Courses`}
          </h2>

          {/* Desktop Grid */}
          <div className="hidden sm:grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {desktopCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          {/* Mobile Grid */}
          <div className="sm:hidden grid grid-cols-3 gap-2">
            {mobileCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <div className="text-center mt-6">
            {/* <button
              onClick={() => setShowAll(true)}
              className="bg-[#0056B3] text-white px-6 py-2 rounded-md font-semibold"
            >
              View All
            </button> */}
          </div>
        </main>

        {/* ================= MODAL ================= */}
        {showAll && (
          <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-start pt-12 p-4 overflow-y-auto">
            <div className="bg-white w-full max-w-5xl p-6 rounded-xl relative">
              <button
                onClick={() => setShowAll(false)}
                className="absolute top-4 right-4 bg-gray-200 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="grid sm:grid-cols-3 gap-3">
                {courses.map((course) => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </div>
          </div>
        )}

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
