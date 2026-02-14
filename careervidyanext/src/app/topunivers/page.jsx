
// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Header from "@/app/layout/Header.jsx";
// import Comparenow from "@/app/topunivers/Comparenow.jsx";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const getFullImageUrl = (path) => {
//   if (!path) return null;
//   return path.startsWith("http")
//     ? path
//     : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// export default function UniversitiesPage() {
//   const router = useRouter();
//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [showCompareForm, setShowCompareForm] = useState(false);
//   const [selectedForCompare, setSelectedForCompare] = useState([]);

//   const initialLimit = 47;
//   const [displayLimit] = useState(initialLimit);

//   // ✅ State to check if user is logged in (client-side only)
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   useEffect(() => {
//     const token = localStorage.getItem("usertoken"); // Adjust according to your auth
//     setIsLoggedIn(!!token);
//   }, []);

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

//   const handleDetailsClick = (uni) => {
//     const path = uni.slug ? uni.slug : uni._id;
//     router.push(`/university/${path}`);
//   };

//   const handleCompareClick = (uni) => {
//     if (!selectedForCompare.find((item) => item._id === uni._id)) {
//       if (selectedForCompare.length < 3) {
//         setSelectedForCompare([...selectedForCompare, uni]);
//       } else {
//         alert("Maximum 3 Universities allowed for comparison.");
//       }
//     }
//   };

//   const removeFromCompare = (id) => {
//     setSelectedForCompare(selectedForCompare.filter((u) => u._id !== id));
//   };

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-gray-400 font-medium">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <>
//       <Header />
//       <section className="py-10 bg-[#F8FAFC] relative min-h-screen">
//         <div className="max-w-[1200px] mx-auto px-4 pb-40">
//           {/* Universities Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {universities.slice(0, displayLimit).map((uni) => {
//               const backgroundFullUrl = getFullImageUrl(
//                 uni.background?.backgroundImage
//               );
//               const bannerFullUrl = getFullImageUrl(uni.universityImage);

//               const rawPoints =
//                 uni.approvals ||
//                 uni.recognition?.recognitionPoints ||
//                 [];
//               const approvalsText = Array.isArray(rawPoints)
//                 ? rawPoints
//                     .map((item) =>
//                       typeof item === "object"
//                         ? item.name || item.label
//                         : item
//                     )
//                     .join(", ")
//                 : rawPoints;

//               return (
//                 <div
//                   key={uni._id}
//                   className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md"
//                 >
//                   {/* Background Image */}
//                   <div
//                     className="w-full h-[190px] relative bg-white cursor-pointer overflow-hidden border-b border-gray-100"
//                     onClick={() => handleDetailsClick(uni)}
//                   >
//                     <Image
//                       src={backgroundFullUrl || "/fallback-bg.png"}
//                       alt={uni.name}
//                       fill
//                       className="object-fill transition-transform duration-500 hover:scale-105"
//                     />
//                   </div>

//                   <div className="p-3 flex flex-col h-full">
//                     <h3
//                       onClick={() => handleDetailsClick(uni)}
//                       className="text-base font-black text-[#0A1D37] mb-2 min-h-[40px] line-clamp-2 leading-tight cursor-pointer hover:text-blue-700 transition-colors"
//                     >
//                       {uni.name}
//                     </h3>

//                     <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-3 min-h-[60px] gap-2">
//                       <div className="flex items-start gap-1 flex-1">
//                         <span className="text-sm">🏆</span>
//                         <p className="text-[14.5px] font-bold text-gray-800 uppercase tracking-tight leading-[1.1] line-clamp-3">
//                           {approvalsText || "Approvals Verified"}
//                         </p>
//                       </div>
//                       {bannerFullUrl && (
//                         <div className="relative w-20 h-13 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200 p-1">
//                           <img
//                             src={bannerFullUrl}
//                             alt="Logo"
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex items-center gap-1.5 mb-3 text-[#0056B3] font-bold text-[13px]">
//                       <span>📚</span>
//                       <span>{uni.courses?.length || 0} Courses</span>
//                     </div>

//                     <div className="grid grid-cols-3 gap-1 mt-auto">
//                       <button
//                         onClick={() => handleDetailsClick(uni)}
//                         className="bg-[#c15304] text-white py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-blue-800 transition"
//                       >
//                         Details
//                       </button>

//                       <button className="bg-white border border-gray-300 text-[#0A1D37] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-50 transition">
//                         Apply
//                       </button>

//                       <button
//                         onClick={() => handleCompareClick(uni)}
//                         className={`py-2 rounded-lg text-[8px] font-bold uppercase transition ${
//                           selectedForCompare.find(
//                             (s) => s._id === uni._id
//                           )
//                             ? "bg-green-600 text-white"
//                             : "bg-[#c15304] text-white hover:bg-orange-600"
//                         }`}
//                       >
//                         {selectedForCompare.find(
//                           (s) => s._id === uni._id
//                         )
//                           ? "Selected"
//                           : "Compare"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* 🔒 Explore Button (Disabled) */}
//           {universities.length > initialLimit && (
//             <div className="mt-10 flex justify-center">
//               <button
//                 onClick={(e) => e.preventDefault()}
//                 className="px-8 py-2.5 rounded-full font-bold text-[10px] bg-[#0056B3] text-white uppercase tracking-widest cursor-not-allowed opacity-70"
//                 title="Coming Soon"
//               >
//                 Explore All {universities.length} Universities ↓
//               </button>
//             </div>
//           )}
//         </div>

//         {/* Compare Bar */}
//         {selectedForCompare.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4">
//             <div className="max-w-[1000px] mx-auto text-center">
//               <h4 className="text-sm font-bold text-[#0A1D37] mb-3 uppercase tracking-tighter">
//                 Add upto 3 Universities
//               </h4>

//               <div className="flex justify-center gap-4 mb-4">
//                 {selectedForCompare.map((uni) => (
//                   <div
//                     key={uni._id}
//                     className="relative w-32 md:w-44 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
//                   >
//                     <button
//                       onClick={() => removeFromCompare(uni._id)}
//                       className="absolute top-1 right-1 bg-white border border-gray-100 rounded-full p-0.5 text-orange-500 shadow-sm z-10 hover:bg-orange-50"
//                     >
//                       <X size={14} strokeWidth={3} />
//                     </button>
//                     <div className="h-20 w-full relative p-2 bg-white">
//                       <img
//                         src={getFullImageUrl(uni.universityImage)}
//                         alt={uni.name}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>
//                     <div className="bg-gray-50 py-1.5 px-2 border-t">
//                       <p className="text-[9px] font-bold text-[#0A1D37] truncate uppercase">
//                         {uni.name}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <button
//                 disabled={selectedForCompare.length < 2}
//                 className={`px-12 py-3 rounded-lg font-bold text-xs uppercase tracking-wide transition-all shadow-md ${
//                   selectedForCompare.length < 2
//                     ? "bg-gray-200 text-gray-400 cursor-not-allowed"
//                     : "bg-orange-400 text-white hover:bg-orange-500 active:scale-95"
//                 }`}
//                 onClick={() => {
//                   if (selectedForCompare.length < 2) return; // safeguard

//                   if (isLoggedIn) {
//                     // ✅ Logged-in → redirect to compare page
//                     const ids = selectedForCompare.map((u) => u._id).join(",");
//                     router.push(`/comparedetail?ids=${ids}`);
//                   } else {
//                     // ✅ Guest → show modal
//                     setShowCompareForm(true);
//                   }
//                 }}
//               >
//                 Compare Now
//               </button>

//               {showCompareForm && (
//                 <Comparenow
//                   selectedUniversities={selectedForCompare}
//                   onClose={() => setShowCompareForm(false)}
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </section>
//     </>
//   );
// }



"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import api from "@/utlis/api.js";
import { X } from "lucide-react";
import Header from "@/app/layout/Header.jsx";
import Comparenow from "@/app/topunivers/Comparenow.jsx";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

const getFullImageUrl = (path) => {
  if (!path) return null;

  return path.startsWith("http")
    ? path
    : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

export default function UniversitiesPage() {
  const router = useRouter();

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCompareForm, setShowCompareForm] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);

  const initialLimit = 47;
  const [displayLimit] = useState(initialLimit);

  /* ================= LOGIN ================= */

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("usertoken");
    setIsLoggedIn(!!token);
  }, []);

  /* ================= FETCH ================= */

  const fetchUniversities = async () => {
    try {
      const res = await api.get("/api/v1/university");

      const allUnis = res.data?.data || [];

      // Sort: 5+ courses first
      const sorted = allUnis.sort((a, b) => {
        const aCount = a.courses?.length || 0;
        const bCount = b.courses?.length || 0;

        if (aCount >= 3 && bCount < 3) return -1;
        if (aCount < 3 && bCount >= 3) return 1;

        return bCount - aCount;
      });

      setUniversities(sorted);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, []);

  /* ================= HANDLERS ================= */

  // Details
  const handleDetailsClick = (uni) => {
    const count = uni.courses?.length || 0;

    if (count < 3) {
      alert("This university details are not available yet.");
      return;
    }

    const path = uni.slug || uni._id;

    router.push(`/university/${path}`);
  };

  // Compare
  const handleCompareClick = (uni) => {
    if (!selectedForCompare.find((u) => u._id === uni._id)) {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, uni]);
      } else {
        alert("Maximum 3 Universities allowed.");
      }
    }
  };

  // Remove compare
  const removeFromCompare = (id) => {
    setSelectedForCompare(
      selectedForCompare.filter((u) => u._id !== id)
    );
  };

  // Apply Click
  const handleApplyClick = (uni) => {
    if (isLoggedIn) {
      // Login → Direct compare page
      router.push(`/comparedetail?ids=${uni._id}`);
    } else {
      // Not login → Open compare popup

      if (!selectedForCompare.find((u) => u._id === uni._id)) {
        setSelectedForCompare([uni]);
      }

      setShowCompareForm(true);
    }
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium">
        Loading...
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <Header />

      <section className="py-10 bg-[#F8FAFC] min-h-screen relative">

        <div className="max-w-[1200px] mx-auto px-4 pb-40">

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

            {universities.slice(0, displayLimit).map((uni) => {

              const bgUrl = getFullImageUrl(
                uni.background?.backgroundImage
              );

              const bannerUrl = getFullImageUrl(
                uni.universityImage
              );

              const courseCount = uni.courses?.length || 0;

              const rawPoints =
                uni.approvals ||
                uni.recognition?.recognitionPoints ||
                [];

              const approvalsText = Array.isArray(rawPoints)
                ? rawPoints
                    .map((item) =>
                      typeof item === "object"
                        ? item.name || item.label
                        : item
                    )
                    .join(", ")
                : rawPoints;

              const canOpen = courseCount >= 3;

              return (
                <div
                  key={uni._id}
                  className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition"
                >

                  {/* Background */}
                  <div
                    onClick={() => handleDetailsClick(uni)}
                    className={`w-full h-[190px] relative border-b cursor-pointer ${
                      !canOpen && "opacity-60"
                    }`}
                  >
                    <Image
                      src={bgUrl || "/fallback-bg.png"}
                      alt={uni.name}
                      fill
                      className="object-fill hover:scale-105 transition"
                    />
                  </div>

                  <div className="p-3 flex flex-col h-full">

                    {/* Name */}
                    <h3
                      onClick={() => handleDetailsClick(uni)}
                      className={`text-base font-black mb-2 min-h-[40px] line-clamp-2 cursor-pointer ${
                        canOpen
                          ? "text-[#0A1D37] hover:text-blue-700"
                          : "text-gray-400"
                      }`}
                    >
                      {uni.name}
                    </h3>

                    {/* Approval */}
                    <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">

                      <div className="flex gap-1 flex-1">
                        <span>🏆</span>

                        <p className="text-[14px] font-bold uppercase line-clamp-3">
                          {approvalsText || "Approvals Verified"}
                        </p>
                      </div>

                      {bannerUrl && (
                        <div className="w-20 h-13 bg-white border rounded-md p-1">
                          <img
                            src={bannerUrl}
                            alt="logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}

                    </div>

                    {/* Courses */}
                    <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">
                      📚 {courseCount} Courses
                    </div>

                    {/* Buttons */}
                    <div className="grid grid-cols-3 gap-1 mt-auto">

                      {/* Details */}
                      <button
                        disabled={!canOpen}
                        onClick={() => handleDetailsClick(uni)}
                        className={`py-2 rounded-lg text-[8px] font-bold uppercase ${
                          canOpen
                            ? "bg-[#c15304] text-white hover:bg-orange-600"
                            : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Details
                      </button>

                      {/* Apply */}
                      <button
                        onClick={() => handleApplyClick(uni)}
                        className="bg-white border py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-100"
                      >
                        Apply
                      </button>

                      {/* Compare */}
                      <button
                        onClick={() => handleCompareClick(uni)}
                        className={`py-2 rounded-lg text-[8px] font-bold uppercase ${
                          selectedForCompare.find(
                            (s) => s._id === uni._id
                          )
                            ? "bg-green-600 text-white"
                            : "bg-[#c15304] text-white"
                        }`}
                      >
                        {selectedForCompare.find(
                          (s) => s._id === uni._id
                        )
                          ? "Selected"
                          : "Compare"}
                      </button>

                    </div>

                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* Compare Bar */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-[1000]">

            <div className="max-w-[1000px] mx-auto text-center">

              <h4 className="text-sm font-bold mb-3 uppercase">
                Add upto 3 Universities
              </h4>

              <div className="flex justify-center gap-4 mb-4">

                {selectedForCompare.map((uni) => (
                  <div
                    key={uni._id}
                    className="relative w-32 border rounded-lg"
                  >

                    <button
                      onClick={() => removeFromCompare(uni._id)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1"
                    >
                      <X size={14} />
                    </button>

                    <div className="h-20 p-2">
                      <img
                        src={getFullImageUrl(uni.universityImage)}
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <p className="text-[9px] font-bold truncate py-1 bg-gray-50">
                      {uni.name}
                    </p>

                  </div>
                ))}

              </div>

              {/* Compare Now */}
              <button
                disabled={selectedForCompare.length < 2}
                onClick={() => {
                  if (selectedForCompare.length < 2) return;

                  if (isLoggedIn) {
                    const ids = selectedForCompare
                      .map((u) => u._id)
                      .join(",");

                    router.push(`/comparedetail?ids=${ids}`);
                  } else {
                    setShowCompareForm(true);
                  }
                }}
                className={`px-12 py-3 rounded-lg font-bold text-xs ${
                  selectedForCompare.length < 2
                    ? "bg-gray-200 text-gray-400"
                    : "bg-orange-400 text-white hover:bg-orange-500"
                }`}
              >
                Compare Now
              </button>

              {showCompareForm && (
                <Comparenow
                  selectedUniversities={selectedForCompare}
                  onClose={() => setShowCompareForm(false)}
                />
              )}

            </div>
          </div>
        )}

      </section>
    </>
  );
}


// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import api from "@/utlis/api.js";
// import { X } from "lucide-react";
// import Header from "@/app/layout/Header.jsx";
// import Comparenow from "@/app/topunivers/Comparenow.jsx";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const getFullImageUrl = (path) => {
//   if (!path) return null;

//   return path.startsWith("http")
//     ? path
//     : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// export default function UniversitiesPage() {
//   const router = useRouter();

//   const [universities, setUniversities] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const [showCompareForm, setShowCompareForm] = useState(false);
//   const [selectedForCompare, setSelectedForCompare] = useState([]);

//   const initialLimit = 47;
//   const [displayLimit] = useState(initialLimit);

//   /* ================= LOGIN ================= */

//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("usertoken");
//     setIsLoggedIn(!!token);
//   }, []);

//   /* ================= FETCH ================= */

//   const fetchUniversities = async () => {
//     try {
//       const res = await api.get("/api/v1/university");

//       const allUnis = res.data?.data || [];

//       const sorted = allUnis.sort((a, b) => {
//         const aCount = a.courses?.length || 0;
//         const bCount = b.courses?.length || 0;

//         if (aCount >= 5 && bCount < 5) return -1;
//         if (aCount < 5 && bCount >= 5) return 1;

//         return bCount - aCount;
//       });

//       setUniversities(sorted);
//     } catch (err) {
//       console.error("Fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchUniversities();
//   }, []);

//   /* ================= HANDLERS ================= */

//   // Compare
//   const handleCompareClick = (uni) => {
//     if (!selectedForCompare.find((u) => u._id === uni._id)) {
//       if (selectedForCompare.length < 3) {
//         setSelectedForCompare([...selectedForCompare, uni]);
//       } else {
//         alert("Maximum 3 Universities allowed.");
//       }
//     }
//   };

//   // Remove compare
//   const removeFromCompare = (id) => {
//     setSelectedForCompare(
//       selectedForCompare.filter((u) => u._id !== id)
//     );
//   };

//   // Apply
//   const handleApplyClick = (uni) => {
//     if (isLoggedIn) {
//       router.push(`/comparedetail?ids=${uni._id}`);
//     } else {
//       if (!selectedForCompare.find((u) => u._id === uni._id)) {
//         setSelectedForCompare([uni]);
//       }

//       setShowCompareForm(true);
//     }
//   };

//   /* ================= LOADING ================= */

//   if (loading) {
//     return (
//       <div className="text-center py-20 text-gray-400 font-medium">
//         Loading...
//       </div>
//     );
//   }

//   /* ================= UI ================= */

//   return (
//     <>
//       <Header />

//       <section className="py-10 bg-[#F8FAFC] min-h-screen relative">

//         <div className="max-w-[1200px] mx-auto px-4 pb-40">

//           {/* Grid */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">

//             {universities.slice(0, displayLimit).map((uni) => {

//               const bgUrl = getFullImageUrl(
//                 uni.background?.backgroundImage
//               );

//               const bannerUrl = getFullImageUrl(
//                 uni.universityImage
//               );

//               const courseCount = uni.courses?.length || 0;

//               const rawPoints =
//                 uni.approvals ||
//                 uni.recognition?.recognitionPoints ||
//                 [];

//               const approvalsText = Array.isArray(rawPoints)
//                 ? rawPoints
//                     .map((item) =>
//                       typeof item === "object"
//                         ? item.name || item.label
//                         : item
//                     )
//                     .join(", ")
//                 : rawPoints;

//               return (
//                 <div
//                   key={uni._id}
//                   className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition"
//                 >

//                   {/* Background (No Click + No Opacity) */}
//                   <div className="w-full h-[190px] relative border-b">

//                     <Image
//                       src={bgUrl || "/fallback-bg.png"}
//                       alt={uni.name}
//                       fill
//                       className="object-fill hover:scale-105 transition"
//                     />
//                   </div>

//                   <div className="p-3 flex flex-col h-full">

//                     {/* Name (No Click) */}
//                     <h3
//                       className="text-base font-black mb-2 min-h-[40px] line-clamp-2 text-[#0A1D37]"
//                     >
//                       {uni.name}
//                     </h3>

//                     {/* Approval */}
//                     <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">

//                       <div className="flex gap-1 flex-1">
//                         <span>🏆</span>

//                         <p className="text-[14px] font-bold uppercase line-clamp-3">
//                           {approvalsText || "Approvals Verified"}
//                         </p>
//                       </div>

//                       {bannerUrl && (
//                         <div className="w-20 h-13 bg-white border rounded-md p-1">
//                           <img
//                             src={bannerUrl}
//                             alt="logo"
//                             className="w-full h-full object-contain"
//                           />
//                         </div>
//                       )}

//                     </div>

//                     {/* Courses */}
//                     <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">
//                       📚 {courseCount} Courses
//                     </div>

//                     {/* Buttons */}
//                     <div className="grid grid-cols-3 gap-1 mt-auto">

//                       {/* Details (Disabled + Color Visible) */}
//                       <button
//                         disabled
//                         className="py-2 rounded-lg text-[8px] font-bold uppercase
//                                    bg-[#c15304] text-white
//                                    cursor-not-allowed opacity-100"
//                       >
//                         Details
//                       </button>

//                       {/* Apply */}
//                       <button
//                         onClick={() => handleApplyClick(uni)}
//                         className="bg-white border py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-100"
//                       >
//                         Apply
//                       </button>

//                       {/* Compare */}
//                       <button
//                         onClick={() => handleCompareClick(uni)}
//                         className={`py-2 rounded-lg text-[8px] font-bold uppercase ${
//                           selectedForCompare.find(
//                             (s) => s._id === uni._id
//                           )
//                             ? "bg-green-600 text-white"
//                             : "bg-[#c15304] text-white"
//                         }`}
//                       >
//                         {selectedForCompare.find(
//                           (s) => s._id === uni._id
//                         )
//                           ? "Selected"
//                           : "Compare"}
//                       </button>

//                     </div>

//                   </div>
//                 </div>
//               );
//             })}

//           </div>
//         </div>

//         {/* Compare Bar */}
//         {selectedForCompare.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 shadow-lg z-[1000]">

//             <div className="max-w-[1000px] mx-auto text-center">

//               <h4 className="text-sm font-bold mb-3 uppercase">
//                 Add upto 3 Universities
//               </h4>

//               <div className="flex justify-center gap-4 mb-4">

//                 {selectedForCompare.map((uni) => (
//                   <div
//                     key={uni._id}
//                     className="relative w-32 border rounded-lg"
//                   >

//                     <button
//                       onClick={() => removeFromCompare(uni._id)}
//                       className="absolute top-1 right-1 bg-white rounded-full p-1"
//                     >
//                       <X size={14} />
//                     </button>

//                     <div className="h-20 p-2">
//                       <img
//                         src={getFullImageUrl(uni.universityImage)}
//                         className="w-full h-full object-contain"
//                       />
//                     </div>

//                     <p className="text-[9px] font-bold truncate py-1 bg-gray-50">
//                       {uni.name}
//                     </p>

//                   </div>
//                 ))}

//               </div>

//               {/* Compare Now */}
//               <button
//                 disabled={selectedForCompare.length < 2}
//                 onClick={() => {
//                   if (selectedForCompare.length < 2) return;

//                   if (isLoggedIn) {
//                     const ids = selectedForCompare
//                       .map((u) => u._id)
//                       .join(",");

//                     router.push(`/comparedetail?ids=${ids}`);
//                   } else {
//                     setShowCompareForm(true);
//                   }
//                 }}
//                 className={`px-12 py-3 rounded-lg font-bold text-xs ${
//                   selectedForCompare.length < 2
//                     ? "bg-gray-200 text-gray-400"
//                     : "bg-orange-400 text-white hover:bg-orange-500"
//                 }`}
//               >
//                 Compare Now
//               </button>

//               {showCompareForm && (
//                 <Comparenow
//                   selectedUniversities={selectedForCompare}
//                   onClose={() => setShowCompareForm(false)}
//                 />
//               )}

//             </div>
//           </div>
//         )}

//       </section>
//     </>
//   );
// }
