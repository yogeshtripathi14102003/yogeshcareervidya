// "use client";
// import Footer from "@/app/layout/Footer.jsx";
// import { useEffect, useMemo, useState, useCallback, useRef } from "react";
// import api from "@/utlis/api.js";
// import Image from "next/image";
// import {
//   Search, Star, Phone, MessageSquare,
//   ChevronLeft, ChevronRight, RotateCcw,
// } from "lucide-react";
// import Bookcounsler from "../components/Bookcounsler.jsx";
// import Header from "@/app/layout/Header.jsx";
// import { useRouter } from "next/navigation";

// // ─── Constants ────────────────────────────────────────────────────────────────
// const FALLBACK_AVATAR = "/images/default-avatar.png";
// const PAGE_SIZE = 6;

// // ─── Global singleton store ───────────────────────────────────────────────────
// // Module-level object — survives re-renders, tab switches, filter changes.
// // API sirf tab call hogi jab data null ho (pehli baar).
// // Baar baar page kholne pe bhi yahi data use hoga jab tak tab reload na ho.
// const mentorStore = {
//   data: null,          // fetched mentors array
//   promise: null,       // in-flight promise (duplicate calls avoid karta hai)
//   listeners: new Set(),// jo components subscribe hain

//   subscribe(fn) {
//     this.listeners.add(fn);
//     return () => this.listeners.delete(fn);
//   },
//   notify() {
//     this.listeners.forEach((fn) => fn(this.data));
//   },

//   // Sirf ek baar fetch — agar already chal raha hai toh same promise return karo
//   async fetch() {
//     if (this.data !== null) return this.data;          // cache hit — API call nahi
//     if (this.promise) return this.promise;              // already in-flight

//     this.promise = api
//       .get("/api/v1/team")
//       .then((res) => {
//         const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
//         this.data = list;
//         this.notify();
//         return list;
//       })
//       .catch((err) => {
//         this.promise = null; // error pe retry allow karo
//         return Promise.reject(err);
//       });

//     return this.promise;
//   },
// };

// // ─── Security helpers ─────────────────────────────────────────────────────────
// function sanitizePhone(raw) {
//   if (typeof raw !== "string") return "";
//   return raw.replace(/[^\d+]/g, "").slice(0, 15);
// }
// function sanitizeText(str, maxLen = 500) {
//   if (typeof str !== "string") return "";
//   return str.replace(/<[^>]*>/g, "").slice(0, maxLen);
// }
// function sanitizeUrl(raw) {
//   if (typeof raw !== "string") return null;
//   if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/"))
//     return raw;
//   return null;
// }

// // ─── Deterministic rating helper ──────────────────────────────────────────────
// function hashStringToInt(str) {
//   let hash = 0;
//   for (let i = 0; i < str.length; i++) {
//     hash = (hash << 5) - hash + str.charCodeAt(i);
//     hash |= 0;
//   }
//   return Math.abs(hash);
// }
// function getFallbackRatingData(seedKey, experience = 5) {
//   const hash = hashStringToInt(seedKey || "default");
//   const exp  = Number(experience) || 0;
//   let minRating, maxRating;
//   if (exp >= 10)     { minRating = 4.6; maxRating = 5.0; }
//   else if (exp >= 6) { minRating = 4.2; maxRating = 4.6; }
//   else if (exp >= 3) { minRating = 3.6; maxRating = 4.2; }
//   else               { minRating = 3.0; maxRating = 3.6; }
//   const range = Math.round((maxRating - minRating) * 10);
//   const rating = (minRating + (hash % (range + 1)) * 0.1).toFixed(1);
//   return { rating: Number(rating), ratingCount: 20 + (hash % 200) };
// }

// // ─── useMentors hook ──────────────────────────────────────────────────────────
// // Singleton store se data lega — component mount kitni baar bhi ho,
// // API ek baar hi jayegi.
// function useMentors() {
//   const [mentors, setMentors] = useState(mentorStore.data ?? []);
//   const [loading, setLoading] = useState(mentorStore.data === null);
//   const [error,   setError]   = useState(null);

//   useEffect(() => {
//     // Agar pehle se data hai toh kuch karna nahi
//     if (mentorStore.data !== null) {
//       setMentors(mentorStore.data);
//       setLoading(false);
//       return;
//     }

//     // Store se subscribe karo — jab data aaye toh update ho jayenge
//     const unsub = mentorStore.subscribe((data) => {
//       setMentors(data);
//       setLoading(false);
//     });

//     mentorStore.fetch().catch((err) => {
//       console.error("Mentor fetch failed:", err);
//       setError("Counsellors dose not available.");
//       setLoading(false);
//     });

//     return unsub;
//   }, []); // [] — sirf mount pe, koi dependency nahi

//   return { mentors, loading, error };
// }

// // ─── MentorCard ───────────────────────────────────────────────────────────────
// function MentorCard({ mentor, onBook, onDetail }) {
//   const name        = sanitizeText(mentor.name || mentor.fullName || "Unknown Counsellor", 80);
//   const designation = sanitizeText(mentor.designation || mentor.title || "Career Counsellor", 100);
//   const experience  = mentor.experience ?? mentor.years ?? 5;
//   const mentorKey   = String(mentor._id || mentor.id || name);
//   const fallback    = getFallbackRatingData(mentorKey, experience);
//   const rating      = mentor.rating ?? mentor.avgRating ?? fallback.rating;
//   const ratingCount = mentor.ratingCount ?? mentor.reviews ?? fallback.ratingCount;
//   const fee         = mentor.fee ?? mentor.price ?? 0;
//   const isFree      = fee === 0 || fee === "0" || fee === "Free";
//   const responseRate = sanitizeText(String(mentor.responseRate ?? mentor.response ?? "95%"), 10);
//   const skills      = mentor.skills || mentor.expertises || mentor.expertise || [];

