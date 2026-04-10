"use client";

import { useState, useEffect, useRef } from "react";
import api from "@/utlis/api.js";

let globalBannerCache = null;

export default function HeroSlider({ initialBanners = [] }) {
  const [slides, setSlides] = useState(() => {
    if (globalBannerCache) return globalBannerCache;
    return initialBanners.length > 0 ? formatBanners(initialBanners) : [];
  });

  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(slides.length === 0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const isTransitioning = useRef(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

  function formatBanners(banners) {
    const heroBanners = banners.filter((b) => b.position?.trim()?.toUpperCase() === "HERO");
    if (heroBanners.length === 0) return [];
    const firstClone = heroBanners[0];
    const lastClone = heroBanners[heroBanners.length - 1];
    const mappedWithClones = [lastClone, ...heroBanners, firstClone];

    return mappedWithClones.map((b) => ({
      ...b,
      desktopUrl: b.desktopImage?.url || b.image?.desktop?.url,
      mobileUrl: b.mobileImage?.url || b.image?.mobile?.url,
    }));
  }

  useEffect(() => {
    if (slides.length > 0) { setLoading(false); return; }
    const fetchBanners = async () => {
      try {
        const res = await api.get("/api/v1/banner");
        const formatted = formatBanners(res.data || []);
        if (formatted.length > 0) {
          globalBannerCache = formatted;
          setSlides(formatted);
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    };
    fetchBanners();
  }, [slides.length]);

  // ✅ AUTO SLIDE LOGIC (Har 3 second mein slide change hogi)
  useEffect(() => {
    if (slides.length === 0) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 4000); // 4000ms = 4 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [currentSlide, slides.length]);

  // Loop Fix
  useEffect(() => {
    if (slides.length === 0) return;
    if (currentSlide === slides.length - 1) {
      setTimeout(() => { setTransitionEnabled(false); setCurrentSlide(1); }, 500);
    }
    if (currentSlide === 0) {
      setTimeout(() => { setTransitionEnabled(false); setCurrentSlide(slides.length - 2); }, 500);
    }
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (!transitionEnabled) setTimeout(() => setTransitionEnabled(true), 50);
  }, [transitionEnabled]);

  const handleNext = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev + 1);
    setTimeout(() => (isTransitioning.current = false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev - 1);
    setTimeout(() => (isTransitioning.current = false), 500);
  };

  const getFullUrl = (path) => {
    if (!path) return "/images/default-banner.jpg";
    return path.startsWith("http") ? path : `${BASE_URL}/${path.replace(/^\/+/, "")}`;
  };

  if (loading) return <div className="w-full aspect-[21/9] bg-gray-200 animate-pulse"></div>;
  if (!slides.length) return null;

  return (
    <section className="relative w-full overflow-hidden bg-white">
      <div
        className="flex"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="min-w-full w-full relative">
            <div className="hidden md:block w-full">
              <img src={getFullUrl(slide.desktopUrl)} alt="Desktop" className="w-full h-auto block" />
            </div>
            <div className="block md:hidden w-full">
              <img src={getFullUrl(slide.mobileUrl || slide.desktopUrl)} alt="Mobile" className="w-full h-auto block" />
            </div>
          </div>
        ))}
      </div>

      {/* ✅ MOBILE & DESKTOP BUTTONS (Visible on both) */}
      <button 
        onClick={handlePrev} 
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/10 hover:bg-black/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all text-xs md:text-base"
      >
        ❮
      </button>
      <button 
        onClick={handleNext} 
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/10 hover:bg-black/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all text-xs md:text-base"
      >
        ❯
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 w-full flex justify-center gap-2">
        {slides.slice(1, -1).map((_, i) => (
          <div 
            key={i} 
            onClick={() => setCurrentSlide(i + 1)}
            className={`h-1 md:h-1.5 cursor-pointer rounded-full transition-all ${currentSlide === i + 1 ? "bg-white w-5 md:w-6" : "bg-white/40 w-1.5 md:w-2"}`} 
          />
        ))}
      </div>
    </section>
  );
}