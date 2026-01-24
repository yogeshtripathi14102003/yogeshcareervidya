// "use client";
// import React, { useEffect, useState } from "react";
// import { Megaphone } from "lucide-react";
// import api from "@/utlis/api.js"; // ✅ Your existing api.js

// export default function AnnouncementBar() {
//   const [announcement, setAnnouncement] = useState({
//     title: "Loading announcements...",
//     description: "",
//     url: "#",
//   });

//   // Fetch announcement from backend
//   const fetchAnnouncement = async () => {
//     try {
//       const res = await api.get("/api/v1/notifications"); // ✅ Fetch notifications
//       if (res.data && res.data.length > 0) {
//         // Take the latest notification
//         const latest = res.data[0];
//         setAnnouncement({
//           title: latest.title,
//           description: latest.description,
//           url: latest.url || "#", // fallback
//         });
//       } else {
//         setAnnouncement({ title: "No announcements currently", description: "", url: "#" });
//       }
//     } catch (err) {
//       console.error("Failed to fetch announcements:", err);
//       setAnnouncement({ title: "Failed to load announcements", description: "", url: "#" });
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncement();
//   }, []);

//   // Handle click on New badge
//   const handleNewClick = () => {
//     if (announcement.url && announcement.url !== "#") {
//       window.open(announcement.url, "_blank"); // open in new tab
//     }
//   };

//   return (
//     <div className="w-full bg-[#de5e06] h-10 md:h-12 flex items-center overflow-hidden border-b border-white/10 shadow-md">
      
//       <style jsx>{`
//         @keyframes custom-glow {
//           0%, 100% { text-shadow: 0 0 0px #f40707ff; transform: scale(1); }
//           50% { text-shadow: 0 0 10px #e01717ff, 0 0 20px #ff1b1bff; transform: scale(1.05); }
//         }
//         .animate-unique-blink {
//           animation: custom-glow 1.5s infinite ease-in-out;
//         }
//       `}</style>

//       {/* Fixed Label Section */}
//       <div className="flex items-center px-4 md:px-6 bg-[#de5e06] z-10 h-full shadow-[5px_0_15px_rgba(0,0,0,0.2)]">
//         <div className="flex items-center gap-2 animate-unique-blink text-white">
//           <Megaphone className="w-5 h-5 fill-white/40" />
//           <span className="font-bold text-sm md:text-base whitespace-nowrap">
//             Announcements
//           </span>
//         </div>
//       </div>

//       <div className="flex-1 flex items-center">
//         <marquee 
//           behavior="scroll" 
//           direction="left" 
//           scrollamount="6"
//           className="text-white font-medium text-sm md:text-base cursor-pointer"
//           onMouseOver={(e) => e.currentTarget.stop()} 
//           onMouseOut={(e) => e.currentTarget.start()}
//         >
//           {announcement.title} - {announcement.description}
//           <span
//             onClick={handleNewClick} // ✅ Clickable
//             className="ml-4 bg-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse cursor-pointer"
//             title="Click to view"
//           >
//             New
//           </span>
//         </marquee>
//       </div>
//     </div>
//   );
// }
"use client";

import React, { useEffect, useState } from "react";
import { Zap, BellRing, ChevronRight } from "lucide-react";
import api from "@/utlis/api.js";

export default function AnnouncementBar() {
  const [mounted, setMounted] = useState(false); // ensures client-only rendering
  const [announcement, setAnnouncement] = useState({
    title: "Loading announcements...",
    description: "",
    url: "#",
  });

  useEffect(() => {
    setMounted(true);

    const fetchAnnouncement = async () => {
      try {
        const res = await api.get("/api/v1/notifications");
        if (res.data && res.data.length > 0) {
          const latest = res.data[0];
          setAnnouncement({
            title: latest.title,
            description: latest.description,
            url: latest.url || "#",
          });
        } else {
          setAnnouncement({ title: "No announcements currently", description: "", url: "#" });
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        setAnnouncement({ title: "Failed to load announcements", description: "", url: "#" });
      }
    };

    fetchAnnouncement();
  }, []);

  const handleNewClick = () => {
    if (announcement.url && announcement.url !== "#") {
      window.open(announcement.url, "_blank");
    }
  };

  // render nothing on server to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className="w-full relative h-10 md:h-12 flex items-center overflow-hidden border-b-2 border-[#000080]/20 shadow-lg">
      
      {/* ANIMATED TRICOLOUR BACKGROUND */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FF9933] via-[#FFFFFF] to-[#138808] bg-[length:200%_200%] animate-gradient-move"></div>

      <style jsx>{`
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes rotate-chakra {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-gradient-move { animation: gradient-move 5s infinite linear; }
        .animate-chakra { animation: rotate-chakra 8s infinite linear; }

        .label-shine::after {
          content: "";
          position: absolute;
          top: -50%; left: -60%; width: 20%; height: 200%;
          background: rgba(255, 255, 255, 0.4);
          transform: rotate(30deg);
          animation: shine-move 3s infinite;
        }
        @keyframes shine-move {
          0% { left: -60%; }
          100% { left: 150%; }
        }
      `}</style>

      {/* Fixed Label Section */}
      <div className="flex items-center px-3 md:px-5 bg-[#000080] z-20 h-full shadow-[5px_0_15px_rgba(0,0,0,0.3)] label-shine border-r border-white/20">
        <div className="flex items-center gap-2 text-white">
          {/* Ashoka Chakra Icon */}
          <div className="relative flex items-center justify-center">
            <svg 
              className="w-5 h-5 md:w-6 md:h-6 animate-chakra text-white/90" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <circle cx="12" cy="12" r="10" />
              {[...Array(12)].map((_, i) => (
                <line 
                  key={i} 
                  x1="12" y1="12" 
                  x2={12 + 10 * Math.cos((i * 30 * Math.PI) / 180)} 
                  y2={12 + 10 * Math.sin((i * 30 * Math.PI) / 180)} 
                />
              ))}
            </svg>
            <div className="absolute w-1.5 h-1.5 bg-white rounded-full"></div>
          </div>
          
          <span className="font-black text-[10px] md:text-xs uppercase tracking-[0.15em] whitespace-nowrap pt-0.5">
            New Updates
          </span>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="flex-1 flex items-center z-10">
        <marquee 
          behavior="scroll" 
          direction="left" 
          scrollamount="7"
          className="text-[#000080] font-black text-sm md:text-base cursor-pointer"
          onMouseOver={(e) => e.currentTarget.stop()} 
          onMouseOut={(e) => e.currentTarget.start()}
        >
          <div className="flex items-center gap-2 px-4">
            <BellRing className="w-4 h-4 text-orange-600 animate-bounce" />
            <span className="inline-flex items-center">
              {announcement.title} 
              <ChevronRight className="w-5 h-5 mx-2 text-[#138808]" />
              <span className="opacity-80 font-bold">{announcement.description}</span>
            </span>
            
            {/* NEW Badge with Icon */}
            <span
              onClick={handleNewClick}
              className="ml-4 flex items-center gap-1 bg-[#FF9933] text-white text-[10px] px-2.5 py-1 rounded-full font-black border-2 border-white shadow-lg animate-pulse"
            >
              <Zap size={10} className="fill-white" />
              NEW
            </span>
          </div>
        </marquee>
      </div>
    </div>
  );
}
