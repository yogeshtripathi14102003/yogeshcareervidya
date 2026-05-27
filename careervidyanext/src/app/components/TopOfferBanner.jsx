"use client";

import { useState, useEffect } from "react";
import { Phone, X, Gift } from "lucide-react";
import { useRouter } from "next/navigation";

const isLoggedIn = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("usertoken"); 
};

export default function BottomOfferBanner() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn()) {
      setShow(false);
      return;
    }
    const handleScroll = () => {
      if (window.innerWidth < 768) setShow(true);
      else setShow(window.scrollY > 100);
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!show || isLoggedIn()) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-[999] bg-gradient-to-r from-[#02264c] to-[#02264c] border-t border-white/10 shadow-[0_-5px_20px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom duration-500">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between min-h-[60px] md:min-h-[50px]">
        
        {/* Left Side: Content Block (Close Icon + Text + WhatsApp Link) */}
        <div className="flex flex-wrap items-center justify-between w-full md:w-auto px-4 py-2 md:py-0 gap-4 flex-1">
          
          {/* Close Banner Button */}
          <button 
            onClick={() => setShow(false)} 
            className="text-white/40 hover:text-white transition-colors order-first md:order-none cursor-pointer focus:outline-none"
            aria-label="Close banner"
          >
            <X size={18} />
          </button>

          {/* Text Content (Aligned with your image text + offers) */}
          <div className="flex flex-col items-center md:items-start gap-0.5 flex-1 md:flex-initial justify-center text-center md:text-left">
            <p className="text-[13px] md:text-sm font-semibold text-white tracking-wide">
              Job ke sath MBA karna chahte ho?
            </p>
            <p className="text-[11px] md:text-xs text-slate-300 flex items-center justify-center md:justify-start gap-1">
              <span className="inline-flex bg-yellow-500 p-0.5 rounded-sm shrink-0 items-center justify-center">
                <Gift size={10} className="text-[#2a2a2a]" />
              </span>
              Upgrade your career with <span className="text-yellow-400 font-medium">flexible online MBA</span> (Upto ₹20000 Cashback*)
            </p>
          </div>

          {/* WhatsApp Direct Chat Link */}
          <div className="flex items-center gap-3">
            <a 
              href="https://wa.me/9289712364" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:scale-110 transition-transform cursor-pointer block"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" 
                className="w-5 h-5" 
                alt="WhatsApp Chat" 
              />
            </a>
          </div>
        </div>

        {/* Right Side: Block Action Buttons */}
        <div className="flex items-stretch w-full md:w-auto border-t border-white/10 md:border-t-0 self-stretch shrink-0">
          
          {/* Register Now Block Action */}
          <button
            onClick={() => router.push("/signup")}
            className="flex-1 md:flex-none bg-[#c15304] hover:bg-[#a64602] text-white px-6 py-3 md:py-0 flex items-center justify-center font-medium text-sm transition-colors cursor-pointer border-r border-black/20"
          >
            Enroll Now
          </button>

          {/* Call Invitation Banner Tag */}
          <a
            href="tel:+919289712364"
            className="flex-1 md:flex-none bg-[#111111] hover:bg-[#000000] text-white px-6 py-3 md:py-0 flex items-center justify-center gap-2 font-medium text-sm transition-colors border-r border-black/20 cursor-pointer"
          >
            <span>Call us now</span>
          </a>

          {/* Direct Dial Telephone Link Action */}
          <a 
            href="tel:+919289712364"
            className="flex-1 md:flex-none bg-[#111111] hover:bg-[#000000] text-white px-6 py-3 md:py-0 flex items-center justify-center gap-2 font-bold text-sm tracking-wide transition-colors text-yellow-400 cursor-pointer"
          >
            <Phone size={14} className="fill-current" />
            <span>9289712364</span>
          </a>

        </div>

      </div>
    </div>
  );
}


// "use client";

// import { useState, useEffect } from "react";
// import { Phone, X, Zap } from "lucide-react";
// // Import your existing Signup Popup component here
// import Siginup from "../signup/Siginup.jsx"; 

// /* ================= LOGIN CHECK ================= */
// const isLoggedIn = () => {
//   if (typeof window === "undefined") return false;
//   return !!localStorage.getItem("usertoken");
// };

// export default function BottomOfferBanner() {
//   const [show, setShow] = useState(false);
//   const [showSignupPopup, setShowSignupPopup] = useState(false);

//   /* ================= SHOW / HIDE BANNER ================= */
//   useEffect(() => {
//     if (isLoggedIn()) {
//       setShow(false);
//       return;
//     }

//     const handleScroll = () => {
//       if (window.innerWidth < 768) {
//         setShow(true); 
//       } else {
//         setShow(window.scrollY > 100);
//       }
//     };

//     window.addEventListener("scroll", handleScroll);
//     handleScroll();

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   if (!show || isLoggedIn()) return null;

//   return (
//     <>
//       {/* 1. Tricolour Banner */}
//       <div className="fixed bottom-0 left-0 w-full z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.15)] border-t-2 border-white">
//         <div className="bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] px-4 py-3">
//           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">

//             {/* Offer Text - Added onClick and cursor-pointer here */}
//             <div 
//               onClick={() => setShowSignupPopup(true)}
//               className="flex items-center gap-3 text-center md:text-left cursor-pointer hover:opacity-80 transition-opacity"
//             >
//               <div className="bg-[#000080] p-1.5 rounded-full animate-pulse">
//                  <Zap size={18} className="text-white fill-white" />
//               </div>
//               <div className="flex flex-col">
//                 <span className="text-[#000080] font-black text-sm md:text-base leading-tight uppercase tracking-wider">
//                   Republic Day Special Offer!
//                 </span>
//                 <span className="text-gray-800 text-xs md:text-sm font-bold">
//                   Get Upto <span className="text-[#000080] underline decoration-2 font-black">₹2000 Career Vidya Subsidy*</span>
//                 </span>
//               </div>
//             </div>

//             {/* Buttons Section */}
//             <div className="flex items-center gap-2 flex-wrap justify-center">
//               <a
//                 href="https://wa.me/9289712364"
//                 target="_blank"
//                 className="bg-[#075E54] hover:bg-[#054d44] text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md"
//               >
//                 WhatsApp
//               </a>

//               <a
//                 href="tel:+919289712364"
//                 className="flex items-center gap-1 bg-[#000080] hover:bg-blue-900 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md"
//               >
//                 <Phone size={14} />
//                 Call Now
//               </a>

//               {/* ENROLL NOW Button */}
//               <button
//                 onClick={() => setShowSignupPopup(true)}
//                 className="bg-orange-600 hover:bg-orange-700 text-white font-black px-5 py-2 rounded-full text-xs uppercase tracking-tighter shadow-lg transform hover:scale-105 transition-all border-2 border-white"
//               >
//                 Enroll Now
//               </button>

//               <button
//                 onClick={() => setShow(false)}
//                 className="ml-2 p-1 bg-white/50 hover:bg-white rounded-full text-red-600 transition-colors"
//               >
//                 <X size={18} />
//               </button>
//             </div>
//           </div>
//         </div>
//         <div className="h-1 bg-[#000080] w-full"></div>
//       </div>

//       {/* 2. Modal/Popup Component */}
//       {showSignupPopup && (
//         <Siginup 
//           forceOpen={true} 
//           onClose={() => setShowSignupPopup(false)} 
//         />
//       )}
//     </>
//   );
// }