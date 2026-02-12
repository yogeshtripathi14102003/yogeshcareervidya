"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";

export default function CardSlider() {
  const [slides, setSlides] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);

  /* ================= RESPONSIVE SLIDES ================= */
  useEffect(() => {
    const updateVisibleCount = () => {
      if (window.innerWidth < 640) setVisibleCount(1);
      else if (window.innerWidth < 1024) setVisibleCount(2);
      else setVisibleCount(3);
    };

    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  /* ================= FETCH STRIP BANNERS ================= */
  useEffect(() => {
    const fetchStripBanners = async () => {
      try {
        const res = await api.get("/api/v1/banner");
        const stripBanners = res.data.filter(
          (b) => b.position === "STRIP"
        );
        setSlides(stripBanners);
      } catch (error) {
        console.error("❌ Error fetching strip banners:", error);
      }
    };

    fetchStripBanners();
  }, []);

  /* ================= AUTO SLIDE ================= */
  useEffect(() => {
    if (slides.length === 0) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [slides, visibleCount]);

  /* ================= NAVIGATION ================= */
  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % slides.length);

  const prevSlide = () =>
    setCurrentIndex((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );

  /* ================= SLIDE LOGIC ================= */
  const visibleSlides = slides.slice(
    currentIndex,
    currentIndex + visibleCount
  );

  const displaySlides =
    visibleSlides.length < visibleCount
      ? [
          ...visibleSlides,
          ...slides.slice(0, visibleCount - visibleSlides.length),
        ]
      : visibleSlides;

  if (slides.length === 0) {
    return (
      <div className="w-full flex items-center justify-center bg-gray-100 py-6">
        <p className="text-gray-600">No strip banners found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* ================= SLIDER ================= */}
      <div className="flex justify-center gap-6">
        {displaySlides.map((slide, i) => {
          const isMobile =
            typeof window !== "undefined" && window.innerWidth < 640;
          const imageUrl = isMobile
            ? slide.mobileImage?.url
            : slide.desktopImage?.url;

          const isFirstCard = i === 0;
          const isLastCard = i === displaySlides.length - 1;

          return (
            <div
              key={slide._id || i}
              className="relative w-[90%] sm:w-[45%] lg:w-[350px]
                         bg-white rounded-2xl shadow-md overflow-hidden"
            >
              {/* IMAGE */}
              {imageUrl && (
                <Image
                  src={imageUrl}
                  alt={slide.title || "Strip Banner"}
                  width={isMobile ? 300 : 350}
                  height={isMobile ? 180 : 220}
                  className="object-contain w-full h-auto"
                  unoptimized
                />
              )}

              {/* LEFT BUTTON */}
              {isFirstCard && (
                <button
                  onClick={prevSlide}
                  className="absolute left-0 top-1/2 -translate-y-1/2
                             -translate-x-1/2
                             w-11 h-11 rounded-full bg-white
                             flex items-center justify-center
                             shadow-xl hover:scale-110 transition z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* RIGHT BUTTON */}
              {isLastCard && (
                <button
                  onClick={nextSlide}
                  className="absolute right-0 top-1/2 -translate-y-1/2
                             translate-x-1/2
                             w-11 h-11 rounded-full bg-white
                             flex items-center justify-center
                             shadow-xl hover:scale-110 transition z-10"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-black"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
