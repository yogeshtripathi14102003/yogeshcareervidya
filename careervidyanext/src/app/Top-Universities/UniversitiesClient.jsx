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


// "use client";

// import React, { useEffect, useState, useMemo, useCallback } from "react";
// import Image from "next/image";
// import { useRouter } from "next/navigation";
// import {
//   X,
//   Search,
//   SlidersHorizontal,
//   RotateCcw,
//   BookOpen,
//   Award,
// } from "lucide-react";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import Comparenow from "@/app/Top-Universities/Comparenow.jsx";
// import api from "@/utlis/api.js";

// const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
// const PAGE_STEP = 12;

// const getFullImageUrl = (path) => {
//   if (!path) return null;

//   return path.startsWith("http")
//     ? path
//     : `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
// };

// /* Approval names as display strings */
// const getApprovalNames = (uni) => {
//   const raw = uni.approvals || uni.recognition?.recognitionPoints || [];

//   if (!Array.isArray(raw)) return [];

//   return raw
//     .map((item) =>
//       typeof item === "object" ? item.name || item.label || "" : String(item)
//     )
//     .map((s) => s.trim())
//     .filter(Boolean);
// };

// const getNaacRank = (names) => {
//   const up = names.map((n) => n.toUpperCase());

//   if (up.includes("NAAC A++")) return 1;
//   if (up.includes("NAAC A+")) return 2;
//   if (up.includes("NAAC A")) return 3;

//   return 4;
// };

// /* ─── Small reusable select ─── */
// function FilterSelect({ id, label, value, onChange, children }) {
//   return (
//     <div className="space-y-1.5">
//       <label
//         htmlFor={id}
//         className="text-xs font-bold block"
//         style={{ color: "var(--cv-neutral-mid)" }}
//       >
//         {label}
//       </label>

//       <select
//         id={id}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="w-full p-2.5 rounded-lg text-sm cursor-pointer outline-none"
//         style={{
//           border: "1px solid var(--cv-neutral-border)",
//           color: "var(--cv-neutral-dark)",
//           background: "var(--cv-surface)",
//         }}
//       >
//         {children}
//       </select>
//     </div>
//   );
// }

// export default function UniversitiesClient({ initialData = [] }) {
//   const router = useRouter();
//   const queryClient = useQueryClient();

//   /* ═══════════ REACT QUERY ═══════════ */
//   const {
//     data: universities = [],
//     isLoading,
//     isError,
//   } = useQuery({
//     queryKey: ["top-universities"],
//     queryFn: async () => {
//       const res = await api.get("/api/v1/university");

//       let list = [];

//       if (Array.isArray(res.data)) list = res.data;
//       else if (Array.isArray(res.data.data)) list = res.data.data;
//       else if (Array.isArray(res.data.universities))
//         list = res.data.universities;

//       return list;
//     },
//     initialData:
//       initialData && initialData.length > 0 ? initialData : undefined,
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ═══════════ STATE ═══════════ */
//   const [showCompareOverlay, setShowCompareOverlay] = useState(false);
//   const [showCompareNowModal, setShowCompareNowModal] = useState(false);
//   const [selectedForCompare, setSelectedForCompare] = useState([]);
//   const [displayLimit, setDisplayLimit] = useState(PAGE_STEP);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const [query, setQuery] = useState("");
//   const [approval, setApproval] = useState("");
//   const [minCourses, setMinCourses] = useState("");
//   const [sortBy, setSortBy] = useState("recommended");
//   const [showMobileFilter, setShowMobileFilter] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("accessToken");
//     setIsLoggedIn(!!token);
//   }, []);

//   const resetLimit = useCallback(() => setDisplayLimit(PAGE_STEP), []);

//   const resetFilters = useCallback(() => {
//     setQuery("");
//     setApproval("");
//     setMinCourses("");
//     setSortBy("recommended");
//     setDisplayLimit(PAGE_STEP);
//   }, []);

//   const hasActiveFilters = !!(query || approval || minCourses);

//   /* ═══════════ FILTER OPTIONS (from data) ═══════════ */
//   const approvalOptions = useMemo(() => {
//     const set = new Set();

//     universities.forEach((u) => getApprovalNames(u).forEach((n) => set.add(n)));

//     return Array.from(set).sort();
//   }, [universities]);

//   /* ═══════════ FILTER + SORT ═══════════ */
//   const filteredUnis = useMemo(() => {
//     let list = [...universities];

//     if (query.trim()) {
//       const q = query.trim().toLowerCase();

//       list = list.filter((u) => (u.name || "").toLowerCase().includes(q));
//     }

//     if (approval) {
//       list = list.filter((u) =>
//         getApprovalNames(u).some(
//           (n) => n.toLowerCase() === approval.toLowerCase()
//         )
//       );
//     }

//     if (minCourses) {
//       const min = Number(minCourses);

//       list = list.filter((u) => (u.courses?.length || 0) >= min);
//     }

//     if (sortBy === "courses") {
//       list.sort(
//         (a, b) => (b.courses?.length || 0) - (a.courses?.length || 0)
//       );
//     } else if (sortBy === "name") {
//       list.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
//     } else {
//       // recommended: NAAC grade → number of approvals → number of courses
//       list.sort((a, b) => {
//         const aN = getApprovalNames(a);
//         const bN = getApprovalNames(b);

//         const aRank = getNaacRank(aN);
//         const bRank = getNaacRank(bN);

//         if (aRank !== bRank) return aRank - bRank;
//         if (bN.length !== aN.length) return bN.length - aN.length;

//         return (b.courses?.length || 0) - (a.courses?.length || 0);
//       });
//     }

//     return list;
//   }, [universities, query, approval, minCourses, sortBy]);

//   const visibleUnis = useMemo(
//     () => filteredUnis.slice(0, displayLimit),
//     [filteredUnis, displayLimit]
//   );

//   /* ═══════════ HANDLERS ═══════════ */
//   const goToCompareResult = (list) => {
//     const ids = list.map((u) => u._id).join(",");

//     router.push(ids ? `/comparedetail?ids=${ids}` : "/comparedetail");
//   };

//   const handleDetailsClick = (uni) => {
//     if ((uni.courses?.length || 0) < 3) {
//       alert("This university details are not available yet.");
//       return;
//     }

//     router.push(`/university/${uni.slug || uni._id}`);
//   };

//   const handleCompareClick = (uni) => {
//     const already = selectedForCompare.find((u) => u._id === uni._id);

//     if (already) {
//       setSelectedForCompare(
//         selectedForCompare.filter((u) => u._id !== uni._id)
//       );
//     } else if (selectedForCompare.length < 3) {
//       setSelectedForCompare([...selectedForCompare, uni]);
//       setShowCompareOverlay(true);
//     } else {
//       alert("Maximum 3 Universities allowed.");
//     }
//   };

//   const handleCompareNowClick = () => {
//     if (isLoggedIn) {
//       goToCompareResult(selectedForCompare);
//       return;
//     }

//     setShowCompareNowModal(true);
//   };

//   const handleRefresh = () => {
//     queryClient.invalidateQueries({ queryKey: ["top-universities"] });
//   };

//   /* ═══════════ FILTER PANEL (used on desktop + mobile) ═══════════ */
//   const renderFilters = (prefix) => (
//     <div className="space-y-4">
//       <div className="space-y-1.5">
//         <label
//           htmlFor={`${prefix}-search`}
//           className="text-xs font-bold block"
//           style={{ color: "var(--cv-neutral-mid)" }}
//         >
//           Search
//         </label>

//         <div className="relative">
//           <input
//             id={`${prefix}-search`}
//             type="text"
//             value={query}
//             onChange={(e) => {
//               setQuery(e.target.value);
//               resetLimit();
//             }}
//             placeholder="University name..."
//             className="w-full rounded-lg pl-9 pr-3 py-2.5 text-sm outline-none"
//             style={{
//               border: "1px solid var(--cv-neutral-border)",
//               color: "var(--cv-neutral-dark)",
//               background: "var(--cv-surface)",
//             }}
//           />

//           <Search
//             className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
//             style={{ color: "var(--cv-neutral-mid)" }}
//             aria-hidden="true"
//           />
//         </div>
//       </div>

