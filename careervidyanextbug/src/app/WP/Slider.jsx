"use client";

import { useState } from "react";
import Image from "next/image";
import Applynow from "@/app/WP/Applynow.jsx"; 

export default function CompactBannerSection() {
  const backgroundImage = "/images/WPban.webp"; 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full flex justify-center">
      
      {/* Banner Image */}
      <Image 
        src={backgroundImage} 
        alt="Banner" 
        width={1510}
        height={500}
        priority
        className="
          object-contain 
          w-auto 
          h-auto 
          max-w-full 
          max-h-[450px]     
          md:max-h-[600px]  /* 🖥 desktop SAME */
        " 
      />

      {/* Apply Now Button */}
      <div
        className="
          absolute 
          bottom-2          /* 📱 mobile → thoda aur niche */
          left-3
          md:bottom-16      /* 🖥 desktop SAME */
          md:left-5
        "
      >
        <button
          onClick={() => setIsOpen(true)}
          className="
            cursor-pointer 
            bg-[#FFC107] 
            text-black 
            font-bold 
            py-[6px]         /* 📱 mobile smaller height */
            px-5             /* 📱 mobile smaller width */
            md:py-3          /* 🖥 desktop SAME */
            md:px-10
            rounded-lg       /* 📱 slightly compact look */
            hover:bg-[#FFB300] 
            transition 
            shadow-xl 
            text-[10px]      /* 📱 mobile smaller text */
            md:text-sm
            uppercase 
            flex 
            items-center 
            justify-center 
            tracking-wide
          "
        >
          Apply Now <span className="ml-1 text-sm md:text-l">→</span>
        </button>
      </div>

      {/* Popup */}
      {isOpen && <Applynow onClose={() => setIsOpen(false)} />}
    </div>
  );
}
