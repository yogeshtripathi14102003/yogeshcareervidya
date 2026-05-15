"use client";

  import React from 'react';
  import Image from 'next/image';
  import { 
    Calendar, Laptop, FileText, Users, Play, ChevronRight, 
    LogIn, LayoutDashboard, ShieldCheck, Headphones, Zap, Bell, Target 
  } from 'lucide-react';
  import Header from "@/app/layout/Header";
  import Getintuch from "@/app/components/getintuch";
  import Footer from "@/app/layout/Footer";
  import { useState } from "react";
  

  // Note: "use client" yahan se hata diya hai taaki ye Server Component rahe.
  // Agar Header mein interactivity hai, toh wo Header file ke andar "use client" rakhein.
            
  export default function CareerVidyaPage() {
    const [playVideo, setPlayVideo] = useState(false);
    return (
      <>
        <Header />
        <div className="min-h-screen bg-white text-slate-900 font-sans antialiased overflow-x-hidden">
          
          {/* --- SECTION 1: HERO (LCP Optimized) --- */}
    <section className="max-w-7xl mx-auto px-6 py-12 my-0 flex flex-col md:flex-row items-center gap-10">
    {/* Text Content - Left Aligned */}
    <div className="flex-1 space-y-4 md:space-y-6 py-4">
      <h1 className="text-2xl md:text-2xl font-extrabold text-[#070774] leading-[1.2] tracking-tight">
        Admission Is A Milestone,<br />
        <span className="text-[#007bff]">Degree Completion Is The Finish Line.</span>
      </h1>

      <p className="text-gray-600 text-base md:text-lg leading-relaxed max-w-xl">
        We understand that choosing a university is the first step. It's the next steps that are actually hard. Managing exams, deadlines, and assignments all at once gets scarier than you had imagined.
      </p>

      {/* Highlight Box */}
      <div className="inline-block p-4 md:p-5 border-l-4 border-[#007bff] rounded-r-xl bg-blue-50 shadow-sm">
        <p className="text-[#070774] font-bold text-sm md:text-base">
          That's when support matters most. <br />
          <span className="text-[#007bff] font-extrabold uppercase tracking-tight">That's where we come in.</span>
        </p>
      </div>
    </div>

    {/* Visual Roadmap Container - Right Side */}
    <div className="flex-1 w-full bg-white p-6 rounded-2xl shadow-2xl border border-gray-100 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -mr-16 -mt-16 z-0 opacity-50"></div>
      
      <h3 className="text-[#070774] font-bold text-xl mb-8 relative z-10">Your Journey to Success 🚀</h3>
      
      <div className="space-y-8 relative z-10">
        {/* Step 1 */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-sm">1</div>
            <div className="w-0.5 h-12 bg-blue-100"></div>
          </div>
          <div>
            <h4 className="font-bold text-[#070774]">University Selection</h4>
            <p className="text-sm text-gray-500">Finding the perfect fit for your goals.</p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#007bff] text-white rounded-full flex items-center justify-center font-bold text-sm">2</div>
            <div className="w-0.5 h-12 bg-blue-100"></div>
          </div>
          <div>
            <h4 className="font-bold text-[#070774]">Academic Management</h4>
            <p className="text-sm text-gray-500">Handling exams, assignments & deadlines.</p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-[#28a745] text-white rounded-full flex items-center justify-center font-bold text-sm">✓</div>
          </div>
          <div>
            <h4 className="font-bold text-[#070774]">Career Launch</h4>
            <p className="text-sm text-gray-500">Finish line with 37 LPA+ potential.</p>
          </div>
        </div>
      </div>

      {/* Floating Badge */}
      <div className="mt-8 bg-gradient-to-r from-[#070774] to-[#007bff] p-4 rounded-xl text-white flex justify-between items-center">
        <div>
          <p className="text-xs opacity-80">Highest Package</p>
          <p className="text-xl font-black">37 LPA+</p>
        </div>
        <div className="text-right">
          <p className="text-xs opacity-80">Alumni Network</p>
          <p className="text-xl font-black">12K+</p>
        </div>
      </div>
    </div>
  </section>

          {/* --- SECTION 2: GRID FEATURES --- */}
    <section className="bg-[#f8faff] py-5 px-6 font-sans">
    <div className="max-w-7xl mx-auto">
      {/* Heading Section */}
      <div className="text-center mb-10 md:mb-5">
        <h2 className="text-2xl md:text-3xl font-extrabold text-[#002B5B] tracking-tight leading-tight">
          <span className="text-[#0056D2]">Career Vidya</span> stays with learners through the everyday <br className="hidden md:block" /> realities of learning.
        </h2>
      </div>

      {/* Grid Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {[
          { img: "/images/post1.png", text: "We remind you about exams and important dates." },
          { img: "/images/post2.webp", text: "We guide you through LMS access and usage." },
          { img: "/images/post3.jpg", text: "We help you stay on track with assignments." },
          { img: "/images/post4.jpg", text: "We stay connected till the program is completed." }
        ].map((item, idx) => (
          <div key={idx} className="bg-white rounded-[30px] border border-blue-50 shadow-sm overflow-hidden flex flex-col h-full hover:shadow-lg transition-all duration-300">
            {/* Illustration Area */}
            <div className="p-3">
              <div className="bg-[#f1f5f9] rounded-[22px] border border-gray-50 aspect-[1.5/1] flex items-center justify-center overflow-hidden">
                {/* Standard HTML img tag for simplicity */}
                <img 
                  src={item.img} 
                  alt="illustration" 
                  className="w-full h-full object-cover opacity-90 transition-opacity hover:opacity-100" 
                />
              </div>
            </div>

            {/* Text Area */}
            <div className="px-5 pb-8 pt-1">
              <p className="text-[#333d4e] text-[15px] md:text-[17px] font-medium md:font-semibold leading-relaxed">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
          {/* --- SECTION 3: VIDEO OVERLAY --- */}
     {/* --- SECTION 3: VIDEO OVERLAY --- */}
<section className="py-20 flex justify-center px-6 bg-white">
  <div className="relative group max-w-5xl w-full aspect-video rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] md:border-[12px] border-white">

    <iframe
      className="w-full h-full"
      src="https://www.youtube.com/embed/CrmDl76lpqE"
      title="YouTube video player"
      allow="autoplay; encrypted-media"
      allowFullScreen
    />

  </div>
</section>

          {/* --- SECTION 4: SUPPORT SERVICES --- */}
       <section className="relative max-w-7xl mx-auto py-20 px-6 overflow-hidden bg-[#f8fbff]">
  {/* Background Decor */}
  <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px] opacity-40 -z-10" />

  <div className="text-center mb-12 md:mb-16">
    <h2 className="text-3xl md:text-4xl font-black text-[#002B5B] tracking-tight">
      What <span className="text-[#007bff] relative inline-block">
        support
        <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 100 10" preserveAspectRatio="none" >
          <path d="M0 5 Q 25 0, 50 5 T 100 5" stroke="#007bff" strokeWidth="3" fill="transparent" />
        </svg>
      </span> do we bring to you?
    </h2>
  </div>

  {/* 
      MOBILE: Flex-col with horizontal alignment (like your image)
      DESKTOP: Grid-cols-4 for original look
  */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
    {[
      { title: "Resume Builder", desc: "Build a resume that grabs attention and gets unlimited iterations.", icon: "📄" },
      { title: "Mock Test", desc: "Practice real interview questions and polish your skills.", icon: "🎯" },
      { title: "Job Portal", desc: "Access relevant, verified job opportunities based on your degree.", icon: "💼" },
      { title: "Community Learning", desc: "Stay on track by learning with peers who have same goals.", icon: "👥" }
    ].map((card, i) => (
      <div 
        key={i} 
        className="group relative bg-white rounded-2xl md:rounded-3xl p-5 md:p-8 border border-gray-100 shadow-sm md:shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] hover:shadow-xl transition-all duration-500 
                   flex flex-row md:flex-col items-center md:items-start gap-4 md:gap-0"
      >
        {/* Icon Circle - Smaller on mobile, original on desktop */}
        <div className="w-12 h-12 md:w-14 md:h-14 shrink-0 rounded-xl md:rounded-2xl bg-blue-50 flex items-center justify-center md:mb-6 group-hover:bg-blue-600 transition-colors duration-300">
          <span className="text-xl md:text-2xl group-hover:scale-110 transition-transform duration-300">{card.icon}</span>
        </div>

        <div className="flex flex-col">
          <h4 className="font-bold text-lg md:text-xl text-[#002B5B] mb-1 md:mb-4 group-hover:text-[#007bff] transition-colors">
            {card.title}
          </h4>
          
          <p className="text-gray-500 text-sm md:text-[15px] leading-snug md:leading-relaxed">
            {card.desc}
          </p>

          {/* Learn More - Hidden on mobile for cleaner 'List' look, visible on desktop */}
          <div className="hidden md:flex items-center text-[#007bff] font-bold text-sm mt-8 cursor-pointer group/link">
            Learn more 
            <ChevronRight size={18} className="ml-1 group-hover/link:translate-x-2 transition-transform duration-300" />
          </div>
        </div>

        {/* Decorative Hover Line (Desktop only) */}
        <div className="hidden md:block absolute top-0 left-0 w-full h-1.5 bg-[#007bff] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-t-3xl origin-left" />
      </div>
    ))}
  </div>
</section>

          {/* --- SECTION 5: ACCESS STEPS --- */}

<section className="relative bg-[#f8fbff] py-14 px-6 overflow-hidden">
  <div className="max-w-7xl mx-auto relative z-10">
    <div className="text-center mb-16">
       <h2 className="text-3xl md:text-3xl font-[900] text-[#002B5B] mb-4">
        Your Support <span className="text-[#0056b3]">Journey</span>
      </h2>
      <p className="text-slate-500 font-medium italic"> A premium 4-step process for your career success Seamless Secure. Professional.</p>
    </div>

    {/* The Cards Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        { step: "01", icon: <LogIn size={26} />, title: "Secure Login", text: "Log in to your Career Vidya account securely." },
        { step: "02", icon: <LayoutDashboard size={26} />, title: "Dashboard", text: "Head over to your personalized learner space." },
        { step: "03", icon: <ShieldCheck size={26} />, title: "Verify Access", text: "Unlock your post-admission premium services." },
        { step: "04", icon: <Headphones size={26} />, title: "Live Support", text: "Connect with our experts via call or chat." }
      ].map((item, idx) => (
        <div key={idx} className="relative group">
          
          {/* Step Badge - Positioned Better */}
          <div className="absolute -top-4 right-6 z-20 w-12 h-12 bg-[#002B5B] text-white rounded-xl flex items-center justify-center text-lg font-bold shadow-lg border-2 border-white group-hover:bg-[#0056b3] transition-colors duration-300">
            {item.step}
          </div>

          {/* Card Body - Radius Adjusted to rounded-3xl (Kam kar diya gaya hai) */}
          <div className="h-full bg-gradient-to-br from-[#002B5B] to-[#004a99] p-8 pt-10 rounded-3xl shadow-xl border border-white/10 transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-2xl">
            
            {/* Icon - Balanced Size */}
            <div className="mb-6 w-14 h-14 bg-white/10 backdrop-blur-md rounded-xl flex items-center justify-center text-cyan-400 border border-white/20 group-hover:bg-white group-hover:text-[#002B5B] transition-all duration-500">
              {item.icon}
            </div>

            {/* Content */}
            <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
              {item.title}
            </h3>
            <p className="text-blue-100/70 text-sm leading-relaxed group-hover:text-white transition-colors">
              {item.text}
            </p>

            {/* Bottom Accent */}
            <div className="mt-6 h-1 w-8 bg-cyan-400 rounded-full group-hover:w-full transition-all duration-500" />
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
          {/* --- SECTION 6: DIFFERENTIATORS --- */}
      {/* --- SECTION: WHY CAREER VIDYA (Ultra-Premium Refresh) --- */}
<section className="max-w-7xl mx-auto py-14 px-6 relative overflow-hidden">
  
  {/* Background Decoration */}
  <div className="absolute top-1/2 left-0 -translate-y-1/2 w-64 h-64 bg-blue-100/40 rounded-full blur-[120px] -z-10" />

  {/* Header Section */}
  <div className="text-center mb-16">
    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-xs font-bold tracking-[0.2em] uppercase rounded-lg mb-4 inline-block border border-blue-100">
      The Career Vidya Edge
    </span>
    <h2 className="text-3xl md:text-3xl font-[900] text-[#002B5B] tracking-tight mb-6">
      How Are We <span className="text-[#007bff]">Different?</span>
    </h2>
    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
      We don't just provide support; we provide a <span className="text-blue-600 font-bold underline decoration-2 underline-offset-4">safety net</span> for your journey.
    </p>
  </div>

  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
    
    {/* Left Side: Impact Card (4 Columns) */}
    <div className="lg:col-span-5 relative group">
      <div className="h-full bg-gradient-to-br from-[#002B5B] to-[#0056b3] rounded-[2rem] p-10 md:p-14 overflow-hidden relative shadow-2xl">
        {/* Abstract Light Effect */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-[60px] group-hover:scale-150 transition-transform duration-700" />
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <h3 className="text-3xl font-bold text-white mb-6 leading-tight">
              Why settle for <br /> <span className="text-cyan-400">fragmented</span> help?
            </h3>
            <p className="text-blue-100/80 text-lg leading-relaxed mb-8">
              Most platforms leave you with messy emails. We offer a unified experience that guides you to the finish line without the stress.
            </p>
          </div>
          
          <div className="space-y-4">
             <div className="flex items-center gap-4 px-6 py-4 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <div className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center text-[#002B5B] font-bold">
                  ✓
                </div>
                <span className="text-white font-semibold">Unified Dashboard Access</span>
             </div>
             <p className="text-blue-200/60 text-sm pl-2 italic">Trusted by 5000+ Active Learners</p>
          </div>
        </div>
      </div>
    </div>

    {/* Right Side: High-End Feature Cards (7 Columns) */}
    <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { 
          icon: <Target className="w-6 h-6" />, 
          title: "Anti-Overwhelm", 
          desc: "We break complex mountains into manageable molehills.",
          color: "bg-blue-500" 
        },
        { 
          icon: <Zap className="w-6 h-6" />, 
          title: "Seamless Flow", 
          desc: "Step-by-step walkthroughs instead of messy instructions.",
          color: "bg-indigo-500"
        },
        { 
          icon: <Bell className="w-6 h-6" />, 
          title: "Proactive Nudges", 
          desc: "Alerts before deadlines strike, keeping you ahead.",
          color: "bg-cyan-500"
        },
        { 
          icon: <ShieldCheck className="w-6 h-6" />, 
          title: "Premium Safety", 
          desc: "Your data and progress are always secure with us.",
          color: "bg-[#002B5B]"
        }
      ].map((item, idx) => (
        <div 
          key={idx} 
          className="group p-8 bg-white rounded-3xl border border-slate-100 shadow-[0_10px_30px_rgba(0,0,0,0.03)] hover:shadow-[0_20px_50px_rgba(0,110,255,0.1)] transition-all duration-500"
        >
          <div className={`w-12 h-12 ${item.color} rounded-xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
            {item.icon}
          </div>
          <h4 className="font-bold text-[#002B5B] text-lg mb-2 group-hover:text-blue-600 transition-colors">
            {item.title}
          </h4>
          <p className="text-slate-500 text-sm leading-relaxed">
            {item.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
<Getintuch />
<Footer />
        </div>
      </>
    );
  } 
  