//       <FilterSelect
//         id={`${prefix}-approval`}
//         label="Approval"
//         value={approval}
//         onChange={(v) => {
//           setApproval(v);
//           resetLimit();
//         }}
//       >
//         <option value="">All Approvals</option>

//         {approvalOptions.map((o) => (
//           <option key={o} value={o}>
//             {o}
//           </option>
//         ))}
//       </FilterSelect>

//       <FilterSelect
//         id={`${prefix}-courses`}
//         label="Number of courses"
//         value={minCourses}
//         onChange={(v) => {
//           setMinCourses(v);
//           resetLimit();
//         }}
//       >
//         <option value="">Any</option>
//         <option value="5">5+ courses</option>
//         <option value="10">10+ courses</option>
//         <option value="20">20+ courses</option>
//       </FilterSelect>

//       <FilterSelect
//         id={`${prefix}-sort`}
//         label="Sort by"
//         value={sortBy}
//         onChange={(v) => {
//           setSortBy(v);
//           resetLimit();
//         }}
//       >
//         <option value="recommended">Recommended</option>
//         <option value="courses">Most courses</option>
//         <option value="name">Name (A–Z)</option>
//       </FilterSelect>
//     </div>
//   );

//   return (
//     <>
//       <Header />

//       {/* ═══════════ HERO ═══════════ */}
//       <section
//         className="relative overflow-hidden"
//         style={{
//           background:
//             "radial-gradient(circle at 85% 15%, rgba(240,138,60,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(143,166,180,0.25) 0%, transparent 50%), linear-gradient(135deg, #3d4c56 0%, #26323a 100%)",
//         }}
//       >
//         <div
//           className="absolute inset-0 opacity-[0.07] pointer-events-none"
//           style={{
//             backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
//             backgroundSize: "22px 22px",
//           }}
//           aria-hidden="true"
//         />

//         <div className="relative z-10 max-w-[1200px] mx-auto px-4 py-16 md:py-24 text-center">
//           <h1
//             className="text-3xl md:text-5xl font-extrabold leading-tight"
//             style={{ color: "#ffffff" }}
//           >
//             Explore Top Universities in India
//           </h1>

//           <div
//             className="mx-auto mt-4 h-1 w-16 rounded-full"
//             style={{ background: "var(--cv-accent)" }}
//             aria-hidden="true"
//           />

//           <p
//             className="max-w-3xl mx-auto mt-4 text-sm md:text-lg leading-relaxed"
//             style={{ color: "#ffffff" }}
//           >
//             Compare approved universities, check courses, and choose the best
//             option for your future.
//           </p>
//         </div>
//       </section>

//       {/* ═══════════ BODY ═══════════ */}
//       <section
//         className="py-8 md:py-10 min-h-screen relative"
//         style={{ background: "var(--cv-neutral-light)" }}
//       >
//         <div className="max-w-[1280px] mx-auto px-4 pb-40">
//           {/* Mobile top bar */}
//           <div className="md:hidden flex items-center justify-between gap-3 mb-5">
//             <p
//               className="text-sm"
//               style={{ color: "var(--cv-neutral-mid)" }}
//             >
//               {filteredUnis.length} universities
//             </p>

//             <button
//               onClick={() => setShowMobileFilter(true)}
//               className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold"
//               style={{
//                 background: "var(--cv-surface)",
//                 border: "1px solid var(--cv-neutral-border)",
//                 color: "var(--cv-neutral-dark)",
//               }}
//             >
//               <SlidersHorizontal className="w-4 h-4" />
//               Search &amp; Filters
//             </button>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
//             {/* DESKTOP SIDEBAR */}
//             <aside
//               className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 h-fit rounded-2xl p-5 space-y-5 shadow-sm"
//               style={{
//                 background: "var(--cv-surface)",
//                 border: "1px solid var(--cv-neutral-border)",
//               }}
//             >
//               <div
//                 className="flex items-center justify-between pb-3"
//                 style={{
//                   borderBottom: "1px solid var(--cv-neutral-border)",
//                 }}
//               >
//                 <h2
//                   className="text-base font-bold"
//                   style={{ color: "var(--cv-neutral-dark)" }}
//                 >
//                   Filters
//                 </h2>

//                 <button
//                   onClick={resetFilters}
//                   className="text-xs font-bold flex items-center gap-1 hover:opacity-80 transition"
//                   style={{ color: "var(--cv-accent)" }}
//                 >
//                   <RotateCcw className="w-3 h-3" aria-hidden="true" />
//                   RESET
//                 </button>
//               </div>

//               {renderFilters("d")}
//             </aside>

//             {/* MAIN */}
//             <main className="md:col-span-8 lg:col-span-9" aria-live="polite">
//               {isLoading && !universities.length ? (
//                 <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
//                   {[...Array(6)].map((_, i) => (
//                     <div
//                       key={i}
//                       className="animate-pulse rounded-2xl"
//                       style={{
//                         background: "var(--cv-surface)",
//                         border: "1px solid var(--cv-neutral-border)",
//                         minHeight: 340,
//                       }}
//                     />
//                   ))}
//                 </div>
//               ) : isError && !universities.length ? (
//                 <div
//                   className="rounded-2xl p-10 text-center"
//                   style={{
//                     background: "var(--cv-surface)",
//                     border: "1px solid var(--cv-neutral-border)",
//                   }}
//                 >
//                   <p style={{ color: "var(--cv-neutral-mid)" }}>
//                     Couldn&apos;t load universities. Please try again.
//                   </p>

//                   <button
//                     type="button"
//                     onClick={handleRefresh}
//                     className="mt-3 font-semibold hover:underline"
//                     style={{ color: "var(--cv-primary)" }}
//                   >
//                     Try again
//                   </button>
//                 </div>
//               ) : filteredUnis.length === 0 ? (
//                 <div
//                   className="rounded-2xl p-10 text-center"
//                   style={{
//                     background: "var(--cv-surface)",
//                     border: "1px solid var(--cv-neutral-border)",
//                   }}
//                 >
//                   <p style={{ color: "var(--cv-neutral-mid)" }}>
//                     No universities match these filters.
//                   </p>

//                   {hasActiveFilters && (
//                     <button
//                       type="button"
//                       onClick={resetFilters}
//                       className="mt-3 font-semibold hover:underline"
//                       style={{ color: "var(--cv-accent)" }}
//                     >
//                       Clear filters
//                     </button>
//                   )}
//                 </div>
//               ) : (
//                 <>
//                   <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
//                     {visibleUnis.map((uni) => {
//                       const bgUrl = getFullImageUrl(
//                         uni.background?.backgroundImage
//                       );

//                       const logoUrl = getFullImageUrl(uni.universityImage);

//                       const isSelected = selectedForCompare.some(
//                         (s) => s._id === uni._id
//                       );

//                       const courseCount = uni.courses?.length || 0;
//                       const approvals = getApprovalNames(uni);
//                       const shownApprovals = approvals.slice(0, 3);
//                       const extra = approvals.length - shownApprovals.length;

//                       return (
//                         <article
//                           key={uni._id}
//                           className="rounded-2xl overflow-hidden flex flex-col transition hover:shadow-lg"
//                           style={{
//                             background: "var(--cv-surface)",
//                             border: isSelected
//                               ? "2px solid #10b981"
//                               : "1px solid var(--cv-neutral-border)",
//                           }}
//                         >
//                           {/* Banner + overlapping logo */}
//                           <div className="relative">
//                             <div
//                               onClick={() => handleDetailsClick(uni)}
//                               className="w-full h-[150px] relative cursor-pointer"
//                               style={{
//                                 background: "var(--cv-neutral-light)",
//                               }}
//                             >
//                               <Image
//                                 src={bgUrl || "/fallback-bg.png"}
//                                 alt=""
//                                 fill
//                                 sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
//                                 className="object-cover"
//                               />
//                             </div>

