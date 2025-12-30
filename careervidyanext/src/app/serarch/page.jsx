// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import Link from "next/link";
// import api from "@/utlis/api.js";

// const APPROVAL_LIST = ["UGC", "AICTE", "NAAC", "NBA"];

// const SearchPage = () => {
//   const searchParams = useSearchParams();
//   const initialQuery = searchParams.get("q") || "";

//   const [searchQuery, setSearchQuery] = useState(initialQuery);
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [filterType, setFilterType] = useState("all");
//   const [selectedApprovals, setSelectedApprovals] = useState([]);

//   const [suggestions, setSuggestions] = useState([]);
//   const [showSuggestions, setShowSuggestions] = useState(false);

//   const [currentPage, setCurrentPage] = useState(1);
//   const resultsPerPage = 5; // Show only 5 cards per page

//   // ================= FETCH SEARCH =================
//   const fetchResults = async (q) => {
//     setLoading(true);
//     setCurrentPage(1);
//     try {
//       const res = await api.get(`/api/v1/university/search/all?query=${q}`);
//       setSearchResults(res.data.data || []);
//     } catch (err) {
//       setSearchResults([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     setSearchQuery(initialQuery);
//     fetchResults(initialQuery);
//   }, [initialQuery]);

//   // ================= SUGGESTIONS =================
//   useEffect(() => {
//     if (searchQuery.length < 2) {
//       setSuggestions([]);
//       setShowSuggestions(false);
//       return;
//     }

//     const timer = setTimeout(async () => {
//       try {
//         const res = await api.get(
//           `/api/v1/university/search/all?query=${searchQuery}`
//         );
//         setSuggestions(res.data.data.slice(0, 6));
//         setShowSuggestions(true);
//       } catch {
//         setSuggestions([]);
//       }
//     }, 300);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   // ================= FILTER =================
//   const filteredResults = searchResults.filter((result) => {
//     if (filterType !== "all" && result.type !== filterType) return false;

//     if (selectedApprovals.length > 0) {
//       const approvalNames = result.approvals?.map((a) => a.name) || [];
//       return selectedApprovals.every((a) => approvalNames.includes(a));
//     }
//     return true;
//   });

//   const indexOfLastResult = currentPage * resultsPerPage;
//   const currentResults = filteredResults.slice(
//     indexOfLastResult - resultsPerPage,
//     indexOfLastResult
//   );
//   const totalPages = Math.ceil(filteredResults.length / resultsPerPage);

//   const clearFilters = () => {
//     setFilterType("all");
//     setSelectedApprovals([]);
//     setSearchQuery("");
//     fetchResults("");
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
//       {/* ================= HEADER ================= */}
//       <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
//         <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-center gap-4">
//           {/* Logo commented out */}
//           {/* <Link href="/">
//             <img src="/CV LOGO BACKGROUND.jpg" className="h-11" />
//           </Link> */}

