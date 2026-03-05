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
        Trusted Experiences Real Results
      </h2>

      {videos.length === 0 ? (
        <p className="text-center text-gray-500 italic">
         Coming Soon 
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