//   const DEFAULT_PHONE  = sanitizePhone(process.env.NEXT_PUBLIC_DEFAULT_COUNSELLOR_PHONE || "9319998717");
//   const mobileNumber   = sanitizePhone(mentor.mobileNumber) || DEFAULT_PHONE;
//   const whatsappNumber = sanitizePhone(mentor.whatsappNumber) || mobileNumber;

//   const rawImage = mentor.image;
//   const imageSrc =
//     typeof rawImage === "string" &&
//     (rawImage.startsWith("http://") || rawImage.startsWith("https://") || rawImage.startsWith("/"))
//       ? rawImage
//       : FALLBACK_AVATAR;

//   return (
//     <article
//       className="relative bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-stretch shadow-sm hover:shadow-lg transition duration-300 group"
//       aria-label={`Counsellor: ${name}`}
//     >
//       <div
//         className="flex-1 flex gap-4 items-start cursor-pointer"
//         onClick={onDetail}
//         role="button"
//         tabIndex={0}
//         onKeyDown={(e) => e.key === "Enter" && onDetail()}
//       >
//         <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
//           <Image
//             src={imageSrc}
//             alt={`Photo of ${name}`}
//             fill
//             sizes="(max-width: 768px) 112px, 128px"
//             className="object-contain"
//             loading="lazy"
//             onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
//           />
//           {(mentor.isOnline || mentor.online === true) && (
//             <span className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" aria-label="Online" />
//           )}
//         </div>

//         <div className="flex-1 min-w-0">
//           <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition truncate">{name}</h3>
//               <p className="text-sm font-medium text-gray-600 truncate">{designation}</p>
//             </div>
//             <div className="inline-flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200 flex-shrink-0">
//               <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
//               <span className="text-sm font-bold text-yellow-800">{Number(rating).toFixed(1)}</span>
//               <span className="text-xs text-gray-500">({ratingCount})</span>
//             </div>
//           </div>

//           <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-full md:max-w-[60%] line-clamp-2">
//             {sanitizeText(mentor.description || `Expert guidance with ${experience} years of experience.`)}
//           </p>

//           <div className="mt-3 flex items-center gap-2 flex-wrap">
//             <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">🎯 Resp. {responseRate}</span>
//             <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">⭐ {experience} yrs Exp.</span>
//             {Array.isArray(skills) && skills.slice(0, 3).map((s) => (
//               <span key={s} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
//                 {sanitizeText(String(s), 30)}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>

//       <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-center md:items-end justify-start md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
//         <div className="text-center md:text-right w-full mb-2">
//           <div className="text-xs text-gray-500">Session Fee</div>
//           <div className="text-xl font-extrabold text-blue-800">{isFree ? "FREE" : `₹${fee}`}</div>
//         </div>
//         <button
//           onClick={(e) => { e.stopPropagation(); onBook(); }}
//           className="w-full py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
//         >
//           {isFree ? "Book Free" : "Book Now"}
//         </button>
//         <div className="flex w-full gap-2">
//           {mobileNumber && (
//             <a href={`tel:${mobileNumber}`} className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition" onClick={(e) => e.stopPropagation()} rel="noopener" aria-label={`Call ${name}`}>
//               <Phone className="w-4 h-4" aria-hidden="true" />
//             </a>
//           )}
//           {whatsappNumber && (
//             <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5A] transition" onClick={(e) => e.stopPropagation()} aria-label={`WhatsApp ${name}`}>
//               <MessageSquare className="w-4 h-4" aria-hidden="true" />
//             </a>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function MentorSkeleton() {
//   return (
//     <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse" aria-hidden="true">
//       <div className="w-32 h-32 rounded-xl bg-gray-200 flex-shrink-0" />
//       <div className="flex-1 space-y-3 py-1">
//         <div className="h-5 bg-gray-200 rounded w-1/3" />
//         <div className="h-4 bg-gray-200 rounded w-1/4" />
//         <div className="h-4 bg-gray-200 rounded w-2/3" />
//         <div className="flex gap-2">{[1,2,3].map((i) => <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />)}</div>
//       </div>
//     </div>
//   );
// }

// function FilterSelect({ id, label, value, onChange, options, allLabel }) {
//   return (
//     <div className="space-y-2">
//       <label htmlFor={id} className="text-xs font-bold text-gray-400 uppercase block">{label}</label>
//       <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 border rounded-md text-sm cursor-pointer">
//         <option value="">{allLabel}</option>
//         {options.map((o) => <option key={o} value={o}>{o}</option>)}
//       </select>
//     </div>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────
// export default function TeamListingPage() {
//   const { mentors, loading, error } = useMentors(); // singleton hook — API ek baar
//   const [query, setQuery]               = useState("");
//   const [selectedState, setSelectedState]   = useState("");
//   const [selectedLanguage, setSelectedLanguage] = useState("");
//   const [selectedSkill, setSelectedSkill]   = useState("");
//   const [sortBy, setSortBy]             = useState("experience-desc");
//   const [page, setPage]                 = useState(1);
//   const [openBookModal, setOpenBookModal] = useState(false);
//   const [selectedMentor, setSelectedMentor] = useState(null);
//   const router = useRouter();

