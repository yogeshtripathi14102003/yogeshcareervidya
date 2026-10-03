// "use client";

// import { useState } from "react";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   GraduationCap,
//   Briefcase,
//   MapPin,
//   Clock,
// } from "lucide-react";

// import FAQ from "@/app/components/FAQ.jsx";
// import Footer from "@/app/layout/Footer";
// import Header from "@/app/layout/Header"; // Vidya header
// import JobHeader from "@/app/layout/JobHeader"; // ✅ Career header
// import TestimonialsSlider from "../components/TestimonialsSlider";
// import Studentimagesslider from "../components/Studentimageslider"

// const CAREER_URL = "https://jobportal.careervidya.in/";

// const PARTNER_LOGOS = [
//   { name: "Amity University", image: "/images/w2.webp" },
//   { name: "LPU Online", image: "/images/w1.webp" },
//   { name: "Manipal University", image: "/images/w3.webp" },
//   { name: "Chandigarh University", image: "/images/w4.webp" },
// ];

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
//     company: "Samsung",
//     short: "S",
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
//   const [mode, setMode] = useState("vidya"); // Default Vidya

//   const modeData = {
//     career: {
//       eyebrow: "💼 CAREER FOCUS • 350+ Live Jobs",
//       headline: (
//         <>
//           Find Your Dream Job &{" "}
//           <span style={{ color: "#F97316" }}>Accelerate Career</span>
//         </>
//       ),
//       subtext:
//         "Connect with top companies, prepare your resume, and apply directly to hiring partners.",
//       dropdownLabel: "CAREER GOAL",
//       options: [
//         "Finding jobs & internships",
//         "Resume & LinkedIn Profile Review",
//         "Job-Ready Skill Development",
//       ],
//       btnText: "Go to Job Portal →",
//       url: CAREER_URL,
//     },
//     vidya: {
//       eyebrow: "📚 VIDYA FOCUS • 500+ Top Courses",
//       headline: (
//         <>
//           Compare Top Universities &{" "}
//           <span style={{ color: "#F97316" }}>Find Course</span>
//         </>
//       ),
//       subtext:
//         "Explore degree programs, compare fees structure, and talk to experts for admission support.",
//       dropdownLabel: "COURSE GOAL",
//       options: [
//         "Comparing Top Universities",
//         "Choosing the Right Degree Course",
//         "Free University Counseling",
//       ],
//       btnText: "Explore Website Courses →",
//       url: "/courses",
//     },
//   };

//   const active = modeData[mode];

//   return (
//     <div className="cv-root">

//       {/* ═══════════════════════════════════════════
//           HEADER — Mode Based
//       ═══════════════════════════════════════════ */}

//       {mode === "vidya" ? (
//         // ✅ Vidya — Aapka existing Header
//         <Header />
//       ) : (
//         // ✅ Career — Naya CareerHeader component
//         <JobHeader />
//       )}

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

//         * { box-sizing: border-box; }

//         .cv-root {
//           --ink: var(--cv-neutral-dark);
//           --muted: var(--cv-neutral-mid);
//           --line: var(--cv-neutral-border);
//           --surface: var(--cv-neutral-light);
//           --panel: #ffffff;

//           font-family: var(--font-poppins), 'Poppins', sans-serif;
//           color: var(--ink);
//           background: var(--surface);
//           overflow-x: hidden;
//         }

//         a { text-decoration: none; color: inherit; }
//         button { font-family: inherit; }

//         .cv-container {
//           max-width: 1380px;
//           margin: 0 auto;
//           padding: 0 24px;
//         }

//         /* ═══════════════ HERO — CENTER ═══════════════ */
//         .cv-hero-center {
//           max-width: 800px;
//           margin: 40px auto 0;
//           padding: 0 20px;
//           text-align: center;
//         }

//         .cv-hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 6px 14px;
//           background: var(--cv-primary-light);
//           color: var(--cv-primary);
//           border-radius: 50px;
//           font-size: 12px;
//           font-weight: 700;
//           margin-bottom: 18px;
//         }

//         .cv-hero-headline {
//           font-size: 38px;
//           font-weight: 800;
//           line-height: 1.15;
//           letter-spacing: -1px;
//           margin-bottom: 12px;
//           color: var(--cv-neutral-dark);
//           animation: heroFadeIn 0.4s ease-out;
//         }

//         @keyframes heroFadeIn {
//           from { opacity: 0; transform: translateY(8px); }
//           to   { opacity: 1; transform: translateY(0); }
//         }

//         .cv-hero-subtext {
//           color: var(--cv-neutral-mid);
//           font-size: 15px;
//           line-height: 1.6;
//           margin-bottom: 28px;
//           max-width: 560px;
//           margin-left: auto;
//           margin-right: auto;
//         }

//         /* ═══════════════ FORM CARD ═══════════════ */
//         .cv-form-card {
//           background: #ffffff;
//           border-radius: 20px;
//           padding: 32px;
//           box-shadow: 0 20px 40px rgba(30, 58, 138, 0.08);
//           border: 1px solid var(--cv-neutral-border);
//           max-width: 720px;
//           margin: 0 auto 40px;
//           text-align: left;
//         }

//         .cv-switcher {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 10px;
//           background: var(--cv-neutral-light);
//           padding: 6px;
//           border-radius: 14px;
//           margin-bottom: 24px;
//         }

//         .cv-switch-btn {
//           border: none;
//           background: transparent;
//           padding: 14px;
//           border-radius: 10px;
//           cursor: pointer;
//           text-align: center;
//           font-weight: 700;
//           font-size: 14px;
//           color: var(--cv-neutral-mid);
//           transition: all 0.3s;
//         }

//         .cv-switch-btn.active {
//           background: #ffffff;
//           color: var(--cv-primary);
//           box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
//         }

//         .cv-input-group { margin-bottom: 16px; }

//         .cv-input-group label {
//           font-size: 11px;
//           font-weight: 800;
//           color: var(--cv-neutral-mid);
//           display: block;
//           margin-bottom: 6px;
//           letter-spacing: 0.05em;
//           text-transform: uppercase;
//         }

//         .cv-input-group input,
//         .cv-input-group select {
//           width: 100%;
//           padding: 12px 14px;
//           border-radius: 10px;
//           border: 1.5px solid var(--cv-neutral-border);
//           font-weight: 600;
//           font-size: 14px;
//           outline: none;
//           background: #ffffff;
//           color: var(--cv-neutral-dark);
//           transition: all 0.2s ease;
//         }

//         .cv-input-group input:focus,
//         .cv-input-group select:focus {
//           border-color: var(--cv-primary);
//           box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.1);
//         }

//         .cv-submit-btn {
//           width: 100%;
//           padding: 16px;
//           background: var(--cv-grad-cta);
//           color: #ffffff;
//           border: none;
//           border-radius: 12px;
//           font-size: 15px;
//           font-weight: 800;
//           cursor: pointer;
//           transition: 0.3s;
//           margin-top: 8px;
//           box-shadow: 0 8px 20px rgba(193, 83, 4, 0.35);
//         }

//         .cv-submit-btn:hover {
//           background: var(--cv-grad-cta-hover);
//           transform: translateY(-1px);
//           box-shadow: 0 12px 28px rgba(193, 83, 4, 0.5);
//         }

//         /* ═══════════════ RESPONSIVE ═══════════════ */
//         @media (max-width: 900px) {
//           .cv-hero-headline { font-size: 30px; letter-spacing: -0.5px; }
//           .cv-hero-subtext { font-size: 14px; }
//           .cv-form-card { padding: 24px; }
//         }

//         @media (max-width: 500px) {
//           .cv-hero-headline { font-size: 26px; }
//           .cv-switch-btn { padding: 12px; font-size: 12px; }
//         }

//         /* ═══════════════ TRENDING ═══════════════ */
//         .cv-trending { padding: 40px 0 20px; }

//         .cv-trending-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 20px;
//         }

//         @media (min-width: 900px) {
//           .cv-trending-grid {
//             grid-template-columns: 1fr 1fr;
//             gap: 22px;
//           }
//         }

//         .cv-trending-col {
//           border: 1px solid var(--line);
//           border-radius: 18px;
//           padding: 18px;
//           background: var(--panel);
//           display: flex;
//           flex-direction: column;
//         }

//         .cv-trending-headrow {
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;
//           gap: 10px;
//           margin-bottom: 4px;
//         }

//         .cv-trending-headrow-icon {
//           width: 36px;
//           height: 36px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//         }

//         .cv-trending-col.jobs .cv-trending-headrow-icon {
//           background: var(--cv-accent-light);
//           color: var(--cv-accent);
//         }

