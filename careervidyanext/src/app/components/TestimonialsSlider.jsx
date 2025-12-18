

"use client";

import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

/* ========= SCROLL REVEAL HOOK ========= */
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

  /* 🔒 ONLY BLOCK COPY, allow right click & F12 */
  useEffect(() => {
    const blockCopy = (e) => {
      e.preventDefault(); // block copying content
      alert("Copying content is disabled on this page.");
    };

    document.addEventListener("copy", blockCopy);

    return () => {
      document.removeEventListener("copy", blockCopy);
    };
  }, []);

  const testimonials = [
    {
      text: "Before coming to Career Vidya, I had no idea which stream or career to choose. The counsellors patiently guided me through every step and helped me make an informed decision. I’m extremely satisfied with their support!",
      name: "Atul Kumar",
      designation: "Student",
      img: "/images/AtulKumar.png",
    },
    {
      text: "Career Vidya’s assessment and one-on-one counselling session helped me understand my interests and strengths. I’m now pursuing a course I genuinely enjoy — thank you for the clarity and confidence!",
      name: "Vishal Vishwakarma",
      designation: "Student",
      img: "/images/teti1.png",
    },
    {
      text: "The team at Career Vidya really cares about students. Their expert guidance not only helped me choose the right career but also boosted my self-belief.",
      name: "Praveen singh",
      designation: "Student",
      img: "/images/Praveensingh.png",
    },
    {
      text: "I highly recommend Career Vidya to every student who feels lost or confused. Their approach is scientific, professional, and truly student-focused.",
      name: "Gyanendu Sundar Rana",
      designation: "Engineering Aspirant",
      img: "/images/GyanenduSundarRana.png",
    },
    {
      text: "After attending Career Vidya’s session, I realized how important the right guidance is. I’m now sure about my goals and the path to achieve them.",
      name: "Gopal Sharma",
      designation: "Commerce Student",
      img: "/images/GopalSharma.png",
    },
    {
      text: "Career Vidya से जुड़ने से पहले मुझे समझ नहीं आ रहा था कि कौन-सा विषय और करियर मेरे लिए सही रहेगा। उनके काउंसलर ने मुझे बहुत सहजता से गाइड किया और अब मैं सही दिशा में हूँ। मैं बहुत संतुष्ट हूँ।",
      name: "Chetan Ahir",
      designation: "Student",
      img: "/images/ChetanAhir.png",
    },
  ];

  return (
    <section
      ref={section.ref}
      className={`text-gray-900 py-20 bg-white transition-all duration-1000 ease-out select-text
      ${section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          <span className="text-black">
            Students Who Found Their True Direction!
          </span>
        </h2>

        <p className="text-gray-700 mb-12 max-w-3xl mx-auto">
          Read inspiring journeys of learners who identified their goals, built
          confidence, and shaped a successful future with{" "}
          <span className="font-semibold text-[#0056B3]">Career Vidya</span>.
        </p>

        {/* Slider */}
        <Swiper
          modules={[Pagination, Autoplay]}
          spaceBetween={25}
          slidesPerView={1}
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          breakpoints={{
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12 testimonials-swiper"
        >
          {testimonials.map((t, i) => (
            <SwiperSlide key={i}>
              <div
                className={`group relative bg-white
                  border border-[#0056B3]
                  rounded-xl p-4 shadow-sm
                  transition-all duration-700 ease-out
                  hover:border-[#003E7E]
                  hover:bg-gradient-to-br hover:from-[#FFF5EE] hover:to-[#E6F0FF]
                  hover:shadow-[0_4px_12px_rgba(0,86,179,0.25)]
                  max-w-[300px] mx-auto h-auto flex flex-col items-center
                  ${section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
              >
                <img
                  src={t.img}
                  alt={t.name}
                  draggable={false}
                  className="w-14 h-14 rounded-full mb-3 object-cover border-4 border-white shadow-md pointer-events-none"
                />

                <p className="italic text-gray-800 mb-3 text-sm leading-relaxed text-center">
                  <span className="text-black">“</span>
                  <span className="text-[#003E7E]">{t.text}</span>
                  <span className="text-black">”</span>
                </p>

                <div className="mt-2 text-center">
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-[#0056B3] text-sm font-medium">
                    {t.designation}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: #7fa5cc;
          opacity: 0.8;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #0056b3;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
