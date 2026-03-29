



// "use client";

// import { useState, useEffect } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { Menu, X, Search, User, ChevronDown } from "lucide-react";

// import Signup from "../signup/page.jsx";
// import Subheader from "@/app/components/Subheader.jsx";

// import "./headr.css";

// export default function Header() {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [showSignup, setShowSignup] = useState(false);
//   const [user, setUser] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false); // Dropdown toggle state

//   const router = useRouter();

//   // ================= LOAD USER SAFELY =================
//   useEffect(() => {
//     const loadUser = () => {
//       const storedUser = localStorage.getItem("user");

//       if (!storedUser || storedUser === "undefined") {
//         setUser(null);
//         return;
//       }

//       try {
//         const parsedUser = JSON.parse(storedUser);
//         setUser(parsedUser);
//       } catch (err) {
//         console.error("Invalid user data:", err);
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
//     setDropdownOpen(false);
//     router.push("/");
//   };

//   return (
//     <>
//     <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
//       Career Guidance and Education Counseling Platform
//     </h1>
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
//             className="header-search-container text-[#333] desktop-only"
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

//             {/* ================= USER DROPDOWN ================= */}
//             {user ? (
//               <div className="user-dropdown-container" style={{ position: 'relative' }}>
//                 <button 
//                   className="user-dropdown-trigger"
//                   onClick={() => setDropdownOpen(!dropdownOpen)}
//                   style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer', background: 'none', border: 'none', color: 'inherit' }}
//                 >
//                   <User size={18} />
//                   <span className="username-text text-[#333]">
//                     Hi, {user?.name || "User"}
//                   </span>
//                   <ChevronDown size={14} style={{ transform: dropdownOpen ? 'rotate(180deg)' : 'none', transition: '0.3s' }} />
//                 </button>

//                 {dropdownOpen && (
//                   <div className="user-dropdown-menu">
//                     {/* Admin Dashboard - Only for Admins */}
//                     {user.role === 'admin' && (
//                       <Link href="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
//                         Admin Dashboard
//                       </Link>
//                     )}
                    
//                     <button onClick={handleLogout} className="logout-btn-dropdown text-[#333]">
//                       Logout
//                     </button>
//                   </div>
//                 )}
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
//           className={`mobile-sidebar-overlay ${menuOpen ? "active" : ""}`}
//           onClick={() => setMenuOpen(false)}
//         >
//           <div
//             className={`mobile-sidebar ${menuOpen ? "open" : ""}`}
//             onClick={(e) => e.stopPropagation()}
//           >
//             <div className="sidebar-header">
//               <span className="sidebar-title">Menu</span>
//               <button onClick={() => setMenuOpen(false)}>
//                 <X size={30} />
//               </button>
//             </div>

//             <nav className="mobile-nav-links">
//               <Link href="/explore" onClick={() => setMenuOpen(false)}>Explore Programs</Link>
//               <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>Free Counselling</Link>
//               <Link href="/topunivers" onClick={() => setMenuOpen(false)}>Top University</Link>

//               {user?.role === 'admin' && (
//                  <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
//               )}

//               {user ? (
//                 <button onClick={handleLogout} className="mobile-logout-btn">
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
    <h1 style={{ position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', border: '0' }}>
      Career Guidance and Education Counseling Platform
    </h1>
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
     <div className="relative group">
  <Link href="/teamexpand">Free Counselling</Link>

  <div className="absolute top-full left-0 md:left-auto md:right-0 md:translate-x-0 lg:left-[0%] lg:-translate-x-1/2 mt-5
                  w-[90vw] md:w-[720px] bg-white rounded-xl p-6 grid grid-cols-3 gap-6
                  shadow-xl border border-gray-200
                  opacity-0 invisible translate-y-2 
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 z-[999]">

    {/* Column 1 */}
    <div>
      <h4 className="text-[15px] font-bold mb-2 text-[#002D62]">Links</h4>
      <Link href="/career" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">Career</Link>
      <Link href="/Blog" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">Blog</Link>
      <Link href="/contactus" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">Contact Us</Link>
      <Link href="/Aboutus" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">About Us</Link>
    </div> 

    {/* Column 2 */}
    <div>
      <h4 className="text-[15px] font-bold mb-2 text-[#002D62]">Most Popular Online Courses</h4>
      <Link href="/course/1-year-online-mba" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all"> One Year online MBA </Link>
      <Link href="/course/online-mba-1"   className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">Online-MBA</Link>
      <Link href="/course/online-mca" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">Online-MCA</Link>
      <Link href="/course/bba-bachelor-of-business-administration" className="block text-sm text-gray-600 mb-1 hover:text-[#04458b] hover:pl-1 transition-all">Online BBA</Link>
    </div>

    {/* Column 3 */} 
   <div>
  <h4 className="text-[15px] font-bold mb-3 text-[#002D62]">Find Us</h4>

  {/* New Students */}
  <div className="mb-3">
    <p className="text-sm text-gray-600 flex items-center gap-2">
      👨‍🎓 New Students
    </p>
    <p className="font-semibold text-black">+91 93199 98717</p>
  </div>

  {/* Existing Students */}
  {/* <div className="mb-3">
    <p className="text-sm text-gray-600 flex items-center gap-2">
      👨‍🎓 Existing Students / Post Admission
    </p>
    <p className="font-semibold text-black">1800-420-5757</p>
  </div> */}

  {/* WhatsApp */}
  <div className="mb-3">
    <p className="text-sm text-gray-600 flex items-center gap-2">
      🟢 Existing Students
    </p>
    <p className="font-semibold text-black"> +91 92897 12364</p>
  </div>

  {/* Grievance */}
  {/* <div className="mb-3">
    <p className="text-sm text-gray-600 flex items-center gap-2">
      ✋ Grievance
    </p>
    <p className="font-semibold text-black">1800-309-9018</p>
  </div> */}

  {/* Visit */}
  <div>
    <p className="text-sm text-gray-600 flex items-center gap-2">
      📍 Visit Us
    </p>
    <p className="font-semibold text-black">(10 AM to 7 PM)</p>
  </div>
</div>

  </div>
</div>
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