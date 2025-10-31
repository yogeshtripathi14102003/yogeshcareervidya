"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";
import Link from "next/link";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [transition, setTransition] = useState(true);
  const sliderRef = useRef(null);

  // ✅ Fetch HERO banners
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await api.get("/api/v1/banner");
        const heroBanners = res.data.filter(
          (b) => b.position?.trim()?.toUpperCase() === "HERO"
        );
        setSlides(heroBanners || []);
      } catch (error) {
        console.error("❌ Error fetching HERO banners:", error);
      }
    };
    fetchBanners();
  }, []);

  // ✅ Auto slide
  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 6000);
    return () => clearInterval(interval);
  }, [slides]);

  // ✅ Next & Prev Slide
  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => prev + 1);
    setTransition(true);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    setTransition(true);
  };

  // ✅ Extended slides for smooth loop (add clone with unique key)
  const extendedSlides =
    slides.length > 0
      ? [
          ...slides.map((s, i) => ({ ...s, uniqueKey: `${s._id || "slide"}-${i}` })),
          { ...slides[0], uniqueKey: `${slides[0]?._id || "slide"}-clone` },
        ]
      : [];

  // ✅ Handle infinite loop transition
  const handleTransitionEnd = () => {
    if (currentSlide === slides.length) {
      setTransition(false);
      setCurrentSlide(0);
    }
  };

  if (slides.length === 0)
    return (
      <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-200">
        <p className="text-gray-600">No HERO banners found</p>
      </div>
    );

  return (
    <div className="relative w-full overflow-hidden shadow-md">
      {/* ===== Slider Container ===== */}
      <div
        ref={sliderRef}
        onTransitionEnd={handleTransitionEnd}
        className={`flex ${
          transition ? "transition-transform duration-[2000ms] ease-in-out" : ""
        }`}
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {extendedSlides.map((slide, i) =>
          slide ? (
            <div key={slide.uniqueKey} className="w-full flex-shrink-0">
              <div className="relative w-full min-h-[250px] md:min-h-[450px]">
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

                {/* ===== Overlay & Link Button ===== */}
                <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center text-center px-4">
                  {slide.title && (
                    <h2 className="text-white text-2xl md:text-4xl font-semibold mb-4 drop-shadow-md">
                      {slide.title}
                    </h2>
                  )}
                  {slide.linkUrl && (
                    <Link href={slide.linkUrl}>
                      <span className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition cursor-pointer">
                        Visit
                      </span>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ) : null
        )}
      </div>

      {/* ===== Navigation Buttons ===== */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
      >
        ←
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition"
      >
        →
      </button>

      {/* ===== Pagination Dots ===== */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide % slides.length === index
                ? "bg-blue-600"
                : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
