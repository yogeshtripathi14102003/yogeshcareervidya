"use client";
import React, { useEffect, useState } from "react";
import { Megaphone, ArrowUpRight } from "lucide-react";
import api from "@/utlis/api.js";

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState({
    title: "Loading announcements...",
    description: "",
    url: "#",
  });

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

  useEffect(() => {
    fetchAnnouncement();
  }, []);

  const handleAnnouncementClick = () => {
    if (announcement.url && announcement.url !== "#") {
      window.open(announcement.url, "_blank");
    }
  };

  const AnnouncementContent = () => (
    <div
      onClick={handleAnnouncementClick}
      className="flex items-center gap-3 pr-20 cursor-pointer shrink-0"
    >
      <span className="bg-gradient-to-r from-orange-600 to-amber-500 text-[10px] text-white px-2 py-0.5 rounded font-extrabold uppercase tracking-wider animate-pulse shrink-0">
        New
      </span>
      <span className="hover:text-orange-300 transition-colors duration-200 whitespace-nowrap text-white font-medium text-xs md:text-sm drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
        {announcement.title}
        {announcement.description && ` — ${announcement.description}`}
      </span>
      {announcement.url !== "#" && (
        <ArrowUpRight className="w-4 h-4 text-orange-400 opacity-90 shrink-0" />
      )}
    </div>
  );

  return (
    <div className="w-full bg-gradient-to-r from-[#0f1e3d] via-[#1e3a8a] to-[#0f1e3d] bg-[length:200%_auto] animate-gradient-shift h-11 md:h-12 flex items-center overflow-hidden border-b border-white/10 shadow-md relative select-none">

      <style jsx>{`
        @keyframes marquee-loop {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        .marquee-track {
          display: flex;
          white-space: nowrap;
          animation: marquee-loop 25s linear infinite;
          will-change: transform;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        .animate-gradient-shift {
          animation: gradient-shift 8s ease infinite;
        }
      `}</style>

      {/* Left Badge */}
      <div className="flex items-center px-4 md:px-6 bg-[#172554] z-20 h-full shadow-[8px_0_15px_rgba(15,30,61,0.5)] border-r border-white/10 shrink-0">
        <div className="flex items-center gap-2 text-white font-bold text-sm md:text-base tracking-wide">
          <div className="relative flex h-2 w-2 mr-0.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
          </div>
          <Megaphone className="w-4 h-4 md:w-5 md:h-5 text-orange-400 fill-orange-400/20" />
          <span className="whitespace-nowrap uppercase text-[11px] md:text-xs tracking-widest text-slate-200">
            Announcements
          </span>
        </div>
      </div>

      {/* Marquee */}
      <div className="flex-1 overflow-hidden h-full flex items-center">
        <div className="marquee-track">
          <AnnouncementContent />
          
        </div>
      </div>

    </div>
  );
}