//   const resetPage = useCallback(() => setPage(1), []);

//   const resetFilters = useCallback(() => {
//     setQuery(""); setSelectedState(""); setSelectedLanguage("");
//     setSelectedSkill(""); setSortBy("experience-desc"); setPage(1);
//   }, []);

//   const filterOptions = useMemo(() => {
//     const states = new Set(), languages = new Set(), skillsSet = new Set();
//     mentors.forEach((m) => {
//       const loc = m.state || m.location;
//       if (loc) states.add(loc.trim());
//       const lang = m.languages || m.language;
//       if (Array.isArray(lang)) lang.forEach((l) => languages.add(l.trim()));
//       else if (typeof lang === "string") lang.split(",").forEach((l) => languages.add(l.trim()));
//       const s = m.skills || m.expertises || m.expertise;
//       if (Array.isArray(s)) s.forEach((i) => skillsSet.add(i.trim()));
//       else if (typeof s === "string") s.split(",").forEach((i) => skillsSet.add(i.trim()));
//     });
//     return {
//       states:    Array.from(states).filter(Boolean).sort(),
//       languages: Array.from(languages).filter(Boolean).sort(),
//       skills:    Array.from(skillsSet).filter(Boolean).sort(),
//     };
//   }, [mentors]);

//   const filtered = useMemo(() => {
//     let list = [...mentors];
//     if (selectedState)
//       list = list.filter((m) => (m.state || m.location || "").toLowerCase().includes(selectedState.toLowerCase()));
//     if (selectedLanguage)
//       list = list.filter((m) => (m.languages || m.language || "").toString().toLowerCase().includes(selectedLanguage.toLowerCase()));
//     if (selectedSkill)
//       list = list.filter((m) => {
//         const s = m.skills || m.expertises || m.expertise || [];
//         const arr = Array.isArray(s) ? s : typeof s === "string" ? s.split(",").map((i) => i.trim()) : [];
//         return arr.some((item) => item.toLowerCase() === selectedSkill.toLowerCase());
//       });
//     if (query.trim()) {
//       const q = query.toLowerCase();
//       list = list.filter((m) =>
//         (m.name || "").toLowerCase().includes(q) ||
//         (m.designation || "").toLowerCase().includes(q)
//       );
//     }
//     list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
//     if (sortBy === "fee-low")  list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
//     if (sortBy === "fee-high") list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
//     return list;
//   }, [mentors, selectedState, selectedLanguage, selectedSkill, query, sortBy]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//   const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

//   return (
//     <div className="flex flex-col min-h-screen">
//       <Header />

//       <section
//         className="relative bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]  h-80 flex items-center justify-center text-center overflow-hidden cursor-pointer"
//         style={{ backgroundImage: "url('/images/counselor-banner-placeholder.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
//       >
//         <div className="absolute inset-0 bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]  backdrop-blur-sm" aria-hidden="true" />
//         <div className="relative z-10 p-4 max-w-4xl text-white">
//           <h1 className="text-4xl md:text-5xl font-extrabold uppercase">Meet Our Expert Career Counselors</h1>
//           <p className="mt-3 text-lg opacity-90">Find the right mentor to guide your future and book a personalised session today</p>
//         </div>
//       </section>

//       <div className="bg-gray-50 flex-grow py-10 px-4 md:px-8">
//         <div className="max-w-7xl mx-auto">

//           <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
//             <div className="w-full md:max-w-md relative">
//               <input
//                 className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 focus:ring-2 focus:ring-blue-500 shadow-sm"
//                 placeholder="Search by name or designation..."
//                 value={query}
//                 onChange={(e) => { setQuery(e.target.value); resetPage(); }}
//                 aria-label="Search counsellors"
//               />
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
//             </div>
//             <select
//               value={sortBy}
//               onChange={(e) => { setSortBy(e.target.value); resetPage(); }}
//               className="rounded-lg border-gray-200 px-3 py-2 bg-white text-sm shadow-sm cursor-pointer"
//               aria-label="Sort by"
//             >
//               <option value="experience-desc">Highest Experience</option>
//               <option value="fee-low">Fee – Low to High</option>
//               <option value="fee-high">Fee – High to Low</option>
//             </select>
//           </div>

//           <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
//             <aside className="hidden md:block md:col-span-3 sticky top-24 h-fit bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
//               <div className="flex items-center justify-between border-b pb-3">
//                 <h2 className="text-lg font-bold">Filters</h2>
//                 <button onClick={resetFilters} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:text-red-700">
//                   <RotateCcw className="w-3 h-3" aria-hidden="true" /> RESET
//                 </button>
//               </div>
//               <div className="space-y-5">
//                 <FilterSelect id="filter-location" label="Location" value={selectedState} onChange={(v) => { setSelectedState(v); resetPage(); }} options={filterOptions.states} allLabel="All Locations" />
//                 <FilterSelect id="filter-language" label="Language" value={selectedLanguage} onChange={(v) => { setSelectedLanguage(v); resetPage(); }} options={filterOptions.languages} allLabel="All Languages" />
//                 <FilterSelect id="filter-expertise" label="Expertise" value={selectedSkill} onChange={(v) => { setSelectedSkill(v); resetPage(); }} options={filterOptions.skills} allLabel="All Skills" />
//               </div>
//             </aside>

