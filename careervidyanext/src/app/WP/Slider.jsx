"use client";

import { useState } from "react";
import Image from "next/image";
import Applynow from "@/app/WP/Applynow.jsx"; 

export default function CompactBannerSection() {
  const backgroundImage = "/images/WPban.webp"; 
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full max-w-[1510px] mx-auto overflow-hidden">
      
      {/* Banner Image - Aspect Ratio maintain rahegi aur bilkul crop nahi hogi */}
      <div className="relative w-full h-auto">
        <Image 
          src={backgroundImage} 
          alt="Banner" 
          width={1510}
          height={500}
          priority
          sizes="(max-width: 1200px) 100vw, 1510px"
          className="w-full h-auto object-contain block" 
        />
      </div>

      {/* Apply Now Button */}
      <div
        className="
          absolute 
          bottom-[5%] 
          left-[3%]
          md:bottom-[10%] 
          md:left-[4%]"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="
            cursor-pointer 
            bg-[#FFC107] 
            text-black 
            font-bold 
            py-1.5 
            px-4 
            md:py-3 
            md:px-10
            rounded-lg 
            hover:bg-[#FFB300] 
            transition 
            shadow-xl 
            text-[10px] 
            sm:text-xs
            md:text-sm
            uppercase 
            flex 
            items-center 
            justify-center 
            tracking-wide
          "
        >
          Apply Now <span className="ml-1 text-xs md:text-base">→</span>
        </button>
      </div>

      {/* Popup */}
      {isOpen && <Applynow onClose={() => setIsOpen(false)} />}
    </div>
  );
}