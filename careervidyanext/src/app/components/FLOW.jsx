

// "use client";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
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

// // 5 Step Process Data
// const admissionSteps = [
//   {
//     id: 1,
//     title: "Select Your Institution",
//     description: "Choose your preferred university based on career goals & eligibility.",
//     icon: (
//       <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//       </svg>
//     ),
//   },
//   {
//     id: 2,
//     title: "Submit Your Documents",
//     description: "Upload academic marksheets & ID proofs for initial verification.",
//     icon: (
//       <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//       </svg>
//     ),
//   },
//   {
//     id: 3,
//     title: "Verification Process",
//     description: "Officials review application and document authenticity.",
//     icon: (
//       <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//       </svg>
//     ),
//   },
//   {
//     id: 4,
//     title: "Get Registration",
//     description: "Receive official enrollment number and student portal access.",
//     icon: (
//       <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//       </svg>
//     ),
//   },
//   {
//     id: 5,
//     title: "Take Admission",
//     description: "Pay course fees, confirm your seat, and start learning.",
//     icon: (
//       <svg className="w-4 h-4 text-[#0056B3]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//       </svg>
//     ),
//   },
// ];

// export default function AdmissionProcess() {
//   const heading = useScrollReveal(0.1);
//   const diagram = useScrollReveal(0.1);
//   const button = useScrollReveal(0.1);

//   const [openSignup, setOpenSignup] = useState(false);
//   // activeStep now drives BOTH desktop hover/focus AND mobile tap — one source of truth
//   const [activeStep, setActiveStep] = useState(null);

//   // Respect users who prefer reduced motion
//   const [reduceMotion, setReduceMotion] = useState(false);
//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReduceMotion(mq.matches);
//     const handler = (e) => setReduceMotion(e.matches);
//     mq.addEventListener("change", handler);
//     return () => mq.removeEventListener("change", handler);
//   }, []);

//   const handleToggle = (id) => {
//     // On mobile this acts as tap-to-expand/collapse. On desktop, hover already
//     // sets this, so a click just keeps the same card highlighted.
//     setActiveStep((prev) => (prev === id ? null : id));
//   };

//   return (
//     <>
//       <section className="w-full bg-[#FAF8F5] py-8 md:py-12 overflow-hidden font-sans">
//         {/* CUSTOM ANIMATIONS */}
//         <style jsx>{`
//           @keyframes dashOffset {
//             to {
//               stroke-dashoffset: -30;
//             }
//           }
//           .animate-flow-dash {
//             stroke-dasharray: 6 6;
//             animation: dashOffset 1.5s linear infinite;
//           }
//           @keyframes floatY {
//             0%, 100% {
//               transform: translateY(0px);
//             }
//             50% {
//               transform: translateY(-6px);
//             }
//           }
//           .animate-float {
//             animation: floatY 3.2s ease-in-out infinite;
//           }
//           @keyframes pulseRing {
//             0% {
//               transform: scale(1);
//               opacity: 0.7;
//             }
//             70% {
//               transform: scale(1.15);
//               opacity: 0;
//             }
//             100% {
//               transform: scale(1.15);
//               opacity: 0;
//             }
//           }
//           .animate-pulse-ring {
//             animation: pulseRing 2.4s ease-out infinite;
//           }
//           @media (prefers-reduced-motion: reduce) {
//             .animate-flow-dash,
//             .animate-float,
//             .animate-pulse-ring {
//               animation: none;
//             }
//           }
//         `}</style>

//         {/* HEADING */}
//         <h2
//           ref={heading.ref}
//           className={`text-lg md:text-3xl font-black text-gray-900 text-center uppercase tracking-tight transition-all duration-700
//           ${
//             heading.visible
//               ? "opacity-100 translate-y-0"
//               : "opacity-0 -translate-y-4"
//           }`}
//         >
//           <span className="text-[#0056B3]">Admission Process With Universities</span>
//         </h2>

//         {/* Step progress helper text (screen-reader + visual) */}
//         <p className="text-center text-[11px] md:text-xs text-slate-500 mt-2 font-medium">
//           {admissionSteps.length} simple steps from application to enrollment
//         </p>

//         {/* COMPACT & SYSTEMATIC FAN DIAGRAM CONTAINER */}
//         <div
//           ref={diagram.ref}
//           className={`max-w-[960px] mx-auto px-4 mt-8 transition-all duration-1000
//           ${
//             diagram.visible
//               ? "opacity-100 translate-y-0 scale-100"
//               : "opacity-0 translate-y-6 scale-95"
//           }`}
//         >
//           {/* DESKTOP FAN/ARC CANVAS */}
//           <div className="hidden lg:block relative w-[960px] h-[460px] mx-auto select-none">
//             {/* SVG CONNECTING LINES */}
//             <svg
//               className="absolute inset-0 w-full h-full pointer-events-none z-0"
//               viewBox="0 0 960 460"
//               fill="none"
//               aria-hidden="true"
//             >
//               {/* Radial Arc Background Glow */}
//               <path d="M 280 460 A 200 200 0 0 1 680 460" fill="#FFEDD5" opacity="0.35" />
//               <path
//                 d="M 320 460 A 160 160 0 0 1 640 460"
//                 stroke="#c15304"
//                 strokeWidth="1.8"
//                 className={reduceMotion ? "" : "animate-flow-dash"}
//                 fill="none"
//                 opacity="0.8"
//               />

