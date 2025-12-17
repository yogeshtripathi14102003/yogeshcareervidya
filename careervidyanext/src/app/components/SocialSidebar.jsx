// "use client";

// import { Facebook, Instagram, Linkedin, Youtube } from "lucide-react";

// export default function SocialSidebar() {
//   const socials = [
//     {
//       name: "Facebook",
//       icon: <Facebook size={18} />,
//       url: "https://facebook.com/",
//       color: "bg-[#1877F2]",
//     },
//     {
//       name: "Instagram",
//       icon: <Instagram size={18} />,
//       url: "https://instagram.com/",
//       color: "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
//     },
//     {
//       name: "LinkedIn",
//       icon: <Linkedin size={18} />,
//       url: "https://linkedin.com/",
//       color: "bg-[#0A66C2]",
//     },
//     {
//       name: "YouTube",
//       icon: <Youtube size={18} />,
//       url: "https://youtube.com/",
//       color: "bg-[#FF0000]",
//     },
//   ];

//   return (
//     <div className="fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2">
//       {socials.map((item, index) => (
//         <a
//           key={index}
//           href={item.url}
//           target="_blank"
//           rel="noopener noreferrer"
//           aria-label={item.name}
//           className={`${item.color} text-white w-10 h-10 flex items-center justify-center rounded-r-lg shadow-lg transition-all duration-300 hover:w-12`}
//         >
//           {item.icon}
//         </a>
//       ))}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import {
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  X, // ✅ NEW X icon
} from "lucide-react";

export default function SocialSidebar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShow(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socials = [
    {
      name: "Facebook",
      icon: <Facebook size={18} />,
      url: "https://www.facebook.com/Career-Vidya",
      color: "bg-[#1877F2]",
    },
    {
      name: "Instagram",
      icon: <Instagram size={18} />,
      url: "https://www.instagram.com/career_vidya/",
      color:
        "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={18} />,
      url: "https://www.linkedin.com/company/career-vidya/",
      color: "bg-[#0A66C2]",
    },
    {
      name: "X",
      icon: <X size={18} />, // ✅ X icon
      url: "https://x.com/CareerVidya",
      color: "bg-black",
    },
    {
      name: "YouTube",
      icon: <Youtube size={18} />,
      url: "https://youtube.com/",
      color: "bg-[#FF0000]",
    },
  ];

  return (
    <div
      className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-2
        transition-all duration-500
        ${show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
      `}
    >
      {socials.map((item, index) => (
        <a
          key={index}
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.name}
          className={`${item.color} text-white w-10 h-10 flex items-center justify-center
            rounded-r-lg shadow-lg hover:w-12 transition-all duration-300`}
        >
          {item.icon}
        </a>
      ))}
    </div>
  );
}
