"use client";

import { useState } from "react";
import Applynow from "@/app/WP/Applynow.jsx"; 

export default function CompactBannerSection() {
  const backgroundImage = "/images/WPban.webp"; 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full overflow-hidden">
      
      {/* Banner Image */}
      <img 
        src={backgroundImage} 
        alt="Banner" 
        className="
          w-full 
          h-[250px]          /* 📱 mobile height */
          sm:h-[350px] 
          md:h-[500px]        /* 🖥 desktop height */
          lg:h-[600px]        /* 🖥 badi screens ke liye max height */
          object-cover        /* ⚡ Yeh side ke space ko khatam karega */
          object-center       /* Image hamesha center se focus rahegi */
        " 
      />

      {/* Apply Now Button */}
      <div
        className="
          absolute 
          bottom-4           /* 📱 mobile */
          left-4
          md:bottom-16       /* 🖥 desktop */
          md:left-10
        "
      >
        <button
          onClick={() => setIsOpen(true)}
          className="
            cursor-pointer 
            bg-[#FFC107] 
            text-black 
            font-bold 
            py-[6px] 
            px-5 
            md:py-3 
            md:px-10
            rounded-lg 
            hover:bg-[#FFB300] 
            transition 
            shadow-xl 
            text-[10px] 
            md:text-sm
            uppercase 
            flex 
            items-center 
            justify-center 
            tracking-wide
          "
        >
          Apply Now <span className="ml-1 text-sm md:text-lg">→</span>
        </button>
      </div>

      {/* Popup */}
      {isOpen && <Applynow onClose={() => setIsOpen(false)} />}
    </div>
  );
}