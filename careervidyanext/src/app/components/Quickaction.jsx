// // "use client";

// // import React, { useState } from "react";
// // import {
// //   GraduationCap,
// //   Briefcase,
// //   Bot,
// //   Award,
// //   Building2,
// //   ArrowRight,
// //   CheckCircle2,
// // } from "lucide-react";

// // // Services Data
// // const SERVICES = [
// //   {
// //     id: "counselling",
// //     title: " Career Counselling",
// //     icon: GraduationCap,
// //     badge: "Students & Freshers",
// //     heading: "Expert Career Guidance for Students & Freshers",
// //     desc: "Unsure about which stream or college to choose? Get personalized 1-on-1 sessions with top industry mentors and clear all your doubts with complete clarity.",
// //     ctaText: "Book Free Session",
// //     ctaHref: "/counselling",
// //   },
// //   {
// //     id: "ai-test",
// //     title: "AI Career Assessment",
// //     icon: Bot,
// //     badge: "Fast Assessment",
// //     heading: "Discover Your Ideal Career Path in 2 Minutes",
// //     desc: "Our AI-powered assessment analyzes your strengths, interests, and skill gaps to recommend the highest-growth career paths tailored specifically for you.",
// //     ctaText: "Start AI Test",
// //     ctaHref: "http://localhost:3001/candidate/auth/login",
// //   },
// //   {
// //     id: "resume",
// //     title: "ATS Resume Builder",
// //     icon: Briefcase,
// //     badge: "Job Seekers",
// //     heading: "Create Job-Ready Resumes That Get Shortlisted",
// //     desc: "Stand out to top recruiters with ATS-optimized templates, smart content suggestions, and instant feedback to fast-track your job applications.",
// //     ctaText: "Build Resume Now",
// //     ctaHref: "http://localhost:3001/candidate/auth/login",
// //   },
// //   {
// //     id: "universities",
// //     title: "Top Universities",
// //     icon: Building2,
// //     badge: "Institution Finder",
// //     heading: "Compare & Apply to 1,500+ Top Institutions",
// //     desc: "Explore detailed rankings, fee structures, placement reports, and authentic student reviews to pick the perfect university with full confidence.",
// //     ctaText: "Explore Universities",
// //     ctaHref: "/topunivers",
// //   },
// //   {
// //     id: "scholarships",
// //     title: "Scholarships & Aid",
// //     icon: Award,
// //     badge: "Financial Aid",
// //     heading: "Unlock Exclusive Partner Scholarships",
// //     desc: "Save on tuition fees. Explore merit-based and need-based financial aid options specially curated to support your academic journey.",
// //     ctaText: "Find Scholarships",
// //     ctaHref: "/scholarships",
// //   },
// // ];

// // // Stats Data
// // const STATS = [
// //   {
// //     num: "1,00,000+",
// //     label: "Students Guided",
// //   },
// //   {
// //     num: "1,500+",
// //     label: "Partner Universities",
// //   },
// //   {
// //     num: "12K+",
// //     label: "Alumni Network",
// //   },
// // ];

// // export default function FeaturedServicesBanner() {
// //   const [activeTab, setActiveTab] = useState(SERVICES[0]);

// //   return (
// //     <section className="w-full bg-[#FAF9F6] py-12 sm:py-16 lg:py-20 font-sans text-slate-900">
// //       <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">

// //         {/* Main Card */}
// //         <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-8 lg:p-12">

// //           <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-12 lg:gap-12">

// //             {/* ================= LEFT COLUMN ================= */}
// //             <div className="flex flex-col gap-3 lg:col-span-5">

// //               {/* Section Label */}
// //               <span className="mb-1 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
// //                 Select your path
// //               </span>

// //               {/* Service Buttons */}
// //               {SERVICES.map((service) => {
// //                 const Icon = service.icon;
// //                 const isActive = activeTab.id === service.id;

