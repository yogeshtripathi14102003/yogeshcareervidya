"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules"; // 👈 FreeMode add kiya
import { X, Play } from "lucide-react"; 

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode"; // 👈 CSS import karein

export default function VideoSlider() { 
  const swiperRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  

  const videos = [
    { _id: "3", videoUrl: "/video/him.mp4", title: "Success Story 1"},
    { _id: "1", videoUrl: "/video/vd1.mp4", title: "Success Story 2"},
    { _id: "5", videoUrl: "/video/mansi.mp4", title: "Success Story 3"},
    { _id: "2", videoUrl: "/video/v2.mp4", title: "Success Story 4"},
    { _id: "4", videoUrl: "/video/divya.mp4", title: "Success Story 5"},
    { _id: "6", videoUrl: "/video/v5.mp4", title: "Success Story 6"},
    {id: "7", videoUrl: "/video/v6.mp4", title: "Success Story 7"},
    {id: "8", videoUrl: "/video/v7.mp4", title: "Success Story 8"},
  ];

  return (
    <div className="bg-gray-50 py-16 relative">
      <div className="max-w-7xl mx-auto px-6">
        
        <style jsx global>{`
          .swiper-wrapper {
            transition-timing-function: ease-out !important; /* 👈 Smooth ending */
          }
          .swiper-button-next, .swiper-button-prev {
            background: white;
            width: 45px !important;
            height: 45px !important;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            color: #05347f !important;
            border: 1px solid #eee;
            transition: all 0.3s ease;
          }
          .swiper-button-next:hover, .swiper-button-prev:hover {
            transform: scale(1.1);
            background: #05347f;
            color: white !important;
          }
          .swiper-button-next:after, .swiper-button-prev:after { font-size: 18px !important; font-weight: bold; }
          .swiper-button-disabled { opacity: 0 !important; cursor: auto; }
          .swiper-slide { padding: 20px 0; }
        `}</style>

        {/* Heading Section */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#05347f]">
            Successful Career Transitions
          </h1>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, FreeMode]} // 👈 FreeMode module
          spaceBetween={25}
          navigation
          grabCursor={true} // 👈 Mouse se pakadne par hand icon
          freeMode={{
            enabled: true,
            sticky: true, // 👈 Scroll karne ke baad card barabar fit hoga
            momentumRatio: 0.5,
          }}
          autoplay={{ 
            delay: 3500, 
            disableOnInteraction: false,
            pauseOnMouseEnter: true 
          }}
          speed={800} // 👈 Slide hone ki speed (Slow = Smooth)
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: { slidesPerView: 1.3, spaceBetween: 15 },
            640: { slidesPerView: 2.3, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 25 },
            1280: { slidesPerView: 4.2, spaceBetween: 30 }, 
          }}
          className="pb-10"
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div 
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-md hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3"
              >
                <div className="relative aspect-[9/16] w-full bg-slate-900 overflow-hidden">
                  <video 
                    src={video.videoUrl} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700 ease-in-out" 
                    muted
                    loop
                    playsInline
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-xl p-5 rounded-full border border-white/30 scale-90 group-hover:scale-100 group-hover:bg-red-600 group-hover:border-transparent transition-all duration-500 shadow-xl">
                       <Play className="text-white fill-current ml-1" size={28} />
                    </div>
                  </div>
                </div>

                <div className="p-5 bg-white border-t border-gray-50 text-center">
                  <p className="text-sm font-black text-[#05347f] tracking-widest uppercase">
                    WATCH STORY
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* MODAL Code Same Rahega... */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-4 transition-all overflow-hidden">
          <div className="relative w-full max-w-[420px] animate-in zoom-in duration-300">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 md:-right-12 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition-all"
            >
              <X size={30} />
            </button>
            <div className="w-full aspect-[9/16] bg-black rounded-[2.5rem] overflow-hidden shadow-2xl border-[6px] border-white/5">
              <video src={selectedVideo.videoUrl} controls autoPlay className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}