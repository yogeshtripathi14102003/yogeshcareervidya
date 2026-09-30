"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Script from "next/script";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

function useScrollReveal(threshold = 0.2) {
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
  const section = useScrollReveal();

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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CareerVidya",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.careervidya.in",
    review: testimonials.map((t) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: t.name,
      },
      reviewBody: t.text,
    })),
  };

  return (
    <>
      <Script
        id="testimonials-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        ref={section.ref}
        aria-label="Student Testimonials"
        className={`py-14 transition-all duration-1000 ${
          section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
        style={{ background: "#EFF6FF" }}
      >
        <div className="max-w-[1400px] mx-auto px-4">

          {/* HEADING */}
          <div className="mb-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#1E3A8A" }}>
              Students Who Found Their True Direction!
            </h2>
            <p className="text-lg" style={{ color: "#64748B" }}>
              Read inspiring journeys with{" "}
              <span className="font-semibold" style={{ color: "#1E3A8A" }}>
                Career Vidya
              </span>.
            </p>
          </div>

          {/* SLIDER */}
          <Swiper
            modules={[Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation
            autoplay={{ delay: 4000 }}
            breakpoints={{
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
              1280: { slidesPerView: 4 },
            }}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <article
                  className="bg-white rounded-lg p-6 text-center min-h-[340px] flex flex-col justify-between transition"
                  style={{
                    border: "1px solid #E5E7EB",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
                  }}
                  aria-label={`Testimonial by ${t.name}`}
                  itemScope
                  itemType="https://schema.org/Review"
                >
                  {/* IMAGE */}
                  <div className="flex justify-center mb-4">
                    <div
                      className="w-20 h-20 rounded-full overflow-hidden bg-white flex items-center justify-center"
                      style={{ border: "2px solid #E5E7EB" }}
                    >
                      <Image
                        src={t.img}
                        alt={`${t.name} - CareerVidya Student`}
                        width={80}
                        height={80}
                        className="w-full h-full object-contain"
                        loading={i < 2 ? "eager" : "lazy"}
                      />
                    </div>
                  </div>

                  {/* NAME */}
                  <h3
                    className="font-semibold text-lg"
                    style={{ color: "#0F172A" }}
                    itemProp="author"
                  >
                    {t.name}
                  </h3>

                  {/* DESIGNATION */}
                  <p className="text-sm mb-3" style={{ color: "#64748B" }}>
                    {t.designation}
                  </p>

                  {/* ARROW */}
                  <div
                    className="text-xl mb-3"
                    style={{ color: "#F97316" }}
                    aria-hidden="true"
                  >
                    ↓
                  </div>

                  {/* TEXT */}
                  <p
                    className="text-sm leading-relaxed px-2"
                    style={{ color: "#64748B" }}
                    itemProp="reviewBody"
                  >
                    {t.text}
                  </p>
                </article>
              </SwiperSlide>
            ))}
          </Swiper>

        </div>

        {/* NAV STYLE */}
        <style jsx global>{`
          .swiper-button-next,
          .swiper-button-prev {
            background: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            color: #1E3A8A;
          }

          .swiper-button-next::after,
          .swiper-button-prev::after {
            font-size: 16px;
            font-weight: bold;
          }
        `}</style>
      </section>
    </>
  );
}