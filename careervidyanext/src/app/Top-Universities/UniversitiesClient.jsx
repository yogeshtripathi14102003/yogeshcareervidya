// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { X } from "lucide-react";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import Comparenow from "@/app/topunivers/Comparenow.jsx";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const getFullImageUrl = (path) => {
//   if (!path) return null;
//   return path.startsWith("http") ? path : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// export default function UniversitiesClient({ initialData = [] }) {
//   const router = useRouter();

//   const [universities, setUniversities] = useState(initialData);
//   const [showCompareOverlay, setShowCompareOverlay] = useState(false);
//   const [showCompareNowModal, setShowCompareNowModal] = useState(false);
//   const [selectedForCompare, setSelectedForCompare] = useState([]);
//   const [displayLimit, setDisplayLimit] = useState(24);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   /* ================= SORTING LOGIC ================= */
//   const sortedUniversities = useMemo(() => {
//     const getApprovalsArray = (uni) => {
//       const raw = uni.approvals || uni.recognition?.recognitionPoints || [];
//       if (!Array.isArray(raw)) return [];
//       return raw.map((item) =>
//         typeof item === "object" ? (item.name || item.label || "").toUpperCase() : item.toUpperCase()
//       );
//     };

//     const getNaacRank = (approvals) => {
//       if (approvals.includes("NAAC A++")) return 1;
//       if (approvals.includes("NAAC A+")) return 2;
//       if (approvals.includes("NAAC A")) return 3;
//       return 4;
//     };

//     return [...universities].sort((a, b) => {
//       const aApprovals = getApprovalsArray(a);
//       const bApprovals = getApprovalsArray(b);
//       const aNaacRank = getNaacRank(aApprovals);
//       const bNaacRank = getNaacRank(bApprovals);

//       if (aNaacRank !== bNaacRank) return aNaacRank - bNaacRank;
//       if (bApprovals.length !== aApprovals.length) return bApprovals.length - aApprovals.length;
//       return (b.courses?.length || 0) - (a.courses?.length || 0);
//     });
//   }, [universities]);

//   const visibleUnis = useMemo(() => sortedUniversities.slice(0, displayLimit), [sortedUniversities, displayLimit]);

//   /* ================= HANDLERS ================= */
//   const handleDetailsClick = (uni) => {
//     if ((uni.courses?.length || 0) < 3) {
//       alert("This university details are not available yet.");
//       return;
//     }
//     router.push(`/university/${uni.slug || uni._id}`);
//   };

//   const handleCompareClick = (uni) => {
//     const alreadySelected = selectedForCompare.find((u) => u._id === uni._id);
//     if (alreadySelected) {
//       setSelectedForCompare(selectedForCompare.filter((u) => u._id !== uni._id));
//     } else {
//       if (selectedForCompare.length < 3) {
//         setSelectedForCompare([...selectedForCompare, uni]);
//         setShowCompareOverlay(true);
//       } else {
//         alert("Maximum 3 Universities allowed.");
//       }
//     }
//   };

//   const handleApplyClick = (uni) => {
//     if (!selectedForCompare.find((u) => u._id === uni._id)) {
//       if (selectedForCompare.length < 3) {
//         setSelectedForCompare([...selectedForCompare, uni]);
//       }
//     }
//     setShowCompareNowModal(true);
//   };

//   return (
//     <>
//       <Header />

//       <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
//         <div className="max-w-[1200px] mx-auto px-4 py-24 text-center text-white">
//           <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Explore Top Universities in India</h1>
//           <p className="max-w-3xl mx-auto text-sm md:text-lg text-white/90 leading-relaxed">
//             Compare Approved Universities, Check Courses, And Choose The Best Option For Your Future.
//           </p>
//         </div>
//       </div>

//       <section className="py-10 bg-[#F8FAFC] min-h-screen relative">
//         <div className="max-w-[1200px] mx-auto px-4 pb-40">
//           <div className="text-[#000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {visibleUnis.map((uni) => {
//               const bgUrl = getFullImageUrl(uni.background?.backgroundImage);
//               const bannerUrl = getFullImageUrl(uni.universityImage);
//               const isSelected = selectedForCompare.find((s) => s._id === uni._id);
//               const courseCount = uni.courses?.length || 0;

//               return (
//                 <div key={uni._id} className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
//                   <div onClick={() => handleDetailsClick(uni)} className="w-full h-[190px] relative border-b cursor-pointer">
//                     {/* ✅ alt left empty: this is a decorative background banner,
//                         the university name is already in the <h3> below it.
//                         Repeating it here is redundant noise for screen readers. */}
//                     <Image src={bgUrl || "/fallback-bg.png"} alt="" fill className="object-fill" />
//                   </div>

//                   <div className="p-3 flex flex-col h-full">
//                     <h3 className="text-base font-black mb-2 min-h-[40px] line-clamp-2 text-[#0A1D37]">
//                       {uni.name}
//                     </h3>

