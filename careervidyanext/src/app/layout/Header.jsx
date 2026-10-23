


// "use client";

// import { useState, useEffect } from "react";
// import { createPortal } from "react-dom"; // ✅ CHANGE 1: import
// import Image from "next/image";
// import Link from "next/link";
// import {
//   Menu, X, Search, User, ChevronDown, ChevronRight,
//   PhoneCall, LogOut,
// } from "lucide-react";
// import {
//   GraduationCap, Handshake, IndianRupee, Users,
//   Compass, Award, Briefcase, BookOpen,
//   School, Landmark, Building2, Globe2, BadgeCheck, Library,
// } from "lucide-react";
// import { useRouter, usePathname } from "next/navigation";

// import Signup from "../signup/page.jsx";
// import Subheader from "@/app/components/Subheader.jsx";
// import { useAuth } from "@/context/AuthContext.jsx";
// import "./headr.css";

// // ─── SHARED DATA ────────────────────────────────────────────────────────────

// const POPULAR_COURSES = [
//   { href: "/course/online-mba-1",                                 label: "Online MBA",          icon: GraduationCap, chip: "chip-primary" },
//   { href: "/course/1-year-online-mba",                            label: "One Year Online MBA", icon: GraduationCap, chip: "chip-primary" },
//   { href: "/course/online-mca",                                   label: "Online MCA",          icon: BookOpen,      chip: "chip-primary" },
//   { href: "/course/bba-bachelor-of-business-administration",      label: "Online BBA",          icon: Briefcase,     chip: "chip-primary" },
//   { href: "/course/online-bca-bachelor-of-computer-applications", label: "Online BCA",          icon: BookOpen,      chip: "chip-primary" },
//   { href: "/course/online-ba-bachelors-of-arts",                  label: "Online BA",           icon: GraduationCap, chip: "chip-primary" },
//   { href: "/course/online-ma-masters-of-arts",                    label: "Online MA",           icon: GraduationCap, chip: "chip-primary" },
//   { href: "/course/online-bcom-bachelors-of-commerce",            label: "Online B.Com",        icon: Briefcase,     chip: "chip-primary" },
//   { href: "/course/mcom-master-of-commerce",                      label: "M.Com",               icon: Briefcase,     chip: "chip-primary" },
//   { href: "/course/btech-bachelors-of-technology",                label: "B.Tech",              icon: BookOpen,      chip: "chip-primary" },
// ];

// const TOP_UNIVERSITIES = [
//   { href: "/university/amity-university-online",           label: "Amity University",               icon: Landmark,   chip: "chip-primary" },
//   { href: "/university/lovely-professional-university",    label: "LPU Online",                     icon: Building2,  chip: "chip-primary" },
//   { href: "/university/manipal-university-jaipur",         label: "Manipal University",             icon: School,     chip: "chip-primary" },
//   { href: "/university/chandigarh-university-online",      label: "Chandigarh University",          icon: Landmark,   chip: "chip-primary" },
//   { href: "/university/srm-university",                    label: "SRM University",                 icon: Building2,  chip: "chip-primary" },
//   { href: "/university/dy-patil-university-online-mumbai", label: "DY Patil University",            icon: School,     chip: "chip-primary" },
//   { href: "/university/chitkara-university",               label: "Chitkara University",            icon: Landmark,   chip: "chip-primary" },
//   { href: "/university/kurukshetra-university-online",     label: "Kurukshetra University",         icon: Building2,  chip: "chip-primary" },
//   { href: "/university/sharda-university",                 label: "Sharda University",              icon: School,     chip: "chip-primary" },
//   { href: "/university/noida-international-university",    label: "Noida International University", icon: Globe2,     chip: "chip-primary" },
//   { href: "/university/gla-online",                        label: "GLA University Online",          icon: Landmark,   chip: "chip-primary" },
//   { href: "/university/dr-a-p-j-abdul-kalam-university",   label: "Dr. APJ Abdul Kalam University", icon: BadgeCheck, chip: "chip-primary" },
//   { href: "/university/sikkim-manipal-university",         label: "Sikkim Manipal (SMU)",           icon: School,     chip: "chip-primary" },
//   { href: "/university/jaipur-national-university",        label: "Jaipur National University",     icon: Landmark,   chip: "chip-primary" },
//   { href: "/university/jain-university",                   label: "Jain University",                icon: Building2,  chip: "chip-primary" },
//   { href: "/university/birla-institute-of-technology",     label: "Birla Institute of Technology",  icon: Library,    chip: "chip-primary" },
//   { href: "/university/aks-university",                    label: "AKS University",                 icon: School,     chip: "chip-primary" },
//   { href: "/university/era-university",                    label: "Era University",                 icon: Landmark,   chip: "chip-primary" },
//   { href: "/university/sanskriti-university",              label: "Sanskriti University",           icon: Building2,  chip: "chip-primary" },
// ];