//         .cv-trending-col.courses .cv-trending-headrow-icon {
//           background: var(--cv-primary-light);
//           color: var(--cv-primary);
//         }

//         .cv-trending-headtext { flex: 1; min-width: 0; }

//         .cv-trending-title-lg {
//           font-size: 17.5px;
//           font-weight: 700;
//           color: var(--ink);
//         }

//         .cv-trending-title-lg .accent-gold { color: var(--cv-accent); }
//         .cv-trending-title-lg .accent-teal { color: var(--cv-primary); }

//         .cv-trending-caption {
//           font-size: 12px;
//           color: var(--muted);
//           margin-top: 2px;
//         }

//         .cv-trending-viewall {
//           font-size: 12px;
//           font-weight: 700;
//           color: var(--muted);
//           white-space: nowrap;
//           padding-top: 8px;
//           display: inline-flex;
//           align-items: center;
//           gap: 3px;
//         }

//         .cv-trending-firelabel {
//           font-size: 13px;
//           font-weight: 700;
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           margin-bottom: 10px;
//           margin-top: 10px;
//         }

//         .cv-trending-stack {
//           display: flex;
//           flex-direction: column;
//           gap: 10px;
//           margin-bottom: 14px;
//         }

//         .cv-trending-card {
//           display: flex;
//           align-items: center;
//           gap: 12px;
//           padding: 12px;
//           border: 1px solid var(--line);
//           border-radius: 14px;
//         }

//         .cv-trending-logo {
//           width: 38px;
//           height: 38px;
//           border-radius: 10px;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           flex-shrink: 0;
//           font-weight: 700;
//           font-size: 13px;
//           overflow: hidden;
//         }

//         .cv-trending-logo img { width: 100%; height: 100%; object-fit: contain; }

//         .cv-trending-info { flex: 1; min-width: 0; }

//         .cv-trending-title-row {
//           display: flex;
//           align-items: center;
//           gap: 6px;
//         }

//         .cv-trending-title {
//           font-size: 13.5px;
//           font-weight: 700;
//           color: var(--ink);
//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .cv-new-badge {
//           font-size: 9.5px;
//           font-weight: 700;
//           color: var(--cv-accent-dark);
//           background: var(--cv-accent-light);
//           border-radius: 999px;
//           padding: 1.5px 7px;
//           flex-shrink: 0;
//         }

//         .cv-trending-org {
//           font-size: 12px;
//           color: var(--muted);
//           margin-top: 1px;
//         }

//         .cv-trending-sub {
//           font-size: 11px;
//           color: var(--muted);
//           margin-top: 3px;
//           display: flex;
//           align-items: center;
//           gap: 4px;
//           flex-wrap: wrap;
//         }

//         .cv-trending-right {
//           display: flex;
//           flex-direction: column;
//           align-items: flex-end;
//           gap: 6px;
//           flex-shrink: 0;
//         }

//         .cv-trending-price { font-size: 12.5px; font-weight: 700; }

//         .cv-trending-col.jobs .cv-trending-price { color: var(--cv-accent); }
//         .cv-trending-col.courses .cv-trending-price { color: var(--cv-primary); }

//         .cv-trending-cta {
//           font-size: 11.5px;
//           font-weight: 700;
//           padding: 7px 13px;
//           border-radius: 8px;
//           border: none;
//           display: inline-flex;
//           align-items: center;
//           gap: 4px;
//           cursor: pointer;
//           color: #fff;
//         }

//         .cv-trending-col.jobs .cv-trending-cta { background: var(--cv-grad-cta); }
//         .cv-trending-col.courses .cv-trending-cta { background: var(--cv-primary); }

//         .cv-trending-more {
//           width: 100%;
//           text-align: center;
//           font-size: 13px;
//           font-weight: 700;
//           color: var(--ink);
//           padding: 11px;
//           border-radius: 10px;
//           border: 1px dashed var(--line);
//           background: #fff;
//           cursor: pointer;
//           margin-top: auto;
//         }

//         /* PARTNERS MARQUEE */
//         .cv-partners-marquee {
//           width: 100%;
//           overflow: hidden;
//           position: relative;
//           padding: 20px 0;
//           mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent);
//         }

//         .cv-partners-track {
//           display: flex;
//           align-items: center;
//           gap: 16px;
//           width: max-content;
//           animation: cv-marquee 32s linear infinite;
//         }

//         @keyframes cv-marquee {
//           from { transform: translateX(0); }
//           to { transform: translateX(-50%); }
//         }

//         .cv-partner-logo {
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: 12px 22px;
//           border: 1px solid var(--line);
//           border-radius: 14px;
//           background: #fff;
//         }
//       `}</style>

//       {/* ═══════════ HERO — CENTER ═══════════ */}
//       <section className="cv-hero-center" key={`hero-${mode}`}>
//         <span className="cv-hero-badge">{active.eyebrow}</span>
//         <h1 className="cv-hero-headline">{active.headline}</h1>
//         <p className="cv-hero-subtext">{active.subtext}</p>
//       </section>

//       {/* ═══════════ FORM CARD ═══════════ */}
//       <div className="cv-form-card">
//         <div className="cv-switcher">
//           <button
//             type="button"
//             className={`cv-switch-btn ${mode === "career" ? "active" : ""}`}
//             onClick={() => setMode("career")}
//           >
//             💼 Career Portal
//           </button>
//           <button
//             type="button"
//             className={`cv-switch-btn ${mode === "vidya" ? "active" : ""}`}
//             onClick={() => setMode("vidya")}
//           >
//             📚 Vidya Courses
//           </button>
//         </div>

//         <form
//           onSubmit={(e) => {
//             e.preventDefault();
//             window.location.href = active.url;
//           }}
//         >
//           <div className="cv-input-group">
//             <label>YOUR NAME</label>
//             <input type="text" placeholder="Enter your full name" required />
//           </div>

//           <div className="cv-input-group">
//             <label>MOBILE NUMBER</label>
//             <input type="tel" placeholder="Enter mobile number" required />
//           </div>

//           <div className="cv-input-group">
//             <label>{active.dropdownLabel}</label>
//             <select>
//               {active.options.map((opt) => (
//                 <option key={opt}>{opt}</option>
//               ))}
//             </select>
//           </div>

//           <button type="submit" className="cv-submit-btn">
//             {active.btnText}
//           </button>
//         </form>
//       </div>

//       {/* ═══════════ TRENDING SECTIONS ═══════════ */}
     

//       <TestimonialsSlider />
//       <Studentimagesslider />
     

//       {/* PARTNER LOGOS */}
//       <div className="cv-partners-marquee">
//         <div className="cv-partners-track">
//           {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
//             <div className="cv-partner-logo" key={`${p.name}-${i}`}>
//               <img
//                 src={p.image}
//                 alt={`${p.name} logo`}
//                 className="w-[152px] h-[40px] object-contain"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <FAQ />
//       <Footer />
//     </div>
//   );
// }






// "use client";

// import { useState } from "react";
// import {
//   ArrowRight,
//   ArrowUpRight,
//   GraduationCap,
//   Briefcase,
//   MapPin,
//   Clock,
// } from "lucide-react";

// import FAQ from "@/app/components/FAQ.jsx";
// import Footer from "@/app/layout/Footer";
// import Header from "@/app/layout/Header";
// import JobHeader from "@/app/layout/JobHeader";
// import TestimonialsSlider from "../components/TestimonialsSlider";
// import Studentimagesslider from "../components/Studentimageslider";
// import Counter from "@/app/WP/Counter";

// const CAREER_URL = "https://jobportal.careervidya.in/";

// const PARTNER_LOGOS = [
//   { name: "Amity University", image: "/images/w2.webp" },
//   { name: "LPU Online", image: "/images/w1.webp" },
//   { name: "Manipal University", image: "/images/w3.webp" },
//   { name: "Chandigarh University", image: "/images/w4.webp" },
// ];

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
//     company: "Samsung",
//     short: "S",
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
//   const [mode, setMode] = useState("vidya");

//   const modeData = {
//     career: {
//       eyebrow: "💼 CAREER FOCUS • 350+ Live Jobs",
//       headline: <>Are You Ready for the Opportunity You Want? </>,
//       subtext:
//         "Get expert support to strengthen your resume and LinkedIn profile, prepare for interviews and approach relevant job opportunities with greater confidence.",
//       dropdownLabel: "CAREER GOAL",
//       options: [
//         "Finding jobs & internships",
//         "Resume & LinkedIn Profile Review",
//         "Job-Ready Skill Development",
//       ],
//       btnText: "Go to Job Portal →",
//       url: CAREER_URL,
//     },

