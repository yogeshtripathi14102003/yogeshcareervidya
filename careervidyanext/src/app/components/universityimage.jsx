
// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import api from "@/utlis/api.js";

// export default function UniversitiesPage() {
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch universities from backend
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

//   return (
//     <section className="py-16 bg-white text-center">
//       <h2 className="text-4xl font-bold mb-8">
//         Explore over 100 online universities & Compare on 30+ factors
//       </h2>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 lg:px-16">
//         {universities.map((uni) => (
//           <div
//             key={uni._id}
//             className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center justify-center"
//           >
//             {/* ---------- University Logo ---------- */}
//             <div className="relative w-32 h-16 mb-4">
//               <Image
//                 src={
//                   uni.universityImage?.startsWith("http")
//                     ? uni.universityImage
//                     : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage?.replace(/^\/+/, "")}`
//                 }
//                 alt={uni.name}
//                 fill
//                 className="object-contain"
//                 onError={(e) => (e.target.src = "/no-image.png")}
//               />
//             </div>

//             {/* ---------- Total Courses ---------- */}
//             <p className="font-semibold text-lg text-gray-800">
//               {uni.courses?.length || 0} Courses
//             </p>

//             {/* ---------- University Name ---------- */}
//             <p className="text-gray-600 mt-1 text-sm">{uni.name}</p>

//             {/*  
//             -------------------------------------------------
//             COURSES LIST (COMMENTED OUT)
//             -------------------------------------------------
            
//             <div className="w-full mt-4">
//               {uni.courses?.map((course, i) => (
//                 <div
//                   key={i}
//                   className="border rounded-xl p-3 mt-2 bg-gray-50 text-left"
//                 >
//                   <div className="flex items-center gap-3">
//                     {course.logo && (
//                       <div className="relative w-10 h-10">
//                         <Image
//                           src={
//                             course.logo.startsWith("http")
//                               ? course.logo
//                               : `${process.env.NEXT_PUBLIC_API_URL}/${course.logo?.replace(/^\/+/, "")}`
//                           }
//                           alt={course.name}
//                           fill
//                           className="object-contain"
//                         />
//                       </div>
//                     )}
//                     <p className="text-sm font-semibold text-gray-700">
//                       {course.name}
//                     </p>
//                   </div>

//                   {course.duration && (
//                     <p className="text-xs text-gray-500 mt-1">
//                       Duration: {course.duration}
//                     </p>
//                   )}
//                 </div>
//               ))}
//             </div>
//             */}
//           </div>
//         ))}
//       </div>

//       <button className="mt-10 bg-[#0056B3] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#003d82] transition">
//         VIEW MORE UNIVERSITIES →
//       </button>
//     </section>
//   );
// }




"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

export default function UniversitiesPage() {
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex justify-center items-center h-[50vh] text-gray-500">
        Loading universities...
      </div>
    );
  }

  return (
    <section className="py-16 bg-white text-center">
      <h2 className="text-4xl font-bold mb-8">
        Explore over 100 online universities & Compare on 30+ factors
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 px-6 lg:px-16">
        {universities.map((uni) => (
          <div
            key={uni._id}
            className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition duration-300 flex flex-col items-center justify-center"
          >
            {/* University Logo */}
            <div className="relative w-32 h-16 mb-4">
              <Image
                src={
                  uni.universityImage?.startsWith("http")
                    ? uni.universityImage
                    : `${process.env.NEXT_PUBLIC_API_URL}/${uni.universityImage?.replace(
                        /^\/+/,
                        ""
                      )}`
                }
                alt={uni.name}
                fill
                className="object-contain"
              />
            </div>

            {/* REMOVE COURSES COMPLETELY */}
            {/* <p className="font-semibold text-lg text-gray-800">
              {uni.courses?.length || 0} Courses
            </p> */}

            {/* University Name */}
            <p className="text-gray-600 mt-1 text-sm">{uni.name}</p>
          </div>
        ))}
      </div>

      <button className="mt-10 bg-[#0056B3] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#003d82] transition">
        VIEW MORE UNIVERSITIES →
      </button>
    </section>
  );
}