//                     <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">
//                       <div className="flex gap-1 flex-1">
//                         <span>🏆</span>
//                         <p className="text-[14px] font-bold uppercase line-clamp-3">
//                           {Array.isArray(uni.approvals) && uni.approvals.length > 0
//                             ? uni.approvals.map(a => typeof a === 'object' ? a.name : a).join(", ")
//                             : "Approvals Verified"}
//                         </p>
//                       </div>
//                       {bannerUrl && (
//                         <div className="w-16 h-10 bg-white border rounded p-1 relative">
//                           {/* ✅ descriptive alt instead of generic "logo" */}
//                           <Image src={bannerUrl} alt={`${uni.name} logo`} fill sizes="64px" className="object-contain" />
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">
//                       📚 {courseCount} Courses
//                     </div>

//                     <div className="grid grid-cols-3 gap-1 mt-auto">
//                       <button onClick={() => handleDetailsClick(uni)} className="bg-[#c15304] cursor-pointer text-white py-2 rounded-lg text-[8px] font-bold uppercase">Details</button>
//                       <button onClick={() => handleApplyClick(uni)} className="border border-[#c15304] cursor-pointer text-[#c15304] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-orange-50">Apply Now</button>
//                       <button onClick={() => handleCompareClick(uni)} className={`py-2 rounded-lg text-[8px] cursor-pointer font-bold uppercase transition ${isSelected ? "bg-green-600 text-white" : "bg-[#c15304] text-white"}`}>
//                         {isSelected ? "Selected" : "Compare"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {universities.length > displayLimit && (
//             <div className="mt-12 flex justify-center">
//               <button
//                 onClick={() => setDisplayLimit(prev => prev + 12)}
//                 className="bg-white border-2 border-[#c15304] cursor-pointer text-[#c15304] px-10 py-3 rounded-full font-bold hover:bg-[#c15304] hover:text-white transition shadow-md"
//               >
//                 View More Universities ↓
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* TRAY UI */}
//       {selectedForCompare.length > 0 && showCompareOverlay && !showCompareNowModal && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 z-[100] border-t animate-in slide-in-from-bottom duration-300">
//           <div className="max-w-[1200px] mx-auto relative text-black">
//             <button onClick={() => setShowCompareOverlay(false)} className="absolute -top-2 right-0 p-2 text-gray-400 hover:text-black">
//               <X size={24} />
//             </button>
//             <h2 className="text-center text-xl font-bold mb-6">Add upto 3 Universities</h2>
//             <div className="flex flex-wrap justify-center items-center gap-6">
//               {selectedForCompare.map((uni) => (
//                 <div key={uni._id} className="relative w-[260px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center">
//                   <button onClick={() => handleCompareClick(uni)} className="absolute top-2 right-2 text-orange-500"><X size={18} /></button>
//                   <div className="w-full h-[100px] rounded-lg overflow-hidden mb-2 relative">
//                     {/* ✅ decorative background — empty alt is correct here */}
//                     <Image src={getFullImageUrl(uni.background?.backgroundImage) || "/fallback-bg.png"} fill className="object-cover opacity-40" alt="" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="relative h-12 w-32">
//                         <Image src={getFullImageUrl(uni.universityImage)} fill sizes="128px" className="object-contain bg-white p-1 rounded border" alt={`${uni.name} logo`} />
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-xs font-bold line-clamp-1">{uni.name}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-center mt-6">
//               <button onClick={() => setShowCompareNowModal(true)} className="bg-[#E47A0E] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition">
//                 Compare Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL FOR COMPARENOW COMPONENT */}
//       {showCompareNowModal && (
//         <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative p-6">
//             <button onClick={() => setShowCompareNowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition z-10">
//               <X size={24} />
//             </button>
//             <Comparenow
//                selectedUnis={selectedForCompare}
//                onClose={() => setShowCompareNowModal(false)}
//             />
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// }


// "use client";

// import React, { useEffect, useState, useMemo } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import { X } from "lucide-react";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import Comparenow from "@/app/Top-Universities/Comparenow.jsx";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// const getFullImageUrl = (path) => {
//   if (!path) return null;
//   return path.startsWith("http") ? path : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// export default function UniversitiesClient({ initialData = [] }) {
//   const router = useRouter();

//   const [universities, setUniversities] = useState(initialData);
//   const [showCompareOverlay, setShowCompareOverlay] = useState(false);
//   const [showCompareNowModal, setShowCompareNowModal] = useState(false);
//   const [selectedForCompare, setSelectedForCompare] = useState([]);
//   const [displayLimit, setDisplayLimit] = useState(24);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   /* ================= SORTING LOGIC ================= */
//   const sortedUniversities = useMemo(() => {
//     const getApprovalsArray = (uni) => {
//       const raw = uni.approvals || uni.recognition?.recognitionPoints || [];
//       if (!Array.isArray(raw)) return [];
//       return raw.map((item) =>
//         typeof item === "object" ? (item.name || item.label || "").toUpperCase() : item.toUpperCase()
//       );
//     };

//     const getNaacRank = (approvals) => {
//       if (approvals.includes("NAAC A++")) return 1;
//       if (approvals.includes("NAAC A+")) return 2;
//       if (approvals.includes("NAAC A")) return 3;
//       return 4;
//     };

