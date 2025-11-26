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
//   const BASE_URL = "https://api.careervidya.in"; // Replace with your actual base URL

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

//   if (loading)
//     return (
//       <div className="py-20 text-center text-gray-200 text-lg bg-[#000a1f]">
//         Loading team members...
//       </div>
//     );

//   if (!team.length)
//     return (
//       <div className="py-20 text-center text-gray-200 text-lg bg-[#000a1f]">
//         No team members available.
//       </div>
//     );

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
//             1024: { slidesPerView: 3, spaceBetween: 25 },
//             1280: { slidesPerView: 4, spaceBetween: 30 },
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
//                 <div className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden relative flex flex-col items-center group">
//                   <div className="relative w-full h-72 sm:h-80 md:h-72 lg:h-80 overflow-hidden">
//                     <img
//                       src={imageUrl}
//                       alt={member.name}
//                       className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//                       loading="lazy"
//                     />
//                     <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
//                   </div>

//                   {/* ✅ Reduced height by lowering padding */}
//                   <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md rounded-xl px-3 py-2 text-center shadow-md w-[88%] md:w-[85%]">
//                     <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
//                       {member.name}
//                     </h3>
//                     <p className="text-[#0056B3] text-xs md:text-sm font-medium">
//                       {member.designation || "Team Member"}
//                     </p>

//                     {member.experience && (
//                       <p className="text-gray-400 text-[10px] mt-0.5">
//                         {member.experience} yrs experience
//                       </p>
//                     )}

//                     {member.description && (
//                       <p className="text-gray-600 text-[10px] md:text-[11px] mt-1 line-clamp-2">
//                         {member.description}
//                       </p>
//                     )}

//                  <button
//   className="mt-1.5 bg-[#000a1f] text-white text-[10px] md:text-xs px-3 py-[3px] rounded-full hover:bg-[#00143d] transition-all duration-300"
//   onClick={() => window.location.href = "/teamexpand"}
// >
//   Consult Now
// </button>

//                   </div>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>

//         {/* ===== Side Navigation Buttons ===== */}
//         <button
//           className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#000a1f] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200 hover:scale-105 transition-all"
//           aria-label="Previous"
//         >
//           <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
//         </button>

//         <button
//           className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white text-[#000a1f] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200 hover:scale-105 transition-all"
//           aria-label="Next"
//         >
//           <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
//         </button>
//       </div>

//       {/* Optional View All Button */}
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
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setTeam(data);
      } catch (err) {
        console.error("❌ Error fetching team members:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  if (loading)
    return (
      <div className="py-20 text-center text-gray-200 text-lg bg-[#000a1f]">
        Loading team members...
      </div>
    );

  if (!team.length)
    return (
      <div className="py-20 text-center text-gray-200 text-lg bg-[#000a1f]">
        No team members available.
      </div>
    );

  return (
    <section className="relative bg-[#000a1f] py-16 md:py-20">
      <h2 className="text-center text-3xl md:text-4xl font-bold text-white mb-10 md:mb-14">
        Meet Our Expert Team
      </h2>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={4}
          navigation={{
            nextEl: ".swiper-button-next-custom",
            prevEl: ".swiper-button-prev-custom",
          }}
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 20 },
            480: { slidesPerView: 1.2, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            1024: { slidesPerView: 3, spaceBetween: 25 },
            1280: { slidesPerView: 4, spaceBetween: 30 },
          }}
          className="pb-12"
        >
          {team.map((member, idx) => {
            const imageUrl = member.image
              ? member.image.startsWith("http")
                ? member.image
                : `${BASE_URL}${member.image.startsWith("/") ? "" : "/"}${member.image}`
              : "/fallback-avatar.png";

            return (
              <SwiperSlide key={member._id ?? idx}>
                {/* === Entire Card Clickable === */}
                <div
                  onClick={() => window.location.href = `/teamexpand?id=${member._id}`}
                  className="bg-white cursor-pointer rounded-3xl shadow-lg hover:shadow-2xl 
                  transition-all duration-300 overflow-hidden relative flex flex-col items-center group"
                >
                  <div className="relative w-full h-72 sm:h-80 md:h-72 lg:h-80 overflow-hidden">
                    <img
                      src={imageUrl}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* ===== Info Section ===== */}
                  <div
                    className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md 
                    rounded-xl px-3 py-2 text-center shadow-md w-[88%] md:w-[85%]"
                    onClick={(e) => e.stopPropagation()} // prevent card click
                  >
                    <h3 className="text-sm md:text-base font-semibold text-gray-900 truncate">
                      {member.name}
                    </h3>
                    <p className="text-[#0056B3] text-xs md:text-sm font-medium">
                      {member.designation || "Team Member"}
                    </p>

                    {member.experience && (
                      <p className="text-gray-400 text-[10px] mt-0.5">
                        {member.experience} yrs experience
                      </p>
                    )}

                    <button
                      className="mt-1.5 bg-[#000a1f] text-white text-[10px] md:text-xs px-3 py-[3px] 
                      rounded-full hover:bg-[#00143d] transition-all duration-300"
                      onClick={() => window.location.href = `/teamexpand?id=${member._id}`}
                    >
                      Consult Now
                    </button>
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Navigation Buttons */}
        <button
          className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 z-10 
          bg-white text-[#000a1f] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex 
          items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200 
          hover:scale-105 transition-all"
        >
          <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>

        <button
          className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 z-10 
          bg-white text-[#000a1f] rounded-full w-10 h-10 sm:w-12 sm:h-12 flex 
          items-center justify-center shadow-lg hover:shadow-2xl border border-gray-200 
          hover:scale-105 transition-all"
        >
          <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
        </button>
      </div>

      <div className="text-center mt-10">
        <button className="bg-white text-[#000a1f] font-semibold px-6 py-2 rounded-lg hover:bg-gray-100 transition-all">
          View All →
        </button>
      </div>
    </section>
  );
}