// const WHY_CAREERVIDYA = [
//   { href: "/whycareervidya/careervidya-care",  label: "Continuous Career Guidance",     icon: Compass,   chip: "chip-primary" },
//   // { href: "/whycareervidya/placement-support", label: "Expert Placement Cell",           icon: Award,     chip: "chip-primary" }, 
//   { href: "/WP/Professional",                  label: "Balance your job and learning",   icon: Briefcase, chip: "chip-primary" },
//     { href: "/fake-universities-list",                  label: "Fake universities list",   icon: Briefcase, chip: "chip-primary" },
// ];

// // ─── MOBILE SIDEBAR SECTIONS ────────────────────────────────────────────────

// const MOBILE_SECTIONS = [
//   {
//     key: "courses",
//     label: "Explore Programs",
//     icon: GraduationCap,
//     items: POPULAR_COURSES,
//     viewAll: { href: "/explore", label: "View All Courses" },
//   },
//   {
//     key: "universities",
//     label: "Top Universities",
//     icon: Landmark,
//     items: TOP_UNIVERSITIES.slice(0, 8),
//     viewAll: { href: "/Top-Universities", label: "View All Universities" },
//   },
//   {
//     key: "more",
//     label: "Why Career Vidya?",
//     icon: BadgeCheck,
//     items: [
//       ...WHY_CAREERVIDYA,
//       { href: "/whycareervidya/career-finder", label: "Career Finder", badge: "NEW" },
//     ],
//   },
// ];

// // ─── SMALL REUSABLE PIECES ──────────────────────────────────────────────────

// function ColHeading({ children }) {
//   return (
//     <div className="mega-col-heading">
//       <span className="mega-col-heading-dash" />
//       <p className="mega-col-heading-text">{children}</p>
//     </div>
//   );
// }

// function MItem({ href, label, icon: Icon, chip }) {
//   return (
//     <Link href={href} className="mega-menu-item">
//       <span className={`mega-icon-chip ${chip}`}>
//         <Icon size={15} strokeWidth={2} />
//       </span>
//       {label}
//     </Link>
//   );
// }

// // ─── COMPONENT ──────────────────────────────────────────────────────────────

// export default function Header() {
//   const [menuOpen,     setMenuOpen]     = useState(false);
//   const [showSignup,   setShowSignup]   = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [openSection,  setOpenSection]  = useState(null); // only one accordion open at a time

//   // ✅ CHANGE 2: portal ke liye mounted state
//   const [mounted, setMounted] = useState(false);
//   useEffect(() => setMounted(true), []);

//   const pathname = usePathname();
//   const router   = useRouter();
//   const { user, logout } = useAuth();

//   const closeMenu = () => setMenuOpen(false);

//   const handleLogout = () => {
//     setDropdownOpen(false);
//     setMenuOpen(false);
//     logout({ redirectTo: "/" });
//   };

//   // Sidebar khulne par background scroll band
//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "";
//     return () => { document.body.style.overflow = ""; };
//   }, [menuOpen]);

//   // Page change hone par sidebar band
//   useEffect(() => {
//     setMenuOpen(false);
//     setOpenSection(null);
//   }, [pathname]);

//   const isActive = (href) => pathname === href;
//   const dashHref = user?.role === "admin" ? "/admin" : "/user";
//   const userInitial = (user?.name || "U").trim().charAt(0).toUpperCase();

//   return (
//     <>
//       <Subheader />

//       <header className="header-container">
//         <div className="header-inner">

//           {/* ── LOGO ── */}
//           <Link href="/" className="logo-wrapper">
//             <div className="logo-box">
//               <Image src="/images/n12.png" alt="CareerVidya Logo"
//                 width={110} height={40} className="logo-img" priority />
//               <Image src="/images/Lak.png" alt="Free Counselling"
//                 width={80} height={45} className="counselling-badge" priority />
//             </div>
//           </Link>

//           {/* ── DESKTOP NAV ── */}
//           <nav className="nav-center desktop-only">

//             {/* ══ FREE COUNSELLING ══ */}
//             <Link href="/our-Team" className="flex items-center gap-1">
// FREE EXPERT GUIDANCE
//             </Link>

//             {/* ══ EXPLORE PROGRAMS ══ */}
//             <div className="mega-menu-wrap">
//               <Link href="/explore" className="flex items-center gap-1">
//                 EXPLORE PROGRAMS <ChevronDown size={13} className="chevron-icon" />
//               </Link>

//               <div className="mega-panel">
//                 <div className="mega-panel-inner mega-panel-inner--2col">

//                   <div>
//                     <ColHeading>Popular Courses</ColHeading>
//                     {POPULAR_COURSES.slice(0, 5).map(item => <MItem key={item.href} {...item} />)}
//                   </div>

