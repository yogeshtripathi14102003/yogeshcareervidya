"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Siginup from "@/app/signup/Siginup.jsx"; // 👈 path apne project ke hisaab se check kar lo

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

  const customCursor = {
    cursor: `url('/images/grad-icon.png'), auto`,
  };

  return (
    <>
      <section
        style={customCursor}
        className="w-full bg-white py-6 md:py-10 overflow-hidden"
      >
        {/* HEADING */}
        <h2
          ref={heading.ref}
          className={`text-lg md:text-2xl font-bold text-gray-900 text-center transition-all duration-700
          ${
            heading.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
          }`}
        >
          Admission Process{" "}
          <span className="text-blue-600">With  Universities</span>
        </h2>

        {/* IMAGE */}
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
            alt="Admission Process Flow"
            width={1800}
            height={300}
            priority
            className="w-full h-auto max-h-[160px] md:max-h-[350px]"
          />
        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-6">
          <button
            ref={button.ref}
            onClick={() => setOpenSignup(true)}
            className={`inline-block bg-[#c15304] text-white font-medium px-8 py-2 rounded-md text-xs md:text-sm transition-all duration-700 delay-200 hover:bg-[#c15304] shadow-sm
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

      {/* ✅ SIGNUP POPUP */}
      {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
    </>
  );
}
