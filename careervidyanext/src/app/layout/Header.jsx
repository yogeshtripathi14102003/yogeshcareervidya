

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, X } from "lucide-react";
// import Signup from "../signup/page.jsx";
// import { useRouter } from "next/navigation"; // ✅ Added for navigation

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showSearch, setShowSearch] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [isMounted, setIsMounted] = useState(false);

//   const router = useRouter(); // ✅ Initialize router

//   // ✅ Enable rendering only after client mount
//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   // ✅ Scroll-based mobile search visibility
//   useEffect(() => {
//     if (!isMounted) return;
//     const handleScroll = () => {
//       if (!menuOpen) setShowSearch(window.scrollY > 80);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, [isMounted, menuOpen]);

//   // ✅ Navigation for search bar click
//   const handleSearchClick = () => {
//     router.push("/explore"); // 👈 redirects to Explore page
//   };

//   // ✅ Close all popups and menus
//   const handleClose = () => {
//     setMenuOpen(false);
//     setShowSearch(false);
//   };

//   // ✅ Close Signup popup
//   const handleSignupClose = () => {
//     setShowSignup(false);
//   };

//   // ✅ Handle ESC key
//   useEffect(() => {
//     const handleEsc = (e) => {
//       if (e.key === "Escape") {
//         handleClose();
//         handleSignupClose();
//       }
//     };
//     window.addEventListener("keydown", handleEsc);
//     return () => window.removeEventListener("keydown", handleEsc);
//   }, []);

//   // ⚠️ Render nothing until mounted — avoids hydration mismatch
//   if (!isMounted) return null;

//   return (
//     <>
//       <header className="bg-white px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center justify-between border-b border-gray-200 shadow-sm sticky top-0 z-50">
//         {/* ---------- Left Section: Logo ---------- */}
//        <div className="flex items-center justify-between w-full md:w-auto">
//   <div className="flex items-center space-x-3 ml-4 md:ml-8">
//     <Link href="/" onClick={handleClose} className="flex items-center">
//       <Image
    
//         src="/images/LogoUpdated1.png"
      
//         alt="Career Vidya Logo"
//         height={150}
//         width={150}
//         className="object-contain cursor-pointer"
//         priority
//       />
//     </Link>
//   </div>

//   {/* Mobile Menu Button */}
//   <button
//     className="md:hidden ml-2 cursor-pointer"
//     onClick={() => setMenuOpen(!menuOpen)}
//     aria-label="Toggle Menu"
//   >
//     {menuOpen ? <X size={26} /> : <Menu size={26} />}
//   </button>
// </div>


//         {/* ---------- Desktop Search Bar ---------- */}
//         <div className="hidden md:flex items-center justify-center flex-1 px-2">
//           <div
//             onClick={handleSearchClick}
//             className="relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[300px] cursor-pointer"
//           >
//             <input
//               type="text"
//               placeholder="Search universities, courses & more..."
//               className="border border-[#87CEEB] rounded-full py-2 pl-9 pr-3 w-full text-gray-700 text-sm focus:outline-none focus:border-[#0056B3] hover:shadow-md transition cursor-pointer"
//               readOnly
//             />
//             <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
//               🔍
//             </span>
//           </div>
//         </div>

//         {/* ---------- Navigation Buttons ---------- */}
//         <nav
//           className={`${
//             menuOpen ? "flex" : "hidden"
//           } md:flex flex-col md:flex-row items-right w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0 transition-all duration-300`}
//         >
//           <Link href="/explore" onClick={handleClose}>
//             <button className="bg-[#0056B3] hover:bg-[#0046a1] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition">
//               Explore Programs
//             </button>
//           </Link>

//           <Link href="/counselling" onClick={handleClose}>
//             <button className="hover:bg-[#e65c00] text-black font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition">
//               Free Counselling
//             </button>
//           </Link>

//           <button
//             onClick={() => setShowSignup(true)}
//             className="bg-gradient-to-r from-[#0056B3] to-[#FF6600] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition"
//           >
//             Signup
//           </button>
//         </nav>

//         {/* ---------- Mobile Search on Scroll ---------- */}
//         {showSearch && (
//           <div className="md:hidden w-full mt-3 px-2 animate-slideDown">
//             <div
//               onClick={handleSearchClick}
//               className="flex items-center bg-white border border-[#87CEEB] rounded-full px-3 py-2 shadow-sm cursor-pointer"
//             >
//               <span className="text-gray-500 text-lg mr-2">🔍</span>
//               <input
//                 type="text"
//                 placeholder="Search universities, courses & more..."
//                 className="flex-1 text-sm text-gray-700 focus:outline-none cursor-pointer"
//                 readOnly
//               />
//               <button
//                 onClick={handleClose}
//                 className="text-gray-400 hover:text-gray-700 ml-2 text-sm font-semibold"
//               >
//                 ✕
//               </button>
//             </div>
//           </div>
//         )}
//       </header>