//                   <div>
//                     <ColHeading>More Courses</ColHeading>
//                     {POPULAR_COURSES.slice(5).map(item => <MItem key={item.href} {...item} />)}
//                   </div>

//                   <div className="mega-panel-footer">
//                     <Link href="/explore">View All Courses →</Link>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* ══ TOP UNIVERSITIES ══ */}
//             <div className="mega-menu-wrap">
//               <Link href="/Top-Universities" className="flex items-center gap-1">
//                 TOP UNIVERSITIES <ChevronDown size={13} className="chevron-icon" />
//               </Link>

//               <div className="mega-panel">
//                 <div className="mega-panel-inner">

//                   <div>
//                     <ColHeading>Top Ranked</ColHeading>
//                     {TOP_UNIVERSITIES.slice(0, 7).map(item => <MItem key={item.href} {...item} />)}
//                   </div>

//                   <div>
//                     <ColHeading>Most Popular</ColHeading>
//                     {TOP_UNIVERSITIES.slice(7, 14).map(item => <MItem key={item.href} {...item} />)}
//                   </div>

//                   <div>
//                     <ColHeading>More Universities</ColHeading>
//                     {TOP_UNIVERSITIES.slice(14).map(item => <MItem key={item.href} {...item} />)}
//                   </div>

//                   <div className="mega-panel-footer">
//                     <Link href="/Top-Universities">View All Universities →</Link>
//                   </div>

//                 </div>
//               </div>
//             </div>

//             {/* ══ MORE ══ */}
//             <div className="mega-menu-wrap">
//               <span className="flex items-center gap-1" style={{ cursor: "pointer" }}>
//                 MORE <ChevronDown size={13} className="chevron-icon" />
//               </span>

//               <div className="mega-panel">
//                 <div className="mega-panel-inner">

//                   <div>
//                     <ColHeading>Why Career Vidya?</ColHeading>
//                     {WHY_CAREERVIDYA.map(item => <MItem key={item.href} {...item} />)}
//                     <Link href="/whycareervidya/career-finder" className="mega-career-finder-btn">
//                       Career Finder
//                       <span className="mega-career-finder-badge">NEW</span>
//                     </Link>
//                   </div>

//                   <div>
//                     <ColHeading>Our Impact</ColHeading>
//                     <div className="mega-stats-grid">
//                       {[
//                         { Icon: GraduationCap, num: "15K+",    label: "Admissions"  },
//                         { Icon: Handshake,     num: "150+",    label: "Partners"    },
//                         { Icon: IndianRupee,   num: "37 LPA+", label: "Highest Pkg" },
//                         { Icon: Users,         num: "12K+",    label: "Alumni"      },
//                       ].map(({ Icon, num, label }) => (
//                         <div key={label} className="mega-stat-card">
//                           <div className="mega-stat-icon">
//                             <Icon size={18} />
//                           </div>
//                           <p className="mega-stat-num">{num}</p>
//                           <p className="mega-stat-label">{label}</p>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   <div>
//                     <ColHeading>Recognition</ColHeading>
//                     <div className="mega-award-card">
//                       <div className="mega-award-badge">AWARD 2025</div>
//                       <p className="mega-award-title">Winner: IBA 2025</p>
//                       <p className="mega-award-sub">Empowering Careers Globally</p>
//                     </div>
//                     <div className="mega-live-pill">
//                       <div className="mega-live-dot" />
//                       <span className="mega-live-text">Trusted by 12,000+ alumni</span>
//                     </div>
//                   </div>

//                 </div>
//               </div>
//             </div>

//           </nav>

//           {/* ── DESKTOP RIGHT ── */}
//           <div className="right-actions desktop-only">
//             <Link href="/search" className="search-link" aria-label="Search courses and universities">
//               <div className="main-search-bar">
//                 <input type="text" placeholder="Explore Courses"
//                   className="main-search-input" readOnly />
//                 <div className="search-icon-btn">
//                   <Search size={16} color="white" />
//                 </div>
//               </div>
//             </Link>

//             {user ? (
//               <div className="user-dropdown-container">
//                 <button className="user-dropdown-trigger"
//                   onClick={() => setDropdownOpen(!dropdownOpen)}>
//                   <User size={16} />
//                   Hi, {user?.name || "User"}
//                   <ChevronDown size={13}
//                     style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "0.3s" }} />
//                 </button>
//                 {dropdownOpen && (
//                   <div className="user-dropdown-menu">
//                     {user.role === "admin" ? (
//                       <Link href="/admin" onClick={() => setDropdownOpen(false)} className="dropdown-item">
//                         Admin Dashboard
//                       </Link>
//                     ) : (
//                       <Link href="/user" onClick={() => setDropdownOpen(false)} className="dropdown-item">
//                         My Dashboard
//                       </Link>
//                     )}
//                     <button onClick={handleLogout} className="logout-btn-dropdown">Logout</button>
//                   </div>
//                 )}
//               </div>
//             ) : (
//               <button onClick={() => setShowSignup(true)} className="btn1-primary">Login</button>
//             )}
//           </div>

