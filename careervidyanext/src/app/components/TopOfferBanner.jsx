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
    /* bottom-0 kar diya hai taaki niche gap na rahe */
    <div className="fixed bottom-0 left-0 w-full z-[999] border-t border-white/10 bg-[#001a4d] shadow-[0_-5px_20px_rgba(0,0,0,0.4)] animate-in slide-in-from-bottom duration-500">
      
      <div className="max-w-[1200px] mx-auto px-4 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
        
        {/* Left: Text Section (More Compact) */}
        <div className="flex items-center gap-2">
          <div className="bg-yellow-500 p-1 rounded-md">
             <Gift size={16} className="text-[#001a4d]" />
          </div>
          <p className="text-[11px] md:text-sm font-medium text-white">
            Special Offer: <span className="text-yellow-400 font-bold">Upto ₹20000 Cashback*</span> 
          </p>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border-r border-white/20 pr-3">
            <a href="https://wa.me/9289712364" target="_blank" className="hover:scale-110 transition-transform">
              <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-5 h-5" alt="wa" />
            </a>
            <a href="tel:+919289712364" className="text-white/80 hover:text-yellow-400 transition-colors">
              <Phone size={18} />
            </a>
          </div>

          <button
            onClick={() => router.push("/signup")}
            className="bg-yellow-500 hover:bg-yellow-400 text-[#001a4d] px-5 py-1 rounded-full text-[11px] font-bold uppercase transition-all active:scale-95"
          >
            Claim Now
          </button>

          <button onClick={() => setShow(false)} className="text-white/40 hover:text-white">
            <X size={18} />
          </button>
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