//                             {logoUrl && (
//                               <div
//                                 className="absolute -bottom-7 left-4 w-16 h-16 rounded-xl p-1.5 shadow-md"
//                                 style={{
//                                   background: "#ffffff",
//                                   border: "1px solid var(--cv-neutral-border)",
//                                 }}
//                               >
//                                 <div className="relative w-full h-full">
//                                   <Image
//                                     src={logoUrl}
//                                     alt={`${uni.name} logo`}
//                                     fill
//                                     sizes="64px"
//                                     className="object-contain"
//                                   />
//                                 </div>
//                               </div>
//                             )}
//                           </div>

//                           {/* Content */}
//                           <div className="px-4 pb-4 pt-10 flex flex-col flex-1">
//                             <h3
//                               className="text-base font-bold leading-snug line-clamp-2 min-h-[44px]"
//                               style={{
//                                 color: "var(--cv-neutral-dark)",
//                               }}
//                             >
//                               {uni.name}
//                             </h3>

//                             {/* Approvals chips */}
//                             <div className="mt-3 flex items-center gap-1.5 flex-wrap min-h-[28px]">
//                               {shownApprovals.length > 0 ? (
//                                 <>
//                                   <Award
//                                     className="w-4 h-4 flex-shrink-0"
//                                     style={{
//                                       color: "var(--cv-accent)",
//                                     }}
//                                     aria-hidden="true"
//                                   />

//                                   {shownApprovals.map((a) => (
//                                     <span
//                                       key={a}
//                                       className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
//                                       style={{
//                                         background: "var(--cv-accent-light)",
//                                         color: "var(--cv-accent-dark)",
//                                       }}
//                                     >
//                                       {a}
//                                     </span>
//                                   ))}

//                                   {extra > 0 && (
//                                     <span
//                                       className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
//                                       style={{
//                                         background: "var(--cv-neutral-light)",
//                                         color: "var(--cv-neutral-mid)",
//                                       }}
//                                     >
//                                       +{extra}
//                                     </span>
//                                   )}
//                                 </>
//                               ) : (
//                                 <span
//                                   className="text-xs"
//                                   style={{
//                                     color: "var(--cv-neutral-mid)",
//                                   }}
//                                 >
//                                   Approvals verified
//                                 </span>
//                               )}
//                             </div>

//                             <div
//                               className="mt-3 flex items-center gap-1.5 text-sm font-semibold"
//                               style={{
//                                 color: "var(--cv-primary)",
//                               }}
//                             >
//                               <BookOpen
//                                 className="w-4 h-4"
//                                 aria-hidden="true"
//                               />
//                               {courseCount} Courses
//                             </div>

//                             {/* Buttons */}
//                             <div className="grid grid-cols-2 gap-2 mt-auto pt-4">
//                               <button
//                                 onClick={() => handleDetailsClick(uni)}
//                                 className="cursor-pointer text-white py-2.5 rounded-lg text-xs font-bold uppercase transition hover:opacity-90 active:scale-95"
//                                 style={{
//                                   background: "var(--cv-grad-cta)",
//                                 }}
//                               >
//                                 Details
//                               </button>

//                               <button
//                                 onClick={() => handleCompareClick(uni)}
//                                 className="cursor-pointer py-2.5 rounded-lg text-xs font-bold uppercase transition hover:opacity-90 active:scale-95"
//                                 style={
//                                   isSelected
//                                     ? {
//                                         background:
//                                           "linear-gradient(180deg, #10b981, #059669)",
//                                         color: "#fff",
//                                         border: "1.5px solid transparent",
//                                       }
//                                     : {
//                                         background: "transparent",
//                                         color: "var(--cv-accent)",
//                                         border:
//                                           "1.5px solid var(--cv-accent)",
//                                       }
//                                 }
//                               >
//                                 {isSelected ? "✓ Selected" : "Compare"}
//                               </button>
//                             </div>
//                           </div>
//                         </article>
//                       );
//                     })}
//                   </div>

//                   {filteredUnis.length > displayLimit && (
//                     <div className="mt-10 flex justify-center">
//                       <button
//                         onClick={() =>
//                           setDisplayLimit((prev) => prev + PAGE_STEP)
//                         }
//                         className="cursor-pointer text-white px-10 py-3 rounded-full font-bold transition shadow-md hover:scale-105"
//                         style={{
//                           background: "var(--cv-grad-cta)",
//                           boxShadow: "0 8px 24px rgba(193, 83, 4, 0.35)",
//                         }}
//                       >
//                         View More Universities ↓
//                       </button>
//                     </div>
//                   )}
//                 </>
//               )}
//             </main>
//           </div>
//         </div>
//       </section>

//       {/* ═══════════ MOBILE FILTER PANEL ═══════════ */}
//       {showMobileFilter && (
//         <div className="md:hidden fixed inset-0 z-[200] bg-black/50 flex justify-end">
//           <div
//             className="w-full max-w-xs h-full p-5 overflow-y-auto flex flex-col justify-between"
//             style={{
//               background: "var(--cv-surface)",
//             }}
//           >
//             <div>
//               <div
//                 className="flex items-center justify-between pb-3"
//                 style={{
//                   borderBottom: "1px solid var(--cv-neutral-border)",
//                 }}
//               >
//                 <h2
//                   className="text-base font-bold"
//                   style={{
//                     color: "var(--cv-neutral-dark)",
//                   }}
//                 >
//                   Search &amp; Filters
//                 </h2>

//                 <button
//                   onClick={() => setShowMobileFilter(false)}
//                   aria-label="Close filters"
//                   style={{
//                     color: "var(--cv-neutral-dark)",
//                   }}
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="mt-4">{renderFilters("m")}</div>
//             </div>

//             <div
//               className="pt-4 mt-6 flex gap-2"
//               style={{
//                 borderTop: "1px solid var(--cv-neutral-border)",
//               }}
//             >
//               <button
//                 onClick={resetFilters}
//                 className="flex-1 py-2.5 text-xs font-bold rounded-lg"
//                 style={{
//                   border: "1px solid var(--cv-neutral-border)",
//                   color: "var(--cv-neutral-dark)",
//                 }}
//               >
//                 Reset All
//               </button>

//               <button
//                 onClick={() => setShowMobileFilter(false)}
//                 className="flex-1 py-2.5 text-xs font-bold text-white rounded-lg"
//                 style={{
//                   background: "var(--cv-grad-cta)",
//                 }}
//               >
//                 Show {filteredUnis.length}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* ═══════════ COMPARE TRAY — UPDATED DESIGN ONLY ═══════════ */}
//       {selectedForCompare.length > 0 &&
//         showCompareOverlay &&
//         !showCompareNowModal && (
//           <div
//             className="fixed bottom-0 left-0 right-0 z-[100] overflow-hidden border-t border-blue-100/80 shadow-[0_-12px_45px_rgba(30,58,138,0.12)]"
//             style={{
//               background:
//                 "radial-gradient(ellipse at 0% 100%, rgba(191,219,254,0.55) 0%, transparent 42%), radial-gradient(ellipse at 100% 0%, rgba(255,237,213,0.75) 0%, transparent 42%), linear-gradient(135deg, #f8fbff 0%, #ffffff 48%, #fffaf5 100%)",
//               backdropFilter: "blur(18px)",
//               WebkitBackdropFilter: "blur(18px)",
//             }}
//           >
//             {/* Decorative background accents */}
//             <div
//               className="absolute -top-16 left-[12%] h-32 w-32 rounded-full pointer-events-none"
//               style={{
//                 background: "rgba(147,197,253,0.12)",
//                 filter: "blur(35px)",
//               }}
//               aria-hidden="true"
//             />

//             <div
//               className="absolute -bottom-16 right-[12%] h-32 w-32 rounded-full pointer-events-none"
//               style={{
//                 background: "rgba(251,146,60,0.12)",
//                 filter: "blur(35px)",
//               }}
//               aria-hidden="true"
//             />

//             <div className="relative z-10 max-w-[1200px] mx-auto px-4 pt-5 pb-5 sm:px-6 sm:pt-6 sm:pb-6">
//               {/* Header */}
//               <div className="relative mb-5 sm:mb-6">
//                 <div className="text-center px-9">
//                   <div
//                     className="inline-flex items-center gap-2 rounded-full px-3 py-1 mb-2 text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.16em]"
//                     style={{
//                       background: "#eff6ff",
//                       color: "#1e40af",
//                       border: "1px solid #dbeafe",
//                     }}
//                   >
//                     <span
//                       className="h-1.5 w-1.5 rounded-full"
//                       style={{
//                         background: "#3b82f6",
//                       }}
//                     />
//                     University Comparison
//                   </div>