// //                 return (
// //                   <button
// //                     key={service.id}
// //                     type="button"
// //                     onClick={() => setActiveTab(service)}
// //                     className={`
// //                       flex w-full cursor-pointer items-center gap-4
// //                       rounded-xl border px-4 py-3
// //                       text-left transition-all duration-200
// //                       sm:px-5
// //                       ${
// //                         isActive
// //                           ? "border-[#C85103] bg-[#C85103] text-white shadow-md -translate-y-0.5"
// //                           : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50"
// //                       }
// //                     `}
// //                   >
// //                     {/* Icon */}
// //                     <div
// //                       className={`
// //                         flex shrink-0 items-center justify-center
// //                         rounded-xl p-1.5 transition-colors
// //                         ${
// //                           isActive
// //                             ? "bg-white/20 text-white"
// //                             : "border border-orange-100 bg-orange-50 text-[#C85103]"
// //                         }
// //                       `}
// //                     >
// //                       <Icon className="h-5 w-5" />
// //                     </div>

// //                     {/* Title */}
// //                     <span className="text-sm font-bold tracking-tight sm:text-base">
// //                       {service.title}
// //                     </span>
// //                   </button>
// //                 );
// //               })}
// //             </div>

// //             {/* ================= RIGHT COLUMN ================= */}
// //             <div className="flex h-full flex-col justify-between space-y-8 lg:col-span-7 lg:pl-4">

// //               {/* Content */}
// //               <div className="space-y-5">

// //                 {/* Badge */}
// //                 <div className="inline-flex items-center gap-2 rounded-lg border border-orange-200/60 bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-[#C85103]">
// //                   <CheckCircle2 className="h-3.5 w-3.5 !text-[#C85103]" />

// //                   <span>{activeTab.badge}</span>
// //                 </div>

// //                 {/* Heading */}
// //                 <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
// //                   {activeTab.heading}
// //                 </h2>

// //                 {/* Description */}
// //                 <p className="max-w-xl text-sm font-normal leading-relaxed text-slate-600 sm:text-base">
// //                   {activeTab.desc}
// //                 </p>

// //                 {/* CTA */}
// //                 <div className="pt-3">

// //                   <a
// //                     href={activeTab.ctaHref}
// //                     className="
// //                       inline-flex items-center gap-1.5
// //                       rounded-xl
// //                       bg-[#C85103]
// //                       px-6 py-2.5
// //                       text-sm font-bold tracking-wide
// //                       !text-white
// //                       shadow-md
// //                       transition-all duration-200
// //                       hover:bg-[#b04502]
// //                       hover:shadow-lg
// //                       active:scale-[0.98]
// //                     "
// //                   >
// //                     <span className="!text-white">
// //                       {activeTab.ctaText}
// //                     </span>

// //                     <ArrowRight className="h-4 w-4 !text-white" />
// //                   </a>

// //                 </div>
// //               </div>

// //               {/* ================= STATS ================= */}
// //               <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-6 sm:gap-6 sm:pt-8">

// //                 {STATS.map((stat, i) => (
// //                   <div key={i} className="space-y-1">

// //                     <div className="text-lg font-black tracking-tight text-slate-900 sm:text-xl lg:text-2xl">
// //                       {stat.num}
// //                     </div>

// //                     <div className="text-[10px] font-medium leading-normal text-slate-500 sm:text-xs">
// //                       {stat.label}
// //                     </div>

// //                   </div>
// //                 ))}

// //               </div>

// //             </div>

// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }


// "use client";

// import React from "react";
// import {
//   Users,
//   Building2,
//   Briefcase,
//   Handshake,
//   Star,
//   GraduationCap,
//   Bot,
//   FileText,
//   Search,
//   Sparkles,
//   Compass,
//   BookOpen,
//   Hammer,
//   Send,
//   Trophy,
// } from "lucide-react";

// /* ============ DATA ============ */

// const STATS = [
//   { icon: Users, num: "50,000+", label: "Students Guided" },
//   { icon: Building2, num: "500+", label: "Universities" },
//   { icon: Briefcase, num: "10,000+", label: "Job Opportunities" },
//   { icon: Handshake, num: "100+", label: "Hiring Partners" },
//   { icon: Star, num: "4.8/5", label: "Student Rating" },
// ];

// const FIND_CARDS = [
//   {
//     icon: GraduationCap,
//     title: "Find My Course",
//     desc: "Discover the right course that fits your goals.",
//   },
//   {
//     icon: Building2,
//     title: "Compare Universities",
//     desc: "Compare fees, placements, approvals & more.",
//   },
//   {
//     icon: Briefcase,
//     title: "Find a Job",
//     desc: "Explore jobs matching your skills & interest.",
//   },
//   {
//     icon: Bot,
//     title: "Get AI Career Guidance",
//     desc: "Let AI suggest the best path for your future.",
//   },
//   {
//     icon: FileText,
//     title: "Improve My Resume",
//     desc: "AI powered resume analysis & suggestions.",
//   },
// ];

