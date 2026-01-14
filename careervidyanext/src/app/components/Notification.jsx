"use client";
import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import api from "@/utlis/api.js"; // ✅ Your existing api.js

export default function AnnouncementBar() {
  const [announcement, setAnnouncement] = useState({
    title: "Loading announcements...",
    description: "",
    url: "#",
  });

  // Fetch announcement from backend
  const fetchAnnouncement = async () => {
    try {
      const res = await api.get("/api/v1/notifications"); // ✅ Fetch notifications
      if (res.data && res.data.length > 0) {
        // Take the latest notification
        const latest = res.data[0];
        setAnnouncement({
          title: latest.title,
          description: latest.description,
          url: latest.url || "#", // fallback
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

  // Handle click on New badge
  const handleNewClick = () => {
    if (announcement.url && announcement.url !== "#") {
      window.open(announcement.url, "_blank"); // open in new tab
    }
  };

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
        <marquee 
          behavior="scroll" 
          direction="left" 
          scrollamount="6"
          className="text-white font-medium text-sm md:text-base cursor-pointer"
          onMouseOver={(e) => e.currentTarget.stop()} 
          onMouseOut={(e) => e.currentTarget.start()}
        >
          {announcement.title} - {announcement.description}
          <span
            onClick={handleNewClick} // ✅ Clickable
            className="ml-4 bg-red-600 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase animate-pulse cursor-pointer"
            title="Click to view"
          >
            New
          </span>
        </marquee>
      </div>
    </div>
  );
}
