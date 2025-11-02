"use client";

import { useEffect, useState } from "react";
import api from "@/utlis/api"; // ✅ Your pre-configured axios instance
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";

export default function StudentPlacementSlider() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch students from backend
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
    <section className="bg-[#000a1f] text-white py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-6xl font-extrabold text-blue-400">100000+</h2>
        <p className="mt-2">
          <span className="bg-blue-600 text-white px-4 py-1 rounded-md font-semibold">
            Students Placed
          </span>
        </p>
        <p className="mt-3 text-gray-300">
          Vidya hai to Success hai

        </p>
      </div>

      {/* Swiper Slider */}
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
              <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition transform hover:-translate-y-1">
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
    </section>
  );
}
