// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import Script from "next/script";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// // ✅ team now arrives as a prop, already fetched and sorted on the server.
// // This component is purely presentational/interactive — no fetch, no
// // loading state, no "Loading expert team..." text that could leak into
// // what crawlers see.
// export default function TeamSliderClient({ team = [] }) {
//   // JSON-LD: Person structured data for team members
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "CareerVidya Expert Career Counselling Team",
//     description:
//       "Meet our expert career counsellors at CareerVidya with years of experience in guiding students.",
//     numberOfItems: team.length,
//     itemListElement: team.map((member, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Person",
//         name: member.name,
//         jobTitle: member.designation || "Expert Counselor",
//         description: `${member.experience || 0}+ years of experience in career counselling`,
//         worksFor: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   if (team.length === 0) {
//     // ✅ No fake "Loading..." state — if there's genuinely no data, render
//     // nothing rather than a placeholder a crawler could capture mid-fetch.
//     return null;
//   }

//   return (
//     <>
//       <Script
//         id="team-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <section
//         className="relative bg-[#001a41] py-16 md:py-24 overflow-hidden"
//         aria-label="Expert Career Counselling Team at CareerVidya"
//       >
//         <div className="max-w-[95%] xl:max-w-[1450px] mx-auto px-4 md:px-8">

//           {/*
//             h2 use kiya hai kyunki yeh section component hai —
//             page ke layout.js / page.js mein h1 hona chahiye jaise:
//             "Career Counselling by India's Top Experts | CareerVidya"
//             Agar yeh page ka single component hai toh h2 → h1 kar do.
//             (Confirmed correct: this renders on the homepage, which already
//             has its own h1 in page.js — keeping this as h2 avoids a
//             duplicate-H1 page.)
//           */}
//           <h2 className="text-center text-2xl md:text-4xl font-bold text-white mb-12 md:mb-16 uppercase tracking-wide">
//             Meet Our Expert Team
//           </h2>

//           <div className="flex items-center gap-2 md:gap-4">

//             {/* Left Navigation */}
//             <button
//               className="swiper-button-prev-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20"
//               aria-label="Previous team member"
//             >
//               <ChevronLeft size={24} />
//             </button>

//             <div className="flex-grow overflow-hidden px-2">
//               <Swiper
//                 modules={[Navigation, Pagination, Autoplay]}
//                 spaceBetween={25}
//                 slidesPerView={1}
//                 autoHeight={false}
//                 navigation={{
//                   nextEl: ".swiper-button-next-team",
//                   prevEl: ".swiper-button-prev-team",
//                 }}
//                 pagination={{ clickable: true, el: ".custom-pagination" }}
//                 autoplay={{ delay: 4500, disableOnInteraction: false }}
//                 breakpoints={{
//                   640: { slidesPerView: 2 },
//                   1024: { slidesPerView: 3 },
//                   1280: { slidesPerView: 4 },
//                 }}
//                 className="pb-14 !flex"
//               >
//                 {team.map((member, idx) => {
//                   // ✅ FIX: fall back to a generic label if `name` is ever
//                   // empty (e.g. a CMS data-entry gap), so alt text never
//                   // renders as a broken " - Expert Counselor at CareerVidya"
//                   // with a leading dash and no name.
//                   const displayName = member.name || "Career Counselor";

//                   return (
//                     <SwiperSlide key={member._id ?? idx} className="!h-auto flex">
//                       <Link
//                         href={`/teamexpand?id=${member._id}`}
//                         className="bg-white rounded-2xl p-6 text-center shadow-2xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center w-full h-full group"
//                         aria-label={`View profile of ${displayName}`}
//                       >
//                         {/* Round Image */}
//                         <div className="flex justify-center mb-6 flex-shrink-0">
//                           <div className="w-36 h-36 md:w-40 md:h-40 rounded-full border-[6px] border-gray-100 shadow-md overflow-hidden group-hover:border-[#3498db]/30 transition-all duration-500">
//                             <Image
//                               src={member.imageUrl}
//                               alt={`${displayName} - ${member.designation || "Expert Counselor"} at CareerVidya`}
//                               width={160}
//                               height={160}
//                               className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
//                               loading={idx < 4 ? "eager" : "lazy"}
//                               sizes="(max-width: 640px) 144px, 160px"
//                             />
//                           </div>
//                         </div>

