
// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowRight,
//   ChevronDown,
//   Menu,
//   X,
//   GraduationCap,
//   BookOpen,
//   Briefcase,
//   Building2,
//   Landmark,
//   School,
//   Globe2,
//   BadgeCheck,
//   Library,
// } from "lucide-react";

// const POPULAR_COURSES = [
//   { href: "/course/online-mba-1", label: "Online MBA", icon: GraduationCap, chip: "chip-blue" },
//   { href: "/course/1-year-online-mba", label: "One Year Online MBA", icon: GraduationCap, chip: "chip-emerald" },
//   { href: "/course/online-mca", label: "Online MCA", icon: BookOpen, chip: "chip-emerald" },
//   { href: "/course/bba-bachelor-of-business-administration", label: "Online BBA", icon: Briefcase, chip: "chip-amber" },
//   { href: "/course/online-bca-bachelor-of-computer-applications", label: "Online BCA", icon: BookOpen, chip: "chip-indigo" },
//   { href: "/course/online-ba-bachelors-of-arts", label: "Online BA", icon: GraduationCap, chip: "chip-rose" },
//   { href: "/course/online-ma-masters-of-arts", label: "Online MA", icon: GraduationCap, chip: "chip-purple" },
//   { href: "/course/online-bcom-bachelors-of-commerce", label: "Online B.Com", icon: Briefcase, chip: "chip-orange" },
//   { href: "/course/mcom-master-of-commerce", label: "M.Com", icon: Briefcase, chip: "chip-blue" },
//   { href: "/course/btech-bachelors-of-technology", label: "B.Tech", icon: BookOpen, chip: "chip-amber" },
// ];

// const TOP_UNIVERSITIES = [
//   { href: "/university/amity-university-online", label: "Amity University", icon: Landmark, chip: "chip-blue" },
//   { href: "/university/lovely-professional-university", label: "LPU Online", icon: Building2, chip: "chip-emerald" },
//   { href: "/university/manipal-university-jaipur", label: "Manipal University", icon: School, chip: "chip-amber" },
//   { href: "/university/chandigarh-university-online", label: "Chandigarh University", icon: Landmark, chip: "chip-indigo" },
//   { href: "/university/srm-university", label: "SRM University", icon: Building2, chip: "chip-rose" },
//   { href: "/university/dy-patil-university-online-mumbai", label: "DY Patil University", icon: School, chip: "chip-purple" },
//   { href: "/university/chitkara-university", label: "Chitkara University", icon: Landmark, chip: "chip-orange" },
//   { href: "/university/kurukshetra-university-online", label: "Kurukshetra University", icon: Building2, chip: "chip-blue" },
//   { href: "/university/sharda-university", label: "Sharda University", icon: School, chip: "chip-emerald" },
//   { href: "/university/noida-international-university", label: "Noida International University", icon: Globe2, chip: "chip-amber" },
//   { href: "/university/gla-online", label: "GLA University Online", icon: Landmark, chip: "chip-indigo" },
//   { href: "/university/dr-a-p-j-abdul-kalam-university", label: "Dr. APJ Abdul Kalam University", icon: BadgeCheck, chip: "chip-rose" },
//   { href: "/university/sikkim-manipal-university", label: "Sikkim Manipal (SMU)", icon: School, chip: "chip-purple" },
//   { href: "/university/jaipur-national-university", label: "Jaipur National University", icon: Landmark, chip: "chip-orange" },
//   { href: "/university/jain-university", label: "Jain University", icon: Building2, chip: "chip-blue" },
//   { href: "/university/birla-institute-of-technology", label: "Birla Institute of Technology", icon: Library, chip: "chip-emerald" },
//   { href: "/university/aks-university", label: "AKS University", icon: School, chip: "chip-amber" },
//   { href: "/university/era-university", label: "Era University", icon: Landmark, chip: "chip-indigo" },
//   { href: "/university/sanskriti-university", label: "Sanskriti University", icon: Building2, chip: "chip-rose" },
// ];

// const NAV_LINKS = ["Counselling", "Scholarships"];

// export default function LandingHeader({ logoSrc = "/images/n12.png", contactHref = "/contact" }) {
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [navDropdown, setNavDropdown] = useState(null); // 'courses' | 'universities' | null
//   const [mobileAccordion, setMobileAccordion] = useState(null); // 'courses' | 'universities' | null
//   const closeTimer = useRef(null);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   const openDropdown = (key) => {
//     if (closeTimer.current) clearTimeout(closeTimer.current);
//     setNavDropdown(key);
//   };
//   const scheduleClose = () => {
//     if (closeTimer.current) clearTimeout(closeTimer.current);
//     closeTimer.current = setTimeout(() => setNavDropdown(null), 150);
//   };

