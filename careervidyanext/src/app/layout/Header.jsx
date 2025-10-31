// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, X, ChevronDown } from "lucide-react";

// const Header = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [megaMenuOpen, setMegaMenuOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);

//   // ✅ Show search bar when scrolling down on mobile
//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 80) setShowSearch(true);
//       else setShowSearch(false);
//     };

//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <>
//       <header className="bg-white px-3 sm:px-6 py-3 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-50">
//         {/* Logo Section */}
//         <div className="flex items-center justify-between w-full md:w-auto">
//           <Link href="/" className="flex items-center">
//             <Image
//               src="/images/LogoUpdated1.png"
//               alt="Career Vidya Logo"
//               height={45}
//               width={130}
//               className="object-contain ml-2 sm:ml-6"
//             />
//           </Link>

//           {/* Mobile Menu Toggle */}
//           <button
//             className="md:hidden mr-2"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle Menu"
//           >
//             {menuOpen ? <X size={26} /> : <Menu size={26} />}
//           </button>
//         </div>

//         {/* Navigation Section */}
//         <nav
//           className={`flex-col md:flex-row items-center w-full md:w-auto space-y-4 md:space-y-0 md:space-x-4 mt-4 md:mt-0 md:flex transition-all duration-300 ease-in-out ${
//             menuOpen ? "flex" : "hidden md:flex"
//           }`}
//         >
//           {/* Search Box (Desktop) */}
//           <Link href="/layout/search" className="hidden md:block">
//             <div className="relative w-[200px] sm:w-[250px] md:w-[300px] lg:w-[380px] xl:w-[420px] truncate">
//               <input
//                 type="text"
//                 placeholder="Search for universities, courses & more..."
//                 className="border border-[#87CEEB] rounded-full py-2 pl-10 pr-3 w-full text-gray-700 text-sm md:text-base focus:outline-none focus:border-[#87CEEB] hover:shadow-md overflow-hidden text-ellipsis"
//               />
//               <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
//                 🔍
//               </span>
//             </div>
//           </Link>

//           {/* Explore Button */}
//           <Link href="/explore">
//             <button className="text-black px-3 py-1 md:px-4 md:py-2 hover:text-[#FFA500] text-sm md:text-base whitespace-nowrap">
//               Explore Programs
//             </button>
//           </Link>

//           {/* Right Buttons */}
//           <div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0 relative">
//             <button className="text-gray-700 hover:text-[#FFA500] text-sm md:text-base">
//               Ask
//             </button>

//             {/* Free Counselling Dropdown */}
//             <div
//               className="relative"
//               onMouseEnter={() => setMegaMenuOpen(true)}
//               onMouseLeave={() => setMegaMenuOpen(false)}
//             >
//               <button
//                 className="flex items-center justify-center text-gray-700 hover:text-[#FFA500] text-sm md:text-base whitespace-nowrap"
//                 onClick={() => setMegaMenuOpen(!megaMenuOpen)}
//               >
//                 Free Counselling
//                 <ChevronDown size={16} className="ml-1" />
//               </button>

//               {megaMenuOpen && (
//                 <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 mt-3 w-[95vw] md:w-[800px] bg-white border border-gray-200 shadow-lg rounded-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 z-50">
//                   <div>
//                     <h3 className="text-[#9b59b6] font-semibold mb-3 border-b border-gray-100 pb-2">
//                       Cloud Services
//                     </h3>
//                     <ul className="space-y-2 text-gray-700 text-sm">
//                       <li>Amazon Web Services</li>
//                       <li>Cloud Migration</li>
//                       <li>Cloud Architecture Review</li>
//                       <li>Gen AI</li>
//                       <li>Security & Compliance</li>
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="text-[#e67e22] font-semibold mb-3 border-b border-gray-100 pb-2">
//                       IT Software Consultancy
//                     </h3>
//                     <ul className="space-y-2 text-gray-700 text-sm">
//                       <li>Mobile App Development</li>
//                       <li>Native App Development</li>
//                       <li>Software Development</li>
//                       <li>Cross Platform Development</li>
//                       <li>UI & UX Designing</li>
//                     </ul>
//                   </div>