//               {/* Connecting Paths */}
//               <path d="M 230 330 C 300 330, 350 380, 360 390" stroke={activeStep === 1 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 1 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
//               <path d="M 230 130 C 340 130, 390 310, 410 350" stroke={activeStep === 2 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 2 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
//               <path d="M 480 140 L 480 325" stroke={activeStep === 3 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 3 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
//               <path d="M 730 130 C 620 130, 570 310, 550 350" stroke={activeStep === 4 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 4 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />
//               <path d="M 730 330 C 660 330, 610 380, 600 390" stroke={activeStep === 5 ? "#0056B3" : "#c15304"} strokeWidth={activeStep === 5 ? "2.5" : "1.5"} fill="none" className="transition-all duration-300" />

//               {/* Glowing Connection Nodes — filled + white ring so they pop against the background */}
//               <circle cx="360" cy="390" r="6" fill={activeStep === 1 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
//               <circle cx="410" cy="350" r="6" fill={activeStep === 2 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
//               <circle cx="480" cy="325" r="6" fill={activeStep === 3 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
//               <circle cx="550" cy="350" r="6" fill={activeStep === 4 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
//               <circle cx="600" cy="390" r="6" fill={activeStep === 5 ? "#0056B3" : "#c15304"} stroke="#FFFFFF" strokeWidth="3" />
//             </svg>

//             {/* CENTER BRANDING HUB — circular badge, gently animated, perfectly centered */}
//             <div className="absolute left-1/2 -translate-x-1/2 bottom-[15px] w-[100px] h-[100px] bg-white border border-slate-200 shadow-lg rounded-full z-20 hover:scale-105 transition-transform duration-300 flex items-center justify-center p-3 animate-float">
//               <div className="absolute inset-0 rounded-full ring-2 ring-[#c15304]/20 animate-pulse-ring" />
//               <div className="relative w-full h-full flex items-center justify-center">
//                 <Image
//                   src="/images/n12.png"
//                   alt="CareerVidya Logo"
//                   width={78}
//                   height={40}
//                   className="object-contain max-h-full"
//                   priority
//                 />
//               </div>
//             </div>

//             {/* 5 COMPACT CARDS WITH HOVER/FOCUS STATE & STEP BADGE */}
//             <div className="absolute left-[10px] top-[280px] w-[230px] z-10">
//               <CompactCard
//                 item={admissionSteps[0]}
//                 active={activeStep === 1}
//                 onMouseEnter={() => setActiveStep(1)}
//                 onMouseLeave={() => setActiveStep(null)}
//                 onFocus={() => setActiveStep(1)}
//                 onBlur={() => setActiveStep(null)}
//                 onClick={() => handleToggle(1)}
//               />
//             </div>

//             <div className="absolute left-[10px] top-[70px] w-[230px] z-10">
//               <CompactCard
//                 item={admissionSteps[1]}
//                 active={activeStep === 2}
//                 onMouseEnter={() => setActiveStep(2)}
//                 onMouseLeave={() => setActiveStep(null)}
//                 onFocus={() => setActiveStep(2)}
//                 onBlur={() => setActiveStep(null)}
//                 onClick={() => handleToggle(2)}
//               />
//             </div>

//             <div className="absolute left-[365px] top-[10px] w-[230px] z-10">
//               <CompactCard
//                 item={admissionSteps[2]}
//                 highlight
//                 active={activeStep === 3}
//                 onMouseEnter={() => setActiveStep(3)}
//                 onMouseLeave={() => setActiveStep(null)}
//                 onFocus={() => setActiveStep(3)}
//                 onBlur={() => setActiveStep(null)}
//                 onClick={() => handleToggle(3)}
//               />
//             </div>

//             <div className="absolute right-[10px] top-[70px] w-[230px] z-10">
//               <CompactCard
//                 item={admissionSteps[3]}
//                 active={activeStep === 4}
//                 onMouseEnter={() => setActiveStep(4)}
//                 onMouseLeave={() => setActiveStep(null)}
//                 onFocus={() => setActiveStep(4)}
//                 onBlur={() => setActiveStep(null)}
//                 onClick={() => handleToggle(4)}
//               />
//             </div>

//             <div className="absolute right-[10px] top-[280px] w-[230px] z-10">
//               <CompactCard
//                 item={admissionSteps[4]}
//                 active={activeStep === 5}
//                 onMouseEnter={() => setActiveStep(5)}
//                 onMouseLeave={() => setActiveStep(null)}
//                 onFocus={() => setActiveStep(5)}
//                 onBlur={() => setActiveStep(null)}
//                 onClick={() => handleToggle(5)}
//               />
//             </div>
//           </div>

