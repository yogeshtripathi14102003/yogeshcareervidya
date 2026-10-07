// "use client";
// import { useParams, useRouter } from "next/navigation";
// import { useEffect, useState, useCallback, useRef } from "react";
// import Image from "next/image";
// import api from "@/utlis/api.js";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import ReviewForm from "@/app/components/ReviewForm.jsx";
// import {
//   MapPin, GraduationCap, Briefcase, Languages,
//   Star, Phone, IndianRupee, Award, CheckCircle2, ArrowLeft,
// } from "lucide-react";

// // ─── Per-mentor cache ─────────────────────────────────────────────────────────
// // Map<mentorId, { mentor, reviews }> — ek baar fetch, baar baar open karo,
// // data wahi rehta hai. Sirf reviews ko onSuccess pe refresh karo.
// const detailCache = new Map();

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
//   return (raw.startsWith("http://") || raw.startsWith("https://") || raw.startsWith("/")) ? raw : null;
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function ProfileSkeleton() {
//   return (
//     <div className="animate-pulse" aria-hidden="true">
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="bg-white rounded-3xl overflow-hidden">
//           <div className="h-80 bg-gray-200" />
//           <div className="p-6 space-y-4">
//             {[1,2,3,4].map((i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
//           </div>
//         </div>
//         <div className="lg:col-span-2 space-y-4">
//           {[1,2,3,4,5,6].map((i) => <div key={i} className="h-4 bg-gray-200 rounded" />)}
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────
// export default function TeamDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();

//   // Seed state from cache immediately — zero loading flash if already visited
//   const cached = id ? detailCache.get(id) : null;
//   const [mentor,  setMentor]  = useState(cached?.mentor  ?? null);
//   const [reviews, setReviews] = useState(cached?.reviews ?? []);
//   const [loading, setLoading] = useState(!cached);
//   const [error,   setError]   = useState(null);
//   const fetchedRef = useRef(!!cached); // prevent double-fetch in StrictMode

//   // Full fetch: mentor + reviews — only once per id (unless cache empty)
//   const fetchAll = useCallback(async () => {
//     if (!id) return;
//     setLoading(true);
//     setError(null);
//     try {
//       const [mentorRes, reviewsRes] = await Promise.all([
//         api.get(`/api/v1/team/${id}`),
//         api.get(`/api/v1/review/${id}`),
//       ]);
//       const m = mentorRes.data.data || mentorRes.data;
//       const r = reviewsRes.data.reviews || [];
//       detailCache.set(id, { mentor: m, reviews: r }); // cache kar lo
//       setMentor(m);
//       setReviews(r);
//     } catch (err) {
//       console.error("Profile fetch failed:", err);
//       setError("Profile not available.");
//     } finally {
//       setLoading(false);
//     }
//   }, [id]);

//   // Sirf reviews refresh karo — review submit ke baad mentor data dobara fetch na ho
//   const refreshReviews = useCallback(async () => {
//     if (!id) return;
//     try {
//       const res = await api.get(`/api/v1/review/${id}`);
//       const r   = res.data.reviews || [];
//       // Cache update karo (sirf reviews)
//       const existing = detailCache.get(id);
//       if (existing) detailCache.set(id, { ...existing, reviews: r });
//       setReviews(r);
//     } catch (err) {
//       console.error("Reviews refresh failed:", err);
//     }
//   }, [id]);

//   useEffect(() => {
//     if (fetchedRef.current) return; // already fetched / cache hit
//     fetchedRef.current = true;
//     fetchAll();
//   }, [fetchAll]);

//   // ── Render states ──────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Header />
//         <div className="max-w-6xl mx-auto py-10 px-4"><ProfileSkeleton /></div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error || !mentor) {
//     return (
//       <div className="bg-gray-50 min-h-screen">
//         <Header />
//         <div className="py-32 text-center px-4">
//           <p className="text-red-500 text-lg mb-4" role="alert">{error || "Counsellor not found."}</p>
//           <button onClick={() => router.back()} className="text-blue-600 underline hover:text-blue-800">Go back</button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // ── Safe field extraction ──────────────────────────────────────────────────
//   const name         = sanitizeText(mentor.name || "", 80);
//   const designation  = sanitizeText(mentor.designation || "", 100);
//   const description  = sanitizeText(mentor.description || "", 1000);
//   const expertise    = sanitizeText(mentor.expertise || "", 200);
//   const education    = sanitizeText(mentor.education || "Not Specified", 200);
//   const location     = sanitizeText(mentor.location || "", 100);
//   const mobileNumber = sanitizePhone(mentor.mobileNumber);
//   const fee          = Number(mentor.fee) || 0;
//   const imageSrc     = sanitizeUrl(mentor.image) || "/images/default-avatar.png";
//   const highlights   = Array.isArray(mentor.highlights) ? mentor.highlights : [];
//   const languages    = Array.isArray(mentor.languages) ? mentor.languages : [];
//   const rating       = mentor.rating || "0.0";

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       <Header />

//       <div className="max-w-6xl mx-auto py-10 px-4">
//         <button
//           onClick={() => router.back()}
//           className="mb-6 flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors font-medium group focus:outline-none focus:ring-2 focus:ring-blue-300 rounded"
//         >
//           <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" aria-hidden="true" />
//           Back to Experts
//         </button>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

//           {/* ── Left: Profile card ──────────────────────────────────────── */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
//               <div className="relative w-full h-80 bg-gray-100">
//                 <Image
//                   src={imageSrc}
//                   alt={`Photo of ${name}`}
//                   fill
//                   sizes="(max-width: 1024px) 100vw, 33vw"
//                   className="object-contain"
//                   priority
//                   onError={(e) => { e.currentTarget.src = "/images/default-avatar.png"; }}
//                 />
//                 <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1 shadow-sm border border-white/50">
//                   <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
//                   <span className="font-bold text-gray-800">{rating}</span>
//                   <span className="text-gray-500 text-xs">({reviews.length} Reviews)</span>
//                 </div>
//               </div>

//               <div className="p-6">
//                 <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
//                 <p className="text-blue-600 font-semibold mb-4">{designation}</p>

//                 <dl className="space-y-4 border-t pt-4">
//                   <div className="flex items-center gap-3 text-gray-600">
//                     <Briefcase className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
//                     <dd>{mentor.experience} years experience</dd>
//                   </div>
//                   {location && (
//                     <div className="flex items-center gap-3 text-gray-600">
//                       <MapPin className="w-5 h-5 text-red-500 flex-shrink-0" aria-hidden="true" />
//                       <dd>{location}</dd>
//                     </div>
//                   )}
//                   <div className="flex items-center gap-3 text-gray-600">
//                     <IndianRupee className="w-5 h-5 text-green-600 flex-shrink-0" aria-hidden="true" />
//                     <dd className="font-semibold text-gray-800">
//                       {fee > 0 ? `₹${fee}` : "Free Consultation"}
//                     </dd>
//                   </div>
//                   {mobileNumber && (
//                     <div className="flex items-center gap-3 text-gray-600">
//                       <Phone className="w-5 h-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
//                       <dd>
//                         <a href={`tel:${mobileNumber}`} className="hover:text-blue-600" rel="noopener">
//                           {mobileNumber}
//                         </a>
//                       </dd>
//                     </div>
//                   )}
//                 </dl>
//               </div>
//             </div>
//           </aside>

//           {/* ── Right: Detail + reviews ──────────────────────────────────── */}
//           <div className="lg:col-span-2 space-y-8">

//             <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
//               <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//                 <Award className="text-blue-600" aria-hidden="true" /> Professional Expertise
//               </h2>

//               {expertise && (
//                 <div className="mb-6">
//                   <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg font-medium border border-blue-100 inline-block">
//                     {expertise}
//                   </span>
//                 </div>
//               )}

//               {description && <p className="text-gray-700 leading-relaxed mb-8">{description}</p>}

//               <div className="grid md:grid-cols-2 gap-8 border-t pt-6">
//                 <div>
//                   <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
//                     <GraduationCap className="w-5 h-5 text-blue-500" aria-hidden="true" /> Education
//                   </h3>
//                   <p className="text-gray-600">{education}</p>
//                 </div>
//                 <div>
//                   <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-2">
//                     <Languages className="w-5 h-5 text-blue-500" aria-hidden="true" /> Languages
//                   </h3>
//                   {languages.length > 0 ? (
//                     <div className="flex flex-wrap gap-2">
//                       {languages.map((lang, i) => (
//                         <span key={i} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold">
//                           {sanitizeText(String(lang), 40)}
//                         </span>
//                       ))}
//                     </div>
//                   ) : (
//                     <span className="text-gray-400 text-sm">Not Specified</span>
//                   )}
//                 </div>
//               </div>

//               {highlights.length > 0 && (
//                 <div className="mt-8 bg-blue-50/30 p-6 rounded-2xl border border-blue-50">
//                   <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
//                     <CheckCircle2 className="w-5 h-5 text-blue-600" aria-hidden="true" /> Key Highlights
//                   </h3>
//                   <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                     {highlights.map((point, i) => (
//                       <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
//                         <span className="text-blue-500 mt-1" aria-hidden="true">•</span>
//                         {sanitizeText(String(point), 200)}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </section>

//             {/* Reviews */}
//             <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-2xl font-bold text-gray-900">Student Feedback</h2>
//                 <div className="text-right">
//                   <p className="text-3xl font-bold text-gray-900">{rating}</p>
//                   <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Overall Rating</p>
//                 </div>
//               </div>

//               <div className="grid lg:grid-cols-2 gap-10">
//                 <div>
//                   {/* onSuccess = sirf reviews refresh, mentor dobara fetch nahi */}
//                   <ReviewForm counsellorId={mentor._id} onSuccess={refreshReviews} />
//                 </div>

//                 <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2" role="feed">
//                   {reviews.length === 0 ? (
//                     <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
//                       <p className="text-gray-400 italic">No reviews yet. Be the first!</p>
//                     </div>
//                   ) : (
//                     reviews.map((rev) => (
//                       <article key={rev._id} className="p-4 rounded-xl bg-gray-50 border border-transparent hover:border-blue-100 transition-all">
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <p className="font-bold text-gray-800 text-sm">
//                               {sanitizeText(rev.guestName || "Anonymous", 60)}
//                             </p>
//                             <div className="flex gap-0.5" role="img" aria-label={`${rev.rating} out of 5 stars`}>
//                               {[...Array(5)].map((_, i) => (
//                                 <Star key={i} className={`w-3 h-3 ${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} aria-hidden="true" />
//                               ))}
//                             </div>
//                           </div>
//                           <time dateTime={rev.createdAt} className="text-[10px] text-gray-400 font-medium">
//                             {new Date(rev.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
//                           </time>
//                         </div>
//                         <p className="text-gray-600 text-sm italic leading-snug">
//                           &ldquo;{sanitizeText(rev.comment || "", 500)}&rdquo;
//                         </p>
//                       </article>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </section>

//           </div>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }



// "use client";

// import { useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Image from "next/image";
// import api from "@/utlis/api.js";
// import { useQuery, useQueryClient } from "@tanstack/react-query";
// import Header from "@/app/layout/Header.jsx";
// import Footer from "@/app/layout/Footer.jsx";
// import ReviewForm from "@/app/components/ReviewForm.jsx";
// import {
//   MapPin,
//   GraduationCap,
//   Briefcase,
//   Star,
//   Phone,
//   MessageCircle,
//   Award,
//   CheckCircle2,
//   ArrowLeft,
//   Clock,
//   Sparkles,
// } from "lucide-react";

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
//   return raw.startsWith("http://") ||
//     raw.startsWith("https://") ||
//     raw.startsWith("/")
//     ? raw
//     : null;
// }

// // ─── Skeleton ─────────────────────────────────────────────────────────────────
// function ProfileSkeleton() {
//   return (
//     <div className="animate-pulse space-y-8" aria-hidden="true">
//       <div className="h-64 bg-slate-200 rounded-2xl" />
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         <div className="lg:col-span-2 space-y-4">
//           <div className="h-40 bg-slate-200 rounded-2xl" />
//         </div>
//         <div className="h-64 bg-slate-200 rounded-2xl" />
//       </div>
//     </div>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────
// export default function TeamDetailPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState("about");

//   /* ═══════════════════════════════════════════════
//      ✅ REACT QUERY — Mentor detail
//   ═══════════════════════════════════════════════ */
//   const {
//     data: mentor,
//     isLoading: mentorLoading,
//     isError: mentorError,
//   } = useQuery({
//     queryKey: ["mentor-detail", id],
//     queryFn: async () => {
//       const res = await api.get(`/api/v1/team/${id}`);
//       return res.data.data || res.data;
//     },
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//   });

//   /* ═══════════════════════════════════════════════
//      ✅ REACT QUERY — Reviews
//   ═══════════════════════════════════════════════ */
//   const {
//     data: reviews = [],
//     isLoading: reviewsLoading,
//   } = useQuery({
//     queryKey: ["mentor-reviews", id],
//     queryFn: async () => {
//       const res = await api.get(`/api/v1/review/${id}`);
//       return res.data.reviews || [];
//     },
//     enabled: !!id,
//     staleTime: 5 * 60 * 1000,
//   });

//   const loading = mentorLoading || reviewsLoading;
//   const error = mentorError ? "Profile not available." : null;

//   const refreshReviews = () => {
//     queryClient.invalidateQueries({ queryKey: ["mentor-reviews", id] });
//   };

//   // ── Render states ──────────────────────────────────────────────────────────
//   if (loading) {
//     return (
//       <div className="min-h-screen bg-[var(--cv-neutral-light)]">
//         <Header />
//         <div className="max-w-6xl mx-auto py-10 px-4">
//           <ProfileSkeleton />
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   if (error || !mentor) {
//     return (
//       <div className="min-h-screen bg-[var(--cv-neutral-light)]">
//         <Header />
//         <div className="py-32 text-center px-4">
//           <p className="text-lg mb-4 text-red-500" role="alert">
//             {error || "Counsellor not found."}
//           </p>
//           <button
//             onClick={() => router.back()}
//             className="cursor-pointer  underline font-semibold text-[var(--cv-primary)]"
//           >
//             Go back
//           </button>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   // ── Safe field extraction ──────────────────────────────────────────────────
//   const name = sanitizeText(mentor.name || "", 80);
//   const designation = sanitizeText(mentor.designation || "", 100);
//   const description = sanitizeText(mentor.description || "", 1000);
//   const expertise = sanitizeText(mentor.expertise || "", 200);
//   const education = sanitizeText(mentor.education || "Not Specified", 200);
//   const location = sanitizeText(mentor.location || "India", 100);
  
//   const mobileNumber = sanitizePhone(mentor.mobileNumber || "9319998717");
  
//   const imageSrc = sanitizeUrl(mentor.image) || "/images/default-avatar.png";
//   const highlights = Array.isArray(mentor.highlights) ? mentor.highlights : [];
//   const languages = Array.isArray(mentor.languages) ? mentor.languages : [];
//   const rating = mentor.rating || "4.9";
//   const experience = mentor.experience || "5+";

//   return (
//     <div className="min-h-screen bg-[var(--cv-neutral-light)] text-[var(--cv-neutral-dark)]">
//       <Header />

//       {/* ═══ Top Hero Banner (Brand Navy Gradient) ═══ */}
//       <section 
//         style={{ background: "var(--cv-grad-navy)" }} 
//         className="text-white pt-8 pb-12 px-4 shadow-md"
//       >
//         <div className="max-w-6xl mx-auto">
//           {/* Back Button */}
//           <button
//             onClick={() => router.back()}
//             className="  cursor-pointer mb-6 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Back
//           </button>

//           <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
//             {/* Left: Info Profile */}
//             <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
//               {/* Profile Image with Golden Badge */}
//               <div className="relative shrink-0">
//                 <div className="w-36 h-36 rounded-2xl overflow-hidden border-4 border-white/20 shadow-xl bg-white relative">
//                   <Image
//                     src={imageSrc}
//                     alt={name}
//                     fill
//                     className="object-cover"
//                     priority
//                   />
//                 </div>
//                 <div className="absolute -bottom-2 -right-2 bg-amber-400 p-1.5 rounded-full text-slate-900 shadow-md">
//                   <Award className="w-5 h-5" />
//                 </div>
//               </div>

//               {/* Basic Details */}
//               <div className="space-y-2">
//                 <h1 className="text-3xl font-extrabold tracking-wide uppercase">
//                   {name}
//                 </h1>
//                 <p className="text-blue-100 font-medium text-base">
//                   {designation}
//                 </p>

//                 {/* Sub details line */}
//                 <p className="text-xs text-blue-200 flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
//                   <span>{experience} Years Exp.</span>
//                   <span>•</span>
//                   <span>{location}</span>
//                   {languages.length > 0 && (
//                     <>
//                       <span>•</span>
//                       <span>{languages.join(" • ")}</span>
//                     </>
//                   )}
//                 </p>

//                 {/* Rating */}
//                 <div className="flex items-center justify-center sm:justify-start gap-3 pt-2">
//                   <div className="flex text-amber-300">
//                     {[...Array(5)].map((_, i) => (
//                       <Star key={i} className="w-4 h-4 fill-amber-300" />
//                     ))}
//                   </div>
//                   <span className="text-xs text-blue-100 font-medium">
//                     {reviews.length} Verified reviews
//                   </span>
//                   <span className="bg-white/10 px-2 py-0.5 rounded text-xs font-bold">
//                     {rating}/5
//                   </span>
//                 </div>

//                 {/* Expertise Pills */}
//                 {expertise && (
//                   <div className="flex flex-wrap gap-2 pt-3 justify-center sm:justify-start">
//                     {expertise.split(",").map((exp, idx) => (
//                       <span
//                         key={idx}
//                         className="bg-white/15 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/10 font-medium"
//                       >
//                         {exp.trim()}
//                       </span>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Right: CTA Action Box */}
//             <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full sm:w-80 shadow-2xl shrink-0">
//               <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold mb-4">
//                 <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
//                 Available right now
//               </div>

//               <div className="space-y-3">
//                 {mobileNumber ? (
//                   <>
//                     {/* Direct Call Button (Brand Gradient CTA) */}
//                     <a
//                       href={`tel:${mobileNumber}`}
//                       className="cv-btn-cta w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2"
//                     >
//                       <Phone className="w-4 h-4" />
//                       Call Now Free
//                     </a>

//                     {/* WhatsApp Chat Button */}
//                     <a
//                       href={`https://wa.me/${mobileNumber.startsWith("+") ? mobileNumber : `91${mobileNumber}`}`}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 transition-all shadow-md"
//                     >
//                       <MessageCircle className="w-4 h-4" />
//                       Chat on WhatsApp
//                     </a>
//                   </>
//                 ) : (
//                   <button className="w-full bg-white/20 text-white/70 py-2.5 px-4 rounded-xl font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed">
//                     <Phone className="w-4 h-4" />
//                     Contact Unavailable
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* ═══ Navigation Tabs ═══ */}
//       <div className="bg-[var(--cv-neutral-dark)] text-white border-b border-slate-800 sticky top-0 z-20 shadow-md">
//         <div className="max-w-6xl mx-auto px-4 flex gap-8 text-sm font-medium overflow-x-auto">
//           {[
//             { id: "about", label: "About" },
//             { id: "reviews", label: `Reviews (${reviews.length})` },
//           ].map((tab) => (
//             <button
//               key={tab.id}
//               onClick={() => setActiveTab(tab.id)}
//               className={`py-3.5 border-b-2 transition-all whitespace-nowrap ${
//                 activeTab === tab.id
//                   ? "border-[var(--cv-accent)] text-[var(--cv-accent)] font-semibold"
//                   : "border-transparent text-slate-300 hover:text-white"
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </div>
//       </div>

//       {/* ═══ Main Content Container ═══ */}
//       <main className="max-w-6xl mx-auto py-10 px-4">
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
//           {/* LEFT 2 COLUMNS: About + Highlights */}
//           <div className="lg:col-span-2 space-y-8">
//             <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--cv-neutral-border)]">
//               <h2 className="text-xl font-bold text-[var(--cv-neutral-dark)] mb-1">
//                 About {name.split(" ")[0]}
//               </h2>
//               <p className="text-xs uppercase font-bold tracking-wider text-[var(--cv-neutral-mid)] mb-6">
//                 {designation}
//               </p>

//               {description ? (
//                 <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
//                   {description}
//                 </p>
//               ) : (
//                 <p className="text-slate-400 italic text-sm">
//                   No detailed bio available for this counsellor.
//                 </p>
//               )}

//               {/* Highlights */}
//               {highlights.length > 0 && (
//                 <div className="mt-8 pt-6 border-t border-slate-100">
//                   <h3 className="font-bold text-[var(--cv-neutral-dark)] mb-4 flex items-center gap-2">
//                     <CheckCircle2 className="w-5 h-5 text-[var(--cv-accent)]" />
//                     Key Highlights
//                   </h3>
//                   <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
//                     {highlights.map((point, i) => (
//                       <li
//                         key={i}
//                         className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 bg-[var(--cv-neutral-light)] p-3 rounded-lg border border-slate-100"
//                       >
//                         <span className="text-[var(--cv-accent)]">•</span>
//                         {sanitizeText(String(point), 200)}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </section>

//             {/* Reviews Section */}
//             <section
//               id="reviews-section"
//               className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--cv-neutral-border)]"
//             >
//               <div className="flex items-center justify-between mb-8">
//                 <h2 className="text-xl font-bold text-[var(--cv-neutral-dark)]">
//                   Student Feedback
//                 </h2>
//                 <div className="text-right">
//                   <p className="text-2xl font-bold text-[var(--cv-primary)]">{rating}</p>
//                   <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--cv-neutral-mid)]">
//                     Overall Rating
//                   </p>
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
//                 <div>
//                   <ReviewForm
//                     counsellorId={mentor._id}
//                     onSuccess={refreshReviews}
//                   />
//                 </div>

//                 <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
//                   {reviews.length === 0 ? (
//                     <div className="text-center py-12 rounded-xl bg-[var(--cv-neutral-light)] border border-dashed border-slate-200">
//                       <p className="italic text-sm text-slate-500">
//                         No reviews yet. Be the first!
//                       </p>
//                     </div>
//                   ) : (
//                     reviews.map((rev) => (
//                       <article
//                         key={rev._id}
//                         className="p-4 rounded-xl bg-[var(--cv-neutral-light)] border border-slate-100"
//                       >
//                         <div className="flex justify-between items-start mb-2">
//                           <div>
//                             <p className="font-bold text-xs text-slate-800">
//                               {sanitizeText(rev.guestName || "Anonymous", 60)}
//                             </p>
//                             <div className="flex gap-0.5 mt-1">
//                               {[...Array(5)].map((_, i) => (
//                                 <Star
//                                   key={i}
//                                   className={`w-3 h-3 ${
//                                     i < rev.rating
//                                       ? "text-amber-400 fill-amber-400"
//                                       : "text-slate-300"
//                                   }`}
//                                 />
//                               ))}
//                             </div>
//                           </div>
//                           <time className="text-[10px] text-slate-400">
//                             {new Date(rev.createdAt).toLocaleDateString(
//                               "en-IN",
//                               { year: "numeric", month: "short", day: "numeric" }
//                             )}
//                           </time>
//                         </div>
//                         <p className="text-xs text-slate-600 italic">
//                           &ldquo;{sanitizeText(rev.comment || "", 500)}&rdquo;
//                         </p>
//                       </article>
//                     ))
//                   )}
//                 </div>
//               </div>
//             </section>
//           </div>

//           {/* RIGHT COLUMN: Facts Card */}
//           <aside className="lg:col-span-1">
//             <div className="bg-white rounded-2xl p-6 shadow-sm border border-[var(--cv-neutral-border)] sticky top-20">
//               <h3 className="text-base font-bold text-[var(--cv-neutral-dark)] mb-6 pb-3 border-b border-slate-100">
//                 Facts about {name.split(" ")[0]}
//               </h3>

//               <dl className="space-y-5 text-sm">
//                 <div className="flex items-center justify-between">
//                   <dt className="text-slate-500 flex items-center gap-2">
//                     <MapPin className="w-4 h-4 text-slate-400" />
//                     Location
//                   </dt>
//                   <dd className="font-semibold text-slate-800">{location}</dd>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <dt className="text-slate-500 flex items-center gap-2">
//                     <GraduationCap className="w-4 h-4 text-slate-400" />
//                     Education
//                   </dt>
//                   <dd className="font-semibold text-slate-800">{education}</dd>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <dt className="text-slate-500 flex items-center gap-2">
//                     <Briefcase className="w-4 h-4 text-slate-400" />
//                     Experience
//                   </dt>
//                   <dd className="font-semibold text-slate-800">
//                     {experience} Years
//                   </dd>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <dt className="text-slate-500 flex items-center gap-2">
//                     <Sparkles className="w-4 h-4 text-slate-400" />
//                     Response rate
//                   </dt>
//                   <dd className="font-semibold text-slate-800">95%</dd>
//                 </div>

//                 <div className="flex items-center justify-between">
//                   <dt className="text-slate-500 flex items-center gap-2">
//                     <Clock className="w-4 h-4 text-slate-400" />
//                     Avg. response
//                   </dt>
//                   <dd className="font-semibold text-slate-800">10 min</dd>
//                 </div>
//               </dl>
//             </div>
//           </aside>

//         </div>
//       </main>

//       <Footer />
//     </div>
//   );
// }


"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import api from "@/utlis/api.js";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Header from "@/app/layout/Header.jsx";
import Footer from "@/app/layout/Footer.jsx";
import ReviewForm from "@/app/components/ReviewForm.jsx";
import {
  MapPin,
  GraduationCap,
  Briefcase,
  Star,
  Phone,
  MessageCircle,
  Award,
  CheckCircle2,
  ArrowLeft,
  Clock,
  Sparkles,
  Languages,
} from "lucide-react";

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
  return raw.startsWith("http://") ||
    raw.startsWith("https://") ||
    raw.startsWith("/")
    ? raw
    : null;
}