//             <main className="md:col-span-9 space-y-6" aria-live="polite">
//               {error && (
//                 <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
//               )}
//               {loading ? (
//                 <>{[1, 2, 3].map((i) => <MentorSkeleton key={i} />)}</>
//               ) : paged.length > 0 ? (
//                 <>
//                   <p className="text-sm text-gray-500">
//                     Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} counsellors
//                   </p>
//                   {paged.map((m) => (
//                     <MentorCard
//                       key={m._id || m.id}
//                       mentor={m}
//                       onBook={() => { setSelectedMentor(m); setOpenBookModal(true); }}
//                       // onDetail={() => router.push(`/teamexpand/${m._id || m.id}`)}
//                          onDetail={() => {
//      const mentorId = m._id || m.id;
//      if (mentorId) router.push(`/teamexpand/${mentorId}`);
//    }}
//                     />
//                   ))}
//                   {totalPages > 1 && (
//                     <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
//                       <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border bg-white rounded-lg disabled:opacity-40" aria-label="Previous page">
//                         <ChevronLeft className="w-5 h-5" />
//                       </button>
//                       {[...Array(totalPages)].map((_, i) => (
//                         <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? "page" : undefined}
//                           className={`w-10 h-10 rounded-lg text-sm font-bold ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>
//                           {i + 1}
//                         </button>
//                       ))}
//                       <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border bg-white rounded-lg disabled:opacity-40" aria-label="Next page">
//                         <ChevronRight className="w-5 h-5" />
//                       </button>
//                     </nav>
//                   )}
//                 </>
//               ) : (
//                 <div className="text-center py-20 bg-white rounded-2xl border text-gray-500">
//                   No counsellors found. Try adjusting your filters.
//                 </div>
//               )}
//             </main>
//           </div>
//         </div>
//       </div>

//       {openBookModal && selectedMentor && (
//         <Bookcounsler mentor={selectedMentor} onClose={() => setOpenBookModal(false)} />
//       )}
//       <Footer />
//     </div>
//   );
// }


"use client";

