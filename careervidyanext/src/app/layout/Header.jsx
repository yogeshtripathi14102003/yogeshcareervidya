

// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Menu, X, Search, User } from "lucide-react";

// import Signup from "../signup/page.jsx";
// import Subheader from "@/app/components/Subheader.jsx";

// import "./headr.css";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [user, setUser] = useState(null);

//   const router = useRouter();

//   // ================= LOAD USER SAFELY =================
//   useEffect(() => {
//     const loadUser = () => {
//       const storedUser = localStorage.getItem("user");

//       // If empty / undefined
//       if (!storedUser || storedUser === "undefined") {
//         setUser(null);
//         return;
//       }

//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error("Invalid user data:", err);

//         // Remove bad data
//         localStorage.removeItem("user");
//         setUser(null);
//       }
//     };

//     loadUser();

//     window.addEventListener("storage", loadUser);

//     return () => window.removeEventListener("storage", loadUser);
//   }, []);

//   // ================= LOGOUT =================
//   const handleLogout = () => {
//     localStorage.removeItem("user");
//     setUser(null);
//     router.push("/");
//   };

//   return (
//     <>
//       <Subheader />

//       <header className="header-container">
//         <div className="header-inner">

//           {/* ================= LOGO ================= */}
//           <Link href="/" className="logo-wrapper">
//             <div className="logo-box">
//               <Image
//                 src="/images/n12.png"
//                 alt="Logo"
//                 width={110}
//                 height={40}
//                 className="logo-img"
//                 priority
//               />

//               <Image
//                 src="/images/Lak.png"
//                 alt="Free Counselling Done"
//                 width={80}
//                 height={45}
//                 className="counselling-badge"
//                 priority
//               />
//             </div>
//           </Link>

//           {/* ================= SEARCH (DESKTOP) ================= */}
//           <Link
//             href="/serarch"
//             className="header-search-container desktop-only"
//           >
//             <div className="main-search-bar">
//               <input
//                 type="text"
//                 placeholder="Explore Courses"
//                 className="main-search-input"
//                 readOnly
//               />

//               <div className="search-icon-btn">
//                 <Search size={22} color="white" />
//               </div>
//             </div>
//           </Link>

//           {/* ================= NAV (DESKTOP) ================= */}
//           <nav className="nav-right desktop-only">

//             <Link href="/explore">Explore Programs</Link>

//             <Link href="/teamexpand">Free Counselling</Link>

//             <Link href="/topunivers">Top Universities</Link>

//             {/* ================= USER ================= */}
//             {user ? (
//               <div className="user-dropdown">

//                 <User size={18} />

//                 <span className="username-text">
//                   Hi, {user?.name || "User"}
//                 </span>

//                 <div className="user-dropdown-menu">
//                   <button onClick={handleLogout}>
//                     Logout
//                   </button>
//                 </div>

//               </div>
//             ) : (
//               <button
//                 onClick={() => setShowSignup(true)}
//                 className="btn1-primary"
//               >
//                 Signup
//               </button>
//             )}
//           </nav>

//           {/* ================= MOBILE ACTIONS ================= */}
//           <div className="mobile-actions mobile-only">

//             {user ? (
//               <span className="mobile-user-name">
//                 Hi, {user?.name || "User"}
//               </span>
//             ) : (
//               <button
//                 onClick={() => setShowSignup(true)}
//                 className="mobile-signup-btn"
//               >
//                 Signup
//               </button>
//             )}

//             <button
//               className="menu-toggle-btn"
//               onClick={() => setMenuOpen(true)}
//             >
//               <Menu size={28} />
//             </button>

//           </div>
//         </div>

//         {/* ================= MOBILE SIDEBAR ================= */}
//         <div
//           className={`mobile-sidebar-overlay ${
//             menuOpen ? "active" : ""
//           }`}
//           onClick={() => setMenuOpen(false)}
//         >
//           <div
//             className={`mobile-sidebar ${
//               menuOpen ? "open" : ""
//             }`}
//             onClick={(e) => e.stopPropagation()}
//           >

//             <div className="sidebar-header">

//               <span className="sidebar-title">
//                 Menu
//               </span>

//               <button onClick={() => setMenuOpen(false)}>
//                 <X size={30} />
//               </button>

