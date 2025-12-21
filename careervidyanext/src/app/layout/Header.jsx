

// "use client";

// import { useState } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { Menu, X, Search } from "lucide-react"; // 👈 Import 'Search' icon
// import Signup from "../signup/page.jsx";
// import { useRouter } from "next/navigation";

// import Subheader from "@/app/components/Subheader.jsx";
// import "./headr.css";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const router = useRouter();

//   return (
//     <>
//       <Subheader />

//       <header className="header-container">
//         <div className="header-inner">
//           {/* MOBILE HEADER (Keep as is) */}
//           <div className="mobile-header">
//             <Link href="/" className="logo-wrapper">
//               <div className="mobile-logo-box">
//                 <Image
//                   src="/images/n12.png"
//                   alt="Career Vidya Logo"
//                   width={64}
//                   height={64}
//                   className="logo-img"
//                   priority
//                 />
//               </div>
//             </Link>

//             <div className="mobile-actions">
//               <button
//                 onClick={() => setShowSignup(true)}
//                 className="mobile-signup-btn"
//               >
//                 Signup
//               </button>

//               <button
//                 className="menu-toggle-btn"
//                 onClick={() => setMenuOpen(!menuOpen)}
//               >
//                 {menuOpen ? <X size={26} /> : <Menu size={26} />}
//               </button>
//             </div>
//           </div>

//           {/* DESKTOP HEADER */}
//           <div className="container">
//           <div className="desktop-header">
//             {/* LEFT — ONLY LOGO */}
//             <Link href="/" className="logo-wrapper">
//               <div className="desktop-logo-box">
//                 <Image
//                   src="/images/n12.png"
//                   alt="Career Vidya Logo"
//                   width={100}
//                   height={100}
//                   className="logo-img"
//                   priority
//                 />
//               </div>
//             </Link>

//             {/* **NEW SEARCH BAR INTEGRATION** */}
//             <div className="header-search-container">
//               <div className="main-search-bar">
//                 <input
//                   type="text"
//                   placeholder="Explore Courses"
//                   className="main-search-input"
//                 />
//                 <button
//                   className="search-icon-btn"
//                   aria-label="Search"
//                   onClick={() => {
//                     /* Add search logic here */
//                   }}
//                 >
//                   {/* Using the Search icon with a red background for the button */}
//                   <Search size={22} color="white" />
//                 </button>
//               </div>
//             </div>
//             {/* **END NEW SEARCH BAR INTEGRATION** */}

//             {/* RIGHT — BUTTONS */}
//             <nav className="nav-right">
//               <Link href="/explore">
//                 Explore Programs
//               </Link>

//               <Link href="/teamexpand">
//                 Free Counselling
//               </Link>

//               <Link href="/counselling">
//                Top University
//               </Link>

//               <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                
//                   View More
               
//               </Link>

//               <button
//                 onClick={() => setShowSignup(true)}
//                 className="btn1-primary"
//               >
//                 Signup
//               </button>
//             </nav>
//           </div>
//         </div>
//         </div>

//         {/* MOBILE MENU (Keep as is) */}
//         {menuOpen && (
//          <div className="mobile-menu animate-slideDown">
//             <div className="mobile-menu-buttons">
//               <Link href="/explore" onClick={() => setMenuOpen(false)}>
//                 <button className="mobile-menu-btn-primary">
//                   Explore Programs
//                 </button>
//               </Link>

//               <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>
//                 <button className="mobile-menu-btn-outline">
//                   Free Counselling
//                 </button>
//               </Link>

//               <Link href="/counselling" onClick={() => setMenuOpen(false)}>
//                 <button className="mobile-menu-btn-outline">
//                   Top University
//                 </button>
//               </Link>

//               <Link href="/counselling" onClick={() => setMenuOpen(false)}>
//                 <button className="mobile-menu-btn-outline">
//                   View More
//                 </button>
//               </Link>

//               <button
//                 onClick={() => {
//                   setShowSignup(true);
//                   setMenuOpen(false);
//                 }}
//                 className="mobile-menu-btn-primary"
//               >
//                 Signup
//               </button>
//             </div>
//           </div>
//         )}
//       </header>

//       {showSignup && <Signup onClose={() => setShowSignup(false)} />}
//     </>
//   );
// }



"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search } from "lucide-react";
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

    {/* <div className="santa-wrapper">
    <Image
      src="/images/giphy.gif"
      alt="Santa"
      width={90}
      height={90}
      className="santa-icon"
      priority
    />
  </div> */}

      <header className="header-container">
        <div className="header-inner">
          {/* MOBILE HEADER */}
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
              {/* LEFT LOGO */}
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

              {/* SEARCH BAR */}
              <div className="header-search-container">
                <div className="main-search-bar">
                  <input
                    type="text"
                    placeholder="Explore Courses"
                    className="main-search-input"
                  />
                  <button className="search-icon-btn">
                    <Search size={22} color="white" />
                  </button>
                </div>
              </div>

              {/* RIGHT MENU */}
              <nav className="nav-right">
                <Link href="/explore">Explore Programs</Link>
                <Link href="/teamexpand">Free Counselling</Link>
                <Link href="/counselling">Top University</Link>
                <Link href="/counselling">View More</Link>

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

        {/* MOBILE MENU */}
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
