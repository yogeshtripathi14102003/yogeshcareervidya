// "use client";

// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";

// // Swiper
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";

// import "swiper/css";
// import "swiper/css/navigation";

// export default function VideoSlider() {
//   const [videos, setVideos] = useState([]);

//   const fetchVideos = async () => {
//     try {
//       const res = await api.get("/api/v1/videos");
//       if (res.data.success) {
//         setVideos(res.data.videos);
        
//       }
//     } catch (err) {
//       console.log("Slider Error:", err);
//     }
//   };

//   useEffect(() => {
//     fetchVideos();
//   }, []);

//   // ✅ FIXED: Supports Shorts + Normal YouTube
//   const getEmbedUrl = (url) => {
//     if (!url) return "";

//     let id = "";

//     if (url.includes("youtu.be")) {
//       id = url.split("/").pop();
//     } else if (url.includes("watch?v=")) {
//       id = url.split("watch?v=")[1].split("&")[0];
//     } else if (url.includes("shorts/")) {
//       id = url.split("shorts/")[1].split("?")[0];
//     } else if (url.includes("embed")) {
//       return url;
//     }

//     return `https://www.youtube.com/embed/${id}`;
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8 relative">
//       {/* Custom Swiper Buttons */}
//       <style jsx global>{`
//         .swiper-button-next,
//         .swiper-button-prev {
//           background-color: white;
//           width: 35px !important;
//           height: 35px !important;
//           border-radius: 4px;
//           box-shadow: 0 2px 5px rgba(0,0,0,0.2);
//           color: #000 !important;
//         }
//         .swiper-button-next:after,
//         .swiper-button-prev:after {
//           font-size: 14px !important;
//           font-weight: bold;
//         }
//         .swiper-button-disabled {
//           opacity: 0.3;
//         }
//       `}</style>

//       {/* Title */}
//       <h2 className="text-3xl font-bold mb-6 text-center">
//         Trusted Experiences Real Results
//       </h2>

//       {videos.length === 0 ? (
//         <p className="text-center text-gray-500 italic">Coming Soon</p>
//       ) : (
//         <Swiper
//           modules={[Navigation, Autoplay]}
//           spaceBetween={20}
//           slidesPerView={1}
//           navigation
//           autoplay={{
//             delay: 3000,
//             disableOnInteraction: false,
//           }}
//           breakpoints={{
//             640: { slidesPerView: 1 },
//             768: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//           }}
//         >
//           {videos.map((video) => {
//             const isShort =
//               video.youtubeUrl && video.youtubeUrl.includes("shorts");

//             return (
//               <SwiperSlide key={video._id}>
//                 <div className="bg-white shadow rounded p-4">
//                   {video.videoType === "youtube" ? (
//                     <iframe
//                       src={getEmbedUrl(video.youtubeUrl)}
//                       className={`w-full rounded ${
//                         isShort ? "aspect-[9/16]" : "aspect-video"
//                       }`}
//                       allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                       allowFullScreen
//                       loading="lazy"
//                     />
//                   ) : (
//                     <video
//                       src={video.videoUrl}
//                       controls
//                       className="w-full aspect-video rounded"
//                     />
//                   )}

//                   <p className="text-sm text-gray-600 mt-2">
//                     {video.category || "General"}
//                   </p>
//                 </div>
//               </SwiperSlide>
//             );
//           })}
//         </Swiper>
//       )}
//     </div>
//   );
// }

"use client";

import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function VideoSlider() {
  const swiperRef = useRef(null);

  const videos = [
    { _id: "3", videoUrl: "/video/him.mp4" },
    { _id: "1", videoUrl: "/video/vd1.mp4" },
    { _id: "5", videoUrl: "/video/mansi.mp4" },
    { _id: "2", videoUrl: "/video/v2.mp4" },
    { _id: "4", videoUrl: "/video/divya.mp4" },
  ];

  const stopSlider = () => swiperRef.current?.autoplay.stop();
  const startSlider = () => swiperRef.current?.autoplay.start();

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-3">

        {/* Navigation Styling */}
        <style jsx global>{`
          .swiper-button-next, .swiper-button-prev {
            background: white;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50%;
            box-shadow: 0 8px 12px rgba(0,0,0,0.08);
            color: #05347f !important;
            border: 1px solid #eee;
          }
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 14px !important;
            font-weight: bold;
          }
          .swiper-button-disabled {
            opacity: 0 !important;
          }
        `}</style>

        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-[#05347f]">
            What Our Students Say
          </h2>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            Hear directly from our students about their journey and success.
          </p>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* Swiper */}
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          navigation
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: { slidesPerView: 1.1, spaceBetween: 10 },
            640: { slidesPerView: 1.5, spaceBetween: 12 },
            768: { slidesPerView: 2.2, spaceBetween: 12 },
            1024: { slidesPerView: 3, spaceBetween: 15 },
            1440: { slidesPerView: 3.5, spaceBetween: 15 },
          }}
          className="pb-10"
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div className="group bg-white shadow-sm hover:shadow-xl rounded-xl p-2 border border-gray-100 transition-all duration-500 hover:-translate-y-1">

                {/* Video */}
                <div className="relative w-full h-[380px] md:h-[420px] bg-black rounded-lg overflow-hidden">
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                    onPlay={stopSlider}
                    onPause={startSlider}
                  />
                </div>

              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </div>
  );
}