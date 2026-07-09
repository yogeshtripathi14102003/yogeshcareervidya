// import CardSlider from "./components/cardslider/page";
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

// import { useState, useEffect } from "react";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   GraduationCap,
//   Briefcase,
//   Compass,
//   Building2,
//   BookOpen,
//   Wallet,
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
// } from "lucide-react";

// /**
//  * CareerVidya — Home page (v10, fixed path-card image fit + shadow)
//  * -----------------------------------------------------------------------
//  * - Fixed the "choose your path" card images (Vidya / Career) that were
//  *   cramped into a corner with negative margins. They now fill their
//  *   allotted space properly, with rounded corners and a real drop shadow.
//  * -----------------------------------------------------------------------
//  */

// const VIDYA_URL = "/Home";
// const CAREER_URL = "/http://localhost:3001";
// const LOGO_SRC = "/images/n12.png";
// const HERO_BG_IMG = "/images/testing.jpeg";
// const VIDYA_IMG = "/images/test3.jpeg";
// const CAREER_IMG = "/images/test2.jpeg";
// const COUNSELLING_IMG = "/images/career1.jpeg";

// const NAV_LINKS = ["Courses", "Universities", "Counselling", "Scholarships"];

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

// export default function CareerVidyaHome() {
//   const [hovered, setHovered] = useState(null); // 'vidya' | 'career' | null
//   const [scrolled, setScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const onScroll = () => setScrolled(window.scrollY > 8);
//     window.addEventListener("scroll", onScroll);
//     return () => window.removeEventListener("scroll", onScroll);
//   }, []);

//   return (
//     <div className="cv-root">
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,380;0,9..144,560;0,9..144,680;1,9..144,500&family=Inter:wght@400;500;600;700&display=swap');

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

//         .cv-menu-btn {
//           display: flex; align-items: center; justify-content: center;
//           width: 38px; height: 38px; border-radius: 8px; border: 1px solid var(--line);
//           background: var(--panel); color: var(--ink); cursor: pointer; flex-shrink: 0;
//         }
//         @media (min-width: 900px) { .cv-menu-btn { display: none; } }

//         .cv-mobile-drawer {
//           max-height: 0; overflow: hidden; transition: max-height 0.3s ease;
//           border-bottom: 1px solid transparent;
//         }
//         .cv-mobile-drawer.is-open { max-height: 420px; border-bottom: 1px solid var(--line); }
//         @media (min-width: 900px) { .cv-mobile-drawer { display: none; } }
//         .cv-mobile-drawer-inner { padding: 8px 0 20px; display: flex; flex-direction: column; gap: 4px; }
//         .cv-mobile-drawer-inner a {
//           padding: 12px 4px; font-size: 15px; font-weight: 500; color: var(--ink);
//           border-bottom: 1px solid var(--line);
//         }
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
//           width: 100%; max-width: 1600px; height: 460px;
//           object-fit: contain; object-position: center top;
//           opacity: 0.38; pointer-events: none; z-index: 0;
//           mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
//           -webkit-mask-image: linear-gradient(to bottom, black 60%, transparent 100%);
//         }
//         @media (max-width: 640px) { .cv-hero-bg { height: 340px; } }
//         .cv-hero-top { position: relative; }
//         .cv-hero-top > * { position: relative; z-index: 1; }
//         .cv-path-wrap { z-index: 1; }
//         .cv-badge {
//           display: inline-flex; align-items: center; gap: 6px;
//           font-size: 11.5px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: var(--gold-deep);
//           margin-bottom: 14px;
//         }
//         .cv-h1 {
//           font-family: 'Fraunces', serif; font-size: clamp(28px, 6.4vw, 44px); font-weight: 600;
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

//         /* choose your path — two side-by-side panels with an OR divider */
//         .cv-path-wrap { position: relative; max-width: 980px; margin: 0 auto; }
//         .cv-path-grid {
//           display: grid; grid-template-columns: 1fr; gap: 16px; text-align: left; align-items: stretch;
//         }
//         @media (min-width: 860px) { .cv-path-grid { grid-template-columns: 1fr 1fr; gap: 20px; } }

//         .cv-path-or {
//           display: none;
//         }
//         @media (min-width: 860px) {
//           .cv-path-or {
//             display: flex; align-items: center; justify-content: center;
//             position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
//             width: 46px; height: 46px; border-radius: 50%; background: #fff;
//             border: 1px solid var(--line); box-shadow: 0 8px 20px -8px rgba(13,27,46,0.2);
//             font-family: 'Fraunces', serif; font-weight: 600; font-size: 12px; color: var(--muted);
//             z-index: 3;
//           }
//         }

//         .cv-path-card {
//           border-radius: 16px; padding: 20px 20px; border: 1px solid var(--line); background: #fff;
//           display: flex; flex-direction: row; align-items: center; gap: 16px;
//           position: relative; overflow: hidden;
//           transition: transform 0.25s ease, box-shadow 0.25s ease;
//         }
//         .cv-path-card.is-hover { transform: translateY(-3px); }
//         .cv-path-card.vidya.is-hover { box-shadow: 0 16px 32px -18px rgba(13,148,136,0.3); }
//         .cv-path-card.career.is-hover { box-shadow: 0 16px 32px -18px rgba(245,166,35,0.35); }

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

