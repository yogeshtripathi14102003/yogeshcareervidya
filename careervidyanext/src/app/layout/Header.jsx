"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { GraduationCap, Handshake, IndianRupee, Users } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import Signup from "../signup/page.jsx";
import Subheader from "@/app/components/Subheader.jsx";
import "./headr.css";

export default function Header() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [showSignup, setShowSignup]   = useState(false);
  const [user, setUser]               = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const pathname = usePathname();
  const router   = useRouter();

  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem("user");
      if (!stored || stored === "undefined") { setUser(null); return; }
      try { setUser(JSON.parse(stored)); }
      catch { localStorage.removeItem("user"); setUser(null); }
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, [pathname]);

  const handleLogout = () => {
    ["user","token","authToken","accessToken","refreshToken"]
      .forEach(k => localStorage.removeItem(k));
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <>
      {/* SEO H1 */}
      <h1 style={{
        position:"absolute", width:"1px", height:"1px",
        padding:"0", margin:"-1px", overflow:"hidden",
        clip:"rect(0,0,0,0)", border:"0"
      }}>
        Career Guidance and Education Counseling Platform
      </h1>

      <Subheader />

      <header className="header-container">
        <div className="header-inner">

          {/* ────── LOGO (LEFT) ────── */}
          <Link href="/" className="logo-wrapper">
            <div className="logo-box">
              <Image
                src="/images/n12.png" alt="CareerVidya Logo"
                width={110} height={40} className="logo-img" priority
              />
              <Image
                src="/images/Lak.png" alt="Free Counselling"
                width={80} height={45} className="counselling-badge" priority
              />
            </div>
          </Link>

          {/* ────── NAV LINKS (CENTER) ────── */}
          <nav className="nav-center desktop-only">

            {/* Explore Programs */}
            <div className="mega-menu-wrap relative group">
              <Link href="/explore" className="flex items-center gap-1">
                Explore Programs
                <ChevronDown size={13} className="chevron-icon" />
              </Link>
              <div className="absolute top-full left-0 mt-4 w-[800px]
                              bg-white rounded-2xl overflow-hidden grid grid-cols-12
                              shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100
                              opacity-0 invisible translate-y-3
                              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                              transition-all duration-300 z-[999]">
                {/* Left */}
                <div className="col-span-7 p-8">
                  <h4 className="text-[17px] font-bold mb-5 text-[#002D62] border-b pb-2">
                    Why Career Vidya?
                  </h4>
                  <div className="flex flex-col gap-3">
                    {[
                      { href:"/whycareervidya/careervidya-care",   label:"Continuous Career Guidance" },
                      { href:"/whycareervidya/placement-support",  label:"Expert Placement Cell" },
                      { href:"/WP/home",                           label:"Balance your job and learning" },
                      { href:"/coming-soon",                       label:"Industry Internship Programs" },
                      { href:"/coming-soon",                       label:"Connect with Global Alumni Network" },
                    ].map(({ href, label }) => (
                      <Link key={href+label} href={href}
                        className="text-sm text-gray-700 font-medium hover:text-[#04458b]
                                   hover:pl-2 transition-all duration-200 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                        {label}
                      </Link>
                    ))}
                  </div>
                  <div className="mt-6 pt-5 border-t border-gray-100">
                    <Link href="/whycareervidya/career-finder"
                      className="inline-flex items-center px-4 py-2 bg-blue-50
                                 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
                      Career Finder
                      <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] rounded">NEW</span>
                    </Link>
                  </div>
                </div>
                {/* Right Stats */}
                <div className="col-span-5 bg-[#FDFDFD] p-6 flex flex-col justify-center border-l border-gray-100">
                  <div className="mb-5 flex justify-between items-end">
                    <div>
                      <h5 className="text-[#002D62] text-sm font-bold uppercase tracking-wider">Our Impact</h5>
                      <p className="text-gray-400 text-[10px] mt-1">Empowering Careers Globally</p>
                    </div>
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-md">
                      AWARD 2025
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon:<GraduationCap size={22}/>, num:"15K+",  label:"Admissions", bg:"bg-blue-50",   border:"border-blue-100",   grad:"from-blue-500 to-blue-700",       shadow:"shadow-blue-200" },
                      { icon:<Handshake size={22}/>,     num:"150+",  label:"Partners",   bg:"bg-emerald-50", border:"border-emerald-100", grad:"from-emerald-400 to-emerald-600", shadow:"shadow-emerald-200" },
                      { icon:<IndianRupee size={22}/>,   num:"37 LPA+",label:"Highest Pkg",bg:"bg-amber-50",  border:"border-amber-100",   grad:"from-amber-400 to-orange-500",    shadow:"shadow-amber-200" },
                      { icon:<Users size={22}/>,         num:"12K+",  label:"Alumni",     bg:"bg-indigo-50",  border:"border-indigo-100",  grad:"from-indigo-500 to-purple-600",   shadow:"shadow-indigo-200" },
                    ].map(({ icon, num, label, bg, border, grad, shadow }) => (
                      <div key={label}
                        className={`flex flex-col items-center text-center p-3 rounded-2xl ${bg} ${border} border transition-transform hover:scale-105`}>
                        <div className={`w-11 h-11 bg-gradient-to-br ${grad} rounded-full flex items-center justify-center text-white shadow-lg ${shadow} mb-2`}>
                          {icon}
                        </div>
                        <p className="text-lg font-black text-[#002D62] leading-none">{num}</p>
                        <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">{label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <p className="text-[10px] text-gray-600 font-semibold italic">
                      Winner: International Business Award 2025
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Free Counselling */}
            <div className="mega-menu-wrap relative group">
              <Link href="/teamexpand" className="flex items-center gap-1">
                Free Counselling
                <ChevronDown size={13} className="chevron-icon" />
              </Link>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-4
                              w-[720px] bg-white rounded-2xl p-8 grid grid-cols-3 gap-8
                              shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100
                              opacity-0 invisible translate-y-3
                              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                              transition-all duration-300 z-[999]">
                <div>
                  <h4 className="text-[15px] font-bold mb-4 text-[#002D62] border-b pb-2">Quick Links</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/career"    className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">Career Guidance</Link>
                    <Link href="/Blog"      className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">Latest Blogs</Link>
                    <Link href="/contactus" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">Contact Us</Link>
                    <Link href="/Aboutus"   className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">About Our Mission</Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[15px] font-bold mb-4 text-[#002D62] border-b pb-2">Trending Courses</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/course/1-year-online-mba"                      className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">One Year Online MBA</Link>
                    <Link href="/course/online-mba-1"                           className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">Online MBA</Link>
                    <Link href="/course/online-mca"                             className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">Online MCA Program</Link>
                    <Link href="/course/bba-bachelor-of-business-administration" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all">Online BBA</Link>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-[15px] font-bold mb-4 text-[#002D62]">Get in Touch</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">New Admissions</p>
                      <p className="font-bold text-[#333] text-sm flex items-center gap-2">📞 +91 93199 98717</p>
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-1">Student Support</p>
                      <p className="font-bold text-[#333] text-sm flex items-center gap-2">🟢 +91 92897 12364</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 flex items-center gap-2">📍 10 AM to 7 PM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Universities */}
            <div className="mega-menu-wrap relative group">
              <Link href="/topunivers" className="flex items-center gap-1">
                Top Universities
                <ChevronDown size={13} className="chevron-icon" />
              </Link>
              <div className="absolute top-full right-0 mt-4
                              w-[580px] bg-white rounded-xl p-6
                              shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100
                              opacity-0 invisible translate-y-3
                              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                              transition-all duration-300 z-[999]">
                <h4 className="text-[15px] font-bold mb-4 text-[#002D62] border-b pb-2">Top Online Universities</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  {[
                    ["/university/amity-university-online",          "Amity University"],
                    ["/university/lovely-professional-university",    "LPU Online"],
                    ["/university/manipal-university-jaipur",         "Manipal University"],
                    ["/university/chandigarh-university-online",      "Chandigarh University"],
                    ["/university/srm-university",                    "SRM University"],
                    ["/university/dy-patil-university-online-mumbai", "DY Patil University"],
                    ["/university/chitkara-university",               "Chitkara University"],
                    ["/university/kurukshetra-university-online",     "Kurukshetra University"],
                    ["/university/sharda-university",                 "Sharda University"],
                    ["/university/noida-international-university",    "Noida International University"],
                  ].map(([href, label]) => (
                    <Link key={href} href={href}
                      className="block text-sm text-gray-600 py-1 hover:text-[#04458b] hover:pl-1 transition-all">
                      {label}
                    </Link>
                  ))}
                  {[
                    ["/university/gla-online",                       "GLA University Online"],
                    ["/university/dr-a-p-j-abdul-kalam-university",  "Dr. APJ Abdul Kalam University"],
                    ["/university/sikkim-manipal-university",         "Sikkim Manipal (SMU)"],
                    ["/university/jaipur-national-university",        "Jaipur National University"],
                    ["/university/jain-university",                   "Jain University"],
                    ["/university/birla-institute-of-technology",     "Birla Institute of Technology"],
                    ["/university/aks-university",                    "AKS University"],
                    ["/university/era-university",                    "Era University"],
                    ["/university/sanskriti-university",              "Sanskriti University"],
                  ].map(([href, label]) => (
                    <Link key={href} href={href}
                      className="block text-sm text-gray-600 py-1 hover:text-[#04458b] hover:pl-1 transition-all">
                      {label}
                    </Link>
                  ))}
                </div>
                <div className="mt-4 border-t pt-3 text-center">
                  <Link href="/topunivers" className="text-sm font-bold text-[#04458b] hover:underline">
                    View All Universities →
                  </Link>
                </div>
              </div>
            </div>
             <Link href="/career" onClick={() => setMenuOpen(false)}>Career </Link>

          </nav>

          {/* ────── RIGHT: SEARCH + SIGNUP/USER (DESKTOP) ────── */}
          <div className="right-actions desktop-only">

            {/* Search */}
            <Link href="/serarch" className="search-link">
              <div className="main-search-bar">
                <input
                  type="text"
                  placeholder="Explore Courses"
                  className="main-search-input"
                  readOnly
                />
                <div className="search-icon-btn">
                  <Search size={16} color="white" />
                </div>
              </div>
            </Link>

            {/* Signup / User */}
            {user ? (
              <div className="user-dropdown-container">
                <button
                  className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  <User size={16} />
                  Hi, {user?.name || "User"}
                  <ChevronDown
                    size={13}
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "0.3s" }}
                  />
                </button>
                {dropdownOpen && (
                  <div className="user-dropdown-menu">
                    {user.role === "admin" ? (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link href="/user" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        My Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="logout-btn-dropdown">
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowSignup(true)} className="btn1-primary">
                Signup
              </button>
            )}
          </div>

          {/* ────── MOBILE ACTIONS ────── */}
          <div className="mobile-actions mobile-only">
            {user ? (
              <Link
                href={user?.role === "admin" ? "/admin" : "/user"}
                className="mobile-user-name"
              >
                Hi, {user?.name || "User"}
              </Link>
            ) : (
              <button onClick={() => setShowSignup(true)} className="mobile-signup-btn">
                Signup
              </button>
            )}
            <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)}>
              <Menu size={26} />
            </button>
          </div>

        </div>

        {/* ────── MOBILE SIDEBAR ────── */}
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
              <button onClick={() => setMenuOpen(false)} className="menu-toggle-btn">
                <X size={28} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/explore"    onClick={() => setMenuOpen(false)}>Explore Programs</Link>
              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>Free Counselling</Link>
              <Link href="/topunivers" onClick={() => setMenuOpen(false)}>Top Universities</Link>
              <Link href="/serarch"    onClick={() => setMenuOpen(false)}>Search Courses</Link>

              {user?.role === "admin" ? (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              ) : user ? (
                <Link href="/user" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
              ) : null}
            </nav>

            {user ? (
              <button onClick={handleLogout} className="mobile-logout-btn">
                Logout
              </button>
            ) : (
              <button
                onClick={() => { setShowSignup(true); setMenuOpen(false); }}
                className="mobile-sidebar-signup"
              >
                Signup / Login
              </button>
            )}
          </div>
        </div>

      </header>

      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </>
  );
}