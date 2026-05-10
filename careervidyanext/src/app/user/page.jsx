"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import GetAdmissionForm from "@/app/user/component/Getadmissionfrom.jsx";

export default function DashboardPage() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const shareLink = "https://careervidya.in/explore";

  // Aapki provide ki gayi images array
  const socialLinks = [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/career-vidya/", img: "/images/i5.png" },
    { name: "X", url: "https://x.com/CareerVidya", img: "/images/i4.png" },
    { name: "Instagram", url: "https://www.instagram.com/career_vidya/", img: "/images/i3.png" },
    { name: "Facebook", url: "https://www.facebook.com/Career-Vidya", img: "/images/i2.png" },
    { name: "YouTube", url: "https://youtube.com/@careervidya02", img: "/images/i1.png" },
  ];

  const openForm = () => setIsFormOpen(true);
  const closeForm = () => setIsFormOpen(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    alert("Link copied!");
  };

  return (
    <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Queries" value="0" />
        <StatCard title="Profile Completion" value="80%" />
        <StatCard title="Certificates" value="0" />
      </div>

      {/* Enroll Card */}
      <div className="bg-white border rounded p-6 mb-6">
        <h2 className="text-sm font-medium  mb-2">Continue Learning</h2>
        <p className="text-xs text-gray-500 mb-3">Access your enrolled courses.</p>
        <button
          onClick={openForm}
          className="px-4 py-2 bg-blue-400 cursor-pointer text-white text-sm rounded hover:bg-blue-700 transition"
        >
          Enroll Now
        </button>
      </div>

      {/* --- Social Share Section (As per Image) --- */}
      <div className="bg-[#f0f7ff] border border-blue-100 rounded-xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* Social Icons using Images */}
      {/* Social Icons using Images */}
<div className="flex gap-4 mb-6">
  {socialLinks.map((social, index) => (
    <a 
      key={index} 
      href={social.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group transition-all duration-300 hover:-translate-y-1"
    >
      {/* Icon Container - Isse saare icons same size aur shadow wale banenge */}
      <div className="w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-50 group-hover:shadow-lg transition-shadow">
        <img 
          src={social.img} 
          alt={social.name} 
          className="w-7 h-7 object-contain" // Icon ka size yahan se control hoga
        />
      </div>
    </a>
  ))}
</div>

        {/* Link Copy Box */}
        <div className="relative flex items-center bg-white border border-blue-200 rounded-lg p-1 pl-4 w-full max-w-sm shadow-sm">
          <span className="text-gray-500 text-sm truncate mr-2 flex-1">
            {shareLink}
          </span>
          <div className="h-8 w-[1px] bg-gray-100 mx-1"></div> {/* Vertical Divider */}
          <button 
            onClick={copyToClipboard}
            className="flex items-center gap-1 px-4 py-2 text-[#1889b9] font-semibold text-sm hover:bg-blue-50 transition"
          >
            <Copy size={16} />
            Copy
          </button>
        </div>

        {/* Mascot Character Placeholder */}
        <div className="absolute right-4 bottom-0 hidden md:block">
           {/* <img src="/images/mascot.png" alt="mascot" className="w-16 h-auto" />  */}
           {/* Agar mascot image nahi hai toh niche wala emoji rehne dena */}
           <p className="text-[40px]">😊</p>
        </div>
      </div>

      {/* Modal / Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-full max-w-md relative shadow-xl">
            <button
              onClick={closeForm}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
            <GetAdmissionForm closeForm={closeForm} />
          </div>
        </div>
      )}
    </>
  );
}

// StatCard Component
const StatCard = ({ title, value }) => (
  <div className="bg-white border rounded p-4 shadow-sm">
    <p className="text-[11px] text-gray-500 uppercase tracking-wider font-semibold">{title}</p>
    <p className="text-lg font-bold text-[#1889b9]">{value}</p>
  </div>
);