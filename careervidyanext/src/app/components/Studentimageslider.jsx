"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

// Swiper CSS
import "swiper/css";
import "swiper/css/free-mode";

export default function StudentPlacementSlider() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await api.get("/api/v1/ourstudent");
        if (res.data.success) {
          setStudents(res.data.data);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px] text-white bg-[#001a41]">
        <div className="animate-pulse font-semibold">Loading Alumni...</div>
      </div>
    );
  }

  return (
    <section className="bg-[#001a41] text-white py-16 overflow-hidden">
      {/* Heading */}
      <div className="text-center mb-10 px-4">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
          10000+ Alumni Network
        </h2>
        <p className="mt-4">
          <span className="bg-[#0056B3] px-6 py-2 rounded-full text-sm md:text-base font-bold shadow-lg">
            #VidyaHaiTohSuccessHai!
          </span>
        </p>
      </div>

      {/* Slider Container */}
      <div className="w-full px-2">
        <Swiper
          modules={[Autoplay, FreeMode]}
          loop={true}
          speed={4000} // Increased speed for a smoother "infinite" feel
          freeMode={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={true}
          
          /* 🟢 GAP SETTINGS: Added spacing between cards */
          spaceBetween={15} 
          slidesPerView={2}

          breakpoints={{
            480: {
              slidesPerView: 3,
              spaceBetween: 15,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 7,
              spaceBetween: 25,
            },
          }}
          className="smooth-swiper"
        >
          {students.map((student) => (
            <SwiperSlide key={student._id}>
              {/* 🟢 IMAGE SETTINGS: No cropping, centered inside a white box */}
              <div className="bg-white h-40 md:h-44 rounded-lg flex items-center justify-center p-3 shadow-md hover:shadow-xl transition-shadow duration-300">
                <img
                  src={student.image}
                  alt={student.name || "Student Placement"}
                  className="max-w-full max-h-full object-contain block mx-auto"
                  loading="lazy"
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* CSS for Seamless Continuous Scrolling */}
      <style jsx global>{`
        .smooth-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
          -webkit-transition-timing-function: linear !important;
        }
        
        /* Ensures the gap logic from Swiper props works correctly */
        .smooth-swiper .swiper-slide {
          height: auto;
        }
      `}</style>
    </section>
  );
}