//           {/* ── MOBILE ACTIONS ── */}
//           <div className="mobile-actions mobile-only">
//             {user ? (
//               <Link href={dashHref} className="mobile-user-name">
//                 Hi, {user?.name || "User"}
//               </Link>
//             ) : (
//               <button onClick={() => setShowSignup(true)} className="mobile-signup-btn">Login</button>
//             )}
//             <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
//               <Menu size={26} />
//             </button>
//           </div>

//         </div>

//         {/* ══════════════ MOBILE SIDEBAR ══════════════ */}
//         <div className={`mobile-sidebar-overlay ${menuOpen ? "active" : ""}`} onClick={closeMenu}>
//           <aside
//             className={`mobile-sidebar ${menuOpen ? "open" : ""}`}
//             onClick={(e) => e.stopPropagation()}
//             aria-hidden={!menuOpen}
//           >

//             {/* Top bar: logo + close */}
//             <div className="sidebar-header">
//               <Link href="/" onClick={closeMenu}>
//                 <Image src="/images/n12.png" alt="CareerVidya Logo"
//                   width={110} height={40} className="sidebar-logo" />
//               </Link>
//               <button onClick={closeMenu} className="sidebar-close" aria-label="Close menu">
//                 <X size={20} />
//               </button>
//             </div>

//             {/* Scrollable body */}
//             <div className="sidebar-body">

//               {/* User card (only if logged in) */}
//               {user && (
//                 <Link href={dashHref} className="sidebar-user-card" onClick={closeMenu}>
//                   <span className="sidebar-avatar">{userInitial}</span>
//                   <span className="sidebar-user-info">
//                     <strong>Hi, {user?.name || "User"}</strong>
//                     <small>{user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"} →</small>
//                   </span>
//                 </Link>
//               )}

//               {/* Main CTA */}
//               <Link href="/our-Team" className="sidebar-cta" onClick={closeMenu}>
//                 <span className="sidebar-cta-icon"><PhoneCall size={18} /></span>
//                 <span className="sidebar-cta-text">
//                   <strong> FREE EXPERT GUIDANCE </strong>
//                   <small>Talk to our career experts</small>
//                 </span>
//                 <ChevronRight size={18} />
//               </Link>

//               {/* Browse (accordions) */}
//               <p className="sidebar-label">Browse</p>

//               {MOBILE_SECTIONS.map(({ key, label, icon: Icon, items, viewAll }) => {
//                 const isOpen = openSection === key;
//                 return (
//                   <div key={key} className={`sidebar-accordion ${isOpen ? "is-open" : ""}`}>
//                     <button
//                       type="button"
//                       className="sidebar-accordion-trigger"
//                       onClick={() => setOpenSection(isOpen ? null : key)}
//                       aria-expanded={isOpen}
//                     >
//                       <span className="sidebar-accordion-icon"><Icon size={17} /></span>
//                       <span className="sidebar-accordion-label">{label}</span>
//                       <ChevronDown size={16} className="sidebar-accordion-chevron" />
//                     </button>

//                     {isOpen && (
//                       <div className="sidebar-sub">
//                         {items.map(({ href, label: itemLabel, badge }) => (
//                           <Link
//                             key={href}
//                             href={href}
//                             onClick={closeMenu}
//                             className={isActive(href) ? "active" : ""}
//                           >
//                             <span>{itemLabel}</span>
//                             {badge && <em className="sidebar-badge">{badge}</em>}
//                           </Link>
//                         ))}
//                         {viewAll && (
//                           <Link href={viewAll.href} onClick={closeMenu} className="sidebar-view-all">
//                             {viewAll.label} <ChevronRight size={14} />
//                           </Link>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 );
//               })}

//               {/* Quick links */}
//               <p className="sidebar-label">Quick Links</p>

//               <Link href="/search" onClick={closeMenu}
//                 className={`sidebar-link ${isActive("/search") ? "active" : ""}`}>
//                 <span className="sidebar-accordion-icon"><Search size={17} /></span>
//                 Search Courses
//               </Link>

//               <Link href="/career" onClick={closeMenu}
//                 className={`sidebar-link ${isActive("/career") ? "active" : ""}`}>
//                 <span className="sidebar-accordion-icon"><Briefcase size={17} /></span>
//                 Career
//               </Link>

//             </div>

//             {/* Fixed bottom action */}
//             <div className="sidebar-footer">
//               {user ? (
//                 <button onClick={handleLogout} className="mobile-logout-btn">
//                   <LogOut size={17} /> Logout
//                 </button>
//               ) : (
//                 <button
//                   onClick={() => { setShowSignup(true); setMenuOpen(false); }}
//                   className="mobile-sidebar-signup"
//                 >
//                   Login / Signup
//                 </button>
//               )}
//             </div>

