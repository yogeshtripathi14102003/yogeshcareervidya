

// "use client";

// import { useState, useEffect, Suspense } from "react";
// import { useSearchParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api.js";

// const APPROVAL_LIST = ["UGC", "AICTE", "NAAC", "NBA"];

// const SearchContent = () => {
//   const searchParams = useSearchParams();
//   const router = useRouter();
//   const initialQuery = searchParams.get("q") || "";

//   const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedApprovals, setSelectedApprovals] = useState([]);
//   const [placeholderIndex, setPlaceholderIndex] = useState(0);

//   // NEW: controls slide-in on mount and slide-out before navigating away
//   const [isVisible, setIsVisible] = useState(false);
//   const [isClosing, setIsClosing] = useState(false);

//   const placeholders = ["Find University...", "Find College...", "Find Course..."];

//   // Trigger slide-in on mount (next tick so the animation actually plays)
//   useEffect(() => {
//     const raf = requestAnimationFrame(() => setIsVisible(true));
//     return () => cancelAnimationFrame(raf);
//   }, []);

//   useEffect(() => {
//     const timer = setInterval(() => {
//       setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
//     }, 2000);
//     return () => clearInterval(timer);
//   }, []);

//   // NEW: handles the back button — plays slide-out, then actually navigates
//   const handleBack = () => {
//     setIsClosing(true);
//     setTimeout(() => {
//       router.back();
//     }, 280); // matches the slide-out animation duration below
//   };

//   const getSmartFilters = (query) => {
//     const lowerQuery = query.toLowerCase();
//     let detectedFees = null;
//     let cleanQuery = lowerQuery;
//     const feeMatch = lowerQuery.match(/(?:under|below|less than|upto)\s?(\d+k?)/);
//     if (feeMatch) {
//       let value = feeMatch[1];
//       detectedFees = value.includes("k")
//         ? parseInt(value.replace("k", "")) * 1000
//         : parseInt(value);
//       cleanQuery = lowerQuery.replace(feeMatch[0], "").trim();
//     }
//     return { detectedFees, cleanQuery };
//   };

//   useEffect(() => {
//     if (searchQuery.trim() === "") {
//       setSearchResults([]);
//       setLoading(false);
//       return;
//     }
//     const delayDebounceFn = setTimeout(() => {
//       const { cleanQuery } = getSmartFilters(searchQuery);
//       fetchResults(cleanQuery || searchQuery);
//     }, 300);
//     return () => clearTimeout(delayDebounceFn);
//   }, [searchQuery]);

//   const fetchResults = async (q) => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/v1/university/search/all?query=${q}`);
//       setSearchResults(res.data.data || []);
//     } catch {
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const filteredResults = searchResults
//     .map((result) => {
//       const { detectedFees } = getSmartFilters(searchQuery);
//       const matchedCourses =
//         result.courses?.filter((course) => {
//           const matchesCourseName = course.name
//             .toLowerCase()
//             .includes(searchQuery.toLowerCase());
//           const matchesFee = detectedFees
//             ? (course.fees || course.minFees || 0) <= detectedFees
//             : true;
//           return matchesCourseName && matchesFee;
//         }) || [];

//       if (selectedApprovals.length > 0) {
//         const universityApprovals =
//           result.approvals?.map((a) => a.name.toUpperCase()) || [];
//         const hasApprovals = selectedApprovals.every((val) =>
//           universityApprovals.includes(val.toUpperCase())
//         );
//         if (!hasApprovals) return null;
//       }

//       const matchesUniversityName = result.name
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase());
//       if (!matchesUniversityName && matchedCourses.length === 0) return null;

//       return { ...result, matchedCourses };
//     })
//     .filter(Boolean);

//   return (
//     <>
//       <style>{`
//         @keyframes slideDownIn {
//           from { opacity: 0; transform: translateY(-24px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         @keyframes slideUpOut {
//           from { opacity: 1; transform: translateY(0); }
//           to   { opacity: 0; transform: translateY(-24px); }
//         }
//         .page-enter {
//           opacity: 0;
//           transform: translateY(-24px);
//         }
//         .page-enter.is-visible {
//           animation: slideDownIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
//         }
//         .page-enter.is-closing {
//           animation: slideUpOut 0.28s cubic-bezier(0.4,0,1,1) forwards;
//         }

//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(16px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }
//         .card-enter { animation: fadeUp 0.35s ease forwards; }

//         @keyframes shimmer {
//           0%   { background-position: -600px 0; }
//           100% { background-position: 600px 0; }
//         }
//         .skeleton {
//           background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
//           background-size: 600px 100%;
//           animation: shimmer 1.4s infinite;
//           border-radius: 16px;
//         }

//         .search-input:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
//         .result-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
//         .result-card { transition: all 0.2s ease; }
//         .filter-chip { transition: all 0.15s ease; }
//       `}</style>

//       <div
//         className={`page-enter ${isClosing ? "is-closing" : isVisible ? "is-visible" : ""}`}
//         style={{ minHeight: "100vh", background: "#F4F6FB" }}
//       >

//         {/* ── HEADER ── */}
//         <header style={{
//           position: "sticky", top: 0, zIndex: 50,
//           background: "rgba(255,255,255,0.92)",
//           backdropFilter: "blur(12px)",
//           borderBottom: "1px solid #E5E9F2",
//           padding: "12px 0",
//         }}>
//           <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 14 }}>

//             {/* Back button */}
//             <button
//               onClick={handleBack}
//               style={{
//                 width: 40, height: 40, borderRadius: 10,
//                 border: "1px solid #E5E9F2",
//                 background: "#fff", cursor: "pointer",
//                 display: "flex", alignItems: "center", justifyContent: "center",
//                 flexShrink: 0, color: "#374151",
//               }}
//             >
//               <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
//                 <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
//               </svg>
//             </button>

//             {/* Search bar */}
//             <div style={{ flex: 1, position: "relative" }}>
//               <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
//                 <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </span>
//               <input
//                 className="search-input"
//                 value={searchQuery}
//                 autoFocus
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 placeholder={placeholders[placeholderIndex]}
//                 style={{
//                   width: "100%", boxSizing: "border-box",
//                   padding: "11px 42px 11px 44px",
//                   borderRadius: 12,
//                   border: "1.5px solid #E5E9F2",
//                   background: "#F8FAFC",
//                   fontSize: 15, color: "#111827",
//                   outline: "none",
//                   transition: "border-color 0.2s",
//                 }}
//               />
//               {searchQuery && (
//                 <button
//                   onClick={() => setSearchQuery("")}
//                   style={{
//                     position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
//                     background: "#F3F4F6", border: "none", borderRadius: "50%",
//                     width: 22, height: 22, cursor: "pointer",
//                     display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280",
//                   }}
//                 >
//                   <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
//                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
//                   </svg>
//                 </button>
//               )}
//             </div>
//           </div>
//         </header>

//         {/* ── BODY ── */}
//         <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px" }}>

//           {searchQuery.trim() !== "" ? (
//             <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

//               {/* ── SIDEBAR ── */}
//               <aside style={{ width: 220, flexShrink: 0 }}>
//                 <div style={{
//                   background: "#fff", borderRadius: 16,
//                   border: "1px solid #E5E9F2", padding: "18px 16px",
//                 }}>
//                   <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", margin: "0 0 14px 0", textTransform: "uppercase" }}>
//                     Filter by Approval
//                   </p>
//                   <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                     {APPROVAL_LIST.map((appr) => {
//                       const active = selectedApprovals.includes(appr);
//                       return (
//                         <label
//                           key={appr}
//                           className="filter-chip"
//                           style={{
//                             display: "flex", alignItems: "center", justifyContent: "space-between",
//                             padding: "9px 12px", borderRadius: 10, cursor: "pointer",
//                             border: `1.5px solid ${active ? "#BFDBFE" : "#F0F2F7"}`,
//                             background: active ? "#EFF6FF" : "#FAFBFC",
//                           }}
//                         >
//                           <span style={{ fontSize: 13, fontWeight: 600, color: active ? "#1D4ED8" : "#4B5563" }}>
//                             {appr}
//                           </span>
//                           <input
//                             type="checkbox"
//                             checked={active}
//                             onChange={() =>
//                               setSelectedApprovals((prev) =>
//                                 prev.includes(appr) ? prev.filter((a) => a !== appr) : [...prev, appr]
//                               )
//                             }
//                             style={{ accentColor: "#2563EB", width: 15, height: 15 }}
//                           />
//                         </label>
//                       );
//                     })}
//                   </div>
//                 </div>
//               </aside>

//               {/* ── RESULTS ── */}
//               <main style={{ flex: 1, minWidth: 0 }}>

//                 {/* Result meta row */}
//                 <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
//                   <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
//                     Showing{" "}
//                     <strong style={{ color: "#111827" }}>{filteredResults.length}</strong>{" "}
//                     results for{" "}
//                     <strong style={{ color: "#2563EB" }}>"{searchQuery}"</strong>
//                   </p>
//                   {getSmartFilters(searchQuery).detectedFees && (
//                     <span style={{
//                       fontSize: 11, fontWeight: 700, color: "#065F46",
//                       background: "#D1FAE5", border: "1px solid #A7F3D0",
//                       padding: "4px 10px", borderRadius: 8,
//                     }}>
//                       BUDGET ≤ ₹{getSmartFilters(searchQuery).detectedFees.toLocaleString()}
//                     </span>
//                   )}
//                 </div>

//                 {/* Loading skeletons */}
//                 {loading ? (
//                   <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                     {[1, 2, 3].map((i) => (
//                       <div key={i} className="skeleton" style={{ height: 110 }} />
//                     ))}
//                   </div>

//                 ) : filteredResults.length > 0 ? (
//                   <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
//                     {filteredResults.map((result, idx) => (
//                       <div
//                         key={result._id}
//                         className="result-card card-enter"
//                         style={{
//                           background: "#fff", borderRadius: 16,
//                           border: "1px solid #E5E9F2", padding: "18px 20px",
//                           animationDelay: `${idx * 0.05}s`,
//                         }}
//                       >
//                         <Link href={`/university/${result.slug || result._id}`} style={{ textDecoration: "none" }}>
//                           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
//                             <div>
//                               <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 3px 0" }}>
//                                 {result.name}
//                               </h2>
//                               <p style={{ fontSize: 13, color: "#6B7280", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
//                                 <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
//                                   <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
//                                 </svg>
//                                 {result.location || "India"}
//                               </p>
//                             </div>
//                             <span style={{
//                               fontSize: 10, fontWeight: 800, color: "#1D4ED8",
//                               background: "#EFF6FF", border: "1px solid #BFDBFE",
//                               padding: "3px 9px", borderRadius: 6, letterSpacing: "0.06em",
//                             }}>
//                               UNIVERSITY
//                             </span>
//                           </div>

//                           {/* Tags row */}
//                           <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
//                             {result.minFees && (
//                               <span style={{
//                                 fontSize: 12, fontWeight: 600, color: "#065F46",
//                                 background: "#ECFDF5", border: "1px solid #A7F3D0",
//                                 padding: "3px 10px", borderRadius: 8,
//                               }}>
//                                 ₹{result.minFees.toLocaleString()} min fees
//                               </span>
//                             )}
//                             {result.approvals?.map((a, i) => (
//                               <span key={i} style={{
//                                 fontSize: 11, fontWeight: 700, color: "#374151",
//                                 background: "#F3F4F6", border: "1px solid #E5E7EB",
//                                 padding: "3px 9px", borderRadius: 6,
//                               }}>
//                                 {a.name}
//                               </span>
//                             ))}
//                           </div>
//                         </Link>

//                         {/* Matched courses */}
//                         {result.matchedCourses?.length > 0 && (
//                           <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px dashed #E5E9F2" }}>
//                             <p style={{ fontSize: 10, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 10px 0" }}>
//                               Matching Courses
//                             </p>
//                             <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
//                               {result.matchedCourses.map((course) => (
//                                 <div key={course._id || course.name} style={{
//                                   display: "flex", justifyContent: "space-between", alignItems: "center",
//                                   padding: "8px 12px", background: "#F8FAFC",
//                                   borderRadius: 10, border: "1px solid #F0F2F7",
//                                 }}>
//                                   <span style={{ fontSize: 13, fontWeight: 600, color: "#1F2937" }}>{course.name}</span>
//                                   <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>
//                                     ₹{course.fees?.toLocaleString() || "On Request"}
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>