//           {/* MOBILE / TABLET RESPONSIVE LAYOUT — now with tap-to-expand */}
//           <div className="lg:hidden max-w-sm mx-auto space-y-3">
//             {admissionSteps.map((step) => (
//               <CompactCard
//                 key={step.id}
//                 item={step}
//                 active={activeStep === step.id}
//                 expandable
//                 onClick={() => handleToggle(step.id)}
//               />
//             ))}
//           </div>
//         </div>

//         {/* APPLY NOW BUTTON + micro-copy */}
//         <div className="flex flex-col items-center mt-8 gap-2">
//           <button
//             ref={button.ref}
//             onClick={() => setOpenSignup(true)}
//          className={`inline-block bg-[#c15304] cursor-pointer text-white font-black px-10 py-3 rounded text-xs md:text-sm uppercase tracking-widest transition-all duration-700 delay-200 shadow-md active:scale-95
//             ${
//               button.visible
//                 ? "opacity-100 translate-y-0"
//                 : "opacity-0 translate-y-2"
//             }`}
//           >
//             Find My Best Course
//           </button>
//           <p className="text-[11px] text-slate-500 font-medium">
//             Free counselling &bull; No hidden fees
//           </p>
//         </div>
//       </section>

//       {/* SIGNUP / ADMISSION FORM MODAL IMPORT */}
//       {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
//     </>
//   );
// }

// // UPGRADED COMPACT CARD COMPONENT — keyboard accessible, tap-to-expand on mobile
// function CompactCard({
//   item,
//   highlight = false,
//   active = false,
//   expandable = false,
//   onClick,
//   onMouseEnter,
//   onMouseLeave,
//   onFocus,
//   onBlur,
// }) {
//   return (
//     <div
//       role="button"
//       tabIndex={0}
//       aria-expanded={expandable ? active : undefined}
//       aria-label={`Step ${item.id}: ${item.title}`}
//       onClick={onClick}
//       onKeyDown={(e) => {
//         if ((e.key === "Enter" || e.key === " ") && onClick) {
//           e.preventDefault();
//           onClick();
//         }
//       }}
//       onMouseEnter={onMouseEnter}
//       onMouseLeave={onMouseLeave}
//       onFocus={onFocus}
//       onBlur={onBlur}
//       className={`relative bg-white rounded-xl p-3.5 border transition-all duration-300 text-left cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0056B3] focus-visible:ring-offset-2 ${
//         active
//           ? "border-[#0056B3] shadow-lg -translate-y-1 ring-2 ring-[#0056B3]/10"
//           : highlight
//           ? "border-[#c15304] shadow-md ring-1 ring-[#c15304]/20"
//           : "border-slate-200/90 shadow-xs hover:border-[#0056B3] hover:shadow-md hover:-translate-y-1"
//       }`}
//     >
//       {/* Step Badge Counter */}
//       <span
//         className="absolute -top-2.5 -right-2 bg-slate-900 text-white font-black text-[9px] px-2 py-0.5 rounded-full border-2 border-white shadow-xs"
//         aria-hidden="true"
//       >
//         0{item.id}
//       </span>

//       <div className="flex items-center space-x-2 mb-1.5">
//         <div className={`p-1.5 rounded-lg shrink-0 transition-colors ${active ? "bg-[#0056B3] text-white" : "bg-blue-50"}`}>
//           {item.icon}
//         </div>
//         <h3 className="text-xs font-bold text-slate-900 tracking-tight leading-tight">
//           {item.title}
//         </h3>

//         {/* Mobile-only expand indicator so users know the card is tappable */}
//         {expandable && (
//           <svg
//             className={`w-3.5 h-3.5 ml-auto text-slate-400 shrink-0 transition-transform duration-300 ${
//               active ? "rotate-180" : ""
//             }`}
//             fill="none"
//             stroke="currentColor"
//             strokeWidth="2"
//             viewBox="0 0 24 24"
//             aria-hidden="true"
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         )}
//       </div>

//       <div
//         className={
//           expandable
//             ? `grid transition-all duration-300 ease-in-out ${
//                 active ? "grid-rows-[1fr] opacity-100" : "grid-rows-[1fr] opacity-100"
//               }`
//             : undefined
//         }
//       >
//         <span className="text-[9px] font-extrabold text-[#c15304] uppercase tracking-wider block mb-0.5">
//           Process Step
//         </span>
//         <p className="text-[10px] text-slate-500 leading-relaxed font-normal">
//           {item.description}
//         </p>
//       </div>
//     </div>
//   );
// }










// "use client";
// import Image from "next/image";
// import React, { useEffect, useRef, useState } from "react";
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