//           </aside>
//         </div>

//       </header>

//       {/* ✅ CHANGE 3: Signup popup ab portal se document.body me render hoga */}
//       {showSignup && mounted &&
//         createPortal(
//           <Signup onClose={() => setShowSignup(false)} />,
//           document.body
//         )}
//     </>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // ✅ CHANGE 1: import
import Image from "next/image";
import Link from "next/link";
import {
  Menu, X, Search, User, ChevronDown, ChevronRight,
  PhoneCall, LogOut,
} from "lucide-react";
import {
  GraduationCap, Handshake, IndianRupee, Users,
  Compass, Award, Briefcase, BookOpen,
  School, Landmark, Building2, Globe2, BadgeCheck, Library,
  // ✅ NEW (MORE columns ke liye)
  FileText, Ticket, Scale, Phone, Clock,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import Signup from "../signup/page.jsx";
import Subheader from "@/app/components/Subheader.jsx";
import { useAuth } from "@/context/AuthContext.jsx";
import "./headr.css";

// ─── SHARED DATA ────────────────────────────────────────────────────────────

const POPULAR_COURSES = [
  { href: "/course/online-mba-1",                                 label: "Online MBA",          icon: GraduationCap, chip: "chip-primary" },
  { href: "/course/1-year-online-mba",                            label: "One Year Online MBA", icon: GraduationCap, chip: "chip-primary" },
  { href: "/course/online-mca",                                   label: "Online MCA",          icon: BookOpen,      chip: "chip-primary" },
  { href: "/course/bba-bachelor-of-business-administration",      label: "Online BBA",          icon: Briefcase,     chip: "chip-primary" },
  { href: "/course/online-bca-bachelor-of-computer-applications", label: "Online BCA",          icon: BookOpen,      chip: "chip-primary" },
  { href: "/course/online-ba-bachelors-of-arts",                  label: "Online BA",           icon: GraduationCap, chip: "chip-primary" },
  { href: "/course/online-ma-masters-of-arts",                    label: "Online MA",           icon: GraduationCap, chip: "chip-primary" },
  { href: "/course/online-bcom-bachelors-of-commerce",            label: "Online B.Com",        icon: Briefcase,     chip: "chip-primary" },
  { href: "/course/mcom-master-of-commerce",                      label: "M.Com",               icon: Briefcase,     chip: "chip-primary" },
  { href: "/course/btech-bachelors-of-technology",                label: "B.Tech",              icon: BookOpen,      chip: "chip-primary" },
];

const TOP_UNIVERSITIES = [
  { href: "/university/amity-university-online",           label: "Amity University",               icon: Landmark,   chip: "chip-primary" },
  { href: "/university/lovely-professional-university",    label: "LPU Online",                     icon: Building2,  chip: "chip-primary" },
  { href: "/university/manipal-university-jaipur",         label: "Manipal University",             icon: School,     chip: "chip-primary" },
  { href: "/university/chandigarh-university-online",      label: "Chandigarh University",          icon: Landmark,   chip: "chip-primary" },
  { href: "/university/srm-university",                    label: "SRM University",                 icon: Building2,  chip: "chip-primary" },
  { href: "/university/dy-patil-university-online-mumbai", label: "DY Patil University",            icon: School,     chip: "chip-primary" },
  { href: "/university/chitkara-university",               label: "Chitkara University",            icon: Landmark,   chip: "chip-primary" },
  { href: "/university/kurukshetra-university-online",     label: "Kurukshetra University",         icon: Building2,  chip: "chip-primary" },
  { href: "/university/sharda-university",                 label: "Sharda University",              icon: School,     chip: "chip-primary" },
  { href: "/university/noida-international-university",    label: "Noida International University", icon: Globe2,     chip: "chip-primary" },
  { href: "/university/gla-online",                        label: "GLA University Online",          icon: Landmark,   chip: "chip-primary" },
  { href: "/university/dr-a-p-j-abdul-kalam-university",   label: "Dr. APJ Abdul Kalam University", icon: BadgeCheck, chip: "chip-primary" },
  { href: "/university/sikkim-manipal-university",         label: "Sikkim Manipal (SMU)",           icon: School,     chip: "chip-primary" },
  { href: "/university/jaipur-national-university",        label: "Jaipur National University",     icon: Landmark,   chip: "chip-primary" },
  { href: "/university/jain-university",                   label: "Jain University",                icon: Building2,  chip: "chip-primary" },
  { href: "/university/birla-institute-of-technology",     label: "Birla Institute of Technology",  icon: Library,    chip: "chip-primary" },
  { href: "/university/aks-university",                    label: "AKS University",                 icon: School,     chip: "chip-primary" },
  { href: "/university/era-university",                    label: "Era University",                 icon: Landmark,   chip: "chip-primary" },
  { href: "/university/sanskriti-university",              label: "Sanskriti University",           icon: Building2,  chip: "chip-primary" },
];

const WHY_CAREERVIDYA = [
  { href: "/whycareervidya/careervidya-care",  label: "Continuous Career Guidance",     icon: Compass,   chip: "chip-primary" },
  // { href: "/whycareervidya/placement-support", label: "Expert Placement Cell",           icon: Award,     chip: "chip-primary" }, 
  { href: "/WP/Professional",                  label: "Balance your job and learning",   icon: Briefcase, chip: "chip-primary" },

];

// ✅ NEW: MORE → Resources column
const MORE_RESOURCES = [
  { href: "/coupons",              label: "Coupon",             icon: Ticket,    chip: "chip-primary" },
  { href: "/Top-Universities", label: "Compare University", icon: Scale,     chip: "chip-primary" },
  // { href: "/job-portal",           label: "Job Portal",         icon: Briefcase, chip: "chip-primary" },
  { href: "/explore",              label: "Explore Course",     icon: Compass,   chip: "chip-primary" },
      { href: "/fake-universities-list",                  label: "Fake universities list",   icon: Briefcase, chip: "chip-primary" },
];

// ─── MOBILE SIDEBAR SECTIONS ────────────────────────────────────────────────

const MOBILE_SECTIONS = [
  {
    key: "courses",
    label: "Explore Programs",
    icon: GraduationCap,
    items: POPULAR_COURSES,
    viewAll: { href: "/explore", label: "View All Courses" },
  },
  {
    key: "universities",
    label: "Top Universities",
    icon: Landmark,
    items: TOP_UNIVERSITIES.slice(0, 8),
    viewAll: { href: "/Top-Universities", label: "View All Universities" },
  },
  {
    key: "more",
    label: "Why Career Vidya?",
    icon: BadgeCheck,
    items: [
      ...WHY_CAREERVIDYA,
      { href: "/whycareervidya/career-finder", label: "Career Finder", badge: "NEW" },
    ],
  },
];

// ─── SMALL REUSABLE PIECES ──────────────────────────────────────────────────

function ColHeading({ children }) {
  return (
    <div className="mega-col-heading">
      <span className="mega-col-heading-dash" />
      <p className="mega-col-heading-text">{children}</p>
    </div>
  );
}

function MItem({ href, label, icon: Icon, chip }) {
  return (
    <Link href={href} className="mega-menu-item">
      <span className={`mega-icon-chip ${chip}`}>
        <Icon size={15} strokeWidth={2} />
      </span>
      {label}
    </Link>
  );
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function Header() {
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [showSignup,   setShowSignup]   = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [openSection,  setOpenSection]  = useState(null); // only one accordion open at a time

  // ✅ CHANGE 2: portal ke liye mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();

  const closeMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    setDropdownOpen(false);
    setMenuOpen(false);
    logout({ redirectTo: "/" });
  };

  // Sidebar khulne par background scroll band
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Page change hone par sidebar band
  useEffect(() => {
    setMenuOpen(false);
    setOpenSection(null);
  }, [pathname]);

  const isActive = (href) => pathname === href;
  const dashHref = user?.role === "admin" ? "/admin" : "/user";
  const userInitial = (user?.name || "U").trim().charAt(0).toUpperCase();

  return (
    <>
      <Subheader />

      <header className="header-container">
        <div className="header-inner">

          {/* ── LOGO ── */}
          <Link href="/" className="logo-wrapper">
            <div className="logo-box">
              <Image src="/images/n12.png" alt="CareerVidya Logo"
                width={110} height={40} className="logo-img" priority />
              <Image src="/images/Lak.png" alt="Free Counselling"
                width={80} height={45} className="counselling-badge" priority />
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="nav-center desktop-only">

            {/* ══ FREE COUNSELLING ══ */}
            <Link href="/our-Team" className="flex items-center gap-1">
FREE EXPERT GUIDANCE
            </Link>

            {/* ══ EXPLORE PROGRAMS ══ */}
            <div className="mega-menu-wrap">
              <Link href="/explore" className="flex items-center gap-1">
                EXPLORE PROGRAMS <ChevronDown size={13} className="chevron-icon" />
              </Link>

              <div className="mega-panel">
                <div className="mega-panel-inner mega-panel-inner--2col">

                  <div>
                    <ColHeading>Popular Courses</ColHeading>
                    {POPULAR_COURSES.slice(0, 5).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  <div>
                    <ColHeading>More Courses</ColHeading>
                    {POPULAR_COURSES.slice(5).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  <div className="mega-panel-footer">
                    <Link href="/explore">View All Courses →</Link>
                  </div>

                </div>
              </div>
            </div>

            {/* ══ TOP UNIVERSITIES ══ */}
            <div className="mega-menu-wrap">
              <Link href="/Top-Universities" className="flex items-center gap-1">
                TOP UNIVERSITIES <ChevronDown size={13} className="chevron-icon" />
              </Link>

              <div className="mega-panel">
                <div className="mega-panel-inner">

                  <div>
                    <ColHeading>Top Ranked</ColHeading>
                    {TOP_UNIVERSITIES.slice(0, 7).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  <div>
                    <ColHeading>Most Popular</ColHeading>
                    {TOP_UNIVERSITIES.slice(7, 14).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  <div>
                    <ColHeading>More Universities</ColHeading>
                    {TOP_UNIVERSITIES.slice(14).map(item => <MItem key={item.href} {...item} />)}
                  </div>

                  <div className="mega-panel-footer">
                    <Link href="/Top-Universities">View All Universities →</Link>
                  </div>

                </div>
              </div>
            </div>

            {/* ══ MORE ══ */}
            <div className="mega-menu-wrap mega-menu-wrap--more">
              <span className="flex items-center gap-1" style={{ cursor: "pointer" }}>
                MORE <ChevronDown size={13} className="chevron-icon" />
              </span>

              <div className="mega-panel">
                {/* ✅ NEW className: mega-panel-inner--more (sirf MORE ke liye) */}
                <div className="mega-panel-inner mega-panel-inner--more">

                  <div>
                    <ColHeading>Why Career Vidya?</ColHeading>
                    {WHY_CAREERVIDYA.map(item => <MItem key={item.href} {...item} />)}
                    <Link href="/whycareervidya/career-finder" className="mega-career-finder-btn">
                      Career Finder
                      <span className="mega-career-finder-badge">NEW</span>
                    </Link>
                  </div>

                   {/* ══ NEW: RESOURCES ══ */}
                  <div>
                    <ColHeading>Resources</ColHeading>
                    {MORE_RESOURCES.map(item => <MItem key={item.label} {...item} />)}
                  </div>

                  <div>
                    <ColHeading>Our Impact</ColHeading>
                    <div className="mega-stats-grid">
                      {[
                        { Icon: GraduationCap, num: "15K+",    label: "Admissions"  },
                        { Icon: Handshake,     num: "150+",    label: "Partners"    },
                        { Icon: IndianRupee,   num: "37 LPA+", label: "Highest Pkg" },
                        { Icon: Users,         num: "12K+",    label: "Alumni"      },
                      ].map(({ Icon, num, label }) => (
                        <div key={label} className="mega-stat-card">
                          <div className="mega-stat-icon">
                            <Icon size={18} />
                          </div>
                          <p className="mega-stat-num">{num}</p>
                          <p className="mega-stat-label">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>

 
                  <div>
                    <ColHeading>Recognition</ColHeading>
                    <div className="mega-award-card">
                      <div className="mega-award-badge">AWARD 2025</div>
                      <p className="mega-award-title">Winner: IBA 2025</p>
                      <p className="mega-award-sub">Empowering Careers Globally</p>
                    </div>
                    <div className="mega-live-pill">
                      <div className="mega-live-dot" />
                      <span className="mega-live-text">Trusted by 12,000+ alumni</span>
                    </div>
                  </div>

                

                  {/* ══ NEW: FIND US ══ */}
                  <div>
                    <ColHeading>Find Us</ColHeading>

                    <a href="tel:+910000000000" className="mega-menu-item">
                      <span className="mega-icon-chip chip-primary"><Phone size={15} strokeWidth={2} /></span>
                      New Student: +91 00000 00000
                    </a>

                    <a href="tel:+910000000001" className="mega-menu-item">
                      <span className="mega-icon-chip chip-primary"><Phone size={15} strokeWidth={2} /></span>
                      Existing Student: +91 00000 00001
                    </a>

                    <div className="mega-menu-item">
                      <span className="mega-icon-chip chip-primary"><Clock size={15} strokeWidth={2} /></span>
                      Visit Us: 10 AM – 7 PM
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </nav>

          {/* ── DESKTOP RIGHT ── */}
          <div className="right-actions desktop-only">
            <Link href="/search" className="search-link" aria-label="Search courses and universities">
              <div className="main-search-bar">
                <input type="text" placeholder="Explore Courses"
                  className="main-search-input" readOnly />
                <div className="search-icon-btn">
                  <Search size={16} color="white" />
                </div>
              </div>
            </Link>

            {user ? (
              <div className="user-dropdown-container">
                <button className="user-dropdown-trigger"
                  onClick={() => setDropdownOpen(!dropdownOpen)}>
                  <User size={16} />
                  Hi, {user?.name || "User"}
                  <ChevronDown size={13}
                    style={{ transform: dropdownOpen ? "rotate(180deg)" : "none", transition: "0.3s" }} />
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
                    <button onClick={handleLogout} className="logout-btn-dropdown">Logout</button>
                  </div>
                )}
              </div>
            ) : (
              <button onClick={() => setShowSignup(true)} className="btn1-primary">Login</button>
            )}
          </div>

          {/* ── MOBILE ACTIONS ── */}
          <div className="mobile-actions mobile-only">
            {user ? (
              <Link href={dashHref} className="mobile-user-name">
                Hi, {user?.name || "User"}
              </Link>
            ) : (
              <button onClick={() => setShowSignup(true)} className="mobile-signup-btn">Login</button>
            )}
            <button className="menu-toggle-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={26} />
            </button>
          </div>

        </div>

        {/* ══════════════ MOBILE SIDEBAR ══════════════ */}
        <div className={`mobile-sidebar-overlay ${menuOpen ? "active" : ""}`} onClick={closeMenu}>
          <aside
            className={`mobile-sidebar ${menuOpen ? "open" : ""}`}
            onClick={(e) => e.stopPropagation()}
            aria-hidden={!menuOpen}
          >

            {/* Top bar: logo + close */}
            <div className="sidebar-header">
              <Link href="/" onClick={closeMenu}>
                <Image src="/images/n12.png" alt="CareerVidya Logo"
                  width={110} height={40} className="sidebar-logo" />
              </Link>
              <button onClick={closeMenu} className="sidebar-close" aria-label="Close menu">
                <X size={20} />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="sidebar-body">

              {/* User card (only if logged in) */}
              {user && (
                <Link href={dashHref} className="sidebar-user-card" onClick={closeMenu}>
                  <span className="sidebar-avatar">{userInitial}</span>
                  <span className="sidebar-user-info">
                    <strong>Hi, {user?.name || "User"}</strong>
                    <small>{user?.role === "admin" ? "Admin Dashboard" : "My Dashboard"} →</small>
                  </span>
                </Link>
              )}

              {/* Main CTA */}
              <Link href="/our-Team" className="sidebar-cta" onClick={closeMenu}>
                <span className="sidebar-cta-icon"><PhoneCall size={18} /></span>
                <span className="sidebar-cta-text">
                  <strong> FREE EXPERT GUIDANCE </strong>
                  <small>Talk to our career experts</small>
                </span>
                <ChevronRight size={18} />
              </Link>

              {/* Browse (accordions) */}
              <p className="sidebar-label">Browse</p>

              {MOBILE_SECTIONS.map(({ key, label, icon: Icon, items, viewAll }) => {
                const isOpen = openSection === key;
                return (
                  <div key={key} className={`sidebar-accordion ${isOpen ? "is-open" : ""}`}>
                    <button
                      type="button"
                      className="sidebar-accordion-trigger"
                      onClick={() => setOpenSection(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <span className="sidebar-accordion-icon"><Icon size={17} /></span>
                      <span className="sidebar-accordion-label">{label}</span>
                      <ChevronDown size={16} className="sidebar-accordion-chevron" />
                    </button>

                    {isOpen && (
                      <div className="sidebar-sub">
                        {items.map(({ href, label: itemLabel, badge }) => (
                          <Link
                            key={href}
                            href={href}
                            onClick={closeMenu}
                            className={isActive(href) ? "active" : ""}
                          >
                            <span>{itemLabel}</span>
                            {badge && <em className="sidebar-badge">{badge}</em>}
                          </Link>
                        ))}
                        {viewAll && (
                          <Link href={viewAll.href} onClick={closeMenu} className="sidebar-view-all">
                            {viewAll.label} <ChevronRight size={14} />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Quick links */}
              <p className="sidebar-label">Quick Links</p>

              <Link href="/search" onClick={closeMenu}
                className={`sidebar-link ${isActive("/search") ? "active" : ""}`}>
                <span className="sidebar-accordion-icon"><Search size={17} /></span>
                Search Courses
              </Link>

              <Link href="/career" onClick={closeMenu}
                className={`sidebar-link ${isActive("/career") ? "active" : ""}`}>
                <span className="sidebar-accordion-icon"><Briefcase size={17} /></span>
                Career
              </Link>

            </div>

            {/* Fixed bottom action */}
            <div className="sidebar-footer">
              {user ? (
                <button onClick={handleLogout} className="mobile-logout-btn">
                  <LogOut size={17} /> Logout
                </button>
              ) : (
                <button
                  onClick={() => { setShowSignup(true); setMenuOpen(false); }}
                  className="mobile-sidebar-signup"
                >
                  Login / Signup
                </button>
              )}
            </div>

          </aside>
        </div>

      </header>

      {/* ✅ CHANGE 3: Signup popup ab portal se document.body me render hoga */}
      {showSignup && mounted &&
        createPortal(
          <Signup onClose={() => setShowSignup(false)} />,
          document.body
        )}
    </>
  );
}