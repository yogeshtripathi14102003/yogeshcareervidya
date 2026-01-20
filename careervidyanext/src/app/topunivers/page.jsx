// "use client";

// import React, { useEffect, useState } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation"; 
// import api from "@/utlis/api.js";
// import { X } from "lucide-react"; 
// import Header from "@/app/layout/Header.jsx";

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
//   const initialLimit = 8;
//   const [displayLimit, setDisplayLimit] = useState(initialLimit);

//   const [selectedForCompare, setSelectedForCompare] = useState([]);

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

//   const toggleView = () => {
//     setDisplayLimit(
//       displayLimit >= universities.length ? initialLimit : universities.length
//     );
//   };

//   if (loading)
//     return <div className="text-center py-20 text-gray-400 font-medium">Loading...</div>;

//   return (
//     <>
//       <Header />
//       <section className="py-10 bg-[#F8FAFC] relative min-h-screen">
//         <div className="max-w-[1200px] mx-auto px-4 pb-40"> 
          
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {universities.slice(0, displayLimit).map((uni) => {
              
//               // --- यहाँ बदलाव किया गया है: Background Image का पाथ निकाला गया है ---
//               const backgroundFullUrl = getFullImageUrl(uni.background?.backgroundImage);
//               const bannerFullUrl = getFullImageUrl(uni.universityImage);
              
//               const rawPoints = uni.approvals || uni.recognition?.recognitionPoints || [];
//               const approvalsText = Array.isArray(rawPoints)
//                 ? rawPoints.map((item) => (typeof item === "object" ? item.name || item.label : item)).join(", ")
//                 : rawPoints;

//               return (
//                 <div key={uni._id} className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md">
//              {/* Clickable Background Image */}
// <div className="w-full h-[190px] relative bg-white cursor-pointer overflow-hidden border-b border-gray-100" onClick={() => handleDetailsClick(uni)}>
//   <Image 
//       src={backgroundFullUrl || "/fallback-bg.png"} 
//       alt={uni.name} 
//       fill 
//       // 'object-fill' इमेज को बिना काटे पूरे कंटेनर के साइज (190px) में फिट कर देगा
//       // 'p-0' ताकि इमेज किनारों से पूरी चिपकी रहे
//       className="object-fill transition-transform duration-500 hover:scale-105" 
//   />
// </div>

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
//                           <img src={bannerFullUrl} alt="Logo" className="w-full h-full object-contain" />
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
//                         className="bg-[#05347f] text-white py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-blue-800 transition"
//                       >
//                         Details
//                       </button>
//                       <button className="bg-white border border-gray-300 text-[#0A1D37] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-50 transition">
//                         Apply
//                       </button>
//                       <button 
//                         onClick={() => handleCompareClick(uni)}
//                         className={`py-2 rounded-lg text-[8px] font-bold uppercase transition ${
//                           selectedForCompare.find(s => s._id === uni._id)
//                           ? "bg-green-600 text-white"
//                           : "bg-[#05347f] text-white hover:bg-orange-600"
//                         }`}
//                       >
//                         {selectedForCompare.find(s => s._id === uni._id) ? "Selected" : "Compare"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {universities.length > initialLimit && (
//             <div className="mt-10 flex justify-center">
//               <button onClick={toggleView} className="px-8 py-2.5 rounded-full font-bold text-[10px] bg-[#0056B3] text-white uppercase tracking-widest">
//                 {displayLimit >= universities.length ? "Show Less ↑" : `Explore All ${universities.length} Universities ↓`}
//               </button>
//             </div>
//           )}
//         </div>

//         {selectedForCompare.length > 0 && (
//           <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4">
//             <div className="max-w-[1000px] mx-auto text-center">
//               <h4 className="text-sm font-bold text-[#0A1D37] mb-3 uppercase tracking-tighter">Add upto 3 Universities</h4>
              
//               <div className="flex justify-center gap-4 mb-4">
//                 {selectedForCompare.map((uni) => (
//                   <div key={uni._id} className="relative w-32 md:w-44 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
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
//                       <p className="text-[9px] font-bold text-[#0A1D37] line-clamp-1 truncate uppercase">
//                         {uni.name}
//                       </p>
//                     </div>
//                   </div>
//                 ))}
                
//                 {selectedForCompare.length < 3 && Array(3 - selectedForCompare.length).fill(0).map((_, i) => (
//                   <div key={i} className="hidden md:flex w-44 border-2 border-dashed border-gray-100 rounded-lg items-center justify-center text-gray-300 text-[10px] font-medium italic">
//                     Slot {selectedForCompare.length + i + 1}
//                   </div>
//                 ))}
//               </div>

//               <button 
//                 disabled={selectedForCompare.length < 2}
//                 className={`px-12 py-3 rounded-lg font-bold text-xs uppercase tracking-wide transition-all shadow-md ${
//                   selectedForCompare.length < 2 
//                   ? "bg-gray-200 text-gray-400 cursor-not-allowed" 
//                   : "bg-orange-400 text-white hover:bg-orange-500 active:scale-95"
//                 }`}
//                 onClick={() => router.push('/compare')}
//               >
//                 Compare Now
//               </button>
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

  const initialLimit = 8;
  const [displayLimit] = useState(initialLimit);

  // ✅ State to check if user is logged in (client-side only)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("usertoken"); // Adjust according to your auth
    setIsLoggedIn(!!token);
  }, []);

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

  const handleDetailsClick = (uni) => {
    const path = uni.slug ? uni.slug : uni._id;
    router.push(`/university/${path}`);
  };

  const handleCompareClick = (uni) => {
    if (!selectedForCompare.find((item) => item._id === uni._id)) {
      if (selectedForCompare.length < 3) {
        setSelectedForCompare([...selectedForCompare, uni]);
      } else {
        alert("Maximum 3 Universities allowed for comparison.");
      }
    }
  };

  const removeFromCompare = (id) => {
    setSelectedForCompare(selectedForCompare.filter((u) => u._id !== id));
  };

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-400 font-medium">
        Loading...
      </div>
    );
  }

  return (
    <>
      <Header />
      <section className="py-10 bg-[#F8FAFC] relative min-h-screen">
        <div className="max-w-[1200px] mx-auto px-4 pb-40">
          {/* Universities Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {universities.slice(0, displayLimit).map((uni) => {
              const backgroundFullUrl = getFullImageUrl(
                uni.background?.backgroundImage
              );
              const bannerFullUrl = getFullImageUrl(uni.universityImage);

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

              return (
                <div
                  key={uni._id}
                  className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col transition-all hover:shadow-md"
                >
                  {/* Background Image */}
                  <div
                    className="w-full h-[190px] relative bg-white cursor-pointer overflow-hidden border-b border-gray-100"
                    onClick={() => handleDetailsClick(uni)}
                  >
                    <Image
                      src={backgroundFullUrl || "/fallback-bg.png"}
                      alt={uni.name}
                      fill
                      className="object-fill transition-transform duration-500 hover:scale-105"
                    />
                  </div>

                  <div className="p-3 flex flex-col h-full">
                    <h3
                      onClick={() => handleDetailsClick(uni)}
                      className="text-base font-black text-[#0A1D37] mb-2 min-h-[40px] line-clamp-2 leading-tight cursor-pointer hover:text-blue-700 transition-colors"
                    >
                      {uni.name}
                    </h3>

                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2 mb-3 min-h-[60px] gap-2">
                      <div className="flex items-start gap-1 flex-1">
                        <span className="text-sm">🏆</span>
                        <p className="text-[14.5px] font-bold text-gray-800 uppercase tracking-tight leading-[1.1] line-clamp-3">
                          {approvalsText || "Approvals Verified"}
                        </p>
                      </div>
                      {bannerFullUrl && (
                        <div className="relative w-20 h-13 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200 p-1">
                          <img
                            src={bannerFullUrl}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 mb-3 text-[#0056B3] font-bold text-[13px]">
                      <span>📚</span>
                      <span>{uni.courses?.length || 0} Courses</span>
                    </div>

                    <div className="grid grid-cols-3 gap-1 mt-auto">
                      <button
                        onClick={() => handleDetailsClick(uni)}
                        className="bg-[#05347f] text-white py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-blue-800 transition"
                      >
                        Details
                      </button>

                      <button className="bg-white border border-gray-300 text-[#0A1D37] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-gray-50 transition">
                        Apply
                      </button>

                      <button
                        onClick={() => handleCompareClick(uni)}
                        className={`py-2 rounded-lg text-[8px] font-bold uppercase transition ${
                          selectedForCompare.find(
                            (s) => s._id === uni._id
                          )
                            ? "bg-green-600 text-white"
                            : "bg-[#05347f] text-white hover:bg-orange-600"
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

          {/* 🔒 Explore Button (Disabled) */}
          {universities.length > initialLimit && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={(e) => e.preventDefault()}
                className="px-8 py-2.5 rounded-full font-bold text-[10px] bg-[#0056B3] text-white uppercase tracking-widest cursor-not-allowed opacity-70"
                title="Coming Soon"
              >
                Explore All {universities.length} Universities ↓
              </button>
            </div>
          )}
        </div>

        {/* Compare Bar */}
        {selectedForCompare.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-white border-t border-gray-200 shadow-[0_-10px_30px_rgba(0,0,0,0.1)] p-4">
            <div className="max-w-[1000px] mx-auto text-center">
              <h4 className="text-sm font-bold text-[#0A1D37] mb-3 uppercase tracking-tighter">
                Add upto 3 Universities
              </h4>

              <div className="flex justify-center gap-4 mb-4">
                {selectedForCompare.map((uni) => (
                  <div
                    key={uni._id}
                    className="relative w-32 md:w-44 bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                  >
                    <button
                      onClick={() => removeFromCompare(uni._id)}
                      className="absolute top-1 right-1 bg-white border border-gray-100 rounded-full p-0.5 text-orange-500 shadow-sm z-10 hover:bg-orange-50"
                    >
                      <X size={14} strokeWidth={3} />
                    </button>
                    <div className="h-20 w-full relative p-2 bg-white">
                      <img
                        src={getFullImageUrl(uni.universityImage)}
                        alt={uni.name}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="bg-gray-50 py-1.5 px-2 border-t">
                      <p className="text-[9px] font-bold text-[#0A1D37] truncate uppercase">
                        {uni.name}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <button
                disabled={selectedForCompare.length < 2}
                className={`px-12 py-3 rounded-lg font-bold text-xs uppercase tracking-wide transition-all shadow-md ${
                  selectedForCompare.length < 2
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-orange-400 text-white hover:bg-orange-500 active:scale-95"
                }`}
                onClick={() => {
                  if (selectedForCompare.length < 2) return; // safeguard

                  if (isLoggedIn) {
                    // ✅ Logged-in → redirect to compare page
                    const ids = selectedForCompare.map((u) => u._id).join(",");
                    router.push(`/comparedetail?ids=${ids}`);
                  } else {
                    // ✅ Guest → show modal
                    setShowCompareForm(true);
                  }
                }}
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