//     return [...universities].sort((a, b) => {
//       const aApprovals = getApprovalsArray(a);
//       const bApprovals = getApprovalsArray(b);
//       const aNaacRank = getNaacRank(aApprovals);
//       const bNaacRank = getNaacRank(bApprovals);

//       if (aNaacRank !== bNaacRank) return aNaacRank - bNaacRank;
//       if (bApprovals.length !== aApprovals.length) return bApprovals.length - aApprovals.length;
//       return (b.courses?.length || 0) - (a.courses?.length || 0);
//     });
//   }, [universities]);

//   const visibleUnis = useMemo(() => sortedUniversities.slice(0, displayLimit), [sortedUniversities, displayLimit]);

//   /* ================= HELPER: go to result page directly ================= */
//   const goToCompareResult = (list) => {
//     const ids = list.map((u) => u._id).join(",");
//     router.push(ids ? `/comparedetail?ids=${ids}` : "/comparedetail");
//   };

//   /* ================= HANDLERS ================= */
//   const handleDetailsClick = (uni) => {
//     if ((uni.courses?.length || 0) < 3) {
//       alert("This university details are not available yet.");
//       return;
//     }
//     router.push(`/university/${uni.slug || uni._id}`);
//   };

//   const handleCompareClick = (uni) => {
//     const alreadySelected = selectedForCompare.find((u) => u._id === uni._id);
//     if (alreadySelected) {
//       setSelectedForCompare(selectedForCompare.filter((u) => u._id !== uni._id));
//     } else {
//       if (selectedForCompare.length < 3) {
//         setSelectedForCompare([...selectedForCompare, uni]);
//         setShowCompareOverlay(true);
//       } else {
//         alert("Maximum 3 Universities allowed.");
//       }
//     }
//   };

//   const handleApplyClick = (uni) => {
//     let updatedList = selectedForCompare;
//     if (!selectedForCompare.find((u) => u._id === uni._id)) {
//       if (selectedForCompare.length < 3) {
//         updatedList = [...selectedForCompare, uni];
//         setSelectedForCompare(updatedList);
//       }
//     }

//     // ✅ Login hai to seedha result page — form/modal bilkul open nahi hoga
//     if (isLoggedIn) {
//       goToCompareResult(updatedList);
//       return;
//     }

//     // ❌ Login nahi hai to normal flow — modal khulega (Signup form)
//     setShowCompareNowModal(true);
//   };

//   const handleCompareNowClick = () => {
//     // ✅ Login hai to seedha result page — form/modal bilkul open nahi hoga
//     if (isLoggedIn) {
//       goToCompareResult(selectedForCompare);
//       return;
//     }
//     setShowCompareNowModal(true);
//   };

//   return (
//     <>
//       <Header />

//       <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
//         <div className="max-w-[1200px] mx-auto px-4 py-24 text-center text-white">
//           <h1 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">Explore Top Universities in India</h1>
//           <p className="max-w-3xl mx-auto text-sm md:text-lg text-white/90 leading-relaxed">
//             Compare Approved Universities, Check Courses, And Choose The Best Option For Your Future.
//           </p>
//         </div>
//       </div>

//       <section className="py-10 bg-[#F8FAFC] min-h-screen relative">
//         <div className="max-w-[1200px] mx-auto px-4 pb-40">
//           <div className="text-[#000] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
//             {visibleUnis.map((uni) => {
//               const bgUrl = getFullImageUrl(uni.background?.backgroundImage);
//               const bannerUrl = getFullImageUrl(uni.universityImage);
//               const isSelected = selectedForCompare.find((s) => s._id === uni._id);
//               const courseCount = uni.courses?.length || 0;

//               return (
//                 <div key={uni._id} className="bg-white rounded-[1.2rem] border border-gray-200 overflow-hidden flex flex-col hover:shadow-md transition">
//                   <div onClick={() => handleDetailsClick(uni)} className="w-full h-[190px] relative border-b cursor-pointer">
//                     {/* ✅ alt left empty: this is a decorative background banner,
//                         the university name is already in the <h3> below it.
//                         Repeating it here is redundant noise for screen readers. */}
//                     <Image src={bgUrl || "/fallback-bg.png"} alt="" fill className="object-fill" />
//                   </div>

//                   <div className="p-3 flex flex-col h-full">
//                     <h3 className="text-base font-black mb-2 min-h-[40px] line-clamp-2 text-[#0A1D37]">
//                       {uni.name}
//                     </h3>

//                     <div className="flex justify-between bg-gray-50 p-2 rounded-lg mb-3 gap-2">
//                       <div className="flex gap-1 flex-1">
//                         <span>🏆</span>
//                         <p className="text-[14px] font-bold uppercase line-clamp-3">
//                           {Array.isArray(uni.approvals) && uni.approvals.length > 0
//                             ? uni.approvals.map(a => typeof a === 'object' ? a.name : a).join(", ")
//                             : "Approvals Verified"}
//                         </p>
//                       </div>
//                       {bannerUrl && (
//                         <div className="w-16 h-10 bg-white border rounded p-1 relative">
//                           {/* ✅ descriptive alt instead of generic "logo" */}
//                           <Image src={bannerUrl} alt={`${uni.name} logo`} fill sizes="64px" className="object-contain" />
//                         </div>
//                       )}
//                     </div>