import Footer from "@/app/layout/Footer.jsx";
import { useState, useMemo, useCallback } from "react";
import api from "@/utlis/api.js";
import Image from "next/image";
import {
  Search,
  Star,
  Phone,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Bookcounsler from "../components/Bookcounsler.jsx";
import Header from "@/app/layout/Header.jsx";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = "/images/default-avatar.png";
const PAGE_SIZE = 6;

// ─── Security helpers ─────────────────────────────────────────────────────────
function sanitizePhone(raw) {
  if (typeof raw !== "string") return "";
  return raw.replace(/[^\d+]/g, "").slice(0, 15);
}

function sanitizeText(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").slice(0, maxLen);
}

// ─── Deterministic rating helper ──────────────────────────────────────────────
function hashStringToInt(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getFallbackRatingData(seedKey, experience = 5) {
  const hash = hashStringToInt(seedKey || "default");
  const exp = Number(experience) || 0;
  let minRating, maxRating;
  if (exp >= 10) {
    minRating = 4.6;
    maxRating = 5.0;
  } else if (exp >= 6) {
    minRating = 4.2;
    maxRating = 4.6;
  } else if (exp >= 3) {
    minRating = 3.6;
    maxRating = 4.2;
  } else {
    minRating = 3.0;
    maxRating = 3.6;
  }
  const range = Math.round((maxRating - minRating) * 10);
  const rating = (minRating + (hash % (range + 1)) * 0.1).toFixed(1);
  return { rating: Number(rating), ratingCount: 20 + (hash % 200) };
}

// ─── MentorCard ───────────────────────────────────────────────────────────────
function MentorCard({ mentor, onBook, onDetail }) {
  const name = sanitizeText(
    mentor.name || mentor.fullName || "Unknown Counsellor",
    80
  );
  const designation = sanitizeText(
    mentor.designation || mentor.title || "Career Counsellor",
    100
  );
  const experience = mentor.experience ?? mentor.years ?? 5;
  const mentorKey = String(mentor._id || mentor.id || name);
  const fallback = getFallbackRatingData(mentorKey, experience);
  const rating = mentor.rating ?? mentor.avgRating ?? fallback.rating;
  const ratingCount =
    mentor.ratingCount ?? mentor.reviews ?? fallback.ratingCount;
  const fee = mentor.fee ?? mentor.price ?? 0;
  const isFree = fee === 0 || fee === "0" || fee === "Free";
  const responseRate = sanitizeText(
    String(mentor.responseRate ?? mentor.response ?? "95%"),
    10
  );
  const skills = mentor.skills || mentor.expertises || mentor.expertise || [];

  const DEFAULT_PHONE = sanitizePhone(
    process.env.NEXT_PUBLIC_DEFAULT_COUNSELLOR_PHONE || "9319998717"
  );
  const mobileNumber = sanitizePhone(mentor.mobileNumber) || DEFAULT_PHONE;
  const whatsappNumber =
    sanitizePhone(mentor.whatsappNumber) || mobileNumber;

  const rawImage = mentor.image;
  const imageSrc =
    typeof rawImage === "string" &&
    (rawImage.startsWith("http://") ||
      rawImage.startsWith("https://") ||
      rawImage.startsWith("/"))
      ? rawImage
      : FALLBACK_AVATAR;

  return (
    <article
      className="relative bg-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row gap-4 md:gap-6 items-stretch shadow-sm hover:shadow-md transition duration-300 group"
      style={{ border: "1px solid var(--cv-neutral-border)" }}
      aria-label={`Counsellor: ${name}`}
    >
      <div
        className="flex-1 flex flex-col sm:flex-row gap-4 items-start cursor-pointer"
        onClick={onDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onDetail()}
      >
        <div
          className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden relative self-center sm:self-start"
          style={{
            border: "1px solid var(--cv-neutral-border)",
            background: "var(--cv-neutral-light)",
          }}
        >
          <Image
            src={imageSrc}
            alt={`Photo of ${name}`}
            fill
            sizes="(max-width: 640px) 96px, (max-width: 768px) 112px, 128px"
            className="object-contain"
            loading="lazy"
            onError={(e) => {
              e.currentTarget.src = FALLBACK_AVATAR;
            }}
          />
          {(mentor.isOnline || mentor.online === true) && (
            <span
              className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"
              aria-label="Online"
            />
          )}
        </div>

        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
            <div>
              <h3
                className="text-lg sm:text-xl font-bold transition truncate group-hover:text-[var(--cv-primary)]"
                style={{ color: "var(--cv-neutral-dark)" }}
              >
                {name}
              </h3>
              <p
                className="text-xs sm:text-sm font-medium truncate"
                style={{ color: "var(--cv-neutral-mid)" }}
              >
                {designation}
              </p>
            </div>
            <div
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full flex-shrink-0 self-start sm:self-auto"
              style={{
                background: "var(--cv-accent-light)",
                border: "1px solid var(--cv-accent)",
              }}
            >
              <Star
                className="w-3.5 h-3.5"
                style={{ color: "var(--cv-accent)", fill: "var(--cv-accent)" }}
                aria-hidden="true"
              />
              <span
                className="text-xs sm:text-sm font-bold"
                style={{ color: "var(--cv-accent-dark)" }}
              >
                {Number(rating).toFixed(1)}
              </span>
              <span className="text-xs" style={{ color: "var(--cv-neutral-mid)" }}>
                ({ratingCount})
              </span>
            </div>
          </div>

          <p
            className="mt-2 text-xs sm:text-sm leading-relaxed max-w-full md:max-w-[85%] line-clamp-2"
            style={{ color: "var(--cv-neutral-mid)" }}
          >
            {sanitizeText(
              mentor.description ||
                `Expert guidance with ${experience} years of experience.`
            )}
          </p>

          <div className="mt-3 flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span
              className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "var(--cv-accent-light)",
                color: "var(--cv-accent-dark)",
              }}
            >
              🎯 Resp. {responseRate}
            </span>
            <span
              className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium"
              style={{
                background: "var(--cv-primary-light)",
                color: "var(--cv-primary)",
              }}
            >
              ⭐ {experience} yrs Exp.
            </span>
            {Array.isArray(skills) &&
              skills.slice(0, 3).map((s) => (
                <span
                  key={s}
                  className="text-[11px] sm:text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "var(--cv-neutral-light)",
                    color: "var(--cv-neutral-dark)",
                  }}
                >
                  {sanitizeText(String(s), 30)}
                </span>
              ))}
          </div>
        </div>
      </div>

      <div
        className="w-full md:w-44 flex-shrink-0 flex flex-row md:flex-col items-center justify-between md:justify-end gap-2 pt-3 md:pt-0 md:pl-4 border-t md:border-t-0 md:border-l"
        style={{ borderColor: "var(--cv-neutral-border)" }}
      >
        <div className="text-left md:text-right w-auto md:w-full">
          <div className="text-[11px] sm:text-xs" style={{ color: "var(--cv-neutral-mid)" }}>
            Session Fee
          </div>
          <div
            className="text-lg sm:text-xl font-extrabold"
            style={{ color: "var(--cv-primary)" }}
          >
            {isFree ? "FREE" : `₹${fee}`}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row md:flex-col gap-2 w-full max-w-[240px] md:max-w-none">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onBook();
            }}
            className="w-full py-2 px-3 rounded-lg text-xs sm:text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
            style={{
              background: "var(--cv-grad-cta)",
              boxShadow: "0 4px 12px rgba(193, 83, 4, 0.2)",
            }}
          >
            {isFree ? "Book Session" : "Book Now"}
          </button>

          <div className="flex w-full gap-2">
            {mobileNumber && (
              <a
                href={`tel:${mobileNumber}`}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-white transition hover:opacity-90 shadow-sm active:scale-95"
                style={{ background: "#2563eb" }}
                onClick={(e) => e.stopPropagation()}
                rel="noopener noreferrer"
                aria-label={`Call ${name}`}
              >
                <Phone className="w-3.5 h-3.5 fill-current" aria-hidden="true" />
                <span>Call</span>
              </a>
            )}
            {whatsappNumber && (
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-lg text-xs font-semibold text-white transition hover:opacity-90 shadow-sm active:scale-95"
                style={{ background: "#25D366" }}
                onClick={(e) => e.stopPropagation()}
                aria-label={`WhatsApp ${name}`}
              >
                <svg
                  className="w-3.5 h-3.5 fill-current"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984a9.96 9.96 0 001.333 4.993L2 22l5.233-1.237a9.962 9.962 0 004.779 1.221h.005c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.04-5.176-2.928-7.063A9.919 9.919 0 0012.012 2zm0 18.232h-.004a8.27 8.27 0 01-4.218-1.157l-.302-.18-3.13.74.836-3.048-.198-.315a8.272 8.272 0 01-1.267-4.301c.002-4.568 3.719-8.283 8.288-8.283 2.214 0 4.295.862 5.86 2.43 1.564 1.567 2.424 3.65 2.423 5.864 0 4.569-3.718 8.285-8.288 8.285zm4.542-6.205c-.249-.125-1.472-.726-1.7-.809-.228-.083-.394-.125-.56.125-.166.249-.643.809-.788.975-.145.166-.29.187-.539.062a6.8 6.8 0 01-2.001-1.233 7.49 7.49 0 01-1.385-1.726c-.145-.249-.015-.384.11-.508.112-.111.249-.29.373-.435a1.68 1.68 0 00.249-.415.458.458 0 00-.021-.436c-.062-.125-.56-1.349-.768-1.847-.202-.486-.407-.42-.56-.428l-.477-.008c-.166 0-.436.062-.664.311s-.871.851-.871 2.076c0 1.225.892 2.408 1.017 2.574.125.166 1.756 2.681 4.254 3.76.594.257 1.058.41 1.42.525.596.19 1.138.163 1.567.099.479-.071 1.472-.602 1.679-1.184.207-.581.207-1.079.145-1.183-.062-.104-.228-.187-.477-.312z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MentorSkeleton() {
  return (
    <div
      className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row gap-4 animate-pulse"
      style={{ border: "1px solid var(--cv-neutral-border)" }}
      aria-hidden="true"
    >
      <div
        className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl flex-shrink-0 self-center sm:self-start"
        style={{ background: "var(--cv-neutral-light)" }}
      />
      <div className="flex-1 space-y-3 py-1">
        <div
          className="h-5 rounded w-1/3"
          style={{ background: "var(--cv-neutral-light)" }}
        />
        <div
          className="h-4 rounded w-1/4"
          style={{ background: "var(--cv-neutral-light)" }}
        />
        <div
          className="h-4 rounded w-2/3"
          style={{ background: "var(--cv-neutral-light)" }}
        />
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-6 w-20 rounded-full"
              style={{ background: "var(--cv-neutral-light)" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function FilterSelect({ id, label, value, onChange, options, allLabel }) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-[11px] sm:text-xs font-bold uppercase block"
        style={{ color: "var(--cv-neutral-mid)" }}
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-2 rounded-md text-xs sm:text-sm cursor-pointer outline-none transition"
        style={{
          border: "1px solid var(--cv-neutral-border)",
          color: "var(--cv-neutral-dark)",
          background: "#fff",
        }}
      >
        <option value="">{allLabel}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TeamExpandContent() {
  const {
    data: mentors = [],
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["team-mentors"],
    queryFn: async () => {
      const res = await api.get("/api/v1/team");
      const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
      return list;
    },
    staleTime: 5 * 60 * 1000,
  });

  const [query, setQuery] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [sortBy, setSortBy] = useState("experience-desc");
  const [page, setPage] = useState(1);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const router = useRouter();

  const resetPage = useCallback(() => setPage(1), []);

  const resetFilters = useCallback(() => {
    setQuery("");
    setSelectedState("");
    setSelectedLanguage("");
    setSelectedSkill("");
    setSelectedSpecialization("");
    setSortBy("experience-desc");
    setPage(1);
  }, []);

  const filterOptions = useMemo(() => {
    const states = new Set(),
      languages = new Set(),
      skillsSet = new Set(),
      specializationsSet = new Set();

    mentors.forEach((m) => {
      const loc = m.state || m.location;
      if (loc) states.add(loc.trim());

      const lang = m.languages || m.language;
      if (Array.isArray(lang))
        lang.forEach((l) => languages.add(l.trim()));
      else if (typeof lang === "string")
        lang.split(",").forEach((l) => languages.add(l.trim()));

      const s = m.skills || m.expertises || m.expertise;
      if (Array.isArray(s))
        s.forEach((i) => skillsSet.add(i.trim()));
      else if (typeof s === "string")
        s.split(",").forEach((i) => skillsSet.add(i.trim()));

      const spec = m.specialization || m.specializations || m.category;
      if (Array.isArray(spec))
        spec.forEach((sp) => specializationsSet.add(sp.trim()));
      else if (typeof spec === "string")
        spec.split(",").forEach((sp) => specializationsSet.add(sp.trim()));
    });

    return {
      states: Array.from(states).filter(Boolean).sort(),
      languages: Array.from(languages).filter(Boolean).sort(),
      skills: Array.from(skillsSet).filter(Boolean).sort(),
      specializations: Array.from(specializationsSet).filter(Boolean).sort(),
    };
  }, [mentors]);

  const filtered = useMemo(() => {
    let list = [...mentors];
    if (selectedState)
      list = list.filter((m) =>
        (m.state || m.location || "")
          .toLowerCase()
          .includes(selectedState.toLowerCase())
      );
    if (selectedLanguage)
      list = list.filter((m) =>
        (m.languages || m.language || "")
          .toString()
          .toLowerCase()
          .includes(selectedLanguage.toLowerCase())
      );
    if (selectedSkill)
      list = list.filter((m) => {
        const s = m.skills || m.expertises || m.expertise || [];
        const arr = Array.isArray(s)
          ? s
          : typeof s === "string"
          ? s.split(",").map((i) => i.trim())
          : [];
        return arr.some(
          (item) => item.toLowerCase() === selectedSkill.toLowerCase()
        );
      });
    if (selectedSpecialization)
      list = list.filter((m) => {
        const sp = m.specialization || m.specializations || m.category || [];
        const arr = Array.isArray(sp)
          ? sp
          : typeof sp === "string"
          ? sp.split(",").map((i) => i.trim())
          : [];
        return arr.some(
          (item) => item.toLowerCase() === selectedSpecialization.toLowerCase()
        );
      });
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (m) =>
          (m.name || "").toLowerCase().includes(q) ||
          (m.designation || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    if (sortBy === "fee-low")
      list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
    if (sortBy === "fee-high")
      list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
    return list;
  }, [
    mentors,
    selectedState,
    selectedLanguage,
    selectedSkill,
    selectedSpecialization,
    query,
    sortBy,
  ]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* ═══════════ HERO ═══════════ */}
     <section
  className="relative py-12 md:py-20 flex items-center justify-center text-center overflow-hidden px-4"
  style={{
    background:
      "radial-gradient(circle at 85% 15%, rgba(240,138,60,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(143,166,180,0.25) 0%, transparent 50%), linear-gradient(135deg, #3d4c56 0%, #26323a 100%)",
  }}
>
  {/* subtle dot pattern */}
  <div
    className="absolute inset-0 opacity-[0.07] pointer-events-none"
    style={{
      backgroundImage: "radial-gradient(#fff 1px, transparent 1px)",
      backgroundSize: "22px 22px",
    }}
    aria-hidden="true"
  />

  <div className="relative z-10 max-w-4xl">
  <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold uppercase tracking-wide"
      style={{ color: "#ffffff" }}>
    Meet Our Expert Career Counselors
  </h1>

  <div
    className="mx-auto mt-3 h-1 w-16 rounded-full"
    style={{ background: "var(--cv-accent)" }}
    aria-hidden="true"
  />

  <p className="mt-3 sm:mt-4 text-sm sm:text-lg max-w-2xl mx-auto"
     style={{ color: "#ffffff" }}>
    Find the right mentor to guide your future and book a personalised session today
  </p>
</div>
</section>

      {/* ═══════════ BODY ═══════════ */}
      <div
        className="flex-grow py-6 sm:py-10 px-3 sm:px-6 md:px-8"
        style={{ background: "var(--cv-neutral-light)" }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Top Bar - Search, Sort & Mobile Filter Toggle */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-center justify-between mb-6">
            <div className="w-full sm:max-w-md relative">
              <input
                className="w-full rounded-xl px-4 py-2.5 sm:py-3 pl-10 sm:pl-11 text-xs sm:text-sm shadow-sm outline-none transition"
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                  background: "#fff",
                }}
                placeholder="Search by name or designation..."
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  resetPage();
                }}
                aria-label="Search counsellors"
              />
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
                style={{ color: "var(--cv-neutral-mid)" }}
                aria-hidden="true"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Mobile Filter Toggle Button */}
              <button
                onClick={() => setShowMobileFilter(!showMobileFilter)}
                className="md:hidden flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2.5 bg-white border rounded-lg text-xs font-bold"
                style={{ borderColor: "var(--cv-neutral-border)", color: "var(--cv-neutral-dark)" }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters</span>
              </button>

              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  resetPage();
                }}
                className="flex-1 sm:flex-none rounded-lg px-3 py-2.5 sm:py-2 text-xs sm:text-sm shadow-sm cursor-pointer outline-none bg-white"
                style={{
                  border: "1px solid var(--cv-neutral-border)",
                  color: "var(--cv-neutral-dark)",
                }}
                aria-label="Sort by"
              >
                <option value="experience-desc">Highest Experience</option>
                <option value="fee-low">Fee – Low to High</option>
                <option value="fee-high">Fee – High to Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
            {/* DESKTOP SIDEBAR */}
            <aside
              className="hidden md:block md:col-span-4 lg:col-span-3 sticky top-24 h-fit bg-white rounded-2xl p-5 shadow-sm space-y-5"
              style={{ border: "1px solid var(--cv-neutral-border)" }}
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
                  className="text-xs font-bold flex items-center gap-1 transition hover:opacity-80"
                  style={{ color: "var(--cv-accent)" }}
                >
                  <RotateCcw className="w-3 h-3" aria-hidden="true" />
                  RESET
                </button>
              </div>
              <div className="space-y-4">
                <FilterSelect
                  id="filter-specialization"
                  label="Specialization"
                  value={selectedSpecialization}
                  onChange={(v) => {
                    setSelectedSpecialization(v);
                    resetPage();
                  }}
                  options={filterOptions.specializations}
                  allLabel="All Specializations"
                />
                <FilterSelect
                  id="filter-location"
                  label="Location"
                  value={selectedState}
                  onChange={(v) => {
                    setSelectedState(v);
                    resetPage();
                  }}
                  options={filterOptions.states}
                  allLabel="All Locations"
                />
                <FilterSelect
                  id="filter-language"
                  label="Language"
                  value={selectedLanguage}
                  onChange={(v) => {
                    setSelectedLanguage(v);
                    resetPage();
                  }}
                  options={filterOptions.languages}
                  allLabel="All Languages"
                />
                <FilterSelect
                  id="filter-expertise"
                  label="Expertise"
                  value={selectedSkill}
                  onChange={(v) => {
                    setSelectedSkill(v);
                    resetPage();
                  }}
                  options={filterOptions.skills}
                  allLabel="All Skills"
                />
              </div>
            </aside>

            {/* MOBILE FILTER MODAL / SLIDE-DOWN */}
            {showMobileFilter && (
              <div className="md:hidden fixed inset-0 z-50 bg-black/50 flex justify-end">
                <div className="bg-white w-full max-w-xs h-full p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b">
                      <h2 className="text-base font-bold">Filters</h2>
                      <button onClick={() => setShowMobileFilter(false)}>
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <div className="space-y-4 mt-4">
                      <FilterSelect
                        id="m-filter-specialization"
                        label="Specialization"
                        value={selectedSpecialization}
                        onChange={(v) => {
                          setSelectedSpecialization(v);
                          resetPage();
                        }}
                        options={filterOptions.specializations}
                        allLabel="All Specializations"
                      />
                      <FilterSelect
                        id="m-filter-location"
                        label="Location"
                        value={selectedState}
                        onChange={(v) => {
                          setSelectedState(v);
                          resetPage();
                        }}
                        options={filterOptions.states}
                        allLabel="All Locations"
                      />
                      <FilterSelect
                        id="m-filter-language"
                        label="Language"
                        value={selectedLanguage}
                        onChange={(v) => {
                          setSelectedLanguage(v);
                          resetPage();
                        }}
                        options={filterOptions.languages}
                        allLabel="All Languages"
                      />
                      <FilterSelect
                        id="m-filter-expertise"
                        label="Expertise"
                        value={selectedSkill}
                        onChange={(v) => {
                          setSelectedSkill(v);
                          resetPage();
                        }}
                        options={filterOptions.skills}
                        allLabel="All Skills"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t flex gap-2">
                    <button
                      onClick={resetFilters}
                      className="flex-1 py-2 text-xs font-bold border rounded-lg"
                    >
                      Reset All
                    </button>
                    <button
                      onClick={() => setShowMobileFilter(false)}
                      className="flex-1 py-2 text-xs font-bold text-white rounded-lg"
                      style={{ background: "var(--cv-grad-cta)" }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* MAIN LIST */}
            <main className="md:col-span-8 lg:col-span-9 space-y-4 sm:space-y-6" aria-live="polite">
              {error && (
                <div
                  role="alert"
                  className="p-4 rounded-xl text-xs sm:text-sm"
                  style={{
                    background: "var(--cv-accent-light)",
                    border: "1px solid var(--cv-accent)",
                    color: "var(--cv-accent-dark)",
                  }}
                >
                  Counsellors not available. Please try again.
                </div>
              )}
              {loading ? (
                <>
                  {[1, 2, 3].map((i) => (
                    <MentorSkeleton key={i} />
                  ))}
                </>
              ) : paged.length > 0 ? (
                <>
                  <p
                    className="text-xs sm:text-sm"
                    style={{ color: "var(--cv-neutral-mid)" }}
                  >
                    Showing {(page - 1) * PAGE_SIZE + 1}–
                    {Math.min(page * PAGE_SIZE, filtered.length)} of{" "}
                    {filtered.length} counsellors
                  </p>

                  {paged.map((m) => (
                    <MentorCard
                      key={m._id || m.id}
                      mentor={m}
                      onBook={() => {
                        setSelectedMentor(m);
                        setOpenBookModal(true);
                      }}
                      onDetail={() => {
                        const mentorId = m._id || m.id;
                        if (mentorId)
                          router.push(`/our-Team/${mentorId}`);
                      }}
                    />
                  ))}

                  {/* Responsive Pagination */}
                  {totalPages > 1 && (
                    <nav
                      className="mt-8 sm:mt-12 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 bg-white rounded-lg disabled:opacity-40 transition"
                        style={{ border: "1px solid var(--cv-neutral-border)" }}
                        aria-label="Previous page"
                      >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                      {[...Array(totalPages)].map((_, i) => {
                        const isActive = page === i + 1;
                        return (
                          <button
                            key={i}
                            onClick={() => setPage(i + 1)}
                            aria-current={isActive ? "page" : undefined}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-bold transition"
                            style={{
                              background: isActive
                                ? "var(--cv-grad-cta)"
                                : "#fff",
                              color: isActive
                                ? "#fff"
                                : "var(--cv-neutral-dark)",
                              border: isActive
                                ? "none"
                                : "1px solid var(--cv-neutral-border)",
                            }}
                          >
                            {i + 1}
                          </button>
                        );
                      })}
                      <button
                        onClick={() =>
                          setPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={page === totalPages}
                        className="p-2 bg-white rounded-lg disabled:opacity-40 transition"
                        style={{ border: "1px solid var(--cv-neutral-border)" }}
                        aria-label="Next page"
                      >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div
                  className="text-center py-12 sm:py-20 bg-white rounded-2xl text-xs sm:text-sm"
                  style={{
                    border: "1px solid var(--cv-neutral-border)",
                    color: "var(--cv-neutral-mid)",
                  }}
                >
                  No counsellors found. Try adjusting your filters.
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {openBookModal && selectedMentor && (
        <Bookcounsler
          mentor={selectedMentor}
          onClose={() => setOpenBookModal(false)}
        />
      )}
      <Footer />
    </div>
  );
}