//   return (
//     <div className={`cv-header-wrap ${scrolled ? "is-scrolled" : ""}`}>
//       <style>{`
//         .cv-header-wrap .cv-container { max-width: 1440px; padding: 0 16px; }
//         @media (min-width: 640px) { .cv-header-wrap .cv-container { padding: 0 24px; } }

//         .cv-header-wrap {
//           position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92);
//           backdrop-filter: blur(10px); transition: box-shadow 0.25s ease;
//         }
//         .cv-header-wrap.is-scrolled { box-shadow: 0 4px 24px -8px rgba(0,0,0,0.5); }
//         .cv-header {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 16px 0; border-bottom: 1px solid var(--line);
//         }
//         @media (min-width: 640px) { .cv-header { padding: 10px 0; } }
//         .cv-logo { display: flex; align-items: center; gap: 10px; }
//         .cv-logo-mark {
//           width: 34px; height: 34px; border-radius: 50%; overflow: hidden;
//           border: 1.5px solid var(--gold); background: #fff;
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         @media (min-width: 640px) { .cv-logo-mark { width: 76px; height: 76px; } }
//         .cv-logo-mark img { width: 100%; height: 100%; object-fit: cover; display: block; }
//         .cv-logo-text { line-height: 1.1; }
//         .cv-logo-word { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: var(--ink); }
//         @media (min-width: 640px) { .cv-logo-word { font-size: 19px; } }
//         .cv-logo-word span { color: var(--gold); font-style: italic; }
//         .cv-logo-tag { display: none; font-size: 9px; letter-spacing: 0.8px; color: var(--muted); text-transform: uppercase; }
//         @media (min-width: 640px) { .cv-logo-tag { display: block; } }

//         .cv-nav { display: none; align-items: center; gap: 30px; font-size: 14.5px; font-weight: 500; color: var(--ink); }
//         .cv-nav a:hover { color: var(--gold); }
//         .cv-nav-more { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
//         @media (min-width: 900px) { .cv-nav { display: flex; } }

//         .cv-nav-item { position: relative; }
//         .cv-nav-trigger {
//           display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
//           background: none; border: none; font: inherit; color: inherit; padding: 4px 0;
//         }
//         .cv-nav-trigger:hover { color: var(--gold); }
//         .cv-nav-trigger .cv-chevron { transition: transform 0.2s ease; }
//         .cv-nav-item.is-open .cv-chevron { transform: rotate(180deg); }

//         .cv-nav-panel {
//           position: absolute; top: calc(100% + 14px); left: 50%; transform: translateX(-50%);
//           width: 460px; max-width: 92vw;
//           background: #fff; border: 1px solid var(--line); border-radius: 14px;
//           box-shadow: 0 20px 45px -20px rgba(13,27,46,0.35);
//           padding: 14px; z-index: 60;
//           opacity: 0; visibility: hidden; translate: 0 6px;
//           transition: opacity 0.18s ease, translate 0.18s ease, visibility 0.18s ease;
//         }
//         .cv-nav-item.is-open .cv-nav-panel { opacity: 1; visibility: visible; translate: 0 0; }
//         .cv-nav-panel-grid {
//           display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px;
//           max-height: 320px; overflow-y: auto;
//         }
//         .cv-nav-panel-link {
//           display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px;
//           font-size: 13px; font-weight: 500; color: var(--ink); white-space: nowrap;
//           overflow: hidden; text-overflow: ellipsis;
//         }
//         .cv-nav-panel-link:hover { background: var(--teal-tint); color: var(--teal-deep); }
//         .cv-nav-panel-icon {
//           width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
//           display: flex; align-items: center; justify-content: center;
//         }
//         .chip-blue { background: #e6eef6; color: #2f5c8a; }
//         .chip-emerald { background: #e3f4f1; color: #0d9488; }
//         .chip-amber { background: #fef3e2; color: #c15304; }
//         .chip-indigo { background: #eceafd; color: #6366f1; }
//         .chip-rose { background: #fde8ee; color: #e11d6f; }
//         .chip-purple { background: #efe9fd; color: #8b5cf6; }
//         .chip-orange { background: #fbeadf; color: #e8935a; }
//         .cv-nav-panel-footer {
//           border-top: 1px solid var(--line); margin-top: 10px; padding-top: 10px;
//         }
//         .cv-nav-panel-footer a {
//           display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--teal-deep);
//         }

//         .cv-menu-btn {
//           display: flex; align-items: center; justify-content: center;
//           width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--line);
//           background: var(--panel); color: var(--ink); cursor: pointer; flex-shrink: 0;
//         }
//         @media (min-width: 900px) { .cv-menu-btn { display: none; } }

