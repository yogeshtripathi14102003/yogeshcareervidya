"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import api from "@/utlis/api.js";

let globalBannerCache = null;

// ✅ Component ke bahar — dependency issue nahi hoga
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

// ✅ Component ke bahar — re-render pe recreate nahi hoga
const getFullUrl = (path) => {
  if (!path) return "/images/default-banner.jpg";
  return path.startsWith("http") ? path : path;
};

export default function HeroSlider({ initialBanners = [] }) {
  const [slides, setSlides] = useState(() => {
    if (globalBannerCache) return globalBannerCache;
    return initialBanners.length > 0 ? formatBanners(initialBanners) : [];
  });

  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(slides.length === 0);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const isTransitioning = useRef(false);
  const sliderRef = useRef(null);
  const preloadedRef = useRef(false);

  useEffect(() => {
    if (slides.length > 0) { setLoading(false); return; }
    const fetchBanners = async () => {
      try {
        const res = await api.get("/api/v1/banner/active?position=HERO");
        const formatted = formatBanners(res.data || []);
        if (formatted.length > 0) {
          globalBannerCache = formatted;
          setSlides(formatted);
        }
      } catch (err) {
        console.error("Banner fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []); // ✅ empty — sirf mount pe ek baar

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
    if (!slider) return;
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
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev + 1);
  }, []);

  const handlePrev = useCallback(() => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev - 1);
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const interval = setInterval(handleNext, 4000);
    return () => clearInterval(interval);
  }, [handleNext, slides.length]);

  if (loading) return (
    <div role="status" aria-label="Banner loading"
      className="w-full aspect-[21/9] bg-gray-200 animate-pulse" />
  );
  if (!slides.length) return null;

  return (
    <section aria-label="Hero Banner Slider" aria-roledescription="carousel"
      className="relative w-full overflow-hidden bg-white">
      <div
        ref={sliderRef}
        aria-live="off"
        className="flex"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        {slides.map((slide, index) => {
          const isFirst = index === 1;
          const isVisible = index === currentSlide;
          return (
            <div key={index} className="min-w-full w-full relative"
              role="group" aria-roledescription="slide"
              aria-label={slide.title || `Slide ${index}`}
              aria-hidden={!isVisible}
            >
              <div className="hidden md:block w-full">
                <img
                  src={getFullUrl(slide.desktopUrl)}
                  alt={slide.altText || slide.title || "Hero Banner"}
                  className="w-full h-auto block"
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "low"}
                  decoding={isFirst ? "sync" : "async"}
                  width={1920}
                  height={823}
                />
              </div>
              <div className="block md:hidden w-full">
                <img
                  src={getFullUrl(slide.mobileUrl || slide.desktopUrl)}
                  alt={slide.altText || slide.title || "Hero Banner"}
                  className="w-full h-auto block"
                  loading={isFirst ? "eager" : "lazy"}
                  fetchPriority={isFirst ? "high" : "low"}
                  decoding={isFirst ? "sync" : "async"}
                  width={768}
                  height={400}
                />
              </div>
              {slide.title && <h2 className="sr-only">{slide.title}</h2>}
              {slide.description && <p className="sr-only">{slide.description}</p>}
              {slide.link && (
                <a href={slide.link} className="absolute inset-0 z-0"
                  aria-label={slide.title || "View offer"}
                  tabIndex={isVisible ? 0 : -1}>
                  <span className="sr-only">{slide.title || "View offer"}</span>
                </a>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={handlePrev} aria-label="Previous slide"
        className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 z-10 bg-black/10 hover:bg-black/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all text-xs md:text-base">❮</button>
      <button onClick={handleNext} aria-label="Next slide"
        className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 z-10 bg-black/10 hover:bg-black/40 text-white p-2 md:p-3 rounded-full backdrop-blur-sm transition-all text-xs md:text-base">❯</button>

      <div className="absolute bottom-3 w-full flex justify-center gap-2" role="tablist">
        {slides.slice(1, -1).map((_, i) => (
          <button key={i} role="tab"
            aria-selected={currentSlide === i + 1}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setCurrentSlide(i + 1)}
            className={`h-1 md:h-1.5 cursor-pointer rounded-full transition-all border-0 outline-none ${
              currentSlide === i + 1 ? "bg-white w-5 md:w-6" : "bg-white/40 w-1.5 md:w-2"
            }`}
          />
        ))}
      </div>
    </section>
  );
}