//             </div>

//             <nav className="mobile-nav-links">

//               <Link
//                 href="/explore"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Explore Programs
//               </Link>

//               <Link
//                 href="/teamexpand"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Free Counselling
//               </Link>

//               <Link
//                 href="/topunivers"
//                 onClick={() => setMenuOpen(false)}
//               >
//                 Top University
//               </Link>

//               {user ? (
//                 <button
//                   onClick={handleLogout}
//                   className="mobile-logout-btn"
//                 >
//                   Logout
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => {
//                     setShowSignup(true);
//                     setMenuOpen(false);
//                   }}
//                   className="mobile-sidebar-signup"
//                 >
//                   Signup
//                 </button>
//               )}

//             </nav>
//           </div>
//         </div>
//       </header>

//       {/* ================= SIGNUP MODAL ================= */}
//       {showSignup && (
//         <Signup onClose={() => setShowSignup(false)} />
//       )}
//     </>
//   );
// }



"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";

import Signup from "../signup/page.jsx";
import Subheader from "@/app/components/Subheader.jsx";

import "./headr.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state

  const router = useRouter();

  // ================= LOAD USER SAFELY =================
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");

      if (!storedUser || storedUser === "undefined") {
        setUser(null);
        return;
      }

      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch (err) {
        console.error("Invalid user data:", err);
        localStorage.removeItem("user");
        setUser(null);
      }
    };

    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setDropdownOpen(false);
    router.push("/");
  };

  return (
    <>
      <Subheader />

      <header className="header-container">
        <div className="header-inner">

          {/* ================= LOGO ================= */}
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

          {/* ================= SEARCH (DESKTOP) ================= */}
          <Link
            href="/serarch"
            className="header-search-container text-[#333] desktop-only"
          >
            <div className="main-search-bar">
              <input
                type="text"
                placeholder="Explore Courses"
                className="main-search-input"
                readOnly
              />
              <div className="search-icon-btn">
                <Search size={22} color="white" />
              </div>
            </div>
          </Link>

          {/* ================= NAV (DESKTOP) ================= */}
          <nav className="nav-right desktop-only">
            <Link href="/explore">Explore Programs</Link>
            <Link href="/teamexpand">Free Counselling</Link>
            <Link href="/topunivers">Top Universities</Link>

            {/* ================= USER DROPDOWN ================= */}
            {user ? (
              <div className="user-dropdown-container" style={{ position: 'relative' }}>
                <button 
                  className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
                >
                  <User size={18} />
                  <span className="username-text text-[#333]">
                    Hi, {user?.name || "User"}
                  </span>
                  <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
                </button>

                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    {/* Admin Dashboard - Only for Admins */}
                    {user.role === 'admin' && (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        Admin Dashboard
                      </Link>
                    )}
                    
                    <button onClick={handleLogout} className="logout-btn-dropdown text-[#333]">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowSignup(true)}
                className="btn1-primary"
              >
                Signup
              </button>
            )}
          </nav>

          {/* ================= MOBILE ACTIONS ================= */}
          <div className="mobile-actions mobile-only">
            {user ? (
              <span className="mobile-user-name">
                Hi, {user?.name || "User"}
              </span>
            ) : (
              <button
                onClick={() => setShowSignup(true)}
                className="mobile-signup-btn"
              >
                Signup
              </button>
            )}

            <button
              className="menu-toggle-btn"
              onClick={() => setMenuOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>
        </div>

        {/* ================= MOBILE SIDEBAR ================= */}
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
              <button onClick={() => setMenuOpen(false)}>
                <X size={30} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>Explore Programs</Link>
              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>Free Counselling</Link>
              <Link href="/topunivers" onClick={() => setMenuOpen(false)}>Top University</Link>

              {user?.role === 'admin' && (
                 <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              )}

              {user ? (
                <button onClick={handleLogout} className="mobile-logout-btn">
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    setShowSignup(true);
                    setMenuOpen(false);
                  }}
                  className="mobile-sidebar-signup"
                >
                  Signup
                </button>
              )}
            </nav>
          </div>
        </div>
      </header>

      {showSignup && (
        <Signup onClose={() => setShowSignup(false)} />
      )}
    </>
  );
}