"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { X, Play } from "lucide-react"; 

import "swiper/css";
import "swiper/css/navigation";

export default function VideoSlider() {
  const swiperRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { _id: "3", videoUrl: "/video/him.mp4",},
    { _id: "1", videoUrl: "/video/vd1.mp4",  },
    { _id: "5", videoUrl: "/video/mansi.mp4",  },
    { _id: "2", videoUrl: "/video/v2.mp4", },
    { _id: "4", videoUrl: "/video/divya.mp4",  },
  ];

  return (
    <div className="bg-gray-50 py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <style jsx global>{`
          .swiper-button-next, .swiper-button-prev {
            background: white;
            width: 40px !important;
            height: 40px !important;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            color: #05347f !important;
            border: 1px solid #eee;
          }
          .swiper-button-next:after, .swiper-button-prev:after { font-size: 16px !important; font-weight: bold; }
          .swiper-button-disabled { opacity: 0 !important; }
          /* Space for hover effect */
          .swiper-slide { padding: 15px 0; }
        `}</style>

        {/* Heading */}
         <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#05347f]">
            Successful Career  Transitions To Inspire You
          </h1>
          <p className="mt-3 text-gray-500 max-w-2xl mx-auto text-lg">
            Hear directly from our students about their journey and success.
          </p>
          <div className="w-16 h-1 bg-blue-600 mx-auto mt-4 rounded-full"></div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={20}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: { slidesPerView: 1.2, spaceBetween: 15 },
            640: { slidesPerView: 2.2, spaceBetween: 20 },
            1024: { slidesPerView: 3.2, spaceBetween: 20 }, // 3.2 slides taaki card thoda bada dikhe
            1280: { slidesPerView: 4, spaceBetween: 25 }, 
          }}
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div 
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Video Container - Aspect [9/16] for no cropping */}
                <div className="relative aspect-[9/16] w-full bg-black overflow-hidden">
                  <video 
                    src={video.videoUrl} 
                    className="w-full h-full object-cover pointer-events-none group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-100 group-hover:bg-black/40 transition-all">
                    <div className="bg-white/30 backdrop-blur-md p-4 rounded-full border border-white/40 group-hover:bg-red-600 group-hover:border-transparent transition-all">
                       <Play className="text-white fill-current" size={24} />
                    </div>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <p className="text-sm font-bold text-gray-800 tracking-wide uppercase">
                    {video.title}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* --- MODAL (Video Popup) --- */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 p-4 animate-in fade-in duration-300">
          <div className="relative w-full max-w-[400px] flex flex-col items-center">
            
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-14 right-0 text-white hover:text-red-500 transition-colors p-2"
            >
              <X size={35} />
            </button>

            <div className="w-full aspect-[9/16] bg-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,255,255,0.1)] border border-white/10">
              <video 
                src={selectedVideo.videoUrl} 
                controls 
                autoPlay 
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}