//                   <div>
//                     <h3 className="text-[#3498db] font-semibold mb-3 border-b border-gray-100 pb-2">
//                       Digital & IT Solutions
//                     </h3>
//                     <ul className="space-y-2 text-gray-700 text-sm">
//                       <li>Digital Transformation</li>
//                       <li>Managed IT Services</li>
//                       <li>Streaming Services</li>
//                       <li>Digital Marketing</li>
//                       <li>Cloud Engineering</li>
//                     </ul>
//                   </div>
//                 </div>
//               )}
//             </div>

//             <button className="text-gray-700 hover:text-[#FFA500] text-sm md:text-base">
//               Share
//             </button>

//             <Link href="/signup">
//               <button className="text-black px-3 py-1 md:px-4 md:py-2 hover:text-[#FFA500] text-sm md:text-base whitespace-nowrap">
//                 Sign in
//               </button>
//             </Link>
//           </div>
//         </nav>

//         {/* ---------- MOBILE SEARCH (on scroll) ---------- */}
//         {showSearch && (
//           <div className="md:hidden w-full mt-3 px-2 transition-all duration-300 animate-slideDown">
//             <div className="flex items-center bg-white border border-[#87CEEB] rounded-full px-3 py-2 shadow-sm">
//               <span className="text-gray-500 text-lg mr-2">🔍</span>
//               <input
//                 type="text"
//                 placeholder="Search universities, courses & more..."
//                 className="flex-1 text-sm text-gray-700 focus:outline-none truncate"
//               />
//             </div>
//           </div>
//         )}
//       </header>

//       <style jsx global>{`
//         @keyframes slideDown {
//           from {
//             opacity: 0;
//             transform: translateY(-10px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }
//         .animate-slideDown {
//           animation: slideDown 0.3s ease-out;
//         }
//       `}</style>
//     </>
//   );
// };

// export default Header;



"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowSearch(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header className="bg-white px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-50">
        {/* ---------- Left Section: Logo + Tagline ---------- */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <div className="flex items-center space-x-3">
            <Link href="/" className="flex items-center cursor-pointer">
              <Image
                src="/images/LogoUpdated1.png"
                alt="Career Vidya Logo"
                height={48} // reduced height
                width={130}
                className="object-contain cursor-pointer"
              />
            </Link>
            <span className="text-sm sm:text-base font-medium text-gray-600 whitespace-nowrap cursor-default">
              #Vidya hai to Success hai
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden ml-2 cursor-pointer"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle Menu"
          >
            {menuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>

        {/* ---------- Center Section: Search Bar (Desktop) ---------- */}
        <div className="hidden md:flex items-center justify-center flex-1 px-2">
          <div className="relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px]">
            <input
              type="text"
              placeholder="Search universities, courses & more..."
              className="border border-[#87CEEB] rounded-full py-2 pl-9 pr-3 w-full text-gray-700 text-sm focus:outline-none focus:border-[#0056B3] hover:shadow-md transition cursor-text"
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg cursor-pointer">
              🔍
            </span>
          </div>
        </div>

        {/* ---------- Navigation ---------- */}
        <nav
          className={`flex-col md:flex-row items-center w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0 md:flex transition-all duration-300 ${
            menuOpen ? "flex" : "hidden md:flex"
          }`}
        >
          {/* Explore Programs */}
          <Link href="/explore" className="cursor-pointer">
            <button className="bg-[#0056B3] hover:bg-[#0046a1] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition cursor-pointer">
              Explore Programs
            </button>
          </Link>

          {/* Free Counselling */}
          <Link href="/counselling" className="cursor-pointer">
            <button className="hover:bg-[#e65c00] text-black font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition cursor-pointer">
              Free Counselling
            </button>
          </Link>

          {/* Apply Now */}
          <Link href="/apply" className="cursor-pointer">
            <button className="bg-gradient-to-r from-[#0056B3] to-[#FF6600] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition cursor-pointer">
              Apply Now
            </button>
          </Link>
        </nav>

        {/* ---------- Mobile Search (on scroll) ---------- */}
        {showSearch && (
          <div className="md:hidden w-full mt-3 px-2 animate-slideDown">
            <div className="flex items-center bg-white border border-[#87CEEB] rounded-full px-3 py-2 shadow-sm">
              <span className="text-gray-500 text-lg mr-2 cursor-pointer">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search universities, courses & more..."
                className="flex-1 text-sm text-gray-700 focus:outline-none cursor-text"
              />
            </div>
          </div>
        )}
      </header>

      {/* ---------- Animations ---------- */}
      <style jsx global>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