//                         {/* Info Section */}
//                         <div className="flex flex-col flex-grow items-center w-full">
//                           <h3 className="text-xl font-bold text-[#001a41] mb-1 line-clamp-1">
//                             {displayName}
//                           </h3>
//                           <p className="text-[#3498db] font-semibold mb-3 text-sm uppercase tracking-wide">
//                             {member.designation || "Expert Counselor"}
//                           </p>

//                           <div className="bg-blue-50 text-[#05347f] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-auto">
//                             {member.experience || 0}+ Years Experience
//                           </div>
//                         </div>

//                         {/* Consult Now Button */}
//                         <div className="w-full py-3 mt-auto rounded-xl border-2 border-[#05347f] text-[#05347f] font-bold text-sm hover:bg-[#c15304] hover:border-[#c15304] hover:text-white transition-all duration-300 flex-shrink-0 text-center">
//                           Consult Now
//                         </div>
//                       </Link>
//                     </SwiperSlide>
//                   );
//                 })}
//               </Swiper>
//             </div>

//             {/* Right Navigation */}
//             <button
//               className="swiper-button-next-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20"
//               aria-label="Next team member"
//             >
//               <ChevronRight size={24} />
//             </button>
//           </div>

//           <div className="custom-pagination flex justify-center mt-6" aria-hidden="true" />
//         </div>

//         <style jsx global>{`
//           .swiper-wrapper {
//             display: flex !important;
//           }
//           .swiper-slide {
//             height: auto !important;
//             display: flex !important;
//           }
//           .custom-pagination .swiper-pagination-bullet {
//             background: rgba(255, 255, 255, 0.3) !important;
//             opacity: 1;
//             margin: 0 5px !important;
//             width: 8px;
//             height: 8px;
//           }
//           .custom-pagination .swiper-pagination-bullet-active {
//             background: #3498db !important;
//             width: 24px;
//             border-radius: 4px;
//           }
//         `}</style>
//       </section>
//     </>
//   );
// }


// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import Script from "next/script";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import {
//   ChevronLeft,
//   ChevronRight,
//   ArrowRight,
//   Award,
//   ChevronRightIcon,
// } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// export default function TeamSliderClient({ team = [] }) {
//   const SHOW_LIMIT = 6;

//   const displayedTeam = team.slice(0, SHOW_LIMIT);
//   const hasMoreMembers = team.length > SHOW_LIMIT;

//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "ItemList",
//     name: "CareerVidya Expert Career Counselling Team",
//     description: "Meet our expert career counsellors at CareerVidya.",
//     numberOfItems: team.length,
//     itemListElement: team.map((member, i) => ({
//       "@type": "ListItem",
//       position: i + 1,
//       item: {
//         "@type": "Person",
//         name: member.name,
//         jobTitle: member.designation || "Expert Counselor",
//         description: `${
//           member.experience || 0
//         }+ years of experience in career counselling`,
//         worksFor: {
//           "@type": "Organization",
//           name: "CareerVidya",
//         },
//       },
//     })),
//   };

//   if (team.length === 0) return null;

//   // Team Member Card
//   const renderCard = (member, idx) => {
//     const displayName = member.name || "Career Counselor";

//     return (
//       <Link
//         key={member._id ?? idx}
//         href="/teamexpand"
//         className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 hover:border-[#3498db]/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center w-full h-full overflow-hidden text-center shadow-lg hover:shadow-2xl hover:-translate-y-2"
//         aria-label={`View ${displayName} team page`}
//       >
//         {/* Card Background Subtle Accent */}
//         <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3498db]/10 rounded-full blur-2xl group-hover:bg-[#3498db]/20 transition-all duration-500" />

//         {/* Image Container */}
//         <div className="relative mb-4 flex-shrink-0 mt-2">
//           <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md group-hover:border-[#3498db] transition-all duration-300">
//             <Image
//               src={member.imageUrl}
//               alt={`${displayName} - ${
//                 member.designation || "Expert Counselor"
//               } at CareerVidya`}
//               width={128}
//               height={128}
//               className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
//               loading={idx < 4 ? "eager" : "lazy"}
//               sizes="(max-width: 640px) 112px, 128px"
//             />
//           </div>

//           {/* Experience Badge */}
//           <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-[#001a41] border border-white/20 text-[#3498db] text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
//             <Award size={12} className="text-[#3498db]" />