// const QUICK_PROMPTS = [
//   "Suggest Courses",
//   "Find Jobs",
//   "Best Universities",
//   "Analyze My Resume",
// ];

// const JOURNEY_STEPS = [
//   { num: "01", icon: Compass, title: "Discover", desc: "Explore career options & find your passion." },
//   { num: "02", icon: BookOpen, title: "Learn", desc: "Choose the right course & build your skills." },
//   { num: "03", icon: Hammer, title: "Build", desc: "Enhance your skillset & create your profile." },
//   { num: "04", icon: Send, title: "Apply", desc: "Find & apply to the right opportunities." },
//   { num: "05", icon: Trophy, title: "Get Hired", desc: "Land your dream job & grow your career." },
// ];

// /* ============ COMPONENT ============ */

// export default function FeaturedServicesBanner() {
//   return (
//     <section className="w-full bg-[#FAF9F6] py-10 sm:py-14 lg:py-16 font-sans text-slate-900">
//       <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10 lg:space-y-12">

//         {/* ================= STATS BAR ================= */}
//         <div className="rounded-2xl border border-slate-200/80 bg-white px-4 py-5 shadow-sm sm:px-8 sm:py-6">
//           <div className="grid grid-cols-2 gap-y-5 sm:grid-cols-5 sm:gap-4">
//             {STATS.map((stat, i) => {
//               const Icon = stat.icon;
//               return (
//                 <div
//                   key={i}
//                   className="flex items-center gap-2.5 sm:flex-col sm:items-center sm:gap-1.5 sm:text-center"
//                 >
//                   <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[#C85103] sm:h-10 sm:w-10">
//                     <Icon className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
//                   </div>
//                   <div className="leading-tight">
//                     <div className="text-base font-extrabold tracking-tight text-slate-900 sm:text-lg">
//                       {stat.num}
//                     </div>
//                     <div className="text-[11px] font-medium text-slate-500 sm:text-xs">
//                       {stat.label}
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//         {/* ================= WHAT ARE YOU LOOKING FOR ================= */}
//         <div className="space-y-6 sm:space-y-8">
//           <div className="text-center">
//             <h2 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
//               What are you looking for today?
//             </h2>
//             <p className="mt-2 text-sm text-slate-500 sm:text-base">
//               Tell us where you are in your journey. We&apos;ll guide you from there.
//             </p>
//           </div>

//           <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
//             {FIND_CARDS.map((card, i) => {
//               const Icon = card.icon;
//               return (
//                 <button
//                   key={i}
//                   type="button"
//                   className="group flex flex-col items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 text-left shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-[#C85103]/40 hover:shadow-md sm:p-5"
//                 >
//                   <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#C85103] transition-colors group-hover:bg-[#C85103] group-hover:text-white sm:h-11 sm:w-11">
//                     <Icon className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <div className="text-sm font-bold tracking-tight text-slate-900 sm:text-base">
//                       {card.title}
//                     </div>
//                     <p className="mt-1 text-xs leading-relaxed text-slate-500 sm:text-sm">
//                       {card.desc}
//                     </p>
//                   </div>
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ================= AI CAREER ASSISTANT BANNER ================= */}
//         <div className="relative overflow-hidden rounded-3xl bg-[#120B2E] px-5 py-8 sm:px-10 sm:py-12 lg:px-14">
//           {/* ambient glows */}
//           <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#5B21B6]/40 blur-[90px]" />
//           <div className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-[#22D3EE]/20 blur-[100px]" />

//           <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
//             {/* Left: content */}
//             <div className="space-y-5 lg:col-span-7">
//               <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-orange-300">
//                 <Sparkles className="h-3.5 w-3.5" />
//                 <span>AI Career Assistant</span>
//               </div>

//               <h3 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
//                 Not sure what to study or where to work?{" "}
//                 <span className="text-[#8B7CF6]">Ask CareerVidya AI.</span>
//               </h3>