//         .cv-path-title { font-family: 'Fraunces', serif; font-size: 24px; font-weight: 700; margin: 0 0 8px; color: var(--ink); }
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
//         .cv-stat-num { font-family: 'Fraunces', serif; font-weight: 600; font-size: 19px; color: var(--ink); }
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
//         .cv-section-h2 { font-family: 'Fraunces', serif; font-size: clamp(22px, 5.5vw, 30px); font-weight: 600; margin: 0 0 22px; color: var(--ink); }
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
//         .cv-counsel-h3 { font-family: 'Fraunces', serif; font-size: 21px; font-weight: 600; margin: 0 0 8px; color: var(--ink); }
//         @media (min-width: 640px) { .cv-counsel-h3 { font-size: 24px; margin: 0 0 10px; } }
//         .cv-counsel-p { color: var(--muted); font-size: 13.5px; line-height: 1.6; margin: 0 0 18px; max-width: 340px; }
//         .cv-counsel-cta {
//           display: inline-flex; align-items: center; gap: 8px; font-weight: 600; font-size: 14px;
//           padding: 12px 20px; border-radius: 8px; border: none; cursor: pointer; background: var(--teal); color: #fff;
//         }
//         .cv-counsel-photo { border-radius: 16px; overflow: hidden; }
//         .cv-counsel-photo img { width: 100%; height: auto; display: block; }

//         /* partners */
//         .cv-partners { padding: 0 0 32px; }
//         .cv-partners-box { border: 1px solid var(--line); border-radius: 16px; padding: 22px 24px; background: var(--panel); }
//         .cv-partners-kicker { text-align: center; font-size: 12px; font-weight: 700; letter-spacing: 1.4px; text-transform: uppercase; color: var(--muted); margin-bottom: 18px; }
//         .cv-partners-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 14px; }
//         .cv-partner-pill {
//           font-size: 13px; font-weight: 600; color: var(--muted); border: 1px solid var(--line); border-radius: 10px;
//           padding: 10px 18px;
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
//                 <div className="cv-logo-word">VidyaHai<span>ToSuccess</span></div>
//                 <div className="cv-logo-tag">Right guidance · Right university · Right future</div>
//               </div>
//             </div>
//             <nav className="cv-nav">
//               {NAV_LINKS.map((link) => (
//                 <a key={link} href="#">{link}</a>
//               ))}
//               <span className="cv-nav-more">Resources <ChevronDown size={14} /></span>
//             </nav>
//             <div className="cv-header-actions">
//               <button className="cv-btn-ghost">Login</button>
//               <button className="cv-btn-solid">Contact us</button>
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
//               {NAV_LINKS.map((link) => (
//                 <a key={link} href="#" onClick={() => setMenuOpen(false)}>{link}</a>
//               ))}
//               <a href="#" onClick={() => setMenuOpen(false)}>Resources</a>
//               <div className="cv-mobile-drawer-actions">
//                 <button className="cv-btn-ghost">Login</button>
//                 <button className="cv-btn-solid">Contact us</button>
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
//                 <ul className="cv-path-list">
//                   <li><span className="cv-path-list-icon"><TrendingUp size={13} /></span>1500+ Courses</li>
//                   <li><span className="cv-path-list-icon"><Building2 size={13} /></span>Top Universities</li>
//                   <li><span className="cv-path-list-icon"><Compass size={13} /></span>Career Counselling</li>
//                   <li><span className="cv-path-list-icon"><Wallet size={13} /></span>Scholarships & Loans</li>
//                 </ul>
//                 <button className="cv-path-cta" onClick={() => (window.location.href = VIDYA_URL)}>
//                   Enter Vidya <ArrowRight size={15} />
//                 </button>
//               </div>
//               <div className="cv-path-media">
//                 <img src={VIDYA_IMG} alt="Graduation cap on a stack of books" />
//               </div>
//             </div>

//             <div className="cv-path-or">OR</div>

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
//                 <ul className="cv-path-list">
//                   <li><span className="cv-path-list-icon"><Briefcase size={13} /></span>Latest Job Openings</li>
//                   <li><span className="cv-path-list-icon"><Building2 size={13} /></span>Top Employers</li>
//                   <li><span className="cv-path-list-icon"><BookOpen size={13} /></span>Career Resources</li>
//                   <li><span className="cv-path-list-icon"><ShieldCheck size={13} /></span>Placement Support</li>
//                 </ul>
//                 <button className="cv-path-cta" onClick={() => (window.location.href = CAREER_URL)}>
//                   Go to Career <ArrowRight size={15} />
//                 </button>
//               </div>
//               <div className="cv-path-media">
//                 <img src={CAREER_IMG} alt="Office chair and desk" />
//               </div>
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
//             <button className="cv-counsel-cta">Book free counselling <ArrowRight size={16} /></button>
//           </div>
//           <div className="cv-counsel-photo">
//             <img src={COUNSELLING_IMG} alt="Counsellor guiding students" />
//           </div>
//         </div>
//       </div>

//       {/* trusted partners */}
//       <div className="cv-container cv-partners">
//         <div className="cv-partners-box">
//           <div className="cv-partners-kicker">Trusted by students & partners</div>
//           <div className="cv-partners-row">
//             {PARTNERS.map((p) => (
//               <div className="cv-partner-pill" key={p}>{p}</div>
//             ))}
//             <div className="cv-partner-pill">& 1,000+ universities</div>
//           </div>
//         </div>
//       </div>

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