//                   <h2
//                     className="text-lg sm:text-2xl font-extrabold tracking-tight"
//                     style={{
//                       color: "#172554",
//                     }}
//                   >
//                     Compare Your Universities
//                   </h2>

//                   <p
//                     className="mt-1 text-xs sm:text-sm"
//                     style={{
//                       color: "#64748b",
//                     }}
//                   >
//                     Select up to 3 universities to compare your options.
//                   </p>
//                 </div>

//                 <button
//                   onClick={() => setShowCompareOverlay(false)}
//                   className="absolute top-0 right-0 flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 hover:rotate-90 hover:bg-white hover:shadow-md"
//                   style={{
//                     color: "#64748b",
//                     border: "1px solid #e2e8f0",
//                     background: "rgba(255,255,255,0.8)",
//                   }}
//                   aria-label="Close comparison tray"
//                 >
//                   <X size={19} />
//                 </button>
//               </div>

//               {/* Selected universities */}
//               <div className="flex flex-wrap justify-center items-stretch gap-3 sm:gap-5">
//                 {selectedForCompare.map((uni) => {
//                   const logoUrl = getFullImageUrl(uni.universityImage);

//                   const backgroundUrl = getFullImageUrl(
//                     uni.background?.backgroundImage
//                   );

//                   return (
//                     <div
//                       key={uni._id}
//                       className="group relative w-full max-w-[320px] sm:w-[245px] sm:max-w-none overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(30,58,138,0.12)]"
//                       style={{
//                         background:
//                           "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
//                         border: "1px solid #dbeafe",
//                         boxShadow: "0 4px 14px rgba(30,58,138,0.055)",
//                       }}
//                     >
//                       {/* Card top accent */}
//                       <div
//                         className="absolute top-0 left-0 right-0 h-[3px]"
//                         style={{
//                           background:
//                             "linear-gradient(90deg, #2563eb 0%, #93c5fd 50%, #fb923c 100%)",
//                         }}
//                       />

//                       {/* Remove button */}
//                       <button
//                         onClick={() => handleCompareClick(uni)}
//                         className="absolute top-3 right-3 z-20 flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:rotate-90 hover:scale-105"
//                         style={{
//                           color: "#ea580c",
//                           background: "#fff7ed",
//                           border: "1px solid #fed7aa",
//                           boxShadow: "0 2px 6px rgba(234,88,12,0.08)",
//                         }}
//                         onMouseEnter={(e) => {
//                           e.currentTarget.style.background = "#ea580c";
//                           e.currentTarget.style.color = "#ffffff";
//                         }}
//                         onMouseLeave={(e) => {
//                           e.currentTarget.style.background = "#fff7ed";
//                           e.currentTarget.style.color = "#ea580c";
//                         }}
//                         aria-label={`Remove ${uni.name} from comparison`}
//                       >
//                         <X size={16} />
//                       </button>

//                       {/* University image area */}
//                       <div
//                         className="relative mx-3 mt-4 h-[105px] overflow-hidden rounded-xl sm:h-[100px]"
//                         style={{
//                           background:
//                             "linear-gradient(135deg, #eff6ff 0%, #f8fafc 55%, #fff7ed 100%)",
//                           border: "1px solid #e8eef8",
//                         }}
//                       >
//                         {backgroundUrl && (
//                           <Image
//                             src={backgroundUrl}
//                             fill
//                             sizes="320px"
//                             className="object-cover opacity-[0.16]"
//                             alt=""
//                           />
//                         )}

//                         {/* Soft image overlay */}
//                         <div
//                           className="absolute inset-0"
//                           style={{
//                             background:
//                               "linear-gradient(135deg, rgba(239,246,255,0.45), rgba(255,255,255,0.7), rgba(255,247,237,0.45))",
//                           }}
//                           aria-hidden="true"
//                         />

//                         {/* Logo container */}
//                         <div className="absolute inset-0 flex items-center justify-center p-3">
//                           {logoUrl ? (
//                             <div
//                               className="relative h-[58px] w-[150px] rounded-xl p-2 transition-transform duration-300 group-hover:scale-105"
//                               style={{
//                                 background: "rgba(255,255,255,0.96)",
//                                 border: "1px solid rgba(219,234,254,0.9)",
//                                 boxShadow: "0 5px 16px rgba(30,58,138,0.08)",
//                               }}
//                             >
//                               <Image
//                                 src={logoUrl}
//                                 fill
//                                 sizes="150px"
//                                 className="object-contain p-2"
//                                 alt={`${uni.name} logo`}
//                               />
//                             </div>
//                           ) : (
//                             <div
//                               className="flex h-12 w-12 items-center justify-center rounded-xl text-xl font-extrabold"
//                               style={{
//                                 color: "#1d4ed8",
//                                 background: "#ffffff",
//                                 border: "1px solid #dbeafe",
//                               }}
//                               aria-hidden="true"
//                             >
//                               {(uni.name || "U").charAt(0).toUpperCase()}
//                             </div>
//                           )}
//                         </div>
//                       </div>

//                       {/* University details */}
//                       <div className="px-4 pb-4 pt-3 text-center">
//                         <p
//                           className="text-sm font-extrabold leading-snug line-clamp-2 min-h-[40px] flex items-center justify-center"
//                           style={{
//                             color: "#1e293b",
//                           }}
//                           title={uni.name}
//                         >
//                           {uni.name}
//                         </p>

//                         <div
//                           className="mx-auto mt-2 h-[2px] w-10 rounded-full"
//                           style={{
//                             background:
//                               "linear-gradient(90deg, #60a5fa, #fb923c)",
//                           }}
//                           aria-hidden="true"
//                         />

//                         <p
//                           className="mt-2 text-[11px] font-semibold"
//                           style={{
//                             color: "#64748b",
//                           }}
//                         >
//                           {uni.courses?.length || 0} Courses Available
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}

//                 {/* Empty slots */}
//                 {Array.from({
//                   length: Math.max(0, 3 - selectedForCompare.length),
//                 }).map((_, index) => (
//                   <div
//                     key={`empty-slot-${index}`}
//                     className="hidden sm:flex w-[245px] min-h-[190px] flex-col items-center justify-center rounded-2xl p-4 text-center"
//                     style={{
//                       background: "rgba(255,255,255,0.48)",
//                       border: "1.5px dashed #cbd5e1",
//                     }}
//                   >
//                     <div
//                       className="flex h-11 w-11 items-center justify-center rounded-full text-2xl font-light"
//                       style={{
//                         color: "#94a3b8",
//                         background: "#f1f5f9",
//                         border: "1px solid #e2e8f0",
//                       }}
//                       aria-hidden="true"
//                     >
//                       +
//                     </div>

//                     <p
//                       className="mt-3 text-xs font-bold"
//                       style={{
//                         color: "#64748b",
//                       }}
//                     >
//                       Add another university
//                     </p>

//                     <p
//                       className="mt-1 text-[10px]"
//                       style={{
//                         color: "#94a3b8",
//                       }}
//                     >
//                       Choose from the university list
//                     </p>
//                   </div>
//                 ))}
//               </div>

//               {/* Footer and action */}
//               <div className="mt-5 sm:mt-6">
//                 <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:justify-between">
//                   <p
//                     className="text-xs font-semibold text-center sm:text-left"
//                     style={{
//                       color: "#64748b",
//                     }}
//                   >
//                     <span
//                       className="font-extrabold"
//                       style={{
//                         color: "#1d4ed8",
//                       }}
//                     >
//                       {selectedForCompare.length} of 3
//                     </span>{" "}
//                     universities selected
//                   </p>