//           <div className="relative w-full md:w-1/2">
//             <input
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               onKeyDown={(e) =>
//                 e.key === "Enter" && fetchResults(searchQuery)
//               }
//               placeholder="Search universities, approvals, courses..."
//               className="w-full rounded-full px-5 py-3 pl-12 shadow focus:ring-2 focus:ring-blue-500 outline-none"
//             />
//             <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
//               🔍
//             </span> 

//             {/* ================= SUGGESTIONS DROPDOWN ================= */}
//             {showSuggestions && suggestions.length > 0 && (
//               <div className="absolute w-full mt-2 bg-white rounded-xl shadow-lg border overflow-hidden max-h-72 overflow-y-auto z-50">
//                 {suggestions.map((item, i) => (
//                   <div
//                     key={i}
//                     onClick={() => {
//                       setSearchQuery(item.name);
//                       fetchResults(item.name);
//                       setShowSuggestions(false);
//                     }}
//                     className="flex items-start gap-3 px-4 py-3 hover:bg-blue-50 cursor-pointer"
//                   >
//                     <span className="text-gray-500 mt-1">🔍</span>

//                     <div className="flex flex-col">
//                       <span className="text-sm font-medium text-gray-900">
//                         {item.name}
//                       </span>
//                       <span className="text-xs text-blue-600 capitalize">
//                         {item.type === "university"
//                           ? "University"
//                           : "University Course"}
//                       </span>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* ================= CONTENT ================= */}
//       <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
//         {/* ============ SIDEBAR ============ */}
//         <aside className="lg:w-1/4 bg-white rounded-2xl shadow p-5 h-fit">
//           <h3 className="font-bold text-lg mb-4 text-gray-800">
//             Filter by Approval
//           </h3>

//           <div className="flex flex-wrap gap-2">
//             {APPROVAL_LIST.map((appr) => (
//               <button
//                 key={appr}
//                 onClick={() =>
//                   setSelectedApprovals((prev) =>
//                     prev.includes(appr)
//                       ? prev.filter((a) => a !== appr)
//                       : [...prev, appr]
//                   )
//                 }
//                 className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
//                   selectedApprovals.includes(appr)
//                     ? "bg-blue-600 text-white"
//                     : "bg-gray-100 hover:bg-blue-50"
//                 }`}
//               >
//                 {appr}
//               </button>
//             ))}
//           </div>

//           <button
//             onClick={clearFilters}
//             className="mt-6 w-full py-2 rounded-lg bg-orange-100 text-orange-600 font-semibold hover:bg-orange-200"
//           >
//             Reset Filters
//           </button>
//         </aside>

//         {/* ============ RESULTS ============ */}
//         <main className="lg:w-3/4">
//           {loading ? (
//             <div className="space-y-4">
//               {[1, 2, 3].map((i) => (
//                 <div
//                   key={i}
//                   className="h-32 bg-gray-200 rounded-xl animate-pulse"
//                 />
//               ))}
//             </div>
//           ) : currentResults.length > 0 ? (
//             <div className="space-y-5">
//               {currentResults.map((result) => (
//                 <div
//                   key={result._id}
//                   className="bg-white rounded-2xl shadow hover:shadow-lg transition p-5 flex gap-5"
//                 >
//                   {/* Logo commented out */}
//                   {/* <img
//                     src={result.universityImage || "/fallback-logo.png"}
//                     className="w-28 h-20 object-contain bg-gray-50 rounded-lg p-2"
//                   /> */}

//                   <div className="flex-1">
//                     <h3 className="text-xl font-bold text-gray-900">
//                       {result.name}
//                     </h3>

//                     <p className="text-sm text-gray-600 mt-2 line-clamp-2">
//                       {result.cardDescription || result.description}
//                     </p>

//                     <div className="flex flex-wrap gap-2 mt-3">
//                       {result.approvals?.map((appr, i) => (
//                         <span
//                           key={i}
//                           className="px-3 py-1 rounded-full text-xs bg-green-100 text-green-700 font-semibold"
//                         >
//                           {appr.name}
//                         </span>
//                       ))}
//                     </div>

//                     {/* <Link
//                       href={`/university/${result.slug}`}
//                       className="inline-block mt-4 text-blue-600 font-bold text-sm"
//                     >
//                       View Profile →
//                     </Link> */}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-white rounded-2xl p-20 text-center shadow">
//               <h3 className="text-xl font-bold">No Results Found</h3>
//               <p className="text-gray-500 mt-2">
//                 Try different keywords or filters
//               </p>
//             </div>
//           )}

//           {/* PAGINATION */}
//           {totalPages > 1 && (
//             <div className="flex justify-center gap-2 mt-10">
//               {[...Array(totalPages)].map((_, i) => (
//                 <button
//                   key={i}
//                   onClick={() => setCurrentPage(i + 1)}
//                   className={`w-10 h-10 rounded-full font-bold ${
//                     currentPage === i + 1
//                       ? "bg-blue-600 text-white"
//                       : "bg-white border hover:bg-blue-50"
//                   }`}
//                 >
//                   {i + 1}
//                 </button>
//               ))}
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default SearchPage;