//             <span>{member.experience || 0}+ Yrs Exp</span>
//           </div>
//         </div>

//         {/* Counselor Info */}
//         <div className="flex flex-col flex-grow items-center justify-between w-full mt-2">
//           <div>
//             <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-[#3498db] transition-colors line-clamp-1">
//               {displayName}
//             </h3>

//             <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-4">
//               {member.designation || "Expert Counselor"}
//             </p>
//           </div>

//           {/* Action Button */}
//           <div className="w-full mt-auto py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#3498db] text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#3498db]">
//             <span>Career Advisor</span>

//             <ChevronRightIcon
//               size={14}
//               className="group-hover:translate-x-1 transition-transform"
//             />
//           </div>
//         </div>
//       </Link>
//     );
//   };

//   return (
//     <>
//       {/* SEO JSON-LD */}
//       <Script
//         id="team-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{
//           __html: JSON.stringify(jsonLd),
//         }}
//       />

//       <section
//         className="relative bg-[#001a41] py-16 md:py-20 overflow-hidden"
//         aria-label="Expert Career Counselling Team at CareerVidya"
//       >
//         <div className="max-w-[95%] xl:max-w-[1350px] mx-auto px-4 md:px-8">
//           {/* Section Heading */}
//           <div className="text-center mb-10 md:mb-14">
//             <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide">
//               Meet Our Expert Team
//             </h2>

//             <div className="w-16 h-1 bg-[#3498db] mx-auto mt-3 rounded-full" />
//           </div>

//           {/* Slider */}
//           {hasMoreMembers ? (
//             <div className="flex items-center gap-2 md:gap-4">
//               {/* Previous Button */}
//               <button
//                 className="swiper-button-prev-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20"
//                 aria-label="Previous team member"
//               >
//                 <ChevronLeft size={24} />
//               </button>

//               <div className="flex-grow overflow-hidden px-2">
//                 <Swiper
//                   modules={[Navigation, Pagination, Autoplay]}
//                   spaceBetween={20}
//                   slidesPerView={1}
//                   navigation={{
//                     nextEl: ".swiper-button-next-team",
//                     prevEl: ".swiper-button-prev-team",
//                   }}
//                   pagination={{
//                     clickable: true,
//                     el: ".custom-pagination",
//                   }}
//                   autoplay={{
//                     delay: 4500,
//                     disableOnInteraction: false,
//                   }}
//                   breakpoints={{
//                     640: {
//                       slidesPerView: 2,
//                     },
//                     1024: {
//                       slidesPerView: 3,
//                     },
//                     1280: {
//                       slidesPerView: 4,
//                     },
//                   }}
//                   className="pb-12 !flex"
//                 >
//                   {displayedTeam.map((member, idx) => (
//                     <SwiperSlide
//                       key={member._id ?? idx}
//                       className="!h-auto flex"
//                     >
//                       {renderCard(member, idx)}
//                     </SwiperSlide>
//                   ))}
//                 </Swiper>
//               </div>

