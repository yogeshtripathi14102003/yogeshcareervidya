"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

  // Custom Cursor Style
  // Note: Image size 32x32 ya 48x48 rakhein taaki cursor bada na dikhe
  const customCursor = {
    cursor: `url('/images/grad-icon.png'), auto`, 
  };

  return (
    <section 
      style={customCursor} 
      className="w-full bg-white py-6 md:py-10 overflow-hidden"
    >
      
      {/* 1. HEADING */}
      <h2
        ref={heading.ref}
        className={`text-lg md:text-2xl font-bold text-gray-900 text-center transition-all duration-700 ease-out
        ${
          heading.visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-4"
        }`}
      >
        Admission Process{" "}
        <span className="text-blue-600">With Online Universities</span>
      </h2>

      {/* 2. IMAGE */}
      <div
        ref={image.ref}
        className={`max-w-7xl mx-auto px-4 mt-6 transition-all duration-1000 ease-out relative group
        ${
          image.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-6 scale-95"
        }`}
      >
        <Image
          src="/images/an2.png"
          alt="Admission Process Flow"
          width={1800}
          height={300}
          priority
          className="w-full h-auto max-h-[160px] md:max-h-[350px]"
        />
      </div>

      {/* 3. BUTTON */}
      <div className="flex justify-center mt-6">
        <Link
          ref={button.ref}
          href="/"
          className={`inline-block bg-[#0056B3] text-white font-medium px-8 py-2 rounded-md text-xs md:text-sm transition-all duration-700 delay-200 hover:bg-[#004494] shadow-sm
          ${
            button.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-2"
          }`}
        >
          Apply Now
        </Link>
      </div>

    </section>
  );
}