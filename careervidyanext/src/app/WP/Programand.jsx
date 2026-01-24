// "use client";
// import { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';

// const features = [
//   " A specially structured B.Tech program for professionals who want to upgrade their qualifications while continuing their job",
//   " Designed for diploma holders and working professionals seeking formal engineering education",
//   " Learning is delivered through a flexible format that fits around professional schedules",
//   " Curriculum focuses on practical knowledge aligned with current industry requirements",
//   " Degree awarded by recognized universities as per applicable guidelines",
//   "Get real-world insights from experienced professionals",
// ];

// export default function ProgramHighlights() {
//   const [isVisible, setIsVisible] = useState(false);
//   const sectionRef = useRef(null);

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         // Jitni baar scroll karein utni baar animation repeat ho
//         setIsVisible(entry.isIntersecting);
//       },
//       { threshold: 0.15 } 
//     );

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     return () => observer.disconnect();
//   }, []);

//   return (
//     <section 
//       ref={sectionRef}
//       className="bg-blue-50 py-16 md:py-24 overflow-hidden"
//     >
//       <style jsx>{`
//         /* Zoom IN Effect: Shuruat mein choti (0.5) aur blurred */
//         .zoom-in-container {
//           opacity: 0;
//           transform: scale(0.5); 
//           filter: blur(15px);
//           transition: transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), 
//                       opacity 0.8s ease-out, 
//                       filter 1s ease-out;
//         }

//         /* Jab visible ho toh normal size (Scale 1) aur clear */
//         .is-animated {
//           opacity: 1;
//           transform: scale(1);
//           filter: blur(0px);
//         }

//         /* Text slide effect */
//         .text-fade-up {
//           opacity: 0;
//           transform: translateY(30px);
//           transition: all 0.8s ease-out 0.3s;
//         }

//         .is-animated.text-fade-up {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       `}</style>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
//           {/* LEFT SIDE: Image with repeatable Zoom-In */}
//           <div className="flex justify-center md:justify-end relative">
//             {/* Background Glow Effect */}
//             <div className={`absolute inset-0 bg-blue-400 rounded-full blur-[80px] opacity-20 transition-transform duration-1000 ${isVisible ? 'scale-110' : 'scale-0'}`}></div>
            
//             <div className={`zoom-in-container w-full max-w-sm rounded-2xl overflow-hidden shadow-[0_20px_60px_-15px_rgba(37,99,235,0.5)] z-10 ${isVisible ? 'is-animated' : ''}`}>
//               <Image
//                 src="/images/111.jpg" 
//                 alt="Program Overview Image"
//                 width={400}
//                 height={400}
//                 className="object-cover transition-transform duration-500 hover:scale-110"
//                 layout="responsive"
//               />
//             </div>
//           </div>

//           {/* RIGHT SIDE: Text and Features */}
//           <div className={`p-4 text-fade-up ${isVisible ? 'is-animated' : ''}`}>
//             <h2 className="text-3xl font-extrabold text-gray-800 mb-6">
//               Program Overview  
//             </h2>
            
//             <div className="space-y-4">
//               {features.map((text, index) => (
//                 <div 
//                   key={index} 
//                   className="flex items-start text-gray-700 transition-all duration-700"
//                   style={{ 
//                     transitionDelay: isVisible ? `${(index * 100) + 400}ms` : '0ms',
//                     opacity: isVisible ? 1 : 0,
//                     transform: isVisible ? 'translateX(0)' : 'translateX(20px)'
//                   }}
//                 >
//                   <span className="text-blue-600 mr-2 mt-1 flex-shrink-0">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                     </svg>
//                   </span>
//                   <p className="text-base leading-relaxed">{text}</p>
//                 </div>
//               ))}
//             </div>
//           </div>

//         </div>
//       </div>
//     </section>
//   );
// }


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
