"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

export default function TestimonialsSlider() {
  const testimonials = [
    {
      text: "Before coming to Career Vidya, I had no idea which stream or career to choose. The counsellors patiently guided me through every step and helped me make an informed decision. I’m extremely satisfied with their support!",
      name: "Atul Kumar",
      designation: "Student",
      img: "/images/Atulkumar.png",
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
      className="text-white py-20"
      style={{
        background: "linear-gradient(135deg, #F58220 0%, #0072CE 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Trusted and Loved by Our Students
        </h2>
        <p className="text-orange-100 mb-12 max-w-3xl mx-auto">
          Hear from students who found the right career direction with{" "}
          <span className="font-semibold">Career Vidya</span>.
        </p>

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
              <div className="bg-gradient-to-br from-[#f7faff] to-[#eaf3ff] border border-[#0072CE40] hover:border-[#0072CE] hover:shadow-xl rounded-2xl p-6 flex flex-col items-center h-[320px] md:h-[300px] transition-all duration-500 hover:scale-95">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-16 h-16 rounded-full mb-4 object-cover border-4 border-[#0072CE] shadow-md"
                />
                <p className="italic text-gray-700 mb-4 text-sm md:text-base leading-relaxed text-center line-clamp-5">
                  “{t.text}”
                </p>
                <div>
                  <p className="font-bold text-gray-900">{t.name}</p>
                  <p className="text-[#F58220] text-sm">{t.designation}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Custom Swiper Pagination */}
      <style jsx global>{`
        .testimonials-swiper .swiper-pagination-bullet {
          background: white;
          opacity: 0.6;
        }
        .testimonials-swiper .swiper-pagination-bullet-active {
          background: #f58220;
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
