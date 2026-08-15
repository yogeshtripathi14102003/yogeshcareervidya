// "use client";
// import React, { useEffect, useState } from "react";
// import { Megaphone, ArrowUpRight } from "lucide-react";
// import api from "@/utlis/api.js";

// export default function AnnouncementBar() {
//   const [announcement, setAnnouncement] = useState(null); // null = still loading
//   const [hasError, setHasError] = useState(false);

//   const fetchAnnouncement = async () => {
//     try {
//       const res = await api.get("/api/v1/notifications");
//       if (res.data && res.data.length > 0) {
//         const latest = res.data[0];
//         setAnnouncement({
//           title: latest.title,
//           description: latest.description,
//           url: latest.url || "#",
//         });
//       } else {
//         setAnnouncement(null);
//       }
//     } catch (err) {
//       console.error("Failed to fetch announcements:", err);
//       setHasError(true);
//     }
//   };

//   useEffect(() => {
//     fetchAnnouncement();
//   }, []);

//   // Nothing to show yet, fetch failed, or there are genuinely no announcements —
//   // render a skeleton bar instead of placeholder text like "Loading..." or
//   // "Failed to load", which look broken to a real visitor (and to a crawler
//   // that happens to snapshot the page before the client fetch resolves).
//   if (!announcement || hasError) {
//     return (
//       <div className="w-full bg-gradient-to-r from-[#0f1e3d] via-[#1e3a8a] to-[#0f1e3d] h-11 md:h-12 flex items-center border-b border-white/10 shadow-md">
//         <div className="flex items-center px-4 md:px-6 bg-[#172554] h-full shrink-0">
//           <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-orange-400/60" />
//         </div>
//         <div className="flex-1 px-4">
//           <div className="h-3 w-40 md:w-64 bg-white/10 rounded animate-pulse" />
//         </div>
//       </div>
//     );
//   }

//   const hasLink = announcement.url && announcement.url !== "#";

//   const AnnouncementContent = () => {
//     const content = (
//       <>
//         <span className="bg-gradient-to-r from-orange-600 to-amber-500 text-[10px] text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-wider animate-pulse shrink-0">
//           New
//         </span>
//         <span className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap text-white font-medium text-xs md:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
//           {announcement.title}
//           {announcement.description && ` — ${announcement.description}`}
//         </span>
//         {hasLink && (
//           <ArrowUpRight className="w-4 h-4 text-orange-400 opacity-90 shrink-0" />
//         )}
//       </>
//     );

//     // Real <a> tag instead of a clickable <div> — crawlable by search engines
//     // and reachable by keyboard/screen readers, unlike a div with onClick.
//     if (hasLink) {
//       return (
//         <a
//           href={announcement.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="flex items-center gap-3 pr-20 cursor-pointer shrink-0"
//         >
//           {content}
//         </a>
//       );
//     }

//     return <div className="flex items-center gap-3 pr-20 shrink-0">{content}</div>;
//   };

//   return (
//     <div className="w-full bg-gradient-to-r from-[#0f1e3d] via-[#1e3a8a] to-[#0f1e3d] bg-[length:200%_auto] animate-gradient-shift h-11 md:h-12 flex items-center overflow-hidden border-b border-white/10 shadow-md relative select-none">

//       <style jsx>{`
//         @keyframes marquee-loop {
//           0%   { transform: translateX(0); }
//           100% { transform: translateX(-50%); }
//         }
//         @keyframes gradient-shift {
//           0%, 100% { background-position: 0% 50%; }
//           50%       { background-position: 100% 50%; }
//         }
//         .marquee-track {
//           display: flex;
//           white-space: nowrap;
//           animation: marquee-loop 25s linear infinite;
//           will-change: transform;
//         }
//         .marquee-track:hover {
//           animation-play-state: paused;
//         }
//         .animate-gradient-shift {
//           animation: gradient-shift 8s ease infinite;
//         }
//       `}</style>

//       {/* Left Badge */}
//       <div className="flex items-center px-4 md:px-6 bg-[#172554] z-20 h-full shadow-[8px_0_15px_rgba(15,30,61,0.5)] border-r border-white/10 shrink-0">
//         <div className="flex items-center gap-2 text-white font-bold text-sm md:text-base tracking-wide">
//           <div className="relative flex h-2 w-2 mr-0.5">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
//           </div>
//           <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400/20" />
//           <span className="whitespace-nowrap uppercase text-[11px] md:text-xs tracking-widest text-slate-200">
//             Announcements
//           </span>
//         </div>
//       </div>