//       {/* ---------- Signup Popup ---------- */}
//       {showSignup && <Signup onClose={handleSignupClose} />}

//       {/* ---------- Animations ---------- */}
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
// }



"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Signup from "../signup/page.jsx";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const router = useRouter();

  // Enable rendering only after client mount
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Scroll-based mobile search visibility
  useEffect(() => {
    if (!isMounted) return;
    const handleScroll = () => {
      if (!menuOpen) setShowSearch(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted, menuOpen]);

  // Navigation for search bar click
  const handleSearchClick = () => {
    router.push("/explore");
  };

  // Close all popups and menus
  const handleClose = () => {
    setMenuOpen(false);
    setShowSearch(false);
  };

  // Close Signup popup
  const handleSignupClose = () => {
    setShowSignup(false);
  };

  // Handle ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        handleClose();
        handleSignupClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Render nothing until mounted — avoids hydration mismatch
  if (!isMounted) return null;

  return (
    <>
      <header className="bg-white px-4 sm:px-8 py-3 flex flex-col md:flex-row items-center md:justify-center border-b border-gray-200 shadow-sm sticky top-0 z-50">
        
        {/*
          Changes start here: 
          We use justify-center on the main header flex container
          and control the spacing of the three main sections (Logo, Search, Nav).
        */}

        {/* ----------------- Left Section: Logo & Mobile Menu Button ----------------- */}
        <div className="flex items-center justify-between w-full md:w-auto md:mr-8 lg:mr-16"> 
          <div className="flex items-center space-x-3 ml-4 md:ml-0">
            <Link href="/" onClick={handleClose} className="flex items-center">
              <Image
                src="/images/LogoUpdated1.png"
                alt="Career Vidya Logo"
                height={150}
                width={150}
                className="object-contain cursor-pointer"
                priority
              />
            </Link>
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


        {/* ----------------- Desktop Search Bar (Center) ----------------- */}
        {/* Added margin to separate it from the Nav buttons */}
        <div className="hidden md:flex items-center justify-center px-2 md:mx-4 lg:mx-8"> 
          <div
            onClick={handleSearchClick}
            className="relative w-[180px] sm:w-[220px] md:w-[260px] lg:w-[320px] cursor-pointer" 
          >
            <input
              type="text"
              placeholder="Search universities, courses & more..."
              className="border border-[#87CEEB] rounded-full py-2 pl-9 pr-3 w-full text-gray-700 text-sm focus:outline-none focus:border-[#0056B3] hover:shadow-md transition cursor-pointer"
              readOnly
            />
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
              🔍
            </span>
          </div>
        </div>

        {/* ----------------- Navigation Buttons (Right) ----------------- */}
        <nav
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-right w-full md:w-auto space-y-3 md:space-y-0 md:space-x-3 mt-4 md:mt-0 transition-all duration-300`}
        >
          <Link href="/explore" onClick={handleClose}>
            <button className="bg-[#0056B3] hover:bg-[#0046a1] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition">
              Explore Programs
            </button>
          </Link>

          <Link href="/counselling" onClick={handleClose}>
            <button className="hover:bg-[#e65c00] text-black font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md transition">
              Free Counselling
            </button>
          </Link>

          <button
            onClick={() => setShowSignup(true)}
            className="bg-gradient-to-r from-[#0056B3] to-[#FF6600] text-white font-semibold text-sm md:text-base px-5 py-2 rounded-lg shadow-md hover:opacity-90 transition"
          >
            Signup
          </button>
        </nav>

        {/* ----------------- Mobile Search on Scroll ----------------- */}
        {showSearch && (
          <div className="md:hidden w-full mt-3 px-2 animate-slideDown">
            <div
              onClick={handleSearchClick}
              className="flex items-center bg-white border border-[#87CEEB] rounded-full px-3 py-2 shadow-sm cursor-pointer"
            >
              <span className="text-gray-500 text-lg mr-2">🔍</span>
              <input
                type="text"
                placeholder="Search universities, courses & more..."
                className="flex-1 text-sm text-gray-700 focus:outline-none cursor-pointer"
                readOnly
              />
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-700 ml-2 text-sm font-semibold"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </header>

      {/* ---------- Signup Popup ---------- */}
      {showSignup && <Signup onClose={handleSignupClose} />}

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