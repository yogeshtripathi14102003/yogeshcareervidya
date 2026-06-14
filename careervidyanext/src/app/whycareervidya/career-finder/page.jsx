"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ArrowRight, Play, Star, CheckCircle, ChevronDown, HelpCircle } from "lucide-react";
import Header from "@/app/layout/Header";
import Footer from "@/app/layout/Footer";

export default function CareerFinderPage() {
  // --- Animation Hooks for "Why Students Trust Us" ---
  const trustSectionRef = useRef(null);
  const [trustVisible, setTrustVisible] = useState(false);

  // --- State for FAQ Accordion ---
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // --- Your Trust Section Data ---
  const trustFeatures = [
    {
      icon: "/icons/export.png",
      title: "#1 Application Platform for Students",
      description: "Simplify your admission journey — apply to top universities in minutes through our trusted and efficient platform.",
    },
    {
      icon: "/icons/gudence.png",
      title: "Learning Flexibility",
      description: "Explore programs that allow you to learn anytime, anywhere — perfect for working professionals and students with busy schedules.",
    },
    {
      icon: "/icons/Recommendation.png",
      title: "Course Recommendation",
      description: "We match your career aspirations with industry-relevant, accredited programs that enhance employability and growth.",
    },
    {
      icon: "/icons/Assistance.png",
      title: "University Selection Assistance",
      description: "Get access to top-ranked and recognized universities offering flexible online and distance programs.",
    },
    {
      icon: "/icons/end.png",
      title: "End-to-End Assistance",
      description: "From choosing the right path to completing your program successfully, we’re with you every step of the way.",
    },
    {
      icon: "/icons/callsupport.png",
      title: "24/7 Support",
      description: "Career Vidya offers round-the-clock tech support, online mentoring, and tutoring to assist you anytime you need help.",
    },
  ];

  // --- Psychometric Assessments Data ---
  const assessments = [
    {
      id: 1,
      title: "Career Analysis for 11th & 12th Class",
      desc: "Are you a high school student? Looking for a bright future? Take our assessment and know your capacity.",
      bgColor: "bg-blue-50/70 border-blue-100 text-blue-900",
    },
    {
      id: 2,
      title: "Career Analysis for Graduates",
      desc: "A graduate looking for career clarity? Click on 'Start Now' and find your perfect path.",
      bgColor: "bg-orange-50/70 border-orange-100 text-orange-900",
    },
    {
      id: 3,
      title: "Career Analysis for Professionals",
      desc: "Are you already a professional but seeking to explore further in your desired field? Don't delay—take our assessment now.",
      bgColor: "bg-rose-50/60 border-rose-100 text-rose-900",
    },
    {
      id: 4,
      title: "Personality + Interest + EQ Assessment",
      desc: "This assessment helps to discover the passion to find the right career. This tool analyzes your habits, thinking, emotions, creativity, communication, interests, skills, and morals to give you a better understanding of what you're good at and what career path will suit you.",
      bgColor: "bg-emerald-50/60 border-emerald-100 text-emerald-900",
    },
    {
      id: 5,
      title: "Career Analysis for Homemakers and Sabbatical",
      desc: "Are you looking for a fulfilling career as a dedicated homemaker? Find answers to all your queries and personalized career guidance in a single click.",
      bgColor: "bg-slate-100 border-slate-200 text-slate-900",
    },
    {
      id: 6,
      title: "Career Assessment for Graduates",
      desc: "Confused about your career after graduation? Take our expert career assessment to identify the right opportunities aligned with your strengths.",
      bgColor: "bg-orange-50/70 border-orange-100 text-orange-900",
    },
    {
      id: 7,
      title: "Career Assessment for Professionals",
      desc: "Are you a working professional looking for growth? Take our career assessment and discover the best path to level up your career.",
      bgColor: "bg-white border-slate-200 text-slate-900 shadow-sm",
    },
  ];

  // --- Counseling Process Workflow Steps ---
  const workflowSteps = [
    {
      step: "01",
      title: "Take the Test",
      desc: "Answer scientifically validated situational questions customized for your life stage in 25 minutes.",
    },
    {
      step: "02",
      title: "Get In-Depth Report",
      desc: "Receive an immediate, comprehensive breakdown of your core personality, EQ, interests, and matching traits.",
    },
    {
      step: "03",
      title: "1-on-1 Counseling",
      desc: "Connect with certified expert counselors online to translate your results into an actionable career roadmap.",
    },
    {
      step: "04",
      title: "University Alignment",
      desc: "Get paired with top accredited institutions and programs tailored to your budget and lifestyle constraints.",
    },
  ];

  // --- Career Stages Data ---
  const stages = [
    {
      title: "Working Professionals",
      desc: "Be your best self at work. Learn what makes you unique and how well-suited you are to your past, current, and future career choices.",
      img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: "College Students & Graduates",
      desc: "Unsure about what to do after college? See the range of careers you can pursue with your interests, personality, and education.",
      img: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: "Career Changers",
      desc: "Looking to make a career change? Thinking about going back to school? Career Finder will point you in the right direction.",
      img: "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=300&auto=format&fit=crop",
    },
    {
      title: "High School Students",
      desc: "Discover your true potential and all of the options you have after high school. Then see which path is right for you.",
      img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?q=80&w=300&auto=format&fit=crop",
    },
  ];

  // --- FAQs ---
  const faqs = [
    {
      q: "How accurate are these psychometric assessments?",
      a: "Our tests are meticulously structured using internationally recognized framework benchmarks analyzing personality vectors, EQ, and vocational parameters. They provide highly reliable clarity for structural decision-making.",
    },
    {
      q: "Will I get personalized guidance after finishing the test?",
      a: "Yes! Your report generated by the platform links directly with our booking module where you can set up a 1-on-1 discussion session with certified career counselors.",
    },
    {
      q: "Can working professionals shift paths through these metrics?",
      a: "Absolutely. The assessment looks at cross-functional transferable skills, underlying stress variables, and intrinsic workplace motivations to map ideal strategic career transitions.",
    },
    {
      q: "How long does the assessment take to finish?",
      a: "On average, it takes between 20 to 25 minutes. We recommend taking it in a quiet, distraction-free environment for the most genuine situational output.",
    },
  ];

  // --- Observer Logic for Scroll Animations ---
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTrustVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (trustSectionRef.current) observer.observe(trustSectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Header />
      <div className="bg-white min-h-screen font-sans text-slate-800 antialiased selection:bg-blue-100">
        
        {/* =========================================================
            SECTION 1: HERO BANNER DESIGN
            ========================================================= */}
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 font-sans antialiased">
      {/* Main Card Container */}
      <div className="bg-[#dfebf4] rounded-[2rem] p-8 md:p-14 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-2xl border-4 border-[#c15304]">
        
        {/* Left Content Column */}
        <div className="lg:col-span-7 space-y-6 z-10">
          <div>
            <span className="inline-block bg-white text-[#1d4ed8] text-xs font-extrabold tracking-wider uppercase px-5 py-2 rounded-full shadow-sm">
              Take Career Suitability Test
            </span>
          </div>
          
     <h1 className="text-4xl md:text-5xl lg:text-[2.5rem] font-black text-white tracking-tight leading-[1.15]">
  <span className="text-[#0056B3]"> Shape Your Future</span> <br />
   <span className="text-[#0056B3] relative inline-block">
   Career in Just 25 Mins
    <span className="absolute bottom-1 left-0 w-full h-[3px] bg-[#0056B3] rounded-full"></span>
  </span>
</h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-xl font-normal leading-relaxed">
            Make Smart Decisions with our Career Guidance Tools &amp; Expert Career Counselors.
          </p>

          <div className="pt-2">
            <button className=" cursor-pointer   inline-flex items-center gap-2.5 bg-[#c15304] hover:bg-[#c15304] text-white font-bold px-6 py-2 rounded-xl shadow-lg transition-all duration-300 group">
              Get Started 
              <span className="text-lg transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>
          </div>
        </div>

        {/* Right Visual Column */}
        <div className="lg:col-span-5 relative flex justify-center lg:justify-end items-end h-full min-h-[350px] lg:min-h-[420px] z-10 mt-6 lg:mt-0">
          
          {/* Main Rounded Image Container */}
          <div className="w-full max-w-[360px] aspect-[4/5] bg-[#e2e8f0] rounded-3xl overflow-hidden shadow-xl border border-slate-700/30 relative">
            <img 
              src="/images/y4.jpeg" 
              alt="Career Consultation Guidance"
              className="w-full h-full object-cover object-top filter brightness-105"
              onError={(e) => {
                e.target.src = "/images/teti1.png"; // बैकअप फ़ॉर्मेट
              }}
            />
          </div>

          {/* Floating Ratings Stack - Positioned exactly like the image */}
          <div className="absolute left-0 lg:-left-6 top-6 space-y-2.5 max-w-[190px] drop-shadow-xl">
            {[
              { role: "Business Manager", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=100&auto=format&fit=crop" },
              { role: "Product Manager", img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop" },
              { role: "Marketing Expert", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=100&auto=format&fit=crop" },
              { role: "HR Expert", img: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&auto=format&fit=crop" }
            ].map((badge, i) => (
              <div 
                key={i} 
                className="bg-white py-1.5 px-2.5 rounded-lg flex items-center gap-2 border border-slate-100 shadow-sm"
              >
                <img src={badge.img} className="w-6 h-6 rounded-md object-cover" alt="" />
                <div className="min-w-0">
                  <p className="font-extrabold text-slate-800 text-[10px] leading-tight truncate">{badge.role}</p>
                  <div className="flex text-amber-400 text-[8px] mt-0.5 tracking-tighter">
                    ★★★★★
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* 3 Step Introductory Features Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 px-4">
        {[
          { num: "01", label: "Assessment", text: "Reflect upon your past experiences and future goals, and learn what makes you unique." },
          { num: "02", label: "Career Options", text: "Find the path that's right for you based on your strengths, interests, and personality." },
          { num: "03", label: "Library", text: "Explore over 1,000 careers and degrees. Learn who thrives in them and why." }
        ].map((item, index) => (
          <div key={index} className="space-y-2 group">
            <div className="flex items-baseline gap-2">
              <span className="text-slate-400 font-bold text-sm tracking-wide group-hover:text-[#3b82f6] transition-colors">{item.num}</span>
              <h3 className="font-bold text-slate-900 text-base">{item.label}</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>

        {/* =========================================================
            SECTION 2: PSYCHOMETRIC CAREER ASSESSMENTS GRID
            ========================================================= */}
        <section className="bg-slate-50/50 border-y border-slate-100 py-16 font-sans">
          <div className="max-w-7xl mx-auto px-4 space-y-12">
            
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Psychometric Career Assessments
              </h2>
              <button className="inline-flex items-center gap-2 text-xs font-bold text-red-600 hover:text-red-700 transition">
                Watch Now <div className="p-1.5 bg-red-600 text-white rounded-full"><Play className="w-3 h-3 fill-current ml-0.5" /></div>
              </button>
            </div>

            {/* Colored Cards Grid View */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
              {assessments.map((item) => (
                <div 
                  key={item.id} 
                  className={`p-6 rounded-2xl border flex flex-col justify-between min-h-[240px] transition-all hover:shadow-md ${item.bgColor}`}
                >
                  <div className="space-y-4">
                    <div className="w-7 h-7 bg-white/90 text-slate-800 rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
                      {item.id}
                    </div>
                    <h3 className="font-extrabold text-lg tracking-tight leading-snug">
                      {item.title}
                    </h3>
                    <p className="opacity-80 text-xs sm:text-sm leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                  
                  <div className="pt-6">
                    <button className="inline-flex items-center gap-1 text-xs font-bold bg-white text-slate-900 px-4 py-2 rounded-lg shadow-sm border border-slate-100 hover:bg-slate-50 transition">
                      Start Now <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3: WHY STUDENTS TRUST US
            ========================================================= */}
        <section
          ref={trustSectionRef}
          className={`py-14 bg-[#f4f4f4] font-sans transition-all duration-1000 ease-out select-none border-b border-slate-200/60
          ${trustVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <h2
              className={`text-2xl md:text-4xl font-semibold text-center mb-12 text-gray-900
              transition-all duration-1000 delay-200
              ${trustVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <span className="text-[#0056B3] font-bold">Why Students Trust Us</span> 
            </h2> 

            <div className="grid gap-6 md:grid-cols-3">
              {trustFeatures.map((item, index) => (
                <div
                  key={index}
                  style={{ transitionDelay: `${index * 120}ms` }}
                  className={`group relative bg-white border border-transparent rounded-xl p-6
                  shadow-sm transition-all duration-700 ease-out
                  hover:border-[#0056B3]
                  hover:bg-gradient-to-br hover:from-[#FFF5EE] hover:to-[#E6F0FF]
                  hover:shadow-[0_4px_12px_rgba(0,86,179,0.15)]
                  ${trustVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                >
                  <div className="flex justify-start mb-3">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={40}
                      height={40}
                      draggable={false}
                      className="object-contain pointer-events-none"
                    />
                  </div>

                  <h3 className="text-lg font-semibold mb-2 text-[#0056B3]">
                    {item.title}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 3.5: HOW THE COUNSELING PROCESS WORKS
            ========================================================= */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50/70 border-b border-slate-100 font-sans">
          <div className="max-w-7xl mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="text-xs font-bold text-blue-600 tracking-wider uppercase bg-blue-50 px-3 py-1 rounded-md">
                Your Roadmap
              </span>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                How Our Professional Process Works
              </h2>
              <p className="text-sm text-slate-500">
                Four streamlined structural steps to navigate from uncertainty to your targeted future roadmap.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {workflowSteps.map((w, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4 hover:shadow-md transition relative group">
                  <div className="absolute -top-5 right-6 text-5xl font-black text-slate-100 group-hover:text-blue-50/70 transition select-none">
                    {w.step}
                  </div>
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-lg pt-2">{w.title}</h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">{w.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            SECTION 4: FOR EVERY CAREER STAGE SECTION
            ========================================================= */}
        <section className="max-w-7xl mx-auto px-4 py-16 space-y-12 font-sans">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              For every career stage
            </h2>
          </div>

          {/* 2x2 Clean Row Split View */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stages.map((stage, idx) => (
              <div 
                key={idx} 
                className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row gap-5 items-start sm:items-center shadow-sm hover:border-slate-200 transition-all"
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 shadow-inner">
                  <img src={stage.img} className="w-full h-full object-cover" alt={stage.title} />
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-lg">
                    {stage.title}
                  </h3>
                  <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                    {stage.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* =========================================================
            SECTION 5: FREQUENTLY ASKED QUESTIONS (FAQ)
            ========================================================= */}
        <section className="bg-slate-50 border-t border-slate-200/50 py-20 font-sans">
          <div className="max-w-4xl mx-auto px-4 space-y-12">
            <div className="text-center space-y-2">
              <div className="inline-flex p-2 bg-white rounded-xl shadow-sm border border-slate-100 mb-2">
                <HelpCircle className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Got Questions? We Have Answers
              </h2>
              <p className="text-sm text-slate-500">
                Everything you need to know about our counseling frameworks and automated assessment features.
              </p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div 
                    key={index} 
                    className="bg-white border border-slate-200/60 rounded-xl overflow-hidden transition-all shadow-sm"
                  >
                    <button
                      onClick={() => toggleFaq(index)}
                      className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 font-bold text-slate-800 hover:text-blue-600 transition"
                    >
                      <span className="text-sm sm:text-base">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-600" : ""}`} />
                    </button>
                    
                    <div 
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-40 border-t border-slate-100" : "max-h-0"}`}
                    >
                      <p className="px-6 py-4 text-xs sm:text-sm text-slate-500 leading-relaxed bg-slate-50/50">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </>
  );
}