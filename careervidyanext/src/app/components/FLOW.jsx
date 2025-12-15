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

  /* 🔒 DISABLE COPY / SELECT / RIGHT CLICK / SHORTCUTS */
  useEffect(() => {
    const disableContextMenu = (e) => e.preventDefault();

    const disableKeys = (e) => {
      if (
        (e.ctrlKey &&
          ["c", "a", "u", "s"].includes(e.key.toLowerCase())) ||
        e.key === "F12"
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("contextmenu", disableContextMenu);
    document.addEventListener("keydown", disableKeys);

    return () => {
      document.removeEventListener("contextmenu", disableContextMenu);
      document.removeEventListener("keydown", disableKeys);
    };
  }, []);

  return (
    <section
      className="w-full flex flex-col items-center text-center py-12 bg-white overflow-hidden select-none"
      onContextMenu={(e) => e.preventDefault()}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
    >
      {/* ===== Heading ===== */}
      <h2
        ref={heading.ref}
        className={`text-3xl md:text-4xl font-bold text-gray-900 transition-all duration-700 ease-out
        ${heading.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-6"}`}
      >
        Admission Process{" "}
        <span className="text-blue-600">With Online Universities</span>
      </h2>

      {/* ===== Subheading ===== */}
      <p
        ref={text.ref}
        className={`text-gray-600 mt-3 max-w-2xl transition-all duration-700 delay-150
        ${text.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
      >
        Follow these simple steps to get admission in accredited online universities
        across India.
      </p>

      {/* ===== Image Section ===== */}
      <div
        ref={image.ref}
        className={`relative w-full max-w-5xl mt-10 px-4 transition-all duration-1000 ease-out
        ${
          image.visible
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-8 scale-95"
        }`}
      >
        <Image
          src="/images/Process.png"
          alt="Admission Process Flow"
          width={1200}
          height={600}
          className="rounded-lg object-contain mx-auto pointer-events-none"
          draggable={false}
        />
      </div>

      {/* ===== Button ===== */}
      <Link
        ref={button.ref}
        href="/counselling"
        className={`mt-10 inline-block bg-[#0057A0] text-white font-medium px-6 py-3 rounded-md transition-all duration-700 delay-300
        ${button.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      >
        Apply Now
      </Link>
    </section>
  );
}
