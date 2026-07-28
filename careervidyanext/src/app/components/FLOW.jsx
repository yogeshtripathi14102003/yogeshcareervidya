


// "use client";

// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";
// import Siginup from "@/app/signup/Siginup.jsx";

// /* ========= SCROLL ANIMATION HOOK ========= */
// function useScrollReveal(threshold = 0.1) {
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

// export default function AdmissionProcess() {
//   const heading = useScrollReveal(0.1);
//   const image = useScrollReveal(0.1);
//   const button = useScrollReveal(0.1);

//   const [openSignup, setOpenSignup] = useState(false);

//   return (
//     <>
//       <section className="w-full bg-white py-6 md:py-10 overflow-hidden">
//         {/* HEADING - Ensure proper hierarchy */}
//         <h2
//           ref={heading.ref}
//           className={`text-lg md:text-3xl font-black text-gray-900 text-center uppercase tracking-tight transition-all duration-700
//           ${
//             heading.visible
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 -translate-y-4"
//           }`}
//         >
//            <span className="text-[#0056B3]"> Admission Process With Universities</span>
//         </h2>

//         {/* IMAGE - Optimized for SEO & Performance */}
//         <div
//           ref={image.ref}
//           className={`max-w-7xl mx-auto px-4 mt-6 transition-all duration-1000
//           ${
//             image.visible
//               ? "opacity-100 translate-y-0 scale-100"
//               : "opacity-0 translate-y-6 scale-95"
//           }`}
//         >
//           {/* alt: SEO keyword optimization. width/height: explicit dimensions
//               prevent layout shift (good for CLS). loading="lazy": this section
//               is below the fold, so the image should NOT be `priority` — priority
//               is reserved for above-the-fold/LCP images like the Hero Slider.
//               Marking a below-the-fold image as priority forces the browser to
//               fetch it immediately, competing with bandwidth that should go to
//               the real LCP image, which can hurt Core Web Vitals. */}
//           <Image
//             src="/images/admission.webp"
//             alt="Step by step University Admission Process Flow - CareerVidya"
//             width={1800}
//             height={400}
//             loading="lazy"
//             className="w-full h-auto max-h-[200px] md:max-h-[450px] object-contain"
//           />
//         </div>

//         {/* BUTTON */}
//         <div className="flex justify-center mt-6">
//           <button
//             ref={button.ref}
//             onClick={() => setOpenSignup(true)}
//             className={`inline-block bg-[#c15304] cursor-pointer text-white font-black px-10 py-3 rounded text-xs md:text-sm uppercase tracking-widest transition-all duration-700 delay-200 shadow-md active:scale-95
//             ${
//               button.visible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-2"
//             }`}
//           >
//             Apply Now
//           </button>
//         </div>
//       </section>

//       {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
//     </>
//   );
// }





"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
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