//         .cv-mobile-drawer {
//           max-height: 0; overflow: hidden; transition: max-height 0.35s ease;
//           border-bottom: 1px solid transparent;
//         }
//         .cv-mobile-drawer.is-open { max-height: 720px; border-bottom: 1px solid var(--line); overflow-y: auto; }
//         @media (min-width: 900px) { .cv-mobile-drawer { display: none; } }
//         .cv-mobile-drawer-inner { padding: 8px 0 20px; display: flex; flex-direction: column; gap: 4px; }
//         .cv-mobile-drawer-inner > a {
//           padding: 12px 4px; font-size: 15px; font-weight: 500; color: var(--ink);
//           border-bottom: 1px solid var(--line);
//         }
//         .cv-mobile-accordion { border-bottom: 1px solid var(--line); }
//         .cv-mobile-accordion-head {
//           display: flex; align-items: center; justify-content: space-between; width: 100%;
//           padding: 12px 4px; font-size: 15px; font-weight: 500; color: var(--ink);
//           background: none; border: none; font-family: inherit; cursor: pointer;
//         }
//         .cv-mobile-accordion-head .cv-chevron { transition: transform 0.2s ease; }
//         .cv-mobile-accordion.is-open .cv-chevron { transform: rotate(180deg); }
//         .cv-mobile-accordion-panel {
//           max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
//         }
//         .cv-mobile-accordion.is-open .cv-mobile-accordion-panel { max-height: 600px; }
//         .cv-mobile-accordion-list { display: flex; flex-direction: column; padding: 2px 4px 12px; }
//         .cv-mobile-accordion-list a {
//           display: flex; align-items: center; gap: 10px; padding: 9px 6px; font-size: 13.5px;
//           color: var(--muted); border-radius: 8px;
//         }
//         .cv-mobile-accordion-list a:hover { color: var(--teal-deep); background: var(--teal-tint); }

//         .cv-mobile-drawer-actions { display: flex; gap: 10px; margin-top: 14px; }
//         .cv-mobile-drawer-actions button { flex: 1; }

//         .cv-header-actions { display: none; align-items: center; gap: 12px; }
//         @media (min-width: 900px) { .cv-header-actions { display: flex; } }
//         .cv-btn-ghost {
//           font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 8px;
//           border: 1px solid var(--line); background: #fff; color: var(--ink); cursor: pointer;
//         }
//         .cv-btn-solid {
//           font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 8px;
//           border: none; background: var(--gold); color: #2a1804; cursor: pointer;
//         }
//       `}</style>

//       <div className="cv-container">
//         <header className="cv-header">
//           <div className="cv-logo">
//             <div className="cv-logo-mark"><img src={logoSrc} alt="CareerVidya logo" /></div>
//             <div className="cv-logo-text">
//               <div className="cv-logo-word">VidyaHaiToSuccessHai<span></span></div>
//             </div>
//           </div>
//           <nav className="cv-nav">
//             {/* Courses dropdown */}
//             <div
//               className={`cv-nav-item ${navDropdown === "courses" ? "is-open" : ""}`}
//               onMouseEnter={() => openDropdown("courses")}
//               onMouseLeave={scheduleClose}
//             >
//               <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "courses" ? null : "courses")}>
//                 Courses <ChevronDown size={14} className="cv-chevron" />
//               </button>
//               <div className="cv-nav-panel">
//                 <div className="cv-nav-panel-grid">
//                   {POPULAR_COURSES.map((c) => (
//                     <a href={c.href} key={c.href} className="cv-nav-panel-link">
//                       <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={14} /></span>
//                       {c.label}
//                     </a>
//                   ))}
//                 </div>
//                 <div className="cv-nav-panel-footer">
//                   <a href="/courses">View all courses <ArrowRight size={13} /></a>
//                 </div>
//               </div>
//             </div>

//             {/* Universities dropdown */}
//             <div
//               className={`cv-nav-item ${navDropdown === "universities" ? "is-open" : ""}`}
//               onMouseEnter={() => openDropdown("universities")}
//               onMouseLeave={scheduleClose}
//             >
//               <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "universities" ? null : "universities")}>
//                 Universities <ChevronDown size={14} className="cv-chevron" />
//               </button>
//               <div className="cv-nav-panel">
//                 <div className="cv-nav-panel-grid">
//                   {TOP_UNIVERSITIES.map((u) => (
//                     <a href={u.href} key={u.href} className="cv-nav-panel-link">
//                       <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={14} /></span>
//                       {u.label}
//                     </a>
//                   ))}
//                 </div>
//                 <div className="cv-nav-panel-footer">
//                   <a href="/universities">View all universities <ArrowRight size={13} /></a>
//                 </div>
//               </div>
//             </div>

