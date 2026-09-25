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

// import FAQ from "../app/components/FAQ";
// import Footer from "@/app/layout/Footer";
// import Header from "@/app/layout/Header";
// import Counter from "../app/components/counter/page";
// import Getcourse from "../app/components/Getcourse";
// const CAREER_URL = "https://jobportal.careervidya.in/";
// const HERO_BG_IMG = "/images/Home2.jpeg";

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
//   return (
//     <div className="cv-root">
//       <Header />

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         * {
//           box-sizing: border-box;
//         }

//         .cv-root {
//           --ink: #0b1528;
//           --muted: #64748b;
//           --line: rgba(15, 23, 42, 0.08);
//           --surface: #f8fafc;
//           --panel: #ffffff;

//           font-family: 'Plus Jakarta Sans', sans-serif;
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

//         /* ================================
//            HERO
//         ================================= */

//         .cv-hero-section {
//           width: 100vw;
//           margin-left: calc(-50vw + 50%);
//           margin-right: calc(-50vw + 50%);

//           height: 760px;

//           overflow: hidden;
//           position: relative;

//           background: #ffffff;
//         }

//         .cv-hero-img {
//           width: 100%;
//           height: 760px;

//           display: block;

//           object-fit: fill;
//         }

//         /* CENTER CONTENT OVER IMAGE */

//         .cv-hero-center {
//           position: absolute;
//           inset: 0;

//           z-index: 5;

//           display: flex;
//           flex-direction: column;
//           align-items: center;

//           text-align: center;

//           padding: 42px 20px 0;

//           pointer-events: none;
//         }

//         .cv-hero-eyebrow {
//           font-size: 13px;
//           line-height: 1.4;

//           letter-spacing: 3px;

//           font-weight: 700;

//           color: #0674e8;

//           margin-bottom: 12px;
//         }

//         .cv-hero-title {
//           margin: 0;

//           font-size: clamp(34px, 4vw, 54px);

//           line-height: 1.05;

//           font-weight: 800;

//           color: #10396d;

//           letter-spacing: -1.5px;
//         }

//         .cv-hero-brand {
//           margin-top: 2px;

//           font-size: clamp(42px, 5vw, 62px);

//           line-height: 1.05;

//           font-weight: 800;

//           letter-spacing: -2px;
//         }

//         .cv-hero-brand-blue {
//           color: #075ecb;
//         }

//         .cv-hero-brand-orange {
//           color: #f58220;
//         }

//         .cv-hero-description {
//           max-width: 650px;

//           margin: 14px auto 0;

//           font-size: 16px;

//           line-height: 1.55;

//           font-weight: 500;

//           color: #173f78;
//         }

//         /* BUTTONS */

//         .cv-hero-actions {
//           display: flex;

//           align-items: center;

//           justify-content: center;

//           gap: 14px;

//           margin-top: 24px;

//           pointer-events: auto;
//         }

//         .cv-hero-btn {
//           min-width: 245px;

//           height: 46px;

//           padding: 0 22px;

//           border-radius: 999px;

//           display: inline-flex;

//           align-items: center;

//           justify-content: center;

//           gap: 8px;

//           font-size: 14px;

//           font-weight: 700;

//           cursor: pointer;

//           transition:
//             transform 0.2s ease,
//             box-shadow 0.2s ease;
//         }

//         .cv-hero-btn:hover {
//           transform: translateY(-2px);
//         }

//         .cv-hero-btn-primary {
//           color: #ffffff;

//           background: #086bd8;

//           border: 1px solid #086bd8;

//           box-shadow:
//             0 8px 20px rgba(8, 107, 216, 0.18);
//         }

//         .cv-hero-btn-secondary {
//           color: #086bd8;

//           background: rgba(255, 255, 255, 0.92);

//           border: 1px solid #9bc8fa;
//         }

//         /* ================================
//            MOBILE HERO
//         ================================= */

//         @media (max-width: 767px) {

//           .cv-hero-section {
//             height: 450px;
//           }

//           .cv-hero-img {
//             height: 450px;

//             max-height: 450px;

//             object-fit: cover;

//             object-position: center;
//           }

//           .cv-hero-center {
//             padding: 24px 12px 0;
//           }

//           .cv-hero-eyebrow {
//             font-size: 8px;

//             letter-spacing: 1.4px;

//             margin-bottom: 8px;
//           }

//           .cv-hero-title {
//             font-size: clamp(25px, 8vw, 38px);

//             letter-spacing: -0.8px;
//           }

//           .cv-hero-brand {
//             font-size: clamp(30px, 10vw, 46px);

//             letter-spacing: -1px;
//           }

//           .cv-hero-description {
//             max-width: 330px;

//             margin-top: 8px;

//             font-size: 11px;

//             line-height: 1.4;
//           }

//           .cv-hero-description br {
//             display: none;
//           }

//           .cv-hero-actions {
//             flex-direction: column;

//             gap: 8px;

//             margin-top: 14px;
//           }

//           .cv-hero-btn {
//             min-width: 205px;

//             height: 38px;

//             padding: 0 16px;

//             font-size: 11px;
//           }
//         }

//         /* ================================
//            LOWER SECTIONS
//         ================================= */

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
//           background: #fff7ed;

//           color: #ea580c;
//         }

//         .cv-trending-col.courses
//         .cv-trending-headrow-icon {
//           background: #f0f9ff;

//           color: #0284c7;
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
//           color: #ea580c;
//         }

//         .cv-trending-title-lg .accent-teal {
//           color: #0284c7;
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

//           color: #0d9488;

//           background: #e3f4f1;

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
//           color: #0d9488;
//         }

//         .cv-trending-col.courses
//         .cv-trending-price {
//           color: #0284c7;
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
//         }

//         .cv-trending-col.jobs
//         .cv-trending-cta {
//           background: #0284c7;

//           color: #fff;
//         }

//         .cv-trending-col.courses
//         .cv-trending-cta {
//           background: #f97316;

//           color: #fff;
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

//         /* ================================
//            PARTNER LOGOS
//         ================================= */

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

//       {/* =================================
//           HERO SECTION
//       ================================= */}

//       <section className="cv-hero-section">

//         <img
//           src={HERO_BG_IMG}
//           alt="CareerVidya Career and Education"
//           className="cv-hero-img"
//         />

//         {/* CENTER CONTENT */}
//         <div className="cv-hero-center">

//           {/* <div className="cv-hero-eyebrow">
//             YOUR CAREER&nbsp;&nbsp;+&nbsp;&nbsp;YOUR EDUCATION
//             &nbsp;&nbsp;=&nbsp;&nbsp; A BRIGHTER FUTURE
//           </div>

//           <h1 className="cv-hero-title">
//             Two Paths. One Destination.
//           </h1>

//           <div
//             className="cv-hero-brand"
//             aria-label="CareerVidya"
//           >
//             <span className="cv-hero-brand-blue">
//               Career
//             </span>

//             <span className="cv-hero-brand-orange">
//               Vidya
//             </span>
//           </div>

//           <p className="cv-hero-description">
//             Whether you want to build your career or pursue the right
//             education,
//             <br />
//             we provide expert guidance, trusted partners and personalized
//             support
//             <br />
//             to help you achieve your dreams.
//           </p> */}

//           {/* TWO CENTER BUTTONS */}
//           <div className="cv-hero-actions">

//             <a
//               href={CAREER_URL}
//               className="cv-hero-btn cv-hero-btn-primary"
//             >
//               Explore Career Opportunities
//               <ArrowRight size={17} />
//             </a>

//             <a
//               href="/Homepage"
//               className="cv-hero-btn cv-hero-btn-secondary"
//             >
//               Find the Right Course
//               <ArrowRight size={17} />
//             </a>

//           </div>

//         </div>
//       </section>

//       {/* =================================
//           TRENDING SECTIONS
//       ================================= */}

//       <div className="cv-container cv-trending">

//         <div className="cv-trending-grid">

//           {/* JOBS */}

//           <div className="cv-trending-col jobs">

//             <div className="cv-trending-headrow">

//               <div className="cv-trending-headrow-icon">
//                 <Briefcase size={17} />
//               </div>

//               <div className="cv-trending-headtext">

//                 <div className="cv-trending-title-lg">
//                   Explore Top{" "}
//                   <span className="accent-gold">
//                     Job Opportunities
//                   </span>
//                 </div>

//                 <div className="cv-trending-caption">
//                   Find the perfect job that matches your skills and build
//                   your dream career.
//                 </div>

//               </div>

//               <a
//                 href={`${CAREER_URL}/jobs`}
//                 className="cv-trending-viewall"
//               >
//                 View all jobs
//                 <ArrowUpRight size={12} />
//               </a>

//             </div>

//             <div className="cv-trending-firelabel">
//               🔥 Trending Jobs
//             </div>

//             <div className="cv-trending-stack">

//               {TRENDING_JOBS?.map((j) => (

//                 <div
//                   className="cv-trending-card"
//                   key={j.title}
//                 >

//                   <div
//                     className="cv-trending-logo"
//                     style={{
//                       background: `${j.mono}1a`,
//                       color: j.mono,
//                     }}
//                   >
//                     {j.logo ? (
//                       <img
//                         src={j.logo}
//                         alt={j.company}
//                       />
//                     ) : (
//                       j.short
//                     )}
//                   </div>

//                   <div className="cv-trending-info">

//                     <div className="cv-trending-title-row">

//                       <span className="cv-trending-title">
//                         {j.title}
//                       </span>

//                       {j.isNew && (
//                         <span className="cv-new-badge">
//                           New
//                         </span>
//                       )}

//                     </div>

//                     <div className="cv-trending-org">
//                       {j.company}
//                     </div>

//                     <div className="cv-trending-sub">

//                       <span>
//                         <MapPin
//                           size={11}
//                           style={{
//                             verticalAlign: "-2px",
//                           }}
//                         />{" "}
//                         {j.location}
//                       </span>

//                       <span>•</span>

//                       <span>
//                         {j.workMode}
//                       </span>

//                       <span>•</span>

//                       <span>
//                         <Clock
//                           size={11}
//                           style={{
//                             verticalAlign: "-2px",
//                           }}
//                         />{" "}
//                         {j.exp}
//                       </span>

//                     </div>

//                   </div>

//                   <div className="cv-trending-right">

//                     <span className="cv-trending-price">
//                       {j.salary}
//                     </span>

//                     <button
//                       className="cv-trending-cta"
//                       onClick={() =>
//                         (window.location.href = CAREER_URL)
//                       }
//                     >
//                       Apply Now
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>

//             <button
//               className="cv-trending-more"
//               onClick={() =>
//                 (window.location.href = `${CAREER_URL}/`)
//               }
//             >
//               View all jobs
//               <ArrowRight
//                 size={13}
//                 style={{
//                   verticalAlign: "-2px",
//                 }}
//               />
//             </button>

//           </div>

//           {/* COURSES */}

//           <div className="cv-trending-col courses">

//             <div className="cv-trending-headrow">

//               <div className="cv-trending-headrow-icon">
//                 <GraduationCap size={17} />
//               </div>

//               <div className="cv-trending-headtext">

//                 <div className="cv-trending-title-lg">
//                   Explore Top{" "}
//                   <span className="accent-teal">
//                     Courses &amp; Universities
//                   </span>
//                 </div>

//                 <div className="cv-trending-caption">
//                   Discover the best courses and top universities to shape
//                   your future.
//                 </div>

//               </div>

//               <a
//                 href="/explore"
//                 className="cv-trending-viewall"
//               >
//                 View all courses
//                 <ArrowUpRight size={12} />
//               </a>

//             </div>

//             <div className="cv-trending-firelabel">
//               🔥 Trending Courses
//             </div>

//             <div className="cv-trending-stack">

//               {TRENDING_COURSES_HOME?.map((c) => (

//                 <div
//                   className="cv-trending-card"
//                   key={c.title}
//                 >

//                   <div
//                     className="cv-trending-logo"
//                     style={{
//                       background: `${c.mono}1a`,
//                       color: c.mono,
//                     }}
//                   >
//                     {c.short}
//                   </div>

//                   <div className="cv-trending-info">

//                     <div className="cv-trending-title-row">

//                       <span className="cv-trending-title">
//                         {c.title}
//                       </span>

//                     </div>

//                     <div className="cv-trending-org">
//                       {c.sub}
//                     </div>

//                     <div className="cv-trending-sub">

//                       <span>
//                         {c.university}
//                       </span>

//                       <span>•</span>

//                       <span>
//                         <Clock
//                           size={11}
//                           style={{
//                             verticalAlign: "-2px",
//                           }}
//                         />{" "}
//                         {c.duration}
//                       </span>

//                     </div>

//                   </div>

//                   <div className="cv-trending-right">

//                     <span className="cv-trending-price">
//                       {c.fee}
//                     </span>

//                     <button
//                       className="cv-trending-cta"
//                       onClick={() =>
//                         (window.location.href = c.href)
//                       }
//                     >
//                       Apply Now
//                     </button>

//                   </div>

//                 </div>

//               ))}

//             </div>

//             <button
//               className="cv-trending-more"
//               onClick={() =>
//                 (window.location.href = "/courses")
//               }
//             >
//               View all courses
//               <ArrowRight
//                 size={13}
//                 style={{
//                   verticalAlign: "-2px",
//                 }}
//               />
//             </button>

//           </div>

//         </div>

//       </div>
//       <Getcourse />

//       <Counter />

//       {/* PARTNER LOGOS */}

//       <div className="cv-partners-marquee">

//         <div className="cv-partners-track">

//           {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map(
//             (p, i) => (

//               <div
//                 className="cv-partner-logo"
//                 key={`${p.name}-${i}`}
//               >

//                 <img
//                   src={p.image}
//                   alt={`${p.name} logo`}
//                   className="w-[152px] h-[40px] object-contain"
//                 />

//               </div>

//             )
//           )}

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
//   ArrowRight, ArrowUpRight, GraduationCap, Briefcase,
//   MapPin, Clock
// } from "lucide-react";
// import FAQ from "../app/components/FAQ";
// import Footer from "@/app/layout/Footer";
// import Header from "@/app/layout/Header";
// import Counter from "../app/components/counter/page";

// const CAREER_URL = "https://jobportal.careervidya.in/";
// const HERO_BG_IMG = "/images/testing.jpeg";

// const PARTNER_LOGOS = [
//   { name: "Amity University", image: "/images/w2.webp" },
//   { name: "LPU Online", image: "/images/w1.webp" },
//   { name: "Manipal University", image: "/images/w3.webp" },
//   { name: "Chandigarh University", image: "/images/w4.webp" },
// ];

// const TRENDING_JOBS = [
//   {
//     title: "Software Engineer", company: "HCL Technologies", short: "HCL",
//     logo: "/images/hcl2.jpeg", mono: "#e11d48", location: "Bangalore",
//     workMode: "Full-time", exp: "2-5 Yrs", salary: "₹6 - 12 LPA",
//     isNew: true, href: `${CAREER_URL}/jobs/software-engineer`,
//   },
//   {
//     title: "System Engineer", company: "Infosys Limited", short: "IN",
//     logo: "/images/inf1.jpeg", mono: "#2563eb", location: "Hyderabad",
//     workMode: "Full-time", exp: "1-3 Yrs", salary: "₹4 - 8 LPA",
//     isNew: true, href: `${CAREER_URL}/jobs/system-engineer`,
//   },
//   {
//     title: "Associate Product Manager", company: "Samsung", short: "S",
//     logo: "/images/sum.jpeg", mono: "#f59e0b", location: "Delhi NCR",
//     workMode: "Full-time", exp: "3-6 Yrs", salary: "₹12 - 20 LPA",
//     isNew: false, href: `${CAREER_URL}/jobs/associate-product-manager`,
//   },
// ];

// const TRENDING_COURSES_HOME = [
//   {
//     title: "MBA", sub: "Master of Business Administration", university: "Amity University",
//     short: "AU", mono: "#8b5cf6", duration: "2 Years", fee: "₹2.5 - 15 LPA",
//     href: "/course/online-mba-1",
//   },
//   {
//     title: "B.Tech Computer Science", sub: "Bachelor of Technology", university: "LPU Online",
//     short: "LPU", mono: "#0d9488", duration: "4 Years", fee: "₹1.2 - 6 LPA",
//     href: "/course/btech-bachelors-of-technology",
//   },
//   {
//     title: "BCA", sub: "Bachelor of Computer Applications", university: "Chandigarh University",
//     short: "CU", mono: "#2563eb", duration: "3 Years", fee: "₹80K - 3 LPA",
//     href: "/course/online-bca-bachelor-of-computer-applications",
//   },
// ];

// export default function CareerVidyaHome() {
//   return (
//     <div className="cv-root">
//       <Header />

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         * { box-sizing: border-box; }
//         .cv-root {
//           --ink: #0b1528;
//           --muted: #64748b;
//           --line: rgba(15, 23, 42, 0.08);
//           --surface: #f8fafc;
//           --panel: #ffffff;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           color: var(--ink);
//           background: var(--surface);
//           overflow-x: hidden;
//         }

//         a { text-decoration: none; color: inherit; }
//         button { font-family: inherit; }
//         .cv-container { max-width: 1380px; margin: 0 auto; padding: 0 24px; }

//         /* FULL WIDTH HERO SECTION - FIXED 760px HEIGHT WITH AUTO SCREEN WIDTH */
//         .cv-hero-section {
//           width: 100vw;
//           margin-left: calc(-50vw + 50%);
//           margin-right: calc(-50vw + 50%);
//           height: auto;
//           overflow: hidden;
//           background: #ffffff;
//         }

//         .cv-hero-img {
//           width: 100%;
//           height: 760px;
//           display: block;
//           object-fit: fill; /* System ki poori width aur 760px height cover karega */
//         }

//         /* Mobile Adjustments so aspect ratio doesn't break on small screens */
//         @media (max-width: 767px) {
//           .cv-hero-section {
//             height: auto;
//           }
//           .cv-hero-img {
//             height: auto;
//             max-height: 450px;
//             object-fit: cover;
//           }
//         }

//         /* LOWER SECTIONS */
//         .cv-trending { padding: 40px 0 20px; }
//         .cv-trending-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
//         @media (min-width: 900px) { .cv-trending-grid { grid-template-columns: 1fr 1fr; gap: 22px; } }
//         .cv-trending-col { border: 1px solid var(--line); border-radius: 18px; padding: 18px; background: var(--panel); display: flex; flex-direction: column; }
//         .cv-trending-headrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
//         .cv-trending-headrow-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//         .cv-trending-col.jobs .cv-trending-headrow-icon { background: #fff7ed; color: #ea580c; }
//         .cv-trending-col.courses .cv-trending-headrow-icon { background: #f0f9ff; color: #0284c7; }
//         .cv-trending-headtext { flex: 1; min-width: 0; }
//         .cv-trending-title-lg { font-size: 17.5px; font-weight: 700; color: var(--ink); }
//         .cv-trending-title-lg .accent-gold { color: #ea580c; }
//         .cv-trending-title-lg .accent-teal { color: #0284c7; }
//         .cv-trending-caption { font-size: 12px; color: var(--muted); margin-top: 2px; }
//         .cv-trending-viewall { font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; padding-top: 8px; display: inline-flex; align-items: center; gap: 3px; }
//         .cv-trending-firelabel { font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 10px; margin-top: 10px; }
//         .cv-trending-stack { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
//         .cv-trending-card { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--line); border-radius: 14px; }
//         .cv-trending-logo { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700; font-size: 13px; overflow: hidden; }
//         .cv-trending-logo img { width: 100%; height: 100%; object-fit: contain; }
//         .cv-trending-info { flex: 1; min-width: 0; }
//         .cv-trending-title-row { display: flex; align-items: center; gap: 6px; }
//         .cv-trending-title { font-size: 13.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .cv-new-badge { font-size: 9.5px; font-weight: 700; color: #0d9488; background: #e3f4f1; border-radius: 999px; padding: 1.5px 7px; flex-shrink: 0; }
//         .cv-trending-org { font-size: 12px; color: var(--muted); margin-top: 1px; }
//         .cv-trending-sub { font-size: 11px; color: var(--muted); margin-top: 3px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
//         .cv-trending-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
//         .cv-trending-price { font-size: 12.5px; font-weight: 700; }
//         .cv-trending-col.jobs .cv-trending-price { color: #0d9488; }
//         .cv-trending-col.courses .cv-trending-price { color: #0284c7; }
//         .cv-trending-cta { font-size: 11.5px; font-weight: 700; padding: 7px 13px; border-radius: 8px; border: none; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
//         .cv-trending-col.jobs .cv-trending-cta { background: #0284c7; color: #fff; }
//         .cv-trending-col.courses .cv-trending-cta { background: #f97316; color: #fff; }
//         .cv-trending-more { width: 100%; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink); padding: 11px; border-radius: 10px; border: 1px dashed var(--line); background: #fff; cursor: pointer; margin-top: auto; }

//         .cv-partners-marquee { width: 100%; overflow: hidden; position: relative; padding: 20px 0; mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent); }
//         .cv-partners-track { display: flex; align-items: center; gap: 16px; width: max-content; animation: cv-marquee 32s linear infinite; }
//         @keyframes cv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
//         .cv-partner-logo { display: flex; align-items: center; justify-content: center; padding: 12px 22px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
//       `}</style>

//       {/* HERO SECTION */}
//       <section className="cv-hero-section">
//         <img src={HERO_BG_IMG} alt="Hero Banner" className="cv-hero-img" />
//       </section>

//       {/* LOWER TRENDING SECTIONS */}
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

//             <div className="cv-trending-firelabel">🔥 Trending Jobs</div>

//             <div className="cv-trending-stack">
//               {TRENDING_JOBS?.map((j) => (
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
//                       <span>•</span>
//                       <span>{j.workMode}</span>
//                       <span>•</span>
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

//             <div className="cv-trending-firelabel">🔥 Trending Courses</div>

//             <div className="cv-trending-stack">
//               {TRENDING_COURSES_HOME?.map((c) => (
//                 <div className="cv-trending-card" key={c.title}>
//                   <div className="cv-trending-logo" style={{ background: `${c.mono}1a`, color: c.mono }}>{c.short}</div>
//                   <div className="cv-trending-info">
//                     <div className="cv-trending-title-row">
//                       <span className="cv-trending-title">{c.title}</span>
//                     </div>
//                     <div className="cv-trending-org">{c.sub}</div>
//                     <div className="cv-trending-sub">
//                       <span>{c.university}</span>
//                       <span>•</span>
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

//       <Counter />

//       <div className="cv-partners-marquee">
//         <div className="cv-partners-track">
//           {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
//             <div className="cv-partner-logo" key={`${p.name}-${i}`}>
//               <img src={p.image} alt={`${p.name} logo`} className="w-[152px] h-[40px] object-contain" />
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
//   ArrowRight, ArrowUpRight, GraduationCap, Briefcase,
//   MapPin, Clock
// } from "lucide-react";
// import FAQ from "../app/components/FAQ";
// import Footer from "@/app/layout/Footer";
// import Header from "@/app/layout/Header";
// import Counter from "../app/components/counter/page";

// const CAREER_URL = "https://jobportal.careervidya.in/";
// const HERO_BG_IMG = "/images/testing.png";

// const PARTNER_LOGOS = [
//   { name: "Amity University", image: "/images/w2.webp" },
//   { name: "LPU Online", image: "/images/w1.webp" },
//   { name: "Manipal University", image: "/images/w3.webp" },
//   { name: "Chandigarh University", image: "/images/w4.webp" },
// ];

// const TRENDING_JOBS = [
//   {
//     title: "Software Engineer", company: "HCL Technologies", short: "HCL",
//     logo: "/images/hcl2.jpeg", mono: "#e11d48", location: "Bangalore",
//     workMode: "Full-time", exp: "2-5 Yrs", salary: "₹6 - 12 LPA",
//     isNew: true, href: `${CAREER_URL}/jobs/software-engineer`,
//   },
//   {
//     title: "System Engineer", company: "Infosys Limited", short: "IN",
//     logo: "/images/inf1.jpeg", mono: "#2563eb", location: "Hyderabad",
//     workMode: "Full-time", exp: "1-3 Yrs", salary: "₹4 - 8 LPA",
//     isNew: true, href: `${CAREER_URL}/jobs/system-engineer`,
//   },
//   {
//     title: "Associate Product Manager", company: "Samsung", short: "S",
//     logo: "/images/sum.jpeg", mono: "#f59e0b", location: "Delhi NCR",
//     workMode: "Full-time", exp: "3-6 Yrs", salary: "₹12 - 20 LPA",
//     isNew: false, href: `${CAREER_URL}/jobs/associate-product-manager`,
//   },
// ];

// const TRENDING_COURSES_HOME = [
//   {
//     title: "MBA", sub: "Master of Business Administration", university: "Amity University",
//     short: "AU", mono: "#8b5cf6", duration: "2 Years", fee: "₹2.5 - 15 LPA",
//     href: "/course/online-mba-1",
//   },
//   {
//     title: "B.Tech Computer Science", sub: "Bachelor of Technology", university: "LPU Online",
//     short: "LPU", mono: "#0d9488", duration: "4 Years", fee: "₹1.2 - 6 LPA",
//     href: "/course/btech-bachelors-of-technology",
//   },
//   {
//     title: "BCA", sub: "Bachelor of Computer Applications", university: "Chandigarh University",
//     short: "CU", mono: "#2563eb", duration: "3 Years", fee: "₹80K - 3 LPA",
//     href: "/course/online-bca-bachelor-of-computer-applications",
//   },
// ];

// export default function CareerVidyaHome() {
//   return (
//     <div className="cv-root">
//       <Header />

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//         * { box-sizing: border-box; }
//         .cv-root {
//           --ink: #0b1528;
//           --muted: #64748b;
//           --line: rgba(15, 23, 42, 0.08);
//           --surface: #f8fafc;
//           --panel: #ffffff;
//           font-family: 'Plus Jakarta Sans', sans-serif;
//           color: var(--ink);
//           background: var(--surface);
//           overflow-x: hidden;
//         }

//         a { text-decoration: none; color: inherit; }
//         button { font-family: inherit; }
//         .cv-container { max-width: 1380px; margin: 0 auto; padding: 0 24px; }

//         /* FULL WIDTH HERO SECTION WITHOUT FIXED HEIGHT */
//         .cv-hero-section {
//           width: 100vw;
//           margin-left: calc(-50vw + 50%);
//           margin-right: calc(-50vw + 50%);
//           display: block;
//           overflow: hidden;
//           background: #ffffff;
//         }

//         .cv-hero-img {
//           width: 100%;
//           height: 760px; /* Image ki actual aspect ratio maintain hogi */
//           display: block;
//           object-fit: contain; /* Banner poora show hoga bina crop hue */
//         }

//         /* LOWER SECTIONS */
//         .cv-trending { padding: 40px 0 20px; }
//         .cv-trending-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
//         @media (min-width: 900px) { .cv-trending-grid { grid-template-columns: 1fr 1fr; gap: 22px; } }
//         .cv-trending-col { border: 1px solid var(--line); border-radius: 18px; padding: 18px; background: var(--panel); display: flex; flex-direction: column; }
//         .cv-trending-headrow { display: flex; align-items: flex-start; justify-content: space-between; gap: 10px; margin-bottom: 4px; }
//         .cv-trending-headrow-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
//         .cv-trending-col.jobs .cv-trending-headrow-icon { background: #fff7ed; color: #ea580c; }
//         .cv-trending-col.courses .cv-trending-headrow-icon { background: #f0f9ff; color: #0284c7; }
//         .cv-trending-headtext { flex: 1; min-width: 0; }
//         .cv-trending-title-lg { font-size: 17.5px; font-weight: 700; color: var(--ink); }
//         .cv-trending-title-lg .accent-gold { color: #ea580c; }
//         .cv-trending-title-lg .accent-teal { color: #0284c7; }
//         .cv-trending-caption { font-size: 12px; color: var(--muted); margin-top: 2px; }
//         .cv-trending-viewall { font-size: 12px; font-weight: 700; color: var(--muted); white-space: nowrap; padding-top: 8px; display: inline-flex; align-items: center; gap: 3px; }
//         .cv-trending-firelabel { font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 6px; margin-bottom: 10px; margin-top: 10px; }
//         .cv-trending-stack { display: flex; flex-direction: column; gap: 10px; margin-bottom: 14px; }
//         .cv-trending-card { display: flex; align-items: center; gap: 12px; padding: 12px; border: 1px solid var(--line); border-radius: 14px; }
//         .cv-trending-logo { width: 38px; height: 38px; border-radius: 10px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-weight: 700; font-size: 13px; overflow: hidden; }
//         .cv-trending-logo img { width: 100%; height: 100%; object-fit: contain; }
//         .cv-trending-info { flex: 1; min-width: 0; }
//         .cv-trending-title-row { display: flex; align-items: center; gap: 6px; }
//         .cv-trending-title { font-size: 13.5px; font-weight: 700; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
//         .cv-new-badge { font-size: 9.5px; font-weight: 700; color: #0d9488; background: #e3f4f1; border-radius: 999px; padding: 1.5px 7px; flex-shrink: 0; }
//         .cv-trending-org { font-size: 12px; color: var(--muted); margin-top: 1px; }
//         .cv-trending-sub { font-size: 11px; color: var(--muted); margin-top: 3px; display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
//         .cv-trending-right { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; flex-shrink: 0; }
//         .cv-trending-price { font-size: 12.5px; font-weight: 700; }
//         .cv-trending-col.jobs .cv-trending-price { color: #0d9488; }
//         .cv-trending-col.courses .cv-trending-price { color: #0284c7; }
//         .cv-trending-cta { font-size: 11.5px; font-weight: 700; padding: 7px 13px; border-radius: 8px; border: none; display: inline-flex; align-items: center; gap: 4px; cursor: pointer; }
//         .cv-trending-col.jobs .cv-trending-cta { background: #0284c7; color: #fff; }
//         .cv-trending-col.courses .cv-trending-cta { background: #f97316; color: #fff; }
//         .cv-trending-more { width: 100%; text-align: center; font-size: 13px; font-weight: 700; color: var(--ink); padding: 11px; border-radius: 10px; border: 1px dashed var(--line); background: #fff; cursor: pointer; margin-top: auto; }

//         .cv-partners-marquee { width: 100%; overflow: hidden; position: relative; padding: 20px 0; mask-image: linear-gradient(to right, transparent, black 6%, black 94%, transparent); }
//         .cv-partners-track { display: flex; align-items: center; gap: 16px; width: max-content; animation: cv-marquee 32s linear infinite; }
//         @keyframes cv-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
//         .cv-partner-logo { display: flex; align-items: center; justify-content: center; padding: 12px 22px; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
//       `}</style>

//       {/* HERO SECTION */}
//       <section className="cv-hero-section">
//         <img src={HERO_BG_IMG} alt="Hero Banner" className="cv-hero-img" />
//       </section>

//       {/* LOWER TRENDING SECTIONS */}
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

//             <div className="cv-trending-firelabel">🔥 Trending Jobs</div>

//             <div className="cv-trending-stack">
//               {TRENDING_JOBS?.map((j) => (
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
//                       <span>•</span>
//                       <span>{j.workMode}</span>
//                       <span>•</span>
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

//             <div className="cv-trending-firelabel">🔥 Trending Courses</div>

//             <div className="cv-trending-stack">
//               {TRENDING_COURSES_HOME?.map((c) => (
//                 <div className="cv-trending-card" key={c.title}>
//                   <div className="cv-trending-logo" style={{ background: `${c.mono}1a`, color: c.mono }}>{c.short}</div>
//                   <div className="cv-trending-info">
//                     <div className="cv-trending-title-row">
//                       <span className="cv-trending-title">{c.title}</span>
//                     </div>
//                     <div className="cv-trending-org">{c.sub}</div>
//                     <div className="cv-trending-sub">
//                       <span>{c.university}</span>
//                       <span>•</span>
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

//       <Counter />

//       <div className="cv-partners-marquee">
//         <div className="cv-partners-track">
//           {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
//             <div className="cv-partner-logo" key={`${p.name}-${i}`}>
//               <img src={p.image} alt={`${p.name} logo`} className="w-[152px] h-[40px] object-contain" />
//             </div>
//           ))}
//         </div>
//       </div>

//       <FAQ />
//       <Footer />
//     </div>
//   );
// }


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
import CareervidyaFromModal from "./components/CareervidyaFormModal";

// ✅ Forces this page to render on every request (SSR) instead of being
// pre-rendered at build time. Needed because HeroSlider/LogoSlider fetch
// data from the DB via API_URL — that data isn't available/ready at
// build time, so static generation was failing the whole build.
// export const dynamic = "force-dynamic";

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


      {/* <CardSlider /> */}
      <VideoSlider />
      <FAQ />

      <Footer />
      <ChatbotFloating />
      <SocialSidebar />
      <CareervidyaFromModal />
    </div>
  );
}