//     vidya: {
//       eyebrow: "📚 VIDYA FOCUS • 500+ Top Courses",
//       headline: (
//         <>
//           Your Future Isn’t One Decision.  <br />
//           <span style={{ color: "#F97316" }}>It’s a Series of Right Ones.</span>
//         </>
//       ),
//       subtext:
//         " From comparing courses and universities to upskilling, interview preparation and job support, Career Vidya’s expert mentors connect every decision that shapes your future.",
//       dropdownLabel: "COURSE GOAL",
//       options: [
//         "Comparing Top Universities",
//         "Choosing the Right Degree Course",
//         "Free University Counseling",
//       ],
//       btnText: "Explore Website Courses →",
//       url: "/courses",
//     },
//   };

//   const active = modeData[mode];

//   return (
//     <div className="cv-root">
//       {mode === "vidya" ? <Header /> : <JobHeader />}

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

//         * {
//           box-sizing: border-box;
//         }

//         .cv-root {
//           --ink: var(--cv-neutral-dark);
//           --muted: var(--cv-neutral-mid);
//           --line: var(--cv-neutral-border);
//           --surface: var(--cv-neutral-light);
//           --panel: #ffffff;

//           font-family: var(--font-poppins), 'Poppins', sans-serif;
//           color: var(--ink);
//           background: var(--surface);
//           overflow-x: hidden;
//         }

//         a {
//           text-decoration: none;
//           color: inherit;
//         }

//         button {
//           font-family: inherit;
//         }

//         .cv-container {
//           max-width: 1380px;
//           margin: 0 auto;
//           padding: 0 24px;
//         }

//         /* ═══════════════ HERO BACKGROUND IMAGE ═══════════════ */

//         .cv-hero-bg {
//           width: 100%;
//           padding: 40px 20px 40px;
//           margin-bottom: 32px;

//           background-image:
//              linear-gradient(rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0.45)),
//             url('/images/testin6.jpeg');

//           background-color: #ffffff;
//           background-size: 100% auto;
//           background-position: center top;
//           background-repeat: no-repeat;
//         }

//         .cv-hero-bg.mode-vidya {
//           background-image:
//             url('/images/testin6.jpeg');
//         }

//         .cv-hero-bg.mode-career {
//           background-image:
//             url('/images/testing5.jpeg');
//         }

//         .cv-hero-bg .cv-hero-center {
//           margin-top: 0;
//         }

//         .cv-hero-bg .cv-form-card {
//           margin-bottom: 0;
//         }

//         /* ═══════════════ HERO CENTER ═══════════════ */

//         .cv-hero-center {
//           max-width: 1420px;
//           margin: 40px auto 0;
//           padding: 0 20px;
//           text-align: center;
//         }

//         /* Vidya mode: narrow centered text so it stays between the faces */
//         .cv-hero-center.mode-vidya {
//           max-width: 700px;
//         }

//         .cv-hero-center.mode-vidya .cv-hero-headline {
//           font-size: 34px;
//         }

//         .cv-hero-center.mode-vidya .cv-hero-subtext {
//           max-width: 600px;
//           font-size: 17px;
//           margin-left: auto;
//           margin-right: auto;
//           text-align: center;
//         }

//         .cv-hero-badge {
//           display: inline-flex;
//           align-items: center;
//           gap: 6px;
//           padding: 6px 14px;
//           background: var(--cv-primary-light);
//           color: var(--cv-primary);
//           border-radius: 50px;
//           font-size: 12px;
//           font-weight: 700;
//           margin-bottom: 18px;
//         }

//         .cv-hero-headline {
//           font-size: 38px;
//           font-weight: 800;
//           line-height: 1.15;
//           letter-spacing: -1px;
//           margin-bottom: 12px;
//           color: #000000;
//           animation: heroFadeIn 0.4s ease-out;
//         }

//         @keyframes heroFadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(8px);
//           }

//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .cv-hero-subtext {
//           color: #000000;
//           font-size: 19px;
//           font-weight: 600;
//           line-height: 1.6;
//           margin-bottom: 28px;
//           max-width: 1360px;
//           margin-left: auto;
//           margin-right: auto;
//           text-wrap: balance;
//         }

//         /* ═══════════════ FORM CARD ═══════════════ */

//         .cv-form-card {
//           background: #ffffff;
//           border-radius: 20px;
//           padding: 22px 24px;

//           box-shadow:
//             0 30px 70px rgba(15, 23, 42, 0.28),
//             0 10px 24px rgba(15, 23, 42, 0.14);

//           border: 1px solid rgba(255, 255, 255, 0.7);

//           max-width: 540px;
//           margin: 0 auto 40px;
//           text-align: left;

//           transition:
//             box-shadow 0.4s ease,
//             border-color 0.4s ease;
//         }

//         /* ═══════════════ SWITCHER ═══════════════ */

//         .cv-switcher {
//           display: grid;
//           grid-template-columns: 1fr 1fr;
//           gap: 10px;

//           background: var(--cv-neutral-light);
//           padding: 6px;
//           border-radius: 14px;
//           margin-bottom: 16px;
//         }

//         .cv-switch-btn {
//           border: 1px solid transparent;
//           background: transparent;

//           padding: 10px;
//           border-radius: 10px;

//           cursor: pointer;
//           text-align: center;

//           font-weight: 700;
//           font-size: 14px;

//           color: var(--cv-neutral-mid);

//           transition:
//             background 0.3s ease,
//             color 0.3s ease,
//             box-shadow 0.3s ease,
//             transform 0.2s ease;
//         }

//         .cv-switch-btn.active {
//           background: #ffffff;
//           color: var(--cv-primary);

//           box-shadow:
//             0 4px 12px rgba(0, 0, 0, 0.06);
//         }

//         /* ═══════════════ CAREER PORTAL BUTTON ═══════════════ */

//         .cv-form-card.mode-career .cv-switch-btn:first-child {
//           background: linear-gradient(
//             135deg,
//             #2563eb,
//             #1d4ed8
//           );

//           color: #ffffff;

//           box-shadow:
//             0 6px 16px rgba(37, 99, 235, 0.30);
//         }

//         .cv-form-card.mode-career .cv-switch-btn:first-child:hover {
//           background: linear-gradient(
//             135deg,
//             #1d4ed8,
//             #1e3a8a
//           );

//           color: #ffffff;

//           transform: translateY(-1px);

//           box-shadow:
//             0 8px 20px rgba(37, 99, 235, 0.40);
//         }

//         /* Career mode — inactive Vidya */
//         .cv-form-card.mode-career .cv-switch-btn:last-child {
//           background: #eff6ff;
//           color: #2563eb;
//         }

//         .cv-form-card.mode-career .cv-switch-btn:last-child:hover {
//           background: #dbeafe;
//           color: #1d4ed8;
//         }

//         /* ═══════════════ VIDYA COURSES BUTTON ═══════════════ */

//         .cv-form-card.mode-vidya .cv-switch-btn:last-child {
//           background: linear-gradient(
//             135deg,
//             #f97316,
//             #ea580c
//           );

//           color: #ffffff;

//           box-shadow:
//             0 6px 16px rgba(249, 115, 22, 0.30);
//         }

//         .cv-form-card.mode-vidya .cv-switch-btn:last-child:hover {
//           background: linear-gradient(
//             135deg,
//             #ea580c,
//             #c2410c
//           );

//           color: #ffffff;

//           transform: translateY(-1px);

//           box-shadow:
//             0 8px 20px rgba(234, 88, 12, 0.40);
//         }

//         /* Vidya mode — inactive Career */
//         .cv-form-card.mode-vidya .cv-switch-btn:first-child {
//           background: #fff7ed;
//           color: #ea580c;
//         }

//         .cv-form-card.mode-vidya .cv-switch-btn:first-child:hover {
//           background: #ffedd5;
//           color: #c2410c;
//         }

//         /* ═══════════════ INPUTS ═══════════════ */

//         .cv-input-group {
//           margin-bottom: 16px;
//         }

//         .cv-input-group label {
//           font-size: 11px;
//           font-weight: 800;
//           color: var(--cv-neutral-mid);

//           display: block;
//           margin-bottom: 6px;

//           letter-spacing: 0.05em;
//           text-transform: uppercase;
//         }

//         .cv-input-group input,
//         .cv-input-group select {
//           width: 100%;
//           padding: 12px 14px;

//           border-radius: 10px;
//           border: 1.5px solid var(--cv-neutral-border);

//           font-weight: 600;
//           font-size: 14px;

//           outline: none;

//           background: #ffffff;
//           color: var(--cv-neutral-dark);

