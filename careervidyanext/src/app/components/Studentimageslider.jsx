"use client";

import { useEffect, useState, useRef } from "react";
import api from "@/utlis/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";

export default function StudentPlacementSlider() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchStudents = async () => {
      try {
        // ✅ next.config.js rewrite handle kar raha hai — URL hidden automatically
        const res = await api.get("/api/v1/ourstudent");

        if (res.data.success && Array.isArray(res.data.data)) {
          setStudents(res.data.data);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("StudentPlacementSlider fetch failed:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <section className="bg-[#001a41] py-16">
        <div className="max-w-[1200px] mx-auto px-4">
          <div className="text-center mb-10">
            <div className="h-10 w-72 bg-white/10 rounded-lg mx-auto animate-pulse" />
            <div className="h-8 w-48 bg-white/10 rounded-full mx-auto mt-4 animate-pulse" />
          </div>
          <div className="flex gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-40 h-40 bg-white/10 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error || !students.length) return null;

  return (
    <section className="bg-[#001a41] text-white py-16">
      <div className="max-w-[1200px] mx-auto px-4 overflow-hidden">

        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            10000+ Alumni Network
          </h2>
          <p className="mt-4">
            <span className="bg-[#0056B3] px-6 py-2 rounded-full text-sm md:text-base font-bold shadow-lg">
              #VidyaHaiTohSuccessHai!
            </span>
          </p>
        </div>

        <Swiper
          modules={[Autoplay, FreeMode]}
          loop={students.length > 7}
          speed={4000}
          freeMode={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          allowTouchMove={true}
          spaceBetween={15}
          slidesPerView={2}
          breakpoints={{
            480: { slidesPerView: 3, spaceBetween: 15 },
            768: { slidesPerView: 5, spaceBetween: 20 },
            1024: { slidesPerView: 7, spaceBetween: 25 },
          }}
          className="smooth-swiper"
        >
          {students.map((student) => (
            <SwiperSlide key={student._id}>
              <div className="bg-white h-40 md:h-44 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
                {student.image ? (
                  <img
                    src={student.image}
                    alt={student.name || "Student Placement"}
                    className="w-full h-full object-contain p-2"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs text-center px-2">
                    {student.name || "Alumni"}
                  </div>
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .smooth-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
          -webkit-transition-timing-function: linear !important;
        }
        .smooth-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}