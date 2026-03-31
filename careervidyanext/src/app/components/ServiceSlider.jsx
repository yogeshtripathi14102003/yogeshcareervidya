"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

/* ===================== STATIC DATA ===================== */
const staticBanners = [
  {
    id: "static1",
    title: "IBA 2024",
    image: "/images/a4.jpg",
  },
  {
    id: "static2",
    title: "IBA 2025",
    image: "/images/a5.jpeg",
  },
  {
    id: "static3",
    title: "IBA 2023",
    image: "/images/a1.jpeg",
  },
];

const COMP = () => {
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

  return (
    <>
      {/* 🔥 INTERNAL CSS */}
      <style jsx>{`
        .no-copy {
          user-select: none;
          -webkit-user-select: none;
          -ms-user-select: none;
        }
      `}</style>

      <section
        ref={containerRef}
        className="px-5 py-8 bg-gray-50 no-copy"
        onContextMenu={(e) => e.preventDefault()} // right click block
        onCopy={(e) => e.preventDefault()} // copy block
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT CONTENT */}
          <div className="lg:col-span-4 text-center lg:text-left mt-6 lg:mt-14">
            <div className="animate-left space-y-4 px-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0056B3]">
                Where Real Stories Meet Honest Truth and Real Impact.
              </h1>
              <p className="text-base md:text-lg text-gray-700 text-justify">
                Career Vidya Is Proudly Recognized with The Prestigious Indian Business Award for Transforming Student Careers Through Expert Guidance and Online Education. From Simplifying Career Choices to Creating Success Stories, We Continue to Set New Benchmarks in Career Development.
                With A Strong Network of Top Universities and Industry Experts, We Ensure Every Student Receives Personalized Guidance Tailored to Their Goals. Our Commitment Goes Beyond Admissions. We Focus on Long-Term Career Growth, Skill Development, And Real-World Opportunities. Thousands Of Learners Trust Career Vidya to Make Informed Decisions and Achieve Success with Confidence.
              </p>
            </div>
          </div>

          {/* RIGHT CONTENT */}
          <div className="lg:col-span-8 text-center space-y-8">
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-[#0056B3] uppercase">
              India’s Leading Career Platform Awarded at IBA
            </h2>

            {/* DESKTOP VIEW */}
            <div className="hidden md:grid grid-cols-3 gap-4">
              {staticBanners.map((item) => (
                <div key={item.id} className="h-80 rounded-xl overflow-hidden bg-white shadow-md">
                  <Image
                    src={item.image}
                    alt={item.title}
                    width={500}
                    height={300}
                    className="object-cover w-full h-full hover:scale-105 transition duration-500"
                  />
                </div>
              ))}
            </div>

            {/* MOBILE VIEW */}
            <div className="block md:hidden">
              <div className="h-64 rounded-xl overflow-hidden bg-white shadow-md">
                <Image
                  src={staticBanners[1].image}
                  alt={staticBanners[1].title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
};

export default COMP;