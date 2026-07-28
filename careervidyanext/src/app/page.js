  
import CardSlider from "./components/cardslider/page";
import Counter from "./components/counter/page";
import Slider from "./components/slider/page";
import TeamSection from "./components/TeamSection";
import Footer from "./layout/Footer";
import Header from "./layout/Header";
import Studentimageslider from "./components/Studentimageslider";
import Getcourse from "./components/Getcourse";
import FAQ from "./components/FAQ";
import FLOW from "./components/FLOW";
import Studentstrustus from "./components/Studentstrustus";
import TestimonialsSlider from "./components/TestimonialsSlider";
import LogoSlider from "./components/LogoSlider";
  import QueryPopup from "./components/QueryPopup";
import  Universityimage  from "../app/components/universityimage";
import ChatbotFloating from "./components/ChatbotFloating";
import SocialSidebar from "./components/SocialSidebar";
import ServiceSlider from "./components/ServiceSlider";
import Notification from "../app/components/Notification";
import VideoSlider from "./components/VideoSlider";
 import CareervidyaFormModal from "./components/CareervidyaFormModal";


export const metadata = {
  title: "Career Vidya | Best Courses & Career Guidance Platform",
  description:
    "Explore top courses, expert career guidance, and university programs with Career Vidya. Start your learning journey today.",
};

export default function Home() {
  return (
    <div>
      {/* SEO: Single H1 for the homepage — hidden visually, read by search engines & screen readers */}
      <h1 className="sr-only">
        Best Courses & Career Guidance Platform | Career Vidya
      </h1>
      <Header />
      <Notification />
      <Slider />
      <Counter />
      <Getcourse />
      <Universityimage />
      <FLOW />
      <Studentstrustus />
      <TeamSection />
      <TestimonialsSlider />
      <Studentimageslider />
      <LogoSlider />
      <ServiceSlider />

      <QueryPopup />

      {/* <CareervidyaFormModal /> */}

      {/* <CardSlider /> */}
      <VideoSlider />
      <FAQ />

      <Footer />
      <ChatbotFloating />
      <SocialSidebar />
    </div>
  );
}





// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   GraduationCap,
//   Briefcase,
//   Compass,
//   Building2,
//   BookOpen,
//   Sparkles,
//   Wallet,
//   FileText,
//   Users,
//   ChevronDown,
//   TrendingUp,
//   Cpu,
//   ShieldCheck,
//   Cloud,
//   Megaphone,
//   Send,
//   Facebook,
//   Instagram,
//   Linkedin,
//   Youtube,
//   Menu,
//   X,
//   Award,
//   BriefcaseBusiness,
//   Landmark,
//   School,
//   Globe2,
//   BadgeCheck,
//   Library,
//   MapPin,
//   Clock,
//   Zap,
//   Phone,
//   MessageCircle,
//   Bot,
// } from "lucide-react";
// import FAQ from "../app/components/FAQ";

// const VIDYA_URL = "/Home";
// const CAREER_URL = "http://localhost:3000";
// const LOGO_SRC = "/images/n12.png";
// const HERO_BG_IMG = "/images/testing4.jpeg";
// const VIDYA_IMG = "/images/test3.jpeg";
// const CAREER_IMG = "/images/test2.jpeg";
// const COUNSELLING_IMG = "/images/career1.jpeg";

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

// const NAV_LINKS = [
//   { label: "Counselling", href: "/counselling" },
//   { label: "Scholarships", href: "/scholarships" },
// ];

// const FEATURES = [
//   { icon: Compass, title: "Career assessment", desc: "Discover the right career for you.", color: "#0d9488", tint: "#e3f4f1" },
//   { icon: Building2, title: "Top universities", desc: "Explore and compare top universities.", color: "#2f5c8a", tint: "#e6eef6" },
//   { icon: BookOpen, title: "Popular courses", desc: "Find trending, future-ready courses.", color: "#2f5c8a", tint: "#e6eef6" },
//   { icon: Wallet, title: "Scholarships", desc: "Apply for scholarships and save more.", color: "#f5a623", tint: "#fef3e2" },
//   { icon: Users, title: "Expert counsellors", desc: "Connect with experienced career experts.", color: "#e8935a", tint: "#fbeadf" },
//   { icon: BookOpen, title: "Resources", desc: "Guides, blogs and career tips.", color: "#8b5cf6", tint: "#efe9fd" },
// ];

// const COURSES = [
//   { icon: TrendingUp, name: "Data science", unis: "120+ universities", color: "#2f6fed" },
//   { icon: Cpu, name: "Artificial intelligence", unis: "95+ universities", color: "#06b6d4" },
//   { icon: ShieldCheck, name: "Cyber security", unis: "85+ universities", color: "#f5a623" },
//   { icon: Cloud, name: "Cloud computing", unis: "75+ universities", color: "#3b82f6" },
//   { icon: Megaphone, name: "Digital marketing", unis: "60+ universities", color: "#a855f7" },
// ];

// const PARTNERS = ["IIT", "Amity University", "LPU", "Chandigarh University", "UPES"];

// // ---- Trusted partner logos (used by the auto-scrolling logo slider) ----
// const PARTNER_LOGOS = [
//   { name: "Amity University", icon: Landmark, color: "#2f5c8a", tint: "#e6eef6" },
//   { name: "LPU Online", icon: Building2, color: "#0d9488", tint: "#e3f4f1" },
//   { name: "Manipal University", icon: School, color: "#c15304", tint: "#fef3e2" },
//   { name: "Chandigarh University", icon: Landmark, color: "#6366f1", tint: "#eceafd" },
//   { name: "SRM University", icon: Building2, color: "#e11d6f", tint: "#fde8ee" },
//   { name: "DY Patil University", icon: School, color: "#8b5cf6", tint: "#efe9fd" },
//   { name: "Chitkara University", icon: Landmark, color: "#e8935a", tint: "#fbeadf" },
//   { name: "Sharda University", icon: School, color: "#0d9488", tint: "#e3f4f1" },
//   { name: "UPES", icon: Globe2, color: "#c15304", tint: "#fef3e2" },
//   { name: "Jain University", icon: Building2, color: "#2f5c8a", tint: "#e6eef6" },
//   { name: "Birla Institute of Technology", icon: Library, color: "#6366f1", tint: "#eceafd" },
//   { name: "IIT", icon: BadgeCheck, color: "#e11d6f", tint: "#fde8ee" },
// ];

// // ---- Trending jobs (send user to the Career portal) ----
// const JOB_STATS = [
//   { icon: Briefcase, num: "25,000+", label: "Active jobs" },
//   { icon: Building2, num: "3,500+", label: "Hiring companies" },
//   { icon: Users, num: "1,20,000+", label: "Candidates placed" },
//   { icon: Zap, num: "500+", label: "Jobs posted today" },
// ];

// const JOB_FILTERS = ["All", "IT & Software", "Marketing", "Sales", "Design", "More"];

// const TRENDING_JOBS = [
//   {
//     title: "Software Engineer",
//     company: "HCL Technologies",
//     short: "HCL",
//     logo: "/images/hcl2.jpeg",
//     mono: "#e11d48",
//     location: "Bangalore",
//     workMode: "Full-time",
//     exp: "2-5 Yrs",
//     salary: "₹6 - 12 LPA",
//     isNew: true,
//     href: `${CAREER_URL}/jobs/software-engineer`,
//   },
//   {
//     title: "System Engineer",
//     company: "Infosys Limited",
//     short: "IN",
//     logo: "/images/inf1.jpeg",
//     mono: "#2563eb",
//     location: "Hyderabad",
//     workMode: "Full-time",
//     exp: "1-3 Yrs",
//     salary: "₹4 - 8 LPA",
//     isNew: true,
//     href: `${CAREER_URL}/jobs/system-engineer`,
//   },
//   {
//     title: "Associate Product Manager",
//     company: "samsung",
//     short: "a",
//     logo: "/images/sum.jpeg",
//     mono: "#f59e0b",
//     location: "Delhi NCR",
//     workMode: "Full-time",
//     exp: "3-6 Yrs",
//     salary: "₹12 - 20 LPA",
//     isNew: false,
//     href: `${CAREER_URL}/jobs/associate-product-manager`,
//   },
// ];

// // ---- Trending courses (stay on this website) ----
// const COURSE_STATS = [
//   { icon: BookOpen, num: "10,000+", label: "Courses available" },
//   { icon: Building2, num: "300+", label: "Top universities" },
//   { icon: Award, num: "50+", label: "Specializations" },
//   { icon: Users, num: "5,00,000+", label: "Students enrolled" },
// ];

// const COURSE_FILTERS = ["All", "Management", "Engineering", "IT", "Design", "More"];

// const TRENDING_COURSES_HOME = [
//   {
//     title: "MBA",
//     sub: "Master of Business Administration",
//     university: "Amity University",
//     short: "AU",
//     mono: "#8b5cf6",
//     duration: "2 Years",
//     fee: "₹2.5 - 15 LPA",
//     href: "/course/online-mba-1",
//   },
//   {
//     title: "B.Tech Computer Science",
//     sub: "Bachelor of Technology",
//     university: "LPU Online",
//     short: "LPU",
//     mono: "#0d9488",
//     duration: "4 Years",
//     fee: "₹1.2 - 6 LPA",
//     href: "/course/btech-bachelors-of-technology",
//   },
//   {
//     title: "BCA",
//     sub: "Bachelor of Computer Applications",
//     university: "Chandigarh University",
//     short: "CU",
//     mono: "#2563eb",
//     duration: "3 Years",
//     fee: "₹80K - 3 LPA",
//     href: "/course/online-bca-bachelor-of-computer-applications",
//   },
// ];

// // ---- Quick action strip below the trending section ----
// const QUICK_ACTIONS = [
//   {
//     icon: Compass,
//     img: "/images/a1.png",
//     title: "Free Career Counselling",
//     titleAccent: "Free Career Counselling",
//     desc: "Book a free 1:1 session",
//     cta: "Book Now",
//     color: "#0d9488",
//     tint: "#e3f4f1",
//     href: "/counselling",
//   },
//   {
//     icon: Bot,
//     img: "/images/a2.png",
//     title: "AI Career Test",
//     desc: "Discover the best career for you in 2 minutes",
//     cta: "Start Test",
//     color: "#2563eb",
//     tint: "#e6eef6",
//     href: "/career-test",
//   },
//   {
//     icon: Wallet,
//     img: "/images/a3.png",
//     title: "Scholarship Checker",
//     desc: "Check your eligibility and save on tuition",
//     cta: "Check Now",
//     color: "#c15304",
//     tint: "#fef3e2",
//     href: "/scholarships",
//   },
//   {
//     icon: FileText,
//     img: "/images/b9.jpg",
//     title: "Resume Builder",
//     desc: "Create a professional resume that gets you hired",
//     cta: "Build Now",
//     color: "#8b5cf6",
//     tint: "#efe9fd",
//     href: `${CAREER_URL}/resume-builder`,
//   },
// ];

// export default function CareerVidyaHome() {
//   const [hovered, setHovered] = useState(null); // 'vidya' | 'career' | null
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [navDropdown, setNavDropdown] = useState(null); // 'courses' | 'universities' | null
//   const [mobileAccordion, setMobileAccordion] = useState(null); // 'courses' | 'universities' | null
//   const [jobFilter, setJobFilter] = useState("All");
//   const [courseFilter, setCourseFilter] = useState("All");
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
//     <div className="cv-root">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//         * { box-sizing: border-box; }

//         .cv-root {
//           --ink: #0d1b2e;
//           --muted: #5b677e;
//           --line: rgba(13,27,46,0.1);
//           --teal: #0056B3;
//           --teal-deep: #0056B3;
//           --teal-tint: #e3f4f1;
//           --gold: #c15304;
//           --gold-deep: #c15304;
//           --gold-tint: #fef3e2;
//           --surface: #ffffff;
//           --panel: #ffffff;
//           font-family: 'Inter', sans-serif;
//           color: var(--ink);
//           background: var(--surface);
//         }

//         a { text-decoration: none; color: inherit; }
//         button { font-family: inherit; }

//         .cv-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
//         @media (min-width: 640px) { .cv-container { padding: 0 32px; } }

//         /* header spans wider with tighter side padding so it doesn't look boxed-in */
//         .cv-header-wrap .cv-container { max-width: 1440px; padding: 0 16px; }
//         @media (min-width: 640px) { .cv-header-wrap .cv-container { padding: 0 24px; } }

//         /* header */
//         .cv-header-wrap {
//           position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92);
//           backdrop-filter: blur(10px); transition: box-shadow 0.25s ease;
//         }
//         .cv-header-wrap.is-scrolled { box-shadow: 0 4px 24px -8px rgba(0,0,0,0.5); }
//         .cv-header {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 16px 0; border-bottom: 1px solid var(--line);
//         }
//         @media (min-width: 640px) { .cv-header { padding: 2px 0; } }
//         .cv-logo { display: flex; align-items: center; gap: 10px; }
//         .cv-logo-mark {
//           width: 34px; height: 34px; /* border-radius: 50%; */ overflow: hidden;
//           /* border: 1.5px solid var(--gold); */ background: #fff;
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         @media (min-width: 640px) { .cv-logo-mark { width: 136px; height: 86px; } }
//         .cv-logo-mark img { width: 100%; height: 100%; object-fit: cover; display: block; }
//         .cv-logo-text { line-height: 1.1; }
//         .cv-logo-word { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; letter-spacing: 0.1px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-logo-word { font-size: 18px; } }
//         .cv-logo-word span { color: var(--gold); font-style: italic; font-weight: 600; }
//         .cv-logo-tag { display: none; font-size: 9px; letter-spacing: 0.8px; color: var(--muted); text-transform: uppercase; }
//         @media (min-width: 640px) { .cv-logo-tag { display: block; } }

//         .cv-nav { display: none; align-items: center; gap: 30px; font-size: 14.5px; font-weight: 500; color: var(--ink); }
//         .cv-nav a:hover { color: var(--gold); }
//         .cv-nav-more { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
//         @media (min-width: 900px) { .cv-nav { display: flex; } }

//         /* nav dropdown trigger */
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