//             {NAV_LINKS.map((link) => (
//               <a key={link} href="#">{link}</a>
//             ))}
//             <span className="cv-nav-more">Resources <ChevronDown size={14} /></span>
//           </nav>
//           <div className="cv-header-actions">
//             <button className="cv-btn-solid" onClick={() => (window.location.href = contactHref)}>Contact us</button>
//           </div>
//           <button
//             className="cv-menu-btn"
//             aria-label={menuOpen ? "Close menu" : "Open menu"}
//             onClick={() => setMenuOpen((v) => !v)}
//           >
//             {menuOpen ? <X size={19} /> : <Menu size={19} />}
//           </button>
//         </header>
//         <div className={`cv-mobile-drawer ${menuOpen ? "is-open" : ""}`}>
//           <div className="cv-mobile-drawer-inner">
//             {/* Courses accordion */}
//             <div className={`cv-mobile-accordion ${mobileAccordion === "courses" ? "is-open" : ""}`}>
//               <button
//                 className="cv-mobile-accordion-head"
//                 onClick={() => setMobileAccordion(mobileAccordion === "courses" ? null : "courses")}
//               >
//                 Courses <ChevronDown size={16} className="cv-chevron" />
//               </button>
//               <div className="cv-mobile-accordion-panel">
//                 <div className="cv-mobile-accordion-list">
//                   {POPULAR_COURSES.map((c) => (
//                     <a href={c.href} key={c.href} onClick={() => setMenuOpen(false)}>
//                       <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={13} /></span>
//                       {c.label}
//                     </a>
//                   ))}
//                   <a href="/courses" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
//                     View all courses <ArrowRight size={13} />
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {/* Universities accordion */}
//             <div className={`cv-mobile-accordion ${mobileAccordion === "universities" ? "is-open" : ""}`}>
//               <button
//                 className="cv-mobile-accordion-head"
//                 onClick={() => setMobileAccordion(mobileAccordion === "universities" ? null : "universities")}
//               >
//                 Universities <ChevronDown size={16} className="cv-chevron" />
//               </button>
//               <div className="cv-mobile-accordion-panel">
//                 <div className="cv-mobile-accordion-list">
//                   {TOP_UNIVERSITIES.map((u) => (
//                     <a href={u.href} key={u.href} onClick={() => setMenuOpen(false)}>
//                       <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={13} /></span>
//                       {u.label}
//                     </a>
//                   ))}
//                   <a href="/universities" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
//                     View all universities <ArrowRight size={13} />
//                   </a>
//                 </div>
//               </div>
//             </div>

//             {NAV_LINKS.map((link) => (
//               <a key={link} href="#" onClick={() => setMenuOpen(false)}>{link}</a>
//             ))}
//             <a href="#" onClick={() => setMenuOpen(false)}>Resources</a>
//             <div className="cv-mobile-drawer-actions">
//               <button className="cv-btn-solid" onClick={() => (window.location.href = contactHref)}>Contact us</button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Briefcase,
  Building2,
  Landmark,
  School,
  Globe2,
  BadgeCheck,
  Library,
  Facebook,
  Instagram,
  Linkedin,
  Youtube,
  Send,
} from "lucide-react";

const POPULAR_COURSES = [
  { href: "/course/online-mba-1", label: "Online MBA", icon: GraduationCap, chip: "chip-blue" },
  { href: "/course/1-year-online-mba", label: "One Year Online MBA", icon: GraduationCap, chip: "chip-emerald" },
  { href: "/course/online-mca", label: "Online MCA", icon: BookOpen, chip: "chip-emerald" },
  { href: "/course/bba-bachelor-of-business-administration", label: "Online BBA", icon: Briefcase, chip: "chip-amber" },
  { href: "/course/online-bca-bachelor-of-computer-applications", label: "Online BCA", icon: BookOpen, chip: "chip-indigo" },
  { href: "/course/online-ba-bachelors-of-arts", label: "Online BA", icon: GraduationCap, chip: "chip-rose" },
  { href: "/course/online-ma-masters-of-arts", label: "Online MA", icon: GraduationCap, chip: "chip-purple" },
  { href: "/course/online-bcom-bachelors-of-commerce", label: "Online B.Com", icon: Briefcase, chip: "chip-orange" },
  { href: "/course/mcom-master-of-commerce", label: "M.Com", icon: Briefcase, chip: "chip-blue" },
  { href: "/course/btech-bachelors-of-technology", label: "B.Tech", icon: BookOpen, chip: "chip-amber" },
];

