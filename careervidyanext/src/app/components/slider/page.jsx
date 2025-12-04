
// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import api from "@/utlis/api.js";
// import Link from "next/link";

// export default function HeroSlider() {
//   const [slides, setSlides] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const isTransitioning = useRef(false);

//   const BASE_URL =
//     process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

//   // ✅ Fetch banners
//   const fetchBanners = async () => {
//     try {
//       const res = await api.get("/api/v1/banner");
//       const heroBanners = res.data?.filter(
//         (b) => b.position?.trim()?.toUpperCase() === "HERO"
//       );
//       setSlides(heroBanners || []);
//     } catch (err) {
//       console.error("❌ Error fetching HERO banners:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   // ✅ Auto slide every 5s
//   useEffect(() => {
//     if (!slides.length) return;
//     const timer = setInterval(() => handleNext(), 5000);
//     return () => clearInterval(timer);
//   }, [slides]);

//   // ✅ Safe next/prev navigation
//   const handleNext = () => {
//     if (isTransitioning.current || !slides.length) return;
//     isTransitioning.current = true;
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//     setTimeout(() => (isTransitioning.current = false), 800);
//   };

//   const handlePrev = () => {
//     if (isTransitioning.current || !slides.length) return;
//     isTransitioning.current = true;
//     setCurrentSlide((prev) =>
//       prev === 0 ? slides.length - 1 : prev - 1
//     );
//     setTimeout(() => (isTransitioning.current = false), 800);
//   };

//   // ✅ Universal Image Handler
//   const getImageSrc = (slide) => {
//     if (!slide?.image) return "/images/default-banner.jpg";

//     let img = slide.image;

//     // If backend sends object or array
//     if (typeof img === "object") {
//       if (img?.url) img = img.url;
//       else if (Array.isArray(img) && img[0]?.url) img = img[0].url;
//       else if (Array.isArray(img)) img = img[0];
//     }

//     if (typeof img !== "string" || !img.length)
//       return "/images/default-banner.jpg";

//     if (img.startsWith("http")) return img;

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
//       {/* Slide Wrapper */}
//       <div className="relative w-full h-[180px] md:h-[370px]">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`absolute inset-0 transition-opacity duration-[800ms] ease-in-out ${
//               index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
//             }`}
//           >
//   <Image
//   src={getImageSrc(slide)}
//   alt={slide.title || `Slide ${index + 1}`}
//   fill
//   className="object-contain md:object-cover object-center"
//   unoptimized
//   priority={index === 0}
// />


//             <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
//               {slide.title && (
//                 <h2 className="text-white text-xl md:text-3xl font-semibold mb-3 drop-shadow-md">
//                   {slide.title}
//                 </h2>
//               )}
//               {slide.linkUrl && (
//                 <Link href={slide.linkUrl}>
//                   <span className="bg-[#0057A0] text-white px-5 py-2 rounded-full hover:bg-[#003f73] transition cursor-pointer">
//                     Visit
//                   </span>
//                 </Link>
//               )}
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
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`w-3 h-3 rounded-full transition ${
//               currentSlide === index ? "bg-[#0057A0]" : "bg-gray-400"
//             }`}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect, useRef } from "react";
// import Image from "next/image";
// import api from "@/utlis/api.js"
// import Link from "next/link";
// import  "../ui/hero.css";

// export default function HeroSlider() {
//   const [slides, setSlides] = useState([]);
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const isTransitioning = useRef(false);

//   const BASE_URL =
//     process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

//   const fetchBanners = async () => {
//     try {
//       const res = await api.get("/api/v1/banner");
//       const heroBanners = res.data?.filter(
//         (b) => b.position?.trim()?.toUpperCase() === "HERO"
//       );
//       setSlides(heroBanners || []);
//     } catch (err) {
//       console.error("Error fetching banners:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBanners();
//   }, []);

//   useEffect(() => {
//     if (!slides.length) return;
//     const timer = setInterval(() => handleNext(), 5000);
//     return () => clearInterval(timer);
//   }, [slides]);

//   const handleNext = () => {
//     if (isTransitioning.current || !slides.length) return;
//     isTransitioning.current = true;
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//     setTimeout(() => (isTransitioning.current = false), 800);
//   };

//   const handlePrev = () => {
//     if (isTransitioning.current || !slides.length) return;
//     isTransitioning.current = true;
//     setCurrentSlide((prev) =>
//       prev === 0 ? slides.length - 1 : prev - 1
//     );
//     setTimeout(() => (isTransitioning.current = false), 800);
//   };