//           transition: all 0.2s ease;
//         }

//         .cv-input-group input:focus,
//         .cv-input-group select:focus {
//           border-color: var(--cv-primary);

//           box-shadow:
//             0 0 0 3px rgba(30, 58, 138, 0.1);
//         }

//         /* ═══════════════ SUBMIT BUTTON ═══════════════ */

//         .cv-submit-btn {
//           width: 100%;
//           padding: 13px;

//           background: var(--cv-grad-cta);
//           color: #ffffff;

//           border: none;
//           border-radius: 12px;

//           font-size: 15px;
//           font-weight: 800;

//           cursor: pointer;
//           transition: 0.3s;

//           margin-top: 4px;

//           box-shadow:
//             0 8px 20px rgba(193, 83, 4, 0.35);
//         }

//         .cv-submit-btn:hover {
//           background: var(--cv-grad-cta-hover);

//           transform: translateY(-1px);

//           box-shadow:
//             0 12px 28px rgba(193, 83, 4, 0.5);
//         }

//         /* ═══════════════ FLOATING LABEL ═══════════════ */

//         .cv-input-group.cv-float {
//           position: relative;
//           margin-bottom: 14px;
//         }

//         .cv-input-group.cv-float input,
//         .cv-input-group.cv-float select {
//           padding: 12px 14px;
//         }

//         .cv-input-group.cv-float label {
//           position: absolute;

//           left: 12px;
//           top: 50%;

//           transform: translateY(-50%);

//           margin: 0;
//           padding: 0 6px;

//           background: #ffffff;

//           font-size: 14px;
//           font-weight: 600;

//           letter-spacing: 0;
//           text-transform: none;

//           color: var(--cv-neutral-mid);

//           pointer-events: none;

//           transition:
//             top 0.25s ease,
//             transform 0.25s ease,
//             font-size 0.25s ease,
//             color 0.25s ease;
//         }

//         .cv-input-group.cv-float input:focus + label,
//         .cv-input-group.cv-float input:not(:placeholder-shown) + label,
//         .cv-input-group.cv-float.is-select label {
//           top: 0;

//           transform: translateY(-50%);

//           font-size: 11.5px;
//           font-weight: 800;
//         }

//         /* ═══════════════ MODE INPUT COLORS ═══════════════ */

//         .cv-form-card.mode-vidya
//         .cv-input-group.cv-float
//         input:focus + label,
//         .cv-form-card.mode-vidya
//         .cv-input-group.cv-float
//         select:focus + label {
//           color: #ea580c;
//         }

//         .cv-form-card.mode-career
//         .cv-input-group.cv-float
//         input:focus + label,
//         .cv-form-card.mode-career
//         .cv-input-group.cv-float
//         select:focus + label {
//           color: #1d4ed8;
//         }

//         .cv-form-card.mode-vidya
//         .cv-input-group
//         input:focus,
//         .cv-form-card.mode-vidya
//         .cv-input-group
//         select:focus {
//           border-color: #f97316;

//           box-shadow:
//             0 0 0 3px rgba(249, 115, 22, 0.15);
//         }

//         .cv-form-card.mode-career
//         .cv-input-group
//         input:focus,
//         .cv-form-card.mode-career
//         .cv-input-group
//         select:focus {
//           border-color: #2563eb;

//           box-shadow:
//             0 0 0 3px rgba(37, 99, 235, 0.15);
//         }

//         /* ═══════════════ FORM GLOW ═══════════════ */

//         .cv-form-card.mode-vidya {
//           border-color: rgba(249, 115, 22, 0.35);

//           box-shadow:
//             0 0 0 4px rgba(249, 115, 22, 0.12),
//             0 0 45px 8px rgba(249, 115, 22, 0.35),
//             0 30px 70px rgba(15, 23, 42, 0.25);
//         }

//         .cv-form-card.mode-career {
//           border-color: rgba(37, 99, 235, 0.35);

//           box-shadow:
//             0 0 0 4px rgba(37, 99, 235, 0.12),
//             0 0 45px 8px rgba(37, 99, 235, 0.35),
//             0 30px 70px rgba(15, 23, 42, 0.25);
//         }

//         /* ═══════════════ SUBMIT BUTTON — VIDYA ═══════════════ */

//         .cv-form-card.mode-vidya .cv-submit-btn {
//           background: linear-gradient(
//             135deg,
//             #f97316,
//             #ea580c
//           );

//           box-shadow:
//             0 8px 20px rgba(234, 88, 12, 0.4);
//         }

//         .cv-form-card.mode-vidya .cv-submit-btn:hover {
//           background: linear-gradient(
//             135deg,
//             #ea580c,
//             #c2410c
//           );

//           box-shadow:
//             0 12px 28px rgba(234, 88, 12, 0.55);
//         }

//         /* ═══════════════ SUBMIT BUTTON — CAREER ═══════════════ */

//         .cv-form-card.mode-career .cv-submit-btn {
//           background: linear-gradient(
//             135deg,
//             #2563eb,
//             #1d4ed8
//           );

//           box-shadow:
//             0 8px 20px rgba(29, 78, 216, 0.4);
//         }

//         .cv-form-card.mode-career .cv-submit-btn:hover {
//           background: linear-gradient(
//             135deg,
//             #1d4ed8,
//             #1e3a8a
//           );

//           box-shadow:
//             0 12px 28px rgba(29, 78, 216, 0.55);
//         }

//         /* ═══════════════ RESPONSIVE ═══════════════ */

//         @media (max-width: 900px) {
//           .cv-hero-center.mode-vidya .cv-hero-headline {
//             font-size: 28px;
//           }

//           .cv-hero-center.mode-vidya .cv-hero-subtext {
//             font-size: 14px;
//           }

//           .cv-hero-headline {
//             font-size: 30px;
//             letter-spacing: -0.5px;
//           }

//           .cv-hero-subtext {
//             font-size: 14px;
//             font-weight: 600;
//           }

//           .cv-form-card {
//             padding: 18px;
//           }
//         }

//         @media (max-width: 500px) {
//           .cv-hero-headline {
//             font-size: 26px;
//           }

//           .cv-switch-btn {
//             padding: 12px;
//             font-size: 12px;
//           }
//         }

//         /* ═══════════════ TRENDING ═══════════════ */

//         .cv-trending {
//           padding: 40px 0 20px;
//         }

//         .cv-trending-grid {
//           display: grid;
//           grid-template-columns: 1fr;
//           gap: 20px;
//         }

//         @media (min-width: 900px) {
//           .cv-trending-grid {
//             grid-template-columns: 1fr 1fr;
//             gap: 22px;
//           }
//         }

//         .cv-trending-col {
//           border: 1px solid var(--line);
//           border-radius: 18px;

//           padding: 18px;

//           background: var(--panel);

//           display: flex;
//           flex-direction: column;
//         }

//         .cv-trending-headrow {
//           display: flex;
//           align-items: flex-start;
//           justify-content: space-between;

//           gap: 10px;
//           margin-bottom: 4px;
//         }

//         .cv-trending-headrow-icon {
//           width: 36px;
//           height: 36px;

//           border-radius: 10px;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           flex-shrink: 0;
//         }

//         .cv-trending-col.jobs
//         .cv-trending-headrow-icon {
//           background: var(--cv-accent-light);
//           color: var(--cv-accent);
//         }

//         .cv-trending-col.courses
//         .cv-trending-headrow-icon {
//           background: var(--cv-primary-light);
//           color: var(--cv-primary);
//         }

//         .cv-trending-headtext {
//           flex: 1;
//           min-width: 0;
//         }

//         .cv-trending-title-lg {
//           font-size: 17.5px;
//           font-weight: 700;
//           color: var(--ink);
//         }

//         .cv-trending-title-lg .accent-gold {
//           color: var(--cv-accent);
//         }

//         .cv-trending-title-lg .accent-teal {
//           color: var(--cv-primary);
//         }

//         .cv-trending-caption {
//           font-size: 12px;
//           color: var(--muted);
//           margin-top: 2px;
//         }

//         .cv-trending-viewall {
//           font-size: 12px;
//           font-weight: 700;
//           color: var(--muted);

//           white-space: nowrap;

//           padding-top: 8px;

//           display: inline-flex;
//           align-items: center;

//           gap: 3px;
//         }

//         .cv-trending-firelabel {
//           font-size: 13px;
//           font-weight: 700;

//           display: inline-flex;
//           align-items: center;

//           gap: 6px;

//           margin-bottom: 10px;
//           margin-top: 10px;
//         }

//         .cv-trending-stack {
//           display: flex;
//           flex-direction: column;

