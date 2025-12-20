"use client";

import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";

// Swiper CSS imports
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function useScrollReveal(threshold = 0.25) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function TestimonialsSlider() {
  const section = useScrollReveal(0.2);

  const testimonials = [
    {
      text: "Before Career Vidya, I was confused about my stream. Their counsellors guided me through every step to make an informed decision.",
      name: "Atul Kumar",
      designation: "Student",
      img: "/images/AtulKumar.png",
    },
    {
      text: "The assessment helped me understand my strengths. I am now pursuing a course I genuinely enjoy thanks for the confidence!",
      name: "Vishal Vishwakarma",
      designation: "Student",
      img: "/images/teti1.png",
    },
    {
      text: "The team really cares. Their expert guidance not only helped me choose the right career but also boosted my self-belief significantly.",
      name: "Praveen Singh",
      designation: "Student",
      img: "/images/Praveensingh.png",
    },
    {
      text: "I highly recommend Career Vidya to every student who feels lost. Their approach is scientific and truly student-focused.",
      name: "Gyanendu Sundar",
      designation: "Engineering Aspirant",
      img: "/images/GyanenduSundarRana.png",
    },
    {
      text: "After their session, I realized how important right guidance is. I am now sure about my goals and the path to achieve them.",
      name: "Gopal Sharma",
      designation: "Commerce Student",
      img: "/images/GopalSharma.png",
    },
    {
      text: "Career Vidya counselor ne mujhe bahut sahajta se guide kiya. Ab mein sahi disha mein hoon aur apne future ko lekar clear hoon.",
      name: "Chetan Ahir",
      designation: "Student",
      img: "/images/ChetanAhir.png",
    },
  ];

  return (
    <section
      ref={section.ref}
      className={`py-16 transition-all duration-1000 ease-out overflow-hidden bg-white ${
        section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#05347f]">
            Students Who Found Their True Direction!
          </h2>
          <p className="text-lg text-gray-600">
            Read inspiring journeys with <span className="font-semibold text-[#05347f]">Career Vidya</span>.
          </p>
        </div>

        <Swiper
          modules={[Pagination, Autoplay, Navigation]}
          spaceBetween={25}
          slidesPerView={1}
          pagination={{ clickable: true }}
          navigation={true}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          className="pb-16 testimonials-swiper"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i} className="h-auto">
              <div className="bg-white rounded-2xl p-8 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100 flex flex-col h-full min-h-[450px] text-center">
                
                {/* IMAGE FIX: No Head Crop */}
                <div className="flex justify-center mb-6">
                  <div className="w-28 h-28 relative rounded-full border-4 border-[#7b7e80]/10 overflow-hidden bg-gray-50 shadow-inner">
                    <img
                      src={t.img}
                      alt={t.name}
                      // 'object-top' ensures the head is prioritized and not cut off
                      className="w-full h-full object-cover object-top" 
                    />
                  </div>
                </div>

                <h4 className="font-bold text-gray-900 text-lg uppercase tracking-tight">
                  {t.name}
                </h4>
                <p className="text-[#3498db] text-sm font-medium mb-4">
                  {t.designation}
                </p>

                <div className="text-[#3498db] mb-2 text-4xl font-serif opacity-30 leading-none">
                  &ldquo;
                </div>

                <p className="text-gray-600 text-[15px] leading-relaxed italic flex-grow px-2">
                  {t.text}
                </p>

                <div className="text-[#3498db] mt-2 text-4xl font-serif opacity-30 leading-none flex justify-end">
                  &rdquo;
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet { background: #05347f !important; opacity: 0.2; }
        .testimonials-swiper .swiper-pagination-bullet-active { background: #05347f !important; opacity: 1; width: 25px !important; border-radius: 5px !important; }
        .testimonials-swiper .swiper-button-next, .testimonials-swiper .swiper-button-prev { background-color: white !important; width: 45px !important; height: 45px !important; border-radius: 50% !important; color: #05347f !important; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; }
        .testimonials-swiper .swiper-button-next::after, .testimonials-swiper .swiper-button-prev::after { font-size: 18px !important; font-weight: bold !important; }
      `}</style>
    </section>
  );
}