//   const getImageSrc = (slide) => {
//     if (!slide?.image) return "/images/default-banner.jpg";
//     let img = slide.image;

//     if (typeof img === "object") {
//       if (img?.url) img = img.url;
//       else if (Array.isArray(img) && img[0]?.url) img = img[0].url;
//       else if (Array.isArray(img)) img = img[0];
//     }

//     if (typeof img !== "string" || !img.length)
//       return "/images/default-banner.jpg";

//     if (img.startsWith("http")) return img;

//     return `${BASE_URL}/${img.replace(/^\/+/, "")}`;
//   };

//   if (loading) {
//     return (
//       <div className="slider-loading">
//         Loading HERO banners...
//       </div>
//     );
//   }

//   if (!slides.length) {
//     return (
//       <div className="slider-loading">
//         No HERO banners available
//       </div>
//     );
//   }

//   return (
//     <div className="slider-container">

//       <div className="slider-wrapper">
//         {slides.map((slide, index) => (
//           <div
//             key={index}
//             className={`slide ${
//               index === currentSlide ? "active" : ""
//             }`}
//           >
//             <Image
//               src={getImageSrc(slide)}
//               alt={slide.title || `Slide ${index + 1}`}
//               fill
//               className="slide-image"
//               unoptimized
//               priority={index === 0}
//             />

//             <div className="slide-overlay">
//               {slide.title && (
//                 <h2 className="slide-title">{slide.title}</h2>
//               )}

//               {slide.linkUrl && (
//                 <Link href={slide.linkUrl}>
//                   <span className="slide-button">Visit</span>
//                 </Link>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       <button className="slider-btn left" onClick={handlePrev}>
//         ←
//       </button>

//       <button className="slider-btn right" onClick={handleNext}>
//         →  
//       </button>

//       <div className="slider-dots">
//         {slides.map((_, index) => (
//           <button
//             key={index}
//             onClick={() => setCurrentSlide(index)}
//             className={`dot ${
//               currentSlide === index ? "active-dot" : ""
//             }`}
//           ></button>
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
import "../ui/hero.css";

export default function HeroSlider() {
  const [slides, setSlides] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const isTransitioning = useRef(false);

  const BASE_URL =
    process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") || "";

  // Detect mobile/desktop
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch banners
  const fetchBanners = async () => {
    try {
      const res = await api.get("/api/v1/banner");
      const heroBanners = res.data?.filter(
        (b) => b.position?.trim()?.toUpperCase() === "HERO"
      );

      const mappedBanners = heroBanners.map((b) => ({
        ...b,
        image: {
          desktop: { url: b.desktopImage?.url || b.image?.desktop?.url },
          mobile: { url: b.mobileImage?.url || b.image?.mobile?.url },
        },
      }));

      setSlides(mappedBanners || []);
    } catch (err) {
      console.error("Error fetching banners:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // Auto slide (FAST SPEED)
  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => handleNext(), 8000); // 3 seconds
    return () => clearInterval(timer);
  }, [slides]);

  const handleNext = () => {
    if (isTransitioning.current || !slides.length) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setTimeout(() => (isTransitioning.current = false), 400);
  };

  const handlePrev = () => {
    if (isTransitioning.current || !slides.length) return;
    isTransitioning.current = true;
    setCurrentSlide((prev) =>
      prev === 0 ? slides.length - 1 : prev - 1
    );
    setTimeout(() => (isTransitioning.current = false), 400);
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

  if (loading) {
    return <div className="slider-loading">Loading HERO banners...</div>;
  }

  if (!slides.length) {
    return <div className="slider-loading">No HERO banners available</div>;
  }

  return (
    <div className="slider-container">
      <div
        className="slider-wrapper"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide, index) => (
          <div key={index} className="slide">
            <Image
              src={getImageSrc(slide)}
              alt={slide.title || `Slide ${index + 1}`}
              fill
              className="slide-image"
              unoptimized
              priority={index === 0}
            />

            <div className="slide-overlay">
              {slide.title && <h2 className="slide-title">{slide.title}</h2>}
              {slide.linkUrl && (
                <Link href={slide.linkUrl}>
                  {/* <span className="slide-button">Visit</span> */}
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <button className="slider-btn left" onClick={handlePrev}>
        ←
      </button>
      <button className="slider-btn right" onClick={handleNext}>
        →
      </button>

      <div className="slider-dots">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`dot ${currentSlide === index ? "active-dot" : ""}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