const TOP_UNIVERSITIES = [
  { href: "/university/amity-university-online", label: "Amity University", icon: Landmark, chip: "chip-blue" },
  { href: "/university/lovely-professional-university", label: "LPU Online", icon: Building2, chip: "chip-emerald" },
  { href: "/university/manipal-university-jaipur", label: "Manipal University", icon: School, chip: "chip-amber" },
  { href: "/university/chandigarh-university-online", label: "Chandigarh University", icon: Landmark, chip: "chip-indigo" },
  { href: "/university/srm-university", label: "SRM University", icon: Building2, chip: "chip-rose" },
  { href: "/university/dy-patil-university-online-mumbai", label: "DY Patil University", icon: School, chip: "chip-purple" },
  { href: "/university/chitkara-university", label: "Chitkara University", icon: Landmark, chip: "chip-orange" },
  { href: "/university/kurukshetra-university-online", label: "Kurukshetra University", icon: Building2, chip: "chip-blue" },
  { href: "/university/sharda-university", label: "Sharda University", icon: School, chip: "chip-emerald" },
  { href: "/university/noida-international-university", label: "Noida International University", icon: Globe2, chip: "chip-amber" },
  { href: "/university/gla-online", label: "GLA University Online", icon: Landmark, chip: "chip-indigo" },
  { href: "/university/dr-a-p-j-abdul-kalam-university", label: "Dr. APJ Abdul Kalam University", icon: BadgeCheck, chip: "chip-rose" },
  { href: "/university/sikkim-manipal-university", label: "Sikkim Manipal (SMU)", icon: School, chip: "chip-purple" },
  { href: "/university/jaipur-national-university", label: "Jaipur National University", icon: Landmark, chip: "chip-orange" },
  { href: "/university/jain-university", label: "Jain University", icon: Building2, chip: "chip-blue" },
  { href: "/university/birla-institute-of-technology", label: "Birla Institute of Technology", icon: Library, chip: "chip-emerald" },
  { href: "/university/aks-university", label: "AKS University", icon: School, chip: "chip-amber" },
  { href: "/university/era-university", label: "Era University", icon: Landmark, chip: "chip-indigo" },
  { href: "/university/sanskriti-university", label: "Sanskriti University", icon: Building2, chip: "chip-rose" },
];

const NAV_LINKS = ["Counselling", "Scholarships"];