//                   <button
//                     onClick={handleCompareNowClick}
//                     className="group flex w-full items-center justify-center gap-2 rounded-xl px-8 py-3.5 text-sm font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(234,88,12,0.28)] active:translate-y-0 sm:w-auto sm:min-w-[210px]"
//                     style={{
//                       background:
//                         "linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)",
//                       boxShadow: "0 6px 18px rgba(234,88,12,0.2)",
//                     }}
//                   >
//                     Compare Now
//                     <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">
//                       →
//                     </span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//       {/* ═══════════ COMPARE LOGIN MODAL ═══════════ */}
//       {showCompareNowModal && !isLoggedIn && (
//         <div
//           className="fixed inset-0 z-[1000] flex items-center justify-center p-4"
//           style={{
//             background: "rgba(15, 23, 42, 0.7)",
//             backdropFilter: "blur(4px)",
//           }}
//         >
//           <div
//             className="rounded-2xl w-full max-w-5xl max-h-[95vh] overflow-y-auto relative p-6"
//             style={{
//               background: "var(--cv-surface)",
//               color: "var(--cv-neutral-dark)",
//             }}
//           >
//             <button
//               onClick={() => setShowCompareNowModal(false)}
//               className="absolute top-4 right-4 p-2 rounded-full transition z-10"
//               style={{
//                 background: "var(--cv-neutral-light)",
//                 color: "var(--cv-neutral-mid)",
//               }}
//               onMouseEnter={(e) => {
//                 e.currentTarget.style.background = "var(--cv-accent)";
//                 e.currentTarget.style.color = "#fff";
//               }}
//               onMouseLeave={(e) => {
//                 e.currentTarget.style.background = "var(--cv-neutral-light)";
//                 e.currentTarget.style.color = "var(--cv-neutral-mid)";
//               }}
//               aria-label="Close"
//             >
//               <X size={24} />
//             </button>

//             <Comparenow
//               selectedUnis={selectedForCompare}
//               onClose={() => setShowCompareNowModal(false)}
//               isLoggedIn={isLoggedIn}
//             />
//           </div>
//         </div>
//       )}

//       <Footer />
//     </>
//   );
// }



"use client";

import React, {
  useEffect,
  useState,
  useMemo,
  useCallback,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
  Award,
} from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import Comparenow from "@/app/Top-Universities/Comparenow.jsx";
import api from "@/utlis/api.js";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";
const PAGE_STEP = 12;