// const admissionSteps = [
//   {
//     id: 1,
//     title: "Select Institution",
//     description: "Choose your preferred university based on career goals & eligibility.",
//     tag: "Choose",
//     icon: (
//       <svg className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
//       </svg>
//     ),
//   },
//   {
//     id: 2,
//     title: "Submit Documents",
//     description: "Upload academic marksheets & ID proofs for initial verification.",
//     tag: "Submit",
//     icon: (
//       <svg className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
//       </svg>
//     ),
//   },
//   {
//     id: 3,
//     title: "Verification",
//     description: "Officials review application and document authenticity.",
//     tag: "Verify",
//     icon: (
//       <svg className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//       </svg>
//     ),
//   },
//   {
//     id: 4,
//     title: "Get Registration",
//     description: "Receive official enrollment number and student portal access.",
//     tag: "Register",
//     icon: (
//       <svg className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
//       </svg>
//     ),
//   },
//   {
//     id: 5,
//     title: "Take Admission",
//     description: "Pay course fees, confirm your seat, and start learning.",
//     tag: "Enroll",
//     icon: (
//       <svg className="h-full w-full" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
//         <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
//       </svg>
//     ),
//   },
// ];

// export default function AdmissionProcess() {
//   const heading = useScrollReveal(0.1);
//   const diagram = useScrollReveal(0.1);
//   const button = useScrollReveal(0.1);

//   const [openSignup, setOpenSignup] = useState(false);
//   const [activeStep, setActiveStep] = useState(1);
//   const [reduceMotion, setReduceMotion] = useState(false);
//   const autoRotateRef = useRef(null);

//   useEffect(() => {
//     const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
//     setReduceMotion(mq.matches);
//     const handler = (e) => setReduceMotion(e.matches);
//     mq.addEventListener("change", handler);
//     return () => mq.removeEventListener("change", handler);
//   }, []);

//   useEffect(() => {
//     if (reduceMotion) return;
//     autoRotateRef.current = setInterval(() => {
//       setActiveStep((prev) => (prev >= 5 ? 1 : prev + 1));
//     }, 3200);
//     return () => clearInterval(autoRotateRef.current);
//   }, [reduceMotion]);

//   const pauseRotation = () => {
//     if (autoRotateRef.current) clearInterval(autoRotateRef.current);
//   };

//   const handleStepClick = (id) => {
//     setActiveStep(id);
//     pauseRotation();
//   };

//   return (
//     <>
//       {/* ===== LIGHTER BACKGROUND ===== */}
//       <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#1a3a6b] via-[#15315c] to-[#1a3a6b] py-12 font-sans md:py-20">
//         {/* Background pattern */}
//         <div
//           className="absolute inset-0 opacity-[0.05]"
//           style={{
//             backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
//             backgroundSize: "32px 32px",
//           }}
//         />

//         {/* Glow orbs — softer */}
//         <div className="absolute -top-32 left-1/4 h-80 w-80 rounded-full bg-[#3b82f6]/25 blur-[100px]" />
//         <div className="absolute -bottom-32 right-1/4 h-80 w-80 rounded-full bg-[#f5a623]/15 blur-[100px]" />
//         <div className="absolute top-1/2 left-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#60a5fa]/10 blur-[120px]" />

//         <style jsx>{`
//           @keyframes hex-pulse {
//             0%, 100% {
//               transform: scale(1);
//               filter: drop-shadow(0 0 10px rgba(96, 165, 250, 0.6));
//             }
//             50% {
//               transform: scale(1.05);
//               filter: drop-shadow(0 0 28px rgba(96, 165, 250, 1));
//             }
//           }
//           .hex-pulse {
//             animation: hex-pulse 2.5s ease-in-out infinite;
//           }
//           @keyframes float-soft {
//             0%, 100% { transform: translateY(0px); }
//             50% { transform: translateY(-5px); }
//           }
//           .float-soft {
//             animation: float-soft 3.5s ease-in-out infinite;
//           }
//           @keyframes shimmer {
//             0% { background-position: -200% center; }
//             100% { background-position: 200% center; }
//           }
//           .shimmer-text {
//             background-size: 200% auto;
//             animation: shimmer 3s linear infinite;
//           }
//           @keyframes logo-glow {
//             0%, 100% {
//               box-shadow: 0 0 25px rgba(96, 165, 250, 0.6), 0 0 50px rgba(96, 165, 250, 0.4);
//             }
//             50% {
//               box-shadow: 0 0 35px rgba(96, 165, 250, 0.9), 0 0 70px rgba(96, 165, 250, 0.6);
//             }
//           }
//           .logo-glow {
//             animation: logo-glow 3s ease-in-out infinite;
//           }
//           @media (prefers-reduced-motion: reduce) {
//             .hex-pulse, .float-soft, .shimmer-text, .logo-glow { animation: none; }
//           }
//         `}</style>

//         {/* ============ HEADING ============ */}
//         <div
//           ref={heading.ref}
//           className={`relative z-10 px-4 text-center transition-all duration-700 ${
//             heading.visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4"
//           }`}
//         >
//           <div className="inline-flex items-center gap-2 rounded-full border border-[#60a5fa]/40 bg-[#60a5fa]/15 px-4 py-1.5 backdrop-blur-sm">
//             <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#60a5fa]" />
//             <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#93c5fd]">
//               Admission Process
//             </span>
//           </div>

