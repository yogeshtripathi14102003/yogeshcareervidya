

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
import Subheader from "@/app/components/Subheader.jsx";
import "./headr.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      <Subheader />
      <header className="header-container">
        <div className="header-inner">
          
{/* LOGO */}
<Link href="/" className="logo-wrapper">
  <div className="logo-box">
    <Image
      src="/images/n12.png"
      alt="Logo"
      width={110}
      height={40}
      className="logo-img"
      priority
    />

    <Image
      src="/images/Lak.png"
      alt="Free Counselling Done"
      width={80}
      height={45}
      className="counselling-badge"
      priority
    />
  </div>
</Link>


          {/* DESKTOP SEARCH */}
        <Link href="/layout/serarch" className="header-search-container desktop-only">
  <div className="main-search-bar">
    <input
      type="text"
      placeholder="Explore Courses"
      className="main-search-input"
      readOnly
      style={{ cursor: 'pointer' }}
    />
    <div className="search-icon-btn">
      <Search size={22} color="white" />
    </div>
  </div>
</Link>

          {/* DESKTOP NAV */}
          <nav className="nav-right desktop-only">
            <Link href="/explore">Explore Programs</Link>
            <Link href="/teamexpand">Free Counselling</Link>
            <Link href="/coming-soon">Top University</Link>
{/* <Link href="/topunivers">Top University</Link> */}
            <div className="nav-item-more">
              <Link href="#">View More</Link>

              {/* ================= MEGA MENU (COMMENTED) ================= */}
              {/*
              <div className="mega-menu">
                <div className="mega-menu-inner">

                  <div className="mega-column">
                    <h3>About Us</h3>
                    <Link href="/about">Our Story</Link>
                    <Link href="/team">Our Team</Link>
                    <Link href="/careers">Careers</Link>
                  </div>

                  <div className="mega-column">
                    <h3>Services</h3>
                    <Link href="/admission">Admission Guidance</Link>
                    <Link href="/visa">Visa Assistance</Link>
                    <Link href="/loans">Education Loans</Link>
                  </div>

                  <div className="mega-column">
                    <h3>Contact</h3>
                    <Link href="/contact">Get in Touch</Link>
                    <Link href="/support">Help Center</Link>
                    <Link href="/locations">Our Offices</Link>
                  </div>

                </div>
              </div>
              */}
              {/* ========================================================= */}
            </div>

            <button
              onClick={() => setShowSignup(true)}
              className="btn1-primary"
            >
              Signup
            </button>
          </nav>

          {/* MOBILE ACTIONS */}
          <div className="mobile-actions mobile-only">
            <button
              onClick={() => setShowSignup(true)}
              className="mobile-signup-btn"
            >
              Signup
            </button>
            <button
              className="menu-toggle-btn"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} color="black" />
            </button>
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        <div
          className={`mobile-sidebar-overlay ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(false)}
        >
          <div
            className={`mobile-sidebar ${menuOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sidebar-header">
              <span className="sidebar-title">Menu</span>
              <button
                className="close-btn"
                onClick={() => setMenuOpen(false)}
              >
                <X size={30} color="#333" />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>
                Explore Programs
              </Link>
              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>
                Free Counselling
              </Link>
              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                Top University
              </Link>
              <Link href="/counselling" onClick={() => setMenuOpen(false)}>
                View More
              </Link>
              <button
                onClick={() => {
                  setShowSignup(true);
                  setMenuOpen(false);
                }}
                className="mobile-sidebar-signup"
              >
                Signup
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* SIGNUP MODAL */}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}
