
// "use client";

// import { useEffect, useState } from "react";
// import Image from "next/image";
// import Link from "next/link";

// export default function SocialSidebar() {
//   const [show, setShow] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setShow(window.scrollY > 150);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const socials = [
//     {
//       name: "LinkedIn",
//       url: "https://www.linkedin.com/company/career-vidya/",
//       img: "/images/i5.png",
//     },
//     {
//       name: "X",
//       url: "https://x.com/CareerVidya",
//       img: "/images/i4.png",
//     },
//     {
//       name: "Instagram",
//       url: "https://www.instagram.com/career_vidya/",
//       img: "/images/i3.png",
//     },
//     {
//       name: "Facebook",
//       url: "https://www.facebook.com/Career-Vidya",
//       img: "/images/i2.png",
//     },
//     {
//       name: "YouTube",
//       url: "https://youtube.com/@careervidya02",
//       img: "/images/i1.png",
//     },
//   ];

//   return (
//     <div
//       className={`fixed left-3 top-1/2 -translate-y-1/2 z-50
//       hidden md:flex flex-col gap-3
//       transition-all duration-500
//       ${show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}
//     `}
//     >
//       {socials.map((item, i) => (
//         <Link
//           key={i}
//           href={item.url}
//           target="_blank"
//           className="group flex items-center"
//         >
//           {/* ICON */}
//           <div
//             className="bg-white w-12 h-12 flex items-center justify-center
//             rounded-xl shadow-lg border border-gray-200
//             z-10 transition-all duration-300
//             group-hover:rounded-r-none"
//           >
//             <Image
//               src={item.img}
//               alt={item.name}
//               width={22}
//               height={22}
//               className="object-contain"
//             />
//           </div>

//           {/* SLIDE LABEL */}
//           <div
//             className="bg-white h-12 flex items-center
//             px-4 rounded-r-xl shadow-lg border border-l-0 border-gray-200
//             text-sm font-semibold text-gray-800
//             opacity-0 -translate-x-4
//             transition-all duration-300
//             group-hover:opacity-100 group-hover:translate-x-0"
//           >
//             {item.name}
//           </div>
//         </Link>
//       ))}
//     </div>
//   );
// }



"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SocialSidebar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 150);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const socials = [
    { name: "LinkedIn", url: "https://www.linkedin.com/company/career-vidya/", img: "/images/i5.png" },
    { name: "X", url: "https://x.com/CareerVidya", img: "/images/i4.png" },
    { name: "Instagram", url: "https://www.instagram.com/career_vidya/", img: "/images/i3.png" },
    { name: "Facebook", url: "https://www.facebook.com/Career-Vidya", img: "/images/i2.png" },
    { name: "YouTube", url: "https://youtube.com/@careervidya02", img: "/images/i1.png" },
  ];

  return (
    <div
      className={`fixed -left-2 top-1/2 -translate-y-1/2 z-50
      hidden md:flex flex-col gap-3
      transition-all duration-500
      ${show ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"}
    `}
    >
      {socials.map((item, i) => (
        <Link
          key={i}
          href={item.url}
          target="_blank"
          className="group relative"
        >
          {/* OUTER CONTAINER (SINGLE BORDER) */}
          <div
            className="flex items-center
            bg-white h-12
            rounded-xl shadow-lg
            border border-gray-300
            overflow-hidden
            transition-all duration-300
            group-hover:w-[150px] w-12"
          >
            {/* ICON */}
            <div className="w-12 h-12 flex items-center justify-center shrink-0">
              <Image
                src={item.img}
                alt={item.name}
                width={22}
                height={22}
                className="object-contain"
              />
            </div>

            {/* LABEL */}
            <span
              className="ml-2 text-sm font-semibold text-gray-800
              whitespace-nowrap opacity-0
              transition-all duration-300
              group-hover:opacity-100"
            >
              {item.name}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}
