// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link"; 
// import api from "@/utlis/api.js";

// export default function UniversitiesPage() {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [displayLimit, setDisplayLimit] = useState(18); // Initial display limit

//   const fetchUniversities = async () => {
//     try {
//       const res = await api.get("/api/v1/university");
//       setUniversities(res.data?.data || []);
//     } catch (err) {
//       console.error("Error fetching universities:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-[50vh] text-gray-500">
//         Loading universities...
//       </div>
//     );
//   }

//   if (universities.length === 0) {
//     return (
//       <div className="flex justify-center items-center h-[50vh] text-gray-500">
//         No universities found.
//       </div>
//     );
//   }

//   const handleViewMore = () => {
//     setDisplayLimit(prevLimit => prevLimit + 6); 
//   };

//   return (
//     <section className="py-16 bg-white text-center">
//       <h2 className="text-4xl font-bold mb-8 text-gray-900">
//         Explore over 100 online universities & Compare on 30+ factors
//       </h2>

//       <div className="max-w-7xl mx-auto px-6 lg:px-8">
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 justify-items-center">
//           {universities.slice(0, displayLimit).map((uni) => {
//             const imageUrl = uni.universityImage
//               ? uni.universityImage.startsWith("http")
//                 ? uni.universityImage
//                 : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
//               : "/fallback.png";
            
//             const courseCount = uni.courses?.length || 0; 

//             return (
//               <Link
//                 key={uni._id}
//                 href={`/university/${uni.slug}`}
//                 className="bg-white border rounded-2xl p-4 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center justify-center w-full max-w-[150px] h-[180px]"
//               >
//                 <div className="relative w-24 h-12 mb-2">
//                   <Image
//                     src={imageUrl}
//                     alt={uni.name || "University"}
//                     fill
//                     className="object-contain"
//                   />
//                 </div>

//                 <p className="text-gray-700 font-semibold text-xs text-center leading-tight mb-1">
//                   {uni.name}
//                 </p>
//                 <p className="text-xs text-gray-500">{courseCount} Courses</p>
//               </Link>
//             );
//           })}
//         </div>
//       </div>

//       {universities.length > displayLimit && (
//         <button 
//           className="mt-10 bg-[#0056B3] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#003d82] transition"
//           onClick={handleViewMore}
//         >
//           VIEW MORE UNIVERSITIES →
//         </button>
//       )}
//     </section>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

// Helper to handle backend image paths
const getImageUrl = (path, fallback = "/fallback.png") => {
  if (!path) return fallback;
  return path.startsWith("http")
    ? path
    : `${process.env.NEXT_PUBLIC_API_URL}/${path.replace(/^\/+/, "")}`;
};

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(6);

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");
      setUniversities(res.data?.data || []);
    } catch (err) {
      console.error("Error fetching universities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-gray-500 font-medium">
        Loading universities...
      </div>
    );
  }

  return (
    <section className="py-16 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center text-gray-900">
          Explore over 100 online universities & compare on 30+ factors
        </h2>

        {/* ===== GRID ===== */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {universities.slice(0, displayLimit).map((uni) => (
            <div
              key={uni._id}
              className="bg-white rounded-[2rem] shadow-md border border-gray-100 overflow-hidden flex flex-col transition-transform hover:scale-[1.02]"
            >
              {/* 1. BANNER IMAGE (Building Image) */}
              <div className="relative w-full h-52">
                <Image
                  src={getImageUrl(uni.universityImage)}
                  alt={uni.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* ===== CARD CONTENT ===== */}
              <div className="p-6 flex flex-col flex-grow">
                {/* 2. UNIVERSITY NAME */}
                <h3 className="text-2xl font-extrabold text-[#1a2b4b] mb-4 leading-tight">
                  {uni.name}
                </h3>

                {/* 3. APPROVALS / CERTIFICATES */}
                <div className="flex items-start gap-3 mb-4">
                  <span className="text-xl">🏆</span>
                  <p className="text-sm font-bold text-[#344054] tracking-wide">
                    {uni.approvals && uni.approvals.length > 0 
                      ? uni.approvals.join(", ") 
                      : "NIRF, NAAC A+, QS, AICTE, WES"}
                  </p>
                </div>

                {/* 4. COURSES + LOGO ROW */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-2 text-[#0056B3] font-bold">
                    <div className="flex flex-col">
                        <span className="text-2xl leading-none">📚</span>
                    </div>
                    <span className="text-lg">{uni.courses?.length || 0} Courses</span>
                  </div>

                  {/* SMALL LOGO */}
                  <div className="relative w-24 h-12 border rounded-lg p-1 bg-white shadow-sm">
                    <Image
                      src={getImageUrl(uni.universityLogo, "/logo-placeholder.png")}
                      alt="Logo"
                      fill
                      className="object-contain p-1"
                    />
                  </div>
                </div>

                {/* 5. ACTION BUTTONS (Matching Screenshot) */}
                <div className="grid grid-cols-3 gap-2 mt-auto">
                  <button className="bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition">
                    Details
                  </button>
                  <button className="border-2 border-gray-200 text-black font-bold py-3 rounded-xl text-sm hover:bg-gray-50 transition">
                    Apply Now
                  </button>
                  <button className="bg-black text-white font-semibold py-3 rounded-xl text-sm hover:bg-gray-800 transition">
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ===== VIEW MORE BUTTON ===== */}
        {universities.length > displayLimit && (
          <div className="text-center mt-12">
            <button
              onClick={() => setDisplayLimit((prev) => prev + 3)}
              className="bg-[#0056B3] text-white px-10 py-4 rounded-full font-bold text-sm tracking-widest hover:bg-[#004494] transition shadow-lg"
            >
              VIEW MORE UNIVERSITIES →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}