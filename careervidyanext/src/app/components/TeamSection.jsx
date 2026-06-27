


// // "use client";

// // import { useEffect, useState } from "react";
// // import api from "@/utlis/api.js";
// // import { Swiper, SwiperSlide } from "swiper/react";
// // import { Navigation, Pagination, Autoplay } from "swiper/modules";
// // import { ChevronLeft, ChevronRight } from "lucide-react";

// // // Swiper CSS
// // import "swiper/css";
// // import "swiper/css/navigation";
// // import "swiper/css/pagination";

// // export default function TeamSlider() {
// //   const [team, setTeam] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const BASE_URL = "https://api.careervidya.in";

// //   useEffect(() => {
// //     const fetchTeam = async () => {
// //       try {
// //         const res = await api.get("/api/v1/team");
// //         let data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        
// //         // Sorting Logic: Highest Experience First
// //         const sortedData = [...data].sort((a, b) => {
// //           const expA = parseInt(a.experience) || 0;
// //           const expB = parseInt(b.experience) || 0;
// //           return expB - expA;
// //         });

// //         setTeam(sortedData);
// //       } catch (err) {
// //         console.error("❌ Error fetching team members:", err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };
// //     fetchTeam();
// //   }, []);

// //   if (loading) {
// //     return (
// //       <div className="py-20 text-center text-gray-300 text-lg bg-[#001a41]">
// //         Loading expert team...
// //       </div>
// //     );
// //   }

// //   return (
// //     <section className="relative bg-[#001a41] py-16 md:py-24 overflow-hidden">
// //       <div className="max-w-[95%] xl:max-w-[1450px] mx-auto px-4 md:px-8">
        
// //         <h2 className="text-center text-2xl md:text-4xl font-bold text-white mb-12 md:mb-16 uppercase tracking-wide">
// //           Meet Our Expert Team
// //         </h2>

// //         <div className="flex items-center gap-2 md:gap-4">
          
// //           {/* Left Navigation */}
// //           <button className="swiper-button-prev-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20">
// //             <ChevronLeft size={24} />
// //           </button>

// //           <div className="flex-grow overflow-hidden px-2">
// //             <Swiper
// //               modules={[Navigation, Pagination, Autoplay]}
// //               spaceBetween={25}
// //               slidesPerView={1}
// //               // ✅ Ensuring all slides have the same height
// //               autoHeight={false}
// //               navigation={{
// //                 nextEl: ".swiper-button-next-team",
// //                 prevEl: ".swiper-button-prev-team",
// //               }}
// //               pagination={{ clickable: true, el: ".custom-pagination" }}
// //               autoplay={{ delay: 4500, disableOnInteraction: false }}
// //               breakpoints={{
// //                 640: { slidesPerView: 2 },
// //                 1024: { slidesPerView: 3 },
// //                 1280: { slidesPerView: 4 },
// //               }}
// //               className="pb-14 !flex" 
// //             >
// //               {team.map((member, idx) => {
// //                 const imageUrl = member.image
// //                   ? member.image.startsWith("http")
// //                     ? member.image
// //                     : `${BASE_URL}${member.image.startsWith("/") ? "" : "/"}${member.image}`
// //                   : "/fallback-avatar.png";

// //                 return (
// //                   <SwiperSlide key={member._id ?? idx} className="!h-auto flex">
// //                     {/* ✅ Wrapper div with h-full and flex-1 for equal height */}
// //                     <div 
// //                       className="bg-white rounded-2xl p-6 text-center shadow-2xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center w-full h-full cursor-pointer group"
// //                       onClick={() => (window.location.href = `/teamexpand?id=${member._id}`)}
// //                     >
// //                       {/* Round Image */}
// //                       <div className="flex justify-center mb-6 flex-shrink-0">
// //                         <div className="w-36 h-36 md:w-40 md:h-40 rounded-full border-[6px] border-gray-100 shadow-md overflow-hidden group-hover:border-[#3498db]/30 transition-all duration-500">
// //                           <img
// //                             src={imageUrl}
// //                             alt={member.name}
// //                             className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
// //                             loading="lazy"
// //                           />
// //                         </div>
// //                       </div>

// //                       {/* Info Section */}
// //                       <div className="flex flex-col flex-grow items-center w-full">
// //                         <h3 className="text-xl font-bold text-[#001a41] mb-1 line-clamp-1">
// //                           {member.name}
// //                         </h3>
// //                         <p className="text-[#3498db] font-semibold mb-3 text-sm uppercase tracking-wide">
// //                           {member.designation || "Expert Counselor"}
// //                         </p>
                        
// //                         <div className="bg-blue-50 text-[#05347f] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-auto">
// //                           {member.experience || 0}+ Years Experience
// //                         </div>
// //                       </div>