//           <h2 className="mt-4 text-xl font-black text-white md:text-4xl lg:text-5xl">
//             5 Steps to Your{" "}
//             <span className="bg-gradient-to-r from-[#60a5fa] via-[#93c5fd] to-[#fbbf24] bg-clip-text text-transparent shimmer-text">
//               Dream University
//             </span>
//           </h2>

//           <p className="mx-auto mt-3 max-w-lg text-[11px] text-slate-200 md:text-sm">
//             Simple, transparent process from application to enrollment
//           </p>
//         </div>

//         {/* ============ HONEYCOMB ============ */}
//         <div
//           ref={diagram.ref}
//           className={`relative mx-auto mt-8 max-w-[900px] px-2 transition-all duration-1000 md:mt-16 md:px-4 ${
//             diagram.visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
//           }`}
//         >
//           <div className="relative flex h-[560px] items-center justify-center sm:h-[620px] md:h-[680px] lg:h-[680px]">
//             <HoneycombLayout
//               steps={admissionSteps}
//               activeStep={activeStep}
//               onStepClick={handleStepClick}
//               onPause={pauseRotation}
//             />
//           </div>
//         </div>

//         {/* ============ CTA ============ */}
//         <div className="relative z-10 mt-10 flex flex-col items-center gap-2 px-4">
//           <button
//             ref={button.ref}
//             onClick={() => setOpenSignup(true)}
//             className={`group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#c15304] to-[#e67e22] px-8 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-[#c15304]/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#c15304]/60 active:scale-95 md:px-10 md:text-sm ${
//               button.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
//             }`}
//           >
//             <span>Find My Best Course</span>
//             <svg
//               className="h-4 w-4 transition-transform group-hover:translate-x-1"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2.5"
//               viewBox="0 0 24 24"
//             >
//               <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
//             </svg>
//           </button>
//           <p className="text-[10px] font-medium text-slate-300 md:text-[11px]">
//             ✓ Free counselling &bull; ✓ No hidden fees
//           </p>
//         </div>
//       </section>

//       {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
//     </>
//   );
// }

// /* ============ HONEYCOMB LAYOUT — LIGHTER THEME ============ */
// function HoneycombLayout({ steps, activeStep, onStepClick, onPause }) {
//   const [dimensions, setDimensions] = useState({
//     hexW: 200,
//     hexH: 230,
//     containerW: 820,
//     containerH: 680,
//     logoSize: 80,
//   });

//   useEffect(() => {
//     const updateSize = () => {
//       const w = window.innerWidth;
//       if (w < 480) {
//         setDimensions({ hexW: 120, hexH: 140, containerW: 340, containerH: 560, logoSize: 60 });
//       } else if (w < 768) {
//         setDimensions({ hexW: 160, hexH: 185, containerW: 520, containerH: 620, logoSize: 70 });
//       } else {
//         setDimensions({ hexW: 200, hexH: 230, containerW: 820, containerH: 680, logoSize: 80 });
//       }
//     };
//     updateSize();
//     window.addEventListener("resize", updateSize);
//     return () => window.removeEventListener("resize", updateSize);
//   }, []);

//   const { hexW, hexH, containerW, containerH, logoSize } = dimensions;

//   const positions = [
//     { left: "50%", top: "18%" },
//     { left: "18%", top: "42%" },
//     { left: "82%", top: "42%" },
//     { left: "30%", top: "78%" },
//     { left: "70%", top: "78%" },
//   ];

//   return (
//     <div
//       className="relative w-full"
//       style={{ maxWidth: containerW, height: containerH, margin: "0 auto" }}
//     >
//       {/* Connector lines — brighter */}
//       <svg
//         className="pointer-events-none absolute inset-0 h-full w-full"
//         viewBox={`0 0 ${containerW} ${containerH}`}
//         fill="none"
//         aria-hidden="true"
//       >
//         <path
//           d={`M ${containerW * 0.5} ${containerH * 0.18} L ${containerW * 0.18} ${containerH * 0.42}`}
//           stroke="#60a5fa"
//           strokeWidth="1.8"
//           strokeDasharray="4 4"
//           opacity="0.6"
//         />
//         <path
//           d={`M ${containerW * 0.5} ${containerH * 0.18} L ${containerW * 0.82} ${containerH * 0.42}`}
//           stroke="#60a5fa"
//           strokeWidth="1.8"
//           strokeDasharray="4 4"
//           opacity="0.6"
//         />
//         <path
//           d={`M ${containerW * 0.18} ${containerH * 0.42} L ${containerW * 0.3} ${containerH * 0.78}`}
//           stroke="#60a5fa"
//           strokeWidth="1.8"
//           strokeDasharray="4 4"
//           opacity="0.6"
//         />
//         <path
//           d={`M ${containerW * 0.82} ${containerH * 0.42} L ${containerW * 0.7} ${containerH * 0.78}`}
//           stroke="#60a5fa"
//           strokeWidth="1.8"
//           strokeDasharray="4 4"
//           opacity="0.6"
//         />
//         <path
//           d={`M ${containerW * 0.3} ${containerH * 0.78} L ${containerW * 0.7} ${containerH * 0.78}`}
//           stroke="#60a5fa"
//           strokeWidth="1.8"
//           strokeDasharray="4 4"
//           opacity="0.6"
//         />
//       </svg>

