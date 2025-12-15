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
      <div className="w-full h-[220px] flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">No strip banners found</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden py-6">
      {/* ================= SLIDER ================= */}
      <div className="flex justify-center gap-6 transition-all duration-700 ease-in-out">
        {displaySlides.map((slide, i) => {
          const imageUrl =
            typeof window !== "undefined" && window.innerWidth < 640
              ? slide.mobileImage?.url
              : slide.desktopImage?.url;

          return (
            <div
              key={slide._id || i}
              className="relative w-[90%] sm:w-[45%] lg:w-[350px]
                         h-[180px] sm:h-[200px] lg:h-[220px]
                         bg-white rounded-2xl shadow-md overflow-hidden"
            >
              <Image
                src={imageUrl || "/images/default-banner.jpg"}
                alt={slide.title || "Strip Banner"}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          );
        })}
      </div>

      {/* ================= NAV BUTTONS ================= */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-3 -translate-y-1/2 bg-white shadow-md p-2 rounded-full"
      >
        ←
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-3 -translate-y-1/2 bg-white shadow-md p-2 rounded-full"
      >
        →
      </button>
    </div>
  );
}