//               {/* Next Button */}
//               <button
//                 className="swiper-button-next-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20"
//                 aria-label="Next team member"
//               >
//                 <ChevronRight size={24} />
//               </button>
//             </div>
//           ) : (
//             /* Grid */
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {displayedTeam.map((member, idx) =>
//                 renderCard(member, idx)
//               )}
//             </div>
//           )}

//           {/* Pagination */}
//           {hasMoreMembers && (
//             <div
//               className="custom-pagination flex justify-center mt-2"
//               aria-hidden="true"
//             />
//           )}

//           {/* View All Experts */}
//           <div className="text-center mt-10 md:mt-12">
//             <Link
//               href="/teamexpand"
//               className="inline-flex items-center gap-2 bg-[#c15304] text-white font-bold text-sm md:text-base px-8 py-2.5 rounded shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
//             >
//               <span>View All Experts</span>
//               <ArrowRight size={18} />
//             </Link>
//           </div>
//         </div>

//         {/* Swiper Custom CSS */}
//         <style jsx global>{`
//           .swiper-wrapper {
//             display: flex !important;
//           }

//           .swiper-slide {
//             height: auto !important;
//             display: flex !important;
//           }

//           .custom-pagination .swiper-pagination-bullet {
//             background: rgba(255, 255, 255, 0.3) !important;
//             opacity: 1;
//             margin: 0 4px !important;
//             width: 8px;
//             height: 8px;
//             transition: all 0.3s ease;
//           }

//           .custom-pagination .swiper-pagination-bullet-active {
//             background: #3498db !important;
//             width: 20px;
//             border-radius: 4px;
//           }
//         `}</style>
//       </section>
//     </>
//   );
// }



"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { useRef } from "react";
import {
  ArrowRight,
  Award,
  GraduationCap,
  Star,
  Quote,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  BadgeCheck,
} from "lucide-react";

export default function TeamSliderClient({ team = [] }) {
  const scrollRef = useRef(null);
  const SHOW_LIMIT = 8;
  const displayedTeam = team.slice(0, SHOW_LIMIT);
  const hasMoreMembers = team.length > SHOW_LIMIT;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CareerVidya Expert Career Counselling Team",
    numberOfItems: team.length,
    itemListElement: team.map((member, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.designation || "Expert Counselor",
        worksFor: { "@type": "Organization", name: "CareerVidya" },
      },
    })),
  };

  if (team.length === 0) return null;

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };
  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  return (
    <>
      <Script
        id="team-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1628] via-[#0f1f3d] to-[#0a1628] py-14 md:py-20">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-[#1e5aad]/20 blur-[120px]" />
        <div className="absolute -bottom-32 right-1/4 h-96 w-96 rounded-full bg-[#f5a623]/10 blur-[120px]" />

        <div className="relative mx-auto max-w-[95%] px-4 md:px-8 xl:max-w-[1400px]">
          {/* ===== HEADING ===== */}
          <div className="mb-6 text-center md:mb-8">
            <h2 className="text-2xl font-bold text-white sm:text-3xl md:text-4xl lg:text-5xl">
              Meet Our{" "}
              <span className="bg-gradient-to-r from-[#3b82f6] to-[#f5a623] bg-clip-text text-transparent">
                Expert Team
              </span>
            </h2>
            <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-gradient-to-r from-[#3b82f6] to-[#f5a623]" />
          </div>

          {/* ===== SCROLL CONTROLS ===== */}
          <div className="mb-4 flex items-center justify-end gap-2 md:mb-6 md:gap-3">
            <button
              onClick={scrollLeft}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-[#3b82f6] hover:bg-[#1e5aad] md:h-12 md:w-12"
              aria-label="Scroll left"
            >
              <ChevronLeft size={18} className="md:hidden" />
              <ChevronLeft size={20} className="hidden md:block" />
            </button>
            <button
              onClick={scrollRight}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white backdrop-blur-sm transition-all hover:border-[#3b82f6] hover:bg-[#1e5aad] md:h-12 md:w-12"
              aria-label="Scroll right"
            >
              <ChevronRight size={18} className="md:hidden" />
              <ChevronRight size={20} className="hidden md:block" />
            </button>
          </div>

          {/* ===== CARDS SCROLLER ===== */}
          <div
            ref={scrollRef}
            className="scrollbar-hide flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto pb-6 md:gap-5"
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {displayedTeam.map((member, idx) => {
              const displayName = member.name || "Career Counselor";

              return (
                <Link
                  key={member._id ?? idx}
                  href="/teamexpand"
                  className="group relative flex h-[400px] w-[240px] flex-shrink-0 snap-start sm:w-[260px] md:h-[440px] md:w-[270px]"
                >
                  <div className="relative h-full w-full">
                    <div className="absolute -inset-[1px] rounded-[24px] bg-gradient-to-br from-[#3b82f6]/40 via-transparent to-[#f5a623]/30 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="relative flex h-full w-full flex-col overflow-hidden rounded-[24px] border border-white/[0.08] bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-xl transition-all duration-500 group-hover:border-white/20">
                      {/* ===== IMAGE ===== */}
                      <div className="relative h-[200px] w-full flex-shrink-0 overflow-hidden md:h-[230px]">
                        <Image
                          src={member.imageUrl}
                          alt={`${displayName} - ${member.designation || "Expert Counselor"}`}
                          fill
                          className="object-cover object-top transition-transform duration-700 group-hover:scale-110"
                          loading={idx < 4 ? "eager" : "lazy"}
                          sizes="(max-width: 640px) 240px, (max-width: 768px) 260px, 270px"
                        />

                        {/* Bahut halka gradient sirf 16px neeche */}
                        <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#0f1f3d]/60 to-transparent" />

                        {/* Experience Chip */}
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full border border-[#f5a623]/30 bg-[#0a1628]/80 px-2 py-0.5 backdrop-blur-md md:px-2.5 md:py-1">
                          <Award size={10} className="text-[#f5a623] md:hidden" />
                          <Award size={11} className="hidden text-[#f5a623] md:block" />
                          <span className="text-[9px] font-bold text-[#f5a623] md:text-[10px]">
                            {member.experience || 0}+ YRS
                          </span>
                        </div>

                        {/* Verified Badge */}
                        <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#1e5aad] shadow-lg shadow-blue-500/30 md:h-6 md:w-6">
                          <BadgeCheck size={11} className="text-white md:hidden" />
                          <BadgeCheck size={12} className="hidden text-white md:block" />
                        </div>

                        {/* Stars */}
                        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={8}
                              className="fill-[#f5a623] text-[#f5a623] md:hidden"
                            />
                          ))}
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={`md-${i}`}
                              size={9}
                              className="hidden fill-[#f5a623] text-[#f5a623] md:block"
                            />
                          ))}
                        </div>
                      </div>

                      {/* ===== CONTENT ===== */}
                      <div className="flex flex-1 flex-col justify-end px-3 pb-3 pt-2 md:px-4 md:pb-4">
                        <h3 className="line-clamp-1 text-[14px] font-bold leading-tight text-white md:text-[15px]">
                          {displayName}
                        </h3>

                        <div className="mt-1 flex items-center gap-1.5">
                          <GraduationCap
                            size={10}
                            className="flex-shrink-0 text-[#3b82f6] md:hidden"
                          />
                          <GraduationCap
                            size={11}
                            className="hidden flex-shrink-0 text-[#3b82f6] md:block"
                          />
                          <p className="line-clamp-1 text-[10px] font-medium text-slate-400 md:text-[11px]">
                            {member.designation || "Expert Counselor"}
                          </p>
                        </div>

                        <div className="relative mt-2 rounded-lg border border-white/[0.06] bg-white/[0.03] px-2.5 py-1.5 md:px-3 md:py-2">
                          <Quote
                            size={10}
                            className="absolute -top-1.5 left-2 text-[#f5a623] md:hidden"
                          />
                          <Quote
                            size={11}
                            className="absolute -top-1.5 left-2.5 hidden text-[#f5a623] md:block"
                          />
                          <p className="line-clamp-2 text-[9px] leading-snug text-slate-400 italic md:text-[10px]">
                            "Guiding students to find their true career direction."
                          </p>
                        </div>

                        <div className="mt-2 flex items-center justify-between md:mt-2.5">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-[#1e5aad] to-[#3b82f6] md:h-5 md:w-5">
                              <Sparkles size={9} className="text-white md:hidden" />
                              <Sparkles size={10} className="hidden text-white md:block" />
                            </div>
                            <span className="text-[8px] font-semibold uppercase tracking-wider text-slate-500 md:text-[9px]">
                              Career Advisor
                            </span>
                          </div>

                          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-[#3b82f6] group-hover:bg-[#1e5aad] md:h-7 md:w-7">
                            <ArrowRight
                              size={12}
                              className="text-white transition-transform group-hover:translate-x-0.5 md:hidden"
                            />
                            <ArrowRight
                              size={13}
                              className="hidden text-white transition-transform group-hover:translate-x-0.5 md:block"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

            {/* View All Card */}
            {hasMoreMembers && (
              <Link
                href="/teamexpand"
                className="group flex h-[400px] w-[220px] flex-shrink-0 snap-start flex-col items-center justify-center gap-3 rounded-[24px] border border-dashed border-white/20 bg-white/[0.02] transition-all duration-300 hover:border-[#3b82f6] hover:bg-[#1e5aad]/10 sm:w-[240px] md:h-[440px] md:w-[250px]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#1e5aad] to-[#3b82f6] transition-transform duration-300 group-hover:scale-110 md:h-14 md:w-14">
                  <ArrowRight size={20} className="text-white md:hidden" />
                  <ArrowRight size={22} className="hidden text-white md:block" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-bold text-white md:text-base">
                    View All
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400 md:text-[11px]">
                    {team.length}+ Experts
                  </p>
                </div>
              </Link>
            )}
          </div>
        </div>

        <style jsx global>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </section>
    </>
  );
}