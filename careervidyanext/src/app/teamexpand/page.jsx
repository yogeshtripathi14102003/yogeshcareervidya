

// "use client";
// import Footer from "@/app/layout/Footer.jsx";
// import { useEffect, useMemo, useState } from "react";
// import api from "@/utlis/api.js"; 
// import { ChevronDown, Search, User, Star, Phone, MessageSquare, ChevronLeft, ChevronRight, RotateCcw } from "lucide-react";
// import Bookcounsler from "../components/Bookcounsler.jsx"; 
// import Header from "@/app/layout/Header.jsx";
// import { useRouter } from "next/navigation"; 

// const FALLBACK_AVATAR = "/images/default-avatar.png"; 
// const PAGE_SIZE = 6;

// // Global Cache taaki loading baar-baar na dikhe
// let cachedMentors = null;

// // Deterministic hash so the same mentor always gets the same fallback rating
// // (no Math.random() here — that would change on every re-render/page change)
// function hashStringToInt(str) {
//     let hash = 0;
//     for (let i = 0; i < str.length; i++) {
//         hash = (hash << 5) - hash + str.charCodeAt(i);
//         hash |= 0; // force 32-bit int
//     }
//     return Math.abs(hash);
// }

// // Fallback rating now scales with experience: less experience → lower rating (min ~3.0),
// // more experience → higher rating (max 5.0). Still deterministic per mentor (hash-based),
// // so the same mentor always shows the same number — no flicker on re-render.
// function getFallbackRatingData(seedKey, experience = 5) {
//     const hash = hashStringToInt(seedKey || "default");
//     const exp = Number(experience) || 0;

//     let minRating, maxRating;
//     if (exp >= 10) { minRating = 4.6; maxRating = 5.0; }
//     else if (exp >= 6) { minRating = 4.2; maxRating = 4.6; }
//     else if (exp >= 3) { minRating = 3.6; maxRating = 4.2; }
//     else { minRating = 3.0; maxRating = 3.6; }

//     const range = Math.round((maxRating - minRating) * 10); // e.g. 4 steps of 0.1
//     const rating = (minRating + (hash % (range + 1)) * 0.1).toFixed(1);

//     const ratingCount = 20 + (hash % 200); // 20 - 219
//     return { rating: Number(rating), ratingCount };
// }

// function MentorCard({ mentor, onBook, onDetail }) {
//     const image = mentor.image && typeof mentor.image === "string" && (mentor.image.startsWith("http") || mentor.image.startsWith("/")) 
//         ? mentor.image 
//         : FALLBACK_AVATAR;
//     const name = mentor.name || mentor.fullName || "Unknown Counsellor";
//     const designation = mentor.designation || mentor.title || "Career Counsellor";

//     const experience = mentor.experience ?? mentor.years ?? 5;
//     const mentorKey = String(mentor._id || mentor.id || name);
//     const fallback = getFallbackRatingData(mentorKey, experience);
//     const rating = mentor.rating ?? mentor.avgRating ?? fallback.rating;
//     const ratingCount = mentor.ratingCount ?? mentor.reviews ?? fallback.ratingCount;
//     const fee = mentor.fee ?? mentor.price ?? 0;
//     const isFree = (fee === 0 || fee === '0' || fee === 'Free');
//     const responseRate = mentor.responseRate ?? mentor.response ?? "95%";
//     const skills = mentor.skills || mentor.expertises || mentor.expertise || [];
//     const mobileNumber = mentor.mobileNumber || "9319998717"; 
//     const whatsappNumber = mentor.whatsappNumber || mobileNumber; 

//     return (
//         <div className="relative bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-stretch shadow-sm hover:shadow-lg transition duration-300 group">
//             <div className="flex-1 flex gap-4 items-start cursor-pointer" onClick={onDetail}>
//                 <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
//                     <img src={image} alt={name} className="w-full h-full object-contain" loading="lazy" />
//                     {(mentor.isOnline || mentor.online === true) && (
//                         <div className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
//                     )}
//                 </div>
                
