"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import { X, Play } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function VideoSlider() {
  const swiperRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Jab modal close ho, slider ko wapas start karne ke liye
  useEffect(() => {
    if (!selectedVideo && swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  }, [selectedVideo]);

  const videos = [
    { _id: "1", videoUrl: "/video/vd1.mp4" },
    { _id: "2", videoUrl: "/video/v2.mp4" },
    { _id: "3", videoUrl: "/video/him.mp4" },
    { _id: "4", videoUrl: "/video/divya.mp4" },
    { _id: "5", videoUrl: "/video/mansi.mp4" },
    { _id: "6", videoUrl: "/video/v5.mp4" },
    { _id: "7", videoUrl: "/video/v6.mp4" },
    { _id: "8", videoUrl: "/video/v7.mp4" },
    { _id: "9", videoUrl: "/video/v10.mp4" },
    {_id: "10", videoUrl: "/video/v11.mp4" },
    
   
    { _id: "9", videoUrl: "/video/v8.mp4" },
    { _id: "10", videoUrl: "/video/v9.mp4" },
  ];

  return (
    <div className="bg-gray-50 py-16 overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6">
        
        <style jsx global>{`
          /* Constant smooth motion ke liye linear easing */
          .video-swiper .swiper-wrapper {
            transition-timing-function: linear !important;
          }
          /* Navigation buttons ko chhota aur clean dikhane ke liye */
          .swiper-button-next, .swiper-button-prev {
            background: white;
            width: 35px !important;
            height: 35px !important;
            border-radius: 50%;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            color: #05347f !important;
          }
          .swiper-button-next:after, .swiper-button-prev:after {
            font-size: 14px !important;
            font-weight: bold;
          }
        `}</style>

        <div className="mb-10 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#05347f]">Success Stories</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-2 rounded-full"></div>
        </div>

        <Swiper
          modules={[Navigation, Autoplay, FreeMode]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          spaceBetween={15}
          slidesPerView={1.8}
          loop={true}
          speed={6000} // Speed constant rakhi hai smoothness ke liye
          freeMode={true}
          navigation={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false, // Click ke baad bhi nahi rukega
            pauseOnMouseEnter: true,    // Hover par stop hoga taaki user dekh sake
          }}
          breakpoints={{
            640: { slidesPerView: 3.2 },
            1024: { slidesPerView: 4.8 },
            1280: { slidesPerView: 5.8 }, // Cards chhote dikhenge
          }}
          className="video-swiper"
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div
                onClick={() => {
                  setSelectedVideo(video);
                  swiperRef.current.autoplay.stop(); // Click karne par peeche ka slider rok do
                }}
                className="group relative cursor-pointer bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-all duration-300 active:scale-95"
              >
                <div className="relative aspect-[9/16] bg-[#0a0a0a]">
                  <video
                    src={video.videoUrl}
                    className="w-full h-full object-contain opacity-90 group-hover:opacity-100"
                    muted
                    loop
                    playsInline
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20">
                      <Play className="text-white fill-current" size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Video Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="relative w-full max-w-[360px]" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute -top-12 right-0 text-white p-2 hover:bg-white/10 rounded-full" 
              onClick={() => setSelectedVideo(null)}
            >
              <X size={28} />
            </button>
            <div className="rounded-2xl overflow-hidden shadow-2xl bg-black border border-white/10">
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