//       {steps.map((step, i) => {
//         const isActive = activeStep === step.id;
//         return (
//           <button
//             key={step.id}
//             onClick={() => onStepClick(step.id)}
//             onMouseEnter={() => onStepClick(step.id)}
//             className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
//             style={{
//               left: positions[i].left,
//               top: positions[i].top,
//               width: hexW,
//               height: hexH,
//             }}
//             aria-label={`Step ${step.id}: ${step.title}`}
//           >
//             <div
//               className={`group relative h-full w-full transition-all duration-500 ${
//                 isActive ? "hex-pulse" : ""
//               }`}
//             >
//               {/* Hexagon outer — LIGHTER */}
//               <div
//                 className="absolute inset-0 transition-all duration-500"
//                 style={{
//                   clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//                   background: isActive
//                     ? "linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #1e5aad 100%)"
//                     : "linear-gradient(135deg, rgba(96,165,250,0.25) 0%, rgba(96,165,250,0.08) 100%)",
//                   boxShadow: isActive
//                     ? "0 12px 40px rgba(96, 165, 250, 0.55)"
//                     : "0 4px 16px rgba(0,0,0,0.25)",
//                 }}
//               />

//               {/* Inner hexagon — LIGHTER */}
//               <div
//                 className="absolute inset-[2px] transition-all duration-500"
//                 style={{
//                   clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//                   background: isActive
//                     ? "linear-gradient(135deg, rgba(30,90,173,0.95) 0%, rgba(21,49,92,0.98) 100%)"
//                     : "linear-gradient(135deg, rgba(30,90,173,0.6) 0%, rgba(21,49,92,0.85) 100%)",
//                 }}
//               />

//               {/* Content */}
//               <div className="relative z-10 flex h-full w-full flex-col items-center justify-center px-2 text-center sm:px-3 md:px-6">
//                 <div
//                   className="mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[8px] font-black transition-all duration-300 sm:h-6 sm:w-6 sm:text-[9px] md:mb-2 md:h-7 md:w-7 md:text-[10px]"
//                   style={{
//                     background: isActive ? "#fbbf24" : "rgba(96,165,250,0.25)",
//                     color: isActive ? "#1a3a6b" : "#93c5fd",
//                     boxShadow: isActive ? "0 4px 12px rgba(251,191,36,0.5)" : "none",
//                   }}
//                 >
//                   {String(step.id).padStart(2, "0")}
//                 </div>

//                 <div
//                   className={`mb-1 flex items-center justify-center rounded-lg transition-all duration-300 sm:rounded-xl md:mb-2 ${
//                     isActive ? "bg-white/20 text-white" : "bg-white/10 text-[#93c5fd]"
//                   }`}
//                   style={{
//                     width: hexW < 140 ? "24px" : hexW < 180 ? "32px" : "44px",
//                     height: hexW < 140 ? "24px" : hexW < 180 ? "32px" : "44px",
//                   }}
//                 >
//                   <div
//                     style={{
//                       width: hexW < 140 ? "12px" : hexW < 180 ? "16px" : "20px",
//                       height: hexW < 140 ? "12px" : hexW < 180 ? "16px" : "20px",
//                     }}
//                   >
//                     {step.icon}
//                   </div>
//                 </div>

//                 <span
//                   className="mb-0.5 text-[7px] font-bold uppercase tracking-[0.15em] transition-colors duration-300 sm:text-[8px] md:mb-1 md:text-[8px] md:tracking-[0.2em]"
//                   style={{ color: isActive ? "#fbbf24" : "#94a3b8" }}
//                 >
//                   {step.tag}
//                 </span>

//                 <h3
//                   className="text-[9px] font-bold leading-tight transition-colors duration-300 sm:text-[10px] md:text-[12px]"
//                   style={{ color: isActive ? "#ffffff" : "#e2e8f0" }}
//                 >
//                   {step.title}
//                 </h3>

//                 <div
//                   className={`grid overflow-hidden transition-all duration-500 ${
//                     isActive ? "mt-1 grid-rows-[1fr] opacity-100 md:mt-2" : "grid-rows-[0fr] opacity-0"
//                   }`}
//                 >
//                   <p className="line-clamp-3 overflow-hidden text-[7px] leading-relaxed text-slate-100 sm:text-[8px] md:text-[9px]">
//                     {step.description}
//                   </p>
//                 </div>
//               </div>

//               {isActive && (
//                 <div
//                   className="pointer-events-none absolute inset-0"
//                   style={{
//                     clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//                     background:
//                       "linear-gradient(135deg, rgba(96,165,250,0.7), rgba(251,191,36,0.7))",
//                     padding: "2px",
//                   }}
//                 />
//               )}
//             </div>
//           </button>
//         );
//       })}

//       {/* ===== CENTER LOGO — WHITE BG, BRIGHT ===== */}
//       <div className="absolute left-1/2 top-[48%] z-20 -translate-x-1/2 -translate-y-1/2">
//         <div className="relative">
//           <div className="absolute -inset-3 rounded-full bg-[#60a5fa]/40 blur-2xl md:-inset-4" />

//           <div
//             className="logo-glow relative flex items-center justify-center border-2 border-[#60a5fa]/70 bg-white float-soft"
//             style={{
//               clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)",
//               width: `${logoSize}px`,
//               height: `${logoSize}px`,
//             }}
//           >
//             <Image
//               src="/images/n12.png"
//               alt="CareerVidya"
//               width={logoSize * 0.65}
//               height={logoSize * 0.35}
//               className="object-contain"
//               priority
//             />
//           </div>

//           <div className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full border border-[#60a5fa]/50 bg-[#15315c] px-2 py-0.5 shadow-lg md:mt-2 md:px-3 md:py-1">
//             <span className="text-[7px] font-black uppercase tracking-[0.15em] text-[#93c5fd] md:text-[8px] md:tracking-[0.2em]">
//               Start Here
//             </span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }



// "use client";
// import React, { useState } from "react";
// import Siginup from "@/app/signup/Siginup.jsx";

// // 🔥 EXACT CONTENT FROM SCREENSHOT
// const comparisonSteps = [
//   {
//     id: 1,
//     title: "Get Your Career Match",
//     description:
//       "Take our free career compass personality quiz and get top career options for you.",
//     icon: (
//       <svg
//         className="w-8 h-8 text-slate-800"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
//         />
//       </svg>
//     ),
//   },
//   {
//     id: 2,
//     title: "Apply With One Form",
//     description:
//       "One platform to apply to 2000+ esteemed universities",
//     icon: (
//       <svg
//         className="w-8 h-8 text-slate-800"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//         />
//       </svg>
//     ),
//   },
//   {
//     id: 3,
//     title: "Track Applications in One Place",
//     description:
//       "Apply to and manage all university applications through My Profile",
//     icon: (
//       <svg
//         className="w-8 h-8 text-slate-800"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z"
//         />
//       </svg>
//     ),
//   },
//   {
//     id: 4,
//     title: "Talk to Admission Experts",
//     description:
//       "Get free personalised expert guidance on universities & courses",
//     icon: (
//       <svg
//         className="w-8 h-8 text-slate-800"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
//         />
//       </svg>
//     ),
//   },
//   {
//     id: 5,
//     title: "Easy Apply in 5 mins",
//     description:
//       "Fill your university applications in 5 minutes or less.",
//     icon: (
//       <svg
//         className="w-8 h-8 text-slate-800"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
//         />
//       </svg>
//     ),
//   },
//   {
//     id: 6,
//     title: "Get Exciting Rewards",
//     description:
//       "Win amazing rewards and cash-backs while applying",
//     icon: (
//       <svg
//         className="w-8 h-8 text-slate-800"
//         fill="none"
//         stroke="currentColor"
//         strokeWidth="1.5"
//         viewBox="0 0 24 24"
//       >
//         <path
//           strokeLinecap="round"
//           strokeLinejoin="round"
//           d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
//         />
//       </svg>
//     ),
//   },
// ];

// export default function CounsellingCompareSimple() {
//   const [openSignup, setOpenSignup] = useState(false);

//   return (
//     <>
//       <section className="w-full bg-[#FAF8F5] py-12 md:py-16 font-sans">
//         {/* HEADING */}
//         <div className="max-w-3xl mx-auto px-4 text-center">
//           <h2 className="text-2xl md:text-2xl font-bold text-[#0056B3] leading-tight">
// Choosing the Right University for Your Career Can Be Confusing          </h2>
//           <p className="text-sm text-slate-500 mt-3 font-medium">
//             We're here to guide you at every step of your journey.
//           </p>
//         </div>

//         {/* 🔥 BLUE CARDS GRID (Exact Screenshot Style) */}
//         <div className="max-w-6xl mx-auto px-4 mt-10">
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
//             {comparisonSteps.map((step) => (
//               <SimpleCard key={step.id} item={step} />
//             ))}
//           </div>
//         </div>

//         {/* DO BUTTONS */}
//         <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 px-4">
//           {/* Button 1: Primary (Orange) */}
//           <button
//             onClick={() => setOpenSignup(true)}
//             className="w-full sm:w-auto bg-[#c15304] hover:bg-[#a04503] text-white font-bold px-8 py-3.5 rounded-md text-sm transition-all duration-300 shadow-md hover:shadow-lg active:scale-95"
//           >
//             Let's start your application
//           </button>

//           {/* Button 2: Secondary (Outline) */}
//           <button
//             onClick={() => {
//               console.log("Talk to a college expert clicked");
//             }}
//             className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-bold px-8 py-3.5 rounded-md text-sm border-2 border-slate-300 hover:border-[#0056B3] transition-all duration-300 shadow-sm hover:shadow-md active:scale-95"
//           >
//             Talk to a  expert
//           </button>
//         </div>
//       </section>

