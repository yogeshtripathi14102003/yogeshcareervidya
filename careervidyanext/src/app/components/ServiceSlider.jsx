// "use client";

// import { useRef } from "react";
// import Image from "next/image";
// import Script from "next/script";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import { useGSAP } from "@gsap/react";

// gsap.registerPlugin(ScrollTrigger);

// /* ===================== STATIC DATA ===================== */
// const staticBanners = [
//   {
//     id: "static1",
//     title: "CareerVidya receiving Indian Business Award 2024",
//     image: "/images/a4.jpg",
//   },
//   {
//     id: "static2",
//     title: "CareerVidya honored at Indian Business Award 2025",
//     image: "/images/a5.jpeg",
//   },
//   {
//     id: "static3",
//     title: "CareerVidya at Indian Business Award 2023",
//     image: "/images/a1.jpeg",
//   },
// ];

// const IBASection = () => {
//   const containerRef = useRef(null);

//   useGSAP(
//     () => {
//       const mm = gsap.matchMedia();
//       mm.add("(min-width: 768px)", () => {
//         gsap.fromTo(
//           ".animate-left",
//           { x: -80, opacity: 0 },
//           {
//             x: 0,
//             opacity: 1,
//             duration: 1,
//             ease: "power3.out",
//             scrollTrigger: {
//               trigger: ".animate-left",
//               start: "top 70%",
//             },
//           }
//         );
//       });
//       return () => mm.revert();
//     },
//     { scope: containerRef }
//   );

//   // JSON-LD: Award structured data
//   const jsonLd = {
//     "@context": "https://schema.org",
//     "@type": "Organization",
//     name: "CareerVidya",
//     url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.careervidya.in",
//     award: [
//       "Indian Business Award 2023 - Best Career Counselling Platform",
//       "Indian Business Award 2024 - Best Career Counselling Platform",
//       "Indian Business Award 2025 - Best Career Counselling Platform",
//     ],
//     description:
//       "CareerVidya is proudly recognized with the prestigious Indian Business Award for transforming student careers through expert guidance and online education.",
//   };

//   return (
//     <>
//       <Script
//         id="iba-jsonld"
//         type="application/ld+json"
//         dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
//       />

//       <section
//         ref={containerRef}
//         className="px-5 py-8 bg-gray-50"
//         aria-label="CareerVidya Indian Business Award Recognition"
//       >
//         <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

//           {/* LEFT CONTENT */}
//           <div className="lg:col-span-4 text-center lg:text-left mt-6 lg:mt-14">
//             <div className="animate-left space-y-4 px-2">
//               <h2 className="text-2xl md:text-3xl font-extrabold text-[#0056B3]">
//                 Where Real Stories Meet Honest Truth and Real Impact.
//               </h2>
//               <p className="text-base md:text-xl text-gray-700 text-justify">
//                 Career Vidya Is Proudly Recognized with The Prestigious Indian Business Award for Transforming Student Careers Through Expert Guidance and Online Education. From Simplifying Career Choices to Creating Success Stories, We Continue to Set New Benchmarks in Career Development.
//                 With A Strong Network of Top Universities and Industry Experts, We Ensure Every Student Receives Personalized Guidance Tailored to Their Goals. Our Commitment Goes Beyond Admissions. We Focus on Long-Term Career Growth, Skill Development, And Real-World Opportunities. Thousands Of Learners Trust Career Vidya to Make Informed Decisions and Achieve Success with Confidence.
//               </p>
//             </div>
//           </div>

//           {/* RIGHT CONTENT */}
//           <div className="lg:col-span-8 text-center space-y-8">
//             <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#0056B3] uppercase">
//               India's Leading Career Platform Awarded at IBA
//             </h3>

//             {/* ALL SCREENS — 1 col mobile, 3 col desktop */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {staticBanners.map((item, index) => (
//                 <div
//                   key={item.id}
//                   className="h-64 md:h-80 rounded-xl overflow-hidden bg-white shadow-md"
//                 >
//                   <Image
//                     src={item.image}
//                     alt={item.title}
//                     width={500}
//                     height={300}
//                     className="object-cover w-full h-full hover:scale-105 transition duration-500"
//                     loading={index === 0 ? "eager" : "lazy"}
//                     sizes="(max-width: 768px) 100vw, 33vw"
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </section>
//     </>
//   );
// };

// export default IBASection;

"use client";

import { useRef } from "react";
import Image from "next/image";
import Script from "next/script";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ===================== STATIC DATA ===================== */
const staticBanners = [
  {
    id: "static1",
    title: "CareerVidya receiving Indian Business Award 2024",
    image: "/images/a4.jpg",
  },
  {
    id: "static2",
    title: "CareerVidya honored at Indian Business Award 2025",
    image: "/images/a5.jpeg",
  },
  {
    id: "static3",
    title: "CareerVidya at Indian Business Award 2023",
    image: "/images/a1.jpeg",
  },
];

const IBASection = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        gsap.fromTo(
          ".animate-left",
          { x: -80, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: ".animate-left",
              start: "top 70%",
            },
          }
        );
      });
      return () => mm.revert();
    },
    { scope: containerRef }
  );

  // JSON-LD: Award structured data
  // NOTE: keep the wording/years here in sync with your actual award
  // certificates — structured data should match the real, verifiable
  // recognition exactly (e.g. official award name/category as issued).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CareerVidya",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://www.careervidya.in",
    award: [
      "Indian Business Award 2023 - Best Career Counselling Platform",
      "Indian Business Award 2024 - Best Career Counselling Platform",
      "Indian Business Award 2025 - Best Career Counselling Platform",
    ],
    description:
      "CareerVidya is proudly recognized with the prestigious Indian Business Award for transforming student careers through expert guidance and online education.",
  };

  return (
    <>
      <Script
        id="iba-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        ref={containerRef}
        className="px-5 py-8 bg-gray-50"
        aria-label="CareerVidya Indian Business Award Recognition"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* LEFT CONTENT */}
          <div className="lg:col-span-4 text-center lg:text-left mt-6 lg:mt-14">
            <div className="animate-left space-y-4 px-2">
              <h2 className="text-2xl md:text-3xl font-extrabold text-[#0056B3]">
                Where Real Stories Meet Honest Truth and Real Impact.
              </h2>
              <p className="text-base md:text-xl text-gray-700 text-justify [hyphens:auto] [text-justify:inter-word]">
                Career Vidya Is Proudly Recognized with The Prestigious Indian Business Award for Transforming Student Careers Through Expert Guidance and Online Education. From Simplifying Career Choices to Creating Success Stories, We Continue to Set New Benchmarks in Career Development.
                With A Strong Network of Top Universities and Industry Experts, We Ensure Every Student Receives Personalized Guidance Tailored to Their Goals. Our Commitment Goes Beyond Admissions. We Focus on Long-Term Career Growth, Skill Development, And Real-World Opportunities. Thousands Of Learners Trust Career Vidya to Make Informed Decisions and Achieve Success with Confidence.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-8 text-center space-y-8">
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#0056B3] uppercase">
              India's Leading Career Platform Awarded at IBA
            </h3>

            {/* ALL SCREENS — 1 col mobile, 3 col desktop */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {staticBanners.map((item, index) => (
                <div
                  key={item.id}
                  className="h-64 md:h-80 rounded-xl overflow-hidden bg-white shadow-md"
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full hover:scale-105 transition duration-500"
                    loading={index === 0 ? "eager" : "lazy"}
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default IBASection;