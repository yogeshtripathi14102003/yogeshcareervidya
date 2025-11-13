// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import api from "@/utlis/api.js";
// import Link from "next/link";

// export default function HeroSlider() {
//   const [slides, setSlides] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [transition, setTransition] = useState(true);
//   const [loading, setLoading] = useState(true);
//   const sliderRef = useRef(null);

//   const BASE_URL =
//     process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

//   // ✅ Fetch HERO banners
//   const fetchBanners = async () => {
//     try {
//       const res = await api.get("/api/v1/banner");
//       const heroBanners = res.data?.filter(
//         (b) => b.position?.trim()?.toUpperCase() === "HERO"
//       );
//       setSlides(heroBanners || []);
//     } catch (error) {
//       console.error("❌ Error fetching HERO banners:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   // ✅ Auto slide
//   useEffect(() => {
//     if (!slides.length) return;
//     const timer = setInterval(() => handleNext(), 6000);
//     return () => clearInterval(timer);
//   }, [slides]);

//   const handleNext = () => {
//     if (!slides.length) return;
//     setCurrentSlide((prev) => prev + 1);
//     setTransition(true);
//   };

//   const handlePrev = () => {
//     if (!slides.length) return;
//     setCurrentSlide((prev) =>
//       prev === 0 ? slides.length - 1 : prev - 1
//     );
//     setTransition(true);
//   };

//   // ✅ Infinite Loop Clone
//   const extendedSlides =
//     slides.length > 0
//       ? [
//           ...slides.map((s, i) => ({ ...s, key: `${s._id || "slide"}-${i}` })),
//           { ...slides[0], key: "clone" },
//         ]
//       : [];

//   const handleTransitionEnd = () => {
//     if (currentSlide === slides.length) {
//       setTransition(false);
//       setCurrentSlide(0);
//     }
//   };

//   // ✅ FIXED UNIVERSAL IMAGE HANDLER
//   const getImageSrc = (slide) => {
//     if (!slide?.image) return "/images/default-banner.jpg";

//     let img = slide.image;

//     // If it's an object
//     if (typeof img === "object") {
//       if (img?.url) img = img.url;
//       else if (Array.isArray(img) && img[0]?.url) img = img[0].url;
//       else if (Array.isArray(img)) img = img[0];
//     }

//     // If still not string, fallback
//     if (typeof img !== "string" || !img.length) {
//       console.warn("⚠️ Invalid image format:", slide);
//       return "/images/default-banner.jpg";
//     }

//     // Absolute URLs
//     if (img.startsWith("http")) return img;

//     // Relative path (e.g. "uploads/banner1.jpg")
//     return `${BASE_URL}/${img.replace(/^\/+/, "")}`;
//   };

//   if (loading) {
//     return (
//       <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100">
//         <p className="text-gray-500">Loading HERO banners...</p>
//       </div>
//     );
//   }

//   if (!slides.length) {
//     return (
//       <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100">
//         <p className="text-gray-500">No HERO banners available</p>
//       </div>
//     );
//   }

//   return (
//     <div className="relative w-full overflow-hidden shadow-md">
//       <div
//         ref={sliderRef}
//         onTransitionEnd={handleTransitionEnd}
//         className={`flex ${
//           transition ? "transition-transform duration-[1500ms] ease-in-out" : ""
//         }`}
//         style={{ transform: `translateX(-${currentSlide * 100}%)` }}
//       >
//         {extendedSlides.map((slide, i) => (
//           <div key={slide.key} className="w-full flex-shrink-0">
//             <div className="relative w-full min-h-[180px] md:min-h-[370px] bg-black">
//               <Image
//                 src={getImageSrc(slide)}
//                 alt={slide.title || `Banner ${i + 1}`}
//                 fill
//                 className="object-cover object-center"
//                 unoptimized
//                 priority={i === 0}
//               />
//               <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
//                 {slide.title && (
//                   <h2 className="text-white text-xl md:text-3xl font-semibold mb-3 drop-shadow-md">
//                     {slide.title}
//                   </h2>
//                 )}
//                 {slide.linkUrl && (
//                   <Link href={slide.linkUrl}>
//                     <span className="bg-[#0057A0] text-white px-5 py-2 rounded-full hover:bg-[#003f73] transition cursor-pointer">
//                       Visit
//                     </span>
//                   </Link>
//                 )}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Controls */}
//       <button
//         onClick={handlePrev}
//         className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#0057A0] text-white p-2 rounded-full hover:bg-[#003f73] transition"
//       >
//         ←
//       </button>
//       <button
//         onClick={handleNext}
//         className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#0057A0] text-white p-2 rounded-full hover:bg-[#003f73] transition"
//       >
//         →
//       </button>

//       {/* Dots */}
//       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
//         {slides.map((_, index) => (
//           <button
//             key={`dot-${index}`}
//             onClick={() => setCurrentSlide(index)}
//             className={`w-3 h-3 rounded-full transition ${
//               currentSlide % slides.length === index
//                 ? "bg-[#0057A0]"
//                 : "bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import api from "@/utlis/api.js";
import Link from "next/link";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const isTransitioning = useRef(false);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

  // ✅ Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await api.get("/api/v1/banner");
      const heroBanners = res.data?.filter(
        (b) => b.position?.trim()?.toUpperCase() === "HERO"
      );
      setSlides(heroBanners || []);
    } catch (err) {
      console.error("❌ Error fetching HERO banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ✅ Auto slide every 5s
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => handleNext(), 5000);
    return () => clearInterval(timer);
  }, [slides]);

  // ✅ Safe next/prev navigation
  const handleNext = () => {
    if (isTransitioning.current || !slides.length) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => (isTransitioning.current = false), 800);
  };

  const handlePrev = () => {
    if (isTransitioning.current || !slides.length) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    setTimeout(() => (isTransitioning.current = false), 800);
  };

  // ✅ Universal Image Handler
  const getImageSrc = (slide) => {
    if (!slide?.image) return "/images/default-banner.jpg";

    let img = slide.image;

    // If backend sends object or array
    if (typeof img === "object") {
      if (img?.url) img = img.url;
      else if (Array.isArray(img) && img[0]?.url) img = img[0].url;
      else if (Array.isArray(img)) img = img[0];
    }

    if (typeof img !== "string" || !img.length)
      return "/images/default-banner.jpg";

    if (img.startsWith("http")) return img;

    return `${BASE_URL}/${img.replace(/^\/+/, "")}`;
  };

  if (loading) {
    return (
      <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading HERO banners...</p>
      </div>
    );
  }

  if (!slides.length) {
    return (
      <div className="w-full h-64 md:h-96 flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">No HERO banners available</p>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden shadow-md">
      {/* Slide Wrapper */}
      <div className="relative w-full h-[180px] md:h-[370px]">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
  <Image
  src={getImageSrc(slide)}
  alt={slide.title || `Slide ${index + 1}`}
  fill
  className="object-contain md:object-cover object-center"
  unoptimized
  priority={index === 0}
/>


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
        ))}
      </div>

      {/* Controls */}
      <button
        onClick={handlePrev}
        className="absolute top-1/2 left-4 -translate-y-1/2 bg-[#0057A0] text-white p-2 rounded-full hover:bg-[#003f73] transition"
      >
        ←
      </button>
      <button
        onClick={handleNext}
        className="absolute top-1/2 right-4 -translate-y-1/2 bg-[#0057A0] text-white p-2 rounded-full hover:bg-[#003f73] transition"
      >
        →
      </button>

      {/* Dots */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition ${
              currentSlide === index ? "bg-[#0057A0]" : "bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
