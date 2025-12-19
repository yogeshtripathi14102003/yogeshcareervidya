"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/* ================= SCROLL REVEAL HOOK ================= */
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
      text: "The assessment helped me understand my strengths. I’m now pursuing a course I genuinely enjoy—thanks for the confidence!",
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
      text: "After their session, I realized how important right guidance is. I’m now sure about my goals and the path to achieve them.",
      name: "Gopal Sharma",
      designation: "Commerce Student",
      img: "/images/GopalSharma.png",
    },
    {
      text: "Career Vidya के काउंसलर ने मुझे बहुत सहजता से गाइड किया। अब मैं सही दिशा में हूँ और अपने भविष्य को लेकर पूरी तरह से स्पष्ट हूँ।",
      name: "Chetan Ahir",
      designation: "Student",
      img: "/images/ChetanAhir.png",
    },
  ];

  return (
    <section
      ref={section.ref}
      className={`py-16 transition-all duration-1000 ease-out overflow-hidden
        ${section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}
        bg-white`}   // ✅ FORCE WHITE BACKGROUND
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* ================= HEADING CENTER ================= */}
        <div className="mb-12 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-[#05347f]">
            Students Who Found Their True Direction!
          </h2>
          <p className="text-lg text-gray-600">
            Read inspiring journeys with{" "}
            <span className="font-semibold text-[#05347f]">
              Career Vidya
            </span>
            .
          </p>
        </div>

        {/* ================= SLIDER ================= */}
        <div className="relative">
          <Swiper
            modules={[Pagination, Autoplay, Navigation]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            navigation
            autoplay={{ delay: 5000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
            className="pb-16 testimonials-swiper"
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i} className="h-full">
                <div className="bg-white rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex flex-col justify-between h-full min-h-[320px] border border-gray-100">
                  <div>
                    <div className="text-[#3498db] mb-4 text-4xl font-serif opacity-70">
                      “
                    </div>
                    <p className="text-gray-700 text-[15px] leading-relaxed line-clamp-5">
                      {t.text}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 border-t border-gray-100 pt-4 mt-4">
                    <img
                      src={t.img}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#3498db]"
                    />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm uppercase">
                        {t.name}
                      </h4>
                      <p className="text-gray-500 text-xs font-medium">
                        {t.designation}
                      </p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* ================= GLOBAL STYLES ================= */}
      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: #05347f !important;
          opacity: 0.3;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #05347f !important;
          opacity: 1;
        }

        .testimonials-swiper .swiper-button-next,
        .testimonials-swiper .swiper-button-prev {
          background-color: #05347f;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .testimonials-swiper .swiper-button-next::after,
        .testimonials-swiper .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }

        .swiper-slide {
          height: auto !important;
        }
      `}</style>
    </section>
  );
}
