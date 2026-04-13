


"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";

export default function VideoSlider() {
  const swiperRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
    { _id: "11", videoUrl: "/video/v10.mp4"},
    {_id: "12", videoUrl: "/video/v11.mp4" },
    {_id: "13", videoUrl: "/video/v12.mp4" },
    {_id: "14", videoUrl: "/video/v13.mp4" },
    {_id: "15", videoUrl: "/video/v14.mp4" },
  ];

  return (
    <section className="bg-[#041533] py-16 md:py-24">
      
      {/* HEADER */}
      <h2 className="text-center text-2xl md:text-3xl font-bold text-white mb-12 uppercase tracking-wide">
        Success Stories
      </h2>

      <div className="max-w-[95%] xl:max-w-[1400px] mx-auto px-4 md:px-8">

        <div className="flex items-center gap-3">

          {/* LEFT BUTTON */}
          <button className="swiper-prev hidden md:flex bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-[#041533] transition border border-white/20">
            <ChevronLeft size={24} />
          </button>

          {/* SLIDER */}
          <div className="flex-1 overflow-hidden">
            <Swiper
              modules={[Navigation, Autoplay]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              navigation={{
                nextEl: ".swiper-next",
                prevEl: ".swiper-prev",
              }}
              spaceBetween={12}   // 🔥 tight spacing
              slidesPerView={1}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                640: { slidesPerView: 2 },
                1024: { slidesPerView: 3 },
                1280: { slidesPerView: 4 },
              }}
              className="pb-10"
            >
              {videos.map((video) => (
                <SwiperSlide key={video._id} className="flex">

                  {/* CARD */}
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col w-full h-full group hover:-translate-y-2 transition-all duration-300">

                    {/* VIDEO */}
                    <div className="relative h-[420px] overflow-hidden">
                      <video
                        src={video.videoUrl}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                        muted
                        loop
                        playsInline
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 flex flex-col flex-grow">

                      <button
                        onClick={() => {
                          setSelectedVideo(video);
                          swiperRef.current?.autoplay.stop();
                        }}
                        className="mt-auto w-full cursor-pointer py-3 rounded-xl bg-[#bd530a] text-white font-bold hover:brightness-110 transition"
                      >
                        Play Now
                      </button>

                    </div>
                  </div>

                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* RIGHT BUTTON */}
          <button className="swiper-next hidden md:flex bg-white/10 backdrop-blur-md p-3 rounded-full text-white hover:bg-white hover:text-[#041533] transition border border-white/20">
            <ChevronRight size={24} />
          </button>

        </div>
      </div>

      {/* MODAL */}
      {selectedVideo && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div
            className="relative w-full max-w-[400px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute -top-12 right-0 text-white"
              onClick={() => setSelectedVideo(null)}
            >
              <X size={32} />
            </button>

            <div className="rounded-2xl overflow-hidden bg-black">
              <video
                src={selectedVideo.videoUrl}
                controls
                autoPlay
                className="w-full aspect-[9/16] object-cover object-top"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}