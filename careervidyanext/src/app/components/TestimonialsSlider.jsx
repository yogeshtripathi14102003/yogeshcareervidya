// "use client";

// import React, { useEffect, useRef, useState } from "react";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Pagination, Autoplay, Navigation } from "swiper/modules";

// // Swiper CSS imports
// import "swiper/css";
// import "swiper/css/pagination";
// import "swiper/css/navigation";

// function useScrollReveal(threshold = 0.25) {
//   const ref = useRef(null);
//   const [visible, setVisible] = useState(false);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { threshold }
//     );

//     if (ref.current) observer.observe(ref.current);
//     return () => observer.disconnect();
//   }, [threshold]);

//   return { ref, visible };
// }

// export default function TestimonialsSlider() {
//   const section = useScrollReveal(0.2);

//   const testimonials = [
//     {
//       text: "Before Career Vidya, I was confused about my stream. Their counsellors guided me through every step to make an informed decision.",
//       name: "Atul Kumar",
//       designation: "Student",
//       img: "/images/AtulKumar.png",
//     },
//     {
//       text: "The assessment helped me understand my strengths. I am now pursuing a course I genuinely enjoy thanks for the confidence!",
//       name: "Vishal Vishwakarma",
//       designation: "Student",
//       img: "/images/teti1.png",
//     },
//     {
//       text: "The team really cares. Their expert guidance not only helped me choose the right career but also boosted my self-belief significantly.",
//       name: "Praveen Singh",
//       designation: "Student",
//       img: "/images/Praveensingh.png",
//     },
//     {
//       text: "I highly recommend Career Vidya to every student who feels lost. Their approach is scientific and truly student-focused.",
//       name: "Gyanendu Sundar",
//       designation: "Engineering Aspirant",
//       img: "/images/GyanenduSundarRana.png",
//     },
//     {
//       text: "After their session, I realized how important right guidance is. I am now sure about my goals and the path to achieve them.",
//       name: "Gopal Sharma",
//       designation: "Commerce Student",
//       img: "/images/GopalSharma.png",
//     },
//     {
//       text: "Career Vidya counselor ne mujhe bahut sahajta se guide kiya. Ab mein sahi disha mein hoon aur apne future ko lekar clear hoon.",
//       name: "Chetan Ahir",
//       designation: "Student",
//       img: "/images/ChetanAhir.png",
//     },
//   ];

//   return (
//     /* Background color changed to #f4f4f4 */
//     <section
//       ref={section.ref}
//       className={`py-12 transition-all duration-1000 ease-out overflow-hidden bg-[#f4f4f4] ${
//         section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
//       }`}
//     >
//       {/* Container width for wider desktop cards */}
//       <div className="max-w-[96%] lg:max-w-[1600px] mx-auto px-4">
//         <div className="mb-8 text-center">
//           <h2 className="text-3xl md:text-5xl font-bold mb-3 text-[#05347f]">
//             Students Who Found Their True Direction!
//           </h2>
//           <p className="text-lg text-gray-600">
//             Read inspiring journeys with <span className="font-semibold text-[#05347f]">Career Vidya</span>.
//           </p>
//         </div>

//         <Swiper
//           modules={[Pagination, Autoplay, Navigation]}
//           spaceBetween={30} 
//           slidesPerView={1}
//           pagination={{ clickable: true }}
//           navigation={true}
//           autoplay={{ delay: 5000, disableOnInteraction: false }}
//           breakpoints={{
//             640: { slidesPerView: 2 },
//             1024: { slidesPerView: 3 },
//             1280: { slidesPerView: 4 }, 
//           }}
//           className="pb-12 testimonials-swiper"
//         >
//           {testimonials.map((t, i) => (
//             <SwiperSlide key={i} className="h-auto">
//               {/* min-h reduced for shorter height, bg-white for card pop-out effect */}
//               <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col h-full min-h-[360px] text-center">
                
//                 <div className="flex justify-center mb-4">
//                   <div className="w-20 h-20 relative rounded-full border-4 border-[#7b7e80]/10 overflow-hidden bg-gray-50 shadow-inner">
//                     <img
//                       src={t.img}
//                       alt={t.name}
//                       className="w-full h-full object-cover object-top" 
//                     />
//                   </div>
//                 </div>

//                 <h4 className="font-bold text-gray-900 text-base uppercase tracking-tight">
//                   {t.name}
//                 </h4>
//                 <p className="text-[#3498db] text-xs font-medium mb-2">
//                   {t.designation}
//                 </p>

//                 <div className="text-[#3498db] mb-1 text-3xl font-serif opacity-30 leading-none">
//                   &ldquo;
//                 </div>

//                 <p className="text-gray-600 text-[14px] leading-snug italic flex-grow px-2">
//                   {t.text}
//                 </p>

//                 <div className="text-[#3498db] mt-1 text-3xl font-serif opacity-30 leading-none flex justify-end">
//                   &rdquo;
//                 </div>
//               </div>
//             </SwiperSlide>
//           ))}
//         </Swiper>
//       </div>

//       <style jsx global>{`
//         .testimonials-swiper .swiper-pagination-bullet { background: #05347f !important; opacity: 0.2; }
//         .testimonials-swiper .swiper-pagination-bullet-active { background: #05347f !important; opacity: 1; width: 25px !important; border-radius: 5px !important; }
//         .testimonials-swiper .swiper-button-next, .testimonials-swiper .swiper-button-prev { background-color: white !important; width: 40px !important; height: 40px !important; border-radius: 50% !important; color: #05347f !important; box-shadow: 0 4px 15px rgba(0,0,0,0.1) !important; }
//         .testimonials-swiper .swiper-button-next::after, .testimonials-swiper .swiper-button-prev::after { font-size: 16px !important; font-weight: bold !important; }
//       `}</style>
//     </section>
//   );
// }


"use client";

import React, { useEffect, useRef, useState } from "react";
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

  return (
    <section
      ref={section.ref}
      className={`bg-[#e6edf7] py-14 transition-all duration-1000 ${
        section.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-4">

        {/* HEADING */}
        <div className="mb-10 text-center">
         <h2 className="text-3xl md:text-4xl font-bold mb-3 text-[#05347f]">
            Students Who Found Their True Direction!
          </h2>
          <p className="text-lg text-gray-600">
            Read inspiring journeys with <span className="font-semibold text-[#05347f]">Career Vidya</span>.
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
              
              {/* ✅ ONLY THIS CARD UPDATED */}
              <div className="bg-[#f3f4f6] rounded-lg p-6 border border-gray-300 shadow-[0_2px_10px_rgba(0,0,0,0.08)] text-center min-h-[340px] flex flex-col justify-between transition hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)]">

                {/* IMAGE */}
                <div className="flex justify-center mb-4">
                 <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 bg-white flex items-center justify-center">
  <img
    src={t.img}
    alt={t.name}
    className="w-full h-full object-contain"
  />
</div>
                </div>

                {/* NAME */}
                <h4 className="font-semibold text-gray-900 text-lg">
                  {t.name}
                </h4>

                {/* DESIGNATION */}
                <p className="text-gray-500 text-sm mb-3">
                  {t.designation}
                </p>

                {/* ARROW */}
                <div className="text-blue-600 text-xl mb-3">↓</div>

                {/* TEXT */}
                <p className="text-gray-700 text-sm leading-relaxed px-2">
                  {t.text}
                </p>

              </div>
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
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          color: #2563eb;
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 16px;
          font-weight: bold;
        }
      `}</style>
    </section>
  );
}