//       {openSignup && <Siginup onClose={() => setOpenSignup(false)} />}
//     </>
//   );
// }

// // 🔥 CARD COMPONENT (Blue Background, Text Left, Icon Right)
// function SimpleCard({ item }) {
//   return (
//     <div className="bg-[#4356D6] rounded-md p-5 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all duration-300">
//       {/* Left Side: Text */}
//       <div className="flex-1">
//         <h3 className="text-white font-bold text-base leading-tight mb-1.5">
//           {item.title}
//         </h3>
//         <p className="text-blue-100 text-xs leading-relaxed font-normal">
//           {item.description}
//         </p>
//       </div>

//       {/* Right Side: Icon in White Box */}
//       <div className="w-16 h-16 bg-white rounded-md flex items-center justify-center shrink-0">
//         {item.icon}
//       </div>
//     </div>
//   );
// }



 "use client";

import React, { useState } from "react";
import Image from "next/image";
import Siginup from "@/app/signup/Siginup.jsx";

// 🔥 CONTENT + IMAGE MAPPING
const comparisonSteps = [
  {
    id: 1,
    title: "Get Your Career Match",
    description:
      "Take our free career compass personality quiz and get top career options for you.",
    image: "/images/career.png",
  },
  {
    id: 2,
    title: "Apply With One Form",
    description:
      "One platform to apply to 2000+ esteemed universities",
    image: "/images/apply with one form.png",
  },
  {
    id: 3,
    title: "Track Applications in One Place",
    description:
      "Apply to and manage all university applications through My Profile",
    image: "/images/track application.png",
  },
  {
    id: 4,
    title: "Talk to Admission Experts",
    description:
      "Get free personalised expert guidance on universities & courses",
    image: "/images/talk to expert.png",
  },
  {
    id: 5,
    title: "Easy Apply in 5 mins",
    description:
      "Fill your university applications in 5 minutes or less.",
    image: "/images/apply in 5 mints.png",
  },
  {
    id: 6,
    title: "Get Exciting Rewards",
    description:
      "Win amazing rewards and cash-backs while applying",
    image: "/images/rewards.png",
  },
];

export default function CounsellingCompareSimple() {
  const [openSignup, setOpenSignup] = useState(false);

  return (
    <>
      <section className="w-full bg-[#FAF8F5] py-12 md:py-16 font-sans">

        {/* HEADING */}
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-2xl font-bold text-[#0056B3] leading-tight">
            Choosing the Right University for Your Career Can Be Confusing
          </h2>

          <p className="text-sm text-slate-500 mt-3 font-medium">
            We're here to guide you at every step of your journey.
          </p>
        </div>

        {/* CARDS GRID */}
        <div className="max-w-6xl mx-auto px-4 mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {comparisonSteps.map((step) => (
              <SimpleCard key={step.id} item={step} />
            ))}
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 px-4">

          {/* PRIMARY BUTTON */}
          <button
            onClick={() => setOpenSignup(true)}
            className="
              cursor-pointer
              w-full sm:w-auto
              bg-[#c15304]
              hover:bg-[#a04503]
              text-white
              font-bold
              px-8
              py-3.5
              rounded-md
              text-sm
              transition-all
              duration-300
              shadow-md
              hover:shadow-lg
              active:scale-95
            "
          >
            Let's start your application
          </button>

          {/* SECONDARY BUTTON */}
          <button
            onClick={() => {
              console.log("Talk to a college expert clicked");
            }}
            className="
              cursor-pointer
              w-full sm:w-auto
              bg-white
              hover:bg-slate-50
              text-slate-800
              font-bold
              px-8
              py-3.5
              rounded-md
              text-sm
              border-2
              border-slate-300
              hover:border-[#0056B3]
              transition-all
              duration-300
              shadow-sm
              hover:shadow-md
              active:scale-95
            "
          >
            Talk to a expert
          </button>
        </div>
      </section>

      {/* SIGNUP MODAL */}
      {openSignup && (
        <Siginup onClose={() => setOpenSignup(false)} />
      )}
    </>
  );
}


// 🔥 CARD COMPONENT
function SimpleCard({ item }) {
  return (
    <div
      className="
        bg-[#0056B3]
        rounded-md
        p-5
        flex
        items-center
        justify-between
        gap-4
        shadow-sm
        hover:shadow-md
        transition-all
        duration-300
      "
    >
      {/* LEFT SIDE - TEXT */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-bold text-base leading-tight mb-1.5">
          {item.title}
        </h3>

        <p className="text-blue-100 text-xs leading-relaxed font-normal">
          {item.description}
        </p>
      </div>

      {/* RIGHT SIDE - IMAGE ICON */}
      <div
        className="
          w-16
          h-16
          bg-white
          rounded-md
          flex
          items-center
          justify-center
          shrink-0
          overflow-hidden
        "
      >
        <Image
          src={item.image}
          alt={item.title}
          width={52}
          height={52}
          className="w-12 h-12 object-contain"
        />
      </div>
    </div>
  );
}