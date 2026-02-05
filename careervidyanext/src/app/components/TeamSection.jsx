// "use client";

// import { useEffect, useState } from "react";
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
//         const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
//         setTeam(data);
//       } catch (err) {
//         console.error("❌ Error fetching team members:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchTeam();
//   }, []);

//   if (loading) {
//     return (
//       <div className="py-20 text-center text-gray-200 text-lg bg-[#000a1f]">
//         Loading team members...
//       </div>
//     );
//   }

//   if (!team.length) {
//     return (
//       <div className="py-20 text-center text-gray-200 text-lg bg-[#000a1f]">
//         No team members available.
//       </div>
//     );
//   }

//   return (
//     <section className="relative bg-[#000a1f] py-16 md:py-20">
//       <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10 md:mb-14">
//         Meet Our Expert Team
//       </h2>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <Swiper
//           modules={[Navigation, Pagination, Autoplay]}
//           spaceBetween={25}
//           slidesPerView={4}
//           navigation={{
//             nextEl: ".swiper-button-next-custom",
//             prevEl: ".swiper-button-prev-custom",
//           }}
//           pagination={{ clickable: true }}
//           autoplay={{ delay: 3500, disableOnInteraction: false }}
//           breakpoints={{
//             320: { slidesPerView: 1, spaceBetween: 20 },
//             480: { slidesPerView: 1.2, spaceBetween: 20 },
//             640: { slidesPerView: 2, spaceBetween: 20 },
//             768: { slidesPerView: 2, spaceBetween: 25 },
//             1024: { slidesPerView: 3, spaceBetween: 25 },
//             1280: { slidesPerView: 4, spaceBetween: 30 },
//             1536: { slidesPerView: 5, spaceBetween: 30 }, // BIG DESKTOP (2xl)
//           }}
//           className="pb-12"
//         >
//           {team.map((member, idx) => {
//             const imageUrl = member.image
//               ? member.image.startsWith("http")
//                 ? member.image
//                 : `${BASE_URL}${member.image.startsWith("/") ? "" : "/"}${member.image}`
//               : "/fallback-avatar.png";

//             return (
//               <SwiperSlide key={member._id ?? idx}>
//                 {/* Entire Card Clickable */}
//                 <div
//                   onClick={() =>
//                     (window.location.href = `/teamexpand?id=${member._id}`)
//                   }
//                   className="bg-white cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl 
//                    transition-all duration-300 overflow-hidden relative flex flex-col items-center group"
//                 >
//                   {/* Image */}
//                   <div className="relative w-full h-64 sm:h-72 md:h-72 lg:h-80 overflow-hidden bg-white">
//                     <img
//                       src={imageUrl}
//                       alt={member.name}
//                       className="w-full h-full object-contain lg:object-cover 
//                        group-hover:scale-105 transition-transform duration-500"
//                       loading="lazy"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
//                   </div>

//                   {/* Info Card */}
//                   <div
//                     className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md 
//                      rounded-xl px-3 py-2 text-center shadow-md w-[88%] md:w-[85%]"
//                     onClick={(e) => e.stopPropagation()}
//                   >
//                     <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
//                       {member.name}
//                     </h3>
//                     <p className="text-[#0056B3] text-xs md:text-sm font-medium">
//                       {member.designation || "Team Member"}
//                     </p>

//                     {member.experience && (
//                       <p className="text-gray-400 text-[7px] mt-0.5">
//                         {member.experience} yrs experience
//                       </p>
//                     )}

//                     <button
//                       className="mt-1 bg-[#000a1f] text-white text-[10px] md:text-xs px-3 py-[3px] 
//                        rounded-full hover:bg-[#00143d] transition-all duration-300"
//                       onClick={() =>
//                         (window.location.href = `/teamexpand?id=${member._id}`)
//                       }
//                     >
//                       Consult Now
//                     </button>
//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>

//         {/* Navigation Buttons */}
//         <button
//           className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 
//            bg-white text-[#000a1f] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex 
//            items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200 
//            hover:scale-105 transition-all"
//         >
//           <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
//         </button>

//         <button
//           className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 
//            bg-white text-[#000a1f] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex 
//            items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200 
//            hover:scale-105 transition-all"
//         >
//           <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
//         </button>
//       </div>