// //                       {/* Consult Now Button */}
// //                      {/* Consult Now Button */}
// // <button className="w-full py-3 mt-auto rounded-xl border-2 border-[#05347f] text-[#05347f] font-bold text-sm hover:bg-[#c15304] hover:border-[#c15304] hover:text-white transition-all duration-300 flex-shrink-0">
// //   Consult Now
// // </button>
// //                     </div>
// //                   </SwiperSlide>
// //                 );
// //               })}
// //             </Swiper>
// //           </div>

// //           {/* Right Navigation */}
// //           <button className="swiper-button-next-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20">
// //             <ChevronRight size={24} />
// //           </button>
// //         </div>

// //         <div className="custom-pagination flex justify-center mt-6"></div>
// //       </div>

// //       <style jsx global>{`
// //         /* Making Swiper slides occupy full height of the container */
// //         .swiper-wrapper {
// //           display: flex !important;
// //         }
// //         .swiper-slide {
// //           height: auto !important;
// //           display: flex !important;
// //         }
// //         .custom-pagination .swiper-pagination-bullet {
// //           background: rgba(255, 255, 255, 0.3) !important;
// //           opacity: 1;
// //           margin: 0 5px !important;
// //           width: 8px;
// //           height: 8px;
// //         }
// //         .custom-pagination .swiper-pagination-bullet-active {
// //           background: #3498db !important;
// //           width: 24px;
// //           border-radius: 4px;
// //         }
// //       `}</style>
// //     </section>
// //   );
// // }



// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import Script from "next/script";
// import api from "@/utlis/api.js";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import { ChevronLeft, ChevronRight } from "lucide-react";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";

// export default function TeamSlider() {
//   const [team, setTeam] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const BASE_URL = "https://api.careervidya.in";

//   useEffect(() => {
//     const fetchTeam = async () => {
//       try {
//         const res = await api.get("/api/v1/team");
//         let data = Array.isArray(res.data) ? res.data : res.data?.data || [];

//         const sortedData = [...data].sort((a, b) => {
//           const expA = parseInt(a.experience) || 0;
//           const expB = parseInt(b.experience) || 0;
//           return expB - expA;
//         });

//         setTeam(sortedData);
//       } catch (err) {
//         console.error("Error fetching team members:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTeam();
//   }, []);

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

//   if (loading) {
//     return (
//       <section
//         className="relative bg-[#001a41] py-16 md:py-24"
//         aria-label="Expert Career Counselling Team"
//       >
//         <p role="status" className="py-20 text-center text-gray-300 text-lg">
//           Loading expert team...
//         </p>
//       </section>
//     );
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
//                   const imageUrl = member.image
//                     ? member.image.startsWith("http")
//                       ? member.image
//                       : `${BASE_URL}${member.image.startsWith("/") ? "" : "/"}${member.image}`
//                     : "/fallback-avatar.png";

//                   return (
//                     <SwiperSlide key={member._id ?? idx} className="!h-auto flex">
//                       <Link
//                         href={`/teamexpand?id=${member._id}`}
//                         className="bg-white rounded-2xl p-6 text-center shadow-2xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center w-full h-full group"
//                         aria-label={`View profile of ${member.name}`}
//                       >
//                         {/* Round Image */}
//                         <div className="flex justify-center mb-6 flex-shrink-0">
//                           <div className="w-36 h-36 md:w-40 md:h-40 rounded-full border-[6px] border-gray-100 shadow-md overflow-hidden group-hover:border-[#3498db]/30 transition-all duration-500">
//                             <Image
//                               src={imageUrl}
//                               alt={`${member.name} - ${member.designation || "Expert Counselor"} at CareerVidya`}
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
//                             {member.name}
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

// src/app/components/TeamSection.jsx (server component)
// ✅ Fetches team data on the server so the very first HTML response
// already contains real team member cards — Google never sees
// "Loading expert team..." again.

import TeamSliderClient from "./TeamSliderClient.jsx";
import { serverFetch, resolveImageUrl } from "@/utlis/serverFetch";

async function getTeam() {
  const { ok, data } = await serverFetch("/api/v1/team", {
    next: { revalidate: 300 }, // ISR: refresh every 5 minutes
  });

  if (!ok) return [];

  let team = Array.isArray(data) ? data : data?.data || [];

  team.sort((a, b) => {
    const expA = parseInt(a.experience) || 0;
    const expB = parseInt(b.experience) || 0;
    return expB - expA;
  });

  // ✅ Resolve image URLs on the server — same centralized pattern as
  // universities/courses. The client component never needs BASE_URL.
  return team.map((member) => ({
    ...member,
    imageUrl: resolveImageUrl(member.image, "/fallback-avatar.png"),
  }));
}

export default async function TeamSection() {
  const team = await getTeam();
  return <TeamSliderClient team={team} />;
}