//         /* hero */
//         .cv-hero {
//           padding: 32px 0 24px; text-align: center; position: relative; overflow: hidden;
//         }
//         @media (min-width: 640px) { .cv-hero { padding: 44px 0 32px; } }
//         .cv-hero-bg {
//           position: absolute; top: 0; left: 50%; transform: translateX(-50%);
//           width: 100vw; height: 100%;
//           object-fit: cover; object-position: center top;
//           opacity: 0.68; pointer-events: none; z-index: 0;
//           mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
//           -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
//         }
//         .cv-hero-top { position: relative; }
//         .cv-hero-top > * { position: relative; z-index: 1; }
//         .cv-path-wrap { z-index: 1; }
//         .cv-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           font-size: 11.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-deep);
//           margin-bottom: 14px;
//         }
//         .cv-h1 {
//           font-family: 'Inter', sans-serif; font-size: clamp(28px, 6.4vw, 44px); font-weight: 600;
//           line-height: 1.18; letter-spacing: -0.6px; margin: 0 0 16px; color: var(--ink);
//         } 
//         .cv-h1 em { font-style: italic; color: var(--teal); }
//         .cv-hero-sub {
//           color: var(--muted); font-size: 14.5px; line-height: 1.7; max-width: 560px;
//           margin: 0 auto 32px;
//         }
//         @media (min-width: 640px) { .cv-hero-sub { font-size: 15.5px; margin: 0 auto 40px; } }

//         @keyframes cv-rise {
//           from { opacity: 0; transform: translateY(14px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .cv-animate { animation: cv-rise 0.6s cubic-bezier(.2,.8,.2,1) both; }

//         /* choose your path — two side-by-side panels with a logo divider */
//         .cv-path-wrap { position: relative; max-width: 980px; margin: 0 auto; }
//         .cv-path-grid {
//           display: grid; grid-template-columns: 1fr; gap: 16px; text-align: left; align-items: stretch;
//         }
//         @media (min-width: 860px) { .cv-path-grid { grid-template-columns: 1fr 1fr; gap: 88px; } }

//         .cv-path-or {
//           display: none;
//         }
//         @media (min-width: 860px) {
//           .cv-path-or {
//             display: flex; align-items: center; justify-content: center;
//             position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
//             width: 98px; height: 98px; border-radius: 50%;
//             background: linear-gradient(155deg, #ffffff 0%, var(--teal-tint) 55%, var(--gold-tint) 100%);
//             border: 3px solid #ffffff;
//             box-shadow:
//               0 22px 44px -14px rgba(13,27,46,0.32),
//               0 8px 18px -6px rgba(0,86,179,0.18),
//               0 0 0 1px var(--line);
//             z-index: 3; overflow: visible; padding: 0;
//             transition: transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease;
//           }
//           .cv-path-or::before {
//             content: "";
//             position: absolute; inset: -10px; border-radius: 50%;
//             background: radial-gradient(circle, rgba(0,86,179,0.10) 0%, rgba(193,83,4,0.08) 55%, transparent 75%);
//             z-index: -1;
//           }
//           .cv-path-or:hover {
//             transform: translate(-50%, -50%) scale(1.06);
//             box-shadow:
//               0 28px 54px -14px rgba(13,27,46,0.4),
//               0 10px 22px -6px rgba(0,86,179,0.24),
//               0 0 0 1px var(--line);
//           }
//           .cv-path-or-inner {
//             width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
//             display: flex; align-items: center; justify-content: center;
//             background: #fff; padding: 6px;
//             box-shadow: inset 0 0 0 1px var(--line);
//           }
//         }
//         .cv-path-or img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }

//         .cv-path-card {
//           border-radius: 16px; padding: 20px 20px; border: 1px solid var(--line); background: #fff;
//           display: flex; flex-direction: row; align-items: center; gap: 16px;
//           position: relative; overflow: hidden;
//           transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
//         }
//         .cv-path-card.is-hover { transform: translateY(-3px); }
//         .cv-path-card.vidya.is-hover {
//           box-shadow: 0 16px 32px -18px rgba(13,148,136,0.3);
//           background: linear-gradient(135deg, var(--teal-tint) 0%, #ffffff 45%, var(--gold-tint) 100%);
//           border-color: rgba(0,86,179,0.55);
//         }
//         .cv-path-card.career.is-hover {
//           box-shadow: 0 16px 32px -18px rgba(245,166,35,0.35);
//           background: linear-gradient(135deg, var(--gold-tint) 0%, #ffffff 45%, var(--teal-tint) 100%);
//           border-color: rgba(193,83,4,0.55);
//         }

//         .cv-path-content { flex: 1; min-width: 0; display: flex; flex-direction: column; position: relative; z-index: 1; }

//         .cv-path-media {
//           flex: 0 0 clamp(120px, 30%, 190px);
//           align-self: flex-end;
//           display: flex; align-items: flex-end; justify-content: center;
//           order: -1;
//         }
//         .cv-path-card.career .cv-path-media { order: 2; }

//         .cv-path-media img {
//           width: 100%;
//           height: auto;
//           max-height: 190px;
//           object-fit: contain;
//           display: block;
//         }
//         @media (max-width: 480px) {
//           .cv-path-media { flex-basis: 90px; }
//           .cv-path-media img { max-height: 120px; }
//         }

//         .cv-path-kicker {
//           font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;
//         }
//         .cv-path-card.vidya .cv-path-kicker { color: var(--teal); }
//         .cv-path-card.career .cv-path-kicker { color: var(--gold-deep); }

//         .cv-path-title { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 700; margin: 0 0 8px; color: var(--ink); }
//         .cv-path-desc { color: var(--muted); font-size: 12.5px; line-height: 1.6; margin: 0 0 14px; max-width: 300px; }

//         .cv-path-list { list-style: none; margin: 0 0 16px; padding: 12px 0 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 8px; }
//         .cv-path-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; color: var(--ink); }
//         .cv-path-list .cv-path-list-icon {
//           width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cv-path-card.vidya .cv-path-list-icon { background: var(--teal-tint); color: var(--teal); }
//         .cv-path-card.career .cv-path-list-icon { background: var(--gold-tint); color: var(--gold-deep); }

//         .cv-path-cta {
//           display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; font-size: 13px;
//           padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer; margin-top: auto;
//         }
//         .cv-path-card.vidya .cv-path-cta { background: var(--teal); color: #fff; }
//         .cv-path-card.career .cv-path-cta { background: var(--gold); color: #2a1804; }

//         /* ============ Trending jobs / trending courses section ============ */
//         .cv-trending { padding: 30px 0 12px; }
//         .cv-trending-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
//         @media (min-width: 900px) { .cv-trending-grid { grid-template-columns: 1fr 1fr; gap: 22px; } }

//         .cv-trending-col {
//           border: 1px solid var(--line); border-radius: 18px; padding: 18px;
//           background: var(--panel);
//           display: flex; flex-direction: column;
//         }

//         .cv-trending-headrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
//         .cv-trending-headrow-icon {
//           width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cv-trending-col.jobs .cv-trending-headrow-icon { background: var(--gold-tint); color: var(--gold-deep); }
//         .cv-trending-col.courses .cv-trending-headrow-icon { background: var(--teal-tint); color: var(--teal-deep); }
//         .cv-trending-headtext { flex: 1; min-width: 0; }
//         .cv-trending-title-lg { font-family: 'Inter', sans-serif; font-size: 17.5px; font-weight: 600; color: var(--ink); }
//         .cv-trending-title-lg .accent-gold { color: var(--gold-deep); }
//         .cv-trending-title-lg .accent-teal { color: var(--teal-deep); }
//         .cv-trending-caption { font-size: 12px; color: var(--muted); margin-top: 2px; }
//         .cv-trending-viewall {
//           font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; padding-top: 8px;
//           display: inline-flex; align-items: center; gap: 3px;
//         }
//         .cv-trending-viewall:hover { color: var(--ink); }

//         /* stat mini grid */
//         .cv-trending-stats {
//           display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
//           margin: 14px 0 16px;
//         }
//         @media (max-width: 420px) { .cv-trending-stats { grid-template-columns: repeat(2, 1fr); } }
//         .cv-trending-stat {
//           border: 1px solid var(--line); border-radius: 12px; padding: 9px 8px;
//           display: flex; flex-direction: column; gap: 5px; background: #fbfbfc;
//         }
//         .cv-trending-stat-icon {
//           width: 22px; height: 22px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
//         }
//         .cv-trending-col.jobs .cv-trending-stat-icon { background: var(--gold-tint); color: var(--gold-deep); }
//         .cv-trending-col.courses .cv-trending-stat-icon { background: var(--teal-tint); color: var(--teal-deep); }
//         .cv-trending-stat-num { font-weight: 700; font-size: 13px; color: var(--ink); line-height: 1.1; }
//         .cv-trending-stat-label { font-size: 10.5px; color: var(--muted); line-height: 1.3; }

//         /* fire label + filter pills */
//         .cv-trending-firelabel {
//           font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 10px;
//         }
//         .cv-trending-filters {
//           display: flex; gap: 6px; overflow-x: auto; margin-bottom: 14px; padding-bottom: 2px;
//           scrollbar-width: none;
//         }
//         .cv-trending-filters::-webkit-scrollbar { display: none; }
//         .cv-filter-pill {
//           font-size: 11.5px; font-weight: 600; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line);
//           background: #fff; color: var(--muted); white-space: nowrap; cursor: pointer; flex-shrink: 0;
//           transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
//         }
//         .cv-trending-col.jobs .cv-filter-pill.is-active { background: var(--gold); border-color: var(--gold); color: #2a1804; }
//         .cv-trending-col.courses .cv-filter-pill.is-active { background: var(--teal); border-color: var(--teal); color: #fff; }

//         .cv-trending-stack { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
//         .cv-trending-card {
//           display: flex; align-items: center; gap: 12px; padding: 12px;
//           border: 1px solid var(--line); border-radius: 14px; transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
//         }
//         .cv-trending-card:hover { border-color: rgba(13,27,46,0.2); transform: translateY(-2px); box-shadow: 0 10px 22px -16px rgba(13,27,46,0.35); }
//         .cv-trending-logo {
//           width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0; font-weight: 700; font-size: 13px; text-transform: uppercase; overflow: hidden;
//         }
//         .cv-trending-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
//         .cv-trending-info { flex: 1; min-width: 0; }
//         .cv-trending-title-row { display: flex; align-items: center; gap: 6px; }
//         .cv-trending-title { font-size: 13.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .cv-new-badge {
//           font-size: 9.5px; font-weight: 700; color: #0d9488; background: #e3f4f1; border-radius: 999px;
//           padding: 1.5px 7px; flex-shrink: 0;
//         }
//         .cv-trending-org { font-size: 12px; color: var(--muted); margin-top: 1px; }
//         .cv-trending-sub { font-size: 11px; color: var(--muted); margin-top: 3px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
//         .cv-trending-sub .dot::before { content: "·"; margin: 0 1px; }
//         .cv-trending-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
//         .cv-trending-price { font-size: 12.5px; font-weight: 700; }
//         .cv-trending-col.jobs .cv-trending-price { color: #0d9488; }
//         .cv-trending-col.courses .cv-trending-price { color: var(--teal-deep); }
//         .cv-trending-cta {
//           font-size: 11.5px; font-weight: 700; padding: 7px 13px; border-radius: 8px; border: none;
//           display: inline-flex; align-items: center; gap: 4px; cursor: pointer; white-space: nowrap; flex-shrink: 0;
//         }
//         .cv-trending-col.jobs .cv-trending-cta { background: var(--teal); color: #fff; }
//         .cv-trending-col.courses .cv-trending-cta { background: var(--gold); color: #2a1804; }

//         .cv-trending-more {
//           width: 100%; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink);
//           padding: 11px; border-radius: 10px; border: 1px dashed var(--line); background: #fff; cursor: pointer;
//           margin-top: auto;
//         }
//         .cv-trending-more:hover { border-color: var(--ink); }

//         /* quick action strip */
//         .cv-quick-actions {
//           max-width: 1440px;
//           margin: 0 auto;
//           padding: 20px 20px 30px;
//         }
//         @media (min-width: 640px) { .cv-quick-actions { padding: 24px 32px 36px; } }
//         .cv-quickgrid {
//           display: grid;
//           grid-template-columns: repeat(2, minmax(0, 1fr));
//           gap: 14px;
//         }
//         @media (min-width: 640px) {
//           .cv-quickgrid { gap: 16px; }
//         }
//         @media (min-width: 900px) {
//           .cv-quickgrid {
//             grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
//             gap: 18px;
//           }
//         }
//         .cv-quick-card {
//           position: relative;
//           overflow: hidden;
//           min-height: 108px;
//           background: linear-gradient(150deg, #ffffff 0%, #f5f9ff 100%);
//           border: 1px solid rgba(13, 27, 46, 0.07);
//           border-radius: 18px;
//           padding: 18px 20px 16px;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           justify-content: space-between;
//           gap: 4px;
//           transition: transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease, border-color 0.25s ease;
//         }
//         .cv-quick-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 18px 34px -20px rgba(13,27,46,0.28);
//           border-color: rgba(0,86,179,0.22);
//         }
//         @media (min-width: 640px) {
//           .cv-quick-card { padding: 20px 22px 18px; min-height: 116px; }
//         }
//         .cv-quick-card-copy { position: relative; z-index: 1; max-width: 78%; }
//         .cv-quick-card .cv-quick-icon {
//           width: 34px;
//           height: 34px;
//           border-radius: 10px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 8px;
//           flex-shrink: 0;
//         }
//         .cv-quick-card .cv-quick-icon img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           display: block;
//         }
//         .cv-quick-title {
//           font-size: 14px;
//           font-weight: 700;
//           line-height: 1.25;
//           margin: 0 0 4px;
//         }
//         .cv-quick-desc {
//           font-size: 12px;
//           color: #5b677e;
//           line-height: 1.5;
//           margin: 0;
//         }
//         .cv-quick-cta {
//           align-self: flex-start;
//           margin-top: 10px;
//           font-size: 12px;
//           font-weight: 700;
//           padding: 8px 14px;
//           border-radius: 10px;
//           border: none;
//           color: #fff;
//           cursor: pointer;
//           transition: filter 0.2s ease, transform 0.2s ease;
//         }
//         .cv-quick-cta:hover { filter: brightness(1.06); transform: translateY(-1px); }
//         .cv-quick-image {
//           position: absolute;
//           bottom: -6px;
//           right: -4px;
//           width: 74px;
//           height: 74px;
//           pointer-events: none;
//           opacity: 0.95;
//         }
//         .cv-quick-image img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           display: block;
//         }
//         .cv-quick-card.help {
//           background: linear-gradient(150deg, #0c2e5c 0%, #0a2447 100%);
//           color: #fff;
//           border-color: transparent;
//           flex-direction: column;
//           align-items: flex-start;
//           justify-content: center;
//         }
//         .cv-quick-card.help .cv-quick-title { color: #fff; }
//         .cv-quick-card.help .cv-quick-desc { color: rgba(255,255,255,0.82); }
//         .cv-quick-card.help .cv-quick-icon {
//           background: rgba(255,255,255,0.12);
//           color: #fff;
//         }
//         .cv-quick-help-row {
//           display: flex;
//           flex-direction: row;
//           flex-wrap: wrap;
//           gap: 8px;
//           margin-top: 10px;
//           position: relative;
//           z-index: 1;
//         }
//         .cv-quick-help-link,
//         .cv-btn-whatsapp {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 12px;
//           font-weight: 700;
//           padding: 8px 12px;
//           border-radius: 10px;
//           text-decoration: none;
//           transition: transform 0.2s ease, filter 0.2s ease;
//         }
//         .cv-quick-help-link:hover,
//         .cv-btn-whatsapp:hover { transform: translateY(-1px); filter: brightness(1.05); }
//         .cv-quick-help-link {
//           background: rgba(255,255,255,0.12);
//           color: #fff;
//         }
//         .cv-btn-whatsapp {
//           background: #10b981;
//           color: #0f172a;
//         }

