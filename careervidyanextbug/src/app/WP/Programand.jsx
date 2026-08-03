"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";

const features = [
  "Career Vidya acts as your complete education partner",
  "Helps you compare multiple universities in one place",
  "Saves time, money & confusion during admission",
  "Ensures you choose the right course aligned with your career goals",
  "Ideal for students, graduates & working professionals",
  "Focused on career growth, not just admissions",
  "Trusted by thousands of learners across India",
  "Guided by experienced education & career experts",
];


export default function ProgramHighlights() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-blue-50 py-16 md:py-24 overflow-hidden"
    >
      <style jsx>{`
        /* ===== FIXED ZOOM-IN (ALWAYS VISIBLE) ===== */
        .zoom-in-container {
          opacity: 0.65;              /* 👈 NOT ZERO */
          transform: scale(0.92);
          filter: blur(4px);
          transition:
            transform 1.2s ease-out,
            opacity 1s ease-out,
            filter 1s ease-out;
        }

        .is-animated {
          opacity: 1;
          transform: scale(1);
          filter: blur(0);
        }

        /* ===== TEXT ===== */
        .text-fade-up {
          opacity: 0;
          transform: translateY(20px);
          transition: all 0.8s ease-out 0.25s;
        }

        .is-animated.text-fade-up {
          opacity: 1;
          transform: translateY(0);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* IMAGE */}
          <div className="flex justify-center md:justify-end relative">
            <div
              className={`absolute inset-0 bg-blue-400 rounded-full blur-[90px] opacity-20 transition-transform duration-1000 ${
                isVisible ? "scale-110" : "scale-0"
              }`}
            />

            <div
              className={`zoom-in-container w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(37,99,235,0.45)] z-10 ${
                isVisible ? "is-animated" : ""
              }`}
            >
              <Image
                src="/images/wy1.jpeg"
                alt="Program Overview"
                width={400}
                height={400}
                layout="responsive"
                className="object-cover transition-transform duration-700 ease-out hover:scale-[1.04]"
              />
            </div>
          </div>

          {/* CONTENT */}
          <div className={`p-4 text-fade-up ${isVisible ? "is-animated" : ""}`}>
            <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
              Why Choose Career Vidya ?
            </h2>

            <div className="space-y-4">
              {features.map((text, index) => (
                <div
                  key={index}
                  className="flex items-start text-gray-700"
                  style={{
                    transition: "all 0.6s ease-out",
                    transitionDelay: isVisible
                      ? `${index * 120 + 350}ms`
                      : "0ms",
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible
                      ? "translateX(0)"
                      : "translateX(16px)",
                  }}
                >
                  <span className="text-blue-600 mr-2 mt-1">
                    ✔
                  </span>
                  <p className="text-base leading-relaxed">{text}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