//       {/* Marquee */}
//       <div className="flex-1 overflow-hidden h-full flex items-center">
//         <div className="marquee-track">
//           {/* Two copies are required for a seamless infinite loop: the animation
//               moves the track by -50%, so by the time the first copy scrolls off,
//               the second copy is exactly in position to continue without a gap. */}
//           <AnnouncementContent />
//           <AnnouncementContent />
//         </div>
//       </div>

//     </div>
//   );
// }



"use client";
import React, { useEffect, useState } from "react";
import { Megaphone, ArrowUpRight } from "lucide-react";
import api from "@/utlis/api.js";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState(null); // null = still loading
  const [hasError, setHasError] = useState(false);

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
        setAnnouncement(null);
      }
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setHasError(true);
    }
  };

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  // Skeleton UI
  if (!announcement || hasError) {
    return (
      <div className="w-full bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] h-11 md:h-12 flex items-center border-b-2 border-[#000080]/30 shadow-md">
        <div className="flex items-center px-4 md:px-6 bg-[#000080] h-full shrink-0">
          <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-amber-300" />
        </div>
        <div className="flex-1 px-4">
          <div className="h-3.5 w-40 md:w-64 bg-slate-800/30 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  const hasLink = announcement.url && announcement.url !== "#";

  const AnnouncementContent = () => {
    const content = (
      <>
        {/* NEW Badge with Navy Blue glow */}
        <span className="bg-[#000080] text-white text-[10px] md:text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider animate-pulse shrink-0 shadow-[0_0_10px_rgba(0,0,128,0.4)] border border-white/20">
          New
        </span>
        
        {/* Text with high contrast */}
        <span className="hover:text-[#000080] transition-colors duration-200 whitespace-nowrap text-slate-950 font-bold text-xs md:text-sm tracking-wide drop-shadow-[0_1px_2px_rgba(255,255,255,0.9)]">
          {announcement.title}
          {announcement.description && ` — ${announcement.description}`}
        </span>

        {hasLink && (
          <ArrowUpRight className="w-4 h-4 text-[#000080] shrink-0 stroke-[3] drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" />
        )}
      </>
    );

    if (hasLink) {
      return (
        <a
          href={announcement.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 pr-20 cursor-pointer shrink-0"
        >
          {content}
        </a>
      );
    }

    return <div className="flex items-center gap-3 pr-20 shrink-0">{content}</div>;
  };

  return (
    <div className="w-full bg-gradient-to-r from-[#FF671F] via-[#FFFFFF] to-[#046A38] bg-[length:200%_auto] animate-gradient-shift h-11 md:h-12 flex items-center overflow-hidden border-b-2 border-[#000080]/30 shadow-lg relative select-none">
      <style jsx>{`
        @keyframes marquee-loop {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes gradient-shift {
          0%,
          100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee-loop 22s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .animate-gradient-shift {
          animation: gradient-shift 6s ease infinite;
        }
      `}</style>

      {/* Subtle Ashok Chakra SVG Background Motif */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
        <svg viewBox="0 0 100 100" className="h-28 w-28 text-[#000080] fill-current animate-[spin_30s_linear_infinite]">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
          <circle cx="50" cy="50" r="8" fill="currentColor" />
          {[...Array(24)].map((_, i) => (
            <line
              key={i}
              x1="50"
              y1="50"
              x2={50 + 45 * Math.cos((i * 15 * Math.PI) / 180)}
              y2={50 + 45 * Math.sin((i * 15 * Math.PI) / 180)}
              stroke="currentColor"
              strokeWidth="2"
            />
          ))}
        </svg>
      </div>

      {/* Left Badge - Deep Ashok Chakra Blue */}
      <div className="flex items-center px-4 md:px-6 bg-[#000080] z-20 h-full shadow-[8px_0_15px_rgba(0,0,128,0.4)] border-r-2 border-amber-400/40 shrink-0">
        <div className="flex items-center gap-2.5 text-white font-extrabold text-sm md:text-base tracking-wide">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-90"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500"></span>
          </div>
          <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-amber-300 fill-amber-300/30" />
          <span className="whitespace-nowrap uppercase text-[11px] md:text-xs tracking-widest text-amber-300 drop-shadow">
            Announcements
          </span>
        </div>
      </div>

      {/* Marquee Track */}
      <div className="flex-1 overflow-hidden h-full flex items-center z-10">
        <div className="marquee-track">
          <AnnouncementContent />
          <AnnouncementContent />
        </div>
      </div>
    </div>
  );
}