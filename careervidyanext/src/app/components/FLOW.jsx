"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Siginup from "@/app/signup/Siginup.jsx";

/* ========= SCROLL ANIMATION HOOK ========= */
function useScrollReveal(threshold = 0.1) {
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

export default function AdmissionProcess() {
  const heading = useScrollReveal(0.1);
  const image = useScrollReveal(0.1);
  const button = useScrollReveal(0.1);

  const [openSignup, setOpenSignup] = useState(false);

  return (
    <>
      <section className="w-full bg-white py-6 md:py-10 overflow-hidden">
        {/* HEADING - Ensure proper hierarchy */}
        <h2
          ref={heading.ref}
          className={`text-lg md:text-3xl font-black text-gray-900 text-center uppercase tracking-tight transition-all duration-700
          ${
            heading.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
          }`}
        >
           <span className="text-[#0056B3]"> Admission Process With Universities</span>
        </h2>

        {/* IMAGE - Optimized for SEO & Performance */}
        <div
          ref={image.ref}
          className={`max-w-7xl mx-auto px-4 mt-6 transition-all duration-1000
          ${
            image.visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          <Image
            src="/images/admission.webp"
            alt="Step by step University Admission Process Flow - CareerVidya" // SEO Keyword optimization
            width={1800}
            height={400} // Proper height to avoid layout shift
            priority
            className="w-full h-auto max-h-[200px] md:max-h-[450px] object-contain"
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-6">
          <button
            ref={button.ref}
            onClick={() => setOpenSignup(true)}
            className={`inline-block bg-[#c15304] cursor-pointer text-white font-black px-10 py-3  rounded text-xs md:text-sm uppercase tracking-widest transition-all duration-700 delay-200 bg-[#c15304] shadow-md active:scale-95
            ${
              button.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            Apply Now
          </button>
        </div>
      </section>

      {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
    </>
  );
}