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


"use client";

import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight, Award, ChevronRightIcon } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TeamSliderClient({ team = [] }) {
  const SHOW_LIMIT = 6;
  const displayedTeam = team.slice(0, SHOW_LIMIT);
  const hasMoreMembers = team.length > SHOW_LIMIT;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "CareerVidya Expert Career Counselling Team",
    description: "Meet our expert career counsellors at CareerVidya.",
    numberOfItems: team.length,
    itemListElement: team.map((member, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Person",
        name: member.name,
        jobTitle: member.designation || "Expert Counselor",
        description: `${member.experience || 0}+ years of experience in career counselling`,
        worksFor: {
          "@type": "Organization",
          name: "CareerVidya",
        },
      },
    })),
  };

  if (team.length === 0) return null;

  // 🌟 NEW MODERN CARD LAYOUT
  const renderCard = (member, idx) => {
    const displayName = member.name || "Career Counselor";

    return (
      <Link
        key={member._id ?? idx}
        href={`/teamexpand?id=${member._id}`}
        className="group relative bg-white/5 backdrop-blur-md rounded-3xl p-5 border border-white/10 hover:border-[#3498db]/50 hover:bg-white/10 transition-all duration-300 flex flex-col items-center w-full h-full overflow-hidden text-center shadow-lg hover:shadow-2xl hover:-translate-y-2"
        aria-label={`View profile of ${displayName}`}
      >
        {/* Card Background Subtle Accent */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#3498db]/10 rounded-full blur-2xl group-hover:bg-[#3498db]/20 transition-all duration-500" />

        {/* Image Container with Floating Experience Tag */}
        <div className="relative mb-4 flex-shrink-0 mt-2">
          <div className="w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden border-2 border-white/20 shadow-md group-hover:border-[#3498db] transition-all duration-300">
            <Image
              src={member.imageUrl}
              alt={`${displayName} - ${member.designation || "Expert Counselor"} at CareerVidya`}
              width={128}
              height={128}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading={idx < 4 ? "eager" : "lazy"}
              sizes="(max-width: 640px) 112px, 128px"
            />
          </div>

          {/* Floating Experience Badge */}
          <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-[#001a41] border border-white/20 text-[#3498db] text-[11px] font-bold px-3 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1">
            <Award size={12} className="text-[#3498db]" />
            <span>{member.experience || 0}+ Yrs Exp</span>
          </div>
        </div>

        {/* Counselor Info */}
        <div className="flex flex-col flex-grow items-center justify-between w-full mt-2">
          <div>
            <h3 className="text-lg font-bold text-white mb-0.5 group-hover:text-[#3498db] transition-colors line-clamp-1">
              {displayName}
            </h3>
            <p className="text-gray-300 text-xs font-medium uppercase tracking-wider mb-4">
              {member.designation || "Expert Counselor"}
            </p>
          </div>

          {/* Action Link Button */}
          <div className="w-full mt-auto py-2.5 px-4 rounded-xl bg-white/10 hover:bg-[#3498db] text-white text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 border border-white/10 group-hover:border-[#3498db]">
            <span>Book Consultation</span>
            <ChevronRightIcon size={14} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    );
  };

  return (
    <>
      <Script
        id="team-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="relative bg-[#001a41] py-16 md:py-20 overflow-hidden"
        aria-label="Expert Career Counselling Team at CareerVidya"
      >
        <div className="max-w-[95%] xl:max-w-[1350px] mx-auto px-4 md:px-8">
          
          <div className="text-center mb-10 md:mb-14">
            <h2 className="text-2xl md:text-4xl font-bold text-white uppercase tracking-wide">
              Meet Our Expert Team
            </h2>
            <div className="w-16 h-1 bg-[#3498db] mx-auto mt-3 rounded-full" />
          </div>

          {/* Dynamic Slider vs Grid Render */}
          {hasMoreMembers ? (
            <div className="flex items-center gap-2 md:gap-4">
              <button
                className="swiper-button-prev-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20"
                aria-label="Previous team member"
              >
                <ChevronLeft size={24} />
              </button>

              <div className="flex-grow overflow-hidden px-2">
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  spaceBetween={20}
                  slidesPerView={1}
                  navigation={{
                    nextEl: ".swiper-button-next-team",
                    prevEl: ".swiper-button-prev-team",
                  }}
                  pagination={{ clickable: true, el: ".custom-pagination" }}
                  autoplay={{ delay: 4500, disableOnInteraction: false }}
                  breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                    1280: { slidesPerView: 4 },
                  }}
                  className="pb-12 !flex"
                >
                  {displayedTeam.map((member, idx) => (
                    <SwiperSlide key={member._id ?? idx} className="!h-auto flex">
                      {renderCard(member, idx)}
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>

              <button
                className="swiper-button-next-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20"
                aria-label="Next team member"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {displayedTeam.map((member, idx) => renderCard(member, idx))}
            </div>
          )}

          {hasMoreMembers && (
            <div className="custom-pagination flex justify-center mt-2" aria-hidden="true" />
          )}

          {/* View All Experts CTA */}
          <div className="text-center mt-10 md:mt-12">
            <Link
              href="/teamexpand"
              className="inline-flex items-center gap-2 bg-[#c15304]  text-white font-bold text-sm md:text-base px-8 py-2.5 rounded shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <span>View All Experts</span>
              <ArrowRight size={18} />
            </Link>
          </div>

        </div>

        <style jsx global>{`
          .swiper-wrapper {
            display: flex !important;
          }
          .swiper-slide {
            height: auto !important;
            display: flex !important;
          }
          .custom-pagination .swiper-pagination-bullet {
            background: rgba(255, 255, 255, 0.3) !important;
            opacity: 1;
            margin: 0 4px !important;
            width: 8px;
            height: 8px;
            transition: all 0.3s ease;
          }
          .custom-pagination .swiper-pagination-bullet-active {
            background: #3498db !important;
            width: 20px;
            border-radius: 4px;
          }
        `}</style>
      </section>
    </>
  );
}