// ─── Small UI pieces ──────────────────────────────────────────────────────────
function Stars({ value = 0, size = "w-4 h-4", empty = "text-white/30" }) {
  const filled = Math.round(Number(value) || 0);
  return (
    <div className="flex gap-0.5" aria-label={`${filled} out of 5 stars`}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${size} ${
            i < filled ? "text-amber-400 fill-amber-400" : empty
          }`}
        />
      ))}
    </div>
  );
}

function SectionTitle({ children, sub }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold text-[var(--cv-neutral-dark)]">
        {children}
      </h2>
      <div className="cv-divider-gradient w-14 mt-2" />
      {sub && (
        <p className="text-xs font-semibold text-[var(--cv-neutral-mid)] mt-3">
          {sub}
        </p>
      )}
    </div>
  );
}

function StatBox({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.35)] rounded-xl px-4 py-3">
      <span className="cv-icon-gradient w-10 h-10 shrink-0">
        <Icon className="w-4 h-4" />
      </span>
      <div className="leading-tight">
        <p className="text-base font-bold text-white">
          {value}
        </p>
        <p className="text-xs text-white/75">{label}</p>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-8" aria-hidden="true">
      <div className="h-64 bg-slate-200 rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="h-40 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function TeamDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("about");

  /* ✅ REACT QUERY — Mentor detail */
  const {
    data: mentor,
    isLoading: mentorLoading,
    isError: mentorError,
  } = useQuery({
    queryKey: ["mentor-detail", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/team/${id}`);
      return res.data.data || res.data;
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  /* ✅ REACT QUERY — Reviews */
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["mentor-reviews", id],
    queryFn: async () => {
      const res = await api.get(`/api/v1/review/${id}`);
      return res.data.reviews || [];
    },
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });

  const loading = mentorLoading || reviewsLoading;
  const error = mentorError ? "Profile not available." : null;

  const refreshReviews = () => {
    queryClient.invalidateQueries({ queryKey: ["mentor-reviews", id] });
  };

  // ── Render states ──────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--cv-neutral-light)]">
        <Header />
        <div className="max-w-6xl mx-auto py-10 px-4">
          <ProfileSkeleton />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !mentor) {
    return (
      <div className="min-h-screen bg-[var(--cv-neutral-light)]">
        <Header />
        <div className="py-32 text-center px-4">
          <p className="text-lg mb-4 text-red-500" role="alert">
            {error || "Counsellor not found."}
          </p>
          <button
            onClick={() => router.back()}
            className="cv-btn-cta px-6 py-2.5 text-sm"
          >
            Go back
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // ── Safe field extraction ──────────────────────────────────────────────────
  const name = sanitizeText(mentor.name || "", 80)
    .replace(/^((mr|mrs|ms|miss)\.?\s+)+/i, "")
    .trim();
  const firstName = name.split(" ")[0];
  const designation = sanitizeText(mentor.designation || "", 100);
  const description = sanitizeText(mentor.description || "", 1000);
  const expertise = sanitizeText(mentor.expertise || "", 200);
  const education = sanitizeText(mentor.education || "Not Specified", 200);
  const location = sanitizeText(mentor.location || "India", 100);

  const mobileNumber = sanitizePhone(mentor.mobileNumber || "9319998717");

  const imageSrc = sanitizeUrl(mentor.image) || "/images/default-avatar.png";
  const highlights = Array.isArray(mentor.highlights) ? mentor.highlights : [];
  const languages = Array.isArray(mentor.languages) ? mentor.languages : [];
  const rating = mentor.rating || "4.9";
  const experience = mentor.experience || "5+";

  const waLink = `https://wa.me/${
    mobileNumber.startsWith("+") ? mobileNumber.slice(1) : `91${mobileNumber}`
  }`;

  return (
    <div className="min-h-screen bg-[var(--cv-neutral-light)] text-[var(--cv-neutral-dark)]">
      <Header />

      {/* ═══ Hero Banner ═══ */}
      <section
        className="relative overflow-hidden text-white pt-8 pb-10 px-4"
        style={{
          background:
            "radial-gradient(circle at 85% 15%, rgba(240,138,60,0.35) 0%, transparent 45%), radial-gradient(circle at 10% 90%, rgba(143,166,180,0.25) 0%, transparent 50%), linear-gradient(135deg, #3d4c56 0%, #26323a 100%)",
        }}
      >

        <div className="relative max-w-6xl mx-auto">
          <button
            onClick={() => router.back()}
            className="cursor-pointer mb-6 inline-flex items-center gap-2 text-sm text-blue-100 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8">
            {/* Left: profile */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
              {/* Photo with gradient ring */}
              <div className="relative shrink-0">
                <div
                  className="p-1 rounded-3xl shadow-2xl"
                  style={{ background: "var(--cv-grad-cta)" }}
                >
                  <div className="w-36 h-36 rounded-[20px] overflow-hidden bg-white relative">
                    <Image
                      src={imageSrc}
                      alt={name}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                </div>
                <span className="cv-icon-gradient absolute -bottom-2 -right-2 w-9 h-9 border-2 border-white">
                  <Award className="w-4 h-4" />
                </span>
              </div>

              {/* Details */}
              <div className="space-y-2">
                <h1
                  className="text-3xl font-extrabold tracking-wide"
                  style={{ color: "#fff", textShadow: "0 2px 10px rgba(0,0,0,0.45)" }}
                >
                  {name}
                </h1>
                <p className="text-blue-100 font-medium text-base">
                  {designation}
                </p>

                <p className="text-xs text-blue-200 flex flex-wrap items-center justify-center sm:justify-start gap-x-2 gap-y-1 pt-1">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />
                    {location}
                  </span>
                  {languages.length > 0 && (
                    <span className="inline-flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" />
                      {languages.join(", ")}
                    </span>
                  )}
                </p>

                {/* Expertise pills */}
                {expertise && (
                  <div className="flex flex-wrap gap-2 pt-3 justify-center sm:justify-start">
                    {expertise.split(",").map((exp, idx) => (
                      <span
                        key={idx}
                        className="bg-white/15 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full border border-white/20 font-medium"
                      >
                        {exp.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: CTA card */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 w-full sm:w-80 shadow-2xl shrink-0">
              <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold mb-4">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-emerald-400" />
                </span>
                Available right now
              </div>

              <div className="space-y-3">
                {mobileNumber ? (
                  <>
                    <a
                      href={`tel:${mobileNumber}`}
                      className="cv-btn-cta w-full py-3 px-4 text-sm flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Call now, free
                    </a>

                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat on WhatsApp
                    </a>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-white/20 text-white/70 py-3 px-4 rounded-lg font-medium text-sm flex items-center justify-center gap-2 cursor-not-allowed"
                  >
                    <Phone className="w-4 h-4" />
                    Contact unavailable
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
            <StatBox icon={Briefcase} value={`${experience} years`} label="Experience" />
            <StatBox icon={Star} value={`${rating} / 5`} label="Overall rating" />
            <StatBox icon={MessageCircle} value={reviews.length} label="Verified reviews" />
          </div>
        </div>
      </section>

      {/* ═══ Tabs ═══ */}
      <div className="bg-white border-b border-[var(--cv-neutral-border)] sticky top-0 z-20 shadow-sm">
        <div
          role="tablist"
          className="max-w-6xl mx-auto px-4 flex gap-8 text-sm font-medium overflow-x-auto"
        >
          {[
            { id: "about", label: "About" },
            { id: "reviews", label: `Reviews (${reviews.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`relative py-3.5 transition-colors whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "text-[var(--cv-primary)] font-semibold"
                  : "text-[var(--cv-neutral-mid)] hover:text-[var(--cv-neutral-dark)]"
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <span
                  className="absolute left-0 right-0 bottom-0 h-[3px] rounded-full"
                  style={{ background: "var(--cv-grad-horizontal)" }}
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Main content ═══ */}
      <main className="max-w-6xl mx-auto py-10 px-4 pb-28 lg:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: tab content */}
          <div className="lg:col-span-2 space-y-8">
            {activeTab === "about" && (
              <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--cv-neutral-border)]">
                <SectionTitle sub={designation}>About {firstName}</SectionTitle>

                {description ? (
                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                    {description}
                  </p>
                ) : (
                  <p className="text-slate-400 italic text-sm">
                    No detailed bio available for this counsellor.
                  </p>
                )}

                {highlights.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-slate-100">
                    <h3 className="font-bold text-[var(--cv-neutral-dark)] mb-4 flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[var(--cv-accent)]" />
                      Key highlights
                    </h3>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {highlights.map((point, i) => (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 bg-[var(--cv-primary-light)] p-3 rounded-xl border border-blue-100"
                        >
                          <span className="cv-icon-gradient w-5 h-5 shrink-0 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" />
                          </span>
                          {sanitizeText(String(point), 200)}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </section>
            )}

            {activeTab === "reviews" && (
              <section
                id="reviews-section"
                className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-[var(--cv-neutral-border)]"
              >
                <div className="flex items-start justify-between mb-8 gap-4">
                  <SectionTitle>Student feedback</SectionTitle>
                  <div className="text-right shrink-0">
                    <p className="cv-text-gradient text-3xl font-extrabold leading-none">
                      {rating}
                    </p>
                    <div className="flex justify-end mt-1">
                      <Stars value={rating} size="w-3.5 h-3.5" empty="text-slate-300" />
                    </div>
                    <p className="text-[11px] text-[var(--cv-neutral-mid)] mt-1">
                      {reviews.length} reviews
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="rounded-xl bg-[var(--cv-accent-light)] border border-orange-100 p-4">
                    <ReviewForm
                      counsellorId={mentor._id}
                      onSuccess={refreshReviews}
                    />
                  </div>

                  <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2">
                    {reviews.length === 0 ? (
                      <div className="text-center py-12 rounded-xl bg-[var(--cv-neutral-light)] border border-dashed border-slate-200">
                        <p className="text-sm text-slate-500">
                          No reviews yet. Share your experience first.
                        </p>
                      </div>
                    ) : (
                      reviews.map((rev) => {
                        const guest = sanitizeText(rev.guestName || "Anonymous", 60);
                        return (
                          <article
                            key={rev._id}
                            className="p-4 rounded-xl bg-[var(--cv-neutral-light)] border border-slate-100"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div className="flex items-center gap-3">
                                <span className="cv-icon-gradient w-8 h-8 text-xs font-bold">
                                  {guest.charAt(0).toUpperCase()}
                                </span>
                                <div>
                                  <p className="font-bold text-xs text-slate-800">
                                    {guest}
                                  </p>
                                  <Stars
                                    value={rev.rating}
                                    size="w-3 h-3"
                                    empty="text-slate-300"
                                  />
                                </div>
                              </div>
                              <time className="text-[10px] text-slate-400">
                                {new Date(rev.createdAt).toLocaleDateString(
                                  "en-IN",
                                  { year: "numeric", month: "short", day: "numeric" }
                                )}
                              </time>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed border-l-2 border-[var(--cv-accent)] pl-3">
                              {sanitizeText(rev.comment || "", 500)}
                            </p>
                          </article>
                        );
                      })
                    )}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* RIGHT: facts card */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-[var(--cv-neutral-border)] sticky top-20 overflow-hidden">
              <div
                className="h-1.5"
                style={{ background: "var(--cv-grad-horizontal)" }}
              />
              <div className="p-6">
                <h3 className="text-base font-bold text-[var(--cv-neutral-dark)] mb-6 pb-3 border-b border-slate-100">
                  Facts about {firstName}
                </h3>

                <dl className="space-y-4 text-sm">
                  {[
                    { icon: MapPin, label: "Location", value: location },
                    { icon: GraduationCap, label: "Education", value: education },
                    { icon: Briefcase, label: "Experience", value: `${experience} years` },
                    { icon: Sparkles, label: "Response rate", value: "95%" },
                    { icon: Clock, label: "Avg. response", value: "10 min" },
                  ].map(({ icon: Icon, label, value }) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3"
                    >
                      <dt className="text-slate-500 flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-lg bg-[var(--cv-primary-light)] text-[var(--cv-primary)] flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4" />
                        </span>
                        {label}
                      </dt>
                      <dd className="font-semibold text-slate-800 text-right">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>

                {mobileNumber && (
                  <a
                    href={`tel:${mobileNumber}`}
                    className="cv-btn-cta mt-6 w-full py-2.5 px-4 text-sm flex items-center justify-center gap-2"
                  >
                    <Phone className="w-4 h-4" />
                    Talk to {firstName}
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ═══ Mobile sticky CTA bar ═══ */}
      {mobileNumber && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-white/95 backdrop-blur border-t border-[var(--cv-neutral-border)] p-3 flex gap-3">
          <a
            href={`tel:${mobileNumber}`}
            className="cv-btn-cta flex-1 py-2.5 text-sm flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Call
          </a>
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            WhatsApp
          </a>
        </div>
      )}

      <Footer />
    </div>
  );
}