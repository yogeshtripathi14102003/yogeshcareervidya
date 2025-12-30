"use client";
import React from "react";
import { Megaphone } from "lucide-react";

export default function AnnouncementBar() {
  const announcementText = "Planning higher studies? Career Vidya is here to guide you from counselling to post-admission support. Enquire now";

  return (
    <div className="w-full bg-[#de5e06] h-10 md:h-12 flex items-center overflow-hidden border-b border-white/10 shadow-md">
      
      <style jsx>{`
        @keyframes custom-glow {
          0%, 100% { text-shadow: 0 0 0px #f40707ff; transform: scale(1); }
          50% { text-shadow: 0 0 10px #e01717ff, 0 0 20px #ff1b1bff; transform: scale(1.05); }
        }
        .animate-unique-blink {
          animation: custom-glow 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* Fixed Label Section */}
      <div className="flex items-center px-4 md:px-6 bg-[#de5e06] z-10 h-full shadow-[5px_0_15px_rgba(0,0,0,0.2)]">
        <div className="flex items-center gap-2 animate-unique-blink text-white">
          <Megaphone className="w-5 h-5 fill-white/40" />
          <span className="font-bold text-sm md:text-base whitespace-nowrap">
            Announcements
          </span>
        </div>
      </div>

      <div className="flex-1 flex items-center">
        {/* Cursor pointer aur Stop on Hover logic */}
        <marquee 
          behavior="scroll" 
          direction="left" 
          scrollamount="6"
          className="text-white font-medium text-sm md:text-base cursor-pointer"
          onMouseOver={(e) => e.currentTarget.stop()} 
          onMouseOut={(e) => e.currentTarget.start()}
        >
          {announcementText}
          <span className="ml-4 bg-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse">
            New
          </span>
        </marquee>
      </div>
    </div>
  );
}