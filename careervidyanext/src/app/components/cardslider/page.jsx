"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api.js"; // ✅ axios instance with baseURL

export default function CardSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // ✅ Fetch Banners and filter for STRIP
  useEffect(() => {
    const fetchStripBanners = async () => {
      try {
        const res = await api.get("/api/v1/banner");
        console.log("🖼 All Banners:", res.data);

        // ✅ Filter only STRIP banners
        const filtered = res.data.filter((b) => b.position === "STRIP");
        console.log("✅ Filtered Strip Banners:", filtered);
        setSlides(filtered);
      } catch (error) {
        console.error("❌ Error fetching strip banners:", error);
      }
    };
    fetchStripBanners();
  }, []);

  // ✅ Auto slide every 8 seconds (slower)
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 8000); // ⏳ Slower transition time
    return () => clearInterval(interval);
  }, [slides]);

  // ✅ Show 3 slides at a time
  const visibleSlides = slides.slice(currentIndex, currentIndex + 3);
  const displaySlides =
    visibleSlides.length < 3
      ? [...visibleSlides, ...slides.slice(0, 3 - visibleSlides.length)]
      : visibleSlides;

  // ✅ Manual navigation
  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  if (slides.length === 0) {
    return (
      <div className="w-full h-[220px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No strip banners found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* ===== Slider Container ===== */}
      <div
        className="flex justify-center gap-6 transition-all duration-[2000ms] ease-in-out"
        // 👆 2-second smooth sliding animation
      >
        {displaySlides.map((slide, i) => (
          <div
            key={slide._id || i}
            className="relative w-[350px] h-[220px] bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform hover:-translate-y-1 overflow-hidden"
          >
            <Image
              src={
                typeof slide.image === "string"
                  ? slide.image.startsWith("http")
                    ? slide.image
                    : `${process.env.NEXT_PUBLIC_BASE_URL}/${slide.image}`
                  : slide.image?.url || "/images/default-banner.jpg"
              }
              alt={slide.title || `Banner ${i + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ))}
      </div>

      {/* ===== Navigation Buttons ===== */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-white shadow-md text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-white shadow-md text-gray-700 p-2 rounded-full hover:bg-gray-100 transition"
      >
        →
      </button>
    </div>
  );
}