//                     <div className="flex gap-1 mb-3 text-[#0056B3] font-bold text-[13px]">
//                       📚 {courseCount} Courses
//                     </div>

//                     <div className="grid grid-cols-3 gap-1 mt-auto">
//                       <button onClick={() => handleDetailsClick(uni)} className="bg-[#c15304] cursor-pointer text-white py-2 rounded-lg text-[8px] font-bold uppercase">Details</button>
//                       <button onClick={() => handleApplyClick(uni)} className="border border-[#c15304] cursor-pointer text-[#c15304] py-2 rounded-lg text-[8px] font-bold uppercase hover:bg-orange-50">Apply Now</button>
//                       <button onClick={() => handleCompareClick(uni)} className={`py-2 rounded-lg text-[8px] cursor-pointer font-bold uppercase transition ${isSelected ? "bg-green-600 text-white" : "bg-[#c15304] text-white"}`}>
//                         {isSelected ? "Selected" : "Compare"}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {universities.length > displayLimit && (
//             <div className="mt-12 flex justify-center">
//               <button
//                 onClick={() => setDisplayLimit(prev => prev + 12)}
//                 className="bg-white border-2 border-[#c15304] cursor-pointer text-[#c15304] px-10 py-3 rounded-full font-bold hover:bg-[#c15304] hover:text-white transition shadow-md"
//               >
//                 View More Universities ↓
//               </button>
//             </div>
//           )}
//         </div>
//       </section>

//       {/* TRAY UI */}
//       {selectedForCompare.length > 0 && showCompareOverlay && !showCompareNowModal && (
//         <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 z-[100] border-t animate-in slide-in-from-bottom duration-300">
//           <div className="max-w-[1200px] mx-auto relative text-black">
//             <button onClick={() => setShowCompareOverlay(false)} className="absolute -top-2 right-0 p-2 text-gray-400 hover:text-black">
//               <X size={24} />
//             </button>
//             <h2 className="text-center text-xl font-bold mb-6">Add upto 3 Universities</h2>
//             <div className="flex flex-wrap justify-center items-center gap-6">
//               {selectedForCompare.map((uni) => (
//                 <div key={uni._id} className="relative w-[260px] bg-white border border-gray-200 rounded-xl p-3 shadow-sm text-center">
//                   <button onClick={() => handleCompareClick(uni)} className="absolute top-2 right-2 text-orange-500"><X size={18} /></button>
//                   <div className="w-full h-[100px] rounded-lg overflow-hidden mb-2 relative">
//                     {/* ✅ decorative background — empty alt is correct here */}
//                     <Image src={getFullImageUrl(uni.background?.backgroundImage) || "/fallback-bg.png"} fill className="object-cover opacity-40" alt="" />
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="relative h-12 w-32">
//                         <Image src={getFullImageUrl(uni.universityImage)} fill sizes="128px" className="object-contain bg-white p-1 rounded border" alt={`${uni.name} logo`} />
//                       </div>
//                     </div>
//                   </div>
//                   <p className="text-xs font-bold line-clamp-1">{uni.name}</p>
//                 </div>
//               ))}
//             </div>
//             <div className="flex justify-center mt-6">
//               <button onClick={handleCompareNowClick} className="bg-[#E47A0E] text-white px-10 py-3 rounded-lg font-bold shadow-lg hover:scale-105 transition">
//                 Compare Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* MODAL FOR COMPARENOW COMPONENT — sirf tab render hoga jab user logged in NAHI hai */}
//       {showCompareNowModal && !isLoggedIn && (
//         <div className="fixed inset-0 bg-black/70 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
//           <div className="bg-white rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative p-6">
//             <button onClick={() => setShowCompareNowModal(false)} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-red-500 hover:text-white transition z-10">
//               <X size={24} />
//             </button>
//             <Comparenow
//                selectedUnis={selectedForCompare}
//                onClose={() => setShowCompareNowModal(false)}
//                isLoggedIn={isLoggedIn}
//             />
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// }



"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Search, SlidersHorizontal, RotateCcw, BookOpen, Award } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Comparenow from "@/app/Top-Universities/Comparenow.jsx";
import api from "@/utlis/api.js";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const PAGE_STEP = 12;

const getFullImageUrl = (path) => {
  if (!path) return null;
  return path.startsWith("http")
    ? path
    : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

/* Approval names as display strings */
const getApprovalNames = (uni) => {
  const raw = uni.approvals || uni.recognition?.recognitionPoints || [];
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) =>
      typeof item === "object" ? item.name || item.label || "" : String(item)
    )
    .map((s) => s.trim())
    .filter(Boolean);
};

