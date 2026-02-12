"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import api from "@/utlis/api.js"; // Ensure typo 'utlis' is correct in your folder structure
import Link from "next/link";
import "../ui/hero.css";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const isTransitioning = useRef(false);

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await api.get("/api/v1/banner");
      const heroBanners = res.data?.filter(
        (b) => b.position?.trim()?.toUpperCase() === "HERO"
      );

      if (heroBanners.length > 0) {
        const firstClone = heroBanners[0];
        const lastClone = heroBanners[heroBanners.length - 1];
        const mappedWithClones = [lastClone, ...heroBanners, firstClone];

        const mappedBanners = mappedWithClones.map((b) => ({
          ...b,
          image: {
            desktop: { url: b.desktopImage?.url || b.image?.desktop?.url },
            mobile: { url: b.mobileImage?.url || b.image?.mobile?.url },
          },
        }));
        setSlides(mappedBanners);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;

    if (currentSlide === slides.length - 1) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(1);
      }, 500);
    }
    if (currentSlide === 0) {
      setTimeout(() => {
        setTransitionEnabled(false);
        setCurrentSlide(slides.length - 2);
      }, 500);
    }
  }, [currentSlide, slides.length]);

  useEffect(() => {
    if (!transitionEnabled) {
      setTimeout(() => setTransitionEnabled(true), 50);
    }
  }, [transitionEnabled]);

  const handleNext = () => {
    if (isTransitioning.current || !slides.length) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev + 1);
    setTimeout(() => (isTransitioning.current = false), 500);
  };

  const handlePrev = () => {
    if (isTransitioning.current || !slides.length) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => prev - 1);
    setTimeout(() => (isTransitioning.current = false), 500);
  };

  const getImageSrc = (slide) => {
    if (!slide?.image) return "/images/default-banner.jpg";
    const img = isMobile
      ? slide.image?.mobile?.url || slide.image?.desktop?.url
      : slide.image?.desktop?.url || slide.image?.mobile?.url;
    if (!img) return "/images/default-banner.jpg";
    if (img.startsWith("http")) return img;
    return `${BASE_URL}/${img.replace(/^\/+/, "")}`;
  };

  if (loading || !slides.length) return <div className="slider-loading">Loading...</div>;

  return (
    <div className="slider-container relative overflow-hidden w-full">
      <div
        className="slider-wrapper flex"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
          transition: transitionEnabled ? "transform 0.5s ease-in-out" : "none",
        }}
      >
        {slides.map((slide, index) => (
          <div 
            key={index} 
            className="slide min-w-full relative h-[180px] sm:h-[250px] md:h-[400px] lg:h-[500px]"
          >
            <Image
              src={getImageSrc(slide)}
              alt={slide.title || "Banner"}
              fill
              // "object-fill" image ko stretch karke poora dikhayega bina crop kiye
              // "md:object-cover" desktop par perfection ke liye
              className="object-fill md:object-cover" 
              unoptimized
              priority={index === 1}
            />
          </div>
        ))}
      </div>

      <button className="slider-btn left" onClick={handlePrev}>←</button>
      <button className="slider-btn right" onClick={handleNext}>→</button>

      <div className="slider-dots">
        {slides.slice(1, -1).map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index + 1)}
            className={`dot ${currentSlide === index + 1 ? "active-dot" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
}