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
      <div className="text-center text-white py-10">
        Loading...
      </div>
    );
  }

  return (
    <section className="bg-[#001a41] text-white py-16 overflow-hidden">

      {/* Heading */}
      <div className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-extrabold">
          10000+ Alumni Network
        </h2>

        <p className="mt-2">
          <span className="bg-[#0056B3] px-4 py-1 rounded-md font-semibold">
            #VidyaHaiTohSuccessHai!
          </span>
        </p>
      </div>

      {/* Slider */}
      <div className="w-full">
        <Swiper
          modules={[Autoplay, FreeMode]}
          loop={true}
          speed={3000}
          freeMode={true}
          autoplay={{
            delay: 0,
            disableOnInteraction: false,
          }}
          allowTouchMove={true}

          /* 🔥 No gap */
          spaceBetween={0}

          slidesPerView={2}

          breakpoints={{
            640: {
              slidesPerView: 3,
              spaceBetween: 0,
            },
            768: {
              slidesPerView: 5,
              spaceBetween: 0,
            },
            1024: {
              slidesPerView: 7,
              spaceBetween: 0,
            },
          }}

          className="smooth-swiper"
        >
          {students.map((student) => (
            <SwiperSlide key={student._id}>
              <div className="bg-white overflow-hidden h-44 rounded-md">

                <img
                  src={student.image}
                  alt={student.name}
                  className="w-full h-full object-cover block"
                />

              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Smooth continuous scroll */}
      <style jsx global>{`
        .smooth-swiper .swiper-wrapper {
          transition-timing-function: linear !important;
          -webkit-transition-timing-function: linear !important;
        }

        /* Extra safety: remove default gap */
        .smooth-swiper .swiper-slide {
          margin-right: 0 !important;
        }
      `}</style>

    </section>
  );
}