//                 <div className="flex-1 min-w-0">
//                     <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
//                         <div>
//                             <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition truncate">{name}</h3>
//                             <p className="text-sm font-medium text-gray-600 truncate">{designation}</p>
//                         </div>
//                         <div className="flex-shrink-0">
//                             <div className="inline-flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
//                                 <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
//                                 <span className="text-sm font-bold text-yellow-800">{Number(rating).toFixed(1)}</span>
//                                 <span className="text-xs text-gray-500">({ratingCount})</span>
//                             </div>
//                         </div>
//                     </div>

//                     <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-full md:max-w-[60%] line-clamp-2">
//                         {mentor.description || `Expert guidance with ${experience} years of experience.`}
//                     </p>

//                     <div className="mt-3 flex items-center gap-2 flex-wrap">
//                         <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">🎯 Resp. {responseRate}</div>
//                         <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">⭐ {experience} yrs Exp.</div>
//                         {Array.isArray(skills) && skills.slice(0, 3).map((s) => (
//                             <div key={s} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">{s}</div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
            
//             <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-center md:items-end justify-start md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
//                 <div className="text-center md:text-right w-full mb-2">
//                     <div className="text-xs text-gray-500">Session Fee</div>
//                     <div className="text-xl font-extrabold text-blue-800">{isFree ? "FREE" : `₹${fee}`}</div>
//                 </div>
//                 <button onClick={(e) => { e.stopPropagation(); onBook(); }} className="w-full py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700">
//                     {isFree ? "Book Free" : "Book Now"}
//                 </button>
//                 <div className="flex w-full gap-2">
//                     <a href={`tel:${mobileNumber}`} className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-100" onClick={(e) => e.stopPropagation()}><Phone className="w-4 h-4"/></a>
//                     <a href={`https://wa.me/${whatsappNumber}`} target="_blank" className="flex-1 flex items-center justify-center p-2 rounded-lg bg-[#25D366] text-white" onClick={(e) => e.stopPropagation()}><MessageSquare className="w-4 h-4"/></a>
//                 </div>
//             </div>
//         </div>
//     );
// }

// export default function TeamListingPage() {
//     const [mentors, setMentors] = useState(cachedMentors || []);
//     const [loading, setLoading] = useState(!cachedMentors);
//     const [query, setQuery] = useState("");
//     const [selectedState, setSelectedState] = useState("");
//     const [selectedLanguage, setSelectedLanguage] = useState("");
//     const [selectedSkill, setSelectedSkill] = useState("");
//     const [onlineOnly, setOnlineOnly] = useState(false);
//     const [sortBy, setSortBy] = useState("experience-desc");
//     const [page, setPage] = useState(1);
//     const [openBookModal, setOpenBookModal] = useState(false);
//     const [selectedMentor, setSelectedMentor] = useState(null);
//     const router = useRouter(); 

//     const resetFilters = () => {
//         setQuery(""); setSelectedState(""); setSelectedLanguage(""); setSelectedSkill(""); 
//         setOnlineOnly(false); setSortBy("experience-desc"); setPage(1);
//     };

//     useEffect(() => {
//         let mounted = true;
//         const fetchMentors = async () => {
//             if (!cachedMentors) setLoading(true);
//             try {
//                 const res = await api.get("/api/v1/team"); 
//                 const data = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
//                 if (mounted) {
//                     setMentors(data);
//                     cachedMentors = data;
//                 }
//             } catch (err) { console.error(err); } 
//             finally { if (mounted) setLoading(false); }
//         };
//         fetchMentors();
//         return () => { mounted = false; };
//     }, []);

//     // FIXED: Ab options repeat nahi honge (Using Set)
//     const filterOptions = useMemo(() => {
//         const states = new Set();
//         const languages = new Set();
//         const skillsSet = new Set();

//         mentors.forEach(m => {
//             // Location/State
//             const loc = m.state || m.location;
//             if (loc) states.add(loc.trim());

