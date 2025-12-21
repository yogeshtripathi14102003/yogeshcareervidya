"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
// import Link from "next/link"; // Link disabled as per requirement
import api from "@/utlis/api.js";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayLimit, setDisplayLimit] = useState(18);

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
      <div className="flex justify-center items-center h-[50vh] text-gray-500 bg-white">
        Loading universities...
      </div>
    );
  }

  const handleViewMore = () => {
    // setDisplayLimit(prev => prev + 6); // Click action commented
  };

  return (
    <section className="py-16 bg-white font-sans overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Heading - Simple & Left Aligned */}
        <div className="mb-12 text-left">
          <h2 className="text-2xl md:text-4xl font-bold text-[#002147] leading-tight">
            Explore over 100 online universities & Compare on 30+ factors
          </h2>
          <div className="w-16 h-1 bg-[#0056B3] mt-4 rounded-full"></div>
        </div>

        {/* Grid - Universities Display Only (No Links) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-start">
          {universities.slice(0, displayLimit).map((uni) => {
            const imageUrl = uni.universityImage
              ? uni.universityImage.startsWith("http")
                ? uni.universityImage
                : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage.replace(/^\/+/, "")}`
              : "/fallback.png";

            return (
              /* Card changed from Link to div to disable redirection */
              <div
                key={uni._id}
                className="group bg-white border border-gray-200 rounded-xl p-4 shadow-sm 
                           flex flex-col items-center justify-center 
                           w-full max-w-[160px] h-[170px] cursor-default"
              >
                {/* University Logo */}
                <div className="relative w-full h-14 mb-3">
                  <Image
                    src={imageUrl}
                    alt={uni.name || "University"}
                    fill
                    className="object-contain"
                  />
                </div>

                {/* University Name - Simple Clean Font */}
                <p className="text-gray-800 font-bold text-[13px] text-center leading-snug">
                  {uni.name}
                </p>
              </div>
            );
          })}
        </div>

        {/* View More Button - Left Aligned & Action Disabled */}
        {universities.length > displayLimit && (
          <div className="mt-12 text-left">
            <button 
              className="bg-[#0056B3] text-white px-8 py-3 rounded-lg font-semibold 
                         opacity-90 hover:opacity-100 transition shadow-md"
              onClick={handleViewMore}
            >
              VIEW MORE UNIVERSITIES →
            </button>
          </div>
        )}
      </div>
    </section>
  );
}




// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import api from "@/utlis/api.js";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const getFullImageUrl = (path) => {
//   if (!path) return null;
//   return path.startsWith("http")
//     ? path
//     : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// export default function UniversitiesPage() {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const initialLimit = 8;
//   const [displayLimit, setDisplayLimit] = useState(initialLimit);

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

//   const toggleView = () => {
//     setDisplayLimit(
//       displayLimit >= universities.length
//         ? initialLimit
//         : universities.length
//     );
//   };

//   if (loading)
//     return (
//       <div className="text-center py-20 text-gray-400 font-medium">
//         Loading...
//       </div>
//     );

//   return (
//     <section className="py-10 bg-[#F8FAFC]">
//       <div className="max-w-[1200px] mx-auto px-4">
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//           {universities.slice(0, displayLimit).map((uni) => {
//             const certFullUrl = getFullImageUrl(
//               uni.recognition?.certificateImage
//             );
//             const bannerFullUrl = getFullImageUrl(uni.universityImage);

//             const rawPoints =
//               uni.approvals ||
//               uni.recognition?.recognitionPoints ||
//               [];

//             const approvalsText = Array.isArray(rawPoints)
//               ? rawPoints
//                   .map((item) =>
//                     typeof item === "object"
//                       ? item.name || item.label
//                       : item
//                   )
//                   .join(", ")
//               : rawPoints;

//             return (
//               <div
//                 key={uni._id}
//                 className="
//                 bg-white
//                 rounded-[1.2rem]
//                 border border-gray-200
//                 overflow-hidden
//                 flex flex-col
//                 transition-all
//                 hover:border-gray-300
//                 "
//               >
//                 {/* TOP BANNER — CLEAR */}
//                 <div className="w-full bg-white">
//                   <Image
//                     src={certFullUrl || "/fallback.png"}
//                     alt="Certificate"
//                     width={600}
//                     height={300}
//                     className="w-full h-auto object-contain"
//                   />
//                 </div>

//                 <div className="p-3 flex flex-col">
//                   {/* UNIVERSITY NAME */}
//                   <h3 className="text-base font-black text-[#0A1D37] mb-2 min-h-[40px] line-clamp-2 leading-tight">
//                     {uni.name}
//                   </h3>

//                   {/* APPROVAL BOX */}
//                   <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-3 min-h-[60px] gap-2">
//                     <div className="flex items-start gap-1 flex-1">
//                       <span className="text-sm">🏆</span>
//                       <p className="text-[14.5px] font-bold text-gray-800 uppercase tracking-tight leading-[1.1] line-clamp-3">
//                         {approvalsText || "Approvals Verified"}
//                       </p>
//                     </div>

//                     {bannerFullUrl && (
//                       <div className="relative w-20 h-13 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200">
//                         <img
//                           src={bannerFullUrl}
//                           alt="Uni"
//                           className="w-full h-full object-contain"
//                         />
//                       </div>
//                     )}
//                   </div>

//                   {/* COURSE INFO */}
//                   <div className="flex items-center gap-1.5 mb-3 text-[#0056B3] font-bold text-[13px]">
//                     <span>📚</span>
//                     <span>{uni.courses?.length || 0} Courses</span>
//                   </div>

//                   {/* ACTION BUTTONS */}
//                   <div className="grid grid-cols-3 gap-1 mt-auto">
//                     <button className="bg-[#05347f] text-white py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-[#9c3f0a] transition active:scale-95">
//                       Details
//                     </button>
//                     <button className="bg-white border border-gray-300 text-[#0A1D37] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-50 transition active:scale-95">
//                       Apply
//                     </button>
//                     <button className="bg-[#05347f] text-white py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-[#9c3f0a] transition active:scale-95">
//                       Compare
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* VIEW MORE / LESS */}
//         {universities.length > initialLimit && (
//           <div className="mt-10 flex justify-center">
//             <button
//               onClick={toggleView}
//               className={`px-8 py-2.5 rounded-full font-bold text-[10px] tracking-widest uppercase transition-all active:scale-95 ${
//                 displayLimit >= universities.length
//                   ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
//                   : "bg-[#0056B3] text-white hover:bg-[#003d82]"
//               }`}
//             >
//               {displayLimit >= universities.length
//                 ? "Show Less ↑"
//                 : `Explore All ${universities.length} Universities ↓`}
//             </button>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }
