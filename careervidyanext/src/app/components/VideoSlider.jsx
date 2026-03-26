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
      { _id: "3",  videoUrl: "/video/him.mp4",  },
    { _id: "1", videoUrl: "/video/vd1.mp4", },
     { _id: "5", videoUrl: "/video/mansi.mp4", },
    { _id: "2",  videoUrl: "/video/v2.mp4",  },
  
   
    { _id: "4",  videoUrl: "/video/divya.mp4",  },
  ];

  const stopSlider = () => swiperRef.current?.autoplay.stop();
  const startSlider = () => swiperRef.current?.autoplay.start();

  return (
    // Section Background: Halka grey/blue tint gradient
    <div className="bg-gradient-to-b from-gray-50 to-white py-16">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Custom Navigation Styles */}
        <style jsx global>{`
          .swiper-button-next, .swiper-button-prev {
            background: white;
            width: 45px !important;
            height: 45px !important;
            border-radius: 50%;
            box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
            color: #121416 !important; /* Blue color arrow */
            border: 1px solid #f3f4f6;
          }
          .swiper-button-next:after, .swiper-button-prev:after { font-size: 16px !important; font-weight: 800; }
          .swiper-button-disabled { opacity: 0 !important; transition: 0.3s; }
        `}</style>

        {/* Enhanced Heading Section */}
        <div className="mb-8 text-center">
          {/* <span className="bg-blue-100 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest">
            Testimonials
          </span> */}
          <h2 className="text-3xl md:text-5xl font-bold mb-3 text-[#05347f]">
            What Our Students Say
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto text-lg">
            Hear directly from our community about their journey and how this program helped them achieve their goals.
          </p>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-6 rounded-full"></div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={15} 
          navigation
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 15 },
            768: { slidesPerView: 2.3, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 },
            1440: { slidesPerView: 4, spaceBetween: 25 },
          }}
          className="pb-12" // Extra padding for shadow visibility
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div className="group bg-white shadow-md hover:shadow-2xl rounded-2xl p-3 border border-gray-100 transition-all duration-500 transform hover:-translate-y-2">
                
                {/* Fixed Video Container */}
                <div className="relative w-full h-[400px] bg-black rounded-xl overflow-hidden shadow-inner">
                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onPlay={stopSlider}
                    onPause={startSlider}
                  />
                </div>

                {/* Category Label */}
                <div className="pt-5 pb-2">
                  <p className="text-sm font-bold text-blue-600 text-center uppercase tracking-widest">
                    {video.category}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

