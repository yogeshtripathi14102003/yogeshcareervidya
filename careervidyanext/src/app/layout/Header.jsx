

"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react"; // 👈 Import 'Search' icon
import Signup from "../signup/page.jsx";
import { useRouter } from "next/navigation";

import Subheader from "@/app/components/Subheader.jsx";
import "./headr.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const router = useRouter();

  return (
    <>
      <Subheader />

      <header className="header-container">
        <div className="header-inner">
          {/* MOBILE HEADER (Keep as is) */}
          <div className="mobile-header">
            <Link href="/" className="logo-wrapper">
              <div className="mobile-logo-box">
                <Image
                  src="/images/n12.png"
                  alt="Career Vidya Logo"
                  width={64}
                  height={64}
                  className="logo-img"
                  priority
                />
              </div>
            </Link>

            <div className="mobile-actions">
              <button
                onClick={() => setShowSignup(true)}
                className="mobile-signup-btn"
              >
                Signup
              </button>

              <button
                className="menu-toggle-btn"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={26} /> : <Menu size={26} />}
              </button>
            </div>
          </div>

          {/* DESKTOP HEADER */}
          <div className="container">
          <div className="desktop-header">
            {/* LEFT — ONLY LOGO */}
            <Link href="/" className="logo-wrapper">
              <div className="desktop-logo-box">
                <Image
                  src="/images/n12.png"
                  alt="Career Vidya Logo"
                  width={100}
                  height={100}
                  className="logo-img"
                  priority
                />
              </div>
            </Link>

            {/* **NEW SEARCH BAR INTEGRATION** */}
            <div className="header-search-container">
              <div className="main-search-bar">
                <input
                  type="text"
                  placeholder="Explore Courses"
                  className="main-search-input"
                />
                <button
                  className="search-icon-btn"
                  aria-label="Search"
                  onClick={() => {
                    /* Add search logic here */
                  }}
                >
                  {/* Using the Search icon with a red background for the button */}
                  <Search size={22} color="white" />
                </button>
              </div>
            </div>
            {/* **END NEW SEARCH BAR INTEGRATION** */}

            {/* RIGHT — BUTTONS */}
            <nav className="nav-right">
              <Link href="/explore">
                Explore Programs
              </Link>

              <Link href="/teamexpand">
                Free Counselling
              </Link>

              <Link href="/counselling">
               Top University
              </Link>

              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                
                  View More
               
              </Link>

              <button
                onClick={() => setShowSignup(true)}
                className="btn1-primary"
              >
                Signup
              </button>
            </nav>
          </div>
        </div>
        </div>

        {/* MOBILE MENU (Keep as is) */}
        {menuOpen && (
         <div className="mobile-menu animate-slideDown">
            <div className="mobile-menu-buttons">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>
                <button className="mobile-menu-btn-primary">
                  Explore Programs
                </button>
              </Link>

              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>
                <button className="mobile-menu-btn-outline">
                  Free Counselling
                </button>
              </Link>

              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                <button className="mobile-menu-btn-outline">
                  Top University
                </button>
              </Link>

              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                <button className="mobile-menu-btn-outline">
                  View More
                </button>
              </Link>

              <button
                onClick={() => {
                  setShowSignup(true);
                  setMenuOpen(false);
                }}
                className="mobile-menu-btn-primary"
              >
                Signup
              </button>
            </div>
          </div>
        )}
      </header>

      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}



// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";

// import Sidebar from "../sidebar";
// import ViewMore from "@/app/layout/ViewMore.jsx";
// import CompanyInfoMenu from "../submanu/company/company";

// const menuItems = [
//   { label: "COMPANY", dropdown: true, component: <CompanyInfoMenu /> },
//   { label: "SERVICES", dropdown: true, component: <ViewMore /> },
//   { label: "INVESTOR", component: "" },
// ];

// const Navbar = () => {
//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [toggle, settoggle] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       setScrolled(window.scrollY > 400);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav
//       className={`w-full px-6 bg-white shadow-sm flex items-center justify-between z-50 ${
//         scrolled ? "fixed top-0 left-0" : "bg-transparent"
//       }`}
//     >
//       {/* ===== LOGO ===== */}
//       <Link href="/">
//         <div className="flex items-center md:space-x-2 md:ml-8 cursor-pointer">
//           <Image
//             src="/logo-without-bg.png"
//             alt="Logo"
//             width={80}
//             height={80}
//             className="object-contain"
//             priority
//           />
//         </div>
//       </Link>

//       {/* ===== DESKTOP MENU ===== */}
//       <ul className="hidden md:flex space-x-6 items-center">
//         <li className="text-sm text-gray-700 font-medium cursor-pointer">
//           <Link href="/">HOME</Link>
//         </li>

//         {menuItems.map((item, idx) => (
//           <li
//             key={idx}
//             className="relative group"
//             onMouseEnter={() => setHoveredIndex(idx)}
//             onMouseLeave={() => setHoveredIndex(null)}
//           >
//             <div className="text-sm text-gray-700 font-medium cursor-pointer flex items-center space-x-1">
//               <span>{item.label}</span>
//               {item.dropdown && <span className="text-xs">▼</span>}
//             </div>

//             {hoveredIndex === idx && item.dropdown && (
//               <div className="absolute top-full left-0">
//                 {item.component}
//               </div>
//             )}
//           </li>
//         ))}

//         <li className="text-sm text-gray-700 font-medium cursor-pointer">
//           <Link href="/blog">BLOG</Link>
//         </li>

//         <li>
//           <Link href="/contact">
//             <button className="bg-[#05347f] text-white px-4 py-2 rounded-md transition text-sm font-semibold hover:bg-[#042a63]">
//               CONTACT US
//             </button>
//           </Link>
//         </li>
//       </ul>

//       {/* ===== MOBILE MENU ===== */}
//       <div className="md:hidden">
//         <button
//           className="text-[#05347f] text-2xl cursor-pointer"
//           onClick={() => settoggle((prev) => !prev)}
//         >
//           &#9776;
//         </button>

//         <Sidebar
//           mainMenu={toggle}
//           setMainMenu={settoggle}
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;
