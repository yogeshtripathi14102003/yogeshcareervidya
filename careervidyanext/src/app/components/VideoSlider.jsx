"use client";

import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, FreeMode } from "swiper/modules";
import { X, Play } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/free-mode";

export default function VideoSlider() {
  const swiperRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    { _id: "3", videoUrl: "/video/him.mp4", title: "Success Story 1" },
    { _id: "1", videoUrl: "/video/vd1.mp4", title: "Success Story 2" },
    { _id: "5", videoUrl: "/video/mansi.mp4", title: "Success Story 3" },
    { _id: "2", videoUrl: "/video/v2.mp4", title: "Success Story 4" },
    { _id: "4", videoUrl: "/video/divya.mp4", title: "Success Story 5" },
    { _id: "6", videoUrl: "/video/v5.mp4", title: "Success Story 6" },
    { _id: "7", videoUrl: "/video/v6.mp4", title: "Success Story 7" },
    { _id: "8", videoUrl: "/video/v7.mp4", title: "Success Story 8" },
    { _id: "9", videoUrl: "/video/v8.mp4", title: "Success Story 9" },
  ];

  return (
    <div className="bg-gray-50 py-16 relative">
      <div className="max-w-7xl mx-auto px-6">

        <style jsx global>{`
          .swiper-wrapper {
            transition-timing-function: ease-out !important;
          }
          .swiper-button-next,
          .swiper-button-prev {
            background: white;
            width: 45px !important;
            height: 45px !important;
            border-radius: 50%;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            color: #05347f !important;
            border: 1px solid #eee;
          }
          .swiper-slide {
            padding: 20px 0;
          }
        `}</style>

        {/* Heading */}
        <div className="mb-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[#05347f]">
            Successful Career Transitions
          </h1>
          <div className="w-20 h-1.5 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        {/* Slider */}
        <Swiper
          modules={[Navigation, Autoplay, FreeMode]}
          spaceBetween={25}
          navigation
          grabCursor
          freeMode={{ enabled: true, sticky: true }}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={800}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          breakpoints={{
            320: { slidesPerView: 1.3 },
            640: { slidesPerView: 2.3 },
            1024: { slidesPerView: 3.5 },
            1280: { slidesPerView: 4.2 },
          }}
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              <div
                onClick={() => setSelectedVideo(video)}
                className="group cursor-pointer bg-white rounded-3xl overflow-hidden border shadow-md hover:shadow-2xl transition-all duration-500 hover:-translate-y-3"
              >
                <div className="relative aspect-[9/16] w-full bg-black flex items-center justify-center">
                  
                  {/* ✅ No Crop Preview */}
                  <video
                    src={video.videoUrl}
                    className="max-h-full max-w-full object-contain"
                    muted
                    loop
                    playsInline
                  />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white/20 backdrop-blur-xl p-4 rounded-full">
                      <Play className="text-white fill-current" size={26} />
                    </div>
                  </div>
                </div>

                <div className="p-4 text-center">
                  <p className="text-sm font-bold text-[#05347f] uppercase">
                    Watch Story
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* ✅ DESKTOP OPTIMIZED MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 p-6">

          <div className="relative w-full max-w-[1000px]">

            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>

            {/* Video Container */}
            <div className="w-full h-[80vh] bg-black flex items-center justify-center rounded-2xl overflow-hidden">

              {/* ✅ MAIN FIX: NO CROP + CENTER */}
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="max-h-full max-w-full object-contain"
              />

            </div>
          </div>
        </div>
      )}
    </div>
  );
}