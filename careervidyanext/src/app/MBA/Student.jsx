"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api.js";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

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

  if (loading)
    return <div className="text-center text-white py-10">Loading...</div>;

  return (
    <section className="relative overflow-hidden text-white py-16">
      {/* 🎨 Elegant Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#7B0000]/70 via-[#C8102E]/70 to-[#FF7F50]/70"></div>
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow-lg mb-4">
            Career Vidya Benifits
          </h2>

          {/* Benefits List */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-lg font-semibold text-white">
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg shadow-md hover:bg-white/30 transition duration-300">
              💳 No Cost EMI
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg shadow-md hover:bg-white/30 transition duration-300">
              🌍 Global Alumni Network
            </div>
            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-lg shadow-md hover:bg-white/30 transition duration-300">
              💼 Flexible for Working Professionals
            </div>
          </div>

          <p className="mt-6 text-white/90 text-lg italic max-w-2xl mx-auto leading-relaxed">
            "Unlock your potential with CareerVidya — Learn smart, grow fast, and achieve more."
          </p>
        </div>

        {/* 🧠 Swiper Slider */}
        <div className="max-w-7xl mx-auto px-4">
          <Swiper
            modules={[Autoplay]}
            autoplay={{ delay: 2000, disableOnInteraction: false }}
            loop
            spaceBetween={20}
            slidesPerView={2}
            breakpoints={{
              640: { slidesPerView: 3 },
              768: { slidesPerView: 5 },
              1024: { slidesPerView: 7 },
            }}
          >
            {students.map((student) => (
              <SwiperSlide key={student._id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition transform hover:-translate-y-1 duration-300">
                  <img
                    src={student.image}
                    alt={student.name}
                    className="w-full h-44 object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