//             // Languages (Handling string or array)
//             const lang = m.languages || m.language;
//             if (Array.isArray(lang)) {
//                 lang.forEach(l => languages.add(l.trim()));
//             } else if (typeof lang === 'string') {
//                 lang.split(',').forEach(l => languages.add(l.trim()));
//             }

//             // Expertise/Skills (Handling string or array)
//             const s = m.skills || m.expertises || m.expertise;
//             if (Array.isArray(s)) {
//                 s.forEach(item => skillsSet.add(item.trim()));
//             } else if (typeof s === 'string') {
//                 s.split(',').forEach(item => skillsSet.add(item.trim()));
//             }
//         });

//         return { 
//             states: Array.from(states).filter(Boolean).sort(), 
//             languages: Array.from(languages).filter(Boolean).sort(), 
//             skills: Array.from(skillsSet).filter(Boolean).sort() 
//         };
//     }, [mentors]);

//     const filtered = useMemo(() => {
//         let list = [...mentors];
//         if (onlineOnly) list = list.filter(m => m.isOnline || m.online);
//         if (selectedState) list = list.filter(m => (m.state || m.location || "").toLowerCase().includes(selectedState.toLowerCase()));
//         if (selectedLanguage) list = list.filter(m => (m.languages || m.language || "").toString().toLowerCase().includes(selectedLanguage.toLowerCase()));
//         if (selectedSkill) {
//             list = list.filter(m => {
//                 const s = m.skills || m.expertises || m.expertise || [];
//                 const skillList = Array.isArray(s) ? s : (typeof s === 'string' ? s.split(',').map(i => i.trim()) : []);
//                 return skillList.some(item => item.toLowerCase() === selectedSkill.toLowerCase());
//             });
//         }
//         if (query.trim()) {
//             const q = query.toLowerCase();
//             list = list.filter(m => (m.name || "").toLowerCase().includes(q) || (m.designation || "").toLowerCase().includes(q));
//         }

//         // Default Sort: Experience High to Low
//         list.sort((a, b) => (b.experience || 0) - (a.experience || 0));

//         if (sortBy === "fee-low") list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
//         else if (sortBy === "fee-high") list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
        
//         return list;
//     }, [mentors, onlineOnly, selectedState, selectedLanguage, selectedSkill, query, sortBy]);

//     const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
//     const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

//     return (
//         <div className="flex flex-col min-h-screen">
//             <Header />
//             <div className=" cursor-pointer    relative bg-blue-700 h-80 flex items-center justify-center text-center overflow-hidden" style={{ backgroundImage: `url('/images/counselor-banner-placeholder.jpg')`, backgroundSize: 'cover' }}>
//                 <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
//                 <div className="relative z-10 p-4 max-w-4xl text-white">
//                     <h1 className="text-4xl md:text-5xl font-extrabold uppercase">Meet Our Expert Career Counselors</h1>
//                     <p className="mt-3 text-lg opacity-90">Find the right mentor to guide your future and book a personalized session today</p>
//                 </div>
//             </div>

