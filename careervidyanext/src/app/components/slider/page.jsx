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
      } catch (err) {
        console.error("❌ Error fetching HERO banners:", err);
      }
    };
    fetchBanners();
  }, []);

  // ✅ Auto-slide every 6s
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => handleNext(), 6000);
    return () => clearInterval(timer);
  }, [slides]);

  const handleNext = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => prev + 1);
    setTransition(true);
  };

  const handlePrev = () => {
    if (!slides.length) return;
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    setTransition(true);
  };

  // ✅ Infinite loop clone
  const extendedSlides =
    slides.length > 0
      ? [
          ...slides.map((s, i) => ({ ...s, key: `${s._id || "slide"}-${i}` })),
          { ...slides[0], key: "clone" },
        ]
      : [];

  const handleTransitionEnd = () => {
    if (currentSlide === slides.length) {
      setTransition(false);
      setCurrentSlide(0);
    }
  };

  if (!slides.length) {
    return (
      <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100">
        <p className="text-gray-600">Loading HERO banners...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden shadow-md">
      {/* === Slider Track === */}
      <div
        ref={sliderRef}
        onTransitionEnd={handleTransitionEnd}
        className={`flex ${
          transition ? "transition-transform duration-[1500ms] ease-in-out" : ""
        }`}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {extendedSlides.map((slide, i) => (
          <div key={slide.key} className="w-full flex-shrink-0">
            {/* === Banner Container === */}
            <div className="relative w-full min-h-[180px] md:min-h-[370px] bg-black">
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
                className="object-cover object-center scale-95 md:scale-100 transition-transform duration-500"
                unoptimized
                priority={i === 0}
              />

              {/* === Overlay === */}
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
                {slide.title && (
                  <h2 className="text-white text-xl md:text-3xl font-semibold mb-3 drop-shadow-md">
                    {slide.title}
                  </h2>
                )}
                {slide.linkUrl && (
                  <Link href={slide.linkUrl}>
                    <span className="bg-[#0057A0] text-white px-5 py-2 rounded-full hover:bg-[#003f73] transition cursor-pointer">
                      Visit
                    </span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* === Navigation Buttons === */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#0057A0] text-white p-2 rounded-full hover:bg-[#003f73] transition"
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#0057A0] text-white p-2 rounded-full hover:bg-[#003f73] transition"
        aria-label="Next slide"
      >
        →
      </button>

      {/* === Pagination Dots === */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={`dot-${index}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide % slides.length === index
                ? "bg-[#0057A0]"
                : "bg-gray-400"
            }`}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
