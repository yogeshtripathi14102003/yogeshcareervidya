"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

// Swiper
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

export default function VideoSlider() {

  const [videos, setVideos] = useState([]);

  // ================= GET VIDEOS =================
  const fetchVideos = async () => {
    try {
      const res = await api.get("/api/v1/videos");

      if (res.data.success) {
        setVideos(res.data.videos);
      }

    } catch (err) {
      console.log("Slider Error:", err);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  // ================= EMBED =================
  const getEmbedUrl = (url) => {
    if (!url) return "";

    let id = "";

    if (url.includes("youtu.be")) {
      id = url.split("/").pop();
    }
    else if (url.includes("watch?v=")) {
      id = url.split("watch?v=")[1].split("&")[0];
    }
    else if (url.includes("embed")) {
      return url;
    }

    return `https://www.youtube.com/embed/${id}`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Title */}
      <h2 className="text-3xl font-bold mb-6 text-center">
        Latest Videos
      </h2>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500">
          No Videos Found
        </p>
      ) : (

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
        >

          {videos.map((video) => (

            <SwiperSlide key={video._id}>

              <div className="bg-white shadow rounded p-4">

                {/* TITLE */}
                <h3 className="font-semibold mb-2 text-lg truncate">
                  {video.title}
                </h3>

                {/* VIDEO */}
                {video.videoType === "youtube" ? (

                  <iframe
                    src={getEmbedUrl(video.youtubeUrl)}
                    className="w-full h-48 rounded"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  />

                ) : (

                  <video
                    src={video.videoUrl}
                    controls
                    className="w-full h-48 rounded"
                  />

                )}

                {/* CATEGORY */}
                <p className="text-sm text-gray-600 mt-2">
                  {video.category || "General"}
                </p>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      )}

    </div>
  );
}




// "use client";
// import { useEffect, useState } from "react";
// import api from "@/utlis/api.js";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
// import { motion, AnimatePresence } from "framer-motion";

// import "swiper/css";
// import "swiper/css/navigation";

// export default function VideoSlider() {
//   const [videos, setVideos] = useState([]);
//   const [selectedVideo, setSelectedVideo] = useState(null);

//   const fetchVideos = async () => {
//     try {
//       const res = await api.get("/api/v1/videos");
//       if (res.data.success) setVideos(res.data.videos);
//     } catch (err) {
//       console.log("Slider Error:", err);
//     }
//   };

//   useEffect(() => { fetchVideos(); }, []);

//   // --- 1. Thumbnail Nikalne ke liye naya Helper ---
//   const getYouTubeThumbnail = (url) => {
//     if (!url) return "/placeholder.jpg"; // Agar URL na ho
//     let id = "";
//     if (url.includes("youtu.be")) id = url.split("/").pop();
//     else if (url.includes("watch?v=")) id = url.split("v=")[1]?.split("&")[0];
//     else if (url.includes("embed/")) id = url.split("embed/")[1]?.split("?")[0];
    
//     return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "/placeholder.jpg";
//   };

//   const getEmbedUrl = (url) => {
//     if (!url) return "";
//     let id = "";
//     if (url.includes("youtu.be")) id = url.split("/").pop();
//     else if (url.includes("watch?v=")) id = url.split("v=")[1]?.split("&")[0];
//     else if (url.includes("embed/")) id = url.split("embed/")[1];
    
//     return `https://www.youtube.com/embed/${id}?autoplay=1`;
//   };

//   return (
//     <div className="max-w-6xl mx-auto px-4 py-8">
//       <h2 className="text-3xl font-bold mb-6 text-center">Latest Videos</h2>

//       {videos.length === 0 ? (
//         <p className="text-center text-gray-500">No Videos Found</p>
//       ) : (
//         <Swiper
//           modules={[Navigation, Autoplay]}
//           spaceBetween={20}
//           slidesPerView={1}
//           navigation
//           breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
//         >
//           {videos.map((video) => (
//             <SwiperSlide key={video._id}>
//               <motion.div 
//                 whileHover={{ scale: 1.05, y: -10 }}
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setSelectedVideo(video)}
//                 className="bg-white shadow-lg rounded-xl overflow-hidden cursor-pointer border border-gray-100"
//               >
//                 {/* Image Section Fix */}
//                 <div className="relative h-52 bg-gray-200">
//                    <img 
//                     // Pura logic yahan change kiya hai:
//                     src={video.thumbnail || getYouTubeThumbnail(video.youtubeUrl)} 
//                     className="w-full h-full object-cover" // opacity-80 hata diya taki saaf dikhe
//                     alt={video.title}
//                    />
//                    {/* Play Button Overlay */}
//                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 hover:bg-black/30 transition-all">
//                       <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center text-white shadow-xl">
//                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
//                             <path d="M8 5v14l11-7z" />
//                          </svg>
//                       </div>
//                    </div>
//                 </div>
                
//                 <div className="p-4">
//                   <h3 className="font-bold text-gray-800 text-lg truncate">{video.title}</h3>
//                   <p className="text-xs text-blue-600 font-bold uppercase mt-1 tracking-wider">
//                     {video.category || "General"}
//                   </p>
//                 </div>
//               </motion.div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       )}

//       {/* MODAL POPUP (Same as before) */}
//       <AnimatePresence>
//         {selectedVideo && (
//           <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
//             <motion.div 
//               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
//               onClick={() => setSelectedVideo(null)}
//               className="absolute inset-0 bg-black/90 backdrop-blur-sm"
//             />

//             <motion.div 
//               initial={{ scale: 0.8, y: 50, opacity: 0 }}
//               animate={{ scale: 1, y: 0, opacity: 1 }}
//               exit={{ scale: 0.8, y: 50, opacity: 0 }}
//               className="relative bg-black w-full max-w-4xl aspect-video rounded-2xl overflow-hidden shadow-2xl"
//             >
//               <button 
//                 onClick={() => setSelectedVideo(null)}
//                 className="absolute top-4 right-4 z-50 bg-white/20 hover:bg-white/50 text-white w-10 h-10 rounded-full flex items-center justify-center"
//               >✕</button>

//               {selectedVideo.videoType === "youtube" ? (
//                 <iframe
//                   src={getEmbedUrl(selectedVideo.youtubeUrl)}
//                   className="w-full h-full"
//                   allow="autoplay; encrypted-media; fullscreen"
//                 />
//               ) : (
//                 <video src={selectedVideo.videoUrl} controls autoPlay className="w-full h-full" />
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </div>
//   );
// }