//             <div className="bg-gray-50 flex-grow py-10 px-4 md:px-8">
//                 <div className="max-w-7xl mx-auto">
//                     <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
//                         <div className="w-full md:max-w-md relative">
//                             <input className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 focus:ring-2 focus:ring-blue-500 shadow-sm" placeholder="Search..." value={query} onChange={(e)=>setQuery(e.target.value)} />
//                             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
//                         </div>
//                         <select value={sortBy} onChange={(e)=>setSortBy(e.target.value)} className="rounded-lg border-gray-200 px-3 py-2 bg-white text-sm shadow-sm   cursor-pointer  ">
//                             <option value="experience-desc">Highest Experience</option>
//                             <option value="fee-low">Fee - Low to High</option>
//                             <option value="fee-high">Fee - High to Low</option>
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-1 md:grid-cols-12 gap-8 cursor-pointer ">
//                        <aside className="  cursor-pointer  hidden md:block md:col-span-3 sticky top-24 h-fit bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
//                             <div className="flex items-center justify-between border-b pb-3">
//                                 <h3 className="text-lg font-bold">Filters</h3>
//                                 <button onClick={resetFilters} className="text-xs text-red-500 font-bold flex items-center gap-1"><RotateCcw className="w-3 h-3" /> RESET</button>
//                             </div>
//                             <div className="space-y-5">
//                                 {/* <div className="flex items-center gap-2">
//                                     <input type="checkbox" id="online" checked={onlineOnly} onChange={(e)=>setOnlineOnly(e.target.checked)} />
//                                     <label htmlFor="online" className="text-sm font-medium">Online Only</label>
//                                 </div> */}
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-gray-400 uppercase">Location</label>
//                                     <select value={selectedState} onChange={(e)=>setSelectedState(e.target.value)} className="w-full p-2 border rounded-md text-sm">
//                                         <option value="">All Locations</option>
//                                         {filterOptions.states.map(s => <option key={s} value={s}>{s}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-gray-400 uppercase">Language</label>
//                                     <select value={selectedLanguage} onChange={(e)=>setSelectedLanguage(e.target.value)} className="w-full p-2 border rounded-md text-sm">
//                                         <option value="">All Languages</option>
//                                         {filterOptions.languages.map(l => <option key={l} value={l}>{l}</option>)}
//                                     </select>
//                                 </div>
//                                 <div className="space-y-2">
//                                     <label className="text-xs font-bold text-gray-400 uppercase">Expertise</label>
//                                     <select value={selectedSkill} onChange={(e)=>setSelectedSkill(e.target.value)} className="w-full p-2 border rounded-md text-sm">
//                                         <option value="">All Skills</option>
//                                         {filterOptions.skills.map(sk => <option key={sk} value={sk}>{sk}</option>)}
//                                     </select>
//                                 </div>
//                             </div>
//                         </aside>

//                         <main className="md:col-span-9 space-y-6">
//                             {loading && !mentors.length ? ( 
//                                 <div className="text-center py-20 font-medium">Loading...</div> 
//                             ) : paged.length > 0 ? (
//                                 <>
//                                     {paged.map((m) => (
//                                         <MentorCard key={m._id || m.id} mentor={m} onBook={() => {setSelectedMentor(m); setOpenBookModal(true);}} onDetail={() => router.push(`/teamexpand/${m._id || m.id}`)} />
//                                     ))}
//                                     <div className="mt-12 flex items-center justify-center gap-2">
//                                         <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border bg-white rounded-lg disabled:opacity-50"><ChevronLeft className="w-5 h-5"/></button>
//                                         {[...Array(totalPages)].map((_, i) => (
//                                             <button key={i} onClick={() => setPage(i + 1)} className={`w-10 h-10 rounded-lg text-sm font-bold ${page === i + 1 ? 'bg-blue-600 text-white' : 'bg-white border text-gray-600'}`}>{i + 1}</button>
//                                         ))}
//                                         <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border bg-white rounded-lg disabled:opacity-50"><ChevronRight className="w-5 h-5"/></button>
//                                     </div>
//                                 </>
//                             ) : (
//                                 <div className="text-center py-20 bg-white rounded-2xl border text-gray-500">No results found.</div>
//                             )}
//                         </main>
//                     </div>
//                 </div>
//             </div>
//             {openBookModal && selectedMentor && <Bookcounsler mentor={selectedMentor} onClose={()=>setOpenBookModal(false)} />}
//             <Footer />
//         </div>
//     );
// }

"use client";
import Footer from "@/app/layout/Footer.jsx";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import api from "@/utlis/api.js";
import Image from "next/image";
import {
  Search, Star, Phone, MessageSquare,
  ChevronLeft, ChevronRight, RotateCcw,
} from "lucide-react";
import Bookcounsler from "../components/Bookcounsler.jsx";
import Header from "@/app/layout/Header.jsx";
import { useRouter } from "next/navigation";