const getNaacRank = (names) => {
  const up = names.map((n) => n.toUpperCase());
  if (up.includes("NAAC A++")) return 1;
  if (up.includes("NAAC A+")) return 2;
  if (up.includes("NAAC A")) return 3;
  return 4;
};

/* ─── Small reusable select ─── */
function FilterSelect({ id, label, value, onChange, children }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-xs font-bold block"
        style={{ color: "var(--cv-neutral-mid)" }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2.5 rounded-lg text-sm cursor-pointer outline-none"
        style={{
          border: "1px solid var(--cv-neutral-border)",
          color: "var(--cv-neutral-dark)",
          background: "var(--cv-surface)",
        }}
      >
        {children}
      </select>
    </div>
  );
}

export default function UniversitiesClient({ initialData = [] }) {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ═══════════ REACT QUERY ═══════════ */
  const {
    data: universities = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-universities"],
    queryFn: async () => {
      const res = await api.get("/api/v1/university");
      let list = [];
      if (Array.isArray(res.data)) list = res.data;
      else if (Array.isArray(res.data.data)) list = res.data.data;
      else if (Array.isArray(res.data.universities)) list = res.data.universities;
      return list;
    },
    initialData: initialData && initialData.length > 0 ? initialData : undefined,
    staleTime: 5 * 60 * 1000,
  });

  /* ═══════════ STATE ═══════════ */
  const [showCompareOverlay, setShowCompareOverlay] = useState(false);
  const [showCompareNowModal, setShowCompareNowModal] = useState(false);
  const [selectedForCompare, setSelectedForCompare] = useState([]);
  const [displayLimit, setDisplayLimit] = useState(PAGE_STEP);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [query, setQuery] = useState("");
  const [approval, setApproval] = useState("");
  const [minCourses, setMinCourses] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  const resetLimit = useCallback(() => setDisplayLimit(PAGE_STEP), []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setApproval("");
    setMinCourses("");
    setSortBy("recommended");
    setDisplayLimit(PAGE_STEP);
  }, []);

  const hasActiveFilters = !!(query || approval || minCourses);

  /* ═══════════ FILTER OPTIONS (from data) ═══════════ */
  const approvalOptions = useMemo(() => {
    const set = new Set();
    universities.forEach((u) => getApprovalNames(u).forEach((n) => set.add(n)));
    return Array.from(set).sort();
  }, [universities]);

  /* ═══════════ FILTER + SORT ═══════════ */
  const filteredUnis = useMemo(() => {
    let list = [...universities];

    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((u) => (u.name || "").toLowerCase().includes(q));
    }
    if (approval) {
      list = list.filter((u) =>
        getApprovalNames(u).some((n) => n.toLowerCase() === approval.toLowerCase())
      );
    }
    if (minCourses) {
      const min = Number(minCourses);
      list = list.filter((u) => (u.courses?.length || 0) >= min);
    }

    if (sortBy === "courses") {
      list.sort((a, b) => (b.courses?.length || 0) - (a.courses?.length || 0));
    } else if (sortBy === "name") {
      list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
    } else {
      // recommended: NAAC grade → number of approvals → number of courses
      list.sort((a, b) => {
        const aN = getApprovalNames(a);
        const bN = getApprovalNames(b);
        const aRank = getNaacRank(aN);
        const bRank = getNaacRank(bN);
        if (aRank !== bRank) return aRank - bRank;
        if (bN.length !== aN.length) return bN.length - aN.length;
        return (b.courses?.length || 0) - (a.courses?.length || 0);
      });
    }
    return list;
  }, [universities, query, approval, minCourses, sortBy]);

  const visibleUnis = useMemo(
    () => filteredUnis.slice(0, displayLimit),
    [filteredUnis, displayLimit]
  );

  /* ═══════════ HANDLERS ═══════════ */
  const goToCompareResult = (list) => {
    const ids = list.map((u) => u._id).join(",");
    router.push(ids ? `/comparedetail?ids=${ids}` : "/comparedetail");
  };

  const handleDetailsClick = (uni) => {
    if ((uni.courses?.length || 0) < 3) {
      alert("This university details are not available yet.");
      return;
    }
    router.push(`/university/${uni.slug || uni._id}`);
  };

  const handleCompareClick = (uni) => {
    const already = selectedForCompare.find((u) => u._id === uni._id);
    if (already) {
      setSelectedForCompare(selectedForCompare.filter((u) => u._id !== uni._id));
    } else if (selectedForCompare.length < 3) {
      setSelectedForCompare([...selectedForCompare, uni]);
      setShowCompareOverlay(true);
    } else {
      alert("Maximum 3 Universities allowed.");
    }
  };

  const handleCompareNowClick = () => {
    if (isLoggedIn) {
      goToCompareResult(selectedForCompare);
      return;
    }
    setShowCompareNowModal(true);
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ["top-universities"] });
  };

  /* ═══════════ FILTER PANEL (used on desktop + mobile) ═══════════ */
  const renderFilters = (prefix) => (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor={`${prefix}-search`}
          className="text-xs font-bold block"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          Search
        </label>
        <div className="relative">
          <input
            id={`${prefix}-search`}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              resetLimit();
            }}
            placeholder="University name..."
            className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none"
            style={{
              border: "1px solid var(--cv-neutral-border)",
              color: "var(--cv-neutral-dark)",
              background: "var(--cv-surface)",
            }}
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "var(--cv-neutral-mid)" }}
            aria-hidden="true"
          />
        </div>
      </div>

      <FilterSelect
        id={`${prefix}-approval`}
        label="Approval"
        value={approval}
        onChange={(v) => {
          setApproval(v);
          resetLimit();
        }}
      >
        <option value="">All Approvals</option>
        {approvalOptions.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </FilterSelect>

      <FilterSelect
        id={`${prefix}-courses`}
        label="Number of courses"
        value={minCourses}
        onChange={(v) => {
          setMinCourses(v);
          resetLimit();
        }}
      >
        <option value="">Any</option>
        <option value="5">5+ courses</option>
        <option value="10">10+ courses</option>
        <option value="20">20+ courses</option>
      </FilterSelect>

      <FilterSelect
        id={`${prefix}-sort`}
        label="Sort by"
        value={sortBy}
        onChange={(v) => {
          setSortBy(v);
          resetLimit();
        }}
      >
        <option value="recommended">Recommended</option>
        <option value="courses">Most courses</option>
        <option value="name">Name (A–Z)</option>
      </FilterSelect>
    </div>
  );

  return (
    <>
      <Header />

      {/* ═══════════ HERO ═══════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(240,138,60,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(143,166,180,0.25) 0%, transparent 50%), linear-gradient(135deg, #3d4c56 0%, #26323a 100%)",
        }}
      >
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />
        <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-16 md:py-24 text-center">
          <h1
            className="text-3xl md:text-5xl font-extrabold leading-tight"
            style={{ color: "#ffffff" }}
          >
            Explore Top Universities in India
          </h1>
          <div
            className="mx-auto mt-4 h-1 w-16 rounded-full"
            style={{ background: "var(--cv-accent)" }}
            aria-hidden="true"
          />
          <p
            className="max-w-3xl mx-auto mt-4 text-sm md:text-lg leading-relaxed"
            style={{ color: "#ffffff" }}
          >
            Compare approved universities, check courses, and choose the best
            option for your future.
          </p>
        </div>
      </section>

      {/* ═══════════ BODY ═══════════ */}
      <section
        className="py-8 md:py-10 min-h-screen relative"
        style={{ background: "var(--cv-neutral-light)" }}
      >
        <div className="max-w-[1280px] mx-auto px-4 pb-40">
          {/* Mobile top bar */}
          <div className="md:hidden flex items-center justify-between gap-3 mb-5">
            <p className="text-sm" style={{ color: "var(--cv-neutral-mid)" }}>
              {filteredUnis.length} universities
            </p>
            <button
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold"
              style={{
                background: "var(--cv-surface)",
                border: "1px solid var(--cv-neutral-border)",
                color: "var(--cv-neutral-dark)",
              }}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Search &amp; Filters
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* DESKTOP SIDEBAR */}
            <aside
              className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 h-fit rounded-2xl p-5 space-y-5 shadow-sm"
              style={{
                background: "var(--cv-surface)",
                border: "1px solid var(--cv-neutral-border)",
              }}
            >
              <div
                className="flex items-center justify-between pb-3"
                style={{ borderBottom: "1px solid var(--cv-neutral-border)" }}
              >
                <h2
                  className="text-base font-bold"
                  style={{ color: "var(--cv-neutral-dark)" }}
                >
                  Filters
                </h2>
                <button
                  onClick={resetFilters}
                  className="text-xs font-bold flex items-center gap-1 hover:opacity-80 transition"
                  style={{ color: "var(--cv-accent)" }}
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  RESET
                </button>
              </div>
              {renderFilters("d")}
            </aside>

            {/* MAIN */}
            <main className="md:col-span-8 lg:col-span-9" aria-live="polite">
              {isLoading && !universities.length ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {[...Array(6)].map((_, i) => (
                    <div
                      key={i}
                      className="animate-pulse rounded-2xl"
                      style={{
                        background: "var(--cv-surface)",
                        border: "1px solid var(--cv-neutral-border)",
                        minHeight: 340,
                      }}
                    />
                  ))}
                </div>
              ) : isError && !universities.length ? (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{
                    background: "var(--cv-surface)",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                >
                  <p style={{ color: "var(--cv-neutral-mid)" }}>
                    Couldn't load universities. Please try again.
                  </p>
                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="mt-3 font-semibold hover:underline"
                    style={{ color: "var(--cv-primary)" }}
                  >
                    Try again
                  </button>
                </div>
              ) : filteredUnis.length === 0 ? (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{
                    background: "var(--cv-surface)",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                >
                  <p style={{ color: "var(--cv-neutral-mid)" }}>
                    No universities match these filters.
                  </p>
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-3 font-semibold hover:underline"
                      style={{ color: "var(--cv-accent)" }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* <p
                    className="hidden md:block text-sm mb-4"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    Showing {visibleUnis.length} of {filteredUnis.length} universities
                  </p> */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {visibleUnis.map((uni) => {
                      const bgUrl = getFullImageUrl(uni.background?.backgroundImage);
                      const logoUrl = getFullImageUrl(uni.universityImage);
                      const isSelected = selectedForCompare.some(
                        (s) => s._id === uni._id
                      );
                      const courseCount = uni.courses?.length || 0;
                      const approvals = getApprovalNames(uni);
                      const shownApprovals = approvals.slice(0, 3);
                      const extra = approvals.length - shownApprovals.length;

                      return (
                        <article
                          key={uni._id}
                          className="rounded-2xl overflow-hidden flex flex-col transition hover:shadow-lg"
                          style={{
                            background: "var(--cv-surface)",
                            border: isSelected
                              ? "2px solid #10b981"
                              : "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          {/* Banner + overlapping logo */}
                          <div className="relative">
                            <div
                              onClick={() => handleDetailsClick(uni)}
                              className="w-full h-[150px] relative cursor-pointer"
                              style={{ background: "var(--cv-neutral-light)" }}
                            >
                              <Image
                                src={bgUrl || "/fallback-bg.png"}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </div>

                            {logoUrl && (
                              <div
                                className="absolute -bottom-7 left-4 w-16 h-16 rounded-xl p-1.5 shadow-md"
                                style={{
                                  background: "#ffffff",
                                  border: "1px solid var(--cv-neutral-border)",
                                }}
                              >
                                <div className="relative w-full h-full">
                                  <Image
                                    src={logoUrl}
                                    alt={`${uni.name} logo`}
                                    fill
                                    sizes="64px"
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="px-4 pb-4 pt-10 flex flex-col flex-1">
                            <h3
                              className="text-base font-bold leading-snug line-clamp-2 min-h-[44px]"
                              style={{ color: "var(--cv-neutral-dark)" }}
                            >
                              {uni.name}
                            </h3>

                            {/* Approvals chips */}
                            <div className="mt-3 flex items-center gap-1.5 flex-wrap min-h-[28px]">
                              {shownApprovals.length > 0 ? (
                                <>
                                  <Award
                                    className="w-4 h-4 flex-shrink-0"
                                    style={{ color: "var(--cv-accent)" }}
                                    aria-hidden="true"
                                  />
                                  {shownApprovals.map((a) => (
                                    <span
                                      key={a}
                                      className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                                      style={{
                                        background: "var(--cv-accent-light)",
                                        color: "var(--cv-accent-dark)",
                                      }}
                                    >
                                      {a}
                                    </span>
                                  ))}
                                  {extra > 0 && (
                                    <span
                                      className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
                                      style={{
                                        background: "var(--cv-neutral-light)",
                                        color: "var(--cv-neutral-mid)",
                                      }}
                                    >
                                      +{extra}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span
                                  className="text-xs"
                                  style={{ color: "var(--cv-neutral-mid)" }}
                                >
                                  Approvals verified
                                </span>
                              )}
                            </div>

                            <div
                              className="mt-3 flex items-center gap-1.5 text-sm font-semibold"
                              style={{ color: "var(--cv-primary)" }}
                            >
                              <BookOpen className="w-4 h-4" aria-hidden="true" />
                              {courseCount} Courses
                            </div>

                            {/* Buttons */}
                            <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
                              <button
                                onClick={() => handleDetailsClick(uni)}
                                className="cursor-pointer text-white py-2.5 rounded-lg text-xs font-bold uppercase transition hover:opacity-90 active:scale-95"
                                style={{ background: "var(--cv-grad-cta)" }}
                              >
                                Details
                              </button>
                              <button
                                onClick={() => handleCompareClick(uni)}
                                className="cursor-pointer py-2.5 rounded-lg text-xs font-bold uppercase transition hover:opacity-90 active:scale-95"
                                style={
                                  isSelected
                                    ? {
                                        background:
                                          "linear-gradient(180deg, #10b981, #059669)",
                                        color: "#fff",
                                        border: "1.5px solid transparent",
                                      }
                                    : {
                                        background: "transparent",
                                        color: "var(--cv-accent)",
                                        border: "1.5px solid var(--cv-accent)",
                                      }
                                }
                              >
                                {isSelected ? "✓ Selected" : "Compare"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {filteredUnis.length > displayLimit && (
                    <div className="mt-10 flex justify-center">
                      <button
                        onClick={() => setDisplayLimit((prev) => prev + PAGE_STEP)}
                        className="cursor-pointer text-white px-10 py-3 rounded-full font-bold transition shadow-md hover:scale-105"
                        style={{
                          background: "var(--cv-grad-cta)",
                          boxShadow: "0 8px 24px rgba(193, 83, 4, 0.35)",
                        }}
                      >
                        View More Universities ↓
                      </button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </section>

      {/* ═══════════ MOBILE FILTER PANEL ═══════════ */}
      {showMobileFilter && (
        <div className="md:hidden fixed inset-0 z-[200] bg-black/50 flex justify-end">
          <div
            className="w-full max-w-xs h-full p-5 overflow-y-auto flex flex-col justify-between"
            style={{ background: "var(--cv-surface)" }}
          >
            <div>
              <div
                className="flex items-center justify-between pb-3"
                style={{ borderBottom: "1px solid var(--cv-neutral-border)" }}
              >
                <h2
                  className="text-base font-bold"
                  style={{ color: "var(--cv-neutral-dark)" }}
                >
                  Search &amp; Filters
                </h2>
                <button
                  onClick={() => setShowMobileFilter(false)}
                  aria-label="Close filters"
                  style={{ color: "var(--cv-neutral-dark)" }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4">{renderFilters("m")}</div>
            </div>

            <div
              className="pt-4 mt-6 flex gap-2"
              style={{ borderTop: "1px solid var(--cv-neutral-border)" }}
            >
              <button
                onClick={resetFilters}
                className="flex-1 py-2.5 text-xs font-bold rounded-lg"
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
              >
                Reset All
              </button>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="flex-1 py-2.5 text-xs font-bold text-white rounded-lg"
                style={{ background: "var(--cv-grad-cta)" }}
              >
                Show {filteredUnis.length}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════ COMPARE TRAY ═══════════ */}
      {selectedForCompare.length > 0 &&
        showCompareOverlay &&
        !showCompareNowModal && (
          <div
            className="fixed bottom-0 left-0 right-0 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] p-6 z-[100] animate-in slide-in-from-bottom duration-300"
            style={{
              background: "var(--cv-surface)",
              borderTop: "1px solid var(--cv-neutral-border)",
            }}
          >
            <div
              className="max-w-[1200px] mx-auto relative"
              style={{ color: "var(--cv-neutral-dark)" }}
            >
              <button
                onClick={() => setShowCompareOverlay(false)}
                className="absolute -top-2 right-0 p-2 transition"
                style={{ color: "var(--cv-neutral-mid)" }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.color = "var(--cv-neutral-dark)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.color = "var(--cv-neutral-mid)")
                }
                aria-label="Close"
              >
                <X size={24} />
              </button>

              <h2
                className="text-center text-xl font-bold mb-6"
                style={{ color: "var(--cv-neutral-dark)" }}
              >
                Add up to 3 Universities
              </h2>

              <div className="flex flex-wrap justify-center items-center gap-6">
                {selectedForCompare.map((uni) => {
                  const logoUrl = getFullImageUrl(uni.universityImage);
                  return (
                    <div
                      key={uni._id}
                      className="relative w-[260px] rounded-xl p-3 shadow-sm text-center"
                      style={{
                        background: "var(--cv-surface)",
                        border: "1px solid var(--cv-neutral-border)",
                      }}
                    >
                      <button
                        onClick={() => handleCompareClick(uni)}
                        className="absolute top-2 right-2 z-10 transition"
                        style={{ color: "var(--cv-accent)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.color = "var(--cv-accent-dark)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.color = "var(--cv-accent)")
                        }
                        aria-label="Remove"
                      >
                        <X size={18} />
                      </button>

                      <div className="w-full h-[100px] rounded-lg overflow-hidden mb-2 relative">
                        <Image
                          src={
                            getFullImageUrl(uni.background?.backgroundImage) ||
                            "/fallback-bg.png"
                          }
                          fill
                          sizes="260px"
                          className="object-cover opacity-40"
                          alt=""
                        />
                        {logoUrl && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative h-12 w-32">
                              <Image
                                src={logoUrl}
                                fill
                                sizes="128px"
                                className="object-contain bg-white p-1 rounded border"
                                alt={`${uni.name} logo`}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                      <p
                        className="text-xs font-bold line-clamp-1"
                        style={{ color: "var(--cv-neutral-dark)" }}
                      >
                        {uni.name}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={handleCompareNowClick}
                  className="cursor-pointer text-white px-10 py-3 rounded-lg font-bold shadow-lg transition hover:scale-105"
                  style={{
                    background: "var(--cv-grad-cta)",
                    boxShadow: "0 8px 24px rgba(193, 83, 4, 0.35)",
                  }}
                >
                  Compare Now
                </button>
              </div>
            </div>
          </div>
        )}

      {/* ═══════════ COMPARE LOGIN MODAL ═══════════ */}
      {showCompareNowModal && !isLoggedIn && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative p-6"
            style={{
              background: "var(--cv-surface)",
              color: "var(--cv-neutral-dark)",
            }}
          >
            <button
              onClick={() => setShowCompareNowModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full transition z-10"
              style={{
                background: "var(--cv-neutral-light)",
                color: "var(--cv-neutral-mid)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--cv-accent)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--cv-neutral-light)";
                e.currentTarget.style.color = "var(--cv-neutral-mid)";
              }}
              aria-label="Close"
            >
              <X size={24} />
            </button>
            <Comparenow
              selectedUnis={selectedForCompare}
              onClose={() => setShowCompareNowModal(false)}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}