//         /* stats bar */
//         .cv-stats-bar { padding: 0 0 20px; }
//         @media (min-width: 640px) { .cv-stats-bar { padding: 0 0 28px; } }
//         .cv-stats-box {
//           border: 1px solid var(--line); border-radius: 16px; background: var(--panel);
//           display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 16px; padding: 22px 20px;
//         }
//         @media (min-width: 700px) { .cv-stats-box { grid-template-columns: repeat(4, 1fr); padding: 24px 30px; } }
//         .cv-stat { display: flex; align-items: center; gap: 12px; }
//         .cv-stat-icon {
//           width: 40px; height: 40px; border-radius: 50%; background: var(--teal-tint); color: var(--teal);
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cv-stat-num { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 19px; color: var(--ink); }
//         .cv-stat-label { font-size: 11.5px; color: var(--muted); }

//         /* features strip */
//         .cv-features { padding: 18px 0; }
//         @media (min-width: 640px) { .cv-features { padding: 28px 0; } }
//         .cv-features-box {
//           border: 1px solid var(--line); border-radius: 16px; padding: 22px 18px; background: var(--panel);
//         }
//         @media (min-width: 640px) { .cv-features-box { border-radius: 18px; padding: 30px 24px; } }
//         .cv-features-head { text-align: center; margin-bottom: 20px; }
//         .cv-features-kicker { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--gold-deep); }
//         .cv-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px 16px; }
//         @media (min-width: 560px) { .cv-features-grid { gap: 22px; } }
//         @media (min-width: 700px) { .cv-features-grid { grid-template-columns: repeat(3, 1fr); } }
//         @media (min-width: 1000px) { .cv-features-grid { grid-template-columns: repeat(6, 1fr); } }
//         .cv-feature { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
//         .cv-feature-icon {
//           width: 40px; height: 40px; border-radius: 50%;
//           display: flex; align-items: center; justify-content: center; margin-bottom: 8px;
//         }
//         .cv-feature-title { font-weight: 600; font-size: 14.5px; color: var(--ink); }
//         .cv-feature-desc { font-size: 12.5px; color: var(--muted); line-height: 1.5; }

//         /* courses */
//         .cv-courses { padding: 18px 0; text-align: center; }
//         @media (min-width: 640px) { .cv-courses { padding: 28px 0; } }
//         .cv-section-kicker { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--gold-deep); margin-bottom: 8px; }
//         .cv-section-h2 { font-family: 'Inter', sans-serif; font-size: clamp(22px, 5.5vw, 30px); font-weight: 600; margin: 0 0 22px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-section-h2 { margin: 0 0 28px; } }

//         .cv-courses-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; text-align: left; }
//         @media (min-width: 560px) { .cv-courses-grid { gap: 16px; } }
//         @media (min-width: 700px) { .cv-courses-grid { grid-template-columns: repeat(3, 1fr); } }
//         @media (min-width: 1000px) { .cv-courses-grid { grid-template-columns: repeat(5, 1fr); } }

//         .cv-course-card { border: 1px solid var(--line); border-radius: 14px; padding: 16px 14px; background: var(--panel); transition: border-color 0.25s ease, transform 0.25s ease; }
//         @media (min-width: 640px) { .cv-course-card { padding: 22px 18px; } }
//         .cv-course-card:hover { border-color: rgba(13,27,46,0.22); transform: translateY(-3px); box-shadow: 0 14px 28px -18px rgba(13,27,46,0.2); }
//         .cv-course-icon {
//           width: 42px; height: 42px; border-radius: 12px;
//           display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
//         }
//         .cv-course-tag { font-size: 11px; font-weight: 600; margin-bottom: 6px; }
//         .cv-course-name { font-weight: 600; font-size: 15px; margin-bottom: 10px; color: var(--ink); }
//         .cv-course-unis { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
//         .cv-course-link { font-size: 13px; font-weight: 600; color: var(--ink); display: inline-flex; align-items: center; gap: 4px; }

//         /* counselling banner */
//         .cv-counsel { padding: 0 0 24px; }
//         @media (min-width: 640px) { .cv-counsel { padding: 0 0 32px; } }
//         .cv-counsel-box {
//           background: linear-gradient(120deg, var(--teal-tint), var(--panel) 60%); border-radius: 18px; padding: 8px; border: 1px solid var(--line);
//           display: grid; grid-template-columns: 1fr; gap: 18px; align-items: center;
//         }
//         @media (min-width: 760px) { .cv-counsel-box { grid-template-columns: 1fr 1fr; padding: 8px; border-radius: 20px; gap: 24px; } }
//         .cv-counsel-text { padding: 22px 20px 4px; }
//         @media (min-width: 760px) { .cv-counsel-text { padding: 28px 30px; } }
//         .cv-counsel-h3 { font-family: 'Inter', sans-serif; font-size: 21px; font-weight: 600; margin: 0 0 8px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-counsel-h3 { font-size: 24px; margin: 0 0 10px; } }
//         .cv-counsel-p { color: var(--muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; max-width: 340px; }
//         .cv-counsel-cta {
//           display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px;
//           padding: 12px 20px; border-radius: 8px; border: none; cursor: pointer; background: var(--teal); color: #fff;
//         }
//         .cv-counsel-photo { border-radius: 16px; overflow: hidden; }
//         .cv-counsel-photo img { width: 100%; height: auto; display: block; }

//         /* partners — wide auto-scrolling logo slider */
//         .cv-partners-wrap { padding: 0 0 32px; }
//         .cv-partners-wrap .cv-container { max-width: 1440px; }
//         .cv-partners-box {
//           border: 1px solid var(--line); border-radius: 20px; padding: 28px 0; background: var(--panel);
//           overflow: hidden;
//         }
//         .cv-partners-kicker {
//           text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase;
//           color: var(--muted); margin-bottom: 20px; padding: 0 24px;
//         }
//         .cv-partners-marquee {
//           width: 100%; overflow: hidden; position: relative;
//           -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
//           mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
//         }
//         .cv-partners-track {
//           display: flex; align-items: center; gap: 16px; width: max-content;
//           animation: cv-marquee 32s linear infinite;
//         }
//         .cv-partners-track:hover { animation-play-state: paused; }
//         @keyframes cv-marquee {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         .cv-partner-logo {
//           display: flex; align-items: center; gap: 10px; flex-shrink: 0; white-space: nowrap;
//           padding: 12px 22px; border: 1px solid var(--line); border-radius: 14px; background: #fff;
//           transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
//         }
//         .cv-partner-logo:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 14px 26px -16px rgba(13,27,46,0.3);
//           border-color: rgba(0,86,179,0.3);
//         }
//         .cv-partner-logo-icon {
//           width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//         }
//         .cv-partner-logo-name { font-size: 13px; font-weight: 700; color: var(--ink); }
//         .cv-partners-more {
//           font-size: 13px; font-weight: 700; color: var(--muted); border: 1px dashed var(--line);
//         }

//         /* footer */
//         .cv-footer { border-top: 1px solid var(--line); padding: 44px 0 28px; }
//         .cv-footer-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }
//         @media (min-width: 760px) { .cv-footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1.2fr; } }
//         .cv-footer-desc { font-size: 13.5px; color: var(--muted); line-height: 1.6; margin: 14px 0 16px; max-width: 260px; }
//         .cv-footer-social { display: flex; gap: 10px; }
//         .cv-footer-social a {
//           width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line);
//           display: flex; align-items: center; justify-content: center; color: var(--muted);
//         }
//         .cv-footer-social a:hover { color: var(--teal); border-color: var(--teal); }
//         .cv-footer-h4 { font-size: 13px; font-weight: 700; margin-bottom: 14px; color: var(--ink); }
//         .cv-footer-links { display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--muted); }
//         .cv-footer-links a:hover { color: var(--teal); }
//         .cv-newsletter-row { display: flex; gap: 8px; margin-top: 4px; }
//         .cv-newsletter-row input {
//           flex: 1; min-width: 0; font-size: 13px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line);
//           background: var(--panel); color: var(--ink);
//         }
//         .cv-newsletter-row input::placeholder { color: var(--muted); }
//         .cv-newsletter-row button {
//           width: 40px; height: 40px; border-radius: 8px; border: none; background: var(--teal); color: #fff;
//           display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
//         }
//         .cv-footer-bottom {
//           display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid var(--line);
//           font-size: 12.5px; color: var(--muted);
//         }
//         @media (min-width: 760px) { .cv-footer-bottom { flex-direction: row; justify-content: space-between; } }
//       `}</style>

//       {/* header */}
//       <div className={`cv-header-wrap ${scrolled ? "is-scrolled" : ""}`}>
//         <div className="cv-container">
//           <header className="cv-header">
//             <div className="cv-logo">
//               <div className="cv-logo-mark"><img src={LOGO_SRC} alt="CareerVidya logo" /></div>
//               <div className="cv-logo-text">
//                 <div className="cv-logo-word"><span>Vidya</span>HaiToSuccessHai</div>
//                 {/* <div className="cv-logo-tag">Right guidance · Right university · Right future</div> */}
//               </div>
//             </div>
//             <nav className="cv-nav">
//               {/* Courses dropdown */}
//               <div
//                 className={`cv-nav-item ${navDropdown === "courses" ? "is-open" : ""}`}
//                 onMouseEnter={() => openDropdown("courses")}
//                 onMouseLeave={scheduleClose}
//               >
//                 <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "courses" ? null : "courses")}>
//                   Courses <ChevronDown size={14} className="cv-chevron" />
//                 </button>
//                 <div className="cv-nav-panel">
//                   <div className="cv-nav-panel-grid">
//                     {POPULAR_COURSES.map((c) => (
//                       <a href={c.href} key={c.href} className="cv-nav-panel-link">
//                         <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={14} /></span>
//                         {c.label}
//                       </a>
//                     ))}
//                   </div>
//                   <div className="cv-nav-panel-footer">
//                     <a href="/courses">View all courses <ArrowRight size={13} /></a>
//                   </div>  
//                 </div>
//               </div>

//               {/* Universities dropdown */}
//               <div
//                 className={`cv-nav-item ${navDropdown === "universities" ? "is-open" : ""}`}
//                 onMouseEnter={() => openDropdown("universities")}
//                 onMouseLeave={scheduleClose}
//               >
//                 <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "universities" ? null : "universities")}>
//                   Universities <ChevronDown size={14} className="cv-chevron" />
//                 </button>
//                 <div className="cv-nav-panel">
//                   <div className="cv-nav-panel-grid">
//                     {TOP_UNIVERSITIES.map((u) => (
//                       <a href={u.href} key={u.href} className="cv-nav-panel-link">
//                         <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={14} /></span>
//                         {u.label}
//                       </a>
//                     ))}
//                   </div>
//                   <div className="cv-nav-panel-footer">
//                     <a href="/universities">View all universities <ArrowRight size={13} /></a>
//                   </div>
//                 </div>
//               </div>