// ─── Constants ────────────────────────────────────────────────────────────────
const FALLBACK_AVATAR = "/images/default-avatar.png";
const PAGE_SIZE = 6;

// ─── Global singleton store ───────────────────────────────────────────────────
// Module-level object — survives re-renders, tab switches, filter changes.
// API sirf tab call hogi jab data null ho (pehli baar).
// Baar baar page kholne pe bhi yahi data use hoga jab tak tab reload na ho.
const mentorStore = {
  data: null,          // fetched mentors array
  promise: null,       // in-flight promise (duplicate calls avoid karta hai)
  listeners: new Set(),// jo components subscribe hain

  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
  notify() {
    this.listeners.forEach((fn) => fn(this.data));
  },

  // Sirf ek baar fetch — agar already chal raha hai toh same promise return karo
  async fetch() {
    if (this.data !== null) return this.data;          // cache hit — API call nahi
    if (this.promise) return this.promise;              // already in-flight

    this.promise = api
      .get("/api/v1/team")
      .then((res) => {
        const list = Array.isArray(res.data) ? res.data : res.data?.data ?? [];
        this.data = list;
        this.notify();
        return list;
      })
      .catch((err) => {
        this.promise = null; // error pe retry allow karo
        return Promise.reject(err);
      });

    return this.promise;
  },
};

// ─── Security helpers ─────────────────────────────────────────────────────────
function sanitizePhone(raw) {
  if (typeof raw !== "string") return "";
  return raw.replace(/[^\d+]/g, "").slice(0, 15);
}
function sanitizeText(str, maxLen = 500) {
  if (typeof str !== "string") return "";
  return str.replace(/<[^>]*>/g, "").slice(0, maxLen);
}
function sanitizeUrl(raw) {
  if (typeof raw !== "string") return null;
  if (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/"))
    return raw;
  return null;
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
  const exp  = Number(experience) || 0;
  let minRating, maxRating;
  if (exp >= 10)     { minRating = 4.6; maxRating = 5.0; }
  else if (exp >= 6) { minRating = 4.2; maxRating = 4.6; }
  else if (exp >= 3) { minRating = 3.6; maxRating = 4.2; }
  else               { minRating = 3.0; maxRating = 3.6; }
  const range = Math.round((maxRating - minRating) * 10);
  const rating = (minRating + (hash % (range + 1)) * 0.1).toFixed(1);
  return { rating: Number(rating), ratingCount: 20 + (hash % 200) };
}

// ─── useMentors hook ──────────────────────────────────────────────────────────
// Singleton store se data lega — component mount kitni baar bhi ho,
// API ek baar hi jayegi.
function useMentors() {
  const [mentors, setMentors] = useState(mentorStore.data ?? []);
  const [loading, setLoading] = useState(mentorStore.data === null);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    // Agar pehle se data hai toh kuch karna nahi
    if (mentorStore.data !== null) {
      setMentors(mentorStore.data);
      setLoading(false);
      return;
    }

    // Store se subscribe karo — jab data aaye toh update ho jayenge
    const unsub = mentorStore.subscribe((data) => {
      setMentors(data);
      setLoading(false);
    });

    mentorStore.fetch().catch((err) => {
      console.error("Mentor fetch failed:", err);
      setError("Counsellors load nahi ho sake. Please refresh karein.");
      setLoading(false);
    });

    return unsub;
  }, []); // [] — sirf mount pe, koi dependency nahi

  return { mentors, loading, error };
}