//           gap: 10px;

//           margin-bottom: 14px;
//         }

//         .cv-trending-card {
//           display: flex;
//           align-items: center;

//           gap: 12px;

//           padding: 12px;

//           border: 1px solid var(--line);
//           border-radius: 14px;
//         }

//         .cv-trending-logo {
//           width: 38px;
//           height: 38px;

//           border-radius: 10px;

//           display: flex;
//           align-items: center;
//           justify-content: center;

//           flex-shrink: 0;

//           font-weight: 700;
//           font-size: 13px;

//           overflow: hidden;
//         }

//         .cv-trending-logo img {
//           width: 100%;
//           height: 100%;
//           object-fit: contain;
//         }

//         .cv-trending-info {
//           flex: 1;
//           min-width: 0;
//         }

//         .cv-trending-title-row {
//           display: flex;
//           align-items: center;

//           gap: 6px;
//         }

//         .cv-trending-title {
//           font-size: 13.5px;
//           font-weight: 700;

//           color: var(--ink);

//           white-space: nowrap;
//           overflow: hidden;
//           text-overflow: ellipsis;
//         }

//         .cv-new-badge {
//           font-size: 9.5px;
//           font-weight: 700;

//           color: var(--cv-accent-dark);
//           background: var(--cv-accent-light);

//           border-radius: 999px;

//           padding: 1.5px 7px;

//           flex-shrink: 0;
//         }

//         .cv-trending-org {
//           font-size: 12px;
//           color: var(--muted);
//           margin-top: 1px;
//         }

//         .cv-trending-sub {
//           font-size: 11px;
//           color: var(--muted);

//           margin-top: 3px;

//           display: flex;
//           align-items: center;

//           gap: 4px;

//           flex-wrap: wrap;
//         }

//         .cv-trending-right {
//           display: flex;
//           flex-direction: column;

//           align-items: flex-end;

//           gap: 6px;

//           flex-shrink: 0;
//         }

//         .cv-trending-price {
//           font-size: 12.5px;
//           font-weight: 700;
//         }

//         .cv-trending-col.jobs
//         .cv-trending-price {
//           color: var(--cv-accent);
//         }

//         .cv-trending-col.courses
//         .cv-trending-price {
//           color: var(--cv-primary);
//         }

//         .cv-trending-cta {
//           font-size: 11.5px;
//           font-weight: 700;

//           padding: 7px 13px;

//           border-radius: 8px;
//           border: none;

//           display: inline-flex;
//           align-items: center;

//           gap: 4px;

//           cursor: pointer;

//           color: #fff;
//         }

//         .cv-trending-col.jobs
//         .cv-trending-cta {
//           background: var(--cv-grad-cta);
//         }

//         .cv-trending-col.courses
//         .cv-trending-cta {
//           background: var(--cv-primary);
//         }

//         .cv-trending-more {
//           width: 100%;

//           text-align: center;

//           font-size: 13px;
//           font-weight: 700;

//           color: var(--ink);

//           padding: 11px;

//           border-radius: 10px;

//           border: 1px dashed var(--line);

//           background: #fff;

//           cursor: pointer;

//           margin-top: auto;
//         }

//         /* ═══════════════ PARTNERS MARQUEE ═══════════════ */

//         .cv-partners-marquee {
//           width: 100%;
//           overflow: hidden;

//           position: relative;

//           padding: 20px 0;

//           mask-image:
//             linear-gradient(
//               to right,
//               transparent,
//               black 6%,
//               black 94%,
//               transparent
//             );
//         }

//         .cv-partners-track {
//           display: flex;
//           align-items: center;

//           gap: 16px;

//           width: max-content;

//           animation:
//             cv-marquee 32s linear infinite;
//         }

//         @keyframes cv-marquee {
//           from {
//             transform: translateX(0);
//           }

//           to {
//             transform: translateX(-50%);
//           }
//         }

//         .cv-partner-logo {
//           display: flex;
//           align-items: center;
//           justify-content: center;

//           padding: 12px 22px;

//           border: 1px solid var(--line);

//           border-radius: 14px;

//           background: #fff;
//         }
//       `}</style>

//       {/* ═══════════ HERO ═══════════ */}

//       <div className={`cv-hero-bg mode-${mode}`}>
//         <section className={`cv-hero-center mode-${mode}`} key={`hero-${mode}`}>
//           <span className="cv-hero-badge">{active.eyebrow}</span>

//           <h1 className="cv-hero-headline">{active.headline}</h1>

//           <p className="cv-hero-subtext">{active.subtext}</p>
//         </section>

//         {/* ═══════════ FORM CARD ═══════════ */}

//         <div className={`cv-form-card mode-${mode}`}>
//           <div className="cv-switcher">
//             <button
//               type="button"
//               className={`cv-switch-btn ${mode === "career" ? "active" : ""}`}
//               onClick={() => setMode("career")}
//             >
//               💼 Career Portal
//             </button>

//             <button
//               type="button"
//               className={`cv-switch-btn ${mode === "vidya" ? "active" : ""}`}
//               onClick={() => setMode("vidya")}
//             >
//               📚 Vidya Courses
//             </button>
//           </div>

//           <form
//             onSubmit={(e) => {
//               e.preventDefault();
//               window.location.href = active.url;
//             }}
//           >
//             <div className="cv-input-group cv-float">
//               <input id="cv-name" type="text" placeholder=" " required />
//               <label htmlFor="cv-name">Your Name</label>
//             </div>

//             <div className="cv-input-group cv-float">
//               <input id="cv-mobile" type="tel" placeholder=" " required />
//               <label htmlFor="cv-mobile">Mobile Number</label>
//             </div>

//             <div className="cv-input-group cv-float is-select">
//               <select id="cv-goal">
//                 {active.options.map((opt) => (
//                   <option key={opt}>{opt}</option>
//                 ))}
//               </select>

//               <label htmlFor="cv-goal">{active.dropdownLabel}</label>
//             </div>

//             <button type="submit" className="cv-submit-btn">
//               {active.btnText}
//             </button>
//           </form>
//         </div>

//       </div>

//       <Counter />

//       {/* ═══════════ MODE BASED SLIDER ═══════════ */}

//       {mode === "vidya" ? (
//         <TestimonialsSlider key="testimonials" />
//       ) : (
//         <Studentimagesslider key="students" />
//       )}

//       {/* ═══════════ PARTNER LOGOS ═══════════ */}

//       <div className="cv-partners-marquee">
//         <div className="cv-partners-track">
//           {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
//             <div className="cv-partner-logo" key={`${p.name}-${i}`}>
//               <img
//                 src={p.image}
//                 alt={`${p.name} logo`}
//                 className="w-[152px] h-[40px] object-contain"
//               />
//             </div>
//           ))}
//         </div>
//       </div>

//       <FAQ />

//       <Footer />
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  GraduationCap,
  Briefcase,
  MapPin,
  Clock,
} from "lucide-react";

import FAQ from "@/app/components/FAQ.jsx";
import Footer from "@/app/layout/Footer";
import Header from "@/app/layout/Header";
import JobHeader from "@/app/layout/JobHeader";
import TestimonialsSlider from "../components/TestimonialsSlider";
import Studentimagesslider from "../components/Studentimageslider";
import Counter from "@/app/WP/Counter";

const CAREER_URL = "https://jobportal.careervidya.in/";

const HERO_IMAGES = {
  vidya: "/images/testin6.jpeg",
  career: "/images/testin6.jpeg",
};

const PARTNER_LOGOS = [
  { name: "Amity University", image: "/images/w2.webp" },
  { name: "LPU Online", image: "/images/w1.webp" },
  { name: "Manipal University", image: "/images/w3.webp" },
  { name: "Chandigarh University", image: "/images/w4.webp" },
];

const TRENDING_JOBS = [
  {
    title: "Software Engineer",
    company: "HCL Technologies",
    short: "HCL",
    logo: "/images/hcl2.jpeg",
    mono: "#e11d48",
    location: "Bangalore",
    workMode: "Full-time",
    exp: "2-5 Yrs",
    salary: "₹6 - 12 LPA",
    isNew: true,
    href: `${CAREER_URL}/jobs/software-engineer`,
  },
  {
    title: "System Engineer",
    company: "Infosys Limited",
    short: "IN",
    logo: "/images/inf1.jpeg",
    mono: "#2563eb",
    location: "Hyderabad",
    workMode: "Full-time",
    exp: "1-3 Yrs",
    salary: "₹4 - 8 LPA",
    isNew: true,
    href: `${CAREER_URL}/jobs/system-engineer`,
  },
  {
    title: "Associate Product Manager",
    company: "Samsung",
    short: "S",
    logo: "/images/sum.jpeg",
    mono: "#f59e0b",
    location: "Delhi NCR",
    workMode: "Full-time",
    exp: "3-6 Yrs",
    salary: "₹12 - 20 LPA",
    isNew: false,
    href: `${CAREER_URL}/jobs/associate-product-manager`,
  },
];