//               {NAV_LINKS.map((link) => (
//                 <a key={link.label} href={link.href}>{link.label}</a>
//               ))}
//               <a href="/resources">Resources</a>
//             </nav>
//             <div className="cv-header-actions">
//               <button className="cv-btn-solid" onClick={() => (window.location.href = "/contact")}>Contact us</button>
//             </div>
//             <button
//               className="cv-menu-btn"
//               aria-label={menuOpen ? "Close menu" : "Open menu"}
//               onClick={() => setMenuOpen((v) => !v)}
//             >
//               {menuOpen ? <X size={19} /> : <Menu size={19} />}
//             </button>
//           </header>
//           <div className={`cv-mobile-drawer ${menuOpen ? "is-open" : ""}`}>
//             <div className="cv-mobile-drawer-inner">
//               {/* Courses accordion */}
//               <div className={`cv-mobile-accordion ${mobileAccordion === "courses" ? "is-open" : ""}`}>
//                 <button
//                   className="cv-mobile-accordion-head"
//                   onClick={() => setMobileAccordion(mobileAccordion === "courses" ? null : "courses")}
//                 >
//                   Courses <ChevronDown size={16} className="cv-chevron" />
//                 </button>
//                 <div className="cv-mobile-accordion-panel">
//                   <div className="cv-mobile-accordion-list">
//                     {POPULAR_COURSES.map((c) => (
//                       <a href={c.href} key={c.href} onClick={() => setMenuOpen(false)}>
//                         <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={13} /></span>
//                         {c.label}
//                       </a>
//                     ))}
//                     <a href="/courses" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
//                       View all courses <ArrowRight size={13} />
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {/* Universities accordion */}
//               <div className={`cv-mobile-accordion ${mobileAccordion === "universities" ? "is-open" : ""}`}>
//                 <button
//                   className="cv-mobile-accordion-head"
//                   onClick={() => setMobileAccordion(mobileAccordion === "universities" ? null : "universities")}
//                 >
//                   Universities <ChevronDown size={16} className="cv-chevron" />
//                 </button>
//                 <div className="cv-mobile-accordion-panel">
//                   <div className="cv-mobile-accordion-list">
//                     {TOP_UNIVERSITIES.map((u) => (
//                       <a href={u.href} key={u.href} onClick={() => setMenuOpen(false)}>
//                         <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={13} /></span>
//                         {u.label}
//                       </a>
//                     ))}
//                     <a href="/universities" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
//                       View all universities <ArrowRight size={13} />
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {NAV_LINKS.map((link) => (
//                 <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
//               ))}
//               <a href="/resources" onClick={() => setMenuOpen(false)}>Resources</a>
//               <div className="cv-mobile-drawer-actions">
//                 <button className="cv-btn-solid" onClick={() => (window.location.href = "/contact")}>Contact us</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* hero */}
//       <div className=" cv-hero">
//         <img className="cv-hero-bg" src={HERO_BG_IMG} alt="" aria-hidden="true" />
//         <div className="cv-hero-top">
//           <div className="cv-animate">
//             <div className="cv-badge">Choose your path</div>
//             <h1 className="cv-h1">Every journey needs the <em>right</em> direction</h1>
//             <p className="cv-hero-sub">
//               One platform, two powerful experiences. Choose the path that's right for you
//               and take the next step towards your future.
//             </p>
//           </div>
//         </div>

//         <div className="cv-path-wrap cv-animate" style={{ animationDelay: "0.15s" }}>
//           <div className="cv-path-grid">
//             <div
//               className={`cv-path-card career ${hovered === "career" ? "is-hover" : ""}`}
//               onMouseEnter={() => setHovered("career")}
//               onMouseLeave={() => setHovered(null)}
//             >
//               <div className="cv-path-content">
//                 <div className="cv-path-kicker">For professionals</div>
//                 <h2 className="cv-path-title">Career</h2>
//                 <p className="cv-path-desc">
//                   Find the right opportunities, connect with top employers and take the next step in your career.
//                 </p>
//               <ul className="cv-path-list">
//   <li>
//     <span className="cv-path-list-icon">
//       <Briefcase size={13} />
//     </span>
//     Latest Job Openings
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <Sparkles size={13} />
//     </span>
//     AI Job Recommendations
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <GraduationCap size={13} />
//     </span>
//     AI Course Suggestions
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <FileText size={13} />
//     </span>
//     AI Resume Analysis
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <ShieldCheck size={13} />
//     </span>
//     Placement Assistance
//   </li>
// </ul>
//                 <button className="cv-path-cta" onClick={() => (window.location.href = CAREER_URL)}>
//                   Go to Career <ArrowRight size={15} />
//                 </button>
//               </div>
//             </div>

//             <div className="cv-path-or">
//               <div className="cv-path-or-inner">
//                 <img src={LOGO_SRC} alt="CareerVidya logo" />
//               </div>
//             </div>

//             <div
//               className={`cv-path-card vidya ${hovered === "vidya" ? "is-hover" : ""}`}
//               onMouseEnter={() => setHovered("vidya")}
//               onMouseLeave={() => setHovered(null)}
//             >
//               <div className="cv-path-content">
//                 <div className="cv-path-kicker">For students</div>
//                 <h2 className="cv-path-title">Vidya</h2>
//                 <p className="cv-path-desc">
//                   Explore courses, compare universities, get expert guidance and build your dream career.
//                 </p>
//               <ul className="cv-path-list">
//   <li>
//     <span className="cv-path-list-icon">
//       <Compass size={13} />
//     </span>
//     Free Career Counselling
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <BookOpen size={13} />
//     </span>
//     24×7 LMS Access
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <Award size={13} />
//     </span>
//     Free Coursera Certificate
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <Wallet size={13} />
//     </span>
//     No-Cost EMI Available
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <BriefcaseBusiness size={13} />
//     </span>
//     100% Job Assistance
//   </li>
// </ul>
//                 <button className="cv-path-cta" onClick={() => (window.location.href = VIDYA_URL)}>
//                   Enter Vidya <ArrowRight size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trending jobs / trending courses — matches "Explore Top Job Opportunities" and
//           "Explore Top Courses & Universities" style, with stat chips, filters and rich cards */}
//       <div className="cv-container cv-trending">
//         <div className="cv-trending-grid">
//           {/* JOBS COLUMN */}
//           <div className="cv-trending-col jobs">
//             <div className="cv-trending-headrow">
//               <div className="cv-trending-headrow-icon"><Briefcase size={17} /></div>
//               <div className="cv-trending-headtext">
//                 <div className="cv-trending-title-lg">
//                   Explore Top <span className="accent-gold">Job Opportunities</span>
//                 </div>
//                 <div className="cv-trending-caption">Find the perfect job that matches your skills and build your dream career.</div>
//               </div>
//               <a href={`${CAREER_URL}/jobs`} className="cv-trending-viewall">View all jobs <ArrowUpRight size={12} /></a>
//             </div>

//             <div className="cv-trending-stats">
//               {JOB_STATS.map((s) => (
//                 <div className="cv-trending-stat" key={s.label}>
//                   <div className="cv-trending-stat-icon"><s.icon size={13} /></div>
//                   <div>
//                     <div className="cv-trending-stat-num">{s.num}</div>
//                     <div className="cv-trending-stat-label">{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="cv-trending-firelabel">🔥 Trending Jobs</div>
//             <div className="cv-trending-filters">
//               {JOB_FILTERS.map((f) => (
//                 <button
//                   key={f}
//                   className={`cv-filter-pill ${jobFilter === f ? "is-active" : ""}`}
//                   onClick={() => setJobFilter(f)}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>

//             <div className="cv-trending-stack">
//               {TRENDING_JOBS.map((j) => (
//                 <div className="cv-trending-card" key={j.title}>
//                   <div className="cv-trending-logo" style={{ background: `${j.mono}1a`, color: j.mono }}>
//                     {j.logo ? <img src={j.logo} alt={j.company} /> : j.short}
//                   </div>
//                   <div className="cv-trending-info">
//                     <div className="cv-trending-title-row">
//                       <span className="cv-trending-title">{j.title}</span>
//                       {j.isNew && <span className="cv-new-badge">New</span>}
//                     </div>
//                     <div className="cv-trending-org">{j.company}</div>
//                     <div className="cv-trending-sub">
//                       <span><MapPin size={11} style={{ verticalAlign: "-2px" }} /> {j.location}</span>
//                       <span className="dot"></span>
//                       <span>{j.workMode}</span>
//                       <span className="dot"></span>
//                       <span><Clock size={11} style={{ verticalAlign: "-2px" }} /> {j.exp}</span>
//                     </div>
//                   </div>
//                   <div className="cv-trending-right">
//                     <span className="cv-trending-price">{j.salary}</span>
//                     <button className="cv-trending-cta" onClick={() => (window.location.href = CAREER_URL)}>
//                       Apply Now
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="cv-trending-more" onClick={() => (window.location.href = `${CAREER_URL}/jobs`)}>
//               View all jobs <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
//             </button>
//           </div>

//           {/* COURSES COLUMN */}
//           <div className="cv-trending-col courses">
//             <div className="cv-trending-headrow">
//               <div className="cv-trending-headrow-icon"><GraduationCap size={17} /></div>
//               <div className="cv-trending-headtext">
//                 <div className="cv-trending-title-lg">
//                   Explore Top <span className="accent-teal">Courses &amp; Universities</span>
//                 </div>
//                 <div className="cv-trending-caption">Discover the best courses and top universities to shape your future.</div>
//               </div>
//               <a href="/courses" className="cv-trending-viewall">View all courses <ArrowUpRight size={12} /></a>
//             </div>

//             <div className="cv-trending-stats">
//               {COURSE_STATS.map((s) => (
//                 <div className="cv-trending-stat" key={s.label}>
//                   <div className="cv-trending-stat-icon"><s.icon size={13} /></div>
//                   <div>
//                     <div className="cv-trending-stat-num">{s.num}</div>
//                     <div className="cv-trending-stat-label">{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="cv-trending-firelabel">🔥 Trending Courses</div>
//             <div className="cv-trending-filters">
//               {COURSE_FILTERS.map((f) => (
//                 <button
//                   key={f}
//                   className={`cv-filter-pill ${courseFilter === f ? "is-active" : ""}`}
//                   onClick={() => setCourseFilter(f)}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>

//             <div className="cv-trending-stack">
//               {TRENDING_COURSES_HOME.map((c) => (
//                 <div className="cv-trending-card" key={c.title}>
//                   <div className="cv-trending-logo" style={{ background: `${c.mono}1a`, color: c.mono }}>{c.short}</div>
//                   <div className="cv-trending-info">
//                     <div className="cv-trending-title-row">
//                       <span className="cv-trending-title">{c.title}</span>
//                     </div>
//                     <div className="cv-trending-org">{c.sub}</div>
//                     <div className="cv-trending-sub">
//                       <span>{c.university}</span>
//                       <span className="dot"></span>
//                       <span><Clock size={11} style={{ verticalAlign: "-2px" }} /> {c.duration}</span>
//                     </div>
//                   </div>
//                   <div className="cv-trending-right">
//                     <span className="cv-trending-price">{c.fee}</span>
//                     <button className="cv-trending-cta" onClick={() => (window.location.href = c.href)}>
//                       Apply Now
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="cv-trending-more" onClick={() => (window.location.href = "/courses")}>
//               View all courses <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
//             </button>
//           </div>
//         </div>

//       </div>
//       <div className="cv-quick-actions">
//         <div className="cv-quickgrid">
//           {QUICK_ACTIONS.filter((a) => a.title !== "Scholarship Checker").map((a) => (
//             <div className="cv-quick-card" key={a.title}>
//               <div className="cv-quick-card-copy">
//                 <div className="cv-quick-title">{a.title}</div>
//                 <p className="cv-quick-desc">{a.desc}</p>
//               </div>
//               <div className="cv-quick-image">
//                 <img src={a.img} alt={a.title} />
//               </div>
//               <button className="cv-quick-cta" style={{ background: a.color }} onClick={() => (window.location.href = a.href)}>
//                 {a.cta}
//               </button>
//             </div>
//           ))}
//           <div className="cv-quick-card help">
//             <div>
//               <div className="cv-quick-title">Need Help? Talk to an Expert</div>
//               <div className="cv-quick-desc">Get instant guidance for your career</div>
//             </div>
//             <div className="cv-quick-help-row">
//               <a className="cv-quick-help-link" href="tel:9289716667"><span>9289716667</span></a>
//               <a className="cv-btn-whatsapp" href="https://wa.me/9289716667" target="_blank" rel="noreferrer">
//                 Chat on WhatsApp
//               </a>
//             </div>
//             <div className="cv-quick-image">
//               <img src="/images/a5.png" alt="Support agent" />
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* stats bar */}
//       <div className="cv-container cv-stats-bar">
//         <div className="cv-stats-box cv-animate" style={{ animationDelay: "0.25s" }}>
//           <div className="cv-stat">
//             <div className="cv-stat-icon"><Users size={18} /></div>
//             <div>
//               <div className="cv-stat-num">1,00000+</div>
//               <div className="cv-stat-label">Students guided</div>
//             </div>
//           </div>
//           <div className="cv-stat">
//             <div className="cv-stat-icon"><Building2 size={18} /></div>
//             <div>
//               <div className="cv-stat-num">1,500+</div>
//               <div className="cv-stat-label">Universities & colleges</div>
//             </div>
//           </div>
//           <div className="cv-stat">
//             <div className="cv-stat-icon"><Briefcase size={18} /></div>
//             <div>
//               <div className="cv-stat-num">10,000+</div>
//               <div className="cv-stat-label">Job opportunities</div>
//             </div>
//           </div>
//           <div className="cv-stat">
//             <div className="cv-stat-icon"><Users size={18} /></div>
//             <div>
//               <div className="cv-stat-num">15000+</div>
//               <div className="cv-stat-label">Happy professionals</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* features strip */}
//       <div className="cv-container cv-features">
//         <div className="cv-features-box">
//           <div className="cv-features-head">
//             <div className="cv-features-kicker">Everything you need, all in one place</div>
//           </div>
//           <div className="cv-features-grid">
//             {FEATURES.map((f) => (
//               <div className="cv-feature" key={f.title}>
//                 <div className="cv-feature-icon" style={{ background: f.tint, color: f.color }}>
//                   <f.icon size={18} />
//                 </div>
//                 <div className="cv-feature-title">{f.title}</div>
//                 <div className="cv-feature-desc">{f.desc}</div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* popular courses */}
//       <div className="cv-container cv-courses">
//         <div className="cv-section-kicker">Popular courses</div>
//         <h2 className="cv-section-h2">Build skills. Shape tomorrow.</h2>
//         <div className="cv-courses-grid">
//           {COURSES.map((c) => (
//             <div className="cv-course-card" key={c.name}>
//               <div className="cv-course-icon" style={{ background: `${c.color}22`, color: c.color }}><c.icon size={20} /></div>
//               <div className="cv-course-tag" style={{ color: c.color }}>High demand</div>
//               <div className="cv-course-name">{c.name}</div>
//               <div className="cv-course-unis">{c.unis}</div>
//               <a className="cv-course-link" href="#">Explore <ArrowUpRight size={13} /></a>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* counselling banner */}
//       <div className="cv-container cv-counsel">
//         <div className="cv-counsel-box">
//           <div className="cv-counsel-text">
//             <h3 className="cv-counsel-h3">Not sure where to start?</h3>
//             <p className="cv-counsel-p">Get free career counselling and guidance from our expert counsellors.</p>
//             <button className="cv-counsel-cta" onClick={() => (window.location.href = "/counselling")}>
//               Book free counselling <ArrowRight size={16} />
//             </button>
//           </div>
//           <div className="cv-counsel-photo">
//             <img src={COUNSELLING_IMG} alt="Counsellor guiding students" />
//           </div>
//         </div>
//       </div>

//       {/* trusted partners */}
//       <div className="cv-partners-wrap">
//         <div className="cv-container">
//           <div className="cv-partners-box">
//             <div className="cv-partners-kicker">Trusted by students & 1,000+ university partners</div>
//             <div className="cv-partners-marquee">
//               <div className="cv-partners-track">
//                 {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
//                   <div className="cv-partner-logo" key={`${p.name}-${i}`}>
//                     <span className="cv-partner-logo-icon" style={{ background: p.tint, color: p.color }}>
//                       <p.icon size={16} />
//                     </span>
//                     <span className="cv-partner-logo-name">{p.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//  <FAQ />
//       {/* footer */}
//       <div className="cv-container">
//         <footer className="cv-footer">
//           <div className="cv-footer-grid">
//             <div>
//               <div className="cv-logo">
//                 <div className="cv-logo-mark"><img src={LOGO_SRC} alt="CareerVidya logo" /></div>
//                 <div className="cv-logo-word">Career<span>Vidya</span></div>
//               </div>
//               <p className="cv-footer-desc">
//                 CareerVidya is India's platform for choosing the right career, course, and university —
//                 and for finding the right talent.
//               </p>
//               <div className="cv-footer-social">
//                 <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
//                 <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
//                 <a href="#" aria-label="LinkedIn"><Linkedin size={15} /></a>
//                 <a href="#" aria-label="YouTube"><Youtube size={15} /></a>
//               </div>
//             </div>
//             <div>
//               <div className="cv-footer-h4">For students</div>
//               <div className="cv-footer-links">
//                 <a href="#">Courses</a>
//                 <a href="#">Universities</a>
//                 <a href="#">Career test</a>
//                 <a href="#">Scholarships</a>
//                 <a href="#">Counselling</a>
//               </div>
//             </div>
//             <div>
//               <div className="cv-footer-h4">For recruiters</div>
//               <div className="cv-footer-links">
//                 <a href="#">Post a job</a>
//                 <a href="#">Find candidates</a>
//                 <a href="#">Pricing</a>
//                 <a href="#">Employer login</a>
//               </div>
//             </div>  
//             <div>
//               <div className="cv-footer-h4">Stay updated</div>
//               <p className="cv-footer-desc" style={{ margin: "0 0 10px" }}>Get the latest courses and career tips.</p>
//               <div className="cv-newsletter-row">
//                 <input type="email" placeholder="Enter your email" />
//                 <button aria-label="Subscribe"><Send size={15} /></button>
//               </div>
//             </div>
//           </div>
//           <div className="cv-footer-bottom">
//             <span>© 2026 CareerVidya. All rights reserved.</span>
//             <span>Terms & conditions · Privacy policy</span>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useRef } from "react";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   GraduationCap,
//   Briefcase,
//   Compass,
//   Building2,
//   BookOpen,
//   Sparkles,
//   Wallet,
//   FileText,
//   Users,
//   ChevronDown,
//   TrendingUp,
//   Cpu,
//   ShieldCheck,
//   Cloud,
//   Megaphone,
//   Send,
//   Facebook,
//   Instagram,
//   Linkedin,
//   Youtube,
//   Menu,
//   X,
//   Award,
//   BriefcaseBusiness,
//   Landmark,
//   School,
//   Globe2,
//   BadgeCheck,
//   Library,
//   MapPin,
//   Clock,
//   Zap,
//   Phone,
//   MessageCircle,
// } from "lucide-react";
// import FAQ from "../app/components/FAQ";
// import Quickaction from "@/app/components/Quickaction";

// const VIDYA_URL = "/Home";
// const CAREER_URL = "http://localhost:3001";
// const LOGO_SRC = "/images/n12.png";
// const HERO_BG_IMG = "/images/testing4.jpeg";
// const VIDYA_IMG = "/images/test3.jpeg";
// const CAREER_IMG = "/images/test2.jpeg";
// const COUNSELLING_IMG = "/images/career1.jpeg";

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

// const NAV_LINKS = [
//   { label: "Counselling", href: "/counselling" },
//   { label: "Scholarships", href: "/scholarships" },
// ];

// const COURSES = [
//   { icon: TrendingUp, name: "Data science", unis: "120+ universities", color: "#2f6fed" },
//   { icon: Cpu, name: "Artificial intelligence", unis: "95+ universities", color: "#06b6d4" },
//   { icon: ShieldCheck, name: "Cyber security", unis: "85+ universities", color: "#f5a623" },
//   { icon: Cloud, name: "Cloud computing", unis: "75+ universities", color: "#3b82f6" },
//   { icon: Megaphone, name: "Digital marketing", unis: "60+ universities", color: "#a855f7" },
// ];

// const PARTNERS = ["IIT", "Amity University", "LPU", "Chandigarh University", "UPES"];

// // ---- Trusted partner logos (used by the auto-scrolling logo slider) ----
// const PARTNER_LOGOS = [
//   { name: "Amity University", icon: Landmark, color: "#2f5c8a", tint: "#e6eef6" },
//   { name: "LPU Online", icon: Building2, color: "#0d9488", tint: "#e3f4f1" },
//   { name: "Manipal University", icon: School, color: "#c15304", tint: "#fef3e2" },
//   { name: "Chandigarh University", icon: Landmark, color: "#6366f1", tint: "#eceafd" },
//   { name: "SRM University", icon: Building2, color: "#e11d6f", tint: "#fde8ee" },
//   { name: "DY Patil University", icon: School, color: "#8b5cf6", tint: "#efe9fd" },
//   { name: "Chitkara University", icon: Landmark, color: "#e8935a", tint: "#fbeadf" },
//   { name: "Sharda University", icon: School, color: "#0d9488", tint: "#e3f4f1" },
//   { name: "UPES", icon: Globe2, color: "#c15304", tint: "#fef3e2" },
//   { name: "Jain University", icon: Building2, color: "#2f5c8a", tint: "#e6eef6" },
//   { name: "Birla Institute of Technology", icon: Library, color: "#6366f1", tint: "#eceafd" },
//   { name: "IIT", icon: BadgeCheck, color: "#e11d6f", tint: "#fde8ee" },
// ];

// // ---- Trending jobs (send user to the Career portal) ----
// const JOB_STATS = [
//   { icon: Briefcase, num: "25,000+", label: "Active jobs" },
//   { icon: Building2, num: "3,500+", label: "Hiring companies" },
//   { icon: Users, num: "1,20,000+", label: "Candidates placed" },
//   { icon: Zap, num: "500+", label: "Jobs posted today" },
// ];

// const JOB_FILTERS = ["All", "IT & Software", "Marketing", "Sales", "Design", "More"];

// const TRENDING_JOBS = [
//   {
//     title: "Software Engineer",
//     company: "HCL Technologies",
//     short: "HCL",
//     logo: "/images/hcl2.jpeg",
//     mono: "#e11d48",
//     location: "Bangalore",
//     workMode: "Full-time",
//     exp: "2-5 Yrs",
//     salary: "₹6 - 12 LPA",
//     isNew: true,
//     href: `${CAREER_URL}/jobs/software-engineer`,
//   },
//   {
//     title: "System Engineer",
//     company: "Infosys Limited",
//     short: "IN",
//     logo: "/images/inf1.jpeg",
//     mono: "#2563eb",
//     location: "Hyderabad",
//     workMode: "Full-time",
//     exp: "1-3 Yrs",
//     salary: "₹4 - 8 LPA",
//     isNew: true,
//     href: `${CAREER_URL}/jobs/system-engineer`,
//   },
//   {
//     title: "Associate Product Manager",
//     company: "samsung",
//     short: "a",
//     logo: "/images/sum.jpeg",
//     mono: "#f59e0b",
//     location: "Delhi NCR",
//     workMode: "Full-time",
//     exp: "3-6 Yrs",
//     salary: "₹12 - 20 LPA",
//     isNew: false,
//     href: `${CAREER_URL}/jobs/associate-product-manager`,
//   },
// ];

// // ---- Trending courses (stay on this website) ----
// const COURSE_STATS = [
//   { icon: BookOpen, num: "10,000+", label: "Courses available" },
//   { icon: Building2, num: "300+", label: "Top universities" },
//   { icon: Award, num: "50+", label: "Specializations" },
//   { icon: Users, num: "5,00,000+", label: "Students enrolled" },
// ];

// const COURSE_FILTERS = ["All", "Management", "Engineering", "IT", "Design", "More"];

// const TRENDING_COURSES_HOME = [
//   {
//     title: "MBA",
//     sub: "Master of Business Administration",
//     university: "Amity University",
//     short: "AU",
//     mono: "#8b5cf6",
//     duration: "2 Years",
//     fee: "₹2.5 - 15 LPA",
//     href: "/course/online-mba-1",
//   },
//   {
//     title: "B.Tech Computer Science",
//     sub: "Bachelor of Technology",
//     university: "LPU Online",
//     short: "LPU",
//     mono: "#0d9488",
//     duration: "4 Years",
//     fee: "₹1.2 - 6 LPA",
//     href: "/course/btech-bachelors-of-technology",
//   },
//   {
//     title: "BCA",
//     sub: "Bachelor of Computer Applications",
//     university: "Chandigarh University",
//     short: "CU",
//     mono: "#2563eb",
//     duration: "3 Years",
//     fee: "₹80K - 3 LPA",
//     href: "/course/online-bca-bachelor-of-computer-applications",
//   },
// ];

// export default function CareerVidyaHome() {
//   const [hovered, setHovered] = useState(null); // 'vidya' | 'career' | null
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [navDropdown, setNavDropdown] = useState(null); // 'courses' | 'universities' | null
//   const [mobileAccordion, setMobileAccordion] = useState(null); // 'courses' | 'universities' | null
//   const [jobFilter, setJobFilter] = useState("All");
//   const [courseFilter, setCourseFilter] = useState("All");
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
//     <div className="cv-root">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

//         * { box-sizing: border-box; }

//         .cv-root {
//           --ink: #0d1b2e;
//           --muted: #5b677e;
//           --line: rgba(13,27,46,0.1);
//           --teal: #0056B3;
//           --teal-deep: #0056B3;
//           --teal-tint: #e3f4f1;
//           --gold: #c15304;
//           --gold-deep: #c15304;
//           --gold-tint: #fef3e2;
//           --surface: #ffffff;
//           --panel: #ffffff;
//           font-family: 'Inter', sans-serif;
//           color: var(--ink);
//           background: var(--surface);
//         }

//         a { text-decoration: none; color: inherit; }
//         button { font-family: inherit; }

//         .cv-container { max-width: 1180px; margin: 0 auto; padding: 0 20px; }
//         @media (min-width: 640px) { .cv-container { padding: 0 32px; } }

//         /* header spans wider with tighter side padding so it doesn't look boxed-in */
//         .cv-header-wrap .cv-container { max-width: 1440px; padding: 0 16px; }
//         @media (min-width: 640px) { .cv-header-wrap .cv-container { padding: 0 24px; } }

//         /* header */
//         .cv-header-wrap {
//           position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.92);
//           backdrop-filter: blur(10px); transition: box-shadow 0.25s ease;
//         }
//         .cv-header-wrap.is-scrolled { box-shadow: 0 4px 24px -8px rgba(0,0,0,0.5); }
//         .cv-header {
//           display: flex; align-items: center; justify-content: space-between;
//           padding: 16px 0; border-bottom: 1px solid var(--line);
//         }
//         @media (min-width: 640px) { .cv-header { padding: 2px 0; } }
//         .cv-logo { display: flex; align-items: center; gap: 10px; }
//         .cv-logo-mark {
//           width: 34px; height: 34px; /* border-radius: 50%; */ overflow: hidden;
//           /* border: 1.5px solid var(--gold); */ background: #fff;
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         @media (min-width: 640px) { .cv-logo-mark { width: 136px; height: 86px; } }
//         .cv-logo-mark img { width: 100%; height: 100%; object-fit: cover; display: block; }
//         .cv-logo-text { line-height: 1.1; }
//         .cv-logo-word { font-family: 'Inter', sans-serif; font-size: 16px; font-weight: 500; letter-spacing: 0.1px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-logo-word { font-size: 18px; } }
//         .cv-logo-word span { color: var(--gold); font-style: italic; font-weight: 600; }
//         .cv-logo-tag { display: none; font-size: 9px; letter-spacing: 0.8px; color: var(--muted); text-transform: uppercase; }
//         @media (min-width: 640px) { .cv-logo-tag { display: block; } }

//         .cv-nav { display: none; align-items: center; gap: 30px; font-size: 14.5px; font-weight: 500; color: var(--ink); }
//         .cv-nav a:hover { color: var(--gold); }
//         .cv-nav-more { display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
//         @media (min-width: 900px) { .cv-nav { display: flex; } }

//         /* nav dropdown trigger */
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

//         /* hero */
//         .cv-hero {
//           padding: 32px 0 24px; text-align: center; position: relative; overflow: hidden;
//         }
//         @media (min-width: 640px) { .cv-hero { padding: 44px 0 32px; } }
//         .cv-hero-bg {
//           position: absolute; top: 0; left: 50%; transform: translateX(-50%);
//           width: 100vw; height: 100%;
//           object-fit: cover; object-position: center top;
//           opacity: 0.68; pointer-events: none; z-index: 0;
//           mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
//           -webkit-mask-image: linear-gradient(to bottom, black 40%, transparent 100%);
//         }
//         .cv-hero-top { position: relative; }
//         .cv-hero-top > * { position: relative; z-index: 1; }
//         .cv-path-wrap { z-index: 1; }
//         .cv-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           font-size: 11.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-deep);
//           margin-bottom: 14px;
//         }
//         .cv-h1 {
//           font-family: 'Inter', sans-serif; font-size: clamp(28px, 6.4vw, 44px); font-weight: 600;
//           line-height: 1.18; letter-spacing: -0.6px; margin: 0 0 16px; color: var(--ink);
//         } 
//         .cv-h1 em { font-style: italic; color: var(--teal); }
//         .cv-hero-sub {
//           color: var(--muted); font-size: 14.5px; line-height: 1.7; max-width: 560px;
//           margin: 0 auto 32px;
//         }
//         @media (min-width: 640px) { .cv-hero-sub { font-size: 15.5px; margin: 0 auto 40px; } }

//         @keyframes cv-rise {
//           from { opacity: 0; transform: translateY(14px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         .cv-animate { animation: cv-rise 0.6s cubic-bezier(.2,.8,.2,1) both; }

//         /* choose your path — two side-by-side panels with a logo divider */
//         .cv-path-wrap { position: relative; max-width: 980px; margin: 0 auto; }
//         .cv-path-grid {
//           display: grid; grid-template-columns: 1fr; gap: 16px; text-align: left; align-items: stretch;
//         }
//         @media (min-width: 860px) { .cv-path-grid { grid-template-columns: 1fr 1fr; gap: 88px; } }

//         .cv-path-or {
//           display: none;
//         }
//         @media (min-width: 860px) {
//           .cv-path-or {
//             display: flex; align-items: center; justify-content: center;
//             position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
//             width: 98px; height: 98px; border-radius: 50%;
//             background: linear-gradient(155deg, #ffffff 0%, var(--teal-tint) 55%, var(--gold-tint) 100%);
//             border: 3px solid #ffffff;
//             box-shadow:
//               0 22px 44px -14px rgba(13,27,46,0.32),
//               0 8px 18px -6px rgba(0,86,179,0.18),
//               0 0 0 1px var(--line);
//             z-index: 3; overflow: visible; padding: 0;
//             transition: transform 0.3s cubic-bezier(.2,.8,.2,1), box-shadow 0.3s ease;
//           }
//           .cv-path-or::before {
//             content: "";
//             position: absolute; inset: -10px; border-radius: 50%;
//             background: radial-gradient(circle, rgba(0,86,179,0.10) 0%, rgba(193,83,4,0.08) 55%, transparent 75%);
//             z-index: -1;
//           }
//           .cv-path-or:hover {
//             transform: translate(-50%, -50%) scale(1.06);
//             box-shadow:
//               0 28px 54px -14px rgba(13,27,46,0.4),
//               0 10px 22px -6px rgba(0,86,179,0.24),
//               0 0 0 1px var(--line);
//           }
//           .cv-path-or-inner {
//             width: 100%; height: 100%; border-radius: 50%; overflow: hidden;
//             display: flex; align-items: center; justify-content: center;
//             background: #fff; padding: 6px;
//             box-shadow: inset 0 0 0 1px var(--line);
//           }
//         }
//         .cv-path-or img { width: 100%; height: 100%; object-fit: cover; border-radius: 50%; display: block; }

//         .cv-path-card {
//           border-radius: 16px; padding: 20px 20px; border: 1px solid var(--line); background: #fff;
//           display: flex; flex-direction: row; align-items: center; gap: 16px;
//           position: relative; overflow: hidden;
//           transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease, border-color 0.25s ease;
//         }
//         .cv-path-card.is-hover { transform: translateY(-3px); }
//         .cv-path-card.vidya.is-hover {
//           box-shadow: 0 16px 32px -18px rgba(13,148,136,0.3);
//           background: linear-gradient(135deg, var(--teal-tint) 0%, #ffffff 45%, var(--gold-tint) 100%);
//           border-color: rgba(0,86,179,0.55);
//         }
//         .cv-path-card.career.is-hover {
//           box-shadow: 0 16px 32px -18px rgba(245,166,35,0.35);
//           background: linear-gradient(135deg, var(--gold-tint) 0%, #ffffff 45%, var(--teal-tint) 100%);
//           border-color: rgba(193,83,4,0.55);
//         }

//         .cv-path-content { flex: 1; min-width: 0; display: flex; flex-direction: column; position: relative; z-index: 1; }

//         .cv-path-media {
//           flex: 0 0 clamp(120px, 30%, 190px);
//           align-self: flex-end;
//           display: flex; align-items: flex-end; justify-content: center;
//           order: -1;
//         }
//         .cv-path-card.career .cv-path-media { order: 2; }

//         .cv-path-media img {
//           width: 100%;
//           height: auto;
//           max-height: 190px;
//           object-fit: contain;
//           display: block;
//         }
//         @media (max-width: 480px) {
//           .cv-path-media { flex-basis: 90px; }
//           .cv-path-media img { max-height: 120px; }
//         }

//         .cv-path-kicker {
//           font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; margin-bottom: 6px;
//         }
//         .cv-path-card.vidya .cv-path-kicker { color: var(--teal); }
//         .cv-path-card.career .cv-path-kicker { color: var(--gold-deep); }

//         .cv-path-title { font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 700; margin: 0 0 8px; color: var(--ink); }
//         .cv-path-desc { color: var(--muted); font-size: 12.5px; line-height: 1.6; margin: 0 0 14px; max-width: 300px; }

//         .cv-path-list { list-style: none; margin: 0 0 16px; padding: 12px 0 0; border-top: 1px solid var(--line); display: flex; flex-direction: column; gap: 8px; }
//         .cv-path-list li { display: flex; align-items: center; gap: 8px; font-size: 12.5px; font-weight: 500; color: var(--ink); }
//         .cv-path-list .cv-path-list-icon {
//           width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cv-path-card.vidya .cv-path-list-icon { background: var(--teal-tint); color: var(--teal); }
//         .cv-path-card.career .cv-path-list-icon { background: var(--gold-tint); color: var(--gold-deep); }

//         .cv-path-cta {
//           display: inline-flex; align-items: center; justify-content: center; gap: 6px; font-weight: 600; font-size: 13px;
//           padding: 10px 16px; border-radius: 8px; border: none; cursor: pointer; margin-top: auto;
//         }
//         .cv-path-card.vidya .cv-path-cta { background: var(--teal); color: #fff; }
//         .cv-path-card.career .cv-path-cta { background: var(--gold); color: #2a1804; }

//         /* ============ Trending jobs / trending courses section ============ */
//         .cv-trending { padding: 30px 0 12px; }
//         .cv-trending-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
//         @media (min-width: 900px) { .cv-trending-grid { grid-template-columns: 1fr 1fr; gap: 22px; } }

//         .cv-trending-col {
//           border: 1px solid var(--line); border-radius: 18px; padding: 18px;
//           background: var(--panel);
//           display: flex; flex-direction: column;
//         }

//         .cv-trending-headrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
//         .cv-trending-headrow-icon {
//           width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cv-trending-col.jobs .cv-trending-headrow-icon { background: var(--gold-tint); color: var(--gold-deep); }
//         .cv-trending-col.courses .cv-trending-headrow-icon { background: var(--teal-tint); color: var(--teal-deep); }
//         .cv-trending-headtext { flex: 1; min-width: 0; }
//         .cv-trending-title-lg { font-family: 'Inter', sans-serif; font-size: 17.5px; font-weight: 600; color: var(--ink); }
//         .cv-trending-title-lg .accent-gold { color: var(--gold-deep); }
//         .cv-trending-title-lg .accent-teal { color: var(--teal-deep); }
//         .cv-trending-caption { font-size: 12px; color: var(--muted); margin-top: 2px; }
//         .cv-trending-viewall {
//           font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; padding-top: 8px;
//           display: inline-flex; align-items: center; gap: 3px;
//         }
//         .cv-trending-viewall:hover { color: var(--ink); }

//         /* stat mini grid */
//         .cv-trending-stats {
//           display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;
//           margin: 14px 0 16px;
//         }
//         @media (max-width: 420px) { .cv-trending-stats { grid-template-columns: repeat(2, 1fr); } }
//         .cv-trending-stat {
//           border: 1px solid var(--line); border-radius: 12px; padding: 9px 8px;
//           display: flex; flex-direction: column; gap: 5px; background: #fbfbfc;
//         }
//         .cv-trending-stat-icon {
//           width: 22px; height: 22px; border-radius: 7px; display: flex; align-items: center; justify-content: center;
//         }
//         .cv-trending-col.jobs .cv-trending-stat-icon { background: var(--gold-tint); color: var(--gold-deep); }
//         .cv-trending-col.courses .cv-trending-stat-icon { background: var(--teal-tint); color: var(--teal-deep); }
//         .cv-trending-stat-num { font-weight: 700; font-size: 13px; color: var(--ink); line-height: 1.1; }
//         .cv-trending-stat-label { font-size: 10.5px; color: var(--muted); line-height: 1.3; }

//         /* fire label + filter pills */
//         .cv-trending-firelabel {
//           font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 10px;
//         }
//         .cv-trending-filters {
//           display: flex; gap: 6px; overflow-x: auto; margin-bottom: 14px; padding-bottom: 2px;
//           scrollbar-width: none;
//         }
//         .cv-trending-filters::-webkit-scrollbar { display: none; }
//         .cv-filter-pill {
//           font-size: 11.5px; font-weight: 600; padding: 6px 12px; border-radius: 999px; border: 1px solid var(--line);
//           background: #fff; color: var(--muted); white-space: nowrap; cursor: pointer; flex-shrink: 0;
//           transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
//         }
//         .cv-trending-col.jobs .cv-filter-pill.is-active { background: var(--gold); border-color: var(--gold); color: #2a1804; }
//         .cv-trending-col.courses .cv-filter-pill.is-active { background: var(--teal); border-color: var(--teal); color: #fff; }

//         .cv-trending-stack { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
//         .cv-trending-card {
//           display: flex; align-items: center; gap: 12px; padding: 12px;
//           border: 1px solid var(--line); border-radius: 14px; transition: border-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease;
//         }
//         .cv-trending-card:hover { border-color: rgba(13,27,46,0.2); transform: translateY(-2px); box-shadow: 0 10px 22px -16px rgba(13,27,46,0.35); }
//         .cv-trending-logo {
//           width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0; font-weight: 700; font-size: 13px; text-transform: uppercase; overflow: hidden;
//         }
//         .cv-trending-logo img { width: 100%; height: 100%; object-fit: contain; display: block; }
//         .cv-trending-info { flex: 1; min-width: 0; }
//         .cv-trending-title-row { display: flex; align-items: center; gap: 6px; }
//         .cv-trending-title { font-size: 13.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .cv-new-badge {
//           font-size: 9.5px; font-weight: 700; color: #0d9488; background: #e3f4f1; border-radius: 999px;
//           padding: 1.5px 7px; flex-shrink: 0;
//         }
//         .cv-trending-org { font-size: 12px; color: var(--muted); margin-top: 1px; }
//         .cv-trending-sub { font-size: 11px; color: var(--muted); margin-top: 3px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
//         .cv-trending-sub .dot::before { content: "·"; margin: 0 1px; }
//         .cv-trending-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
//         .cv-trending-price { font-size: 12.5px; font-weight: 700; }
//         .cv-trending-col.jobs .cv-trending-price { color: #0d9488; }
//         .cv-trending-col.courses .cv-trending-price { color: var(--teal-deep); }
//         .cv-trending-cta {
//           font-size: 11.5px; font-weight: 700; padding: 7px 13px; border-radius: 8px; border: none;
//           display: inline-flex; align-items: center; gap: 4px; cursor: pointer; white-space: nowrap; flex-shrink: 0;
//         }
//         .cv-trending-col.jobs .cv-trending-cta { background: var(--teal); color: #fff; }
//         .cv-trending-col.courses .cv-trending-cta { background: var(--gold); color: #2a1804; }

//         .cv-trending-more {
//           width: 100%; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink);
//           padding: 11px; border-radius: 10px; border: 1px dashed var(--line); background: #fff; cursor: pointer;
//           margin-top: auto;
//         }
//         .cv-trending-more:hover { border-color: var(--ink); }

//         /* quick action strip */
//         .cv-quick-actions {
//           max-width: 1440px;
//           margin: 0 auto;
//           padding: 20px 20px 30px;
//         }
//         @media (min-width: 640px) { .cv-quick-actions { padding: 24px 32px 36px; } }
//         .cv-quickgrid {
//           display: grid;
//           grid-template-columns: repeat(2, minmax(0, 1fr));
//           gap: 14px;
//         }
//         @media (min-width: 640px) {
//           .cv-quickgrid { gap: 16px; }
//         }
//         @media (min-width: 900px) {
//           .cv-quickgrid {
//             grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
//             gap: 18px;
//           }
//         }
//         .cv-quick-card {
//           position: relative;
//           overflow: hidden;
//           min-height: 108px;
//           background: linear-gradient(150deg, #ffffff 0%, #f5f9ff 100%);
//           border: 1px solid rgba(13, 27, 46, 0.07);
//           border-radius: 18px;
//           padding: 18px 20px 16px;
//           display: flex;
//           flex-direction: column;
//           align-items: flex-start;
//           justify-content: space-between;
//           gap: 4px;
//           transition: transform 0.25s cubic-bezier(.2,.8,.2,1), box-shadow 0.25s ease, border-color 0.25s ease;
//         }
//         .cv-quick-card:hover {
//           transform: translateY(-4px);
//           box-shadow: 0 18px 34px -20px rgba(13,27,46,0.28);
//           border-color: rgba(0,86,179,0.22);
//         }
//         @media (min-width: 640px) {
//           .cv-quick-card { padding: 20px 22px 18px; min-height: 116px; }
//         }
//         .cv-quick-card-copy { position: relative; z-index: 1; max-width: 78%; }
//         .cv-quick-card .cv-quick-icon {
//           width: 34px;
//           height: 34px;
//           border-radius: 10px;
//           display: inline-flex;
//           align-items: center;
//           justify-content: center;
//           margin-bottom: 8px;
//           flex-shrink: 0;
//         }
//         .cv-quick-card .cv-quick-icon img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           display: block;
//         }
//         .cv-quick-title {
//           font-size: 14px;
//           font-weight: 700;
//           line-height: 1.25;
//           margin: 0 0 4px;
//         }
//         .cv-quick-desc {
//           font-size: 12px;
//           color: #5b677e;
//           line-height: 1.5;
//           margin: 0;
//         }
//         .cv-quick-cta {
//           align-self: flex-start;
//           margin-top: 10px;
//           font-size: 12px;
//           font-weight: 700;
//           padding: 8px 14px;
//           border-radius: 10px;
//           border: none;
//           color: #fff;
//           cursor: pointer;
//           transition: filter 0.2s ease, transform 0.2s ease;
//         }
//         .cv-quick-cta:hover { filter: brightness(1.06); transform: translateY(-1px); }
//         .cv-quick-image {
//           position: absolute;
//           bottom: -6px;
//           right: -4px;
//           width: 74px;
//           height: 74px;
//           pointer-events: none;
//           opacity: 0.95;
//         }
//         .cv-quick-image img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//           display: block;
//         }
//         .cv-quick-card.help {
//           background: linear-gradient(150deg, #0c2e5c 0%, #0a2447 100%);
//           color: #fff;
//           border-color: transparent;
//           flex-direction: column;
//           align-items: flex-start;
//           justify-content: center;
//         }
//         .cv-quick-card.help .cv-quick-title { color: #fff; }
//         .cv-quick-card.help .cv-quick-desc { color: rgba(255,255,255,0.82); }
//         .cv-quick-card.help .cv-quick-icon {
//           background: rgba(255,255,255,0.12);
//           color: #fff;
//         }
//         .cv-quick-help-row {
//           display: flex;
//           flex-direction: row;
//           flex-wrap: wrap;
//           gap: 8px;
//           margin-top: 10px;
//           position: relative;
//           z-index: 1;
//         }
//         .cv-quick-help-link,
//         .cv-btn-whatsapp {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           font-size: 12px;
//           font-weight: 700;
//           padding: 8px 12px;
//           border-radius: 10px;
//           text-decoration: none;
//           transition: transform 0.2s ease, filter 0.2s ease;
//         }
//         .cv-quick-help-link:hover,
//         .cv-btn-whatsapp:hover { transform: translateY(-1px); filter: brightness(1.05); }
//         .cv-quick-help-link {
//           background: rgba(255,255,255,0.12);
//           color: #fff;
//         }
//         .cv-btn-whatsapp {
//           background: #10b981;
//           color: #0f172a;
//         }

//         /* stats bar */
//         .cv-stats-bar { padding: 0 0 20px; }
//         @media (min-width: 640px) { .cv-stats-bar { padding: 0 0 28px; } }
//         .cv-stats-box {
//           border: 1px solid var(--line); border-radius: 16px; background: var(--panel);
//           display: grid; grid-template-columns: repeat(2, 1fr); gap: 22px 16px; padding: 22px 20px;
//         }
//         @media (min-width: 700px) { .cv-stats-box { grid-template-columns: repeat(4, 1fr); padding: 24px 30px; } }
//         .cv-stat { display: flex; align-items: center; gap: 12px; }
//         .cv-stat-icon {
//           width: 40px; height: 40px; border-radius: 50%; background: var(--teal-tint); color: var(--teal);
//           display: flex; align-items: center; justify-content: center; flex-shrink: 0;
//         }
//         .cv-stat-num { font-family: 'Inter', sans-serif; font-weight: 600; font-size: 19px; color: var(--ink); }
//         .cv-stat-label { font-size: 11.5px; color: var(--muted); }

//         /* features strip */
//         .cv-features { padding: 18px 0; }
//         @media (min-width: 640px) { .cv-features { padding: 28px 0; } }
//         .cv-features-box {
//           border: 1px solid var(--line); border-radius: 16px; padding: 22px 18px; background: var(--panel);
//         }
//         @media (min-width: 640px) { .cv-features-box { border-radius: 18px; padding: 30px 24px; } }
//         .cv-features-head { text-align: center; margin-bottom: 20px; }
//         .cv-features-kicker { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--gold-deep); }
//         .cv-features-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 18px 16px; }
//         @media (min-width: 560px) { .cv-features-grid { gap: 22px; } }
//         @media (min-width: 700px) { .cv-features-grid { grid-template-columns: repeat(3, 1fr); } }
//         @media (min-width: 1000px) { .cv-features-grid { grid-template-columns: repeat(6, 1fr); } }
//         .cv-feature { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; }
//         .cv-feature-icon {
//           width: 40px; height: 40px; border-radius: 50%;
//           display: flex; align-items: center; justify-content: center; margin-bottom: 8px;
//         }
//         .cv-feature-title { font-weight: 600; font-size: 14.5px; color: var(--ink); }
//         .cv-feature-desc { font-size: 12.5px; color: var(--muted); line-height: 1.5; }

//         /* courses */
//         .cv-courses { padding: 18px 0; text-align: center; }
//         @media (min-width: 640px) { .cv-courses { padding: 28px 0; } }
//         .cv-section-kicker { font-size: 11px; font-weight: 700; letter-spacing: 1.2px; text-transform: uppercase; color: var(--gold-deep); margin-bottom: 8px; }
//         .cv-section-h2 { font-family: 'Inter', sans-serif; font-size: clamp(22px, 5.5vw, 30px); font-weight: 600; margin: 0 0 22px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-section-h2 { margin: 0 0 28px; } }

//         .cv-courses-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; text-align: left; }
//         @media (min-width: 560px) { .cv-courses-grid { gap: 16px; } }
//         @media (min-width: 700px) { .cv-courses-grid { grid-template-columns: repeat(3, 1fr); } }
//         @media (min-width: 1000px) { .cv-courses-grid { grid-template-columns: repeat(5, 1fr); } }

//         .cv-course-card { border: 1px solid var(--line); border-radius: 14px; padding: 16px 14px; background: var(--panel); transition: border-color 0.25s ease, transform 0.25s ease; }
//         @media (min-width: 640px) { .cv-course-card { padding: 22px 18px; } }
//         .cv-course-card:hover { border-color: rgba(13,27,46,0.22); transform: translateY(-3px); box-shadow: 0 14px 28px -18px rgba(13,27,46,0.2); }
//         .cv-course-icon {
//           width: 42px; height: 42px; border-radius: 12px;
//           display: flex; align-items: center; justify-content: center; margin-bottom: 14px;
//         }
//         .cv-course-tag { font-size: 11px; font-weight: 600; margin-bottom: 6px; }
//         .cv-course-name { font-weight: 600; font-size: 15px; margin-bottom: 10px; color: var(--ink); }
//         .cv-course-unis { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
//         .cv-course-link { font-size: 13px; font-weight: 600; color: var(--ink); display: inline-flex; align-items: center; gap: 4px; }

//         /* counselling banner */
//         .cv-counsel { padding: 0 0 24px; }
//         @media (min-width: 640px) { .cv-counsel { padding: 0 0 32px; } }
//         .cv-counsel-box {
//           background: linear-gradient(120deg, var(--teal-tint), var(--panel) 60%); border-radius: 18px; padding: 8px; border: 1px solid var(--line);
//           display: grid; grid-template-columns: 1fr; gap: 18px; align-items: center;
//         }
//         @media (min-width: 760px) { .cv-counsel-box { grid-template-columns: 1fr 1fr; padding: 8px; border-radius: 20px; gap: 24px; } }
//         .cv-counsel-text { padding: 22px 20px 4px; }
//         @media (min-width: 760px) { .cv-counsel-text { padding: 28px 30px; } }
//         .cv-counsel-h3 { font-family: 'Inter', sans-serif; font-size: 21px; font-weight: 600; margin: 0 0 8px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-counsel-h3 { font-size: 24px; margin: 0 0 10px; } }
//         .cv-counsel-p { color: var(--muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; max-width: 340px; }
//         .cv-counsel-cta {
//           display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px;
//           padding: 12px 20px; border-radius: 8px; border: none; cursor: pointer; background: var(--teal); color: #fff;
//         }
//         .cv-counsel-photo { border-radius: 16px; overflow: hidden; }
//         .cv-counsel-photo img { width: 100%; height: auto; display: block; }

//         /* partners — wide auto-scrolling logo slider */
//         .cv-partners-wrap { padding: 0 0 32px; }
//         .cv-partners-wrap .cv-container { max-width: 1440px; }
//         .cv-partners-box {
//           border: 1px solid var(--line); border-radius: 20px; padding: 28px 0; background: var(--panel);
//           overflow: hidden;
//         }
//         .cv-partners-kicker {
//           text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase;
//           color: var(--muted); margin-bottom: 20px; padding: 0 24px;
//         }
//         .cv-partners-marquee {
//           width: 100%; overflow: hidden; position: relative;
//           -webkit-mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
//           mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
//         }
//         .cv-partners-track {
//           display: flex; align-items: center; gap: 16px; width: max-content;
//           animation: cv-marquee 32s linear infinite;
//         }
//         .cv-partners-track:hover { animation-play-state: paused; }
//         @keyframes cv-marquee {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }
//         .cv-partner-logo {
//           display: flex; align-items: center; gap: 10px; flex-shrink: 0; white-space: nowrap;
//           padding: 12px 22px; border: 1px solid var(--line); border-radius: 14px; background: #fff;
//           transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
//         }
//         .cv-partner-logo:hover {
//           transform: translateY(-3px);
//           box-shadow: 0 14px 26px -16px rgba(13,27,46,0.3);
//           border-color: rgba(0,86,179,0.3);
//         }
//         .cv-partner-logo-icon {
//           width: 32px; height: 32px; border-radius: 9px; display: flex; align-items: center; justify-content: center;
//           flex-shrink: 0;
//         }
//         .cv-partner-logo-name { font-size: 13px; font-weight: 700; color: var(--ink); }
//         .cv-partners-more {
//           font-size: 13px; font-weight: 700; color: var(--muted); border: 1px dashed var(--line);
//         }

//         /* footer */
//         .cv-footer { border-top: 1px solid var(--line); padding: 44px 0 28px; }
//         .cv-footer-grid { display: grid; grid-template-columns: 1fr; gap: 32px; margin-bottom: 32px; }
//         @media (min-width: 760px) { .cv-footer-grid { grid-template-columns: 1.4fr 1fr 1fr 1.2fr; } }
//         .cv-footer-desc { font-size: 13.5px; color: var(--muted); line-height: 1.6; margin: 14px 0 16px; max-width: 260px; }
//         .cv-footer-social { display: flex; gap: 10px; }
//         .cv-footer-social a {
//           width: 32px; height: 32px; border-radius: 50%; border: 1px solid var(--line);
//           display: flex; align-items: center; justify-content: center; color: var(--muted);
//         }
//         .cv-footer-social a:hover { color: var(--teal); border-color: var(--teal); }
//         .cv-footer-h4 { font-size: 13px; font-weight: 700; margin-bottom: 14px; color: var(--ink); }
//         .cv-footer-links { display: flex; flex-direction: column; gap: 10px; font-size: 13.5px; color: var(--muted); }
//         .cv-footer-links a:hover { color: var(--teal); }
//         .cv-newsletter-row { display: flex; gap: 8px; margin-top: 4px; }
//         .cv-newsletter-row input {
//           flex: 1; min-width: 0; font-size: 13px; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line);
//           background: var(--panel); color: var(--ink);
//         }
//         .cv-newsletter-row input::placeholder { color: var(--muted); }
//         .cv-newsletter-row button {
//           width: 40px; height: 40px; border-radius: 8px; border: none; background: var(--teal); color: #fff;
//           display: flex; align-items: center; justify-content: center; cursor: pointer; flex-shrink: 0;
//         }
//         .cv-footer-bottom {
//           display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px solid var(--line);
//           font-size: 12.5px; color: var(--muted);
//         }
//         @media (min-width: 760px) { .cv-footer-bottom { flex-direction: row; justify-content: space-between; } }
//       `}</style>

//       {/* header */}
//       <div className={`cv-header-wrap ${scrolled ? "is-scrolled" : ""}`}>
//         <div className="cv-container">
//           <header className="cv-header">
//             <div className="cv-logo">
//               <div className="cv-logo-mark"><img src={LOGO_SRC} alt="CareerVidya logo" /></div>
//               <div className="cv-logo-text">
//                 <div className="cv-logo-word"><span>Vidya</span>HaiToSuccessHai</div>
//                 {/* <div className="cv-logo-tag">Right guidance · Right university · Right future</div> */}
//               </div>
//             </div>
//             <nav className="cv-nav">
//               {/* Courses dropdown */}
//               <div
//                 className={`cv-nav-item ${navDropdown === "courses" ? "is-open" : ""}`}
//                 onMouseEnter={() => openDropdown("courses")}
//                 onMouseLeave={scheduleClose}
//               >
//                 <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "courses" ? null : "courses")}>
//                   Courses <ChevronDown size={14} className="cv-chevron" />
//                 </button>
//                 <div className="cv-nav-panel">
//                   <div className="cv-nav-panel-grid">
//                     {POPULAR_COURSES.map((c) => (
//                       <a href={c.href} key={c.href} className="cv-nav-panel-link">
//                         <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={14} /></span>
//                         {c.label}
//                       </a>
//                     ))}
//                   </div>
//                   <div className="cv-nav-panel-footer">
//                     <a href="/courses">View all courses <ArrowRight size={13} /></a>
//                   </div>  
//                 </div>
//               </div>

//               {/* Universities dropdown */}
//               <div
//                 className={`cv-nav-item ${navDropdown === "universities" ? "is-open" : ""}`}
//                 onMouseEnter={() => openDropdown("universities")}
//                 onMouseLeave={scheduleClose}
//               >
//                 <button className="cv-nav-trigger" onClick={() => setNavDropdown(navDropdown === "universities" ? null : "universities")}>
//                   Universities <ChevronDown size={14} className="cv-chevron" />
//                 </button>
//                 <div className="cv-nav-panel">
//                   <div className="cv-nav-panel-grid">
//                     {TOP_UNIVERSITIES.map((u) => (
//                       <a href={u.href} key={u.href} className="cv-nav-panel-link">
//                         <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={14} /></span>
//                         {u.label}
//                       </a>
//                     ))}
//                   </div>
//                   <div className="cv-nav-panel-footer">
//                     <a href="/universities">View all universities <ArrowRight size={13} /></a>
//                   </div>
//                 </div>
//               </div>

//               {NAV_LINKS.map((link) => (
//                 <a key={link.label} href={link.href}>{link.label}</a>
//               ))}
//               <a href="/resources">Resources</a>
//             </nav>
//             <div className="cv-header-actions">
//               <button className="cv-btn-solid" onClick={() => (window.location.href = "/contact")}>Contact us</button>
//             </div>
//             <button
//               className="cv-menu-btn"
//               aria-label={menuOpen ? "Close menu" : "Open menu"}
//               onClick={() => setMenuOpen((v) => !v)}
//             >
//               {menuOpen ? <X size={19} /> : <Menu size={19} />}
//             </button>
//           </header>
//           <div className={`cv-mobile-drawer ${menuOpen ? "is-open" : ""}`}>
//             <div className="cv-mobile-drawer-inner">
//               {/* Courses accordion */}
//               <div className={`cv-mobile-accordion ${mobileAccordion === "courses" ? "is-open" : ""}`}>
//                 <button
//                   className="cv-mobile-accordion-head"
//                   onClick={() => setMobileAccordion(mobileAccordion === "courses" ? null : "courses")}
//                 >
//                   Courses <ChevronDown size={16} className="cv-chevron" />
//                 </button>
//                 <div className="cv-mobile-accordion-panel">
//                   <div className="cv-mobile-accordion-list">
//                     {POPULAR_COURSES.map((c) => (
//                       <a href={c.href} key={c.href} onClick={() => setMenuOpen(false)}>
//                         <span className={`cv-nav-panel-icon ${c.chip}`}><c.icon size={13} /></span>
//                         {c.label}
//                       </a>
//                     ))}
//                     <a href="/courses" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
//                       View all courses <ArrowRight size={13} />
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {/* Universities accordion */}
//               <div className={`cv-mobile-accordion ${mobileAccordion === "universities" ? "is-open" : ""}`}>
//                 <button
//                   className="cv-mobile-accordion-head"
//                   onClick={() => setMobileAccordion(mobileAccordion === "universities" ? null : "universities")}
//                 >
//                   Universities <ChevronDown size={16} className="cv-chevron" />
//                 </button>
//                 <div className="cv-mobile-accordion-panel">
//                   <div className="cv-mobile-accordion-list">
//                     {TOP_UNIVERSITIES.map((u) => (
//                       <a href={u.href} key={u.href} onClick={() => setMenuOpen(false)}>
//                         <span className={`cv-nav-panel-icon ${u.chip}`}><u.icon size={13} /></span>
//                         {u.label}
//                       </a>
//                     ))}
//                     <a href="/universities" onClick={() => setMenuOpen(false)} style={{ fontWeight: 700, color: "var(--teal-deep)" }}>
//                       View all universities <ArrowRight size={13} />
//                     </a>
//                   </div>
//                 </div>
//               </div>

//               {NAV_LINKS.map((link) => (
//                 <a key={link.label} href={link.href} onClick={() => setMenuOpen(false)}>{link.label}</a>
//               ))}
//               <a href="/resources" onClick={() => setMenuOpen(false)}>Resources</a>
//               <div className="cv-mobile-drawer-actions">
//                 <button className="cv-btn-solid" onClick={() => (window.location.href = "/contact")}>Contact us</button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* hero */}
//       <div className=" cv-hero">
//         <img className="cv-hero-bg" src={HERO_BG_IMG} alt="" aria-hidden="true" />
//         <div className="cv-hero-top">
//           <div className="cv-animate">
//             <div className="cv-badge">Choose your path</div>
//             <h1 className="cv-h1">Every journey needs the <em>right</em> direction</h1>
//             <p className="cv-hero-sub">
//               One platform, two powerful experiences. Choose the path that's right for you
//               and take the next step towards your future.
//             </p>
//           </div>
//         </div>

//         <div className="cv-path-wrap cv-animate" style={{ animationDelay: "0.15s" }}>
//           <div className="cv-path-grid">
//             <div
//               className={`cv-path-card career ${hovered === "career" ? "is-hover" : ""}`}
//               onMouseEnter={() => setHovered("career")}
//               onMouseLeave={() => setHovered(null)}
//             >
//               <div className="cv-path-content">
//                 <div className="cv-path-kicker">For professionals</div>
//                 <h2 className="cv-path-title">Career</h2>
//                 <p className="cv-path-desc">
//                   Find the right opportunities, connect with top employers and take the next step in your career.
//                 </p>
//               <ul className="cv-path-list">
//   <li>
//     <span className="cv-path-list-icon">
//       <Briefcase size={13} />
//     </span>
//     Latest Job Openings
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <Sparkles size={13} />
//     </span>
//     AI Job Recommendations
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <GraduationCap size={13} />
//     </span>
//     AI Course Suggestions
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <FileText size={13} />
//     </span>
//     AI Resume Analysis
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <ShieldCheck size={13} />
//     </span>
//     Placement Assistance
//   </li>
// </ul>
//                 <button className="cv-path-cta" onClick={() => (window.location.href = CAREER_URL)}>
//                   Go to Career <ArrowRight size={15} />
//                 </button>
//               </div>
//             </div>

//             <div className="cv-path-or">
//               <div className="cv-path-or-inner">
//                 <img src={LOGO_SRC} alt="CareerVidya logo" />
//               </div>
//             </div>

//             <div
//               className={`cv-path-card vidya ${hovered === "vidya" ? "is-hover" : ""}`}
//               onMouseEnter={() => setHovered("vidya")}
//               onMouseLeave={() => setHovered(null)}
//             >
//               <div className="cv-path-content">
//                 <div className="cv-path-kicker">For students</div>
//                 <h2 className="cv-path-title">Vidya</h2>
//                 <p className="cv-path-desc">
//                   Explore courses, compare universities, get expert guidance and build your dream career.
//                 </p>
//               <ul className="cv-path-list">
//   <li>
//     <span className="cv-path-list-icon">
//       <Compass size={13} />
//     </span>
//     Free Career Counselling
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <BookOpen size={13} />
//     </span>
//     24×7 LMS Access
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <Award size={13} />
//     </span>
//     Free Coursera Certificate
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <Wallet size={13} />
//     </span>
//     No-Cost EMI Available
//   </li>

//   <li>
//     <span className="cv-path-list-icon">
//       <BriefcaseBusiness size={13} />
//     </span>
//     100% Job Assistance
//   </li>
// </ul>
//                 <button className="cv-path-cta" onClick={() => (window.location.href = VIDYA_URL)}>
//                   Enter Vidya <ArrowRight size={15} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Trending jobs / trending courses — matches "Explore Top Job Opportunities" and
//           "Explore Top Courses & Universities" style, with stat chips, filters and rich cards */}
//       <div className="cv-container cv-trending">
//         <div className="cv-trending-grid">
//           {/* JOBS COLUMN */}
//           <div className="cv-trending-col jobs">
//             <div className="cv-trending-headrow">
//               <div className="cv-trending-headrow-icon"><Briefcase size={17} /></div>
//               <div className="cv-trending-headtext">
//                 <div className="cv-trending-title-lg">
//                   Explore Top <span className="accent-gold">Job Opportunities</span>
//                 </div>
//                 <div className="cv-trending-caption">Find the perfect job that matches your skills and build your dream career.</div>
//               </div>
//               <a href={`${CAREER_URL}/jobs`} className="cv-trending-viewall">View all jobs <ArrowUpRight size={12} /></a>
//             </div>

//             <div className="cv-trending-stats">
//               {JOB_STATS.map((s) => (
//                 <div className="cv-trending-stat" key={s.label}>
//                   <div className="cv-trending-stat-icon"><s.icon size={13} /></div>
//                   <div>
//                     <div className="cv-trending-stat-num">{s.num}</div>
//                     <div className="cv-trending-stat-label">{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="cv-trending-firelabel">🔥 Trending Jobs</div>
//             <div className="cv-trending-filters">
//               {JOB_FILTERS.map((f) => (
//                 <button
//                   key={f}
//                   className={`cv-filter-pill ${jobFilter === f ? "is-active" : ""}`}
//                   onClick={() => setJobFilter(f)}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>

//             <div className="cv-trending-stack">
//               {TRENDING_JOBS.map((j) => (
//                 <div className="cv-trending-card" key={j.title}>
//                   <div className="cv-trending-logo" style={{ background: `${j.mono}1a`, color: j.mono }}>
//                     {j.logo ? <img src={j.logo} alt={j.company} /> : j.short}
//                   </div>
//                   <div className="cv-trending-info">
//                     <div className="cv-trending-title-row">
//                       <span className="cv-trending-title">{j.title}</span>
//                       {j.isNew && <span className="cv-new-badge">New</span>}
//                     </div>
//                     <div className="cv-trending-org">{j.company}</div>
//                     <div className="cv-trending-sub">
//                       <span><MapPin size={11} style={{ verticalAlign: "-2px" }} /> {j.location}</span>
//                       <span className="dot"></span>
//                       <span>{j.workMode}</span>
//                       <span className="dot"></span>
//                       <span><Clock size={11} style={{ verticalAlign: "-2px" }} /> {j.exp}</span>
//                     </div>
//                   </div>
//                   <div className="cv-trending-right">
//                     <span className="cv-trending-price">{j.salary}</span>
//                     <button className="cv-trending-cta" onClick={() => (window.location.href = CAREER_URL)}>
//                       Apply Now
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="cv-trending-more" onClick={() => (window.location.href = `${CAREER_URL}/`)}>
//               View all jobs <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
//             </button>
//           </div>

//           {/* COURSES COLUMN */}
//           <div className="cv-trending-col courses">
//             <div className="cv-trending-headrow">
//               <div className="cv-trending-headrow-icon"><GraduationCap size={17} /></div>
//               <div className="cv-trending-headtext">
//                 <div className="cv-trending-title-lg">
//                   Explore Top <span className="accent-teal">Courses &amp; Universities</span>
//                 </div>
//                 <div className="cv-trending-caption">Discover the best courses and top universities to shape your future.</div>
//               </div>
//               <a href="/explore" className="cv-trending-viewall">View all courses <ArrowUpRight size={12} /></a>
//             </div>

//             <div className="cv-trending-stats">
//               {COURSE_STATS.map((s) => (
//                 <div className="cv-trending-stat" key={s.label}>
//                   <div className="cv-trending-stat-icon"><s.icon size={13} /></div>
//                   <div>
//                     <div className="cv-trending-stat-num">{s.num}</div>
//                     <div className="cv-trending-stat-label">{s.label}</div>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <div className="cv-trending-firelabel">🔥 Trending Courses</div>
//             <div className="cv-trending-filters">
//               {COURSE_FILTERS.map((f) => (
//                 <button
//                   key={f}
//                   className={`cv-filter-pill ${courseFilter === f ? "is-active" : ""}`}
//                   onClick={() => setCourseFilter(f)}
//                 >
//                   {f}
//                 </button>
//               ))}
//             </div>

//             <div className="cv-trending-stack">
//               {TRENDING_COURSES_HOME.map((c) => (
//                 <div className="cv-trending-card" key={c.title}>
//                   <div className="cv-trending-logo" style={{ background: `${c.mono}1a`, color: c.mono }}>{c.short}</div>
//                   <div className="cv-trending-info">
//                     <div className="cv-trending-title-row">
//                       <span className="cv-trending-title">{c.title}</span>
//                     </div>
//                     <div className="cv-trending-org">{c.sub}</div>
//                     <div className="cv-trending-sub">
//                       <span>{c.university}</span>
//                       <span className="dot"></span>
//                       <span><Clock size={11} style={{ verticalAlign: "-2px" }} /> {c.duration}</span>
//                     </div>
//                   </div>
//                   <div className="cv-trending-right">
//                     <span className="cv-trending-price">{c.fee}</span>
//                     <button className="cv-trending-cta" onClick={() => (window.location.href = c.href)}>
//                       Apply Now
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>

//             <button className="cv-trending-more" onClick={() => (window.location.href = "/courses")}>
//               View all courses <ArrowRight size={13} style={{ verticalAlign: "-2px" }} />
//             </button>
//           </div>
//         </div>

//       </div>

//       <Quickaction />

//       {/* popular courses */}
//       <div className="cv-container cv-courses">
//         <div className="cv-section-kicker">Popular courses</div>
//         <h2 className="cv-section-h2">Build skills. Shape tomorrow.</h2>
//         <div className="cv-courses-grid">
//           {COURSES.map((c) => (
//             <div className="cv-course-card" key={c.name}>
//               <div className="cv-course-icon" style={{ background: `${c.color}22`, color: c.color }}><c.icon size={20} /></div>
//               <div className="cv-course-tag" style={{ color: c.color }}>High demand</div>
//               <div className="cv-course-name">{c.name}</div>
//               <div className="cv-course-unis">{c.unis}</div>
//               <a className="cv-course-link" href="#">Explore <ArrowUpRight size={13} /></a>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* counselling banner */}
//       <div className="cv-container cv-counsel">
//         <div className="cv-counsel-box">
//           <div className="cv-counsel-text">
//             <h3 className="cv-counsel-h3">Not sure where to start?</h3>
//             <p className="cv-counsel-p">Get free career counselling and guidance from our expert counsellors.</p>
//             <button className="cv-counsel-cta" onClick={() => (window.location.href = "/counselling")}>
//               Book free counselling <ArrowRight size={16} />
//             </button>
//           </div>
//           <div className="cv-counsel-photo">
//             <img src={COUNSELLING_IMG} alt="Counsellor guiding students" />
//           </div>
//         </div>
//       </div>

//       {/* trusted partners */}
//       <div className="cv-partners-wrap">
//         <div className="cv-container">
//           <div className="cv-partners-box">
//             <div className="cv-partners-kicker">Trusted by students & 1,000+ university partners</div>
//             <div className="cv-partners-marquee">
//               <div className="cv-partners-track">
//                 {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
//                   <div className="cv-partner-logo" key={`${p.name}-${i}`}>
//                     <span className="cv-partner-logo-icon" style={{ background: p.tint, color: p.color }}>
//                       <p.icon size={16} />
//                     </span>
//                     <span className="cv-partner-logo-name">{p.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//  <FAQ />
//       {/* footer */}
//       <div className="cv-container">
//         <footer className="cv-footer">
//           <div className="cv-footer-grid">
//             <div>
//               <div className="cv-logo">
//                 <div className="cv-logo-mark"><img src={LOGO_SRC} alt="CareerVidya logo" /></div>
//                 <div className="cv-logo-word">Career<span>Vidya</span></div>
//               </div>
//               <p className="cv-footer-desc">
//                 CareerVidya is India's platform for choosing the right career, course, and university —
//                 and for finding the right talent.
//               </p>
//               <div className="cv-footer-social">
//                 <a href="#" aria-label="Facebook"><Facebook size={15} /></a>
//                 <a href="#" aria-label="Instagram"><Instagram size={15} /></a>
//                 <a href="#" aria-label="LinkedIn"><Linkedin size={15} /></a>
//                 <a href="#" aria-label="YouTube"><Youtube size={15} /></a>
//               </div>
//             </div>
//             <div>
//               <div className="cv-footer-h4">For students</div>
//               <div className="cv-footer-links">
//                 <a href="#">Courses</a>
//                 <a href="#">Universities</a>
//                 <a href="#">Career test</a>
//                 <a href="#">Scholarships</a>
//                 <a href="#">Counselling</a>
//               </div>
//             </div>
//             <div>
//               <div className="cv-footer-h4">For recruiters</div>
//               <div className="cv-footer-links">
//                 <a href="#">Post a job</a>
//                 <a href="#">Find candidates</a>
//                 <a href="#">Pricing</a>
//                 <a href="#">Employer login</a>
//               </div>
//             </div>  
//             <div>
//               <div className="cv-footer-h4">Stay updated</div>
//               <p className="cv-footer-desc" style={{ margin: "0 0 10px" }}>Get the latest courses and career tips.</p>
//               <div className="cv-newsletter-row">
//                 <input type="email" placeholder="Enter your email" />
//                 <button aria-label="Subscribe"><Send size={15} /></button>
//               </div>
//             </div>
//           </div>
//           <div className="cv-footer-bottom">
//             <span>© 2026 CareerVidya. All rights reserved.</span>
//             <span>Terms & conditions · Privacy policy</span>
//           </div>
//         </footer>
//       </div>
//     </div>
//   );
// }