//       <div className="text-center mt-10">
//         <button className="bg-white text-[#000a1f] font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-all">
//           View All →
//         </button>
//       </div>
//     </section>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Swiper CSS
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function TeamSlider() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const BASE_URL = "https://api.careervidya.in";

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const res = await api.get("/api/v1/team");
        let data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        
        // Sorting Logic: Highest Experience First
        const sortedData = [...data].sort((a, b) => {
          const expA = parseInt(a.experience) || 0;
          const expB = parseInt(b.experience) || 0;
          return expB - expA;
        });

        setTeam(sortedData);
      } catch (err) {
        console.error("❌ Error fetching team members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-300 text-lg bg-[#001a41]">
        Loading expert team...
      </div>
    );
  }

  return (
    <section className="relative bg-[#001a41] py-16 md:py-24 overflow-hidden">
      <div className="max-w-[95%] xl:max-w-[1450px] mx-auto px-4 md:px-8">
        
        <h2 className="text-center text-3xl md:text-5xl font-bold text-white mb-12 md:mb-16 uppercase tracking-wide">
          Meet Our Expert Team
        </h2>

        <div className="flex items-center gap-2 md:gap-4">
          
          {/* Left Navigation */}
          <button className="swiper-button-prev-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20">
            <ChevronLeft size={24} />
          </button>

          <div className="flex-grow overflow-hidden px-2">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={25}
              slidesPerView={1}
              // ✅ Ensuring all slides have the same height
              autoHeight={false}
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
              className="pb-14 !flex" 
            >
              {team.map((member, idx) => {
                const imageUrl = member.image
                  ? member.image.startsWith("http")
                    ? member.image
                    : `${BASE_URL}${member.image.startsWith("/") ? "" : "/"}${member.image}`
                  : "/fallback-avatar.png";

                return (
                  <SwiperSlide key={member._id ?? idx} className="!h-auto flex">
                    {/* ✅ Wrapper div with h-full and flex-1 for equal height */}
                    <div 
                      className="bg-white rounded-2xl p-6 text-center shadow-2xl hover:translate-y-[-8px] transition-all duration-300 flex flex-col items-center w-full h-full cursor-pointer group"
                      onClick={() => (window.location.href = `/teamexpand?id=${member._id}`)}
                    >
                      {/* Round Image */}
                      <div className="flex justify-center mb-6 flex-shrink-0">
                        <div className="w-36 h-36 md:w-40 md:h-40 rounded-full border-[6px] border-gray-100 shadow-md overflow-hidden group-hover:border-[#3498db]/30 transition-all duration-500">
                          <img
                            src={imageUrl}
                            alt={member.name}
                            className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      </div>

                      {/* Info Section */}
                      <div className="flex flex-col flex-grow items-center w-full">
                        <h3 className="text-xl font-bold text-[#001a41] mb-1 line-clamp-1">
                          {member.name}
                        </h3>
                        <p className="text-[#3498db] font-semibold mb-3 text-sm uppercase tracking-wide">
                          {member.designation || "Expert Counselor"}
                        </p>
                        
                        <div className="bg-blue-50 text-[#05347f] text-xs font-bold px-4 py-1.5 rounded-full mb-6 mt-auto">
                          {member.experience || 0}+ Years Experience
                        </div>
                      </div>

                      {/* Consult Now Button */}
                     {/* Consult Now Button */}
<button className="w-full py-3 mt-auto rounded-xl border-2 border-[#05347f] text-[#05347f] font-bold text-sm hover:bg-[#c15304] hover:border-[#c15304] hover:text-white transition-all duration-300 flex-shrink-0">
  Consult Now
</button>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          {/* Right Navigation */}
          <button className="swiper-button-next-team hidden md:flex flex-shrink-0 bg-white/10 backdrop-blur-md p-3 rounded-full shadow-md text-white hover:bg-white hover:text-[#001a41] transition-all z-10 border border-white/20">
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="custom-pagination flex justify-center mt-6"></div>
      </div>

      <style jsx global>{`
        /* Making Swiper slides occupy full height of the container */
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
          margin: 0 5px !important;
          width: 8px;
          height: 8px;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #3498db !important;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}