//               {/* Search bar */}
//               <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-white p-1.5 shadow-lg sm:gap-3">
//                 <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
//                 <input
//                   type="text"
//                   placeholder="What do you want to become?"
//                   className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
//                 />
//                 <button
//                   type="button"
//                   className="shrink-0 whitespace-nowrap rounded-lg bg-[#C85103] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#b04502] sm:text-sm"
//                 >
//                   Ask Now
//                 </button>
//               </div>

//               {/* Quick prompts */}
//               <div className="flex flex-wrap gap-2">
//                 {QUICK_PROMPTS.map((prompt, i) => (
//                   <button
//                     key={i}
//                     type="button"
//                     className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 sm:text-sm"
//                   >
//                     {prompt}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Right: robot illustration */}
//             <div className="relative flex justify-center lg:col-span-5">
//               <div className="relative flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52">
//                 <div className="absolute inset-0 rounded-full bg-[#8B7CF6]/20 blur-2xl" />
//                 <svg viewBox="0 0 200 200" className="relative h-full w-full">
//                   <circle cx="100" cy="60" r="6" fill="#8B7CF6" />
//                   <rect x="97" y="66" width="6" height="16" fill="#8B7CF6" />
//                   <rect
//                     x="45"
//                     y="82"
//                     width="110"
//                     height="90"
//                     rx="28"
//                     fill="url(#bodyGrad)"
//                     stroke="#8B7CF6"
//                     strokeWidth="2"
//                   />
//                   <rect
//                     x="62"
//                     y="102"
//                     width="76"
//                     height="48"
//                     rx="18"
//                     fill="#1B1140"
//                   />
//                   <circle cx="84" cy="126" r="7" fill="#22D3EE" />
//                   <circle cx="116" cy="126" r="7" fill="#22D3EE" />
//                   <defs>
//                     <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
//                       <stop offset="0%" stopColor="#2E2560" />
//                       <stop offset="100%" stopColor="#1B1140" />
//                     </linearGradient>
//                   </defs>
//                 </svg>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* ================= CAREER JOURNEY STEPS ================= */}
//         <div className="space-y-8 sm:space-y-10">
//           <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
//             Your Career Journey, Simplified
//           </h2>

//           <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
//             {/* connecting line - desktop only */}
//             <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-slate-200 lg:block" />

//             {JOURNEY_STEPS.map((step, i) => {
//               const Icon = step.icon;
//               return (
//                 <div key={i} className="relative flex flex-col items-center text-center">
//                   <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#C85103] bg-white text-[#C85103] shadow-sm">
//                     <Icon className="h-5 w-5" />
//                   </div>
//                   <span className="mt-3 text-[11px] font-bold tracking-widest text-slate-400">
//                     {step.num}
//                   </span>
//                   <div className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
//                     {step.title}
//                   </div>
//                   <p className="mt-1 max-w-[9rem] text-xs leading-relaxed text-slate-500 sm:text-sm">
//                     {step.desc}
//                   </p>
//                 </div>
//               );
//             })}
//           </div>
//         </div>

//       </div>
//     </section>
//   );
// }

"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Building2,
  Briefcase,
  Handshake,
  Sparkles,
  Compass,
  BookOpen,
  Hammer,
  Send,
  Trophy,
  Search,
} from "lucide-react";

/* ============ DATA ============ */

const STATS = [
  { icon: Users, num: "100,000+", label: "Students Guided" },
  { icon: Building2, num: "500+", label: "Universities" },
  { icon: Briefcase, num: "10,000+", label: "Job Opportunities" },
  { icon: Handshake, num: "100+", label: "Hiring Partners" },
];

const QUICK_PROMPTS = [
  "Suggest Courses",
  "Find Jobs",
  "Best Universities",
  "Analyze My Resume",
];

const JOURNEY_STEPS = [
  { num: "01", icon: Compass, title: "Discover", desc: "Explore career options & find your passion." },
  { num: "02", icon: BookOpen, title: "Learn", desc: "Choose the right course & build your skills." },
  { num: "03", icon: Hammer, title: "Build", desc: "Enhance your skillset & create your profile." },
  { num: "04", icon: Send, title: "Apply", desc: "Find & apply to the right opportunities." },
  { num: "05", icon: Trophy, title: "Get Hired", desc: "Land your dream job & grow your career." },
];

/* ============ COMPONENT ============ */

