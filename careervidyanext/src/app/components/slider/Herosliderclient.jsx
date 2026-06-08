"use client";

// src/components/HeroSliderClient.jsx

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/utlis/api.js"; 

let globalBannerCache = null;

function formatBanners(banners) {
  const heroBanners = banners.filter(
    (b) => b.position?.trim()?.toUpperCase() === "HERO"
  );
  if (heroBanners.length === 0) return [];
  const firstClone = heroBanners[0];
  const lastClone = heroBanners[heroBanners.length - 1];
  return [lastClone, ...heroBanners, firstClone].map((b) => ({
    ...b,
    desktopUrl: b.desktopImage?.url || b.image?.desktop?.url,
    mobileUrl: b.mobileImage?.url || b.image?.mobile?.url,
  }));
}

const getFullUrl = (path) => {
  if (!path) return "/images/default-banner.jpg";
  if (path.startsWith("http") || path.startsWith("/")) return path;
  return `/${path}`;
};

export default function HeroSliderClient({ initialBanners = [] }) {
  const [slides, setSlides] = useState(() => {
    if (initialBanners && initialBanners.length > 0) {
      const formatted = formatBanners(initialBanners);
      globalBannerCache = formatted;
      return formatted;
    }
    if (globalBannerCache) return globalBannerCache;
    return [];
  });

  const [isClientFetching, setIsClientFetching] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(1);
  const isTransitioning = useRef(false);
  const sliderRef = useRef(null);
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (slides.length > 0) return;

    const fetchBanners = async () => {
      setIsClientFetching(true);
      try {
        const res = await api.get("/api/v1/banner/active?position=HERO");
        const formatted = formatBanners(res.data || []);
        if (formatted.length > 0) {
          globalBannerCache = formatted;
          setSlides(formatted);
        }
      } catch (err) {
        console.error("HeroSlider fallback fetch error:", err);
      } finally {
        setIsClientFetching(false);
      }
    };

    fetchBanners();
  }, [slides.length]);

  useEffect(() => {
    if (slides.length < 2 || preloadedRef.current) return;
    preloadedRef.current = true;
    const firstSlide = slides[1];
    [
      { url: firstSlide.desktopUrl, media: "(min-width: 768px)" },
      { url: firstSlide.mobileUrl || firstSlide.desktopUrl, media: "(max-width: 767px)" },
    ].forEach(({ url, media }) => {
      if (!url) return;
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = getFullUrl(url);
      link.media = media;
      document.head.appendChild(link);
    });
  }, [slides]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || slides.length === 0) return;
    const handleTransitionEnd = () => {
      const total = slides.length;
      if (currentSlide === total - 1) {
        setTransitionEnabled(false);
        setCurrentSlide(1);
      } else if (currentSlide === 0) {
        setTransitionEnabled(false);
        setCurrentSlide(total - 2);
      }
      isTransitioning.current = false;
    };
    slider.addEventListener("transitionend", handleTransitionEnd);
    return () => slider.removeEventListener("transitionend", handleTransitionEnd);
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (!transitionEnabled) {
      const raf = requestAnimationFrame(() => setTransitionEnabled(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [transitionEnabled]);

  const handleNext = useCallback(() => {
    if (isTransitioning.current || slides.length === 0) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev + 1);
  }, [slides.length]);

  const handlePrev = useCallback(() => {
    if (isTransitioning.current || slides.length === 0) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev - 1);
  }, [slides.length]);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext, slides.length]);

  if (slides.length === 0 && !isClientFetching) return null;

  // Render skeleton inside the native banner space if still loading on client
  if (slides.length === 0 && isClientFetching) {
    return (
      <div className="w-full bg-gray-200 animate-pulse aspect-[1920/823]" />
    );
  }

  return (
    <section
      aria-label="Hero Banner Slider"
      aria-roledescription="carousel"
      className="relative w-full max-w-full overflow-hidden bg-white"
    >
      <div
        ref={sliderRef}
        aria-live="off"
        className="flex w-full"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
          willChange: "transform",
        }}
      >
        {slides.map((slide, index) => {
          const isFirst = index === 1;
          const isVisible = index === currentSlide;
          return (
            <div
              key={index}
              className="min-w-full w-full relative flex-shrink-0"
              role="group"
              aria-roledescription="slide"
              aria-label={slide.title || `Slide ${index}`}
              aria-hidden={!isVisible}
            >
              {/* FIX: object-cover hata kar w-full aur h-auto lagaya hai taaki crop na ho */}
              {/* Desktop Image */}
              <img
                src={getFullUrl(slide.desktopUrl)}
                alt={slide.altText || slide.title || "Hero Banner"}
                className="hidden md:block w-full h-auto"
                loading={isFirst ? "eager" : "lazy"}
                fetchPriority={isFirst ? "high" : "low"}
                decoding={isFirst ? "sync" : "async"}
              />
              
              {/* Mobile Image */}
              <img
                src={getFullUrl(slide.mobileUrl || slide.desktopUrl)}
                alt={slide.altText || slide.title || "Hero Banner"}
                className="block md:hidden w-full h-auto"
                loading={isFirst ? "eager" : "lazy"}
                fetchPriority={isFirst ? "high" : "low"}
                decoding={isFirst ? "sync" : "async"}
              />

              {slide.title && <h2 className="sr-only">{slide.title}</h2>}
              {slide.description && <p className="sr-only">{slide.description}</p>}

              {slide.link && (
                <a
                  href={slide.link}
                  className="absolute inset-0 z-0"
                  aria-label={slide.title || "View offer"}
                  tabIndex={isVisible ? 0 : -1}
                >
                  <span className="sr-only">{slide.title || "View offer"}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>

      {/* Controls */}
      {slides.length > 0 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/10 hover:bg-black/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all text-xs md:text-base"
          >❮</button>
          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/10 hover:bg-black/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all text-xs md:text-base"
          >❯</button>

          {/* Dots */}
          <div className="absolute bottom-3 w-full flex justify-center gap-2" role="tablist">
            {slides.slice(1, -1).map((_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={currentSlide === i + 1}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setCurrentSlide(i + 1)}
                className={`h-1 md:h-1.5 cursor-pointer rounded-full transition-all border-0 outline-none ${
                  currentSlide === i + 1 ? "bg-white w-5 md:w-6" : "bg-white/40 w-1.5 md:w-2"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}