export function Header({ logoSrc = "/images/n12.png", contactHref = "/contact" }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [navDropdown, setNavDropdown] = useState(null); // 'courses' | 'universities' | null
  const [mobileAccordion, setMobileAccordion] = useState(null); // 'courses' | 'universities' | null
  const closeTimer = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const openDropdown = (key) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setNavDropdown(key);
  };
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setNavDropdown(null), 150);
  };

  return (
    <div className={`cv-header-wrap ${scrolled ? "is-scrolled" : ""}`}>
      <style>{`
        .cv-header-wrap .cv-container { max-width: 1440px; padding: 0 16px; }
        @media (min-width: 640px) { .cv-header-wrap .cv-container { padding: 0 24px; } }

        .cv-header-wrap {
          position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92);
          backdrop-filter: blur(10px); transition: box-shadow 0.25s ease;
        }
        .cv-header-wrap.is-scrolled { box-shadow: 0 4px 24px -8px rgba(0,0,0,0.5); }
        .cv-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 16px 0; border-bottom: 1px solid var(--line);
        }
        @media (min-width: 640px) { .cv-header { padding: 10px 0; } }
        .cv-logo { display: flex; align-items: center; gap: 10px; }
        .cv-logo-mark {
          width: 34px; height: 34px; border-radius: 50%; overflow: hidden;
          border: 1.5px solid var(--gold); background: #fff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        @media (min-width: 640px) { .cv-logo-mark { width: 76px; height: 76px; } }
        .cv-logo-mark img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cv-logo-text { line-height: 1.1; }
        .cv-logo-word { font-family: 'Fraunces', serif; font-size: 17px; font-weight: 600; color: var(--ink); }
        @media (min-width: 640px) { .cv-logo-word { font-size: 19px; } }
        .cv-logo-word span { color: var(--gold); font-style: italic; }
        .cv-logo-tag { display: none; font-size: 9px; letter-spacing: 0.8px; color: var(--muted); text-transform: uppercase; }
        @media (min-width: 640px) { .cv-logo-tag { display: block; } }

        .cv-nav { display: none; align-items: center; gap: 30px; font-size: 14.5px; font-weight: 500; color: var(--ink); }
        .cv-nav a:hover { color: var(--gold); }
        .cv-nav-more { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
        @media (min-width: 900px) { .cv-nav { display: flex; } }

        .cv-nav-item { position: relative; }
        .cv-nav-trigger {
          display: inline-flex; align-items: center; gap: 4px; cursor: pointer;
          background: none; border: none; font: inherit; color: inherit; padding: 4px 0;
        }
        .cv-nav-trigger:hover { color: var(--gold); }
        .cv-nav-trigger .cv-chevron { transition: transform 0.2s ease; }
        .cv-nav-item.is-open .cv-chevron { transform: rotate(180deg); }

        .cv-nav-panel {
          position: absolute; top: calc(100% + 14px); left: 50%; transform: translateX(-50%);
          width: 460px; max-width: 92vw;
          background: #fff; border: 1px solid var(--line); border-radius: 14px;
          box-shadow: 0 20px 45px -20px rgba(13,27,46,0.35);
          padding: 14px; z-index: 60;
          opacity: 0; visibility: hidden; translate: 0 6px;
          transition: opacity 0.18s ease, translate 0.18s ease, visibility 0.18s ease;
        }
        .cv-nav-item.is-open .cv-nav-panel { opacity: 1; visibility: visible; translate: 0 0; }
        .cv-nav-panel-grid {
          display: grid; grid-template-columns: repeat(2, 1fr); gap: 4px;
          max-height: 320px; overflow-y: auto;
        }
        .cv-nav-panel-link {
          display: flex; align-items: center; gap: 10px; padding: 8px 10px; border-radius: 10px;
          font-size: 13px; font-weight: 500; color: var(--ink); white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .cv-nav-panel-link:hover { background: var(--teal-tint); color: var(--teal-deep); }
        .cv-nav-panel-icon {
          width: 26px; height: 26px; border-radius: 8px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
        }
        .chip-blue { background: #e6eef6; color: #2f5c8a; }
        .chip-emerald { background: #e3f4f1; color: #0d9488; }
        .chip-amber { background: #fef3e2; color: #c15304; }
        .chip-indigo { background: #eceafd; color: #6366f1; }
        .chip-rose { background: #fde8ee; color: #e11d6f; }
        .chip-purple { background: #efe9fd; color: #8b5cf6; }
        .chip-orange { background: #fbeadf; color: #e8935a; }
        .cv-nav-panel-footer {
          border-top: 1px solid var(--line); margin-top: 10px; padding-top: 10px;
        }
        .cv-nav-panel-footer a {
          display: inline-flex; align-items: center; gap: 6px; font-size: 13px; font-weight: 600; color: var(--teal-deep);
        }

        .cv-menu-btn {
          display: flex; align-items: center; justify-content: center;
          width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--line);
          background: var(--panel); color: var(--ink); cursor: pointer; flex-shrink: 0;
        }
        @media (min-width: 900px) { .cv-menu-btn { display: none; } }

        .cv-mobile-drawer {
          max-height: 0; overflow: hidden; transition: max-height 0.35s ease;
          border-bottom: 1px solid transparent;
        }
        .cv-mobile-drawer.is-open { max-height: 720px; border-bottom: 1px solid var(--line); overflow-y: auto; }
        @media (min-width: 900px) { .cv-mobile-drawer { display: none; } }
        .cv-mobile-drawer-inner { padding: 8px 0 20px; display: flex; flex-direction: column; gap: 4px; }
        .cv-mobile-drawer-inner > a {
          padding: 12px 4px; font-size: 15px; font-weight: 500; color: var(--ink);
          border-bottom: 1px solid var(--line);
        }
        .cv-mobile-accordion { border-bottom: 1px solid var(--line); }
        .cv-mobile-accordion-head {
          display: flex; align-items: center; justify-content: space-between; width: 100%;
          padding: 12px 4px; font-size: 15px; font-weight: 500; color: var(--ink);
          background: none; border: none; font-family: inherit; cursor: pointer;
        }
        .cv-mobile-accordion-head .cv-chevron { transition: transform 0.2s ease; }
        .cv-mobile-accordion.is-open .cv-chevron { transform: rotate(180deg); }
        .cv-mobile-accordion-panel {
          max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
        }
        .cv-mobile-accordion.is-open .cv-mobile-accordion-panel { max-height: 600px; }
        .cv-mobile-accordion-list { display: flex; flex-direction: column; padding: 2px 4px 12px; }
        .cv-mobile-accordion-list a {
          display: flex; align-items: center; gap: 10px; padding: 9px 6px; font-size: 13.5px;
          color: var(--muted); border-radius: 8px;
        }
        .cv-mobile-accordion-list a:hover { color: var(--teal-deep); background: var(--teal-tint); }

        .cv-mobile-drawer-actions { display: flex; gap: 10px; margin-top: 14px; }
        .cv-mobile-drawer-actions button { flex: 1; }

        .cv-header-actions { display: none; align-items: center; gap: 12px; }
        @media (min-width: 900px) { .cv-header-actions { display: flex; } }
        .cv-btn-ghost {
          font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 8px;
          border: 1px solid var(--line); background: #fff; color: var(--ink); cursor: pointer;
        }
        .cv-btn-solid {
          font-size: 14px; font-weight: 600; padding: 10px 18px; border-radius: 8px;
          border: none; background: var(--gold); color: #2a1804; cursor: pointer;
        }
      `}</style>

      <div className="cv-container">
        <header className="cv-header">
          <div className="cv-logo">
            <div className="cv-logo-mark"><img src={logoSrc} alt="CareerVidya logo" /></div>
            <div className="cv-logo-text">
              <div className="cv-logo-word">VidyaHaiToSuccessHai<span></span></div>
            </div>
          </div>
          <nav className="cv-nav">
            {/* Courses dropdown */}
            <div
              className={`cv-nav-item ${navDropdown === "courses" ? "is-open" : ""}`}
              onMouseEnter={() => openDropdown("courses")}
              onMouseLeave={scheduleClose}
            >
              <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "courses" ? null : "courses")}>
                Courses <ChevronDown size={14} className="cv-chevron" />
              </button>
              <div className="cv-nav-panel">
                <div className="cv-nav-panel-grid">
                  {POPULAR_COURSES.map((c) => (
                    <a href={c.href} key={c.href} className="cv-nav-panel-link">
                      <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={14} /></span>
                      {c.label}
                    </a>
                  ))}
                </div>
                <div className="cv-nav-panel-footer">
                  <a href="/courses">View all courses <ArrowRight size={13} /></a>
                </div>
              </div>
            </div>

            {/* Universities dropdown */}
            <div
              className={`cv-nav-item ${navDropdown === "universities" ? "is-open" : ""}`}
              onMouseEnter={() => openDropdown("universities")}
              onMouseLeave={scheduleClose}
            >
              <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "universities" ? null : "universities")}>
                Universities <ChevronDown size={14} className="cv-chevron" />
              </button>
              <div className="cv-nav-panel">
                <div className="cv-nav-panel-grid">
                  {TOP_UNIVERSITIES.map((u) => (
                    <a href={u.href} key={u.href} className="cv-nav-panel-link">
                      <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={14} /></span>
                      {u.label}
                    </a>
                  ))}
                </div>
                <div className="cv-nav-panel-footer">
                  <a href="/universities">View all universities <ArrowRight size={13} /></a>
                </div>
              </div>
            </div>

            {NAV_LINKS.map((link) => (
              <a key={link} href="#">{link}</a>
            ))}
            <span className="cv-nav-more">Resources <ChevronDown size={14} /></span>
          </nav>
          <div className="cv-header-actions">
            <button className="cv-btn-solid" onClick={() => (window.location.href = contactHref)}>Contact us</button>
          </div>
          <button
            className="cv-menu-btn"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
        </header>
        <div className={`cv-mobile-drawer ${menuOpen ? "is-open" : ""}`}>
          <div className="cv-mobile-drawer-inner">
            {/* Courses accordion */}
            <div className={`cv-mobile-accordion ${mobileAccordion === "courses" ? "is-open" : ""}`}>
              <button
                className="cv-mobile-accordion-head"
                onClick={() => setMobileAccordion(mobileAccordion === "courses" ? null : "courses")}
              >
                Courses <ChevronDown size={16} className="cv-chevron" />
              </button>
              <div className="cv-mobile-accordion-panel">
                <div className="cv-mobile-accordion-list">
                  {POPULAR_COURSES.map((c) => (
                    <a href={c.href} key={c.href} onClick={() => setMenuOpen(false)}>
                      <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={13} /></span>
                      {c.label}
                    </a>
                  ))}
                  <a href="/courses" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
                    View all courses <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>

            {/* Universities accordion */}
            <div className={`cv-mobile-accordion ${mobileAccordion === "universities" ? "is-open" : ""}`}>
              <button
                className="cv-mobile-accordion-head"
                onClick={() => setMobileAccordion(mobileAccordion === "universities" ? null : "universities")}
              >
                Universities <ChevronDown size={16} className="cv-chevron" />
              </button>
              <div className="cv-mobile-accordion-panel">
                <div className="cv-mobile-accordion-list">
                  {TOP_UNIVERSITIES.map((u) => (
                    <a href={u.href} key={u.href} onClick={() => setMenuOpen(false)}>
                      <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={13} /></span>
                      {u.label}
                    </a>
                  ))}
                  <a href="/universities" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
                    View all universities <ArrowRight size={13} />
                  </a>
                </div>
              </div>
            </div>

            {NAV_LINKS.map((link) => (
              <a key={link} href="#" onClick={() => setMenuOpen(false)}>{link}</a>
            ))}
            <a href="#" onClick={() => setMenuOpen(false)}>Resources</a>
            <div className="cv-mobile-drawer-actions">
              <button className="cv-btn-solid" onClick={() => (window.location.href = contactHref)}>Contact us</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Footer({ logoSrc = "/images/n12.png" }) {
  return (
    <div className="cv-container">
      <style>{`
        .cv-footer-logo { display: flex; align-items: center; gap: 10px; }
        .cv-footer-logo-mark {
          width: 34px; height: 34px; border-radius: 50%; overflow: hidden;
          border: 1.5px solid var(--gold); background: #fff;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
        }
        @media (min-width: 640px) { .cv-footer-logo-mark { width: 44px; height: 44px; } }
        .cv-footer-logo-mark img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cv-footer-logo-word { font-family: 'Fraunces', serif; font-size: 18px; font-weight: 600; color: var(--ink); }
        .cv-footer-logo-word span { color: var(--gold); font-style: italic; }

        .cv-footer { border-top: 1px solid var(--line); padding: 44px 0 28px; }
        .cv-footer-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }
        @media (min-width: 760px) { .cv-footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1.2fr; } }
        .cv-footer-desc { font-size: 13.5px; color: var(--muted); line-height: 1.6; margin: 14px 0 16px; max-width: 260px; }
        .cv-footer-social { display: flex; gap: 10px; }
        .cv-footer-social a {
          width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line);
          display: flex; align-items: center; justify-content: center; color: var(--muted);
        }
        .cv-footer-social a:hover { color: var(--teal); border-color: var(--teal); }
        .cv-footer-h4 { font-size: 13px; font-weight: 700; margin-bottom: 14px; color: var(--ink); }
        .cv-footer-links { display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--muted); }
        .cv-footer-links a:hover { color: var(--teal); }
        .cv-newsletter-row { display: flex; gap: 8px; margin-top: 4px; }
        .cv-newsletter-row input {
          flex: 1; min-width: 0; font-size: 13px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line);
          background: var(--panel); color: var(--ink);
        }
        .cv-newsletter-row input::placeholder { color: var(--muted); }
        .cv-newsletter-row button {
          width: 40px; height: 40px; border-radius: 8px; border: none; background: var(--teal); color: #fff;
          display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
        }
        .cv-footer-bottom {
          display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid var(--line);
          font-size: 12.5px; color: var(--muted);
        }
        @media (min-width: 760px) { .cv-footer-bottom { flex-direction: row; justify-content: space-between; } }
      `}</style>

      <footer className="cv-footer">
        <div className="cv-footer-grid">
          <div>
            <div className="cv-footer-logo">
              <div className="cv-footer-logo-mark"><img src={logoSrc} alt="CareerVidya logo" /></div>
              <div className="cv-footer-logo-word">Career<span>Vidya</span></div>
            </div>
            <p className="cv-footer-desc">
              CareerVidya is India's platform for choosing the right career, course, and university —
              and for finding the right talent.
            </p>
            <div className="cv-footer-social">
              <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
              <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={15} /></a>
              <a href="#" aria-label="YouTube"><Youtube size={15} /></a>
            </div>
          </div>
          <div>
            <div className="cv-footer-h4">For students</div>
            <div className="cv-footer-links">
              <a href="#">Courses</a>
              <a href="#">Universities</a>
              <a href="#">Career test</a>
              <a href="#">Scholarships</a>
              <a href="#">Counselling</a>
            </div>
          </div>
          <div>
            <div className="cv-footer-h4">For recruiters</div>
            <div className="cv-footer-links">
              <a href="#">Post a job</a>
              <a href="#">Find candidates</a>
              <a href="#">Pricing</a>
              <a href="#">Employer login</a>
            </div>
          </div>
          <div>
            <div className="cv-footer-h4">Stay updated</div>
            <p className="cv-footer-desc" style={{ margin: "0 0 10px" }}>Get the latest courses and career tips.</p>
            <div className="cv-newsletter-row">
              <input type="email" placeholder="Enter your email" />
              <button aria-label="Subscribe"><Send size={15} /></button>
            </div>
          </div>
        </div>
        <div className="cv-footer-bottom">
          <span>© 2026 CareerVidya. All rights reserved.</span>
          <span>Terms &amp; conditions · Privacy policy</span>
        </div>
      </footer>
    </div>
  );
}