//                 ) : (
//                   /* Empty state */
//                   <div style={{
//                     background: "#fff", borderRadius: 20,
//                     border: "1.5px dashed #E5E9F2",
//                     padding: "64px 20px", textAlign: "center",
//                   }}>
//                     <div style={{
//                       width: 64, height: 64, borderRadius: "50%",
//                       background: "#FEF2F2", margin: "0 auto 20px",
//                       display: "flex", alignItems: "center", justifyContent: "center",
//                     }}>
//                       <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={1.8}>
//                         <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                       </svg>
//                     </div>
//                     <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 6px 0" }}>
//                       No results found
//                     </h3>
//                     <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0 }}>
//                       Try different keywords or remove filters
//                     </p>
//                   </div>
//                 )}
//               </main>
//             </div>

//           ) : (
//             /* ── EMPTY / IDLE STATE ── */
//             <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
//               <div style={{
//                 width: 80, height: 80, borderRadius: "50%",
//                 background: "#EFF6FF", marginBottom: 24,
//                 display: "flex", alignItems: "center", justifyContent: "center",
//               }}>
//                 <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.6}>
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//                 </svg>
//               </div>
//               <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
//                 Search for your future
//               </h2>
//               <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 300, lineHeight: 1.6, margin: "0 0 28px 0" }}>
//                 Enter a university name, course, or your budget like{" "}
//                 <strong style={{ color: "#2563EB" }}>"MBA under 50k"</strong>
//               </p>

//               {/* Quick suggestion chips */}
//               <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
//                 {["MBA", "B.Tech", "Law", "Medical", "NAAC A+"].map((tag) => (
//                   <button
//                     key={tag}
//                     onClick={() => setSearchQuery(tag)}
//                     style={{
//                       padding: "8px 16px", borderRadius: 20,
//                       border: "1.5px solid #BFDBFE",
//                       background: "#EFF6FF", color: "#1D4ED8",
//                       fontSize: 13, fontWeight: 600, cursor: "pointer",
//                       transition: "all 0.15s ease",
//                     }}
//                   >
//                     {tag}
//                   </button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default function SearchPage() {
//   return (
//     <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4F6FB" }} />}>
//       <SearchContent />
//     </Suspense>
//   );
// }

"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import api from "@/utlis/api.js";

const APPROVAL_LIST = ["UGC", "AICTE", "NAAC", "NBA"];

const SearchContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApprovals, setSelectedApprovals] = useState([]);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  // controls slide-in on mount and slide-out before navigating away
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const placeholders = ["Find University...", "Find College...", "Find Course..."];

  // Trigger slide-in on mount (next tick so the animation actually plays)
  useEffect(() => {
    const raf = requestAnimationFrame(() => setIsVisible(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholders.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // handles the back button — plays slide-out, then actually navigates
  const handleBack = () => {
    setIsClosing(true);
    setTimeout(() => {
      router.back();
    }, 280); // matches the slide-out animation duration below
  };

  const getSmartFilters = (query) => {
    const lowerQuery = query.toLowerCase();
    let detectedFees = null;
    let cleanQuery = lowerQuery;
    const feeMatch = lowerQuery.match(/(?:under|below|less than|upto)\s?(\d+k?)/);
    if (feeMatch) {
      let value = feeMatch[1];
      detectedFees = value.includes("k")
        ? parseInt(value.replace("k", "")) * 1000
        : parseInt(value);
      cleanQuery = lowerQuery.replace(feeMatch[0], "").trim();
    }
    return { detectedFees, cleanQuery };
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setLoading(false);
      return;
    }
    const delayDebounceFn = setTimeout(() => {
      const { cleanQuery } = getSmartFilters(searchQuery);
      fetchResults(cleanQuery || searchQuery);
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const fetchResults = async (q) => {
    setLoading(true);
    try {
      const res = await api.get(`/api/v1/university/search/all?query=${q}`);
      // 🔍 TEMP DEBUG — remove after checking console output
      console.log("SEARCH API RAW RESULT:", res.data.data);
      if (res.data.data?.[0]?.courses?.[0]) {
        console.log("FIRST COURSE OBJECT SHAPE:", res.data.data[0].courses[0]);
      }
      setSearchResults(res.data.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = searchResults
    .map((result) => {
      const { detectedFees } = getSmartFilters(searchQuery);
      const matchedCourses =
        result.courses?.filter((course) => {
          const matchesCourseName = course.name
            .toLowerCase()
            .includes(searchQuery.toLowerCase());
          const matchesFee = detectedFees
            ? (course.fees || course.minFees || 0) <= detectedFees
            : true;
          return matchesCourseName && matchesFee;
        }) || [];

      if (selectedApprovals.length > 0) {
        const universityApprovals =
          result.approvals?.map((a) => a.name.toUpperCase()) || [];
        const hasApprovals = selectedApprovals.every((val) =>
          universityApprovals.includes(val.toUpperCase())
        );
        if (!hasApprovals) return null;
      }

      const matchesUniversityName = result.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesUniversityName && matchedCourses.length === 0) return null;

      return { ...result, matchedCourses };
    })
    .filter(Boolean);

  return (
    <>
      <style>{`
        @keyframes slideDownIn {
          from { opacity: 0; transform: translateY(-24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUpOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(-24px); }
        }
        .page-enter {
          opacity: 0;
          transform: translateY(-24px);
        }
        .page-enter.is-visible {
          animation: slideDownIn 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .page-enter.is-closing {
          animation: slideUpOut 0.28s cubic-bezier(0.4,0,1,1) forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .card-enter { animation: fadeUp 0.35s ease forwards; }

        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position: 600px 0; }
        }
        .skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
          background-size: 600px 100%;
          animation: shimmer 1.4s infinite;
          border-radius: 16px;
        }

        .search-input:focus { box-shadow: 0 0 0 3px rgba(37,99,235,0.12); }
        .result-card:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.08); }
        .result-card { transition: all 0.2s ease; }
        .filter-chip { transition: all 0.15s ease; }
      `}</style>

      <div
        className={`page-enter ${isClosing ? "is-closing" : isVisible ? "is-visible" : ""}`}
        style={{ minHeight: "100vh", background: "#F4F6FB" }}
      >

        {/* ── HEADER ── */}
        <header style={{
          position: "sticky", top: 0, zIndex: 50,
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid #E5E9F2",
          padding: "12px 0",
        }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "0 20px", display: "flex", alignItems: "center", gap: 14 }}>

            {/* Back button */}
            <button
              onClick={handleBack}
              style={{
                width: 40, height: 40, borderRadius: 10,
                border: "1px solid #E5E9F2",
                background: "#fff", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: "#374151",
              }}
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>

            {/* Search bar */}
            <div style={{ flex: 1, position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9CA3AF" }}>
                <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
              <input
                className="search-input"
                value={searchQuery}
                autoFocus
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={placeholders[placeholderIndex]}
                style={{
                  width: "100%", boxSizing: "border-box",
                  padding: "11px 42px 11px 44px",
                  borderRadius: 12,
                  border: "1.5px solid #E5E9F2",
                  background: "#F8FAFC",
                  fontSize: 15, color: "#111827",
                  outline: "none",
                  transition: "border-color 0.2s",
                }}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  style={{
                    position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "#F3F4F6", border: "none", borderRadius: "50%",
                    width: 22, height: 22, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7280",
                  }}
                >
                  <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </header>

        {/* ── BODY ── */}
        <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 20px" }}>

          {searchQuery.trim() !== "" ? (
            <div style={{ display: "flex", gap: 28, alignItems: "flex-start", flexWrap: "wrap" }}>

              {/* ── SIDEBAR ── */}
              <aside style={{ width: 220, flexShrink: 0 }}>
                <div style={{
                  background: "#fff", borderRadius: 16,
                  border: "1px solid #E5E9F2", padding: "18px 16px",
                }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", margin: "0 0 14px 0", textTransform: "uppercase" }}>
                    Filter by Approval
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {APPROVAL_LIST.map((appr) => {
                      const active = selectedApprovals.includes(appr);
                      return (
                        <label
                          key={appr}
                          className="filter-chip"
                          style={{
                            display: "flex", alignItems: "center", justifyContent: "space-between",
                            padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                            border: `1.5px solid ${active ? "#BFDBFE" : "#F0F2F7"}`,
                            background: active ? "#EFF6FF" : "#FAFBFC",
                          }}
                        >
                          <span style={{ fontSize: 13, fontWeight: 600, color: active ? "#1D4ED8" : "#4B5563" }}>
                            {appr}
                          </span>
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={() =>
                              setSelectedApprovals((prev) =>
                                prev.includes(appr) ? prev.filter((a) => a !== appr) : [...prev, appr]
                              )
                            }
                            style={{ accentColor: "#2563EB", width: 15, height: 15 }}
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>
              </aside>

              {/* ── RESULTS ── */}
              <main style={{ flex: 1, minWidth: 0 }}>

                {/* Result meta row */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                  <p style={{ fontSize: 13, color: "#6B7280", margin: 0 }}>
                    Showing{" "}
                    <strong style={{ color: "#111827" }}>{filteredResults.length}</strong>{" "}
                    results for{" "}
                    <strong style={{ color: "#2563EB" }}>"{searchQuery}"</strong>
                  </p>
                  {getSmartFilters(searchQuery).detectedFees && (
                    <span style={{
                      fontSize: 11, fontWeight: 700, color: "#065F46",
                      background: "#D1FAE5", border: "1px solid #A7F3D0",
                      padding: "4px 10px", borderRadius: 8,
                    }}>
                      BUDGET ≤ ₹{getSmartFilters(searchQuery).detectedFees.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Loading skeletons */}
                {loading ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="skeleton" style={{ height: 110 }} />
                    ))}
                  </div>

                ) : filteredResults.length > 0 ? (

                  /* ── TWO COLUMN LAYOUT: Universities | Courses ── */
                  <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

                    {/* ── LEFT: UNIVERSITIES ── */}
                    <div style={{ flex: "1 1 340px", minWidth: 280 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                        Universities
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                        {filteredResults.map((result, idx) => (
                          <Link
                            key={result._id}
                            href={`/university/${result.slug || result._id}`}
                            className="result-card card-enter"
                            style={{
                              textDecoration: "none",
                              display: "block",
                              background: "#fff", borderRadius: 16,
                              border: "1px solid #E5E9F2", padding: "18px 20px",
                              animationDelay: `${idx * 0.05}s`,
                            }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                              <div>
                                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#111827", margin: "0 0 3px 0" }}>
                                  {result.name}
                                </h2>
                                <p style={{ fontSize: 13, color: "#6B7280", margin: 0, display: "flex", alignItems: "center", gap: 4 }}>
                                  <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                  </svg>
                                  {result.location || "India"}
                                </p>
                              </div>
                              <span style={{
                                fontSize: 10, fontWeight: 800, color: "#1D4ED8",
                                background: "#EFF6FF", border: "1px solid #BFDBFE",
                                padding: "3px 9px", borderRadius: 6, letterSpacing: "0.06em",
                              }}>
                                UNIVERSITY
                              </span>
                            </div>

                            {/* Tags row */}
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
                              {result.minFees && (
                                <span style={{
                                  fontSize: 12, fontWeight: 600, color: "#065F46",
                                  background: "#ECFDF5", border: "1px solid #A7F3D0",
                                  padding: "3px 10px", borderRadius: 8,
                                }}>
                                  ₹{result.minFees.toLocaleString()} min fees
                                </span>
                              )}
                              {result.approvals?.map((a, i) => (
                                <span key={i} style={{
                                  fontSize: 11, fontWeight: 700, color: "#374151",
                                  background: "#F3F4F6", border: "1px solid #E5E7EB",
                                  padding: "3px 9px", borderRadius: 6,
                                }}>
                                  {a.name}
                                </span>
                              ))}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* ── RIGHT: COURSES ── */}
                    <div style={{ flex: "1 1 340px", minWidth: 280 }}>
                      <p style={{ fontSize: 11, fontWeight: 700, color: "#9CA3AF", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 12px 0" }}>
                        Matching Courses
                      </p>

                      {(() => {
                        // Flatten all matched courses from every university into one list
                        const allMatchedCourses = filteredResults.flatMap((result) =>
                          (result.matchedCourses || []).map((course) => ({
                            ...course,
                            universityName: result.name,
                            universitySlug: result.slug || result._id,
                          }))
                        );

                        if (allMatchedCourses.length === 0) {
                          return (
                            <div style={{
                              background: "#fff", borderRadius: 16,
                              border: "1.5px dashed #E5E9F2",
                              padding: "40px 16px", textAlign: "center",
                            }}>
                              <p style={{ fontSize: 13, color: "#9CA3AF", margin: 0 }}>
                                No matching courses
                              </p>
                            </div>
                          );
                        }

                        return (
                          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                            {allMatchedCourses.map((course, idx) => (
                              <Link
                                key={course._id || `${course.universitySlug}-${course.name}`}
                                href={`/course/${course.slug || course._id}`}
                                className="result-card card-enter"
                                style={{
                                  textDecoration: "none",
                                  display: "block",
                                  background: "#fff", borderRadius: 14,
                                  border: "1px solid #E5E9F2", padding: "14px 16px",
                                  animationDelay: `${idx * 0.05}s`,
                                }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                                  <span style={{ fontSize: 13.5, fontWeight: 700, color: "#1F2937" }}>
                                    {course.name}
                                  </span>
                                  <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>
                                    ₹{course.fees?.toLocaleString() || "On Request"}
                                  </span>
                                </div>
                                <p style={{ fontSize: 11.5, color: "#9CA3AF", margin: 0 }}>
                                  {course.universityName}
                                </p>
                              </Link>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                  </div>

                ) : (
                  /* Empty state */
                  <div style={{
                    background: "#fff", borderRadius: 20,
                    border: "1.5px dashed #E5E9F2",
                    padding: "64px 20px", textAlign: "center",
                  }}>
                    <div style={{
                      width: 64, height: 64, borderRadius: "50%",
                      background: "#FEF2F2", margin: "0 auto 20px",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="#EF4444" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <h3 style={{ fontSize: 17, fontWeight: 700, color: "#111827", margin: "0 0 6px 0" }}>
                      No results found
                    </h3>
                    <p style={{ fontSize: 14, color: "#9CA3AF", margin: 0 }}>
                      Try different keywords or remove filters
                    </p>
                  </div>
                )}
              </main>
            </div>

          ) : (
            /* ── EMPTY / IDLE STATE ── */
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 20px", textAlign: "center" }}>
              <div style={{
                width: 80, height: 80, borderRadius: "50%",
                background: "#EFF6FF", marginBottom: 24,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="36" height="36" fill="none" viewBox="0 0 24 24" stroke="#2563EB" strokeWidth={1.6}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#111827", margin: "0 0 10px 0", letterSpacing: "-0.02em" }}>
                Search for your future
              </h2>
              <p style={{ fontSize: 14, color: "#9CA3AF", maxWidth: 300, lineHeight: 1.6, margin: "0 0 28px 0" }}>
                Enter a university name, course, or your budget like{" "}
                <strong style={{ color: "#2563EB" }}>"MBA under 50k"</strong>
              </p>

              {/* Quick suggestion chips */}
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap", justifyContent: "center" }}>
                {["MBA", "B.Tech", "Law", "Medical", "NAAC A+"].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(tag)}
                    style={{
                      padding: "8px 16px", borderRadius: 20,
                      border: "1.5px solid #BFDBFE",
                      background: "#EFF6FF", color: "#1D4ED8",
                      fontSize: 13, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#F4F6FB" }} />}>
      <SearchContent />
    </Suspense>
  );
}