/* ─────────────────────────────────────────────
   IMAGE URL HELPER
───────────────────────────────────────────── */
const getFullImageUrl = (path) => {
  if (!path || typeof path !== "string") return null;

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${BASE_URL.replace(/\/$/, "")}/${path.replace(/^\/+/, "")}`;
};

/* ─────────────────────────────────────────────
   APPROVAL HELPERS
───────────────────────────────────────────── */
const getApprovalNames = (uni) => {
  const raw =
    uni?.approvals ||
    uni?.recognition?.recognitionPoints ||
    [];

  if (!Array.isArray(raw)) return [];

  return raw
    .map((item) =>
      typeof item === "object" && item !== null
        ? item.name || item.label || ""
        : String(item)
    )
    .map((name) => name.trim())
    .filter(Boolean);
};

const getNaacRank = (names) => {
  const normalizedNames = names.map((name) =>
    name.toUpperCase().replace(/\s+/g, " ").trim()
  );

  if (normalizedNames.some((name) => /\bNAAC\s*A\+\+\b/.test(name))) {
    return 1;
  }

  if (normalizedNames.some((name) => /\bNAAC\s*A\+\b/.test(name))) {
    return 2;
  }

  if (normalizedNames.some((name) => /\bNAAC\s*A\b/.test(name))) {
    return 3;
  }

  return 4;
};

/* ─────────────────────────────────────────────
   REUSABLE FILTER SELECT
───────────────────────────────────────────── */
function FilterSelect({
  id,
  label,
  value,
  onChange,
  children,
}) {
  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-[11px] font-bold uppercase tracking-wide"
        style={{ color: "var(--cv-neutral-mid)" }}
      >
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg px-3 py-2 text-[13px] outline-none transition cursor-pointer"
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

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function UniversitiesClient({
  initialData = [],
}) {
  const router = useRouter();
  const queryClient = useQueryClient();

  /* ───────── API / REACT QUERY ───────── */
  const {
    data: universities = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["top-universities"],

    queryFn: async () => {
      const response = await api.get("/api/v1/university");
      const data = response.data;

      if (Array.isArray(data)) {
        return data;
      }

      if (Array.isArray(data?.data)) {
        return data.data;
      }

      if (Array.isArray(data?.universities)) {
        return data.universities;
      }

      return [];
    },

    initialData:
      Array.isArray(initialData) && initialData.length > 0
        ? initialData
        : undefined,

    staleTime: 5 * 60 * 1000,
  });

  /* ───────── STATE ───────── */
  const [showCompareOverlay, setShowCompareOverlay] =
    useState(false);

  const [showCompareNowModal, setShowCompareNowModal] =
    useState(false);

  const [selectedForCompare, setSelectedForCompare] =
    useState([]);

  const [displayLimit, setDisplayLimit] = useState(PAGE_STEP);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [query, setQuery] = useState("");
  const [approval, setApproval] = useState("");
  const [minCourses, setMinCourses] = useState("");
  const [sortBy, setSortBy] = useState("recommended");

  const [showMobileFilter, setShowMobileFilter] =
    useState(false);

  /* ───────── LOGIN CHECK ───────── */
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(
        Boolean(localStorage.getItem("accessToken"))
      );
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
    };
  }, []);

  /* ───────── RESET HELPERS ───────── */
  const resetLimit = useCallback(() => {
    setDisplayLimit(PAGE_STEP);
  }, []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setApproval("");
    setMinCourses("");
    setSortBy("recommended");
    setDisplayLimit(PAGE_STEP);
  }, []);

  const hasActiveFilters = Boolean(
    query.trim() || approval || minCourses
  );

  /* ───────── APPROVAL OPTIONS ───────── */
  const approvalOptions = useMemo(() => {
    const approvalSet = new Set();

    universities.forEach((university) => {
      getApprovalNames(university).forEach((name) => {
        approvalSet.add(name);
      });
    });

    return Array.from(approvalSet).sort((a, b) =>
      a.localeCompare(b)
    );
  }, [universities]);

  /* ───────── FILTER AND SORT ───────── */
  const filteredUnis = useMemo(() => {
    let list = [...universities];

    if (query.trim()) {
      const searchTerm = query.trim().toLowerCase();

      list = list.filter((university) =>
        (university.name || "")
          .toLowerCase()
          .includes(searchTerm)
      );
    }

    if (approval) {
      list = list.filter((university) =>
        getApprovalNames(university).some(
          (name) =>
            name.toLowerCase() === approval.toLowerCase()
        )
      );
    }

    if (minCourses) {
      const minimum = Number(minCourses);

      list = list.filter(
        (university) =>
          (university.courses?.length || 0) >= minimum
      );
    }

    if (sortBy === "courses") {
      list.sort(
        (a, b) =>
          (b.courses?.length || 0) -
          (a.courses?.length || 0)
      );
    } else if (sortBy === "name") {
      list.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "")
      );
    } else {
      list.sort((a, b) => {
        const aApprovals = getApprovalNames(a);
        const bApprovals = getApprovalNames(b);

        const aRank = getNaacRank(aApprovals);
        const bRank = getNaacRank(bApprovals);

        if (aRank !== bRank) {
          return aRank - bRank;
        }

        if (bApprovals.length !== aApprovals.length) {
          return bApprovals.length - aApprovals.length;
        }

        return (
          (b.courses?.length || 0) -
          (a.courses?.length || 0)
        );
      });
    }

    return list;
  }, [
    universities,
    query,
    approval,
    minCourses,
    sortBy,
  ]);

  /* ───────── VISIBLE UNIVERSITIES ───────── */
  const visibleUnis = useMemo(
    () => filteredUnis.slice(0, displayLimit),
    [filteredUnis, displayLimit]
  );

  /* ───────── COMPARE NAVIGATION ───────── */
  const goToCompareResult = useCallback(
    (list) => {
      const ids = list
        .map((university) => university._id)
        .filter(Boolean)
        .join(",");

      router.push(
        ids
          ? `/comparedetail?ids=${encodeURIComponent(ids)}`
          : "/comparedetail"
      );
    },
    [router]
  );

  /* ───────── UNIVERSITY DETAILS ───────── */
  const handleDetailsClick = useCallback(
    (university) => {
      if ((university.courses?.length || 0) < 3) {
        alert(
          "This university details are not available yet."
        );
        return;
      }

      router.push(
        `/university/${encodeURIComponent(
          university.slug || university._id
        )}`
      );
    },
    [router]
  );

  /* ───────── SELECT UNIVERSITY FOR COMPARISON ───────── */
  const handleCompareClick = useCallback(
    (university) => {
      setSelectedForCompare((previous) => {
        const alreadySelected = previous.some(
          (item) => item._id === university._id
        );

        if (alreadySelected) {
          const updated = previous.filter(
            (item) => item._id !== university._id
          );

          if (updated.length === 0) {
            setShowCompareOverlay(false);
          }

          return updated;
        }

        if (previous.length >= 3) {
          alert("Maximum 3 Universities allowed.");
          return previous;
        }

        setShowCompareOverlay(true);

        return [...previous, university];
      });
    },
    []
  );

  /* ───────── COMPARE NOW ───────── */
  const handleCompareNowClick = useCallback(() => {
    if (selectedForCompare.length < 2) {
      alert(
        "Please select at least 2 universities to compare."
      );
      return;
    }

    const loggedIn = Boolean(
      localStorage.getItem("accessToken")
    );

    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      setShowCompareNowModal(false);
      goToCompareResult(selectedForCompare);
      return;
    }

    setShowCompareNowModal(true);
  }, [selectedForCompare, goToCompareResult]);

  /* ───────── REFRESH DATA ───────── */
  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: ["top-universities"],
    });
  }, [queryClient]);

  /* ─────────────────────────────────────────────
     FILTER PANEL
  ───────────────────────────────────────────── */
  const renderFilters = (prefix) => (
    <div className="space-y-3.5">
      {/* Search */}
      <div className="space-y-1">
        <label
          htmlFor={`${prefix}-search`}
          className="block text-[11px] font-bold uppercase tracking-wide"
          style={{ color: "var(--cv-neutral-mid)" }}
        >
          Search
        </label>

        <div className="relative">
          <input
            id={`${prefix}-search`}
            type="text"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              resetLimit();
            }}
            placeholder="University name..."
            className="w-full rounded-lg py-2 pl-9 pr-3 text-[13px] outline-none"
            style={{
              border: "1px solid var(--cv-neutral-border)",
              color: "var(--cv-neutral-dark)",
              background: "var(--cv-surface)",
            }}
          />

          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: "var(--cv-neutral-mid)" }}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Approval */}
      <FilterSelect
        id={`${prefix}-approval`}
        label="Approval"
        value={approval}
        onChange={(value) => {
          setApproval(value);
          resetLimit();
        }}
      >
        <option value="">All Approvals</option>

        {approvalOptions.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </FilterSelect>

      {/* Courses */}
      <FilterSelect
        id={`${prefix}-courses`}
        label="Courses"
        value={minCourses}
        onChange={(value) => {
          setMinCourses(value);
          resetLimit();
        }}
      >
        <option value="">Any</option>
        <option value="5">5+ courses</option>
        <option value="10">10+ courses</option>
        <option value="20">20+ courses</option>
      </FilterSelect>

      {/* Sorting */}
      <FilterSelect
        id={`${prefix}-sort`}
        label="Sort by"
        value={sortBy}
        onChange={(value) => {
          setSortBy(value);
          resetLimit();
        }}
      >
        <option value="recommended">Recommended</option>
        <option value="courses">Most courses</option>
        <option value="name">Name (A–Z)</option>
      </FilterSelect>
    </div>
  );

  /* ─────────────────────────────────────────────
     RENDER
  ───────────────────────────────────────────── */
  return (
    <>
      <Header />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(240,138,60,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(143,166,180,0.25) 0%, transparent 50%), linear-gradient(135deg, #3d4c56 0%, #26323a 100%)",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(#fff 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto max-w-[1200px] px-4 py-12 text-center md:py-20">
          <h1 className="text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-5xl">
            Explore Top Universities in India
          </h1>

          <div
            className="mx-auto mt-3 h-1 w-14 rounded-full"
            style={{ background: "var(--cv-accent)" }}
            aria-hidden="true"
          />

          <p className="mx-auto mt-3 max-w-3xl text-[13px] leading-relaxed text-white md:text-lg">
            Compare approved universities, check courses, and choose the best
            option for your future.
          </p>
        </div>
      </section>

      {/* MAIN BODY */}
      <section
        className="relative min-h-screen py-6 md:py-10"
        style={{ background: "var(--cv-neutral-light)" }}
      >
        <div className="mx-auto max-w-[1280px] px-3 pb-40 sm:px-4">
          {/* MOBILE FILTER BAR */}
          <div className="mb-4 flex items-center justify-between gap-3 md:hidden">
            <p
              className="text-[13px]"
              style={{ color: "var(--cv-neutral-mid)" }}
            >
              {filteredUnis.length} universities
            </p>

            <button
              type="button"
              onClick={() => setShowMobileFilter(true)}
              className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-[12px] font-bold"
              style={{
                background: "var(--cv-surface)",
                border: "1px solid var(--cv-neutral-border)",
                color: "var(--cv-neutral-dark)",
              }}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-8">
            {/* DESKTOP FILTER SIDEBAR */}
            <aside
              className="sticky top-24 hidden h-fit space-y-4 rounded-xl p-4 shadow-sm md:col-span-4 md:block lg:col-span-3"
              style={{
                background: "var(--cv-surface)",
                border: "1px solid var(--cv-neutral-border)",
              }}
            >
              <div
                className="flex items-center justify-between border-b pb-3"
                style={{
                  borderColor: "var(--cv-neutral-border)",
                }}
              >
                <h2
                  className="text-sm font-bold"
                  style={{ color: "var(--cv-neutral-dark)" }}
                >
                  Filters
                </h2>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex items-center gap-1 text-[11px] font-bold transition hover:opacity-80"
                  style={{ color: "var(--cv-accent)" }}
                >
                  <RotateCcw
                    className="h-3 w-3"
                    aria-hidden="true"
                  />
                  RESET
                </button>
              </div>

              {renderFilters("d")}
            </aside>

            {/* UNIVERSITY LIST */}
            <main
              className="md:col-span-8 lg:col-span-9"
              aria-live="polite"
            >
              {/* LOADING */}
              {isLoading && universities.length === 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div
                      key={index}
                      className="animate-pulse rounded-xl"
                      style={{
                        background: "var(--cv-surface)",
                        border: "1px solid var(--cv-neutral-border)",
                        minHeight: 320,
                      }}
                    />
                  ))}
                </div>
              ) : isError && universities.length === 0 ? (
                /* ERROR */
                <div
                  className="rounded-xl p-8 text-center"
                  style={{
                    background: "var(--cv-surface)",
                    border: "1px solid var(--cv-neutral-border)",
                  }}
                >
                  <p style={{ color: "var(--cv-neutral-mid)" }}>
                    Couldn&apos;t load universities. Please try again.
                  </p>

                  <button
                    type="button"
                    onClick={handleRefresh}
                    className="mt-3 text-sm font-semibold hover:underline"
                    style={{ color: "var(--cv-primary)" }}
                  >
                    Try again
                  </button>
                </div>
              ) : filteredUnis.length === 0 ? (
                /* NO RESULTS */
                <div
                  className="rounded-xl p-8 text-center"
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
                      className="mt-3 text-sm font-semibold hover:underline"
                      style={{ color: "var(--cv-accent)" }}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              ) : (
                <>
                  {/* UNIVERSITY CARDS */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3">
                    {visibleUnis.map((university) => {
                      const bgUrl = getFullImageUrl(
                        university.background?.backgroundImage
                      );

                      const logoUrl = getFullImageUrl(
                        university.universityImage
                      );

                      const isSelected = selectedForCompare.some(
                        (item) => item._id === university._id
                      );

                      const courseCount =
                        university.courses?.length || 0;

                      const approvals =
                        getApprovalNames(university);

                      const shownApprovals = approvals.slice(0, 2);

                      const extra =
                        approvals.length - shownApprovals.length;

                      return (
                        <article
                          key={university._id}
                          className="flex flex-col overflow-hidden rounded-xl transition hover:shadow-md"
                          style={{
                            background: "var(--cv-surface)",
                            border: isSelected
                              ? "1.5px solid #10b981"
                              : "1px solid var(--cv-neutral-border)",
                          }}
                        >
                          {/* BANNER */}
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() =>
                                handleDetailsClick(university)
                              }
                              className="relative block h-[110px] w-full cursor-pointer sm:h-[120px]"
                              style={{
                                background: "var(--cv-neutral-light)",
                              }}
                              aria-label={`View ${university.name} details`}
                            >
                              <Image
                                src={bgUrl || "/fallback-bg.png"}
                                alt=""
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                                className="object-cover"
                              />
                            </button>

                            {logoUrl && (
                              <div
                                className="absolute -bottom-6 left-3 h-12 w-12 rounded-lg p-1 shadow-sm sm:h-14 sm:w-14"
                                style={{
                                  background: "#ffffff",
                                  border:
                                    "1px solid var(--cv-neutral-border)",
                                }}
                              >
                                <div className="relative h-full w-full">
                                  <Image
                                    src={logoUrl}
                                    alt={`${university.name} logo`}
                                    fill
                                    sizes="56px"
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="flex flex-1 flex-col px-3 pb-3 pt-8">
                            <h3
                              className="line-clamp-2 min-h-[38px] text-[13px] font-bold leading-snug sm:text-sm"
                              style={{
                                color: "var(--cv-neutral-dark)",
                              }}
                              title={university.name}
                            >
                              {university.name}
                            </h3>

                            {/* APPROVALS */}
                            <div className="mt-2 flex min-h-[22px] flex-wrap items-center gap-1">
                              {shownApprovals.length > 0 ? (
                                <>
                                  <Award
                                    className="h-3.5 w-3.5 flex-shrink-0"
                                    style={{
                                      color: "var(--cv-accent)",
                                    }}
                                    aria-hidden="true"
                                  />

                                  {shownApprovals.map((name) => (
                                    <span
                                      key={name}
                                      className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                      style={{
                                        background:
                                          "var(--cv-accent-light)",
                                        color:
                                          "var(--cv-accent-dark)",
                                      }}
                                    >
                                      {name}
                                    </span>
                                  ))}

                                  {extra > 0 && (
                                    <span
                                      className="rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                                      style={{
                                        background:
                                          "var(--cv-neutral-light)",
                                        color:
                                          "var(--cv-neutral-mid)",
                                      }}
                                    >
                                      +{extra}
                                    </span>
                                  )}
                                </>
                              ) : (
                                <span
                                  className="text-[11px]"
                                  style={{
                                    color: "var(--cv-neutral-mid)",
                                  }}
                                >
                                  Approvals verified
                                </span>
                              )}
                            </div>

                            {/* COURSE COUNT */}
                            <div
                              className="mt-2 flex items-center gap-1.5 text-[12px] font-semibold"
                              style={{
                                color: "var(--cv-primary)",
                              }}
                            >
                              <BookOpen
                                className="h-3.5 w-3.5"
                                aria-hidden="true"
                              />

                              {courseCount} Courses
                            </div>

                            {/* ACTION BUTTONS */}
                            <div className="mt-auto grid grid-cols-2 gap-2 pt-3">
                              <button
                                type="button"
                                onClick={() =>
                                  handleDetailsClick(university)
                                }
                                className="cursor-pointer rounded-md py-1.5 text-[11px] font-bold uppercase tracking-wide text-white transition hover:opacity-90 active:scale-95"
                                style={{
                                  background: "var(--cv-grad-cta)",
                                }}
                              >
                                Details
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleCompareClick(university)
                                }
                                className="cursor-pointer rounded-md py-1.5 text-[11px] font-bold uppercase tracking-wide transition hover:opacity-90 active:scale-95"
                                style={
                                  isSelected
                                    ? {
                                        background:
                                          "linear-gradient(180deg, #10b981, #059669)",
                                        color: "#ffffff",
                                        border:
                                          "1px solid transparent",
                                      }
                                    : {
                                        background: "transparent",
                                        color: "var(--cv-accent)",
                                        border:
                                          "1px solid var(--cv-accent)",
                                      }
                                }
                              >
                                {isSelected
                                  ? "✓ Selected"
                                  : "Compare"}
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>

                  {/* VIEW MORE */}
                  {filteredUnis.length > displayLimit && (
                    <div className="mt-8 flex justify-center">
                      <button
                        type="button"
                        onClick={() =>
                          setDisplayLimit(
                            (previous) => previous + PAGE_STEP
                          )
                        }
                        className="cursor-pointer rounded-full px-8 py-2.5 text-sm font-bold text-white shadow-md transition hover:scale-105"
                        style={{
                          background: "var(--cv-grad-cta)",
                          boxShadow:
                            "0 8px 24px rgba(193, 83, 4, 0.3)",
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

      {/* ─────────────────────────────────────────
          MOBILE FILTER BOTTOM SHEET
      ───────────────────────────────────────── */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowMobileFilter(false)}
            aria-label="Close filter overlay"
          />

          <div
            className="relative flex max-h-[88vh] w-full flex-col overflow-hidden rounded-t-2xl animate-[slideUp_0.25s_ease-out]"
            style={{ background: "var(--cv-surface)" }}
          >
            {/* HEADER */}
            <div
              className="flex items-center justify-between border-b px-4 py-3"
              style={{
                borderColor: "var(--cv-neutral-border)",
              }}
            >
              <h2
                className="text-sm font-bold"
                style={{
                  color: "var(--cv-neutral-dark)",
                }}
              >
                Search &amp; Filters
              </h2>

              <button
                type="button"
                onClick={() => setShowMobileFilter(false)}
                aria-label="Close filters"
                className="rounded-full p-1.5"
                style={{
                  color: "var(--cv-neutral-dark)",
                  background: "var(--cv-neutral-light)",
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* FILTER CONTENT */}
            <div className="flex-1 overflow-y-auto px-4 py-4">
              {renderFilters("m")}
            </div>

            {/* FOOTER */}
            <div
              className="flex gap-2 border-t px-4 py-3"
              style={{
                borderColor: "var(--cv-neutral-border)",
              }}
            >
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 rounded-lg py-2.5 text-xs font-bold"
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
              >
                Reset All
              </button>

              <button
                type="button"
                onClick={() => setShowMobileFilter(false)}
                className="flex-1 rounded-lg py-2.5 text-xs font-bold text-white"
                style={{
                  background: "var(--cv-grad-cta)",
                }}
              >
                Show {filteredUnis.length}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────
          COMPARISON TRAY
      ───────────────────────────────────────── */}
      {selectedForCompare.length > 0 &&
        showCompareOverlay &&
        !showCompareNowModal && (
          <div
            className="fixed bottom-0 left-0 right-0 z-[100] overflow-hidden border-t border-blue-100/80 shadow-[0_-12px_45px_rgba(30,58,138,0.12)]"
            style={{
              background:
                "radial-gradient(ellipse at 0% 100%, rgba(191,219,254,0.55) 0%, transparent 42%), radial-gradient(ellipse at 100% 0%, rgba(255,237,213,0.75) 0%, transparent 42%), linear-gradient(135deg, #f8fbff 0%, #ffffff 48%, #fffaf5 100%)",
              backdropFilter: "blur(18px)",
              WebkitBackdropFilter: "blur(18px)",
            }}
          >
            {/* DECORATIVE BACKGROUNDS */}
            <div
              className="pointer-events-none absolute -top-16 left-[12%] h-32 w-32 rounded-full"
              style={{
                background: "rgba(147,197,253,0.12)",
                filter: "blur(35px)",
              }}
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute -bottom-16 right-[12%] h-32 w-32 rounded-full"
              style={{
                background: "rgba(251,146,60,0.12)",
                filter: "blur(35px)",
              }}
              aria-hidden="true"
            />

            <div className="relative z-10 mx-auto max-w-[1200px] px-3 pb-4 pt-4 sm:px-6 sm:pb-5 sm:pt-5">
              {/* HEADER */}
              <div className="relative mb-4 sm:mb-5">
                <div className="px-9 text-center">
                  <div
                    className="mb-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[9px] font-extrabold uppercase tracking-[0.14em] sm:text-[10px]"
                    style={{
                      background: "#eff6ff",
                      color: "#1e40af",
                      border: "1px solid #dbeafe",
                    }}
                  >
                    <span
                      className="h-1 w-1 rounded-full"
                      style={{ background: "#3b82f6" }}
                    />
                    Comparison
                  </div>

                  <h2
                    className="text-[15px] font-extrabold tracking-tight sm:text-xl"
                    style={{ color: "#172554" }}
                  >
                    Compare Your Universities
                  </h2>

                  <p
                    className="mt-0.5 text-[11px] sm:text-xs"
                    style={{ color: "#64748b" }}
                  >
                    Select up to 3 universities.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCompareOverlay(false)}
                  className="absolute right-0 top-0 flex h-7 w-7 items-center justify-center rounded-full transition hover:rotate-90"
                  style={{
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    background: "rgba(255,255,255,0.8)",
                  }}
                  aria-label="Close comparison tray"
                >
                  <X size={14} />
                </button>
              </div>

              {/* SELECTED UNIVERSITIES */}
              <div className="flex flex-wrap items-stretch justify-center gap-2.5 sm:gap-4">
                {selectedForCompare.map((university) => {
                  const logoUrl = getFullImageUrl(
                    university.universityImage
                  );

                  const backgroundUrl = getFullImageUrl(
                    university.background?.backgroundImage
                  );

                  return (
                    <div
                      key={university._id}
                      className="group relative w-[calc(33.333%-6px)] min-w-0 overflow-hidden rounded-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(30,58,138,0.12)] sm:w-[220px]"
                      style={{
                        background:
                          "linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)",
                        border: "1px solid #dbeafe",
                        boxShadow:
                          "0 4px 14px rgba(30,58,138,0.055)",
                      }}
                    >
                      <div
                        className="absolute left-0 right-0 top-0 h-[3px]"
                        style={{
                          background:
                            "linear-gradient(90deg, #2563eb 0%, #93c5fd 50%, #fb923c 100%)",
                        }}
                      />

                      {/* REMOVE UNIVERSITY */}
                      <button
                        type="button"
                        onClick={() =>
                          handleCompareClick(university)
                        }
                        className="absolute right-1.5 top-1.5 z-20 flex h-6 w-6 items-center justify-center rounded-full transition hover:rotate-90"
                        style={{
                          color: "#ea580c",
                          background: "#fff7ed",
                          border: "1px solid #fed7aa",
                        }}
                        aria-label={`Remove ${university.name}`}
                      >
                        <X size={12} />
                      </button>

                      {/* IMAGE AREA */}
                      <div
                        className="relative mx-2 mt-3 h-[70px] overflow-hidden rounded-lg sm:h-[90px]"
                        style={{
                          background:
                            "linear-gradient(135deg, #eff6ff 0%, #f8fafc 55%, #fff7ed 100%)",
                          border: "1px solid #e8eef8",
                        }}
                      >
                        {backgroundUrl && (
                          <Image
                            src={backgroundUrl}
                            fill
                            sizes="220px"
                            className="object-cover opacity-[0.16]"
                            alt=""
                          />
                        )}

                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(239,246,255,0.45), rgba(255,255,255,0.7), rgba(255,247,237,0.45))",
                          }}
                          aria-hidden="true"
                        />

                        <div className="absolute inset-0 flex items-center justify-center p-2">
                          {logoUrl ? (
                            <div
                              className="relative h-[38px] w-full max-w-[110px] rounded-lg p-1.5"
                              style={{
                                background:
                                  "rgba(255,255,255,0.96)",
                                border:
                                  "1px solid rgba(219,234,254,0.9)",
                              }}
                            >
                              <Image
                                src={logoUrl}
                                fill
                                sizes="110px"
                                className="object-contain p-1"
                                alt={`${university.name} logo`}
                              />
                            </div>
                          ) : (
                            <div
                              className="flex h-8 w-8 items-center justify-center rounded-lg text-base font-extrabold"
                              style={{
                                color: "#1d4ed8",
                                background: "#ffffff",
                                border: "1px solid #dbeafe",
                              }}
                            >
                              {(university.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* UNIVERSITY NAME */}
                      <div className="px-2 pb-2.5 pt-2 text-center">
                        <p
                          className="flex min-h-[32px] items-center justify-center line-clamp-2 text-[11px] font-extrabold leading-snug sm:text-[12px]"
                          style={{ color: "#1e293b" }}
                          title={university.name}
                        >
                          {university.name}
                        </p>

                        <p
                          className="mt-1 text-[10px] font-semibold"
                          style={{ color: "#64748b" }}
                        >
                          {university.courses?.length || 0} Courses
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* EMPTY SLOTS: DESKTOP */}
                {Array.from({
                  length: Math.max(
                    0,
                    3 - selectedForCompare.length
                  ),
                }).map((_, index) => (
                  <div
                    key={`empty-${index}`}
                    className="hidden min-h-[150px] w-[220px] flex-col items-center justify-center rounded-xl p-3 text-center sm:flex"
                    style={{
                      background: "rgba(255,255,255,0.48)",
                      border: "1.5px dashed #cbd5e1",
                    }}
                  >
                    <div
                      className="flex h-9 w-9 items-center justify-center rounded-full text-xl font-light"
                      style={{
                        color: "#94a3b8",
                        background: "#f1f5f9",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      +
                    </div>

                    <p
                      className="mt-2 text-[11px] font-bold"
                      style={{ color: "#64748b" }}
                    >
                      Add university
                    </p>
                  </div>
                ))}
              </div>

              {/* COMPARE ACTION */}
              <div className="mt-4">
                <div className="flex flex-col items-center justify-center gap-2.5 sm:flex-row sm:justify-between">
                  <p
                    className="text-center text-[11px] font-semibold sm:text-left"
                    style={{ color: "#64748b" }}
                  >
                    <span
                      className="font-extrabold"
                      style={{ color: "#1d4ed8" }}
                    >
                      {selectedForCompare.length} of 3
                    </span>{" "}
                    universities selected
                  </p>

                  <button
                    type="button"
                    onClick={handleCompareNowClick}
                    className="group flex w-full items-center justify-center gap-2 rounded-lg px-6 py-2.5 text-[13px] font-extrabold text-white transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 sm:w-auto sm:min-w-[190px]"
                    style={{
                      background:
                        "linear-gradient(135deg, #f97316 0%, #ea580c 55%, #c2410c 100%)",
                      boxShadow:
                        "0 6px 18px rgba(234,88,12,0.2)",
                    }}
                  >
                    Compare Now

                    <span className="text-base transition-transform duration-200 group-hover:translate-x-1">
                      →
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* ─────────────────────────────────────────
          COMPARE LOGIN MODAL
      ───────────────────────────────────────── */}
      {showCompareNowModal && !isLoggedIn && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-3 sm:p-4"
          style={{
            background: "rgba(15, 23, 42, 0.7)",
            backdropFilter: "blur(4px)",
          }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowCompareNowModal(false);
            }
          }}
        >
          <div
            className="relative max-h-[95vh] w-full max-w-5xl overflow-y-auto rounded-2xl p-4 sm:p-6"
            style={{
              background: "var(--cv-surface)",
              color: "var(--cv-neutral-dark)",
            }}
          >
            {/* FIXED CLOSE BUTTON */}
            <button
              type="button"
              onClick={() => setShowCompareNowModal(false)}
              className="absolute right-3 top-3 z-10 rounded-full p-1.5 transition"
              style={{
                background: "var(--cv-neutral-light)",
                color: "var(--cv-neutral-mid)",
              }}
              onMouseEnter={(event) => {
                event.currentTarget.style.background =
                  "var(--cv-accent)";
                event.currentTarget.style.color = "#ffffff";
              }}
              onMouseLeave={(event) => {
                event.currentTarget.style.background =
                  "var(--cv-neutral-light)";
                event.currentTarget.style.color =
                  "var(--cv-neutral-mid)";
              }}
              aria-label="Close comparison login modal"
            >
              <X size={20} />
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