// ─── MentorCard ───────────────────────────────────────────────────────────────
function MentorCard({ mentor, onBook, onDetail }) {
  const name        = sanitizeText(mentor.name || mentor.fullName || "Unknown Counsellor", 80);
  const designation = sanitizeText(mentor.designation || mentor.title || "Career Counsellor", 100);
  const experience  = mentor.experience ?? mentor.years ?? 5;
  const mentorKey   = String(mentor._id || mentor.id || name);
  const fallback    = getFallbackRatingData(mentorKey, experience);
  const rating      = mentor.rating ?? mentor.avgRating ?? fallback.rating;
  const ratingCount = mentor.ratingCount ?? mentor.reviews ?? fallback.ratingCount;
  const fee         = mentor.fee ?? mentor.price ?? 0;
  const isFree      = fee === 0 || fee === "0" || fee === "Free";
  const responseRate = sanitizeText(String(mentor.responseRate ?? mentor.response ?? "95%"), 10);
  const skills      = mentor.skills || mentor.expertises || mentor.expertise || [];

  const DEFAULT_PHONE  = sanitizePhone(process.env.NEXT_PUBLIC_DEFAULT_COUNSELLOR_PHONE || "9319998717");
  const mobileNumber   = sanitizePhone(mentor.mobileNumber) || DEFAULT_PHONE;
  const whatsappNumber = sanitizePhone(mentor.whatsappNumber) || mobileNumber;

  const rawImage = mentor.image;
  const imageSrc =
    typeof rawImage === "string" &&
    (rawImage.startsWith("http://") || rawImage.startsWith("https://") || rawImage.startsWith("/"))
      ? rawImage
      : FALLBACK_AVATAR;

  return (
    <article
      className="relative bg-white rounded-2xl border border-gray-100 p-4 flex flex-col md:flex-row gap-4 items-stretch shadow-sm hover:shadow-lg transition duration-300 group"
      aria-label={`Counsellor: ${name}`}
    >
      <div
        className="flex-1 flex gap-4 items-start cursor-pointer"
        onClick={onDetail}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && onDetail()}
      >
        <div className="w-28 h-28 md:w-32 md:h-32 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200 bg-gray-50 relative">
          <Image
            src={imageSrc}
            alt={`Photo of ${name}`}
            fill
            sizes="(max-width: 768px) 112px, 128px"
            className="object-contain"
            loading="lazy"
            onError={(e) => { e.currentTarget.src = FALLBACK_AVATAR; }}
          />
          {(mentor.isOnline || mentor.online === true) && (
            <span className="absolute top-2 left-2 w-3 h-3 bg-green-500 rounded-full border-2 border-white" aria-label="Online" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row items-start justify-between gap-2">
            <div>
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition truncate">{name}</h3>
              <p className="text-sm font-medium text-gray-600 truncate">{designation}</p>
            </div>
            <div className="inline-flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200 flex-shrink-0">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" aria-hidden="true" />
              <span className="text-sm font-bold text-yellow-800">{Number(rating).toFixed(1)}</span>
              <span className="text-xs text-gray-500">({ratingCount})</span>
            </div>
          </div>

          <p className="mt-2 text-sm text-gray-500 leading-relaxed max-w-full md:max-w-[60%] line-clamp-2">
            {sanitizeText(mentor.description || `Expert guidance with ${experience} years of experience.`)}
          </p>

          <div className="mt-3 flex items-center gap-2 flex-wrap">
            <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-full font-medium">🎯 Resp. {responseRate}</span>
            <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">⭐ {experience} yrs Exp.</span>
            {Array.isArray(skills) && skills.slice(0, 3).map((s) => (
              <span key={s} className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full font-medium">
                {sanitizeText(String(s), 30)}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full md:w-44 flex-shrink-0 flex flex-col items-center md:items-end justify-start md:justify-end gap-2 pt-4 md:pt-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-4">
        <div className="text-center md:text-right w-full mb-2">
          <div className="text-xs text-gray-500">Session Fee</div>
          <div className="text-xl font-extrabold text-blue-800">{isFree ? "FREE" : `₹${fee}`}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onBook(); }}
          className="w-full py-2 rounded-lg text-sm font-semibold transition bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {isFree ? "Book Free" : "Book Now"}
        </button>
        <div className="flex w-full gap-2">
          {mobileNumber && (
            <a href={`tel:${mobileNumber}`} className="flex-1 flex items-center justify-center p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition" onClick={(e) => e.stopPropagation()} rel="noopener" aria-label={`Call ${name}`}>
              <Phone className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
          {whatsappNumber && (
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center p-2 rounded-lg bg-[#25D366] text-white hover:bg-[#1EBE5A] transition" onClick={(e) => e.stopPropagation()} aria-label={`WhatsApp ${name}`}>
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function MentorSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 animate-pulse" aria-hidden="true">
      <div className="w-32 h-32 rounded-xl bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-3 py-1">
        <div className="h-5 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-1/4" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
        <div className="flex gap-2">{[1,2,3].map((i) => <div key={i} className="h-6 w-20 bg-gray-200 rounded-full" />)}</div>
      </div>
    </div>
  );
}

function FilterSelect({ id, label, value, onChange, options, allLabel }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-xs font-bold text-gray-400 uppercase block">{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className="w-full p-2 border rounded-md text-sm cursor-pointer">
        <option value="">{allLabel}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TeamListingPage() {
  const { mentors, loading, error } = useMentors(); // singleton hook — API ek baar
  const [query, setQuery]               = useState("");
  const [selectedState, setSelectedState]   = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [selectedSkill, setSelectedSkill]   = useState("");
  const [sortBy, setSortBy]             = useState("experience-desc");
  const [page, setPage]                 = useState(1);
  const [openBookModal, setOpenBookModal] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const router = useRouter();

  const resetPage = useCallback(() => setPage(1), []);

  const resetFilters = useCallback(() => {
    setQuery(""); setSelectedState(""); setSelectedLanguage("");
    setSelectedSkill(""); setSortBy("experience-desc"); setPage(1);
  }, []);

  const filterOptions = useMemo(() => {
    const states = new Set(), languages = new Set(), skillsSet = new Set();
    mentors.forEach((m) => {
      const loc = m.state || m.location;
      if (loc) states.add(loc.trim());
      const lang = m.languages || m.language;
      if (Array.isArray(lang)) lang.forEach((l) => languages.add(l.trim()));
      else if (typeof lang === "string") lang.split(",").forEach((l) => languages.add(l.trim()));
      const s = m.skills || m.expertises || m.expertise;
      if (Array.isArray(s)) s.forEach((i) => skillsSet.add(i.trim()));
      else if (typeof s === "string") s.split(",").forEach((i) => skillsSet.add(i.trim()));
    });
    return {
      states:    Array.from(states).filter(Boolean).sort(),
      languages: Array.from(languages).filter(Boolean).sort(),
      skills:    Array.from(skillsSet).filter(Boolean).sort(),
    };
  }, [mentors]);

  const filtered = useMemo(() => {
    let list = [...mentors];
    if (selectedState)
      list = list.filter((m) => (m.state || m.location || "").toLowerCase().includes(selectedState.toLowerCase()));
    if (selectedLanguage)
      list = list.filter((m) => (m.languages || m.language || "").toString().toLowerCase().includes(selectedLanguage.toLowerCase()));
    if (selectedSkill)
      list = list.filter((m) => {
        const s = m.skills || m.expertises || m.expertise || [];
        const arr = Array.isArray(s) ? s : typeof s === "string" ? s.split(",").map((i) => i.trim()) : [];
        return arr.some((item) => item.toLowerCase() === selectedSkill.toLowerCase());
      });
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((m) =>
        (m.name || "").toLowerCase().includes(q) ||
        (m.designation || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => (b.experience || 0) - (a.experience || 0));
    if (sortBy === "fee-low")  list.sort((a, b) => (a.fee || 0) - (b.fee || 0));
    if (sortBy === "fee-high") list.sort((a, b) => (b.fee || 0) - (a.fee || 0));
    return list;
  }, [mentors, selectedState, selectedLanguage, selectedSkill, query, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged      = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section
        className="relative bg-blue-700 h-80 flex items-center justify-center text-center overflow-hidden cursor-pointer"
        style={{ backgroundImage: "url('/images/counselor-banner-placeholder.jpg')", backgroundSize: "cover", backgroundPosition: "center" }}
      >
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
        <div className="relative z-10 p-4 max-w-4xl text-white">
          <h1 className="text-4xl md:text-5xl font-extrabold uppercase">Meet Our Expert Career Counselors</h1>
          <p className="mt-3 text-lg opacity-90">Find the right mentor to guide your future and book a personalised session today</p>
        </div>
      </section>

      <div className="bg-gray-50 flex-grow py-10 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">

          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8">
            <div className="w-full md:max-w-md relative">
              <input
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pl-11 focus:ring-2 focus:ring-blue-500 shadow-sm"
                placeholder="Search by name or designation..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); resetPage(); }}
                aria-label="Search counsellors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" aria-hidden="true" />
            </div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); resetPage(); }}
              className="rounded-lg border-gray-200 px-3 py-2 bg-white text-sm shadow-sm cursor-pointer"
              aria-label="Sort by"
            >
              <option value="experience-desc">Highest Experience</option>
              <option value="fee-low">Fee – Low to High</option>
              <option value="fee-high">Fee – High to Low</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <aside className="hidden md:block md:col-span-3 sticky top-24 h-fit bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-lg font-bold">Filters</h2>
                <button onClick={resetFilters} className="text-xs text-red-500 font-bold flex items-center gap-1 hover:text-red-700">
                  <RotateCcw className="w-3 h-3" aria-hidden="true" /> RESET
                </button>
              </div>
              <div className="space-y-5">
                <FilterSelect id="filter-location" label="Location" value={selectedState} onChange={(v) => { setSelectedState(v); resetPage(); }} options={filterOptions.states} allLabel="All Locations" />
                <FilterSelect id="filter-language" label="Language" value={selectedLanguage} onChange={(v) => { setSelectedLanguage(v); resetPage(); }} options={filterOptions.languages} allLabel="All Languages" />
                <FilterSelect id="filter-expertise" label="Expertise" value={selectedSkill} onChange={(v) => { setSelectedSkill(v); resetPage(); }} options={filterOptions.skills} allLabel="All Skills" />
              </div>
            </aside>

            <main className="md:col-span-9 space-y-6" aria-live="polite">
              {error && (
                <div role="alert" className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm">{error}</div>
              )}
              {loading ? (
                <>{[1, 2, 3].map((i) => <MentorSkeleton key={i} />)}</>
              ) : paged.length > 0 ? (
                <>
                  <p className="text-sm text-gray-500">
                    Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} counsellors
                  </p>
                  {paged.map((m) => (
                    <MentorCard
                      key={m._id || m.id}
                      mentor={m}
                      onBook={() => { setSelectedMentor(m); setOpenBookModal(true); }}
                      onDetail={() => router.push(`/teamexpand/${m._id || m.id}`)}
                    />
                  ))}
                  {totalPages > 1 && (
                    <nav className="mt-12 flex items-center justify-center gap-2" aria-label="Pagination">
                      <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 border bg-white rounded-lg disabled:opacity-40" aria-label="Previous page">
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      {[...Array(totalPages)].map((_, i) => (
                        <button key={i} onClick={() => setPage(i + 1)} aria-current={page === i + 1 ? "page" : undefined}
                          className={`w-10 h-10 rounded-lg text-sm font-bold ${page === i + 1 ? "bg-blue-600 text-white" : "bg-white border text-gray-600 hover:bg-gray-50"}`}>
                          {i + 1}
                        </button>
                      ))}
                      <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="p-2 border bg-white rounded-lg disabled:opacity-40" aria-label="Next page">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </nav>
                  )}
                </>
              ) : (
                <div className="text-center py-20 bg-white rounded-2xl border text-gray-500">
                  No counsellors found. Try adjusting your filters.
                </div>
              )}
            </main>
          </div>
        </div>
      </div>

      {openBookModal && selectedMentor && (
        <Bookcounsler mentor={selectedMentor} onClose={() => setOpenBookModal(false)} />
      )}
      <Footer />
    </div>
  );
}