"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import { Menu, X, Search, User, ChevronDown } from "lucide-react";
import { GraduationCap, Handshake, IndianRupee, Users } from 'lucide-react';
import { useRouter, usePathname } from "next/navigation"; 

import Signup from "../signup/page.jsx";
import Subheader from "@/app/components/Subheader.jsx";

import "./headr.css";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

const pathname = usePathname(); 

  const router = useRouter();
useEffect(() => {
  const loadUser = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser || storedUser === "undefined") {
      setUser(null);
      return;
    }
    try {
      setUser(JSON.parse(storedUser));
    } catch (err) {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  loadUser();
  window.addEventListener("storage", loadUser);
  return () => window.removeEventListener("storage", loadUser);
}, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("authToken");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setUser(null);
    setDropdownOpen(false);
    setMenuOpen(false);
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

          {/* LOGO */}
          <Link href="/" className="logo-wrapper">
            <div className="logo-box">
              <Image src="/images/n12.png" alt="Logo" width={110} height={40} className="logo-img" priority />
              <Image src="/images/Lak.png" alt="Free Counselling Done" width={80} height={45} className="counselling-badge" priority />
            </div>
          </Link>

          {/* SEARCH (DESKTOP) */}
          <Link href="/serarch" className="header-search-container text-[#333] desktop-only">
            <div className="main-search-bar">
              <input type="text" placeholder="Explore Courses" className="main-search-input" readOnly />
              <div className="search-icon-btn">
                <Search size={22} color="white" />
              </div>
            </div>
          </Link>

          {/* NAV (DESKTOP) */}
          <nav className="nav-right desktop-only">
           {/* Explore Programs Mega Menu */}
<div className="relative group">
  <Link href="/explore" className="flex items-center gap-1">
    Explore Programs <ChevronDown size={14} />
  </Link>
  
  {/* Mega Menu Dropdown */}
  <div className="absolute top-full left-0 md:left-auto md:right-0 mt-4
                  w-[800px] bg-white rounded-2xl overflow-hidden grid grid-cols-12
                  shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100
                  opacity-0 invisible translate-y-3
                  group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                  transition-all duration-300 z-[999]">
    
    {/* Left Side: Fields/Links */}
    <div className="col-span-7 p-8">
      <h4 className="text-[18px] font-bold mb-6 text-[#002D62] tracking-tight border-b pb-2">
        Why Career Vidya?
      </h4>
      <div className="grid grid-cols-1 gap-y-3">
        <Link href="/whycareervidya/careervidya-care" className="text-sm text-gray-700 font-medium hover:text-[#04458b] hover:pl-2 transition-all duration-200 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Continuous Career Guidance
        </Link>
        <Link href="/whycareervidya/placement-support" className="text-sm text-gray-700 font-medium hover:text-[#04458b] hover:pl-2 transition-all duration-200 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Expert Placement Cell
        </Link>
        <Link href="/coming-soon" className="text-sm text-gray-700 font-medium hover:text-[#04458b] hover:pl-2 transition-all duration-200 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Exclusive Job Opportunities
        </Link>
        <Link href="/coming-soon" className="text-sm text-gray-700 font-medium hover:text-[#04458b] hover:pl-2 transition-all duration-200 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Industry Internship Programs
        </Link>
        <Link href="/coming-soon" className="text-sm text-gray-700 font-medium hover:text-[#04458b] hover:pl-2 transition-all duration-200 flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Connect with Global Alumni Network
        </Link>
      </div>
      
      {/* Additional Resource Section */}
      <div className="mt-6 pt-6 border-t border-gray-100">
         <Link href="/career-finder" className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors">
           Career Finder <span className="ml-2 px-1.5 py-0.5 bg-blue-600 text-white text-[8px] rounded">NEW</span>
         </Link>
      </div>
    </div>

    {/* Right Side: Image */}
   {/* Right Side: Colorful Stats & Award Grid */}
<div className="col-span-5 bg-[#FDFDFD] p-6 flex flex-col justify-center border-l border-gray-100">
  <div className="mb-6 flex justify-between items-end">
    <div>
      <h5 className="text-[#002D62] text-sm font-bold uppercase tracking-wider leading-none">Our Impact</h5>
      <p className="text-gray-400 text-[10px] mt-1 font-medium">Empowering Careers Globally</p>
    </div>
    {/* IBA Award Badge Style */}
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-md shadow-sm">
      AWARD 2025
    </div>
  </div>

  <div className="grid grid-cols-2 gap-3">
    {/* Admissions Done - Blue Theme */}
    <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-blue-50 border border-blue-100 transition-transform hover:scale-105">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-200 mb-2">
        <GraduationCap size={24} />
      </div>
      <p className="text-xl font-black text-[#002D62] leading-none">15K+</p>
      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Admissions</p>
    </div>

    {/* Academic Partners - Green Theme */}
    <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-emerald-50 border border-emerald-100 transition-transform hover:scale-105">
      <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200 mb-2">
        <Handshake size={24} />
      </div>
      <p className="text-xl font-black text-[#002D62] leading-none">150+</p>
      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Partners</p>
    </div>

    {/* Highest Package - Gold/Yellow Theme */}
    <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-amber-50 border border-amber-100 transition-transform hover:scale-105">
      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-amber-200 mb-2">
        <IndianRupee size={24} />
      </div>
      <p className="text-xl font-black text-[#002D62] leading-none">37 LPA+</p>
      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Highest Pkg</p>
    </div>

    {/* Alumni Network - Purple/Indigo Theme */}
    <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-indigo-50 border border-indigo-100 transition-transform hover:scale-105">
      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-2">
        <Users size={24} />
      </div>
      <p className="text-xl font-black text-[#002D62] leading-none">12K+</p>
      <p className="text-[9px] text-gray-500 font-bold uppercase mt-1">Alumni</p>
    </div>
  </div>

  <div className="mt-5 flex items-center justify-center gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200">
    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    <p className="text-[10px] text-gray-600 font-semibold italic">
      Winner: International Business Award 2025
    </p>
  </div>
</div>

  </div>
</div>

            {/* Free Counselling Mega Menu */}
            <div className="relative group">
              <Link href="/teamexpand" className="flex items-center gap-1">
                Free Counselling <ChevronDown size={14} />
              </Link>
              <div className="absolute top-full left-0 md:left-auto md:right-0 mt-4
                              w-[90vw] md:w-[750px] bg-white rounded-2xl p-8 grid grid-cols-3 gap-8
                              shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-gray-100
                              opacity-0 invisible translate-y-3
                              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                              transition-all duration-300 z-[999]">
                <div>
                  <h4 className="text-[16px] font-bold mb-4 text-[#002D62] tracking-tight border-b pb-2 ">Quick Links</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/career" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">Career Guidance</Link>
                    <Link href="/Blog" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">Latest Blogs</Link>
                    <Link href="/contactus" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">Contact Us</Link>
                    <Link href="/Aboutus" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">About Our Mission</Link>
                  </div>
                </div>
                <div>
                  <h4 className="text-[16px] font-bold mb-4 text-[#002D62] tracking-tight border-b pb-2 ">Trending Courses</h4>
                  <div className="flex flex-col gap-2">
                    <Link href="/course/1-year-online-mba" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">One Year Online MBA</Link>
                    <Link href="/course/online-mba-1" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">Online MBA</Link>
                    <Link href="/course/online-mca" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">Online MCA Program</Link>
                    <Link href="/course/bba-bachelor-of-business-administration" className="text-sm text-gray-600 hover:text-[#04458b] hover:pl-2 transition-all duration-200">Online BBA</Link>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="text-[16px] font-bold mb-4 text-[#002D62] tracking-tight">Get in Touch</h4>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">New Admissions</p>
                      <p className="font-bold text-[#333] flex items-center gap-2"><span className="text-lg">📞</span> +91 93199 98717</p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wider text-gray-400 font-bold mb-1">Student Support</p>
                      <p className="font-bold text-[#333] flex items-center gap-2"><span className="text-lg">🟢</span> +91 92897 12364</p>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-500 flex items-center gap-2"><span className="text-base">📍</span> 10 AM to 7 PM (Visit Us)</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Universities Mega Menu */}
            <div className="relative group">
              <Link href="/topunivers" className="flex items-center gap-1">
                Top Universities <ChevronDown size={14} />
              </Link>
              <div className="absolute top-full left-0 md:left-auto md:right-0 md:translate-x-0 lg:left-[-150%] lg:-translate-x-1/2 mt-5
                              w-[90vw] md:w-[600px] bg-white rounded-xl p-6 shadow-xl border border-gray-200
                              opacity-0 invisible translate-y-2
                              group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                              transition-all duration-300 z-[999]">
                <h4 className="text-[15px] font-bold mb-4 text-[#002D62] border-b pb-2">Top Online Universities</h4>
                <div className="grid grid-cols-2 gap-x-8 gap-y-2">
                  <div>
                    <Link href="/university/amity-university-online" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Amity University</Link>
                    <Link href="/university/lovely-professional-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">LPU Online</Link>
                    <Link href="/university/manipal-university-jaipur" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Manipal University</Link>
                    <Link href="/university/chandigarh-university-online" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Chandigarh University</Link>
                    <Link href="/university/srm-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">SRM University</Link>
                    <Link href="/university/dy-patil-university-online-mumbai" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">DY Patil University</Link>
                    <Link href="/university/chitkara-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Chitkara University</Link>
                    <Link href="/university/kurukshetra-university-online" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Kurukshetra University</Link>
                    <Link href="/university/sharda-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Sharda University</Link>
                    <Link href="/university/noida-international-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Noida International University</Link>
                  </div>
                  <div>
                    <Link href="/university/gla-online" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">GLA University Online</Link>
                    <Link href="/university/dr-a-p-j-abdul-kalam-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Dr. A.P.J. Abdul Kalam University</Link>
                    <Link href="/university/sikkim-manipal-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Sikkim Manipal (SMU)</Link>
                    <Link href="/university/gla-online" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">GLA University</Link>
                    <Link href="/university/jaipur-national-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Jaipur National University</Link>
                    <Link href="/university/jain-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Jain University</Link>
                    <Link href="/university/birla-institute-of-technology" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Birla Institute of Technology</Link>
                    <Link href="/university/aks-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">AKS University</Link>
                    <Link href="/university/era-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Era University</Link>
                    <Link href="/university/sanskriti-university" className="block text-sm text-gray-600 mb-2 hover:text-[#04458b] hover:pl-1 transition-all">Sanskriti University</Link>
                  </div>
                </div>
                <div className="mt-4 text-center border-t pt-3">
                  <Link href="/topunivers" className="text-sm font-bold text-[#04458b] hover:underline">View All Universities</Link>
                </div>
              </div>
            </div>

            {/* USER DROPDOWN */}
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
                    {user.role === 'admin' ? (
                      <Link href="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        Admin Dashboard
                      </Link>
                    ) : (
                      <Link href="/user" onClick={() => setDropdownOpen(false)} className="dropdown-item">
                        My Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="logout-btn-dropdown text-[#333]">
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
          </nav>

          {/* MOBILE ACTIONS */}
          <div className="mobile-actions mobile-only">
            {user ? (
              <Link
                href={user?.role === 'admin' ? '/admin' : '/user'}
                style={{ textDecoration: 'none' }}
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
              <Menu size={28} />
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
              <button onClick={() => setMenuOpen(false)}>
                <X size={30} />
              </button>
            </div>

            <nav className="mobile-nav-links">
              <Link href="/explore" onClick={() => setMenuOpen(false)}>Explore Programs</Link>
              <Link href="/teamexpand" onClick={() => setMenuOpen(false)}>Free Counselling</Link>
              <Link href="/topunivers" onClick={() => setMenuOpen(false)}>Top University</Link>

              {user?.role === 'admin' ? (
                <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin Dashboard</Link>
              ) : user ? (
                <Link href="/user" onClick={() => setMenuOpen(false)}>My Dashboard</Link>
              ) : null}

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



