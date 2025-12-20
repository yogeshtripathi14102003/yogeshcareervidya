"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ========= SCROLL ANIMATION HOOK ========= */
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

export default function AdmissionProcess() {
  const heading = useScrollReveal(0.3);
  const text = useScrollReveal(0.35);
  const image = useScrollReveal(0.25);
  const button = useScrollReveal(0.2);

  return (
    <section className="w-full bg-white py-14 overflow-hidden">
      
      {/* ===== Heading ===== */}
      <h2
        ref={heading.ref}
        className={`text-3xl md:text-4xl font-bold text-gray-900 text-center transition-all duration-700 ease-out
        ${
          heading.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-6"
        }`}
      >
        Admission Process{" "}
        <span className="text-[#172d6ff2]">With Online Universities</span>
      </h2>

      {/* ===== Subheading ===== */}
      <p
        ref={text.ref}
        className={`text-gray-600 mt-3 mx-auto max-w-3xl text-center transition-all duration-700 delay-150
        ${
          text.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4"
        }`}
      >
        Follow these simple steps to get admission in accredited online universities
        across India.
      </p>

      {/* ===== FULL WIDTH IMAGE ===== */}
      <div
        ref={image.ref}
        className={`w-full mt-12 px-4 md:px-10 transition-all duration-1000 ease-out
        ${
          image.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <Image
          src="/images/w.jpg"
          alt="Admission Process Flow"
          width={1920}
          height={800}
          priority
          className="w-full h-auto object-contain mx-auto"
        />
      </div>

      {/* ===== Button ===== */}
      <div className="flex justify-center">
        <Link
          ref={button.ref}
          href="/counselling"
          className={`mt-12 inline-block bg-[#0057A0] text-white font-medium px-8 py-3 rounded-md transition-all duration-700 delay-300
          ${
            button.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-6"
          }`}
        >
          Apply Now
        </Link>
      </div>

    </section>
  );
}
