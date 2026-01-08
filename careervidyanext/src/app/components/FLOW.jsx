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


// "use client";
// import React from 'react';
// import { motion } from 'framer-motion';
// import { ChevronRight, GraduationCap, ScrollText } from 'lucide-react';

// const steps = [
//   { id: 1, title: 'Research Programs' },
//   { id: 2, title: 'Application' },
//   { id: 3, title: 'Admission Offer' },
//   { id: 4, title: 'Enrolment' },
//   { id: 5, title: 'Start Learning' },
// ];

// export default function AdmissionProcess() {
//   return (
//     <section className="relative min-h-[650px] w-full flex items-center justify-center overflow-hidden p-6 bg-gray-200">
//       {/* Background Image (Same as Image) */}
//       <div 
//         className="absolute inset-0 z-0 bg-cover bg-center"
//         style={{ 
//           backgroundImage: 'url("https://images.unsplash.com/photo-1541339907198-e08756ebafe3?q=80&w=2070&auto=format&fit=crop")', 
//           filter: 'brightness(0.7) blur(2px)' 
//         }}
//       />

//       <div className="relative z-10 w-full max-w-7xl px-4 md:px-10">
//         {/* Header Text */}
//         <div className="text-white mb-16 drop-shadow-lg">
//           <h2 className="text-5xl md:text-6xl font-bold mb-1">Admission Process</h2>
//           <p className="text-2xl md:text-3xl font-light opacity-90">With Online Universities</p>
//         </div>

//         {/* Process Line */}
//         <div className="flex items-center justify-between w-full">
          
//           {/* Walking Student (Left) */}
//           <div className="flex flex-col items-center min-w-[100px]">
//             <motion.div 
//               animate={{ x: [0, 8, 0], y: [0, -5, 0] }}
//               transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
//             >
//               <div className="relative">
//                 <div className="bg-blue-600 p-2 rounded-md shadow-lg">
//                   <GraduationCap size={42} className="text-white fill-white" />
//                 </div>
//                 {/* Backpack & Legs feel */}
//                 <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-800 rounded-full" />
//               </div>
//             </motion.div>
//             <div className="h-1 w-20 bg-blue-400/50 rounded-full mt-4 blur-[1px]" />
//           </div>

//           {/* Steps Loop with Hover Effect */}
//           {steps.map((step, index) => (
//             <React.Fragment key={step.id}>
//               <motion.div
//                 // HOVER MAGIC: Jha cursor jayega wahi highlight hoga
//                 whileHover={{ 
//                   scale: 1.15,
//                   borderColor: "#3b82f6", // Blue Border
//                   boxShadow: "0px 0px 30px rgba(59, 130, 246, 0.7)", // Blue Glow
//                   zIndex: 50
//                 }}
//                 transition={{ type: "spring", stiffness: 300, damping: 20 }}
//                 className="relative flex flex-col items-center justify-center text-center
//                            w-[160px] h-[110px] bg-white rounded-2xl border-[3px] border-transparent 
//                            cursor-pointer shadow-xl transition-colors duration-200 group"
//               >
//                 <p className="text-gray-800 font-bold text-sm leading-tight px-3 group-hover:text-blue-600">
//                   {step.id}. {step.title}
//                 </p>
//               </motion.div>

//               {/* Arrow Icon */}
//               <div className="text-gray-400/80 px-1">
//                 <ChevronRight size={28} strokeWidth={3} />
//               </div>
//             </React.Fragment>
//           ))}

//           {/* Final Diploma Icon (Right) */}
//           <motion.div 
//             whileHover={{ scale: 1.2, rotate: 5 }}
//             className="relative flex items-center justify-center ml-2"
//           >
//             {/* Double Ring Effect */}
//             <div className="absolute w-24 h-24 border-4 border-blue-400/30 rounded-full animate-pulse" />
//             <div className="absolute w-20 h-20 border-[3px] border-blue-500 rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)]">
//                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-inner">
//                   <div className="relative">
//                     <ScrollText size={32} className="text-blue-600" />
//                     {/* Small Red Seal */}
//                     <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-600 rounded-full border-2 border-white shadow-sm" />
//                   </div>
//                </div>
//             </div>
//           </motion.div>

//         </div>

//         {/* Apply Now Button */}
//         <div className="mt-20 flex justify-center">
//           <motion.button 
//             whileHover={{ scale: 1.1, backgroundColor: '#1d4ed8', boxShadow: "0px 10px 40px rgba(30, 64, 175, 0.5)" }}
//             whileTap={{ scale: 0.95 }}
//             className="bg-blue-600 text-white px-16 py-4 rounded-2xl text-2xl font-bold shadow-2xl tracking-wide"
//           >
//             Apply Now
//           </motion.button>
//         </div>
//       </div>
//     </section>
//   );
// }