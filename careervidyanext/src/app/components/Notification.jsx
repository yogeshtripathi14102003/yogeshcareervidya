"use client";

import React from "react";
import { Megaphone } from "lucide-react";

export default function AnnouncementBar() {
  const announcementText = "Planning higher studies? Career Vidya is here to guide you from counselling to post-admission support. Enquire now";

  return (
    <div className="w-full bg-[#de5e06] h-10 md:h-12 flex items-center overflow-hidden border-b border-white/10 shadow-md">
      
      {/* CSS Animation for Blinking */}
      <style jsx>{`
        @keyframes custom-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-announcement-blink {
          animation: custom-blink 1.5s infinite;
        }
      `}</style>

      {/* Fixed Label Section with Blinking Animation */}
      <div className="flex items-center gap-2 px-4 md:px-6 bg-[#de5e06] z-10 h-full shadow-[5px_0_15px_rgba(0,0,0,0.1)] animate-announcement-blink">
        <Megaphone className="text-white w-5 h-5 fill-white/20" />
        <span className="text-white font-bold text-sm md:text-base whitespace-nowrap">
          Announcements
        </span>
      </div>

      {/* Scrolling Text Section */}
      <div className="flex-1 flex items-center">
        <marquee
          behavior="scroll"
          direction="left"
          scrollamount="6"
          className="text-white font-medium text-sm md:text-base cursor-default"
          onMouseOver={(e) => e.currentTarget.stop()}
          onMouseOut={(e) => e.currentTarget.start()}
        >
          {announcementText} 
          <span className="ml-4 bg-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter align-middle animate-pulse">
            New
          </span>
        </marquee>
      </div>
    </div>
  );
}