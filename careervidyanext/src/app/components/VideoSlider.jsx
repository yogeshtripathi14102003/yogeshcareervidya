"use client";

import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { X, ChevronLeft, ChevronRight, Play } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export default function VideoSlider() {
  const swiperRef = useRef(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    if (!selectedVideo && swiperRef.current) {
      swiperRef.current.autoplay.start();
    }
  }, [selectedVideo]);

  const videos = [
    { _id: "1", videoUrl: "/video/vd1.mp4", name: "Success Story 1", category: "ENGINEERING" },
    { _id: "2", videoUrl: "/video/v2.mp4", name: "Success Story 2", category: "MEDICAL" },
    { _id: "3", videoUrl: "/video/him.mp4", name: "Success Story 3", category: "NEET PG" },
    { _id: "4", videoUrl: "/video/divya.mp4", name: "Success Story 4", category: "ENGINEERING" },
    { _id: "5", videoUrl: "/video/mansi.mp4", name: "Success Story 5", category: "NEET UG" },
    { _id: "6", videoUrl: "/video/v5.mp4", name: "Success Story 6", category: "MANAGEMENT" },
    { _id: "7", videoUrl: "/video/v6.mp4", name: "Success Story 7", category: "ENGINEERING" },
    { _id: "8", videoUrl: "/video/v7.mp4", name: "Success Story 8", category: "MEDICAL" },
    { _id: "11", videoUrl: "/video/v10.mp4", name: "Success Story 9", category: "NEET PG" },
    { _id: "12", videoUrl: "/video/v11.mp4", name: "Success Story 10", category: "ENGINEERING" },
    { _id: "13", videoUrl: "/video/v122.mp4", name: "Success Story 11", category: "NEET UG" },
    { _id: "14", videoUrl: "/video/v13.mp4", name: "Success Story 12", category: "MEDICAL" },
    { _id: "15", videoUrl: "/video/v14.mp4", name: "Success Story 13", category: "ENGINEERING" },
    { _id: "16", videoUrl: "/video/v8.mp4", name: "Success Story 14", category: "MANAGEMENT" },
    { _id: "17", videoUrl: "/video/v17.mp4", name: "Success Story 15", category: "NEET PG" },
    { _id: "18", videoUrl: "/video/newldki.mp4", name: "Success Story 16", category: "ENGINEERING" },
    { _id: "19", videoUrl: "/video/newldki2.mp4", name: "Success Story 17", category: "MEDICAL" },
    {_id: "20", videoUrl: "/video/v18.mp4", name: "Success Story 18", category: "NEET UG" },
    {_id: "21", videoUrl: "/video/v19.mp4", name: "Success Story 19", category: "MANAGEMENT" },
    {_id: "22", videoUrl: "/video/v20.mp4", name: "Success Story 20", category: "ENGINEERING" },
    {_id: "23", videoUrl: "/video/v21.mp4", name: "Success Story 21", category: "MEDICAL" },
    {_id: "24", videoUrl: "/video/v22.mp4", name: "Success Story 22", category: "ENGINEERING" },
    {_id: "25", videoUrl: "/video/v23.mp4", name: "Success Story 23", category: "NEET PG" },
  ];

  return (
    <section className="bg-[#f4f4f4] py-10 md:py-16 px-4">
        <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-extrabold text-white uppercase tracking-tighter">
           <span className="text-[#0056B3]"> Success Stories</span>
        </h2>
        <p className="text-gray-400 mt-2 text-sm md:text-base font-medium max-w-md mx-auto italic">
    "Turning dreams into reality, one milestone at a time."
  </p>
  </div>
      <div className="max-w-[1200px] mx-auto relative"> {/* Container width thodi kam ki */}
        
        <Swiper
          modules={[Navigation, Autoplay, Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          navigation={{ nextEl: ".swiper-next", prevEl: ".swiper-prev" }}
          pagination={{ clickable: true }}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          autoplay={{ delay: 3500, disableOnInteraction: false }}
          breakpoints={{
            480: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 },
            1280: { slidesPerView: 5 }, // Jyada slides taaki cards chhote dikhen
          }}
          className="!pb-12"
        >
          {videos.map((video) => (
            <SwiperSlide key={video._id}>
              {/* CARD - Size reduced with max-w-[260px] */}
              <div className="bg-[#0f172a] rounded-[20px] shadow-lg overflow-hidden h-full flex flex-col border-b-4 border-[#d97706] mx-auto max-w-[260px]">
                
                <div className="bg-gradient-to-b from-[#1e3a8a] to-[#0f172a] p-4 flex flex-col items-center flex-grow">
                  
                  {/* HEADER - Smaller Text */}
                  <div className="text-center mb-3 w-full">
                    <h3 className="text-white font-bold text-base tracking-tight">
                      Career Vidya 
                    </h3>
                    {/* <div className="w-10 h-0.5 bg-[#d97706] mx-auto mt-0.5 rounded-full"></div> */}
                  </div>

                  {/* VIDEO CONTAINER - Compact size */}
                  <div 
                    className="relative w-full aspect-[4/5] bg-black rounded-lg overflow-hidden cursor-pointer group border border-white/10"
                    onClick={() => {
                        setSelectedVideo(video);
                        swiperRef.current?.autoplay.stop();
                    }}
                  >
                    <video
                      src={video.videoUrl}
                      className="w-full h-full object-cover object-top"
                      muted
                      loop
                      playsInline
                    />
                    
                    {/* Play Icon - Smaller size */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/30 transition-all">
                        <div className="bg-[#d97706] p-2.5 rounded-full shadow-lg transform group-hover:scale-110 transition">
                            <Play size={18} className="text-white fill-white ml-0.5" />
                        </div>
                    </div>
                  </div>

                  {/* INFO SECTION - Scaled down */}
                  <div className="w-full mt-3 text-center">
                    <span className="inline-block text-white text-[9px] font-black uppercase tracking-widest mb-0.5">
                      {video.category}
                    </span>
                    <p className="text-white text-[10px] leading-tight opacity-90 italic">
                      "Success begins with CareerVidya"
                    </p>
                  </div>

                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* NAVIGATION BUTTONS - Smaller & Adjusted */}
        <button className="swiper-prev absolute left-[-15px] top-[42%] z-20 bg-white text-[#1e3a8a] shadow-md p-2 rounded-full hover:bg-[#d97706] hover:text-white transition hidden lg:flex border border-gray-100">
          <ChevronLeft size={20} />
        </button>
        <button className="swiper-next absolute right-[-15px] top-[42%] z-20 bg-white text-[#1e3a8a] shadow-md p-2 rounded-full hover:bg-[#d97706] hover:text-white transition hidden lg:flex border border-gray-100">
          <ChevronRight size={20} />
        </button>
      </div>
      {/* MODAL */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center p-4" onClick={() => setSelectedVideo(null)}>
          <div className="relative w-full max-w-[360px]" onClick={(e) => e.stopPropagation()}>
            <button className="absolute -top-10 right-0 text-white" onClick={() => setSelectedVideo(null)}>
              <X size={28} />
            </button>
            <div className="rounded-2xl overflow-hidden border-2 border-[#d97706] bg-black">
              <video src={selectedVideo.videoUrl} controls autoPlay className="w-full h-auto max-h-[75vh]" />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