export default function FeaturedServicesBanner() {
  const router = useRouter();

  return (
    // Soft sky blue gradient for seamless merging
    <section className="w-full bg-gradient-to-b from-sky-50/60 via-sky-50/20 to-transparent py-10 sm:py-14 lg:py-16 font-sans text-slate-900">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12 lg:space-y-16">

        {/* ================= STATS BAR ================= */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 lg:grid-cols-4">
          {STATS.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="group flex items-center gap-3.5 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-sm p-4 sm:p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#185FA5] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 sm:h-13 sm:w-13">
                  <Icon className="h-5.5 w-5.5 sm:h-6 sm:w-6" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    {stat.num}
                  </div>
                  <div className="truncate text-xs font-semibold text-slate-500 sm:text-sm">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= AI CAREER ASSISTANT BANNER ================= */}
        <div className="relative overflow-hidden rounded-3xl bg-[#120B2E] px-5 py-8 sm:px-10 sm:py-12 lg:px-14 shadow-xl">
          {/* ambient glows */}
          <div className="pointer-events-none absolute -left-20 -top-24 h-72 w-72 rounded-full bg-[#5B21B6]/40 blur-[90px]" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-80 w-80 rounded-full bg-[#22D3EE]/20 blur-[100px]" />

          <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
            {/* Left: content */}
            <div className="space-y-5 lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-blue-300">
                <Sparkles className="h-3.5 w-3.5" />
                <span>AI Career Assistant</span>
              </div>

              <h3 className="max-w-md text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
                Not sure what to study or where to work?{" "}
                <span className="text-[#8B7CF6]">Ask CareerVidya AI.</span>
              </h3>

              {/* Search bar */}
              <div className="flex w-full max-w-md items-center gap-2 rounded-xl bg-white p-1.5 shadow-lg sm:gap-3">
                <Search className="ml-2 h-4 w-4 shrink-0 text-slate-400" />
                <input
                  type="text"
                  placeholder="What do you want to become?"
                  className="w-full min-w-0 bg-transparent text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => router.push("/candidate/login")}
                  className="shrink-0 whitespace-nowrap rounded-lg bg-[#185FA5] px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-[#0C447C] sm:text-sm"
                >
                  Ask Now
                </button>
              </div>

              {/* Quick prompts */}
              <div className="flex flex-wrap gap-2">
                {QUICK_PROMPTS.map((prompt, i) => (
                  <button
                    key={i}
                    type="button"
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 sm:text-sm"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            {/* Right: robot illustration */}
            <div className="relative flex justify-center lg:col-span-5">
              <div className="relative flex h-40 w-40 items-center justify-center sm:h-52 sm:w-52">
                <div className="absolute inset-0 rounded-full bg-[#8B7CF6]/20 blur-2xl" />
                <svg viewBox="0 0 200 200" className="relative h-full w-full">
                  <circle cx="100" cy="60" r="6" fill="#8B7CF6" />
                  <rect x="97" y="66" width="6" height="16" fill="#8B7CF6" />
                  <rect
                    x="45"
                    y="82"
                    width="110"
                    height="90"
                    rx="28"
                    fill="url(#bodyGrad)"
                    stroke="#8B7CF6"
                    strokeWidth="2"
                  />
                  <rect
                    x="62"
                    y="102"
                    width="76"
                    height="48"
                    rx="18"
                    fill="#1B1140"
                  />
                  <circle cx="84" cy="126" r="7" fill="#22D3EE" />
                  <circle cx="116" cy="126" r="7" fill="#22D3EE" />
                  <defs>
                    <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2E2560" />
                      <stop offset="100%" stopColor="#1B1140" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ================= CAREER JOURNEY STEPS ================= */}
        <div className="space-y-8 sm:space-y-10">
          <h2 className="text-center text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
            Your Career Journey, Simplified
          </h2>

          <div className="relative grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-5 lg:gap-6">
            <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-slate-200/80 lg:block" />

            {JOURNEY_STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-[#185FA5] text-white shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="mt-3 text-[11px] font-bold tracking-widest text-slate-400">
                    {step.num}
                  </span>
                  <div className="mt-1 text-sm font-bold text-slate-900 sm:text-base">
                    {step.title}
                  </div>
                  <p className="mt-1 max-w-[9rem] text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}