// 5 Step Process Data
const admissionSteps = [
  {
    id: 1,
    title: "Select Your Institution",
    description: "Choose your preferred university based on career goals & eligibility.",
    icon: (
      <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Submit Your Documents",
    description: "Upload academic marksheets & ID proofs for initial verification.",
    icon: (
      <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Verification Process",
    description: "Officials review application and document authenticity.",
    icon: (
      <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    id: 4,
    title: "Get Registration",
    description: "Receive official enrollment number and student portal access.",
    icon: (
      <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
  },
  {
    id: 5,
    title: "Take Admission",
    description: "Pay course fees, confirm your seat, and start learning.",
    icon: (
      <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
  },
];

export default function AdmissionProcess() {
  const heading = useScrollReveal(0.1);
  const diagram = useScrollReveal(0.1);
  const button = useScrollReveal(0.1);

  const [openSignup, setOpenSignup] = useState(false);
  // activeStep now drives BOTH desktop hover/focus AND mobile tap — one source of truth
  const [activeStep, setActiveStep] = useState(null);

  // Respect users who prefer reduced motion
  const [reduceMotion, setReduceMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const handler = (e) => setReduceMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const handleToggle = (id) => {
    // On mobile this acts as tap-to-expand/collapse. On desktop, hover already
    // sets this, so a click just keeps the same card highlighted.
    setActiveStep((prev) => (prev === id ? null : id));
  };

  return (
    <>
      <section className="w-full bg-[#FAF8F5] py-8 md:py-12 overflow-hidden font-sans">
        {/* CUSTOM ANIMATIONS */}
        <style jsx>{`
          @keyframes dashOffset {
            to {
              stroke-dashoffset: -30;
            }
          }
          .animate-flow-dash {
            stroke-dasharray: 6 6;
            animation: dashOffset 1.5s linear infinite;
          }
          @keyframes floatY {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-6px);
            }
          }
          .animate-float {
            animation: floatY 3.2s ease-in-out infinite;
          }
          @keyframes pulseRing {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            70% {
              transform: scale(1.15);
              opacity: 0;
            }
            100% {
              transform: scale(1.15);
              opacity: 0;
            }
          }
          .animate-pulse-ring {
            animation: pulseRing 2.4s ease-out infinite;
          }
          @media (prefers-reduced-motion: reduce) {
            .animate-flow-dash,
            .animate-float,
            .animate-pulse-ring {
              animation: none;
            }
          }
        `}</style>

        {/* HEADING */}
        <h2
          ref={heading.ref}
          className={`text-lg md:text-3xl font-black text-gray-900 text-center uppercase tracking-tight transition-all duration-700
          ${
            heading.visible
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4"
          }`}
        >
          <span className="text-[#0056B3]">Admission Process With Universities</span>
        </h2>

        {/* Step progress helper text (screen-reader + visual) */}
        <p className="text-center text-[11px] md:text-xs text-slate-500 mt-2 font-medium">
          {admissionSteps.length} simple steps from application to enrollment
        </p>

        {/* COMPACT & SYSTEMATIC FAN DIAGRAM CONTAINER */}
        <div
          ref={diagram.ref}
          className={`max-w-[960px] mx-auto px-4 mt-8 transition-all duration-1000
          ${
            diagram.visible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-6 scale-95"
          }`}
        >
          {/* DESKTOP FAN/ARC CANVAS */}
          <div className="hidden lg:block relative w-[960px] h-[460px] mx-auto select-none">
            {/* SVG CONNECTING LINES */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none z-0"
              viewBox="0 0 960 460"
              fill="none"
              aria-hidden="true"
            >
              {/* Radial Arc Background Glow */}
              <path d="M 280 460 A 200 200 0 0 1 680 460" fill="#FFEDD5" opacity="0.35" />
              <path
                d="M 320 460 A 160 160 0 0 1 640 460"
                stroke="#c15304"
                strokeWidth="1.8"
                className={reduceMotion ? "" : "animate-flow-dash"}
                fill="none"
                opacity="0.8"
              />

              {/* Connecting Paths */}
              <path d="M 230 330 C 300 330, 350 380, 360 390" stroke={activeStep === 1 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 1 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
              <path d="M 230 130 C 340 130, 390 310, 410 350" stroke={activeStep === 2 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 2 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
              <path d="M 480 140 L 480 325" stroke={activeStep === 3 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 3 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
              <path d="M 730 130 C 620 130, 570 310, 550 350" stroke={activeStep === 4 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 4 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
              <path d="M 730 330 C 660 330, 610 380, 600 390" stroke={activeStep === 5 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 5 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />

              {/* Glowing Connection Nodes — filled + white ring so they pop against the background */}
              <circle cx="360" cy="390" r="6" fill={activeStep === 1 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="410" cy="350" r="6" fill={activeStep === 2 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="480" cy="325" r="6" fill={activeStep === 3 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="550" cy="350" r="6" fill={activeStep === 4 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
              <circle cx="600" cy="390" r="6" fill={activeStep === 5 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
            </svg>

            {/* CENTER BRANDING HUB — circular badge, gently animated, perfectly centered */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[15px] w-[100px] h-[100px] bg-white border border-slate-200 shadow-lg rounded-full z-20 hover:scale-105 transition-transform duration-300 flex items-center justify-center p-3 animate-float">
              <div className="absolute inset-0 rounded-full ring-2 ring-[#c15304]/20 animate-pulse-ring" />
              <div className="relative w-full h-full flex items-center justify-center">
                <Image
                  src="/images/n12.png"
                  alt="CareerVidya Logo"
                  width={78}
                  height={40}
                  className="object-contain max-h-full"
                  priority
                />
              </div>
            </div>

            {/* 5 COMPACT CARDS WITH HOVER/FOCUS STATE & STEP BADGE */}
            <div className="absolute left-[10px] top-[280px] w-[230px] z-10">
              <CompactCard
                item={admissionSteps[0]}
                active={activeStep === 1}
                onMouseEnter={() => setActiveStep(1)}
                onMouseLeave={() => setActiveStep(null)}
                onFocus={() => setActiveStep(1)}
                onBlur={() => setActiveStep(null)}
                onClick={() => handleToggle(1)}
              />
            </div>

            <div className="absolute left-[10px] top-[70px] w-[230px] z-10">
              <CompactCard
                item={admissionSteps[1]}
                active={activeStep === 2}
                onMouseEnter={() => setActiveStep(2)}
                onMouseLeave={() => setActiveStep(null)}
                onFocus={() => setActiveStep(2)}
                onBlur={() => setActiveStep(null)}
                onClick={() => handleToggle(2)}
              />
            </div>

            <div className="absolute left-[365px] top-[10px] w-[230px] z-10">
              <CompactCard
                item={admissionSteps[2]}
                highlight
                active={activeStep === 3}
                onMouseEnter={() => setActiveStep(3)}
                onMouseLeave={() => setActiveStep(null)}
                onFocus={() => setActiveStep(3)}
                onBlur={() => setActiveStep(null)}
                onClick={() => handleToggle(3)}
              />
            </div>

            <div className="absolute right-[10px] top-[70px] w-[230px] z-10">
              <CompactCard
                item={admissionSteps[3]}
                active={activeStep === 4}
                onMouseEnter={() => setActiveStep(4)}
                onMouseLeave={() => setActiveStep(null)}
                onFocus={() => setActiveStep(4)}
                onBlur={() => setActiveStep(null)}
                onClick={() => handleToggle(4)}
              />
            </div>

            <div className="absolute right-[10px] top-[280px] w-[230px] z-10">
              <CompactCard
                item={admissionSteps[4]}
                active={activeStep === 5}
                onMouseEnter={() => setActiveStep(5)}
                onMouseLeave={() => setActiveStep(null)}
                onFocus={() => setActiveStep(5)}
                onBlur={() => setActiveStep(null)}
                onClick={() => handleToggle(5)}
              />
            </div>
          </div>

          {/* MOBILE / TABLET RESPONSIVE LAYOUT — now with tap-to-expand */}
          <div className="lg:hidden max-w-sm mx-auto space-y-3">
            {admissionSteps.map((step) => (
              <CompactCard
                key={step.id}
                item={step}
                active={activeStep === step.id}
                expandable
                onClick={() => handleToggle(step.id)}
              />
            ))}
          </div>
        </div>

        {/* APPLY NOW BUTTON + micro-copy */}
        <div className="flex flex-col items-center mt-8 gap-2">
          <button
            ref={button.ref}
            onClick={() => setOpenSignup(true)}
         className={`inline-block bg-[#c15304] cursor-pointer text-white font-black px-10 py-3 rounded text-xs md:text-sm uppercase tracking-widest transition-all duration-700 delay-200 shadow-md active:scale-95
            ${
              button.visible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2"
            }`}
          >
            Apply Now
          </button>
          <p className="text-[11px] text-slate-500 font-medium">
            Free counselling &bull; No hidden fees
          </p>
        </div>
      </section>

      {/* SIGNUP / ADMISSION FORM MODAL IMPORT */}
      {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
    </>
  );
}

// UPGRADED COMPACT CARD COMPONENT — keyboard accessible, tap-to-expand on mobile
function CompactCard({
  item,
  highlight = false,
  active = false,
  expandable = false,
  onClick,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-expanded={expandable ? active : undefined}
      aria-label={`Step ${item.id}: ${item.title}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if ((e.key === "Enter" || e.key === " ") && onClick) {
          e.preventDefault();
          onClick();
        }
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onFocus={onFocus}
      onBlur={onBlur}
      className={`relative bg-white rounded-xl p-3.5 border transition-all duration-300 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
        active
          ? "border-[#0056B3] shadow-lg -translate-y-1 ring-2 ring-[#0056B3]/10"
          : highlight
          ? "border-[#c15304] shadow-md ring-1 ring-[#c15304]/20"
          : "border-slate-200/90 shadow-xs hover:border-[#0056B3] hover:shadow-md hover:-translate-y-1"
      }`}
    >
      {/* Step Badge Counter */}
      <span
        className="absolute -top-2.5 -right-2 bg-slate-900 text-white font-black text-[9px] px-2 py-0.5 rounded-full border-2 border-white shadow-xs"
        aria-hidden="true"
      >
        0{item.id}
      </span>

      <div className="flex items-center space-x-2 mb-1.5">
        <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${active ? "bg-[#0056B3] text-white" : "bg-blue-50"}`}>
          {item.icon}
        </div>
        <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
          {item.title}
        </h3>

        {/* Mobile-only expand indicator so users know the card is tappable */}
        {expandable && (
          <svg
            className={`w-3.5 h-3.5 ml-auto text-slate-400 shrink-0 transition-transform duration-300 ${
              active ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        )}
      </div>

      <div
        className={
          expandable
            ? `grid transition-all duration-300 ease-in-out ${
                active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100"
              }`
            : undefined
        }
      >
        <span className="text-[9px] font-extrabold text-[#c15304] uppercase tracking-wider block mb-0.5">
          Process Step
        </span>
        <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
          {item.description}
        </p>
      </div>
    </div>
  );
}