const TRENDING_COURSES_HOME = [
  {
    title: "MBA",
    sub: "Master of Business Administration",
    university: "Amity University",
    short: "AU",
    mono: "#8b5cf6",
    duration: "2 Years",
    fee: "₹2.5 - 15 LPA",
    href: "/course/online-mba-1",
  },
  {
    title: "B.Tech Computer Science",
    sub: "Bachelor of Technology",
    university: "LPU Online",
    short: "LPU",
    mono: "#0d9488",
    duration: "4 Years",
    fee: "₹1.2 - 6 LPA",
    href: "/course/btech-bachelors-of-technology",
  },
  {
    title: "BCA",
    sub: "Bachelor of Computer Applications",
    university: "Chandigarh University",
    short: "CU",
    mono: "#2563eb",
    duration: "3 Years",
    fee: "₹80K - 3 LPA",
    href: "/course/online-bca-bachelor-of-computer-applications",
  },
];

export default function CareerVidyaHome() {
  const [mode, setMode] = useState("vidya");

  const modeData = {
    career: {
      eyebrow: "💼 CAREER FOCUS • 350+ Live Jobs",
      headline: <>Are You Ready for the Opportunity You Want? </>,
      subtext:
        "Get expert support to strengthen your resume and LinkedIn profile, prepare for interviews and approach relevant job opportunities with greater confidence.",
      dropdownLabel: "CAREER GOAL",
      options: [
        "Finding jobs & internships",
        "Resume & LinkedIn Profile Review",
        "Job-Ready Skill Development",
      ],
      btnText: "Go to Job Portal →",
      url: CAREER_URL,
    },

    vidya: {
      eyebrow: "📚 VIDYA FOCUS • 500+ Top Courses",
      headline: (
        <>
          Your Future Isn’t One Decision.  <br />
          <span style={{ color: "#F97316" }}>It’s a Series of Right Ones.</span>
        </>
      ),
      subtext:
        " From comparing courses and universities to upskilling, interview preparation and job support, Career Vidya’s expert mentors connect every decision that shapes your future.",
      dropdownLabel: "COURSE GOAL",
      options: [
        "Comparing Top Universities",
        "Choosing the Right Degree Course",
        "Free University Counseling",
      ],
      btnText: "Explore Website Courses →",
      url: "/courses",
    },
  };

  const active = modeData[mode];

  return (
    <div className="cv-root">
      {mode === "vidya" ? <Header /> : <JobHeader />}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap');

        * {
          box-sizing: border-box;
        }

        .cv-root {
          --ink: var(--cv-neutral-dark);
          --muted: var(--cv-neutral-mid);
          --line: var(--cv-neutral-border);
          --surface: var(--cv-neutral-light);
          --panel: #ffffff;

          font-family: var(--font-poppins), 'Poppins', sans-serif;
          color: var(--ink);
          background: var(--surface);
          overflow-x: hidden;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          font-family: inherit;
        }

        .cv-container {
          max-width: 1380px;
          margin: 0 auto;
          padding: 0 24px;
        }

        /* ═══════════════ HERO BACKGROUND IMAGE ═══════════════ */

        /* Image and content share one grid cell, so the hero is always at
           least as tall as the image at its full width -> nothing gets cut */
        .cv-hero-bg {
          position: relative;
          width: 100%;
          margin-bottom: 32px;
          display: grid;
          background-color: #ffffff;
        }

        .cv-hero-img {
          grid-area: 1 / 1;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: contain;
          object-position: center top;
          z-index: 0;
        }

        .cv-hero-content {
          grid-area: 1 / 1;
          align-self: start;
          position: relative;
          z-index: 2;
          padding: 40px 20px 40px;
          min-width: 0;
        }

        .cv-hero-bg .cv-hero-center {
          margin-top: 0;
        }

        .cv-hero-bg .cv-form-card {
          margin-bottom: 0;
        }

        /* ═══════════════ HERO CENTER ═══════════════ */

        .cv-hero-center {
          max-width: 1420px;
          margin: 40px auto 0;
          padding: 0 20px;
          text-align: center;
        }

        /* Vidya mode: narrow centered text so it stays between the faces */
        .cv-hero-center.mode-vidya {
          max-width: 700px;
        }

        .cv-hero-center.mode-vidya .cv-hero-headline {
          font-size: 34px;
        }

        .cv-hero-center.mode-vidya .cv-hero-subtext {
          max-width: 600px;
          font-size: 17px;
          margin-left: auto;
          margin-right: auto;
          text-align: center;
        }

        .cv-hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          background: var(--cv-primary-light);
          color: var(--cv-primary);
          border-radius: 50px;
          font-size: 12px;
          font-weight: 700;
          margin-bottom: 18px;
        }

        .cv-hero-headline {
          font-size: 38px;
          font-weight: 800;
          line-height: 1.15;
          letter-spacing: -1px;
          margin-bottom: 12px;
          color: #000000;
          animation: heroFadeIn 0.4s ease-out;
        }

        @keyframes heroFadeIn {
          from {
            opacity: 0;
            transform: translateY(8px);
          }

          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .cv-hero-subtext {
          color: #000000;
          font-size: 19px;
          font-weight: 600;
          line-height: 1.6;
          margin-bottom: 28px;
          max-width: 1360px;
          margin-left: auto;
          margin-right: auto;
          text-wrap: balance;
        }

        /* ═══════════════ FORM CARD ═══════════════ */

        .cv-form-card {
          background: #ffffff;
          border-radius: 20px;
          padding: 22px 24px;

          box-shadow:
            0 30px 70px rgba(15, 23, 42, 0.28),
            0 10px 24px rgba(15, 23, 42, 0.14);

          border: 1px solid rgba(255, 255, 255, 0.7);

          max-width: 540px;
          margin: 0 auto 40px;
          text-align: left;

          transition:
            box-shadow 0.4s ease,
            border-color 0.4s ease;
        }

        /* ═══════════════ SWITCHER ═══════════════ */

        .cv-switcher {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 10px;

          background: var(--cv-neutral-light);
          padding: 6px;
          border-radius: 14px;
          margin-bottom: 16px;
        }

        .cv-switch-btn {
          border: 1px solid transparent;
          background: transparent;

          padding: 10px;
          border-radius: 10px;

          cursor: pointer;
          text-align: center;

          font-weight: 700;
          font-size: 14px;

          color: var(--cv-neutral-mid);

          transition:
            background 0.3s ease,
            color 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.2s ease;
        }

        .cv-switch-btn.active {
          background: #ffffff;
          color: var(--cv-primary);

          box-shadow:
            0 4px 12px rgba(0, 0, 0, 0.06);
        }

        /* ═══════════════ CAREER PORTAL BUTTON ═══════════════ */

        .cv-form-card.mode-career .cv-switch-btn:first-child {
          background: linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
          );

          color: #ffffff;

          box-shadow:
            0 6px 16px rgba(37, 99, 235, 0.30);
        }

        .cv-form-card.mode-career .cv-switch-btn:first-child:hover {
          background: linear-gradient(
            135deg,
            #1d4ed8,
            #1e3a8a
          );

          color: #ffffff;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(37, 99, 235, 0.40);
        }

        /* Career mode — inactive Vidya */
        .cv-form-card.mode-career .cv-switch-btn:last-child {
          background: #eff6ff;
          color: #2563eb;
        }

        .cv-form-card.mode-career .cv-switch-btn:last-child:hover {
          background: #dbeafe;
          color: #1d4ed8;
        }

        /* ═══════════════ VIDYA COURSES BUTTON ═══════════════ */

        .cv-form-card.mode-vidya .cv-switch-btn:last-child {
          background: linear-gradient(
            135deg,
            #f97316,
            #ea580c
          );

          color: #ffffff;

          box-shadow:
            0 6px 16px rgba(249, 115, 22, 0.30);
        }

        .cv-form-card.mode-vidya .cv-switch-btn:last-child:hover {
          background: linear-gradient(
            135deg,
            #ea580c,
            #c2410c
          );

          color: #ffffff;

          transform: translateY(-1px);

          box-shadow:
            0 8px 20px rgba(234, 88, 12, 0.40);
        }

        /* Vidya mode — inactive Career */
        .cv-form-card.mode-vidya .cv-switch-btn:first-child {
          background: #fff7ed;
          color: #ea580c;
        }

        .cv-form-card.mode-vidya .cv-switch-btn:first-child:hover {
          background: #ffedd5;
          color: #c2410c;
        }

        /* ═══════════════ INPUTS ═══════════════ */

        .cv-input-group {
          margin-bottom: 16px;
        }

        .cv-input-group label {
          font-size: 11px;
          font-weight: 800;
          color: var(--cv-neutral-mid);

          display: block;
          margin-bottom: 6px;

          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .cv-input-group input,
        .cv-input-group select {
          width: 100%;
          padding: 12px 14px;

          border-radius: 10px;
          border: 1.5px solid var(--cv-neutral-border);

          font-weight: 600;
          font-size: 14px;

          outline: none;

          background: #ffffff;
          color: var(--cv-neutral-dark);

          transition: all 0.2s ease;
        }

        .cv-input-group input:focus,
        .cv-input-group select:focus {
          border-color: var(--cv-primary);

          box-shadow:
            0 0 0 3px rgba(30, 58, 138, 0.1);
        }

        /* ═══════════════ SUBMIT BUTTON ═══════════════ */

        .cv-submit-btn {
          width: 100%;
          padding: 13px;

          background: var(--cv-grad-cta);
          color: #ffffff;

          border: none;
          border-radius: 12px;

          font-size: 15px;
          font-weight: 800;

          cursor: pointer;
          transition: 0.3s;

          margin-top: 4px;

          box-shadow:
            0 8px 20px rgba(193, 83, 4, 0.35);
        }

        .cv-submit-btn:hover {
          background: var(--cv-grad-cta-hover);

          transform: translateY(-1px);

          box-shadow:
            0 12px 28px rgba(193, 83, 4, 0.5);
        }

        /* ═══════════════ FLOATING LABEL ═══════════════ */

        .cv-input-group.cv-float {
          position: relative;
          margin-bottom: 14px;
        }

        .cv-input-group.cv-float input,
        .cv-input-group.cv-float select {
          padding: 12px 14px;
        }

        .cv-input-group.cv-float label {
          position: absolute;

          left: 12px;
          top: 50%;

          transform: translateY(-50%);

          margin: 0;
          padding: 0 6px;

          background: #ffffff;

          font-size: 14px;
          font-weight: 600;

          letter-spacing: 0;
          text-transform: none;

          color: var(--cv-neutral-mid);

          pointer-events: none;

          transition:
            top 0.25s ease,
            transform 0.25s ease,
            font-size 0.25s ease,
            color 0.25s ease;
        }

        .cv-input-group.cv-float input:focus + label,
        .cv-input-group.cv-float input:not(:placeholder-shown) + label,
        .cv-input-group.cv-float.is-select label {
          top: 0;

          transform: translateY(-50%);

          font-size: 11.5px;
          font-weight: 800;
        }

        /* ═══════════════ MODE INPUT COLORS ═══════════════ */

        .cv-form-card.mode-vidya
        .cv-input-group.cv-float
        input:focus + label,
        .cv-form-card.mode-vidya
        .cv-input-group.cv-float
        select:focus + label {
          color: #ea580c;
        }

        .cv-form-card.mode-career
        .cv-input-group.cv-float
        input:focus + label,
        .cv-form-card.mode-career
        .cv-input-group.cv-float
        select:focus + label {
          color: #1d4ed8;
        }

        .cv-form-card.mode-vidya
        .cv-input-group
        input:focus,
        .cv-form-card.mode-vidya
        .cv-input-group
        select:focus {
          border-color: #f97316;

          box-shadow:
            0 0 0 3px rgba(249, 115, 22, 0.15);
        }

        .cv-form-card.mode-career
        .cv-input-group
        input:focus,
        .cv-form-card.mode-career
        .cv-input-group
        select:focus {
          border-color: #2563eb;

          box-shadow:
            0 0 0 3px rgba(37, 99, 235, 0.15);
        }

        /* ═══════════════ FORM GLOW ═══════════════ */

        .cv-form-card.mode-vidya {
          border-color: rgba(249, 115, 22, 0.35);

          box-shadow:
            0 0 0 4px rgba(249, 115, 22, 0.12),
            0 0 45px 8px rgba(249, 115, 22, 0.35),
            0 30px 70px rgba(15, 23, 42, 0.25);
        }

        .cv-form-card.mode-career {
          border-color: rgba(37, 99, 235, 0.35);

          box-shadow:
            0 0 0 4px rgba(37, 99, 235, 0.12),
            0 0 45px 8px rgba(37, 99, 235, 0.35),
            0 30px 70px rgba(15, 23, 42, 0.25);
        }

        /* ═══════════════ SUBMIT BUTTON — VIDYA ═══════════════ */

        .cv-form-card.mode-vidya .cv-submit-btn {
          background: linear-gradient(
            135deg,
            #f97316,
            #ea580c
          );

          box-shadow:
            0 8px 20px rgba(234, 88, 12, 0.4);
        }

        .cv-form-card.mode-vidya .cv-submit-btn:hover {
          background: linear-gradient(
            135deg,
            #ea580c,
            #c2410c
          );

          box-shadow:
            0 12px 28px rgba(234, 88, 12, 0.55);
        }

        /* ═══════════════ SUBMIT BUTTON — CAREER ═══════════════ */

        .cv-form-card.mode-career .cv-submit-btn {
          background: linear-gradient(
            135deg,
            #2563eb,
            #1d4ed8
          );

          box-shadow:
            0 8px 20px rgba(29, 78, 216, 0.4);
        }

        .cv-form-card.mode-career .cv-submit-btn:hover {
          background: linear-gradient(
            135deg,
            #1d4ed8,
            #1e3a8a
          );

          box-shadow:
            0 12px 28px rgba(29, 78, 216, 0.55);
        }

        /* ═══════════════ RESPONSIVE ═══════════════ */

        @media (max-width: 900px) {
          .cv-hero-center.mode-vidya .cv-hero-headline {
            font-size: 28px;
          }

          .cv-hero-center.mode-vidya .cv-hero-subtext {
            font-size: 14px;
          }

          .cv-hero-headline {
            font-size: 30px;
            letter-spacing: -0.5px;
          }

          .cv-hero-subtext {
            font-size: 14px;
            font-weight: 600;
          }

          .cv-form-card {
            padding: 18px;
          }
        }

        @media (max-width: 500px) {
          .cv-hero-headline {
            font-size: 26px;
          }

          .cv-switch-btn {
            padding: 12px;
            font-size: 12px;
          }
        }


        /* ═══════════════ MOBILE HERO FIX (desktop untouched) ═══════════════ */

        @media (max-width: 768px) {
          .cv-hero-bg {
            margin-bottom: 20px;
          }

          .cv-hero-content {
            padding: 22px 14px 26px;
          }

          /* soft white layer so black text stays readable over the photo */
          .cv-hero-bg::before {
            content: "";
            position: absolute;
            inset: 0;
            background: rgba(255, 255, 255, 0.6);
            pointer-events: none;
            z-index: 1;
          }

          .cv-hero-bg .cv-hero-center,
          .cv-hero-center.mode-vidya {
            max-width: 100%;
            margin-top: 0;
            padding: 0 2px;
          }

          .cv-hero-badge {
            font-size: 11px;
            padding: 5px 12px;
            margin-bottom: 12px;
          }

          .cv-hero-headline,
          .cv-hero-center.mode-vidya .cv-hero-headline {
            font-size: 24px;
            line-height: 1.22;
            letter-spacing: -0.3px;
            margin-bottom: 10px;
          }

          .cv-hero-subtext,
          .cv-hero-center.mode-vidya .cv-hero-subtext {
            font-size: 13.5px;
            line-height: 1.5;
            max-width: 100%;
            margin-bottom: 18px;
          }

          .cv-form-card {
            max-width: 100%;
            padding: 16px;
            border-radius: 16px;
          }

          .cv-form-card.mode-vidya {
            box-shadow:
              0 0 0 3px rgba(249, 115, 22, 0.12),
              0 0 24px 4px rgba(249, 115, 22, 0.28),
              0 14px 34px rgba(15, 23, 42, 0.2);
          }

          .cv-form-card.mode-career {
            box-shadow:
              0 0 0 3px rgba(37, 99, 235, 0.12),
              0 0 24px 4px rgba(37, 99, 235, 0.28),
              0 14px 34px rgba(15, 23, 42, 0.2);
          }

          .cv-switcher {
            gap: 8px;
            padding: 5px;
            margin-bottom: 12px;
          }

          .cv-switch-btn {
            padding: 10px 6px;
            font-size: 12.5px;
          }

          .cv-input-group.cv-float {
            margin-bottom: 12px;
          }

          /* 16px stops iOS from zooming into the field */
          .cv-input-group input,
          .cv-input-group select {
            font-size: 16px;
          }

          .cv-submit-btn {
            padding: 13px;
            font-size: 14px;
          }
        }

        @media (max-width: 380px) {
          .cv-hero-headline,
          .cv-hero-center.mode-vidya .cv-hero-headline {
            font-size: 21px;
          }

          .cv-switch-btn {
            font-size: 11.5px;
          }
        }

        /* ═══════════════ TRENDING ═══════════════ */

        .cv-trending {
          padding: 40px 0 20px;
        }

        .cv-trending-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }

        @media (min-width: 900px) {
          .cv-trending-grid {
            grid-template-columns: 1fr 1fr;
            gap: 22px;
          }
        }

        .cv-trending-col {
          border: 1px solid var(--line);
          border-radius: 18px;

          padding: 18px;

          background: var(--panel);

          display: flex;
          flex-direction: column;
        }

        .cv-trending-headrow {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;

          gap: 10px;
          margin-bottom: 4px;
        }

        .cv-trending-headrow-icon {
          width: 36px;
          height: 36px;

          border-radius: 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;
        }

        .cv-trending-col.jobs
        .cv-trending-headrow-icon {
          background: var(--cv-accent-light);
          color: var(--cv-accent);
        }

        .cv-trending-col.courses
        .cv-trending-headrow-icon {
          background: var(--cv-primary-light);
          color: var(--cv-primary);
        }

        .cv-trending-headtext {
          flex: 1;
          min-width: 0;
        }

        .cv-trending-title-lg {
          font-size: 17.5px;
          font-weight: 700;
          color: var(--ink);
        }

        .cv-trending-title-lg .accent-gold {
          color: var(--cv-accent);
        }

        .cv-trending-title-lg .accent-teal {
          color: var(--cv-primary);
        }

        .cv-trending-caption {
          font-size: 12px;
          color: var(--muted);
          margin-top: 2px;
        }

        .cv-trending-viewall {
          font-size: 12px;
          font-weight: 700;
          color: var(--muted);

          white-space: nowrap;

          padding-top: 8px;

          display: inline-flex;
          align-items: center;

          gap: 3px;
        }

        .cv-trending-firelabel {
          font-size: 13px;
          font-weight: 700;

          display: inline-flex;
          align-items: center;

          gap: 6px;

          margin-bottom: 10px;
          margin-top: 10px;
        }

        .cv-trending-stack {
          display: flex;
          flex-direction: column;

          gap: 10px;

          margin-bottom: 14px;
        }

        .cv-trending-card {
          display: flex;
          align-items: center;

          gap: 12px;

          padding: 12px;

          border: 1px solid var(--line);
          border-radius: 14px;
        }

        .cv-trending-logo {
          width: 38px;
          height: 38px;

          border-radius: 10px;

          display: flex;
          align-items: center;
          justify-content: center;

          flex-shrink: 0;

          font-weight: 700;
          font-size: 13px;

          overflow: hidden;
        }

        .cv-trending-logo img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }

        .cv-trending-info {
          flex: 1;
          min-width: 0;
        }

        .cv-trending-title-row {
          display: flex;
          align-items: center;

          gap: 6px;
        }

        .cv-trending-title {
          font-size: 13.5px;
          font-weight: 700;

          color: var(--ink);

          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cv-new-badge {
          font-size: 9.5px;
          font-weight: 700;

          color: var(--cv-accent-dark);
          background: var(--cv-accent-light);

          border-radius: 999px;

          padding: 1.5px 7px;

          flex-shrink: 0;
        }

        .cv-trending-org {
          font-size: 12px;
          color: var(--muted);
          margin-top: 1px;
        }

        .cv-trending-sub {
          font-size: 11px;
          color: var(--muted);

          margin-top: 3px;

          display: flex;
          align-items: center;

          gap: 4px;

          flex-wrap: wrap;
        }

        .cv-trending-right {
          display: flex;
          flex-direction: column;

          align-items: flex-end;

          gap: 6px;

          flex-shrink: 0;
        }

        .cv-trending-price {
          font-size: 12.5px;
          font-weight: 700;
        }

        .cv-trending-col.jobs
        .cv-trending-price {
          color: var(--cv-accent);
        }

        .cv-trending-col.courses
        .cv-trending-price {
          color: var(--cv-primary);
        }

        .cv-trending-cta {
          font-size: 11.5px;
          font-weight: 700;

          padding: 7px 13px;

          border-radius: 8px;
          border: none;

          display: inline-flex;
          align-items: center;

          gap: 4px;

          cursor: pointer;

          color: #fff;
        }

        .cv-trending-col.jobs
        .cv-trending-cta {
          background: var(--cv-grad-cta);
        }

        .cv-trending-col.courses
        .cv-trending-cta {
          background: var(--cv-primary);
        }

        .cv-trending-more {
          width: 100%;

          text-align: center;

          font-size: 13px;
          font-weight: 700;

          color: var(--ink);

          padding: 11px;

          border-radius: 10px;

          border: 1px dashed var(--line);

          background: #fff;

          cursor: pointer;

          margin-top: auto;
        }

        /* ═══════════════ PARTNERS MARQUEE ═══════════════ */

        .cv-partners-marquee {
          width: 100%;
          overflow: hidden;

          position: relative;

          padding: 20px 0;

          mask-image:
            linear-gradient(
              to right,
              transparent,
              black 6%,
              black 94%,
              transparent
            );
        }

        .cv-partners-track {
          display: flex;
          align-items: center;

          gap: 16px;

          width: max-content;

          animation:
            cv-marquee 32s linear infinite;
        }

        @keyframes cv-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .cv-partner-logo {
          display: flex;
          align-items: center;
          justify-content: center;

          padding: 12px 22px;

          border: 1px solid var(--line);

          border-radius: 14px;

          background: #fff;
        }
      `}</style>

      {/* ═══════════ HERO ═══════════ */}

      <div className={`cv-hero-bg mode-${mode}`}>
        <img
          className="cv-hero-img"
          src={HERO_IMAGES[mode]}
          alt=""
          aria-hidden="true"
        />

        <div className="cv-hero-content">
        <section className={`cv-hero-center mode-${mode}`} key={`hero-${mode}`}>
          <span className="cv-hero-badge">{active.eyebrow}</span>

          <h1 className="cv-hero-headline">{active.headline}</h1>

          <p className="cv-hero-subtext">{active.subtext}</p>
        </section>

        {/* ═══════════ FORM CARD ═══════════ */}

        <div className={`cv-form-card mode-${mode}`}>
          <div className="cv-switcher">
            <button
              type="button"
              className={`cv-switch-btn ${mode === "career" ? "active" : ""}`}
              onClick={() => setMode("career")}
            >
              💼 Career Portal
            </button>

            <button
              type="button"
              className={`cv-switch-btn ${mode === "vidya" ? "active" : ""}`}
              onClick={() => setMode("vidya")}
            >
              📚 Vidya Courses
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              window.location.href = active.url;
            }}
          >
            <div className="cv-input-group cv-float">
              <input id="cv-name" type="text" placeholder=" " required />
              <label htmlFor="cv-name">Your Name</label>
            </div>

            <div className="cv-input-group cv-float">
              <input id="cv-mobile" type="tel" placeholder=" " required />
              <label htmlFor="cv-mobile">Mobile Number</label>
            </div>

            <div className="cv-input-group cv-float is-select">
              <select id="cv-goal">
                {active.options.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>

              <label htmlFor="cv-goal">{active.dropdownLabel}</label>
            </div>

            <button type="submit" className="cv-submit-btn">
              {active.btnText}
            </button>
          </form>
        </div>
        </div>
      </div>

      <Counter />

      {/* ═══════════ MODE BASED SLIDER ═══════════ */}

      {mode === "vidya" ? (
        <TestimonialsSlider key="testimonials" />
      ) : (
        <Studentimagesslider key="students" />
      )}

      {/* ═══════════ PARTNER LOGOS ═══════════ */}

      <div className="cv-partners-marquee">
        <div className="cv-partners-track">
          {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
            <div className="cv-partner-logo" key={`${p.name}-${i}`}>
              <img
                src={p.image}
                alt={`${p.name} logo`}
                className="w-[152px] h-[40px] object-contain"
              />
            </div>
          ))}
        </div>
      </div>

      <FAQ />

      <Footer />
    </div>
  );
}